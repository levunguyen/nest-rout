import { NextResponse, type NextRequest } from "next/server";
import { requireTenantRoles } from "@/lib/auth/guard";
import { newsCommentUpdateSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";

interface NewsCommentIdRouteContext {
  params: Promise<{ newsId: string; commentId: string }>;
}

export async function GET(request: NextRequest, context: NewsCommentIdRouteContext) {
  try {
    const { error, session } = await requireTenantRoles(request, [
      "OWNER",
      "ADMIN",
      "EDITOR",
      "VIEWER",
    ]);
    if (error || !session) return error;

    const { newsId, commentId } = await context.params;
    const comment = await prisma.newsComment.findFirst({
      where: {
        id: commentId,
        newsPostId: newsId,
        familyTreeId: session.activeFamilyTreeId!,
      },
      include: {
        createdBy: { select: { fullName: true } },
      },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ data: comment });
  } catch (err) {
    console.error("Get news comment error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: NewsCommentIdRouteContext) {
  try {
    const { error, session, membership } = await requireTenantRoles(request, [
      "OWNER",
      "ADMIN",
      "EDITOR",
      "VIEWER",
    ]);
    if (error || !session || !membership) return error;

    const { newsId, commentId } = await context.params;
    const existing = await prisma.newsComment.findFirst({
      where: {
        id: commentId,
        newsPostId: newsId,
        familyTreeId: session.activeFamilyTreeId!,
      },
      select: { id: true, createdById: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const canEdit = ["OWNER", "ADMIN", "EDITOR"].includes(membership.role);
    const isOwnComment = existing.createdById === session.user.id;
    if (!canEdit && !isOwnComment) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = newsCommentUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updated = await prisma.newsComment.update({
      where: { id: commentId },
      data: {
        content: parsed.data.content,
        authorName: parsed.data.authorName,
      },
      include: {
        createdBy: { select: { fullName: true } },
      },
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("Update news comment error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: NewsCommentIdRouteContext) {
  try {
    const { error, session, membership } = await requireTenantRoles(request, [
      "OWNER",
      "ADMIN",
      "EDITOR",
      "VIEWER",
    ]);
    if (error || !session || !membership) return error;

    const { newsId, commentId } = await context.params;
    const existing = await prisma.newsComment.findFirst({
      where: {
        id: commentId,
        newsPostId: newsId,
        familyTreeId: session.activeFamilyTreeId!,
      },
      select: { id: true, createdById: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const canDelete = ["OWNER", "ADMIN", "EDITOR"].includes(membership.role);
    const isOwnComment = existing.createdById === session.user.id;
    if (!canDelete && !isOwnComment) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.newsComment.delete({ where: { id: commentId } });
    return NextResponse.json({ data: { success: true } });
  } catch (err) {
    console.error("Delete news comment error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
