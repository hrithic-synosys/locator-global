import { marketMetadata } from "@/lib/country/metadata";
import type { CountryCode } from "@/config/countries";
import type { Metadata } from "next";
import ScrollReveal from "@/components/software/ScrollReveal";
import NewsroomHero from "@/components/about/newsroom/NewsroomHero";
import NewsroomTicker from "@/components/about/newsroom/NewsroomTicker";
import NewsroomBoard from "@/components/about/newsroom/NewsroomBoard";
import NewsroomHighlights from "@/components/about/newsroom/NewsroomHighlights";
import NewsroomSubscribe from "@/components/about/newsroom/NewsroomSubscribe";
import AboutPillarNav from "@/components/about/AboutPillarNav";
import Footer from "@/components/layouts/Footer";
import NewsroomVideosAndBlogs from "@/components/about/newsroom/NewsroomVideosAndBlogs";

import { listBlogs, listCompanyNews, listProductUpdates } from "@/lib/cms-blog/client";
import { Suspense } from "react";
import { loadCmsResource } from "@/lib/cms-blog/resource";
import ContentState from "@/components/about/newsroom/ContentState";
import NewsroomBlogFeed from "@/components/about/newsroom/NewsroomBlogFeed";
import NewsroomCompanyNewsFeed, {
  COMPANY_NEWS_COPY,
} from "@/components/about/newsroom/NewsroomCompanyNewsFeed";
import NewsroomProductUpdatesFeed, {
  PRODUCT_UPDATES_COPY,
} from "@/components/about/newsroom/NewsroomProductUpdatesFeed";
import { assertMarket } from "@/lib/cms-blog/urls";
export const dynamic = "force-dynamic";

const pageMetadata: Metadata = {
  title: "Newsroom — About Locator",
  description:
    "Company news, product announcements, and updates from the team building Locator’s AI-powered IoT platform.",
  alternates: { canonical: "/about/newsroom" },
  openGraph: {
    title: "Newsroom | Locator",
    description: "Company news and updates from the Locator team.",
    url: "/about/newsroom",
    type: "website",
  },
};

export default async function AboutNewsroomPage({
  params,
  searchParams,
}: {
  params: Promise<{ market: CountryCode }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { market } = await params;
  assertMarket(market);
  const query = await searchParams;
  const raw = typeof query.blogPage === "string" ? query.blogPage : "";
  const page = /^\d{1,7}$/.test(raw) && Number(raw) > 0 ? Number(raw) : 1;
  const resource = loadCmsResource(() => listBlogs(market, page, 3));
  // Loaded in parallel and streamed separately: a Company News outage or empty
  // feed never blocks the newsroom or its Blog panels.
  const companyNews = loadCmsResource(() => listCompanyNews(market, 1, 6));
  // Same for Product Updates (the board's Product Updates tab).
  const productUpdates = loadCmsResource(() => listProductUpdates(market, 1, 6));
  return (
    <main
      style={{ background: "#ffffff", minHeight: "100vh", overflowX: "clip" }}
    >
      <ScrollReveal />
      <NewsroomHero />
      <NewsroomTicker />
      <NewsroomBoard
        key={`board:${market}`}
        blogPanel={
          <Suspense fallback={<ContentState state="loading" />}>
            <NewsroomBlogFeed
              resource={resource}
              market={market}
              variant="board"
            />
          </Suspense>
        }
        companyNewsPanel={
          <Suspense
            fallback={
              <ContentState state="loading" title={COMPANY_NEWS_COPY.loading} />
            }
          >
            <NewsroomCompanyNewsFeed resource={companyNews} market={market} />
          </Suspense>
        }
        productUpdatesPanel={
          <Suspense
            fallback={
              <ContentState state="loading" title={PRODUCT_UPDATES_COPY.loading} />
            }
          >
            <NewsroomProductUpdatesFeed resource={productUpdates} market={market} />
          </Suspense>
        }
      />
      <NewsroomHighlights />
      <NewsroomVideosAndBlogs
        key={`videos-and-blogs:${market}`}
        market={market}
        blogContent={
          <Suspense fallback={<ContentState state="loading" />}>
            <NewsroomBlogFeed
              resource={resource}
              market={market}
              variant="teasers"
            />
          </Suspense>
        }
      />
      <NewsroomSubscribe />
      <AboutPillarNav current="newsroom" />
      <Footer />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ market: CountryCode }>;
}): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, "/about/newsroom");
}
