import { getSection } from '@/lib/db';
import { ExperienceItem } from '@/lib/types';
import React from 'react'

const Experiences = () => {
    const experience = getSection<ExperienceItem[]>('experience')!
    return (
        <section id="experience" className="py-24 px-10 bg-bg2">
            <div className="max-w-5xl mx-auto">
                <span className="font-mono text-xs text-amber tracking-widest uppercase block mb-4">03 — Experience</span>

                <h2 className="font-display font-extrabold text-white tracking-tight mb-12"
                    style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
                    Professional History
                </h2>

                <div className="relative pl-8 border-l border-l-amber/40">
                    {experience.map((exp, idx) => (
                        <div key={exp.id} className={`relative pb-12 pl-8 ${idx === experience.length - 1 ? 'pb-0' : ''}`}>
                            <div className={`absolute -left-[2.45rem] top-1.5 w-3 h-3 rounded-full border-2 ${exp.current ? 'bg-amber border-amber' : 'bg-bg2 border-amber/60'}`} />
                            
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                <div>
                                    {exp.badge && (
                                        <span className="inline-block font-mono text-xs text-amber bg-amber/8 border border-amber/20
                                                        px-2 py-0.5 rounded tracking-widest uppercase mb-2">
                                            {exp.badge}
                                        </span>
                                    )}
                                    <div className="font-display font-bold text-white text-lg">{exp.role}</div>
                                    <div className="font-mono text-xs text-text-subtle tracking-wide mt-0.5">
                                        {exp.company} · {exp.location}
                                    </div>
                                </div>
                                <span className="font-mono text-xs text-amber bg-amber/8 border border-amber/20
                                                px-3 py-1 rounded-full tracking-wider whitespace-nowrap">
                                    {exp.startDate} – {exp.endDate}
                                </span>
                            </div>

                            <ul className="mt-4 space-y-2">
                                {exp.bullets.map((b, i) => (
                                    <li key={i} className="text-sm text-text-muted pl-5 relative leading-7 before:content-['▸']
                                                        before:absolute before:left-0 before:text-amber before:text-xs before:top-1">
                                    {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Experiences;