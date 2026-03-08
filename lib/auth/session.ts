import { createHash, randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "session_token";
const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const REMEMBER_ME_SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

const hashToken = (token: string) => {
  return createHash("sha256").update(token).digest("hex");
};

export const getSessionCookieConfig = (maxAgeSeconds = DEFAULT_SESSION_TTL_SECONDS) => ({
  name: SESSION_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: maxAgeSeconds,
});

const getTokenHashFromRequest = (request: NextRequest) => {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return hashToken(token);
};

export const createSessionForUser = async (
  userId: string,
  activeFamilyTreeId?: string | null,
  ttlSeconds = DEFAULT_SESSION_TTL_SECONDS,
) => {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      activeFamilyTreeId: activeFamilyTreeId ?? null,
      expiresAt,
    },
  });

  return { token, expiresAt };
};

export const getSessionTtlByRememberMe = (rememberMe?: boolean) =>
  rememberMe ? REMEMBER_ME_SESSION_TTL_SECONDS : DEFAULT_SESSION_TTL_SECONDS;

export const getSessionFromRequest = async (request: NextRequest) => {
  const tokenHash = getTokenHashFromRequest(request);
  if (!tokenHash) return null;
  const now = new Date();
  const session = await prisma.session.findFirst({
    where: {
      tokenHash,
      expiresAt: {
        gt: now,
      },
    },
    include: {
      user: true,
      activeFamilyTree: true,
    },
  });

  if (!session) return null;

  await prisma.session.update({
    where: { id: session.id },
    data: { lastUsedAt: now },
  });

  return session;
};

export const revokeSessionFromRequest = async (request: NextRequest) => {
  const tokenHash = getTokenHashFromRequest(request);
  if (!tokenHash) return;

  await prisma.session.deleteMany({
    where: { tokenHash },
  });
};

export const setActiveFamilyTreeForRequest = async (
  request: NextRequest,
  familyTreeId: string,
) => {
  const tokenHash = getTokenHashFromRequest(request);
  if (!tokenHash) return false;

  const updated = await prisma.session.updateMany({
    where: { tokenHash },
    data: { activeFamilyTreeId: familyTreeId },
  });

  return updated.count > 0;
};
