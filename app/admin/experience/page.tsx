'use client'
import { useEffect, useState } from 'react'
import AdminPageWrapper, { inputCls, labelCls } from '@/components/AdminPageWrapper'
import type { ExperienceItem } from '@/lib/types'

function ExperienceEditor({
  exp, onChange, onRemove, index,
}: { exp: ExperienceItem; onChange: (e: ExperienceItem) => void; onRemove: () => void; index: number }) {
  const [open, setOpen] = useState(index === 0)
  const set = (field: keyof ExperienceItem) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...exp, [field]: e.target.value })

  const setBullet = (i: number, val: string) =>
    onChange({ ...exp, bullets: exp.bullets.map((b, idx) => idx === i ? val : b) })
  const addBullet = () => onChange({ ...exp, bullets: [...exp.bullets, ''] })
  const removeBullet = (i: number) => onChange({ ...exp, bullets: exp.bullets.filter((_, idx) => idx !== i) })

  return (
    <div className="bg-[#1a1a27] border border-[#2a2a3d] rounded-xl overflow-hidden">
      {/* Accordion header */}
      <button onClick={() => setOpen(o => !o)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#22222f] transition-colors">
        <div>
          <span className="font-mono font-bold text-sm text-[#e8e8f0]">{exp.role || 'New Experience'}</span>
          {exp.company && <span className="font-mono text-xs text-[#9898b0] ml-3">{exp.company}</span>}
        </div>
        <div className="flex items-center gap-3">
          {exp.current && (
            <span className="font-mono text-xs text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-2 py-0.5 rounded">
              Current
            </span>
          )}
          <span className="text-[#9898b0] text-sm">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-[#2a2a3d]">
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <div>
              <label className={labelCls}>Role / Title</label>
              <input type="text" value={exp.role} onChange={set('role')} className={inputCls} placeholder="Full-Stack Developer" />
            </div>
            <div>
              <label className={labelCls}>Company</label>
              <input type="text" value={exp.company} onChange={set('company')} className={inputCls} placeholder="Acme Corp" />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input type="text" value={exp.location} onChange={set('location')} className={inputCls} placeholder="Berlin, Germany" />
            </div>
            <div>
              <label className={labelCls}>Badge (optional)</label>
              <input type="text" value={exp.badge || ''} onChange={set('badge')} className={inputCls} placeholder="★ Founder & Sole Engineer" />
            </div>
            <div>
              <label className={labelCls}>Start Date</label>
              <input type="text" value={exp.startDate} onChange={set('startDate')} className={inputCls} placeholder="Mar 2025" />
            </div>
            <div>
              <label className={labelCls}>End Date</label>
              <input type="text" value={exp.endDate} onChange={set('endDate')} className={inputCls} placeholder="Present" />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-[#9898b0] uppercase tracking-wider">
              <input type="checkbox" checked={exp.current}
                     onChange={e => onChange({ ...exp, current: e.target.checked })}
                     className="accent-[#f59e0b]" />
              Currently working here (shows filled dot on timeline)
            </label>
          </div>

          {/* Bullets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={labelCls}>Bullet Points</label>
              <button onClick={addBullet}
                      className="font-mono text-xs text-[#f59e0b] border border-[#f59e0b]/30 hover:bg-[#f59e0b]/10 px-3 py-1 rounded transition-colors">
                + Add Bullet
              </button>
            </div>
            <div className="space-y-2">
              {exp.bullets.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <textarea rows={2} value={b} onChange={e => setBullet(i, e.target.value)}
                            className={`${inputCls} flex-1 resize-none`} placeholder="Achievement or responsibility..." />
                  <button onClick={() => removeBullet(i)}
                          className="font-mono text-xs text-red-400 hover:text-red-300 px-2 self-start pt-2">✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#2a2a3d]">
            <button onClick={onRemove}
                    className="font-mono text-xs text-red-400 hover:text-red-300 transition-colors">
              ✕ Remove this experience
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ExperienceAdmin() {
  const [items, setItems] = useState<ExperienceItem[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/content/experience').then(r => r.json()).then(setItems)
  }, [])

  const update = (i: number, exp: ExperienceItem) => setItems(xs => xs.map((x, idx) => idx === i ? exp : x))
  const remove = (i: number) => setItems(xs => xs.filter((_, idx) => idx !== i))
  const add = () => setItems(xs => [...xs, {
    id: Date.now().toString(), role: '', company: '', location: '',
    startDate: '', endDate: 'Present', current: false, bullets: [''],
  }])

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false)
    try {
      const res = await fetch('/api/content/experience', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally { setSaving(false) }
  }

  return (
    <AdminPageWrapper title="Experience" description="Work history shown on the timeline"
                      onSave={handleSave} saving={saving} saved={saved} error={error}>
      <div className="space-y-3 mb-4">
        {items.map((exp, i) => (
          <ExperienceEditor key={exp.id} exp={exp} index={i}
                            onChange={e => update(i, e)} onRemove={() => remove(i)} />
        ))}
      </div>
      <button onClick={add}
              className="w-full font-mono text-sm text-[#f59e0b] border border-dashed border-[#f59e0b]/30
                         hover:bg-[#f59e0b]/5 py-3 rounded-xl transition-colors tracking-wide">
        + Add Experience
      </button>
    </AdminPageWrapper>
  )
}
