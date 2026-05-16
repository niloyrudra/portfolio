import { NextRequest } from 'next/server'
import fs   from 'fs'
import path from 'path'

// ── 1. Input sanitization ──────────────────────────────────────

/** Strip characters that enable email header injection (\r \n \0) */
export function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n\0]/g, '').trim()
}

/** Escape HTML special characters to prevent XSS in HTML email bodies */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// ── 2. Input length limits ─────────────────────────────────────

export const LIMITS = {
  name:    100,
  email:   254,   // RFC 5321 max
  subject: 200,
  message: 5_000, // ~1 page of text
}

export function enforceLength(
  fields: Record<string, string>
): string | null {
  for (const [key, val] of Object.entries(fields)) {
    const limit = LIMITS[key as keyof typeof LIMITS]
    if (limit && val.length > limit) {
      return `${key.charAt(0).toUpperCase() + key.slice(1)} must be under ${limit} characters.`
    }
  }
  return null
}

// ── 3. Brute-force lockout (file-backed, survives restarts) ────
//
// Stores failed login attempts in data/failed-logins.json.
// Locks out after MAX_FAILURES attempts for LOCKOUT_MS milliseconds.

const DATA_DIR    = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), 'data')
const FAILS_FILE  = path.join(DATA_DIR, 'failed-logins.json')
const MAX_FAILURES = 5
const LOCKOUT_MS   = 15 * 60 * 1000  // 15 minutes

interface FailEntry { count: number; lockedUntil: number | null; lastAttempt: number }
type FailStore = Record<string, FailEntry>

function readFails(): FailStore {
  try {
    if (!fs.existsSync(FAILS_FILE)) return {}
    return JSON.parse(fs.readFileSync(FAILS_FILE, 'utf-8')) as FailStore
  } catch { return {} }
}

function writeFails(store: FailStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
    const tmp = FAILS_FILE + '.tmp'
    fs.writeFileSync(tmp, JSON.stringify(store, null, 2), 'utf-8')
    fs.renameSync(tmp, FAILS_FILE)
  } catch { /* non-fatal */ }
}

/** Returns null if allowed, or a message string if locked out */
export function checkLoginAllowed(username: string): string | null {
  const store = readFails()
  const entry = store[username]
  if (!entry) return null
  if (entry.lockedUntil && Date.now() < entry.lockedUntil) {
    const mins = Math.ceil((entry.lockedUntil - Date.now()) / 60_000)
    return `Too many failed attempts. Try again in ${mins} minute${mins !== 1 ? 's' : ''}.`
  }
  return null
}

export function recordFailedLogin(username: string): void {
  const store = readFails()
  const entry = store[username] ?? { count: 0, lockedUntil: null, lastAttempt: 0 }

  // Reset counter if last attempt was more than LOCKOUT_MS ago
  if (Date.now() - entry.lastAttempt > LOCKOUT_MS) entry.count = 0

  entry.count++
  entry.lastAttempt = Date.now()
  entry.lockedUntil = entry.count >= MAX_FAILURES ? Date.now() + LOCKOUT_MS : null

  store[username] = entry
  writeFails(store)
}

export function clearFailedLogins(username: string): void {
  const store = readFails()
  delete store[username]
  writeFails(store)
}

// ── 4. CSRF origin check for mutating API routes ───────────────
//
// For PUT/POST requests from the admin panel, the Origin header must
// match the site's own origin. Browsers always send Origin on cross-site
// requests, so this blocks forged cross-origin requests.

// export function checkOrigin(req: NextRequest): boolean {
//   const origin  = req.headers.get('origin')
//   const referer = req.headers.get('referer')

//   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
//   // Allow requests with no origin (e.g. server-side / Postman in dev)
//   if (!origin && !referer) return true

//   const source = origin ?? referer ?? ''
//   // In dev allow localhost from any port
//   if (process.env.NODE_ENV !== 'production') {
//     if (source.startsWith('http://localhost') || source.startsWith('http://127.0.0.1') || source.startsWith('http://Niloy'))  return true
//   }
//   // In production, origin must match the configured site URL
//   if (siteUrl && source.startsWith(siteUrl)) return true
//   return false
// }

// ── 4. CSRF origin check ───────────────────────────────────────
//
// In DEVELOPMENT: always passes — you may use any hostname (localhost,
//   127.0.0.1, custom names like "niloy") without CSRF interference.
//
// In PRODUCTION: Origin/Referer must start with NEXT_PUBLIC_SITE_URL.
//   This blocks forged cross-origin PUT requests to /api/content/*.

export function checkOrigin(req: NextRequest): boolean {
  // ── Dev: skip entirely — CSRF only matters in production ──────
  if (process.env.NODE_ENV !== 'production') return true

  const origin  = req.headers.get('origin')
  const referer = req.headers.get('referer')

  // No origin header (e.g. Postman, server-to-server) — allow
  if (!origin && !referer) return true

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const source  = origin ?? referer ?? ''

  if (!siteUrl) {
    // NEXT_PUBLIC_SITE_URL not configured — log a warning and allow
    // (better than silently breaking the admin panel in production)
    console.warn('[security] NEXT_PUBLIC_SITE_URL is not set — CSRF check skipped. Set it in env vars.')
    return true
  }

  return source.startsWith(siteUrl)
}