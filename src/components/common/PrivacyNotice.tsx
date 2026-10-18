import Link from 'next/link'
import type { ReactNode } from 'react'

export default function PrivacyNotice({ children = 'We use your details to respond to your enquiry.' }: { children?: ReactNode }) {
  return (
    <p className="privacy-notice" style={{ margin: '14px 0', fontSize: '12px', lineHeight: 1.65, color: '#6e6e73' }}>
      {children}{' '}Read our{' '}
      <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" aria-label="Privacy Policy (opens in a new tab)" style={{ color: '#1360ee', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
        Privacy Policy
      </Link>.
    </p>
  )
}
