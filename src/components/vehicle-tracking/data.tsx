import type { ReactNode } from 'react'

/**
 * Content for /service/vehicle-tracking-system.
 *
 * The shared sections this page also renders — customer quotes and the three use
 * cases — live in components/tracking/data.tsx, not here.
 */

const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export type Feature = {
  title: string
  desc: string
  href: string
  accent: string
  tint: string
  icon: ReactNode
}

/**
 * The three pillars. Each carries its own accent rather than all three sharing
 * the brand blue: the reference set them apart by colour, and at three cards it
 * is the fastest way to signal that these are different capabilities and not
 * three grades of the same one. The hues stay inside the site's existing
 * palette — brand blue, the lighter sky it already pairs with, and the amber the
 * blog categories use.
 */
export const FEATURES: Feature[] = [
  {
    title: 'Real-time location & GPS',
    desc:
      'Know exactly where every vehicle is, right now — not where it was at the last ping. Live position, speed, heading and stop history on one map, refreshed continuously.',
    href: '/service/fleet-telematics',
    accent: '#1360ee',
    tint: 'rgba(19,96,238,.1)',
    icon: (
      <svg viewBox="0 0 24 24" {...s} aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: 'Proper fuel management',
    desc:
      'This is where LOCATOR separates itself from other vehicle tracking systems. Tank level, refills, drain events and consumption per trip — so fuel becomes a number you manage, not one you absorb.',
    href: '/benefits-of-gps-tracking',
    accent: '#1360ee',
    tint: 'rgba(10,137,221,.1)',
    icon: (
      <svg viewBox="0 0 24 24" {...s} aria-hidden="true">
        <path d="M4 20V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v15" />
        <path d="M2.5 20h12" />
        <path d="M13 10h3.5a2 2 0 0 1 2 2v4a1.8 1.8 0 0 0 3.5 0V9l-3-3" />
        <path d="M4 9.5h9" />
      </svg>
    ),
  },
  {
    title: 'Customisable & accurate alerts',
    desc:
      'Another reason our tracker software is different: you decide what is worth interrupting your day for. Speeding, geofence breaches, idling, after-hours movement, harsh braking — set the thresholds yourself.',
    href: '/software',
    accent: '#1360ee',
    tint: 'rgba(19,96,238,.1)',
    icon: (
      <svg viewBox="0 0 24 24" {...s} aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>
    ),
  },
]

/** Why Locator beats the other GPS tracking companies in the UAE. */
export const WHY_POINTS: string[] = [
  'Reports that are 100% accurate',
  'Reports you can customise to your own operation',
  'A user interface that is genuinely intuitive',
  'Unlimited support, for as long as you are a customer',
  'Pricing that stays competitive at every fleet size',
]

/** What having a tracking system actually gets you. */
export const BENEFIT_POINTS: { title: string; desc: string }[] = [
  {
    title: 'Improved workforce productivity',
    desc: 'Fewer unexplained gaps in the day, and a record you can point at when one appears.',
  },
  {
    title: 'Better customer response',
    desc: 'Dispatch the nearest vehicle rather than the next one that answers the phone.',
  },
  {
    title: 'Maximum security for your assets',
    desc: 'Movement alerts, geofences and recovery support for every vehicle you own.',
  },
  {
    title: 'Reduced costs on fuel usage',
    desc: 'Idling, detours and drain events surface as line items instead of disappearing into the total.',
  },
  {
    title: 'Stronger communication across the business',
    desc: 'Departure and arrival times are shared facts, so nobody has to chase an update by phone.',
  },
]
