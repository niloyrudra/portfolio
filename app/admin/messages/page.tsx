'use client'
import { useEffect, useState } from 'react'
import type { ContactMessage } from '@/lib/types'

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)

  const fetchMessages = async () => {
    setLoading(true)
    const res = await fetch('/api/messages')
    const data = await res.json()
    if (Array.isArray(data)) setMessages(data)
    setLoading(false)
  }

  useEffect(() => { fetchMessages() }, [])

  const markRead = async (id: number) => {
    await fetch('/api/messages', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setMessages(ms => ms.map(m => m.id === id ? { ...m, read: 1 } : m))
  }

  const deleteMsg = async (id: number) => {
    if (!confirm('Delete this message?')) return
    await fetch('/api/messages', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setMessages(ms => ms.filter(m => m.id !== id))
    if (expanded === id) setExpanded(null)
  }

  const toggle = (id: number) => {
    setExpanded(e => e === id ? null : id)
    const msg = messages.find(m => m.id === id)
    if (msg && !msg.read) markRead(id)
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-mono font-extrabold text-2xl text-[#e8e8f0] tracking-tight">Messages</h1>
          <p className="font-mono text-xs text-[#9898b0] mt-1">
            {loading ? 'Loading...' : `${messages.length} total · ${unreadCount} unread`}
          </p>
        </div>
        <button onClick={fetchMessages}
                className="font-mono text-xs text-[#9898b0] border border-[#2a2a3d]
                           hover:border-[#f59e0b] hover:text-[#f59e0b] px-4 py-2 rounded-lg transition-colors">
          ↻ Refresh
        </button>
      </div>

      {loading && (
        <div className="font-mono text-sm text-[#5a5a72] text-center py-20">Loading messages...</div>
      )}

      {!loading && messages.length === 0 && (
        <div className="bg-[#1a1a27] border border-[#2a2a3d] rounded-xl p-10 text-center">
          <div className="text-4xl mb-4">◉</div>
          <div className="font-mono text-sm text-[#5a5a72]">No messages yet</div>
          <div className="font-mono text-xs text-[#5a5a72] mt-1">Contact form submissions will appear here</div>
        </div>
      )}

      {!loading && messages.length > 0 && (
        <div className="space-y-2">
          {messages.map(msg => (
            <div key={msg.id}
                 className={`bg-[#1a1a27] border rounded-xl overflow-hidden transition-colors
                   ${!msg.read ? 'border-[#f59e0b]/40' : 'border-[#2a2a3d]'}`}>
              {/* Row */}
              <button onClick={() => toggle(msg.id)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#22222f] transition-colors">
                <div className={`w-2 h-2 rounded-full shrink-0 ${!msg.read ? 'bg-[#f59e0b]' : 'bg-[#2a2a3d]'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono font-bold text-sm text-[#e8e8f0] truncate">{msg.name}</span>
                    <span className="font-mono text-xs text-[#5a5a72] truncate">{msg.email}</span>
                    {msg.subject && (
                      <span className="font-mono text-xs text-[#9898b0] truncate hidden sm:block">— {msg.subject}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs text-[#5a5a72] hidden sm:block">
                    {new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </span>
                  <span className="text-[#9898b0]">{expanded === msg.id ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Expanded */}
              {expanded === msg.id && (
                <div className="px-5 pb-5 border-t border-[#2a2a3d]">
                  <div className="grid sm:grid-cols-2 gap-3 pt-4 mb-4">
                    <div>
                      <div className="font-mono text-xs text-[#5a5a72] uppercase tracking-wider mb-1">From</div>
                      <div className="font-mono text-sm text-[#e8e8f0]">{msg.name}</div>
                    </div>
                    <div>
                      <div className="font-mono text-xs text-[#5a5a72] uppercase tracking-wider mb-1">Email</div>
                      <a href={`mailto:${msg.email}`}
                         className="font-mono text-sm text-[#f59e0b] hover:underline">{msg.email}</a>
                    </div>
                    {msg.subject && (
                      <div className="sm:col-span-2">
                        <div className="font-mono text-xs text-[#5a5a72] uppercase tracking-wider mb-1">Subject</div>
                        <div className="font-mono text-sm text-[#e8e8f0]">{msg.subject}</div>
                      </div>
                    )}
                    <div>
                      <div className="font-mono text-xs text-[#5a5a72] uppercase tracking-wider mb-1">Received</div>
                      <div className="font-mono text-sm text-[#9898b0]">
                        {new Date(msg.created_at).toLocaleString('en-GB')}
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#14141f] border border-[#2a2a3d] rounded-lg p-4 mb-4">
                    <div className="font-mono text-xs text-[#5a5a72] uppercase tracking-wider mb-2">Message</div>
                    <p className="text-sm text-[#e8e8f0] whitespace-pre-wrap leading-7">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Your message')}`}
                       className="font-mono text-xs text-[#f59e0b] border border-[#f59e0b]/30
                                  hover:bg-[#f59e0b]/10 px-4 py-2 rounded-lg transition-colors">
                      ✉ Reply
                    </a>
                    {!msg.read && (
                      <button onClick={() => markRead(msg.id)}
                              className="font-mono text-xs text-[#9898b0] border border-[#2a2a3d]
                                         hover:border-[#f59e0b] hover:text-[#f59e0b] px-4 py-2 rounded-lg transition-colors">
                        ✓ Mark Read
                      </button>
                    )}
                    <button onClick={() => deleteMsg(msg.id)}
                            className="font-mono text-xs text-red-400 hover:text-red-300 transition-colors ml-auto">
                      ✕ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
