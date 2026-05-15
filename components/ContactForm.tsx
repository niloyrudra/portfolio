'use client'
import { useState, FormEvent } from 'react'

export default function ContactForm() {
  // const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', honeypot: '' })
  const [form, setForm] = useState({
    name: '', email: '', subject: '', message: '',
    website: '', // honeypot — deliberately named something innocent
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send honeypot value under the key the API expects
        body: JSON.stringify({ ...form, honeypot: form.website }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '', website: '' })
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const inputCls = `w-full bg-surface border border-border rounded-lg px-4 py-3
    font-sans text-sm text-text placeholder-text-subtle
    focus:outline-none focus:border-amber transition-colors`

  return (
    <form onSubmit={handleSubmit} method="post" action="/api/contact" className="space-y-4">
      {/*
       * Honeypot trap — hidden from real users, filled by bots.
       *
       * IMPORTANT: No `name` attribute here.
       * Without a `name`, this field is NEVER included in native HTML form
       * submissions, so it will never appear in the browser URL bar even if
       * JS hasn't loaded yet. We pass its value manually in the JSON body above.
       *
       * Named "website" so if it ever does show up somewhere, it looks like a
       * normal field rather than exposing our anti-spam technique.
       */}
      <input
        type="text"
        // name="honeypot"
        value={form.website}
        onChange={set('website')}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete= "off"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-xs text-text-subtle uppercase tracking-wider block mb-2">Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={set('name')}
            placeholder="Your name"
            className={inputCls}
          />
        </div>
        <div>
          <label className="font-mono text-xs text-text-subtle uppercase tracking-wider block mb-2">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={set('email')}
            placeholder="you@example.com"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="font-mono text-xs text-text-subtle uppercase tracking-wider block mb-2">Subject</label>
        <input
          type="text"
          value={form.subject}
          onChange={set('subject')}
          placeholder="What's this about?"
          className={inputCls}
        />
      </div>

      <div>
        <label className="font-mono text-xs text-text-subtle uppercase tracking-wider block mb-2">Message *</label>
        <textarea
          required rows={6} value={form.message} onChange={set('message')}
          placeholder="Tell me about your project..."
          className={`${inputCls} resize-none`}
        />
      </div>

      {status === 'error' && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs px-4 py-3 rounded-lg">
          {errorMsg}
        </div>
      )}
      {status === 'success' && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-xs px-4 py-3 rounded-lg">
          ✓ Message sent! I&apos;ll get back to you soon.
        </div>
      )}

      <button
        type="submit" disabled={status === 'loading'}
        className="w-full bg-amber text-black font-mono text-sm font-semibold
                   py-3.5 rounded-lg hover:bg-amber-light transition-colors
                   disabled:opacity-60 disabled:cursor-not-allowed tracking-wider">
        {status === 'loading' ? 'Sending...' : 'Send Message →'}
      </button>
    </form>
  )
}
