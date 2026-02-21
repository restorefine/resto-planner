"use client";

import { useState, useEffect } from "react";
import { Workspace } from "@/types";

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchWorkspaces() {
    setLoading(true);
    const res = await fetch("/api/workspaces");
    const data = await res.json();
    setWorkspaces(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  async function createWorkspace(name: string, clientName: string) {
    const res = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, clientName }),
    });
    const workspace = await res.json();
    setWorkspaces((prev) => [workspace, ...prev]);
    return workspace;
  }

  async function updateWorkspace(id: string, name: string, clientName: string) {
    const res = await fetch(`/api/workspaces/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, clientName }),
    });
    const updated = await res.json();
    setWorkspaces((prev) => prev.map((w) => (w.id === id ? updated : w)));
    return updated;
  }

  async function deleteWorkspace(id: string) {
    await fetch(`/api/workspaces/${id}`, { method: "DELETE" });
    setWorkspaces((prev) => prev.filter((w) => w.id !== id));
  }

  return { workspaces, loading, createWorkspace, updateWorkspace, deleteWorkspace, refetch: fetchWorkspaces };
}
