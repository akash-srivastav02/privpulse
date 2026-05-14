import { NextResponse } from "next/server";
import { getDashboard } from "@/lib/analytics";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const siteId = url.searchParams.get("siteId") ?? "pp_demo_india";
    const range = url.searchParams.get("range") ?? "30d";

    const dashboard = await getDashboard(siteId, range);
    return NextResponse.json(dashboard, {
      headers: {
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not load dashboard." }, { status: 500 });
  }
}
