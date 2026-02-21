import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SharedCalendarView from "@/components/share/SharedCalendarView";
import { startOfMonth, endOfMonth } from "date-fns";

interface Props {
  params: Promise<{ shareToken: string }>;
}

export default async function SharePage({ params }: Props) {
  const { shareToken } = await params;

  const workspace = await prisma.workspace.findUnique({
    where: { shareToken },
  });

  if (!workspace) notFound();

  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const posts = await prisma.post.findMany({
    where: {
      workspaceId: workspace.id,
      date: { gte: start, lte: end },
    },
    include: { platforms: true },
    orderBy: { date: "asc" },
  });

  return (
    <SharedCalendarView
      workspace={JSON.parse(JSON.stringify(workspace))}
      posts={JSON.parse(JSON.stringify(posts))}
    />
  );
}
