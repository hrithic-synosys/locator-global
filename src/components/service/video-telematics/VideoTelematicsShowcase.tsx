import ContentIcon from "@/components/common/ContentIcon";
import Image from "next/image";

import { sharedVideoTelematics } from "@/content/pages/video-telematics/shared";
import type { VideoTelematicsContent } from "@/content/pages/video-telematics/schema";

export default function VideoTelematicsShowcase({
  content = sharedVideoTelematics.showcase,
}: {
  content?: VideoTelematicsContent["showcase"];
}) {
  const FEATURES = content.order.map((id) => ({ ...content.items[id], id }));

  return (
    <>
      <style>{`
        .vts-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: clamp(32px,5vw,64px); align-items: center; }
        @media (max-width: 900px) { .vts-grid { grid-template-columns: 1fr; } }
        @media (max-width: 900px) { .vts-grid > div:last-child { order: -1; } }
        /* One card per line, at every width. Two columns squeezed the body copy
           into a ~200px measure that broke short sentences over five or six
           lines; full-width rows give each description two or three instead. */
        .vts-feature-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        /* The card carries the full feature copy here, not just a label — this is
           the destination page, so there is nowhere further to send the reader for
           the rest of the sentence. Icon aligns to the top of the text block rather
           than to the card's centre, which is where it belongs once the body runs
           to several lines. */
        .vts-fcard {
          background: #ffffff; border: 1px solid #e8edf3; border-radius: 16px;
          padding: 16px; display: flex; align-items: flex-start; gap: 12px;
        }
        .vts-fcard-icon { flex-shrink: 0; width: 36px; height: 36px; border-radius: 10px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; }
        .vts-fcard-body { min-width: 0; }
        .vts-fcard-title { display: block; font-size: var(--f-13); font-weight: 700; color: #1d1d1f; line-height: 1.3; }
        .vts-fcard-desc { margin: 6px 0 0; font-size: var(--f-12-5); line-height: 1.55; color: #6e6e73; }
        .vts-browser {
          border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;
          box-shadow: 0 30px 60px -24px rgba(20,40,90,.3);
        }
        .vts-browser-bar { height: 34px; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; padding: 0 12px; gap: 6px; }
      `}</style>

      {/* id is the landing target for the Video Telematics feature cards on the
          home page — they link straight to this section, not just to the route.

          The offset has to CANCEL the section's own top padding, not add to it.
          A flat 84px landed the section's top edge below the 64px navbar and the
          padding then pushed the eyebrow ~100px further down, so arriving here
          opened on a band of empty background with the cards below the fold.
          Subtracting the same padding back out lands the eyebrow a fixed 24px
          under the navbar at every width, whatever the clamp resolves to, and
          the section's normal in-flow spacing is untouched. */}
      <section
        id="video-telematics"
        style={{
          padding: "clamp(56px,7vw,80px) 28px",
          background: "#f5f7fa",
          scrollMarginTop: "calc(88px - clamp(56px,7vw,80px))",
        }}
      >
        <div
          className="vts-grid"
          style={{ maxWidth: "var(--w-1180)", margin: "0 auto" }}
        >
          <div data-reveal="left">
            <span
              style={{
                fontSize: "var(--f-13)",
                fontWeight: 700,
                color: "#1360ee",
                textTransform: "uppercase",
                letterSpacing: ".05em",
                marginBottom: "18px",
                display: "block",
              }}
            >
              {content.eyebrow}
            </span>
            <h2
              style={{
                fontSize: "max(clamp(24px,3vw,36px), min(2.500vw, 52.2px))",
                fontWeight: 800,
                lineHeight: 1.15,
                color: "#1d1d1f",
                margin: "0 0 16px",
              }}
            >
              {content.heading}
            </h2>
            {content.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                style={{
                  fontSize:
                    "max(clamp(13px,1.2vw,15px), min(1.042vw, 21.75px))",
                  lineHeight: 1.65,
                  color: "#6e6e73",
                  margin: "0 0 28px",
                  maxWidth: 440,
                }}
              >
                {paragraph}
              </p>
            ))}

            {content.subheading && (
              <h3
                style={{
                  fontSize: "max(clamp(15px,1.4vw,18px), min(1.250vw, 26.1px))",
                  fontWeight: 700,
                  color: "#1d1d1f",
                  margin: "0 0 10px",
                }}
              >
                {content.subheading}
              </h3>
            )}
            {content.secondaryParagraphs.map((paragraph, index) => (
              <p
                key={index}
                style={{
                  fontSize: "max(clamp(12px,1.1vw,14px), min(0.972vw, 20.3px))",
                  lineHeight: 1.6,
                  color: "#6e6e73",
                  margin: "0 0 24px",
                  maxWidth: 440,
                }}
              >
                {paragraph}
              </p>
            ))}

            <div className="vts-feature-grid">
              {FEATURES.map((f) => (
                <div key={f.id} className="vts-fcard">
                  <span className="vts-fcard-icon">
                    {<ContentIcon name={f.icon} />}
                  </span>
                  <div className="vts-fcard-body">
                    <span className="vts-fcard-title">{f.title}</span>
                    <p className="vts-fcard-desc">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal="right">
            <div className="vts-browser">
              <div className="vts-browser-bar">
                {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                  <span
                    key={c}
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: c,
                      display: "inline-block",
                    }}
                  />
                ))}
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: "var(--f-11)",
                    color: "#94a3b8",
                  }}
                >
                  mylocatorplus.com/video
                </span>
              </div>
              <Image
                src={content.image}
                alt={content.imageAlt}
                width={1598}
                height={984}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
