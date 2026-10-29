import type { Metadata } from "next";
import type { CmsDetail } from "./types";
import { blogBase, blogHref, newsroomHref } from "./urls";
import { countries } from "../../config/countries";
import { canIndex } from "../../config/indexing";
import { countryPath } from "../country/paths";
import { siteConfig, siteUrl } from "../../config/site";
import { CmsPayloadError } from "./validation";
export const publicArticleUrl = (market: CmsDetail["market"], slug: string) =>
  new URL(blogHref(market, slug), siteUrl).href;
export const absoluteImage = (url: string) => new URL(url, siteUrl).href;
/** Mismatched canonicals need editorial review, rather than silent rewriting. */
export function articleCanonical(post: CmsDetail): string {
  const expected = publicArticleUrl(post.market, post.slug);
  if (post.seo.canonicalUrl && post.seo.canonicalUrl !== expected)
    throw new CmsPayloadError();
  return expected;
}
export function articleMetadata(post: CmsDetail): Metadata {
  const url = articleCanonical(post),
    title = post.seo.title || post.title,
    description = post.seo.description || post.excerpt;
  const image = post.seo.ogImage || post.banner?.src;
  const images = image
    ? [
        {
          url: absoluteImage(image),
          ...(post.banner && !post.seo.ogImage
            ? {
                width: post.banner.width,
                height: post.banner.height,
                alt: post.banner.alt,
              }
            : {}),
        },
      ]
    : [];
  const ready = canIndex(
    post.market,
    blogHref(post.market, post.slug).slice(countries[post.market].prefix.length)
  );
  return {
    title,
    description,
    keywords: post.seo.keywords,
    alternates: { canonical: url, languages: undefined },
    robots: {
      index: ready,
      follow: true,
      googleBot: { index: ready, follow: true },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: countries[post.market].locale.replace("-", "_"),
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      ...(post.author ? { authors: [post.author.name] } : {}),
      tags: post.seo.keywords,
      images,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: images.map((i) => i.url),
    },
  };
}
export function articleJsonLd(post: CmsDetail) {
  const url = articleCanonical(post),
    image = post.seo.ogImage || post.banner?.src;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": url + "#article",
        headline: post.title,
        description: post.seo.description || post.excerpt,
        ...(image ? { image: [absoluteImage(image)] } : {}),
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        inLanguage: countries[post.market].locale,
        keywords: post.seo.keywords.join(", "),
        articleSection: post.category.name,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        ...(post.author
          ? { author: { "@type": "Person", name: post.author.name } }
          : {}),
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteUrl,
          logo: { "@type": "ImageObject", url: siteUrl + "/brand/logo.png" },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: "Home", item: siteUrl + countryPath("/", post.market) },
          { name: "Newsroom", item: siteUrl + newsroomHref(post.market) },
          { name: "Blog", item: siteUrl + blogBase(post.market) },
          { name: post.title, item: url },
        ].map((item, i) => ({ "@type": "ListItem", position: i + 1, ...item })),
      },
    ],
  };
}
