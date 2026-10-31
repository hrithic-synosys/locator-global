'use client'

import { useState } from 'react'
import {
  LOCATOR_VIDEO_ALLOW,
  LOCATOR_VIDEO_POSTER,
  LOCATOR_VIDEO_TITLE,
  locatorVideoEmbed,
} from '@/components/locator-video'

/**
 * The same film runs on every service page; only the framing copy differs. The
 * three strings are therefore props with the fleet-telematics wording as the
 * default, so existing call sites keep working untouched and a new page supplies
 * only what it actually wants to change.
 */
type ServiceVideoProps = {
  eyebrow?: string
  title?: string
  titleColor?: string
  lead?: string
  /** Widen past the default 620px so a longer title fits on one line. */
  headingMaxWidth?: string
}

export default function ServiceVideo({
  eyebrow = 'See it in action',
  title = 'Watch LOCATOR fleet telematics at work',
  titleColor = '#1d1d1f',
  lead = 'A quick look at how real-time tracking, reporting, and alerts keep UAE fleets running smarter.',
  headingMaxWidth = '620px',
}: ServiceVideoProps = {}) {
  const hasEyebrow = eyebrow.trim().length > 0
  const [playing, setPlaying] = useState(false)

  return (
    <section style={{ padding: 'clamp(56px,7vw,88px) 28px', background: '#fff' }}>
      {/* Opens the connection to Vimeo ahead of the click — see VideoHeroSection
          for why this is what actually speeds up "time to first frame". */}
      <link rel="preconnect" href="https://player.vimeo.com" />
      <link rel="preconnect" href="https://f.vimeocdn.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://i.vimeocdn.com" />
      <div style={{ maxWidth: 'var(--w-960)', margin: '0 auto' }}>
        {(hasEyebrow || title || lead) && (<div data-reveal style={{ textAlign: 'center', maxWidth: headingMaxWidth, margin: '0 auto clamp(32px,4vw,44px)' }}>
          {hasEyebrow && (
            <span style={{ fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
              <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
              {eyebrow}
            </span>
          )}
          <h2 style={{ margin: 0, fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.015em', color: titleColor }}>
            {title}
          </h2>
          <p style={{ margin: '16px auto 0', fontSize: 'max(clamp(14px,1.35vw,16px), min(1.111vw, 23.2px))', color: '#6e6e73', lineHeight: 1.6 }}>
            {lead}
          </p>
        </div>)}

        <div data-reveal="zoom" style={{
          position: 'relative', borderRadius: '18px', overflow: 'hidden',
          aspectRatio: '16 / 9', background: '#0f1117',
          boxShadow: '0 30px 60px -26px rgba(15,23,42,.4)',
        }}>
          {playing ? (
            <iframe
              src={locatorVideoEmbed()}
              title={LOCATOR_VIDEO_TITLE}
              allow={LOCATOR_VIDEO_ALLOW}
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              aria-label={`Play video: ${LOCATOR_VIDEO_TITLE}`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', cursor: 'pointer', background: 'none', padding: 0 }}
            >
              <img
                src={LOCATOR_VIDEO_POSTER}
                alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(15,17,23,.3)' }}>
                <span style={{ width: 78, height: 78, borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,.35)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#1360ee" style={{ marginLeft: 3 }}>
                    <polygon points="6 3 20 12 6 21" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
