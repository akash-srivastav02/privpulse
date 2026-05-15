'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import StatsView from './StatsView'
import SitesList from './SitesList'
import AddSiteModal from './AddSiteModal'
import TopBar from '../layout/TopBar'

type Site = { id:string; name:string; domain:string; site_key:string; plan:string; public_stats:boolean }
type User = { id:string; email?:string; user_metadata?:{ name?:string } }

export default function DashboardClient({ user, initialSites }: { user:User; initialSites:Site[] }) {
  const [sites, setSites] = useState<Site[]>(initialSites)
  const [activeSite, setActiveSite] = useState<Site|null>(initialSites[0]??null)
  const [showAdd, setShowAdd] = useState(false)
  const [range, setRange] = useState<'7d'|'30d'|'90d'|'12m'>('30d')
  const [stats, setStats] = useState<any>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const fetchStats = useCallback(async (site: Site, r: string) => {
    setLoadingStats(true)
    try {
      const res = await fetch(`/api/stats?siteKey=${site.site_key}&range=${r}`)
      const data = await res.json()
      setStats(data)
    } finally { setLoadingStats(false) }
  }, [])

  useEffect(() => {
    if (activeSite) fetchStats(activeSite, range)
  }, [activeSite, range, fetchStats])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleAddSite(name: string, domain: string) {
    const { data, error } = await supabase.from('sites').insert({ name, domain, user_id: user.id }).select().single()
    if (!error && data) {
      setSites(prev => [...prev, data])
      setActiveSite(data)
      setShowAdd(false)
    }
    return error?.message
  }

  if (sites.length === 0) return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <TopBar user={user} onLogout={handleLogout} />
      <div className="flex-1 flex items-center justify-center flex-col gap-4 text-center px-4">
        <div className="text-5xl">📊</div>
        <h2 className="font-display text-2xl font-bold">Add your first site</h2>
        <p className="text-white/40 text-sm max-w-xs">Paste one script tag and start tracking visitors in 60 seconds.</p>
        <button onClick={()=>setShowAdd(true)} className="mt-2 px-6 py-3 bg-[#6c63ff] rounded-xl text-sm font-medium hover:bg-[#7c74ff] transition-colors">
          Add site →
        </button>
      </div>
      {showAdd && <AddSiteModal onAdd={handleAddSite} onClose={()=>setShowAdd(false)} />}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <TopBar user={user} onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-[#111118] border-r border-white/5 flex flex-col py-4 shrink-0">
          <div className="px-3 mb-2">
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest px-2 mb-1">Your sites</p>
            {sites.map(s=>(
              <button key={s.id} onClick={()=>setActiveSite(s)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left mb-0.5 transition-colors ${activeSite?.id===s.id?'bg-[#6c63ff]/15 text-[#6c63ff]':'text-white/50 hover:text-white hover:bg-white/4'}`}>
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeSite?.id===s.id?'bg-[#6c63ff]':'bg-white/20'}`}/>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium truncate">{s.name}</div>
                  <div className="text-[11px] text-white/25 truncate">{s.domain}</div>
                </div>
              </button>
            ))}
            <button onClick={()=>setShowAdd(true)}
              className="w-full mt-2 text-left px-2 py-1.5 text-[12px] text-white/25 hover:text-white/50 transition-colors rounded-lg">
              + Add site
            </button>
          </div>
          <div className="mt-auto px-3">
            <div className={`px-2 py-1 rounded text-[11px] font-mono ${activeSite?.plan==='pro'?'text-[#4ecca3] bg-[#4ecca3]/10':activeSite?.plan==='indie'?'text-[#6c63ff] bg-[#6c63ff]/10':'text-white/30 bg-white/5'}`}>
              {(activeSite?.plan??'free').toUpperCase()} plan
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeSite && (
            <StatsView site={activeSite} stats={stats} loading={loadingStats} range={range} onRangeChange={setRange} />
          )}
        </main>
      </div>
      {showAdd && <AddSiteModal onAdd={handleAddSite} onClose={()=>setShowAdd(false)} />}
    </div>
  )
}
