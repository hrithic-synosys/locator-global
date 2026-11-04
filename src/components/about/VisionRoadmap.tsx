'use client'

import type { globalVision } from '@/content/pages/vision/global'

import { useEffect, useRef, useState } from 'react'

/** The figure the headline settles on. Rendered with thousands separators. */
const TARGET = 1_000_000
const COUNT_MS = 1900
/**
 * The run starts partway up rather than at zero — a counter climbing from 0 to
 * a million spends most of its time on numbers that mean nothing, and the early
 * frames have to jump in huge steps to cover the distance, which is what makes
 * it look like it is stuttering. Beginning somewhere in this band keeps every
 * frame a small, smooth increment.
 */
const START_MIN = 0.58
const START_MAX = 0.78

/**
 * Counts from zero to `target` the first time the element is scrolled into
 * view, then never again — a stat that re-runs every time it scrolls past
 * reads as a loading spinner rather than an arrival.
 *
 * The tick runs on requestAnimationFrame rather than setInterval so it stays
 * on the compositor's clock and cannot drift or stack up in a background tab.
 */
function useCountUp(target: number, durationMs: number) {
  const ref = useRef<HTMLDivElement>(null)
  // Seeded with the final figure, not 0. That is what the server renders and
  // what a no-JS reader keeps, so the stat is never wrong and never shows a
  // meaningless zero. The run replaces it on its first frame, while the plate
  // is still below the fold.
  const [value, setValue] = useState(target)
  const rafRef = useRef(0)
  const startedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const run = () => {
      if (startedRef.current) return
      startedRef.current = true

      // Reduced motion still gets the number — it just arrives rather than
      // counting. Routed through rAF so nothing sets state synchronously
      // inside the effect body.
      if (reduced) {
        rafRef.current = requestAnimationFrame(() => setValue(target))
        return
      }

      // A different, deliberately un-round figure each time, so it reads as a
      // live number being caught mid-climb rather than a scripted animation
      // replaying from the same mark.
      const from = Math.round(target * (START_MIN + Math.random() * (START_MAX - START_MIN)))
      const t0 = performance.now()

      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / durationMs)
        // easeOutCubic. easeOutExpo was here and covered ~65% of the distance
        // in its first fifth — at a million that is a jump of hundreds of
        // thousands between two frames, which is precisely the stutter. Cubic
        // decelerates gently enough that every frame is a readable step.
        const eased = 1 - Math.pow(1 - p, 3)
        setValue(Math.round(from + (target - from) * eased))
        if (p < 1) rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    if (typeof IntersectionObserver === 'undefined') {
      run()
      return () => cancelAnimationFrame(rafRef.current)
    }

    // 0.45 so the plate is genuinely on screen before it starts — at a lower
    // threshold the count is half over by the time the figure is readable.
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run()
          obs.disconnect()
        }
      },
      { threshold: 0.45 },
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [target, durationMs])

  return { ref, value }
}

const MILESTONES = [
  { year: 'Today', title: 'A trusted UAE fleet-tech partner', desc: 'Serving businesses across the Emirates with AI-powered IoT tracking and compliance.' },
  { year: '2030', title: 'Regional scale', desc: 'Expanding our connected device network across the region, deepening AI-driven insight.' },
  { year: '2035', title: 'A global leader', desc: 'One million IoT devices enabling smarter mobility, safer assets, and more intelligent operations worldwide.' },
]

