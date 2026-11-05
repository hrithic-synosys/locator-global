"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* Client logos from /public/client logos folder */
const CLIENT_LOGO_NUMBERS = [
  1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 55, 57, 58, 59, 60,
];

// Each file's real pixel dimensions (logo mounted on its own white card, baked
// into the PNG). Cards come in two shapes — roughly square, or ~2.2x wider for
// wordmark logos — never a uniform box. Declaring the true size here (rather
// than one fake number for all 56) lets next/image report the correct aspect
// ratio immediately, so a fixed display height with width:auto never has to
// wait for the real file to decode before it knows how wide to render.
const LOGO_DIMS = {
  "01": [1423, 1480], "02": [1422, 1480], "03": [3128, 1481], "04": [3051, 1387],
  "06": [1422, 1481], "07": [1423, 1480], "08": [1423, 1481], "09": [1422, 1480],
  10: [1422, 1480], 11: [3128, 1481], 12: [3127, 1481], 13: [3127, 1481],
  14: [3127, 1481], 15: [1423, 1480], 16: [1422, 1481], 17: [1422, 1480],
  18: [1422, 1481], 19: [1422, 1481], 20: [1422, 1480], 21: [1422, 1481],
  22: [1422, 1481], 23: [1422, 1480], 24: [1423, 1480], 25: [1422, 1481],
  26: [1422, 1480], 27: [1422, 1480], 28: [1423, 1481], 29: [1422, 1481],
  30: [1422, 1481], 31: [1422, 1480], 32: [1423, 1481], 33: [3127, 1480],
  34: [3127, 1480], 35: [3127, 1480], 36: [3127, 1480], 37: [3127, 1481],
  38: [1422, 1481], 39: [1422, 1480], 40: [1423, 1480], 41: [1422, 1480],
  42: [1422, 1480], 44: [1423, 1480], 45: [1422, 1481], 46: [1422, 1480],
  47: [1422, 1481], 48: [1423, 1480], 49: [1423, 1481], 50: [1422, 1481],
  51: [1422, 1480], 52: [1601, 1481], 53: [1422, 1480], 55: [1423, 1480],
  57: [1422, 1480], 58: [1422, 1480], 59: [1423, 1481], 60: [3127, 1480],
};

const ALL_LOGOS = CLIENT_LOGO_NUMBERS.map((n) => {
  const padded = String(n).padStart(2, "0");
  const [width, height] = LOGO_DIMS[padded];
  return { name: `Client ${padded}`, src: `/clients/client-${padded}.png`, width, height };
});

/* Split into three rows of roughly equal length */
const ROW_SIZE = Math.ceil(ALL_LOGOS.length / 3);
const ROW_1 = ALL_LOGOS.slice(0, ROW_SIZE);
const ROW_2 = ALL_LOGOS.slice(ROW_SIZE, ROW_SIZE * 2);
const ROW_3 = ALL_LOGOS.slice(ROW_SIZE * 2);

/** Playback rate while the pointer is inside — slowed, never stopped. */
const HOVER_RATE = 0.28;
/** How fast the rate eases toward its target. Per-frame lerp factor. */
const RATE_EASE = 0.12;

