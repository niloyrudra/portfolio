import NavBar from '@/components/NavBar'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import Contact from '@/components/Contact'
import Testimonials from '@/components/Testimonials'
import Certs from '@/components/Certs'
import Projects from '@/components/Projects'
import Experiences from '@/components/Experiences'
import LangphyCaseStudy from '@/components/LangphyCaseStudy'
import Skills from '@/components/Skills'
import About from '@/components/About'

// Force dynamic — never cache, always fresh from DB
export const dynamic = 'force-dynamic'

const Home = () => (
  <>
    {/* ── NAV ── */}
    <NavBar />

    {/* ── HERO ── */}
    <Hero />

    {/* ── ABOUT ── */}
    <About />

    {/* ── SKILLS ── */}
    <Skills />

    {/* ── LANGPHY ── */}
    <LangphyCaseStudy />

    {/* ── EXPERIENCE ── */}
    <Experiences />

    {/* ── PROJECTS ── */}
    <Projects />

    {/* ── CERTS ── */}
    <Certs />

    {/* ── TESTIMONIALS ── */}
    <Testimonials />

    {/* ── CONTACT ── */}
    <Contact />
  
    {/* ── FOOTER ── */}
    <Footer />
  </>
);
export default  Home;
