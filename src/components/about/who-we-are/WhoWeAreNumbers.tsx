'use client'

import { useEffect, useRef, useState } from 'react'
import { Briefcase, Users, Truck, Database, type LucideIcon } from 'lucide-react'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const STATS: { target: number; suffix: string; label: string; desc: string; icon: LucideIcon }[] = [
  { target: 15, suffix: '+', label: 'Years of Industry Experience', desc: 'Delivering trusted fleet telematics and IoT solutions.', icon: Briefcase },
  { target: 6000, suffix: '+', label: 'Businesses Empowered', desc: 'Helping organizations optimize fleet operations across the UAE.', icon: Users },
  { target: 60000, suffix: '+', label: 'Connected Vehicles & Assets', desc: 'Monitored through our intelligent GPS and IoT platform.', icon: Truck },
  { target: 25, suffix: 'M+', label: 'Data Points Processed Daily', desc: 'Turning real-time operational data into actionable insights.', icon: Database },
]

function formatValue(n: number, target: number) {
  if (target >= 1000) return Math.round(n).toLocaleString('en-US')
  return String(Math.round(n))
}

function StatCard({ stat, start, index, immediate = false }: { stat: typeof STATS[number]; start: boolean; index: number; immediate?: boolean }) {
  const [val, setVal] = useState(0)
  const Icon = stat.icon

  useEffect(() => {
    if (!start || immediate) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(stat.target); return }
    let raf = 0
    const dur = 1600
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setVal(stat.target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, stat.target, immediate])

  return (
    <div className="wwn-card" style={{ transitionDelay: `${index * 90}ms` }}>
      <div className="wwn-icon" aria-hidden="true"><Icon size={20} strokeWidth={2} /></div>
      <div className="wwn-value">
        {formatValue(immediate ? stat.target : val, stat.target)}{stat.suffix}
      </div>
      <div className="wwn-label">{stat.label}</div>
      <p className="wwn-desc">{stat.desc}</p>
    </div>
  )
}

export default function WhoWeAreNumbers({ content }: { content?: { heading: string; description?: string; showStats: boolean; placeholders?: boolean; descriptions?: string[] } }) {
  const ref = useRef<HTMLDivElement>(null)
  const [start, setStart] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStart(true); io.disconnect() } },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .wwn-head { text-align: center; max-width: 720px; margin: 0 auto clamp(36px,4.4vw,52px); }
        .wwn-eyebrow {
          display: block;
          font-size: max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px)); font-weight: 800; letter-spacing: .04em;
          color: #1360ee; text-transform: uppercase; margin-bottom: 20px;
        }
        .wwn-eyebrow-rule { display: block; margin-bottom: 12px; }
        .wwn-eyebrow-rule span { display: inline-block; width: 34px; height: 3px; background: #1360ee; border-radius: 2px; }
        .wwn-h2 {
          margin: 0; font-size: max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px)); font-weight: 800;
          line-height: 1.25; letter-spacing: -.02em; color: #1d1d1f;
        }
        .wwn-h2 em { font-style: normal; color: #1360ee; }

        .wwn-grid {
          max-width: var(--w-1180); margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr);
        }

        .wwn-card {
          position: relative;
          text-align: center;
          padding: clamp(28px,3.2vw,44px) clamp(16px,2vw,28px);
          border-right: 1px solid #e7ebf3;
          opacity: 0; transform: translateY(16px);
          transition: opacity .6s ${EASE}, transform .6s ${EASE};
        }
        .wwn-card:last-child { border-right: none; }
        .wwn-grid[data-in="true"] .wwn-card { opacity: 1; transform: none; }

        .wwn-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 50%;
          background: #eaf1ff; color: #1360ee;
          margin: 0 auto clamp(16px,1.8vw,20px);
          transition: background .22s ${EASE}, color .22s ${EASE};
        }
        .wwn-card:hover .wwn-icon { background: #1360ee; color: #fff; }

        .wwn-value {
          font-size: clamp(26px, 2.4vw + 12px, 34px); font-weight: 800; line-height: 1;
          letter-spacing: -.03em; font-variant-numeric: tabular-nums;
          color: #1360ee; margin-bottom: 10px;
        }
        .wwn-label {
          font-size: var(--f-15); font-weight: 700;
          color: #14181f; letter-spacing: -.01em; line-height: 1.3; margin-bottom: 8px;
        }
        .wwn-desc { margin: 0 auto; max-width: 230px; font-size: var(--f-13); line-height: 1.6; color: #6b7280; }

        @media (max-width: 900px) {
          .wwn-grid { grid-template-columns: repeat(2,1fr); }
          .wwn-card:nth-child(2n) { border-right: none; }
        }
        @media (max-width: 560px) {
          .wwn-grid { grid-template-columns: 1fr; }
          .wwn-card { border-right: none !important; padding-top: clamp(20px,4vw,28px); padding-bottom: clamp(20px,4vw,28px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .wwn-card { transition: none; opacity: 1; transform: none; }
        }
      `}</style>

      <section style={{ padding: 'clamp(56px,7vw,92px) 28px', background: '#fff' }}>
        <div className="wwn-head" data-reveal>
          <span className="wwn-eyebrow">
            <span className="wwn-eyebrow-rule"><span /></span>
            LOCATOR in Numbers
          </span>
          <h2 className="wwn-h2">{content ? content.heading : <>Trusted at scale across <em>the UAE.</em></>}</h2>
          {content?.description && <p style={{ margin: '18px 0 0', color: '#6b7280', lineHeight: 1.7 }}>{content.description}</p>}
        </div>

        {(!content || content.showStats) && <div className="wwn-grid" ref={ref} data-in={content ? true : start}>
          {STATS.map((s, i) => <StatCard key={s.label} stat={{ ...s, target: content?.placeholders ? 0 : s.target, desc: content?.descriptions?.[i] ?? s.desc }} start={start} index={i} immediate={!!content} />)}
        </div>}
      </section>
    </>
  )
}
