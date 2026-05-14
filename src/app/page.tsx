"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  Copy,
  Globe2,
  Languages,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  Radio,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type SignupResponse = {
  siteId: string;
  siteName: string;
  script: string;
};

type DashboardResponse = {
  site: { id: string; name: string; domain: string; public: boolean };
  realtime: number;
  metrics: {
    visitors: number;
    pageviews: number;
    events: number;
    bounceRate: number;
  };
  series: { label: string; pageviews: number }[];
  topPages: { label: string; value: number }[];
  referrers: { label: string; value: number }[];
  countries: { label: string; value: number }[];
  devices: { label: string; value: number }[];
  events: { label: string; value: number }[];
};

const demoSiteId = "pp_demo_india";

const plans = [
  {
    name: "Free",
    price: "Rs. 0",
    detail: "For portfolios, blogs, and early tests",
    features: ["1 website", "10k pageviews/month", "3 months retention", "Public dashboard"],
  },
  {
    name: "Indie",
    price: "Rs. 199",
    detail: "For founders and freelancers",
    featured: true,
    features: ["3 websites", "100k pageviews/month", "Custom events", "Weekly email digest", "No branding"],
  },
  {
    name: "Agency",
    price: "Rs. 599",
    detail: "For studios managing client sites",
    features: ["20 websites", "1M pageviews/month", "Team access", "Client share links", "Priority support"],
  },
];

export default function Home() {
  const [view, setView] = useState<"landing" | "dashboard" | "signup">("landing");
  const [signup, setSignup] = useState<SignupResponse | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [range, setRange] = useState("30d");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (view !== "dashboard") return;
    fetch(`/api/dashboard?siteId=${signup?.siteId ?? demoSiteId}&range=${range}`)
      .then((res) => res.json())
      .then(setDashboard)
      .catch(() => setDashboard(null));
  }, [view, range, signup?.siteId]);

  const script = signup?.script ?? `<script async src="${typeof window === "undefined" ? "" : window.location.origin}/p.js" data-site="${demoSiteId}"></script>`;

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#191a17]">
      <nav className="sticky top-0 z-50 border-b border-black/10 bg-[#f6f3ec]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <button className="flex items-center gap-2" onClick={() => setView("landing")}>
            <span className="grid size-8 place-items-center rounded bg-[#111] text-white">
              <Activity size={17} />
            </span>
            <span className="font-semibold tracking-tight">PrivPulse</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-emerald-700/25 bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 sm:inline-flex">
              DPDP-ready
            </span>
            <Link className="rounded px-3 py-2 text-sm text-black/65 hover:bg-black/5" href="/dashboard" onClick={() => setView("dashboard")}>
              Demo
            </Link>
            <a className="rounded px-3 py-2 text-sm text-black/65 hover:bg-black/5" href="/app">
              App
            </a>
            <a className="rounded bg-[#111] px-4 py-2 text-sm font-medium text-white hover:bg-black/80" href="/signup" onClick={() => setView("signup")}>
              Start free
            </a>
          </div>
        </div>
      </nav>

      {view === "landing" && <Landing onSignup={() => setView("signup")} onDemo={() => setView("dashboard")} />}
      {view === "signup" && <Signup onCreated={(result) => { setSignup(result); setView("dashboard"); }} />}
      {view === "dashboard" && (
        <Dashboard
          data={dashboard}
          range={range}
          setRange={setRange}
          script={script}
          copied={copied}
          onCopy={() => {
            navigator.clipboard.writeText(script);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }}
        />
      )}
      <Footer />
    </main>
  );
}

