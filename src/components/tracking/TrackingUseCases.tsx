import Link from '@/components/country/CountryLink'
import { USE_CASES } from './data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/**
 * The positioning statement, and the three jobs it breaks down into.
 *
 * These two belong in one section: the quote is the problem, the cards are the
 * three shapes the answer takes. Splitting them across two bands would leave the
 * quote sitting alone on a colour with nothing to resolve it.
 *
 * The cards overlap the band's lower edge so the white section below appears to
 * lift them out of it — the same layered move the hero panel uses, and it means
 * the transition between two full-width bands is an event rather than a seam.
 */
export default function CarTrackingQuote() {
  return (
    <>
      <style>{`
        .ctq { position: relative; background: #f7f9fc; }
        .ctq-band {
          position: relative; overflow: hidden;
          background: linear-gradient(160deg,#1360ee 0%,#0a6fe8 46%,#0d4fd4 100%);
          color: #fff;
          padding: clamp(56px,7vw,90px) 28px calc(clamp(56px,7vw,90px) + clamp(70px,9vw,120px));
        }
        .ctq-band::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,.16) 1px, transparent 0);
          background-size: 26px 26px;
          -webkit-mask-image: radial-gradient(ellipse 70% 90% at 50% 0%, #000, transparent 76%);
          mask-image: radial-gradient(ellipse 70% 90% at 50% 0%, #000, transparent 76%);
        }

        .ctq-quote {
          position: relative; max-width: var(--w-900); margin: 0 auto; text-align: center;
        }
        .ctq-mark {
          display: block; margin: 0 auto 20px; width: 42px; height: 42px; color: rgba(255,255,255,.4);
        }
        .ctq-quote blockquote {
          margin: 0; font-size: max(clamp(19px,2.4vw,29px), min(2.014vw, 42.05px));
          font-weight: 600; line-height: 1.5; letter-spacing: -.018em; color: #fff;
        }
        .ctq-quote footer {
          margin-top: clamp(20px,2.6vw,28px);
          font-size: var(--f-13); font-weight: 700; letter-spacing: .12em;
          text-transform: uppercase; color: rgba(255,255,255,.7);
        }

        /* ── Use-case cards, lifted onto the seam ── */
        .ctq-cards {
          position: relative; z-index: 2;
          max-width: var(--w-1180); margin: calc(-1 * clamp(70px,9vw,120px)) auto 0;
          padding: 0 28px clamp(56px,7vw,96px);
          display: grid; grid-template-columns: repeat(3,1fr); gap: clamp(18px,2.2vw,26px);
        }
        @media (max-width: 940px) { .ctq-cards { grid-template-columns: 1fr; max-width: 620px; } }

        .ctq-card {
          display: flex; flex-direction: column;
          background: #fff; border: 1px solid #e8ecf4; border-radius: 20px;
          padding: clamp(26px,3vw,34px);
          box-shadow: 0 24px 48px -30px rgba(20,40,90,.4);
          transition: transform .38s ${EASE}, box-shadow .38s ${EASE}, border-color .38s ${EASE};
        }
        .ctq-card:hover {
          transform: translateY(-5px); border-color: #d6e2fb;
          box-shadow: 0 34px 62px -32px rgba(20,40,90,.5);
        }

        .ctq-ico {
          width: 52px; height: 52px; border-radius: 15px; display: grid; place-items: center;
          background: linear-gradient(145deg,#eaf1ff,#f6f9ff); border: 1px solid #dbe6fb;
          color: #1360ee; margin-bottom: clamp(18px,2.2vw,22px);
          transition: transform .38s ${EASE}, box-shadow .38s ${EASE};
        }
        .ctq-ico svg { width: 24px; height: 24px; }
        .ctq-card:hover .ctq-ico { transform: translateY(-2px) scale(1.04); box-shadow: 0 14px 26px -14px rgba(19,96,238,.6); }

        .ctq-card h3 {
          margin: 0 0 11px; font-size: max(clamp(16.5px,1.65vw,19.5px), min(1.354vw, 28.27px));
          font-weight: 800; letter-spacing: -.018em; color: #1d1d1f; line-height: 1.3;
        }
        .ctq-card p {
          margin: 0 0 clamp(20px,2.4vw,26px); flex: 1;
          font-size: var(--f-14-5); line-height: 1.72; color: #6e6e73;
        }

        .ctq-link {
          position: relative; align-self: flex-start;
          display: inline-flex; align-items: center; gap: 7px;
          font-size: var(--f-13-5); font-weight: 700; color: #1360ee; text-decoration: none;
        }
        .ctq-link svg { width: 15px; height: 15px; transition: transform .28s ${EASE}; }
        .ctq-card:hover .ctq-link svg { transform: translateX(4px); }
        .ctq-link::after {
          content: ''; position: absolute; left: 0; bottom: -3px; height: 1.5px; width: 100%;
          background: currentColor; transform: scaleX(0); transform-origin: left center;
          transition: transform .32s ${EASE};
        }
        .ctq-card:hover .ctq-link::after { transform: scaleX(1); }
      `}</style>

      <section className="ctq">
        <div className="ctq-band">
          <figure className="ctq-quote" data-reveal>
            <svg className="ctq-mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M9.5 5C6.5 6.7 4.6 9.6 4.6 13.2c0 3.4 2 5.8 4.7 5.8 2.3 0 4-1.7 4-3.9 0-2.1-1.5-3.7-3.5-3.7-.4 0-.9.1-1 .1-.3 0-.4-.2-.3-.5.5-1.6 2-3.2 3.7-4.2.4-.2.5-.5.3-.8L11.4 5c-.3-.4-.6-.4-1.9 0zm9.1 0c-3 1.7-4.9 4.6-4.9 8.2 0 3.4 2 5.8 4.7 5.8 2.3 0 4-1.7 4-3.9 0-2.1-1.5-3.7-3.5-3.7-.4 0-.9.1-1 .1-.3 0-.4-.2-.3-.5.5-1.6 2-3.2 3.7-4.2.4-.2.5-.5.3-.8L20.5 5c-.3-.4-.6-.4-1.9 0z" />
            </svg>
            <blockquote>
              Most companies struggle to effectively utilise their vehicles and field staff. We
              built a software tool that helps them manage and control those vehicles — so the
              business starts growing again, and revenue with it.
            </blockquote>
            <footer>Why LOCATOR exists</footer>
          </figure>
        </div>

        <div className="ctq-cards">
          {USE_CASES.map((u, i) => (
            <article key={u.title} className="ctq-card" data-reveal data-reveal-delay={i * 110}>
              <span className="ctq-ico" aria-hidden="true">{u.icon}</span>
              <h3>{u.title}</h3>
              <p>{u.desc}</p>
              <Link href={u.href} className="ctq-link">
                Read details
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
