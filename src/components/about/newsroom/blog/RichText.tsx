import Link from "next/link";
import type { ReactNode } from "react";
import { contentHref } from "@/lib/cms-blog/urls";

import type { CountryCode } from "@/config/countries";

type Node = { tag: string; href?: string; children: Node[] } | { text: string };

const VOID = new Set(["br"]);
const KEEP = new Set(["a", "b", "strong", "i", "em", "br", "sup", "sub"]);

const TOKEN = /<(\/?)([a-z][a-z0-9]*)(\s[^<>]*?)?\s*\/?>/gi;

function decode(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function parse(html: string): Node[] {
  const root: Node = { tag: "#root", children: [] };
  const stack: Extract<Node, { tag: string }>[] = [
    root as Extract<Node, { tag: string }>,
  ];
  const top = () => stack[stack.length - 1];
  const push = (n: Node) => top().children.push(n);

  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(html))) {
    const text = html.slice(last, m.index);
    if (text) push({ text: decode(text) });
    last = TOKEN.lastIndex;

    const closing = m[1] === "/";
    const tag = m[2].toLowerCase();
    if (!KEEP.has(tag)) {
      push({ text: decode(m[0]) });
      continue;
    }
    if (VOID.has(tag)) {
      push({ tag, children: [] });
      continue;
    }
    if (closing) {
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === tag) {
          stack.length = i;
          break;
        }
      }
      continue;
    }
    const attribute = (m[3] || "").match(
      /(?:^|\s)href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i
    );
    const href = attribute && (attribute[1] ?? attribute[2] ?? attribute[3]);
    const node: Extract<Node, { tag: string }> = { tag, children: [] };
    if (href) node.href = decode(href);
    push(node);
    stack.push(node);
  }
  const tail = html.slice(last);
  if (tail) push({ text: decode(tail) });
  return (root as Extract<Node, { tag: string }>).children;
}

function render(nodes: Node[], market: CountryCode): ReactNode {
  return nodes.map((n, i) => {
    if ("text" in n) return n.text;
    const kids = render(n.children, market);
    switch (n.tag) {
      case "br":
        return <br key={i} />;
      case "b":
      case "strong":
        return <strong key={i}>{kids}</strong>;
      case "i":
      case "em":
        return <em key={i}>{kids}</em>;
      case "sup":
        return <sup key={i}>{kids}</sup>;
      case "sub":
        return <sub key={i}>{kids}</sub>;
      case "a": {
        const href = contentHref(n.href ?? "", market);
        if (!href) return <span key={i}>{kids}</span>;
        if (href.startsWith("/")) {
          return (
            <Link key={i} href={href} className="ba-link">
              {kids}
            </Link>
          );
        }
        const offsite = /^https?:\/\//i.test(href);
        return (
          <a
            key={i}
            href={href}
            className="ba-link"
            {...(offsite
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {kids}
          </a>
        );
      }
      default:
        return <span key={i}>{kids}</span>;
    }
  });
}

export default function RichText({ html, market = "global" }: { html: string; market?: CountryCode }) {
  return <>{render(parse(html), market)}</>;
}
