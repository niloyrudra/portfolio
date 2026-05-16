import { getSection } from '@/lib/db';
import { AboutSection } from '@/lib/types';
import React from 'react'

const About = () => {
    const about = getSection<AboutSection>('about')!;
    return (
        <section id="about" className="py-24 px-10 bg-bg2">
            <div className="max-w-5xl mx-auto">
                
                <span className="font-mono text-xs text-amber tracking-widest uppercase block mb-4">01 — About</span>

                <h2
                    className="font-display font-extrabold text-white tracking-tight mb-12"
                    style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}
                >
                    Engineer, Founder,<br/>Problem Solver
                </h2>
                <div className="grid md:grid-cols-2 gap-16">
                    <div>
                        {about.bio.map((p, i) => (
                            <p
                                key={i}
                                className="text-text-muted text-sm leading-8 mb-5"
                                dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong class="text-text font-medium">$1</strong>') }}
                            />
                        ))}
                        <div className="inline-flex items-center gap-2 font-mono text-xs text-green-400
                                        bg-green-400/10 border border-green-400/25 px-4 py-1.5 rounded-full mt-4">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full pulse" />
                            {about.availability}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        {about.links.map(link => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener"
                                className="flex items-center justify-between bg-surface border border-border px-5 py-4 rounded-lg hover:border-amber hover:bg-surface2 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-md bg-surface2 flex items-center justify-center font-mono text-xs text-amber font-medium uppercase tracking-wider">
                                        {link.icon}
                                    </div>
                                    <div>
                                        <div className="text-sm text-white font-medium">{link.name}</div>
                                        <div className="font-mono text-xs text-text-subtle">{link.handle}</div>
                                    </div>
                                </div>
                                <span className="text-text-subtle">↗</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;