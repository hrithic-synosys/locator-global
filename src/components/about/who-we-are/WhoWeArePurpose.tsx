import type { globalWhoWeAre } from '@/content/pages/who-we-are/global'
export default function WhoWeArePurpose({ content }: { content?: typeof globalWhoWeAre['purpose'] } = {}) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(56px,7vw,92px) 28px', background: '#f7f9fc' }}>
      <div aria-hidden="true" style={{ position: 'absolute', width: 460, height: 460, top: -160, left: '50%', transform: 'translateX(-50%)', borderRadius: '50%', background: 'radial-gradient(50% 50% at 50% 50%, rgba(19,96,238,.07), transparent 70%)', pointerEvents: 'none' }} />

      <div data-reveal style={{ position: 'relative', maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
        <span style={{ display: 'block', fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase', marginBottom: '20px' }}>
          <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
          {content?.eyebrow ?? 'Purpose'}
        </span>
        <h2 style={{ margin: 0, fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-.015em', color: '#1d1d1f' }}>
          {content?.heading ?? <>We exist to transform movement into{' '}
          <span style={{ color: '#1360ee' }}>intelligent growth</span></>}
        </h2>
        <div style={{ margin: '24px auto', height: '4px', width: '80px', borderRadius: '999px', background: 'linear-gradient(90deg,#1360ee,#0d4fd4)' }} />
        <div style={{ display: 'grid', gap: '12px' }}>
          {(content?.paragraphs ?? ['At LOCATOR, we exist to help businesses unlock the full potential of their vehicles, assets, and field teams. Through AI-powered IoT, intelligent telematics, and connected mobility technologies, we transform underutilized resources into drivers of operational excellence. By delivering real-time visibility, greater control, improved efficiency, enhanced safety, and complete transparency, we empower organizations to reduce costs, increase profitability, and achieve sustainable growth with purpose.']).map(paragraph => (
            <p key={paragraph} style={{ margin: 0, fontSize: 'max(clamp(15px,1.5vw,17px), min(1.181vw, 24.65px))', lineHeight: 1.8, color: '#52525e' }}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
