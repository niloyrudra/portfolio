import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { insertContact } from '@/lib/db'
import { sanitizeHeader, escapeHtml, enforceLength } from '@/lib/security'

export const runtime = 'nodejs'

// ── Rate limit (in-memory, per IP) ────────────────────────────
const lastSubmit = new Map<string, number>()
function getIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

// ── Transport factory ──────────────────────────────────────────
//
// Strategy:
//   1. Sendmail  — uses cPanel's local mail agent, no SMTP port/auth/TLS needed.
//                  Most reliable option on A2Hosting shared hosting.
//   2. SMTP      — fallback if sendmail isn't available or fails.
//                  Set USE_SENDMAIL=false in env vars to force SMTP only.

function makeSendmailTransport() {
  // cPanel typically has sendmail at /usr/sbin/sendmail
  // Override with SENDMAIL_PATH env var if yours is elsewhere
  const sendmailPath = process.env.SENDMAIL_PATH || '/usr/sbin/sendmail'
  return nodemailer.createTransport({
    sendmail: true,
    newline:  'unix',
    path:     sendmailPath,
  })
}

function makeSmtpTransport() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST ?? '127.0.0.1',
    port:   parseInt(process.env.SMTP_PORT ?? '465', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth:   process.env.SMTP_USER && process.env.SMTP_PASS
              ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
              : undefined,
    tls:    { rejectUnauthorized: false },
    connectionTimeout: 15_000,
    greetingTimeout:   10_000,
    socketTimeout:     20_000,
  })
}

// function makeTransporter() {
//   return nodemailer.createTransport({
//     host:   process.env.SMTP_HOST ?? '127.0.0.1',
//     port:   parseInt(process.env.SMTP_PORT ?? '465', 10),
//     secure: process.env.SMTP_SECURE === 'true',
//     auth:   process.env.SMTP_USER && process.env.SMTP_PASS
//               ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
//               : undefined,
//     tls:    { rejectUnauthorized: false },
//     connectionTimeout: 15_000,
//     greetingTimeout:   10_000,
//     socketTimeout:     20_000,
//   })
// }

