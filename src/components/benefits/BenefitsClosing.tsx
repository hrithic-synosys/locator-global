const EASE = 'cubic-bezier(.22,.61,.36,1)'

// The original page ended on this sentence and it is worth keeping — after
// eleven claims, a line that deflates its own pitch is what makes the rest
// credible. Set as a pull quote so it lands as a closing remark rather than as
// one more paragraph.
export default function BenefitsClosing() {
  return (
    <>
      <style>{`
        .bgc { background: #fafbfc; padding: clamp(64px,8vw,104px) 28px; }
        .bgc-inner { max-width: 860px; margin: 0 auto; text-align: center; }

        /* A quote mark drawn as a rule rather than typeset. A real “ at this size
           is a large piece of grey furniture; a 2px line says the same thing and
           keeps the block clean. */
        .bgc-mark {
          width: 44px; height: 2px; background: #1360ee;
          border-radius: 2px; margin: 0 auto clamp(26px,3.4vw,38px);
          transform-origin: center;
        }
        @media (prefers-reduced-motion: no-preference) {
          .js-reveal [data-reveal] .bgc-mark { transform: scaleX(0); }
          .js-reveal [data-reveal].reveal-in .bgc-mark {
            transform: scaleX(1); transition: transform .9s ${EASE} .15s;
          }
        }

        .bgc-quote {
          margin: 0;
          font-size: max(clamp(21px,2.9vw,34px), min(2.361vw, 49.3px)); font-weight: 700;
          line-height: 1.36; letter-spacing: -.028em; color: #1d1d1f;
        }
        .bgc-note {
          margin: clamp(22px,3vw,30px) 0 0;
          font-size: max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px)); line-height: 1.75; color: #6e6e73;
        }
      `}</style>

      <section className="bgc">
        <div className="bgc-inner" data-reveal>
          <div className="bgc-mark" aria-hidden="true" />
          <p className="bgc-quote">
            At the end of the day, vehicle tracking is just another management tool
            one that happens to tell you the truth about how your fleet spent its week.
          </p>
          <p className="bgc-note">
            Every figure on this page came out of a real deployment. If you want to know
            which of the eleven applies to your operation, the fastest answer is a
            fifteen minute call.
          </p>
        </div>
      </section>
    </>
  )
}
