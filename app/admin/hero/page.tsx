'use client'
import { useEffect, useState } from 'react'
import AdminPageWrapper, { inputCls, labelCls, sectionCardCls } from '@/components/AdminPageWrapper'
import type { HeroSection, StatItem } from '@/lib/types'

const DEFAULT: HeroSection = {
  name: '', title: '', subtitle: '', tagline: '', cvUrl: '',
  stats: [{ num: '', label: '' }],
}

export default function HeroAdmin() {
  const [data, setData] = useState<HeroSection>(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/content/hero').then(r => r.json()).then(setData)
  }, [])

  const set = (field: keyof HeroSection) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData(d => ({ ...d, [field]: e.target.value }))

  const setStat = (i: number, field: keyof StatItem, val: string) =>
    setData(d => ({ ...d, stats: d.stats.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }))

  const addStat = () => setData(d => ({ ...d, stats: [...d.stats, { num: '', label: '' }] }))

  const removeStat = (i: number) =>
    setData(d => ({ ...d, stats: d.stats.filter((_, idx) => idx !== i) }))

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false)
    try {
      const res = await fetch('/api/content/hero', {
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
    <AdminPageWrapper title="Hero Section" description="The first thing visitors see"
                      onSave={handleSave} saving={saving} saved={saved} error={error}>

      <div className={sectionCardCls}>
        <h3 className="font-mono text-sm text-[#f59e0b] mb-5 uppercase tracking-widest">Identity</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Full Name</label>
            <input type="text" value={data.name} onChange={set('name')} className={inputCls} placeholder="Niloy Rudra" />
          </div>
          <div>
            <label className={labelCls}>Title</label>
            <input type="text" value={data.title} onChange={set('title')} className={inputCls} placeholder="Full-Stack Engineer" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Subtitle (shown in parentheses after title)</label>
            <input type="text" value={data.subtitle} onChange={set('subtitle')} className={inputCls} placeholder="Node.js · React Native · AI/NLP" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Tagline (hero description)</label>
            <textarea rows={3} value={data.tagline} onChange={set('tagline')}
                      className={`${inputCls} resize-none`}
                      placeholder="7+ years building production-grade..." />
          </div>
          <div>
            <label className={labelCls}>CV / Resume URL</label>
            <input type="text" value={data.cvUrl} onChange={set('cvUrl')} className={inputCls} placeholder="/Niloy-Rudra-CV.pdf" />
          </div>
        </div>
      </div>

      <div className={sectionCardCls}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-mono text-sm text-[#f59e0b] uppercase tracking-widest">Stats</h3>
          <button onClick={addStat}
                  className="font-mono text-xs text-[#f59e0b] border border-[#f59e0b]/30
                             hover:bg-[#f59e0b]/10 transition-colors px-4 py-1.5 rounded-lg">
            + Add Stat
          </button>
        </div>
        <div className="space-y-3">
          {data.stats.map((stat, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input type="text" value={stat.num} onChange={e => setStat(i, 'num', e.target.value)}
                     className={`${inputCls} w-28`} placeholder="7+" />
              <input type="text" value={stat.label} onChange={e => setStat(i, 'label', e.target.value)}
                     className={inputCls} placeholder="Years Experience" />
              <button onClick={() => removeStat(i)}
                      className="font-mono text-xs text-red-400 hover:text-red-300 transition-colors px-2 shrink-0">
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminPageWrapper>
  )
}
