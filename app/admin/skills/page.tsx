'use client'
import { useEffect, useState } from 'react'
import AdminPageWrapper, { inputCls, labelCls } from '@/components/AdminPageWrapper'
import type { SkillCard, SkillTag } from '@/lib/types'

function SkillCardEditor({
  card, onChange, onRemove,
}: { card: SkillCard; onChange: (c: SkillCard) => void; onRemove: () => void }) {
  const set = (field: keyof SkillCard) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...card, [field]: e.target.value })

  const setTag = (i: number, field: keyof SkillTag, val: string | boolean) =>
    onChange({ ...card, tags: card.tags.map((t, idx) => idx === i ? { ...t, [field]: val } : t) })
  const addTag = () => onChange({ ...card, tags: [...card.tags, { label: '', highlight: false }] })
  const removeTag = (i: number) => onChange({ ...card, tags: card.tags.filter((_, idx) => idx !== i) })

  return (
    <div className="bg-[#1a1a27] border border-[#2a2a3d] rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="grid sm:grid-cols-3 gap-3 flex-1">
          <div>
            <label className={labelCls}>Icon (emoji)</label>
            <input type="text" value={card.icon} onChange={set('icon')} className={inputCls} placeholder="📱" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Category</label>
            <input type="text" value={card.category} onChange={set('category')} className={inputCls} placeholder="Mobile / Frontend" />
          </div>
        </div>
        <button onClick={onRemove}
                className="font-mono text-xs text-red-400 hover:text-red-300 transition-colors px-2 pt-6 shrink-0">
          ✕ Remove Card
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={labelCls}>Tags</label>
          <button onClick={addTag}
                  className="font-mono text-xs text-[#f59e0b] border border-[#f59e0b]/30 hover:bg-[#f59e0b]/10 px-3 py-1 rounded transition-colors">
            + Tag
          </button>
        </div>
        <div className="space-y-2">
          {card.tags.map((tag, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={tag.label} onChange={e => setTag(i, 'label', e.target.value)}
                     className={`${inputCls} flex-1`} placeholder="React Native" />
              <label className="flex items-center gap-1.5 font-mono text-xs text-[#9898b0] whitespace-nowrap cursor-pointer">
                <input type="checkbox" checked={tag.highlight}
                       onChange={e => setTag(i, 'highlight', e.target.checked)}
                       className="accent-[#f59e0b]" />
                Highlight
              </label>
              <button onClick={() => removeTag(i)}
                      className="font-mono text-xs text-red-400 hover:text-red-300 px-1">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SkillsAdmin() {
  const [cards, setCards] = useState<SkillCard[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/content/skills').then(r => r.json()).then(setCards)
  }, [])

  const updateCard = (i: number, card: SkillCard) =>
    setCards(cs => cs.map((c, idx) => idx === i ? card : c))
  const removeCard = (i: number) => setCards(cs => cs.filter((_, idx) => idx !== i))
  const addCard = () =>
    setCards(cs => [...cs, { id: Date.now().toString(), category: '', icon: '⚙️', tags: [] }])

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false)
    try {
      const res = await fetch('/api/content/skills', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cards),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally { setSaving(false) }
  }

  return (
    <AdminPageWrapper title="Skills" description="Skill cards shown on the portfolio"
                      onSave={handleSave} saving={saving} saved={saved} error={error}>
      <div className="space-y-4 mb-4">
        {cards.map((card, i) => (
          <SkillCardEditor key={card.id} card={card}
                           onChange={c => updateCard(i, c)}
                           onRemove={() => removeCard(i)} />
        ))}
      </div>
      <button onClick={addCard}
              className="w-full font-mono text-sm text-[#f59e0b] border border-dashed border-[#f59e0b]/30
                         hover:bg-[#f59e0b]/5 py-3 rounded-xl transition-colors tracking-wide">
        + Add Skill Card
      </button>
    </AdminPageWrapper>
  )
}
