import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { requireTenantRoles } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

type SearchMode = "name" | "location";

const MAX_LIMIT = 10;

export async function GET(request: NextRequest) {
  try {
    const { error, session } = await requireTenantRoles(request, [
      "OWNER",
      "ADMIN",
      "EDITOR",
      "VIEWER",
    ]);
    if (error || !session) return error;

    const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
    const modeParam = request.nextUrl.searchParams.get("mode");
    const mode: SearchMode = modeParam === "location" ? "location" : "name";
    const limit = Math.max(
      1,
      Math.min(MAX_LIMIT, Number(request.nextUrl.searchParams.get("limit")) || MAX_LIMIT),
    );

    if (q.length < 1) {
      return NextResponse.json({ data: [] });
    }

    if (mode === "name") {
      const where: Prisma.FamilyMemberWhereInput = {
        familyTreeId: session.activeFamilyTreeId!,
        fullName: {
          contains: q,
          mode: "insensitive",
        },
      };

      const members = await prisma.familyMember.findMany({
        where,
        select: {
          fullName: true,
        },
        orderBy: {
          fullName: "asc",
        },
        take: limit * 2,
      });

      const seen = new Set<string>();
      const suggestions: string[] = [];
      for (const member of members) {
        const value = member.fullName.trim();
        const key = value.toLowerCase();
        if (!value || seen.has(key)) continue;
        seen.add(key);
        suggestions.push(value);
        if (suggestions.length >= limit) break;
      }

      return NextResponse.json({ data: suggestions });
    }

    const where: Prisma.FamilyMemberWhereInput = {
      familyTreeId: session.activeFamilyTreeId!,
      note: {
        contains: q,
        mode: "insensitive",
      },
    };

    const members = await prisma.familyMember.findMany({
      where,
      select: {
        note: true,
      },
      orderBy: {
        note: "asc",
      },
      take: limit * 3,
    });

    const seen = new Set<string>();
    const suggestions: string[] = [];
    for (const member of members) {
      const value = member.note?.trim();
      if (!value) continue;
      const key = value.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      suggestions.push(value);
      if (suggestions.length >= limit) break;
    }

    return NextResponse.json({ data: suggestions });
  } catch (err) {
    console.error("Search suggestions error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
