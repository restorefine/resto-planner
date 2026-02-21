import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { startOfMonth, endOfMonth } from "date-fns";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function GET(request: NextRequest) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");
  const month = searchParams.get("month"); // 1-12
  const year = searchParams.get("year");

  if (!workspaceId || !month || !year) {
    return NextResponse.json({ error: "workspaceId, month, and year are required" }, { status: 400 });
  }

  const date = new Date(Number(year), Number(month) - 1, 1);
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  const posts = await prisma.post.findMany({
    where: {
      workspaceId,
      date: { gte: start, lte: end },
    },
    include: { platforms: true },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { workspaceId, date, description, platforms } = body;

  if (!workspaceId || !date) {
    return NextResponse.json({ error: "workspaceId and date are required" }, { status: 400 });
  }

  const postDate = new Date(date);
  // Upsert by workspaceId + date
  const existing = await prisma.post.findFirst({
    where: {
      workspaceId,
      date: postDate,
    },
  });

  let post;
  if (existing) {
    // Delete existing platforms and recreate
    await prisma.platform.deleteMany({ where: { postId: existing.id } });
    post = await prisma.post.update({
      where: { id: existing.id },
      data: {
        description: description ?? "",
        platforms: {
          create: (platforms ?? []).map((p: { name: string; url: string }) => ({
            name: p.name,
            url: p.url,
          })),
        },
      },
      include: { platforms: true },
    });
  } else {
    post = await prisma.post.create({
      data: {
        workspaceId,
        date: postDate,
        description: description ?? "",
        platforms: {
          create: (platforms ?? []).map((p: { name: string; url: string }) => ({
            name: p.name,
            url: p.url,
          })),
        },
      },
      include: { platforms: true },
    });
  }

  return NextResponse.json(post, { status: 201 });
}
