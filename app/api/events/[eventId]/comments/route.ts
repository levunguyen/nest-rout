import { NextResponse, type NextRequest } from "next/server";
import { requireTenantRoles } from "@/lib/auth/guard";
import { eventCommentCreateSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";

interface EventCommentRouteContext {
  params: Promise<{ eventId: string }>;
}

const readableRoles = ["OWNER", "ADMIN", "EDITOR", "VIEWER"] as const;

export async function GET(request: NextRequest, context: EventCommentRouteContext) {
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

    const comments = await prisma.eventComment.findMany({
      where: {
        familyTreeId: session.activeFamilyTreeId!,
        eventId,
      },
      include: {
        createdBy: { select: { fullName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return NextResponse.json({ data: comments });
  } catch (err) {
    console.error("List event comments error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: EventCommentRouteContext) {
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
    const parsed = eventCommentCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const comment = await prisma.eventComment.create({
      data: {
        eventId,
        familyTreeId: session.activeFamilyTreeId!,
        createdById: session.user.id,
        content: parsed.data.content,
      },
      include: {
        createdBy: { select: { fullName: true } },
      },
    });

    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (err) {
    console.error("Create event comment error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
