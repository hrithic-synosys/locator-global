"use client";

/* eslint-disable @next/next/no-img-element -- Preserve the CMS renderer and arbitrary validated CMS media URLs. */
import Link from "next/link";
import { contentHref, blogBase, blogHref } from "@/lib/cms-blog/urls";
import RichText from "./RichText";
import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import type {
  ArticleAuthor,
  ArticleSummary,
  BlogBlock,
  ImageData,
  RelatedArticle,
  TextBlock,
  TableData,
} from "@/lib/cms-blog/types";

const EASE = "cubic-bezier(.22,.61,.36,1)";
const CHECK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E")`;

import type { CountryCode } from "@/config/countries";
import { countryPath } from "@/lib/country/paths";
import { createContext, useContext } from "react";
const MarketContext = createContext<CountryCode>("global");

function Chevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function SummaryArt({ icon }: { icon: NonNullable<ArticleSummary["icon"]> }) {
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg
      className="ba-sum-art"
      width="92"
      height="72"
      viewBox="0 0 92 72"
      aria-hidden="true"
    >
      {icon === "truck" && (
        <g {...p}>
          <path d="M30 18h34v28H30zM64 28h12l8 9v9H64z" />
          <circle cx="42" cy="50" r="6" />
          <circle cx="74" cy="50" r="6" />
          <path d="M6 24h16M2 33h20M10 42h12" />
        </g>
      )}
      {icon === "pin" && (
        <g {...p}>
          <path d="M46 60s-18-16-18-32a18 18 0 0 1 36 0c0 16-18 32-18 32z" />
          <circle cx="46" cy="28" r="6" />
        </g>
      )}
      {icon === "chart" && (
        <g {...p}>
          <path d="M16 60V12M16 60h62" />
          <path d="M26 48l14-14 10 8 22-24" />
        </g>
      )}
    </svg>
  );
}

function decode(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}
function Inline({ html }: { html: string }) {
  const market = useContext(MarketContext);
  return <RichText html={html} market={market} />;
}

function plainText(value: string) {
  return decode(value.replace(/<[^>]+>/g, "")).trim();
}