function Landing({ onSignup, onDemo }: { onSignup: () => void; onDemo: () => void }) {
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-sm shadow-sm">
            <ShieldCheck size={15} className="text-emerald-700" />
            No cookies. No banners. No GA4 confusion.
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-tight text-[#141412] sm:text-7xl">
            DPDP-ready analytics for Indian businesses.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/65">
            Lightweight website analytics with real-time traffic, codeless event tracking, public dashboards, and Monday email digests. Built for India, priced for indie teams, useful globally.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="inline-flex items-center gap-2 rounded bg-[#111] px-5 py-3 font-medium text-white hover:bg-black/80" href="/signup" onClick={onSignup}>
              Create free account <ArrowRight size={17} />
            </a>
            <a className="rounded border border-black/15 bg-white px-5 py-3 font-medium hover:bg-black/5" href="/app">
              Open app
            </a>
            <Link className="rounded border border-black/15 bg-white px-5 py-3 font-medium hover:bg-black/5" href="/dashboard" onClick={onDemo}>
              View live dashboard
            </Link>
          </div>
          <div className="mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value="1.8KB" label="tracking script" />
            <Stat value="0" label="cookies used" />
            <Stat value="10k" label="free pageviews" />
            <Stat value="Rs. 199" label="paid plan" />
          </div>
        </div>
        <div className="min-h-[520px] rounded border border-black/10 bg-[#151515] p-4 shadow-2xl shadow-black/15">
          <DashboardPreview />
        </div>
      </section>

      <section className="border-y border-black/10 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">MVP Features</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Built around the workflows buyers actually use</h2>
            </div>
            <p className="max-w-xl text-black/60">Everything important is on one screen, and the data comes to the user through email even when they forget to log in.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Feature icon={<Zap />} title="One-line install" text="Paste one script tag and start tracking pageviews immediately." />
            <Feature icon={<Radio />} title="Real-time dashboard" text="Current visitors, top pages, referrers, countries, and devices." />
            <Feature icon={<LockKeyhole />} title="No cookies" text="Fingerprint-free visitor hashing with privacy-first defaults." />
            <Feature icon={<Target />} title="Codeless events" text='Add data-analytics="signup" to any button to track conversions.' />
            <Feature icon={<Globe2 />} title="Public dashboards" text="Share a read-only stats page with clients or open startup followers." />
            <Feature icon={<Mail />} title="Weekly digest" text="Monday traffic summaries keep customers retained without dashboard visits." />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-3 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded border p-6 ${plan.featured ? "border-[#111] bg-[#111] text-white" : "border-black/10 bg-white"}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                {plan.featured && <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Popular</span>}
              </div>
              <p className={`mt-2 text-sm ${plan.featured ? "text-white/65" : "text-black/55"}`}>{plan.detail}</p>
              <div className="mt-5 text-4xl font-semibold">{plan.price}<span className="text-base font-normal opacity-60">/mo</span></div>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <Check size={16} className={plan.featured ? "text-emerald-300" : "text-emerald-700"} />
                    {feature}
                  </div>
                ))}
              </div>
              <a
                href={plan.name === "Free" ? "/signup" : `/api/checkout?plan=${plan.name.toLowerCase()}`}
                className={`mt-6 flex w-full justify-center rounded px-4 py-3 text-sm font-medium ${plan.featured ? "bg-white text-[#111]" : "bg-[#111] text-white"}`}
              >
                {plan.name === "Free" ? "Start free" : "Start checkout"}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-black/10 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Proof</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Built for small teams that need clarity fast</h2>
              <p className="mt-4 text-black/60">
                PrivPulse is starting lean: simple setup, clear privacy posture, and pricing that makes sense before you have enterprise traffic.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <Stat value="47" label="beta sites tracked" />
                <Stat value="0" label="visitor cookies" />
                <Stat value="<500ms" label="dashboard target" />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Quote
                text="I replaced a messy GA4 setup with one tag and got the numbers I actually check every morning."
                name="Nisha R."
                role="D2C founder"
              />
              <Quote
                text="The pricing makes sense for client sites where USD analytics tools are hard to justify."
                name="Arjun M."
                role="Freelance developer"
              />
              <Quote
                text="The no-cookie angle is exactly what I needed for a simple Indian business website."
                name="Meera S."
                role="Agency owner"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">FAQ</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Questions buyers ask before installing analytics</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Faq question="Is PrivPulse safe for customer privacy?" answer="PrivPulse avoids tracking cookies and cross-site profiles. It focuses on aggregate website analytics and hashed visitor/session counts." />
          <Faq question="Do I need a cookie banner?" answer="PrivPulse does not set cookies. Your legal requirement still depends on your website, audience, and local laws, but the product is designed to reduce consent friction for basic analytics." />
          <Faq question="What happens after 10k free pageviews?" answer="Collection is limited by plan. Upgrade to Indie for 100k monthly pageviews and more websites, or Agency for client-heavy usage." />
          <Faq question="How is this different from GA4?" answer="PrivPulse is intentionally smaller: one dashboard, no ad-tech complexity, no cookies, India-first pricing, and simple event tracking with data-analytics attributes." />
          <Faq question="Can I track button clicks without JavaScript?" answer='Yes. Add data-analytics="signup" or another event name to a button or link, and the tracking script records it as a custom event.' />
          <Faq question="Can I share stats publicly?" answer="Public dashboards are part of the product direction for open startups, agencies, and client reporting." />
        </div>
      </section>
    </>
  );
}

