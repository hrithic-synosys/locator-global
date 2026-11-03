"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "@/components/country/CountryLink";
import type { ServiceJourneyContent } from "@/content/page-schema";

export default function VideoTelematicsJourney({
  content,
  id = 'video-in-action',
  navigationLabel = 'Video telematics journey',
}: {
  content: ServiceJourneyContent;
  id?: string;
  navigationLabel?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(content.order[0]);
  const active = content.items[activeId] || content.items[content.order[0]];
  useEffect(() => {
    const cards = root.current?.querySelectorAll<HTMLElement>(
      "[data-journey-step]"
    );
    if (!cards || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible)
          setActiveId((visible.target as HTMLElement).dataset.journeyStep!);
      },
      { rootMargin: "-15% 0px -35% 0px", threshold: [0, 0.3, 0.6] }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [content.order]);
  const select = (id: string) => {
    setActiveId(id);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    Array.from(
      root.current?.querySelectorAll<HTMLElement>("[data-journey-step]") || []
    )
      .find((card) => card.dataset.journeyStep === id)
      ?.scrollIntoView({
        block: "center",
        behavior: reduced ? "auto" : "smooth",
      });
  };
  return (
    <section
      ref={root}
      className="vt-journey"
      id={id}
      data-page-section="journeySteps"
    >
      <style href="vt-journey" precedence="medium">{`
      .vt-journey { padding:clamp(48px,6vw,88px) 28px; background:#f5f8fd; }
      .vt-journey-inner { max-width:var(--w-1180); margin:auto; }
      .vt-journey h2 { font-size:clamp(26px,3vw,38px); line-height:1.2; color:#1d1d1f; margin:0 0 32px; }
      .vt-journey-intro { max-width:72ch; margin:0 0 32px; font-size:16px; line-height:1.75; color:#64748b; }
      .vt-journey-layout { display:grid; grid-template-columns:1.15fr 1fr; gap:clamp(28px,5vw,70px); align-items:start; }
      .vt-journey-preview { position:sticky; top:100px; padding:22px; border:1px solid #dce5f3; background:white; border-radius:20px; }
      .vt-journey-preview img { width:100%; height:auto; aspect-ratio:16/10; object-fit:contain; display:block; }
      .vt-journey-preview h3 { font-size:22px; line-height:1.4; margin:18px 0; color:#1d1d1f; }
      .vt-journey-preview nav { display:flex; gap:10px; flex-wrap:wrap; }
      .vt-journey-preview button { font:inherit; padding:10px 15px; color:#1360ee; background:#eef4ff; border:1px solid #dce5f3; border-radius:8px; cursor:pointer; }
      .vt-journey-preview button[aria-current=true] { color:white; background:#1360ee; }
      .vt-journey-step { min-height:30vh; padding:32px 24px; border-left:3px solid #dce5f3; margin:0 0 20px; }
      .vt-journey-step[data-active=true] { border-color:#1360ee; background:#eef4ff; border-radius:0 14px 14px 0; }
      .vt-journey-step>span { color:#1360ee; font-size:14px; font-weight:750; }
      .vt-journey-step h3 { font-size:24px; line-height:1.3; color:#1d1d1f; margin:12px 0; }
      .vt-journey-step p { line-height:1.8; color:#64748b; margin:0; }
      .vt-journey-cta { display:inline-flex; border-radius:10px; background:#1360ee; color:#fff; padding:13px 22px; margin-top:24px; text-decoration:none; font-weight:700; }
      @keyframes vtJourneyIn { from { opacity:.3; transform:translateY(12px); } to { opacity:1; transform:none; } }
      .vt-journey-frame { animation:vtJourneyIn .4s ease both; }
      @media(max-width:800px) { .vt-journey-layout { grid-template-columns:1fr; } .vt-journey-preview { position:relative; top:auto; } .vt-journey-step { min-height:0; } }
      @media(prefers-reduced-motion:reduce) { .vt-journey-frame { animation:none; } }
    `}</style>
      <div className="vt-journey-inner">
        <h2>{content.heading}</h2>
        {content.paragraphs.map((p, i) => (
          <p key={i} className="vt-journey-intro">{p}</p>
        ))}
        <div className="vt-journey-layout">
          <div className="vt-journey-preview">
            <div key={activeId} className="vt-journey-frame">
              {active.image && (
                <Image
                  src={active.image}
                  alt=""
                  width={1600}
                  height={1000}
                  sizes="(max-width:800px) 90vw, 50vw"
                />
              )}
              <h3 aria-live="polite">{active.title}</h3>
            </div>
            <nav aria-label={navigationLabel}>
              {content.order.map((id, i) => (
                <button
                  key={id}
                  type="button"
                  aria-current={id === activeId}
                  aria-label={`Show step ${i + 1}: ${content.items[id].title}`}
                  onClick={() => select(id)}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </nav>
            <Link className="vt-journey-cta" href={content.cta.href}>
              {content.cta.label}
            </Link>
          </div>
          <div>
            {content.order.map((id, i) => {
              const item = content.items[id];
              return (
                <article
                  key={id}
                  className="vt-journey-step"
                  data-journey-step={id}
                  data-active={activeId === id}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
