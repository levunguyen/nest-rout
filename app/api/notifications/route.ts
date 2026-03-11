import { NextResponse, type NextRequest } from "next/server";
import { requireActiveTenant } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { error, session } = await requireActiveTenant(request);
    if (error || !session) return error;

    const items = await prisma.familyMember.findMany({
      where: {
        familyTreeId: session.activeFamilyTreeId!,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
      select: {
        id: true,
        fullName: true,
        generation: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      data: items.map((item) => ({
        id: item.id,
        type: "MEMBER_ADDED" as const,
        title: "Thêm thành viên mới",
        description: `${item.fullName} vừa được thêm vào gia phả (đời ${item.generation}).`,
        createdAt: item.createdAt,
      })),
    });
  } catch (err) {
    console.error("List notifications error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
