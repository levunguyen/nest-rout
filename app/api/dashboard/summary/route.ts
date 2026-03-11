import { NextResponse, type NextRequest } from "next/server";
import { MediaKind } from "@prisma/client";
import { requireActiveTenant } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const TOP_LEADER_LIMIT = 5;

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

const normalize = (value?: string | null) => value?.trim().toLowerCase() ?? "";

export async function GET(request: NextRequest) {
  try {
    const { error, session } = await requireActiveTenant(request);
    if (error || !session) return error;

    const familyTreeId = session.activeFamilyTreeId!;
    const today = startOfToday();
    const todayEnd = endOfToday();
    const weekStart = new Date(today.getTime() - 6 * ONE_DAY_MS);

    const [memberCount, events, recentMembers, tenantInfo, tenantBanner, memberProfiles, recentNews, recentMedia, historyEvents] = await Promise.all([
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
        include: {
          createdBy: {
            select: { fullName: true },
          },
          reactions: {
            select: { type: true },
          },
          comments: {
            orderBy: { createdAt: "desc" },
            take: 3,
            include: {
              createdBy: {
                select: { fullName: true },
              },
            },
          },
          _count: {
            select: {
              comments: true,
              reactions: true,
            },
          },
        },
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
      prisma.mediaAsset.findFirst({
        where: {
          familyTreeId,
          kind: MediaKind.IMAGE,
          usedBy: "dashboard_banner",
        },
        orderBy: { createdAt: "desc" },
        select: { url: true },
      }),
      prisma.familyMember.findMany({
        where: { familyTreeId },
        orderBy: [{ generation: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          fullName: true,
          generation: true,
          relation: true,
          birthYear: true,
          imageUrl: true,
          parentId: true,
        },
      }),
      prisma.newsPost.findMany({
        where: { familyTreeId },
        orderBy: { publishedAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          publishedAt: true,
          createdBy: { select: { fullName: true } },
        },
      }),
      prisma.mediaAsset.findMany({
        where: { familyTreeId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          kind: true,
          createdAt: true,
        },
      }),
      prisma.event.findMany({
        where: {
          familyTreeId,
          startsAt: {
            lt: today,
          },
        },
        orderBy: { startsAt: "desc" },
        take: 200,
        select: {
          id: true,
          title: true,
          startsAt: true,
          type: true,
        },
      }),
    ]);

    const upcomingEventsRaw = events.slice(0, 3);
    const upcomingAnniversaries = events
      .filter((event) => event.type === "ANNIVERSARY")
      .slice(0, 6);
    const upcomingBirthdays = events
      .filter((event) => event.type === "BIRTHDAY")
      .slice(0, 6);
    const eventCount30Days = events.filter((e) => {
      const diff = e.startsAt.getTime() - today.getTime();
      return diff <= THIRTY_DAYS_MS;
    }).length;

    const actionItems = events
      .filter((event) => {
        const diff = event.startsAt.getTime() - today.getTime();
        return diff <= THIRTY_DAYS_MS;
      })
      .slice(0, 6)
      .map((event) => {
        const diffDays = Math.ceil((event.startsAt.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
        const status =
          diffDays <= 3
            ? "Gấp"
            : diffDays <= 7
              ? "Tuần này"
              : "Sắp tới";
        return {
          id: event.id,
          title: event.title,
          dueAt: event.startsAt,
          assignee: event.assigneeName?.trim() || event.createdBy?.fullName || "Chưa phân công",
          taskStatus: event.taskStatus,
          status,
          type: event.type,
          commentsCount: event._count.comments,
          reactionsCount: event._count.reactions,
          likesCount: event.reactions.filter((reaction) => reaction.type === "LIKE").length,
          latestComments: event.comments.map((comment) => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            authorName: comment.createdBy?.fullName ?? "Thành viên",
          })),
          link: "/event",
        };
      });

    const reactionSourceIds = Array.from(new Set([...actionItems.map((item) => item.id), ...upcomingEventsRaw.map((event) => event.id)]));
    const myReactions = reactionSourceIds.length
      ? await prisma.eventReaction.findMany({
          where: {
            familyTreeId,
            createdById: session.user.id,
            eventId: { in: reactionSourceIds },
          },
          select: {
            eventId: true,
            type: true,
          },
        })
      : [];
    const reactionByEventId = new Map<string, Set<string>>();
    for (const reaction of myReactions) {
      const bucket = reactionByEventId.get(reaction.eventId) ?? new Set<string>();
      bucket.add(reaction.type);
      reactionByEventId.set(reaction.eventId, bucket);
    }
    const actionItemsWithMine = actionItems.map((item) => ({
      ...item,
      myReactions: Array.from(reactionByEventId.get(item.id) ?? []),
    }));

    const upcomingEvents = upcomingEventsRaw.map((event) => ({
      id: event.id,
      title: event.title,
      startsAt: event.startsAt,
      type: event.type,
      myReactions: Array.from(reactionByEventId.get(event.id) ?? []),
      commentsCount: event._count.comments,
      reactionsCount: event._count.reactions,
      likesCount: event.reactions.filter((reaction) => reaction.type === "LIKE").length,
      latestComments: event.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        authorName: comment.createdBy?.fullName ?? "Thành viên",
      })),
    }));

    const myTodayTasks = actionItemsWithMine
      .filter((item) => {
        if (item.taskStatus === "DONE") return false;
        const due = new Date(item.dueAt).getTime();
        const isTodayOrOverdue = due <= todayEnd.getTime();
        const assignedToMe =
          normalize(item.assignee) === normalize(session.user.fullName) ||
          normalize(item.assignee) === normalize(session.user.email);
        return isTodayOrOverdue && assignedToMe;
      })
      .slice(0, 6);

    const reminders = actionItemsWithMine
      .filter((item) => item.taskStatus !== "DONE")
      .map((item) => {
        const diffDays = Math.ceil((new Date(item.dueAt).getTime() - today.getTime()) / ONE_DAY_MS);
        let level: "high" | "medium" | "low" = "low";
        let message = "Sự kiện sắp đến hạn trong tháng này.";
        if (diffDays <= 1) {
          level = "high";
          message = "Sự kiện diễn ra trong 24h tới.";
        } else if (diffDays <= 3) {
          level = "high";
          message = "Sự kiện trong 3 ngày tới. Cần chốt đầu việc ngay.";
        } else if (diffDays <= 7) {
          level = "medium";
          message = "Sự kiện trong tuần này. Nên rà soát danh sách chuẩn bị.";
        }
        return {
          id: item.id,
          title: item.title,
          dueAt: item.dueAt,
          level,
          message,
        };
      })
      .slice(0, 8);

    const incompleteProfiles = memberProfiles
      .map((member) => {
        const missingFields: string[] = [];
        if (!member.birthYear) missingFields.push("Năm sinh");
        if (!member.relation?.trim()) missingFields.push("Quan hệ");
        if (!member.imageUrl?.trim()) missingFields.push("Ảnh chân dung");
        if (member.generation > 1 && !member.parentId) missingFields.push("Liên kết cha/mẹ");

        return {
          id: member.id,
          fullName: member.fullName,
          generation: member.generation,
          missingFields,
        };
      })
      .filter((member) => member.missingFields.length > 0)
      .slice(0, 8);

    const familyFeed = [
      ...actionItemsWithMine.map((item) => ({
        id: `event:${item.id}`,
        kind: "event_task",
        title: item.title,
        at: item.dueAt,
        meta: `Phụ trách: ${item.assignee}`,
        eventId: item.id,
        commentsCount: item.commentsCount,
        reactionsCount: item.reactionsCount,
        likesCount: item.likesCount,
        myReactions: item.myReactions,
        latestComments: item.latestComments,
      })),
      ...recentNews.map((post) => ({
        id: `news:${post.id}`,
        kind: "news_posted",
        title: `Bài viết mới: ${post.title}`,
        at: post.publishedAt,
        meta: post.createdBy?.fullName || "Chưa rõ tác giả",
      })),
      ...recentMedia.map((media) => ({
        id: `media:${media.id}`,
        kind: "media_uploaded",
        title: `${media.name} vừa được tải lên`,
        at: media.createdAt,
        meta: media.kind === "IMAGE" ? "Hình ảnh" : "Video",
      })),
    ]
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 14);

    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    const onThisDay = historyEvents
      .filter((event) => {
        const d = event.startsAt;
        return d.getMonth() === currentMonth && d.getDate() === currentDay;
      })
      .slice(0, 8)
      .map((event) => ({
        id: event.id,
        title: event.title,
        type: event.type,
        happenedAt: event.startsAt,
      }));

    const celebrationCountdown = events
      .filter((event) => event.type === "BIRTHDAY" || event.type === "ANNIVERSARY")
      .slice(0, 8)
      .map((event) => ({
        id: event.id,
        title: event.title,
        type: event.type,
        startsAt: event.startsAt,
        daysLeft: Math.max(0, Math.ceil((event.startsAt.getTime() - today.getTime()) / ONE_DAY_MS)),
        assignee: event.assigneeName?.trim() || event.createdBy?.fullName || "Chưa phân công",
      }));

    const [
      featuredNewsToday,
      featuredNewsFallback,
      latestImageMedia,
      weeklyMemberCreates,
      weeklyNewsCreates,
      weeklyMediaCreates,
      weeklyEventCreates,
      weeklyEventComments,
      weeklyNewsComments,
      weeklyReactions,
    ] = await Promise.all([
      prisma.newsPost.findFirst({
        where: {
          familyTreeId,
          featured: true,
          publishedAt: { gte: today, lte: todayEnd },
        },
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          excerpt: true,
          imageUrl: true,
          publishedAt: true,
          createdBy: { select: { fullName: true } },
        },
      }),
      prisma.newsPost.findFirst({
        where: {
          familyTreeId,
          featured: true,
        },
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          excerpt: true,
          imageUrl: true,
          publishedAt: true,
          createdBy: { select: { fullName: true } },
        },
      }),
      prisma.mediaAsset.findFirst({
        where: {
          familyTreeId,
          kind: MediaKind.IMAGE,
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          url: true,
          createdAt: true,
          createdBy: { select: { fullName: true } },
        },
      }),
      prisma.familyMember.groupBy({
        by: ["createdById"],
        where: {
          familyTreeId,
          createdAt: { gte: weekStart },
          createdById: { not: null },
        },
        _count: { _all: true },
      }),
      prisma.newsPost.groupBy({
        by: ["createdById"],
        where: {
          familyTreeId,
          createdAt: { gte: weekStart },
          createdById: { not: null },
        },
        _count: { _all: true },
      }),
      prisma.mediaAsset.groupBy({
        by: ["createdById"],
        where: {
          familyTreeId,
          createdAt: { gte: weekStart },
          createdById: { not: null },
        },
        _count: { _all: true },
      }),
      prisma.event.groupBy({
        by: ["createdById"],
        where: {
          familyTreeId,
          createdAt: { gte: weekStart },
          createdById: { not: null },
        },
        _count: { _all: true },
      }),
      prisma.eventComment.groupBy({
        by: ["createdById"],
        where: {
          familyTreeId,
          createdAt: { gte: weekStart },
          createdById: { not: null },
        },
        _count: { _all: true },
      }),
      prisma.newsComment.groupBy({
        by: ["createdById"],
        where: {
          familyTreeId,
          createdAt: { gte: weekStart },
          createdById: { not: null },
        },
        _count: { _all: true },
      }),
      prisma.eventReaction.groupBy({
        by: ["createdById"],
        where: {
          familyTreeId,
          createdAt: { gte: weekStart },
        },
        _count: { _all: true },
      }),
    ]);

    const pinnedSource = featuredNewsToday ?? featuredNewsFallback;
    const pinnedStory = pinnedSource
      ? {
          kind: "news",
          id: pinnedSource.id,
          title: pinnedSource.title,
          summary: pinnedSource.excerpt?.trim() || "Bài viết nổi bật được gia đình ghim trong ngày.",
          imageUrl: pinnedSource.imageUrl,
          authorName: pinnedSource.createdBy?.fullName || "Ban quản trị gia phả",
          at: pinnedSource.publishedAt,
          link: "/news",
        }
      : latestImageMedia
        ? {
            kind: "media",
            id: latestImageMedia.id,
            title: latestImageMedia.name,
            summary: "Kỷ niệm ảnh mới nhất của gia đình được ghim hôm nay.",
            imageUrl: latestImageMedia.url,
            authorName: latestImageMedia.createdBy?.fullName || "Thành viên gia đình",
            at: latestImageMedia.createdAt,
            link: "/gallery",
          }
        : null;

    const userIds = Array.from(
      new Set(
        [
          ...weeklyMemberCreates.map((row) => row.createdById),
          ...weeklyNewsCreates.map((row) => row.createdById),
          ...weeklyMediaCreates.map((row) => row.createdById),
          ...weeklyEventCreates.map((row) => row.createdById),
          ...weeklyEventComments.map((row) => row.createdById),
          ...weeklyNewsComments.map((row) => row.createdById),
          ...weeklyReactions.map((row) => row.createdById),
        ].filter((value): value is string => Boolean(value)),
      ),
    );

    const userRows = userIds.length
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, fullName: true },
        })
      : [];
    const userNameById = new Map(userRows.map((user) => [user.id, user.fullName]));

    const updateScoreByUser = new Map<string, number>();
    const supportScoreByUser = new Map<string, number>();
    const updateActionByUser = new Map<string, number>();
    const supportActionByUser = new Map<string, number>();

    const addScores = (
      rows: { createdById: string | null; _count: { _all: number } }[],
      scoreMap: Map<string, number>,
      actionMap: Map<string, number>,
      weight = 1,
    ) => {
      for (const row of rows) {
        if (!row.createdById) continue;
        const nextActions = (actionMap.get(row.createdById) ?? 0) + row._count._all;
        actionMap.set(row.createdById, nextActions);
        const nextScore = (scoreMap.get(row.createdById) ?? 0) + row._count._all * weight;
        scoreMap.set(row.createdById, nextScore);
      }
    };

    addScores(weeklyMemberCreates, updateScoreByUser, updateActionByUser, 3);
    addScores(weeklyNewsCreates, updateScoreByUser, updateActionByUser, 3);
    addScores(weeklyMediaCreates, updateScoreByUser, updateActionByUser, 2);
    addScores(weeklyEventCreates, updateScoreByUser, updateActionByUser, 2);

    addScores(weeklyEventComments, supportScoreByUser, supportActionByUser, 2);
    addScores(weeklyNewsComments, supportScoreByUser, supportActionByUser, 2);
    addScores(weeklyReactions, supportScoreByUser, supportActionByUser, 1);

    const rankUsers = (
      scoreMap: Map<string, number>,
      actionMap: Map<string, number>,
    ) =>
      Array.from(scoreMap.entries())
        .map(([userId, score]) => ({
          userId,
          fullName: userNameById.get(userId) || "Thành viên",
          score,
          actions: actionMap.get(userId) ?? 0,
        }))
        .sort((a, b) => b.score - a.score || b.actions - a.actions)
        .slice(0, TOP_LEADER_LIMIT);

    const weeklyLeaders = {
      topUpdates: rankUsers(updateScoreByUser, updateActionByUser),
      topSupporters: rankUsers(supportScoreByUser, supportActionByUser),
      since: weekStart,
    };

    return NextResponse.json({
      data: {
        tenant: tenantInfo
          ? {
              ...tenantInfo,
              bannerUrl: tenantBanner?.url ?? null,
            }
          : null,
        stats: {
          totalMembers: memberCount,
          upcomingEvents: eventCount30Days,
          totalEventsUpcoming: events.length,
          pendingActionItems: actionItemsWithMine.filter((item) => item.taskStatus !== "DONE").length,
          incompleteProfiles: incompleteProfiles.length,
          myTodayTasks: myTodayTasks.length,
          reminders: reminders.length,
        },
        upcomingEvents,
        upcomingAnniversaries,
        upcomingBirthdays,
        recentMembers,
        actionItems: actionItemsWithMine,
        myTodayTasks,
        reminders,
        incompleteProfiles,
        familyFeed,
        onThisDay,
        celebrationCountdown,
        pinnedStory,
        weeklyLeaders,
      },
    });
  } catch (err) {
    console.error("Dashboard summary error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
