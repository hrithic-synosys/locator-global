"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

const EASE = "cubic-bezier(.22,.61,.36,1)";
const BLUE = "#1360ee";

// ── AI driver-monitoring alerts — one heading + one image per slide ──────────

const IMG_SIZES = "(max-width: 800px) 0px, 46vw";

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

import { sharedVideoTelematics } from "@/content/pages/video-telematics/shared";
import type { VideoTelematicsContent } from "@/content/pages/video-telematics/schema";

export default function VideoTelematicsAlertsScroll({
  content = sharedVideoTelematics.driverAlerts,
}: {
  content?: VideoTelematicsContent["driverAlerts"];
}) {
  const ALERTS = useMemo(
    () =>
      content.order.map((id, i) => ({
        ...content.items[id],
        id,
        num: String(i + 1).padStart(2, "0"),
      })),
    [content]
  );
  const N = ALERTS.length;
  const IMAGE_LIST = useMemo(
    () => Array.from(new Set(ALERTS.map((a) => a.image))),
    [ALERTS]
  );
  const wrapRef = useRef<HTMLDivElement>(null);
  const vizPxRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  const [displayIdx, setDisplayIdx] = useState(0);
  const [dirDown, setDirDown] = useState(true);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const markLoaded = (src: string) =>
    setLoaded((l) => (l[src] ? l : { ...l, [src]: true }));

  const idxRef = useRef(0);
  const dirRef = useRef<1 | -1>(1);
  const lastYRef = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    lastYRef.current = window.scrollY;

    const html = document.documentElement;
    const prevSnap = html.style.scrollSnapType;
    html.style.scrollSnapType = "y proximity";

    let raf = 0;
    const apply = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const range = (N - 1) * vh;
      const scrolled = Math.min(Math.max(-rect.top, 0), range);
      const p = range > 0 ? scrolled / range : 0;
      const f = scrolled / vh;
      const idx = Math.min(Math.max(Math.round(f), 0), N - 1);
      const t = clamp01(f - Math.floor(f));

      if (vizPxRef.current)
        vizPxRef.current.style.transform = `translateY(${(t - 0.5) * -26}px)`;
      if (fillRef.current)
        fillRef.current.style.transform = `scaleX(${p.toFixed(4)})`;

      if (idx !== idxRef.current) {
        idxRef.current = idx;
        setDisplayIdx(idx);
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      const nd = y > lastYRef.current ? 1 : -1;
      if (y !== lastYRef.current && nd !== dirRef.current) {
        dirRef.current = nd;
        setDirDown(nd === 1);
      }
      lastYRef.current = y;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      html.style.scrollSnapType = prevSnap;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [N]);

  const alert = ALERTS[displayIdx];

  // Jump straight to a behaviour's anchor — one viewport per alert.
  const jumpTo = (i: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const absTop = wrap.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: Math.max(absTop + i * window.innerHeight, 0),
      behavior: "smooth",
    });
  };

  const handleSkip = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const absTop = wrap.getBoundingClientRect().top + window.scrollY;
    const target =
      dirRef.current < 0
        ? absTop - window.innerHeight - 2
        : absTop + wrap.offsetHeight + 2;
    window.scrollTo({ top: Math.max(target, 0), behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        .vta-strip { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
        .vta-strip::-webkit-scrollbar { display: none; }

        .vta-anchors { position: relative; z-index: 0; margin-top: -100vh; }
        .vta-anchor  { height: 100vh; scroll-snap-align: start; scroll-snap-stop: always; }

        @keyframes vtaShimmer { 0% { background-position: -160% 0; } 100% { background-position: 160% 0; } }
        .vta-skeleton {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(100deg, #e7edf6 30%, #f4f8fd 50%, #e7edf6 70%);
          background-size: 200% 100%;
          animation: vtaShimmer 1.4s ${EASE} infinite;
        }

        .vta-skip {
          position: absolute; z-index: 6;
          right: clamp(16px, 4vw, 40px);
          bottom: clamp(18px, 3vh, 30px);
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 16px; border-radius: 999px;
          font-family: inherit; font-size: var(--f-12-5); font-weight: 700;
          color: #52525e; cursor: pointer;
          background: rgba(255,255,255,.82);
          border: 1px solid rgba(15,23,42,.1);
          -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
          box-shadow: 0 6px 20px rgba(15,23,42,.1);
          transition: color .2s ${EASE}, border-color .2s ${EASE},
                      background .2s ${EASE}, transform .2s ${EASE}, box-shadow .2s ${EASE};
        }
        .vta-skip:hover {
          color: ${BLUE}; border-color: ${BLUE};
          background: #fff; transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(19,96,238,.2);
        }
        .vta-skip svg { transition: transform .2s ${EASE}; }
        .vta-skip:hover svg { transform: translateY(2px); }
        @media (max-width: 520px) {
          .vta-skip { right: 50%; transform: translateX(50%); }
          .vta-skip:hover { transform: translateX(50%) translateY(-1px); }
        }

        @keyframes vtaTextIn { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
        @keyframes vtaVizIn  { from { opacity: 0; transform: translateY(30px) scale(.975); } to { opacity: 1; transform: none; } }
        .vta-text-in { animation: vtaTextIn .62s ${EASE} both; }
        .vta-viz-in  { animation: vtaVizIn  .68s ${EASE} both; }

        .vta-stagger > * { animation: vtaTextIn .55s ${EASE} both; }
        .vta-stagger > *:nth-child(1) { animation-delay: .02s; }
        .vta-stagger > *:nth-child(2) { animation-delay: .07s; }
        .vta-stagger > *:nth-child(3) { animation-delay: .12s; }
        .vta-stagger > *:nth-child(4) { animation-delay: .17s; }
        .vta-stagger > *:nth-child(5) { animation-delay: .22s; }

        /* ── Persistent section heading — centred, with the meta parked to the
           right so it never competes with the title for horizontal space. ── */
        .vta-top {
          position: relative; flex-shrink: 0; text-align: center;
          padding: clamp(16px,2.4vh,26px) clamp(24px,5vw,64px);
          border-bottom: 1px solid rgba(0,0,0,.06);
        }
        .vta-section-h {
          margin: 0 auto; max-width: 40ch;
          font-size: max(clamp(17px,2.1vw,28px), min(1.944vw, 40.6px)); font-weight: 800;
          letter-spacing: -.025em; color: #1d1d1f; line-height: 1.25;
          text-wrap: balance;
        }
        .vta-section-h span { color: ${BLUE}; }
        .vta-intro { max-width: 850px; margin: 14px auto 0; color: #64748b; font-size: clamp(12px,1.1vw,15px); line-height: 1.65; }
        .vta-description { color: #64748b; font-size: clamp(13px,1.2vw,16px); line-height: 1.7; max-width: 50ch; margin: 20px 0 0; }

        .vta-top-meta {
          position: absolute; top: 50%; right: clamp(24px,5vw,64px);
          transform: translateY(-50%);
          display: flex; align-items: center; gap: 14px;
        }
        @media (max-width: 1000px) { .vta-top-meta { display: none; } }

        .vta-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: var(--f-10-5); font-weight: 700; letter-spacing: .13em;
          text-transform: uppercase; color: #8b93a3; margin-bottom: clamp(14px,1.8vw,20px);
        }
        .vta-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%; background: ${BLUE};
          box-shadow: 0 0 0 3px rgba(19,96,238,.16);
        }

        /* ── Display type: outlined numeral + behaviour name ── */
        .vta-display { display: flex; align-items: flex-start; gap: clamp(12px,1.6vw,22px); }
        .vta-big-num {
          font-size: clamp(60px,7.4vw,116px); font-weight: 800; line-height: .82;
          letter-spacing: -.05em; flex-shrink: 0;
          color: transparent;
          -webkit-text-stroke: 1.6px rgba(19,96,238,.4);
          font-variant-numeric: tabular-nums; user-select: none;
        }
        .vta-title {
          margin: 0; padding-top: clamp(2px,.6vw,8px);
          font-size: max(clamp(32px,4.4vw,58px), min(4.028vw, 84.1px));
          font-weight: 800; line-height: 1.02;
          letter-spacing: -.035em; color: #1d1d1f;
        }

        /* ── AI detection HUD over the feed ── */
        .vta-hud { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
        .vta-hud-tag {
          position: absolute; left: 14px; bottom: 14px;
          display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 12px; border-radius: 8px;
          background: rgba(13,20,38,.82);
          -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
          color: #fff; font-size: var(--f-11); font-weight: 700; letter-spacing: .04em;
          white-space: nowrap;
        }
        .vta-hud-live {
          width: 6px; height: 6px; border-radius: 50%; background: #34d399;
          animation: vtaPulse 1.6s ${EASE} infinite;
        }
        @keyframes vtaPulse { 0%,100% { opacity: 1 } 50% { opacity: .25 } }
        @media (max-width: 900px) { .vta-hud-tag { font-size: var(--f-10); padding: 6px 10px; } }

        /* ── Live index rail ── every behaviour listed, active one lit.
           Type and a moving indicator do the work; no chips, no fills. */
        .vta-rail {
          margin-top: clamp(24px,3vw,38px);
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 2px 18px; max-width: 440px;
        }
        .vta-rail-item {
          display: flex; align-items: baseline; gap: 10px;
          padding: 7px 0 7px 12px; position: relative;
          background: none; border: 0; cursor: pointer;
          font-family: inherit; text-align: left;
          transition: color .3s ${EASE}, transform .3s ${EASE};
          color: #9aa2b1;
        }
        /* Left marker grows into a bar on the active row. */
        .vta-rail-item::before {
          content: ''; position: absolute; left: 0; top: 50%;
          width: 2px; height: 0; border-radius: 2px;
          background: ${BLUE}; transform: translateY(-50%);
          transition: height .3s ${EASE};
        }
        .vta-rail-item:hover { color: #4a5262; }
        .vta-rail-item[aria-current="true"] { color: #1d1d1f; transform: translateX(3px); }
        .vta-rail-item[aria-current="true"]::before { height: 70%; }
        .vta-rail-num {
          font-size: var(--f-10-5); font-weight: 700; letter-spacing: .04em;
          font-variant-numeric: tabular-nums; color: inherit; opacity: .55;
        }
        .vta-rail-item[aria-current="true"] .vta-rail-num { color: ${BLUE}; opacity: 1; }
        .vta-rail-name {
          font-size: max(clamp(12.5px,1.15vw,14px), min(0.972vw, 20.3px)); font-weight: 600;
          line-height: 1.35; color: inherit;
        }
        .vta-rail-item[aria-current="true"] .vta-rail-name { font-weight: 800; }
        @media (max-width: 1100px) { .vta-rail { grid-template-columns: 1fr; gap: 0; max-width: 300px; } }

        @media (prefers-reduced-motion: reduce) {
          .vta-text-in, .vta-viz-in, .vta-stagger > * {
            animation: none !important; opacity: 1 !important; transform: none !important;
          }
          .vta-hud-live { animation: none; }
        }

        @media (max-width: 800px) {
          .vta-right-col { display: none !important; }
          .vta-left-col  { width: 100% !important; max-width: 640px !important; }
        }
        @media (max-width: 520px) { .vta-main-body { padding: 0 22px !important; } }
      `}</style>

      <section
        ref={wrapRef}
        id="ai-alerts"
        aria-label="Prevent road incidents with AI-powered dashcam alerts"
        style={{ position: "relative" }}
      >
        {/* Preload every slide image so each appears instantly */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            opacity: 0,
            pointerEvents: "none",
            top: 0,
            left: -9999,
          }}
        >
          {IMAGE_LIST.map((src) => (
            <Image
              key={src}
              src={src}
              alt=""
              width={880}
              height={560}
              sizes={IMG_SIZES}
              loading="eager"
              onLoad={() => markLoaded(src)}
            />
          ))}
        </div>

        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            background:
              "linear-gradient(180deg, #ffffff 0%, #f5f8fd 26%, #eef4fc 60%, #f6f9fd 84%, #ffffff 100%)",
            display: "flex",
            flexDirection: "column",
            isolation: "isolate",
            zIndex: 1,
          }}
        >
          {/* Top bar */}
          <div className="vta-top">
            <h2 className="vta-section-h">
              {content.heading}
              <span>{content.accent}</span>
            </h2>
            {content.paragraphs.map((paragraph, i) => (
              <p key={i} className="vta-intro">
                {paragraph}
              </p>
            ))}

            <div className="vta-top-meta">
              <div
                className="vta-strip"
                style={{ display: "flex", gap: "5px", maxWidth: "210px" }}
              >
                {ALERTS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === displayIdx ? "16px" : "5px",
                      height: "5px",
                      borderRadius: "999px",
                      flexShrink: 0,
                      background: i <= displayIdx ? BLUE : "rgba(15,23,42,.14)",
                      transition: `width .4s ${EASE}, background .4s ${EASE}`,
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  fontSize: "var(--f-13)",
                  fontWeight: 700,
                  color: "#a1a1a6",
                  letterSpacing: ".04em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <span style={{ color: BLUE, fontSize: "var(--f-15)" }}>
                  {alert.num}
                </span>
                <span style={{ margin: "0 4px" }}>/</span>
                {String(N).padStart(2, "0")}
              </div>
            </div>
          </div>

          {/* Body */}
          <div
            className="vta-main-body"
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              alignItems: "center",
              padding: "0 clamp(24px,5vw,64px)",
              gap: "clamp(28px,5vw,80px)",
            }}
          >
            {/* Left — text */}
            <div
              className="vta-left-col"
              style={{
                flex: "0 0 auto",
                width: "min(50%, 540px)",
                position: "relative",
              }}
            >
              <div
                key={displayIdx}
                className="vta-stagger"
                style={{ position: "relative", zIndex: 1 }}
              >
                <div className="vta-eyebrow">
                  <span className="vta-eyebrow-dot" />
                  Detected behaviour
                </div>

                {/* Outlined numeral sits alongside the name — the index becomes
                    part of the display type rather than a label above it. */}
                <div className="vta-display">
                  <span className="vta-big-num" aria-hidden="true">
                    {alert.num}
                  </span>
                  <h3 className="vta-title">
                    {alert.title.split("\n").map((line, i) => (
                      <span key={i} style={{ display: "block" }}>
                        {line}
                      </span>
                    ))}
                  </h3>
                </div>
                {alert.description && (
                  <p className="vta-description">{alert.description}</p>
                )}
              </div>

              {/* Live index — every behaviour visible at once, active one lit.
                  Sits outside the keyed block so it persists instead of
                  re-animating on each slide. */}
              <nav className="vta-rail" aria-label="Driver behaviours">
                {ALERTS.map((a, i) => (
                  <button
                    key={a.id}
                    className="vta-rail-item"
                    aria-current={i === displayIdx}
                    onClick={() => jumpTo(i)}
                  >
                    <span className="vta-rail-num">{a.num}</span>
                    <span className="vta-rail-name">
                      {a.title.replace("\n", " ")}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Right — image */}
            <div
              key={displayIdx}
              className="vta-viz-in vta-right-col"
              style={{ flex: 1, minWidth: 0 }}
            >
              <div ref={vizPxRef} style={{ willChange: "transform" }}>
                <div
                  style={{
                    position: "relative",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow:
                      "0 30px 70px -28px rgba(20,40,90,.24), 0 4px 14px rgba(20,40,90,.06)",
                    background: "#eef3fb",
                  }}
                >
                  {!loaded[alert.image] && (
                    <div className="vta-skeleton" aria-hidden="true" />
                  )}

                  {/* Live label only — the corner-bracket detection frame that
                      used to sit over the shot has been removed. */}
                  <div className="vta-hud" aria-hidden="true">
                    <span className="vta-hud-tag">
                      <span className="vta-hud-live" />
                      {content.detectionLabel || (
                        <>AI Detection · {alert.title.replace("\n", " ")}</>
                      )}
                    </span>
                  </div>
                  <Image
                    src={alert.image}
                    alt={`${alert.title.replace("\n", " ")} — AI dashcam driver monitoring`}
                    width={alert.imageW}
                    height={alert.imageH}
                    sizes={IMG_SIZES}
                    onLoad={() => markLoaded(alert.image)}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      opacity: loaded[alert.image] ? 1 : 0,
                      transition: "opacity .4s " + EASE,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skip */}
          <button
            className="vta-skip"
            onClick={handleSkip}
            aria-label={
              dirDown ? "Skip to next section" : "Skip to previous section"
            }
          >
            Skip section
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline
                points={dirDown ? "6 9 12 15 18 9" : "6 15 12 9 18 15"}
              />
            </svg>
          </button>

          {/* Progress */}
          <div
            style={{
              height: "3px",
              flexShrink: 0,
              background: "rgba(15,23,42,.06)",
            }}
          >
            <div
              ref={fillRef}
              style={{
                height: "100%",
                width: "100%",
                background: BLUE,
                opacity: 0.5,
                transformOrigin: "left center",
                transform: "scaleX(0)",
              }}
            />
          </div>
        </div>

        {/* Snap anchors — one full viewport per alert */}
        <div className="vta-anchors" aria-hidden="true">
          {ALERTS.map((_, i) => (
            <div key={i} className="vta-anchor" />
          ))}
        </div>
      </section>
    </>
  );
}
