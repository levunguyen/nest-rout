import { NextResponse, type NextRequest } from "next/server";
import { MediaKind } from "@prisma/client";
import { requireTenantRoles } from "@/lib/auth/guard";
import { mediaAssetCreateSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";

const mediaReadRoles = ["OWNER", "ADMIN", "EDITOR", "VIEWER"] as const;
const mediaWriteRoles = ["OWNER", "ADMIN", "EDITOR"] as const;

export async function GET(request: NextRequest) {
  try {
    const { error, session } = await requireTenantRoles(request, [...mediaReadRoles]);
    if (error || !session) return error;

    const kindParam = request.nextUrl.searchParams.get("kind");
    const searchParam = request.nextUrl.searchParams.get("search")?.trim();

    const items = await prisma.mediaAsset.findMany({
      where: {
        familyTreeId: session.activeFamilyTreeId!,
        ...(kindParam === "image" ? { kind: MediaKind.IMAGE } : {}),
        ...(kindParam === "video" ? { kind: MediaKind.VIDEO } : {}),
        ...(searchParam
          ? {
              OR: [
                { name: { contains: searchParam, mode: "insensitive" } },
                { category: { contains: searchParam, mode: "insensitive" } },
                { usedBy: { contains: searchParam, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      data: items.map((item) => ({
        id: item.id,
        name: item.name,
        kind: item.kind === MediaKind.IMAGE ? "image" : "video",
        category: item.category,
        usedBy: item.usedBy,
        url: item.url,
        sizeMb: item.sizeMb,
        mimeType: item.mimeType,
        originalName: item.originalName,
        uploadedDate: item.createdAt.toISOString().slice(0, 10),
        createdAt: item.createdAt,
      })),
    });
  } catch (err) {
    console.error("List media error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error, session } = await requireTenantRoles(request, [...mediaWriteRoles]);
    if (error || !session) return error;

    const body = await request.json();
    const parsed = mediaAssetCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const created = await prisma.mediaAsset.create({
      data: {
        familyTreeId: session.activeFamilyTreeId!,
        createdById: session.user.id,
        name: parsed.data.name,
        kind: parsed.data.kind === "image" ? MediaKind.IMAGE : MediaKind.VIDEO,
        category: parsed.data.category,
        usedBy: parsed.data.usedBy,
        url: parsed.data.url,
        sizeMb: parsed.data.sizeMb,
        mimeType: parsed.data.mimeType,
        originalName: parsed.data.originalName,
      },
    });

    return NextResponse.json(
      {
        data: {
          id: created.id,
          name: created.name,
          kind: created.kind === MediaKind.IMAGE ? "image" : "video",
          category: created.category,
          usedBy: created.usedBy,
          url: created.url,
          sizeMb: created.sizeMb,
          mimeType: created.mimeType,
          originalName: created.originalName,
          uploadedDate: created.createdAt.toISOString().slice(0, 10),
          createdAt: created.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Create media error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
