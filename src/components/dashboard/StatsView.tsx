'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

type Site = { id:string; name:string; domain:string; site_key:string; plan:string; public_stats:boolean }

function MetricCard({label,value,change,up}:{label:string;value:string;change?:string|null;up?:boolean}) {
  return (
    <div className="bg-[#111118] border border-white/7 rounded-xl p-4">
      <div className="text-[11px] font-mono text-white/30 mb-2 uppercase tracking-wide">{label}</div>
      <div className="font-display text-3xl font-bold text-white">{value}</div>
      {change!=null && (
        <div className={`text-[11px] mt-1.5 ${up?'text-[#4ecca3]':'text-red-400'}`}>
          {up?'↑':'↓'} {Math.abs(Number(change))}% vs prev
        </div>
      )}
    </div>
  )
}

function TableCard({title,rows,col1,col2}:{title:string;rows:any[];col1:string;col2:string}) {
  if(!rows?.length) return (
    <div className="bg-[#111118] border border-white/7 rounded-xl p-4">
      <div className="text-[12px] font-mono text-white/30 mb-3 uppercase tracking-wide">{title}</div>
      <div className="text-xs text-white/20 text-center py-6">No data yet</div>
    </div>
  )
  const max = rows[0]?.[Object.keys(rows[0])[1]] ?? 1
  return (
    <div className="bg-[#111118] border border-white/7 rounded-xl p-4">
      <div className="flex justify-between text-[11px] font-mono text-white/30 mb-3 uppercase tracking-wide">
        <span>{title}</span><span>{col2}</span>
      </div>
      <div className="space-y-2">
        {rows.slice(0,8).map((r,i)=>{
          const k=Object.keys(r)[0], v=Object.values(r)[1] as number
          return (
            <div key={i} className="flex items-center gap-2">
              <div className="text-[12px] text-white min-w-0 flex-1 truncate">{r[k]}</div>
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#6c63ff] rounded-full" style={{width:`${Math.round(v/max*100)}%`}}/>
              </div>
              <div className="text-[11px] text-white/30 font-mono min-w-[40px] text-right">{v.toLocaleString()}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function StatsView({site,stats,loading,range,onRangeChange,onSiteUpdate}:{
  site:Site; stats:any; loading:boolean; range:string; onRangeChange:(r:any)=>void; onSiteUpdate:(site:Site)=>void
}) {
  const s = stats?.summary
  const fmtDur = (sec:number) => sec<60?`${sec}s`:`${Math.floor(sec/60)}m ${sec%60}s`
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://privpulse.vercel.app'
  const script = `<script async src="${appUrl}/p.js" data-site="${site.site_key}"></script>`
  const shareUrl = `${appUrl}/share?key=${site.site_key}`

  async function copy(text: string) {
    await navigator.clipboard?.writeText(text)
  }

  async function togglePublic() {
    const res = await fetch('/api/sites', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: site.id, public_stats: !site.public_stats })
    })
    const data = await res.json()
    if (res.ok) onSiteUpdate(data)
    else alert(data.error || 'Could not update sharing.')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">{site.name}</h2>
          <div className="text-[12px] text-white/30 mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ecca3] animate-pulse inline-block"/>
            Live · {stats?.liveCount??0} visitors now
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {site.plan === 'free' && (
            <a href={`/api/billing/checkout?plan=indie&siteId=${site.id}`}
              className="px-3 py-1 rounded-lg text-xs font-mono bg-[#6c63ff] text-white hover:bg-[#7c74ff] transition-colors">
              Upgrade
            </a>
          )}
          <button onClick={()=>copy(script)}
            className="px-3 py-1 rounded-lg text-xs font-mono border border-white/10 text-white/50 hover:text-white transition-colors">
            Copy script
          </button>
          <button onClick={togglePublic}
            className={`px-3 py-1 rounded-lg text-xs font-mono border transition-colors ${site.public_stats?'bg-[#4ecca3]/10 border-[#4ecca3]/20 text-[#4ecca3]':'border-white/10 text-white/40 hover:text-white'}`}>
            {site.public_stats ? 'Public on' : 'Make public'}
          </button>
          {site.public_stats && (
            <button onClick={()=>copy(shareUrl)}
              className="px-3 py-1 rounded-lg text-xs font-mono border border-white/10 text-white/50 hover:text-white transition-colors">
              Copy share link
            </button>
          )}
          {(['7d','30d','90d','12m'] as const).map(r=>(
            <button key={r} onClick={()=>onRangeChange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${range===r?'bg-[#6c63ff] text-white':'border border-white/10 text-white/40 hover:text-white'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricCard label="Unique visitors" value={loading?'—':(s?.visitors??0).toLocaleString()} change={s?.visitorsChange} up={(s?.visitorsChange??0)>0}/>
        <MetricCard label="Pageviews" value={loading?'—':(s?.pageviews??0).toLocaleString()} change={s?.pageviewsChange} up={(s?.pageviewsChange??0)>0}/>
        <MetricCard label="Bounce rate" value={loading?'—':`${s?.bounceRate??0}%`}/>
        <MetricCard label="Avg duration" value={loading?'—':fmtDur(s?.avgDurationSec??0)}/>
      </div>

      {/* Chart */}
      <div className="bg-[#111118] border border-white/7 rounded-xl p-4 mb-4">
        <div className="text-[12px] text-white/40 mb-4">Visitors over time</div>
        {loading || !stats?.timeSeries?.length ? (
          <div className="h-36 flex items-center justify-center text-xs text-white/20">{loading?'Loading…':'No data yet — add the script to your site'}</div>
        ) : (
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={stats.timeSeries} margin={{top:0,right:0,bottom:0,left:0}}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6c63ff" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#6c63ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="period" tick={{fontSize:10,fill:'#ffffff30'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:'#ffffff30'}} axisLine={false} tickLine={false} width={35}/>
              <Tooltip contentStyle={{background:'#16161f',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,fontSize:12}}
                labelStyle={{color:'#ffffff60'}} itemStyle={{color:'#6c63ff'}}/>
              <Area type="monotone" dataKey="visitors" stroke="#6c63ff" strokeWidth={2} fill="url(#grad)"/>
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <TableCard title="Top pages" rows={stats?.topPages??[]} col1="Page" col2="Views"/>
        <TableCard title="Sources" rows={(stats?.topSources??[]).map((r:any)=>({source:r.source,visitors:r.visitors}))} col1="Source" col2="Visitors"/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <TableCard title="Countries" rows={(stats?.topCountries??[]).map((r:any)=>({country:r.country,visitors:r.visitors}))} col1="Country" col2="Visitors"/>
        <TableCard title="Devices" rows={(stats?.topDevices??[]).map((r:any)=>({device:r.device,count:r.count}))} col1="Device" col2="Count"/>
      </div>

      {/* Embed code */}
      <div className="bg-[#111118] border border-white/7 rounded-xl p-4">
        <div className="text-[12px] font-mono text-white/30 uppercase tracking-wide mb-3">Your tracking script</div>
        <div className="bg-[#16161f] rounded-lg p-3 font-mono text-[11px] leading-loose text-white/70">
          <span className="text-[#6c63ff]">&lt;script</span> <span className="text-[#4ecca3]">async</span><br/>
          &nbsp;&nbsp;<span className="text-[#4ecca3]">src</span>=<span className="text-[#4ecca3]">&quot;{appUrl}/p.js&quot;</span><br/>
          &nbsp;&nbsp;<span className="text-[#4ecca3]">data-site</span>=<span className="text-[#4ecca3]">&quot;{site.site_key}&quot;</span><br/>
          <span className="text-[#6c63ff]">&gt;&lt;/script&gt;</span>
        </div>
        <div className="flex items-center justify-between gap-3 mt-2 flex-wrap">
          <p className="text-xs text-white/25">Paste this before &lt;/head&gt; on every page you want to track.</p>
          {site.public_stats && <a className="text-xs text-[#6c63ff] hover:underline" href={shareUrl} target="_blank">Open public dashboard</a>}
        </div>
      </div>
    </div>
  )
}
