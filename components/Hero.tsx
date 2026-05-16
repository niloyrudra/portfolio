import { getSection } from '@/lib/db'
import { HeroSection } from '@/lib/types'
import React from 'react'

const Hero = () => {
    const hero = getSection<HeroSection>('hero')!
    return (
        <section id="hero" className="min-h-screen flex items-center pt-32 pb-20 px-10 relative overflow-hidden">
            <div className="hero-grid absolute inset-0" />
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(245,158,11,0.08)_0%,transparent_70%)] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10 w-full">
                <div className="inline-flex items-center gap-2 font-mono text-xs text-amber
                                bg-amber/10 border border-amber/20 px-4 py-1.5 rounded-full
                                tracking-widest mb-8">
                    <span className="w-1.5 h-1.5 bg-amber rounded-full pulse" />
                    Open to remote &amp; relocation
                </div>

                <h1 className="font-display font-extrabold leading-none tracking-tight text-white mb-6"
                    style={{ fontSize: 'clamp(3rem,7vw,6rem)' }}>
                    {hero.name.split(' ')[0]}<br/>
                    <span className="text-amber">{hero.name.split(' ')[1]}</span>
                </h1>

                <p className="font-mono text-text-muted tracking-wider mb-2"
                    style={{ fontSize: 'clamp(0.85rem,1.8vw,1rem)' }}>
                    <strong className="text-text font-medium">{hero.title} ({hero.subtitle})</strong>
                </p>

                <p className="font-mono text-text-muted max-w-2xl mb-10 leading-8"
                    style={{ fontSize: 'clamp(0.85rem,1.5vw,0.9rem)' }}>
                    {hero.tagline}
                </p>

                <div className="flex flex-wrap gap-4 mb-14">
                    <a
                    href="#langphy"
                        className="bg-amber text-black font-mono text-sm font-semibold
                                    px-7 py-3 rounded hover:bg-amber-light transition-all hover:-translate-y-0.5"
                    >
                        View Langphy Case Study
                    </a>
                    <a
                        href="#contact"
                        className="border border-border2 text-text font-mono text-sm
                                    px-7 py-3 rounded hover:border-amber hover:text-amber
                                    transition-all hover:-translate-y-0.5"
                    >
                        Get In Touch
                    </a>
                    {hero.cvUrl && (
                        <a
                            href={hero.cvUrl}
                            download
                            className="border border-border2 text-text font-mono text-sm px-7 py-3 rounded hover:border-amber hover:text-amber transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
                        >
                            <span>↓</span> Download CV
                        </a>
                    )}
                </div>

                <div className="flex flex-wrap gap-10 pt-8 border-t border-border">
                    {hero.stats.map((s, i) => (
                        <div key={i}>
                            <div className="font-display font-extrabold text-amber text-4xl tracking-tight">{s.num}</div>
                            <div className="font-mono text-xs text-text-subtle uppercase tracking-widest mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Hero;