import React from 'react';
import Image from "next/image";
import { ContactSection } from '@/lib/types';
import { getSection } from '@/lib/db';

const NavBar = () => {
    const contact     = getSection<ContactSection>('contact')!;
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4
                              bg-bg/85 backdrop-blur-md border-b border-border/50">
        
            {/* <span className="font-display font-extrabold text-amber tracking-tight"> */}
            <span className="font-display font-extrabold text-white tracking-tight">
                <Image src="/logo.svg" alt="NR" width={25} height={25} className="inline-flex mr-2" />
                Niloy Rudra
            </span>
            
            <ul className="hidden md:flex gap-8 list-none">
                {['about','skills','langphy','experience','projects','contact'].map(s => (
                <li key={s}>
                    <a href={`#${s}`}
                        className="font-mono text-xs text-text-muted hover:text-amber transition-colors tracking-widest uppercase">
                    {s}
                    </a>
                </li>
                ))}
            </ul>
            <a href={`mailto:${contact.email}`}
                className="bg-amber text-black font-mono text-xs font-medium px-5 py-2 rounded
                            hover:bg-amber-light transition-colors tracking-wider">
                hire me →
            </a>
        </nav>
    );
}

export default NavBar