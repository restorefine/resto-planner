import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import ShareButton from "@/components/share/ShareButton";
import { ChevronLeft, Calendar } from "lucide-react";
import { startOfMonth, endOfMonth } from "date-fns";

interface Props {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspacePage({ params }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { workspaceId } = await params;

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  if (!workspace) notFound();

  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const posts = await prisma.post.findMany({
    where: {
      workspaceId,
      date: { gte: start, lte: end },
    },
    include: { platforms: true },
    orderBy: { date: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#1a1a1a] bg-[#0d0d0d]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Left: back + identity */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#111111] px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:border-[#3a3a3a] hover:text-gray-200 transition-all flex-shrink-0"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:block">Dashboard</span>
            </Link>

            <div className="h-4 w-px bg-[#2a2a2a] hidden sm:block flex-shrink-0" />

            <div className="flex items-center gap-2.5 min-w-0">
              {/* Icon badge */}
              <div className="relative flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E01E1E]">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Text */}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white leading-tight">
                  {workspace.name}
                </p>
                <p className="truncate text-[11px] text-gray-600 leading-tight">
                  {workspace.clientName}
                </p>
              </div>
            </div>
          </div>

          {/* Right: post count + share */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#111111] px-2.5 py-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-600" />
              <span className="text-xs text-gray-500 font-medium tabular-nums">
                {posts.length} post{posts.length !== 1 ? "s" : ""} this month
              </span>
            </div>
            <ShareButton
              workspaceId={workspace.id}
              initialToken={workspace.shareToken}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <CalendarGrid
          initialPosts={JSON.parse(JSON.stringify(posts))}
          workspaceId={workspaceId}
        />
      </main>
    </div>
  );
}
