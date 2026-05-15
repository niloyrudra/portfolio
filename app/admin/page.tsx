'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const SECTIONS = [
  { href: '/admin/hero',       label: 'Hero',            icon: '✦', desc: 'Name, title, tagline, stats' },
  { href: '/admin/about',      label: 'About',           icon: '◎', desc: 'Bio paragraphs & profile links' },
  { href: '/admin/skills',     label: 'Skills',          icon: '◈', desc: 'Skill cards & tech tags' },
  { href: '/admin/experience', label: 'Experience',      icon: '◷', desc: 'Roles, companies, bullet points' },
  { href: '/admin/projects',   label: 'Projects',        icon: '◻', desc: 'Portfolio projects & tech stack' },
  { href: '/admin/certs',      label: 'Certifications',  icon: '◆', desc: 'Certificates & credentials' },
  { href: '/admin/messages',   label: 'Messages',        icon: '◉', desc: 'Contact form submissions' },
]

export default function AdminDashboard() {
  const [unread, setUnread] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/messages')
      .then(r => r.json())
      .then(msgs => {
        if (Array.isArray(msgs)) setUnread(msgs.filter((m: { read: number }) => !m.read).length)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="font-mono font-extrabold text-3xl text-[#e8e8f0] tracking-tight mb-2">
          Welcome back 👋
        </h1>
        <p className="font-mono text-sm text-[#9898b0]">
          Manage your portfolio content. Changes are live immediately.
        </p>
      </div>

      {unread !== null && unread > 0 && (
        <Link href="/admin/messages"
              className="flex items-center gap-3 bg-[#f59e0b]/10 border border-[#f59e0b]/30
                         rounded-xl px-5 py-4 mb-8 hover:bg-[#f59e0b]/15 transition-colors">
          <span className="text-[#f59e0b] text-xl">◉</span>
          <div>
            <div className="font-mono text-sm text-[#f59e0b] font-medium">
              {unread} unread message{unread !== 1 ? 's' : ''}
            </div>
            <div className="font-mono text-xs text-[#9898b0] mt-0.5">Click to view contact submissions</div>
          </div>
          <span className="ml-auto text-[#f59e0b]">→</span>
        </Link>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map(s => (
          <Link key={s.href} href={s.href}
                className="bg-[#1a1a27] border border-[#2a2a3d] rounded-xl p-5
                           hover:border-[#f59e0b] hover:-translate-y-0.5 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20
                              flex items-center justify-center text-[#f59e0b]">
                {s.icon}
              </div>
              <span className="font-mono font-bold text-[#e8e8f0] group-hover:text-[#f59e0b] transition-colors">
                {s.label}
              </span>
              {s.label === 'Messages' && unread !== null && unread > 0 && (
                <span className="ml-auto bg-[#f59e0b] text-black font-mono text-xs font-bold
                                 w-5 h-5 rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </div>
            <p className="font-mono text-xs text-[#5a5a72] tracking-wide">{s.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-[#1a1a27] border border-[#2a2a3d] rounded-xl p-6">
        <div className="font-mono text-xs text-[#5a5a72] uppercase tracking-widest mb-4">Quick Links</div>
        <div className="flex flex-wrap gap-3">
          <a href="/" target="_blank" rel="noopener"
             className="font-mono text-xs text-[#9898b0] border border-[#2a2a3d] px-4 py-2 rounded-lg
                        hover:border-[#f59e0b] hover:text-[#f59e0b] transition-colors">
            ↗ View Live Site
          </a>
          <a href="mailto:contact@niloyrudra.com"
             className="font-mono text-xs text-[#9898b0] border border-[#2a2a3d] px-4 py-2 rounded-lg
                        hover:border-[#f59e0b] hover:text-[#f59e0b] transition-colors">
            ✉ contact@niloyrudra.com
          </a>
        </div>
      </div>
    </div>
  )
}
