import Image from 'next/image'
import Link from '@/components/country/CountryLink'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'
import type { IndustriesHeroContent } from '@/content/pages/industries/global'

// Shared by the Global listing and updated industry detail pages, so their
// typography, spacing and button styles stay identical.
export default function IndustriesHero({ content, image = '/industries/cover.webp', breadcrumbLabel }: { content?: IndustriesHeroContent; image?: string; breadcrumbLabel?: string }) {
  return (
    <>
      <style>{`
        .ih-hero { background: #fff; }

        /* ── Breadcrumb strip — plain white bar above the photo ── */
        .ih-crumbs-bar { border-bottom: 1px solid #eef1f7; }
        .ih-crumbs {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          max-width: var(--w-1280); margin: 0 auto; padding: 16px 28px;
          font-size: var(--f-14); color: #6e6e73;
        }
        .ih-crumbs a { color: #1d1d1f; font-weight: 600; text-decoration: none; transition: color .18s ease; }
        .ih-crumbs a:hover { color: #1360ee; }
        .ih-crumbs svg { color: #b8bcc4; flex-shrink: 0; }
        .ih-crumbs span { color: #8e8e93; }

        /* ── Photo band ── */
        .ih-photo {
          position: relative; overflow: hidden;
          height: clamp(240px, 30vw, 360px);
        }
        .ih-photo img { object-fit: cover; }
        .ih-scrim {
          position: absolute; inset: 0; z-index: 1;
          background:
            linear-gradient(0deg, rgba(4,8,18,.88) 0%, rgba(4,8,18,.5) 42%, rgba(4,8,18,.18) 68%, rgba(4,8,18,.05) 100%);
        }

        .ih-photo-body {
          position: relative; z-index: 2; height: 100%;
          display: flex; align-items: flex-end;
          max-width: var(--w-1280); margin: 0 auto; padding: 0 28px clamp(28px,4.5vw,52px);
        }
        .ih-content { max-width: min(760px, 90vw); }

        .ih-title {
          margin: 0; font-size: max(clamp(32px,5.2vw,64px), min(4.444vw, 92.8px)); font-weight: 800;
          text-transform: uppercase; line-height: 1.04; letter-spacing: -.01em;
          color: #fff; text-shadow: 0 4px 26px rgba(0,0,0,.3);
        }

        .ih-lead { margin: 18px 0 0; max-width: 62ch; font-size: max(clamp(14.5px,1.3vw,17px), min(1.181vw, 24.65px)); line-height: 1.72; color: rgba(255,255,255,.86); }
        .ih-photo.ih-global { height: auto; }
        .ih-detail .ih-scrim { background: linear-gradient(0deg, rgba(4,8,18,.9), rgba(4,8,18,.55)), linear-gradient(90deg, rgba(4,8,18,.35), transparent 80%); }
        .ih-global .ih-photo-body { padding: clamp(32px,4vw,48px) 28px; }
        .ih-global .ih-content { max-width: 900px; }
        .ih-global .ih-title { text-transform: none; font-size: clamp(32px,4.5vw,60px); line-height: 1.1; }
        .ih-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-size: max(clamp(13px,1.15vw,15px), min(1.042vw, 21.75px)); font-weight: 800;
          letter-spacing: .14em; text-transform: uppercase; color: #9ec2ff; margin-bottom: 16px;
          text-shadow: 0 2px 12px rgba(0,0,0,.35);
        }
        .ih-eyebrow i { display: block; flex-shrink: 0; width: 34px; height: 3px; background: #9ec2ff; border-radius: 2px; }
        .ih-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
        .ih-action { display: inline-flex; justify-content: center; padding: 13px 20px; border-radius: 10px; background: #1360ee; color: #fff; font-size: 14px; font-weight: 700; text-decoration: none; }
        .ih-action:hover { background: #0d4fd4; }
        .ih-action-secondary { background: #fff; color: #1360ee; }
        .ih-action-secondary:hover { background: #eef3ff; }
      `}</style>

      <section className="ih-hero">
        <SoftwareNavbar />

        <div className="ih-crumbs-bar">
          <nav className="ih-crumbs" aria-label="Breadcrumb">
            <Link href="/">Homepage</Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6 6 6-6 6" />
            </svg>
            {breadcrumbLabel ? <>
              <Link href="/industries">Industries</Link>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
              <span>{breadcrumbLabel}</span>
            </> : <span>Industries</span>}
          </nav>
        </div>

        <div className={`ih-photo${content ? ' ih-global' : ''}${breadcrumbLabel ? ' ih-detail' : ''}`} data-reveal>
          <Image
            src={image}
            alt={content?.imageAlt ?? 'Connected fleets across UAE industries'}
            fill
            priority
            sizes="100vw"
          />
          <div className="ih-scrim" />
          <div className="ih-photo-body">
            <div className="ih-content">
              {content && <span className="ih-eyebrow">{content.eyebrow}</span>}
              <h1 className="ih-title">{content?.heading ?? 'Industries'}</h1>
              <p className="ih-lead">
                {content ? content.description : <>
                The world we live in today is connected. Inspired by the businesses we work with every day,
                we share how Locator&rsquo;s GPS tracking, video telematics, and IoT platform support fleets
                across every sector in the UAE.
                </>}
              </p>
              {content && <div className="ih-actions">
                <Link className="ih-action" href={content.primaryCta.href}>{content.primaryCta.label}</Link>
                <Link className="ih-action ih-action-secondary" href={content.secondaryCta.href}>{content.secondaryCta.label}</Link>
              </div>}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
