import { randomUUID } from "crypto";
import { appUrl, hasSupabase } from "./config";
import { makeSessionHash, makeVisitorHash } from "./hash";
import { getSupabaseAdmin } from "./supabase";

type Site = {
  id: string;
  name: string;
  domain: string;
  owner_email: string;
  owner_name: string;
  public: boolean;
  created_at: string;
};

type EventRow = {
  id: string;
  site_id: string;
  type: "pageview" | "custom";
  event_name: string | null;
  path: string;
  title: string | null;
  referrer: string | null;
  referrer_host: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  country: string;
  country_name: string;
  city: string | null;
  device: string;
  browser: string | null;
  os: string | null;
  visitor_hash: string;
  session_hash: string;
  created_at: string;
};

const mockSites = new Map<string, Site>();
const mockEvents: EventRow[] = [];

seedDemo();

export function siteNameFromDomain(domain: string) {
  try {
    const url = domain.startsWith("http") ? new URL(domain) : new URL(`https://${domain}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return domain.replace(/^https?:\/\//, "").replace(/^www\./, "");
  }
}

export function makeSiteId() {
  return `pp_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

export function trackingScript(siteId: string) {
  return `<script async src="${appUrl}/p.js" data-site="${siteId}"></script>`;
}

export async function createSite(input: { name: string; email: string; domain: string }) {
  const site: Site = {
    id: makeSiteId(),
    name: siteNameFromDomain(input.domain),
    domain: input.domain,
    owner_email: input.email,
    owner_name: input.name,
    public: false,
    created_at: new Date().toISOString(),
  };

  if (hasSupabase) {
    const supabase = getSupabaseAdmin()!;
    const { error } = await supabase.from("sites").insert(site);
    if (error) throw error;
  } else {
    mockSites.set(site.id, site);
  }

  return {
    siteId: site.id,
    siteName: site.name,
    script: trackingScript(site.id),
  };
}

export async function collectEvent(input: {
  siteId: string;
  type: "pageview" | "custom";
  eventName?: string;
  path: string;
  url?: string;
  title?: string;
  referrer?: string;
  userAgent?: string;
  ip?: string;
  country?: string;
  countryName?: string;
  city?: string | null;
  device?: string;
  browser?: string | null;
  os?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  props?: Record<string, unknown> | null;
}) {
  const now = new Date().toISOString();
  const visitor = makeVisitorHash(input.siteId, input.ip ?? "local", input.userAgent ?? "unknown");
  const session = makeSessionHash(input.siteId, input.ip ?? "local", input.userAgent ?? "unknown");
  const row: EventRow = {
    id: randomUUID(),
    site_id: input.siteId,
    type: input.type,
    event_name: input.eventName ?? null,
    path: input.path || "/",
    title: input.title ?? null,
    referrer: input.referrer ? input.referrer.slice(0, 2048) : null,
    referrer_host: cleanReferrer(input.referrer),
    utm_source: input.utmSource ? input.utmSource.slice(0, 128) : null,
    utm_medium: input.utmMedium ? input.utmMedium.slice(0, 128) : null,
    utm_campaign: input.utmCampaign ? input.utmCampaign.slice(0, 128) : null,
    country: input.country ?? "Unknown",
    country_name: input.countryName ?? input.country ?? "Unknown",
    city: input.city ?? null,
    device: input.device ?? deviceFromAgent(input.userAgent ?? ""),
    browser: input.browser ?? null,
    os: input.os ?? null,
    visitor_hash: visitor,
    session_hash: session,
    created_at: now,
  };

  if (hasSupabase) {
    const supabase = getSupabaseAdmin()!;
    const { error } = await supabase.from("events").insert(row);
    if (error) throw error;
  } else {
    mockEvents.push(row);
  }
}

export async function getDashboard(siteId: string, range: string) {
  seedDemo();
  const since = dateFromRange(range);
  let site = mockSites.get(siteId) ?? mockSites.get("pp_demo_india")!;
  let events = mockEvents.filter((event) => event.site_id === site.id && new Date(event.created_at) >= since);

  if (hasSupabase && siteId !== "pp_demo_india") {
    const supabase = getSupabaseAdmin()!;
    const { data: siteData } = await supabase.from("sites").select("*").eq("id", siteId).maybeSingle();
    if (siteData) site = siteData as Site;
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("site_id", site.id)
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });
    events = (data as EventRow[]) ?? [];
  }

  const pageviews = events.filter((event) => event.type === "pageview");
  const customEvents = events.filter((event) => event.type === "custom");
  const visitors = new Set(events.map((event) => event.visitor_hash)).size;
  const realtime = events.filter((event) => Date.now() - new Date(event.created_at).getTime() < 5 * 60 * 1000).length;

  return {
    site: { id: site.id, name: site.name, domain: site.domain, public: site.public },
    realtime,
    metrics: {
      visitors,
      pageviews: pageviews.length,
      events: customEvents.length,
      bounceRate: Math.max(28, Math.min(72, 52 - Math.round(customEvents.length / 80))),
    },
    series: series(pageviews, range),
    topPages: top(pageviews.map((event) => event.path), 6),
    referrers: top(pageviews.map((event) => event.referrer_host || "Direct"), 6),
    countries: top(pageviews.map((event) => event.country_name || event.country), 5),
    devices: top(pageviews.map((event) => event.device), 4),
    events: top(customEvents.map((event) => event.event_name || "custom"), 5),
  };
}

export async function getDigestTargets() {
  if (!hasSupabase) {
    return Array.from(mockSites.values());
  }
  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase.from("sites").select("*");
  if (error) throw error;
  return (data as Site[]) ?? [];
}

function cleanReferrer(referrer?: string) {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return referrer.slice(0, 80);
  }
}

