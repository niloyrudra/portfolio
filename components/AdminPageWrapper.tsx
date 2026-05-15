'use client'
import { ReactNode } from 'react'

interface Props {
  title: string
  description?: string
  onSave: () => Promise<void>
  saving: boolean
  saved: boolean
  error: string
  children: ReactNode
}

export default function AdminPageWrapper({ title, description, onSave, saving, saved, error, children }: Props) {
  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-mono font-extrabold text-2xl text-[#e8e8f0] tracking-tight">{title}</h1>
          {description && (
            <p className="font-mono text-xs text-[#9898b0] mt-1 tracking-wide">{description}</p>
          )}
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-[#f59e0b] text-black font-mono text-sm font-bold
                     px-6 py-2.5 rounded-lg hover:bg-[#fbbf24] transition-colors
                     disabled:opacity-60 disabled:cursor-not-allowed tracking-wider flex items-center gap-2">
          {saving ? (
            <><span className="animate-spin inline-block">↻</span> Saving...</>
          ) : saved ? (
            <><span>✓</span> Saved!</>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs
                        px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {children}
    </div>
  )
}

/* ── Shared admin input styles ── */
export const inputCls = `w-full bg-[#14141f] border border-[#2a2a3d] rounded-lg px-4 py-2.5
  font-mono text-sm text-[#e8e8f0] placeholder-[#5a5a72]
  focus:outline-none focus:border-[#f59e0b] transition-colors`

export const labelCls = `font-mono text-xs text-[#9898b0] uppercase tracking-widest block mb-2`

export const cardCls = `bg-[#1a1a27] border border-[#2a2a3d] rounded-xl p-5`

export const sectionCardCls = `bg-[#1a1a27] border border-[#2a2a3d] rounded-xl p-6 mb-4`

export const dangerBtnCls = `font-mono text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1`

export const addBtnCls = `font-mono text-xs text-[#f59e0b] border border-[#f59e0b]/30
  hover:bg-[#f59e0b]/10 transition-colors px-4 py-2 rounded-lg tracking-wide`
