"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Copy } from "lucide-react";

type SignupResponse = {
  siteId: string;
  siteName: string;
  script: string;
};

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<SignupResponse | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Could not create account");
      return;
    }

    setCreated(json);
  }

  if (created) {
    return (
      <div className="rounded border border-black/10 bg-white p-6 shadow-xl shadow-black/5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Site created</p>
        <h2 className="mt-3 text-2xl font-semibold">{created.siteName}</h2>
        <p className="mt-2 text-sm text-black/55">Paste this before the closing head tag on your website.</p>
        <pre className="mt-5 overflow-auto rounded bg-[#111] p-4 text-xs leading-6 text-white">{created.script}</pre>
        <button
          className="mt-5 flex w-full items-center justify-center gap-2 rounded bg-[#111] px-5 py-3 font-medium text-white"
          onClick={() => {
            navigator.clipboard.writeText(created.script);
            setCopied(true);
          }}
        >
          <Copy size={17} /> {copied ? "Copied" : "Copy script"}
        </button>
      </div>
    );
  }

  return (
    <form action="/api/signup" method="post" onSubmit={submit} className="rounded border border-black/10 bg-white p-6 shadow-xl shadow-black/5">
      <label className="block text-sm font-medium">Name</label>
      <input name="name" required className="mt-2 w-full rounded border border-black/15 px-3 py-3 outline-none focus:border-black" placeholder="Rahul Sharma" />
      <label className="mt-5 block text-sm font-medium">Email</label>
      <input name="email" required className="mt-2 w-full rounded border border-black/15 px-3 py-3 outline-none focus:border-black" placeholder="rahul@startup.in" />
      <label className="mt-5 block text-sm font-medium">Website URL</label>
      <input name="domain" required className="mt-2 w-full rounded border border-black/15 px-3 py-3 outline-none focus:border-black" placeholder="https://mystore.in" />
      {error && <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#111] px-5 py-3 font-medium text-white disabled:opacity-60">
        {loading ? "Creating..." : "Create account and get script"} <ArrowRight size={17} />
      </button>
    </form>
  );
}
