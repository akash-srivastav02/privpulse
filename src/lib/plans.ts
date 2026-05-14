export type Plan = "free" | "indie" | "agency";

export const planLimits: Record<Plan, { sites: number; pageviews: number; retentionDays: number }> = {
  free: { sites: 1, pageviews: 10_000, retentionDays: 90 },
  indie: { sites: 3, pageviews: 100_000, retentionDays: 365 },
  agency: { sites: 20, pageviews: 1_000_000, retentionDays: 730 },
};

export function normalizePlan(value?: string | null): Plan {
  const plan = String(value ?? "").toLowerCase();
  if (plan.includes("agency") || plan.includes("pro")) return "agency";
  if (plan.includes("indie")) return "indie";
  return "free";
}
