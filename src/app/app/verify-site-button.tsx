"use client";

import { CheckCircle2, Loader2, SearchCheck, XCircle } from "lucide-react";
import { useState } from "react";

type Status = {
  ok: boolean;
  message: string;
};

export default function VerifySiteButton({ siteId }: { siteId: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);

  async function verify() {
    setLoading(true);
    setStatus(null);
    const response = await fetch("/api/sites/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ siteId }),
    });
    const json = await response.json();
    setLoading(false);
    setStatus({
      ok: Boolean(json.ok),
      message: json.message ?? json.error ?? "Could not verify install.",
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={verify}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-60"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <SearchCheck size={15} />}
        {loading ? "Checking..." : "Verify install"}
      </button>
      {status && (
        <p className={`mt-2 flex items-start gap-2 text-xs leading-5 ${status.ok ? "text-emerald-700" : "text-amber-700"}`}>
          {status.ok ? <CheckCircle2 size={15} className="mt-0.5 shrink-0" /> : <XCircle size={15} className="mt-0.5 shrink-0" />}
          {status.message}
        </p>
      )}
    </div>
  );
}
