import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase-server'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const from = process.env.EMAIL_FROM || process.env.AUTH_FROM_EMAIL || 'PrivPulse <onboarding@resend.dev>'

function checkCronSecret(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return true
  const header = request.headers.get('authorization') || ''
  return header === `Bearer ${secret}`
}

function html(site: any, summary: any, topPages: any[], topSources: any[]) {
  const visitors = Number(summary?.visitors ?? 0).toLocaleString()
  const pageviews = Number(summary?.pageviews ?? 0).toLocaleString()
  const bounce = summary?.bounceRate ?? 0
  const rows = (items: any[], key: string, value: string) =>
    items.slice(0, 5).map(item => `<tr><td style="padding:8px 0;color:#f0f0f8">${item[key]}</td><td style="padding:8px 0;text-align:right;color:#8888aa">${Number(item[value]).toLocaleString()}</td></tr>`).join('')

  return `
  <div style="background:#0a0a0f;color:#f0f0f8;font-family:Inter,Arial,sans-serif;padding:28px">
    <div style="max-width:620px;margin:0 auto;background:#111118;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:24px">
      <p style="color:#4ecca3;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px">Weekly digest</p>
      <h1 style="margin:0 0 6px;font-size:24px">${site.name}</h1>
      <p style="margin:0 0 22px;color:#8888aa">${site.domain}</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:22px">
        <div style="background:#16161f;border-radius:10px;padding:14px"><div style="color:#555570;font-size:11px">VISITORS</div><div style="font-size:24px;font-weight:700">${visitors}</div></div>
        <div style="background:#16161f;border-radius:10px;padding:14px"><div style="color:#555570;font-size:11px">PAGEVIEWS</div><div style="font-size:24px;font-weight:700">${pageviews}</div></div>
        <div style="background:#16161f;border-radius:10px;padding:14px"><div style="color:#555570;font-size:11px">BOUNCE</div><div style="font-size:24px;font-weight:700">${bounce}%</div></div>
      </div>
      <h2 style="font-size:14px;color:#8888aa">Top pages</h2>
      <table style="width:100%;border-collapse:collapse">${rows(topPages, 'pathname', 'pageviews') || '<tr><td style="color:#555570">No pageviews yet</td></tr>'}</table>
      <h2 style="font-size:14px;color:#8888aa;margin-top:22px">Top sources</h2>
      <table style="width:100%;border-collapse:collapse">${rows(topSources, 'source', 'visitors') || '<tr><td style="color:#555570">No referrers yet</td></tr>'}</table>
      <p style="color:#555570;font-size:12px;margin-top:24px">Sent by PrivPulse. No cookies, no banners.</p>
    </div>
  </div>`
}

export async function GET(request: NextRequest) {
  if (!checkCronSecret(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!resend) return NextResponse.json({ error: 'RESEND_API_KEY is not configured' }, { status: 500 })

  const supabase = createServiceClient()
  const { data: sites, error } = await supabase.from('sites').select('*').order('created_at')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let sent = 0
  const failures: string[] = []
  for (const site of sites ?? []) {
    const user = await supabase.auth.admin.getUserById(site.user_id)
    const email = user.data.user?.email
    if (!email) continue

    const [summaryRes, statsRes] = await Promise.all([
      supabase.rpc('get_summary', { p_site_id: site.id, p_interval: '7 days' }),
      fetch(`${request.nextUrl.origin}/api/stats?siteKey=${site.site_key}&range=7d`).then(r => r.json()),
    ])

    const result = await resend.emails.send({
      from,
      to: email,
      subject: `PrivPulse weekly digest: ${site.name}`,
      html: html(site, summaryRes.data, statsRes.topPages ?? [], statsRes.topSources ?? []),
    })

    if (result.error) failures.push(`${site.domain}: ${result.error.message}`)
    else sent += 1
  }

  return NextResponse.json({ ok: true, sent, failures })
}
