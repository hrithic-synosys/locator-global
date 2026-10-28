import Image from "next/image";
import Link from "@/components/country/CountryLink";
import SoftwareNavbar from "@/components/software/SoftwareNavbar";
import ScrollReveal from "@/components/software/ScrollReveal";
import Footer from "@/components/layouts/Footer";
import {
  trackingCapabilities,
  vehicleCategories,
  trackingConsiderations,
  regulatoryFaqs,
} from "@/content/global-regulatory";

function Actions() {
  return (
    <div className="gr-actions">
      <Link href="/get-a-quote" className="gr-btn gr-btn-primary">
        Get a Free Quote <span aria-hidden="true">→</span>
      </Link>
      <Link href="/get-a-free-demo" className="gr-btn gr-btn-ghost">
        Book a Free Demo
      </Link>
    </div>
  );
}

/** Global-only editorial page; country certification pages stay separate. */
export default function GlobalRegulatoryPage() {
  return (
    <main className="gr-page">
      <ScrollReveal />
      <SoftwareNavbar />
      <style href="global-regulatory" precedence="medium">{`
        .gr-page { background: #fff; color: #1d1d1f; }
        .gr-wrap { max-width: var(--w-1280); margin: 0 auto; padding: 0 28px; }
        .gr-hero { position: relative; isolation: isolate; overflow: hidden; display: flex; align-items: center; min-height: clamp(480px,38vw,660px); box-sizing: border-box; padding: clamp(48px,5vw,76px) 0; background: #0b1220; }
        .gr-hero-photo,.gr-hero-scrim { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
        .gr-hero-photo img { object-fit: cover; object-position: 100% center; }
        .gr-hero-scrim { background: linear-gradient(90deg,rgba(7,12,22,.94) 0%,rgba(7,12,22,.86) 30%,rgba(7,12,22,.5) 59%,rgba(7,12,22,.12) 100%); }
        .gr-hero-grid { position: relative; width: 100%; box-sizing: border-box; }
        .gr-hero-copy { max-width: 660px; }
        .gr-eyebrow { display: block; color: #1360ee; font-size: var(--f-12); font-weight: 800; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 18px; }
        .gr-eyebrow::before { content: ''; display: block; width: 34px; height: 3px; background: #1360ee; border-radius: 2px; margin-bottom: 14px; }
        .gr-title { margin: 0; font-size: clamp(32px,3.6vw,54px); line-height: 1.13; font-weight: 800; letter-spacing: -.035em; color: #fff; text-shadow: 0 2px 24px #0006; }
        .gr-title span { color: #8dbbff; }
        .gr-hero .gr-eyebrow { color: #c2d9ff; }
        .gr-hero .gr-eyebrow::before { background: #8dbbff; }
        .gr-lead { font-size: var(--f-16); line-height: 1.75; color: rgba(255,255,255,.87); margin: 22px 0 26px; max-width: 560px; }
        .gr-hero .gr-btn-ghost { color: #fff; border-color: #ffffff70; background: #ffffff15; backdrop-filter: blur(8px); }
        .gr-hero .gr-btn-ghost:hover { background: #ffffff29; }
        .gr-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
        .gr-btn { display: inline-flex; align-items: center; justify-content: center; gap: 9px; padding: 13px 24px; border-radius: 999px; font-size: var(--f-13); font-weight: 700; line-height: 1.4; text-decoration: none; transition: transform .22s cubic-bezier(.22,.61,.36,1),box-shadow .22s,background .22s; }
        .gr-btn:hover { transform: translateY(-2px); }
        .gr-btn-primary { color: #fff; background: #1360ee; border: 1px solid #1360ee; box-shadow: 0 8px 22px -12px #1360ee; }
        .gr-btn-primary:hover { background: #104ebc; box-shadow: 0 12px 26px -12px #1360ee; }
        .gr-btn-ghost { color: #1360ee; border: 1px solid #a7bfe9; background: #fff; }
        .gr-btn:focus-visible,.gr-card a:focus-visible { outline: 3px solid #1360ee; outline-offset: 4px; }
        .gr-section { padding: clamp(48px,6vw,80px) 0; }
        .gr-section h2 { font-size: clamp(25px,2.6vw,36px); line-height: 1.22; font-weight: 800; letter-spacing: -.025em; margin: 0 0 18px; }
        .gr-section p { color: #6e6e73; font-size: var(--f-14); line-height: 1.8; }
        .gr-requirements { display: grid; grid-template-columns: .8fr 1.2fr; gap: clamp(32px,5vw,80px); }
        .gr-intro { max-width: 440px; }
        .gr-list { list-style: none; margin: 0; padding: 0; }
        .gr-list li { display: flex; gap: 18px; padding: 20px 0; border-bottom: 1px solid #e8ebf2; }
        .gr-list li:first-child { padding-top: 0; }
        .gr-list-number { font-size: var(--f-12); font-weight: 700; color: #1360ee; padding-top: 3px; }
        .gr-list h3 { margin: 0 0 7px; font-size: var(--f-16); font-weight: 700; }
        .gr-list p { margin: 0; }
        .gr-soft { background: #f5f7fb; border-top: 1px solid #e9edf5; border-bottom: 1px solid #e9edf5; }
        .gr-section-head { max-width: 680px; margin-bottom: 30px; }
        .gr-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        .gr-card { background: #fff; border: 1px solid #e4e8f1; border-radius: 18px; padding: clamp(22px,2.4vw,32px); display: flex; flex-direction: column; }
        .gr-card-number { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 12px; color: #1360ee; background: #edf4ff; font-size: var(--f-12); font-weight: 800; margin-bottom: 22px; }
        .gr-card h3 { margin: 0; font-size: var(--f-18); line-height: 1.3; font-weight: 800; letter-spacing: -.015em; }
        .gr-card p { margin: 12px 0 22px; }
        .gr-card a { color: #1360ee; font-size: var(--f-12); font-weight: 700; text-decoration: none; margin-top: auto; }
        .gr-note { margin: 24px 0 0; max-width: 900px; }
        .gr-markets { display: grid; grid-template-columns: 1fr 1fr; align-items: start; gap: clamp(28px,5vw,80px); }
        .gr-market-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .gr-market-list li { display: flex; align-items: center; gap: 12px; border: 1px solid #e4e8f1; border-radius: 14px; padding: 20px; font-size: var(--f-14); font-weight: 700; }
        .gr-market-list img { border-radius: 50%; flex-shrink: 0; }
        .gr-closing { padding-top: 0; }
        .gr-cta { background: #f0f5ff; border: 1px solid #e0e9f9; border-radius: 22px; padding: clamp(28px,4vw,52px); display: flex; align-items: center; justify-content: space-between; gap: 30px; }
        .gr-cta-copy { max-width: 660px; }
        .gr-cta h2 { margin-bottom: 12px; }
        .gr-cta p { margin: 0; }
        .gr-cta .gr-btn { white-space: nowrap; }
        @media (max-width: 900px) {
          .gr-hero-grid,.gr-requirements,.gr-markets { grid-template-columns: 1fr; }
          .gr-hero-copy { max-width: 680px; }
          .gr-intro { max-width: 680px; }
          .gr-cards { grid-template-columns: 1fr; }
          .gr-card { padding: 26px; }
          .gr-cta { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 560px) {
          .gr-wrap { padding: 0 22px; }
          .gr-hero-copy .gr-eyebrow { max-width: calc(100% - 52px); line-height: 1.7; }
          .gr-title { font-size: clamp(30px,8.3vw,38px); }
          .gr-lead { font-size: var(--f-14); }
          .gr-actions { align-items: stretch; flex-direction: column; }
          .gr-market-list { grid-template-columns: 1fr; }
          .gr-cta .gr-actions { width: 100%; }
        }
        @media (max-width: 1024px) {
          .gr-hero-scrim { background: linear-gradient(90deg,rgba(7,12,22,.95),rgba(7,12,22,.85) 45%,rgba(7,12,22,.35)); }
        }
        @media (max-width: 768px) {
          .gr-hero { align-items: flex-end; min-height: 700px; padding: 190px 0 44px; }
          .gr-hero-photo img { object-position: 66% center; }
          .gr-hero-scrim { background: linear-gradient(180deg,rgba(7,12,22,.25) 0%,rgba(7,12,22,.32) 24%,rgba(7,12,22,.86) 52%,rgba(7,12,22,.97) 100%); }
        }
        @media (prefers-reduced-motion: reduce) { .gr-btn { transition: none; } .gr-btn:hover { transform: none; } }
      `}</style>
      <style href="global-regulatory-content" precedence="medium">{`
.gr-vehicles{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 30px}.gr-vehicles li{border-top:1px solid #e1e8f5;padding:26px 0}.gr-vehicles h3{margin:0 0 12px;font-size:17px;font-weight:750;line-height:1.4}.gr-vehicles p{margin:0}.gr-checklist{list-style:none;margin:0;padding:10px 26px;border:1px solid #e1e8f5;background:white;border-radius:18px}.gr-checklist li{display:flex;gap:14px;padding:18px 0;border-bottom:1px solid #e8edf5;color:#52525e;font-size:14px;line-height:1.7}.gr-checklist li:last-child{border:0}.gr-checklist span{color:#1360ee;font-weight:800}.gr-faq{max-width:960px;margin:0 auto}.gr-faq details{border-bottom:1px solid #e1e8f5}.gr-faq summary{display:flex;align-items:center;justify-content:space-between;gap:24px;cursor:pointer;list-style:none;padding:24px 0}.gr-faq summary::-webkit-details-marker{display:none}.gr-faq summary::after{content:"+";font-size:26px;color:#1360ee;flex-shrink:0}.gr-faq details[open] summary::after{content:"−"}.gr-faq h3{margin:0;font-size:16px;line-height:1.6;font-weight:700}.gr-faq details p{margin:0;padding:0 30px 24px 0}.gr-faq summary:focus-visible{outline:3px solid #1360ee;outline-offset:5px}.gr-cta{flex-direction:column;align-items:flex-start}.gr-cta-copy{max-width:860px}.gr-cta-copy p+p{margin-top:12px}.gr-title{text-wrap:balance}.gr-section-head{max-width:780px}@media(max-width:900px){.gr-vehicles{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.gr-vehicles{grid-template-columns:1fr}.gr-faq details p{padding-right:0}.gr-faq summary{padding:20px 0}}
`}</style>

      <section className="gr-hero" aria-labelledby="gr-title">
        <div className="gr-hero-photo" aria-hidden="true">
          <Image src="/regulatory/shahin/shahin-banner.webp" alt="" fill sizes="100vw" priority />
        </div>
        <div className="gr-hero-scrim" aria-hidden="true" />
        <div className="gr-wrap gr-hero-grid">
          <div className="gr-hero-copy">
            <span className="gr-eyebrow">
              GPS tracking for regulatory compliance
            </span>
            <h1 id="gr-title" className="gr-title">
              GPS Tracking Solutions for <span>Regulatory Compliance</span>
            </h1>
            <p className="gr-lead">
              Locator provides GPS vehicle tracking and fleet management
              solutions that help businesses improve fleet visibility, monitor
              vehicle movements, and support regulatory compliance where
              required.
            </p>
            <Actions />
          </div>
        </div>
      </section>

      <section className="gr-section" aria-labelledby="gr-reliable">
        <div className="gr-wrap gr-requirements">
          <div data-reveal>
            <span className="gr-eyebrow">Visibility. Control. Confidence.</span>
            <h2 id="gr-reliable">
              Reliable Vehicle Tracking for Compliance and Fleet Management
            </h2>
          </div>
          <div data-reveal>
            <p>
              Managing a commercial fleet involves more than tracking vehicle
              locations. Businesses may also need to monitor vehicle activity,
              maintain accurate records, use approved tracking devices, and meet
              applicable transport requirements.
            </p>
            <p>
              From commercial vehicles and logistics fleets to passenger
              transport and specialised vehicles, our solutions help businesses
              manage their operations with greater visibility, control, and
              confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="gr-section gr-soft" aria-labelledby="gr-support">
        <div className="gr-wrap">
          <div className="gr-section-head" data-reveal>
            <span className="gr-eyebrow">Connected fleet capabilities</span>
            <h2 id="gr-support">
              How GPS Tracking Helps Support Regulatory Compliance
            </h2>
          </div>
          <div className="gr-cards">
            {trackingCapabilities.map((item, index) => (
              <article className="gr-card" key={item.title} data-reveal>
                <span className="gr-card-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gr-section" aria-labelledby="gr-vehicles">
        <div className="gr-wrap">
          <div className="gr-section-head" data-reveal>
            <span className="gr-eyebrow">Built around your operation</span>
            <h2 id="gr-vehicles">
              GPS Tracking Solutions for Different Vehicle Categories
            </h2>
            <p>
              Tracking needs vary depending on vehicle type, business activity,
              and operating environment. Locator&apos;s vehicle tracking
              solutions can support a range of commercial applications,
              including:
            </p>
          </div>
          <ul className="gr-vehicles">
            {vehicleCategories.map((item) => (
              <li key={item.title} data-reveal>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
          <p className="gr-note" data-reveal>
            Device specifications, technical integrations, and regulatory
            requirements may differ between vehicle categories and markets.
          </p>
        </div>
      </section>

      <section className="gr-section gr-soft" aria-labelledby="gr-choosing">
        <div className="gr-wrap gr-requirements">
          <div data-reveal>
            <span className="gr-eyebrow">Find the right fit</span>
            <h2 id="gr-choosing">Choosing the Right GPS Tracking System</h2>
            <p>
              The right vehicle tracking system depends on your fleet size,
              vehicle types, reporting needs, operating conditions, and any
              applicable regulatory requirements.
            </p>
            <p>Before choosing a GPS tracker or on-board unit, consider:</p>
            <p>
              Locator helps businesses explore suitable GPS tracking and fleet
              monitoring solutions based on their operational needs.
            </p>
          </div>
          <ul
            className="gr-checklist"
            aria-label="GPS tracking system considerations"
            data-reveal
          >
            {trackingConsiderations.map((item) => (
              <li key={item}>
                <span aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="gr-section" aria-labelledby="gr-faq">
        <div className="gr-wrap">
          <div className="gr-faq">
            <div className="gr-section-head" data-reveal>
              <span className="gr-eyebrow">Your questions, answered</span>
              <h2 id="gr-faq">Frequently Asked Questions</h2>
            </div>
            {regulatoryFaqs.map((item) => (
              <details key={item.question}>
                <summary>
                  <h3>{item.question}</h3>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="gr-section gr-closing" aria-labelledby="gr-business">
        <div className="gr-wrap">
          <div className="gr-cta" data-reveal>
            <div className="gr-cta-copy">
              <span className="gr-eyebrow">Let’s talk about your fleet</span>
              <h2 id="gr-business">
                Find the Right GPS Tracking Solution for Your Business
              </h2>
              <p>
                Improve vehicle visibility, simplify fleet monitoring, and
                explore GPS tracking solutions suited to your operational
                requirements.
              </p>
              <p>
                Whether you manage a small commercial fleet or a large
                transportation operation, Locator can help you identify the
                right tracking options for your vehicles.
              </p>
            </div>
            <Actions />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
