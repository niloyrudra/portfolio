'use client'
import { useEffect, useState } from 'react'
import AdminPageWrapper, { inputCls, labelCls } from '@/components/AdminPageWrapper'
import type { Project } from '@/lib/types'

function ProjectEditor({
  project, onChange, onRemove,
}: { project: Project; onChange: (p: Project) => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false)
  const set = (field: keyof Project) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...project, [field]: e.target.value })

  // Comma-separated helpers
  const tagsStr = project.tags.join(', ')
  const stackStr = project.stack.join(', ')

  return (
    <div className="bg-[#1a1a27] border border-[#2a2a3d] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#22222f] transition-colors">
        <div className="flex items-center gap-3">
          {project.featured && (
            <span className="font-mono text-xs text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-2 py-0.5 rounded">
              Featured
            </span>
          )}
          <span className="font-mono font-bold text-sm text-[#e8e8f0]">{project.name || 'New Project'}</span>
        </div>
        <span className="text-[#9898b0] text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-4 border-t border-[#2a2a3d] space-y-4">
          <div>
            <label className={labelCls}>Project Name</label>
            <input type="text" value={project.name} onChange={set('name')} className={inputCls} placeholder="Langphy — German Learning App" />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={3} value={project.desc} onChange={set('desc')}
                      className={`${inputCls} resize-none`} placeholder="What does this project do..." />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tags (comma-separated)</label>
              <input type="text" value={tagsStr}
                     onChange={e => onChange({ ...project, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                     className={inputCls} placeholder="Featured, AI/NLP, React Native" />
            </div>
            <div>
              <label className={labelCls}>Tech Stack (comma-separated)</label>
              <input type="text" value={stackStr}
                     onChange={e => onChange({ ...project, stack: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                     className={inputCls} placeholder="React Native, NestJS, Kafka" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#2a2a3d]">
            <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-[#9898b0] uppercase tracking-wider">
              <input type="checkbox" checked={project.featured}
                     onChange={e => onChange({ ...project, featured: e.target.checked })}
                     className="accent-[#f59e0b]" />
              Featured project (amber border highlight)
            </label>
            <button onClick={onRemove}
                    className="font-mono text-xs text-red-400 hover:text-red-300 transition-colors">
              ✕ Remove
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/content/projects').then(r => r.json()).then(setProjects)
  }, [])

  const update = (i: number, p: Project) => setProjects(xs => xs.map((x, idx) => idx === i ? p : x))
  const remove = (i: number) => setProjects(xs => xs.filter((_, idx) => idx !== i))
  const add = () => setProjects(xs => [...xs, {
    id: Date.now().toString(), name: '', desc: '', tags: [], stack: [], featured: false,
  }])

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false)
    try {
      const res = await fetch('/api/content/projects', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projects),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally { setSaving(false) }
  }

  return (
    <AdminPageWrapper title="Projects" description="Portfolio projects shown on the site"
                      onSave={handleSave} saving={saving} saved={saved} error={error}>
      <div className="space-y-3 mb-4">
        {projects.map((p, i) => (
          <ProjectEditor key={p.id} project={p}
                         onChange={proj => update(i, proj)} onRemove={() => remove(i)} />
        ))}
      </div>
      <button onClick={add}
              className="w-full font-mono text-sm text-[#f59e0b] border border-dashed border-[#f59e0b]/30
                         hover:bg-[#f59e0b]/5 py-3 rounded-xl transition-colors tracking-wide">
        + Add Project
      </button>
    </AdminPageWrapper>
  )
}
