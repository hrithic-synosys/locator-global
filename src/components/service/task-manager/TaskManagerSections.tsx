import Image from "next/image";
import Link from "@/components/country/CountryLink";
import {
  ClipboardCheck,
  Clock3,
  Camera,
  ChartNoAxesCombined,
  Monitor,
  Smartphone,
} from "lucide-react";
import type {
  TaskCards,
  TaskManagerContent,
} from "@/content/pages/task-manager/schema";

const icons: Record<string, typeof ClipboardCheck> = {
  assignment: ClipboardCheck,
  progress: Clock3,
  proof: Camera,
  visibility: ChartNoAxesCombined,
};

/** Styles are scoped to the new service sections; Software's demo is unchanged. */
export function TaskManagerSectionStyles() {
  return (
    <style>{`
    .tms-section { padding: clamp(52px,6vw,88px) 28px; scroll-margin-top: 88px; }
    .tms-tint { background: #f5f8fd; }
    .tms-inner { max-width: var(--w-1180); margin: 0 auto; }
    .tms-header { max-width: 760px; margin: 0 auto 36px; text-align: center; }
    .tms-heading { margin: 0; color: #1d1d1f; font-size: clamp(24px,2.5vw,36px); font-weight: 800; line-height: 1.2; letter-spacing: -.025em; }
    .tms-description { margin: 16px 0 0; color: #6e6e73; font-size: var(--f-15); line-height: 1.75; }
    .tms-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 20px; }
    .tms-card { padding: clamp(24px,3vw,36px); border: 1px solid #e3e9f2; border-radius: 20px; background: #fff; min-width: 0; }
    .tms-icon { width: 46px; height: 46px; border-radius: 13px; display: grid; place-items: center; color: #1360ee; background: #edf4ff; margin-bottom: 20px; }
    .tms-card h3, .tms-item h3 { font-size: var(--f-18); line-height: 1.3; font-weight: 750; color: #1d1d1f; margin: 0; }
    .tms-card .tms-description { margin-top: 10px; }
    .tms-tools { display: grid; grid-template-columns: minmax(0,.8fr) minmax(0,1.3fr); align-items: center; gap: clamp(28px,4vw,56px); }
    .tms-tool { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 28px; }
    .tms-tool svg { flex-shrink: 0; color: #1360ee; margin-top: 3px; }
    .tms-tool .tms-description { margin-top: 8px; }
    .tms-photo { display: block; width: 100%; height: auto; border-radius: 18px; border: 1px solid #e2e8f0; box-shadow: 0 20px 45px -28px rgba(20,40,90,.3); }
    .tms-link { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; padding: 13px 24px; color: #fff; background: #1360ee; text-decoration: none; font-weight: 700; font-size: var(--f-14); transition: background .2s; }
    .tms-link:hover { background: #0d4fd4; }
    .tms-industry-layout { display: grid; grid-template-columns: minmax(0,.9fr) minmax(0,1.1fr); align-items: center; gap: clamp(28px,4vw,56px); }
    .tms-items { display: grid; gap: 22px; }
    .tms-item { padding-left: 20px; border-left: 3px solid #dce9ff; }
    .tms-item .tms-description { margin-top: 7px; }
    .tms-link:focus-visible { outline: 3px solid #1360ee; outline-offset: 4px; }
    @media(max-width: 900px) { .tms-tools, .tms-industry-layout { grid-template-columns: 1fr; } }
    @media(max-width: 600px) { .tms-section { padding: 48px 22px; } .tms-grid { grid-template-columns: 1fr; gap: 14px; } .tms-header { margin-bottom: 28px; } .tms-card { padding: 24px; } }
    @media(prefers-reduced-motion: reduce) { .tms-link { transition: none; } }
  `}</style>
  );
}

function Heading({
  content,
}: {
  content: Pick<TaskCards, "heading" | "paragraphs">;
}) {
  return (
    <header className="tms-header" data-reveal>
      <h2 className="tms-heading">{content.heading}</h2>
      {content.paragraphs.map((text) => (
        <p key={text} className="tms-description">
          {text}
        </p>
      ))}
    </header>
  );
}

export function TaskManagerBenefits({ content }: { content: TaskCards }) {
  return (
    <section id="task-benefits" className="tms-section tms-tint">
      <div className="tms-inner">
        <Heading content={content} />
        <div className="tms-grid">
          {content.order.map((id) => {
            const card = content.items[id],
              Icon = icons[id] ?? ClipboardCheck;
            return (
              <article key={id} className="tms-card" data-reveal>
                <span className="tms-icon">
                  <Icon size={23} aria-hidden="true" />
                </span>
                <h3>{card.title}</h3>
                <p className="tms-description">{card.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function TaskManagerTools({
  content,
}: {
  content: TaskManagerContent["tools"];
}) {
  return (
    <section id="task-tools" className="tms-section">
      <div className="tms-inner">
        <Heading content={content} />
        <div className="tms-tools">
          <div data-reveal="left">
            {content.order.map((id) => {
              const card = content.items[id],
                Icon = id === "app" ? Smartphone : Monitor;
              return (
                <article key={id} className="tms-tool">
                  <Icon size={26} aria-hidden="true" />
                  <div>
                    <h3
                      className="tms-heading"
                      style={{ fontSize: "var(--f-18)" }}
                    >
                      {card.title}
                    </h3>
                    <p className="tms-description">{card.description}</p>
                  </div>
                </article>
              );
            })}
            <Link href={content.cta.href} className="tms-link">
              {content.cta.label}
            </Link>
          </div>
          <div data-reveal="right">
            <Image
              className="tms-photo"
              src={content.image}
              alt={content.imageAlt}
              width={content.imageW}
              height={content.imageH}
              sizes="(max-width: 900px) 100vw, 60vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function TaskManagerIndustries({
  content,
}: {
  content: TaskManagerContent["industries"];
}) {
  return (
    <section id="task-industries" className="tms-section tms-tint">
      <div className="tms-inner">
        <Heading content={content} />
        <div className="tms-industry-layout">
          <div data-reveal="left">
            <Image
              className="tms-photo"
              src={content.image}
              alt={content.imageAlt}
              width={content.imageW}
              height={content.imageH}
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </div>
          <div className="tms-items" data-reveal="right">
            {content.order.map((id) => (
              <article key={id} className="tms-item">
                <h3>{content.items[id].title}</h3>
                <p className="tms-description">
                  {content.items[id].description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
