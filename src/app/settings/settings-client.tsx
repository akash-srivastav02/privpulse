'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

type Site = { id:string; name:string; domain:string; plan:string; public_stats:boolean; site_key:string }
type User = { email?:string; user_metadata?:{ name?:string } }

export default function SettingsClient({ user, sites }: { user: User; sites: Site[] }) {
  const [name, setName] = useState(user.user_metadata?.name || '')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setStatus('')
    const updates: { data: { name: string }; password?: string } = { data: { name } }
    if (password) updates.password = password
    const { error } = await supabase.auth.updateUser(updates)
    setStatus(error ? error.message : 'Settings saved.')
    setPassword('')
    setLoading(false)
  }

  const activePlan = sites.some(s => s.plan === 'pro') ? 'pro' : sites.some(s => s.plan === 'indie') ? 'indie' : 'free'

  return (
    <main className="pp-page">
      <nav className="pp-nav">
        <Link href="/" className="pp-logo"><div className="pp-logo-dot" /><div className="pp-logo-text">Priv<span>Pulse</span></div></Link>
        <div className="pp-nav-links"><Link className="pp-nav-btn ghost" href="/dashboard">Dashboard</Link><Link className="pp-nav-btn ghost" href="/contact">Support</Link></div>
      </nav>
      <section className="pp-legal-hero">
        <div className="pp-eyebrow">Account</div>
        <h1>Settings</h1>
        <p>Manage your profile, password, plan, and connected websites.</p>
      </section>
      <section className="pp-settings-shell">
        <form className="pp-form-card" onSubmit={saveProfile}>
          <div className="pp-section-label">Profile</div>
          {status && <div className="pp-form-alert">{status}</div>}
          <label>Email</label>
          <input value={user.email || ''} disabled />
          <label>Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
          <label>New password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Leave blank to keep current password" minLength={8} />
          <button className="pp-form-submit" disabled={loading}>{loading ? 'Saving...' : 'Save settings'}</button>
        </form>
        <div className="pp-settings-stack">
          <div className="pp-legal-card accent">
            <div className="pp-section-label">Current Plan</div>
            <h2 className="pp-settings-plan">{activePlan.toUpperCase()}</h2>
            <p>{sites.length} website{sites.length === 1 ? '' : 's'} connected.</p>
            {activePlan === 'free' && <Link className="pp-plan-btn primary" href="/api/billing/checkout?plan=indie">Upgrade to Indie</Link>}
          </div>
          <div className="pp-legal-card">
            <div className="pp-section-label">Websites</div>
            {sites.length ? sites.map(site => (
              <div className="pp-settings-site" key={site.id}>
                <span>{site.name}</span>
                <small>{site.domain} · {site.public_stats ? 'public' : 'private'}</small>
              </div>
            )) : <p>No sites yet. Add your first one from the dashboard.</p>}
          </div>
        </div>
      </section>
    </main>
  )
}
