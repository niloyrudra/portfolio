import { getSection } from '@/lib/db';
import { SkillCard } from '@/lib/types';
import React from 'react'

const Skills = () => {
    const skills = getSection<SkillCard[]>('skills')!;
    return (
        <section id="skills" className="py-24 px-10 bg-bg">
            <div className="max-w-5xl mx-auto">

                <span className="font-mono text-xs text-amber tracking-widest uppercase block mb-4">02 — Core Expertise</span>

                <h2 className="font-display font-extrabold text-white tracking-tight mb-4"
                    style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
                    What I Build With
                </h2>

                <p className="text-text-muted text-sm max-w-lg mb-12">
                    A battle-tested stack across mobile, backend, infrastructure, and AI — refined through 7+ years of production work.
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map(card => (
                        <div key={card.id}
                            className="bg-surface border border-border rounded-xl p-6 hover:border-amber hover:-translate-y-1 transition-all">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-lg bg-amber/10 border border-amber/20 flex items-center justify-center text-xl">
                                    {card.icon}
                                </div>
                                <span className="font-display font-bold text-white">{card.category}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {card.tags.map((t, i) => (
                                    <span key={i}
                                        className={`font-mono text-xs px-2 py-1 rounded tracking-wide
                                            ${t.highlight
                                            ? 'bg-amber/8 border border-amber/30 text-amber'
                                            : 'bg-surface2 border border-border2 text-text-muted'}`}
                                    >
                                        {t.label}
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

export default Skills;