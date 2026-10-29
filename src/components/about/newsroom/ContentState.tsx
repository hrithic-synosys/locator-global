"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "@/components/country/CountryLink";

type Props = {
  state: "loading" | "unavailable" | "empty";
  title?: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  onRetry?: () => void;
  headingLevel?: 1 | 2;
};

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export default function ContentState({
  state,
  title,
  description,
  href,
  linkLabel,
  onRetry,
  headingLevel = 2,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [reloading, setReloading] = useState(false);
  const retrying = pending || reloading;
  // Do not offer an inert retry button while its client code is hydrating.
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const loading = state === "loading" || retrying;
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <div
      className="nr-content-state"
      data-content-state={state}
      aria-busy={loading}
    >
      <style href="nr-content-state" precedence="medium">{`
        .nr-content-state { width:100%; box-sizing:border-box; padding:clamp(24px,4vw,48px); border:1px solid #e0e8f6; border-radius:18px; background:linear-gradient(135deg,#f2f6ff,#fafcff); color:#516079; }
        .nr-content-state h1,.nr-content-state h2 { margin:0 0 10px; font-size:clamp(20px,2vw,28px); line-height:1.3; color:#16294b; }
        .nr-content-state p { margin:0; line-height:1.75; max-width:62ch; }
        .nr-state-actions { display:flex; align-items:center; flex-wrap:wrap; gap:16px; margin-top:22px; }
        .nr-state-actions button,.nr-state-actions a { font:inherit; font-size:14px; font-weight:650; border-radius:9px; text-decoration:none; }
        .nr-state-actions button { background:#1360ee; border:1px solid #1360ee; color:white; padding:11px 18px; cursor:pointer; }
        .nr-state-actions button:disabled { opacity:.65; cursor:wait; }
        .nr-state-actions a { color:#1360ee; padding:10px 0; }
        .nr-state-actions :focus-visible { outline:3px solid #6a9cff; outline-offset:4px; }
        .nr-state-skeleton { display:grid; gap:12px; margin-top:24px; max-width:560px; }
        .nr-state-skeleton span { height:14px; border-radius:6px; background:#e0e8f5; }
        .nr-state-skeleton span:last-child { width:65%; }
      `}</style>
      <div role="status" aria-live="polite">
        <Heading>
          {loading
            ? state === "loading"
              ? title || "Preparing the latest articles"
              : "Checking for updates…"
            : title ||
              (state === "unavailable"
                ? "Articles temporarily unavailable"
                : "No articles yet")}
        </Heading>
        <p>
          {description ||
            (state === "loading"
              ? "Our latest stories will appear here shortly."
              : state === "unavailable"
                ? "We’re having trouble loading articles right now. Please try again shortly."
                : "New stories will appear here once they are published. Explore the rest of our newsroom in the meantime.")}
        </p>
      </div>
      {loading && (
        <div className="nr-state-skeleton" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      )}
      {(state === "unavailable" || href) && (
        <div className="nr-state-actions">
          {state === "unavailable" && (
            <button
              type="button"
              disabled={!ready || retrying}
              onClick={() => {
                if (onRetry) {
                  startTransition(() => {
                    router.refresh();
                    onRetry();
                  });
                } else {
                  // A new document reliably recovers the CMS section even if
                  // an earlier streamed/soft-refresh transition was interrupted.
                  // Keep the exact market, search parameters and article URL.
                  setReloading(true);
                  window.location.reload();
                }
              }}
            >
              {retrying ? "Trying again…" : "Try again"}
            </button>
          )}
          {href && <Link href={href}>{linkLabel || "Back to newsroom"}</Link>}
        </div>
      )}
    </div>
  );
}
