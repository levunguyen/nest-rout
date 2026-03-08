import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { error, session } = await requireAuth(request);
    if (error || !session) return error;

    const memberships = await prisma.familyTreeMembership.findMany({
      where: { userId: session.user.id },
      include: {
        familyTree: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      data: {
        id: session.user.id,
        fullName: session.user.fullName,
        email: session.user.email,
        role: session.user.role,
        activeFamilyTreeId: session.activeFamilyTreeId,
        tenants: memberships.map((m) => ({
          id: m.familyTree.id,
          name: m.familyTree.name,
          role: m.role,
        })),
      },
    });
  } catch (err) {
    console.error("Me error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
