import BlogCards from "./BlogCards";
import { teaserBlogs } from "@/lib/cms-blog/teasers";
import { blogHref } from "@/lib/cms-blog/urls";
export default async function BlogSection({ market }) {
  const result = await teaserBlogs(market, 2);
  const posts = result.items.map((p) => {
    const date = new Date(p.publishedAt);
    return {
      day: String(date.getUTCDate()).padStart(2, "0"),
      month: date.toLocaleDateString("en-US", {
        month: "short",
        timeZone: "UTC",
      }),
      category: p.category.name,
      readTime: p.readingMinutes + " min read",
      title: p.title,
      excerpt: p.excerpt,
      image: p.banner?.src,
      alt: p.banner?.alt,
      href: blogHref(market, p.slug),
    };
  });
  return <BlogCards posts={posts} unavailable={result.unavailable} />;
}
