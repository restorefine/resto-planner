"use client";

import { useState, useEffect, useCallback } from "react";
import { Post } from "@/types";

export function usePosts(workspaceId: string, month: number, year: number) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async (m: number, y: number) => {
    setLoading(true);
    const res = await fetch(
      `/api/posts?workspaceId=${workspaceId}&month=${m}&year=${y}`
    );
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }, [workspaceId]);

  useEffect(() => {
    fetchPosts(month, year);
  }, [fetchPosts, month, year]);

  async function savePost(data: {
    date: string;
    description: string;
    platforms: { name: string; url: string }[];
  }) {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspaceId, ...data }),
    });
    const saved: Post = await res.json();
    setPosts((prev) => {
      const exists = prev.find((p) => p.id === saved.id || p.date === saved.date);
      if (exists) return prev.map((p) => (p.id === exists.id ? saved : p));
      return [...prev, saved];
    });
    return saved;
  }

  async function deletePost(postId: string) {
    await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  return { posts, loading, savePost, deletePost, refetch: () => fetchPosts(month, year) };
}
