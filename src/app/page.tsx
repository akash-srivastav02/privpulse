"use client";

import { FormEvent, useEffect, useState } from "react";

type SignupResponse = {
  siteId: string;
  siteName: string;
  script: string;
};

type DashboardResponse = {
  site: { id: string; name: string; domain: string; public: boolean };
  realtime: number;
  metrics: { visitors: number; pageviews: number; events: number; bounceRate: number };
  series: { label: string; pageviews: number }[];
  topPages: { label: string; value: number }[];
  referrers: { label: string; value: number }[];
  countries: { label: string; value: number }[];
  devices: { label: string; value: number }[];
};

const demoSiteId = "pp_demo_india";

export default function Home() {
  const [view, setView] = useState<"landing" | "dashboard" | "signup">("landing");
  const [signup, setSignup] = useState<SignupResponse | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [range, setRange] = useState("30d");

  useEffect(() => {
    if (view !== "dashboard") return;
    fetch(`/api/dashboard?siteId=${signup?.siteId ?? demoSiteId}&range=${range}`)
      .then((res) => res.json())
      .then(setDashboard)
      .catch(() => setDashboard(null));
  }, [view, range, signup?.siteId]);

  return (
    <main className="pp-exact">
      <nav className="ppx-nav">
        <button className="ppx-logo" onClick={() => setView("landing")}>
          <span className="ppx-logo-dot" />
          <span className="ppx-logo-text">Priv<span>Pulse</span></span>
        </button>
        <div className="ppx-nav-links">
          <span className="ppx-badge">DPDP ready</span>
          <button className="ppx-nav-btn ghost" onClick={() => setView("landing")}>Home</button>
          <button className="ppx-nav-btn ghost" onClick={() => setView("dashboard")}>Live demo</button>
          <a className="ppx-nav-btn ghost" href="/app">App</a>
          <button className="ppx-nav-btn primary" onClick={() => setView("signup")}>Start free {">"}</button>
        </div>
      </nav>

      {view === "landing" && <Landing onSignup={() => setView("signup")} onDemo={() => setView("dashboard")} />}
      {view === "signup" && <Signup created={signup} onCreated={setSignup} />}
      {view === "dashboard" && <DemoDashboard data={dashboard} range={range} setRange={setRange} />}
    </main>
  );
}

function Landing({ onSignup, onDemo }: { onSignup: () => void; onDemo: () => void }) {
  return (
    <>
      <section className="ppx-hero">
        <div className="ppx-eyebrow">No cookies. No banners. No BS.</div>
        <h1>Analytics that <span className="ppx-grad">respects</span><br />your users</h1>
        <p className="ppx-hero-sub">Replace Google Analytics with a clean, privacy-first dashboard. GDPR + India DPDP compliant. One script tag. Under 2KB.</p>
        <div className="ppx-hero-actions">
          <button className="ppx-btn primary" onClick={onSignup}>Start free - Rs.0/month {">"}</button>
          <button className="ppx-btn secondary" onClick={onDemo}>See live demo</button>
        </div>
        <div className="ppx-stats-row">
          <Stat value="1.8KB" label="Script size" />
          <Stat value="<500ms" label="Dashboard" />
          <Stat value="0" label="Cookies" />
          <Stat value="Rs.199" label="Paid plan/mo" />
        </div>
      </section>

      <section className="ppx-section">
        <div className="ppx-section-label">Why PrivPulse</div>
        <div className="ppx-feat-grid">
          <Feature icon="lock" tint="green" title="No cookie banner" text="Tracks via privacy-preserving hashing. GDPR + DPDP 2023 aligned with zero user prompts." />
          <Feature icon="bolt" tint="purple" title="One-line setup" text="One script tag. Dashboard populates instantly. No config, no API keys." />
          <Feature icon="chart" tint="green" title="Everything on one screen" text="Visitors, pages, referrers, countries, devices - all visible at a glance." />
          <Feature icon="mail" tint="amber" title="Monday email digest" text="Weekly traffic summary in your inbox. Know your numbers without logging in." />
          <Feature icon="target" tint="purple" title="Codeless event tracking" text='Add data-pp="signup" to any button. We track it automatically. No JS.' />
          <Feature icon="IN" tint="amber" title="Built for India" text="Priced in Rs. DPDP-ready. 4x cheaper than Plausible. Free tier - no card." />
        </div>
      </section>

      <section className="ppx-section">
        <div className="ppx-section-label">Install in 10 seconds</div>
        <div className="ppx-code">
          <span className="cm">&lt;!-- Paste before &lt;/head&gt; --&gt;</span><br />
          <span className="kw">&lt;script</span> <span className="str">async</span><br />
          &nbsp;&nbsp;<span className="str">src</span>=<span className="str">&quot;https://privpulse.vercel.app/p.js&quot;</span><br />
          &nbsp;&nbsp;<span className="str">data-site</span>=<span className="str">&quot;YOUR-SITE-ID&quot;</span><br />
          <span className="kw">&gt;&lt;/script&gt;</span><br /><br />
          <span className="cm">{"// Custom events - no JS needed:"}</span><br />
          <span className="kw">&lt;button</span> <span className="str">data-pp</span>=<span className="str">&quot;signup&quot;</span><span className="kw">&gt;</span>Sign up<span className="kw">&lt;/button&gt;</span>
        </div>
      </section>

      <section className="ppx-section">
        <div className="ppx-section-label">Simple pricing in Rs.</div>
        <div className="ppx-price-grid">
          <Plan name="Starter" detail="Blogs & hobby projects" price="Rs.0" suffix="/mo forever" features={["1 website", "10,000 pageviews/mo", "3 months data retention", "Public shareable dashboard"]} onClick={onSignup} />
          <Plan hot name="Indie" detail="Founders & freelancers" price="Rs.199" suffix="/mo" features={["3 websites", "100,000 pageviews/mo", "12 months data", "Custom event tracking", "Weekly email digest", "No powered by branding"]} onClick={() => location.href = "/api/checkout?plan=indie"} />
          <Plan name="Pro" detail="Agencies & teams" price="Rs.599" suffix="/mo" features={["20 websites", "1M pageviews/mo", "24 months data", "Team access", "White-label option", "Priority support"]} onClick={() => location.href = "/api/checkout?plan=agency"} />
        </div>
        <p className="ppx-price-note">Plausible: $9/mo (~Rs.750) · Fathom: $14/mo (~Rs.1,170) · No card for free plan</p>
      </section>

      <footer className="ppx-footer">
        <span>PrivPulse. Privacy-first analytics for India.</span>
        <div>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/refund">Refunds</a>
          <a href="/dpdp">DPDP/GDPR</a>
        </div>
      </footer>
    </>
  );
}

