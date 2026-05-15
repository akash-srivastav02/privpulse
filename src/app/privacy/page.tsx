import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-5 py-10">
      <article className="max-w-3xl mx-auto prose prose-invert prose-sm prose-headings:font-display prose-a:text-[#6c63ff]">
        <Link href="/" className="no-underline text-white/40">← Back to PrivPulse</Link>
        <h1>Privacy Policy</h1>
        <p>PrivPulse is built to provide website analytics without cookies, advertising profiles, or cross-site tracking.</p>
        <h2>What we collect for analytics</h2>
        <p>For each pageview we store page URL, referrer host, UTM parameters, approximate location from request headers when available, device/browser metadata, and rotating hashed visitor/session identifiers.</p>
        <h2>What we do not collect</h2>
        <p>We do not use cookies for visitor analytics. We do not store raw IP addresses in analytics events. We do not sell analytics data.</p>
        <h2>Account data</h2>
        <p>When you create an account we store your email, name, websites, plan, and settings so you can access your dashboard.</p>
        <h2>Processors</h2>
        <p>PrivPulse uses Supabase for database/auth, Vercel for hosting, Upstash for rate limiting, Resend for email, and payment providers such as Lemon Squeezy or Razorpay for billing.</p>
        <h2>Contact</h2>
        <p>Email <a href="mailto:hello@privpulse.in">hello@privpulse.in</a> for privacy requests or deletion.</p>
      </article>
    </main>
  )
}
