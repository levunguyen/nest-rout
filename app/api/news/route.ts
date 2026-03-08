import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { requireTenantRoles } from "@/lib/auth/guard";
import { newsPostCreateSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";

const newsRoleRead = ["OWNER", "ADMIN", "EDITOR", "VIEWER"] as const;
const newsRoleWrite = ["OWNER", "ADMIN", "EDITOR"] as const;

export async function GET(request: NextRequest) {
  try {
    const { error, session } = await requireTenantRoles(request, [...newsRoleRead]);
    if (error || !session) return error;

    const search = request.nextUrl.searchParams.get("search")?.trim();
    const category = request.nextUrl.searchParams.get("category")?.trim();
    const featured = request.nextUrl.searchParams.get("featured");
    const pageParam = request.nextUrl.searchParams.get("page");
    const pageSizeParam = request.nextUrl.searchParams.get("pageSize");
    const limitParam = request.nextUrl.searchParams.get("limit");
    const sortBy = request.nextUrl.searchParams.get("sortBy");
    const sortOrderParam = request.nextUrl.searchParams.get("sortOrder");
    const sortOrder: Prisma.SortOrder = sortOrderParam === "asc" ? "asc" : "desc";

    const page = Math.max(1, Number(pageParam) || 1);
    const pageSize = pageSizeParam
      ? Math.max(1, Math.min(100, Number(pageSizeParam) || 20))
      : limitParam
        ? Math.max(1, Math.min(100, Number(limitParam) || 20))
        : 20;
    const skip = (page - 1) * pageSize;

    const where: Prisma.NewsPostWhereInput = {
      familyTreeId: session.activeFamilyTreeId!,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = { equals: category, mode: "insensitive" };
    }

    if (featured === "true") {
      where.featured = true;
    } else if (featured === "false") {
      where.featured = false;
    }

    const orderBy: Prisma.NewsPostOrderByWithRelationInput[] = (() => {
      if (sortBy === "title") {
        return [{ title: sortOrder }, { publishedAt: "desc" }];
      }
      if (sortBy === "comments") {
        return [{ comments: { _count: sortOrder } }, { publishedAt: "desc" }];
      }
      // default: by published date
      return [{ featured: "desc" }, { publishedAt: sortOrder }];
    })();

    const [posts, total] = await Promise.all([
      prisma.newsPost.findMany({
        where,
        include: {
          createdBy: { select: { fullName: true } },
          _count: { select: { comments: true } },
        },
        orderBy,
        take: pageSize,
        skip,
      }),
      prisma.newsPost.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json({
      data: posts,
      meta: {
        page,
        pageSize,
        total,
        totalPages,
      },
    });
  } catch (err) {
    console.error("List news error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error, session } = await requireTenantRoles(request, [...newsRoleWrite]);
    if (error || !session) return error;

    const body = await request.json();
    const parsed = newsPostCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const post = await prisma.newsPost.create({
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
        familyTreeId: session.activeFamilyTreeId!,
        createdById: session.user.id,
      },
      include: {
        createdBy: { select: { fullName: true } },
        _count: { select: { comments: true } },
      },
    });

    return NextResponse.json({ data: post }, { status: 201 });
  } catch (err) {
    console.error("Create news error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
