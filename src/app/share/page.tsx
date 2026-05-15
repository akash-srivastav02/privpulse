'use client'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Stats = {
  site?: { name:string; domain:string }
  summary?: { visitors:number; pageviews:number; bounceRate:number }
  topPages?: Array<{ pathname:string; pageviews:number }>
  topSources?: Array<{ source:string; visitors:number }>
  liveCount?: number
  error?: string
}

function Rows({ rows, labelKey, valueKey }: { rows:any[]; labelKey:string; valueKey:string }) {
  const max = Number(rows?.[0]?.[valueKey] ?? 1)
  return (
    <div className="space-y-2">
      {rows?.length ? rows.slice(0, 8).map(row => (
        <div key={row[labelKey]} className="flex items-center gap-2">
          <div className="text-[12px] min-w-[120px] truncate">{row[labelKey]}</div>
          <div className="h-1 flex-1 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-[#6c63ff]" style={{ width: `${Math.round(Number(row[valueKey]) / max * 100)}%` }} />
          </div>
          <div className="text-[11px] text-white/30 font-mono min-w-[44px] text-right">{Number(row[valueKey]).toLocaleString()}</div>
        </div>
      )) : <div className="text-xs text-white/25 py-6 text-center">No data yet</div>}
    </div>
  )
}

function ShareContent() {
  const key = useSearchParams().get('key')
  const [stats, setStats] = useState<Stats|null>(null)

  useEffect(() => {
    if (!key) return
    fetch(`/api/stats?siteKey=${encodeURIComponent(key)}&range=30d&public=1`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => setStats({ error: 'Could not load dashboard.' }))
  }, [key])

  if (!key) return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-4xl mb-3">📊</div>
        <h2 className="font-display text-xl font-bold mb-2">Public dashboard</h2>
        <p className="text-white/40 text-sm">Add a site key to the URL: /share?key=pp_xxx</p>
      </div>
    </main>
  )

  if (!stats) return <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center text-sm text-white/40">Loading dashboard...</main>

  if (stats.error) return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <h2 className="font-display text-xl font-bold mb-2">Dashboard unavailable</h2>
        <p className="text-white/40 text-sm">{stats.error}</p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4ecca3] shadow-[0_0_8px_#4ecca3]" />
          <span className="font-display font-bold text-sm">Priv<span className="text-[#4ecca3]">Pulse</span></span>
        </Link>
        <span className="text-xs text-white/30">Public stats</span>
      </header>
      <section className="max-w-5xl mx-auto p-5 md:p-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold">{stats.site?.name}</h1>
          <p className="text-sm text-white/35 mt-1">{stats.site?.domain} · <span className="text-[#4ecca3]">{stats.liveCount ?? 0} live now</span></p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-[#111118] border border-white/7 rounded-xl p-4"><div className="text-[11px] font-mono text-white/30 mb-2">VISITORS</div><div className="font-display text-3xl font-bold">{(stats.summary?.visitors ?? 0).toLocaleString()}</div></div>
          <div className="bg-[#111118] border border-white/7 rounded-xl p-4"><div className="text-[11px] font-mono text-white/30 mb-2">PAGEVIEWS</div><div className="font-display text-3xl font-bold">{(stats.summary?.pageviews ?? 0).toLocaleString()}</div></div>
          <div className="bg-[#111118] border border-white/7 rounded-xl p-4"><div className="text-[11px] font-mono text-white/30 mb-2">BOUNCE RATE</div><div className="font-display text-3xl font-bold">{stats.summary?.bounceRate ?? 0}%</div></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-[#111118] border border-white/7 rounded-xl p-4">
            <div className="flex justify-between text-[11px] font-mono text-white/30 mb-3"><span>TOP PAGES</span><span>VIEWS</span></div>
            <Rows rows={stats.topPages ?? []} labelKey="pathname" valueKey="pageviews" />
          </div>
          <div className="bg-[#111118] border border-white/7 rounded-xl p-4">
            <div className="flex justify-between text-[11px] font-mono text-white/30 mb-3"><span>SOURCES</span><span>VISITORS</span></div>
            <Rows rows={stats.topSources ?? []} labelKey="source" valueKey="visitors" />
          </div>
        </div>
      </section>
    </main>
  )
}

export default function SharePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center text-sm text-white/40">Loading dashboard...</main>}>
      <ShareContent />
    </Suspense>
  )
}
