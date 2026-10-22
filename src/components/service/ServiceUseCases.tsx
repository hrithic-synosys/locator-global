import Image from 'next/image'
import Link from '@/components/country/CountryLink'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const USE_CASES = [
  {
    title: 'Sales & Service Tracking',
    desc: 'The ideal solution to track and monitor sales and service vehicles that carry employees and products on the road.',
    href: '/service/fleet-telematics',
    img: '/services/gps-tracker/vehicle-tracking.jpg',
    alt: 'Sales and service vehicle tracked live on a desktop dashboard',
  },
  {
    title: 'Delivery & Trucks Tracking',
    desc: 'Customer service and fleet efficiency that result in the financial success of your service delivery and trucking business.',
    href: '/service/fleet-telematics',
    img: '/services/gps-tracker/truck-tracking.jpg',
    alt: 'Delivery truck monitored through the LOCATOR fleet dashboard',
  },
  {
    title: 'Asset Tracking',
    desc: 'Monitor important events of generators and other assets — location, fuel level, running hours, temperature, and more.',
    href: '/service/smart-iot',
    img: '/services/gps-tracker/asset-tracking.jpg',
    alt: 'Construction assets and generators pinned on a tracking map',
  },
]

export default function ServiceUseCases() {
  return (
    <>
      <style>{`
        .suc-wrap {
          position: relative; overflow: hidden; isolation: isolate;
          border-radius: 34px; background: linear-gradient(135deg, #1360ee 0%, #0d4fd4 100%);
          padding: clamp(48px,6vw,72px) 32px; text-align: center; color: #fff;
        }
        .suc-quote-mark {
          font-size: 64px; font-weight: 900; line-height: 1; color: rgba(255,255,255,.22);
          font-family: Georgia, serif; margin-bottom: -12px;
        }
        .suc-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; max-width: var(--w-1120); margin: clamp(40px,5vw,56px) auto 0; }
        @media (max-width: 820px) { .suc-cards { grid-template-columns: 1fr; } }
        .suc-card {
          background: #fff; border: 1px solid #e7ebf3; border-radius: 20px;
          overflow: hidden; text-align: left; text-decoration: none; display: block;
          transition: transform .26s ${EASE}, box-shadow .26s ${EASE}, border-color .26s ${EASE};
        }
        .suc-card:hover { transform: translateY(-4px); box-shadow: 0 22px 44px -20px rgba(19,96,238,.28); border-color: #dbe6ff; }
        .suc-media {
          display: block; overflow: hidden; background: #f3f7ff;
          border-bottom: 1px solid #eef1f7;
        }
        .suc-media img { width: 100%; height: auto; display: block; transition: transform .35s ${EASE}; }
        .suc-card:hover .suc-media img { transform: scale(1.04); }
        .suc-body { padding: 24px 26px 28px; }
        .suc-link { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; font-size: 13px; font-weight: 700; color: #1360ee; }
      `}</style>

      <section style={{ padding: 'clamp(24px,4vw,40px) 28px clamp(56px,7vw,88px)', background: '#fff' }}>
        <div style={{ maxWidth: 'var(--w-1120)', margin: '0 auto' }}>

          {/* Quote banner */}
          <div className="suc-wrap" data-reveal="zoom">
            <span className="suc-quote-mark">&ldquo;</span>
            <p style={{ margin: '0 auto', maxWidth: '640px', fontSize: 'max(clamp(16px,2vw,21px), min(1.458vw, 30.45px))', fontWeight: 600, lineHeight: 1.6, color: '#fff' }}>
              Most companies struggle to effectively utilize their vehicles and field staff. We built a software
              tool that helps them manage and control their fleet, so their company can start growing again and
              increase revenue.
            </p>
          </div>

          {/* Use-case cards */}
          <div className="suc-cards">
            {USE_CASES.map(u => (
              <Link key={u.title} href={u.href} className="suc-card" data-reveal>
                <div className="suc-media">
                  <Image src={u.img} alt={u.alt} width={302} height={228} sizes="(max-width: 820px) 92vw, 360px" />
                </div>
                <div className="suc-body">
                  <h3 style={{ margin: '0 0 8px', fontSize: 'var(--f-16)', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-.01em' }}>{u.title}</h3>
                  <p style={{ margin: 0, fontSize: 'var(--f-13-5)', lineHeight: 1.65, color: '#6e6e73' }}>{u.desc}</p>
                  <span className="suc-link">Read details →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
