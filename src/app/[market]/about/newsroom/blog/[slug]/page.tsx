import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CountryCode } from "@/config/countries";
import { assertMarket, serializeJsonLd } from "@/lib/cms-blog/urls";
import { getBlog, getRelatedBlogs } from "@/lib/cms-blog/client";
import {
  articleJsonLd,
  articleMetadata,
  publicArticleUrl,
} from "@/lib/cms-blog/seo";
import ScrollReveal from "@/components/software/ScrollReveal";
import SoftwareNavbar from "@/components/software/SoftwareNavbar";
import BlogArticle from "@/components/about/newsroom/blog/BlogArticle";
import NewsroomSubscribe from "@/components/about/newsroom/NewsroomSubscribe";
import AboutPillarNav from "@/components/about/AboutPillarNav";
import Footer from "@/components/layouts/Footer";
export const dynamic = "force-dynamic";
export const dynamicParams = true;
type Props = { params: Promise<{ market: CountryCode; slug: string }> };
async function articleForRoute(params: Props["params"]) {
  const { market, slug } = await params;
  assertMarket(market);
  const post = await getBlog(market, slug);
  if (!post) notFound();
  return post;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return articleMetadata(await articleForRoute(params));
}
export default async function BlogArticlePage({ params }: Props) {
  const post = await articleForRoute(params);
  const related = await getRelatedBlogs(post.market, post.slug);
  if (related === null) notFound();
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
        relatedArticles={related}
        categoryName={post.category.name}
        publishedAt={post.publishedAt}
        readingMinutes={post.readingMinutes}
        url={publicArticleUrl(post.market, post.slug)}
      />
      <NewsroomSubscribe />
      <AboutPillarNav current="newsroom" />
      <Footer />
    </main>
  );
}