// ── Main handler ───────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // Body size guard
    const contentLength = req.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > 20_000) {
      return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
    }

    const body = await req.json()
    // const { honeypot } = body

    // Honeypot — silent drop for bots
    // if (honeypot) return NextResponse.json({ ok: true })

    // Honeypot — silently drop bot submissions
    if (body.honeypot) return NextResponse.json({ ok: true })

    // Extract raw values
    const raw = {
      name:    String(body.name    ?? '').trim(),
      email:   String(body.email   ?? '').trim().toLowerCase(),
      subject: String(body.subject ?? '').trim(),
      message: String(body.message ?? '').trim(),
    }

    // Length limits
    const lengthError = enforceLength(raw)
    if (lengthError) {
      return NextResponse.json({ error: lengthError }, { status: 400 })
    }

    // Basic required field validation
    if (!raw.name || !raw.email || !raw.message) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // Sanitize header fields (strip \r \n \0) to prevent header injection
    // These characters can be injected into email headers to send spam
    const safe = {
      name:    sanitizeHeader(raw.name),
      email:   sanitizeHeader(raw.email),
      subject: sanitizeHeader(raw.subject),
      message: raw.message, // message goes in the body, not a header — no need to strip newlines
    }

    // Rate limit per IP
    const ip   = getIp(req)
    const last = lastSubmit.get(ip) ?? 0
    if (Date.now() - last < 60_000) {
      return NextResponse.json({ error: 'Please wait a minute before sending again.' }, { status: 429 })
    }
    lastSubmit.set(ip, Date.now())

    // ── Always save to DB first — message never lost if email fails ─
    insertContact(safe.name, safe.email, safe.subject, safe.message)

    // ── Build email ───────────────────────────────────────────────
    const toAddress   = process.env.CONTACT_TO  ?? 'contact@niloyrudra.com'
    const fromAddress = process.env.SMTP_USER   ?? `contact@niloyrudra.com`

    const htmlName    = escapeHtml(safe.name)
    const htmlEmail   = escapeHtml(safe.email)
    const htmlSubject = escapeHtml(safe.subject)
    const htmlMessage = escapeHtml(safe.message).replace(/\n/g, '<br>')

    const mailOptions = {
      from:    `"Portfolio Contact" <${fromAddress}>`,
      to:      toAddress,
      replyTo: safe.email,
      subject: `[Portfolio] ${safe.subject || 'New message'} — ${safe.name}`,
      text:    `Name: ${safe.name}\nEmail: ${safe.email}\nSubject: ${safe.subject}\n\n${safe.message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#f59e0b;border-bottom:2px solid #f59e0b;padding-bottom:8px">
            New Contact Form Submission
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr>
              <td style="padding:8px 0;color:#666;width:80px"><strong>Name</strong></td>
              <td>${htmlName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666"><strong>Email</strong></td>
              <td><a href="mailto:${htmlEmail}">${htmlEmail}</a></td>
            </tr>
            ${safe.subject
              ? `<tr>
                   <td style="padding:8px 0;color:#666"><strong>Subject</strong></td>
                   <td>${htmlSubject}</td>
                 </tr>`
              : ''}
          </table>
          <div style="background:#f9f9f9;padding:16px;border-left:4px solid #f59e0b;border-radius:4px">
            <p style="margin:0;line-height:1.7">${htmlMessage}</p>
          </div>
          <p style="color:#999;font-size:12px;margin-top:20px">
            Sent from niloyrudra.com contact form
          </p>
        </div>`,
    }

    // ── Try sendmail first, SMTP as fallback ───────────────────────
    const useSendmail = process.env.USE_SENDMAIL !== 'false' // default: true

    if (useSendmail) {
      try {
        const transport = makeSendmailTransport()
        await transport.sendMail(mailOptions)
        console.log('[contact] Email sent via sendmail ✓')
        return NextResponse.json({ ok: true, message: 'Message sent successfully!' })
      } catch (sendmailErr) {
        // Sendmail failed — log it and try SMTP
        console.warn('[contact] Sendmail failed, trying SMTP:', sendmailErr)
      }
    }

    // SMTP fallback (or primary if USE_SENDMAIL=false)
    try {
      const transport = makeSmtpTransport()
      await transport.verify()
      await transport.sendMail(mailOptions)
      console.log('[contact] Email sent via SMTP ✓')
      return NextResponse.json({ ok: true, message: 'Message sent successfully!' })
    } catch (smtpErr) {
      // Both methods failed — message is safe in DB, user gets success
      console.error('[contact] SMTP also failed:', smtpErr)
      return NextResponse.json({
        ok: true,
        message: "Message received! I'll get back to you soon.",
      })
    }

    // ── Try to send email ──────────────────────────────────────────
    // const from = process.env.SMTP_USER ?? 'noreply@niloyrudra.com'
    // const to   = process.env.CONTACT_TO ?? from

    // try {
    //   const t = makeTransporter()
    //   await t.verify()

    //   // ── FIX #5: Escape ALL user input used in the HTML email body ─
    //   const htmlName    = escapeHtml(safe.name)
    //   const htmlEmail   = escapeHtml(safe.email)
    //   const htmlSubject = escapeHtml(safe.subject)
    //   const htmlMessage = escapeHtml(safe.message).replace(/\n/g, '<br>')

    //   await t.sendMail({
    //     from:    `"Portfolio Contact" <${from}>`,
    //     to,
    //     replyTo: safe.email,
    //     // ── FIX #4: subject is sanitized above — no \r\n possible ──
    //     subject: `[Portfolio] ${safe.subject || 'New message'} — ${safe.name}`,
    //     // Plain-text body is inherently safe
    //     text:    `Name: ${safe.name}\nEmail: ${safe.email}\nSubject: ${safe.subject}\n\n${safe.message}`,
    //     html: `
    //       <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
    //         <h2 style="color:#f59e0b;border-bottom:2px solid #f59e0b;padding-bottom:8px">
    //           New Contact Form Submission
    //         </h2>
    //         <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
    //           <tr>
    //             <td style="padding:8px 0;color:#666;width:80px"><strong>Name</strong></td>
    //             <td>${htmlName}</td>
    //           </tr>
    //           <tr>
    //             <td style="padding:8px 0;color:#666"><strong>Email</strong></td>
    //             <td><a href="mailto:${htmlEmail}">${htmlEmail}</a></td>
    //           </tr>
    //           ${safe.subject
    //             ? `<tr>
    //                  <td style="padding:8px 0;color:#666"><strong>Subject</strong></td>
    //                  <td>${htmlSubject}</td>
    //                </tr>`
    //             : ''}
    //         </table>
    //         <div style="background:#f9f9f9;padding:16px;border-left:4px solid #f59e0b;border-radius:4px">
    //           <p style="margin:0;line-height:1.7">${htmlMessage}</p>
    //         </div>
    //         <p style="color:#999;font-size:12px;margin-top:20px">
    //           Sent from niloyrudra.com contact form
    //         </p>
    //       </div>`,
    //   })
    // } catch (mailErr) {
    //   console.error('[contact] Email send failed:', mailErr)
    //   // Message is already saved in DB — user still gets a success response
    //   return NextResponse.json({ ok: true, message: "Message received! I'll get back to you soon." })
    // }

    // return NextResponse.json({ ok: true, message: 'Message sent successfully!' })

  } catch (err) {
    console.error('[contact] Error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please email me directly.' },
      { status: 500 }
    )
  }
}
