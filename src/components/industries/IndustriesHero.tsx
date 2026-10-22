import Image from 'next/image'
import Link from '@/components/country/CountryLink'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

export default function IndustriesHero() {
  return (
    <>
      <style>{`
        .ih-hero { background: #fff; }

        /* ── Breadcrumb strip — plain white bar above the photo ── */
        .ih-crumbs-bar { border-bottom: 1px solid #eef1f7; }
        .ih-crumbs {
          display: flex; align-items: center; gap: 8px;
          max-width: var(--w-1280); margin: 0 auto; padding: 16px 28px;
          font-size: var(--f-14); color: #6e6e73;
        }
        .ih-crumbs a { color: #1d1d1f; font-weight: 600; text-decoration: none; transition: color .18s ease; }
        .ih-crumbs a:hover { color: #1360ee; }
        .ih-crumbs svg { color: #b8bcc4; flex-shrink: 0; }
        .ih-crumbs span { color: #8e8e93; }

        /* ── Photo band ── */
        .ih-photo {
          position: relative; overflow: hidden;
          height: clamp(240px, 30vw, 360px);
        }
        .ih-photo img { object-fit: cover; }
        .ih-scrim {
          position: absolute; inset: 0; z-index: 1;
          background:
            linear-gradient(0deg, rgba(4,8,18,.88) 0%, rgba(4,8,18,.5) 42%, rgba(4,8,18,.18) 68%, rgba(4,8,18,.05) 100%);
        }

        .ih-photo-body {
          position: relative; z-index: 2; height: 100%;
          display: flex; align-items: flex-end;
          max-width: var(--w-1280); margin: 0 auto; padding: 0 28px clamp(28px,4.5vw,52px);
        }
        .ih-content { max-width: min(760px, 90vw); }

        .ih-title {
          margin: 0; font-size: max(clamp(32px,5.2vw,64px), min(4.444vw, 92.8px)); font-weight: 800;
          text-transform: uppercase; line-height: 1.04; letter-spacing: -.01em;
          color: #fff; text-shadow: 0 4px 26px rgba(0,0,0,.3);
        }

        .ih-lead { margin: 18px 0 0; max-width: 62ch; font-size: max(clamp(14.5px,1.3vw,17px), min(1.181vw, 24.65px)); line-height: 1.72; color: rgba(255,255,255,.86); }
      `}</style>

      <section className="ih-hero">
        <SoftwareNavbar />

        <div className="ih-crumbs-bar">
          <nav className="ih-crumbs" aria-label="Breadcrumb">
            <Link href="/">Homepage</Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6 6 6-6 6" />
            </svg>
            <span>Industries</span>
          </nav>
        </div>

        <div className="ih-photo" data-reveal>
          <Image
            src="/industries/cover.webp"
            alt="Connected fleets across UAE industries"
            fill
            priority
            sizes="100vw"
          />
          <div className="ih-scrim" />
          <div className="ih-photo-body">
            <div className="ih-content">
              <h1 className="ih-title">Industries</h1>
              <p className="ih-lead">
                The world we live in today is connected. Inspired by the businesses we work with every day,
                we share how Locator&rsquo;s GPS tracking, video telematics, and IoT platform support fleets
                across every sector in the UAE.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
