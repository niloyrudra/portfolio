import { NextRequest, NextResponse } from 'next/server'
import { getSection, setSection } from '@/lib/db'
import { getAuthFromCookies } from '@/lib/auth'
import { checkOrigin } from '@/lib/security'

export const runtime = 'nodejs'

const ALLOWED_SECTIONS = [
  'hero', 'about', 'skills', 'experience',
  'langphy', 'projects', 'certs', 'testimonials', 'contact',
]

export async function GET(
  _req: NextRequest,
  { params }: { params: { section: string } }
) {
  const { section } = params
  if (!ALLOWED_SECTIONS.includes(section)) {
    return NextResponse.json({ error: 'Unknown section' }, { status: 404 })
  }
  const data = getSection(section)
  if (data === null) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { section: string } }
) {
  // ── FIX #8: CSRF origin check ─────────────────────────────────
  // Ensures PUT requests come from the same origin, not a malicious
  // third-party page that tricks you into updating your own content.
  if (!checkOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden: cross-origin request rejected.' }, { status: 403 })
  }

  // ── Auth check ────────────────────────────────────────────────
  const auth = await getAuthFromCookies()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { section } = params
  if (!ALLOWED_SECTIONS.includes(section)) {
    return NextResponse.json({ error: 'Unknown section' }, { status: 404 })
  }

  try {
    const body = await req.json()
    setSection(section, body)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[content] Update error:', err)
    return NextResponse.json({ error: 'Invalid JSON or server error' }, { status: 400 })
  }
}
