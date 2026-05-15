'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const NAV = [
  { href: '/admin',              label: 'Dashboard',    icon: '⊞' },
  { href: '/admin/hero',         label: 'Hero',         icon: '✦' },
  { href: '/admin/about',        label: 'About',        icon: '◎' },
  { href: '/admin/skills',       label: 'Skills',       icon: '◈' },
  { href: '/admin/experience',   label: 'Experience',   icon: '◷' },
  { href: '/admin/projects',     label: 'Projects',     icon: '◻' },
  { href: '/admin/certs',        label: 'Certifications', icon: '◆' },
  { href: '/admin/messages',     label: 'Messages',     icon: '◉' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Don't render the shell on the login page
  if (pathname === '/admin/login') return <>{children}</>

  const handleLogout = async () => {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <div className="min-h-screen bg-[#0f0f18] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden"
             onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-60 bg-[#08080e] border-r border-[#2a2a3d]
                         flex flex-col z-30 transition-transform
                         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#2a2a3d]">
          <Link href="/" className="font-mono font-extrabold text-2xl text-[#f59e0b] tracking-tight">NR</Link>
          <div className="font-mono text-xs text-[#5a5a72] tracking-widest uppercase mt-1">Admin Panel</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-mono
                              tracking-wide transition-colors
                              ${isActive(item.href)
                                ? 'text-[#f59e0b] bg-[#f59e0b]/8 border-r-2 border-[#f59e0b]'
                                : 'text-[#9898b0] hover:text-[#e8e8f0] hover:bg-[#1a1a27]'}`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-6 py-5 border-t border-[#2a2a3d] space-y-3">
          <a href="/" target="_blank" rel="noopener"
             className="flex items-center gap-2 font-mono text-xs text-[#5a5a72]
                        hover:text-[#f59e0b] transition-colors tracking-wide">
            ↗ View Site
          </a>
          <button onClick={handleLogout} disabled={loggingOut}
                  className="flex items-center gap-2 font-mono text-xs text-[#5a5a72]
                             hover:text-red-400 transition-colors tracking-wide disabled:opacity-50">
            {loggingOut ? 'Signing out...' : '⊘ Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-[#0f0f18]/95 backdrop-blur
                           border-b border-[#2a2a3d] px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-[#9898b0] hover:text-[#f59e0b] text-xl">
            ☰
          </button>
          <div className="font-mono text-xs text-[#5a5a72] tracking-wider">
            {NAV.find(n => isActive(n.href))?.label || 'Admin'}
          </div>
          <div className="font-mono text-xs text-[#5a5a72] hidden sm:block">
            niloyrudra.com/admin
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
