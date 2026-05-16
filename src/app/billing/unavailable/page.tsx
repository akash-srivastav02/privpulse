import Link from 'next/link'

export default function BillingUnavailablePage({ searchParams }: { searchParams: { plan?: string } }) {
  const plan = searchParams.plan || 'indie'
  return (
    <main className="pp-page">
      <nav className="pp-nav">
        <Link href="/" className="pp-logo"><div className="pp-logo-dot" /><div className="pp-logo-text">Priv<span>Pulse</span></div></Link>
      </nav>
      <section className="pp-result-card">
        <div className="pp-result-icon warn">!</div>
        <h1>Checkout not connected yet</h1>
        <p>The {plan} checkout link is waiting for the final payment-provider URL. The product still works on the free plan; billing can be enabled without code changes once the provider URL is added.</p>
        <div className="pp-result-actions">
          <Link className="pp-btn primary" href="/dashboard">Continue free</Link>
          <Link className="pp-btn secondary" href="/contact">Contact support</Link>
        </div>
      </section>
    </main>
  )
}
