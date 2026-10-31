import ContentIcon from "@/components/common/ContentIcon";
import type { CardSection } from "@/content/page-schema";

export default function VideoTelematicsContentCards({
  content,
  id,
  eyebrow,
}: {
  content: CardSection;
  id: string;
  eyebrow?: string;
}) {
  return (
    <section id={id} className="vt-content-cards" data-page-section={id}>
      <style href="vt-content-cards" precedence="medium">{`
      .vt-content-cards { padding:clamp(48px,6vw,88px) 28px; background:#fff; }
      .vt-content-cards-inner { max-width:var(--w-1180); margin:auto; }
      .vt-content-cards header { max-width:820px; margin:0 auto 36px; text-align:center; }
      .vt-content-cards header>span { color:#1360ee; font-size:14px; font-weight:750; display:block; margin-bottom:14px; }
      .vt-content-cards h2 { color:#1d1d1f; font-size:clamp(24px,3vw,36px); line-height:1.25; margin:0; }
      .vt-content-cards p { color:#64748b; line-height:1.75; margin:14px 0 0; }
      .vt-content-card-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:20px; }
      .vt-content-card { min-width:0; padding:26px; border:1px solid #e4eaf5; border-radius:18px; background:linear-gradient(135deg,#f7faff,#fff); }
      .vt-content-card>span { display:grid; place-items:center; width:40px; height:40px; background:#eaf2ff; border-radius:12px; margin-bottom:18px; }
      .vt-content-card h3 { color:#1d1d1f; font-size:19px; line-height:1.4; margin:0; }
      #why-choose-video .vt-content-card-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
      @media(max-width:900px) { .vt-content-card-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
      @media(max-width:600px) { .vt-content-card-grid,#why-choose-video .vt-content-card-grid { grid-template-columns:1fr; } }
    `}</style>
      <div className="vt-content-cards-inner">
        <header data-reveal>
          {eyebrow && <span>{eyebrow}</span>}
          <h2>{content.heading}</h2>
          {content.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </header>
        <div className="vt-content-card-grid">
          {content.order.map((id) => {
            const item = content.items[id];
            return (
              <article key={id} className="vt-content-card" data-reveal>
                <span>
                  <ContentIcon name={item.icon} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
