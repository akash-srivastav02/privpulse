'use client'
import { useState } from 'react'

export default function AddSiteModal({onAdd,onClose}:{onAdd:(name:string,domain:string)=>Promise<string|undefined>;onClose:()=>void}) {
  const [name,setName]=useState('')
  const [domain,setDomain]=useState('')
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(false)

  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    const clean = domain.replace(/^https?:\/\//,'').replace(/\/.*$/,'')
    const err = await onAdd(name, clean)
    if(err){setError(err);setLoading(false)}
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
        <h3 className="font-display text-lg font-bold mb-1">Add a site</h3>
        <p className="text-xs text-white/40 mb-5">You&apos;ll get a unique script tag to paste on your site.</p>
        {error && <div className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-white/50 mb-1">Site name</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} required placeholder="My Blog"
              className="w-full bg-[#16161f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#6c63ff]"/>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1">Domain</label>
            <input type="text" value={domain} onChange={e=>setDomain(e.target.value)} required placeholder="myblog.in"
              className="w-full bg-[#16161f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#6c63ff]"/>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2 border border-white/10 rounded-lg text-sm text-white/50 hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-[#6c63ff] rounded-lg text-sm text-white font-medium hover:bg-[#7c74ff] disabled:opacity-50 transition-colors">
              {loading?'Adding…':'Add site →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
