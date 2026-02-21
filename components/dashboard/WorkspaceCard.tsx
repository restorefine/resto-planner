"use client";

import { useState } from "react";
import Link from "next/link";
import { Workspace } from "@/types";
import { Pencil, Trash2, ArrowUpRight } from "lucide-react";

interface Props {
  workspace: Workspace;
  onRename: (id: string, name: string, clientName: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function WorkspaceCard({ workspace, onRename, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(workspace.name);
  const [clientName, setClientName] = useState(workspace.clientName);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleSave() {
    if (!name.trim() || !clientName.trim()) return;
    setSaving(true);
    await onRename(workspace.id, name.trim(), clientName.trim());
    setSaving(false);
    setEditing(false);
  }

  async function handleDelete() {
    if (!confirming) { setConfirming(true); return; }
    await onDelete(workspace.id);
  }

  const postCount = workspace._count?.posts ?? 0;
  const initial = workspace.name.charAt(0).toUpperCase();

  return (
    <div className="group flex flex-col rounded-2xl bg-[#141414] border border-[#232323] hover:border-[#383838] transition-all duration-200">
      {editing ? (
        <div className="flex flex-col gap-3 p-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Workspace name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none focus:border-[#E01E1E] focus:ring-1 focus:ring-[#E01E1E]/20 transition-all"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Client name</label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none focus:border-[#E01E1E] focus:ring-1 focus:ring-[#E01E1E]/20 transition-all"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-lg bg-[#E01E1E] py-2 text-sm font-semibold text-white hover:bg-[#B01515] disabled:opacity-60 transition-colors"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => { setEditing(false); setName(workspace.name); setClientName(workspace.clientName); }}
              className="flex-1 rounded-lg border border-[#2a2a2a] py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <Link href={`/workspace/${workspace.id}`} className="flex-1 p-5 block">
            {/* Top row */}
            <div className="flex items-start justify-between mb-4">
              {/* Monogram */}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] text-sm font-bold text-gray-300">
                {initial}
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-700 group-hover:text-gray-300 transition-colors mt-0.5" />
            </div>

            {/* Name + client */}
            <p className="text-sm font-semibold text-white leading-snug truncate">{workspace.name}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{workspace.clientName}</p>

            {/* Post count */}
            <div className="mt-4 flex items-center gap-1.5">
              <span className={`text-xs font-bold tabular-nums ${postCount > 0 ? "text-[#E01E1E]" : "text-gray-600"}`}>
                {postCount}
              </span>
              <span className="text-xs text-gray-600">post{postCount !== 1 ? "s" : ""} this month</span>
            </div>
          </Link>

          {/* Footer actions */}
          <div className="flex border-t border-[#1e1e1e]">
            <button
              onClick={() => setEditing(true)}
              className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs text-gray-500 hover:text-gray-200 hover:bg-white/[0.03] transition-colors rounded-bl-2xl"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
            <div className="w-px bg-[#1e1e1e]" />
            <button
              onClick={handleDelete}
              onBlur={() => setConfirming(false)}
              className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-xs transition-colors rounded-br-2xl ${
                confirming
                  ? "bg-[#E01E1E]/10 text-[#E01E1E]"
                  : "text-gray-500 hover:text-[#E01E1E] hover:bg-[#E01E1E]/5"
              }`}
            >
              <Trash2 className="h-3 w-3" />
              {confirming ? "Confirm?" : "Delete"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
