import Image from 'next/image'
import Link from '@/components/country/CountryLink'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/**
 * Four real client marks under the fold line. The reference put a logo strip
 * here and it is the right instinct — the first thing a fleet operator wants is
 * proof someone like them already bought this. These are pulled from the same
 * set the homepage marquee uses, so nothing is invented, and they are rendered
 * greyscale at rest so fourteen competing brand palettes cannot pull focus off
 * the headline.
 */
const PROOF = [
  { name: 'DB Schenker', src: '/clients/db-schenker.png' },
  { name: 'GMG', src: '/clients/gmg.png' },
  { name: 'Al Ghazal Transport', src: '/clients/al-ghazal-transport.png' },
  { name: 'Access Hire Middle East', src: '/clients/access-hire-middle-east-logo.png' },
]

/**
 * The opening.
 *
 * An isometric city panel sits opposite the headline — it says "everything on
 * one map" before a single line of copy is read.
 */
export default function VehicleTrackingHero() {
  return (
    <>
      <style>{`
        .vth {
          position: relative; overflow: hidden; background: #fff;
          padding: clamp(16px,2vw,28px) 28px clamp(48px,6vw,80px);
        }
        .vth::before {
          content: ''; position: absolute; z-index: 0; pointer-events: none;
          width: min(900px,80vw); height: min(700px,64vw); top: -20%; right: -16%;
          background: radial-gradient(50% 50% at 50% 50%, rgba(19,96,238,.14), transparent 70%);
        }
        /* No dot-grid texture here. The illustration is already a detailed object
           and a pattern scattered behind it only competes with it — the soft wash
           above is the whole background treatment. */

        .vth-inner {
          position: relative; z-index: 1; max-width: var(--w-1180); margin: 0 auto;
          padding-top: clamp(8px,1.5vw,16px);
          display: grid; grid-template-columns: 1.1fr 1fr;
          gap: clamp(32px,5vw,68px); align-items: start;
        }
        @media (max-width: 960px) { .vth-inner { grid-template-columns: 1fr; gap: clamp(36px,6vw,48px); } }

        @keyframes vthRise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: no-preference) {
          .vth-anim { opacity: 0; animation: vthRise .8s ${EASE} var(--d, 0ms) forwards; }
        }

        .vth-crumb {
          display: flex; align-items: center; gap: 9px; flex-wrap: wrap;
          font-size: var(--f-13); font-weight: 500; color: #9aa1ad; margin-bottom: clamp(20px,3vw,30px);
        }
        .vth-crumb a { color: #6e6e73; text-decoration: none; transition: color .2s ${EASE}; }
        .vth-crumb a:hover { color: #1360ee; }
        .vth-crumb span[aria-current] { color: #1d1d1f; font-weight: 600; }

        .vth-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: var(--f-12); font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: #1360ee; margin: 0 0 20px;
        }
        .vth-eyebrow::before { content: ''; width: 30px; height: 2px; background: #1360ee; border-radius: 2px; }

        .vth-title {
          margin: 0; max-width: 560px;
          font-size: clamp(24px, calc(1.5vw + 15px), 34px); font-weight: 800;
          line-height: 1.22; letter-spacing: -.02em; color: #1d1d1f;
        }
        .vth-title em { font-style: normal; color: #1360ee; }
        @media (max-width: 420px) { .vth-title { font-size: clamp(22px, 6.4vw, 26px); letter-spacing: -.014em; } }

        .vth-lead {
          margin: clamp(14px,1.8vw,18px) 0 0; max-width: 46ch;
          font-size: max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px)); line-height: 1.7; color: #6e6e73;
        }

        .vth-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: clamp(22px,2.8vw,30px); }
        .vth-btn {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 15px 28px; border-radius: 999px; text-decoration: none;
          font-size: var(--f-14-5); font-weight: 700; letter-spacing: .01em;
          transition: transform .28s ${EASE}, box-shadow .28s ${EASE}, border-color .28s ${EASE}, color .28s ${EASE};
        }
        .vth-btn svg { width: 16px; height: 16px; }
        .vth-btn--primary { background: #1360ee; color: #fff; box-shadow: 0 14px 28px -11px rgba(19,96,238,.7); }
        .vth-btn--primary:hover { transform: translateY(-2px); box-shadow: 0 22px 40px -13px rgba(19,96,238,.74); }
        .vth-btn--ghost { background: #fff; color: #1d1d1f; border: 1px solid #e2e8f2; }
        .vth-btn--ghost:hover { transform: translateY(-2px); border-color: #1360ee; color: #1360ee; box-shadow: 0 14px 28px -16px rgba(20,40,90,.4); }
        @media (max-width: 520px) { .vth-actions .vth-btn { flex: 1 1 100%; justify-content: center; } }

        /* ── Proof strip ── */
        .vth-proof { margin: clamp(34px,4.4vw,48px) 0 0; padding-top: clamp(20px,2.6vw,26px); border-top: 1px solid #eef1f7; }
        .vth-proof-label {
          margin: 0 0 16px; font-size: var(--f-11-5); font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase; color: #a8b0be;
        }
        .vth-proof-row {
          display: flex; align-items: center; flex-wrap: wrap;
          gap: clamp(20px,3.4vw,40px);
        }
        .vth-proof-row img {
          height: clamp(26px,2.6vw,34px); width: auto; object-fit: contain;
          /* Greyscale at rest so the strip reads as one row rather than four
             competing brand palettes; colour returns on hover. */
          filter: grayscale(1); opacity: .5;
          transition: filter .3s ${EASE}, opacity .3s ${EASE};
        }
        .vth-proof-row img:hover { filter: none; opacity: 1; }

        /* ── Isometric city panel ── */
        /* No optical raise here: the artwork is close to square, so its height is
           near the copy column's and centring already lands it against the title
           block. The negative margin this rule used to carry was tuned for a much
           wider drawing and would now pull the image clear of the headline. */
        .vth-art { position: relative; }
        .vth-art img { display: block; width: 100%; height: auto; }
      `}</style>

      <section className="vth">
        <SoftwareNavbar />

        <div className="vth-inner">
          {/* ── Copy ── */}
          <div>
            <nav className="vth-crumb vth-anim" style={{ '--d': '0ms' } as React.CSSProperties} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/service/fleet-telematics">Services</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Vehicle Tracking System</span>
            </nav>

            <p className="vth-eyebrow vth-anim" style={{ '--d': '70ms' } as React.CSSProperties}>
              Vehicle tracking · United Arab Emirates
            </p>

            <h1 className="vth-title vth-anim" style={{ '--d': '140ms' } as React.CSSProperties}>
              The best <em>vehicle tracking system</em> in the UAE
            </h1>

            <p className="vth-lead vth-anim" style={{ '--d': '210ms' } as React.CSSProperties}>
              Manage your vehicles with one click today. Every car, van, truck and
              asset you own — live on a single screen, from Dubai to every other Emirate.
            </p>

            <div className="vth-actions vth-anim" style={{ '--d': '280ms' } as React.CSSProperties}>
              <Link href="/get-a-quote" className="vth-btn vth-btn--primary">
                Get a free quote
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link href="/get-a-free-demo" className="vth-btn vth-btn--ghost">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" /><path d="M10 8.5l6 3.5-6 3.5z" />
                </svg>
                Get a free demo
              </Link>
            </div>

            <div className="vth-proof vth-anim" style={{ '--d': '350ms' } as React.CSSProperties}>
              <p className="vth-proof-label">Trusted by fleets across the Emirates</p>
              <div className="vth-proof-row">
                {PROOF.map(p => (
                  <Image key={p.name} src={p.src} alt={p.name} width={160} height={60} sizes="160px" />
                ))}
              </div>
            </div>
          </div>

          {/* ── Isometric city ── */}
          <div className="vth-art vth-anim" style={{ '--d': '240ms' } as React.CSSProperties}>
            <Image
              src="/services/vehicle-tracking-system/hero.png"
              alt="Cars, trucks, a boat, a scooter and site machinery pinned across a city on one live map"
              width={1000}
              height={963}
              sizes="(max-width: 960px) 92vw, 54vw"
              priority
            />
          </div>
        </div>
      </section>
    </>
  )
}
