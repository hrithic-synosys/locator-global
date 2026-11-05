import type { globalCopy } from '@/content/pages/car-tracking-system/global'
import Image from 'next/image'
import { OUTCOMES } from './data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/**
 * The eight outcomes, beside the reporting screen they come from.
 *
 * Laid out as a two-column checklist rather than a single stacked list: eight
 * short lines in one column is a wall, and splitting them lets the whole set sit
 * next to the image at the same height instead of running past it.
 */
export default function CarTrackingBenefits({ content }: { content?: typeof globalCopy.returnSection } = {}) {
  return (
    <>
      <style>{`
        .ctb { background: #f7f9fc; padding: clamp(56px,7vw,96px) 28px; }
        .ctb-inner {
          max-width: var(--w-1180); margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1.05fr;
          gap: clamp(36px,5vw,72px); align-items: center;
        }
        @media (max-width: 940px) { .ctb-inner { grid-template-columns: 1fr; gap: clamp(34px,5vw,48px); } }

        .ctb-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: var(--f-12); font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: #1360ee; margin: 0 0 18px;
        }
        .ctb-eyebrow::before { content: ''; width: 30px; height: 2px; background: #1360ee; border-radius: 2px; }

        .ctb-title {
          margin: 0; max-width: 20ch;
          font-size: max(clamp(25px,3.2vw,38px), min(2.639vw, 55.1px));
          font-weight: 800; line-height: 1.16; letter-spacing: -.028em; color: #1d1d1f;
        }
        .ctb-lead {
          margin: clamp(16px,2vw,22px) 0 clamp(28px,3.4vw,36px); max-width: 54ch;
          font-size: var(--f-15-5); line-height: 1.72; color: #6e6e73;
        }

        .ctb-list {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 2px 22px; list-style: none; margin: 0; padding: 0;
        }
        @media (max-width: 620px) { .ctb-list { grid-template-columns: 1fr; } }

        .ctb-list li {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 13px 0; border-bottom: 1px solid #e6ebf3;
          font-size: var(--f-14-5); font-weight: 600; line-height: 1.5; color: #35383f;
        }
        .ctb-check {
          flex-shrink: 0; width: 21px; height: 21px; border-radius: 7px; margin-top: 1px;
          display: grid; place-items: center;
          background: rgba(19,96,238,.1); color: #1360ee;
          transition: background .3s ${EASE}, color .3s ${EASE}, transform .3s ${EASE};
        }
        .ctb-check svg { width: 12px; height: 12px; }
        .ctb-list li:hover .ctb-check { background: #1360ee; color: #fff; transform: scale(1.08); }

        /* ── Visual ── */
        .ctb-visual { position: relative; }
        /* No frame — the artwork is a cut-out with its own blue field, so a
           bordered card would just draw a box around empty corners. */
        .ctb-frame { position: relative; }
        .ctb-frame img { display: block; width: 100%; height: auto; }

        /* Floating figure. Sits half off the frame so the panel reads as layered
           rather than as one flat rectangle. */
        .ctb-badge {
          position: absolute; left: clamp(-8px,-1vw,0px); bottom: clamp(18px,3vw,32px);
          display: flex; align-items: center; gap: 13px;
          background: #fff; border: 1px solid #e7ebf3; border-radius: 16px;
          padding: 14px 18px; box-shadow: 0 22px 44px -22px rgba(20,40,90,.5);
        }
        .ctb-badge-ico {
          width: 38px; height: 38px; border-radius: 11px; display: grid; place-items: center;
          background: rgba(31,191,91,.12); color: #1a9e4b; flex-shrink: 0;
        }
        .ctb-badge-ico svg { width: 19px; height: 19px; }
        .ctb-badge b {
          display: block; font-size: max(clamp(18px,1.9vw,22px), min(1.528vw, 31.9px));
          font-weight: 800; letter-spacing: -.02em; color: #1d1d1f; line-height: 1.1;
        }
        .ctb-badge span { display: block; font-size: var(--f-11-5); color: #6e6e73; font-weight: 600; margin-top: 3px; }
        @media (max-width: 480px) { .ctb-badge { position: static; margin-top: 14px; } }
      `}</style>

      <section className="ctb">
        <div className="ctb-inner">
          <div data-reveal="right">
            <p className="ctb-eyebrow">{content?.eyebrow ?? 'The return'}</p>
            <h2 className="ctb-title">{content?.heading ?? 'How your fleet benefits, in Dubai and every other Emirate'}</h2>
            <p className="ctb-lead">
              {content?.description ?? 'From Abu Dhabi to Sharjah and across the Northern Emirates, these are the changes operators report once LOCATOR is running on their vehicles.'}
            </p>

            <ul className="ctb-list">
              {(content?.items ?? OUTCOMES).map(o => (
                <li key={o}>
                  <span className="ctb-check" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  {o}
                </li>
              ))}
            </ul>
          </div>

          <div className="ctb-visual" data-reveal="left" data-reveal-delay={120}>
            <div className="ctb-frame">
              <Image
                src="/services/car-tracking-system/how-you-benefit.png"
                alt="LOCATOR fleet map held on a tablet, surrounded by trip, cost and monthly report figures"
                width={1242}
                height={828}
                sizes="(max-width: 940px) 92vw, 46vw"
              />
            </div>
            {!content && (
              <div className="ctb-badge">
                <span className="ctb-badge-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 17l6-6 4 4 8-8" /><path d="M21 7v5h-5" />
                  </svg>
                </span>
                <div>
                  <b>Up to 20%</b>
                  <span>Lower fuel spend after year one</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
