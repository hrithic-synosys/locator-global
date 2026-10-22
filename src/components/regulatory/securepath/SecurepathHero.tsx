import Link from '@/components/country/CountryLink'
import Image from 'next/image'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

export default function SecurepathHero() {
  return (
    <>
      <style href="sph-securepathhero" precedence="medium">{`
        .sph { background: #fff; }

        .sph-crumbs-bar { border-bottom: 1px solid #eef1f7; }
        .sph-crumbs {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          max-width: var(--w-1280); margin: 0 auto; padding: 16px 28px;
          font-size: var(--f-14); color: #6e6e73;
        }
        .sph-crumbs a { color: #1d1d1f; font-weight: 600; text-decoration: none; transition: color .18s ease; }
        .sph-crumbs a:hover { color: #1360ee; }
        .sph-crumbs svg { color: #b8bcc4; flex-shrink: 0; }
        .sph-crumbs .cur { color: #8e8e93; }

        .sph-photo { position: relative; overflow: hidden; height: clamp(300px, 38vw, 460px); background: #000105; }
        .sph-photo img { object-fit: cover; object-position: 66% center; }
        .sph-scrim {
          position: absolute; inset: 0; z-index: 1;
          background:
            linear-gradient(0deg, rgba(4,8,18,.52) 0%, rgba(4,8,18,.4) 32%, rgba(4,8,18,.26) 58%, rgba(4,8,18,.13) 80%, rgba(4,8,18,.04) 100%),
            linear-gradient(90deg, rgba(4,8,18,.38) 0%, rgba(4,8,18,.16) 40%, transparent 78%);
        }

        .sph-photo-body {
          position: relative; z-index: 2; height: 100%;
          display: flex; align-items: flex-end;
          max-width: var(--w-1280); margin: 0 auto; padding: 0 28px clamp(26px,4vw,46px);
        }
        .sph-content { max-width: min(660px, 100%); }

        .sph-title {
          margin: 0; font-size: clamp(28px, calc(2.5vw + 16px), 46px); font-weight: 800;
          line-height: 1.16; letter-spacing: -.022em; color: #ffffff;
          text-shadow: 0 2px 24px rgba(0,0,0,.4);
        }
        .sph-title-accent { color: #1360ee; }

        .sph-lead { margin: clamp(14px,1.6vw,18px) 0 0; max-width: 48ch; font-size: clamp(15px, 1.05vw, 17px); line-height: 1.72; color: rgba(255,255,255,.8); }

        .sph-ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: clamp(22px,3vw,30px); }
        .sph-btn {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 13px 22px; border-radius: 11px; text-decoration: none;
          font-size: var(--f-13-5); font-weight: 700; letter-spacing: .01em;
          transition: transform .18s ${EASE}, background .18s ${EASE}, box-shadow .18s ${EASE}, border-color .18s ${EASE};
        }
        .sph-btn-primary { background: #1360ee; color: #fff; border: 1.5px solid #1360ee; box-shadow: 0 12px 26px -10px rgba(19,96,238,.7); }
        .sph-btn-primary:hover { background: #0d4fd4; transform: translateY(-2px); box-shadow: 0 16px 32px -10px rgba(19,96,238,.8); }
        .sph-btn-ghost { background: rgba(255,255,255,.08); color: #fff; border: 1.5px solid rgba(255,255,255,.4); backdrop-filter: blur(6px); }
        .sph-btn-ghost:hover { background: rgba(255,255,255,.16); border-color: #fff; transform: translateY(-2px); }

        @media (max-width: 768px) {
          .sph-photo { height: auto; min-height: clamp(300px, 38vw, 460px); }
          .sph-photo-body {
            height: auto;
            padding-top: clamp(28px, 7vw, 44px);
            padding-bottom: clamp(28px, 7vw, 44px);
          }
        }
        @media (max-width: 640px) {
          .sph-ctas { flex-direction: column; align-items: stretch; }
          .sph-btn { justify-content: center; }
        }
      `}</style>

      <section className="sph">
        <SoftwareNavbar />

        <div className="sph-crumbs-bar">
          <nav className="sph-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6 6 6-6 6" />
            </svg>
            <Link href="/regulatory">Regulatory GPS Certifications</Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6 6 6-6 6" />
            </svg>
            <span className="cur">SecurePath</span>
          </nav>
        </div>

        <div className="sph-photo" data-reveal>
          <Image
            src="/regulatory/securepath/securepath-hero-banner.webp"
            alt="Aerial night view of a Dubai highway interchange, representing SecurePath's real-time GPS-tracked vehicle network"
            fill
            priority
            sizes="100vw"
          />
          <div className="sph-scrim" />
          <div className="sph-photo-body">
            <div className="sph-content">
              <h1 className="sph-title">
                <span className="sph-title-accent">SecurePath:</span> Your Trusted and Approved Vendor for Reliable GPS Solutions
              </h1>
              <p className="sph-lead">Try Out SecurePath GPS System from LOCATOR Today</p>
              <div className="sph-ctas">
                <Link href="/get-a-quote" className="sph-btn sph-btn-primary">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 10h16M10 4v16" />
                  </svg>
                  Get a Free Quote
                </Link>
                <Link href="/get-a-free-demo" className="sph-btn sph-btn-ghost">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Get a Free Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
