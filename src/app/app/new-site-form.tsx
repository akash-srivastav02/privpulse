"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Copy, Plus } from "lucide-react";

type CreatedSite = {
  siteId: string;
  siteName: string;
  script: string;
};

export default function NewSiteForm({ disabled }: { disabled: boolean }) {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<CreatedSite | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setCreated(null);

    const res = await fetch("/api/sites", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ domain }),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Could not create site.");
      return;
    }

    setDomain("");
    setCreated(json);
  }

  return (
    <div className="rounded border border-black/10 bg-white p-5">
      <div className="mb-4 flex items-center gap-2 font-medium">
        <Plus size={18} /> Add website
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={domain}
          onChange={(event) => setDomain(event.target.value)}
          disabled={disabled}
          required
          className="min-w-0 flex-1 rounded border border-black/15 px-3 py-3 outline-none focus:border-black disabled:bg-black/5"
          placeholder="https://yourdomain.com"
        />
        <button disabled={loading || disabled} className="inline-flex items-center justify-center gap-2 rounded bg-[#111] px-5 py-3 font-medium text-white disabled:opacity-50">
          {loading ? "Creating..." : "Create"} <ArrowRight size={17} />
        </button>
      </form>
      {disabled && <p className="mt-3 text-sm text-amber-700">Your current plan has reached the website limit.</p>}
      {error && <p className="mt-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {created && (
        <div className="mt-4 rounded bg-[#f6f3ec] p-4">
          <div className="font-medium">{created.siteName}</div>
          <pre className="mt-3 overflow-auto rounded bg-[#111] p-3 text-xs leading-6 text-white">{created.script}</pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(created.script);
              setCopied(true);
            }}
            className="mt-3 inline-flex items-center gap-2 rounded bg-white px-3 py-2 text-sm font-medium shadow-sm"
          >
            <Copy size={15} /> {copied ? "Copied" : "Copy script"}
          </button>
        </div>
      )}
    </div>
  );
}
