import { unlink } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { requireTenantRoles } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

interface MediaRouteContext {
  params: Promise<{ mediaId: string }>;
}

const mediaWriteRoles = ["OWNER", "ADMIN", "EDITOR"] as const;

export async function DELETE(request: NextRequest, context: MediaRouteContext) {
  try {
    const { error, session } = await requireTenantRoles(request, [...mediaWriteRoles]);
    if (error || !session) return error;

    const { mediaId } = await context.params;

    const existing = await prisma.mediaAsset.findFirst({
      where: {
        id: mediaId,
        familyTreeId: session.activeFamilyTreeId!,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    await prisma.mediaAsset.delete({ where: { id: existing.id } });

    if (existing.url.startsWith(`/uploads/${session.activeFamilyTreeId!}/`)) {
      const relativePath = existing.url.replace(/^\//, "");
      const absolutePath = path.join(process.cwd(), "public", relativePath);
      await unlink(absolutePath).catch(() => undefined);
    }

    return NextResponse.json({ data: { success: true } });
  } catch (err) {
    console.error("Delete media error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
