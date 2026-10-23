import Image from 'next/image';
import Link from '@/components/country/CountryLink';
import SoftwareNavbar from '@/components/software/SoftwareNavbar';
import ScrollReveal from '@/components/software/ScrollReveal';
import Footer from '@/components/layouts/Footer';
import { countries, countryCodes } from '@/config/countries';

const requirements = [
  { title: 'Vehicle tracking requirements', text: 'Establish which vehicles and activities are in scope, and what tracking equipment or installation arrangements your operation may need.' },
  { title: 'Fleet operational visibility', text: 'Define how your team will monitor vehicle activity, review trips, and follow up on exceptions across the fleet.' },
  { title: 'Transport authority processes', text: 'Identify the relevant authority and confirm any registration, approval, or documentation steps for your operation.' },
  { title: 'Data and reporting obligations', text: 'Clarify what information needs to be recorded, who can access it, and how it should be managed and reported.' },
  { title: 'Industry-specific considerations', text: 'Account for the work your vehicles perform. Passenger transport, logistics, deliveries, and specialist fleets can have different operational needs.' },
];

const capabilities = [
  { number: '01', title: 'Live GPS tracking', text: 'See vehicle locations and movement in one place, giving your team a practical view of day-to-day fleet activity.', href: '/service/fleet-telematics', link: 'Explore fleet telematics' },
  { number: '02', title: 'Trip and activity history', text: 'Review routes, stops, and past vehicle activity to help answer operational questions and maintain a clearer record of journeys.', href: '/software', link: 'Explore the platform' },
  { number: '03', title: 'Alerts and reporting', text: 'Use vehicle alerts and fleet reports to identify exceptions, support internal reviews, and inform operational decisions.', href: '/service/gps-tracking-system', link: 'Explore GPS tracking' },
];

