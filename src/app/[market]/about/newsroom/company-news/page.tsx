import type { Metadata } from "next";
import { countries, type CountryCode } from "@/config/countries";
import { marketMetadata } from "@/lib/country/metadata";
import { countryPath } from "@/lib/country/paths";
import { listCompanyNews } from "@/lib/cms-blog/client";
import { loadCmsResource } from "@/lib/cms-blog/resource";
import { Suspense } from "react";
import ContentState from "@/components/about/newsroom/ContentState";
import { COMPANY_NEWS_COPY } from "@/components/about/newsroom/NewsroomCompanyNewsFeed";
import {
  assertMarket,
  collectionPageHref,
  companyNewsBase,
  companyNewsHref,
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
const TITLE = "LOCATOR Company News | Announcements & Updates";
const DESCRIPTION =
  "Company announcements, milestones and updates from LOCATOR, the GPS tracking and fleet management company.";
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
      title: { absolute: TITLE },
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
    "/about/newsroom/company-news"
  );
  const url =
    siteUrl + collectionPageHref(market, "company-news", filters, filters.page);
  return {
    ...metadata,
    alternates: { canonical: url, languages: undefined },
    openGraph: { ...metadata.openGraph, url },
  };
}
export default async function CompanyNewsIndexPage({
  params,
  searchParams,
}: Props) {
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
            <ContentState state="loading" title={COMPANY_NEWS_COPY.loading} />
          </div>
        }
      >
        <CompanyNewsResults market={market} filters={filters} />
      </Suspense>
      <NewsroomSubscribe />
      <AboutPillarNav current="newsroom" />
      <Footer />
    </main>
  );
}

async function CompanyNewsResults({
  market,
  filters,
}: {
  market: CountryCode;
  filters: BlogFilters;
}) {
  const resource = await loadCmsResource(() =>
    listCompanyNews(
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
        <h1 style={{ color: "#16294b", marginBottom: 24 }}>
          LOCATOR Company News
        </h1>
        <ContentState
          state="unavailable"
          title={COMPANY_NEWS_COPY.unavailableTitle}
          description={COMPANY_NEWS_COPY.unavailable}
          href={newsroomHref(market)}
        />
      </div>
    );
  const result = resource.data;
  const url =
    siteUrl + collectionPageHref(market, "company-news", filters, filters.page);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": url + "#company-news",
        name: "LOCATOR Company News",
        description: DESCRIPTION,
        url,
        inLanguage: countries[market].locale,
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteUrl,
        },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: result.items.map((post, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "NewsArticle",
              headline: post.title,
              description: post.excerpt,
              datePublished: post.publishedAt,
              ...(post.banner ? { image: absoluteImage(post.banner.src) } : {}),
              url: siteUrl + companyNewsHref(market, post.slug),
            },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: "Home", item: siteUrl + countryPath("/", market) },
          { name: "Newsroom", item: siteUrl + newsroomHref(market) },
          { name: "Company News", item: siteUrl + companyNewsBase(market) },
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
        collection="company-news"
      />
    </>
  );
}
