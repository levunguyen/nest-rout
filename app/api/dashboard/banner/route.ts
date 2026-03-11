import { NextResponse, type NextRequest } from "next/server";
import { requireTenantRoles } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

const writableRoles = ["OWNER", "ADMIN", "EDITOR"] as const;

export async function DELETE(request: NextRequest) {
  try {
    const { error, session } = await requireTenantRoles(request, [...writableRoles]);
    if (error || !session) return error;

    await prisma.mediaAsset.updateMany({
      where: {
        familyTreeId: session.activeFamilyTreeId!,
        usedBy: "dashboard_banner",
      },
      data: {
        usedBy: "dashboard_banner_history",
      },
    });

    return NextResponse.json({ data: { ok: true } });
  } catch (err) {
    console.error("Reset dashboard banner error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

