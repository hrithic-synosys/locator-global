import type { CountryCode } from '@/config/countries'
/* eslint-disable @next/next/no-img-element -- Validated CMS media is served directly as in the CMS preview. */
import Link from 'next/link'
import { blogBase, blogHref } from '@/lib/cms-blog/urls'
import { teaserBlogs, teaserCard } from '@/lib/cms-blog/teasers'

// Category chip and author-avatar colours are all the site's own blues rather
// than blue/orange/purple — this component is shared across ~10 routes,
// including all four industry detail pages, so 3 unrelated hues here read as a
// colour chart everywhere it appears.
const ACCENTS = [
  { color: '#1360ee', bg: 'rgba(19,96,238,.1)' },
  { color: '#0d4fd4', bg: 'rgba(13,79,212,.1)' },
  { color: '#2f6fed', bg: 'rgba(47,111,237,.1)' },
]

/** CMS-backed blog teasers, selected by the scoped backend. */
export default async function SoftwareBlog({ market, tag, limit = 3 }: { market: CountryCode; tag?: string | string[]; limit?: number }) {
  void tag // Legacy display labels are not CMS tag slugs.
  const result = await teaserBlogs(market, limit)
  const posts = result.items.map(teaserCard)
  if (result.unavailable) return <p role="status">Blog articles are temporarily unavailable. <Link href={blogBase(market)}>Try the blog</Link>.</p>

  if (!posts.length) return <p role="status">No published blog articles yet.</p>

  return (
    <>
      <style>{`
        .bc {
          display: flex; flex-direction: column;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          text-decoration: none; color: inherit;
          border: 1px solid #e8e8eb;
          transition: transform .24s cubic-bezier(.22,.61,.36,1), box-shadow .24s cubic-bezier(.22,.61,.36,1);
        }
        .bc:hover { transform: translateY(-5px); box-shadow: 0 32px 64px -24px rgba(10,30,90,.2); }
        .bc:hover .bc-img { transform: scale(1.06); }
        .bc-img { transition: transform .5s cubic-bezier(.22,.61,.36,1) !important; }
        .bc-cta { transition: gap .18s cubic-bezier(.22,.61,.36,1); }
        .bc:hover .bc-cta { gap: 8px; }
        .bc-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        @media (max-width: 860px) { .bc-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 540px) { .bc-grid { grid-template-columns: 1fr; } }
      `}</style>

      <section id="blogs" style={{ padding: 'clamp(56px,7vw,80px) 28px', background: '#f5f6fa' }}>
        <div style={{ maxWidth: 'var(--w-1120)', margin: '0 auto' }}>

          {/* Header */}
          <div data-reveal style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span style={{
              display: 'block',
              fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em',
              color: '#1360ee', textTransform: 'uppercase' as const,
              marginBottom: '16px',
            }}>
              <span style={{ display: 'block', marginBottom: '12px' }}>
                <span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} />
              </span>
              Fleet Intelligence
            </span>

            <h2 style={{ margin: '0 0 14px', fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-.015em', color: '#1d1d1f' }}>
              Insights from the{' '}
              <span style={{ color: '#1360ee' }}>road</span>
            </h2>

            <p style={{ margin: '0 auto 22px', maxWidth: '440px', fontSize: 'max(clamp(13.5px,1.25vw,15px), min(1.042vw, 21.75px))', lineHeight: 1.65, color: '#6e6e73' }}>
              Practical guides on fleet safety, cost control, and operations for fleet operators.
            </p>

            <Link href={blogBase(market)} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: 'var(--f-13)', fontWeight: 700, color: '#1360ee', textDecoration: 'none', padding: '9px 20px', borderRadius: '999px', background: '#eef3ff', border: '1px solid rgba(19,96,238,.18)', whiteSpace: 'nowrap' as const }}>
              All articles →
            </Link>
          </div>

          {/* 3-col grid */}
          <div className="bc-grid">
            {posts.map((post, i) => {
              const accent = ACCENTS[i % ACCENTS.length]
              return (
                <Link key={post.slug} href={blogHref(market, post.slug)} className="bc" data-reveal data-reveal-delay={`${i * 110}`}>

                  {/* Image with overlay */}
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden', flexShrink: 0, background: '#dde5f0' }}>
                    {post.hero && <img src={post.hero.src} alt={post.hero.alt} width={post.hero.width} height={post.hero.height} loading="lazy" className="bc-img" style={{ objectFit: "cover", width: "100%", height: "100%" }} />}
                    {/* Dark gradient at bottom */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,14,50,.65) 0%, rgba(8,14,50,.15) 40%, transparent 100%)' }} />
                    {/* Category pill over image */}
                    <span style={{
                      position: 'absolute', top: '14px', left: '14px',
                      fontSize: 'var(--f-10)', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase' as const,
                      padding: '4px 10px', borderRadius: '999px',
                      background: 'rgba(255,255,255,.88)', color: 'rgb(19, 96, 238)',
                      backdropFilter: 'blur(8px) saturate(120%)', WebkitBackdropFilter: 'blur(8px) saturate(120%)',
                      border: '1px solid rgba(255,255,255,.7)',
                      boxShadow: '0 2px 8px rgba(11,18,32,.12)',
                    }}>
                      {post.tag}
                    </span>
                    {/* Read time */}
                    <span style={{
                      position: 'absolute', top: '14px', right: '14px',
                      fontSize: 'var(--f-10)', fontWeight: 600, color: 'rgba(255,255,255,.85)',
                      background: 'rgba(0,0,0,.28)', backdropFilter: 'blur(6px)',
                      padding: '4px 10px', borderRadius: '999px',
                    }}>
                      {post.readingMinutes} min read
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Color-coded category chip */}
                    <span style={{
                      alignSelf: 'flex-start',
                      fontSize: 'var(--f-10-5)', fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase' as const,
                      padding: '3px 10px', borderRadius: '999px',
                      background: accent.bg, color: accent.color,
                      marginBottom: '12px',
                    }}>
                      {post.tag}
                    </span>

                    <h3 style={{ margin: '0 0 10px', fontSize: 'var(--f-16)', fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.3, color: '#1d1d1f' }}>
                      {post.title}
                    </h3>

                    <p style={{ margin: 0, fontSize: 'var(--f-13-5)', lineHeight: 1.6, color: '#6e6e73', flex: 1 }}>
                      {post.excerpt}
                    </p>

                    {/* Meta row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #f0f0f3' }}>
                      <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: accent.color, display: 'grid', placeItems: 'center', fontSize: 'var(--f-10)', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                        LT
                      </span>
                      <span style={{ fontSize: 'var(--f-11-5)', color: '#a1a1a6', fontWeight: 500 }}>{post.dateLabel}</span>
                      <span className="bc-cta" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 'var(--f-12-5)', fontWeight: 700, color: accent.color }}>
                        Read <span>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
