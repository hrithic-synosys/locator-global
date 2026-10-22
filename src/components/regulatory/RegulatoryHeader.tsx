import Link from '@/components/country/CountryLink'
import type { ReactNode } from 'react'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

export default function RegulatoryHeader({
  eyebrow,
  title,
  subtitle,
  backLink = false,
  children,
}: {
  eyebrow: string
  title: string
  subtitle: string
  backLink?: boolean
  children?: ReactNode
}) {
  return (
    <>
      <style>{`
        .reg-hd {
          position: relative;
          background: #ffffff;
          padding: clamp(16px, 2vw, 28px) 28px clamp(28px, 3.4vw, 40px);
        }
        .reg-hd-back {
          display: inline-flex; align-items: center; gap: 6px;
          color: #6e6e73; font-size: var(--f-13); font-weight: 600;
          text-decoration: none; margin-bottom: 20px;
          transition: color .18s ease, gap .18s ease;
        }
        .reg-hd-back:hover { color: #1360ee; gap: 9px; }
      `}</style>

      <header className="reg-hd">
        <SoftwareNavbar />

        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          {backLink && (
            <Link href="/regulatory" className="reg-hd-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Regulatory GPS Certifications
            </Link>
          )}
          <span style={{
            fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em',
            color: '#1360ee', textTransform: 'uppercase' as const,
            display: 'block', marginBottom: '16px',
          }}>
            <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
            {eyebrow}
          </span>
          <h1 style={{ margin: 0, fontSize: 'max(clamp(21px,2.5vw,28px), min(1.944vw, 40.6px))', fontWeight: 800, lineHeight: 1.18, letterSpacing: '-.015em', color: '#1d1d1f' }}>
            {title}
          </h1>
          <p style={{ margin: '12px auto 0', maxWidth: 540, fontSize: 'max(clamp(13.5px, 1.25vw, 15.5px), min(1.076vw, 22.47px))', lineHeight: 1.55, color: '#6e6e73' }}>
            {subtitle}
          </p>
        </div>

        {children && (
          <div style={{ maxWidth: 1120, margin: 'clamp(24px, 3vw, 32px) auto 0' }}>
            {children}
          </div>
        )}
      </header>
    </>
  )
}
