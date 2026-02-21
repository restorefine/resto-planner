"use client";

import { useState, useCallback } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import CalendarCell from "./CalendarCell";
import PostDialog from "./PostDialog";
import PostViewDialog from "./PostViewDialog";
import MonthNavigator from "./MonthNavigator";
import MonthStats from "./MonthStats";
import MonthPlanList from "./MonthPlanList";
import { Post } from "@/types";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
  initialPosts: Post[];
  workspaceId: string;
  shareToken?: string;
  initialDate?: Date;
  readonly?: boolean;
}

export default function CalendarGrid({
  initialPosts,
  workspaceId,
  shareToken,
  initialDate,
  readonly = false,
}: Props) {
  const dark = !readonly; // admin view = dark theme

  const [currentDate, setCurrentDate] = useState(initialDate ?? new Date());
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  function getPostForDate(date: Date) {
    return posts.find((p) => isSameDay(new Date(p.date), date));
  }

  async function fetchPosts(date: Date) {
    setLoading(true);
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    const url =
      readonly && shareToken
        ? `/api/share/token/${shareToken}?month=${m}&year=${y}`
        : `/api/posts?workspaceId=${workspaceId}&month=${m}&year=${y}`;

    const res = await fetch(url);
    const data = await res.json();
    setPosts(readonly ? data.posts : data);
    setLoading(false);
  }

  function handlePrev() {
    const prev = subMonths(currentDate, 1);
    setCurrentDate(prev);
    fetchPosts(prev);
  }

  function handleNext() {
    const next = addMonths(currentDate, 1);
    setCurrentDate(next);
    fetchPosts(next);
  }

  const handleSave = useCallback((saved: Post) => {
    setPosts((prev) => {
      const exists = prev.find((p) =>
        isSameDay(new Date(p.date), new Date(saved.date))
      );
      if (exists) return prev.map((p) => (p.id === exists.id ? saved : p));
      return [...prev, saved];
    });
  }, []);

  const handleDelete = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const selectedPost = selectedDate ? getPostForDate(selectedDate) : undefined;

  return (
    <div className={loading ? "opacity-60 pointer-events-none transition-opacity" : "transition-opacity"}>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <MonthNavigator
          currentDate={currentDate}
          onPrev={handlePrev}
          onNext={handleNext}
          dark={dark}
        />
        {loading && (
          <span className={`text-xs animate-pulse ${dark ? "text-gray-500" : "text-[#6B7280]"}`}>
            Loading…
          </span>
        )}
      </div>

      {/* Calendar card */}
      <div
        className={`rounded-2xl overflow-hidden border shadow-sm ${
          dark
            ? "bg-[#111111] border-[#2a2a2a]"
            : "bg-white border-gray-100"
        }`}
      >
        {/* Day labels */}
        <div
          className={`grid grid-cols-7 border-b ${
            dark ? "bg-[#0d0d0d] border-[#2a2a2a]" : "bg-gray-50/60 border-gray-100"
          }`}
        >
          {DAY_LABELS.map((d) => (
            <div
              key={d}
              className={`py-3 text-center text-[11px] font-semibold uppercase tracking-widest ${
                dark ? "text-gray-500" : "text-[#6B7280]"
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const isLastRow = i >= days.length - 7;
            const isLastCol = i % 7 === 6;
            return (
              <CalendarCell
                key={day.toISOString()}
                date={day}
                currentMonth={currentDate}
                post={getPostForDate(day)}
                onClick={() => setSelectedDate(day)}
                readonly={readonly}
                dark={dark}
                noBorderBottom={isLastRow}
                noBorderRight={isLastCol}
              />
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <MonthStats posts={posts} dark={dark} />

      {/* Plan list — shown in both admin and client view */}
      <MonthPlanList
        posts={posts}
        currentDate={currentDate}
        onSelectDate={setSelectedDate}
        dark={dark}
        readonly={readonly}
      />

      {/* Dialogs */}
      {readonly && selectedDate && (
        <PostViewDialog
          date={selectedDate}
          post={selectedPost}
          onClose={() => setSelectedDate(null)}
        />
      )}
      {!readonly && selectedDate && (
        <PostDialog
          date={selectedDate}
          post={selectedPost}
          workspaceId={workspaceId}
          onClose={() => setSelectedDate(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