export default function LogoMarquee({ speed1 = 92, speed2 = 102, speed3 = 112, heading = 'The companies you use, use LOCATOR', description = '' }) {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const spotRef = useRef(null);
  const [active, setActive] = useState(false);

  // Animation-rate ramp. All of this is refs and direct DOM writes on purpose:
  // the pointer moves every frame, and putting that through React state would
  // re-render 112 images per mousemove.
  const rateRef = useRef(1);
  const targetRateRef = useRef(1);
  const rampRef = useRef(0);
  const moveRafRef = useRef(0);
  const posRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") { setActive(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Toggled straight on the node rather than through state: the answer is a
  // browser capability, identical on every render, and routing it through
  // React would both re-render the whole marquee and give the server a value
  // it cannot know, i.e. a hydration mismatch.
  useEffect(() => {
    const ok =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("mix-blend-mode", "saturation") &&
      (CSS.supports("mask-image", "radial-gradient(circle 1px at 0 0, #000, #000)") ||
        CSS.supports("-webkit-mask-image", "radial-gradient(circle 1px at 0 0, #000, #000)"));
    if (!ok) sectionRef.current?.classList.add("lm--flat");
  }, []);

  useEffect(() => () => {
    cancelAnimationFrame(rampRef.current);
    cancelAnimationFrame(moveRafRef.current);
  }, []);

  const trackAnimations = () => {
    const root = innerRef.current;
    if (!root) return [];
    const out = [];
    root.querySelectorAll(".lm__track").forEach((el) => {
      // getAnimations() returns the running CSS animation objects; driving
      // playbackRate on those keeps the current position, where re-writing
      // animation-duration in CSS would snap the track to a new offset.
      el.getAnimations?.().forEach((a) => out.push(a));
    });
    return out;
  };

  const rampRate = (target) => {
    targetRateRef.current = target;
    if (rampRef.current) return;
    const step = () => {
      const t = targetRateRef.current;
      rateRef.current += (t - rateRef.current) * RATE_EASE;
      if (Math.abs(t - rateRef.current) < 0.004) rateRef.current = t;
      const r = rateRef.current;
      for (const a of trackAnimations()) {
        // updatePlaybackRate is the seamless form — it preserves the current
        // time instead of recomputing startTime, so the row never jumps.
        if (typeof a.updatePlaybackRate === "function") a.updatePlaybackRate(r);
        else a.playbackRate = r;
      }
      rampRef.current = r === t ? 0 : requestAnimationFrame(step);
    };
    rampRef.current = requestAnimationFrame(step);
  };

  const writeSpot = () => {
    moveRafRef.current = 0;
    const el = spotRef.current;
    if (!el) return;
    const { x, y } = posRef.current;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  };

  const handleMove = (e) => {
    const box = innerRef.current?.getBoundingClientRect();
    if (!box) return;
    posRef.current = { x: e.clientX - box.left, y: e.clientY - box.top };
    // One DOM write per frame no matter how many events fire.
    if (!moveRafRef.current) moveRafRef.current = requestAnimationFrame(writeSpot);
  };

  const handleEnter = () => rampRate(HOVER_RATE);

  const handleLeave = () => {
    rampRate(1);
    // Park the circle far outside the box so the mask is fully opaque again
    // and every logo returns to grey.
    posRef.current = { x: -9999, y: -9999 };
    if (!moveRafRef.current) moveRafRef.current = requestAnimationFrame(writeSpot);
  };

  return (
    <section
      ref={sectionRef}
      className={`lm ${active ? "lm--active" : ""}`}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
    >

      {/* Section heading */}
      <div className="lm__header">
        <p className="lm__eyebrow">Trusted by industry leaders</p>
        <h2 className="lm__title">{heading}</h2>
        {description && <p className="lm__description">{description}</p>}
      </div>

      <div className="lm__inner" ref={innerRef}>
        {/* ROW 1 — scrolls left */}
        <div className="lm__row">
          <div className="lm__track lm__track--left" style={{ "--dur": `${speed1}s` }}>
            {[...ROW_1, ...ROW_1].map((logo, i) => (
              <LogoItem key={`r1-${i}`} logo={logo} />
            ))}
          </div>
        </div>

        {/* ROW 2 — scrolls right */}
        <div className="lm__row">
          <div className="lm__track lm__track--right" style={{ "--dur": `${speed2}s` }}>
            {[...ROW_2, ...ROW_2].map((logo, i) => (
              <LogoItem key={`r2-${i}`} logo={logo} />
            ))}
          </div>
        </div>

        {/* ROW 3 — scrolls left */}
        <div className="lm__row">
          <div className="lm__track lm__track--left" style={{ "--dur": `${speed3}s` }}>
            {[...ROW_3, ...ROW_3].map((logo, i) => (
              <LogoItem key={`r3-${i}`} logo={logo} />
            ))}
          </div>
        </div>

        {/* The desaturating veil. The logos underneath are full colour; this
            layer greys everything behind it, and its mask punches a soft hole
            at the cursor so whatever sits in that hole keeps its real colour.
            Because it filters the composited backdrop rather than any element,
            the reveal is pixel-accurate and crosses logo boundaries for free —
            half of two neighbouring logos lights up exactly as the circle
            overlaps them. Sits above the rows, below nothing, and never takes
            a pointer event. */}
        <div className="lm__spot" ref={spotRef} aria-hidden="true" />
      </div>

      <style jsx>{`
        .lm {
          --gap: clamp(32px, 3.6vw, 60px);
          --logo-h: clamp(100px, 10vw, 145px);

          position: relative;
          width: 100%;
          background: #ffffff;
          padding: clamp(32px, 4vw, 52px) 0 clamp(28px, 3.5vw, 48px);
          overflow: hidden;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lm--active {
          opacity: 1;
          transform: translateY(0);
        }

        /* Heading */
        .lm__header {
          text-align: center;
          margin-bottom: clamp(20px, 2.5vw, 32px);
          padding: 0 16px;
        }
        .lm__eyebrow {
          font-size: clamp(11px, 1.1vw, 13px);
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #94a3b8;
          margin: 0;
        }

        .lm__description { margin: 12px auto 0; max-width: 62ch; color: #6e6e73; line-height: 1.65; }
        .lm__title {
          margin: clamp(10px, 1.1vw, 16px) 0 0;
          font-size: clamp(20px, 2.2vw, 32px);
          font-weight: 800;
          line-height: 1.18;
          letter-spacing: -0.02em;
          color: #1360ee;
        }

        /* Edge fade mask */
        .lm__inner {
          position: relative;
          mask-image: linear-gradient(
            90deg,
            transparent 0,
            #000 7%,
            #000 93%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent 0,
            #000 7%,
            #000 93%,
            transparent 100%
          );
        }

        .lm__row {
          display: flex;
          overflow: hidden;
          padding: clamp(6px, 1vw, 12px) 0;
        }
        .lm__row + .lm__row {
          margin-top: clamp(6px, 1vw, 14px);
        }

        .lm__track {
          display: flex;
          flex-shrink: 0;
          gap: var(--gap);
          padding-right: var(--gap);
          width: max-content;
          will-change: transform;
          align-items: center;
        }
        .lm__track--left  { animation: scrollLeft  var(--dur) linear infinite; }
        .lm__track--right { animation: scrollRight var(--dur) linear infinite; }

        @keyframes scrollLeft  { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
        @keyframes scrollRight { from { transform: translateX(-50%); } to { transform: translateX(0);    } }

        /* No pause on hover. The rows keep moving and simply ease down to a
           slower playback rate, driven from JS via the Web Animations API —
           see rampRate(). Rewriting animation-duration here instead would make
           each track jump to a new offset the moment the value changed. */

        /* ── Cursor spotlight ───────────────────────────────────────────────
           inset:0 over all three rows, so the circle can straddle rows as well
           as neighbouring logos. --mx/--my are written straight to this node's
           style once per frame; keeping them as custom properties means the
           only thing changing is a mask position, which the compositor handles
           without re-layout or re-paint of the logos themselves. */
        .lm__spot {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          --mx: -9999px;
          --my: -9999px;
          --r: clamp(150px, 15vw, 260px);
          /* White painted in saturation blend mode: the result keeps the hue
             and luminosity of what is underneath but takes the SOURCE's
             saturation, and white has none — so everything below turns grey.
             This replaced backdrop-filter, which silently did nothing here:
             .lm__inner carries a mask-image for the edge fade, and a masked
             ancestor establishes a backdrop root, leaving the overlay with an
             empty backdrop to filter. Blending composites against its actual
             siblings, so the marquee rows are what gets desaturated. */
          background: #ffffff;
          mix-blend-mode: saturation;
          /* Transparent in the middle = veil absent = colour shows through.
             The 62%→100% ramp is the feathered edge; a hard stop would give the
             reveal a visible cut-out rim. Beyond the circle the final stop
             continues opaque, so the rest of the strip stays grey. */
          mask-image: radial-gradient(
            circle var(--r) at var(--mx) var(--my),
            transparent 0,
            transparent 62%,
            #000 100%
          );
          -webkit-mask-image: radial-gradient(
            circle var(--r) at var(--mx) var(--my),
            transparent 0,
            transparent 62%,
            #000 100%
          );
        }

        /* Fallback for engines without blend modes or masks: no veil at all, and the
           logos grey themselves. Loses the spotlight, keeps the design intent —
           the alternative would be every logo blazing in full colour. */
        .lm--flat .lm__spot { display: none; }

        @media (prefers-reduced-motion: reduce) {
          .lm__track         { animation: none !important; }
          .lm                { opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
}

/**
 * Deliberately stateless. Colour is no longer a per-logo concern — every logo
 * renders in full colour and the .lm__spot veil decides what looks grey. That
 * also drops 112 hover listeners and 112 useState hooks from the tree, which is
 * what makes a per-frame cursor effect affordable here.
 */
function LogoItem({ logo }) {
  return (
    <div className="lmi">
      <Image
        src={logo.src}
        alt={logo.name}
        width={logo.width}
        height={logo.height}
        className="lmi__img"
        style={{
          width: "auto",
          height: "var(--logo-h)",
          maxWidth: "clamp(266px, 26.6vw, 378px)",
          objectFit: "contain",
          objectPosition: "center",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      <style jsx>{`
        .lmi {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 clamp(6px, 0.8vw, 12px);
          /* Flat opacity — the old :hover lift changed the whole logo, which is
             exactly the all-or-nothing behaviour the spotlight replaces. */
          opacity: 0.9;
        }
        /* Without the veil (no blend-mode/mask support) the images carry the
           greyscale themselves. :global because the class lives on the section,
           outside this styled-jsx scope. */
        :global(.lm--flat) .lmi :global(img) {
          filter: grayscale(1);
        }
      `}</style>
    </div>
  );
}
