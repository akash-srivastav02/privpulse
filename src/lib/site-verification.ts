import { appUrl } from "./config";

export type VerificationResult = {
  ok: boolean;
  status: "installed" | "missing" | "unreachable" | "invalid-url";
  message: string;
};

export async function verifyTrackingInstall(domain: string, siteId: string): Promise<VerificationResult> {
  const target = normalizeSiteUrl(domain);
  if (!target) {
    return {
      ok: false,
      status: "invalid-url",
      message: "Enter a valid website URL, including the domain.",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(target, {
      headers: {
        "user-agent": "PrivPulse install verifier (+https://privpulse.vercel.app)",
      },
      signal: controller.signal,
    });
    const html = await response.text();
    const scriptUrl = `${appUrl}/p.js`;
    const hasScriptUrl = html.includes(scriptUrl) || html.includes("/p.js");
    const hasSiteId = html.includes(`data-site="${siteId}"`) || html.includes(`data-site='${siteId}'`);

    if (response.ok && hasScriptUrl && hasSiteId) {
      return {
        ok: true,
        status: "installed",
        message: "Tracking script found on the website.",
      };
    }

    return {
      ok: false,
      status: "missing",
      message: "Tracking script was not found in the website HTML.",
    };
  } catch {
    return {
      ok: false,
      status: "unreachable",
      message: "Could not reach the website to verify the install.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeSiteUrl(domain: string) {
  const trimmed = domain.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    url.pathname = url.pathname === "/" ? "/" : url.pathname;
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}
