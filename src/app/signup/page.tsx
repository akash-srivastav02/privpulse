import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";
import SignupForm from "./signup-form";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#191a17]">
      <nav className="border-b border-black/10 bg-[#f6f3ec]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded bg-[#111] text-white"><Activity size={17} /></span>
            <span className="font-semibold tracking-tight">PrivPulse</span>
          </Link>
          <Link className="rounded px-3 py-2 text-sm text-black/65 hover:bg-black/5" href="/dashboard">Demo</Link>
        </div>
      </nav>
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1fr]">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Start free</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight">Your analytics script in 60 seconds.</h1>
          <p className="mt-5 text-lg leading-8 text-black/60">Create a workspace, get a site id, paste the tracking script, and use the dashboard immediately. No credit card.</p>
          <div className="mt-8 flex items-center gap-2 text-sm text-black/55">
            <ArrowRight size={16} /> Free forever for 10k pageviews/month.
          </div>
        </div>
        <SignupForm />
      </section>
    </main>
  );
}
