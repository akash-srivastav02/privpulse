import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const CHECKOUTS: Record<string, string | undefined> = {
  indie: process.env.LEMON_SQUEEZY_INDIE_CHECKOUT_URL || process.env.LEMONSQUEEZY_INDIE_CHECKOUT_URL,
  pro: process.env.LEMON_SQUEEZY_AGENCY_CHECKOUT_URL || process.env.LEMONSQUEEZY_PRO_CHECKOUT_URL,
}

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  const plan = request.nextUrl.searchParams.get('plan') || 'indie'
  const siteId = request.nextUrl.searchParams.get('siteId') || ''
  const checkout = CHECKOUTS[plan]
  if (!checkout) {
    return NextResponse.redirect(new URL(`/dashboard?billing=missing&plan=${encodeURIComponent(plan)}`, request.url))
  }

  const url = new URL(checkout)
  url.searchParams.set('checkout[email]', user.email || '')
  url.searchParams.set('checkout[custom][user_id]', user.id)
  url.searchParams.set('checkout[custom][plan]', plan)
  if (siteId) url.searchParams.set('checkout[custom][site_id]', siteId)

  return NextResponse.redirect(url)
}
