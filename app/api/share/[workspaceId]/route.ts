import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function shortId() {
  return Math.random().toString(36).slice(2, 8);
}

// POST /api/share/[workspaceId] — generate share token
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workspaceId } = await params;

  const existing = await prisma.workspace.findUnique({ where: { id: workspaceId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const slug = slugify(existing.clientName) || "client";
  const token = `${slug}-${shortId()}`;

  const workspace = await prisma.workspace.update({
    where: { id: workspaceId },
    data: { shareToken: token },
  });

  return NextResponse.json({ shareToken: workspace.shareToken });
}

// DELETE /api/share/[workspaceId] — revoke share token
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workspaceId } = await params;

  await prisma.workspace.update({
    where: { id: workspaceId },
    data: { shareToken: null },
  });

  return NextResponse.json({ success: true });
}
