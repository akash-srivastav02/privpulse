import { NextResponse } from "next/server";

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

  return NextResponse.redirect(checkoutUrl);
}
