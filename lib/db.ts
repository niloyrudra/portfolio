/**
 * lib/db.ts
 *
 * Pure Node.js JSON file storage — no native modules, no compilation.
 * Replaces better-sqlite3 so the app works on A2Hosting shared hosting.
 *
 * Content → data/content.json
 * Messages → data/messages.json
 * Both use atomic write (write tmp → rename) to prevent corruption.
 */
import fs from 'fs'
import path from 'path'
import type { ContactMessage } from './types'

// Allow DATA_DIR override via env so the absolute path works on shared hosting
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), 'data')

const CONTENT_PATH  = path.join(DATA_DIR, 'content.json')
const MESSAGES_PATH = path.join(DATA_DIR, 'messages.json')

function ensureDir(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

/** Atomic write: write to .tmp then rename — prevents partial-write corruption */
function atomicWrite(filePath: string, data: unknown): void {
  ensureDir()
  const tmp = filePath + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8')
  fs.renameSync(tmp, filePath)
}

// ─── Content helpers ─────────────────────────────────────────

function readContent(): Record<string, unknown> {
  ensureDir()
  if (!fs.existsSync(CONTENT_PATH)) {
    const seeded = buildSeedData()
    atomicWrite(CONTENT_PATH, seeded)
    return seeded
  }
  try {
    return JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf-8'))
  } catch {
    return {}
  }
}

export function getSection<T>(key: string): T | null {
  const content = readContent()
  return key in content ? (content[key] as T) : null
}

export function setSection(key: string, data: unknown): void {
  const content = readContent()
  content[key] = data
  atomicWrite(CONTENT_PATH, content)
}

export function getAllSections(): Record<string, unknown> {
  return readContent()
}

// ─── Messages helpers ─────────────────────────────────────────

interface MessageStore {
  nextId: number
  items: ContactMessage[]
}

function readMessages(): MessageStore {
  ensureDir()
  if (!fs.existsSync(MESSAGES_PATH)) return { nextId: 1, items: [] }
  try {
    return JSON.parse(fs.readFileSync(MESSAGES_PATH, 'utf-8'))
  } catch {
    return { nextId: 1, items: [] }
  }
}

function writeMessages(store: MessageStore): void {
  atomicWrite(MESSAGES_PATH, store)
}

export function insertContact(
  name: string, email: string, subject: string, message: string
): number {
  const store = readMessages()
  const id    = store.nextId
  store.items.push({ id, name, email, subject, message, read: 0, created_at: new Date().toISOString() })
  store.nextId = id + 1
  writeMessages(store)
  return id
}

export function getMessages(limit = 50): ContactMessage[] {
  return readMessages()
    .items
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
}

export function markMessageRead(id: number): void {
  const store = readMessages()
  const msg   = store.items.find(m => m.id === id)
  if (msg) { msg.read = 1; writeMessages(store) }
}

export function deleteMessage(id: number): void {
  const store  = readMessages()
  store.items  = store.items.filter(m => m.id !== id)
  writeMessages(store)
}

// ─── Seed data ────────────────────────────────────────────────

function buildSeedData(): Record<string, unknown> {
  return {
    hero: {
      name: 'Niloy Rudra',
      title: 'Full-Stack Engineer',
      subtitle: 'Node.js · React Native · AI/NLP',
      tagline: '7+ years building production-grade, cloud-native systems · Founder of Langphy (22-service distributed system) · Delivered for clients in 🇩🇪 🇬🇧 🇺🇸',
      cvUrl: '/Niloy-Rudra-CV.pdf',
      stats: [
        { num: '7+',   label: 'Years Experience' },
        { num: '180+', label: 'Projects Delivered' },
        { num: '22',   label: 'Microservices (Langphy)' },
        { num: '3',    label: 'Countries Served' },
      ],
    },

    about: {
      bio: [
        "I'm a Full-Stack Engineer with 7+ years of experience building production-grade, cloud-native systems for global startups and enterprises — across SaaS, HealthTech, real estate, and AI domains.",
        "My most ambitious work to date: I independently designed, architected, and shipped Langphy — an offline-first German language learning app backed by 22 deployed microservices (17 Node.js + 2 Python), Kafka event streaming, PostgreSQL, MongoDB, Redis, and a real-time NLP/speech evaluation pipeline (Faster-Whisper + spaCy).",
        "I've delivered projects for clients in Germany, the UK, and the US, and I thrive in async, cross-timezone teams. I hold an IBM AI Engineering certification (Coursera, 2025) and bring advanced English plus basic German to the table.",
      ],
      availability: 'Available for full-time remote · contract · relocation',
      links: [
        { id: '1', name: 'LinkedIn', handle: 'niloy-rudra-dev',          url: 'https://www.linkedin.com/in/niloy-rudra-dev/',                    icon: 'in'  },
        { id: '2', name: 'GitHub',   handle: 'niloyrudra',               url: 'https://github.com/niloyrudra',                                   icon: 'gh'  },
        { id: '3', name: 'Fiverr',   handle: '180+ completed orders',    url: 'https://www.fiverr.com/niloyrudra',                               icon: 'fvr' },
        { id: '4', name: 'Upwork',   handle: 'Senior Full-Stack Engineer',url: 'https://www.upwork.com/freelancers/~012bf0d8487f95e17b',          icon: 'up'  },
        { id: '5', name: 'Xing',     handle: 'Niloy_Rudra',              url: 'https://www.xing.com/profile/Niloy_Rudra/cv',                     icon: 'xg'  },
      ],
    },

    skills: [
      { id: '1', category: 'Mobile / Frontend',       icon: '📱', tags: [
          { label: 'React Native', highlight: true  }, { label: 'Expo',        highlight: true  },
          { label: 'Next.js',      highlight: false }, { label: 'React',       highlight: false },
          { label: 'TypeScript',   highlight: false }, { label: 'Tailwind CSS',highlight: false },
          { label: 'React Query',  highlight: false }, { label: 'Redux',       highlight: false },
          { label: 'Zustand',      highlight: false }, { label: 'Context API', highlight: false },
        ],
      },
      { id: '2', category: 'Backend / APIs',          icon: '⚙️', tags: [
          { label: 'Node.js',    highlight: true  }, { label: 'NestJS',   highlight: true  },
          { label: 'TypeScript', highlight: true  }, { label: 'Express',  highlight: false },
          { label: 'Python',     highlight: false }, { label: 'FastAPI',  highlight: false },
          { label: 'Django',     highlight: false }, { label: 'GraphQL',  highlight: false },
          { label: 'REST APIs',  highlight: false },
        ],
      },
      { id: '3', category: 'AI / NLP / ML',           icon: '🤖', tags: [
          { label: 'LLM Orchestration', highlight: true  }, { label: 'spaCy NLP',       highlight: true  },
          { label: 'Whisper STT',       highlight: true  }, { label: 'Agent Workflows', highlight: false },
          { label: 'PyTorch',           highlight: false }, { label: 'TensorFlow',      highlight: false },
          { label: 'NLP Pipelines',     highlight: false }, { label: 'Rubric Eval',     highlight: false },
        ],
      },
      { id: '4', category: 'Databases',               icon: '🗄️', tags: [
          { label: 'PostgreSQL', highlight: true  }, { label: 'MongoDB',  highlight: true  },
          { label: 'Redis',      highlight: false }, { label: 'MySQL',    highlight: false },
          { label: 'Firebase',   highlight: false }, { label: 'SQLite',   highlight: false },
          { label: 'Supabase',   highlight: false },
        ],
      },
      { id: '5', category: 'DevOps / Infrastructure', icon: '☁️', tags: [
          { label: 'Docker',     highlight: true  }, { label: 'Kubernetes', highlight: true  },
          { label: 'Kafka',      highlight: true  }, { label: 'AWS',        highlight: false },
          { label: 'RabbitMQ',   highlight: false }, { label: 'Railway',    highlight: false },
          { label: 'CI/CD',      highlight: false }, { label: 'Linux',      highlight: false },
        ],
      },
      { id: '6', category: 'Security / Integrations', icon: '🔐', tags: [
          { label: 'OAuth2 / JWT', highlight: true  }, { label: 'Stripe',    highlight: false },
          { label: 'Twilio',       highlight: false }, { label: 'WebSockets',highlight: false },
          { label: 'WebRTC',       highlight: false }, { label: 'Jest',      highlight: false },
          { label: 'Cypress',      highlight: false }, { label: 'Postman',   highlight: false },
        ],
      },
    ],

    experience: [
      {
        id: '1', role: 'Founder & Full-Stack Engineer', company: 'Langphy — AI-Powered German Learning App',
        location: 'Dhaka, Bangladesh', startDate: 'Mar 2025', endDate: 'Present', current: true,
        badge: '★ Founder & Sole Engineer',
        bullets: [
          'Sole technical founder — designed, architected, and shipped the entire stack end-to-end (mobile → backend → infra)',
          'Built a multi-step NLP pipeline (Audio → Whisper → spaCy → adaptive rubric feedback) achieving ~90% feedback consistency',
          'Delivered React Native app (Context API + React Query) for iOS/Android; reduced API response times 40% via Node.js microservices',
          'Deployed 22-service infrastructure with Docker, Kubernetes, Kafka; automated quality checks with Jest, improving pipeline accuracy by 35%',
        ],
      },
      {
        id: '2', role: 'Freelance Senior Full-Stack Engineer', company: 'Fiverr · Upwork',
        location: 'Remote (USA, Germany, UK, International)', startDate: 'Jan 2018', endDate: 'Present', current: true,
        bullets: [
          'Completed 180+ diverse projects across Node.js, React Native, Next.js, WordPress, and Shopify for international clients',
          'Built and deployed scalable backend systems; improved REST API performance by up to 50% and refactored monoliths into microservices',
          'Deployed cloud infrastructure on AWS with Docker; integrated Stripe, Twilio, and WebSockets',
          'Converted Figma designs into production-ready React and React Native components for international UI/UX teams',
        ],
      },
      {
        id: '3', role: 'Full-Stack Developer (Freelance)', company: 'Irish Pure',
        location: 'Berlin, Germany', startDate: 'May 2022', endDate: 'Jul 2024', current: false,
        bullets: [
          'Built the company website in WordPress and a React Native app consuming the WP REST API',
          'Refactored React Native codebase, reducing app load time by 30% and improving UI performance',
          'Integrated a robust Cart System driving a 25% increase in upsell revenue',
          'Managed client-state with Redux for property listing workflows and real-time data handling',
        ],
      },
      {
        id: '4', role: 'Software Developer (Remote)', company: 'Ahom Limited',
        location: 'Manchester, United Kingdom', startDate: 'Aug 2021', endDate: 'Nov 2023', current: false,
        bullets: [
          'Pioneered WordPress website development, optimizing performance by 20%',
          'Led Agile-based development, increasing team productivity by 15%',
          'Protected server from DoS/DDoS attacks in 2022, achieving a 90% security enhancement',
          'Developed an intuitive real-estate app interface, resulting in a 20% increase in user engagement',
        ],
      },
      {
        id: '5', role: 'Full-Stack Developer', company: 'Joysan Yoga & Wellness Center',
        location: 'Dhaka, Bangladesh', startDate: 'Jan 2022', endDate: 'Nov 2023', current: false,
        bullets: [
          'Developed a multiplatform mobile app integrating web services for yoga training, online classes, and webinars',
          'Implemented an intuitive booking system, resulting in a 30% increase in user engagement',
          'Designed user-friendly interfaces, contributing to a 25% improvement in user satisfaction and retention',
        ],
      },
    ],

    langphy: {
      label: '★ Flagship Project — 2025',
      title: 'Langphy: 22-Service',
      titleHighlight: 'Distributed Language Platform',
      desc: 'An offline-first German language learning app I designed, architected, and shipped solo — every layer, from mobile client to distributed backend to infrastructure. A real-time NLP/speech evaluation pipeline powers adaptive feedback at scale.',
      metrics: [
        { num: '22',  label: 'Microservices' },
        { num: '90%', label: 'Feedback Consistency' },
        { num: '40%', label: 'API Latency Reduction' },
        { num: '35%', label: 'Pipeline Accuracy Gain' },
      ],
    },

    projects: [
      { id: '1', name: 'Langphy — German Learning App', featured: true,  tags: ['Featured','AI/NLP','React Native'],  desc: 'Offline-first language learning app with a 22-service distributed backend and real-time NLP speech evaluation pipeline. Built solo from mobile UI to infrastructure.', stack: ['React Native','NestJS','Kafka','spaCy','Whisper','Docker','K8s'] },
      { id: '2', name: 'TOGS — Social Event Management',  featured: false, tags: ['Social / Events','React Native'],    desc: 'Cross-platform React Native app for event hosting, social feeds, and real-time notifications with interactive social feed including likes, comments, and media sharing.', stack: ['React Native','TypeScript','Context API','REST APIs','WebRTC'] },
      { id: '3', name: 'Daily-Check — Elder Care App',    featured: false, tags: ['HealthTech','React Native'],         desc: 'Cross-platform React Native app built for elders with automated check-in and escalation workflows. Integrated Stripe, Firebase, and Twilio for payments and real-time communication.', stack: ['React Native','Firebase','Stripe','Twilio','Cron Jobs'] },
      { id: '4', name: 'WeNeed — Social Meet-up App',     featured: false, tags: ['Social','React Native'],             desc: 'React Native social meetup platform connecting users through shared interests and events. GDPR-ready with WebRTC video/chat, real-time messaging, and role-based access.', stack: ['React Native','React Query','WebRTC','OAuth2','JWT'] },
      { id: '5', name: 'Ahuse — Real Estate App',         featured: false, tags: ['Real Estate','Hybrid App'],          desc: 'Hybrid real-estate app with custom WordPress REST API endpoints. Achieved a 20% increase in user engagement and 30% reduction in load times.', stack: ['React Native','WordPress REST API','Redux'] },
      { id: '6', name: 'Event Management System',         featured: false, tags: ['Events','Full-Stack'],               desc: 'Full event management system with QR ticketing, registration, guest passes, and entry/exit tracking. React Admin panel with OAuth2 authentication.', stack: ['React.js','PHP REST API','MySQL','QR Validation','OAuth2'] },
    ],

    certs: [
      { id: '1', issuer: 'IBM · Coursera', name: 'IBM AI Engineering with Python, PyTorch & TensorFlow',      date: 'July 2025' },
      { id: '2', issuer: 'Coursera',       name: 'Gen AI Foundational Models for NLP & Language Understanding', date: '2024' },
      { id: '3', issuer: 'Coursera',       name: 'Deep Learning with PyTorch',                                  date: '2024' },
      { id: '4', issuer: 'Udemy',          name: 'React Native — The Practical Guide',                          date: 'Oct 2020' },
      { id: '5', issuer: 'Udemy',          name: 'Learn JavaScript: Full-Stack from Scratch',                   date: 'Aug 2019 – Aug 2020' },
      { id: '6', issuer: 'Udemy',          name: 'Data Structures + Algorithms',                                date: 'May – Jun 2020' },
    ],

    testimonials: [
      { id: '1', quote: 'He delivered very quickly. We worked together until the work was 100% perfect. He even helped me with additional items beyond the scope.',           author: 'Aaro Nova',       platform: 'Fiverr Client', initials: 'AA' },
      { id: '2', quote: "This seller is Forever amazing. He's always after client satisfaction. I will order over and over again. Thanks!",                                  author: 'Sammy Sterling',  platform: 'Fiverr Client', initials: 'SS' },
      { id: '3', quote: 'Niloy is a dream to work with. I am a very picky customer. He listens, is patient, and consistently delivers results that exceed expectations.',    author: 'Elvis',           platform: 'Fiverr Client', initials: 'EL' },
      { id: '4', quote: 'He made himself quite available and was diligent in completing the work. He conducted himself in a very professional manner throughout.',             author: 'Tony Abraham',    platform: 'Fiverr Client', initials: 'TA' },
      { id: '5', quote: 'Such a patient pro at what he does. Will most definitely be working with Niloy Rudra again!',                                                       author: 'Creativ Amentis', platform: 'Fiverr Client', initials: 'CA' },
    ],

    contact: {
      heading: "Let's Build Something Production-Grade",
      subheading: 'Open to full-time remote roles, freelance contracts, and relocation opportunities. I work best in async, cross-timezone environments with ambitious teams building real products.',
      email: 'contact@niloyrudra.com',
      phone: '+880 1761 729 260',
      links: [
        { id: '1', name: 'LinkedIn', handle: 'niloy-rudra-dev', url: 'https://www.linkedin.com/in/niloy-rudra-dev/',           icon: 'in'  },
        { id: '2', name: 'GitHub',   handle: 'niloyrudra',      url: 'https://github.com/niloyrudra',                          icon: 'gh'  },
        { id: '3', name: 'Fiverr',   handle: 'niloyrudra',      url: 'https://www.fiverr.com/niloyrudra',                      icon: 'fvr' },
        { id: '4', name: 'Upwork',   handle: 'Profile',         url: 'https://www.upwork.com/freelancers/~012bf0d8487f95e17b', icon: 'up'  },
      ],
    },
  }
}
