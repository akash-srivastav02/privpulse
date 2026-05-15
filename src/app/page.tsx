import Link from 'next/link'

const features = [
  {
    icon: '🔒',
    title: 'No cookie banner',
    desc: 'Tracks via privacy-preserving hashing. GDPR + DPDP 2023 compliant with zero user prompts.',
    bg: 'var(--green-dim)'
  },
  {
    icon: '⚡',
    title: 'One-line setup',
    desc: 'One <script> tag. Dashboard populates instantly. No config, no API keys.',
    bg: 'var(--purple-dim)'
  },
  {
    icon: '📊',
    title: 'Everything on one screen',
    desc: 'Visitors, pages, referrers, countries, devices - all visible at a glance.',
    bg: 'var(--green-dim)'
  },
  {
    icon: '📧',
    title: 'Monday email digest',
    desc: 'Weekly traffic summary in your inbox. Know your numbers without logging in.',
    bg: 'rgba(255,179,71,0.1)'
  },
  {
    icon: '🎯',
    title: 'Codeless event tracking',
    desc: 'Add data-pp="signup" to any button. We track it automatically. No JS.',
    bg: 'var(--purple-dim)'
  },
  {
    icon: '🇮🇳',
    title: 'Built for India',
    desc: 'Priced in ₹. DPDP-ready. 4x cheaper than Plausible. Free tier - no card.',
    bg: 'rgba(255,179,71,0.1)'
  }
]

const plans = [
  {
    name: 'Starter',
    sub: 'Blogs & hobby projects',
    price: '₹0',
    period: '/mo forever',
    feats: ['1 website', '10,000 pageviews/mo', '3 months data retention', 'Public shareable dashboard'],
    cta: 'Get started free',
    hot: false
  },
  {
    name: 'Indie',
    sub: 'Founders & freelancers',
    price: '₹199',
    period: '/mo',
    feats: ['3 websites', '100,000 pageviews/mo', '12 months data', 'Custom event tracking', 'Weekly email digest', 'No "powered by" branding'],
    cta: 'Start 14-day trial',
    hot: true
  },
  {
    name: 'Pro',
    sub: 'Agencies & teams',
    price: '₹599',
    period: '/mo',
    feats: ['20 websites', '1M pageviews/mo', '24 months data', 'Team access', 'White-label option', 'Priority support'],
    cta: 'Contact us',
    hot: false
  }
]

