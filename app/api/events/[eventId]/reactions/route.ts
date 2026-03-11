import { NextResponse, type NextRequest } from "next/server";
import { requireTenantRoles } from "@/lib/auth/guard";
import { eventReactionSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";

interface EventReactionRouteContext {
  params: Promise<{ eventId: string }>;
}

const readableRoles = ["OWNER", "ADMIN", "EDITOR", "VIEWER"] as const;

export async function GET(request: NextRequest, context: EventReactionRouteContext) {
  try {
    const { error, session } = await requireTenantRoles(request, [...readableRoles]);
    if (error || !session) return error;

    const { eventId } = await context.params;
    const event = await prisma.event.findFirst({
      where: { id: eventId, familyTreeId: session.activeFamilyTreeId! },
      select: { id: true },
    });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const [stats, mine] = await Promise.all([
      prisma.eventReaction.groupBy({
        by: ["type"],
        where: {
          familyTreeId: session.activeFamilyTreeId!,
          eventId,
        },
        _count: {
          _all: true,
        },
      }),
      prisma.eventReaction.findMany({
        where: {
          familyTreeId: session.activeFamilyTreeId!,
          eventId,
          createdById: session.user.id,
        },
        select: { type: true },
      }),
    ]);

    return NextResponse.json({
      data: {
        counts: {
          like: stats.find((s) => s.type === "LIKE")?._count._all ?? 0,
          heart: stats.find((s) => s.type === "HEART")?._count._all ?? 0,
        },
        mine: mine.map((item) => item.type),
      },
    });
  } catch (err) {
    console.error("List event reactions error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: EventReactionRouteContext) {
  try {
    const { error, session } = await requireTenantRoles(request, [...readableRoles]);
    if (error || !session) return error;

    const { eventId } = await context.params;
    const event = await prisma.event.findFirst({
      where: { id: eventId, familyTreeId: session.activeFamilyTreeId! },
      select: { id: true },
    });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = eventReactionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const existing = await prisma.eventReaction.findFirst({
      where: {
        familyTreeId: session.activeFamilyTreeId!,
        eventId,
        createdById: session.user.id,
        type: parsed.data.type,
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.eventReaction.deleteMany({
        where: {
          familyTreeId: session.activeFamilyTreeId!,
          eventId,
          createdById: session.user.id,
          type: parsed.data.type,
        },
      });
    } else {
      await prisma.eventReaction.create({
        data: {
          eventId,
          familyTreeId: session.activeFamilyTreeId!,
          createdById: session.user.id,
          type: parsed.data.type,
        },
      });
    }

    const stats = await prisma.eventReaction.groupBy({
      by: ["type"],
      where: {
        familyTreeId: session.activeFamilyTreeId!,
        eventId,
      },
      _count: {
        _all: true,
      },
    });

    return NextResponse.json({
      data: {
        counts: {
          like: stats.find((s) => s.type === "LIKE")?._count._all ?? 0,
          heart: stats.find((s) => s.type === "HEART")?._count._all ?? 0,
        },
        toggledType: parsed.data.type,
      },
    });
  } catch (err) {
    console.error("Toggle event reaction error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
