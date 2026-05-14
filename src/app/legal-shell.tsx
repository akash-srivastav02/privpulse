import { Activity } from "lucide-react";
import Link from "next/link";

export function LegalShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#191a17]">
      <nav className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid size-8 place-items-center rounded bg-[#111] text-white">
              <Activity size={17} />
            </span>
            PrivPulse
          </Link>
          <Link href="/app" className="rounded bg-[#111] px-4 py-2 text-sm font-medium text-white">
            Open app
          </Link>
        </div>
      </nav>

      <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-black/60">{description}</p>
        <p className="mt-3 text-sm text-black/45">Last updated: May 14, 2026</p>
        <div className="mt-8 space-y-8 rounded border border-black/10 bg-white p-6 leading-7 text-black/70 shadow-xl shadow-black/5 sm:p-8">
          {children}
        </div>
      </article>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight text-[#191a17]">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
