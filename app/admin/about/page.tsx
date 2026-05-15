'use client'
import { useEffect, useState } from 'react'
import AdminPageWrapper, { inputCls, labelCls, sectionCardCls } from '@/components/AdminPageWrapper'
import type { AboutSection, ProfileLink } from '@/lib/types'

const DEFAULT: AboutSection = { bio: [''], availability: '', links: [] }

export default function AboutAdmin() {
  const [data, setData] = useState<AboutSection>(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/content/about').then(r => r.json()).then(setData)
  }, [])

  const setBio = (i: number, val: string) =>
    setData(d => ({ ...d, bio: d.bio.map((p, idx) => idx === i ? val : p) }))
  const addBio = () => setData(d => ({ ...d, bio: [...d.bio, ''] }))
  const removeBio = (i: number) => setData(d => ({ ...d, bio: d.bio.filter((_, idx) => idx !== i) }))

  const setLink = (i: number, field: keyof ProfileLink, val: string) =>
    setData(d => ({ ...d, links: d.links.map((l, idx) => idx === i ? { ...l, [field]: val } : l) }))
  const addLink = () =>
    setData(d => ({ ...d, links: [...d.links, { id: Date.now().toString(), name: '', handle: '', url: '', icon: '' }] }))
  const removeLink = (i: number) =>
    setData(d => ({ ...d, links: d.links.filter((_, idx) => idx !== i) }))

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false)
    try {
      const res = await fetch('/api/content/about', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally { setSaving(false) }
  }

  return (
    <AdminPageWrapper title="About Section" description="Bio and profile links"
                      onSave={handleSave} saving={saving} saved={saved} error={error}>

      {/* Bio paragraphs */}
      <div className={sectionCardCls}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-mono text-sm text-[#f59e0b] uppercase tracking-widest">Bio Paragraphs</h3>
          <button onClick={addBio}
                  className="font-mono text-xs text-[#f59e0b] border border-[#f59e0b]/30 hover:bg-[#f59e0b]/10 px-4 py-1.5 rounded-lg transition-colors">
            + Add Paragraph
          </button>
        </div>
        <div className="space-y-4">
          {data.bio.map((p, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex-1">
                <label className={labelCls}>Paragraph {i + 1}</label>
                <textarea rows={3} value={p} onChange={e => setBio(i, e.target.value)}
                          className={`${inputCls} resize-none`} placeholder="Write a paragraph..." />
              </div>
              {data.bio.length > 1 && (
                <button onClick={() => removeBio(i)}
                        className="font-mono text-xs text-red-400 hover:text-red-300 mt-6 px-2 self-start">✕</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className={sectionCardCls}>
        <h3 className="font-mono text-sm text-[#f59e0b] uppercase tracking-widest mb-4">Availability Badge</h3>
        <label className={labelCls}>Text shown in the green badge</label>
        <input type="text" value={data.availability}
               onChange={e => setData(d => ({ ...d, availability: e.target.value }))}
               className={inputCls} placeholder="Available for full-time remote · contract · relocation" />
      </div>

      {/* Profile links */}
      <div className={sectionCardCls}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-mono text-sm text-[#f59e0b] uppercase tracking-widest">Profile Links</h3>
          <button onClick={addLink}
                  className="font-mono text-xs text-[#f59e0b] border border-[#f59e0b]/30 hover:bg-[#f59e0b]/10 px-4 py-1.5 rounded-lg transition-colors">
            + Add Link
          </button>
        </div>
        <div className="space-y-4">
          {data.links.map((link, i) => (
            <div key={link.id}
                 className="bg-[#14141f] border border-[#2a2a3d] rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Name</label>
                  <input type="text" value={link.name} onChange={e => setLink(i, 'name', e.target.value)}
                         className={inputCls} placeholder="LinkedIn" />
                </div>
                <div>
                  <label className={labelCls}>Icon (short label)</label>
                  <input type="text" value={link.icon} onChange={e => setLink(i, 'icon', e.target.value)}
                         className={inputCls} placeholder="in" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Handle / Subtitle</label>
                <input type="text" value={link.handle} onChange={e => setLink(i, 'handle', e.target.value)}
                       className={inputCls} placeholder="niloy-rudra-dev" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className={labelCls}>URL</label>
                  <input type="url" value={link.url} onChange={e => setLink(i, 'url', e.target.value)}
                         className={inputCls} placeholder="https://..." />
                </div>
                <button onClick={() => removeLink(i)}
                        className="font-mono text-xs text-red-400 hover:text-red-300 mt-6 px-2 self-start">✕ Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminPageWrapper>
  )
}
