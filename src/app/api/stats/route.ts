import { NextResponse } from "next/server";
import { getDashboard } from "@/lib/analytics";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const siteId = url.searchParams.get("siteId") ?? url.searchParams.get("siteKey") ?? "pp_demo_india";
    const range = url.searchParams.get("range") ?? "30d";
    const dashboard = await getDashboard(siteId, range);

    return NextResponse.json(
      {
        site: dashboard.site,
        summary: dashboard.metrics,
        topPages: dashboard.topPages,
        topSources: dashboard.referrers,
        topCountries: dashboard.countries,
        topDevices: dashboard.devices,
        topEvents: dashboard.events,
        timeSeries: dashboard.series,
        liveCount: dashboard.realtime,
      },
      {
        headers: {
          "access-control-allow-origin": "*",
          "cache-control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not load stats." }, { status: 500 });
  }
}
