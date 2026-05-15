import { getSection } from '@/lib/db'
import type {
  HeroSection, AboutSection, SkillCard, ExperienceItem,
  LangphySection, Project, Cert, Testimonial, ContactSection,
} from '@/lib/types'
import ContactForm from '@/components/ContactForm'
import Image from 'next/image'

// Force dynamic — never cache, always fresh from DB
export const dynamic = 'force-dynamic'

export default function Home() {
  const hero        = getSection<HeroSection>('hero')!
  const about       = getSection<AboutSection>('about')!
  const skills      = getSection<SkillCard[]>('skills')!
  const experience  = getSection<ExperienceItem[]>('experience')!
  const langphy     = getSection<LangphySection>('langphy')!
  const projects    = getSection<Project[]>('projects')!
  const certs       = getSection<Cert[]>('certs')!
  const testimonials = getSection<Testimonial[]>('testimonials')!
  const contact     = getSection<ContactSection>('contact')!

  return (
    <>
      {/* ── NAV ── */}
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

      {/* ── HERO ── */}
      <section id="hero" className="min-h-screen flex items-center pt-32 pb-20 px-10 relative overflow-hidden">
        <div className="hero-grid absolute inset-0" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px]
                        bg-[radial-gradient(ellipse,rgba(245,158,11,0.08)_0%,transparent_70%)] pointer-events-none" />
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
            <a href="#langphy"
               className="bg-amber text-black font-mono text-sm font-semibold
                          px-7 py-3 rounded hover:bg-amber-light transition-all hover:-translate-y-0.5">
              View Langphy Case Study
            </a>
            <a href="#contact"
               className="border border-border2 text-text font-mono text-sm
                          px-7 py-3 rounded hover:border-amber hover:text-amber
                          transition-all hover:-translate-y-0.5">
              Get In Touch
            </a>
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

      {/* ── ABOUT ── */}
      <section id="about" className="py-24 px-10 bg-bg2">
        <div className="max-w-5xl mx-auto">
          <span className="font-mono text-xs text-amber tracking-widest uppercase block mb-4">01 — About</span>
          <h2 className="font-display font-extrabold text-white tracking-tight mb-12"
              style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
            Engineer, Founder,<br/>Problem Solver
          </h2>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              {about.bio.map((p, i) => (
                <p key={i} className="text-text-muted text-sm leading-8 mb-5"
                   dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong class="text-text font-medium">$1</strong>') }} />
              ))}
              <div className="inline-flex items-center gap-2 font-mono text-xs text-green-400
                              bg-green-400/10 border border-green-400/25 px-4 py-1.5 rounded-full mt-4">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full pulse" />
                {about.availability}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {about.links.map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener"
                   className="flex items-center justify-between bg-surface border border-border
                              px-5 py-4 rounded-lg hover:border-amber hover:bg-surface2 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-surface2 flex items-center justify-center
                                    font-mono text-xs text-amber font-medium uppercase tracking-wider">
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

      {/* ── SKILLS ── */}
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
                  <div className="w-10 h-10 rounded-lg bg-amber/10 border border-amber/20
                                  flex items-center justify-center text-xl">
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
                              : 'bg-surface2 border border-border2 text-text-muted'}`}>
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LANGPHY ── */}
      <section id="langphy" className="py-24 px-10 bg-bg3 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-mono text-xs text-amber tracking-widest uppercase block mb-3">
                {langphy.label}
              </span>
              <h2 className="font-display font-extrabold text-white tracking-tight leading-tight mb-6"
                  style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)' }}>
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
                {[
                  { label: 'Node.js Services (17)', items: ['auth-svc','user-svc','lesson-svc','progress-svc','vocab-svc','grammar-svc','+11 more'], cls: 'bg-blue-400/12 border-blue-400/25 text-blue-400' },
                  { label: 'Python / AI Services (2)', items: ['nlp-eval-svc (spaCy)','speech-svc (Whisper)'], cls: 'bg-teal-400/12 border-teal-400/25 text-teal-400' },
                  { label: 'Messaging / Infra', items: ['Kafka','Docker','Kubernetes','Railway'], cls: 'bg-amber/8 border-amber/20 text-amber' },
                  { label: 'Data Layer', items: ['PostgreSQL','MongoDB','Redis'], cls: 'bg-green-400/10 border-green-400/20 text-green-400' },
                ].map(group => (
                  <div key={group.label}>
                    <div className="font-mono text-xs text-text-subtle mb-2">{group.label}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map(item => (
                        <span key={item}
                              className={`font-mono text-xs px-2 py-1 rounded border ${group.cls}`}>
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="border-t border-border mt-3" />
                  </div>
                ))}
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

      {/* ── EXPERIENCE ── */}
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
                <div className={`absolute -left-[2.45rem] top-1.5 w-3 h-3 rounded-full border-2
                  ${exp.current ? 'bg-amber border-amber' : 'bg-bg2 border-amber/60'}`} />
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

      {/* ── PROJECTS ── */}
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
                       : 'border-border hover:border-amber'}`}>
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

      {/* ── CERTS ── */}
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

      {/* ── TESTIMONIALS ── */}
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

      {/* ── CONTACT ── */}
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
              <a href={`mailto:${contact.email}`}
                 className="font-mono text-amber text-base hover:opacity-80 transition-opacity block mb-6">
                {contact.email}
              </a>
              <div className="flex flex-wrap gap-3">
                {contact.links.map(link => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener"
                     className="flex items-center gap-2 font-mono text-xs text-text
                                bg-surface border border-border px-4 py-2.5 rounded-lg
                                hover:border-amber hover:text-amber transition-all hover:-translate-y-0.5">
                    <span className="uppercase tracking-wider">{link.icon}</span>
                    {link.name}
                  </a>
                ))}
                {contact.phone && (
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`}
                     className="flex items-center gap-2 font-mono text-xs text-text
                                bg-surface border border-border px-4 py-2.5 rounded-lg
                                hover:border-amber hover:text-amber transition-all hover:-translate-y-0.5">
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

      {/* ── FOOTER ── */}
      <footer className="bg-bg border-t border-border py-8 px-10 text-center">
        <p className="font-mono text-xs text-text-subtle tracking-wider">
          © {new Date().getFullYear()} Niloy Rudra · Full-Stack Engineer (Node.js · React · React Native · AI/NLP) · Dhaka, Bangladesh
        </p>
      </footer>
    </>
  )
}
