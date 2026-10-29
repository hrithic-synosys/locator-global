/* eslint-disable @next/next/no-img-element -- Validated CMS media retains its original host. */
import Link from "next/link";
import type { CountryCode } from "@/config/countries";
import type { CmsResource } from "@/lib/cms-blog/resource";
import type { CmsList } from "@/lib/cms-blog/types";
import { newsroomCard } from "@/lib/cms-blog/teasers";
import { blogBase, newsroomHref } from "@/lib/cms-blog/urls";
import { NewsroomCard } from "./NewsroomBoard";
import ContentState from "./ContentState";

export default async function NewsroomBlogFeed({
  resource,
  market,
  variant,
}: {
  resource: Promise<CmsResource<CmsList>>;
  market: CountryCode;
  variant: "board" | "teasers";
}) {
  const result = await resource;
  if (result.status === "unavailable")
    return <ContentState state="unavailable" />;
  const { items, pagination } = result.data;
  const base = blogBase(market);
  if (!items.length)
    return (
      <ContentState
        state="empty"
        title={
          pagination.total ? "No articles on this page" : "No articles yet"
        }
        description={
          pagination.total
            ? "Explore the latest published articles from the first page."
            : undefined
        }
        href={pagination.total ? base : newsroomHref(market)}
        linkLabel={
          pagination.total ? "View latest articles" : "Explore the newsroom"
        }
      />
    );
  const blogs = items.map(newsroomCard);
  if (variant === "board")
    return (
      <div className="nrb-grid">
        {blogs.map((item) => (
          <NewsroomCard key={item.id} item={item} />
        ))}
      </div>
    );
  const pageHref = (page: number) =>
    newsroomHref(market) + (page > 1 ? "?blogPage=" + page : "");
  return (
    <>
      <div className="nvc-blog-stage">
        <div className="nvc-blog-list">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={blog.href}
              className="nvc-blog-card"
              style={!blog.image ? { gridTemplateColumns: "1fr" } : undefined}
            >
              {blog.image && (
                <div className="nvc-blog-image">
                  <img
                    src={blog.image}
                    alt={blog.alt}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <div className="nvc-blog-body">
                <span className="nvc-blog-date">{blog.date}</span>
                <h3 className="nvc-blog-title">{blog.title}</h3>
                {blog.excerpt && (
                  <p className="nvc-blog-excerpt">{blog.excerpt}</p>
                )}
                <span className="nvc-blog-more">Read More →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {pagination.pages > 1 && (
        <nav
          aria-label="Newsroom blog pagination"
          className="nvc-dots"
          style={{ gap: 16 }}
        >
          {pagination.page > 1 && (
            <Link rel="prev" href={pageHref(pagination.page - 1)}>
              Previous
            </Link>
          )}
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
          {pagination.page < pagination.pages && (
            <Link rel="next" href={pageHref(pagination.page + 1)}>
              Next
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
