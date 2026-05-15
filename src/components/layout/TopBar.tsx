'use client'
import Link from 'next/link'

export default function TopBar({user,onLogout}:{user:any;onLogout:()=>void}) {
  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#0a0a0f] shrink-0">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#4ecca3] shadow-[0_0_8px_#4ecca3]"/>
        <span className="font-display font-bold text-sm">Priv<span className="text-[#4ecca3]">Pulse</span></span>
      </Link>
      <div className="flex items-center gap-3">
        <span className="text-xs text-white/30">{user?.email}</span>
        <button onClick={onLogout} className="text-xs text-white/30 hover:text-white transition-colors px-3 py-1 border border-white/10 rounded-lg">Logout</button>
      </div>
    </header>
  )
}
