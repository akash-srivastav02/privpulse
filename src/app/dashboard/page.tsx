import Link from "next/link";
import { Activity, BarChart3, Copy, LayoutDashboard, Sparkles } from "lucide-react";
import { getDashboard, trackingScript } from "@/lib/analytics";

export default async function DashboardPage() {
  const data = await getDashboard("pp_demo_india", "30d");
  const max = Math.max(...data.series.map((point) => point.pageviews), 1);
  const script = trackingScript("pp_demo_india");

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#191a17]">
      <nav className="border-b border-black/10 bg-[#f6f3ec]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded bg-[#111] text-white"><Activity size={17} /></span>
            <span className="font-semibold tracking-tight">PrivPulse</span>
          </Link>
          <Link className="rounded bg-[#111] px-4 py-2 text-sm font-medium text-white" href="/signup">Start free</Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <aside className="rounded border border-black/10 bg-white p-4">
            <div className="flex items-center gap-2 border-b border-black/10 pb-4">
              <span className="grid size-9 place-items-center rounded bg-emerald-100 text-emerald-800"><LayoutDashboard size={18} /></span>
              <div>
                <div className="font-semibold">{data.site.name}</div>
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
            </div>
          </aside>

          <div className="space-y-4">
            <div className="flex flex-col justify-between gap-3 rounded border border-black/10 bg-white p-5 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{data.site.name}</h1>
                <p className="mt-1 flex items-center gap-2 text-sm text-black/55"><span className="size-2 rounded-full bg-emerald-600" /> {data.realtime} visitors right now</p>
              </div>
              <div className="flex gap-2">
                {["7d", "30d", "90d"].map((item) => (
                  <span key={item} className={`rounded px-3 py-2 text-sm ${item === "30d" ? "bg-[#111] text-white" : "bg-[#f6f3ec] text-black/65"}`}>{item}</span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="Visitors" value={data.metrics.visitors.toLocaleString()} note="+12.4%" />
              <Metric label="Pageviews" value={data.metrics.pageviews.toLocaleString()} note="+8.7%" />
              <Metric label="Events" value={data.metrics.events.toLocaleString()} note="tracked" />
              <Metric label="Bounce rate" value={`${data.metrics.bounceRate}%`} note="-2.1%" />
            </div>

            <div className="rounded border border-black/10 bg-white p-5">
              <div className="mb-5 flex items-center gap-2 font-medium"><BarChart3 size={18} /> Pageviews over time</div>
              <div className="flex h-56 items-end gap-2">
                {data.series.map((point) => (
                  <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t bg-[#111]" style={{ height: `${Math.max(8, (point.pageviews / max) * 190)}px` }} />
                    <span className="text-[10px] text-black/45">{point.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Table title="Top pages" rows={data.topPages} />
              <Table title="Top referrers" rows={data.referrers} />
              <Table title="Countries" rows={data.countries} />
              <Table title="Devices" rows={data.devices} />
              <Table title="Custom events" rows={data.events} />
              <div className="rounded border border-black/10 bg-[#111] p-5 text-white">
                <div className="flex items-center gap-2 font-medium"><Sparkles size={18} /> Monday digest preview</div>
                <p className="mt-4 text-sm leading-7 text-white/70">Traffic is up 12%. Your pricing page is the top converter. Google is sending the most visitors. WhatsApp CTA clicks increased this week.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
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

function Table({ title, rows }: { title: string; rows: { label: string; value: number }[] }) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <div className="rounded border border-black/10 bg-white p-5">
      <h3 className="mb-4 font-medium">{title}</h3>
      <div className="space-y-3">
        {rows.map((row) => (
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
