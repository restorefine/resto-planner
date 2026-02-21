import CalendarGrid from "@/components/calendar/CalendarGrid";
import { Post, Workspace } from "@/types";
import { Calendar } from "lucide-react";

interface Props {
  workspace: Workspace;
  posts: Post[];
}

export default function SharedCalendarView({ workspace, posts }: Props) {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E01E1E] flex-shrink-0">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#111111]">
              {workspace.name}
            </p>
            <p className="truncate text-xs text-[#6B7280]">
              {workspace.clientName} · Read-only view
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <CalendarGrid
          initialPosts={posts}
          workspaceId={workspace.id}
          shareToken={workspace.shareToken ?? undefined}
          readonly
        />
      </main>
    </div>
  );
}
