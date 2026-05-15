'use client'
import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

type Phase = 'checking' | 'ready' | 'done' | 'already-configured'

export default function SetupPage() {
  const router = useRouter()
  const [phase,    setPhase]    = useState<Phase>('checking')
  const [form,     setForm]     = useState({ username: 'admin', password: '', confirmPassword: '' })
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [diagMsg, setDiagMsg]   = useState('')

  // Check if already configured
  useEffect(() => {
    // ── AbortController gives us a hard 6-second timeout ──────────
    // Without this, a compilation error in the API route causes the
    // fetch to hang forever — leaving the page stuck on "Checking…"
    const controller = new AbortController()
    const timeout    = setTimeout(() => controller.abort(), 6000)

    fetch('/api/auth/setup', { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`API returned HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        clearTimeout(timeout)
        setPhase(data.configured ? 'already-configured' : 'ready')
      })
      .catch(err => {
        clearTimeout(timeout)
        const msg = err?.name === 'AbortError'
          ? 'API route timed out. This usually means a file is missing or has a compile error — see the checklist below.'
          : `API error: ${err?.message ?? String(err)}`
        setDiagMsg(msg)
        // Fall through to the form anyway — let the user try
        setPhase('ready')
      })
  }, [])

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(v => ({ ...v, [f]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/auth/setup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPhase('done')
      setTimeout(() => router.push('/admin/login'), 2500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Setup failed — check the browser console for details.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = `w-full bg-[#08080e] border border-[#2a2a3d] rounded-lg px-4 py-3
    font-mono text-sm text-[#e8e8f0] placeholder-[#5a5a72]
    focus:outline-none focus:border-[#f59e0b] transition-colors`

  // ── Checking ──────────────────────────────────────────────────
  if (phase === 'checking') {
    return (
      <Shell>
        <div className="text-center space-y-3">
          <div className="font-mono text-sm text-[#9898b0]">Checking setup status…</div>
          <div className="font-mono text-xs text-[#5a5a72]">
            (if this takes more than 6 seconds, the page will continue automatically)
          </div>
        </div>
      </Shell>
    )
  }

  // ── Already configured ────────────────────────────────────────
  if (phase === 'already-configured') {
    return (
      <Shell>
        <div className="text-center space-y-4">
          <div className="text-4xl">🔒</div>
          <h1 className="font-mono font-bold text-[#e8e8f0] text-xl">Already configured</h1>
          <p className="font-mono text-sm text-[#9898b0] leading-7">
            Admin credentials are already set up.<br/>
            Go to the login page and use the username and password you created.
          </p>
          <a href="/admin/login"
             className="inline-block mt-4 bg-[#f59e0b] text-black font-mono text-sm font-bold
                        px-6 py-3 rounded-lg hover:bg-[#fbbf24] transition-colors tracking-wider">
            Go to Login →
          </a>
          <p className="font-mono text-xs text-[#5a5a72] mt-4">
            Forgot your password? Delete <code className="text-[#f59e0b]">data/auth.json</code> on the server
            via cPanel File Manager, then refresh this page.
          </p>
        </div>
      </Shell>
    )
  }

  // ── Done ──────────────────────────────────────────────────────
  if (phase === 'done') {
    return (
      <Shell>
        <div className="text-center space-y-4">
          <div className="text-5xl">✅</div>
          <h1 className="font-mono font-bold text-[#e8e8f0] text-xl">Setup complete!</h1>
          <p className="font-mono text-sm text-[#9898b0]">
            Redirecting you to the login page…
          </p>
        </div>
      </Shell>
    )
  }

  // ── Setup form ────────────────────────────────────────────────
  return (
    <Shell>
      <div className="mb-8 text-center">
        <div className="font-mono font-extrabold text-4xl text-[#f59e0b] tracking-tight mb-2">NR</div>
        <h1 className="font-mono font-bold text-[#e8e8f0] text-xl mb-1">First-time Setup</h1>
        <p className="font-mono text-xs text-[#9898b0] leading-6">
          Create your admin login credentials.<br/>
          This page will be locked after you save.
        </p>
      </div>

      {/* Diagnostic message — only shows when the API check failed */}
      {diagMsg && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 mb-5">
          <div className="font-mono text-xs text-yellow-400 font-bold mb-1">⚠ API check failed</div>
          <div className="font-mono text-xs text-yellow-300/80 leading-6">{diagMsg}</div>
          <div className="font-mono text-xs text-[#9898b0] mt-3 leading-6">
            Required files — make sure ALL of these are the latest version on your server:
            <ul className="mt-1 space-y-0.5 text-yellow-300/70">
              <li>• <code>lib/auth.ts</code> — must export hasCredentials &amp; saveCredentials</li>
              <li>• <code>lib/security.ts</code> — must exist (new file)</li>
              <li>• <code>app/api/auth/setup/route.ts</code></li>
              <li>• <code>app/api/auth/login/route.ts</code></li>
            </ul>
          </div>
        </div>
      )}

      <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg px-5 py-3 mb-6">
        <p className="font-mono text-xs text-[#f59e0b] leading-6">
          ⚠️  These credentials are saved to <code>data/auth.json</code> on your server.<br/>
          To reset your password later: delete that file and revisit this page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="font-mono text-xs text-[#9898b0] uppercase tracking-widest block mb-2">
            Admin Username
          </label>
          <input
            type="text" required autoComplete="username"
            value={form.username} onChange={set('username')}
            placeholder="admin" className={inputCls}
          />
        </div>

        <div>
          <label className="font-mono text-xs text-[#9898b0] uppercase tracking-widest block mb-2">
            Password <span className="text-[#5a5a72] normal-case">(min 8 characters)</span>
          </label>
          <input
            type="password" required minLength={8} autoComplete="new-password"
            value={form.password} onChange={set('password')}
            placeholder="Choose a strong password" className={inputCls}
          />
        </div>

        <div>
          <label className="font-mono text-xs text-[#9898b0] uppercase tracking-widest block mb-2">
            Confirm Password
          </label>
          <input
            type="password" required autoComplete="new-password"
            value={form.confirmPassword} onChange={set('confirmPassword')}
            placeholder="Repeat your password" className={inputCls}
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400
                          font-mono text-xs px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full bg-[#f59e0b] text-black font-mono text-sm font-bold
                     py-3.5 rounded-lg hover:bg-[#fbbf24] transition-colors
                     disabled:opacity-60 disabled:cursor-not-allowed tracking-wider">
          {loading ? 'Saving credentials…' : 'Save & Go to Login →'}
        </button>
      </form>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08080e] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1a1a27] border border-[#2a2a3d] rounded-2xl p-8">
        {children}
      </div>
    </div>
  )
}
