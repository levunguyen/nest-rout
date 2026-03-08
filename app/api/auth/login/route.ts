import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/auth/schemas";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSessionForUser,
  getSessionCookieConfig,
  getSessionTtlByRememberMe,
} from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { email, password, rememberMe } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const memberships = await prisma.familyTreeMembership.findMany({
      where: { userId: user.id },
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
      select: { familyTreeId: true },
    });

    let activeFamilyTreeId = memberships[0]?.familyTreeId;

    if (!activeFamilyTreeId) {
      const bootstrap = await prisma.$transaction(async (tx) => {
        const familyTree = await tx.familyTree.create({
          data: {
            name: `${user.fullName}'s Family Tree`,
            ownerId: user.id,
          },
        });
        await tx.familyTreeMembership.create({
          data: {
            userId: user.id,
            familyTreeId: familyTree.id,
            role: "OWNER",
          },
        });
        return familyTree.id;
      });
      activeFamilyTreeId = bootstrap;
    }

    const ttlSeconds = getSessionTtlByRememberMe(rememberMe);
    const { token } = await createSessionForUser(user.id, activeFamilyTreeId, ttlSeconds);
    const response = NextResponse.json({
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        activeFamilyTreeId,
      },
    });

    const cookieConfig = getSessionCookieConfig(ttlSeconds);
    response.cookies.set(cookieConfig.name, token, cookieConfig);
    return response;
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
