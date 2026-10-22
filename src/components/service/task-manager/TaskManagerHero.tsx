import Link from '@/components/country/CountryLink'
import Image from 'next/image'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

export default function TaskManagerHero() {
  return (
    <>
      <style>{`
        /*
         * Hero layout mirrors TrackingDevicesHero — the banner is landscape
         * and light (faded near-white on its left third), so a white scrim
         * with dark heading text reads better here than a dark-scrim/white-text
         * treatment like SmartIotHero's.
         */
        .tm-hero {
          position: relative;
          overflow: hidden;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          min-height: clamp(480px, 34vw, 660px);
        }

        .tm-photo { position: absolute; inset: 0; z-index: 0; }
        .tm-photo img {
          object-fit: contain;
          object-position: center;
          filter: saturate(0.96) contrast(1.02);
        }

        .tm-scrim {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(90deg,
            rgba(255,255,255,.72) 0%,
            rgba(255,255,255,.48) 28%,
            rgba(255,255,255,.18) 52%,
            rgba(255,255,255,0)   72%
          );
        }

        .tm-navwrap { position: relative; z-index: 3; }

        .tm-body {
          position: relative; z-index: 2; flex: 1;
          display: flex; align-items: center;
          padding: clamp(20px,3vw,36px) 28px clamp(40px,5vw,60px);
        }
        .tm-inner { max-width: var(--w-1280); width: 100%; margin: 0 auto; }
        .tm-content { max-width: min(560px, 100%); }

        @keyframes tmRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: no-preference) { .tm-anim { opacity: 0; animation: tmRise .8s ${EASE} forwards; } }

        .tm-back {
          display: inline-flex; align-items: center; gap: 6px; margin-bottom: 20px;
          color: #5a6478; font-size: var(--f-13); font-weight: 600;
          text-decoration: none; transition: color .18s ease, gap .18s ease;
        }
        .tm-back:hover { color: #1360ee; gap: 9px; }

        .tm-eyebrow {
          display: block;
          font-size: max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px));
          font-weight: 800; letter-spacing: .04em;
          color: #1360ee; text-transform: uppercase; margin-bottom: 16px;
        }
        .tm-eyebrow-bar {
          display: block; width: 34px; height: 3px;
          background: #1360ee; border-radius: 2px; margin-bottom: 12px;
        }

        .tm-h1 {
          margin: 0;
          font-size: clamp(28px, calc(2.5vw + 16px), 46px);
          font-weight: 800; line-height: 1.14; letter-spacing: -.024em;
          color: #0b1220;
        }
        .tm-h1 em { font-style: normal; color: #1360ee; }

        .tm-lead {
          margin: clamp(14px,1.6vw,18px) 0 0; max-width: 48ch;
          font-size: clamp(15px, 1.05vw, 17px);
          line-height: 1.72; color: #3a4459;
        }

        .tm-cta-row { display: flex; gap: 14px; margin-top: clamp(22px,2.6vw,32px); flex-wrap: wrap; }
        .tm-btn {
          font-family: inherit; font-size: var(--f-14); font-weight: 700; cursor: pointer;
          padding: 14px 24px; border-radius: 11px; border: 1.5px solid transparent;
          transition: .18s ${EASE};
          display: inline-flex; align-items: center; gap: 9px; text-decoration: none;
        }
        .tm-btn svg { transition: transform .18s ${EASE}; flex-shrink: 0; }
        .tm-btn:hover svg { transform: translateX(3px); }
        .tm-btn-primary { background: #1360ee; color: #fff; box-shadow: 0 10px 24px rgba(19,96,238,.28); }
        .tm-btn-primary:hover { background: #0d4fd4; transform: translateY(-1px); box-shadow: 0 12px 30px rgba(19,96,238,.4); }
        .tm-btn-ghost {
          background: rgba(255,255,255,.78); color: #0b1220;
          border-color: rgba(19,96,238,.25);
          -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
        }
        .tm-btn-ghost:hover { border-color: #1360ee; color: #1360ee; transform: translateY(-1px); background: rgba(255,255,255,.92); }

        @media (max-width: 1024px) {
          .tm-scrim { background: linear-gradient(90deg,
            rgba(255,255,255,.92) 0%,
            rgba(255,255,255,.80) 34%,
            rgba(255,255,255,.18) 62%,
            rgba(255,255,255,0)   78%
          ); }
          .tm-content { max-width: min(480px, 100%); }
        }

        /* Mobile: contain-fit on a narrow-but-tall box rendered the wide
           banner as a thin strip vertically centered in the middle of the
           section, with the overlaid copy running straight through it. Below
           this width the photo instead becomes a normal, fixed-height block
           of its own — filled edge-to-edge via cover — with the copy flowing
           below it on plain white, rather than layered on top of it. CSS
           "order" reflows the nav/photo/body stack without touching the DOM. */
        @media (max-width: 768px) {
          .tm-hero { min-height: auto; }
          .tm-navwrap { order: 1; }
          .tm-photo {
            order: 2;
            position: relative; inset: auto;
            height: clamp(180px, 52vw, 260px);
          }
          .tm-photo img { object-fit: cover; object-position: 72% center; }
          .tm-scrim { display: none; }
          .tm-body { order: 3; padding: clamp(28px,6vw,40px) 22px clamp(36px,8vw,52px); }
          .tm-content { max-width: 100%; text-align: center; }
          .tm-lead { margin-left: auto; margin-right: auto; }
          .tm-cta-row { justify-content: center; }
        }

        @media (max-width: 420px) {
          .tm-h1 { font-size: clamp(24px, 7.2vw, 30px); }
          .tm-cta-row { flex-direction: column; }
          .tm-btn { justify-content: center; }
        }
      `}</style>

      <section className="tm-hero">

        <div className="tm-photo" aria-hidden="true">
          <Image
            src="/services/task-manager-hero-banner.webp"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="tm-scrim" aria-hidden="true" />

        <div className="tm-navwrap">
          <SoftwareNavbar />
        </div>

        <div className="tm-body">
          <div className="tm-inner">
            <div className="tm-content">

              <Link href="/service" className="tm-back tm-anim" style={{ animationDelay: '0s' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Services
              </Link>

              <span className="tm-eyebrow tm-anim" style={{ animationDelay: '.04s' }}>
                <span className="tm-eyebrow-bar" />
                Field Team &amp; Job Scheduling
              </span>

              <h1 className="tm-h1 tm-anim" style={{ animationDelay: '.1s' }}>
                <em>Task</em> Manager
              </h1>

              <p className="tm-lead tm-anim" style={{ animationDelay: '.18s' }}>
                Assign tasks, track progress in real time, and manage field operations effortlessly. Collect data, monitor performance, and keep your team productive from one place.
              </p>

              <div className="tm-cta-row tm-anim" style={{ animationDelay: '.26s' }}>
                <Link href="/get-a-quote" className="tm-btn tm-btn-primary">
                  Get a Free Quote
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link href="/get-a-free-demo" className="tm-btn tm-btn-ghost">
                  Get a Free Demo
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
