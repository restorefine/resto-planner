"use client";

import { useState, useEffect, useRef } from "react";
import { X, FolderPlus } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, clientName: string) => Promise<void>;
}

export default function CreateWorkspaceModal({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setClientName("");
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !clientName.trim()) return;
    setLoading(true);
    await onCreate(name.trim(), clientName.trim());
    setLoading(false);
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Create new workspace"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-[#111111] border border-[#2a2a2a] p-6 shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E01E1E]/15">
              <FolderPlus className="h-4 w-4 text-[#E01E1E]" />
            </div>
            <h2 className="text-base font-bold text-white">New Workspace</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:bg-[#1f1f1f] hover:text-gray-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Workspace Name
            </label>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Social Media Q1 2025"
              className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-700 focus:border-[#E01E1E] focus:ring-2 focus:ring-[#E01E1E]/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Client Name
            </label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              placeholder="e.g. Acme Corporation"
              className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-700 focus:border-[#E01E1E] focus:ring-2 focus:ring-[#E01E1E]/20 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[#2a2a2a] px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim() || !clientName.trim()}
              className="flex-1 rounded-lg bg-[#E01E1E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#B01515] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating…" : "Create Workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
