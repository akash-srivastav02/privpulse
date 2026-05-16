import Link from 'next/link'

export default function BillingCancelPage() {
  return (
    <main className="pp-page">
      <nav className="pp-nav">
        <Link href="/" className="pp-logo"><div className="pp-logo-dot" /><div className="pp-logo-text">Priv<span>Pulse</span></div></Link>
      </nav>
      <section className="pp-result-card">
        <div className="pp-result-icon">↺</div>
        <h1>Checkout cancelled</h1>
        <p>No charge was made. You can keep using the free plan and upgrade later from your dashboard.</p>
        <div className="pp-result-actions">
          <Link className="pp-btn primary" href="/dashboard">Back to dashboard</Link>
          <Link className="pp-btn secondary" href="/contact">Ask a question</Link>
        </div>
      </section>
    </main>
  )
}
