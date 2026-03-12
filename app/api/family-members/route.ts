import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { requireTenantRoles } from "@/lib/auth/guard";
import { familyMemberCreateSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { error, session } = await requireTenantRoles(request, [
      "OWNER",
      "ADMIN",
      "EDITOR",
      "VIEWER",
    ]);
    if (error || !session) return error;

    const search = request.nextUrl.searchParams.get("search")?.trim();
    const where: Prisma.FamilyMemberWhereInput = search
      ? {
          familyTreeId: session.activeFamilyTreeId!,
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { relation: { contains: search, mode: "insensitive" } },
          ],
        }
      : { familyTreeId: session.activeFamilyTreeId! };

    const members = await prisma.familyMember.findMany({
      where,
      orderBy: [{ generation: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ data: members });
  } catch (err) {
    console.error("List family members error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error, session } = await requireTenantRoles(request, [
      "OWNER",
      "ADMIN",
      "EDITOR",
    ]);
    if (error || !session) return error;

    const body = await request.json();
    const parsed = familyMemberCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const familyTreeId = session.activeFamilyTreeId!;
    let parentGeneration: number | null = null;

    if (parsed.data.parentId) {
      const parent = await prisma.familyMember.findFirst({
        where: {
          id: parsed.data.parentId,
          familyTreeId,
        },
        select: { id: true, generation: true },
      });
      if (!parent) {
        return NextResponse.json({ error: "Parent not found in active tenant" }, { status: 400 });
      }
      parentGeneration = parent.generation;
    }

    if (parentGeneration !== null && parsed.data.generation !== parentGeneration + 1) {
      return NextResponse.json(
        { error: "Generation must equal parent generation + 1" },
        { status: 400 },
      );
    }

    const uniqueSpouseIds = Array.from(new Set(parsed.data.spouseIds ?? []));
    if (uniqueSpouseIds.length > 0) {
      const spouses = await prisma.familyMember.findMany({
        where: {
          id: { in: uniqueSpouseIds },
          familyTreeId,
        },
        select: { id: true },
      });
      if (spouses.length !== uniqueSpouseIds.length) {
        return NextResponse.json(
          { error: "One or more spouse IDs are invalid for active tenant" },
          { status: 400 },
        );
      }
    }

    const member = await prisma.familyMember.create({
      data: {
        ...parsed.data,
        spouseIds: uniqueSpouseIds,
        familyTreeId,
        createdById: session.user.id,
      },
    });

    return NextResponse.json({ data: member }, { status: 201 });
  } catch (err) {
    console.error("Create family member error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