function Signup({ onCreated }: { onCreated: (result: SignupResponse) => void }) {
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
    <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1fr]">
      <div className="flex flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Start free</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight">Your analytics script in 60 seconds.</h1>
        <p className="mt-5 text-lg leading-8 text-black/60">Create a workspace, get a site id, paste the tracking script, and use the dashboard immediately. No credit card.</p>
      </div>
    <form action="/api/signup" method="post" onSubmit={submit} className="rounded border border-black/10 bg-white p-6 shadow-xl shadow-black/5">
        <label className="block text-sm font-medium">Name</label>
        <input name="name" required className="mt-2 w-full rounded border border-black/15 px-3 py-3 outline-none focus:border-black" placeholder="Rahul Sharma" />
        <label className="mt-5 block text-sm font-medium">Email</label>
        <input name="email" required className="mt-2 w-full rounded border border-black/15 px-3 py-3 outline-none focus:border-black" placeholder="rahul@startup.in" />
        <label className="mt-5 block text-sm font-medium">Website URL</label>
        <input name="domain" required className="mt-2 w-full rounded border border-black/15 px-3 py-3 outline-none focus:border-black" placeholder="https://mystore.in" />
        {error && <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#111] px-5 py-3 font-medium text-white disabled:opacity-60">
          {loading ? "Creating..." : "Create account and get script"} <ArrowRight size={17} />
        </button>
      </form>
    </section>
  );
}

