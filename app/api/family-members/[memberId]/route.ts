import { NextResponse, type NextRequest } from "next/server";
import { requireTenantRoles } from "@/lib/auth/guard";
import { familyMemberUpdateSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";

interface MemberRouteContext {
  params: Promise<{ memberId: string }>;
}

const createsParentCycle = (
  nextParentId: string,
  memberId: string,
  parentByMemberId: Map<string, string | null>,
) => {
  let cursor: string | null = nextParentId;
  const visited = new Set<string>();

  while (cursor) {
    if (cursor === memberId) return true;
    if (visited.has(cursor)) return true;
    visited.add(cursor);
    cursor = parentByMemberId.get(cursor) ?? null;
  }

  return false;
};

export async function GET(request: NextRequest, context: MemberRouteContext) {
  try {
    const { error, session } = await requireTenantRoles(request, [
      "OWNER",
      "ADMIN",
      "EDITOR",
      "VIEWER",
    ]);
    if (error || !session) return error;

    const { memberId } = await context.params;
    const member = await prisma.familyMember.findFirst({
      where: {
        id: memberId,
        familyTreeId: session.activeFamilyTreeId!,
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Family member not found" }, { status: 404 });
    }

    return NextResponse.json({ data: member });
  } catch (err) {
    console.error("Get family member error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: MemberRouteContext) {
  try {
    const { error, session } = await requireTenantRoles(request, [
      "OWNER",
      "ADMIN",
      "EDITOR",
    ]);
    if (error || !session) return error;

    const body = await request.json();
    const parsed = familyMemberUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { memberId } = await context.params;
    const familyTreeId = session.activeFamilyTreeId!;
    const existing = await prisma.familyMember.findFirst({
      where: {
        id: memberId,
        familyTreeId,
      },
      select: { id: true, generation: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Family member not found" }, { status: 404 });
    }

    if (parsed.data.parentId === memberId) {
      return NextResponse.json({ error: "A member cannot be their own parent" }, { status: 400 });
    }

    let nextParentGeneration: number | null = null;
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
      nextParentGeneration = parent.generation;
    }

    if (parsed.data.parentId) {
      const relations = await prisma.familyMember.findMany({
        where: { familyTreeId },
        select: { id: true, parentId: true },
      });
      const parentByMemberId = new Map(relations.map((row) => [row.id, row.parentId]));
      if (createsParentCycle(parsed.data.parentId, memberId, parentByMemberId)) {
        return NextResponse.json(
          { error: "Invalid parent relationship: cycle detected" },
          { status: 400 },
        );
      }
    }

    const nextGeneration = parsed.data.generation ?? existing.generation;
    if (nextParentGeneration !== null && nextGeneration !== nextParentGeneration + 1) {
      return NextResponse.json(
        { error: "Generation must equal parent generation + 1" },
        { status: 400 },
      );
    }

    const uniqueSpouseIds = parsed.data.spouseIds
      ? Array.from(new Set(parsed.data.spouseIds))
      : undefined;
    if (uniqueSpouseIds?.includes(memberId)) {
      return NextResponse.json({ error: "A member cannot be their own spouse" }, { status: 400 });
    }
    if (uniqueSpouseIds && uniqueSpouseIds.length > 0) {
      const spouseRows = await prisma.familyMember.findMany({
        where: {
          id: { in: uniqueSpouseIds },
          familyTreeId,
        },
        select: { id: true },
      });
      if (spouseRows.length !== uniqueSpouseIds.length) {
        return NextResponse.json(
          { error: "One or more spouse IDs are invalid for active tenant" },
          { status: 400 },
        );
      }
    }

    const updated = await prisma.familyMember.updateMany({
      where: {
        id: memberId,
        familyTreeId,
      },
      data: {
        ...parsed.data,
        ...(uniqueSpouseIds ? { spouseIds: uniqueSpouseIds } : {}),
      },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Family member not found" }, { status: 404 });
    }

    const member = await prisma.familyMember.findFirst({
      where: {
        id: memberId,
        familyTreeId,
      },
    });

    return NextResponse.json({ data: member });
  } catch (err) {
    console.error("Update family member error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: MemberRouteContext) {
  try {
    const { error, session } = await requireTenantRoles(request, ["OWNER", "ADMIN"]);
    if (error || !session) return error;

    const { memberId } = await context.params;
    const familyTreeId = session.activeFamilyTreeId!;
    const existing = await prisma.familyMember.findFirst({
      where: { id: memberId, familyTreeId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Family member not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      const spouseLinkedRows = await tx.familyMember.findMany({
        where: {
          familyTreeId,
          spouseIds: { has: memberId },
        },
        select: { id: true, spouseIds: true },
      });

      await Promise.all(
        spouseLinkedRows.map((row) =>
          tx.familyMember.update({
            where: { id: row.id },
            data: {
              spouseIds: row.spouseIds.filter((spouseId) => spouseId !== memberId),
            },
          }),
        ),
      );

      await tx.familyMember.updateMany({
        where: {
          familyTreeId,
          parentId: memberId,
        },
        data: {
          parentId: null,
        },
      });

      await tx.familyMember.delete({
        where: {
          id: memberId,
        },
      });
    });

    return NextResponse.json({ data: { success: true } });
  } catch (err) {
    console.error("Delete family member error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
