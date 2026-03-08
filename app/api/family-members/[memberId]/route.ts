import { NextResponse, type NextRequest } from "next/server";
import { requireTenantRoles } from "@/lib/auth/guard";
import { familyMemberUpdateSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";

interface MemberRouteContext {
  params: Promise<{ memberId: string }>;
}

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

    const { memberId } = await context.params;
    const updated = await prisma.familyMember.updateMany({
      where: {
        id: memberId,
        familyTreeId: session.activeFamilyTreeId!,
      },
      data: {
        ...parsed.data,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Family member not found" }, { status: 404 });
    }

    const member = await prisma.familyMember.findFirst({
      where: {
        id: memberId,
        familyTreeId: session.activeFamilyTreeId!,
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
    const deleted = await prisma.familyMember.deleteMany({
      where: {
        id: memberId,
        familyTreeId: session.activeFamilyTreeId!,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Family member not found" }, { status: 404 });
    }

    return NextResponse.json({ data: { success: true } });
  } catch (err) {
    console.error("Delete family member error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
