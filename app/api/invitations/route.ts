import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireTenantRoles } from "@/lib/auth/guard";
import { createInvitationSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { error, session } = await requireTenantRoles(request, ["OWNER", "ADMIN"]);
    if (error || !session) return error;

    const invitations = await prisma.invitation.findMany({
      where: { familyTreeId: session.activeFamilyTreeId! },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        token: true,
        email: true,
        role: true,
        status: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      data: invitations.map((invitation) => ({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
        createdAt: invitation.createdAt,
        invitationUrl: `${request.nextUrl.origin}/signup?inviteToken=${invitation.token}`,
      })),
    });
  } catch (err) {
    console.error("List invitations error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error, session, membership } = await requireTenantRoles(request, ["OWNER", "ADMIN"]);
    if (error || !session || !membership) return error;

    const body = await request.json();
    const parsed = createInvitationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    if (membership.role === "ADMIN" && parsed.data.role === "ADMIN") {
      return NextResponse.json(
        { error: "Only OWNER can invite ADMIN role" },
        { status: 403 },
      );
    }

    const token = randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + parsed.data.expiresInDays * 24 * 60 * 60 * 1000);

    const invitation = await prisma.invitation.create({
      data: {
        token,
        familyTreeId: session.activeFamilyTreeId!,
        email: parsed.data.email,
        role: parsed.data.role,
        invitedByUserId: session.user.id,
        expiresAt,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        expiresAt: true,
        token: true,
      },
    });

    const invitationUrl = `${request.nextUrl.origin}/signup?inviteToken=${invitation.token}`;
    return NextResponse.json(
      {
        data: {
          ...invitation,
          invitationUrl,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Create invitation error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
