import type { CountryCode } from "@/config/countries";
import { loadBlogFeed } from "@/lib/cms-blog/availability";
import { newsroomCard } from "@/lib/cms-blog/teasers";
import ScrollReveal from "@/components/software/ScrollReveal";
import NewsroomBoard from "./NewsroomBoard";
import NewsroomHighlights from "./NewsroomHighlights";
import NewsroomVideosAndBlogs from "./NewsroomVideosAndBlogs";

export default async function NewsroomFeed({
  market,
  page,
}: {
  market: CountryCode;
  page: number;
}) {
  const result = await loadBlogFeed(market, page, 3);
  const unavailable = result.state === "unavailable";
  const blogs = result.state === "ready" ? result.items.map(newsroomCard) : [];
  return (
    <>
      <ScrollReveal />
      <NewsroomBoard
        key={`board:${market}`}
        blogs={blogs}
        blogUnavailable={unavailable}
      />
      <NewsroomHighlights />
      <NewsroomVideosAndBlogs
        key={`videos-and-blogs:${market}`}
        market={market}
        blogs={blogs}
        pagination={result.state === "ready" ? result.pagination : null}
        unavailable={unavailable}
      />
    </>
  );
}
