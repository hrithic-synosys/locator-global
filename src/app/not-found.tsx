import Link from '@/components/country/CountryLink'

export default function NotFound() {
  return (
    <main className="nf-root">
      <style>{`
        .nf-root {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 24px;
          overflow: hidden;
          color: #fff;
          font-family: var(--font-poppins), system-ui, sans-serif;
          background:
            radial-gradient(120% 90% at 50% -10%, #0f3aa6 0%, #0a2270 38%, #07153f 72%, #050d28 100%);
        }

        /* ── Animated map grid ── */
        .nf-grid {
          position: absolute; inset: -2px;
          background-image:
            linear-gradient(rgba(120,170,255,.10) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,170,255,.10) 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: radial-gradient(85% 75% at 50% 42%, #000 35%, transparent 100%);
          -webkit-mask-image: radial-gradient(85% 75% at 50% 42%, #000 35%, transparent 100%);
          animation: nfGrid 22s linear infinite;
        }
        @keyframes nfGrid { from { background-position: 0 0, 0 0; } to { background-position: 46px 46px, 46px 46px; } }

        /* glow blobs */
        .nf-blob { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(8px); }
        .nf-blob.a { width: 480px; height: 480px; top: -160px; left: -120px;
          background: radial-gradient(circle, rgba(58,190,222,.22), transparent 65%); animation: nfFloat 13s ease-in-out infinite; }
        .nf-blob.b { width: 520px; height: 520px; bottom: -200px; right: -140px;
          background: radial-gradient(circle, rgba(99,102,241,.22), transparent 65%); animation: nfFloat 16s ease-in-out infinite reverse; }
        @keyframes nfFloat { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(24px,-20px) scale(1.06); } }

        /* floating particles */
        .nf-dot { position: absolute; width: 5px; height: 5px; border-radius: 50%;
          background: #6ea2ff; box-shadow: 0 0 10px 2px rgba(124,198,255,.7); opacity: .5; }
        .nf-dot.d1 { top: 22%; left: 16%; animation: nfDot 7s ease-in-out infinite; }
        .nf-dot.d2 { top: 70%; left: 24%; animation: nfDot 9s ease-in-out infinite .8s; }
        .nf-dot.d3 { top: 30%; right: 18%; animation: nfDot 8s ease-in-out infinite .4s; }
        .nf-dot.d4 { top: 64%; right: 22%; animation: nfDot 10s ease-in-out infinite 1.2s; }
        @keyframes nfDot { 0%,100% { transform: translateY(0); opacity:.35; } 50% { transform: translateY(-18px); opacity:.9; } }

        .nf-inner { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center;
          animation: nfRise 1s cubic-bezier(.22,.61,.36,1) both; }
        @keyframes nfRise { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }

        /* eyebrow pill */
        .nf-pill {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11.5px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
          color: #c7dcff; background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.18); border-radius: 999px;
          padding: 7px 16px; margin-bottom: 26px; backdrop-filter: blur(6px);
        }
        .nf-pill .pingdot { width: 8px; height: 8px; border-radius: 50%; background: #ff5f57;
          box-shadow: 0 0 0 0 rgba(255,95,87,.6); animation: nfPing 1.8s ease-out infinite; }
        @keyframes nfPing { 0% { box-shadow: 0 0 0 0 rgba(255,95,87,.55); } 70%,100% { box-shadow: 0 0 0 9px rgba(255,95,87,0); } }

        /* ── 404 SVG ── */
        .nf-svg { width: min(560px, 88vw); height: auto; display: block; }
        .nf-stroke {
          fill: none; stroke: url(#nfWire); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round;
          stroke-dasharray: 1400; stroke-dashoffset: 1400;
          animation: nfDraw 2.1s cubic-bezier(.6,.05,.25,1) forwards;
          filter: drop-shadow(0 0 8px rgba(110,170,255,.35));
        }
        .nf-fill {
          fill: url(#nfFill); opacity: 0;
          animation: nfReveal 1s ease-out 1.5s forwards;
        }
        @keyframes nfDraw   { to { stroke-dashoffset: 0; } }
        @keyframes nfReveal { to { opacity: 1; } }

        /* shimmer sweep over the digits */
        .nf-shine { fill: url(#nfShine); opacity: .0; mix-blend-mode: screen;
          animation: nfShine 3.4s ease-in-out 2.4s infinite; }
        @keyframes nfShine { 0%,100% { opacity: 0; } 45% { opacity: .9; } }

        /* ── radar GPS pin (sits in the middle 0) ── */
        .nf-radar { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-58%);
          width: 60px; height: 60px; pointer-events: none; z-index: 3; }
        .nf-radar .ring { position: absolute; inset: 0; border-radius: 50%;
          border: 2px solid rgba(124,198,255,.55); opacity: 0; animation: nfRadar 2.6s ease-out infinite; }
        .nf-radar .ring.r2 { animation-delay: .9s; }
        .nf-radar .ring.r3 { animation-delay: 1.8s; }
        @keyframes nfRadar { 0% { transform: scale(.2); opacity: .9; } 100% { transform: scale(1.6); opacity: 0; } }
        .nf-radar .pin { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          animation: nfBob 2.2s ease-in-out infinite; }
        @keyframes nfBob { 0%,100% { transform: translate(-50%,-54%); } 50% { transform: translate(-50%,-46%); } }

        /* heading + copy */
        .nf-title { margin: 30px 0 12px; font-size: clamp(24px,4vw,38px); font-weight: 800;
          letter-spacing: -.02em; line-height: 1.1; }
        .nf-title .accent { color: #6ea2ff; }
        .nf-sub { margin: 0 0 32px; max-width: 440px; font-size: clamp(14px,1.4vw,16px);
          line-height: 1.65; color: rgba(255,255,255,.66); }

        /* buttons */
        .nf-actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
        .nf-btn { display: inline-flex; align-items: center; gap: 8px; font-size: 14.5px; font-weight: 700;
          padding: 13px 26px; border-radius: 999px; text-decoration: none; cursor: pointer;
          transition: transform .2s cubic-bezier(.22,.61,.36,1), box-shadow .2s, background .2s; }
        .nf-btn.primary { background: #fff; color: #0a3aa0; box-shadow: 0 10px 30px -10px rgba(255,255,255,.5); }
        .nf-btn.primary:hover { transform: translateY(-2px); box-shadow: 0 16px 40px -12px rgba(255,255,255,.6); }
        .nf-btn.ghost { background: rgba(255,255,255,.08); color: #fff; border: 1px solid rgba(255,255,255,.28);
          backdrop-filter: blur(8px); }
        .nf-btn.ghost:hover { background: rgba(255,255,255,.16); transform: translateY(-2px); }
        .nf-btn .arrow { transition: transform .2s; }
        .nf-btn:hover .arrow { transform: translateX(3px); }

        /* a11y: visually-hidden but crawlable */
        .nf-vh { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

        @media (prefers-reduced-motion: reduce) {
          .nf-grid, .nf-blob, .nf-dot, .nf-inner, .nf-shine, .nf-radar .ring, .nf-radar .pin, .nf-pill .pingdot { animation: none !important; }
          .nf-stroke { stroke-dashoffset: 0; animation: none; }
          .nf-fill { opacity: 1; animation: none; }
        }
      `}</style>

      {/* background layers */}
      <div className="nf-grid" aria-hidden="true" />
      <div className="nf-blob a" aria-hidden="true" />
      <div className="nf-blob b" aria-hidden="true" />
      <span className="nf-dot d1" aria-hidden="true" />
      <span className="nf-dot d2" aria-hidden="true" />
      <span className="nf-dot d3" aria-hidden="true" />
      <span className="nf-dot d4" aria-hidden="true" />

      {/* SEO/a11y heading */}
      <h1 className="nf-vh">404 — Page Not Found</h1>

      <div className="nf-inner">
        <span className="nf-pill">
          <span className="pingdot" /> GPS Signal Lost
        </span>

        {/* 404 wireframe-draw composition */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <svg className="nf-svg" viewBox="0 0 600 220" aria-hidden="true">
            <defs>
              <linearGradient id="nfWire" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6ea2ff" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="nfFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#bcd8ff" />
              </linearGradient>
              <linearGradient id="nfShine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                <stop offset="50%" stopColor="#fff" stopOpacity=".85" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* filled digits (revealed after the stroke draws) */}
            <text className="nf-fill" x="300" y="170" textAnchor="middle"
              fontSize="210" fontWeight="800" letterSpacing="6"
              fontFamily="var(--font-poppins), system-ui, sans-serif">404</text>

            {/* wireframe outline that draws in */}
            <text className="nf-stroke" x="300" y="170" textAnchor="middle"
              fontSize="210" fontWeight="800" letterSpacing="6"
              fontFamily="var(--font-poppins), system-ui, sans-serif">404</text>

            {/* shimmer sweep */}
            <text className="nf-shine" x="300" y="170" textAnchor="middle"
              fontSize="210" fontWeight="800" letterSpacing="6"
              fontFamily="var(--font-poppins), system-ui, sans-serif">404</text>
          </svg>

          {/* radar pin nested in the middle "0" */}
          <div className="nf-radar" aria-hidden="true">
            <span className="ring r1" />
            <span className="ring r2" />
            <span className="ring r3" />
            <svg className="pin" width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s7-7.16 7-12A7 7 0 0 0 5 10c0 4.84 7 12 7 12z" fill="#ff5f57" />
              <circle cx="12" cy="10" r="2.6" fill="#fff" />
            </svg>
          </div>
        </div>

        <h2 className="nf-title">
          This route went <span className="accent">off the map</span>
        </h2>
        <p className="nf-sub">
          The page you&rsquo;re looking for couldn&rsquo;t be tracked. It may have been moved,
          renamed, or never existed. Let&rsquo;s get you back on route.
        </p>

        <div className="nf-actions">
          <Link href="/" className="nf-btn primary">
            Go Back Home <span className="arrow">→</span>
          </Link>
          <Link href="/software" className="nf-btn ghost">
            Explore Software
          </Link>
        </div>
      </div>
    </main>
  )
}
