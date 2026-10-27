export function blogContentSource(): "api" | "published" {
  const value = process.env.BLOG_CONTENT_SOURCE || "api";
  if (value !== "api" && value !== "published")
    throw new Error("Invalid BLOG_CONTENT_SOURCE configuration");
  return value;
}
