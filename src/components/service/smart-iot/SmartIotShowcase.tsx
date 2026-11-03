import Image from 'next/image'
import type { SmartIotBlock } from '@/content/pages/smart-iot/schema'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const DEFAULT_BLOCKS = [
  {
    // Anchor targets for the home-page IoT cards.
    id: 'gps-asset-tracking',
    eyebrow: 'GPS Asset Tracking',
    title: 'GPS Asset Tracking',
    body: 'LOCATOR’s IoT GPS asset tracking helps UAE businesses monitor cargo containers, refrigerated trailers, tourism yachts, rental fleets, and fixed assets. With live location, movement history, and geofence alerts, companies reduce asset loss, improve delivery coordination, enhance driver and field-team control, and resolve claims faster with digital proof — making road operations smoother and stress-free.',
    image: '/services/smart-iot/gps-asset-tracking.webp',
    imageW: 1672,
    imageH: 941,
  },
  {
    id: 'equipment-machinery',
    eyebrow: 'Equipment & Machinery',
    title: 'Equipment & Heavy Machinery Monitoring',
    body: 'LOCATOR delivers industrial telematics and IoT equipment tracking for UAE construction and facility assets like bulldozers, JCBs, cranes, boom loaders, generators, and forklifts. With real-time usage, idle monitoring, condition audits, and automated service alerts, businesses improve equipment uptime, operator safety, fuel control, and job-site operations using one centralized dashboard.',
    image: '/services/smart-iot/equipment-machinery.webp',
    imageW: 1672,
    imageH: 941,
  },
  {
    id: 'iot-sensors',
    eyebrow: 'Sensors & Telemetry',
    title: 'IoT Sensors & Telemetry Projects',
    body: 'LOCATOR delivers custom IoT sensors and real-time telemetry for UAE businesses, including cold-chain temperature tracking, fuel and liquid monitoring for fixed tanks, tilt sensors for concrete mix, door-status logs for cargo trucks, vibration analytics for heavy machines, and generator load tracking. This reduces failures, speeds issue resolution, improves compliance, and enables paperless, efficient field operations.',
    image: '/services/smart-iot/iot-sensors.webp',
    imageW: 1619,
    imageH: 972,
  },
]

export default function SmartIotShowcase({ blocks: BLOCKS = DEFAULT_BLOCKS }: { blocks?: SmartIotBlock[] }) {
  return (
    <>
      <style>{`
        /* scroll-margin keeps the anchored block clear of the sticky navbar. */
        .sis-block { padding: clamp(48px,6vw,80px) 28px; scroll-margin-top: 90px; }
        .sis-block:nth-child(even) { background: #f7f9fc; }
        .sis-grid { display: grid; grid-template-columns: 1fr 1.05fr; gap: clamp(32px,5vw,64px); align-items: center; max-width: var(--w-1180); margin: 0 auto; }
        @media (max-width: 900px) { .sis-grid { grid-template-columns: 1fr; gap: 32px; } }
        .sis-block.flip .sis-text { order: 2; }
        .sis-block.flip .sis-viz { order: 1; }
        @media (max-width: 900px) { .sis-block.flip .sis-text, .sis-block.flip .sis-viz { order: 0; } }

        .sis-viz {
          border-radius: 18px; overflow: hidden;
          border: 1px solid #e7ebf3; background: #fff;
          box-shadow: 0 30px 60px -28px rgba(20,40,90,.3);
        }
        .sis-viz img { width: 100%; height: auto; display: block; }
      `}</style>

      <section>
        {BLOCKS.map((b, i) => (
          <div key={b.title} id={b.id} className={`sis-block${i % 2 === 1 ? ' flip' : ''}`}>
            <div className="sis-grid">
              <div className="sis-text" data-reveal={i % 2 === 1 ? 'right' : 'left'}>
                <span style={{ display: 'block', fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase', marginBottom: '16px' }}>
                  <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
                  {b.eyebrow}
                </span>
                <h2 style={{ margin: '0 0 16px', fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-.015em', color: '#1d1d1f' }}>
                  {b.title}
                </h2>
                <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.3vw,16px), min(1.111vw, 23.2px))', lineHeight: 1.8, color: '#52525e', maxWidth: '52ch' }}>
                  {b.body}
                </p>
              </div>
              <div className="sis-viz" data-reveal={i % 2 === 1 ? 'left' : 'right'}>
                <Image src={b.image} alt={b.title} width={b.imageW} height={b.imageH} style={{ transition: `transform .5s ${EASE}` }} />
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
