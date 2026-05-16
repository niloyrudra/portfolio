import { getSection } from '@/lib/db';
import { Cert } from '@/lib/types';
import React from 'react'

const Certs = () => {
    const certs = getSection<Cert[]>('certs')!;
    return (
        <section id="certs" className="py-24 px-10 bg-bg2">
            <div className="max-w-5xl mx-auto">
                <span className="font-mono text-xs text-amber tracking-widest uppercase block mb-4">05 — Certifications</span>
                <h2 className="font-display font-extrabold text-white tracking-tight mb-12"
                    style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
                    Learning &amp; Credentials
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {certs.map(c => (
                    <div key={c.id}
                        className="bg-surface border border-border rounded-xl p-5 hover:border-amber transition-colors">
                        <div className="font-mono text-xs text-amber uppercase tracking-widest mb-2">{c.issuer}</div>
                        <div className="text-sm text-white font-medium leading-snug mb-3">{c.name}</div>
                        <div className="font-mono text-xs text-text-subtle">{c.date}</div>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Certs;