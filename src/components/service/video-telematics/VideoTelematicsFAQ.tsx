'use client'

import { useState } from 'react'
import Link from '@/components/country/CountryLink'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const FAQS = [
  {
    q: 'What is ADAS and DMS?',
    a: 'ADAS (Advanced Driver Assistance System) detects road risks like lane departure and collisions. DMS (Driver Monitoring System) tracks driver fatigue and distraction using AI to trigger instant alerts.',
  },
  {
    q: 'What AI fleet dash camera options does LOCATOR have?',
    a: 'LOCATOR offers AI dash cams, multi-camera dash cams, and 4–16 channel MDVR systems, including front, cabin, side, and driver-monitoring cameras for full fleet visibility.',
  },
  {
    q: 'Who should consider implementing AI Dashcam for their fleet?',
    a: 'Companies managing trucks, taxis, buses, delivery, logistics, recovery, construction, school transport, and service fleets should adopt AI dash cams for safety, compliance, and incident proof.',
  },
  {
    q: 'Why are dash cams important for commercial fleets?',
    a: 'Dash cams provide video evidence for accidents, cargo incidents, driver coaching, insurance claims, and dispute protection, improving accountability and reducing business risk.',
  },
  {
    q: 'What is the advantage of LOCATOR’s dash cam solutions?',
    a: 'LOCATOR adds value through AI driver alerts, HD evidence, secure cloud video retrieval, and telematics integration, helping fleets operate safer and smarter.',
  },
  {
    q: 'How do fleet dash cam systems work? When is video saved?',
    a: 'Cameras record continuously. Video is saved automatically when AI detects events like harsh braking, collision, or driver drowsiness, or when triggered manually by managers.',
  },
  {
    q: 'Can I download the videos?',
    a: 'You cannot download directly to the device, but you can request video retrieval from the LOCATOR portal, and our support team can provide approved footage if needed.',
  },
  {
    q: 'How do I check my dash cam footage?',
    a: 'Footage can be viewed via the LOCATOR video telematics dashboard/portal using vehicle and event filters for quick incident playback.',
  },
  {
    q: 'Does a dash cam drain battery?',
    a: 'No, fleet dash cams are optimized for vehicle power systems and do not drain battery during normal operation. Parking mode power usage is also protected by cut-off safety.',
  },
  {
    q: 'Does a dash cam drain battery? How is power managed?',
    a: 'LOCATOR dash cams include voltage and ignition-based power control, preventing battery drain even when vehicles are idle or parked.',
  },
  {
    q: 'What features should I consider when choosing a fleet dash camera?',
    a: 'Look for AI alerts (DMS/ADAS), multi-camera support, night vision, GPS tagging, event-triggered saving, cloud video access, and MDVR channel scalability.',
  },
  {
    q: 'How can AI dash cams improve driver behavior and safety?',
    a: 'AI dash cams detect drowsiness, distraction, harsh driving, and road hazards, issuing real-time alerts and enabling data-backed driver coaching to reduce accidents.',
  },
  {
    q: 'What are the best practices for implementing dash cam systems in fleets?',
    a: 'Best practices include: set AI alert thresholds, integrate driver training, review events weekly, enforce safety policies, use video for claims, and protect data via secure access controls.',
  },
  {
    q: 'How do I check my dash cam footage from the portal?',
    a: 'Use LOCATOR’s HD video telematics portal, filter by date, vehicle, or event, and play footage instantly without removing the SD card.',
  },
  {
    q: 'Does a dash cam drain battery when the vehicle is parked?',
    a: 'No. LOCATOR cameras use smart power management and auto cut-off protection to ensure zero battery drain risk.',
  },
]