function deviceFromAgent(agent: string) {
  const text = agent.toLowerCase();
  if (/mobile|iphone|android/.test(text)) return "Mobile";
  if (/ipad|tablet/.test(text)) return "Tablet";
  return "Desktop";
}

function dateFromRange(range: string) {
  const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function series(events: EventRow[], range: string) {
  const buckets = range === "7d" ? 7 : range === "90d" ? 12 : 10;
  const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
  const result = Array.from({ length: buckets }, () => ({ label: "", pageviews: 0 }));
  const start = new Date();
  start.setDate(start.getDate() - days);

  events.forEach((event) => {
    const diff = new Date(event.created_at).getTime() - start.getTime();
    const bucket = Math.max(0, Math.min(buckets - 1, Math.floor((diff / (days * 86400000)) * buckets)));
    result[bucket].pageviews += 1;
  });

  return result.map((point, index) => ({ ...point, label: `${index + 1}` }));
}

function top(values: string[], limit: number) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

function seedDemo() {
  if (mockSites.has("pp_demo_india")) return;

  mockSites.set("pp_demo_india", {
    id: "pp_demo_india",
    name: "mystore.in",
    domain: "https://mystore.in",
    owner_email: "founder@mystore.in",
    owner_name: "Demo Founder",
    public: true,
    created_at: new Date().toISOString(),
  });

  const pages = ["/pricing", "/features", "/", "/blog/ga4-alternative", "/signup", "/docs"];
  const refs = ["google.com", "Direct", "twitter.com", "producthunt.com", "reddit.com"];
  const countries = ["India", "United States", "United Kingdom", "Singapore", "Germany"];
  const devices = ["Mobile", "Desktop", "Tablet"];
  const eventNames = ["signup", "whatsapp_click", "pricing_cta", "demo_opened"];

  for (let i = 0; i < 620; i += 1) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    mockEvents.push({
      id: randomUUID(),
      site_id: "pp_demo_india",
      type: Math.random() > 0.82 ? "custom" : "pageview",
      event_name: Math.random() > 0.82 ? eventNames[Math.floor(Math.random() * eventNames.length)] : null,
      path: pages[Math.floor(Math.random() * pages.length)],
      title: "Demo page",
      referrer: refs[Math.floor(Math.random() * refs.length)],
      referrer_host: refs[Math.floor(Math.random() * refs.length)],
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      country: countries[Math.floor(Math.random() * countries.length)],
      country_name: countries[Math.floor(Math.random() * countries.length)],
      city: null,
      device: devices[Math.floor(Math.random() * devices.length)],
      browser: "Chrome",
      os: "Windows",
      visitor_hash: `visitor_${Math.floor(Math.random() * 180)}`,
      session_hash: `session_${Math.floor(Math.random() * 240)}`,
      created_at: date.toISOString(),
    });
  }
}
