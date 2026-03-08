import { NextResponse, type NextRequest } from "next/server";
import { requireTenantRoles } from "@/lib/auth/guard";
import { newsCommentCreateSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";

interface NewsCommentRouteContext {
  params: Promise<{ newsId: string }>;
}

export async function GET(request: NextRequest, context: NewsCommentRouteContext) {
  try {
    const { error, session } = await requireTenantRoles(request, [
      "OWNER",
      "ADMIN",
      "EDITOR",
      "VIEWER",
    ]);
    if (error || !session) return error;

    const { newsId } = await context.params;
    const post = await prisma.newsPost.findFirst({
      where: { id: newsId, familyTreeId: session.activeFamilyTreeId! },
      select: { id: true },
    });
    if (!post) {
      return NextResponse.json({ error: "News post not found" }, { status: 404 });
    }

    const comments = await prisma.newsComment.findMany({
      where: {
        newsPostId: newsId,
        familyTreeId: session.activeFamilyTreeId!,
      },
      include: {
        createdBy: { select: { fullName: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ data: comments });
  } catch (err) {
    console.error("List news comments error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: NewsCommentRouteContext) {
  try {
    const { error, session } = await requireTenantRoles(request, [
      "OWNER",
      "ADMIN",
      "EDITOR",
      "VIEWER",
    ]);
    if (error || !session) return error;

    const { newsId } = await context.params;
    const post = await prisma.newsPost.findFirst({
      where: { id: newsId, familyTreeId: session.activeFamilyTreeId! },
      select: { id: true },
    });
    if (!post) {
      return NextResponse.json({ error: "News post not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = newsCommentCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const comment = await prisma.newsComment.create({
      data: {
        newsPostId: newsId,
        familyTreeId: session.activeFamilyTreeId!,
        content: parsed.data.content,
        authorName: parsed.data.authorName,
        createdById: session.user.id,
      },
      include: {
        createdBy: { select: { fullName: true } },
      },
    });

    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (err) {
    console.error("Create news comment error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

