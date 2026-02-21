import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workspaces = await prisma.workspace.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { posts: true } },
    },
  });

  return NextResponse.json(workspaces);
}

export async function POST(request: NextRequest) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, clientName } = body;

  if (!name || !clientName) {
    return NextResponse.json({ error: "Name and clientName are required" }, { status: 400 });
  }

  const workspace = await prisma.workspace.create({
    data: { name, clientName },
    include: { _count: { select: { posts: true } } },
  });

  return NextResponse.json(workspace, { status: 201 });
}
