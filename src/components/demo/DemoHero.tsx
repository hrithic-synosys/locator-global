import Link from '@/components/country/CountryLink'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

export default function DemoHero() {
  return (
    <>
      <style>{`
        .dh-hero {
          position: relative; overflow: hidden;
          background: radial-gradient(120% 90% at 50% -10%, #eef3ff 0%, #ffffff 60%);
          padding: clamp(16px,2vw,28px) 28px clamp(24px,3vw,36px);
        }
        .dh-inner { max-width: var(--w-1180); margin: 0 auto; text-align: center; padding-top: clamp(8px,1.4vw,16px); }

        .dh-title { margin: 0; font-size: max(clamp(30px,4.4vw,52px), min(3.611vw, 75.4px)); font-weight: 800; line-height: 1.08; letter-spacing: -.03em; color: #1d1d1f; }
        .dh-title b { color: #1360ee; font-weight: 800; }

        .dh-crumbs { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 16px; font-size: var(--f-13); color: #6e6e73; }
        .dh-crumbs a { color: #6e6e73; text-decoration: none; font-weight: 600; transition: color .18s ease; }
        .dh-crumbs a:hover { color: #1360ee; }
        .dh-crumbs .cur { color: #1360ee; font-weight: 700; }
      `}</style>

      <section className="dh-hero">
        <SoftwareNavbar />
        <div className="dh-inner">
          <h1 className="dh-title">Get your <b>free demo</b></h1>
          <nav className="dh-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span className="cur">Get a Free Demo</span>
          </nav>
        </div>
      </section>
    </>
  )
}
