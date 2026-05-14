import { redirect } from "next/navigation";
import Link from "next/link";
import { Activity, ArrowUpRight, BarChart3, CreditCard, Globe2, LogOut } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getSubscription, getUserPlan } from "@/lib/billing";
import { listSitesForOwner, trackingScript } from "@/lib/analytics";
import { planLimits } from "@/lib/plans";
import NewSiteForm from "./new-site-form";

export const dynamic = "force-dynamic";

export default async function AppPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/app");

  const [sites, plan, subscription] = await Promise.all([
    listSitesForOwner(user.email),
    getUserPlan(user.email),
    getSubscription(user.email),
  ]);
  const limits = planLimits[plan];
  const reachedSiteLimit = sites.length >= limits.sites;

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#191a17]">
      <nav className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid size-8 place-items-center rounded bg-[#111] text-white">
              <Activity size={17} />
            </span>
            PrivPulse
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-black/55 sm:inline">{user.email}</span>
            <form action="/api/auth/logout" method="post">
              <button className="grid size-9 place-items-center rounded border border-black/10 bg-white text-black/60 hover:bg-black/5" title="Log out">
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Workspace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your analytics sites</h1>
          </div>
          <a href={`/api/checkout?plan=${plan === "agency" ? "agency" : "indie"}`} className="inline-flex items-center justify-center gap-2 rounded bg-[#111] px-4 py-3 text-sm font-medium text-white">
            Upgrade <CreditCard size={16} />
          </a>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <Metric icon={<CreditCard size={18} />} label="Plan" value={plan[0].toUpperCase() + plan.slice(1)} note={subscription?.status ? String(subscription.status) : "Free workspace"} />
          <Metric icon={<Globe2 size={18} />} label="Websites" value={`${sites.length}/${limits.sites}`} note="included in plan" />
          <Metric icon={<BarChart3 size={18} />} label="Pageviews" value={limits.pageviews.toLocaleString()} note="monthly plan limit" />
        </div>

        <NewSiteForm disabled={reachedSiteLimit} />

        <div className="mt-5 rounded border border-black/10 bg-white">
          <div className="border-b border-black/10 px-5 py-4 font-medium">Sites</div>
          <div className="divide-y divide-black/10">
            {sites.length === 0 ? (
              <div className="px-5 py-10 text-center text-black/55">Add your first website to get the tracking script.</div>
            ) : (
              sites.map((site) => (
                <div key={site.id} className="grid gap-4 px-5 py-4 lg:grid-cols-[1fr_1.3fr_auto] lg:items-center">
                  <div>
                    <div className="font-medium">{site.name}</div>
                    <div className="mt-1 text-sm text-black/50">{site.domain}</div>
                  </div>
                  <pre className="overflow-auto rounded bg-[#111] p-3 text-xs leading-6 text-white">{trackingScript(site.id)}</pre>
                  <a href={`/dashboard/${site.id}`} className="inline-flex items-center justify-center gap-2 rounded border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/5">
                    Dashboard <ArrowUpRight size={15} />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return (
    <div className="rounded border border-black/10 bg-white p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-black/50">
        {icon} {label}
      </div>
      <div className="text-3xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-black/50">{note}</div>
    </div>
  );
}
