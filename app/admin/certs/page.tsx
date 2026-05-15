'use client'
import { useEffect, useState } from 'react'
import AdminPageWrapper, { inputCls, labelCls } from '@/components/AdminPageWrapper'
import type { Cert } from '@/lib/types'

export default function CertsAdmin() {
  const [certs, setCerts] = useState<Cert[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/content/certs').then(r => r.json()).then(setCerts)
  }, [])

  const set = (i: number, field: keyof Cert, val: string) =>
    setCerts(cs => cs.map((c, idx) => idx === i ? { ...c, [field]: val } : c))
  const remove = (i: number) => setCerts(cs => cs.filter((_, idx) => idx !== i))
  const add = () => setCerts(cs => [...cs, { id: Date.now().toString(), issuer: '', name: '', date: '' }])

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false)
    try {
      const res = await fetch('/api/content/certs', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certs),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally { setSaving(false) }
  }

  return (
    <AdminPageWrapper title="Certifications" description="Credentials and certificates shown on the site"
                      onSave={handleSave} saving={saving} saved={saved} error={error}>
      <div className="space-y-3 mb-4">
        {certs.map((cert, i) => (
          <div key={cert.id}
               className="bg-[#1a1a27] border border-[#2a2a3d] rounded-xl p-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Issuer</label>
                <input type="text" value={cert.issuer} onChange={e => set(i, 'issuer', e.target.value)}
                       className={inputCls} placeholder="IBM · Coursera" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Certificate Name</label>
                <input type="text" value={cert.name} onChange={e => set(i, 'name', e.target.value)}
                       className={inputCls} placeholder="IBM AI Engineering with Python..." />
              </div>
              <div>
                <label className={labelCls}>Date</label>
                <input type="text" value={cert.date} onChange={e => set(i, 'date', e.target.value)}
                       className={inputCls} placeholder="July 2025" />
              </div>
              <div className="sm:col-span-2 flex items-end">
                <button onClick={() => remove(i)}
                        className="font-mono text-xs text-red-400 hover:text-red-300 transition-colors pb-0.5">
                  ✕ Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={add}
              className="w-full font-mono text-sm text-[#f59e0b] border border-dashed border-[#f59e0b]/30
                         hover:bg-[#f59e0b]/5 py-3 rounded-xl transition-colors tracking-wide">
        + Add Certificate
      </button>
    </AdminPageWrapper>
  )
}
