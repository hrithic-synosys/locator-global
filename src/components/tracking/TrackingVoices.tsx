import Image from 'next/image'
import { VOICES } from './data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/** Five stars, drawn once and reused. Filled to the rating, hairline beyond it. */
function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span className="ctv-stars" role="img" aria-label={`${n} out of 5`}>
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
          fill={i < n ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45L2.6 9.45l6.5-.95z" />
        </svg>
      ))}
    </span>
  )
}

/**
 * Customer quotes.
 *
 * Four equal cards in a 2×2 gave every quote the same weight, which meant the
 * section had no entry point — the eye landed nowhere and the whole band read as
 * filler between two stronger ones. This is the standard fix: promote one quote
 * to a featured panel that carries the visual argument, and let the other three
 * run beneath it as supporting evidence. Safari Mall leads because it is the
 * only quote that names a *large* fleet, which is the reader we most want to
 * convince.
 *
 * The client marks are real logos, so every tile is white with a hairline —
 * four different brand palettes on a tinted ground would fight each other.
 */
export default function TrackingVoices({ content }: { content?: { eyebrow: string; heading: string; description: string } } = {}) {
  const [lead, ...rest] = VOICES

  return (
    <>
      <style>{`
        .ctv {
          position: relative; overflow: hidden;
          background: #fbfcfe; padding: clamp(56px,7vw,100px) 28px;
        }
        /* Two soft washes rather than a flat panel — they give the band a light
           source, so the white cards read as sitting on something. */
        .ctv::before {
          content: ''; position: absolute; pointer-events: none;
          width: min(760px,68vw); height: min(600px,54vw); top: -22%; left: -12%;
          background: radial-gradient(50% 50% at 50% 50%, rgba(19,96,238,.09), transparent 70%);
        }
        .ctv::after {
          content: ''; position: absolute; pointer-events: none;
          width: min(680px,60vw); height: min(540px,48vw); bottom: -26%; right: -10%;
          background: radial-gradient(50% 50% at 50% 50%, rgba(10,137,221,.08), transparent 70%);
        }
        .ctv-inner { position: relative; z-index: 1; max-width: var(--w-1180); margin: 0 auto; }

        .ctv-head { max-width: 660px; margin: 0 auto clamp(38px,4.6vw,56px); text-align: center; }
        .ctv-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: var(--f-12); font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: #1360ee; margin: 0 0 18px;
        }
        .ctv-eyebrow::before, .ctv-eyebrow::after {
          content: ''; width: 24px; height: 2px; background: #1360ee; border-radius: 2px;
        }
        .ctv-title {
          margin: 0; font-size: max(clamp(26px,3.4vw,40px), min(2.778vw, 58px));
          font-weight: 800; line-height: 1.14; letter-spacing: -.028em; color: #1d1d1f;
        }
        .ctv-lead {
          margin: clamp(16px,2vw,22px) auto 0; max-width: 58ch;
          font-size: var(--f-15-5); line-height: 1.72; color: #6e6e73;
        }

        .ctv-stars { display: inline-flex; gap: 3px; color: #f5a623; line-height: 0; }

        /* ── Featured ── */
        .ctv-lead-card {
          position: relative; overflow: hidden;
          display: grid; grid-template-columns: auto 1fr; gap: clamp(22px,3vw,40px);
          align-items: center;
          background: linear-gradient(140deg,#ffffff 0%,#f7faff 58%,#eef4fe 100%);
          border: 1px solid #e2eafb; border-radius: 24px;
          padding: clamp(28px,3.6vw,46px);
          margin-bottom: clamp(18px,2.2vw,26px);
          box-shadow: 0 30px 60px -34px rgba(20,40,90,.4);
          transition: transform .4s ${EASE}, box-shadow .4s ${EASE};
        }
        .ctv-lead-card:hover { transform: translateY(-4px); box-shadow: 0 40px 74px -36px rgba(20,40,90,.46); }
        /* Gradient rule along the top edge — the one piece of colour that marks
           this card as the featured one. */
        .ctv-lead-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg,#1360ee,#0d4fd4,transparent);
        }
        /* Oversized glyph as a watermark. Pinned bottom-right and clipped by the
           card, so it reads as texture rather than as a second quote mark. */
        .ctv-lead-card::after {
          content: '”'; position: absolute; right: clamp(-6px,-.5vw,6px); bottom: -.42em;
          font-size: clamp(190px,20vw,300px); line-height: 1;
          font-family: Georgia, 'Times New Roman', serif;
          color: #1360ee; opacity: .055; pointer-events: none; user-select: none;
        }
        @media (max-width: 780px) {
          .ctv-lead-card { grid-template-columns: 1fr; gap: clamp(20px,3vw,26px); }
        }

        .ctv-lead-mark {
          position: relative; width: clamp(92px,10vw,124px); height: clamp(92px,10vw,124px);
          border-radius: 24px; display: grid; place-items: center; padding: clamp(14px,1.6vw,20px);
          background: #fff; border: 1px solid #e8ecf4;
          box-shadow: 0 18px 34px -18px rgba(20,40,90,.4);
        }
        .ctv-lead-mark img { width: 100%; height: 100%; object-fit: contain; display: block; }

        .ctv-lead-body { position: relative; }
        .ctv-lead-body blockquote {
          margin: 14px 0 0;
          font-size: max(clamp(18px,2vw,25px), min(1.736vw, 36.25px));
          font-weight: 500; line-height: 1.52; letter-spacing: -.016em; color: #1d1d1f;
        }
        .ctv-lead-by {
          display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 10px;
          margin-top: clamp(18px,2.2vw,24px);
        }
        .ctv-lead-by b {
          font-size: var(--f-16); font-weight: 800; letter-spacing: -.012em; color: #1d1d1f;
        }
        .ctv-lead-by span { font-size: var(--f-13-5); color: #6e6e73; }

        /* ── Supporting three ── */
        .ctv-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: clamp(18px,2.2vw,26px); }
        @media (max-width: 900px) { .ctv-grid { grid-template-columns: 1fr; max-width: 620px; margin: 0 auto; } }

        .ctv-card {
          position: relative; overflow: hidden; display: flex; flex-direction: column;
          background: #fff; border: 1px solid #e8ecf4; border-radius: 20px;
          padding: clamp(24px,2.8vw,32px);
          transition: transform .38s ${EASE}, box-shadow .38s ${EASE}, border-color .38s ${EASE};
        }
        .ctv-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg,#1360ee,#0d4fd4);
          transform: scaleX(0); transform-origin: left center;
          transition: transform .45s ${EASE};
        }
        .ctv-card:hover {
          transform: translateY(-5px); border-color: #d6e2fb;
          box-shadow: 0 28px 54px -30px rgba(20,40,90,.42);
        }
        .ctv-card:hover::before { transform: scaleX(1); }

        .ctv-card blockquote {
          margin: 14px 0 clamp(22px,2.6vw,28px); flex: 1;
          font-size: max(clamp(14.5px,1.45vw,16.5px), min(1.146vw, 23.9px));
          line-height: 1.68; color: #35383f; letter-spacing: -.006em;
        }

        .ctv-by {
          display: flex; align-items: center; gap: 13px;
          padding-top: clamp(16px,2vw,20px); border-top: 1px solid #eef1f7;
        }
        .ctv-logo {
          width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
          display: grid; place-items: center; padding: 5px;
          background: #fff; border: 1px solid #e8ecf4;
          box-shadow: 0 6px 14px -8px rgba(20,40,90,.35);
          transition: transform .38s ${EASE}, box-shadow .38s ${EASE};
        }
        .ctv-logo img { width: 100%; height: 100%; object-fit: contain; display: block; }
        .ctv-card:hover .ctv-logo { transform: scale(1.06); box-shadow: 0 12px 22px -12px rgba(20,40,90,.45); }

        .ctv-by b {
          display: block; font-size: var(--f-14-5); font-weight: 800;
          color: #1d1d1f; letter-spacing: -.01em; line-height: 1.3;
        }
        .ctv-by span { display: block; font-size: var(--f-12-5); color: #6e6e73; margin-top: 2px; }
      `}</style>

      <section className="ctv">
        <div className="ctv-inner">
          <header className="ctv-head" data-reveal>
            <p className="ctv-eyebrow">{content?.eyebrow ?? 'In their words'}</p>
            <h2 className="ctv-title">{content?.heading ?? 'What UAE fleets say after switching'}</h2>
            <p className="ctv-lead">
              {content?.description ?? 'Four operators on what changed once every vehicle was on one map — from document expiry to fuel, job scheduling and day-to-day support.'}
            </p>
          </header>

          {/* Featured */}
          <figure className="ctv-lead-card" data-reveal>
            <span className="ctv-lead-mark">
              <Image src={lead.logo} alt={`${lead.company} logo`} width={100} height={100} sizes="124px" priority={false} />
            </span>
            <div className="ctv-lead-body">
              <Stars n={lead.rating} size={17} />
              <blockquote>{lead.quote}</blockquote>
              <figcaption className="ctv-lead-by">
                <b>{lead.company}</b>
                <span>{lead.person} · {lead.role}</span>
              </figcaption>
            </div>
          </figure>

          {/* Supporting */}
          <div className="ctv-grid">
            {rest.map((v, i) => (
              <figure key={v.company} className="ctv-card" data-reveal data-reveal-delay={i * 90}>
                <Stars n={v.rating} />
                <blockquote>{v.quote}</blockquote>
                <figcaption className="ctv-by">
                  <span className="ctv-logo">
                    <Image src={v.logo} alt={`${v.company} logo`} width={100} height={100} sizes="46px" />
                  </span>
                  <div>
                    <b>{v.company}</b>
                    <span>{v.person} · {v.role}</span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
