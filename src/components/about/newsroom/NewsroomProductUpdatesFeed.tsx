/* Product Updates on the newsroom board, read from the market's CMS feed. */
import type { CountryCode } from "@/config/countries";
import type { CmsResource } from "@/lib/cms-blog/resource";
import type { ProductUpdateList } from "@/lib/cms-blog/types";
import { newsroomProductUpdateCard } from "@/lib/cms-blog/teasers";
import { NewsroomCard } from "./NewsroomBoard";
import ContentState from "./ContentState";

export const PRODUCT_UPDATES_COPY = {
  loading: "Loading product updates",
  unavailableTitle: "Product updates temporarily unavailable",
  unavailable:
    "We’re having trouble loading product updates right now. Please try again shortly.",
  emptyTitle: "No product updates yet",
  empty:
    "New features and releases will appear here once they are published. Explore the rest of our newsroom in the meantime.",
};

export default async function NewsroomProductUpdatesFeed({
  resource,
  market,
}: {
  resource: Promise<CmsResource<ProductUpdateList>>;
  market: CountryCode;
}) {
  const result = await resource;
  // An outage stays distinct from a market that simply has no updates yet.
  if (result.status === "unavailable")
    return (
      <ContentState
        state="unavailable"
        title={PRODUCT_UPDATES_COPY.unavailableTitle}
        description={PRODUCT_UPDATES_COPY.unavailable}
      />
    );
  const { items } = result.data;
  if (!items.length)
    return (
      <ContentState
        state="empty"
        title={PRODUCT_UPDATES_COPY.emptyTitle}
        description={PRODUCT_UPDATES_COPY.empty}
      />
    );
  // The board header links to the full archive.
  return (
    <div className="nrb-grid" data-market={market}>
      {items.map(newsroomProductUpdateCard).map((item) => (
        <NewsroomCard key={item.id} item={item} />
      ))}
    </div>
  );
}
