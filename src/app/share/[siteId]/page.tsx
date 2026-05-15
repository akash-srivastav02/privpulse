import Link from "next/link";
import { Activity, BarChart3 } from "lucide-react";
import { getDashboard } from "@/lib/analytics";

type PageProps = {
  params: Promise<{ siteId: string }>;
};

export default async function SharePage({ params }: PageProps) {
  const { siteId } = await params;
  const data = await getDashboard(siteId, "30d");
  const max = Math.max(...data.series.map((point) => point.pageviews), 1);

  return (
    <main className="pp-page min-h-screen bg-[#f6f3ec] text-[#191a17]">
      <nav className="border-b border-black/10 bg-[#f6f3ec]/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded bg-[#111] text-white"><Activity size={17} /></span>
            <span className="font-semibold tracking-tight">PrivPulse</span>
          </Link>
          <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/60">Public dashboard</span>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-5 rounded border border-black/10 bg-white p-5">
          <h1 className="text-3xl font-semibold tracking-tight">{data.site.name}</h1>
          <p className="mt-2 text-sm text-black/55">{data.metrics.pageviews.toLocaleString()} pageviews in the last 30 days</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Visitors" value={data.metrics.visitors.toLocaleString()} />
          <Metric label="Pageviews" value={data.metrics.pageviews.toLocaleString()} />
          <Metric label="Events" value={data.metrics.events.toLocaleString()} />
        </div>

        <div className="mt-4 rounded border border-black/10 bg-white p-5">
          <div className="mb-5 flex items-center gap-2 font-medium"><BarChart3 size={18} /> Public traffic trend</div>
          <div className="flex h-52 items-end gap-2">
            {data.series.map((point) => (
              <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t bg-[#111]" style={{ height: `${Math.max(8, (point.pageviews / max) * 176)}px` }} />
                <span className="text-[10px] text-black/45">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-black/10 bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-[0.14em] text-black/45">{label}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  );
}
