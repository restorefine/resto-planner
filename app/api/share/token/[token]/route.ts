import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

// GET /api/share/token/[token]?month=&year= — public, no auth required
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const workspace = await prisma.workspace.findUnique({
    where: { shareToken: token },
  });

  if (!workspace) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = new Date();
  const m = month ? Number(month) : now.getMonth() + 1;
  const y = year ? Number(year) : now.getFullYear();

  const date = new Date(y, m - 1, 1);
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  const posts = await prisma.post.findMany({
    where: {
      workspaceId: workspace.id,
      date: { gte: start, lte: end },
    },
    include: { platforms: true },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ workspace, posts });
}
