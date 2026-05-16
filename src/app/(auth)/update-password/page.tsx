'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setStatus('')
    const { error } = await supabase.auth.updateUser({ password })
    setStatus(error ? error.message : 'Password updated. You can open your dashboard.')
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#4ecca3] shadow-[0_0_8px_#4ecca3]"/>
            <span className="font-display font-bold text-white">Priv<span className="text-[#4ecca3]">Pulse</span></span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white">Choose new password</h1>
        </div>
        <form onSubmit={submit} className="bg-[#111118] border border-white/8 rounded-2xl p-6 space-y-4">
          {status && <div className="text-xs text-white/70 bg-white/5 border border-white/10 rounded-lg px-3 py-2">{status}</div>}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">New password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8}
              className="w-full bg-[#16161f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#6c63ff] transition-colors"
              placeholder="min 8 characters"/>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-[#6c63ff] text-white rounded-lg text-sm font-medium hover:bg-[#7c74ff] disabled:opacity-50 transition-colors">
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
        <p className="text-center text-xs text-white/30 mt-4"><Link href="/dashboard" className="text-[#6c63ff] hover:underline">Open dashboard</Link></p>
      </div>
    </main>
  )
}
