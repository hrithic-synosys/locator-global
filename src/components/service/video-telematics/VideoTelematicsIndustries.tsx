"use client";

import { useState } from "react";
import Image from "next/image";

const EASE = "cubic-bezier(.22,.61,.36,1)";

// Real AI-dashcam screenshots from the client — each has its own REC/HUD
// overlay baked in (timestamp, resolution badge, detection boxes), so the
// image uses object-fit: contain rather than cover — nothing gets cropped.

import { sharedVideoTelematics } from "@/content/pages/video-telematics/shared";
import type { VideoTelematicsContent } from "@/content/pages/video-telematics/schema";

export default function VideoTelematicsIndustries({
  content = sharedVideoTelematics.industries,
}: {
  content?: VideoTelematicsContent["industries"];
}) {
  const INDUSTRIES = content.order.map((id) => ({ ...content.items[id], id }));

  const [active, setActive] = useState(0);

  return (
    <>
      <style>{`
        .vti-rail {
          display: flex; gap: clamp(8px,1vw,12px);
          height: clamp(420px,46vw,560px);
        }

        /* Panel is a column: media zone on top, text zone below it in normal
           flow — never stacked/overlaid, so the text can't cover the photo. */
        .vti-panel {
          position: relative; overflow: hidden;
          display: flex; flex-direction: column;
          flex: 1 1 0; min-width: 0;
          border: 0; padding: 0; cursor: pointer;
          border-radius: clamp(18px,2vw,24px);
          background: #0d1426;
          font-family: inherit; text-align: left;
          transition: flex-grow .62s ${EASE}, box-shadow .5s ${EASE};
          box-shadow: 0 18px 40px -26px rgba(13,20,38,.5);
        }
        /* The open panel takes the space; the rest stay as slim spines. */
        .vti-panel[aria-expanded="true"] {
          flex-grow: 5.4;
          box-shadow: 0 40px 80px -34px rgba(13,20,38,.62);
        }

        /* Media zone — shrinks automatically as the text row below it grows,
           so the two never overlap regardless of expanded/collapsed state. */
        .vti-media { position: relative; flex: 1 1 auto; min-height: 0; overflow: hidden; }

        /* Real CCTV/dashcam screenshots carry their own REC/timestamp/detection
           overlay baked into the frame — contain (not cover) so none of that
           ever gets cropped off, whatever the panel's current size. */
        .vti-panel img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: contain;
          transition: transform .7s ${EASE}, filter .5s ${EASE};
        }
        /* Flat scrim, not a gradient — solid tint for legibility. */
        .vti-veil {
          position: absolute; inset: 0;
          background: rgba(9,14,28,.55);
          transition: background .5s ${EASE};
        }
        /* Text no longer sits on the photo, so the expanded veil can stay
           almost off — the shot reads bright and clear. */
        .vti-panel[aria-expanded="true"] .vti-veil { background: rgba(9,14,28,.08); }
        .vti-panel[aria-expanded="false"]:hover img { transform: scale(1.06); }

        /* Accent bar marks the open panel. */
        .vti-panel::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: 0;
          height: 3px; background: #1360ee;
          transform: scaleX(0); transform-origin: left;
          transition: transform .5s ${EASE}; z-index: 3;
        }
        .vti-panel[aria-expanded="true"]::after { transform: scaleX(1); }

        /* ── Collapsed: vertical spine label, over the media zone only ── */
        .vti-spine {
          position: absolute; inset: 0; z-index: 2;
          display: flex; align-items: center; justify-content: center;
          writing-mode: vertical-rl; transform: rotate(180deg);
          padding: 26px 0;
          font-size: max(clamp(13px,1.25vw,16px), min(1.111vw, 23.2px)); font-weight: 800;
          letter-spacing: .1em; text-transform: uppercase; color: #fff;
          white-space: nowrap; overflow: hidden;
          /* Holds the label off bright patches of the photo. */
          text-shadow: 0 2px 12px rgba(9,14,28,.85), 0 1px 3px rgba(9,14,28,.7);
          transition: opacity .34s ${EASE};
        }
        .vti-panel[aria-expanded="true"] .vti-spine { opacity: 0; pointer-events: none; }

        /* ── Expanded: solid text row below the photo, own space, own
           background — nothing translucent, nothing overlapping. ── */
        .vti-body {
          flex: 0 0 auto; position: relative; z-index: 2;
          max-height: 0; opacity: 0; overflow: hidden;
          padding: 0 clamp(20px,2.2vw,28px);
          background: #0a0f1e;
          border-top: 1px solid rgba(255,255,255,.08);
          transition: max-height .5s ${EASE}, opacity .4s ${EASE}, padding .5s ${EASE};
        }
        .vti-panel[aria-expanded="true"] .vti-body {
          max-height: 280px; opacity: 1;
          padding: clamp(18px,2.2vw,26px) clamp(20px,2.2vw,28px);
        }
        .vti-body h3 {
          margin: 0 0 10px;
          font-size: max(clamp(20px,2.2vw,29px), min(2.014vw, 42.05px)); font-weight: 800;
          letter-spacing: -.02em; line-height: 1.12; color: #fff;
        }
        .vti-body p {
          margin: 0; max-width: 52ch;
          font-size: max(clamp(13px,1.1vw,14.5px), min(1.007vw, 21.02px)); line-height: 1.6;
          color: rgba(255,255,255,.9);
        }

        /* Stack on narrow screens — spines don't work at phone widths. */
        @media (max-width: 860px) {
          .vti-rail { flex-direction: column; height: auto; }
          .vti-panel { flex: 0 0 auto; height: 92px; transition: height .55s ${EASE}; }
          .vti-panel[aria-expanded="true"] { height: 430px; }
          .vti-panel[aria-expanded="true"] .vti-body { max-height: 210px; }
          .vti-spine {
            writing-mode: horizontal-tb; transform: none;
            justify-content: flex-start; padding: 0 24px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vti-panel, .vti-panel img, .vti-veil, .vti-body, .vti-spine, .vti-panel::after {
            transition: none;
          }
        }
      `}</style>

      <section
        style={{ padding: "clamp(56px,7vw,88px) 28px", background: "#fff" }}
      >
        <div style={{ maxWidth: "var(--w-1180)", margin: "0 auto" }}>
          <div
            data-reveal
            style={{
              textAlign: "center",
              maxWidth: "680px",
              margin: "0 auto clamp(36px,5vw,52px)",
            }}
          >
            <span
              style={{
                fontSize: "max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))",
                fontWeight: 800,
                letterSpacing: ".04em",
                color: "#1360ee",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "16px",
              }}
            >
              <span style={{ display: "block", marginBottom: "12px" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "34px",
                    height: "3px",
                    background: "#1360ee",
                    borderRadius: "2px",
                  }}
                />
              </span>
              {content.eyebrow}
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: "max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-.015em",
                color: "#1d1d1f",
              }}
            >
              {content.heading}
            </h2>
            {content.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                style={{
                  margin: "18px 0 0",
                  color: "#6e6e73",
                  lineHeight: 1.75,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="vti-rail" data-reveal>
            {INDUSTRIES.map((ind, i) => (
              <button
                key={ind.id}
                className="vti-panel"
                aria-expanded={i === active}
                aria-label={ind.title}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <div className="vti-media">
                  <Image
                    src={ind.image!}
                    alt=""
                    fill
                    sizes="(max-width: 860px) 100vw, 60vw"
                    style={{ objectFit: "contain" }}
                  />
                  <span className="vti-veil" />
                  <span className="vti-spine">{ind.title}</span>
                </div>

                <div className="vti-body">
                  <h3>{ind.title}</h3>
                  <p>{ind.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
