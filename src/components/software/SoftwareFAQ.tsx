'use client'
import { useState, useMemo } from 'react'
import Link from '@/components/country/CountryLink'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

// ── Categories ───────────────────────────────────────────────────────────────

const CATS = [
  { id: 'all',      label: 'All questions' },
  { id: 'platform', label: 'Platform & App' },
  { id: 'tracking', label: 'GPS & Tracking' },
  { id: 'modules',  label: 'Modules' },
  { id: 'dashcam',  label: 'AI Dashcam' },
  { id: 'general',  label: 'Industries' },
]

// ── FAQ data ─────────────────────────────────────────────────────────────────

const ALL_FAQS = [
  {
    cat: 'platform',
    q: 'What is LOCATOR fleet management software?',
    a: 'LOCATOR is a GPS tracking and fleet telematics platform that lets businesses monitor vehicles, drivers, routes, tasks, expenses, inspections, maintenance, and AI dashcam alerts — all from a single web and mobile interface.',
  },
  {
    cat: 'platform',
    q: 'Does the platform have a mobile app?',
    a: 'Yes. Field staff use the mobile app to receive tasks, update status, photograph and upload expense bills, complete vehicle inspections, and log service activity in real time.',
  },
  {
    cat: 'tracking',
    q: 'Can I track vehicles live?',
    a: 'Yes. Every vehicle is visible on a live map with real-time speed, location, and driver status. You can also replay full route history for any previous date.',
  },
  {
    cat: 'tracking',
    q: 'Can I set geofence zones and get alerts?',
    a: 'Yes. Draw virtual zones around offices, depots, or customer sites and receive instant entry and exit alerts. You can also set after-hours movement alerts for added security.',
  },
  {
    cat: 'modules',
    q: 'Can I assign tasks to drivers or field staff?',
    a: 'Yes. The Task Manager lets admins dispatch jobs, monitor live completion progress, collect custom field data, and track payment status — all from the dashboard.',
  },
  {
    cat: 'modules',
    q: 'Can drivers upload fuel or parking receipts?',
    a: 'Yes. The Expense Manager lets field teams photograph and upload fuel, parking, toll, and ad-hoc expenses from the mobile app. Admins review and approve with one tap.',
  },
  {
    cat: 'modules',
    q: 'Does the software support vehicle inspections?',
    a: 'Yes. The Inspection Module provides fully customisable checklists, photo uploads, vehicle condition reports, and driver handover tracking to maintain accountability across your fleet.',
  },
  {
    cat: 'modules',
    q: 'Can I get automated service reminders?',
    a: 'Yes. The Fleet Service Manager automates reminders for oil changes, tire rotations, and any custom maintenance schedule — reducing unexpected breakdowns and keeping vehicles road-ready.',
  },
  {
    cat: 'dashcam',
    q: 'Does LOCATOR support AI dashcam?',
    a: 'Yes. LOCATOR supports AI-powered dashcams with live HD video streaming, on-demand video retrieval, driver behaviour monitoring, and real-time unsafe driving alerts.',
  },
  {
    cat: 'dashcam',
    q: 'What driver behaviours can the AI dashcam detect?',
    a: 'The AI detects yawning, smoking, seatbelt violations, phone use, distraction, drowsy eyes, nodding off, and looking away — triggering instant audible in-cab alerts and dashboard notifications.',
  },
  {
    cat: 'general',
    q: 'Which industries can use LOCATOR?',
    a: 'The platform suits logistics, FMCG, construction, rental fleets, school transport, healthcare, facility management, waste management, field services, taxis, and recovery vehicles across the UAE and beyond.',
  },
]

// ── Component ────────────────────────────────────────────────────────────────

