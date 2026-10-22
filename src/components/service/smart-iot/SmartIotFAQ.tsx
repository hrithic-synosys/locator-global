'use client'

import { useState } from 'react'
import Link from '@/components/country/CountryLink'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const FAQS = [
  { q: 'What is GPS Asset Tracking in IoT?', a: 'GPS asset tracking uses IoT devices to track location, movement, and status of machines, containers, tanks, boats, and equipment.' },
  { q: 'Can GPS trackers monitor fixed assets like tanks or containers?', a: 'Yes. LOCATOR tracks fixed assets like fuel or water tanks, shipping containers, and cold-storage units using GPS and IoT sensors.' },
  { q: 'What heavy equipment can be tracked using telematics?', a: 'Assets like forklifts, generators, cranes, JCBs, boom loaders, bulldozers, and excavators can be monitored via industrial IoT telematics.' },
  { q: 'How does heavy machinery monitoring improve operations?', a: 'It reduces breakdowns, prevents misuse, tracks utilization, monitors idle time, and schedules maintenance for better site productivity.' },
  { q: 'What type of IoT sensors are commonly used in UAE fleets?', a: 'Sensors for temperature, vibration, tilt, liquid/fuel level, door status, voltage, and machine load telemetry are widely used.' },
  { q: 'How does IoT telemetry help businesses make smarter decisions?', a: 'Telemetry turns sensor data into alerts and reports, helping managers improve dispatch, safety, maintenance, cost control, and compliance.' },
  { q: 'Can sensor alerts be received in real time?', a: 'Yes. LOCATOR sends instant IoT alerts for movement, idle time, geofence breaches, liquid changes, and machine anomalies.' },
  { q: 'What is the biggest benefit of GPS + IoT asset monitoring for UAE companies?', a: 'It solves asset loss, routing confusion, fuel waste, unauthorized usage, delayed service, and poor field coordination.' },
  { q: 'Is GPS fleet telematics suitable for UAE weather and road conditions?', a: 'Yes. LOCATOR solutions are heat-resistant, network-optimized, and built for 24/7 UAE road and site operations.' },
  { q: 'How does LOCATOR unify fleet and IoT asset monitoring?', a: 'Through a central dashboard that tracks vehicles and equipment with GPS, geofencing, sensor alerts, and telemetry insights in one window.' },
]

export default function SmartIotFAQ() {
  const [openIdx, setOpenIdx] = useState<number>(0)
  const toggle = (i: number) => setOpenIdx(p => (p === i ? -1 : i))

  return (
    <>
      <style>{`
        .sifq-item { background: #fff; border: 1px solid #e8e8eb; border-left: 2.5px solid transparent; border-radius: 12px; overflow: hidden; transition: border-color .2s ${EASE}, box-shadow .2s ${EASE}, background .2s ${EASE}; }
        .sifq-item.on { border-color: #cdd9ff; border-left-color: #1360ee; background: #fafbff; box-shadow: 0 2px 20px rgba(19,96,238,.08); }
        .sifq-trig { width: 100%; background: none; border: none; display: flex; align-items: flex-start; gap: 14px; padding: 17px 18px; cursor: pointer; font-family: inherit; text-align: left; }
        .sifq-num { font-size: var(--f-10); font-weight: 700; font-family: ui-monospace, 'Cascadia Code', monospace; color: #c4c4d0; padding-top: 3px; flex-shrink: 0; width: 18px; letter-spacing: .02em; transition: color .18s ${EASE}; }
        .sifq-item.on .sifq-num { color: #1360ee; }
        .sifq-qtext { flex: 1; font-size: var(--f-14); font-weight: 700; line-height: 1.45; letter-spacing: -.01em; color: #1d1d1f; transition: color .18s ${EASE}; }
        .sifq-item.on .sifq-qtext { color: #1360ee; }
        .sifq-icon { width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0; background: #f2f2f5; color: #a0a0b0; margin-top: 1px; transition: background .22s ${EASE}, color .22s ${EASE}, transform .48s cubic-bezier(.34,1.3,.64,1); }
        .sifq-item.on .sifq-icon { background: #dde7ff; color: #1360ee; transform: rotate(180deg); }
        .sifq-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .44s ${EASE}; }
        .sifq-item.on .sifq-body { grid-template-rows: 1fr; }
        .sifq-inner { overflow: hidden; min-height: 0; }
        .sifq-ans { margin: 0; padding: 0 18px 20px 50px; font-size: var(--f-13-5); line-height: 1.72; color: #6e6e73; opacity: 0; transform: translateY(-7px); transition: opacity .22s 0s, transform .28s 0s ${EASE}; }
        .sifq-item.on .sifq-ans { opacity: 1; transform: translateY(0); transition: opacity .32s .1s, transform .38s .08s ${EASE}; }
      `}</style>

      <section id="faq" style={{ padding: 'clamp(56px,7vw,80px) 28px', background: '#f7f9fc' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }}
        />
        <div style={{ maxWidth: 'var(--w-900)', margin: '0 auto' }}>
          <div data-reveal style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase' as const, display: 'block', marginBottom: '16px' }}>
              <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
              FAQ
            </span>
            <h2 style={{ margin: 0, fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-.015em', color: '#1d1d1f' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div data-reveal data-reveal-delay="80" style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {FAQS.map((item, i) => (
              <div key={item.q} className={`sifq-item${openIdx === i ? ' on' : ''}`}>
                <button className="sifq-trig" onClick={() => toggle(i)}>
                  <span className="sifq-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="sifq-qtext">{item.q}</span>
                  <span className="sifq-icon" aria-hidden="true">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M1.5 3.5 5.5 7.5l4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <div className="sifq-body">
                  <div className="sifq-inner">
                    <p className="sifq-ans">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p data-reveal style={{ margin: '24px 0 0', textAlign: 'center', fontSize: 'var(--f-13)', color: '#a1a1a6', lineHeight: 1.55 }}>
            Can&apos;t find what you&apos;re looking for?{' '}
            <Link href="/contact" style={{ color: '#1360ee', fontWeight: 700, textDecoration: 'none' }}>Contact our team</Link>
            {' '}— we&apos;re happy to help.
          </p>
        </div>
      </section>
    </>
  )
}
