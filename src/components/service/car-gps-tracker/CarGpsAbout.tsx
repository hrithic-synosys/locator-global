import type { globalCopy } from '@/content/pages/car-gps-tracker/global'
import Image from 'next/image'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const CHECKLIST = [
  'Checking the activities of your fleet on the road',
  'Receiving notifications about their fuel consumption',
  'Knowing when drivers are deviating from their normal routes',
  'Getting notified when your cars are due for maintenance',
  'And many more',
]

export default function CarGpsAbout({ content }: { content?: typeof globalCopy.device } = {}) {
  return (
    <>
      <style>{`
        .cga-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(36px,5vw,72px); align-items: center; max-width: var(--w-1160); margin: 0 auto; }
        @media (max-width: 900px) { .cga-grid { grid-template-columns: 1fr; } .cga-grid > div:last-child { order: -1; } }
        .cga-closing { margin: 20px 0 0; color: #6e6e73; line-height: 1.7; }
        .cga-item { display: flex; align-items: flex-start; gap: 12px; }
        .cga-check {
          width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0; margin-top: 1px;
          background: #eef3ff; color: #1360ee; display: grid; place-items: center;
          transition: transform .2s ${EASE}, background .2s ${EASE};
        }
        .cga-item:hover .cga-check { background: #1360ee; color: #fff; transform: scale(1.08); }
      `}</style>

      <section style={{ padding: 'clamp(56px,7vw,92px) 28px', background: '#f7f9fc' }}>
        <div className="cga-grid">
          {/* Copy */}
          <div data-reveal="left">
            <span style={{ fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
              <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
              {content?.eyebrow ?? 'The Device'}
            </span>
            <h2 style={{ margin: '0 0 16px', fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-.015em', color: '#1d1d1f' }}>
              {content?.heading ?? 'About our Car GPS Tracker device'}
            </h2>
            <p style={{ margin: '0 0 28px', fontSize: 'max(clamp(13.5px,1.25vw,15px), min(1.042vw, 21.75px))', lineHeight: 1.8, color: '#6e6e73', maxWidth: '48ch' }}>
              {content?.description ?? 'LOCATOR is the best vehicle GPS tracker, with next-generation features to ensure visibility of your fleet in any location. Imagine the possibility of:'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(content?.items ?? CHECKLIST).map(item => (
                <div key={item} className="cga-item">
                  <span className="cga-check">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  <span style={{ fontSize: 'var(--f-14-5)', color: '#3a3a3c', fontWeight: 600, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            {content?.closing && <p className="cga-closing">{content.closing}</p>}
          </div>

          {/* Device alerts illustration */}
          <div data-reveal="right" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div aria-hidden="true" style={{
              position: 'absolute', inset: '8% 6%', zIndex: 0, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(19,96,238,.12), transparent 68%)',
              filter: 'blur(8px)',
            }} />
            <Image
              src="/services/car-gps-tracker/about-device.png"
              alt="Fleet manager receiving LOCATOR alerts for fuel, routes, servicing, and messages"
              width={600}
              height={900}
              sizes="(max-width: 900px) 76vw, 400px"
              style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '380px', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </section>
    </>
  )
}
