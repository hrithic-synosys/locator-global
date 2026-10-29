import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CountryCode } from "@/config/countries";
import { assertMarket, serializeJsonLd } from "@/lib/cms-blog/urls";
import { getBlog, getRelatedBlogs } from "@/lib/cms-blog/client";
import { loadCmsResource } from "@/lib/cms-blog/resource";
import { marketMetadata } from "@/lib/country/metadata";
import NewsroomPageState from "@/components/about/newsroom/NewsroomPageState";
import { cache, Suspense } from "react";
import {
  articleJsonLd,
  articleCanonical,
  articleMetadata,
  publicArticleUrl,
} from "@/lib/cms-blog/seo";
import ScrollReveal from "@/components/software/ScrollReveal";
import SoftwareNavbar from "@/components/software/SoftwareNavbar";
import BlogArticle, {
  RelatedArticles,
} from "@/components/about/newsroom/blog/BlogArticle";
import NewsroomSubscribe from "@/components/about/newsroom/NewsroomSubscribe";
import AboutPillarNav from "@/components/about/AboutPillarNav";
import Footer from "@/components/layouts/Footer";
export const dynamic = "force-dynamic";
export const dynamicParams = true;
type Props = { params: Promise<{ market: CountryCode; slug: string }> };
const articleForRoute = cache(async (market: CountryCode, slug: string) => {
  assertMarket(market);
  const result = await loadCmsResource(async () => {
    const post = await getBlog(market, slug);
    if (post) articleCanonical(post);
    return post;
  });
  if (result.status === "ready" && !result.data) notFound();
  return result;
});
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { market, slug } = await params;
  const result = await articleForRoute(market, slug);
  if (result.status === "unavailable")
    return marketMetadata(
      {
        title: "Locator Articles",
        description: "Stories and insights from the Locator team.",
      },
      market,
      `/about/newsroom/blog/${encodeURIComponent(slug)}`
    );
  return articleMetadata(result.data!);
}
export default async function BlogArticlePage({ params }: Props) {
  const { market, slug } = await params;
  const result = await articleForRoute(market, slug);
  if (result.status === "unavailable") return <NewsroomPageState unavailable />;
  const post = result.data!;
  return (
    <main style={{ background: "#fff", minHeight: "100vh", overflowX: "clip" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(articleJsonLd(post)),
        }}
      />
      <ScrollReveal />
      <SoftwareNavbar />
      <ArticleContent post={post} />
      <NewsroomSubscribe />
      <AboutPillarNav current="newsroom" />
      <Footer />
    </main>
  );
}

async function RelatedContent({
  post,
}: {
  post: NonNullable<Awaited<ReturnType<typeof getBlog>>>;
}) {
  const related = await loadCmsResource(() =>
    getRelatedBlogs(post.market, post.slug)
  );
  return (
    <RelatedArticles
      articles={related.status === "ready" ? related.data || [] : []}
      showThumbs={Boolean(post.banner)}
    />
  );
}

function ArticleContent({
  post,
}: {
  post: NonNullable<Awaited<ReturnType<typeof getBlog>>>;
}) {
  return (
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
      relatedContent={
        <Suspense fallback={null}>
          <RelatedContent post={post} />
        </Suspense>
      }
      categoryName={post.category.name}
      publishedAt={post.publishedAt}
      readingMinutes={post.readingMinutes}
      url={publicArticleUrl(post.market, post.slug)}
    />
  );
}
