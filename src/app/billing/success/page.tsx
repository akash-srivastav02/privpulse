import Link from 'next/link'

export default function BillingSuccessPage() {
  return (
    <main className="pp-page">
      <nav className="pp-nav">
        <Link href="/" className="pp-logo"><div className="pp-logo-dot" /><div className="pp-logo-text">Priv<span>Pulse</span></div></Link>
      </nav>
      <section className="pp-result-card">
        <div className="pp-result-icon success">✓</div>
        <h1>Payment successful</h1>
        <p>Your plan update is being processed. If the dashboard still shows the old plan, refresh once after a few seconds.</p>
        <div className="pp-result-actions">
          <Link className="pp-btn primary" href="/dashboard">Open dashboard</Link>
          <Link className="pp-btn secondary" href="/contact">Need help?</Link>
        </div>
      </section>
    </main>
  )
}
