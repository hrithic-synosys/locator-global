import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CountryCode } from "@/config/countries";
import { assertMarket, serializeJsonLd } from "@/lib/cms-blog/urls";
import { getProductUpdate, getRelatedProductUpdates } from "@/lib/cms-blog/client";
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
import type { ProductUpdateDetail } from "@/lib/cms-blog/types";
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
// One CMS read per request for metadata and page; an authoritative 404 becomes
// notFound(), while an outage renders the temporary-unavailability page.
const itemForRoute = cache(async (market: CountryCode, slug: string) => {
  assertMarket(market);
  const result = await loadCmsResource(async () => {
    const item = await getProductUpdate(market, slug);
    if (item) articleCanonical(item, "product-updates");
    return item;
  });
  if (result.status === "ready" && !result.data) notFound();
  return result;
});
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { market, slug } = await params;
  const result = await itemForRoute(market, slug);
  if (result.status === "unavailable")
    return marketMetadata(
      {
        title: "LOCATOR Product Updates",
        description: "New features and product updates from LOCATOR.",
      },
      market,
      `/about/newsroom/product-updates/${encodeURIComponent(slug)}`
    );
  return articleMetadata(result.data!, "product-updates");
}
export default async function ProductUpdateArticlePage({ params }: Props) {
  const { market, slug } = await params;
  const result = await itemForRoute(market, slug);
  if (result.status === "unavailable")
    return (
      <NewsroomPageState
        unavailable
        title="This update is temporarily unavailable"
        description="We can’t load this product update right now. Please try again shortly or explore the rest of our newsroom."
      />
    );
  const item = result.data!;
  return (
    <main style={{ background: "#fff", minHeight: "100vh", overflowX: "clip" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(articleJsonLd(item, "product-updates")),
        }}
      />
      <ScrollReveal />
      <SoftwareNavbar />
      <BlogArticle
        key={item.market + ":" + item.slug}
        market={item.market}
        collection="product-updates"
        title={item.title}
        excerpt={item.excerpt}
        coverImage={item.banner}
        content={item.content}
        format={item.format}
        videoUrl={item.videoUrl}
        author={item.author}
        summary={item.summary}
        relatedContent={
          <Suspense fallback={null}>
            <RelatedContent item={item} />
          </Suspense>
        }
        categoryName={item.category.name}
        publishedAt={item.publishedAt}
        readingMinutes={item.format === "video" ? undefined : item.readingMinutes}
        url={publicArticleUrl(item.market, item.slug, "product-updates")}
      />
      <NewsroomSubscribe />
      <AboutPillarNav current="newsroom" />
      <Footer />
    </main>
  );
}

// A failed related feed only hides the related list; the update stays readable.
async function RelatedContent({ item }: { item: ProductUpdateDetail }) {
  const related = await loadCmsResource(() =>
    getRelatedProductUpdates(item.market, item.slug)
  );
  return (
    <RelatedArticles
      articles={related.status === "ready" ? related.data || [] : []}
      showThumbs={Boolean(item.banner)}
    />
  );
}
