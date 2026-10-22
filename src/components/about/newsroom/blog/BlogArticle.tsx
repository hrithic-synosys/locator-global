import Image from 'next/image'
import Link from '@/components/country/CountryLink'
import BlogBlocks from './BlogBlocks'
import { BLOG_BASE, blogHref, relatedPosts, type BlogPost } from './blog-index'
import type { BlogBlock } from './blog-content'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function titleWithAccent(title: string) {
  const i = title.lastIndexOf(' ')
  if (i === -1) return title
  return (
    <>
      {title.slice(0, i + 1)}
      <span className="ba-h1-accent">{title.slice(i + 1)}</span>
    </>
  )
}

export default function BlogArticle({ post, blocks }: { post: BlogPost; blocks: BlogBlock[] }) {
  const related = relatedPosts(post.slug, 3)

  return (
    <article className="ba">
      <style href="nr-blogarticle" precedence="medium">{`
        .ba { background: #fff; }
        .ba-wrap { max-width: var(--w-1180); margin: 0 auto; padding: 0 28px; }
        .ba-article { max-width: var(--w-1180); margin: 0 auto; padding: 0 28px clamp(48px,6vw,80px); }

        .ba-crumbs-bar { border-bottom: 1px solid #eef1f7; }
        .ba-crumbs {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          max-width: var(--w-1180); margin: 0 auto; padding: 16px 28px;
          font-size: var(--f-13-5); color: #6e6e73;
        }
        .ba-crumbs a { color: #1d1d1f; font-weight: 600; text-decoration: none; transition: color .18s ease; }
        .ba-crumbs a:hover { color: #1360ee; }
        .ba-crumbs svg { color: #b8bcc4; flex-shrink: 0; }
        .ba-crumbs .cur {
          color: #8e8e93; min-width: 0; max-width: min(46ch, 100%);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .ba-head { padding: clamp(28px,3.6vw,48px) 0 clamp(24px,3vw,40px); }
        .ba-head-grid {
          display: grid; grid-template-columns: minmax(0,1.05fr) minmax(0,1fr);
          gap: clamp(24px,3.4vw,48px); align-items: center;
        }
        @media (max-width: 900px) { .ba-head-grid { grid-template-columns: 1fr; } }

        .ba-kicker {
          display: block; margin-bottom: 14px;
          font-size: var(--f-13); font-weight: 800; letter-spacing: .08em;
          color: #1360ee; text-transform: uppercase;
        }
        .ba-kicker::before {
          content: ''; display: block; width: 34px; height: 3px;
          background: #1360ee; border-radius: 2px; margin-bottom: 12px;
        }
        .ba-h1 {
          margin: 0 0 14px;
          font-size: clamp(26px, 3.1vw, 46px); font-weight: 800; line-height: 1.15;
          letter-spacing: -.026em; color: #0b1220;
        }
        .ba-h1-accent { color: #1360ee; }
        .ba-meta {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
          font-size: var(--f-13); color: #7a8394; margin-bottom: 22px;
        }
        .ba-meta i { width: 3px; height: 3px; border-radius: 50%; background: #c6cddb; }

        .ba-ctas { display: flex; gap: 12px; flex-wrap: wrap; }
        .ba-btn {
          display: inline-flex; align-items: center; text-decoration: none;
          font-size: var(--f-13-5); font-weight: 700; padding: 13px 22px; border-radius: 11px;
          transition: transform .18s ${EASE}, box-shadow .18s ${EASE}, background .18s ${EASE};
        }
        .ba-btn--solid { background: #1360ee; color: #fff; box-shadow: 0 12px 24px -12px rgba(19,96,238,.85); }
        .ba-btn--solid:hover { transform: translateY(-2px); box-shadow: 0 16px 30px -12px rgba(19,96,238,.9); }
        .ba-btn--ghost { background: #fff; color: #1360ee; border: 1.5px solid #cfdcf5; }
        .ba-btn--ghost:hover { background: #f2f6fd; border-color: #1360ee; transform: translateY(-2px); }

        .ba-hero {
          border-radius: 20px; overflow: hidden;
          border: 1px solid #e7ecf6; background: #f4f7fd;
        }
        .ba-hero img { display: block; width: 100%; height: auto; }

        .ba-article > :first-child { margin-top: 0; }
        .ba-p { margin: 0 0 20px; font-size: var(--f-17); line-height: 1.8; color: #4b5464; }
        .ba-h2 {
          margin: clamp(32px,3.4vw,46px) 0 14px;
          font-size: clamp(19px,1.95vw,27px); font-weight: 790; line-height: 1.28;
          letter-spacing: -.021em; color: #0b1220;
        }
        .ba-h3 {
          margin: clamp(24px,2.6vw,32px) 0 10px;
          font-size: clamp(16px,1.42vw,20px); font-weight: 760; line-height: 1.35;
          letter-spacing: -.015em; color: #16233a;
        }
        .ba-link { color: #1360ee; font-weight: 600; text-decoration: none; }
        .ba-link:hover { text-decoration: underline; }

        .ba-list, .ba-olist {
          margin: 0 0 20px; padding: 0; list-style: none;
          display: flex; flex-direction: column; gap: 10px;
        }
        .ba-list > li, .ba-olist > li {
          position: relative; padding-left: 26px;
          font-size: var(--f-16); line-height: 1.75; color: #4b5464;
        }
        .ba-list > li::before {
          content: ''; position: absolute; left: 7px; top: .72em;
          width: 6px; height: 6px; border-radius: 50%; background: #1360ee;
        }
        .ba-olist { counter-reset: ba-ol; }
        .ba-olist > li { counter-increment: ba-ol; padding-left: 32px; }
        .ba-olist > li::before {
          content: counter(ba-ol) '.'; position: absolute; left: 0; top: 0;
          color: #1360ee; font-weight: 700; font-variant-numeric: tabular-nums;
        }

        .ba-quote {
          margin: 0 0 22px; padding: 4px 0 4px 20px; border-left: 3px solid #1360ee;
          font-size: var(--f-16); line-height: 1.7; color: #16233a; font-style: italic;
        }

        .ba-figure { margin: clamp(22px,2.6vw,32px) 0; }
        .ba-img {
          display: block; width: 100%; height: auto; border-radius: 16px;
          border: 1px solid #e7ecf6; background: #f4f7fd;
        }

        .ba-h2, .ba-h3, .ba-p, .ba-list, .ba-olist, .ba-quote { max-width: 880px; margin-inline: 0; }
        .ba-figure, .ba-table-scroll { max-width: 980px; margin-inline: 0; }

        .ba-split {
          display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr);
          gap: clamp(24px,3.2vw,52px); align-items: center;
          margin: clamp(34px,4vw,56px) 0;
        }
        .ba-split-figure { margin: 0; }
        .ba-split-body > :first-child { margin-top: 0; }
        .ba-split :is(.ba-h2, .ba-h3, .ba-p, .ba-list, .ba-olist, .ba-quote) { max-width: none; margin-inline: 0; }

        .ba-split[data-layout='wide-text']  { grid-template-columns: minmax(0,0.8fr) minmax(0,1.2fr); }
        .ba-split[data-layout='wide-image'] { grid-template-columns: minmax(0,1.15fr) minmax(0,0.85fr); }
        .ba-split[data-layout='compact'] { max-width: 880px; }

        .ba-split[data-side='right'] .ba-split-figure { order: 2; }
        .ba-split[data-side='right'][data-layout='wide-text']  { grid-template-columns: minmax(0,1.2fr) minmax(0,0.8fr); }
        .ba-split[data-side='right'][data-layout='wide-image'] { grid-template-columns: minmax(0,0.85fr) minmax(0,1.15fr); }

        .ba-split-figure .ba-img { max-height: 460px; width: auto; margin-inline: auto; }
        .ba-split[data-layout='brief'] .ba-split-figure .ba-img { max-height: 320px; }
        .ba-split[data-layout='compact'] .ba-split-figure .ba-img { max-height: 230px; }
        .ba-split[data-side='left'][data-layout='compact'] .ba-img { margin-inline: auto 0; }
        .ba-split[data-side='right'][data-layout='compact'] .ba-img { margin-inline: 0 auto; }

        @media (max-width: 900px) {
          .ba-split[data-side][data-layout] { grid-template-columns: 1fr; max-width: none; gap: clamp(16px,3vw,24px); }
          .ba-split[data-side][data-layout] .ba-split-figure { order: 0; }
          .ba-split[data-side][data-layout] .ba-img { max-height: 340px; margin-inline: 0; }
        }

        .ba-table-scroll {
          margin: clamp(20px,2.4vw,30px) 0; overflow-x: auto;
          border: 1px solid #e7ecf6; border-radius: 14px;
        }
        .ba-table { width: 100%; border-collapse: collapse; min-width: 520px; }
        .ba-table th, .ba-table td {
          text-align: left; padding: 13px 16px; border-bottom: 1px solid #eef2f8;
          font-size: var(--f-13-5); line-height: 1.6; color: #4b5464; vertical-align: top;
        }
        .ba-table th { background: #e7effd; color: #0b1220; font-weight: 750; }
        .ba-table tbody tr:last-child td { border-bottom: 0; }

        .ba-related { background: #f7f9fc; border-top: 1px solid #e7ecf6; padding: clamp(38px,4.4vw,64px) 0; }
        .ba-related-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: clamp(18px,2.2vw,26px); }
        .ba-related-head h2 { margin: 0; font-size: clamp(18px,1.9vw,26px); font-weight: 800; letter-spacing: -.02em; color: #0b1220; }
        .ba-related-head a { font-size: var(--f-13); font-weight: 700; color: #1360ee; text-decoration: none; white-space: nowrap; }
        .ba-related-head a:hover { text-decoration: underline; }
        .ba-related-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: clamp(16px,2vw,24px); }
        @media (max-width: 900px) { .ba-related-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        @media (max-width: 600px) { .ba-related-grid { grid-template-columns: 1fr; } }

        .ba-rcard {
          display: flex; flex-direction: column; overflow: hidden; text-decoration: none;
          background: #fff; border: 1px solid #e7ecf6; border-radius: 16px;
          transition: transform .22s ${EASE}, box-shadow .22s ${EASE}, border-color .22s ${EASE};
        }
        .ba-rcard:hover { transform: translateY(-3px); border-color: #d5e0f5; box-shadow: 0 18px 40px -20px rgba(11,18,32,.35); }
        .ba-rcard-media { position: relative; aspect-ratio: 16 / 10; background: #eef3fb; overflow: hidden; }
        .ba-rcard-media img { object-fit: cover; transition: transform .4s ${EASE}; }
        .ba-rcard:hover .ba-rcard-media img { transform: scale(1.05); }
        .ba-rcard-body { padding: 18px 18px 20px; display: flex; flex-direction: column; flex: 1; }
        .ba-rcard-date { font-size: var(--f-12); color: #97a1b3; margin-bottom: 8px; }
        .ba-rcard-title { margin: 0 0 9px; font-size: var(--f-15-5); font-weight: 770; line-height: 1.32; letter-spacing: -.016em; color: #0b1220; }
        .ba-rcard-excerpt {
          margin: 0 0 14px; font-size: var(--f-13); line-height: 1.6; color: #6b7484; flex: 1;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .ba-rcard-more { font-size: var(--f-13); font-weight: 700; color: #1360ee; }
        .ba-rcard:hover .ba-rcard-more { text-decoration: underline; }
      `}</style>

      <div className="ba-crumbs-bar">
        <nav className="ba-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <Chevron />
          <Link href="/about/newsroom">Newsroom</Link>
          <Chevron />
          <Link href={BLOG_BASE}>Blog</Link>
          <Chevron />
          <span className="cur">{post.title}</span>
        </nav>
      </div>

      <header className="ba-head">
        <div className="ba-wrap">
          <div className="ba-head-grid">
            <div>
              <span className="ba-kicker">{post.tag}</span>
              <h1 className="ba-h1">{titleWithAccent(post.title)}</h1>
              <p className="ba-meta">
                <time dateTime={post.date}>{post.dateLabel}</time>
                <i />
                <span>{post.readingMinutes} min read</span>
                <i />
                <span>LOCATOR</span>
              </p>
              <div className="ba-ctas">
                <Link href="/get-a-quote" className="ba-btn ba-btn--solid">
                  Get a Free Quote
                </Link>
                <Link href="/get-a-free-demo" className="ba-btn ba-btn--ghost">
                  Book a Free Demo
                </Link>
              </div>
            </div>

            <div className="ba-hero">
              <Image
                src={post.hero.src}
                alt={post.hero.alt}
                width={post.hero.width}
                height={post.hero.height}
                sizes="(max-width: 900px) 100vw, 620px"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      <div className="ba-article">
        <BlogBlocks blocks={blocks} />
      </div>

      {related.length > 0 && (
        <section className="ba-related">
          <div className="ba-wrap">
            <div className="ba-related-head">
              <h2>Related reading</h2>
              <Link href={BLOG_BASE}>All articles →</Link>
            </div>
            <div className="ba-related-grid">
              {related.map((item) => (
                <Link key={item.slug} href={blogHref(item.slug)} className="ba-rcard">
                  <div className="ba-rcard-media">
                    <Image src={item.hero.src} alt={item.hero.alt} fill sizes="(max-width: 600px) 100vw, 360px" />
                  </div>
                  <div className="ba-rcard-body">
                    <span className="ba-rcard-date">{item.dateLabel}</span>
                    <h3 className="ba-rcard-title">{item.title}</h3>
                    <p className="ba-rcard-excerpt">{item.excerpt}</p>
                    <span className="ba-rcard-more">Read More →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
