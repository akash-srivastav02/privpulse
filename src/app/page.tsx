import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#f0f0f8]">
      {/* NAV */}
      <nav className="flex items-center justify-between px-7 py-4 border-b border-white/5 sticky top-0 bg-[#0a0a0f]/90 backdrop-blur z-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#4ecca3] shadow-[0_0_10px_#4ecca3]"/>
          <span className="font-display font-bold text-base">Priv<span className="text-[#4ecca3]">Pulse</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono bg-[#4ecca3]/10 text-[#4ecca3] border border-[#4ecca3]/20 px-2 py-1 rounded-full">DPDP ready</span>
          <Link href="/login" className="px-3 py-1.5 text-[13px] text-white/50 hover:text-white transition-colors">Login</Link>
          <Link href="/signup" className="px-4 py-1.5 text-[13px] bg-[#6c63ff] text-white rounded-lg hover:bg-[#7c74ff] transition-colors">Start free →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-3xl mx-auto text-center px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 bg-[#6c63ff]/10 border border-[#6c63ff]/20 text-[#6c63ff] text-xs font-mono px-3 py-1.5 rounded-full mb-8">
          ⚡ No cookies. No banners. No BS.
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[1.04] tracking-[-3px] mb-5">
          Analytics that{' '}
          <span className="bg-gradient-to-r from-[#6c63ff] to-[#4ecca3] bg-clip-text text-transparent">respects</span>
          <br/>your users
        </h1>
        <p className="text-lg text-white/40 leading-relaxed max-w-lg mx-auto mb-10 font-light">
          Replace Google Analytics. Privacy-first, GDPR + India DPDP compliant. One script tag. Under 2KB.
        </p>
        <div className="flex gap-3 justify-center flex-wrap mb-16">
          <Link href="/signup" className="px-7 py-3 bg-[#6c63ff] text-white rounded-xl font-medium hover:bg-[#7c74ff] hover:-translate-y-px transition-all">
            Start free — ₹0/month →
          </Link>
          <Link href="/dashboard" className="px-7 py-3 bg-white/5 text-white rounded-xl font-medium border border-white/10 hover:bg-white/8 transition-all">
            View demo dashboard
          </Link>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-4 border border-white/7 rounded-2xl overflow-hidden max-w-xl mx-auto">
          {[['1.8KB','Script size'],['<500ms','Dashboard'],['0','Cookies'],['₹199','Paid plan/mo']].map(([v,l])=>(
            <div key={l} className="p-5 border-r border-white/7 last:border-0 text-center">
              <div className="font-display text-xl font-bold">{v}</div>
              <div className="text-xs text-white/30 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <p className="text-xs font-mono text-[#4ecca3] tracking-[2px] uppercase mb-5">Why PrivPulse</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {icon:'🔒',title:'No cookie banner',desc:'Tracks via privacy-preserving hashing. Fully GDPR + DPDP 2023 compliant.',c:'bg-[#4ecca3]/10'},
            {icon:'⚡',title:'One-line setup',desc:'Paste one <script> tag. Dashboard populates in real-time. No config.',c:'bg-[#6c63ff]/10'},
            {icon:'📊',title:'One-screen dashboard',desc:'Visitors, pages, referrers, countries — all at a glance. No menus.',c:'bg-[#4ecca3]/10'},
            {icon:'📧',title:'Monday email digest',desc:'Weekly traffic summary delivered to your inbox every Monday.',c:'bg-[#ffb347]/10'},
            {icon:'🎯',title:'Codeless events',desc:'Add data-pp="signup" to any button. Auto-tracked. Zero JS.',c:'bg-[#6c63ff]/10'},
            {icon:'🇮🇳',title:'Built for India',desc:'Priced in ₹. 4× cheaper than Plausible. DPDP-ready out of the box.',c:'bg-[#ffb347]/10'},
          ].map(f=>(
            <div key={f.title} className="bg-[#111118] border border-white/7 rounded-xl p-5 hover:border-white/12 transition-colors">
              <div className={`w-9 h-9 rounded-lg ${f.c} flex items-center justify-center text-base mb-3`}>{f.icon}</div>
              <h3 className="font-display text-sm font-semibold mb-1.5">{f.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CODE SNIPPET */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <p className="text-xs font-mono text-[#4ecca3] tracking-[2px] uppercase mb-5">Install in 10 seconds</p>
        <div className="bg-[#16161f] border border-white/7 rounded-xl p-5 font-mono text-sm leading-loose">
          <span className="text-white/25">{`<!-- Paste before </head> -->`}</span><br/>
          <span className="text-[#6c63ff]">&lt;script</span> <span className="text-[#4ecca3]">async</span><br/>
          &nbsp;&nbsp;<span className="text-[#4ecca3]">src</span>=<span className="text-[#4ecca3]">&quot;https://privpulse.in/p.js&quot;</span><br/>
          &nbsp;&nbsp;<span className="text-[#4ecca3]">data-site</span>=<span className="text-[#4ecca3]">&quot;YOUR-SITE-ID&quot;</span><br/>
          <span className="text-[#6c63ff]">&gt;&lt;/script&gt;</span>
        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <p className="text-xs font-mono text-[#4ecca3] tracking-[2px] uppercase mb-5">Simple pricing in ₹</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {name:'Starter',sub:'Blogs & hobby',price:'₹0',period:'/mo forever',feats:['1 website','10k pageviews/mo','90 days data','Public dashboard'],cta:'Get started free',href:'/signup',hot:false},
            {name:'Indie',sub:'Founders & freelancers',price:'₹199',period:'/mo',feats:['3 websites','100k pageviews/mo','1 year data','Custom events','Weekly email digest','No branding'],cta:'Start 14-day trial',href:'/signup',hot:true},
            {name:'Pro',sub:'Agencies & teams',price:'₹599',period:'/mo',feats:['20 websites','1M pageviews/mo','2 years data','Team access','White-label','Priority support'],cta:'Contact us',href:'/signup',hot:false},
          ].map(p=>(
            <div key={p.name} className={`rounded-xl p-6 border ${p.hot?'border-[#6c63ff] bg-[#6c63ff]/6':'border-white/7 bg-[#111118]'}`}>
              <div className="flex justify-between items-start mb-1">
                <div className="font-display font-bold text-[15px]">{p.name}</div>
                {p.hot && <span className="text-[10px] bg-[#6c63ff] text-white px-2 py-0.5 rounded-full">POPULAR</span>}
              </div>
              <div className="text-[11px] text-white/30 mb-3">{p.sub}</div>
              <div className="font-display text-3xl font-bold mb-1">{p.price}<span className="text-sm font-normal text-white/30">{p.period}</span></div>
              <ul className="mt-4 space-y-2">
                {p.feats.map(f=><li key={f} className="text-xs text-white/40 flex gap-2"><span className="text-[#4ecca3] font-bold">✓</span>{f}</li>)}
              </ul>
              <Link href={p.href} className={`mt-5 block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${p.hot?'bg-[#6c63ff] text-white hover:bg-[#7c74ff]':'bg-white/5 text-white border border-white/10 hover:bg-white/8'}`}>{p.cta}</Link>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-white/25 mt-4">vs Plausible: $9/mo (~₹750) · vs Fathom: $14/mo (~₹1,170) · No card for free plan</p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-6 py-8 text-center text-xs text-white/25">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4ecca3]"/>
          <span className="font-display font-bold text-white/40">PrivPulse</span>
        </div>
        <p>Privacy-first analytics for India · GDPR + DPDP compliant · No cookies ever</p>
        <div className="flex gap-4 justify-center mt-3">
          <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
          <Link href="mailto:hello@privpulse.in" className="hover:text-white/50 transition-colors">Contact</Link>
        </div>
      </footer>
    </main>
  )
}
