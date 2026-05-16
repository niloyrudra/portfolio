import { getSection } from '@/lib/db';
import { LangphySection } from '@/lib/types';
import React from 'react'

const LangphyCaseStudy = () => {
    const langphy = getSection<LangphySection>('langphy')!;
    return (
        <section id="langphy" className="py-24 px-10 bg-bg3 border-y border-border">
            <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="font-mono text-xs text-amber tracking-widest uppercase block mb-3">
                            {langphy.label}
                        </span>
                        <h2 className="font-display font-extrabold text-white tracking-tight leading-tight mb-6"
                            style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)' }}
                        >
                            {langphy.title}<br/>
                            <span className="text-amber">{langphy.titleHighlight}</span>
                        </h2>
                        <p className="text-text-muted text-sm leading-8 mb-8">{langphy.desc}</p>
                        <div className="grid grid-cols-2 gap-4">
                            {langphy.metrics.map((m, i) => (
                                <div key={i} className="bg-surface2 border border-border rounded-lg p-4 text-center">
                                    <div className="font-display font-extrabold text-amber text-2xl">{m.num}</div>
                                    <div className="font-mono text-xs text-text-subtle uppercase tracking-wider mt-1">{m.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Architecture diagram */}
                    <div className="bg-surface border border-border rounded-xl p-7">
                        <div className="font-mono text-xs text-text-subtle uppercase tracking-widest mb-5">
                            System Architecture
                        </div>
                        <div className="space-y-4">
                            {
                                [
                                    { label: 'Node.js Services (17)', items: ['auth-svc','user-svc','lesson-svc','progress-svc','vocab-svc','grammar-svc','+11 more'], cls: 'bg-blue-400/12 border-blue-400/25 text-blue-400' },
                                    { label: 'Python / AI Services (2)', items: ['nlp-eval-svc (spaCy)','speech-svc (Whisper)'], cls: 'bg-teal-400/12 border-teal-400/25 text-teal-400' },
                                    { label: 'Messaging / Infra', items: ['Kafka','Docker','Kubernetes','Railway'], cls: 'bg-amber/8 border-amber/20 text-amber' },
                                    { label: 'Data Layer', items: ['PostgreSQL','MongoDB','Redis'], cls: 'bg-green-400/10 border-green-400/20 text-green-400' },
                                ].map(group => (
                                    <div key={group.label}>
                                        <div className="font-mono text-xs text-text-subtle mb-2">{group.label}</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {group.items.map(item => (
                                                <span key={item} className={`font-mono text-xs px-2 py-1 rounded border ${group.cls}`}>
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="border-t border-border mt-3" />
                                    </div>
                                ))
                            }
                            <div>
                                <div className="font-mono text-xs text-text-subtle mb-2">NLP Pipeline</div>
                                <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                                    {['Audio Input','Whisper STT','spaCy NLP','Rubric Eval','Feedback'].map((step, i, arr) => (
                                        <span key={step} className="flex items-center gap-1.5">
                                            <span className="bg-surface2 border border-border2 text-text-muted px-2 py-1 rounded">
                                                {step}
                                            </span>
                                            {i < arr.length - 1 && <span className="text-amber">→</span>}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LangphyCaseStudy;