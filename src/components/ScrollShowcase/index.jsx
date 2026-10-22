'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Link from '@/components/country/CountryLink';
import Scene1Icons     from './Scene1Icons';
import Scene4Pricing   from './Scene4Pricing';
import SkipButton      from '@/components/common/SkipButton';

const fleetFeatures = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#374151" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        <circle cx="12" cy="9" r="2.5" stroke="#374151" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Live GPS Tracking',
    desc: 'Track vehicles live, monitor drivers, improve road team',
  },
  {
    // Clock with a bell badged onto it: the clock is the idle DURATION the card
    // is about, the bell is what that duration triggers. Two objects rather than
    // one alarm clock, because an alarm clock's ears read as decoration at 22px
    // while a whole bell is unmistakable.
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Clock, up and to the left to leave the badge corner clear */}
        <circle cx="10" cy="9.7" r="6.9"/>
        <path d="M10 5.9v4l2.7 1.7"/>
        {/* Bell, filled with the icon tile's own colour so it cuts out of the
            clock behind it instead of tangling with its outline. Group is
            scaled, so stroke-width is pre-divided to land back on 1.5. */}
        <g transform="translate(11.9 11.6) scale(0.5)" fill="#f1f5f9">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9z" strokeWidth="3"/>
          <path d="M10.3 20.6a1.94 1.94 0 0 0 3.4 0" strokeWidth="3" fill="none"/>
        </g>
      </svg>
    ),
    title: 'Instant Idle Alerts',
    desc: 'Detect long idle vehicles, reduce fuel waste, improve productivity.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#374151" strokeWidth="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#374151" strokeWidth="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#374151" strokeWidth="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#374151" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Dynamic Fleet Dashboard',
    desc: 'Central dashboard for trip insights, vehicle status, performance overview.',
  },
  {
    // Vehicle with a warning triangle. Replaces a ringing bell, which said "alert"
    // but not what the alert is about — this one names the subject too.
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Vehicle. Group is scaled, so each stroke-width is pre-divided by the
            scale to land back on the 1.5 the sibling icons use. */}
        <g transform="translate(-0.6 3.2) scale(0.76)">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" strokeWidth="2"/>
          <circle cx="7" cy="17" r="2" strokeWidth="2"/>
          <circle cx="17" cy="17" r="2" strokeWidth="2"/>
        </g>
        {/* Alert, filled with the icon tile's own colour so it cuts out of the
            vehicle behind it instead of tangling with its lines. */}
        <g transform="translate(8.34 5.84) scale(0.64)" fill="#f1f5f9">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeWidth="2.35"/>
          <path d="M12 9.5v4.2" strokeWidth="2.35"/>
          <path d="M12 17.4h.01" strokeWidth="2.35"/>
        </g>
      </svg>
    ),
    title: 'After-Hours Vehicle Alerts',
    desc: 'Get unauthorized movement alerts. Secure your fleet after hours.',
  },
  {
    // Proper map pins: a solid teardrop with a hole punched through it, which is
    // the shape everyone reads as "location". The hole is a second subpath on the
    // SAME path with fill-rule evenodd — a separate white circle on top would only
    // work over a known background, and these tiles are not always the same colour.
    // Both pins are 8px across on the 24px grid so the hole survives the downscale
    // to 22px; the outlined versions tried earlier did not.
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        {/* Route: right, up, right — rounded corners, so it turns like a road */}
        <path d="M5.9 20.5h4.6q3.4 0 3.4-3.4v-2.7q0-3.4 3.4-3.4h0.8"
          stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Trip start */}
        <path
          fillRule="evenodd"
          fill="#374151"
          d="M9.9 14.4c0 3-4 6.1-4 6.1s-4-3.1-4-6.1a4 4 0 0 1 8 0z
             M5.9 12.7a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 1 0 0-3.4z"
        />
        {/* Destination */}
        <path
          fillRule="evenodd"
          fill="#374151"
          d="M22.1 4.9c0 3-4 6.1-4 6.1s-4-3.1-4-6.1a4 4 0 0 1 8 0z
             M18.1 3.2a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 1 0 0-3.4z"
        />
      </svg>
    ),
    title: 'Daily Route History',
    desc: 'Review full trip logs, stop reports, and route timelines for every vehicle, every day.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Fleet Service Reminders',
    desc: 'Automated maintenance alerts for oil, tires, and service schedules.',
  },
];

