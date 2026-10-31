import { sharedVideoTelematics } from "@/content/pages/video-telematics/shared";
import type { VideoTelematicsContent } from "@/content/pages/video-telematics/schema";

export default function VideoTelematicsDescription({
  content = sharedVideoTelematics.description,
}: {
  content?: VideoTelematicsContent["description"];
}) {
  const phrases = content.emphasis.filter(Boolean);
  const parts = (text: string) =>
    phrases.reduce<Array<{ text: string; strong: boolean }>>(
      (result, phrase) =>
        result.flatMap((part) =>
          part.strong
            ? [part]
            : part.text.split(phrase).flatMap((text, index) =>
                index
                  ? [
                      { text: phrase, strong: true },
                      { text, strong: false },
                    ]
                  : [{ text, strong: false }]
              )
        ),
      [{ text, strong: false }]
    );
  return (
    <section
      style={{ padding: "clamp(56px,7vw,80px) 28px", background: "#fff" }}
    >
      <div data-reveal style={{ maxWidth: "var(--w-920)", margin: "0 auto" }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            background: "rgba(19,96,238,.10)",
            color: "#1360ee",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <rect x="2.5" y="6" width="15" height="12" rx="2" />
            <path d="M17.5 10l5-3v10l-5-3v-4z" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {content.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              style={{
                margin: 0,
                fontSize: "max(clamp(14px,1.3vw,16px), min(1.111vw, 23.2px))",
                lineHeight: 1.8,
                color: "#6e6e73",
              }}
            >
              {parts(paragraph).map((part, j) =>
                part.strong ? <strong key={j}>{part.text}</strong> : part.text
              )}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