function Signup({ created, onCreated }: { created: SignupResponse | null; onCreated: (value: SignupResponse) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(json.error ?? "Could not create account");
      return;
    }
    onCreated(json);
  }

  return (
    <section className="ppx-signup-wrap">
      <div className="ppx-signup-eyebrow">
        <div className="ppx-eyebrow">Free forever · No credit card</div>
        <h2>Start in 60 seconds</h2>
        <p>Join founders who ditched GA4</p>
      </div>
      {created ? (
        <div className="ppx-success show">
          <div className="ppx-party">✓</div>
          <h3>You&apos;re in!</h3>
          <p>Add this to your head:</p>
          <div className="ppx-code small">{created.script}</div>
          <a className="ppx-btn primary full" href="/app">Go to app {">"}</a>
        </div>
      ) : (
        <form className="ppx-form-card" onSubmit={submit}>
          <h2>Create free account</h2>
          <p>10,000 pageviews/month. Forever free.</p>
          <Field label="Your name" name="name" placeholder="Rahul Sharma" />
          <Field label="Email address" name="email" type="email" placeholder="rahul@startup.in" />
          <Field label="Website URL" name="domain" placeholder="https://mysite.in" />
          {error && <p className="ppx-error">{error}</p>}
          <button className="ppx-sub-btn" disabled={loading}>{loading ? "Creating..." : "Create account & get script ->"}</button>
          <div className="ppx-fn">No cookies. No tracking irony.</div>
        </form>
      )}
    </section>
  );
}

