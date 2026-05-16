import { getSection } from '@/lib/db';
import { Testimonial } from '@/lib/types';
import React from 'react'

const Testimonials = () => {
    const testimonials = getSection<Testimonial[]>('testimonials')!
    return (
        <section id="testimonials" className="py-24 px-10 bg-bg">
            <div className="max-w-5xl mx-auto">
                
                <span className="font-mono text-xs text-amber tracking-widest uppercase block mb-4">06 — Testimonials</span>

                <h2 className="font-display font-extrabold text-white tracking-tight mb-12"
                    style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
                    What Clients Say
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {testimonials.map(t => (
                        <div key={t.id} className="bg-surface border border-border rounded-xl p-6">
                            <p className="text-sm text-text-muted leading-7 mb-5 italic before:content-[''] before:text-amber before:text-2xl before:leading-none before:align-[-0.35em] before:mr-1">
                            {t.quote}
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-surface2 border border-border2
                                                flex items-center justify-center font-mono text-xs text-amber font-medium">
                                    {t.initials}
                                </div>
                                <div>
                                    <div className="text-sm text-white font-medium">{t.author}</div>
                                    <div className="font-mono text-xs text-text-subtle">{t.platform}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;