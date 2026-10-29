import type { Metadata } from "next";
import { countries, type CountryCode } from "@/config/countries";
import { marketMetadata } from "@/lib/country/metadata";
import { countryPath } from "@/lib/country/paths";
import { listBlogs } from "@/lib/cms-blog/client";
import { loadCmsResource } from "@/lib/cms-blog/resource";
import { Suspense } from "react";
import ContentState from "@/components/about/newsroom/ContentState";
import {
  assertMarket,
  blogBase,
  blogHref,
  blogPageHref,
  newsroomHref,
  readBlogFilters,
  serializeJsonLd,
  type BlogFilters,
} from "@/lib/cms-blog/urls";
import { absoluteImage } from "@/lib/cms-blog/seo";
import { siteConfig, siteUrl } from "@/config/site";
import ScrollReveal from "@/components/software/ScrollReveal";
import SoftwareNavbar from "@/components/software/SoftwareNavbar";
import BlogListing from "@/components/about/newsroom/blog/BlogListing";
import NewsroomSubscribe from "@/components/about/newsroom/NewsroomSubscribe";
import AboutPillarNav from "@/components/about/AboutPillarNav";
import Footer from "@/components/layouts/Footer";
export const dynamic = "force-dynamic";
const TITLE = "Locator Blog | Fleet Tracking & GPS Solutions";
const DESCRIPTION =
  "Expert advice and fleet management strategies from LOCATOR. Guides on GPS tracking, fleet software, driver behaviour and connected fleet operations.";
type Props = {
  params: Promise<{ market: CountryCode }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { market } = await params;
  assertMarket(market);
  const filters = readBlogFilters(await searchParams);
  const metadata = marketMetadata(
    {
      title: TITLE,
      description: DESCRIPTION,
      openGraph: {
        type: "website",
        title: TITLE,
        description: DESCRIPTION,
        siteName: siteConfig.name,
        images: [],
      },
      twitter: {
        card: "summary",
        title: TITLE,
        description: DESCRIPTION,
        images: [],
      },
    },
    market,
    "/about/newsroom/blog"
  );
  const url = siteUrl + blogPageHref(market, filters, filters.page);
  return {
    ...metadata,
    alternates: { canonical: url, languages: undefined },
    openGraph: { ...metadata.openGraph, url },
  };
}
export default async function BlogIndexPage({ params, searchParams }: Props) {
  const { market } = await params;
  assertMarket(market);
  const filters = readBlogFilters(await searchParams);
  return (
    <main style={{ background: "#fff", minHeight: "100vh", overflowX: "clip" }}>
      <ScrollReveal />
      <SoftwareNavbar />
      <Suspense
        key={JSON.stringify([market, filters])}
        fallback={
          <div
            style={{ maxWidth: 1180, margin: "32px auto", padding: "0 28px" }}
          >
            <ContentState state="loading" />
          </div>
        }
      >
        <BlogResults market={market} filters={filters} />
      </Suspense>
      <NewsroomSubscribe />
      <AboutPillarNav current="newsroom" />
      <Footer />
    </main>
  );
}

async function BlogResults({
  market,
  filters,
}: {
  market: CountryCode;
  filters: BlogFilters;
}) {
  const resource = await loadCmsResource(() =>
    listBlogs(
      market,
      filters.page,
      12,
      filters.q,
      filters.tag,
      filters.featured
    )
  );
  if (resource.status === "unavailable")
    return (
      <div style={{ maxWidth: 1180, margin: "32px auto", padding: "0 28px" }}>
        <h1 style={{ color: "#16294b", marginBottom: 24 }}>Locator Blog</h1>
        <ContentState state="unavailable" href={newsroomHref(market)} />
      </div>
    );
  const result = resource.data;
  const url = siteUrl + blogPageHref(market, filters, filters.page);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": url + "#blog",
        name: "LOCATOR Blog",
        description: DESCRIPTION,
        url,
        inLanguage: countries[market].locale,
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteUrl,
        },
        blogPost: result.items.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          ...(post.banner ? { image: absoluteImage(post.banner.src) } : {}),
          url: siteUrl + blogHref(market, post.slug),
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: "Home", item: siteUrl + countryPath("/", market) },
          { name: "Newsroom", item: siteUrl + newsroomHref(market) },
          { name: "Blog", item: siteUrl + blogBase(market) },
        ].map((item, i) => ({ "@type": "ListItem", position: i + 1, ...item })),
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <BlogListing
        market={market}
        posts={result.items}
        pagination={result.pagination}
        filters={filters}
      />
    </>
  );
}
