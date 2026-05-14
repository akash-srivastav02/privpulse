import { NextResponse } from "next/server";
import { normalizePlan } from "@/lib/plans";
import { upsertSubscription, verifyLemonSignature } from "@/lib/billing";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifyLemonSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  try {
    const payload = JSON.parse(body);
    const attributes = payload?.data?.attributes ?? {};
    const meta = payload?.meta ?? {};
    const email = String(
      attributes.user_email ??
        attributes.customer_email ??
        attributes.email ??
        meta.custom_data?.email ??
        "",
    )
      .trim()
      .toLowerCase();

    if (!email.includes("@")) {
      return NextResponse.json({ ok: true, skipped: "missing-email" });
    }

    const plan = normalizePlan(
      [
        attributes.product_name,
        attributes.variant_name,
        meta.custom_data?.plan,
        attributes.first_subscription_item?.product_name,
        attributes.first_subscription_item?.variant_name,
      ]
        .filter(Boolean)
        .join(" "),
    );

    await upsertSubscription({
      email,
      plan,
      status: String(attributes.status ?? meta.event_name ?? "active").toLowerCase(),
      lemonCustomerId: stringifyId(attributes.customer_id),
      lemonSubscriptionId: stringifyId(payload?.data?.id),
      lemonProductId: stringifyId(attributes.product_id ?? attributes.first_subscription_item?.product_id),
      lemonVariantId: stringifyId(attributes.variant_id ?? attributes.first_subscription_item?.variant_id),
      renewsAt: attributes.renews_at ?? null,
      endsAt: attributes.ends_at ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not process webhook." }, { status: 400 });
  }
}

function stringifyId(value: unknown) {
  return value === undefined || value === null ? null : String(value);
}