export default function VisionRoadmap({ content }: { content?: typeof globalVision.timeline }) {
  const { ref: numRef, value } = useCountUp(TARGET, COUNT_MS)

  return (
    <>
      <style>{`
        .vr-stat-wrap {
          position: relative; overflow: hidden; border-radius: 28px;
          /* Very light neutral plate rather than a saturated blue panel — the
             blue now carries the number itself, so the surface stays quiet
             and the figure is what reads. */
          background: linear-gradient(165deg, #f8f9fb 0%, #f2f4f8 100%);
          border: 1px solid #e8ecf4;
          box-shadow: 0 28px 60px -36px rgba(20,40,90,.20);
          padding: clamp(40px,5vw,64px) clamp(24px,4vw,56px);
          text-align: center; isolation: isolate;
        }
        /* Faint blue sheen, high and wide — adds light, no visible seam. */
        .vr-stat-wrap::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(120% 90% at 50% -20%, rgba(19,96,238,.07), transparent 58%);
        }
        @keyframes vrRing { 0%,100% { opacity: .5; transform: scale(1) rotate(0deg); } 50% { opacity: .9; transform: scale(1.05) rotate(180deg); } }
        .vr-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(19,96,238,.10); pointer-events: none; animation: vrRing 14s linear infinite; }

        /* The one saturated element on the plate — same brand gradient the
           Vision hero title uses, so the two read as one system. */
        .vr-num {
          position: relative; z-index: 1;
          font-size: clamp(56px,9vw,112px); font-weight: 800; line-height: 1;
          letter-spacing: -.03em;
          /* Fixed-width figures. Proportional digits change width as they
             cycle, which makes a counting number visibly shudder. */
          font-variant-numeric: tabular-nums;
          background: linear-gradient(105deg, #1360ee 0%, #0d4fd4 46%, #0a3aa0 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
        }

        .vr-timeline { position: relative; max-width: var(--w-940); margin: clamp(48px,6vw,72px) auto 0; }
        /* Today -> 2030 -> 2035 reads as one blue travelling toward cyan, rather
           than blue/purple/green, which looked like three unrelated states. The
           three stops are the site's own hero-gradient blues, so nothing new is
           introduced to the palette. */
        .vr-line { position: absolute; top: 22px; left: 6%; right: 6%; height: 2px; background: linear-gradient(90deg, #1360ee, #0d4fd4, #0a3aa0); border-radius: 2px; z-index: 0; }
        .vr-track { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(3,1fr); gap: clamp(20px,3vw,32px); }
        @media (max-width: 720px) { .vr-line { display: none; } .vr-track { grid-template-columns: 1fr; } }

        .vr-dot { width: 12px; height: 12px; border-radius: 50%; background: #1360ee; margin: 0 auto 18px; box-shadow: 0 0 0 5px rgba(19,96,238,.15); }
        /* Dots sit on the line and take the same three stops, so each marker
           matches the gradient underneath it at that point. */
        .vr-milestone:nth-child(2) .vr-dot { background: #0d4fd4; box-shadow: 0 0 0 5px rgba(13,115,227,.15); }
        .vr-milestone:nth-child(3) .vr-dot { background: #0d4fd4; box-shadow: 0 0 0 5px rgba(6,164,226,.15); }
      `}</style>

      <section style={{ padding: 'clamp(56px,7vw,88px) 28px', background: '#fff' }}>
        <div style={{ maxWidth: 'var(--w-1120)', margin: '0 auto' }}>
          <div className="vr-stat-wrap" data-reveal="zoom">
            <div className="vr-ring" style={{ width: 420, height: 420, left: -140, top: -140 }} />
            <div className="vr-ring" style={{ width: 320, height: 320, right: -100, bottom: -120, animationDelay: '-6s' }} />
            <span style={{ position: 'relative', zIndex: 1, display: 'block', fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase', marginBottom: '16px' }}>
              <span style={{ display: 'block', marginBottom: '12px' }}>
                <span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} />
              </span>
              By 2035
            </span>
            {/* aria-label carries the final figure so a screen reader announces
                the number once, rather than the partial values the count runs
                through. aria-hidden on the visible text keeps the two from
                being read out twice. */}
            <div className="vr-num" ref={numRef} role="img" aria-label="Over 1,000,000 connected IoT devices by 2035">
              <span aria-hidden="true">{value.toLocaleString('en-US')}+</span>
            </div>
            <p style={{ position: 'relative', zIndex: 1, margin: '14px auto 0', maxWidth: '480px', fontSize: 'max(clamp(14px,1.4vw,16px), min(1.111vw, 23.2px))', color: '#6e6e73', lineHeight: 1.65 }}>
              Connected IoT devices enabling smarter mobility, safer assets, and more intelligent operations — worldwide.
            </p>
          </div>

          <div className="vr-timeline" data-reveal>
            <div className="vr-line" aria-hidden="true" />
            <div className="vr-track">
              {(content ?? MILESTONES).map((m, i) => (
                <div className="vr-milestone" key={m.year} data-reveal data-reveal-delay={String(i * 90)} style={{ textAlign: 'center' }}>
                  <div className="vr-dot" />
                  <span style={{ display: 'block', fontSize: 'var(--f-12)', fontWeight: 800, letterSpacing: '.06em', color: '#1360ee', textTransform: 'uppercase', marginBottom: '8px' }}>{m.year}</span>
                  <h3 style={{ margin: '0 0 8px', fontSize: 'max(clamp(15px,1.5vw,17px), min(1.181vw, 24.65px))', fontWeight: 800, color: '#1d1d1f' }}>{m.title}</h3>
                  <p style={{ margin: 0, fontSize: 'var(--f-13-5)', lineHeight: 1.65, color: '#6e6e73' }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