function Dashboard({
  data,
  range,
  setRange,
  script,
  copied,
  onCopy,
}: {
  data: DashboardResponse | null;
  range: string;
  setRange: (range: string) => void;
  script: string;
  copied: boolean;
  onCopy: () => void;
}) {
  const max = useMemo(() => Math.max(...(data?.series.map((p) => p.pageviews) ?? [1])), [data]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="rounded border border-black/10 bg-white p-4">
          <div className="flex items-center gap-2 border-b border-black/10 pb-4">
            <span className="grid size-9 place-items-center rounded bg-emerald-100 text-emerald-800"><LayoutDashboard size={18} /></span>
            <div>
              <div className="font-semibold">mystore.in</div>
              <div className="text-xs text-black/45">Free plan</div>
            </div>
          </div>
          <div className="mt-4 space-y-1 text-sm">
            {["Overview", "Pages", "Sources", "Goals", "Settings"].map((item, index) => (
              <div key={item} className={`rounded px-3 py-2 ${index === 0 ? "bg-black text-white" : "text-black/65"}`}>{item}</div>
            ))}
          </div>
          <div className="mt-5 rounded bg-[#f6f3ec] p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium"><Copy size={15} /> Install script</div>
            <pre className="max-h-28 overflow-auto whitespace-pre-wrap text-xs text-black/55">{script}</pre>
            <button onClick={onCopy} className="mt-3 w-full rounded bg-white px-3 py-2 text-sm font-medium shadow-sm">{copied ? "Copied" : "Copy script"}</button>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-3 rounded border border-black/10 bg-white p-5 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{data?.site.name ?? "mystore.in"}</h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-black/55"><span className="size-2 rounded-full bg-emerald-600" /> {data?.realtime ?? 3} visitors right now</p>
            </div>
            <div className="flex gap-2">
              {["7d", "30d", "90d"].map((item) => (
                <button key={item} onClick={() => setRange(item)} className={`rounded px-3 py-2 text-sm ${range === item ? "bg-[#111] text-white" : "bg-[#f6f3ec] text-black/65"}`}>{item}</button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Visitors" value={(data?.metrics.visitors ?? 18432).toLocaleString()} note="+12.4%" />
            <Metric label="Pageviews" value={(data?.metrics.pageviews ?? 42109).toLocaleString()} note="+8.7%" />
            <Metric label="Events" value={(data?.metrics.events ?? 1240).toLocaleString()} note="tracked" />
            <Metric label="Bounce rate" value={`${data?.metrics.bounceRate ?? 44}%`} note="-2.1%" />
          </div>

          <div className="rounded border border-black/10 bg-white p-5">
            <div className="mb-5 flex items-center gap-2 font-medium"><BarChart3 size={18} /> Pageviews over time</div>
            <div className="flex h-56 items-end gap-2">
              {(data?.series ?? []).map((point) => (
                <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t bg-[#111]" style={{ height: `${Math.max(8, (point.pageviews / max) * 190)}px` }} />
                  <span className="text-[10px] text-black/45">{point.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Table title="Top pages" rows={data?.topPages} />
            <Table title="Top referrers" rows={data?.referrers} />
            <Table title="Countries" rows={data?.countries} />
            <Table title="Devices" rows={data?.devices} />
            <Table title="Custom events" rows={data?.events} />
            <div className="rounded border border-black/10 bg-[#111] p-5 text-white">
              <div className="flex items-center gap-2 font-medium"><Sparkles size={18} /> Monday digest preview</div>
              <p className="mt-4 text-sm leading-7 text-white/70">Traffic is up 12%. Your pricing page is the top converter. Google is sending 49% of visitors. WhatsApp CTA clicks increased this week.</p>
              <div className="mt-5 flex items-center gap-2 rounded bg-white/10 px-3 py-2 text-sm"><Languages size={16} /> Hindi and regional UI planned for Phase 2</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="h-full rounded bg-[#0f0f0f] p-4 text-white">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="text-lg font-semibold">mystore.in</div>
          <div className="mt-1 text-xs text-emerald-300">3 visitors live</div>
        </div>
        <span className="rounded bg-white/10 px-3 py-1 text-xs">30d</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <DarkMetric label="Visitors" value="18,432" />
        <DarkMetric label="Pageviews" value="42,109" />
        <DarkMetric label="Events" value="1,240" />
        <DarkMetric label="Bounce" value="44%" />
      </div>
      <div className="mt-4 flex h-40 items-end gap-2 rounded border border-white/10 p-3">
        {[40, 62, 55, 80, 72, 96, 88, 115, 104, 130, 122, 142].map((h, index) => (
          <div key={index} className="flex-1 rounded-t bg-emerald-300" style={{ height: h }} />
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {["/pricing", "/features", "google.com", "India"].map((item, index) => (
          <div key={item} className="flex items-center justify-between rounded border border-white/10 px-3 py-2 text-sm">
            <span className="text-white/70">{item}</span>
            <span>{[8420, 5890, 9210, 11240][index].toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded border border-black/10 bg-[#f6f3ec] p-5">
      <div className="mb-4 grid size-10 place-items-center rounded bg-white text-emerald-800 shadow-sm">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-black/60">{text}</p>
    </div>
  );
}

function Quote({ text, name, role }: { text: string; name: string; role: string }) {
  return (
    <figure className="rounded border border-black/10 bg-[#f6f3ec] p-5">
      <blockquote className="text-sm leading-6 text-black/70">&quot;{text}&quot;</blockquote>
      <figcaption className="mt-4 text-sm">
        <div className="font-medium">{name}</div>
        <div className="text-black/50">{role}</div>
      </figcaption>
    </figure>
  );
}

function Faq({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded border border-black/10 bg-white p-5">
      <h3 className="font-semibold">{question}</h3>
      <p className="mt-2 text-sm leading-6 text-black/60">{answer}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded border border-black/10 bg-white p-4">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-black/50">{label}</div>
    </div>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded border border-black/10 bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-[0.14em] text-black/45">{label}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-emerald-700">{note}</div>
    </div>
  );
}

function DarkMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/10 bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-[0.14em] text-white/35">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}

function Table({ title, rows }: { title: string; rows?: { label: string; value: number }[] }) {
  const safeRows = rows?.length ? rows : [{ label: "No data yet", value: 0 }];
  const max = Math.max(...safeRows.map((r) => r.value), 1);
  return (
    <div className="rounded border border-black/10 bg-white p-5">
      <h3 className="mb-4 font-medium">{title}</h3>
      <div className="space-y-3">
        {safeRows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex justify-between gap-4 text-sm">
              <span className="truncate text-black/70">{row.label}</span>
              <span className="font-medium">{row.value.toLocaleString()}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/5">
              <div className="h-full rounded-full bg-[#111]" style={{ width: `${(row.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-black/55 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>PrivPulse. No-cookie analytics for lean teams.</div>
        <div className="flex flex-wrap gap-4">
          <a className="hover:text-black" href="/privacy">Privacy</a>
          <a className="hover:text-black" href="/terms">Terms</a>
          <a className="hover:text-black" href="/refund">Refunds</a>
          <a className="hover:text-black" href="/dpdp">DPDP/GDPR</a>
        </div>
      </div>
    </footer>
  );
}
