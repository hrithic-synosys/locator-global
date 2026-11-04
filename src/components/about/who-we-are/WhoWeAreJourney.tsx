import type { globalWhoWeAre } from '@/content/pages/who-we-are/global'
import Image from 'next/image'

/**
 * Our Journey — same technique as the hero: the photo is a bounded,
 * right-anchored background for the whole section (full-bleed to the
 * viewport edge, no card inset), fading to white on the left under a
 * white-to-transparent scrim so the copy stays legible. The copy itself
 * sits in the same centered, padded content column the rest of the page
 * uses, so only the photo/background actually spans edge to edge.
 */
export default function WhoWeAreJourney({ content }: { content?: typeof globalWhoWeAre['journey'] } = {}) {
  return (
    <>
      <style>{`
        .wwj-section {
          position: relative;
          overflow: hidden;
          background: #fff;
          min-height: clamp(300px, 28vw, 380px);
          display: flex;
          align-items: center;
        }

        .wwj-photo { position: absolute; top: 0; right: 0; bottom: 0; width: min(1000px, 62%); z-index: 0; }
        .wwj-photo img { object-fit: cover; object-position: 100% center; }

        .wwj-scrim {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(90deg, #fff 0%, #fff 38%, rgba(255,255,255,0) 66%);
        }

        .wwj-inner { position: relative; z-index: 2; max-width: var(--w-1280); width: 100%; margin: 0 auto; padding: clamp(32px,4vw,48px) 28px; }
        .wwj-text { max-width: 560px; }

        @media (max-width: 860px) {
          .wwj-section { min-height: 0; }
          .wwj-photo { width: min(480px, 74%); opacity: .85; }
          .wwj-scrim { background: linear-gradient(90deg, #fff 0%, #fff 58%, rgba(255,255,255,0) 90%); }
          .wwj-text { max-width: 100%; }
        }
      `}</style>

      <section className="wwj-section" data-reveal>
        <div className="wwj-photo" aria-hidden="true">
          <Image
            src="/about/who-we-are/journey-road.png"
            alt=""
            fill
            sizes="(max-width: 860px) 74vw, 1000px"
          />
        </div>
        <div className="wwj-scrim" aria-hidden="true" />

        <div className="wwj-inner">
          <div className="wwj-text">
            <span style={{ display: 'block', fontSize: 'max(clamp(20px,2.4vw,28px), min(1.944vw, 40.6px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase', marginBottom: '10px' }}>
              <span style={{ display: 'block', marginBottom: '8px' }}><span style={{ display: 'inline-block', width: '30px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
              {content?.eyebrow ?? 'Our Journey'}
            </span>
            <h2 style={{ margin: 0, fontSize: 'max(clamp(17px,1.9vw,23px), min(1.597vw, 33.36px))', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-.015em', color: '#1d1d1f' }}>
              {content?.heading ?? <>From GPS tracking to a<br />
              <span style={{ color: '#1360ee' }}>connected mobility ecosystem</span></>}
            </h2>
            <div style={{ margin: '14px 0 16px', height: '4px', width: '64px', borderRadius: '999px', background: 'linear-gradient(90deg,#1360ee,#0d4fd4)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(content?.paragraphs ?? ["Since our inception, LOCATOR has remained committed to redefining fleet management through innovation and technology. What began as a provider of GPS vehicle tracking solutions has evolved into a comprehensive fleet telematics and IoT platform trusted by businesses across the United Arab Emirates.", "As industries continue to embrace digital transformation, LOCATOR has expanded its capabilities beyond traditional vehicle tracking by integrating Artificial Intelligence, cloud technologies, IoT connectivity, and intelligent analytics into one unified ecosystem. Today, we continue to innovate — helping organizations improve operational efficiency, strengthen safety, reduce costs, and prepare for the future of connected mobility."]).map(paragraph => (
                <p key={paragraph} style={{ margin: 0, fontSize: 'max(clamp(13px,1.1vw,14.5px), min(1.007vw, 21.02px))', lineHeight: 1.55, color: '#52525e' }}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
