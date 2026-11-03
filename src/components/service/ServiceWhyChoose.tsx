import { sharedFleetTelematics } from '@/content/pages/fleet-telematics/shared'
import type { ServiceWhyChooseContent } from '@/content/page-schema'
import Image from 'next/image'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const REASON_ICONS = [(
      <svg key="0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
(
      <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M8 11l2.5 2.5L16 8" />
      </svg>
    ),
(
      <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5a9 9 0 0 1 14 0" /><path d="M8 15.5a5 5 0 0 1 8 0" /><circle cx="12" cy="18.5" r="1" fill="currentColor" />
      </svg>
    )]

export default function ServiceWhyChoose({ content = sharedFleetTelematics.whyChoose }: { content?: ServiceWhyChooseContent }) {
  const REASONS = content.order.map(id => ({ ...content.items[id], id, icon: REASON_ICONS[content.items[id].assetIndex] }))
  return (
    <>
      <style>{`
        .swc-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(28px,3.4vw,52px); align-items: stretch; max-width: var(--w-1200); margin: 0 auto; }
        @media (max-width: 940px) { .swc-grid { grid-template-columns: 1fr; gap: 40px; } .swc-grid > div:last-child { order: -1; } }

        /* Photo fills the row's full height (matching the text column exactly)
           and bleeds past the centred container to the viewport's right edge.
           object-position:right means the slight overflow is trimmed off the
           left — which is where this shot's empty white desk area sits — so
           the laptop stays whole and no blank margin is left inside the frame.
           min(0px,…) keeps the bleed pulling outward only, never inward. */
        .swc-photo-wrap {
          height: 100%;
          margin-right: min(0px, calc((var(--w-1200) - 100vw) / 2 + 28px));
        }
        .swc-photo { position: relative; width: 100%; height: 100%; min-height: 340px; }
        @media (max-width: 940px) {
          .swc-photo-wrap { margin-right: 0; }
          .swc-photo { height: auto; aspect-ratio: 1672 / 941; min-height: 0; }
        }

        .swc-row { display: flex; gap: 16px; align-items: flex-start; }
        .swc-ic {
          width: 52px; height: 52px; border-radius: 14px; flex-shrink: 0;
          display: grid; place-items: center;
          transition: transform .24s ${EASE};
        }
        .swc-row:hover .swc-ic { transform: scale(1.06) rotate(-3deg); }
      `}</style>

      {/* A whisper of cool grey rather than pure white — enough to separate the
          section from the white blocks above and below it, well short of the
          #f7f9fc it used to be, which read as a distinct grey band. */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(56px,7vw,92px) 28px', background: '#fcfdfe' }}>
        <div aria-hidden="true" style={{ position: 'absolute', width: 520, height: 420, top: -80, right: '-4%', borderRadius: '50%', background: 'radial-gradient(50% 50% at 50% 50%, rgba(19,96,238,.10), transparent 72%)', filter: 'blur(20px)', pointerEvents: 'none' }} />

        <div className="swc-grid">
          {/* Left: copy + reasons */}
          <div data-reveal="left">
            <span style={{ fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
              <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
              {content.eyebrow}</span>
            <h2 style={{ margin: '0 0 clamp(28px,4vw,40px)', fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.015em', color: '#1d1d1f' }}>{content.heading}</h2>
            {content.paragraphs.map((paragraph, index) => <p key={index} style={{ margin: '0 0 28px', fontSize: 'var(--f-15)', lineHeight: 1.7, color: '#6e6e73' }}>{paragraph}</p>)}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(22px,3vw,30px)' }}>
              {REASONS.map(r => (
                <div key={r.id} className="swc-row">
                  <span className="swc-ic" style={{ background: `${r.accent}14`, color: r.accent }}>{r.icon}</span>
                  <div>
                    <h3 style={{ margin: '0 0 7px', fontSize: 'max(clamp(16px,1.7vw,19px), min(1.319vw, 27.55px))', fontWeight: 800, letterSpacing: '-.018em', color: '#1d1d1f' }}>{r.title}</h3>
                    <p style={{ margin: 0, fontSize: 'max(clamp(13.5px,1.25vw,15px), min(1.042vw, 21.75px))', lineHeight: 1.7, color: '#6e6e73', maxWidth: '46ch' }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: LOCATOR dashboard illustration */}
          <div data-reveal="right" style={{ position: 'relative' }}>
            <div className="swc-photo-wrap">
              <div className="swc-photo">
                <Image
                  src="/services/why-choose.webp"
                  alt="LOCATOR GPS tracking dashboard — live vehicle map and fleet overview"
                  fill
                  sizes="(max-width: 940px) 90vw, 60vw"
                  style={{ objectFit: 'cover', objectPosition: 'right center' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
