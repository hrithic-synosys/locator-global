import Link from '@/components/country/CountryLink'
import Image from 'next/image'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

export default function SmartIotHero() {
  return (
    <>
      <style>{`
        .si-hero {
          position: relative;
          overflow: hidden;
          background: #000;
          display: flex;
          flex-direction: column;
          min-height: clamp(400px, 46vh, 520px);
        }

        /* Full-bleed background — image covers the ENTIRE section */
        .si-photo { position: absolute; inset: 0; z-index: 0; }
        .si-photo img { object-fit: cover; object-position: right center; }

        /* Left-side scrim so text stays readable over the dark image */
        .si-scrim {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(90deg,
            rgba(0,0,0,.72) 0%,
            rgba(0,0,0,.55) 30%,
            rgba(0,0,0,.10) 62%,
            rgba(0,0,0,0) 100%
          );
        }

        .si-navwrap { position: relative; z-index: 3; }

        .si-body {
          position: relative; z-index: 2; flex: 1;
          display: flex; align-items: center;
          padding: clamp(20px,3vw,36px) 28px clamp(40px,5vw,60px);
        }
        .si-inner { max-width: var(--w-1280); width: 100%; margin: 0 auto; }
        .si-content { max-width: min(660px, 100%); }

        @keyframes siRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: no-preference) { .si-anim { opacity: 0; animation: siRise .8s ${EASE} forwards; } }

        /* Back breadcrumb */
        .si-back {
          display: inline-flex; align-items: center; gap: 6px; margin-bottom: 20px;
          color: rgba(255,255,255,.7); font-size: var(--f-13); font-weight: 600;
          text-decoration: none; transition: color .18s ease, gap .18s ease;
        }
        .si-back:hover { color: #fff; gap: 9px; }

        /* Eyebrow */
        .si-eyebrow {
          display: block;
          font-size: max(clamp(11px,1vw,13px), min(.9vw, 18px));
          font-weight: 800; letter-spacing: .1em;
          color: #5b9fff; text-transform: uppercase; margin-bottom: 16px;
        }
        .si-eyebrow-bar {
          display: block; width: 34px; height: 3px;
          background: #1360ee; border-radius: 2px; margin-bottom: 10px;
        }

        /* Heading */
        .si-title {
          margin: 0;
          font-size: clamp(28px, calc(2.5vw + 16px), 46px);
          font-weight: 800; line-height: 1.16; letter-spacing: -.022em;
          color: #ffffff;
        }
        .si-title em { font-style: normal; color: #5b9fff; }

        /* Lead */
        .si-lead {
          margin: clamp(14px,1.6vw,18px) 0 0; max-width: 48ch;
          font-size: clamp(15px, 1.05vw, 17px);
          line-height: 1.72; color: rgba(255,255,255,.75);
        }

        /* CTAs */
        .si-cta-row { display: flex; gap: 14px; margin-top: clamp(20px,2.4vw,28px); flex-wrap: wrap; }
        .si-btn {
          font-family: inherit; font-size: var(--f-14); font-weight: 700; cursor: pointer;
          padding: 14px 24px; border-radius: 11px; border: 1.5px solid transparent;
          transition: .18s ${EASE};
          display: inline-flex; align-items: center; gap: 9px; text-decoration: none;
        }
        .si-btn svg { transition: transform .18s ${EASE}; flex-shrink: 0; }
        .si-btn:hover svg { transform: translateX(3px); }
        .si-btn-primary { background: #1360ee; color: #fff; box-shadow: 0 10px 24px rgba(19,96,238,.4); }
        .si-btn-primary:hover { background: #0d4fd4; transform: translateY(-1px); box-shadow: 0 12px 30px rgba(19,96,238,.55); }
        .si-btn-ghost { background: rgba(255,255,255,.12); color: #fff; border-color: rgba(255,255,255,.3); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
        .si-btn-ghost:hover { border-color: rgba(255,255,255,.7); background: rgba(255,255,255,.2); transform: translateY(-1px); }

        /* Tablet */
        @media (max-width: 1024px) {
          .si-content { max-width: min(540px, 100%); }
        }

        /* Mobile — full-width background with content overlaid, matching WhoWeAreHero pattern */
        @media (max-width: 768px) {
          .si-hero {
            position: relative;
            min-height: clamp(600px, 95vh, 750px);
            padding-top: 80px;
            background-image: url('/services/smart-iot/hero-mobile.webp');
            background-size: contain;
            background-position: center calc(15% + 40px);
            background-repeat: no-repeat;
            background-color: #000;
            display: flex;
            flex-direction: column;
            width: 100vw;
            margin-left: calc(50% - 50vw);
          }
          .si-photo { display: none; }
          /* Dark gradient for smart-iot to maintain text contrast */
          .si-scrim {
            display: block;
            background: linear-gradient(
              180deg,
              rgba(0,0,0,0) 0%,
              rgba(0,0,0,0) 40%,
              rgba(0,0,0,.85) 68%,
              rgba(0,0,0,.96) 100%
            );
          }
          .si-navwrap { position: relative; z-index: 10; }
          .si-body {
            position: relative;
            flex: 1;
            display: flex;
            align-items: flex-end;
            padding: clamp(140px,28vw,220px) 22px clamp(36px,8vw,52px);
            z-index: 5;
          }
          .si-content { max-width: 100%; }
          .si-btn { padding: 13px 20px; }
        }

        @media (max-width: 420px) {
          .si-title { font-size: clamp(24px, 7.2vw, 29px); letter-spacing: -.016em; }
          .si-cta-row { flex-direction: column; }
        }
      `}</style>

      <section className="si-hero">

        {/* Background image — spans full section height behind navbar + body */}
        <div className="si-photo" aria-hidden="true">
          <Image
            src="/services/smart-iot/hero.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 68vw, (max-width: 1024px) 56vw, 1180px"
          />
        </div>
        <div className="si-scrim" aria-hidden="true" />

        {/* Navbar sits above the image */}
        <div className="si-navwrap">
          <SoftwareNavbar />
        </div>

        {/* Copy */}
        <div className="si-body">
          <div className="si-inner">
            <div className="si-content">

              <Link href="/service" className="si-back si-anim" style={{ animationDelay: '0s' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Services
              </Link>

              <span className="si-eyebrow si-anim" style={{ animationDelay: '.04s' }}>
                <span className="si-eyebrow-bar" />
                Smart IoT &amp; Asset Intelligence
              </span>

              <h1 className="si-title si-anim" style={{ animationDelay: '.1s' }}>
                <span style={{ color: '#ffffff' }}>Smart</span>{' '}
                <em>IoT &amp; GPS</em>
                <br />Asset Tracking
              </h1>

              <p className="si-lead si-anim" style={{ animationDelay: '.18s' }}>
                Real-time visibility for road teams, machines, and business assets — GPS asset tracking, industrial telematics, and custom IoT sensor projects unified in one connected dashboard.
              </p>

              <div className="si-cta-row si-anim" style={{ animationDelay: '.26s' }}>
                <Link href="/get-a-quote" className="si-btn si-btn-primary">
                  Get a Free Quote
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link href="/get-a-free-demo" className="si-btn si-btn-ghost">
                  Request a Demo
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}
