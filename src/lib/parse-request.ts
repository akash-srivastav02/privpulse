export interface ParsedRequest {
  country: string;
  countryName: string;
  city: string | null;
  device: "Mobile" | "Desktop" | "Tablet";
  browser: string | null;
  os: string | null;
  ip: string;
}

const countryNames: Record<string, string> = {
  IN: "India",
  US: "United States",
  GB: "United Kingdom",
  SG: "Singapore",
  AU: "Australia",
  CA: "Canada",
  DE: "Germany",
  FR: "France",
  JP: "Japan",
  AE: "UAE",
  MY: "Malaysia",
  PH: "Philippines",
};

export function getIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1"
  );
}

export function parseRequest(request: Request): ParsedRequest {
  const userAgent = request.headers.get("user-agent") ?? "";
  const country = request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country") || "Unknown";

  return {
    country,
    countryName: countryNames[country] ?? country,
    city: request.headers.get("cf-ipcity") || request.headers.get("x-vercel-ip-city"),
    device: detectDevice(userAgent),
    browser: detectBrowser(userAgent),
    os: detectOs(userAgent),
    ip: getIp(request),
  };
}

function detectDevice(userAgent: string): "Mobile" | "Desktop" | "Tablet" {
  const text = userAgent.toLowerCase();
  if (/ipad|tablet|kindle|playbook|silk/.test(text)) return "Tablet";
  if (/mobile|android|iphone|ipod|blackberry|windows phone/.test(text)) return "Mobile";
  return "Desktop";
}

function detectBrowser(userAgent: string) {
  if (/Edg\//.test(userAgent)) return "Edge";
  if (/OPR\/|Opera/.test(userAgent)) return "Opera";
  if (/Chrome\//.test(userAgent) && !/Chromium/.test(userAgent)) return "Chrome";
  if (/Firefox\//.test(userAgent)) return "Firefox";
  if (/Safari\//.test(userAgent) && !/Chrome/.test(userAgent)) return "Safari";
  if (/MSIE|Trident/.test(userAgent)) return "IE";
  return null;
}

function detectOs(userAgent: string) {
  if (/Windows/.test(userAgent)) return "Windows";
  if (/Android/.test(userAgent)) return "Android";
  if (/iPhone|iPad|iPod/.test(userAgent)) return "iOS";
  if (/Macintosh/.test(userAgent)) return "macOS";
  if (/Linux/.test(userAgent)) return "Linux";
  return null;
}
