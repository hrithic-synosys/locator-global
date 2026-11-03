"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "@/components/country/CountryLink";
import type { ServiceJourneyContent } from "@/content/page-schema";

const SCROLL_LAYOUT = "(min-width: 901px) and (min-height: 761px)";
const NAV_HEIGHT = 64;

export default function HardwareJourney({
  content,
}: {
  content: ServiceJourneyContent;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = content.order.length;

  // One source of truth for desktop selection: the section's scroll position.
  // No wheel interception, snap locking, or competing intersection observers.
  useEffect(() => {
    const root = rootRef.current,
      frame = frameRef.current;
    if (!root || !frame) return;
    const media = window.matchMedia(SCROLL_LAYOUT);
    let raf = 0;
    const measure = () => {
      raf = 0;
      root.dataset.scrollDriven = String(media.matches);
      if (!media.matches) return;
      const range = root.offsetHeight - frame.offsetHeight;
      const progress =
        range > 0
          ? Math.min(
              1,
              Math.max(
                0,
                (NAV_HEIGHT - root.getBoundingClientRect().top) / range
              )
            )
          : 0;
      const next = Math.round(progress * (count - 1));
      setActive((previous) => (previous === next ? previous : next));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, [count]);

  const select = (index: number) => {
    const root = rootRef.current,
      frame = frameRef.current;
    if (!root || !frame) return;
    if (!window.matchMedia(SCROLL_LAYOUT).matches) {
      setActive(index);
      return;
    }
    const start =
      window.scrollY + root.getBoundingClientRect().top - NAV_HEIGHT;
    const range = root.offsetHeight - frame.offsetHeight;
    const fraction = count > 1 ? index / (count - 1) : 0;
    window.scrollTo({
      top: Math.max(0, start + range * fraction),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % count;
    else if (event.key === "ArrowLeft") next = (index - 1 + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    else return;
    event.preventDefault();
    tabsRef.current
      ?.querySelectorAll<HTMLButtonElement>("[role=tab]")
      [next]?.focus({ preventScroll: true });
    select(next);
  };

  return (
    <section
      id="hardware-journey"
      className="hw-journey"
      ref={rootRef}
      style={{ "--hw-count": count } as CSSProperties}
      aria-labelledby="hw-heading"
    >
      <style href="hardware-journey" precedence="medium">{`
        .hw-journey { --hw-ink:#14213b; --hw-blue:#1360ee; background:#f4f7fc; padding:48px 24px; scroll-margin-top:64px; }
        .hw-frame { max-width:var(--w-1180); margin:auto; display:flex; flex-direction:column; gap:24px; }
        .hw-header { position:relative; z-index:1; transform:translateZ(0); display:grid; grid-template-columns:1.05fr 1fr; gap:40px; align-items:end; }
        .hw-header h2 { margin:0; font-size:clamp(27px,2.8vw,39px); line-height:1.15; font-weight:800; letter-spacing:-.03em; color:var(--hw-ink); }
        .hw-header p { margin:0; font-size:15px; line-height:1.75; color:#627087; }
        .hw-tabs { display:grid; grid-template-columns:repeat(var(--hw-count),minmax(0,1fr)); gap:10px; }
        .hw-tab { position:relative; display:flex; align-items:center; gap:12px; padding:15px 14px; border:1px solid #dce4ef; border-radius:12px; background:rgba(255,255,255,.65); text-align:left; font:inherit; color:#647087; cursor:pointer; transition:background .2s,border-color .2s,color .2s; min-width:0; }
        .hw-tab:hover { background:#fff; border-color:#a9c4fa; color:var(--hw-blue); }
        .hw-tab[aria-selected=true] { color:var(--hw-blue); background:#fff; border-color:#99baff; box-shadow:0 5px 16px -10px rgba(19,96,238,.4); }
        .hw-tab-number { flex-shrink:0; display:grid; place-items:center; width:30px; height:30px; border-radius:50%; background:#e9eef6; color:#65758d; font-size:11px; font-weight:800; }
        .hw-tab[aria-selected=true] .hw-tab-number { background:var(--hw-blue); color:#fff; }
        .hw-tab-label { font-size:13px; font-weight:700; line-height:1.4; }
        .hw-scene { background:#fff; border:1px solid #dde6f2; border-radius:22px; overflow:hidden; box-shadow:0 24px 60px -40px rgba(20,40,90,.28); }
        .hw-panels { display:grid; }
        .hw-panel { grid-area:1/1; display:grid; grid-template-columns:1.1fr 1fr; min-width:0; opacity:0; visibility:hidden; pointer-events:none; transform:translateY(8px); transition:opacity .28s ease,transform .28s ease; }
        .hw-panel[data-active=true] { opacity:1; visibility:visible; pointer-events:auto; transform:none; }
        .hw-media { min-height:320px; position:relative; background:radial-gradient(ellipse at 50% 45%,#fff 0%,#edf4ff 100%); }
        .hw-media img { object-fit:contain; padding:clamp(22px,3vw,42px); }
        .hw-copy { padding:clamp(24px,4vw,52px); display:flex; flex-direction:column; justify-content:center; align-items:flex-start; min-width:0; }
        .hw-index { display:block; color:var(--hw-blue); font-size:12px; font-weight:800; letter-spacing:.14em; margin-bottom:18px; }
        .hw-copy h3 { margin:0; color:var(--hw-ink); font-size:clamp(26px,2.5vw,35px); font-weight:800; letter-spacing:-.025em; line-height:1.2; }
        .hw-copy p { color:#627087; font-size:16px; line-height:1.8; margin:18px 0 0; }
        .hw-footer { border-top:1px solid #e8edf5; padding:16px 24px; display:flex; align-items:center; justify-content:space-between; gap:16px; }
        .hw-status { font-size:12px; color:#7f8ba0; font-variant-numeric:tabular-nums; }
        .hw-status b { color:var(--hw-ink); font-size:18px; margin-right:8px; }
        .hw-cta { display:inline-flex; align-items:center; justify-content:center; gap:12px; background:var(--hw-blue); border-radius:999px; color:white; padding:13px 22px; font-size:13px; line-height:1.5; font-weight:700; text-decoration:none; }
        .hw-cta:hover { background:#0d4fd4; }
        .hw-tab:focus-visible,.hw-cta:focus-visible,.hw-panel:focus-visible { outline:3px solid #1360ee; outline-offset:4px; }
        @media(max-width:1280px) { .hw-header { padding-right:60px; } }
        @media(min-width:901px) and (min-height:761px) {
          .hw-journey { padding:0 28px; height:calc(100svh - 64px + (var(--hw-count) - 1) * clamp(240px,46vh,540px)); }
          .hw-frame { position:sticky; top:64px; height:calc(100svh - 64px); padding:32px 0; }
          .hw-scene { flex:1; min-height:0; display:flex; flex-direction:column; }
          .hw-panels { flex:1; min-height:0; }
          .hw-media { min-height:0; }
        }
        @media(max-width:900px),(max-height:760px) {
          .hw-header { grid-template-columns:1fr; gap:16px; }
          .hw-panel { grid-template-columns:1fr 1fr; }
          .hw-copy { padding:28px; }
        }
        @media(max-width:600px) {
          .hw-journey { padding:44px 22px; }
          .hw-frame { gap:22px; }
          .hw-header h2 { font-size:27px; }
          .hw-header p { font-size:14px; line-height:1.75; }
          .hw-tabs { grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
          .hw-tab { padding:12px 10px; gap:9px; }
          .hw-tab-label { font-size:11.5px; }
          .hw-tab-number { width:25px; height:25px; font-size:10px; }
          .hw-panel { grid-template-columns:1fr; }
          .hw-media { min-height:0; height:200px; }
          .hw-media img { padding:22px; }
          .hw-copy { padding:24px; }
          .hw-copy h3 { font-size:26px; }
          .hw-copy p { font-size:14px; line-height:1.75; margin-top:14px; }
          .hw-index { margin-bottom:12px; }
          .hw-footer { padding:16px 20px; }
          .hw-status { display:none; }
          .hw-cta { width:100%; font-size:12px; padding:12px 16px; }
        }
        @media(prefers-reduced-motion:reduce) { .hw-tab,.hw-panel { transition:none; transform:none; } }
      `}</style>
      <noscript>
        <style>{`.hw-journey{height:auto!important;padding:48px 24px!important}.hw-frame{position:static!important;height:auto!important}.hw-tabs{display:none}.hw-panels{gap:20px}.hw-panel{grid-area:auto;opacity:1;visibility:visible;transform:none}`}</style>
      </noscript>
      <div className="hw-frame" ref={frameRef}>
        <header className="hw-header">
          <h2 id="hw-heading">{content.heading}</h2>
          <div>
            {content.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </header>
        <div
          className="hw-tabs"
          role="tablist"
          aria-label="Hardware setup stages"
          ref={tabsRef}
        >
          {content.order.map((id, index) => (
            <button
              key={id}
              type="button"
              role="tab"
              className="hw-tab"
              id={`hw-tab-${id}`}
              aria-controls={`hw-panel-${id}`}
              aria-selected={active === index}
              tabIndex={active === index ? 0 : -1}
              aria-label={`Show step ${index + 1}: ${content.items[id].title}`}
              onClick={() => select(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span className="hw-tab-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="hw-tab-label">{content.items[id].title}</span>
            </button>
          ))}
        </div>
        <div className="hw-scene">
          <div className="hw-panels">
            {content.order.map((id, index) => {
              const item = content.items[id];
              return (
                <div
                  key={id}
                  id={`hw-panel-${id}`}
                  className="hw-panel"
                  role="tabpanel"
                  aria-labelledby={`hw-tab-${id}`}
                  tabIndex={active === index ? 0 : -1}
                  data-journey-step={id}
                  data-active={active === index}
                >
                  <div className="hw-media">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(max-width:600px) 90vw, 50vw"
                      />
                    )}
                  </div>
                  <div className="hw-copy">
                    <span className="hw-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="hw-footer">
            <span className="hw-status" aria-hidden="true">
              <b>{String(active + 1).padStart(2, "0")}</b> /{" "}
              {String(count).padStart(2, "0")}
            </span>
            <Link className="hw-cta" href={content.cta.href}>
              {content.cta.label}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
