import Link from 'next/link'

const sections = [
  {
    title: 'Using PrivPulse',
    body: 'You may use PrivPulse only on websites, apps, or pages where you have permission to install analytics. You are responsible for your site content and for any disclosures required for your users.'
  },
  {
    title: 'Accounts',
    body: 'You are responsible for keeping your account secure and for all activity under your account. Use a strong password and contact us quickly if you suspect unauthorized access.'
  },
  {
    title: 'Acceptable Use',
    body: 'Do not use PrivPulse for illegal content, spam, malware, abusive traffic, attempts to identify individual visitors, tracking websites you do not control, or activity that harms the service for other customers.'
  },
  {
    title: 'Plans And Limits',
    body: 'Free and paid plans include site, pageview, and retention limits. We may throttle, reject, or stop collecting new events if usage exceeds plan limits or appears abusive.'
  },
  {
    title: 'Billing',
    body: 'Paid subscriptions renew according to the checkout terms shown by the payment provider. You can cancel through the billing provider or by contacting support. Taxes and payment disputes are handled through the payment provider where applicable.'
  },
  {
    title: 'Service Availability',
    body: 'We aim to keep PrivPulse reliable and fast, but do not guarantee uninterrupted access. Free and beta features may change as the product improves.'
  },
  {
    title: 'Liability',
    body: 'PrivPulse is provided as-is. To the maximum extent allowed by law, we are not liable for indirect losses, lost profits, or business interruption caused by service issues.'
  }
]

export default function TermsPage() {
  return (
    <main className="pp-page pp-legal-page">
      <nav className="pp-nav">
        <Link href="/" className="pp-logo">
          <div className="pp-logo-dot" />
          <div className="pp-logo-text">Priv<span>Pulse</span></div>
        </Link>
        <div className="pp-nav-links">
          <span className="pp-nav-badge">Fair use</span>
          <Link className="pp-nav-btn ghost" href="/privacy">Privacy</Link>
          <Link className="pp-nav-btn primary" href="/signup">Start free →</Link>
        </div>
      </nav>

      <section className="pp-legal-hero">
        <div className="pp-eyebrow">Simple terms</div>
        <h1>Terms of Service</h1>
        <p>The rules for using PrivPulse as a privacy-first analytics product. Last updated: May 16, 2026.</p>
      </section>

      <section className="pp-legal-shell">
        <aside className="pp-legal-aside">
          <div className="pp-legal-card accent">
            <div className="pp-section-label">Quick Version</div>
            <ul>
              <li>Use it only on sites you control</li>
              <li>Do not abuse the API</li>
              <li>Respect your own users</li>
              <li>Cancel paid plans anytime</li>
            </ul>
          </div>
          <div className="pp-legal-card">
            <div className="pp-section-label">Support</div>
            <p>Questions about billing or terms? Email <a href="mailto:hello@privpulse.in">hello@privpulse.in</a>.</p>
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
            <h2>Changes</h2>
            <p>We may update these terms as PrivPulse evolves. Material changes will be reflected on this page. Continued use of the service means you accept the updated terms.</p>
          </section>
        </article>
      </section>
    </main>
  )
}
