"use client";

import { useState } from "react";
import WorkspaceCard from "./WorkspaceCard";
import CreateWorkspaceModal from "./CreateWorkspaceModal";
import { Workspace } from "@/types";
import { Plus } from "lucide-react";

export default function WorkspaceList({
  initialWorkspaces,
}: {
  initialWorkspaces: Workspace[];
}) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [showModal, setShowModal] = useState(false);

  async function handleCreate(name: string, clientName: string) {
    const res = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, clientName }),
    });
    const workspace = await res.json();
    setWorkspaces((prev) => [workspace, ...prev]);
  }

  async function handleRename(id: string, name: string, clientName: string) {
    const res = await fetch(`/api/workspaces/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, clientName }),
    });
    const updated = await res.json();
    setWorkspaces((prev) =>
      prev.map((w) => (w.id === id ? updated : w))
    );
  }

  async function handleDelete(id: string) {
    await fetch(`/api/workspaces/${id}`, { method: "DELETE" });
    setWorkspaces((prev) => prev.filter((w) => w.id !== id));
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {workspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace.id}
            workspace={workspace}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        ))}

        {workspaces.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#2a2a2a] py-16 text-center">
            <p className="text-gray-300 mb-1 font-medium">No workspaces yet</p>
            <p className="text-sm text-gray-500">
              Click &quot;New Workspace&quot; to get started
            </p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        aria-label="Create new workspace"
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-[#E01E1E] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#B01515] transition-colors z-40"
      >
        <Plus className="h-4 w-4" />
        New Workspace
      </button>

      <CreateWorkspaceModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />
    </>
  );
}
