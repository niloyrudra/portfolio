import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCredentials, createToken, setAuthCookie, hasCredentials } from '@/lib/auth'
import { checkLoginAllowed, recordFailedLogin, clearFailedLogins } from '@/lib/security'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    if (!hasCredentials()) {
      return NextResponse.json(
        { error: 'Admin not configured yet.', redirect: '/admin/setup' },
        { status: 403 }
      )
    }

    const { username, password } = await req.json()
    if (!username?.trim() || !password) {
      return NextResponse.json({ error: 'Username and password required.' }, { status: 400 })
    }

    // ── FIX #3: Brute-force lockout ───────────────────────────────
    const lockout = checkLoginAllowed(username.trim())
    if (lockout) {
      return NextResponse.json({ error: lockout }, { status: 429 })
    }

    const valid = await verifyAdminCredentials(username.trim(), password)

    if (!valid) {
      recordFailedLogin(username.trim())   // increment failure counter
      // Use the same generic message regardless of whether username or
      // password was wrong — don't leak which field failed
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
    }

    clearFailedLogins(username.trim())     // reset counter on success
    const token = await createToken(username.trim())
    setAuthCookie(token)
    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('[login]', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
