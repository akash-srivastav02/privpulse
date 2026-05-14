import { createHmac, timingSafeEqual } from "crypto";
import { hasSupabase } from "./config";
import { normalizePlan, type Plan } from "./plans";
import { getSupabaseAdmin } from "./supabase";

const activeStatuses = new Set(["active", "on_trial", "trialing", "paid"]);

export type SubscriptionInput = {
  email: string;
  plan: Plan;
  status: string;
  lemonCustomerId?: string | null;
  lemonSubscriptionId?: string | null;
  lemonProductId?: string | null;
  lemonVariantId?: string | null;
  renewsAt?: string | null;
  endsAt?: string | null;
};

export async function getUserPlan(email: string): Promise<Plan> {
  if (!hasSupabase) return "free";

  const supabase = getSupabaseAdmin()!;
  const { data } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!data || !activeStatuses.has(String(data.status ?? "").toLowerCase())) return "free";
  return normalizePlan(data.plan as string);
}

export async function getSubscription(email: string) {
  if (!hasSupabase) return null;
  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertSubscription(input: SubscriptionInput) {
  if (!hasSupabase) return;

  const supabase = getSupabaseAdmin()!;
  const { error } = await supabase.from("subscriptions").upsert(
    {
      email: input.email.toLowerCase(),
      plan: input.plan,
      status: input.status,
      lemon_customer_id: input.lemonCustomerId ?? null,
      lemon_subscription_id: input.lemonSubscriptionId ?? null,
      lemon_product_id: input.lemonProductId ?? null,
      lemon_variant_id: input.lemonVariantId ?? null,
      renews_at: input.renewsAt ?? null,
      ends_at: input.endsAt ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email" },
  );

  if (error) throw error;
}

export function verifyLemonSignature(body: string, signature: string | null) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) return true;
  if (!signature) return false;

  const expected = createHmac("sha256", secret).update(body).digest("hex");
  return safeEqual(signature, expected);
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}