function DemoDashboard() {
  const topPages = [
    ['/pricing', 8420],
    ['/blog/ga4-alternative', 6210],
    ['/features', 5890],
    ['/', 5120],
    ['/signup', 3890]
  ] as const
  const sources = [
    ['google.com', 9210],
    ['direct', 4320],
    ['twitter.com', 2810],
    ['producthunt.com', 1940],
    ['reddit.com', 980]
  ] as const

  return (
    <section className="pp-section-wrap" id="demo">
      <div className="pp-section-label">Live dashboard demo</div>
      <div className="pp-demo-frame">
        <div className="pp-dash-layout">
          <aside className="pp-sidebar">
            <div className="pp-sb-section">
              <div className="pp-sb-label">Your sites</div>
              <div className="pp-site-item active">
                <div className="pp-site-dot green" />
                <div className="pp-site-name">mystore.in</div>
                <div className="pp-site-pgv">42.1k</div>
              </div>
              <div className="pp-site-item">
                <div className="pp-site-dot muted" />
                <div className="pp-site-name">blog.mystore.in</div>
                <div className="pp-site-pgv">8.3k</div>
              </div>
              <div className="pp-site-item">
                <div className="pp-site-dot amber" />
                <div className="pp-site-name">launches.xyz</div>
                <div className="pp-site-pgv">1.2k</div>
              </div>
            </div>
            <div className="pp-sb-section">
              <div className="pp-sb-label">Navigation</div>
              <div className="pp-nav-item active">📊 &nbsp;Overview</div>
              <div className="pp-nav-item">📄 &nbsp;Pages</div>
              <div className="pp-nav-item">🔗 &nbsp;Sources</div>
              <div className="pp-nav-item">🌍 &nbsp;Locations</div>
              <div className="pp-nav-item">🎯 &nbsp;Goals</div>
              <div className="pp-nav-item">⚙️ &nbsp;Settings</div>
            </div>
            <div className="pp-sidebar-cta">Get embed code</div>
          </aside>

          <div className="pp-dash-main">
            <div className="pp-dash-hd">
              <div>
                <div className="pp-dash-title">mystore.in</div>
                <div className="pp-live-line"><span className="pp-live-dot" />Live · 3 visitors now</div>
              </div>
              <div className="pp-range-group">
                <button className="pp-range-btn">7d</button>
                <button className="pp-range-btn active">30d</button>
                <button className="pp-range-btn">90d</button>
                <button className="pp-range-btn">12m</button>
              </div>
            </div>

            <div className="pp-metrics-grid">
              <div className="pp-mc"><div className="lbl">UNIQUE VISITORS</div><div className="val">18,432</div><div className="chg up">↑ 12.4%</div></div>
              <div className="pp-mc"><div className="lbl">PAGEVIEWS</div><div className="val">42,109</div><div className="chg up">↑ 8.7%</div></div>
              <div className="pp-mc"><div className="lbl">BOUNCE RATE</div><div className="val">44%</div><div className="chg dn">↓ 2.1%</div></div>
              <div className="pp-mc"><div className="lbl">AVG DURATION</div><div className="val">2m 34s</div><div className="chg up">↑ 18s</div></div>
            </div>

            <div className="pp-chart-box">
              <div className="pp-chart-title">Visitors over time</div>
              <svg className="pp-lc" viewBox="0 0 700 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="pp-ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6c63ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path fill="url(#pp-ag)" d="M8,112 L32,106 L57,110 L81,99 L105,91 L129,82 L154,89 L178,73 L202,66 L226,78 L251,58 L275,54 L299,63 L323,46 L348,51 L372,35 L396,42 L420,29 L445,40 L469,24 L493,33 L517,17 L542,26 L566,8 L590,4 L614,14 L639,0 L663,-4 L687,10 L692,150 L8,150 Z" />
                <path fill="none" stroke="#6c63ff" strokeWidth="2.5" strokeLinejoin="round" d="M8,112 L32,106 L57,110 L81,99 L105,91 L129,82 L154,89 L178,73 L202,66 L226,78 L251,58 L275,54 L299,63 L323,46 L348,51 L372,35 L396,42 L420,29 L445,40 L469,24 L493,33 L517,17 L542,26 L566,8 L590,4 L614,14 L639,0 L663,-4 L687,10" />
              </svg>
            </div>

            <div className="pp-two-col">
              <div className="pp-tbl-card">
                <div className="pp-tbl-title"><span>TOP PAGES</span><span>VIEWS</span></div>
                {topPages.map(([label, value]) => (
                  <div className="pp-tbl-row" key={label}>
                    <div className="pp-tbl-lbl">{label}</div>
                    <div className="pp-tbl-bar-bg"><div className="pp-tbl-bar" style={{ width: `${Math.round(value / 8420 * 100)}%` }} /></div>
                    <div className="pp-tbl-val">{value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="pp-tbl-card">
                <div className="pp-tbl-title"><span>SOURCES</span><span>VISITORS</span></div>
                {sources.map(([label, value]) => (
                  <div className="pp-tbl-row" key={label}>
                    <div className="pp-tbl-lbl">{label}</div>
                    <div className="pp-tbl-bar-bg"><div className="pp-tbl-bar" style={{ width: `${Math.round(value / 9210 * 100)}%` }} /></div>
                    <div className="pp-tbl-val">{value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main className="pp-page">
      <nav className="pp-nav">
        <Link href="/" className="pp-logo">
          <div className="pp-logo-dot" />
          <div className="pp-logo-text">Priv<span>Pulse</span></div>
        </Link>
        <div className="pp-nav-links">
          <span className="pp-nav-badge">DPDP ready</span>
          <Link className="pp-nav-btn ghost" href="/">Home</Link>
          <a className="pp-nav-btn ghost" href="#demo">Live demo</a>
          <Link className="pp-nav-btn primary" href="/signup">Start free →</Link>
        </div>
      </nav>

      <section className="pp-hero">
        <div className="pp-eyebrow">⚡ No cookies. No banners. No BS.</div>
        <h1>Analytics that <span className="pp-grad">respects</span><br />your users</h1>
        <p className="pp-hero-sub">Replace Google Analytics with a clean, privacy-first dashboard. GDPR + India DPDP compliant. One script tag. Under 2KB.</p>
        <div className="pp-hero-actions">
          <Link className="pp-btn primary" href="/signup">Start free - ₹0/month →</Link>
          <a className="pp-btn secondary" href="#demo">See live demo</a>
        </div>
        <div className="pp-stats-row">
          <div className="pp-stat"><div className="pp-stat-val">1.8KB</div><div className="pp-stat-label">Script size</div></div>
          <div className="pp-stat"><div className="pp-stat-val">&lt;500ms</div><div className="pp-stat-label">Dashboard</div></div>
          <div className="pp-stat"><div className="pp-stat-val">0</div><div className="pp-stat-label">Cookies</div></div>
          <div className="pp-stat"><div className="pp-stat-val">₹199</div><div className="pp-stat-label">Paid plan/mo</div></div>
        </div>
      </section>

      <section className="pp-section-wrap">
        <div className="pp-section-label">Why PrivPulse</div>
        <div className="pp-feat-grid">
          {features.map(feature => (
            <div className="pp-feat-card" key={feature.title}>
              <div className="pp-feat-icon" style={{ background: feature.bg }}>{feature.icon}</div>
              <h4>{feature.title}</h4>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pp-section-wrap">
        <div className="pp-section-label">Install in 10 seconds</div>
        <div className="pp-code-block">
          <button className="pp-copy-btn">copy</button>
          <span className="pp-cm">&lt;!-- Paste before &lt;/head&gt; --&gt;</span><br />
          <span className="pp-kw">&lt;script</span> <span className="pp-str">async</span><br />
          &nbsp;&nbsp;<span className="pp-str">src</span>=<span className="pp-str">&quot;https://privpulse.vercel.app/p.js&quot;</span><br />
          &nbsp;&nbsp;<span className="pp-str">data-site</span>=<span className="pp-str">&quot;YOUR-SITE-ID&quot;</span><br />
          <span className="pp-kw">&gt;&lt;/script&gt;</span><br /><br />
          <span className="pp-cm">{'// Custom events - no JS needed:'}</span><br />
          <span className="pp-kw">&lt;button</span> <span className="pp-str">data-pp</span>=<span className="pp-str">&quot;signup&quot;</span><span className="pp-kw">&gt;</span>Sign up<span className="pp-kw">&lt;/button&gt;</span>
        </div>
      </section>

      <section className="pp-section-wrap">
        <div className="pp-section-label">Simple pricing in ₹</div>
        <div className="pp-price-grid">
          {plans.map(plan => (
            <div className={`pp-plan ${plan.hot ? 'hot' : ''}`} key={plan.name}>
              <div className="pp-plan-head">
                <div className="pp-plan-name">{plan.name}</div>
                {plan.hot && <span className="pp-popular">POPULAR</span>}
              </div>
              <div className="pp-plan-sub">{plan.sub}</div>
              <div className="pp-plan-price">{plan.price}<span>{plan.period}</span></div>
              <div className="pp-plan-feats">
                {plan.feats.map(feat => <div className="pp-pf" key={feat}>{feat}</div>)}
              </div>
              <Link href="/signup" className={`pp-plan-btn ${plan.hot ? 'primary' : 'secondary'}`}>{plan.cta}</Link>
            </div>
          ))}
        </div>
        <p className="pp-compare">Plausible: $9/mo (~₹750) &nbsp;·&nbsp; Fathom: $14/mo (~₹1,170) &nbsp;·&nbsp; No card for free plan</p>
      </section>

      <DemoDashboard />

      <footer className="pp-footer">
        <div className="pp-logo pp-footer-logo">
          <div className="pp-logo-dot" />
          <div className="pp-logo-text">Priv<span>Pulse</span></div>
        </div>
        <p>Privacy-first analytics for India · GDPR + DPDP compliant · No cookies ever</p>
        <div className="pp-footer-links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="mailto:hello@privpulse.in">Contact</a>
        </div>
      </footer>
    </main>
  )
}
