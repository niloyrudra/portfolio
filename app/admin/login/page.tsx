'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [creds, setCreds] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Login failed')
      }
      router.push('/admin')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = `w-full bg-[#1a1a27] border border-[#2a2a3d] rounded-lg px-4 py-3
    font-mono text-sm text-[#e8e8f0] placeholder-[#5a5a72]
    focus:outline-none focus:border-[#f59e0b] transition-colors`

  return (
    <div className="min-h-screen bg-[#08080e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="font-mono font-extrabold text-4xl text-[#f59e0b] tracking-tight mb-2">NR</div>
          <div className="font-mono text-xs text-[#5a5a72] tracking-widest uppercase">Admin Panel</div>
        </div>

        <form onSubmit={handleSubmit}
              className="bg-[#1a1a27] border border-[#2a2a3d] rounded-2xl p-8 space-y-5">
          <div>
            <label className="font-mono text-xs text-[#9898b0] uppercase tracking-widest block mb-2">
              Username
            </label>
            <input
              type="text" required autoComplete="username"
              value={creds.username}
              onChange={e => setCreds(c => ({ ...c, username: e.target.value }))}
              placeholder="admin" className={inputCls}
            />
          </div>
          <div>
            <label className="font-mono text-xs text-[#9898b0] uppercase tracking-widest block mb-2">
              Password
            </label>
            <input
              type="password" required autoComplete="current-password"
              value={creds.password}
              onChange={e => setCreds(c => ({ ...c, password: e.target.value }))}
              placeholder="••••••••" className={inputCls}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#f59e0b] text-black font-mono text-sm font-bold
                       py-3.5 rounded-lg hover:bg-[#fbbf24] transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed tracking-wider mt-2">
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="text-center font-mono text-xs text-[#5a5a72] mt-6">
          <a href="/" className="hover:text-[#f59e0b] transition-colors">← Back to portfolio</a>
        </p>
      </div>
    </div>
  )
}
