import Link from "next/link";
import { Activity, BarChart3, Code2, ExternalLink, LayoutDashboard, Sparkles } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getDashboard, listSitesForOwner, trackingScript } from "@/lib/analytics";
import CopyScriptButton from "./copy-script-button";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ siteId?: string; range?: string }>;
}) {
  const params = await searchParams;
  return <DashboardView siteId={params.siteId ?? "pp_demo_india"} range={params.range ?? "30d"} />;
}

export async function DashboardView({ siteId, range = "30d" }: { siteId: string; range?: string }) {
  if (siteId !== "pp_demo_india") {
    const user = await getSessionUser();
    if (!user) redirect(`/login?next=/dashboard/${siteId}`);
    const sites = await listSitesForOwner(user.email);
    if (!sites.some((site) => site.id === siteId)) notFound();
  }

  const data = await getDashboard(siteId, range);
  const max = Math.max(...data.series.map((point) => point.pageviews), 1);
  const script = trackingScript(siteId);
  const isDemo = siteId === "pp_demo_india";
  const hasTraffic = data.metrics.pageviews > 0 || data.metrics.events > 0;

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#191a17]">
      <nav className="border-b border-black/10 bg-[#f6f3ec]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded bg-[#111] text-white"><Activity size={17} /></span>
            <span className="font-semibold tracking-tight">PrivPulse</span>
          </Link>
          <Link className="rounded bg-[#111] px-4 py-2 text-sm font-medium text-white" href={isDemo ? "/signup" : "/app"}>
            {isDemo ? "Start free" : "Open app"}
          </Link>
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
            <div className="mt-4 space-y-2 text-sm">
              <div className="rounded bg-black px-3 py-2 text-white">Overview</div>
              <Link href="/app" className="flex items-center justify-between rounded px-3 py-2 text-black/65 hover:bg-black/5">
                Manage sites <ExternalLink size={14} />
              </Link>
            </div>
            <div className="mt-5 rounded bg-[#f6f3ec] p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium"><Code2 size={15} /> Install script</div>
              <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-all rounded bg-white p-3 text-xs leading-5 text-black/65">{script}</pre>
              <CopyScriptButton script={script} />
              {!isDemo && !hasTraffic && (
                <p className="mt-3 text-xs leading-5 text-black/50">
                  After pasting this in your site, open the site once and refresh this dashboard.
                </p>
              )}
            </div>
          </aside>

          <div className="space-y-4">
            <div className="flex flex-col justify-between gap-3 rounded border border-black/10 bg-white p-5 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{data.site.name}</h1>
                <p className="mt-1 flex items-center gap-2 text-sm text-black/55"><span className="size-2 rounded-full bg-emerald-600" /> {data.realtime} visitors right now</p>
                {!isDemo && !hasTraffic && (
                  <p className="mt-2 text-sm text-amber-700">No traffic has arrived yet. Check that the install script is present on your live website.</p>
                )}
              </div>
              <div className="flex gap-2">
                {["7d", "30d", "90d"].map((item) => (
                  <Link key={item} href={siteId === "pp_demo_india" ? `/dashboard?range=${item}` : `/dashboard/${siteId}?range=${item}`} className={`rounded px-3 py-2 text-sm ${item === range ? "bg-[#111] text-white" : "bg-[#f6f3ec] text-black/65"}`}>{item}</Link>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="Visitors" value={data.metrics.visitors.toLocaleString()} note={hasTraffic ? "tracked" : "waiting"} />
              <Metric label="Pageviews" value={data.metrics.pageviews.toLocaleString()} note={hasTraffic ? "tracked" : "waiting"} />
              <Metric label="Events" value={data.metrics.events.toLocaleString()} note={hasTraffic ? "tracked" : "waiting"} />
              <Metric label="Bounce rate" value={hasTraffic ? `${data.metrics.bounceRate}%` : "-"} note={hasTraffic ? "estimated" : "waiting"} />
            </div>

            <div className="rounded border border-black/10 bg-white p-5">
              <div className="mb-5 flex items-center gap-2 font-medium"><BarChart3 size={18} /> Pageviews over time</div>
              <div className="relative flex h-56 items-end gap-2">
                {!hasTraffic && !isDemo && (
                  <div className="absolute inset-0 grid place-items-center rounded bg-[#f6f3ec] text-sm text-black/55">
                    Waiting for the first pageview
                  </div>
                )}
                {data.series.map((point) => (
                  <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                    <div className={`w-full rounded-t ${hasTraffic || isDemo ? "bg-[#111]" : "bg-black/10"}`} style={{ height: `${Math.max(8, (point.pageviews / max) * 190)}px` }} />
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
                <div className="flex items-center gap-2 font-medium"><Sparkles size={18} /> Monday digest</div>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  {hasTraffic || isDemo
                    ? "Traffic is up 12%. Your pricing page is the top converter. Google is sending the most visitors. WhatsApp CTA clicks increased this week."
                    : "Your weekly digest will start after PrivPulse receives traffic from this website."}
                </p>
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
  const safeRows = rows.length ? rows : [{ label: "No data yet", value: 0 }];
  const max = Math.max(...safeRows.map((row) => row.value), 1);
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
