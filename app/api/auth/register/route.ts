import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSessionForUser, getSessionCookieConfig } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { fullName, email, password, invitationToken } = parsed.data;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    let invitation:
      | {
          id: string;
          familyTreeId: string;
          email: string;
          role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
          status: "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";
          expiresAt: Date;
        }
      | null = null;

    if (invitationToken) {
      invitation = await prisma.invitation.findUnique({
        where: { token: invitationToken },
        select: {
          id: true,
          familyTreeId: true,
          email: true,
          role: true,
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
      if (invitation.email !== email) {
        return NextResponse.json(
          { error: "Invitation email does not match registration email" },
          { status: 400 },
        );
      }
    }

    const passwordHash = await hashPassword(password);
    const { user, activeFamilyTreeId } = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          fullName,
          email,
          passwordHash,
          role: "ADMIN_GENEALOGY",
        },
      });

      if (invitation) {
        await tx.familyTreeMembership.upsert({
          where: {
            userId_familyTreeId: {
              userId: createdUser.id,
              familyTreeId: invitation.familyTreeId,
            },
          },
          update: {
            role: invitation.role,
          },
          create: {
            userId: createdUser.id,
            familyTreeId: invitation.familyTreeId,
            role: invitation.role,
          },
        });

        await tx.invitation.update({
          where: { id: invitation.id },
          data: {
            status: "ACCEPTED",
            acceptedAt: new Date(),
            acceptedByUserId: createdUser.id,
          },
        });

        return { user: createdUser, activeFamilyTreeId: invitation.familyTreeId };
      }

      const familyTree = await tx.familyTree.create({
        data: {
          name: `${fullName}'s Family Tree`,
          ownerId: createdUser.id,
        },
      });

      await tx.familyTreeMembership.create({
        data: {
          userId: createdUser.id,
          familyTreeId: familyTree.id,
          role: "OWNER",
        },
      });

      return { user: createdUser, activeFamilyTreeId: familyTree.id };
    });

    const { token } = await createSessionForUser(user.id, activeFamilyTreeId);
    const response = NextResponse.json(
      {
        data: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          activeFamilyTreeId,
        },
      },
      { status: 201 },
    );

    const cookieConfig = getSessionCookieConfig();
    response.cookies.set(cookieConfig.name, token, cookieConfig);
    return response;
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
