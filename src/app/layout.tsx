import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  metadataBase: new URL('https://privpulse.vercel.app'),
  title: {
    default: 'PrivPulse — Privacy-first Analytics for India',
    template: '%s · PrivPulse',
  },
  description: 'Replace Google Analytics. No cookies. GDPR + DPDP compliant. From ₹0/month.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'PrivPulse — Privacy-first Analytics for India',
    description: 'Replace Google Analytics. No cookies. GDPR + DPDP compliant. From ₹0/month.',
    url: 'https://privpulse.vercel.app',
    siteName: 'PrivPulse',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrivPulse — Privacy-first Analytics for India',
    description: 'Replace Google Analytics. No cookies. GDPR + DPDP compliant. From ₹0/month.',
    images: ['/opengraph-image'],
  },
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
