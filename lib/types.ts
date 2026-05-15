// ─── Public Content Types ───────────────────────────────────

export interface StatItem { num: string; label: string }

export interface HeroSection {
  name: string
  title: string
  subtitle: string
  tagline: string
  stats: StatItem[]
  cvUrl: string
}

export interface AboutSection {
  bio: string[]           // array of paragraph strings
  availability: string   // e.g. "Available for remote · contract · relocation"
  links: ProfileLink[]
}

export interface ProfileLink {
  id: string
  name: string
  handle: string
  url: string
  icon: string           // short text label e.g. "in", "gh"
}

export interface SkillTag { label: string; highlight: boolean }

export interface SkillCard {
  id: string
  category: string
  icon: string           // emoji
  tags: SkillTag[]
}

export interface ExperienceItem {
  id: string
  role: string
  company: string
  location: string
  startDate: string
  endDate: string        // "Present" if current
  current: boolean
  badge?: string         // e.g. "★ Founder & Sole Engineer"
  bullets: string[]      // each bullet as a string
}

export interface LangphySection {
  label: string
  title: string
  titleHighlight: string  // part of title to colour amber
  desc: string
  metrics: { num: string; label: string }[]
}

export interface Project {
  id: string
  name: string
  desc: string
  tags: string[]
  stack: string[]
  featured: boolean
}

export interface Cert {
  id: string
  issuer: string
  name: string
  date: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  platform: string
  initials: string
}

export interface ContactSection {
  heading: string
  subheading: string
  email: string
  phone: string
  links: ProfileLink[]
}

// ─── DB Row Types ────────────────────────────────────────────

export interface SectionRow {
  key: string
  value: string          // JSON string
  updated_at: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string
  message: string
  read: number           // 0 | 1
  created_at: string
}

// ─── Full Site Data ──────────────────────────────────────────

export interface SiteData {
  hero: HeroSection
  about: AboutSection
  skills: SkillCard[]
  experience: ExperienceItem[]
  langphy: LangphySection
  projects: Project[]
  certs: Cert[]
  testimonials: Testimonial[]
  contact: ContactSection
}
