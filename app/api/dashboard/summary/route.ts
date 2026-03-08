import { NextResponse, type NextRequest } from "next/server";
import { requireActiveTenant } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export async function GET(request: NextRequest) {
  try {
    const { error, session } = await requireActiveTenant(request);
    if (error || !session) return error;

    const familyTreeId = session.activeFamilyTreeId!;
    const today = startOfToday();

    const [memberCount, events, recentMembers, tenantInfo] = await Promise.all([
      prisma.familyMember.count({
        where: { familyTreeId },
      }),
      prisma.event.findMany({
        where: {
          familyTreeId,
          startsAt: { gte: today },
        },
        orderBy: { startsAt: "asc" },
        take: 50,
      }),
      prisma.familyMember.findMany({
        where: { familyTreeId },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          fullName: true,
          generation: true,
          createdAt: true,
        },
      }),
      prisma.familyTree.findUnique({
        where: { id: familyTreeId },
        select: { id: true, name: true, createdAt: true },
      }),
    ]);

    const upcomingEvents = events.slice(0, 3);
    const upcomingAnniversaries = events
      .filter((event) => event.type === "ANNIVERSARY")
      .slice(0, 6);
    const upcomingBirthdays = events
      .filter((event) => event.type === "BIRTHDAY")
      .slice(0, 6);
    const eventCount30Days = events.filter((e) => {
      const diff = e.startsAt.getTime() - today.getTime();
      return diff <= 30 * 24 * 60 * 60 * 1000;
    }).length;

    return NextResponse.json({
      data: {
        tenant: tenantInfo,
        stats: {
          totalMembers: memberCount,
          upcomingEvents: eventCount30Days,
          totalEventsUpcoming: events.length,
        },
        upcomingEvents,
        upcomingAnniversaries,
        upcomingBirthdays,
        recentMembers,
      },
    });
  } catch (err) {
    console.error("Dashboard summary error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
