import { getSection } from '@/lib/db';
import { ContactSection } from '@/lib/types';
import React from 'react'
import ContactForm from './ContactForm';

const Contact = () => {
    const contact = getSection<ContactSection>('contact')!;
    return (
        <section id="contact" className="py-24 px-10 bg-bg2">
            <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16">
                    {/* Left — copy + links */}
                    <div>
                        <span className="font-mono text-xs text-amber tracking-widest uppercase block mb-4">07 — Contact</span>

                        <h2 className="font-display font-extrabold text-white tracking-tight leading-tight mb-4"
                            style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)' }}>
                            {contact.heading}
                        </h2>

                        <p className="text-text-muted text-sm leading-8 mb-8">{contact.subheading}</p>

                        <a
                            href={`mailto:${contact.email}`}
                            className="font-mono text-amber text-base hover:opacity-80 transition-opacity block mb-6"
                        >
                            {contact.email}
                        </a>

                        <div className="flex flex-wrap gap-3">
                            {contact.links.map(link => (
                                <a
                                    key={link.id} href={link.url}
                                    target="_blank"
                                    rel="noopener"
                                    className="flex items-center gap-2 font-mono text-xs text-text
                                                bg-surface border border-border px-4 py-2.5 rounded-lg
                                                hover:border-amber hover:text-amber transition-all hover:-translate-y-0.5"
                                >
                                    <span className="uppercase tracking-wider">{link.icon}</span>
                                    {link.name}
                                </a>
                            ))}
                            {contact.phone && (
                                <a
                                    href={`tel:${contact.phone.replace(/\s/g, '')}`}
                                    className="flex items-center gap-2 font-mono text-xs text-text
                                                bg-surface border border-border px-4 py-2.5 rounded-lg
                                                hover:border-amber hover:text-amber transition-all hover:-translate-y-0.5"
                                >
                                    📞 {contact.phone}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right — contact form */}
                    <ContactForm />
                    
                </div>
            </div>
        </section>
    );
}

export default Contact