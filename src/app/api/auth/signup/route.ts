import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { normalizeDomain, siteNameFromDomain } from '@/lib/site'
import { getIp } from '@/lib/parse-request'
import { isRateLimited } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  if (await isRateLimited(`signup:${getIp(request)}`)) {
    return NextResponse.json({ error: 'Too many signup attempts. Please try again in a minute.' }, { status: 429 })
  }

  const { email, password, name, website } = await request.json()
  const cleanEmail = String(email || '').trim().toLowerCase()
  const cleanPassword = String(password || '')
  const displayName = String(name || '').trim()

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  }
  if (cleanPassword.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase.auth.admin.createUser({
    email: cleanEmail,
    password: cleanPassword,
    email_confirm: true,
    user_metadata: { name: displayName },
  })

  if (error) {
    const message = error.message.includes('already')
      ? 'An account with this email already exists. Please sign in.'
      : error.message
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const domain = normalizeDomain(String(website || ''))
  let site = null
  if (domain && data.user?.id) {
    const { data: created, error: siteError } = await supabase
      .from('sites')
      .insert({
        user_id: data.user.id,
        name: siteNameFromDomain(domain),
        domain,
      })
      .select('*')
      .single()

    if (siteError) {
      return NextResponse.json({ error: siteError.message }, { status: 400 })
    }
    site = created
  }

  return NextResponse.json({ ok: true, site })
}
