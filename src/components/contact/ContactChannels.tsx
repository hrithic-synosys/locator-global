const EASE = 'cubic-bezier(.22,.61,.36,1)'

type Channel = {
  label: string
  title: string
  desc: string
  meta: string
  action: string
  href: string
  external?: boolean
  /** Brand colour pair — drives the logo tile, glow, rule and CTA. */
  from: string
  to: string
  icon: React.ReactNode
}

const CHANNELS: Channel[] = [
  {
    label: 'Sales',
    title: 'Call the team',
    desc: 'Pricing, device options, and a solution mapped to your fleet size.',
    meta: 'Mon – Sat · 9:00–18:00',
    action: '+971 4 354 7766',
    href: 'tel:+97143547766',
    from: '#3d8bff', to: '#0b40b8',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.73 12 19.79 19.79 0 0 1 1.67 3.43 2 2 0 0 1 3.66 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 8.09a16 16 0 0 0 5.91 5.91l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    title: 'Message us',
    desc: 'Quick answers during working hours — no forms, no queue.',
    meta: 'Usually replies in minutes',
    action: 'Start a chat',
    href: 'https://wa.me/971525500956',
    external: true,
    from: '#5BF675', to: '#128C7E',
    // Official WhatsApp glyph.
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    title: 'Write to us',
    desc: 'Account questions, device health, or help with a live installation.',
    meta: 'Answered within 1 business day',
    action: 'info@locator.ae',
    href: 'mailto:info@locator.ae',
    from: '#9b8bff', to: '#5b34d6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2.5" y="5" width="19" height="14" rx="3" fill="currentColor" opacity=".28" />
        <path d="M2.5 8.2 12 14.5l9.5-6.3" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2.5" y="5" width="19" height="14" rx="3" stroke="currentColor" strokeWidth="2.1" />
      </svg>
    ),
  },
  {
    label: 'Visit',
    title: 'Come see us',
    desc: 'Two offices on the ground in the UAE — Dubai and Abu Dhabi.',
    meta: 'Walk-ins welcome',
    action: 'See both offices',
    href: '#offices',
    from: '#FF7A6B', to: '#C5221F',
    // Google Maps marker.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 22s7.5-7.06 7.5-12.5a7.5 7.5 0 0 0-15 0C4.5 14.94 12 22 12 22z" fill="currentColor" />
        <circle cx="12" cy="9.4" r="2.9" fill="#fff" />
      </svg>
    ),
  },
]

