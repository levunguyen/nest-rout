import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { createTenantSchema, renameTenantSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";
import { setActiveFamilyTreeForRequest } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    const { error, session } = await requireAuth(request);
    if (error || !session) return error;

    const memberships = await prisma.familyTreeMembership.findMany({
      where: { userId: session.user.id },
      include: {
        familyTree: {
          select: { id: true, name: true, ownerId: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      data: memberships.map((m) => ({
        id: m.familyTree.id,
        name: m.familyTree.name,
        role: m.role,
        isOwner: m.familyTree.ownerId === session.user.id,
        createdAt: m.familyTree.createdAt,
      })),
      activeFamilyTreeId: session.activeFamilyTreeId,
    });
  } catch (err) {
    console.error("List tenants error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error, session } = await requireAuth(request);
    if (error || !session) return error;

    const body = await request.json();
    const parsed = createTenantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const tree = await prisma.$transaction(async (tx) => {
      const createdTree = await tx.familyTree.create({
        data: {
          name: parsed.data.name,
          ownerId: session.user.id,
        },
      });

      await tx.familyTreeMembership.create({
        data: {
          userId: session.user.id,
          familyTreeId: createdTree.id,
          role: "OWNER",
        },
      });

      return createdTree;
    });

    await setActiveFamilyTreeForRequest(request, tree.id);

    return NextResponse.json(
      { data: { id: tree.id, name: tree.name, role: "OWNER" } },
      { status: 201 },
    );
  } catch (err) {
    console.error("Create tenant error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { error, session } = await requireAuth(request);
    if (error || !session) return error;

    const body = await request.json();
    const parsed = renameTenantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const membership = await prisma.familyTreeMembership.findUnique({
      where: {
        userId_familyTreeId: {
          userId: session.user.id,
          familyTreeId: parsed.data.familyTreeId,
        },
      },
      select: { role: true },
    });
    if (!membership) {
      return NextResponse.json({ error: "Forbidden tenant access" }, { status: 403 });
    }
    if (!["OWNER", "ADMIN"].includes(membership.role)) {
      return NextResponse.json({ error: "Only OWNER/ADMIN can rename family tree" }, { status: 403 });
    }

    const updated = await prisma.familyTree.update({
      where: { id: parsed.data.familyTreeId },
      data: { name: parsed.data.name },
      select: { id: true, name: true },
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("Rename tenant error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
