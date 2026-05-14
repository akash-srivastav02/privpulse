import { NextResponse } from "next/server";
import { collectEvent } from "@/lib/analytics";
import { getIp, parseRequest } from "@/lib/parse-request";
import { checkRateLimit } from "@/lib/rate-limit";

const botPattern = /bot|crawler|spider|scraper|headless|phantom|selenium|puppeteer|playwright|curl|wget|python-requests/i;

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function POST(request: Request) {
  try {
    const userAgent = request.headers.get("user-agent") ?? "";
    if (botPattern.test(userAgent)) return cors();

    const ip = getIp(request);
    const limit = await checkRateLimit(ip);

    if (!limit.success) {
      return cors();
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return cors();
    }

    const siteId = String(body.siteId ?? body.siteKey ?? "");
    const type = body.type === "custom" || body.type === "event" ? "custom" : "pageview";
    const rawUrl = String(body.url ?? body.path ?? "/");
    const parsedUrl = parseUrl(rawUrl);

    if (!siteId) return cors();

    const parsed = parseRequest(request);

    await collectEvent({
      siteId,
      type,
      eventName: body.eventName ? String(body.eventName).slice(0, 80) : undefined,
      path: parsedUrl.pathname.slice(0, 240),
      url: rawUrl.slice(0, 2048),
      title: body.title ? String(body.title).slice(0, 160) : undefined,
      referrer: body.referrer ? String(body.referrer).slice(0, 240) : undefined,
      userAgent,
      ip,
      country: parsed.country,
      countryName: parsed.countryName,
      city: parsed.city,
      device: parsed.device,
      browser: parsed.browser,
      os: parsed.os,
      utmSource: stringOrNull(body.utmSource),
      utmMedium: stringOrNull(body.utmMedium),
      utmCampaign: stringOrNull(body.utmCampaign),
      props: isRecord(body.props) ? body.props : null,
    });

    return cors();
  } catch (error) {
    console.error(error);
    return cors();
  }
}

function cors(body: unknown = null, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: corsHeaders(),
  });
}

function parseUrl(value: string) {
  try {
    return new URL(value);
  } catch {
    return new URL(value.startsWith("/") ? `https://site.local${value}` : `https://site.local/${value}`);
  }
}

function stringOrNull(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "cache-control": "no-store",
  };
}
