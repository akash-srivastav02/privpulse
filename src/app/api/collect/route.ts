import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { parseRequest, getIp } from '@/lib/parse-request'
import { makeVisitorHash, makeSessionHash } from '@/lib/hash'
import { isRateLimited } from '@/lib/rate-limit'
import { isOverLimit } from '@/lib/plans'

const BOT = /bot|crawler|spider|headless|phantom|selenium|puppeteer|curl|wget|python-requests/i
const ok = () => new NextResponse(null, { status:200, headers:{'Access-Control-Allow-Origin':'*','Cache-Control':'no-store'} })

export async function OPTIONS() { return ok() }

export async function POST(request: NextRequest) {
  try {
    const ua = request.headers.get('user-agent') || ''
    if (BOT.test(ua)) return ok()

    const ip = getIp(request)
    if (await isRateLimited(ip)) return ok()

    let body: any
    try { body = await request.json() } catch { return ok() }

    const { type='pageview', siteKey, url, referrer, utmSource, utmMedium, utmCampaign, eventName, props } = body
    if (!siteKey || !url) return ok()

    const supabase = createServiceClient()
    const { data: site } = await supabase.from('sites').select('id,plan,domain').eq('site_key', siteKey).maybeSingle()
    if (!site) return ok()

    if (await isOverLimit(site.id, site.plan, supabase)) return ok()

    const parsed = parseRequest(request)
    let pathname = '/'
    try { pathname = new URL(url).pathname } catch {}

    let referrerHost = parsed.referrerHost
    if (referrer) {
      try {
        const rh = new URL(referrer).hostname.replace(/^www\./, '')
        referrerHost = rh.includes(site.domain) ? null : rh
      } catch {}
    }

    const [visitorHash, sessionHash] = await Promise.all([
      makeVisitorHash(ip, ua, site.id),
      makeSessionHash(ip, ua, site.id)
    ])

    if (type === 'event' && eventName) {
      await supabase.from('events').insert({
        site_id: site.id, name: String(eventName).slice(0,64),
        url: String(url).slice(0,2048), pathname,
        visitor_hash: visitorHash, props: props ?? null
      })
    } else {
      await supabase.from('pageviews').insert({
        site_id: site.id, url: String(url).slice(0,2048), pathname,
        referrer: referrer ? String(referrer).slice(0,2048) : null,
        referrer_host: referrerHost,
        utm_source: utmSource||null, utm_medium: utmMedium||null, utm_campaign: utmCampaign||null,
        visitor_hash: visitorHash, session_hash: sessionHash,
        country: parsed.country, country_name: parsed.countryName, city: parsed.city,
        device_type: parsed.deviceType, browser: parsed.browser, os: parsed.os
      })
    }
    return ok()
  } catch (err) {
    console.error('[collect]', err)
    return ok()
  }
}
