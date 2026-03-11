import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { requireTenantRoles } from "@/lib/auth/guard";
import { eventCreateSchema } from "@/lib/auth/schemas";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { error, session } = await requireTenantRoles(request, [
      "OWNER",
      "ADMIN",
      "EDITOR",
      "VIEWER",
    ]);
    if (error || !session) return error;

    const from = request.nextUrl.searchParams.get("from");
    const to = request.nextUrl.searchParams.get("to");
    const type = request.nextUrl.searchParams.get("type");
    const where: Prisma.EventWhereInput = {
      familyTreeId: session.activeFamilyTreeId!,
    };

    if (from || to) {
      where.startsAt = {};
      if (from) where.startsAt.gte = new Date(from);
      if (to) where.startsAt.lte = new Date(to);
    }
    if (type && ["BIRTHDAY", "ANNIVERSARY", "GATHERING", "OTHER"].includes(type)) {
      where.type = type as Prisma.EventWhereInput["type"];
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startsAt: "asc" },
      include: {
        _count: {
          select: {
            comments: true,
            reactions: true,
          },
        },
      },
    });

    return NextResponse.json({ data: events });
  } catch (err) {
    console.error("List events error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error, session } = await requireTenantRoles(request, ["OWNER", "ADMIN", "EDITOR"]);
    if (error || !session) return error;

    const body = await request.json();
    const parsed = eventCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const event = await prisma.event.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        assigneeName: parsed.data.assigneeName,
        taskStatus: parsed.data.taskStatus,
        completedAt: parsed.data.taskStatus === "DONE" ? new Date() : null,
        type: parsed.data.type,
        startsAt: new Date(parsed.data.startsAt),
        endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : undefined,
        location: parsed.data.location,
        familyTreeId: session.activeFamilyTreeId!,
        createdById: session.user.id,
      },
      include: {
        _count: {
          select: {
            comments: true,
            reactions: true,
          },
        },
      },
    });

    return NextResponse.json({ data: event }, { status: 201 });
  } catch (err) {
    console.error("Create event error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
