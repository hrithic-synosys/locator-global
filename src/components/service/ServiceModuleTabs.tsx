import Link from '@/components/country/CountryLink'
import { SERVICE_PAGES } from '@/components/service/data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/**
 * The cross-links between Locator's five service modules (Fleet Telematics,
 * Video Telematics, Smart IoT, Task Manager, Tracking Devices). Used to live
 * pinned to the top of the Task Manager hero (ServicePillarHero) — moved down
 * to its own strip above the footer so the hero can carry a full photo banner
 * like its sibling module pages.
 */
export default function ServiceModuleTabs({ active }: { active: string }) {
  return (
    <>
      <style>{`
        .smt-tabs {
          display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;
          max-width: var(--w-960); margin: 0 auto;
        }
        .smt-tab {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: var(--f-13); font-weight: 700; color: #6e6e73;
          padding: 9px 16px 9px 10px; border-radius: 999px;
          border: 1px solid #e8ecf4; background: #fff; text-decoration: none;
          transition: .2s ${EASE};
        }
        .smt-tab:hover { border-color: var(--tab-accent); color: var(--tab-accent); transform: translateY(-1px); }
        .smt-tab-dot { width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0; background: rgba(0,0,0,.05); color: #a0a0a8; transition: .2s ${EASE}; }
        .smt-tab-dot svg { width: 11px; height: 11px; }
        .smt-tab.active { border-color: var(--tab-accent); background: var(--tab-accent-tint); color: var(--tab-accent); }
        .smt-tab.active .smt-tab-dot { background: var(--tab-accent); color: #fff; }
      `}</style>

      <section style={{ padding: 'clamp(40px,5vw,64px) 28px', background: '#f7f9fc', borderTop: '1px solid #eef0f4' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: 'var(--f-11-5)', fontWeight: 700, letterSpacing: '.08em', color: '#8e8e93', textTransform: 'uppercase' }}>
            Explore other Locator services
          </span>
        </div>
        <nav className="smt-tabs" aria-label="Locator services">
          {SERVICE_PAGES.map(p => (
            <Link
              key={p.slug}
              href={`/service/${p.slug}`}
              className={`smt-tab${p.slug === active ? ' active' : ''}`}
              style={{ '--tab-accent': p.accent, '--tab-accent-tint': `${p.accent}12` } as React.CSSProperties}
            >
              <span className="smt-tab-dot">{p.icon}</span>
              {p.name}
            </Link>
          ))}
        </nav>
      </section>
    </>
  )
}
