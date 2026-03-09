import { NextResponse, type NextRequest } from "next/server";
import { requireTenantRoles } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

type SearchMode = "name" | "location";

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return {
      firstName: parts[0] ?? fullName,
      lastName: "",
    };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
};

const toNumber = (value: string | null) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export async function GET(request: NextRequest) {
  try {
    const { error, session } = await requireTenantRoles(request, [
      "OWNER",
      "ADMIN",
      "EDITOR",
      "VIEWER",
    ]);
    if (error || !session) return error;

    const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
    const modeParam = request.nextUrl.searchParams.get("mode");
    const mode: SearchMode = modeParam === "location" ? "location" : "name";
    const relation = request.nextUrl.searchParams.get("relation")?.trim() ?? "";
    const birthFrom = toNumber(request.nextUrl.searchParams.get("birthFrom"));
    const birthTo = toNumber(request.nextUrl.searchParams.get("birthTo"));
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
    const pageSize = Math.max(
      1,
      Math.min(100, Number(request.nextUrl.searchParams.get("pageSize")) || 100),
    );

    const members = await prisma.familyMember.findMany({
      where: {
        familyTreeId: session.activeFamilyTreeId!,
      },
      select: {
        id: true,
        fullName: true,
        relation: true,
        birthYear: true,
        deathYear: true,
        parentId: true,
        spouseIds: true,
        gender: true,
        imageUrl: true,
        note: true,
        createdAt: true,
      },
      orderBy: [{ generation: "asc" }, { createdAt: "asc" }],
    });

    const memberMap = new Map(members.map((member) => [member.id, member]));

    const relationOptions = Array.from(
      new Set(members.map((member) => member.relation?.trim()).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b, "vi"));

    const normalizedQuery = query.toLowerCase();
    const normalizedRelation = relation.toLowerCase();

    const prepared = members.map((member) => {
      const parent = member.parentId ? memberMap.get(member.parentId) : undefined;
      const spouses = (parent?.spouseIds ?? [])
        .map((spouseId) => memberMap.get(spouseId))
        .filter((spouse): spouse is NonNullable<typeof spouse> => Boolean(spouse));

      let father: string | undefined;
      let mother: string | undefined;

      if (parent) {
        if (parent.gender === "MALE") father = parent.fullName;
        else if (parent.gender === "FEMALE") mother = parent.fullName;
        else father = parent.fullName;
      }

      for (const spouse of spouses) {
        if (!father && spouse.gender === "MALE") father = spouse.fullName;
        if (!mother && spouse.gender === "FEMALE") mother = spouse.fullName;
      }

      const location = member.note?.trim() || "Chưa cập nhật";
      const { firstName, lastName } = splitName(member.fullName);

      return {
        id: member.id,
        firstName,
        lastName,
        relation: member.relation?.trim() || "Chưa cập nhật",
        birthYear: member.birthYear ?? 0,
        deathYear: member.deathYear ?? undefined,
        location,
        father,
        mother,
        image: member.imageUrl?.trim() || "/profile.jpeg",
        fullNameNormalized: member.fullName.toLowerCase(),
        locationNormalized: location.toLowerCase(),
        relationNormalized: (member.relation ?? "").toLowerCase(),
      };
    });

    const filtered = prepared.filter((item) => {
      if (normalizedQuery) {
        const target = mode === "location" ? item.locationNormalized : item.fullNameNormalized;
        if (!target.includes(normalizedQuery)) return false;
      }

      if (normalizedRelation && item.relationNormalized !== normalizedRelation) return false;
      if (birthFrom !== undefined && item.birthYear < birthFrom) return false;
      if (birthTo !== undefined && item.birthYear > birthTo) return false;
      return true;
    });

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize).map((item) => ({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      relation: item.relation,
      birthYear: item.birthYear,
      deathYear: item.deathYear,
      location: item.location,
      father: item.father,
      mother: item.mother,
      image: item.image,
    }));

    return NextResponse.json({
      data: paged,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
        relationOptions,
      },
    });
  } catch (err) {
    console.error("Search family members error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
