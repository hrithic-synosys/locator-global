'use client'

import dynamic from 'next/dynamic'
import ModuleShowcaseStyles from '@/components/software/modules/ModuleShowcaseStyles'
import { sharedTaskManager } from '@/content/pages/task-manager/shared'
import type { TaskManagerContent } from '@/content/pages/task-manager/schema'

// Same interactive wireframe used in the Software page's #task-manager module.
const TaskManagerShowcase = dynamic(
  () => import('@/components/software/modules/TaskManagerShowcase'),
  { ssr: false },
)

/**
 * The Software page's `#task-manager` module, lifted out as a standalone
 * section for /service/task-manager. Reuses the exact `pm-*` layout so both
 * pages render the same text-beside-showcase panel.
 */
export default function ServiceTaskManager({ content = sharedTaskManager.introduction }: { content?: TaskManagerContent['introduction'] }) {
  return (
    <>
      <ModuleShowcaseStyles />
      <style href="svc-task-manager" precedence="medium">{`
        .pm-sec { padding: clamp(40px,5vw,76px) clamp(24px,6vw,96px); border-top: 1px solid #f0f0f3; scroll-margin-top: 84px; }

        .pm-grid {
          max-width: var(--w-1280); margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1.4fr);
          gap: clamp(28px, 3.4vw, 56px);
          align-items: center;
        }

        .pm-text { text-align: left; }
        .pm-tag {
          display: block;
          font-size: max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px)); font-weight: 800; letter-spacing: .04em;
          color: #1360ee; text-transform: uppercase; margin-bottom: 16px;
        }
        .pm-tag span {
          display: block; width: 34px; height: 3px;
          background: #1360ee; border-radius: 2px; margin-bottom: 12px;
        }
        .pm-h2 { margin: 0; font-size: max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px)); font-weight: 800; line-height: 1.25; letter-spacing: -.015em; color: rgb(72, 75, 76); }
        .pm-lead { margin: 18px 0 0; font-size: max(clamp(14px,1.45vw,16px), min(1.111vw, 23.2px)); line-height: 1.62; color: #6e6e73; max-width: 46ch; }
        .pm-suited-label { margin: 22px 0 0; font-size: var(--f-11-5); font-weight: 700; letter-spacing: .06em; color: #1d1d1f; text-transform: uppercase; }
        .pm-suited { margin: 14px 0 0; display: flex; flex-wrap: wrap; gap: 9px; }
        .pm-suited span { font-size: var(--f-13-5); font-weight: 600; color: #1d1d1f; background: #fff; border: 1px solid #e3e3e6; padding: 8px 14px; border-radius: 999px; }

        .pm-viz { min-width: 0; }
        .pm-feature-list { display: grid; gap: 12px; margin: 24px 0 0; padding: 0; list-style: none; text-align: left; color: #3a4459; font-size: var(--f-14); line-height: 1.6; }
        .pm-feature-list li { display: flex; align-items: flex-start; gap: 10px; margin: 0; padding: 0; }
        .pm-feature-check { flex-shrink: 0; width: 21px; height: 21px; margin-top: 1px; border-radius: 50%; background: #edf4ff; color: #1360ee; display: grid; place-items: center; }
        .pm-feature-text { min-width: 0; }

        @media (max-width: 1080px) {
          .pm-grid { grid-template-columns: 1fr; gap: clamp(22px,4vw,34px); }
          .pm-text { text-align: center; max-width: 760px; margin: 0 auto; }
          .pm-lead { margin-left: auto; margin-right: auto; }
          .pm-suited { justify-content: center; }
          .pm-feature-list { max-width: 520px; margin-left: auto; margin-right: auto; }
        }
      `}</style>

      <section id="task-manager" className="pm-sec">
        <div className="pm-grid">
          <div className="pm-text" data-reveal="left">
            <span className="pm-tag"><span />{content.eyebrow}<span /></span>
            <h2 className="pm-h2">{content.heading}</h2>
            {content.paragraphs.map(text => <p key={text} className="pm-lead">{text}</p>)}
            {content.itemsLabel && <p className="pm-suited-label">{content.itemsLabel}</p>}
            {content.listStyle === 'bullets'
              ? <ul className="pm-feature-list">{content.items.map(text => <li key={text}><span className="pm-feature-check" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8 3 3 7-7" /></svg></span><span className="pm-feature-text">{text}</span></li>)}</ul>
              : <div className="pm-suited">{content.items.map(text => <span key={text}>{text}</span>)}</div>}
          </div>
          <div className="pm-viz" data-reveal="right">
            <TaskManagerShowcase />
          </div>
        </div>
      </section>
    </>
  )
}
