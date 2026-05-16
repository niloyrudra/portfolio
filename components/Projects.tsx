import { getSection } from '@/lib/db';
import { Project } from '@/lib/types';
import React from 'react'

const Projects = () => {
    const projects = getSection<Project[]>('projects')!
    return (
        <section id="projects" className="py-24 px-10 bg-bg">
            <div className="max-w-5xl mx-auto">

                <span className="font-mono text-xs text-amber tracking-widest uppercase block mb-4">04 — Projects</span>

                <h2 className="font-display font-extrabold text-white tracking-tight mb-12"
                    style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
                    Selected Work
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(p => (
                        <div key={p.id}
                            className={`bg-surface border rounded-xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-all
                                ${p.featured
                                ? 'border-amber/40 bg-gradient-to-br from-amber/5 to-surface'
                                : 'border-border hover:border-amber'}`}
                        >
                            <div className="flex flex-wrap gap-1.5">
                                {p.tags.map(t => (
                                    <span key={t} className="font-mono text-xs bg-surface2 border border-border2 text-text-subtle px-2 py-0.5 rounded">
                                    {t}
                                    </span>
                                ))}
                            </div>
                            <div className="font-display font-bold text-white">{p.name}</div>
                            <p className="text-sm text-text-muted leading-7 flex-1">{p.desc}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {p.stack.map(s => (
                                    <span key={s} className="font-mono text-xs bg-amber/7 border border-amber/15 text-amber px-2 py-0.5 rounded">
                                    {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Projects;