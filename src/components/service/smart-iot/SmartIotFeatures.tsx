import type { SmartIotFeaturesContent } from '@/content/pages/smart-iot/schema'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const FEATURES = [
  {
    title: 'Centralized Asset Intelligence Dashboard',
    desc: 'Convert IoT data into live insights to control assets on UAE roads and sites.',
    accent: '#1360ee',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    title: 'Enterprise CRM/ERP Integration',
    desc: 'Sync fleet and IoT asset data instantly with your existing CRM or ERP systems.',
    accent: '#1360ee',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'Geofence & POI Smart Alerts',
    desc: 'Set smart virtual zones and receive instant entry, exit, and after-hours alerts.',
    accent: '#1360ee',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: 'Predictive Maintenance & Service Automation',
    desc: 'Automate AI service reminders to reduce breakdowns and maximize equipment uptime.',
    accent: '#1360ee',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6z" />
      </svg>
    ),
  },
]

export default function SmartIotFeatures({ content }: { content?: SmartIotFeaturesContent }) {
  const features = FEATURES.map((feature, index) => ({ ...feature, ...content?.items[index] }))
  return (
    <>
      <style>{`
        .sif-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: clamp(16px,2vw,22px); }
        @media (max-width: 900px) { .sif-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 560px) { .sif-grid { grid-template-columns: 1fr; } }

        .sif-card {
          position: relative; overflow: hidden;
          background: #fff; border: 1px solid #e8ecf4; border-radius: 20px;
          padding: clamp(24px,2.6vw,30px); display: flex; flex-direction: column; gap: 14px;
          box-shadow: 0 2px 12px rgba(20,40,90,.04);
          transition: transform .24s ${EASE}, box-shadow .24s ${EASE};
        }
        .sif-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--sif-accent); transform: scaleX(0); transform-origin: left; transition: transform .3s ${EASE}; }
        .sif-card:hover { transform: translateY(-4px); box-shadow: 0 20px 44px -20px rgba(20,40,90,.28); }
        .sif-card:hover::before { transform: scaleX(1); }
        .sif-ic { width: 50px; height: 50px; border-radius: 14px; display: grid; place-items: center; }
      `}</style>

      <section style={{ padding: 'clamp(56px,7vw,88px) 28px', background: '#fff' }}>
        <div style={{ maxWidth: 'var(--w-1180)', margin: '0 auto' }}>
          <div data-reveal style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto clamp(36px,5vw,52px)' }}>
            <span style={{ fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
              <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
              {content?.eyebrow ?? 'One connected platform'}
            </span>
            <h2 style={{ margin: 0, fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.015em', color: '#1d1d1f' }}>
              {content?.heading ?? 'Intelligence that ties every asset together'}
            </h2>
            {content?.description && <p style={{ margin: '18px 0 0', fontSize: 'var(--f-15)', lineHeight: 1.75, color: '#6e6e73' }}>{content.description}</p>}
          </div>

          <div className="sif-grid">
            {features.map((f, i) => (
              <div key={f.title} className="sif-card" data-reveal data-reveal-delay={String((i % 4) * 80)} style={{ '--sif-accent': f.accent } as React.CSSProperties}>
                <div className="sif-ic" style={{ background: `${f.accent}14`, color: f.accent }}>{f.icon}</div>
                <h3 style={{ margin: 0, fontSize: 'max(clamp(15px,1.5vw,17px), min(1.181vw, 24.65px))', fontWeight: 800, lineHeight: 1.3, color: '#1d1d1f' }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: 'max(clamp(13px,1.2vw,14.5px), min(1.007vw, 21.02px))', lineHeight: 1.65, color: '#6e6e73' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
