import { NextResponse, type NextRequest } from "next/server";
import { requireTenantRoles } from "@/lib/auth/guard";
import { eventUpdateSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";

interface EventRouteContext {
  params: Promise<{ eventId: string }>;
}

export async function GET(request: NextRequest, context: EventRouteContext) {
  try {
    const { error, session } = await requireTenantRoles(request, [
      "OWNER",
      "ADMIN",
      "EDITOR",
      "VIEWER",
    ]);
    if (error || !session) return error;

    const { eventId } = await context.params;
    const event = await prisma.event.findFirst({
      where: { id: eventId, familyTreeId: session.activeFamilyTreeId! },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ data: event });
  } catch (err) {
    console.error("Get event error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: EventRouteContext) {
  try {
    const { error, session } = await requireTenantRoles(request, ["OWNER", "ADMIN", "EDITOR"]);
    if (error || !session) return error;

    const body = await request.json();
    const parsed = eventUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { eventId } = await context.params;
    const updateResult = await prisma.event.updateMany({
      where: { id: eventId, familyTreeId: session.activeFamilyTreeId! },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        type: parsed.data.type,
        startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : undefined,
        endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : undefined,
        location: parsed.data.location,
      },
    });

    if (updateResult.count === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const event = await prisma.event.findFirst({
      where: { id: eventId, familyTreeId: session.activeFamilyTreeId! },
    });
    return NextResponse.json({ data: event });
  } catch (err) {
    console.error("Update event error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: EventRouteContext) {
  try {
    const { error, session } = await requireTenantRoles(request, ["OWNER", "ADMIN"]);
    if (error || !session) return error;

    const { eventId } = await context.params;
    const deleted = await prisma.event.deleteMany({
      where: { id: eventId, familyTreeId: session.activeFamilyTreeId! },
    });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ data: { success: true } });
  } catch (err) {
    console.error("Delete event error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
