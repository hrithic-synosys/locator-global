import Link from '@/components/country/CountryLink'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

export default function MissionCTA() {
  return (
    <>
      <style>{`
        .mc-wrap {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          background: #f3f5f9;
          padding: clamp(56px,7vw,88px) 32px;
          text-align: center;
        }

        .mc-tag {
          display: block;
          font-size: max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px));
          font-weight: 800; letter-spacing: .04em;
          color: #1360ee; text-transform: uppercase; margin-bottom: 16px;
        }
        .mc-tag-bar {
          display: block; width: 34px; height: 3px;
          background: #1360ee; border-radius: 2px;
          margin: 0 auto 12px;
        }

        .mc-h2 {
          margin: 0 auto 16px;
          font-size: max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px));
          font-weight: 800; letter-spacing: -.015em;
          line-height: 1.25; max-width: 26ch;
          color: #0b1220;
        }
        .mc-h2 em { font-style: normal; color: #1360ee; }

        .mc-lead {
          margin: 0 auto;
          max-width: 480px;
          font-size: max(clamp(14px,1.45vw,16px), min(1.111vw, 23.2px));
          color: #55607a; line-height: 1.65;
        }

        .mc-btn-row {
          display: flex; gap: 12px; justify-content: center;
          margin-top: 32px; flex-wrap: wrap;
        }
        .mc-btn {
          display: inline-flex; align-items: center; justify-content: center;
          font-family: inherit; font-size: var(--f-14); font-weight: 700;
          padding: 13px 26px; border-radius: 999px;
          text-decoration: none; white-space: nowrap;
          transition: .18s ${EASE};
        }
        .mc-btn-primary {
          background: #1360ee; color: #fff;
          box-shadow: 0 10px 24px rgba(19,96,238,.28);
        }
        .mc-btn-primary:hover { background: #0d4fd4; transform: translateY(-1px); box-shadow: 0 12px 30px rgba(19,96,238,.4); }
        .mc-btn-ghost {
          background: #fff; color: #0b1220;
          border: 1.5px solid #dfe3ea;
        }
        .mc-btn-ghost:hover { border-color: #1360ee; color: #1360ee; transform: translateY(-1px); }

        .mc-trust {
          display: flex; justify-content: center; gap: 28px;
          margin-top: 36px; flex-wrap: wrap;
        }
        .mc-trust-item {
          display: flex; align-items: center; gap: 7px;
          font-size: var(--f-12-5); color: #6b7280; font-weight: 500;
        }
        .mc-trust-icon {
          width: 18px; height: 18px; border-radius: 50%;
          background: #1360ee; display: grid; place-items: center;
          font-size: 10px; font-weight: 800; flex-shrink: 0; color: #fff;
        }
      `}</style>

      <section style={{ padding: 'clamp(40px,5vw,56px) 28px clamp(56px,7vw,80px)' }}>
        <div style={{ maxWidth: 'var(--w-1120)', margin: '0 auto' }}>
          <div className="mc-wrap" data-reveal="zoom">

            <span className="mc-tag">
              <span className="mc-tag-bar" />
              Get Started Today
            </span>

            <h2 className="mc-h2">
              Put your whole fleet on <em>one platform.</em>
            </h2>

            <p className="mc-lead">
              Get a quote, book a live demo, and see Locator running on your own vehicles within days.
            </p>

            <div className="mc-btn-row">
              <Link href="/get-a-quote" className="mc-btn mc-btn-primary">
                Get a quote
              </Link>
              <Link href="/get-a-free-demo" className="mc-btn mc-btn-ghost">
                Book a live demo →
              </Link>
            </div>

            <div className="mc-trust">
              {[
                'No long-term contract',
                'Setup within 48 hours',
                'Dedicated support team',
              ].map((t) => (
                <div key={t} className="mc-trust-item">
                  <span className="mc-trust-icon">✓</span>
                  {t}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
