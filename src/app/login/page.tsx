import Link from "next/link";
import { Activity } from "lucide-react";
import LoginForm from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/app";

  return (
    <main className="min-h-screen bg-[#f6f3ec] px-4 py-10 text-[#191a17] sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid size-8 place-items-center rounded bg-[#111] text-white">
              <Activity size={17} />
            </span>
            PrivPulse
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Customer app</p>
          <h2 className="mt-3 text-5xl font-semibold tracking-tight">Track every site from one clean workspace.</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-black/60">
            Create sites, copy install scripts, watch plan limits, and upgrade when traffic grows.
          </p>
        </div>
        <LoginForm next={next} />
      </div>
    </main>
  );
}
