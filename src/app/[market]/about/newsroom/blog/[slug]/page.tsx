import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CountryCode } from "@/config/countries";
import { assertMarket, serializeJsonLd } from "@/lib/cms-blog/urls";
import { loadBlogArticle, loadRelatedBlogs } from "@/lib/cms-blog/availability";
import { marketMetadata } from "@/lib/country/metadata";
import {
  articleJsonLd,
  articleMetadata,
  publicArticleUrl,
} from "@/lib/cms-blog/seo";
import ScrollReveal from "@/components/software/ScrollReveal";
import BlogArticle from "@/components/about/newsroom/blog/BlogArticle";
import BlogStatus from "@/components/about/newsroom/blog/BlogStatus";
export const dynamic = "force-dynamic";
export const dynamicParams = true;
type Props = { params: Promise<{ market: CountryCode; slug: string }> };
async function articleForRoute(params: Props["params"]) {
  const { market, slug } = await params;
  assertMarket(market);
  const result = await loadBlogArticle(market, slug);
  if (result.state === "not-found") notFound();
  return result;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await articleForRoute(params);
  if (result.state === "ready") return articleMetadata(result.article);
  const { market, slug } = await params;
  const metadata = marketMetadata(
    {
      title: "Article temporarily unavailable",
      description: "Please try loading this article again shortly.",
      openGraph: { images: [] },
      twitter: { images: [] },
    },
    market,
    "/about/newsroom/blog/" + encodeURIComponent(slug)
  );
  return { ...metadata, robots: { index: false, follow: true } };
}
export default async function BlogArticlePage({ params }: Props) {
  const result = await articleForRoute(params);
  if (result.state === "unavailable")
    return (
      <main
        style={{
          minHeight: "60vh",
          padding: "clamp(36px,6vw,80px) 24px",
          background: "#fff",
        }}
      >
        <BlogStatus kind="unavailable" headingLevel="h1" />
      </main>
    );
  const post = result.article;
  const related = await loadRelatedBlogs(post.market, post.slug);
  if (related.state === "not-found") notFound();
  return (
    <main style={{ background: "#fff", minHeight: "100vh", overflowX: "clip" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(articleJsonLd(post)),
        }}
      />
      <ScrollReveal />
      <BlogArticle
        key={post.market + ":" + post.slug}
        market={post.market}
        title={post.title}
        excerpt={post.excerpt}
        coverImage={post.banner}
        content={post.content}
        format={post.format}
        author={post.author}
        summary={post.summary}
        relatedArticles={related.state === "ready" ? related.items : []}
        relatedUnavailable={related.state === "unavailable"}
        categoryName={post.category.name}
        publishedAt={post.publishedAt}
        readingMinutes={post.readingMinutes}
        url={publicArticleUrl(post.market, post.slug)}
      />
    </main>
  );
}