export default function SoftwareFAQ() {
  const [activeCat, setActiveCat] = useState('all')
  const [openIdx, setOpenIdx] = useState<number>(0)

  const filtered = useMemo(
    () => (activeCat === 'all' ? ALL_FAQS : ALL_FAQS.filter(f => f.cat === activeCat)),
    [activeCat],
  )

  const handleCat = (id: string) => {
    setActiveCat(id)
    setOpenIdx(0)
  }

  const toggle = (i: number) => setOpenIdx(p => (p === i ? -1 : i))

  return (
    <>
      <style>{`
        /* ── entrance animation for list on category switch ── */
        @keyframes fqSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }

        /* ── category sidebar buttons ── */
        .fq-cat {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 10px 13px; border-radius: 9px;
          border: none; background: none; cursor: pointer;
          font-family: inherit; font-size: var(--f-13); font-weight: 600;
          color: #52525e; text-align: left;
          transition: background .15s ${EASE}, color .15s ${EASE};
        }
        .fq-cat:hover:not(.on) { background: #f5f5f7; color: #1d1d1f; }
        .fq-cat.on { background: #eef3ff; color: #1360ee; font-weight: 700; }

        .fq-badge {
          font-size: var(--f-10); font-weight: 700; padding: 2px 7px;
          border-radius: 999px; background: rgba(0,0,0,.06); color: #8888a0;
          transition: background .15s, color .15s;
          font-variant-numeric: tabular-nums;
        }
        .fq-cat.on .fq-badge { background: rgba(19,96,238,.13); color: #1360ee; }

        /* ── FAQ item card ── */
        .fq-item {
          background: #fff;
          border: 1px solid #e8e8eb;
          border-left: 2.5px solid transparent;
          border-radius: 12px;
          overflow: hidden;
          transition: border-color .2s ${EASE}, box-shadow .2s ${EASE}, background .2s ${EASE};
        }
        .fq-item.on {
          border-color: #cdd9ff;
          border-left-color: #1360ee;
          background: #fafbff;
          box-shadow: 0 2px 20px rgba(19,96,238,.08);
        }

        /* ── trigger button ── */
        .fq-trig {
          width: 100%; background: none; border: none;
          display: flex; align-items: flex-start; gap: 14px;
          padding: 17px 18px;
          cursor: pointer; font-family: inherit; text-align: left;
        }

        /* ── index number ── */
        .fq-num {
          font-size: var(--f-10); font-weight: 700;
          font-family: ui-monospace, 'Cascadia Code', monospace;
          color: #c4c4d0; padding-top: 3px; flex-shrink: 0;
          width: 18px; letter-spacing: .02em;
          transition: color .18s ${EASE};
        }
        .fq-item.on .fq-num { color: #1360ee; }

        /* ── question text ── */
        .fq-qtext {
          flex: 1; font-size: var(--f-14-5); font-weight: 700;
          line-height: 1.45; letter-spacing: -.01em; color: #1d1d1f;
          transition: color .18s ${EASE};
        }
        .fq-item.on .fq-qtext { color: #1360ee; }

        /* ── chevron icon — spring rotation ── */
        .fq-icon {
          width: 26px; height: 26px; border-radius: 50%;
          display: grid; place-items: center; flex-shrink: 0;
          background: #f2f2f5; color: #a0a0b0;
          margin-top: 1px;
          transition: background .22s ${EASE}, color .22s ${EASE},
                      transform .48s cubic-bezier(.34,1.3,.64,1);
        }
        .fq-item.on .fq-icon {
          background: #dde7ff; color: #1360ee; transform: rotate(180deg);
        }

        /* ── CSS grid-rows accordion (smooth native height) ── */
        .fq-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows .44s ${EASE};
        }
        .fq-item.on .fq-body { grid-template-rows: 1fr; }
        .fq-inner { overflow: hidden; min-height: 0; }

        /* ── answer text: fade + slide ── */
        .fq-ans {
          margin: 0;
          padding: 0 18px 20px 50px;
          font-size: var(--f-13-5); line-height: 1.72; color: #6e6e73;
          opacity: 0;
          transform: translateY(-7px);
          transition: opacity .22s 0s, transform .28s 0s ${EASE};
        }
        .fq-item.on .fq-ans {
          opacity: 1; transform: translateY(0);
          transition: opacity .32s .1s, transform .38s .08s ${EASE};
        }

        /* ── animated list wrapper ── */
        .fq-list { animation: fqSlideIn .26s ${EASE} both; }

        /* ── responsive ── */
        @media (max-width: 860px) {
          .fq-grid { grid-template-columns: 1fr !important; }
          .fq-sidebar { flex-direction: row !important; flex-wrap: wrap !important; gap: 6px !important; padding: 0 !important; border: none !important; }
          .fq-cat { width: auto !important; padding: 7px 13px !important; border: 1px solid #e8e8eb !important; }
          .fq-badge { display: none; }
          .fq-sidebar-label { display: none !important; }
        }
      `}</style>

      <section id="faq" style={{ padding: 'clamp(56px,7vw,80px) 28px', background: '#fff' }}>
        <div style={{ maxWidth: 'var(--w-1120)', margin: '0 auto' }}>

          {/* ── Header ── */}
          <div data-reveal style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em',
              color: '#1360ee', textTransform: 'uppercase' as const,
              display: 'block', marginBottom: '16px',
            }}>
              <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
              FAQ
            </span>
            <h2 style={{ margin: 0, fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-.015em', color: '#1d1d1f' }}>
              Frequently asked questions
            </h2>
          </div>

          {/* ── Main grid ── */}
          <div
            className="fq-grid"
            data-reveal
            data-reveal-delay="80"
            style={{ display: 'grid', gridTemplateColumns: '196px 1fr', gap: '28px', alignItems: 'start' }}
          >

            {/* ── Sidebar category nav ── */}
            <div
              className="fq-sidebar"
              style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '6px', background: '#f9f9fb', borderRadius: '14px', border: '1px solid #e8e8eb' }}
            >
              <p className="fq-sidebar-label" style={{ margin: '6px 4px 8px', fontSize: 'var(--f-10)', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase' as const, color: '#b0b0be' }}>
                Browse by topic
              </p>
              {CATS.map(cat => {
                const count = cat.id === 'all'
                  ? ALL_FAQS.length
                  : ALL_FAQS.filter(f => f.cat === cat.id).length
                return (
                  <button
                    key={cat.id}
                    className={`fq-cat${activeCat === cat.id ? ' on' : ''}`}
                    onClick={() => handleCat(cat.id)}
                  >
                    <span>{cat.label}</span>
                    <span className="fq-badge">{count}</span>
                  </button>
                )
              })}
            </div>

            {/* ── FAQ accordion list ── */}
            <div className="fq-list" key={activeCat}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {filtered.map((item, i) => (
                  <div key={`${activeCat}-${i}`} className={`fq-item${openIdx === i ? ' on' : ''}`}>

                    {/* Trigger */}
                    <button className="fq-trig" onClick={() => toggle(i)}>
                      <span className="fq-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="fq-qtext">{item.q}</span>
                      <span className="fq-icon" aria-hidden="true">
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path d="M1.5 3.5 5.5 7.5l4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>

                    {/* Answer — CSS grid-rows for true smooth height */}
                    <div className="fq-body">
                      <div className="fq-inner">
                        <p className="fq-ans">{item.a}</p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Bottom note */}
              <p style={{ margin: '24px 0 0', fontSize: 'var(--f-13)', color: '#a1a1a6', lineHeight: 1.55 }}>
                Can't find what you're looking for?{' '}
                <Link href="/contact" style={{ color: '#1360ee', fontWeight: 700, textDecoration: 'none' }}>
                  Contact our team
                </Link>
                {' '}— we're happy to help.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
