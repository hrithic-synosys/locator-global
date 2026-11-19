/* Company News on the newsroom board, read from the market's CMS feed. */
import type { CountryCode } from "@/config/countries";
import type { CmsResource } from "@/lib/cms-blog/resource";
import type { CompanyNewsList } from "@/lib/cms-blog/types";
import { newsroomCompanyNewsCard } from "@/lib/cms-blog/teasers";
import { NewsroomCard } from "./NewsroomBoard";
import ContentState from "./ContentState";

export const COMPANY_NEWS_COPY = {
  loading: "Loading company news",
  unavailableTitle: "Company news temporarily unavailable",
  unavailable:
    "We’re having trouble loading company news right now. Please try again shortly.",
  emptyTitle: "No company news yet",
  empty:
    "Company announcements will appear here once they are published. Explore the rest of our newsroom in the meantime.",
};

export default async function NewsroomCompanyNewsFeed({
  resource,
  market,
}: {
  resource: Promise<CmsResource<CompanyNewsList>>;
  market: CountryCode;
}) {
  const result = await resource;
  // An outage stays distinct from a market that simply has no news yet.
  if (result.status === "unavailable")
    return (
      <ContentState
        state="unavailable"
        title={COMPANY_NEWS_COPY.unavailableTitle}
        description={COMPANY_NEWS_COPY.unavailable}
      />
    );
  const { items } = result.data;
  if (!items.length)
    return (
      <ContentState
        state="empty"
        title={COMPANY_NEWS_COPY.emptyTitle}
        description={COMPANY_NEWS_COPY.empty}
      />
    );
  // The board header links to the full archive.
  return (
    <div className="nrb-grid" data-market={market}>
      {items.map(newsroomCompanyNewsCard).map((item) => (
        <NewsroomCard key={item.id} item={item} />
      ))}
    </div>
  );
}
