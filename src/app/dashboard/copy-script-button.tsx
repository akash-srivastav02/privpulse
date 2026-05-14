"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyScriptButton({ script }: { script: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(script);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded bg-[#111] px-3 py-2 text-sm font-medium text-white hover:bg-black/80"
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? "Copied" : "Copy install script"}
    </button>
  );
}
