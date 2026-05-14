import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDashboard, getDigestTargets } from "@/lib/analytics";
import { hasResend } from "@/lib/config";

export async function POST(request: Request) {
  return sendDigests(request);
}

export async function GET(request: Request) {
  return sendDigests(request);
}

async function sendDigests(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (process.env.CRON_SECRET && token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasResend) {
    return NextResponse.json({ sent: 0, skipped: true, reason: "RESEND_API_KEY not configured" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const sites = await getDigestTargets();
  let sent = 0;

  for (const site of sites) {
    const dashboard = await getDashboard(site.id, "7d");
    await resend.emails.send({
      from: process.env.DIGEST_FROM_EMAIL ?? "PrivPulse <digest@privpulse.in>",
      to: site.owner_email,
      subject: `${site.name} weekly traffic summary`,
      html: digestHtml(site.name, dashboard),
    });
    sent += 1;
  }

  return NextResponse.json({ sent });
}

function digestHtml(siteName: string, dashboard: Awaited<ReturnType<typeof getDashboard>>) {
  const topPage = dashboard.topPages[0]?.label ?? "No pageviews yet";
  const topReferrer = dashboard.referrers[0]?.label ?? "Direct";

  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#191a17">
      <h1>${siteName} weekly digest</h1>
      <p>Your site received <strong>${dashboard.metrics.pageviews.toLocaleString()}</strong> pageviews from <strong>${dashboard.metrics.visitors.toLocaleString()}</strong> visitors.</p>
      <ul>
        <li>Top page: ${topPage}</li>
        <li>Top referrer: ${topReferrer}</li>
        <li>Custom events: ${dashboard.metrics.events.toLocaleString()}</li>
      </ul>
      <p style="color:#666">Sent by PrivPulse. Privacy-first analytics without cookies.</p>
    </div>
  `;
}
