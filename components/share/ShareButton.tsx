"use client";

import { useState } from "react";
import { Share2, Copy, Check, Trash2, X } from "lucide-react";

interface Props {
  workspaceId: string;
  initialToken: string | null;
}

export default function ShareButton({ workspaceId, initialToken }: Props) {
  const [token, setToken] = useState<string | null>(initialToken);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = token
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/share/calendar/${token}`
    : null;

  async function generate() {
    setLoading(true);
    const res = await fetch(`/api/share/${workspaceId}`, { method: "POST" });
    const data = await res.json();
    setToken(data.shareToken);
    setLoading(false);
  }

  async function revoke() {
    setLoading(true);
    await fetch(`/api/share/${workspaceId}`, { method: "DELETE" });
    setToken(null);
    setLoading(false);
  }

  async function copyLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1.5 text-sm font-medium text-gray-300 hover:border-[#3a3a3a] hover:text-white transition-all duration-150"
      >
        <Share2 className="h-3.5 w-3.5" />
        <span className="hidden sm:block">{token ? "Shared" : "Share"}</span>
        {token && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-[#2a2a2a] bg-[#111111] p-4 shadow-2xl shadow-black/60">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E01E1E]/15">
                  <Share2 className="h-3.5 w-3.5 text-[#E01E1E]" />
                </div>
                <h3 className="text-sm font-semibold text-white">Share Calendar</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-[#1f1f1f] hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {shareUrl ? (
              <div className="flex flex-col gap-3">
                {/* Active badge */}
                <div className="flex items-center gap-1.5 rounded-lg bg-[#E01E1E]/10 border border-[#E01E1E]/20 px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E01E1E]" />
                  <p className="text-xs text-[#E01E1E] font-medium">
                    Share link is active
                  </p>
                </div>

                <p className="text-xs text-gray-500">
                  Anyone with this link can view the calendar in read-only mode.
                </p>

                {/* URL row */}
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={shareUrl}
                    className="flex-1 min-w-0 rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-xs text-gray-300 outline-none font-mono"
                  />
                  <button
                    onClick={copyLink}
                    aria-label="Copy link"
                    className={`flex items-center justify-center rounded-lg px-3 py-2 transition-all duration-150 ${
                      copied
                        ? "bg-green-500/20 border border-green-500/30 text-green-400"
                        : "bg-[#E01E1E] text-white hover:bg-[#B01515]"
                    }`}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                <div className="border-t border-[#1f1f1f] pt-3">
                  <button
                    onClick={revoke}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#E01E1E] transition-colors disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {loading ? "Revoking…" : "Revoke access"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Generate a private link to share a read-only view of this calendar with your client.
                </p>
                <button
                  onClick={generate}
                  disabled={loading}
                  className="w-full rounded-lg bg-[#E01E1E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#B01515] disabled:opacity-50 transition-colors"
                >
                  {loading ? "Generating…" : "Generate Share Link"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
