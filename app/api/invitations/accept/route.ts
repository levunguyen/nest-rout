import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { acceptInvitationSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";
import { setActiveFamilyTreeForRequest } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const { error, session } = await requireAuth(request);
    if (error || !session) return error;

    const body = await request.json();
    const parsed = acceptInvitationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const invitation = await prisma.invitation.findUnique({
      where: { token: parsed.data.token },
      select: {
        id: true,
        email: true,
        role: true,
        familyTreeId: true,
        status: true,
        expiresAt: true,
      },
    });
    if (!invitation) {
      return NextResponse.json({ error: "Invalid invitation token" }, { status: 400 });
    }
    if (invitation.status !== "PENDING") {
      return NextResponse.json({ error: "Invitation is no longer pending" }, { status: 400 });
    }
    if (invitation.expiresAt <= new Date()) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json({ error: "Invitation has expired" }, { status: 400 });
    }
    if (invitation.email !== session.user.email) {
      return NextResponse.json({ error: "Invitation email does not match user email" }, { status: 403 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.familyTreeMembership.upsert({
        where: {
          userId_familyTreeId: {
            userId: session.user.id,
            familyTreeId: invitation.familyTreeId,
          },
        },
        update: {
          role: invitation.role,
        },
        create: {
          userId: session.user.id,
          familyTreeId: invitation.familyTreeId,
          role: invitation.role,
        },
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
          acceptedByUserId: session.user.id,
        },
      });
    });

    await setActiveFamilyTreeForRequest(request, invitation.familyTreeId);

    return NextResponse.json({
      data: {
        success: true,
        activeFamilyTreeId: invitation.familyTreeId,
      },
    });
  } catch (err) {
    console.error("Accept invitation error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
