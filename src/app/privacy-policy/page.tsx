import type { Metadata } from 'next'
import Link from 'next/link'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy — LOCATOR',
  description: 'How LOCATOR handles personal information across its website, GPS tracking, fleet management, and related software services.',
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy | Locator',
    description: 'Information collection, service data, website forms, and privacy requests at LOCATOR.',
    url: '/privacy-policy',
    type: 'website',
  },
}

const sections = [
  {
    "id": "introduction",
    "title": "1. Introduction",
    "paragraphs": [
      "At LOCATOR, we respect the privacy and security of your information. This Privacy Policy explains how we collect, use, disclose, and protect personal information when you visit our website, contact us, or use our GPS tracking and fleet management services, including related software and mobile interfaces.",
      "LOCATOR is a product managed by Synosys Technologies LLC. Our services include asset tracking, motorcycle tracking, school bus tracking, sales and service tracking, delivery and truck tracking, and related fleet management capabilities.",
      "Where a business, employer, school, or fleet operator determines how personal information is collected and used through its deployment, that organization is responsible for those decisions and the required notices and permissions. We process that information to provide the agreed services. People whose vehicles or activities are monitored should also refer to the deploying organization’s privacy information."
    ]
  },
  {
    "id": "information",
    "title": "2. Information Collection and Use",
    "paragraphs": [
      "Information you provide: We collect information you submit when requesting a quote, booking a demo, sending an enquiry, using our support chat, applying for a role, or contacting us directly. Depending on the request, this may include your name, email address, telephone number, company, fleet requirements, appointment preferences, messages, and attachments. Career applications may also include a resume, employment history, and other recruitment details you provide.",
      "Service information: Depending on the services used and the customer’s configuration, we may process account details, vehicle or asset identifiers, location data, trip and route records, and operational information needed for vehicle tracking, asset monitoring, and field activity management.",
      "Technical and usage information: Our website and service tools may process information such as your IP address, browser or device information, usage events, and diagnostic records to operate and improve the services.",
      "We use this information to provide, maintain, protect, and improve our services; monitor vehicles, assets, and relevant activities as described in the service; respond to enquiries; prepare quotes; arrange demonstrations; provide customer support; assess job applications; and carry out related administration and communication. We also use information where necessary to secure our systems and meet applicable legal obligations."
    ]
  },
  {
    "id": "sharing",
    "title": "3. Information Sharing",
    "paragraphs": [
      "We do not sell or trade your personal information. We may share information with trusted providers that help us operate our website, deliver communications, host or support our systems, and provide our services. Access is limited to the relevant purpose and subject to appropriate confidentiality arrangements.",
      "In business tracking deployments, authorized users at the customer organization may access account, location, vehicle, and operational information as part of the agreed service.",
      "We may also disclose information where required by applicable law or lawful requests, or where necessary to protect legal rights, service security, and safety. Where service providers process information outside your country, applicable data protection requirements must be considered."
    ]
  },
  {
    "id": "security",
    "title": "4. Data Security",
    "paragraphs": [
      "We use reasonable technical and organizational safeguards designed to protect personal information against unauthorized access, alteration, disclosure, or loss. No method of internet transmission or electronic storage can be guaranteed completely secure. Please avoid submitting unnecessary sensitive information in website messages or attachments."
    ]
  },
  {
    "id": "cookies",
    "title": "5. Cookies and Tracking Technologies",
    "paragraphs": [
      "Our website may use cookies, browser storage, analytics, and conversion tracking to support functionality, understand website interactions, and measure events such as successful enquiries and demo bookings. These technologies may process device identifiers, IP addresses, and interaction information; they are not necessarily anonymous.",
      "Browser storage is also used to retain an on-site support chat conversation during your visit. Embedded Vimeo videos, Google Maps, and links to services such as WhatsApp may involve third-party processing of browser, device, and interaction information under those providers’ privacy policies.",
      "You can manage cookies and browser storage through your browser settings. Restricting them may affect some website features. This policy does not replace the privacy policies of third-party websites or services."
    ]
  },
  {
    "id": "children",
    "title": "6. Children’s Privacy",
    "paragraphs": [
      "Our website enquiry forms and business accounts are intended for adults. We do not knowingly solicit personal information directly from children through these channels.",
      "Some services, such as school bus tracking, may involve children’s information when deployed by an authorized organization. That organization is responsible for the required privacy notices and any necessary parent or guardian permissions under applicable law.",
      "If you believe a child has provided personal information without appropriate authorization, please contact us so we can review the matter and take appropriate action."
    ]
  },
  {
    "id": "retention",
    "title": "7. Data Retention",
    "paragraphs": [
      "We retain personal information for as long as reasonably needed for the purpose for which it was collected, including responding to requests, recruitment, providing contracted services, and meeting applicable legal or recordkeeping obligations.",
      "Retention depends on the type of information, the service, and relevant customer instructions and legal requirements. This policy does not specify a single retention period for every category of data."
    ]
  },
  {
    "id": "rights",
    "title": "8. Your Privacy Requests",
    "paragraphs": [
      "Depending on applicable law and your circumstances, you may request access to, correction of, or deletion of your personal information, or raise concerns about how it is used. We may need to verify your identity and consider contractual, security, and legal obligations before acting on a request.",
      "If your information is processed through an employer, school, fleet operator, or another business customer, that organization may be the appropriate first contact. We can help direct your enquiry where appropriate. Please contact info@locator.ae for privacy questions or requests."
    ]
  },
  {
    "id": "changes",
    "title": "9. Changes to This Privacy Policy",
    "paragraphs": [
      "We may update this policy to reflect changes to our website, services, or privacy practices. The updated version will be published on this page with a revised date. Please review it periodically. Where applicable law requires additional notice or consent, we will follow those requirements."
    ]
  },
  {
    "id": "contact-information",
    "title": "10. Contact Information",
    "paragraphs": [
      "For questions about this Privacy Policy or LOCATOR’s handling of personal information, contact info@locator.ae or use the contact page on our website.",
      "LOCATOR is managed by Synosys Technologies LLC."
    ]
  }
]

