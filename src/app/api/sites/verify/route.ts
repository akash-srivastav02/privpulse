import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { listSitesForOwner } from "@/lib/analytics";
import { verifyTrackingInstall } from "@/lib/site-verification";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

    const body = await request.json();
    const siteId = String(body.siteId ?? "").trim();
    if (!siteId) return NextResponse.json({ error: "Site id is required." }, { status: 400 });

    const sites = await listSitesForOwner(user.email);
    const site = sites.find((item) => item.id === siteId);
    if (!site) return NextResponse.json({ error: "Site not found." }, { status: 404 });

    const result = await verifyTrackingInstall(site.domain, site.id);
    return NextResponse.json(result, {
      headers: {
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not verify install." }, { status: 500 });
  }
}
