import CalendarGrid from "@/components/calendar/CalendarGrid";
import { Post, Workspace } from "@/types";
import Image from "next/image";

interface Props {
  workspace: Workspace;
  posts: Post[];
}

export default function SharedCalendarView({ workspace, posts }: Props) {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <Image src="/r-logo.png" alt="Logo" width={28} height={28} className="flex-shrink-0" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-[#111111]">{workspace.name}</p>
              <p className="truncate text-xs text-[#6B7280]">{workspace.clientName} · Read-only view</p>
            </div>
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
