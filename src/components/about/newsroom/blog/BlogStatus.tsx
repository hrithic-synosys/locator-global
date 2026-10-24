"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "@/components/country/CountryLink";

type Props = {
  kind: "unavailable" | "empty" | "no-results";
  compact?: boolean;
  title?: string;
  description?: string;
  resetHref?: string;
  showNewsroomLink?: boolean;
  headingLevel?: "h1" | "h2";
  onRetry?: () => void;
};

export default function BlogStatus({
  kind,
  compact = false,
  title,
  description,
  resetHref,
  showNewsroomLink = true,
  headingLevel: Heading = "h2",
  onRetry,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const unavailable = kind === "unavailable";
  const heading =
    title ||
    (unavailable
      ? "Articles are temporarily unavailable"
      : kind === "no-results"
        ? "No matching articles"
        : "No articles yet");
  const message =
    description ||
    (unavailable
      ? "We couldn’t load these articles. Please try again in a moment."
      : kind === "no-results"
        ? "Try another search or explore the latest articles."
        : "There are no published articles here yet. Check back soon for our latest insights.");

  function retry() {
    startTransition(() => {
      onRetry?.();
      router.refresh();
    });
  }

  return (
    <section
      className={`cms-blog-state${compact ? " cms-blog-state--compact" : ""}`}
      aria-busy={pending}
    >
      <style href="cms-blog-status" precedence="medium">{`
      .cms-blog-state{width:100%;max-width:760px;margin:0 auto;padding:clamp(28px,5vw,58px);border:1px solid #e1e9f6;border-radius:22px;background:linear-gradient(145deg,#f5f9ff,#fff 72%);text-align:center;color:#0b1220;box-sizing:border-box}
      .cms-blog-state-ico{display:grid;place-items:center;width:64px;height:64px;margin:0 auto 22px;border-radius:18px;background:#e6efff;color:#1360ee}
      .cms-blog-state h1,.cms-blog-state h2{margin:0 0 12px;font-size:clamp(21px,2.5vw,30px);font-weight:750;line-height:1.25;letter-spacing:-.025em;color:#0b1220}
      .cms-blog-state p{max-width:46ch;margin:0 auto;color:#657186;font-size:14px;line-height:1.75}
      .cms-blog-state-actions{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:12px 20px;margin-top:24px}
      .cms-blog-state button,.cms-blog-state a{font:inherit;font-size:13px;font-weight:650;text-decoration:none}
      .cms-blog-state button,.cms-blog-state-primary{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:11px 22px;background:#1360ee;color:#fff!important;border:0;border-radius:10px;cursor:pointer;transition:background .2s ease}
      .cms-blog-state button:hover,.cms-blog-state-primary:hover{background:#0d4fd4}.cms-blog-state button:disabled{opacity:.65;cursor:wait}
      .cms-blog-state a{color:#1360ee}.cms-blog-state a:hover{text-decoration:underline}.cms-blog-state :is(a,button):focus-visible{outline:3px solid #94b9ff;outline-offset:4px}
      .cms-blog-state--compact{max-width:none;padding:28px 22px;border-radius:16px;box-shadow:none}.cms-blog-state--compact .cms-blog-state-ico{width:48px;height:48px;margin-bottom:16px;border-radius:13px}.cms-blog-state--compact h2{font-size:19px}.cms-blog-state--compact p{font-size:13px}
      @media(prefers-reduced-motion:reduce){.cms-blog-state *{transition:none!important}}
    `}</style>
      <div className="cms-blog-state-ico" aria-hidden="true">
        <svg
          width="29"
          height="29"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {unavailable ? (
            <>
              <path d="M20 7v5h-5" />
              <path d="M4.9 9a7.5 7.5 0 0 1 12.4-4L20 8M4 17v-5h5" />
              <path d="M19.1 15a7.5 7.5 0 0 1-12.4 4L4 16" />
            </>
          ) : (
            <>
              <path d="M4 4h12v16H4zM16 8h4v10a2 2 0 0 1-2 2M7 8h6M7 12h6M7 16h3" />
            </>
          )}
        </svg>
      </div>
      <Heading>{heading}</Heading>
      <p role="status" aria-live="polite">
        {pending ? "Checking for articles…" : message}
      </p>
      {(unavailable || resetHref || showNewsroomLink) && (
        <div className="cms-blog-state-actions">
          {unavailable && (
            <button type="button" onClick={retry} disabled={pending}>
              {pending ? "Trying again…" : "Try again"}
            </button>
          )}
          {resetHref && (
            <Link href={resetHref} className="cms-blog-state-primary">
              View latest articles
            </Link>
          )}
          {showNewsroomLink && (
            <Link href="/about/newsroom">Explore the newsroom →</Link>
          )}
        </div>
      )}
    </section>
  );
}
