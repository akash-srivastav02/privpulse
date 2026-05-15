import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

const INTERVALS: Record<string,string> = { '7d':'7 days','30d':'30 days','90d':'90 days','12m':'365 days' }

function agg(data: any[], key: string): any[] {
  const counts: Record<string,number> = {}
  for (const row of data) { const k = row[key]; if (k) counts[k] = (counts[k]??0)+1 }
  return Object.entries(counts).sort(([,a],[,b])=>b-a).slice(0,10).map(([k,v])=>({[key]:k,count:v}))
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const siteKey = searchParams.get('siteKey')
  const range = searchParams.get('range') ?? '30d'
  const interval = INTERVALS[range] ?? '30 days'
  if (!siteKey) return NextResponse.json({error:'siteKey required'},{status:400})

  const supabase = createServiceClient()
  const { data: site } = await supabase.from('sites').select('id,name,domain,public_stats').eq('site_key', siteKey).maybeSingle()
  if (!site) return NextResponse.json({error:'Not found'},{status:404})

  const since = new Date(Date.now() - parseInt(interval)*24*60*60*1000/1).toISOString()
  const since5m = new Date(Date.now() - 5*60*1000).toISOString()

  const [pvRes, evRes, liveRes, summaryRes, tsRes] = await Promise.all([
    supabase.from('pageviews').select('pathname,referrer_host,country_name,device_type,visitor_hash,session_hash,timestamp').eq('site_id',site.id).gte('timestamp',since),
    supabase.from('events').select('name').eq('site_id',site.id).gte('timestamp',since),
    supabase.from('pageviews').select('visitor_hash',{count:'exact',head:true}).eq('site_id',site.id).gte('timestamp',since5m),
    supabase.rpc('get_summary',{p_site_id:site.id,p_interval:interval}),
    supabase.rpc('get_time_series',{p_site_id:site.id,p_interval:interval}),
  ])

  const pvData = pvRes.data ?? []

  // Aggregate top pages
  const pageCounts: Record<string,number> = {}
  for (const r of pvData) pageCounts[r.pathname] = (pageCounts[r.pathname]??0)+1
  const topPages = Object.entries(pageCounts).sort(([,a],[,b])=>b-a).slice(0,10).map(([pathname,pageviews])=>({pathname,pageviews}))

  // Sources
  const srcCounts: Record<string,number> = {}
  for (const r of pvData) { const s = r.referrer_host; if(s) srcCounts[s]=(srcCounts[s]??0)+1 }
  const topSources = Object.entries(srcCounts).sort(([,a],[,b])=>b-a).slice(0,10).map(([source,visitors])=>({source,visitors}))

  // Countries
  const ctrCounts: Record<string,number> = {}
  for (const r of pvData) { const c = r.country_name; if(c) ctrCounts[c]=(ctrCounts[c]??0)+1 }
  const topCountries = Object.entries(ctrCounts).sort(([,a],[,b])=>b-a).slice(0,10).map(([country,visitors])=>({country,visitors}))

  // Devices
  const devCounts: Record<string,number> = {}
  for (const r of pvData) { const d = r.device_type; if(d) devCounts[d]=(devCounts[d]??0)+1 }
  const topDevices = Object.entries(devCounts).sort(([,a],[,b])=>b-a).map(([device,count])=>({device,count}))

  // Events
  const evCounts: Record<string,number> = {}
  for (const r of evRes.data??[]) evCounts[r.name]=(evCounts[r.name]??0)+1
  const topEvents = Object.entries(evCounts).sort(([,a],[,b])=>b-a).slice(0,10).map(([event,count])=>({event,count}))

  return NextResponse.json({
    site: { name:site.name, domain:site.domain },
    summary: summaryRes.data,
    timeSeries: tsRes.data,
    topPages, topSources, topCountries, topDevices, topEvents,
    liveCount: liveRes.count ?? 0,
  })
}
