import Link from "@/components/country/CountryLink";
import { softwareCtaContent } from "@/content/shared/software-cta";
import type { CtaContent } from "@/content/page-schema";

export default function SoftwareCTA({
  content = softwareCtaContent,
}: {
  content?: CtaContent;
}) {
  return (
    <>
      <style>{`
        .cta-btn {
          display: inline-flex; align-items: center; justify-content: center;
          font-family: inherit; font-size: var(--f-14); font-weight: 700;
          padding: 13px 26px; border-radius: 11px;
          text-decoration: none;
          transition: .18s cubic-bezier(.22,.61,.36,1);
          white-space: nowrap;
        }
        .cta-btn-primary {
          background: #1360ee; color: #fff;
          box-shadow: 0 10px 24px rgba(19,96,238,.26);
        }
        .cta-btn-primary:hover { 
          background: #0d4fd4; 
          transform: translateY(-1px); 
          box-shadow: 0 12px 30px rgba(19,96,238,.4); 
        }
        .cta-btn-ghost {
          background: #fff;
          color: #1360ee;
          border: 1.5px solid #e8ecf4;
        }
        .cta-btn-ghost:hover { 
          border-color: #1360ee; 
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(19,96,238,.12);
        }
      `}</style>

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "clamp(56px,7vw,92px) 28px",
          background: "#f7f9fc",
        }}
      >
        {/* Radial gradient decoration */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 460,
            height: 460,
            top: -160,
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(19,96,238,.07), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          data-reveal
          style={{
            position: "relative",
            maxWidth: "820px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {content.eyebrow && (
            <span
              style={{
                display: "block",
                fontSize: "max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))",
                fontWeight: 800,
                letterSpacing: ".04em",
                color: "#1360ee",
                textTransform: "uppercase",
                marginBottom: "20px",
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
          )}
          <h2
            style={{
              margin: 0,
              fontSize: "max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))",
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-.015em",
              color: "#1d1d1f",
            }}
          >
            {content.heading}
            {content.accent && (
              <span style={{ color: "#1360ee" }}>{content.accent}</span>
            )}
          </h2>
          <div
            style={{
              margin: "24px auto",
              height: "4px",
              width: "80px",
              borderRadius: "999px",
              background: "linear-gradient(90deg,#1360ee,#0d4fd4)",
            }}
          />
          {content.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              style={{
                margin: "0 0 32px",
                fontSize: "max(clamp(15px,1.5vw,17px), min(1.181vw, 24.65px))",
                lineHeight: 1.8,
                color: "#52525e",
              }}
            >
              {paragraph}
            </p>
          ))}

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href={content.primaryCta.href}
              className="cta-btn cta-btn-primary"
            >
              {content.primaryCta.label}
            </Link>
            <Link
              href={content.secondaryCta.href}
              className="cta-btn cta-btn-ghost"
            >
              {content.secondaryCta.label}
            </Link>
          </div>

          {/* Trust row */}
          {content.trustItems.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "28px",
                marginTop: "36px",
                flexWrap: "wrap",
              }}
            >
              {content.trustItems.map((text, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    fontSize: "var(--f-12-5)",
                    color: "#6e6e73",
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: "#e8f3ff",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "var(--f-10)",
                      fontWeight: 800,
                      flexShrink: 0,
                      color: "#1360ee",
                    }}
                  >
                    {"✓"}
                  </span>
                  {text}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
