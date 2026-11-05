import type { globalCopy } from '@/content/pages/car-tracker/global'
/**
 * The four headline figures that used to sit here as coloured tiles are now
 * rendered by <WhoWeAreNumbers />, the shared "LOCATOR in Numbers" band used on
 * /securepath, /industries and /about/purpose — same figures (15+, 6,000+,
 * 60,000+, 25M+), one implementation. What remains is this page's own "About
 * LOCATOR" copy, which is unique SEO content and is kept verbatim.
 */
export default function CarTrackerStats({ content }: { content?: typeof globalCopy.device } = {}) {
  return (
    <section style={{ padding: 'clamp(48px,6vw,72px) 28px', background: '#fff' }}>
      <div style={{ maxWidth: 'var(--w-900)', margin: '0 auto', textAlign: 'center' }} data-reveal>
        <span style={{ fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
          <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
          {content?.eyebrow ?? 'About LOCATOR'}
        </span>
        <h2 style={{ margin: '0 0 16px', fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-.015em', color: '#1d1d1f' }}>
          {content?.heading ?? 'A next-generation car tracker app'}
        </h2>
        <p style={{ margin: '0 auto', fontSize: 'max(clamp(13.5px,1.25vw,15px), min(1.042vw, 21.75px))', lineHeight: 1.8, color: '#6e6e73', maxWidth: '68ch' }}>
          {content?.description ?? 'LOCATOR is an application with next-generation features to ensure your cars and vehicles are accurately tracked without any compromise. The Car Tracker app comes with highly sophisticated and advanced features that make vehicle tracking a complete walk in the park — well ahead of other tracking devices you may have used in the past.'}
        </p>
      </div>
    </section>
  )
}
