import { NextRequest, NextResponse } from 'next/server'
import { hasCredentials, saveCredentials } from '@/lib/auth'

export const runtime = 'nodejs'

/** GET — tells the setup page whether credentials are already configured */
export async function GET() {
  return NextResponse.json({ configured: hasCredentials() })
}

/** POST — saves username + password (only works when NOT already configured) */
export async function POST(req: NextRequest) {
  try {
    // Block if already set up — forces reset via deleting data/auth.json
    if (hasCredentials()) {
      return NextResponse.json(
        { error: 'Admin credentials are already configured. To reset, delete data/auth.json on the server.' },
        { status: 403 }
      )
    }

    const { username, password, confirmPassword } = await req.json()

    if (!username?.trim()) {
      return NextResponse.json({ error: 'Username is required.' }, { status: 400 })
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 })
    }

    saveCredentials(username.trim(), password)
    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('[setup] Error:', err)
    return NextResponse.json({ error: 'Server error during setup.' }, { status: 500 })
  }
}
