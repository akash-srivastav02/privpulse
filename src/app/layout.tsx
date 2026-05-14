import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrivPulse - DPDP-ready website analytics",
  description:
    "Affordable no-cookie website analytics for Indian businesses, indie founders, and agencies.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://privpulse.vercel.app"),
  openGraph: {
    title: "PrivPulse - DPDP-ready website analytics",
    description:
      "Affordable no-cookie analytics with real-time dashboards, custom events, and India-first pricing.",
    url: "/",
    siteName: "PrivPulse",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PrivPulse analytics dashboard" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrivPulse - DPDP-ready website analytics",
    description:
      "No-cookie website analytics for Indian businesses, indie founders, and agencies.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
