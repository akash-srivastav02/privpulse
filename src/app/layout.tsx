import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'PrivPulse — Privacy-first Analytics for India',
  description: 'Replace Google Analytics. No cookies. GDPR + DPDP compliant. From ₹0/month.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
