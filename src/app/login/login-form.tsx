"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";

export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/auth/request-code", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Could not send login code.");
      return;
    }

    setStep("code");
    setMessage(json.devCode ? `Use test code ${json.devCode}` : "Check your email for a 6-digit login code.");
  }

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, code, next }),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Could not log in.");
      return;
    }

    window.location.href = json.next ?? "/app";
  }

  return (
    <div className="rounded border border-black/10 bg-white p-6 shadow-xl shadow-black/5">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded bg-emerald-100 text-emerald-800">
          {step === "email" ? <Mail size={18} /> : <ShieldCheck size={18} />}
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Log in to PrivPulse</h1>
          <p className="text-sm text-black/55">No password. One email code.</p>
        </div>
      </div>

      {step === "email" ? (
        <form onSubmit={requestCode}>
          <label className="block text-sm font-medium">Email</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
            className="mt-2 w-full rounded border border-black/15 px-3 py-3 outline-none focus:border-black"
            placeholder="you@company.com"
          />
          <button disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#111] px-5 py-3 font-medium text-white disabled:opacity-60">
            {loading ? "Sending..." : "Send login code"} <ArrowRight size={17} />
          </button>
        </form>
      ) : (
        <form onSubmit={verify}>
          <label className="block text-sm font-medium">6-digit code</label>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            inputMode="numeric"
            maxLength={6}
            required
            className="mt-2 w-full rounded border border-black/15 px-3 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:border-black"
            placeholder="000000"
          />
          <button disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#111] px-5 py-3 font-medium text-white disabled:opacity-60">
            {loading ? "Checking..." : "Open dashboard"} <ArrowRight size={17} />
          </button>
          <button type="button" onClick={() => setStep("email")} className="mt-3 w-full rounded px-4 py-2 text-sm text-black/55 hover:bg-black/5">
            Use another email
          </button>
        </form>
      )}

      {message && <p className="mt-4 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
      {error && <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
