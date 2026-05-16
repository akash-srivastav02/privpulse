'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setStatus('')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, message })
    })
    const data = await res.json()
    setStatus(res.ok ? 'Message sent. We will reply by email.' : (data.error || 'Could not send message.'))
    setLoading(false)
  }

  return (
    <main className="pp-page">
      <nav className="pp-nav">
        <Link href="/" className="pp-logo"><div className="pp-logo-dot" /><div className="pp-logo-text">Priv<span>Pulse</span></div></Link>
        <div className="pp-nav-links"><Link className="pp-nav-btn ghost" href="/privacy">Privacy</Link><Link className="pp-nav-btn primary" href="/signup">Start free →</Link></div>
      </nav>
      <section className="pp-legal-hero">
        <div className="pp-eyebrow">Support</div>
        <h1>Contact PrivPulse</h1>
        <p>Questions about setup, billing, privacy, or your analytics dashboard? Send a note and we will reply by email.</p>
      </section>
      <section className="pp-form-shell">
        <form onSubmit={submit} className="pp-form-card">
          {status && <div className="pp-form-alert">{status}</div>}
          <label>Email address</label>
          <input type="text" inputMode="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" />
          <label>How can we help?</label>
          <textarea required value={message} onChange={e=>setMessage(e.target.value)} rows={7} placeholder="Tell us what you need..." />
          <button disabled={loading} className="pp-form-submit">{loading ? 'Sending...' : 'Send message →'}</button>
          <p className="pp-form-note">You can also email hello@privpulse.in directly.</p>
        </form>
      </section>
    </main>
  )
}
