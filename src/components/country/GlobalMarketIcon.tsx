/** Outline mark that inherits the header's colour without a flag background. */
export default function GlobalMarketIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      role="img" aria-label="Global" style={{ display: 'block' }}>
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="4.5" ry="10" />
      <path d="M2 12h20M4 6h16M4 18h16" />
    </svg>
  )
}
