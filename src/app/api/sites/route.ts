import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { normalizeDomain } from '@/lib/site'
import { PLANS, type Plan } from '@/lib/plans'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({error:'Unauthorized'},{status:401})
  const { data } = await supabase.from('sites').select('*').eq('user_id',user.id).order('created_at')
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({error:'Unauthorized'},{status:401})
  const { name, domain } = await request.json()
  if (!name || !domain) return NextResponse.json({error:'name and domain required'},{status:400})

  const { data: existing } = await supabase.from('sites').select('plan').eq('user_id', user.id)
  const rank: Plan[] = ['free', 'indie', 'pro']
  const bestPlan = (existing ?? []).reduce<Plan>((best, site) => {
    const plan = (site.plan in PLANS ? site.plan : 'free') as Plan
    return rank.indexOf(plan) > rank.indexOf(best) ? plan : best
  }, 'free')
  if ((existing?.length ?? 0) >= PLANS[bestPlan].sites) {
    return NextResponse.json({error:`Your ${bestPlan} plan allows ${PLANS[bestPlan].sites} site(s). Upgrade to add more.`},{status:403})
  }

  const { data, error } = await supabase.from('sites').insert({ name, domain: normalizeDomain(domain), user_id:user.id }).select().single()
  if (error) return NextResponse.json({error:error.message},{status:400})
  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({error:'Unauthorized'},{status:401})

  const { id, public_stats, name, domain } = await request.json()
  if (!id) return NextResponse.json({error:'id required'},{status:400})

  const updates: Record<string, unknown> = {}
  if (typeof public_stats === 'boolean') updates.public_stats = public_stats
  if (typeof name === 'string' && name.trim()) updates.name = name.trim()
  if (typeof domain === 'string' && domain.trim()) updates.domain = normalizeDomain(domain)
  if (!Object.keys(updates).length) return NextResponse.json({error:'no changes provided'},{status:400})

  const { data, error } = await supabase
    .from('sites')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error) return NextResponse.json({error:error.message},{status:400})
  return NextResponse.json(data)
}
