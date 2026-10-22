'use client'
import Image from 'next/image'
import Link from '@/components/country/CountryLink'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const STATS = [
  { value: '99.9%', label: 'Network uptime' },
  { value: '10s',   label: 'Live update rate' },
  { value: '5yr',   label: 'Device lifespan' },
]

export default function GpsTrackerHero() {
  return (
    <>
      <style>{`
        @keyframes gtHeroRise {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes gtFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes gtGlow {
          0%,100% { opacity: .5; }
          50%      { opacity: .85; }
        }
        @keyframes gtRadar {
          0%   { transform: scale(.5);  opacity: .45; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        .gt-radar-ring {
          position: absolute; inset: 0; margin: auto; z-index: 0;
          width: 78%; height: 78%; border-radius: 50%;
          border: 1.5px solid rgba(19,96,238,.4);
          animation: gtRadar 3.6s ${EASE} infinite;
        }
        .gt-hero { position: relative; overflow: hidden; background: #ffffff; }
        .gt-hero-grid {
          position: relative; z-index: 1;
          max-width: var(--w-1200); margin: 0 auto;
          padding: clamp(32px,6vh,64px) 28px clamp(64px,9vh,100px);
          display: grid; grid-template-columns: 1.1fr 1fr;
          gap: clamp(28px,5vw,56px); align-items: start;
        }
        @media (max-width: 900px) {
          .gt-hero-grid { grid-template-columns: 1fr; text-align: center; }
          .gt-hero-copy-align { align-items: center !important; }
          .gt-hero-btns { justify-content: center !important; }
          .gt-hero-stats { justify-content: center !important; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .gt-hero-copy { animation: gtHeroRise .85s ${EASE} .05s both; }
          .gt-hero-viz  { animation: gtHeroRise .9s ${EASE} .15s both; }
          .gt-hero-float { animation: gtFloat 5.5s ease-in-out infinite; }
        }
        .gt-btn {
          font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer;
          padding: 13px 26px; border-radius: 999px; border: none;
          transition: .18s ${EASE};
          display: inline-flex; align-items: center; gap: 7px;
          white-space: nowrap; text-decoration: none;
        }
        .gt-btn-primary { background: #1360ee; color: #fff; box-shadow: 0 10px 26px rgba(19,96,238,.28); }
        .gt-btn-primary:hover { background: #0d4fd4; transform: translateY(-2px); box-shadow: 0 14px 32px rgba(19,96,238,.36); }
        .gt-btn-ghost { background: #fff; color: #1360ee; border: 1.5px solid #dbe3f5; }
        .gt-btn-ghost:hover { border-color: #1360ee; transform: translateY(-2px); }

        .gt-pill {
          position: absolute; z-index: 3;
          display: flex; align-items: center; gap: 11px;
          padding: 9px 16px 9px 9px; border-radius: 16px;
          background: rgba(255,255,255,.88);
          -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,.9);
          box-shadow: 0 16px 34px -10px rgba(15,23,42,.2), 0 2px 6px rgba(15,23,42,.05), inset 0 1px 0 rgba(255,255,255,.95);
          white-space: nowrap;
        }
        .gt-pill-icon {
          width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
          display: grid; place-items: center;
        }
        .gt-pill-eyebrow {
          display: block; font-size: 10px; font-weight: 700; letter-spacing: .04em;
          color: #8a93a2; text-transform: uppercase; margin-bottom: 2px;
        }
        .gt-pill-value {
          display: block; font-size: 13.5px; font-weight: 800; color: #1d1d1f; letter-spacing: -.01em;
        }
        @media (max-width: 500px) {
          .gt-pill { padding: 8px 13px 8px 8px; gap: 9px; }
          .gt-pill-icon { width: 30px; height: 30px; }
        }
      `}</style>

      <section className="gt-hero">
        {/* Ambient blue wash, consistent with the rest of the site */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: '640px', height: '640px', top: '-280px', right: '-160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(19,96,238,.09), transparent 70%)' }} />
          <div style={{ position: 'absolute', width: '420px', height: '420px', bottom: '-200px', left: '-140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(19,96,238,.06), transparent 70%)' }} />
        </div>

        <SoftwareNavbar />

        <div className="gt-hero-grid">
          {/* Copy */}
          <div className="gt-hero-copy gt-hero-copy-align" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: 'var(--f-12)', fontWeight: 700, letterSpacing: '.08em', color: '#1360ee', textTransform: 'uppercase', background: '#eef3ff', border: '1px solid #dbe6ff', borderRadius: '999px', padding: '7px 14px', marginBottom: '22px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1360ee', display: 'inline-block' }} />
              Certified Teltonika GPS Hardware
            </span>

            <h1 style={{ margin: 0, fontSize: 'max(clamp(24px, calc(1.5vw + 15px), 34px), min(2.361vw, 49.3px))', fontWeight: 800, lineHeight: 1.22, letterSpacing: '-.02em', color: '#1d1d1f', maxWidth: '480px' }}>
              The ultimate <span style={{ color: '#1360ee' }}>GPS tracker</span> device for your fleet
            </h1>

            <p style={{ margin: '14px 0 0', fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.7, color: '#6e6e73', maxWidth: '46ch' }}>
              A rugged, plug-and-play tracking device that feeds live location, driver behaviour, and vehicle
              health straight into the LOCATOR platform &mdash; installed, configured, and supported across the UAE.
            </p>

            <div className="gt-hero-btns" style={{ display: 'flex', gap: '14px', marginTop: '24px', flexWrap: 'wrap' }}>
              <Link href="/get-a-quote" className="gt-btn gt-btn-primary">Get a free quote</Link>
              <Link href="/get-a-free-demo" className="gt-btn gt-btn-ghost">Get a free demo →</Link>
            </div>

            <div className="gt-hero-stats" style={{ display: 'flex', gap: 'clamp(20px,3vw,36px)', marginTop: '44px', flexWrap: 'wrap' }}>
              {STATS.map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 'var(--f-22)', fontWeight: 800, color: '#1360ee', letterSpacing: '-.01em' }}>{s.value}</div>
                  <div style={{ fontSize: 'var(--f-12-5)', color: '#8a93a2', marginTop: '2px', fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual — device photo staged on a radar-ping backdrop with status callouts */}
          <div className="gt-hero-viz" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              position: 'relative', width: 'min(100%, 440px)', aspectRatio: '1 / 1',
              display: 'grid', placeItems: 'center',
            }}>
              {/* Dot-grid field, faded at the edges — gives the stage texture instead of flat empty space */}
              <div aria-hidden="true" style={{
                position: 'absolute', inset: '-12%', zIndex: 0,
                backgroundImage: 'radial-gradient(rgba(19,96,238,.22) 1px, transparent 1.6px)',
                backgroundSize: '24px 24px',
                WebkitMaskImage: 'radial-gradient(closest-side, rgba(0,0,0,.9), transparent 74%)',
                maskImage: 'radial-gradient(closest-side, rgba(0,0,0,.9), transparent 74%)',
              }} />

              {/* Expanding GPS-ping rings, staggered */}
              <div aria-hidden="true" className="gt-radar-ring" style={{ animationDelay: '0s' }} />
              <div aria-hidden="true" className="gt-radar-ring" style={{ animationDelay: '1.2s' }} />
              <div aria-hidden="true" className="gt-radar-ring" style={{ animationDelay: '2.4s' }} />

              {/* Soft ambient glow behind the card */}
              <div aria-hidden="true" className="gt-hero-float" style={{
                position: 'absolute', inset: '8%', zIndex: 0, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(19,96,238,.16), transparent 70%)',
                filter: 'blur(8px)',
              }} />

              {/* Device card — layered gradient + inner highlight, not a flat white box */}
              <div className="gt-hero-float" style={{
                position: 'relative', zIndex: 1, width: '76%', aspectRatio: '1 / 1',
                borderRadius: '28px', overflow: 'hidden',
                background: 'linear-gradient(155deg, #ffffff 0%, #f6f9fd 55%, #eef3fc 100%)',
                border: '1px solid #e3e9f5',
                boxShadow: '0 40px 80px -28px rgba(19,96,238,.34), 0 4px 14px rgba(20,40,90,.07), inset 0 1px 0 rgba(255,255,255,.9)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '26px',
              }}>
                {/* Grounding shadow beneath the device to seat it in the card */}
                <div aria-hidden="true" style={{
                  position: 'absolute', bottom: '16%', left: '50%', transform: 'translateX(-50%)',
                  width: '58%', height: '20px', borderRadius: '50%',
                  background: 'radial-gradient(ellipse, rgba(15,23,42,.22), transparent 75%)',
                  filter: 'blur(2px)',
                }} />
                <Image src="/services/gps-tracker/gps-tracker-device.png" alt="Teltonika FMM130 and FMB204 GPS tracker devices" width={636} height={626} style={{ width: '100%', height: 'auto', display: 'block', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 18px 20px rgba(15,23,42,.16))' }} priority />
              </div>

              {/* "Live" status callout */}
              <div className="gt-pill" style={{ top: '4%', right: '-2%' }}>
                <span className="gt-pill-icon" style={{ background: 'rgba(31,191,91,.14)', color: '#1fbf5b' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5a9 9 0 0 1 14 0" /><path d="M8 15.5a5 5 0 0 1 8 0" /><circle cx="12" cy="18.5" r="1.2" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                <div>
                  <span className="gt-pill-eyebrow">Live status</span>
                  <span className="gt-pill-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#1fbf5b', boxShadow: '0 0 0 3px rgba(31,191,91,.2)', flexShrink: 0 }} />
                    GPS Locked
                  </span>
                </div>
              </div>

              {/* Update-interval callout */}
              <div className="gt-pill" style={{ bottom: '2%', left: '-4%' }}>
                <span className="gt-pill-icon" style={{ background: 'rgba(19,96,238,.12)', color: '#1360ee' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" />
                  </svg>
                </span>
                <div>
                  <span className="gt-pill-eyebrow">Update interval</span>
                  <span className="gt-pill-value">Every 10 seconds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