export default function VideoTelematicsFAQ() {
  const [openIdx, setOpenIdx] = useState<number>(0)
  const toggle = (i: number) => setOpenIdx(p => (p === i ? -1 : i))

  return (
    <>
      <style>{`
        .vtfq-item {
          background: #fff;
          border: 1px solid #e8e8eb;
          border-left: 2.5px solid transparent;
          border-radius: 12px;
          overflow: hidden;
          transition: border-color .2s ${EASE}, box-shadow .2s ${EASE}, background .2s ${EASE};
        }
        .vtfq-item.on {
          border-color: #cdd9ff;
          border-left-color: #1360ee;
          background: #fafbff;
          box-shadow: 0 2px 20px rgba(19,96,238,.08);
        }
        .vtfq-trig {
          width: 100%; background: none; border: none;
          display: flex; align-items: flex-start; gap: 14px;
          padding: 17px 18px;
          cursor: pointer; font-family: inherit; text-align: left;
        }
        .vtfq-num {
          font-size: var(--f-10); font-weight: 700;
          font-family: ui-monospace, 'Cascadia Code', monospace;
          color: #c4c4d0; padding-top: 3px; flex-shrink: 0;
          width: 18px; letter-spacing: .02em;
          transition: color .18s ${EASE};
        }
        .vtfq-item.on .vtfq-num { color: #1360ee; }
        .vtfq-qtext {
          flex: 1; font-size: var(--f-14); font-weight: 700;
          line-height: 1.45; letter-spacing: -.01em; color: #1d1d1f;
          transition: color .18s ${EASE};
        }
        .vtfq-item.on .vtfq-qtext { color: #1360ee; }
        .vtfq-icon {
          width: 26px; height: 26px; border-radius: 50%;
          display: grid; place-items: center; flex-shrink: 0;
          background: #f2f2f5; color: #a0a0b0;
          margin-top: 1px;
          transition: background .22s ${EASE}, color .22s ${EASE},
                      transform .48s cubic-bezier(.34,1.3,.64,1);
        }
        .vtfq-item.on .vtfq-icon {
          background: #dde7ff; color: #1360ee; transform: rotate(180deg);
        }
        .vtfq-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows .44s ${EASE};
        }
        .vtfq-item.on .vtfq-body { grid-template-rows: 1fr; }
        .vtfq-inner { overflow: hidden; min-height: 0; }
        .vtfq-ans {
          margin: 0;
          padding: 0 18px 20px 50px;
          font-size: var(--f-13-5); line-height: 1.72; color: #6e6e73;
          opacity: 0;
          transform: translateY(-7px);
          transition: opacity .22s 0s, transform .28s 0s ${EASE};
        }
        .vtfq-item.on .vtfq-ans {
          opacity: 1; transform: translateY(0);
          transition: opacity .32s .1s, transform .38s .08s ${EASE};
        }
      `}</style>

      <section id="faq" style={{ padding: 'clamp(56px,7vw,80px) 28px', background: '#fff' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQS.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
        <div style={{ maxWidth: 'var(--w-900)', margin: '0 auto' }}>

          <div data-reveal style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{
              fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em',
              color: '#1360ee', textTransform: 'uppercase' as const,
              display: 'block', marginBottom: '16px',
            }}>
              <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
              FAQ
            </span>
            <h2 style={{ margin: 0, fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-.015em', color: '#1d1d1f' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div data-reveal data-reveal-delay="80" style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {FAQS.map((item, i) => (
              <div key={item.q} className={`vtfq-item${openIdx === i ? ' on' : ''}`}>
                <button className="vtfq-trig" onClick={() => toggle(i)}>
                  <span className="vtfq-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="vtfq-qtext">{item.q}</span>
                  <span className="vtfq-icon" aria-hidden="true">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M1.5 3.5 5.5 7.5l4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <div className="vtfq-body">
                  <div className="vtfq-inner">
                    <p className="vtfq-ans">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p data-reveal style={{ margin: '24px 0 0', textAlign: 'center', fontSize: 'var(--f-13)', color: '#a1a1a6', lineHeight: 1.55 }}>
            Can&apos;t find what you&apos;re looking for?{' '}
            <Link href="/contact" style={{ color: '#1360ee', fontWeight: 700, textDecoration: 'none' }}>
              Contact our team
            </Link>
            {' '}— we&apos;re happy to help.
          </p>

        </div>
      </section>
    </>
  )
}
