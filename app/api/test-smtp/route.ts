/**
 * GET /api/test-smtp
 *
 * Diagnostic endpoint — tests your SMTP connection and reports
 * the exact error so you can fix the env vars.
 *
 * ⚠️  REMOVE THIS FILE after fixing the contact form.
 *    It exposes your SMTP configuration (not credentials, but settings).
 */
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

export async function GET() {
  const config = {
    host:   process.env.SMTP_HOST   ?? '(not set)',
    port:   process.env.SMTP_PORT   ?? '(not set)',
    secure: process.env.SMTP_SECURE ?? '(not set)',
    user:   process.env.SMTP_USER   ?? '(not set)',
    pass:   process.env.SMTP_PASS   ? '(set, hidden)' : '(NOT SET ⚠️)',
    to:     process.env.CONTACT_TO  ?? '(not set)',
  }

  // Test 1 — try exact env config
  const results: Record<string, unknown> = { configUsed: config, tests: [] }
  const tests = results.tests as unknown[]

  const attempts = [
    // What the user configured
    {
      label: 'ENV config (your settings)',
      options: {
        host:   process.env.SMTP_HOST ?? 'localhost',
        port:   parseInt(process.env.SMTP_PORT ?? '465', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth:   process.env.SMTP_USER && process.env.SMTP_PASS
                  ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
                  : undefined,
        tls:  { rejectUnauthorized: false },
        connectionTimeout: 8000,
        socketTimeout: 8000,
      },
    },
    // Port 587 STARTTLS fallback
    {
      label: 'Port 587 STARTTLS (fallback)',
      options: {
        host:   process.env.SMTP_HOST ?? 'localhost',
        port:   587,
        secure: false,
        auth:   process.env.SMTP_USER && process.env.SMTP_PASS
                  ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
                  : undefined,
        tls:  { rejectUnauthorized: false },
        connectionTimeout: 8000,
        socketTimeout: 8000,
      },
    },
    // localhost port 25 (no auth — same-server mail)
    {
      label: 'localhost:25 (no-auth, same-server sendmail)',
      options: {
        host: 'localhost',
        port: 25,
        secure: false,
        tls:  { rejectUnauthorized: false },
        connectionTimeout: 5000,
        socketTimeout: 5000,
      },
    },
  ]

  for (const attempt of attempts) {
    try {
      const t = nodemailer.createTransport(attempt.options as Parameters<typeof nodemailer.createTransport>[0])
      await t.verify()
      tests.push({ label: attempt.label, status: '✅ CONNECTED', error: null })
    } catch (e: unknown) {
      tests.push({
        label: attempt.label,
        status: '❌ FAILED',
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }

  const passing = (tests as Array<{ label: string; status: string; error: string | null }>).find(t => t.status.startsWith('✅'))

  return NextResponse.json({
    summary: passing
      ? `✅ Use: ${passing.label}`
      : '❌ All attempts failed — check SMTP credentials in env vars',
    ...results,
  }, { status: 200 })
}
