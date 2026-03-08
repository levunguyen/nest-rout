import { NextResponse, type NextRequest } from "next/server";
import { requireTenantRoles } from "@/lib/auth/guard";
import { newsPostUpdateSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";

interface NewsRouteContext {
  params: Promise<{ newsId: string }>;
}

export async function GET(request: NextRequest, context: NewsRouteContext) {
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
      include: {
        createdBy: { select: { fullName: true } },
        _count: { select: { comments: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "News post not found" }, { status: 404 });
    }

    return NextResponse.json({ data: post });
  } catch (err) {
    console.error("Get news post error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: NewsRouteContext) {
  try {
    const { error, session } = await requireTenantRoles(request, ["OWNER", "ADMIN", "EDITOR"]);
    if (error || !session) return error;

    const body = await request.json();
    const parsed = newsPostUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { newsId } = await context.params;
    const updated = await prisma.newsPost.updateMany({
      where: { id: newsId, familyTreeId: session.activeFamilyTreeId! },
      data: {
        title: parsed.data.title,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        imageUrl: parsed.data.imageUrl,
        category: parsed.data.category,
        readTimeMinutes: parsed.data.readTimeMinutes,
        featured: parsed.data.featured,
        publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : undefined,
        authorName: parsed.data.authorName,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "News post not found" }, { status: 404 });
    }

    const post = await prisma.newsPost.findFirst({
      where: { id: newsId, familyTreeId: session.activeFamilyTreeId! },
      include: {
        createdBy: { select: { fullName: true } },
        _count: { select: { comments: true } },
      },
    });

    return NextResponse.json({ data: post });
  } catch (err) {
    console.error("Update news post error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: NewsRouteContext) {
  try {
    const { error, session } = await requireTenantRoles(request, ["OWNER", "ADMIN"]);
    if (error || !session) return error;

    const { newsId } = await context.params;
    const deleted = await prisma.newsPost.deleteMany({
      where: { id: newsId, familyTreeId: session.activeFamilyTreeId! },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "News post not found" }, { status: 404 });
    }

    return NextResponse.json({ data: { success: true } });
  } catch (err) {
    console.error("Delete news post error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

