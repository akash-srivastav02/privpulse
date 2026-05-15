import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase-server'

function verifySignature(body: string, signature: string | null, secret: string) {
  if (!signature) return false
  const digest = crypto.createHmac('sha256', secret).update(body).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
  } catch {
    return false
  }
}

function planFromPayload(payload: any) {
  const customPlan = payload?.meta?.custom_data?.plan || payload?.data?.attributes?.custom_data?.plan
  if (customPlan === 'indie' || customPlan === 'pro' || customPlan === 'free') return customPlan
  const name = String(payload?.data?.attributes?.product_name || payload?.data?.attributes?.variant_name || '').toLowerCase()
  if (name.includes('pro')) return 'pro'
  if (name.includes('indie')) return 'indie'
  return null
}

export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || process.env.LEMON_SQUEEZY_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Webhook secret is not configured' }, { status: 500 })

  const body = await request.text()
  if (!verifySignature(body, request.headers.get('x-signature'), secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(body)
  const event = payload?.meta?.event_name
  const custom = payload?.meta?.custom_data || payload?.data?.attributes?.custom_data || {}
  const plan = event?.includes('cancelled') || event?.includes('expired') ? 'free' : planFromPayload(payload)
  const userId = custom.user_id
  const siteId = custom.site_id

  if (!plan || (!userId && !siteId)) {
    return NextResponse.json({ ok: true, ignored: true })
  }

  const supabase = createServiceClient()
  let query = supabase.from('sites').update({ plan })
  query = siteId ? query.eq('id', siteId) : query.eq('user_id', userId)
  const { error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, event, plan })
}
