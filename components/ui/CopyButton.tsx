"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Copy-to-clipboard enhancement for install commands — §10.1.9. Purely
 * additive: the command is always visible as text, so nothing is lost
 * without JS.
 */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : `Copy "${text}"`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard unavailable — the visible text remains selectable.
        }
      }}
      className="inline-flex size-11 items-center justify-center rounded-sm text-slate transition-colors duration-[var(--dur-fast)] hover:text-ink"
    >
      {copied ? (
        <Check size={16} aria-hidden="true" className="text-success" />
      ) : (
        <Copy size={16} aria-hidden="true" />
      )}
    </button>
  );
}