const videoFeatures = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="15" height="14" rx="2" stroke="#374151" strokeWidth="1.5"/>
        <path d="M17 9l5-3v12l-5-3V9z" stroke="#374151" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Live HD Video',
    desc: 'Stream real-time HD road and driver footage to improve driver behavior, retrieve video on-demand, and enforce safer driving across your fleet.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#374151" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Collision Prevention',
    desc: 'Analyze incidents with video evidence and deploy AI audible alerts to warn drivers instantly, reducing future collision risks.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="#374151" strokeWidth="1.5"/>
        <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Operational Efficiency',
    desc: 'AI driver monitoring detects drowsiness and distraction (yawning, eye closure, phone use, looking away), helping managers take proactive safety actions.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Cost Savings',
    desc: 'Cut costs from accidents, insurance claims, vehicle damage, and fraud disputes with undeniable recorded proof that protects your business.',
  },
];

const textSections = [
  {
    eyebrow: 'Fleet Telematics',
    headline: 'Improve Fleet Operations with GPS Tracking & Telematics',
    body: 'Real-time GPS tracking to manage drivers, routes, and road operations with ease.',
    features: fleetFeatures,
    // Same arrangement as the Video Telematics row below: every card is a link
    // into the full Fleet Telematics service page. The hash lands the reader on
    // that page's matching "Improve Fleet Operations" section (its <section id>),
    // where the same six features are spelled out in full, rather than at the top
    // of the route.
    href: '/service/fleet-telematics#fleet-telematics',
  },
  {
    eyebrow: 'Video Telematics',
    headline: 'Enhance Fleet Visibility with Video Telematics',
    body: 'Live HD video insights to monitor drivers, road conditions, and on-road operations with ease — real-time driver monitoring, cargo surveillance, and multi-camera recording for trucks, taxis, buses, and commercial fleets.',
    features: videoFeatures,
    cols: 2,
    // Every card in this row is a link into the full Video Telematics service
    // page — the cards only have room for a two-line summary, so the click has
    // somewhere better to go than an in-place expand. The hash lands the reader
    // on that page's matching "Enhance Fleet Visibility" section (its <section
    // id>), where the same four features are spelled out in full, rather than at
    // the top of the route.
    href: '/service/video-telematics#video-telematics',
  },
];

const SceneComponents = [Scene1Icons, Scene4Pricing];

// Sizes here are the --sc-* step scale from globals.css rather than flat pixels:
// each resolves to exactly the number it replaces up to ~1550px and grows past it,
// so the card scales with the column instead of staying 14px wide-screen text.
function FeatureCard({ icon, title, desc, href }) {
  // Collapsed by default (2-line clamp, same look as before) — on a row with no
  // service page behind it a click reveals the rest of the sentence instead of
  // leaving it cut off behind the "…". Rows that DO have one (href) skip the
  // expand entirely and send the reader there, where the copy is complete.
  const [expanded, setExpanded] = useState(false);
  const isLink = Boolean(href);

  const body = (
    <>
      <div style={{
        flexShrink: 0,
        width: 'var(--sc-42)',
        height: 'var(--sc-42)',
        borderRadius: 12,
        background: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.82,
      }}>{icon}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, overflow: 'hidden' }}>
        <span style={{ fontSize: 'var(--sc-14)', fontWeight: 700, color: '#696b6b', lineHeight: 1.3 }}>{title}</span>
        <p style={{
          fontSize: 'var(--sc-12-5)',
          color: '#8090bc',
          lineHeight: 1.5,
          margin: 0,
          ...(isLink || !expanded ? {
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          } : null),
        }}>{desc}</p>
      </div>
    </>
  );

  const shell = {
    background: '#ffffff',
    border: '1px solid #e8edf3',
    borderRadius: 18,
    padding: 'var(--sc-16) var(--sc-18)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 'var(--sc-13)',
    minHeight: 0,
  };

  if (isLink) {
    return (
      <Link href={href} className="ss-feature-card-link" style={{ ...shell, textDecoration: 'none', color: 'inherit' }}>
        {body}
      </Link>
    );
  }

  return (
    <div
      onClick={() => setExpanded((v) => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded((v) => !v); } }}
      style={{ ...shell, cursor: expanded ? 'default' : 'pointer' }}
    >
      {body}
    </div>
  );
}

