"use client";
/* eslint-disable @next/next/no-img-element -- Validated optional CMS media. */
import { useCountryPath } from '@/components/country/CountryProvider';

import BlogStatus from "./about/newsroom/blog/BlogStatus";
import { useEffect, useRef, useState } from "react";

export default function BlogCards({ posts, unavailable }) {
  const countryPath = useCountryPath();
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") { const frame = requestAnimationFrame(() => setVisible(true)); return () => cancelAnimationFrame(frame); }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`bs ${visible ? "bs--on" : ""}`}>

      {/* Dot grid */}
      <div className="bs__dots" aria-hidden="true" />

      {/* Ambient glow orbs */}
      <div className="bs__orb bs__orb--l" aria-hidden="true" />
      <div className="bs__orb bs__orb--r" aria-hidden="true" />

      <div className="bs__wrap">

        {/* ── Header ── */}
        <div className="bs__head">
          <div className="bs__pill">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1C4.79 1 3 2.79 3 5c0 3.19 4 8 4 8s4-4.81 4-8c0-2.21-1.79-4-4-4zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="#1360ee"/>
            </svg>
            Latest Articles
          </div>

          <h2 className="bs__h2">
            From Our Blog&thinsp;
            <em className="bs__h2-em">Latest Feed</em>
          </h2>

          <p className="bs__desc">
            We are right here to share the valuable insights on our area of Expertise.
            We help you to master on managing your <strong>Vehicle &amp; Team</strong>.
          </p>
        </div>

        {/* ── Two-column card row ── */}
        {unavailable && <BlogStatus kind="unavailable" compact showNewsroomLink={false} />}
        {!unavailable && !posts.length && <BlogStatus kind="empty" compact showNewsroomLink={false} />}
        <div className="bs__row">
          {posts.map((post, i) => (
            <BlogCard key={i} post={post} delay={200 + i * 140} visible={visible} />
          ))}
        </div>

        {/* ── CTA ── */}
        <div className={`bs__foot ${visible ? "bs__foot--on" : ""}`}>
          <a href={countryPath("/about/newsroom/blog")} className="bs__btn">
            View All Articles
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
              <path d="M3.5 8.5h10M9.5 4.5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

      </div>

      <style jsx>{`
        /* ──────────────────────────────────────
           SECTION
        ────────────────────────────────────── */
        .bs {
          position: relative;
          width: 100%;
          background: #ffffff;
          padding: var(--s-section-y) var(--s-section-x);
          overflow: hidden;
          isolation: isolate;
        }

        /* Fine dot grid */
        .bs__dots {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            radial-gradient(circle, rgba(10,137,221,0.11) 1px, transparent 1px);
          background-size: 26px 26px;
          opacity: 0.7;
        }

        /* Orbs */
        .bs__orb {
          position: absolute;
          z-index: 0;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(100px);
        }
        .bs__orb--l {
          top: -80px; left: -80px;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(10,137,221,0.10) 0%, transparent 65%);
          animation: bsFloat 10s ease-in-out infinite alternate;
        }
        .bs__orb--r {
          bottom: -100px; right: -80px;
          width: 440px; height: 440px;
          background: radial-gradient(circle, rgba(56,182,255,0.09) 0%, transparent 65%);
          animation: bsFloat 13s ease-in-out infinite alternate-reverse;
        }
        @keyframes bsFloat {
          from { transform: translate(0,0); }
          to   { transform: translate(20px, 16px); }
        }

        /* Container */
        .bs__wrap {
          position: relative;
          z-index: 1;
          /* Was a flat 1100px — see the --w-* token block in globals.css. Only the
             two-up card row widens; .bs__head keeps its 620px measure so the
             centred heading and blurb stay readable over a wider row. */
          max-width: var(--w-narrow);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(44px, 5.5vw, 68px);
        }

        /* ──────────────────────────────────────
           HEADER
        ────────────────────────────────────── */
        .bs__head {
          text-align: center;
          max-width: 620px;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);
        }
        .bs--on .bs__head { opacity: 1; transform: translateY(0); }

        /* Eyebrow pill */
        .bs__pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px 6px 10px;
          border-radius: 50px;
          /* Tint derived from the theme blue, not the old #0a89dd sky accent —
             the label text is already rgb(19,96,238), so the two were slightly
             out of key with each other. Left as a tint rather than made
             transparent-white: this pill sits on a white section, where white
             on white would simply vanish. */
          background: rgba(19,96,238,0.07);
          border: 1px solid rgba(19,96,238,0.15);
          font-size: 11.5px;
          font-weight: 700;
          color: #1360ee;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .bs__h2 {
          font-size: var(--t-display);
          font-weight: 800;
          color: #0b1d35;
          line-height: 1.16;
          letter-spacing: -0.025em;
          margin: 0 0 16px;
          font-style: normal;
        }
        .bs__h2-em {
          font-style: normal;
          background: linear-gradient(110deg, #1360ee 10%, #5b9fff 90%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .bs__desc {
          font-size: var(--t-lead);
          color: #607590;
          line-height: 1.72;
          margin: 0;
        }
        .bs__desc strong { color: #0b1d35; font-weight: 600; }

        /* ──────────────────────────────────────
           ROW
        ────────────────────────────────────── */
        .bs__row {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--s-grid-gap);
        }
        @media (max-width: 680px) {
          .bs__row { grid-template-columns: 1fr; }
        }

        /* ──────────────────────────────────────
           FOOTER / CTA
        ────────────────────────────────────── */
        .bs__foot {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity .7s .55s cubic-bezier(.16,1,.3,1), transform .7s .55s cubic-bezier(.16,1,.3,1);
        }
        .bs__foot--on { opacity: 1; transform: translateY(0); }

        .bs__btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 13px 30px;
          border-radius: 50px;
          background: linear-gradient(130deg, #1360ee 0%, #5b9fff 100%);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-decoration: none;
          box-shadow:
            0 4px 20px rgba(10,137,221,0.32),
            0 1px 4px rgba(10,137,221,0.18);
          transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s, gap .25s;
        }
        .bs__btn:hover {
          transform: translateY(-3px) scale(1.025);
          box-shadow: 0 12px 32px rgba(10,137,221,0.40), 0 2px 8px rgba(10,137,221,0.22);
          gap: 14px;
        }
        .bs__btn:active { transform: translateY(0) scale(.98); }
      `}</style>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   BLOG CARD — vertical, image top, content bottom
══════════════════════════════════════════════════ */
function BlogCard({ post, delay, visible }) {
  const countryPath = useCountryPath();
  return (
    <article
      className={`bc ${visible ? "bc--on" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* ── Image ── */}
      <div
        className="bc__img-wrap"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 2",
          overflow: "hidden",
        }}
      >
        {post.image && <img src={post.image} alt={post.alt || ""} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}} />}

        {/* Directional vignette */}
        <div className="bc__vignette" aria-hidden="true" />

        {/* Date badge */}
        <div className="bc__date">
          <span className="bc__date-n">{post.day}</span>
          <span className="bc__date-m">{post.month}</span>
        </div>

        {/* Category chip floating over image bottom */}
        <div className="bc__cat">{post.category}</div>
      </div>

      {/* ── Body ── */}
      <div className="bc__body">
        {/* Read time */}
        <div className="bc__meta">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <circle cx="6.5" cy="6.5" r="5.5" stroke="#1360ee" strokeWidth="1.3"/>
            <path d="M6.5 4v2.5l1.8 1.3" stroke="#1360ee" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span>{post.readTime}</span>
        </div>

        <h3 className="bc__title">{post.title}</h3>
        <p className="bc__excerpt">{post.excerpt}</p>

        {/* Divider */}
        <div className="bc__rule" aria-hidden="true" />

        {/* Read more */}
        <a href={countryPath(post.href)} className="bc__link">
          <span>Read More</span>
          <span className="bc__arrow">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M2.5 7.5h10M8.5 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </a>
      </div>

      {/* Glow border overlay */}
      <div className="bc__glow" aria-hidden="true" />

      <style jsx>{`
        /* ─────────── CARD SHELL ─────────── */
        .bc {
          position: relative;
          display: flex;
          flex-direction: column;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow:
            0 1px 2px rgba(11,29,53,0.05),
            0 4px 18px rgba(11,29,53,0.07),
            0 0 0 1px rgba(10,137,221,0.06);
          opacity: 0;
          transform: translateY(36px);
          transition:
            opacity  .72s cubic-bezier(.16,1,.3,1),
            transform .72s cubic-bezier(.16,1,.3,1),
            box-shadow .3s ease;
          cursor: pointer;
          /* Ensure equal heights in the row */
          height: 100%;
        }
        .bc--on { opacity: 1; transform: translateY(0); }

        .bc:hover {
          transform: translateY(-7px);
          box-shadow:
            0 20px 50px rgba(10,137,221,0.14),
            0 4px 12px rgba(11,29,53,0.08),
            0 0 0 1.5px rgba(10,137,221,0.18);
        }

        /* ─────────── IMAGE ─────────── */
        /* Layout-critical props (position/aspect-ratio/overflow) are set
           inline on the wrapper so they apply on first paint, before
           styled-jsx hydrates — prevents the fill image from escaping
           its container on hard refresh. */
        .bc__img-wrap {
          background: #c7dcff;
          flex-shrink: 0;
        }
        .bc__img-wrap :global(.bc__img) {
          transition: transform .7s cubic-bezier(.16,1,.3,1);
        }
        .bc:hover .bc__img-wrap :global(.bc__img) {
          transform: scale(1.06);
        }

        /* Bottom vignette so body text reads well */
        .bc__vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 45%,
            rgba(11,29,53,0.18) 100%
          );
          pointer-events: none;
        }

        /* Date badge */
        .bc__date {
          position: absolute;
          top: 14px;
          left: 14px;
          min-width: 46px;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.7);
          border-radius: 10px;
          padding: 7px 9px 5px;
          text-align: center;
          box-shadow: 0 2px 12px rgba(0,0,0,0.10);
          line-height: 1;
        }
        .bc__date-n {
          display: block;
          font-size: 19px;
          font-weight: 800;
          color: #0b1d35;
          letter-spacing: -0.03em;
        }
        .bc__date-m {
          display: block;
          font-size: 9.5px;
          font-weight: 700;
          color: #1360ee;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 3px;
        }

        /* Category chip bottom-left of image */
        .bc__cat {
          position: absolute;
          bottom: 12px;
          left: 14px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgb(19, 96, 238);
          /* Frosted white rather than a solid blue fill. Held at 0.88 rather
             than fully transparent because this sits on photography — below
             about 0.8 the blue text starts losing against a light or busy
             image, and the blur alone will not save it. */
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(8px) saturate(120%);
          -webkit-backdrop-filter: blur(8px) saturate(120%);
          border-radius: 50px;
          padding: 4px 11px;
          border: 1px solid rgba(255,255,255,0.7);
          box-shadow: 0 2px 8px rgba(11,18,32,0.12);
        }

        /* ─────────── BODY ─────────── */
        .bc__body {
          padding: 22px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        /* Read time row */
        .bc__meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #7b91ae;
          font-weight: 500;
        }

        /* Title */
        .bc__title {
          font-size: var(--t-h3);
          font-weight: 700;
          color: #0b1d35;
          line-height: 1.42;
          letter-spacing: -0.015em;
          margin: 0;
          transition: color .2s;
        }
        .bc:hover .bc__title { color: #1360ee; }

        /* Excerpt */
        .bc__excerpt {
          font-size: var(--t-body);
          color: #607590;
          line-height: 1.72;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        /* Divider */
        .bc__rule {
          height: 1px;
          background: linear-gradient(90deg, rgba(10,137,221,0.15), transparent);
          border-radius: 1px;
          margin: 2px 0;
        }

        /* Read more */
        .bc__link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #1360ee;
          text-decoration: none;
          transition: gap .25s cubic-bezier(.16,1,.3,1), color .2s;
          width: fit-content;
        }
        .bc__arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px; height: 26px;
          border-radius: 50%;
          background: rgba(10,137,221,0.09);
          transition: background .25s, transform .3s cubic-bezier(.16,1,.3,1);
        }
        .bc__link:hover { gap: 13px; color: #0b40b8; }
        .bc__link:hover .bc__arrow {
          background: rgba(10,137,221,0.18);
          transform: translateX(3px);
        }

        /* Glow border */
        .bc__glow {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          pointer-events: none;
          border: 1.5px solid transparent;
          transition: border-color .3s;
        }
        .bc:hover .bc__glow { border-color: rgba(10,137,221,0.2); }

        /* Mobile */
        @media (max-width: 400px) {
          .bc__body { padding: 18px 18px 20px; }
        }
      `}</style>
    </article>
  );
}
