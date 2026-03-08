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

    if (parsed.data.parentId) {
      const parent = await prisma.familyMember.findFirst({
        where: {
          id: parsed.data.parentId,
          familyTreeId: session.activeFamilyTreeId!,
        },
        select: { id: true },
      });
      if (!parent) {
        return NextResponse.json({ error: "Parent not found in active tenant" }, { status: 400 });
      }
    }

    const member = await prisma.familyMember.create({
      data: {
        ...parsed.data,
        familyTreeId: session.activeFamilyTreeId!,
        createdById: session.user.id,
      },
    });

    return NextResponse.json({ data: member }, { status: 201 });
  } catch (err) {
    console.error("Create family member error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
