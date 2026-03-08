import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { switchTenantSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";
import { setActiveFamilyTreeForRequest } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const { error, session } = await requireAuth(request);
    if (error || !session) return error;

    const body = await request.json();
    const parsed = switchTenantSchema.safeParse(body);
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
    });
    if (!membership) {
      return NextResponse.json({ error: "Forbidden tenant switch" }, { status: 403 });
    }

    const ok = await setActiveFamilyTreeForRequest(request, parsed.data.familyTreeId);
    if (!ok) {
      return NextResponse.json({ error: "Unable to switch tenant" }, { status: 400 });
    }

    return NextResponse.json({ data: { activeFamilyTreeId: parsed.data.familyTreeId } });
  } catch (err) {
    console.error("Switch tenant error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