export default function ScrollShowcase() {
  const rowRefs   = useRef([]);
  const innerRefs = useRef([]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const observers = rowRefs.current.map((el, i) => {
      if (!el) return null;
      const panel = el.querySelector('.ss-anim-panel') || el;
      const obs = new IntersectionObserver(
        ([entry]) => {
          const scene = innerRefs.current[i];
          if (!scene) return;
          if (entry.isIntersecting) {
            if (scene.__play) scene.__play();
          } else {
            if (scene.__stop) scene.__stop();
          }
        },
        { rootMargin: '0px', threshold: 0 }
      );
      obs.observe(panel);
      return obs;
    });

    return () => {
      observers.forEach(o => o?.disconnect());
    };
  }, []);

  // The section's z-index is load-bearing, not decoration. Both rows in here get pinned,
  // which makes them position:fixed and floats them over whatever the page is showing —
  // and both neighbours were winning the paint order against them:
  //
  //   · the road wrapper above is z-index 200 (see app/page.tsx), which beats an
  //     auto-level element regardless of DOM order;
  //   · the FeatureSlider section below is also auto-level, but comes LATER in the DOM,
  //     which wins between two auto-level siblings.
  //
  // So a pinned row could be painted UNDER the road on one side and under the slider on
  // the other: the section it is supposed to be covering showing straight through it.
  // 210 clears the road's 200 and, being an explicit level, the auto sibling below, so a
  // pinned row always paints over whatever it overlaps. It stays far below the navbar
  // (99999), and z-index creates no containing block, so pinning itself is unaffected.
  return (
    <section style={{ background: '#f5f7fa', width: '100%', position: 'relative', zIndex: 210 }}>
      {textSections.map((s, i) => {
        const SceneComponent = SceneComponents[i];
        // Zigzag on desktop: even index (0) → text left, animation right
        //                     odd index  (1) → animation left, text right
        // On mobile, animation always shows first (above text) regardless of zigzag.
        const animLeft = i % 2 === 1;

        const animPanel = (
          <div className="ss-anim-panel">
            {SceneComponent && (
              <SceneComponent ref={(el) => { if (el) innerRefs.current[i] = el; }} />
            )}
          </div>
        );

        const textPanel = (
          <div className="ss-text-panel">
            <span style={{
              fontSize: 'var(--sc-13)',
              fontWeight: 700,
              color: '#1360ee',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 'var(--sc-18)',
              display: 'block',
            }}>
              {s.eyebrow}
            </span>
            {/* Only the clamp's CEILING becomes a token — the 24px floor and the 3vw
                preferred size are untouched, so this is the same type ramp it always
                was and simply stops climbing later on a large display. */}
            <h2 style={{
              fontSize: 'var(--t-h2)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#484b4c',
              margin: '0 0 var(--sc-16)',
              maxWidth: '100%',
            }}>
              {s.headline}
            </h2>
            <p style={{
              fontSize: 'var(--t-lead)',
              lineHeight: 1.65,
              color: '#8090bc',
              margin: '0 0 var(--sc-28)',
              /* Reading measure, so it scales with the type rather than staying at a
                 flat 560px that would hold ~46 characters at 15px and ~33 at 21px. */
              maxWidth: 'max(560px, min(35vw, 760px))',
            }}>
              {s.body}
            </p>

            {s.subHeadline && (
              <>
                <h3 style={{ fontSize: 'var(--t-h3)', fontWeight: 700, color: '#696b6b', margin: '0 0 10px', maxWidth: '100%' }}>
                  {s.subHeadline}
                </h3>
                <p style={{ fontSize: 'var(--t-body)', lineHeight: 1.6, color: '#8090bc', margin: '0 0 var(--sc-24)', maxWidth: 'max(560px, min(35vw, 760px))' }}>
                  {s.subBody}
                </p>
              </>
            )}

            {/* Grid width is owned by .ss-feature-grid (520px capped on mobile, full
                width on desktop) — do not set maxWidth inline here, it would beat the
                media query and pin the cards to the mobile width on desktop. */}
            {s.features && (
              <div className="ss-feature-grid" style={{
                display: 'grid',
                gap: 'var(--sc-13)',
              }}>
                {s.features.map((f) => (
                  <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} href={s.href} />
                ))}
              </div>
            )}
          </div>
        );

        return (
          <div
            key={i}
            ref={(el) => (rowRefs.current[i] = el)}
            // ss-row--anim-right: on desktop, text appears on left (order:0), anim on right (order:1)
            // This preserves the zigzag visual on desktop while keeping anim-first on mobile
            className={`ss-row${!animLeft ? ' ss-row--anim-right' : ''}`}
            data-skip-host
          >
            {animPanel}
            {textPanel}
            {/* Absolutely positioned against the row (see .ss-row / .skip-btn) —
                out of flow, so the row's height, the flex layout and the pin's
                one-viewport measurement are all untouched. The row is also the
                pinned element, so the button rides the frozen frame and stays
                reachable for the whole pinned range, which is exactly the stretch
                a skip is for. */}
            <SkipButton
              placement="bottom-right"
              onBeforeSkip={(dir) => innerRefs.current[i]?.__skip?.(dir)}
              onAfterSkip={() => innerRefs.current[i]?.__endSkip?.()}
            />
          </div>
        );
      })}
    </section>
  );
}
