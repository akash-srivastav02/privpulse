import Link from 'next/link'

const sections = [
  {
    title: 'What PrivPulse Is',
    body: 'PrivPulse is privacy-first website analytics for founders, small businesses, and teams that want useful traffic data without cookie banners, advertising profiles, or invasive visitor tracking.'
  },
  {
    title: 'Analytics Data We Process',
    body: 'For pageviews and events, we process the page URL, pathname, referrer host, UTM parameters, approximate country/city when provided by infrastructure headers, device type, browser, operating system, event name, and rotating hashed visitor/session identifiers.'
  },
  {
    title: 'What We Do Not Collect',
    body: 'PrivPulse does not use analytics cookies, does not store raw visitor IP addresses in analytics events, does not build cross-site advertising profiles, and does not sell analytics data.'
  },
  {
    title: 'Account And Billing Data',
    body: 'When you create an account, we store your email address, name, site settings, plan, and billing status. Payment details are handled by our payment processors and are not stored directly by PrivPulse.'
  },
  {
    title: 'DPDP And GDPR Posture',
    body: 'PrivPulse is designed to reduce personal-data exposure by avoiding cookies and using rotating privacy-preserving hashes. Customers are still responsible for how they disclose analytics use on their own websites and for any local legal obligations.'
  },
  {
    title: 'Processors',
    body: 'We use Supabase for database and authentication, Vercel for hosting, Upstash for rate limiting, Resend for email, and payment providers such as Lemon Squeezy or Razorpay for billing.'
  },
  {
    title: 'Retention And Deletion',
    body: 'Analytics retention depends on the customer plan. Account owners can request deletion of account and analytics data by contacting support.'
  }
]

export default function PrivacyPage() {
  return (
    <main className="pp-page pp-legal-page">
      <nav className="pp-nav">
        <Link href="/" className="pp-logo">
          <div className="pp-logo-dot" />
          <div className="pp-logo-text">Priv<span>Pulse</span></div>
        </Link>
        <div className="pp-nav-links">
          <span className="pp-nav-badge">DPDP ready</span>
          <Link className="pp-nav-btn ghost" href="/terms">Terms</Link>
          <Link className="pp-nav-btn primary" href="/signup">Start free →</Link>
        </div>
      </nav>

      <section className="pp-legal-hero">
        <div className="pp-eyebrow">Privacy-first by design</div>
        <h1>Privacy Policy</h1>
        <p>Clear, practical privacy terms for a no-cookie analytics product. Last updated: May 16, 2026.</p>
      </section>

      <section className="pp-legal-shell">
        <aside className="pp-legal-aside">
          <div className="pp-legal-card accent">
            <div className="pp-section-label">Trust Summary</div>
            <ul>
              <li>No analytics cookies</li>
              <li>No raw IP storage in events</li>
              <li>No ad profiles</li>
              <li>No data selling</li>
            </ul>
          </div>
          <div className="pp-legal-card">
            <div className="pp-section-label">Contact</div>
            <p>Email privacy or deletion requests to <a href="mailto:hello@privpulse.in">hello@privpulse.in</a>.</p>
          </div>
        </aside>

        <article className="pp-legal-content">
          {sections.map(section => (
            <section className="pp-legal-section" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <section className="pp-legal-section">
            <h2>Questions</h2>
            <p>This page is product-facing privacy information, not a substitute for legal advice. For privacy requests, email <a href="mailto:hello@privpulse.in">hello@privpulse.in</a>.</p>
          </section>
        </article>
      </section>
    </main>
  )
}