function DemoDashboard({ data, range, setRange }: { data: DashboardResponse | null; range: string; setRange: (value: string) => void }) {
  const series = data?.series ?? [];
  const max = Math.max(...series.map((point) => point.pageviews), 1);
  return (
    <section className="ppx-dash-layout">
      <aside className="ppx-sidebar">
        <div className="ppx-sb-section">
          <div className="ppx-sb-label">Your sites</div>
          <div className="ppx-site-item active"><span className="ppx-site-dot green" /><span>mystore.in</span><span className="ppx-site-pgv">42.1k</span></div>
          <div className="ppx-site-item"><span className="ppx-site-dot muted" /><span>blog.mystore.in</span><span className="ppx-site-pgv">8.3k</span></div>
        </div>
        <div className="ppx-sb-section">
          <div className="ppx-sb-label">Navigation</div>
          {["Overview", "Pages", "Sources", "Locations", "Goals", "Settings"].map((item, index) => (
            <div className={`ppx-nav-item ${index === 0 ? "active" : ""}`} key={item}>{item}</div>
          ))}
        </div>
      </aside>
      <div className="ppx-dash-main">
        <div className="ppx-dash-hd">
          <div>
            <div className="ppx-dash-title">{data?.site.name ?? "mystore.in"}</div>
            <div className="ppx-live-text"><span className="ppx-live-dot" />Live · {data?.realtime ?? 3} visitors now</div>
          </div>
          <div className="ppx-range-row">
            {["7d", "30d", "90d"].map((item) => (
              <button className={`ppx-range-btn ${range === item ? "active" : ""}`} key={item} onClick={() => setRange(item)}>{item}</button>
            ))}
          </div>
        </div>
        <div className="ppx-metrics-grid">
          <Metric label="UNIQUE VISITORS" value={(data?.metrics.visitors ?? 18432).toLocaleString()} note="↑ 12.4%" />
          <Metric label="PAGEVIEWS" value={(data?.metrics.pageviews ?? 42109).toLocaleString()} note="↑ 8.7%" />
          <Metric label="EVENTS" value={(data?.metrics.events ?? 1240).toLocaleString()} note="tracked" />
          <Metric label="BOUNCE RATE" value={`${data?.metrics.bounceRate ?? 44}%`} note="↓ 2.1%" />
        </div>
        <div className="ppx-chart-box">
          <div className="ppx-chart-title">Visitors over time</div>
          <div className="ppx-bars">
            {series.map((point) => (
              <div key={point.label} className="ppx-bar-wrap">
                <div className="ppx-bar" style={{ height: `${Math.max(10, (point.pageviews / max) * 150)}px` }} />
                <span>{point.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ppx-two-col">
          <Table title="TOP PAGES" rows={data?.topPages ?? []} />
          <Table title="SOURCES" rows={data?.referrers ?? []} />
          <Table title="COUNTRIES" rows={data?.countries ?? []} />
          <Table title="DEVICES" rows={data?.devices ?? []} />
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, placeholder, type = "text" }: { label: string; name: string; placeholder: string; type?: string }) {
  return <div className="ppx-ig"><label>{label}</label><input required name={name} type={type} placeholder={placeholder} /></div>;
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div className="ppx-stat"><div className="ppx-stat-val">{value}</div><div className="ppx-stat-label">{label}</div></div>;
}

function Feature({ icon, tint, title, text }: { icon: string; tint: string; title: string; text: string }) {
  return <div className="ppx-feat-card"><div className={`ppx-feat-icon ${tint}`}>{icon}</div><h4>{title}</h4><p>{text}</p></div>;
}

function Plan({ name, detail, price, suffix, features, hot, onClick }: { name: string; detail: string; price: string; suffix: string; features: string[]; hot?: boolean; onClick: () => void }) {
  return (
    <div className={`ppx-plan ${hot ? "hot" : ""}`}>
      <div className="ppx-plan-head"><div className="ppx-plan-name">{name}</div>{hot && <span>POPULAR</span>}</div>
      <div className="ppx-plan-detail">{detail}</div>
      <div className="ppx-plan-price">{price}<span>{suffix}</span></div>
      <div className="ppx-plan-feats">{features.map((feature) => <div className="ppx-pf" key={feature}>{feature}</div>)}</div>
      <button className={`ppx-plan-btn ${hot ? "hot" : ""}`} onClick={onClick}>{hot ? "Start checkout" : "Get started"}</button>
    </div>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="ppx-mc"><div className="lbl">{label}</div><div className="val">{value}</div><div className="chg">{note}</div></div>;
}

function Table({ title, rows }: { title: string; rows: { label: string; value: number }[] }) {
  const safeRows = rows.length ? rows : [{ label: "No data yet", value: 0 }];
  const max = Math.max(...safeRows.map((row) => row.value), 1);
  return (
    <div className="ppx-tbl-card">
      <div className="ppx-tbl-title"><span>{title}</span><span>VALUE</span></div>
      {safeRows.map((row) => (
        <div className="ppx-tbl-row" key={row.label}>
          <div className="ppx-tbl-lbl">{row.label}</div>
          <div className="ppx-tbl-bar-bg"><div className="ppx-tbl-bar" style={{ width: `${(row.value / max) * 100}%` }} /></div>
          <div className="ppx-tbl-val">{row.value.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
