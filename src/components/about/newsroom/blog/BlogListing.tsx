/* eslint-disable @next/next/no-img-element -- Direct validated CMS media preserves the editor preview. */
import Link from "next/link";
import { collectionBase, collectionHref, collectionPageHref, dateLabel, newsroomHref, type BlogFilters } from "@/lib/cms-blog/urls";
import type { CmsCard, MediaCard, Pagination } from "@/lib/cms-blog/types";
import type { CmsCollection } from "@/lib/cms-blog/collections";
import type { CountryCode } from "@/config/countries";
import ContentState from "../ContentState";

// Collection-specific wording; layout and behaviour are shared.
const COPY = {
  blogs: { h1: "Locator Blog", noun: "articles", nav: "Blog pagination", empty: "No articles yet", emptyLead: undefined, all: "View all articles", lead: "Read Full Article →" },
  "company-news": { h1: "LOCATOR Company News", noun: "company news", nav: "Company news pagination", empty: "No company news yet", emptyLead: "Company announcements will appear here once they are published. Explore the rest of our newsroom in the meantime.", all: "View all company news", lead: "Read Full Story →" },
  "product-updates": { h1: "LOCATOR Product Updates", noun: "product updates", nav: "Product updates pagination", empty: "No product updates yet", emptyLead: "New features and releases will appear here once they are published. Explore the rest of our newsroom in the meantime.", all: "View all product updates", lead: "Read Full Update →" },
} as const;
type ListingCard = CmsCard | MediaCard;
const isVideo = (post: ListingCard) => post.format === "video";
const EASE = "cubic-bezier(.22,.61,.36,1)";
export default function BlogListing({
  posts,
  pagination,
  market,
  filters = { page: 1, q: "", tag: "" },
  collection = "blogs",
}: {
  market: CountryCode;
  filters?: BlogFilters;
  posts: ListingCard[];
  pagination: Pagination;
  collection?: CmsCollection;
}) {
  const [lead, ...rest] = posts;
  const copy = COPY[collection];
  const itemHref = (slug: string) => collectionHref(market, collection, slug);
  const pageHref = (page: number) => collectionPageHref(market, collection, filters, page);
  const filtered = Boolean(filters.q || filters.tag || filters.featured !== undefined);
  // Videos have no reading time; label them instead.
  const meta = (post: ListingCard) => (isVideo(post) ? "Video" : `${post.readingMinutes} min read`);
  return (
    <section className="bl">
      <style href="nr-bloglisting" precedence="medium">{`
        .bl { background: #fff; }
        .bl-wrap { max-width: var(--w-1180); margin: 0 auto; padding: clamp(30px,4vw,54px) 28px 0; }
        .bl-h1 {
          position: absolute; width: 1px; height: 1px; margin: -1px;
          overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
        }

        .bl-lead {
          display: grid; grid-template-columns: minmax(0,1.15fr) minmax(0,1fr);
          gap: clamp(20px,2.8vw,40px); align-items: center; text-decoration: none;
          background: #fff; border: 1px solid #e7ecf6; border-radius: 20px; overflow: hidden;
          padding: clamp(18px,2vw,26px);
          transition: transform .22s ${EASE}, box-shadow .22s ${EASE}, border-color .22s ${EASE};
        }
        .bl-lead:hover { transform: translateY(-3px); border-color: #d5e0f5; box-shadow: 0 22px 48px -24px rgba(11,18,32,.4); }
        @media (max-width: 860px) { .bl-lead { grid-template-columns: 1fr; } }
        .bl-lead-media { position: relative; aspect-ratio: 16 / 10; border-radius: 14px; overflow: hidden; background: #eef3fb; order: 2; }
        @media (max-width: 860px) { .bl-lead-media { order: 0; } }
        .bl-lead-media img { object-fit: cover; transition: transform .4s ${EASE}; }
        .bl-lead:hover .bl-lead-media img { transform: scale(1.04); }
        .bl-lead-title { margin: 12px 0 12px; font-size: clamp(21px,2.2vw,32px); font-weight: 800; line-height: 1.2; letter-spacing: -.024em; color: #0b1220; }
        .bl-lead-excerpt { margin: 0 0 16px; font-size: var(--f-14-5); line-height: 1.7; color: #5b6474; max-width: 58ch; }

        .bl-chip {
          display: inline-block; font-size: var(--f-10); font-weight: 800;
          letter-spacing: .09em; text-transform: uppercase; color: #fff;
          background: #1360ee; padding: 5px 10px; border-radius: 6px;
        }
        .bl-meta { font-size: var(--f-12); color: #97a1b3; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .bl-meta i { width: 3px; height: 3px; border-radius: 50%; background: #c6cddb; }
        .bl-more { font-size: var(--f-13-5); font-weight: 700; color: #1360ee; }
        .bl-lead:hover .bl-more, .bl-card:hover .bl-more { text-decoration: underline; }

        .bl-grid {
          display: grid; grid-template-columns: repeat(3, minmax(0,1fr));
          gap: clamp(18px,2.2vw,26px);
          padding: clamp(24px,3vw,40px) 0 clamp(46px,5.5vw,80px);
        }
        @media (max-width: 980px) { .bl-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        @media (max-width: 620px) { .bl-grid { grid-template-columns: 1fr; } }

        .bl-card {
          display: flex; flex-direction: column; overflow: hidden; text-decoration: none;
          background: #fff; border: 1px solid #e7ecf6; border-radius: 16px;
          transition: transform .22s ${EASE}, box-shadow .22s ${EASE}, border-color .22s ${EASE};
        }
        .bl-card:hover { transform: translateY(-3px); border-color: #d5e0f5; box-shadow: 0 18px 40px -20px rgba(11,18,32,.35); }
        .bl-card-media { position: relative; aspect-ratio: 16 / 10; background: #eef3fb; overflow: hidden; }
        .bl-card-media img { object-fit: cover; transition: transform .4s ${EASE}; }
        .bl-card:hover .bl-card-media img { transform: scale(1.05); }
        .bl-card-media .bl-chip { position: absolute; left: 12px; top: 12px; z-index: 2; }
        .bl-card-body { padding: 18px 18px 20px; display: flex; flex-direction: column; flex: 1; }
        .bl-card-title { margin: 8px 0 9px; font-size: var(--f-15-5); font-weight: 770; line-height: 1.32; letter-spacing: -.016em; color: #0b1220; }
        .bl-card-excerpt {
          margin: 0 0 14px; font-size: var(--f-13); line-height: 1.62; color: #6b7484; flex: 1;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
      `}</style>
      <div className="bl-wrap">
        <h1 className="bl-h1">{copy.h1}</h1>
        {lead ? (
          <Link
            href={itemHref(lead.slug)}
            className="bl-lead"
            style={!lead.banner ? { gridTemplateColumns: "1fr" } : undefined}
          >
            <div>
              <span className="bl-chip">{lead.category.name}</span>
              <h2 className="bl-lead-title">{lead.title}</h2>
              <p className="bl-lead-excerpt">{lead.excerpt}</p>
              <p className="bl-meta" style={{ marginBottom: 14 }}>
                <time dateTime={lead.publishedAt}>
                  {dateLabel(lead.publishedAt)}
                </time>
                <i />
                <span>{meta(lead)}</span>
              </p>
              <span className="bl-more">{isVideo(lead) ? "Watch Video →" : copy.lead}</span>
            </div>
            {lead.banner && (
              <div className="bl-lead-media">
                <img
                  src={lead.banner.src}
                  alt={lead.banner.alt}
                  width={lead.banner.width}
                  height={lead.banner.height}
                  fetchPriority="high"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            )}
          </Link>
        ) : (
          <ContentState state="empty"
            title={filtered ? `No matching ${copy.noun}` : pagination.total ? `No ${copy.noun} on this page` : copy.empty}
            description={filtered ? `Try another search or explore all published ${copy.noun}.` : pagination.total ? `Explore the latest published ${copy.noun} from the first page.` : copy.emptyLead}
            href={filtered || filters.page > 1 ? collectionBase(market, collection) : newsroomHref(market)}
            linkLabel={filtered || filters.page > 1 ? copy.all : "Explore the newsroom"} />
        )}
        <div className="bl-grid">
          {rest.map((p) => (
            <Link key={p.slug} href={itemHref(p.slug)} className="bl-card">
              {p.banner && (
                <div className="bl-card-media">
                  <img
                    src={p.banner.src}
                    alt={p.banner.alt}
                    width={p.banner.width}
                    height={p.banner.height}
                    loading="lazy"
                    style={{ width: "100%", height: "100%" }}
                  />
                  <span className="bl-chip">{p.category.name}</span>
                </div>
              )}
              <div className="bl-card-body">
                {!p.banner && (
                  <span className="bl-chip">{p.category.name}</span>
                )}
                <p className="bl-meta">
                  <time dateTime={p.publishedAt}>
                    {dateLabel(p.publishedAt)}
                  </time>
                  <i />
                  <span>{meta(p)}</span>
                </p>
                <h2 className="bl-card-title">{p.title}</h2>
                <p className="bl-card-excerpt">{p.excerpt}</p>
                <span className="bl-more">{isVideo(p) ? "Watch Video →" : "Read More →"}</span>
              </div>
            </Link>
          ))}
        </div>
        {posts.length > 0 && pagination.pages > 1 && (
          <nav
            aria-label={copy.nav}
            style={{ display: "flex", gap: 20, paddingBottom: 40 }}
          >
            {pagination.page > 1 && (
              <Link
                rel="prev"
                href={pageHref(pagination.page - 1)}
              >
                Previous
              </Link>
            )}
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            {pagination.page < pagination.pages && (
              <Link
                rel="next"
                href={pageHref(pagination.page + 1)}
              >
                Next
              </Link>
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
