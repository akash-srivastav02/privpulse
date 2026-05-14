import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

const checkoutLinks: Record<string, string | undefined> = {
  indie: process.env.LEMON_SQUEEZY_INDIE_CHECKOUT_URL,
  agency: process.env.LEMON_SQUEEZY_AGENCY_CHECKOUT_URL,
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const plan = url.searchParams.get("plan") ?? "indie";
  const checkoutUrl = checkoutLinks[plan];

  if (!checkoutUrl) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  const target = new URL(checkoutUrl);
  const user = await getSessionUser();
  if (user) {
    target.searchParams.set("checkout[email]", user.email);
    target.searchParams.set("checkout[custom][email]", user.email);
    target.searchParams.set("checkout[custom][plan]", plan);
  }

  return NextResponse.redirect(target);
}