export default function PrivacyPolicyPage() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <SoftwareNavbar />
      <style href="privacy-policy-page" precedence="medium">{`
        .pp-hero { padding: clamp(48px,7vw,88px) 24px; background: linear-gradient(135deg,#eef4ff,#f7fcff); }
        .pp-inner { max-width: 960px; margin: 0 auto; }
        .pp-hero h1 { margin: 12px 0 16px; color: #1d1d1f; font-size: clamp(32px,4vw,52px); font-weight: 800; line-height: 1.15; letter-spacing: -.025em; }
        .pp-hero p, .pp-article p, .pp-links { font-size: clamp(14px,1.1vw,17px); line-height: 1.85; color: #52525e; }
        .pp-article { padding: clamp(36px,5vw,64px) 24px; }
        .pp-article section { margin-bottom: 36px; scroll-margin-top: 100px; }
        .pp-article h2 { font-size: clamp(20px,2vw,26px); line-height: 1.35; color: #1d1d1f; margin: 0 0 16px; font-weight: 700; }
        .pp-article p { margin: 0 0 14px; }
        .pp-contents { display: flex; flex-wrap: wrap; gap: 10px 20px; padding: 20px 0 0; }
        .pp-contents a, .pp-article a { color: #1360ee; text-decoration: underline; text-underline-offset: 3px; }
        .pp-contents a { font-size: 13px; line-height: 1.6; }
        .pp-contact { border: 1px solid #dce7fa; background: #f7faff; padding: 24px; border-radius: 16px; overflow-wrap: anywhere; }
      `}</style>
      <header className="pp-hero">
        <div className="pp-inner">
          <Link href="/" style={{ color: '#1360ee', fontSize: '13px' }}>Home</Link>
          <h1>Privacy Policy</h1>
          <p>How LOCATOR handles your information when you visit our website, contact us, or use our tracking and fleet management services.</p>
          <p>Last updated: <time dateTime="2026-10-15">15 October 2026</time></p>
          <nav className="pp-contents" aria-label="Privacy policy contents">
            {sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
          </nav>
        </div>
      </header>
      <article className="pp-article pp-inner" aria-label="Privacy policy">
        {sections.map(section => (
          <section key={section.id} id={section.id} className={section.id === 'contact-information' ? 'pp-contact' : undefined} aria-labelledby={`pp-${section.id}`}>
            <h2 id={`pp-${section.id}`}>{section.title}</h2>
            {section.paragraphs.map(paragraph => (
              <p key={paragraph}>
                {paragraph.split(/(info@locator\.ae)/g).map((part, i) =>
                  /^(info@locator\.ae)$/.test(part)
                    ? <a key={i} href={`mailto:${part}`}>{part}</a>
                    : part
                )}
              </p>
            ))}
            {section.id === 'cookies' && (
              <p className="pp-links">
                Provider policies:{' '}
                <a href="https://vimeo.com/privacy" target="_blank" rel="noopener noreferrer">Vimeo</a>,{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google</a>, and{' '}
                <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">WhatsApp</a>.
              </p>
            )}
          </section>
        ))}
      </article>
      <Footer />
    </main>
  )
}
