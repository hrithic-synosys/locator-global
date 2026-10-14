import Link from 'next/link'
import Image from 'next/image'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'
import { DEVICES, type Device } from './devices-data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

export default function DeviceDetail({ device }: { device: Device }) {
  const related = DEVICES.filter((d) => d.slug !== device.slug && d.group === device.group).slice(0, 3)

  return (
    <>
      <style>{`
        .dd-wrap { background: #fff; padding: clamp(16px,2vw,28px) 28px clamp(56px,7vw,88px); }
        .dd-inner { max-width: var(--w-1180); margin: 0 auto; }

        .dd-crumbs { display: flex; align-items: center; gap: 8px; font-size: var(--f-13); color: #6e6e73; margin: 8px 0 clamp(28px,4vw,44px); }
        .dd-crumbs a { color: #6e6e73; text-decoration: none; font-weight: 600; transition: color .18s ease; }
        .dd-crumbs a:hover { color: #1360ee; }
        .dd-crumbs .dd-current { color: #1360ee; font-weight: 700; }

        .dd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px,5vw,64px); align-items: start; }
        @media (max-width: 900px) { .dd-grid { grid-template-columns: 1fr; gap: 32px; } }

        /* Product shot slot — empty on purpose until real photos arrive. */
        .dd-shot {
          position: relative; aspect-ratio: 1 / 1; background: #fafbfd;
          border: 1px solid #e7ebf3; border-radius: 20px;
          display: grid; place-items: center; overflow: hidden;
        }
        .dd-shot img { width: 100%; height: 100%; object-fit: contain; padding: clamp(24px,4vw,56px); }
        .dd-shot-empty { color: #c3cbd9; font-size: var(--f-12); font-weight: 700; letter-spacing: .09em; text-transform: uppercase; }

        .dd-eyebrow {
          display: block;
          font-size: max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px)); font-weight: 800; letter-spacing: .04em;
          color: #1360ee; text-transform: uppercase; margin-bottom: 16px;
        }
        .dd-eyebrow::before {
          content: ''; display: block; width: 34px; height: 3px;
          background: #1360ee; border-radius: 2px; margin-bottom: 12px;
        }

        .dd-name { margin: 0 0 14px; font-size: max(clamp(21px,2.5vw,28px), min(1.944vw, 40.6px)); font-weight: 800; line-height: 1.18; letter-spacing: -.015em; color: #1d1d1f; }
        .dd-tag { margin: 0 0 20px; font-size: max(clamp(15px,1.5vw,18px), min(1.250vw, 26.1px)); font-weight: 700; line-height: 1.45; color: #1d1d1f; }
        .dd-body { margin: 0; font-size: max(clamp(14px,1.3vw,16px), min(1.111vw, 23.2px)); line-height: 1.8; color: #52525e; }

        /* Specs — flat rows, no cards, no pills */
        .dd-specs { margin: clamp(28px,3.5vw,40px) 0 0; border-top: 1px solid #e7ebf3; }
        .dd-spec { display: grid; grid-template-columns: 40% 1fr; gap: 16px; padding: 14px 0; border-bottom: 1px solid #eef1f7; }
        .dd-spec-l { font-size: var(--f-13); font-weight: 700; color: #6e6e73; }
        .dd-spec-v { font-size: var(--f-14); color: #1d1d1f; font-weight: 600; }

        .dd-uses { margin: clamp(32px,4vw,48px) 0 0; }
        .dd-uses-h { margin: 0 0 18px; font-size: max(clamp(18px,2vw,22px), min(1.528vw, 31.9px)); font-weight: 800; letter-spacing: -.015em; color: #1d1d1f; }
        .dd-use { display: grid; grid-template-columns: 30px 1fr; gap: 14px; padding: 14px 0; border-top: 1px solid #eef1f7; }
        .dd-use-n { font-size: var(--f-13); font-weight: 800; color: #1360ee; padding-top: 2px; }
        .dd-use-t { margin: 0; font-size: var(--f-14-5); line-height: 1.7; color: #52525e; }

        .dd-cta-row { display: flex; gap: 14px; margin-top: clamp(32px,4vw,44px); flex-wrap: wrap; }
        .dd-btn {
          font-family: inherit; font-weight: 700; cursor: pointer;
          padding: 15px 24px; border-radius: 12px; border: none;
          transition: .18s ${EASE}; display: inline-flex; align-items: center; gap: 10px;
          text-decoration: none; font-size: var(--f-14-5);
        }
        .dd-btn-primary { background: #1360ee; color: #fff; box-shadow: 0 10px 24px rgba(19,96,238,.28); }
        .dd-btn-primary:hover { background: #0d4fd4; transform: translateY(-1px); box-shadow: 0 12px 28px rgba(19,96,238,.38); }
        .dd-btn-secondary { background: #fff; color: #1360ee; border: 1.5px solid #dbe4fb; }
        .dd-btn-secondary:hover { border-color: #1360ee; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(19,96,238,.15); }

        .dd-soon { margin: 24px 0 0; font-size: var(--f-15); font-weight: 700; color: #9aa2b1; }

        /* Related */
        .dd-related { background: #f7f9fc; padding: clamp(48px,6vw,80px) 28px; }
        .dd-rel-h { margin: 0 0 28px; font-size: max(clamp(20px,2.4vw,28px), min(1.944vw, 40.6px)); font-weight: 800; letter-spacing: -.02em; color: #1d1d1f; }
        .dd-rel-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(16px,2vw,24px); }
        @media (max-width: 900px) { .dd-rel-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .dd-rel-grid { grid-template-columns: 1fr; } }
        .dd-rel-card {
          display: block; padding: 22px; background: #fff; text-decoration: none;
          border: 1px solid #e7ebf3; border-radius: 16px;
          transition: transform .28s ${EASE}, box-shadow .28s ${EASE}, border-color .28s ${EASE};
        }
        .dd-rel-card:hover { transform: translateY(-4px); border-color: #c9d8f8; box-shadow: 0 24px 48px -24px rgba(20,40,90,.28); }
        .dd-rel-name { margin: 0 0 8px; font-size: var(--f-17); font-weight: 800; color: #1d1d1f; letter-spacing: -.015em; }
        .dd-rel-tag { margin: 0; font-size: var(--f-13-5); line-height: 1.6; color: #6e6e73; }
      `}</style>

      <section className="dd-wrap">
        <SoftwareNavbar />

        <div className="dd-inner">
          <nav className="dd-crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/service/tracking-devices">Tracking Devices</Link>
            <span>/</span>
            <span className="dd-current">{device.name}</span>
          </nav>

          <div className="dd-grid">
            <div className="dd-shot" data-reveal="left">
              {device.image ? (
                <Image
                  src={device.image}
                  alt={device.name}
                  width={device.imageW ?? 1000}
                  height={device.imageH ?? 1000}
                  priority
                />
              ) : (
                <span className="dd-shot-empty">{device.name}</span>
              )}
            </div>

            <div data-reveal="right">
              <span className="dd-eyebrow">Device Details</span>
              <h1 className="dd-name">{device.name}</h1>
              <p className="dd-tag">{device.tagline}</p>

              {device.comingSoon ? (
                <p className="dd-soon">Coming shortly.</p>
              ) : (
                <p className="dd-body">{device.body}</p>
              )}

              {device.specs && device.specs.length > 0 && (
                <div className="dd-specs">
                  {device.specs.map((s) => (
                    <div key={s.label} className="dd-spec">
                      <span className="dd-spec-l">{s.label}</span>
                      <span className="dd-spec-v">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="dd-cta-row">
                <Link href="/get-a-quote" className="dd-btn dd-btn-primary">
                  Request a quote
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <a href="tel:+971508746688" className="dd-btn dd-btn-secondary">050 874 66 88</a>
              </div>
            </div>
          </div>

          {device.useCases && device.useCases.length > 0 && (
            <div className="dd-uses" data-reveal>
              <h2 className="dd-uses-h">Where it fits</h2>
              {device.useCases.map((u, i) => (
                <div key={u} className="dd-use">
                  <span className="dd-use-n">{String(i + 1).padStart(2, '0')}</span>
                  <p className="dd-use-t">{u}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="dd-related">
          <div className="dd-inner">
            <h2 className="dd-rel-h">Other devices in this range</h2>
            <div className="dd-rel-grid">
              {related.map((r) => (
                <Link key={r.slug} href={`/service/tracking-devices/${r.slug}`} className="dd-rel-card" data-reveal>
                  <h3 className="dd-rel-name">{r.name}</h3>
                  <p className="dd-rel-tag">{r.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
