import { DashboardView } from "../page";

export default async function SiteDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const [{ siteId }, query] = await Promise.all([params, searchParams]);
  return <DashboardView siteId={siteId} range={query.range ?? "30d"} />;
}