/** Global-only overview. Existing UAE regulatory components are intentionally separate. */
export default function GlobalRegulatoryPage() {
  return (
    <main className="gr-page">
      <ScrollReveal />
      <SoftwareNavbar />
      <style href="global-regulatory" precedence="medium">{`
        .gr-page { background: #fff; color: #1d1d1f; }
        .gr-wrap { max-width: var(--w-1280); margin: 0 auto; padding: 0 28px; }
        .gr-hero { position: relative; overflow: hidden; padding: clamp(44px,6vw,84px) 0 clamp(48px,6vw,88px); background: linear-gradient(135deg,#fff 25%,#f0f6ff 100%); border-bottom: 1px solid #e7edf7; }
        .gr-hero-grid { display: grid; grid-template-columns: 1.05fr 1fr; align-items: center; gap: clamp(28px,4.5vw,68px); }
        .gr-eyebrow { display: block; color: #1360ee; font-size: var(--f-12); font-weight: 800; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 18px; }
        .gr-eyebrow::before { content: ''; display: block; width: 34px; height: 3px; background: #1360ee; border-radius: 2px; margin-bottom: 14px; }
        .gr-title { margin: 0; font-size: clamp(32px,3.6vw,54px); line-height: 1.13; font-weight: 800; letter-spacing: -.035em; }
        .gr-title span { color: #1360ee; }
        .gr-lead { font-size: var(--f-16); line-height: 1.75; color: #6e6e73; margin: 22px 0 26px; max-width: 560px; }
        .gr-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
        .gr-btn { display: inline-flex; align-items: center; justify-content: center; gap: 9px; padding: 13px 24px; border-radius: 999px; font-size: var(--f-13); font-weight: 700; line-height: 1.4; text-decoration: none; transition: transform .22s cubic-bezier(.22,.61,.36,1),box-shadow .22s,background .22s; }
        .gr-btn:hover { transform: translateY(-2px); }
        .gr-btn-primary { color: #fff; background: #1360ee; border: 1px solid #1360ee; box-shadow: 0 8px 22px -12px #1360ee; }
        .gr-btn-primary:hover { background: #104ebc; box-shadow: 0 12px 26px -12px #1360ee; }
        .gr-btn-ghost { color: #1360ee; border: 1px solid #a7bfe9; background: #fff; }
        .gr-btn:focus-visible,.gr-card a:focus-visible { outline: 3px solid #1360ee; outline-offset: 4px; }
        .gr-visual { position: relative; min-width: 0; margin: 0; background: #fff; padding: 18px; border: 1px solid #e1e9f6; border-radius: 20px; box-shadow: 0 24px 60px -32px rgba(25,61,119,.3); }
        .gr-visual img { width: 100%; height: auto; display: block; border-radius: 10px; }
        .gr-visual figcaption { display: flex; align-items: center; gap: 9px; color: #52525e; padding: 18px 4px 2px; font-size: var(--f-12); font-weight: 600; }
        .gr-dot { width: 8px; height: 8px; border-radius: 50%; background: #1360ee; flex-shrink: 0; }
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
          .gr-visual { max-width: 680px; }
          .gr-intro { max-width: 680px; }
          .gr-cards { grid-template-columns: 1fr; }
          .gr-card { padding: 26px; }
          .gr-cta { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 560px) {
          .gr-wrap { padding: 0 22px; }
          .gr-title { font-size: clamp(30px,8.3vw,38px); }
          .gr-hero { padding-top: 36px; }
          .gr-visual { padding: 12px; border-radius: 16px; }
          .gr-lead { font-size: var(--f-14); }
          .gr-actions { align-items: stretch; flex-direction: column; }
          .gr-market-list { grid-template-columns: 1fr; }
          .gr-cta .gr-actions { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) { .gr-btn { transition: none; } .gr-btn:hover { transform: none; } }
      `}</style>

      <section className="gr-hero">
        <div className="gr-wrap gr-hero-grid">
          <div className="gr-hero-copy">
            <span className="gr-eyebrow">Regulatory readiness</span>
            <h1 className="gr-title">Regulatory Compliance for <span>Connected Fleets</span></h1>
            <p className="gr-lead">Navigate fleet tracking and telematics requirements with solutions designed to support operational visibility, regulatory readiness, and changing industry standards.</p>
            <div className="gr-actions">
              <Link href="/contact" className="gr-btn gr-btn-primary">Discuss your requirements <span aria-hidden="true">→</span></Link>
              <Link href="/software" className="gr-btn gr-btn-ghost">Explore the platform</Link>
            </div>
          </div>
          <figure className="gr-visual">
            <Image src="/software/modules/fleet-manager/fleet-manager.webp" alt="Locator fleet management dashboard with vehicle records and service reminders" width={1600} height={858} sizes="(max-width: 900px) 90vw, 46vw" priority />
            <figcaption><span className="gr-dot" aria-hidden="true" />Operational information, in one connected platform</figcaption>
          </figure>
        </div>
      </section>

      <section className="gr-section">
        <div className="gr-wrap gr-requirements">
          <div className="gr-intro" data-reveal>
            <span className="gr-eyebrow">Understand the requirements</span>
            <h2>Start with your operation. Then plan the technology.</h2>
            <p>Fleet requirements depend on where you operate, the vehicles you use, and the work they perform. Identify the requirements that apply to your business before deciding how tracking and telematics should support them.</p>
            <p>A clear starting point helps you connect operational processes, vehicle information, and the people responsible for reviewing them.</p>
          </div>
          <ol className="gr-list">
            {requirements.map((item, index) => (
              <li key={item.title} data-reveal>
                <span className="gr-list-number" aria-hidden="true">0{index + 1}</span>
                <div><h3>{item.title}</h3><p>{item.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="gr-section gr-soft">
        <div className="gr-wrap">
          <div className="gr-section-head" data-reveal>
            <span className="gr-eyebrow">How Locator can help</span>
            <h2>Turn fleet data into practical operational visibility.</h2>
            <p>Locator brings tracking, activity history, alerts, and reporting into your fleet workflow, helping your team review what happens on the road.</p>
          </div>
          <div className="gr-cards">
            {capabilities.map(item => (
              <article className="gr-card" key={item.number} data-reveal>
                <span className="gr-card-number" aria-hidden="true">{item.number}</span>
                <h3>{item.title}</h3><p>{item.text}</p>
                <Link href={item.href}>{item.link} <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
          <p className="gr-note" data-reveal>Telematics supports your processes; it does not automatically establish legal compliance. The right setup depends on the applicable requirements, your operating practices, and any necessary approvals.</p>
        </div>
      </section>

      <section className="gr-section">
        <div className="gr-wrap gr-markets">
          <div data-reveal>
            <span className="gr-eyebrow">Different markets. Different requirements.</span>
            <h2>Plan for the places your fleet operates.</h2>
            <p>Requirements and approval processes vary by jurisdiction. A tracking arrangement used in one market should not be assumed to meet the requirements of another.</p>
            <p>Tell us your operating locations, vehicle types, and reporting needs so we can discuss the telematics capabilities relevant to your fleet.</p>
          </div>
          <ul className="gr-market-list" aria-label="Supported website markets" data-reveal>
            {countryCodes.filter(code => code !== 'global').map(code => (
              <li key={code}><Image src={countries[code].flag} alt="" width={28} height={28} />{countries[code].name}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="gr-section gr-closing">
        <div className="gr-wrap">
          <div className="gr-cta" data-reveal>
            <div className="gr-cta-copy"><h2>Let’s discuss your fleet requirements.</h2><p>Speak with our team about your vehicles, tracking needs, and operational reporting. We’ll help you explore a suitable Locator setup.</p></div>
            <div className="gr-actions"><Link href="/contact" className="gr-btn gr-btn-primary">Speak with our team <span aria-hidden="true">→</span></Link></div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
