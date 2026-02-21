import { prisma } from "@/lib/prisma";
import WorkspaceList from "@/components/dashboard/WorkspaceList";

export default async function DashboardPage() {
  const workspaces = await prisma.workspace.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Workspaces</h1>
        <p className="mt-1 text-sm text-gray-400">
          Manage content calendars for your clients
        </p>
      </div>
      <WorkspaceList initialWorkspaces={JSON.parse(JSON.stringify(workspaces))} />
    </div>
  );
}
