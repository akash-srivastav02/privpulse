import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { canCreateSite, createSite, listSitesForOwner } from "@/lib/analytics";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const sites = await listSitesForOwner(user.email);
  return NextResponse.json({ sites });
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

    const body = await request.json();
    const domain = String(body.domain ?? "").trim();
    if (!domain) return NextResponse.json({ error: "Website URL is required." }, { status: 400 });

    const limit = await canCreateSite(user.email);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Your ${limit.plan} plan includes ${limit.limit} website${limit.limit === 1 ? "" : "s"}.` },
        { status: 402 },
      );
    }

    const name = user.email.split("@")[0] || "PrivPulse user";
    const site = await createSite({ name, email: user.email, domain });
    return NextResponse.json(site);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not create site." }, { status: 500 });
  }
}
