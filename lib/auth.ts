import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import fs   from 'fs'
import path from 'path'

const DATA_DIR  = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), 'data')
const AUTH_FILE = path.join(DATA_DIR, 'auth.json')
const COOKIE_NAME = 'auth_token'

interface AuthStore { username: string; passwordHash: string }

// ── JWT secret ─────────────────────────────────────────────────
function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET ?? ''

  // ── FIX #2: Never silently fall back to a predictable secret ──
  // In production, crash loudly rather than let attackers forge tokens.
  if (process.env.NODE_ENV === 'production' && s.length < 32) {
    throw new Error(
      'FATAL: JWT_SECRET env var is not set or is too short (min 32 chars). ' +
      'Set it in cPanel → Node.js App → Environment Variables.'
    )
  }

  // In development, warn but continue with a padded secret
  if (s.length < 32) {
    console.warn('[auth] WARNING: JWT_SECRET is short. Fine for dev, not for production.')
    return new TextEncoder().encode(s.padEnd(32, '__dev_pad__'))
  }

  return new TextEncoder().encode(s)
}

// ── Credential file helpers ────────────────────────────────────

export function hasCredentials(): boolean {
  try {
    if (!fs.existsSync(AUTH_FILE)) return false
    const d = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8')) as Partial<AuthStore>
    return !!(d.username && d.passwordHash)
  } catch { return false }
}

function readAuth(): AuthStore | null {
  try {
    if (!fs.existsSync(AUTH_FILE)) return null
    return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8')) as AuthStore
  } catch { return null }
}

export function saveCredentials(username: string, plainPassword: string): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  const hash = bcrypt.hashSync(plainPassword, 12)
  const tmp  = AUTH_FILE + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify({ username, passwordHash: hash }, null, 2), 'utf-8')
  fs.renameSync(tmp, AUTH_FILE)
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const auth = readAuth()
  if (!auth) return false
  if (username !== auth.username) return false
  return bcrypt.compareSync(password, auth.passwordHash)
}

// ── JWT helpers ────────────────────────────────────────────────

export async function createToken(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return { username: payload.username as string }
  } catch { return null }
}

export function setAuthCookie(token: string): void {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',   // upgraded from 'lax' — prevents CSRF via cross-site navigation
    maxAge:   60 * 60 * 24 * 7,
    path:     '/',
  })
}

export function clearAuthCookie(): void {
  cookies().set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
}

export async function getAuthFromCookies(): Promise<{ username: string } | null> {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}



// import { SignJWT, jwtVerify } from 'jose'
// import { cookies } from 'next/headers'
// import bcrypt from 'bcryptjs'
// import fs   from 'fs'
// import path from 'path'

// const DATA_DIR  = process.env.DATA_DIR
//   ? path.resolve(process.env.DATA_DIR)
//   : path.join(process.cwd(), 'data')
// const AUTH_FILE = path.join(DATA_DIR, 'auth.json')
// const COOKIE_NAME = 'auth_token'

// interface AuthStore { username: string; passwordHash: string }

// // ── JWT secret ─────────────────────────────────────────────────
// function getSecret(): Uint8Array {
//   const s = process.env.JWT_SECRET ?? ''

//   // ── FIX #2: Never silently fall back to a predictable secret ──
//   // In production, crash loudly rather than let attackers forge tokens.
//   if (process.env.NODE_ENV === 'production' && s.length < 32) {
//     throw new Error(
//       'FATAL: JWT_SECRET env var is not set or is too short (min 32 chars). ' +
//       'Set it in cPanel → Node.js App → Environment Variables.'
//     )
//   }

//   // In development, warn but continue with a padded secret
//   if (s.length < 32) {
//     console.warn('[auth] WARNING: JWT_SECRET is short. Fine for dev, not for production.')
//     return new TextEncoder().encode(s.padEnd(32, '__dev_pad__'))
//   }

//   return new TextEncoder().encode(s)
// }

// // ── Credential file helpers ────────────────────────────────────

// export function hasCredentials(): boolean {
//   try {
//     if (!fs.existsSync(AUTH_FILE)) return false
//     const d = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8')) as Partial<AuthStore>
//     return !!(d.username && d.passwordHash)
//   } catch { return false }
// }

// function readAuth(): AuthStore | null {
//   try {
//     if (!fs.existsSync(AUTH_FILE)) return null
//     return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8')) as AuthStore
//   } catch { return null }
// }

// export function saveCredentials(username: string, plainPassword: string): void {
//   if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
//   const hash = bcrypt.hashSync(plainPassword, 12)
//   const tmp  = AUTH_FILE + '.tmp'
//   fs.writeFileSync(tmp, JSON.stringify({ username, passwordHash: hash }, null, 2), 'utf-8')
//   fs.renameSync(tmp, AUTH_FILE)
// }

// export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
//   const auth = readAuth()
//   if (!auth) return false
//   if (username !== auth.username) return false
//   return bcrypt.compareSync(password, auth.passwordHash)
// }

// // ── JWT helpers ────────────────────────────────────────────────

// export async function createToken(username: string): Promise<string> {
//   return new SignJWT({ username })
//     .setProtectedHeader({ alg: 'HS256' })
//     .setIssuedAt()
//     .setExpirationTime('7d')
//     .sign(getSecret())
// }

// export async function verifyToken(token: string): Promise<{ username: string } | null> {
//   try {
//     const { payload } = await jwtVerify(token, getSecret())
//     return { username: payload.username as string }
//   } catch { return null }
// }

// export function setAuthCookie(token: string): void {
//   cookies().set(COOKIE_NAME, token, {
//     httpOnly: true,
//     secure:   process.env.NODE_ENV === 'production',
//     sameSite: 'strict',   // upgraded from 'lax' — prevents CSRF via cross-site navigation
//     maxAge:   60 * 60 * 24 * 7,
//     path:     '/',
//   })
// }

// export function clearAuthCookie(): void {
//   cookies().set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
// }

// export async function getAuthFromCookies(): Promise<{ username: string } | null> {
//   const token = cookies().get(COOKIE_NAME)?.value
//   if (!token) return null
//   return verifyToken(token)
// }
