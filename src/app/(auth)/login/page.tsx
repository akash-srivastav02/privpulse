'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#4ecca3] shadow-[0_0_8px_#4ecca3]"/>
            <span className="font-display font-bold text-white">Priv<span className="text-[#4ecca3]">Pulse</span></span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-white/40 mt-1">Sign in to your dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="bg-[#111118] border border-white/8 rounded-2xl p-6 space-y-4">
          {error && <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</div>}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
              className="w-full bg-[#16161f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#6c63ff] transition-colors"
              placeholder="you@startup.in"/>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required
              className="w-full bg-[#16161f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#6c63ff] transition-colors"
              placeholder="••••••••"/>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-[#6c63ff] text-white rounded-lg text-sm font-medium hover:bg-[#7c74ff] disabled:opacity-50 transition-colors">
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>
        <p className="text-center text-xs text-white/30 mt-4">
          No account? <Link href="/signup" className="text-[#6c63ff] hover:underline">Sign up free</Link>
        </p>
        <p className="text-center text-xs text-white/25 mt-2">
          <Link href="/reset-password" className="hover:text-white/50 transition-colors">Forgot password?</Link>
        </p>
      </div>
    </main>
  )
}
