import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { TreeRole, UserRole } from "@prisma/client";
import { getSessionFromRequest } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const requireAuth = async (request: NextRequest) => {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      session: null,
    };
  }

  return { error: null, session };
};

export const requireAnyRole = async (request: NextRequest, allowedRoles: UserRole[]) => {
  const { error, session } = await requireAuth(request);
  if (error || !session) {
    return { error, session: null };
  }

  if (!allowedRoles.includes(session.user.role)) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      session: null,
    };
  }

  return { error: null, session };
};

export const requireActiveTenant = async (request: NextRequest) => {
  const { error, session } = await requireAuth(request);
  if (error || !session) {
    return { error, session: null, membership: null };
  }

  if (!session.activeFamilyTreeId) {
    return {
      error: NextResponse.json({ error: "No active tenant selected" }, { status: 400 }),
      session: null,
      membership: null,
    };
  }

  const membership = await prisma.familyTreeMembership.findUnique({
    where: {
      userId_familyTreeId: {
        userId: session.user.id,
        familyTreeId: session.activeFamilyTreeId,
      },
    },
  });

  if (!membership) {
    return {
      error: NextResponse.json({ error: "Forbidden for active tenant" }, { status: 403 }),
      session: null,
      membership: null,
    };
  }

  return { error: null, session, membership };
};

export const requireTenantRoles = async (request: NextRequest, allowedRoles: TreeRole[]) => {
  const { error, session, membership } = await requireActiveTenant(request);
  if (error || !session || !membership) {
    return { error, session: null, membership: null };
  }

  if (!allowedRoles.includes(membership.role)) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      session: null,
      membership: null,
    };
  }

  return { error: null, session, membership };
};