export default function ContactChannels() {
  return (
    <section className="ctc">
      <style href="ct-contactchannels" precedence="medium">{`
        .ctc {
          position: relative; overflow: hidden;
          background: linear-gradient(180deg, #ffffff 0%, #f7f9fe 60%, #ffffff 100%);
          padding: clamp(48px,6.5vw,84px) 28px clamp(52px,7vw,88px);
        }
        .ctc-inner { max-width: var(--w-1180); margin: 0 auto; }

        .ctc-head { max-width: 620px; margin-bottom: clamp(28px,3.6vw,44px); }
        .ctc-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: max(clamp(12px,1.05vw,13.5px), min(0.938vw, 19.57px)); font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #1360ee; }
        .ctc-eyebrow i { display: block; width: 28px; height: 2.5px; background: #1360ee; border-radius: 2px; }
        .ctc-title { margin: 10px 0 0; font-size: max(clamp(25px,2.7vw,33px), min(2.292vw, 47.85px)); font-weight: 800; letter-spacing: -.028em; color: #1d1d1f; line-height: 1.16; }
        .ctc-sub { margin: 12px 0 0; font-size: max(clamp(14px,1.2vw,15.5px), min(1.076vw, 22.47px)); line-height: 1.7; color: #6e6e73; }

        .ctc-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: clamp(14px,1.6vw,20px); }
        @media (max-width: 1000px) { .ctc-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        @media (max-width: 560px) { .ctc-grid { grid-template-columns: 1fr; } }

        /* Registering the two colour variables is what lets them TRANSITION.
           Custom properties are plain strings to the engine by default, so a
           :hover swap would snap; typed as <color> they interpolate, and the
           whole card — tile gradient, pill, link, glow — eases from the theme
           blue into the channel's own brand colour in one motion. Browsers
           without @property still get the swap, just instantly. */
        @property --ctc-from { syntax: '<color>'; inherits: true; initial-value: #1360ee; }
        @property --ctc-to   { syntax: '<color>'; inherits: true; initial-value: #0d4fd4; }

        .ctc-card {
          /* At rest every card is the site blue; --bf/--bt hold the channel's
             real brand pair until the card is hovered or focused. */
          --ctc-from: #1360ee; --ctc-to: #0d4fd4;
          position: relative; overflow: hidden;
          display: flex; flex-direction: column; height: 100%;
          padding: clamp(22px,2.2vw,28px); border-radius: 22px;
          background: #fff; border: 1px solid #e7ebf3; text-decoration: none;
          box-shadow: 0 20px 44px -34px rgba(20,40,90,.55);
          transition: transform .26s ${EASE}, box-shadow .26s ${EASE}, border-color .26s ${EASE},
                      --ctc-from .32s ${EASE}, --ctc-to .32s ${EASE};
        }
        .ctc-card:hover {
          transform: translateY(-6px); border-color: transparent;
          box-shadow: 0 34px 60px -30px color-mix(in srgb, var(--ctc-to) 55%, transparent);
        }
        /* Brand-coloured cap that draws across the top edge on hover. */
        .ctc-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, var(--ctc-from), var(--ctc-to));
          transform: scaleX(0); transform-origin: left;
          transition: transform .38s ${EASE};
        }
        .ctc-card:hover::before { transform: scaleX(1); }
        /* Brand wash bleeding up from the bottom-right. */
        .ctc-card::after {
          content: ''; position: absolute; right: -30%; bottom: -40%; width: 78%; aspect-ratio: 1; border-radius: 50%;
          background: radial-gradient(closest-side, color-mix(in srgb, var(--ctc-from) 26%, transparent), transparent 72%);
          opacity: 0; transition: opacity .3s ${EASE}, transform .5s ${EASE}; pointer-events: none;
        }
        .ctc-card:hover::after { opacity: 1; transform: scale(1.15); }
        .ctc-card > * { position: relative; z-index: 1; }

        /* Logo tile: real brand gradient, lit from within. */
        .ctc-ic {
          width: 52px; height: 52px; border-radius: 16px; flex-shrink: 0;
          display: grid; place-items: center; margin-bottom: 18px; color: #fff;
          background: linear-gradient(140deg, var(--ctc-from), var(--ctc-to));
          box-shadow:
            0 12px 24px -10px color-mix(in srgb, var(--ctc-to) 70%, transparent),
            inset 0 1px 0 rgba(255,255,255,.45);
          transition: transform .3s ${EASE}, box-shadow .3s ${EASE};
        }
        .ctc-card:hover .ctc-ic {
          transform: translateY(-2px) rotate(-6deg) scale(1.07);
          box-shadow: 0 18px 32px -10px color-mix(in srgb, var(--ctc-to) 85%, transparent), inset 0 1px 0 rgba(255,255,255,.55);
        }
        .ctc-ic svg { width: 24px; height: 24px; }

        .ctc-label { font-size: var(--f-10-5); font-weight: 800; letter-spacing: .13em; text-transform: uppercase; color: #9aa3b2; }
        .ctc-name { margin: 7px 0 0; font-size: var(--f-18); font-weight: 800; letter-spacing: -.025em; color: #1d1d1f; }
        .ctc-desc { margin: 9px 0 16px; font-size: var(--f-13-5); line-height: 1.65; color: #6e6e73; }

        /* Small human detail: what actually happens when you use this channel. */
        .ctc-meta {
          display: inline-flex; align-items: center; gap: 7px; align-self: flex-start;
          margin-bottom: 18px; padding: 5px 11px; border-radius: 999px;
          background: color-mix(in srgb, var(--ctc-from) 11%, transparent);
          color: color-mix(in srgb, var(--ctc-to) 88%, #000);
          font-size: var(--f-11); font-weight: 700; letter-spacing: .01em;
        }
        .ctc-meta i { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

        .ctc-action {
          margin-top: auto; display: inline-flex; align-items: center; gap: 7px;
          font-size: var(--f-14); font-weight: 800; letter-spacing: -.01em;
          color: color-mix(in srgb, var(--ctc-to) 90%, #000); word-break: break-word;
        }
        .ctc-action svg { flex-shrink: 0; transition: transform .22s ${EASE}; }
        .ctc-card:hover .ctc-action svg { transform: translateX(5px); }

        /* ── Colour on demand ──────────────────────────────────────────────
           At rest the four cards read as one calm, neutral row; the brand
           colour arrives only on the card you are actually pointing at, which
           is what makes the hover feel like a response rather than decoration.

           The filter is scoped to the three elements that actually carry brand
           colour rather than being dropped on .ctc-card as a whole: a filter on
           the card would also rasterise its text, which costs subpixel
           antialiasing and visibly changes how the copy renders. The card's own
           ::before cap and ::after wash need no rule here — both are already
           hover-only, so they are never seen in grey.

           :focus-visible mirrors :hover so keyboard users get the same reveal —
           these cards are links, and colour is the only affordance marking the
           active one. */
        /* The reveal itself: one swap of two variables, and every brand-coloured
           surface follows, because they all paint from --ctc-from/--ctc-to.

           :focus-visible mirrors :hover so keyboard users get the same reveal —
           these cards are links, and colour is the only affordance marking the
           active one. */
        .ctc-card:hover,
        .ctc-card:focus-visible {
          --ctc-from: var(--bf);
          --ctc-to: var(--bt);
        }

        @media (prefers-reduced-motion: reduce) {
          .ctc-card, .ctc-card::before, .ctc-card::after, .ctc-ic, .ctc-action svg { transition: none; }
          /* The colour still arrives, it just arrives instantly. */
          .ctc-ic, .ctc-meta, .ctc-action { transition: none; }
        }
      `}</style>

      <div className="ctc-inner">
        <div className="ctc-head" data-reveal>
          <span className="ctc-eyebrow"><i />How can we help</span>
          <h2 className="ctc-title">Pick the fastest way to reach us</h2>
          <p className="ctc-sub">
            Whether you run five vehicles or five hundred, the right person is one click away.
          </p>
        </div>

        <div className="ctc-grid">
          {CHANNELS.map((c, i) => (
            <a
              key={c.label}
              href={c.href}
              className="ctc-card"
              data-reveal
              data-reveal-delay={i * 90}
              // The card's own brand pair. It is deliberately NOT --ctc-from/--ctc-to:
              // those are what everything paints with, and an inline value would
              // outrank the :hover rule that swaps them, making the reveal
              // impossible. The stylesheet owns --ctc-from/--ctc-to and reads these.
              style={{ '--bf': c.from, '--bt': c.to } as React.CSSProperties}
              {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className="ctc-ic">{c.icon}</span>
              <span className="ctc-label">{c.label}</span>
              <h3 className="ctc-name">{c.title}</h3>
              <p className="ctc-desc">{c.desc}</p>
              <span className="ctc-meta"><i />{c.meta}</span>
              <span className="ctc-action">
                {c.action}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
