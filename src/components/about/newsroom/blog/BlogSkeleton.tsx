export default function BlogSkeleton({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <section
      className={`cms-blog-skeleton${compact ? " cms-blog-skeleton--compact" : ""}`}
      aria-busy="true"
      aria-label="Loading articles"
    >
      <style href="cms-blog-skeleton" precedence="medium">{`
      .cms-blog-skeleton{max-width:1180px;margin:0 auto;padding:clamp(28px,4vw,52px) 28px 56px;box-sizing:border-box}
      .cms-blog-skeleton-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
      .cms-blog-skeleton-lead{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:32px;padding:28px;border:1px solid #e7ecf6;border-radius:20px;background:#fff}
      .cms-blog-skeleton-line,.cms-blog-skeleton-media{background:linear-gradient(100deg,#edf2f9 20%,#f8faff 45%,#edf2f9 70%);background-size:240% 100%;animation:cms-blog-shimmer 1.7s ease-in-out infinite}
      .cms-blog-skeleton-line{height:13px;margin:15px 0;border-radius:6px}.cms-blog-skeleton-line:first-child{width:24%;height:20px}.cms-blog-skeleton-line:nth-child(2){width:86%;height:28px}.cms-blog-skeleton-line:last-child{width:62%}
      .cms-blog-skeleton-media{aspect-ratio:16/10;border-radius:13px}.cms-blog-skeleton-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-top:26px}
      .cms-blog-skeleton-card{padding:16px;border:1px solid #e7ecf6;border-radius:16px;background:#fff}.cms-blog-skeleton--compact{padding-top:20px;padding-bottom:32px}
      @keyframes cms-blog-shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}
      @media(max-width:700px){.cms-blog-skeleton-lead{grid-template-columns:1fr;padding:20px}.cms-blog-skeleton-lead>.cms-blog-skeleton-media{order:-1}.cms-blog-skeleton-grid{grid-template-columns:1fr}.cms-blog-skeleton-card:not(:first-child){display:none}}
      @media(prefers-reduced-motion:reduce){.cms-blog-skeleton-line,.cms-blog-skeleton-media{animation:none}}
    `}</style>
      <span className="cms-blog-skeleton-label" role="status">
        Loading articles…
      </span>
      <div aria-hidden="true">
        {!compact && (
          <div className="cms-blog-skeleton-lead">
            <Lines />
            <div className="cms-blog-skeleton-media" />
          </div>
        )}
        <div className="cms-blog-skeleton-grid">
          {[0, 1, 2].map((index) => (
            <div key={index} className="cms-blog-skeleton-card">
              <div className="cms-blog-skeleton-media" />
              <Lines />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Lines() {
  return (
    <div>
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="cms-blog-skeleton-line" />
      ))}
    </div>
  );
}
