import { NextResponse } from "next/server";
import { createSite } from "@/lib/analytics";
import { setSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    const body =
      contentType.includes("application/json")
        ? await request.json()
        : Object.fromEntries(await request.formData());
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const domain = String(body.domain ?? "").trim();

    if (!name || !email.includes("@") || !domain) {
      return NextResponse.json({ error: "Name, email, and website URL are required." }, { status: 400 });
    }

    const site = await createSite({ name, email, domain });
    await setSession(email);
    if (!contentType.includes("application/json")) {
      return new Response(successHtml(site.siteName, site.script), {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    return NextResponse.json(site);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not create site." }, { status: 500 });
  }
}

function successHtml(siteName: string, script: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PrivPulse site created</title>
  <style>
    body{margin:0;background:#f6f3ec;color:#191a17;font-family:Arial,sans-serif}
    main{max-width:720px;margin:0 auto;padding:56px 20px}
    .card{background:white;border:1px solid rgba(0,0,0,.1);border-radius:8px;padding:28px;box-shadow:0 20px 50px rgba(0,0,0,.06)}
    pre{white-space:pre-wrap;overflow:auto;background:#111;color:white;border-radius:6px;padding:18px;font-size:13px;line-height:1.7}
    a{display:inline-block;margin-top:18px;background:#111;color:white;text-decoration:none;border-radius:6px;padding:12px 16px}
    p{color:rgba(0,0,0,.6);line-height:1.7}
  </style>
</head>
<body>
  <main>
    <div class="card">
      <p>Site created</p>
      <h1>${escapeHtml(siteName)}</h1>
      <p>Paste this script before the closing head tag on your website.</p>
      <pre>${escapeHtml(script)}</pre>
      <a href="/app">Open app</a>
    </div>
  </main>
</body>
</html>`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return map[char];
  });
}
