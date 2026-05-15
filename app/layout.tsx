import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      // { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      // { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ]
  },
  title: 'Niloy Rudra — Full-Stack Engineer (Node.js · React Native · AI/NLP)',
  description:
    'Full-Stack Engineer with 7+ years building production-grade, cloud-native systems. Founder of Langphy. Open to remote & relocation.',
  openGraph: {
    title: 'Niloy Rudra — Full-Stack Engineer',
    description: 'Node.js · React Native · AI/NLP | Founder @Langphy | 22-Service Distributed System',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://niloyrudra.com',
    siteName: 'Niloy Rudra Portfolio',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