function slugify(value: string) {
  return (
    plainText(value)
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

export function prepareBlocks(blocks: BlogBlock[]) {
  const used = new Set<string>();
  const toc: Array<{ id: string; label: string }> = [];

  const unique = (candidate: string, fallback: string) => {
    const base = slugify(candidate) || fallback;
    let id = base;
    let n = 2;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);
    return id;
  };

  const prepareText = (block: TextBlock, path: string): TextBlock => {
    if (block.type !== "heading") return block;
    const label = block.tocLabel || plainText(block.html);
    const id = unique(block.anchor || label, `section-${path}`);
    if (block.level === 2 && !block.hideFromToc) toc.push({ id, label });
    return { ...block, anchor: id };
  };

  const prepared = blocks.map((block, index): BlogBlock => {
    const path = String(index);
    switch (block.type) {
      case "heading":
      case "p":
      case "quote":
      case "ul":
      case "ol":
        return prepareText(block, path);
      case "overlay":
      case "split":
        return {
          ...block,
          blocks: block.blocks.map((child, childIndex) =>
            prepareText(child, `${path}-${childIndex}`)
          ),
        };
      default:
        return block;
    }
  });

  return { blocks: prepared, toc };
}

function ImageFigure({
  image,
  className = "ba-figure",
}: {
  image: ImageData;
  className?: string;
}) {
  if (!image.src) {
    return (
      <div className={`${className} ba-empty-media`}></div>
    );
  }
  return (
    <figure className={className}>
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="ba-img"
      />
      {image.caption && (
        <figcaption className="ba-caption">{image.caption}</figcaption>
      )}
    </figure>
  );
}

function Table({ table }: { table: TableData }) {
  return (
    <div className="ba-table-scroll">
      <table className="ba-table">
        {table.caption && (
          <caption className="ba-table-caption">{table.caption}</caption>
        )}
        {table.head.length > 0 && (
          <thead>
            <tr>
              {table.head.map((cell, index) => (
                <th key={index} scope="col">
                  <Inline html={cell} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  <Inline html={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TextBlockView({ block }: { block: TextBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 2 ? (
        <h2 id={block.anchor} className="ba-h2">
          <Inline html={block.html} />
        </h2>
      ) : (
        <h3 id={block.anchor} className="ba-h3">
          <Inline html={block.html} />
        </h3>
      );
    case "p":
      return (
        <p className="ba-p">
          <Inline html={block.html} />
        </p>
      );
    case "quote":
      return (
        <blockquote className="ba-quote">
          <Inline html={block.html} />
          {block.cite && <cite className="ba-cite">{block.cite}</cite>}
        </blockquote>
      );
    case "ul":
      return (
        <ul
          className={`ba-list${block.style === "check" ? " ba-list--check" : ""}`}
        >
          {block.items.map((item, index) => (
            <li key={index}>
              <Inline html={item} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="ba-olist">
          {block.items.map((item, index) => (
            <li key={index}>
              <Inline html={item} />
            </li>
          ))}
        </ol>
      );
  }
}

function TextBlocks({ blocks }: { blocks: TextBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <TextBlockView
          key={block._key || `${block.type}-${index}`}
          block={block}
        />
      ))}
    </>
  );
}

function ContentBlock({ block }: { block: BlogBlock }) {
  const market = useContext(MarketContext);
  switch (block.type) {
    case "heading":
    case "p":
    case "quote":
    case "ul":
    case "ol":
      return <TextBlockView block={block} />;
    case "image":
      return <ImageFigure image={block.image} />;
    case "table":
      return <Table table={block} />;
    case "overlay":
      return (
        <section className="ba-ov" data-align={block.align}>
          {block.image.src ? (
            <img
              src={block.image.src}
              alt={block.image.alt}
              width={block.image.width}
              height={block.image.height}
              className="ba-ov-img"
            />
          ) : (
            <div className="ba-empty-bg">Image not uploaded</div>
          )}
          <div className="ba-ov-body ba-dark">
            {block.kicker && (
              <span className="ba-sec-kicker">{block.kicker}</span>
            )}
            <TextBlocks blocks={block.blocks} />
            {block.cta && (
              <a
                href={contentHref(block.cta.href, market) || "#"}
                className="ba-btn ba-btn--solid"
              >
                {block.cta.label}
              </a>
            )}
          </div>
        </section>
      );
    case "split":
      return (
        <section
          className="ba-split"
          data-media={block.mediaSide}
          data-tone={block.tone ?? "plain"}
        >
          <div className="ba-split-copy">
            {block.kicker && (
              <span className="ba-sec-kicker">{block.kicker}</span>
            )}
            <TextBlocks blocks={block.blocks} />
          </div>
          <div className="ba-split-media">
            {block.media.kind === "image" ? (
              <ImageFigure
                image={block.media.image}
                className="ba-split-figure"
              />
            ) : (
              <Table table={block.media.table} />
            )}
          </div>
        </section>
      );
  }
}

function formatDate(iso?: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

function Share({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const links = [
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="ba-share">
      <span className="ba-share-label">Share article</span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="ba-share-btn"
          aria-label={link.label}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            {link.label === "Share on LinkedIn" && (
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452z" />
            )}
            {link.label === "Share on Facebook" && (
              <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z" />
            )}
            {link.label === "Share on X" && (
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            )}
          </svg>
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className="ba-share-btn"
        aria-label={copied ? "Link copied" : "Copy link"}
      >
        {copied ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
            <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
          </svg>
        )}
      </button>
      <span className="ba-sr" role="status" aria-live="polite">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}

function PreviewSidebar({
  toc,
  related,
  showThumbs,
}: {
  toc: Array<{ id: string; label: string }>;
  related: RelatedArticle[];
  showThumbs: boolean;
}) {
  const market = useContext(MarketContext);
  const [active, setActive] = useState(toc[0]?.id ?? "");

  useEffect(() => {
    if (!toc.length) return;
    let raf = 0;
    const calculate = () => {
      raf = 0;
      let current = toc[0].id;
      for (const item of toc) {
        const element = document.getElementById(item.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= 140) current = item.id;
        else break;
      }
      setActive(current);
    };
    calculate();
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(calculate);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [toc]);

  function go(event: MouseEvent, id: string) {
    const element = document.getElementById(id);
    if (!element) return;
    event.preventDefault();
    element.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    history.replaceState(null, "", `#${id}`);
    setActive(id);
  }

  return (
    <aside className="ba-side" aria-label="Article navigation">
      <div className="ba-side-inner">
        {toc.length > 0 && (
          <nav className="ba-card ba-toc" aria-label="On this page">
            <h2 className="ba-card-title">On this page</h2>
            <ol className="ba-toc-list">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => go(event, item.id)}
                    className="ba-toc-link"
                    aria-current={active === item.id ? "location" : undefined}
                  >
                    <i aria-hidden="true" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        {related.length > 0 && (
          <section className="ba-card ba-rel" aria-label="Related articles">
            <div className="ba-rel-head">
              <h2 className="ba-card-title">Related articles</h2>
              <Link href={blogBase(market)} className="ba-rel-all">
                View all →
              </Link>
            </div>
            <ul className="ba-rel-list">
              {related.map((article) => (
                <li key={article.id}>
                  <Link
                    href={blogHref(market, article.slug)}
                    className="ba-rel-item"
                    data-thumb={showThumbs && article.banner ? "yes" : "no"}
                  >
                    {showThumbs && article.banner && (
                      <span className="ba-rel-thumb">
                        <img src={article.banner.src} alt={article.banner.alt} width={article.banner.width} height={article.banner.height} />
                      </span>
                    )}
                    <span className="ba-rel-text">
                      <span className="ba-rel-cat">
                        {article.category?.name || "Article"}
                      </span>
                      <span className="ba-rel-title">{article.title}</span>
                      <span className="ba-rel-date">
                        {formatDate(article.publishedAt)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </aside>
  );
}

type PreviewProps = {
  market: CountryCode;
  url: string;
  title: string;
  excerpt: string;
  coverImage: ImageData | null;
  content: BlogBlock[];
  format: string;
  author?: ArticleAuthor | null;
  summary?: ArticleSummary | null;
  relatedArticles?: RelatedArticle[];
  categoryName?: string;
  publishedAt?: string | null;
  readingMinutes?: number;
};

export default function BlogArticle({
  market,
  url,
  title,
  excerpt,
  coverImage,
  content,
  format,
  author,
  summary,
  relatedArticles = [],
  categoryName,
  publishedAt,
  readingMinutes,
}: PreviewProps) {
  const { blocks, toc } = useMemo(() => prepareBlocks(content), [content]);
  const banner = coverImage?.src ? coverImage : null;
  const safeAuthor = author?.name ? author : null;

  return (
    <MarketContext.Provider value={market}><article className="ba">
      <style href="cms-locator-blog-preview-v3" precedence="medium">{`
        .ba { background:#fff; color:#0b1220; }
        .ba * { box-sizing:border-box; }
        .ba-sr { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
        .ba-crumbs-bar { border-bottom:1px solid #eef1f7; }
        .ba-crumbs { display:flex;align-items:center;gap:8px;flex-wrap:wrap;max-width:1180px;margin:0 auto;padding:14px 28px;font-size:13px;color:#6e6e73; }
        .ba-crumbs a { color:#1d1d1f;font-weight:600;text-decoration:none; }.ba-crumbs a:hover{color:#1360ee}.ba-crumbs svg{color:#b8bcc4;flex-shrink:0}.ba-crumbs .cur{color:#1360ee;min-width:0;max-width:min(52ch,100%);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .ba-layout { max-width:1180px;margin:0 auto;padding:clamp(18px,2.4vw,30px) 28px clamp(48px,6vw,80px);display:grid;grid-template-columns:minmax(0,1fr) 296px;gap:clamp(24px,3vw,44px);align-items:start; }
        .ba-main{min-width:0}@media(max-width:1020px){.ba-layout{grid-template-columns:minmax(0,1fr)}}
        .ba-hero{position:relative;display:flex;align-items:center;overflow:hidden;border-radius:14px;min-height:clamp(240px,27vw,310px);background:#0b2a55;color:#fff}.ba-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:right center}.ba-hero::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,22,50,.92) 0%,rgba(8,22,50,.62) 52%,rgba(8,22,50,0) 100%)}.ba-hero-body{position:relative;z-index:2;max-width:62%;padding:clamp(20px,3vw,38px)}@media(max-width:700px){.ba-hero{align-items:flex-end}.ba-hero::after{background:linear-gradient(0deg,rgba(8,22,50,.95) 0%,rgba(8,22,50,.55) 70%,rgba(8,22,50,.1) 100%)}.ba-hero-body{max-width:100%}}
        .ba-kicker{display:block;margin-bottom:10px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#1360ee}.ba-hero .ba-kicker{color:#9cc2ff}.ba-h1{margin:0 0 12px;font-size:clamp(26px,3.3vw,42px);font-weight:800;line-height:1.12;letter-spacing:-.026em;color:#0b1220}.ba-hero .ba-h1{color:#fff}.ba-excerpt{margin:0;font-size:15.5px;line-height:1.65;color:#5b6474;max-width:62ch}.ba-hero .ba-excerpt{color:rgba(255,255,255,.88);font-size:14.5px}.ba-head-plain{padding:clamp(6px,1vw,14px) 0 4px}
        .ba-by{display:flex;align-items:center;gap:clamp(12px,1.8vw,22px);flex-wrap:wrap;margin:clamp(18px,2.2vw,26px) 0;padding-bottom:clamp(16px,2vw,22px);border-bottom:1px dashed #dde3ee}.ba-by-who{display:flex;align-items:center;gap:12px}.ba-avatar{width:46px;height:46px;border-radius:50%;object-fit:cover;flex-shrink:0;background:#eef3fb}.ba-by-name{font-size:13px;color:#4b5464;line-height:1.3}.ba-by-name b{color:#1360ee;font-weight:700}.ba-by-role{display:block;font-size:12px;color:#8a93a4}.ba-by-meta{display:flex;align-items:center;gap:clamp(12px,1.6vw,20px);font-size:13px;color:#6b7484}.ba-by-meta i{width:1px;height:22px;background:#dde3ee}.ba-share{margin-left:auto;display:flex;align-items:center;gap:8px;position:relative}.ba-share-label{font-size:12px;color:#8a93a4;margin-right:4px}.ba-share-btn{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;border:0;background:#e7effd;color:#1360ee;cursor:pointer;text-decoration:none;font-size:15px;font-weight:700;transition:background .18s ${EASE},color .18s ${EASE}}.ba-share-btn:hover{background:#1360ee;color:#fff}.ba-share-btn:focus-visible,.ba-toc-link:focus-visible,.ba-rel-item:focus-visible,.ba-btn:focus-visible{outline:2px solid #1360ee;outline-offset:2px}@media(max-width:700px){.ba-share{margin-left:0;width:100%}}
        .ba-sum{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:clamp(14px,2vw,24px);margin:0 0 clamp(24px,3vw,36px);padding:clamp(18px,2.2vw,26px);background:#eaf2fe;border:1px solid #d9e6fb;border-radius:14px}.ba-sum-ico{width:52px;height:52px;border-radius:50%;background:#d6e5fd;color:#1360ee;display:grid;place-items:center}.ba-sum-title{margin:0 0 6px;font-size:16px;font-weight:780;color:#0b1220}.ba-sum-text{margin:0;font-size:13.5px;line-height:1.7;color:#4b5464}.ba-sum-art{color:#1360ee;opacity:.85}@media(max-width:700px){.ba-sum{grid-template-columns:auto minmax(0,1fr)}.ba-sum-art{display:none}}
        .ba-main>:is(.ba-h2,.ba-h3,.ba-p,.ba-list,.ba-olist,.ba-quote){max-width:760px}.ba-p{margin:0 0 18px;font-size:16px;line-height:1.8;color:#4b5464}.ba-h2{margin:clamp(30px,3.2vw,42px) 0 12px;font-size:clamp(20px,2vw,27px);font-weight:790;line-height:1.28;letter-spacing:-.02em;color:#0b1220;scroll-margin-top:104px}.ba-h3{margin:clamp(22px,2.4vw,30px) 0 10px;font-size:clamp(16px,1.45vw,20px);font-weight:760;line-height:1.35;color:#16233a;scroll-margin-top:104px}.ba-link{color:#1360ee;font-weight:600;text-decoration:none}.ba-link:hover{text-decoration:underline}
        .ba-list,.ba-olist{margin:0 0 18px;padding:0;list-style:none;display:flex;flex-direction:column;gap:9px}.ba-list>li,.ba-olist>li{position:relative;padding-left:26px;font-size:16px;line-height:1.7;color:#4b5464}.ba-list>li::before{content:'';position:absolute;left:7px;top:.72em;width:6px;height:6px;border-radius:50%;background:#1360ee}.ba-list--check>li{padding-left:30px;font-size:14.5px}.ba-list--check>li::before{left:0;top:.2em;width:18px;height:18px;background:#1360ee ${CHECK} center/11px no-repeat}.ba-olist{counter-reset:ba-ol}.ba-olist>li{counter-increment:ba-ol;padding-left:32px}.ba-olist>li::before{content:counter(ba-ol)'.';position:absolute;left:0;top:0;color:#1360ee;font-weight:700;font-variant-numeric:tabular-nums}.ba-quote{margin:0 0 22px;padding:4px 0 4px 20px;border-left:3px solid #1360ee;font-size:16px;line-height:1.7;color:#16233a;font-style:italic}.ba-cite{display:block;margin-top:6px;font-size:13px;font-style:normal;color:#8a93a4}
        .ba-figure{margin:clamp(20px,2.6vw,30px) 0}.ba-img{display:block;width:100%;height:auto;border-radius:12px;background:#f4f7fd}.ba-caption{margin-top:8px;font-size:12px;color:#8a93a4}.ba-empty-media{min-height:180px;display:grid;place-items:center;border:1px dashed #d9e2ef;border-radius:12px;background:#f8faff;color:#8a93a4;font-size:13px}.ba-empty-bg{position:absolute;inset:0;display:grid;place-items:center;color:#9cc2ff;background:#0b2a55;font-size:13px}
        .ba-table-scroll{margin:clamp(18px,2.2vw,28px) 0;overflow-x:auto;border:1px solid #d9e6fb;border-radius:10px;background:#fff}.ba-table{width:100%;border-collapse:collapse}.ba-table th,.ba-table td{text-align:left;padding:11px 14px;border-bottom:1px solid #e7ecf6;font-size:13px;line-height:1.55;color:#4b5464;vertical-align:top}.ba-table th{background:#e7effd;color:#0b1220;font-weight:750}.ba-table td:first-child{color:#16233a;font-weight:500}.ba-table tbody tr:last-child td{border-bottom:0}.ba-table th+th,.ba-table td+td{border-left:1px solid #e7ecf6}.ba-table-caption{caption-side:top;text-align:left;padding:10px 14px;font-size:12px;color:#8a93a4}.ba-split-media .ba-table-scroll{margin:0}
        .ba-sec-kicker{display:block;margin-bottom:8px;font-size:12px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#1360ee}.ba-ov{position:relative;display:flex;align-items:center;overflow:hidden;border-radius:12px;margin:clamp(20px,2.6vw,30px) 0;min-height:clamp(200px,22vw,250px);background:#0b2a55}.ba-ov-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.ba-ov::after{content:'';position:absolute;inset:0;background:linear-gradient(270deg,rgba(9,30,66,.97) 0%,rgba(9,30,66,.92) 44%,rgba(9,30,66,.1) 100%)}.ba-ov[data-align='left']::after{background:linear-gradient(90deg,rgba(9,30,66,.97) 0%,rgba(9,30,66,.92) 44%,rgba(9,30,66,.1) 100%)}.ba-ov-body{position:relative;z-index:2;width:52%;padding:clamp(20px,2.8vw,34px)}.ba-ov[data-align='right'] .ba-ov-body{margin-left:auto}@media(max-width:700px){.ba-ov,.ba-ov[data-align='left']{align-items:flex-end}.ba-ov::after,.ba-ov[data-align='left']::after{background:linear-gradient(0deg,rgba(9,30,66,.96) 0%,rgba(9,30,66,.8) 65%,rgba(9,30,66,.2) 100%)}.ba-ov-body{width:100%;margin-left:0!important;padding-top:110px}}.ba-dark .ba-sec-kicker{color:#8fbaff}.ba-dark .ba-h2{margin:0 0 10px;color:#fff;font-size:clamp(21px,2.2vw,30px)}.ba-dark .ba-h3{color:#fff}.ba-dark .ba-p,.ba-dark .ba-list>li,.ba-dark .ba-olist>li,.ba-dark .ba-quote{color:rgba(255,255,255,.88);font-size:14.5px}.ba-dark .ba-p{margin-bottom:14px}.ba-dark .ba-link{color:#9cc2ff}.ba-dark .ba-quote{border-color:#8fbaff}.ba-btn{display:inline-flex;align-items:center;text-decoration:none;font-size:13.5px;font-weight:700;padding:12px 22px;border-radius:10px;transition:transform .18s ${EASE},background .18s ${EASE}}.ba-btn--solid{background:#1360ee;color:#fff}.ba-btn--solid:hover{background:#0f4fc4;transform:translateY(-1px)}
        .ba-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(20px,3vw,40px);align-items:center;margin:clamp(20px,2.6vw,30px) 0;border-radius:12px}.ba-split[data-tone='tint']{background:#f0f5fe;padding:clamp(18px,2.4vw,30px)}.ba-split[data-media='left'] .ba-split-media{order:-1}.ba-split-copy>:last-child{margin-bottom:0}.ba-split-copy .ba-h2{margin-top:0}.ba-split-figure{margin:0}.ba-split-figure .ba-img{max-height:340px;width:100%;object-fit:cover}.ba-split :is(.ba-h2,.ba-h3,.ba-p,.ba-list,.ba-olist,.ba-quote){max-width:none}.ba-split .ba-p{font-size:14.5px;line-height:1.7}@media(max-width:800px){.ba-split{grid-template-columns:1fr}.ba-split[data-media='left'] .ba-split-media{order:0}}
        .ba-side{min-width:0;align-self:stretch}.ba-side-inner{position:sticky;top:96px;display:flex;flex-direction:column;gap:16px;max-height:calc(100vh - 112px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;padding-bottom:2px}@media(max-width:1020px){.ba-side-inner{position:static;max-height:none;overflow:visible}}.ba-card{background:#fff;border:1px solid #e7ecf6;border-radius:12px;padding:18px}.ba-card-title{margin:0;font-size:15.5px;font-weight:780;color:#0b1220}.ba-toc-list{list-style:none;margin:14px 0 0;padding:0;position:relative}.ba-toc-list::before{content:'';position:absolute;left:4px;top:10px;bottom:10px;width:1px;background:#e2e8f3}.ba-toc-link{position:relative;display:flex;align-items:flex-start;gap:12px;padding:7px 0;font-size:13px;line-height:1.4;color:#8a93a4;text-decoration:none;transition:color .18s ${EASE}}.ba-toc-link i{position:relative;z-index:1;flex-shrink:0;width:9px;height:9px;margin-top:4px;border-radius:50%;background:#d5dbe6;transition:background .18s ${EASE},box-shadow .18s ${EASE}}.ba-toc-link:hover{color:#1360ee}.ba-toc-link[aria-current='location']{color:#1360ee;font-weight:600}.ba-toc-link[aria-current='location'] i{background:#1360ee;box-shadow:0 0 0 3px #d6e5fd}.ba-rel-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:14px}.ba-rel-all{font-size:12px;font-weight:700;color:#1360ee;text-decoration:none;white-space:nowrap}.ba-rel-all:hover{text-decoration:underline}.ba-rel-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px}.ba-rel-item{display:flex;gap:12px;text-decoration:none;align-items:flex-start}.ba-rel-thumb{position:relative;flex-shrink:0;width:64px;height:64px;border-radius:8px;overflow:hidden;background:#eef3fb}.ba-rel-thumb img{width:100%;height:100%;object-fit:cover}.ba-rel-text{display:flex;flex-direction:column;gap:3px;min-width:0}.ba-rel-cat{font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#1360ee}.ba-rel-title{font-size:13px;font-weight:650;line-height:1.35;color:#0b1220}.ba-rel-item:hover .ba-rel-title{color:#1360ee}.ba-rel-date{font-size:12px;color:#97a1b3}@media(prefers-reduced-motion:reduce){.ba *{transition:none!important}}
      `}</style>

      <div className="ba-crumbs-bar">
        <nav className="ba-crumbs" aria-label="Breadcrumb">
          <Link href={countryPath("/", market)}>Homepage</Link>
          <Chevron />
          <Link href={blogBase(market)}>Blog</Link>
          <Chevron />
          <span className="cur" aria-current="page">
            {title}
          </span>
        </nav>
      </div>

      <div className="ba-layout">
        <div className="ba-main">
          {banner ? (
            <header className="ba-hero">
              <img src={banner.src} alt={banner.alt} width={banner.width} height={banner.height} className="ba-hero-img" />
              <div className="ba-hero-body">
                <span className="ba-kicker">{categoryName || format}</span>
                <h1 className="ba-h1">{title}</h1>
                <p className="ba-excerpt">{excerpt}</p>
              </div>
            </header>
          ) : (
            <header className="ba-head-plain">
              <span className="ba-kicker">{categoryName || format}</span>
              <h1 className="ba-h1">{title}</h1>
              <p className="ba-excerpt">{excerpt}</p>
            </header>
          )}

          <div className="ba-by">
            {safeAuthor ? (
              <div className="ba-by-who">
                {safeAuthor.avatar?.src && (
                  <img
                    src={safeAuthor.avatar.src}
                    alt={safeAuthor.avatar.alt || safeAuthor.name}
                    width={46}
                    height={46}
                    className="ba-avatar"
                  />
                )}
                <p className="ba-by-name" style={{ margin: 0 }}>
                  By <b>{safeAuthor.name}</b>
                  {safeAuthor.role && (
                    <span className="ba-by-role">{safeAuthor.role}</span>
                  )}
                </p>
              </div>
            ) : null}
            <div className="ba-by-meta">
              <i aria-hidden="true" />
              <time dateTime={publishedAt || undefined}>
                {formatDate(publishedAt)}
              </time>
              {readingMinutes ? (
                <>
                  <i aria-hidden="true" />
                  <span>{readingMinutes} min read</span>
                </>
              ) : null}
            </div>
            <Share title={title} url={url} />
          </div>

          {summary && (
            <section className="ba-sum" aria-label="Summary">
              <span className="ba-sum-ico" aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                  <path d="M14 3v5h5M9 13h6M9 17h6" />
                </svg>
              </span>
              <div>
                <h2 className="ba-sum-title">
                  {summary.heading || "Blog Summary"}
                </h2>
                <p className="ba-sum-text">{summary.text}</p>
              </div>
              <SummaryArt icon={summary.icon || "truck"} />
            </section>
          )}

          {blocks.map((block, index) => (
            <ContentBlock
              key={block._key || `${block.type}-${index}`}
              block={block}
            />
          ))}
        </div>

        <PreviewSidebar
          toc={toc}
          related={relatedArticles}
          showThumbs={Boolean(banner)}
        />
      </div>
    </article></MarketContext.Provider>
  );
}
