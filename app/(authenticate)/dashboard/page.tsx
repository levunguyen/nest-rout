"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  Crown,
  Gift,
  Heart,
  ImageIcon,
  MessageCircle,
  Newspaper,
  Pin,
  Sparkles,
  ThumbsUp,
  TreePine,
  Users,
} from "lucide-react";
import memorial from "../../../public/images/hero-memorial.jpg";

type EventType = "BIRTHDAY" | "ANNIVERSARY" | "GATHERING" | "OTHER";
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
type ReactionType = "LIKE" | "HEART";

interface DashboardEvent {
  id: string;
  title: string;
  startsAt: string;
  type: EventType;
  myReactions: string[];
  commentsCount: number;
  reactionsCount: number;
  likesCount: number;
  latestComments: {
    id: string;
    content: string;
    createdAt: string;
    authorName: string;
  }[];
}

interface DashboardMember {
  id: string;
  fullName: string;
  generation: number;
  createdAt: string;
}

interface ActionItem {
  id: string;
  title: string;
  dueAt: string;
  assignee: string;
  status: string;
  type: EventType;
  link: string;
  taskStatus: TaskStatus;
  commentsCount: number;
  reactionsCount: number;
  likesCount: number;
  myReactions: string[];
  latestComments: {
    id: string;
    content: string;
    createdAt: string;
    authorName: string;
  }[];
}

interface DashboardSummary {
  tenant?: { id: string; name: string; bannerUrl?: string | null } | null;
  stats: {
    totalMembers: number;
    upcomingEvents: number;
    totalEventsUpcoming: number;
    pendingActionItems: number;
    incompleteProfiles: number;
    myTodayTasks: number;
    reminders: number;
  };
  upcomingEvents: DashboardEvent[];
  upcomingAnniversaries: DashboardEvent[];
  upcomingBirthdays: DashboardEvent[];
  recentMembers: DashboardMember[];
  actionItems: ActionItem[];
  myTodayTasks: ActionItem[];
  reminders: {
    id: string;
    title: string;
    dueAt: string;
    level: "high" | "medium" | "low";
    message: string;
  }[];
  familyFeed: {
    id: string;
    kind: string;
    title: string;
    at: string;
    meta: string;
    eventId?: string;
    commentsCount?: number;
    reactionsCount?: number;
    likesCount?: number;
    myReactions?: string[];
    latestComments?: {
      id: string;
      content: string;
      createdAt: string;
      authorName: string;
    }[];
  }[];
  onThisDay: {
    id: string;
    title: string;
    type: EventType;
    happenedAt: string;
  }[];
  incompleteProfiles: {
    id: string;
    fullName: string;
    generation: number;
    missingFields: string[];
  }[];
  celebrationCountdown: {
    id: string;
    title: string;
    type: EventType;
    startsAt: string;
    daysLeft: number;
    assignee: string;
  }[];
  pinnedStory: {
    kind: "news" | "media";
    id: string;
    title: string;
    summary: string;
    imageUrl?: string | null;
    authorName: string;
    at: string;
    link: string;
  } | null;
  weeklyLeaders: {
    topUpdates: {
      userId: string;
      fullName: string;
      score: number;
      actions: number;
    }[];
    topSupporters: {
      userId: string;
      fullName: string;
      score: number;
      actions: number;
    }[];
    since: string;
  };
}

interface TimelineComment {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
}

const getTimelineTheme = (kind: string) => {
  if (kind === "event_task") {
    return {
      label: "Công việc gia đình",
      coverClass: "from-[#14532D] via-[#166534] to-[#16A34A]",
      badgeClass: "border-[#BBF7D0] bg-[#DCFCE7]/90 text-[#166534]",
      Icon: Sparkles,
    };
  }
  if (kind === "news_posted") {
    return {
      label: "Tin gia đình",
      coverClass: "from-[#0F172A] via-[#1E3A8A] to-[#2563EB]",
      badgeClass: "border-[#BFDBFE] bg-[#DBEAFE]/90 text-[#1E40AF]",
      Icon: Newspaper,
    };
  }
  if (kind === "media_uploaded") {
    return {
      label: "Kho lưu niệm",
      coverClass: "from-[#7C2D12] via-[#B45309] to-[#F59E0B]",
      badgeClass: "border-[#FDE68A] bg-[#FEF3C7]/90 text-[#92400E]",
      Icon: ImageIcon,
    };
  }
  return {
    label: "Cập nhật",
    coverClass: "from-[#334155] via-[#475569] to-[#64748B]",
    badgeClass: "border-[#CBD5E1] bg-[#F1F5F9]/90 text-[#334155]",
    Icon: Sparkles,
  };
};

const getMetaInitial = (meta: string, fallback: string) => {
  const source = meta.trim() || fallback.trim();
  if (!source) return "G";
  return source[0]?.toUpperCase() ?? "G";
};

const TIMELINE_COMMENT_PREVIEW_LIMIT = 2;
const getCountdownLabel = (daysLeft: number) => {
  if (daysLeft <= 0) return "Hôm nay";
  if (daysLeft === 1) return "Ngày mai";
  return `Còn ${daysLeft} ngày`;
};

const applyReactionToSummary = (
  current: DashboardSummary | null,
  eventId: string,
  type: ReactionType,
): DashboardSummary | null => {
  if (!current) return current;

  const applyToItem = (item: { myReactions: string[]; reactionsCount: number; likesCount: number }) => {
    const hasReaction = item.myReactions.includes(type);
    const nextReactions = hasReaction
      ? item.myReactions.filter((reaction) => reaction !== type)
      : [...item.myReactions, type];
    const reactionsCount = hasReaction ? Math.max(0, item.reactionsCount - 1) : item.reactionsCount + 1;
    const likesCount =
      type === "LIKE" ? (hasReaction ? Math.max(0, item.likesCount - 1) : item.likesCount + 1) : item.likesCount;

    return {
      ...item,
      myReactions: nextReactions,
      reactionsCount,
      likesCount,
    };
  };

  return {
    ...current,
    upcomingEvents: current.upcomingEvents.map((event) =>
      event.id === eventId ? applyToItem(event) : event,
    ),
    actionItems: current.actionItems.map((item) =>
      item.id === eventId ? applyToItem(item) : item,
    ),
    myTodayTasks: current.myTodayTasks.map((item) =>
      item.id === eventId ? applyToItem(item) : item,
    ),
    familyFeed: current.familyFeed.map((item) => {
      if (item.eventId !== eventId) return item;
      const updated = applyToItem({
        myReactions: item.myReactions ?? [],
        reactionsCount: item.reactionsCount ?? 0,
        likesCount: item.likesCount ?? 0,
      });
      return {
        ...item,
        myReactions: updated.myReactions,
        reactionsCount: updated.reactionsCount,
        likesCount: updated.likesCount,
      };
    }),
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRenameForm, setShowRenameForm] = useState(false);
  const [renameInput, setRenameInput] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameError, setRenameError] = useState("");
  const [renameSuccess, setRenameSuccess] = useState("");
  const [workingTaskId, setWorkingTaskId] = useState<string | null>(null);
  const [commentDraftByEvent, setCommentDraftByEvent] = useState<Record<string, string>>({});
  const [commentsModal, setCommentsModal] = useState<{ open: boolean; eventId: string | null; title: string }>({
    open: false,
    eventId: null,
    title: "",
  });
  const [modalComments, setModalComments] = useState<TimelineComment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isRemovingBanner, setIsRemovingBanner] = useState(false);
  const [bannerError, setBannerError] = useState("");
  const [bannerSuccess, setBannerSuccess] = useState("");

  const normalizeApiError = useCallback(
    (raw?: string) => {
      if (!raw) return "Không thể tải dữ liệu dashboard.";
      if (raw === "Unauthorized") {
        router.push("/login");
        return "Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.";
      }
      if (raw === "No active tenant selected") {
        return "Bạn chưa chọn cây gia phả đang hoạt động.";
      }
      if (raw.includes("Forbidden")) {
        return "Bạn không có quyền truy cập dữ liệu gia phả hiện tại.";
      }
      return raw;
    },
    [router],
  );

  const loadSummary = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/dashboard/summary");
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(normalizeApiError(payload?.error));
        setSummary(null);
        return;
      }
      setSummary(payload.data);
    } catch {
      setError("Không thể tải dữ liệu dashboard.");
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  }, [normalizeApiError]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const handleSubmitRename = async (e: React.FormEvent) => {
    e.preventDefault();
    setRenameError("");
    setRenameSuccess("");

    const familyTreeId = summary?.tenant?.id;
    const nextName = renameInput.trim();

    if (!familyTreeId) {
      setRenameError("Không tìm thấy gia phả đang hoạt động.");
      return;
    }
    if (nextName.length < 2) {
      setRenameError("Tên gia phả cần ít nhất 2 ký tự.");
      return;
    }

    setIsRenaming(true);
    try {
      const response = await fetch("/api/tenants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familyTreeId, name: nextName }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setRenameError(payload?.error ?? "Không thể đổi tên gia phả.");
        return;
      }

      setRenameSuccess("Đã cập nhật tên gia phả.");
      await loadSummary();
      setShowRenameForm(false);
    } catch {
      setRenameError("Không thể đổi tên gia phả.");
    } finally {
      setIsRenaming(false);
    }
  };

  const handleToggleReaction = async (eventId: string, type: ReactionType) => {
    setWorkingTaskId(eventId);
    setError("");
    const previousSummary = summary;
    setSummary((prev) => applyReactionToSummary(prev, eventId, type));
    try {
      const response = await fetch(`/api/events/${eventId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setSummary(previousSummary);
        setError(normalizeApiError(payload?.error || "Không thể tương tác."));
        return;
      }
    } catch {
      setSummary(previousSummary);
      setError("Không thể tương tác.");
    } finally {
      setWorkingTaskId(null);
    }
  };

  const handleSubmitComment = async (eventId: string) => {
    const content = commentDraftByEvent[eventId]?.trim();
    if (!content) return;

    setWorkingTaskId(eventId);
    setError("");
    try {
      const response = await fetch(`/api/events/${eventId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(normalizeApiError(payload?.error || "Không thể gửi bình luận."));
        return;
      }
      setCommentDraftByEvent((prev) => ({ ...prev, [eventId]: "" }));
      await loadSummary();
    } catch {
      setError("Không thể gửi bình luận.");
    } finally {
      setWorkingTaskId(null);
    }
  };

  const handleOpenCommentsModal = async (eventId: string, title: string) => {
    setCommentsModal({ open: true, eventId, title });
    setIsCommentsLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/events/${eventId}/comments`);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(normalizeApiError(payload?.error || "Không thể tải bình luận."));
        setModalComments([]);
        return;
      }
      const comments = Array.isArray(payload?.data)
        ? payload.data.map((comment: { id: string; content: string; createdAt: string; createdBy?: { fullName?: string } }) => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            authorName: comment.createdBy?.fullName?.trim() || "Thành viên",
          }))
        : [];
      setModalComments(comments);
    } catch {
      setError("Không thể tải bình luận.");
      setModalComments([]);
    } finally {
      setIsCommentsLoading(false);
    }
  };

  const handleUploadBanner = async (file: File) => {
    if (!summary?.tenant?.id) {
      setBannerError("Không tìm thấy gia phả đang hoạt động.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setBannerError("Vui lòng chọn file ảnh.");
      return;
    }

    setIsUploadingBanner(true);
    setBannerError("");
    setBannerSuccess("");

    try {
      const formData = new FormData();
      formData.set("file", file);
      const uploadResponse = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      const uploadPayload = await uploadResponse.json().catch(() => ({}));
      if (!uploadResponse.ok) {
        setBannerError(uploadPayload?.error ?? "Upload banner thất bại.");
        return;
      }

      const registerResponse = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Banner gia phả - ${new Date().toLocaleDateString("vi-VN")}`,
          kind: "image",
          category: "Dashboard",
          usedBy: "dashboard_banner",
          url: uploadPayload?.data?.url,
          sizeMb: Number(uploadPayload?.data?.sizeMb ?? 0),
          mimeType: uploadPayload?.data?.mimeType,
          originalName: uploadPayload?.data?.originalName,
        }),
      });
      const registerPayload = await registerResponse.json().catch(() => ({}));
      if (!registerResponse.ok) {
        setBannerError(registerPayload?.error ?? "Không thể lưu banner gia phả.");
        return;
      }

      await loadSummary();
      setBannerSuccess("Đã cập nhật banner gia phả.");
    } catch {
      setBannerError("Không thể cập nhật banner gia phả.");
    } finally {
      setIsUploadingBanner(false);
      if (bannerInputRef.current) {
        bannerInputRef.current.value = "";
      }
    }
  };

  const handleRemoveBanner = async () => {
    setIsRemovingBanner(true);
    setBannerError("");
    setBannerSuccess("");
    try {
      const response = await fetch("/api/dashboard/banner", {
        method: "DELETE",
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setBannerError(payload?.error ?? "Không thể xóa banner gia phả.");
        return;
      }
      await loadSummary();
      setBannerSuccess("Đã xóa banner, đang dùng ảnh mặc định.");
    } catch {
      setBannerError("Không thể xóa banner gia phả.");
    } finally {
      setIsRemovingBanner(false);
    }
  };

  const stats = useMemo(
    () => [
      {
        label: "Tên gia phả",
        value: summary?.tenant?.name?.trim() || "Chưa đặt tên",
        icon: TreePine,
        note: summary?.tenant?.name?.trim()
          ? "Gia phả đang hoạt động"
          : "Vào Admin > Cấu hình để đặt tên gia phả",
      },
      {
        label: "Tổng thành viên",
        value: summary?.stats.totalMembers ?? 0,
        icon: Users,
        note: "Trong gia phả hiện tại",
      },
      {
        label: "Hồ sơ thiếu thông tin",
        value: summary?.stats.incompleteProfiles ?? 0,
        icon: AlertTriangle,
        note: "Cần cập nhật để đầy đủ gia phả",
      },
      {
        label: "Sự kiện 30 ngày tới",
        value: summary?.stats.upcomingEvents ?? 0,
        icon: Sparkles,
        note: `${summary?.stats.totalEventsUpcoming ?? 0} sự kiện đang lên lịch`,
      },
    ],
    [summary],
  );

  return (
    <main className="min-h-screen bg-[#EEF2F7] px-0 py-6 text-[#0F172A] md:py-8">
      <section className="flex w-full flex-col gap-4 px-3 md:px-6">
        <section className="overflow-hidden rounded-3xl border border-[#D8E1EA] bg-white shadow-sm">
          <div className="relative h-44 overflow-hidden border-b border-[#E2E8F0]">
            <Image
              src={summary?.tenant?.bannerUrl?.trim() || memorial}
              alt="Banner gia phả"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/55 to-[#0F172A]/10" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-xs uppercase tracking-wide opacity-90">Gia phả social</p>
              <h1 className="text-2xl font-bold">{summary?.tenant?.name?.trim() || "Chưa đặt tên gia phả"}</h1>
            </div>
            <div className="absolute right-3 top-3">
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleUploadBanner(file);
                }}
              />
              <button
                type="button"
                disabled={isUploadingBanner || isRemovingBanner}
                onClick={() => bannerInputRef.current?.click()}
                className="rounded-full border border-white/45 bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isUploadingBanner ? "Đang upload..." : "Đổi banner"}
              </button>
              {summary?.tenant?.bannerUrl ? (
                <button
                  type="button"
                  disabled={isUploadingBanner || isRemovingBanner}
                  onClick={handleRemoveBanner}
                  className="ml-2 rounded-full border border-white/45 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-black/30 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isRemovingBanner ? "Đang xóa..." : "Xóa banner"}
                </button>
              ) : null}
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-[#475569]">
              Dòng thời gian hoạt động của gia đình: việc hôm nay, cập nhật mới và tương tác cộng đồng.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/tree" className="inline-flex items-center gap-1.5 rounded-full bg-[#16A34A] px-3 py-1.5 text-xs font-semibold text-white">
                Cây gia phả
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/event" className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A]">
                Lịch sự kiện
                <CalendarDays className="h-3.5 w-3.5 text-[#16A34A]" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setRenameError("");
                  setRenameSuccess("");
                  setRenameInput(summary?.tenant?.name?.trim() || "");
                  setShowRenameForm((prev) => !prev);
                }}
                className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A]"
              >
                Đổi tên gia phả
              </button>
            </div>

            {showRenameForm ? (
              <form onSubmit={handleSubmitRename} className="mt-3 space-y-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                <input
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  placeholder="Nhập tên gia phả"
                  disabled={isRenaming}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm disabled:bg-[#F1F5F9]"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isRenaming}
                    className="rounded-lg bg-[#16A34A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#15803D] disabled:opacity-60"
                  >
                    {isRenaming ? "Đang lưu..." : "Lưu tên"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRenameForm(false)}
                    className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm"
                  >
                    Hủy
                  </button>
                </div>
                {renameError ? <p className="text-xs text-[#B91C1C]">{renameError}</p> : null}
              </form>
            ) : null}
            {renameSuccess ? <p className="mt-2 text-xs font-medium text-[#166534]">{renameSuccess}</p> : null}
            {bannerError ? <p className="mt-2 text-xs font-medium text-[#B91C1C]">{bannerError}</p> : null}
            {bannerSuccess ? <p className="mt-2 text-xs font-medium text-[#166534]">{bannerSuccess}</p> : null}
          </div>
        </section>

        {error ? (
          <div className="rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-sm text-[#991B1B]">{error}</div>
        ) : null}

        <section className="no-scrollbar flex gap-3 overflow-x-auto">
          {stats.map((item) => (
            <article key={item.label} className="min-w-[220px] rounded-2xl border border-[#D8E1EA] bg-white p-4 shadow-sm">
              <p className="text-xs text-[#475569]">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">{item.value}</p>
              <p className="mt-2 text-xs text-[#166534]">{item.note}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-[#D8E1EA] bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#334155]">Đếm ngược sinh nhật/giỗ</h2>
            <Link href="/event" className="inline-flex items-center gap-1 text-xs font-medium text-[#166534]">
              Xem lịch đầy đủ
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {isLoading ? (
            <p className="mt-3 text-sm text-[#64748B]">Đang tải dữ liệu...</p>
          ) : summary?.celebrationCountdown.length ? (
            <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              {summary.celebrationCountdown.map((item) => (
                <article key={item.id} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        item.type === "BIRTHDAY" ? "bg-[#DBEAFE] text-[#1D4ED8]" : "bg-[#FEF3C7] text-[#92400E]"
                      }`}
                    >
                      {item.type === "BIRTHDAY" ? "Sinh nhật" : "Giỗ"}
                    </span>
                    <span className="text-[11px] font-medium text-[#166534]">{getCountdownLabel(item.daysLeft)}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#0F172A]">{item.title}</p>
                  <p className="mt-1 text-xs text-[#64748B]">{new Date(item.startsAt).toLocaleDateString("vi-VN")}</p>
                  <p className="mt-1 text-xs text-[#334155]">Phụ trách: {item.assignee}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#64748B]">Chưa có sinh nhật/giỗ sắp tới.</p>
          )}
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <section className="rounded-2xl border border-[#D8E1EA] bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-[#334155]">
                <Pin className="h-4 w-4 text-[#166534]" />
                Bài ghim trong ngày
              </h2>
              {summary?.pinnedStory ? (
                <Link href={summary.pinnedStory.link} className="inline-flex items-center gap-1 text-xs font-medium text-[#166534]">
                  Mở ngay
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ) : null}
            </div>
            {isLoading ? (
              <p className="mt-3 text-sm text-[#64748B]">Đang tải dữ liệu...</p>
            ) : summary?.pinnedStory ? (
              <article className="mt-3 overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="relative h-36 w-full overflow-hidden bg-[#E2E8F0]">
                  {summary.pinnedStory.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={summary.pinnedStory.imageUrl} alt={summary.pinnedStory.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-[#64748B]">
                      Không có ảnh minh họa
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#166534]">
                    <Gift className="h-3.5 w-3.5" />
                    {summary.pinnedStory.kind === "news" ? "Câu chuyện gia đình" : "Kỷ niệm ảnh"}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#0F172A]">{summary.pinnedStory.title}</p>
                  <p className="mt-1 text-xs text-[#475569]">{summary.pinnedStory.summary}</p>
                  <p className="mt-2 text-[11px] text-[#64748B]">
                    {summary.pinnedStory.authorName} • {new Date(summary.pinnedStory.at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </article>
            ) : (
              <p className="mt-3 text-sm text-[#64748B]">Chưa có bài ghim hôm nay. Hãy ghim một kỷ niệm để mọi người cùng xem.</p>
            )}
          </section>

          <section className="rounded-2xl border border-[#D8E1EA] bg-white p-4 shadow-sm">
            <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-[#334155]">
              <Crown className="h-4 w-4 text-[#B45309]" />
              Vinh danh tuần này
            </h2>
            {isLoading ? (
              <p className="mt-3 text-sm text-[#64748B]">Đang tải dữ liệu...</p>
            ) : (
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <p className="text-xs font-semibold text-[#334155]">Top cập nhật</p>
                  <div className="mt-2 space-y-2">
                    {summary?.weeklyLeaders.topUpdates.length ? (
                      summary.weeklyLeaders.topUpdates.map((item, idx) => (
                        <div key={item.userId} className="flex items-center justify-between gap-2 text-xs">
                          <p className="font-medium text-[#0F172A]">{idx + 1}. {item.fullName}</p>
                          <p className="text-[#166534]">{item.actions} cập nhật</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#64748B]">Tuần này chưa có cập nhật.</p>
                    )}
                  </div>
                </div>
                <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <p className="text-xs font-semibold text-[#334155]">Top hỗ trợ</p>
                  <div className="mt-2 space-y-2">
                    {summary?.weeklyLeaders.topSupporters.length ? (
                      summary.weeklyLeaders.topSupporters.map((item, idx) => (
                        <div key={item.userId} className="flex items-center justify-between gap-2 text-xs">
                          <p className="font-medium text-[#0F172A]">{idx + 1}. {item.fullName}</p>
                          <p className="text-[#1D4ED8]">{item.actions} tương tác</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#64748B]">Tuần này chưa có hỗ trợ.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {!isLoading && summary?.weeklyLeaders?.since ? (
              <p className="mt-3 text-[11px] text-[#64748B]">
                Tính từ {new Date(summary.weeklyLeaders.since).toLocaleDateString("vi-VN")}
              </p>
            ) : null}
          </section>
        </section>


        <section className="rounded-2xl border border-[#D8E1EA] bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#334155]">Family timeline</h2>
            <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-[11px] font-medium text-[#475569]">
              Bảng tin gia đình kiểu social
            </span>
          </div>
          {isLoading ? (
            <p className="mt-3 text-sm text-[#64748B]">Đang tải dữ liệu...</p>
          ) : summary?.familyFeed.length ? (
            <div className="mt-3 columns-1 gap-3 sm:columns-2 xl:columns-3 2xl:columns-4">
              {summary.familyFeed.map((item) => {
                const theme = getTimelineTheme(item.kind);
                const TimelineIcon = theme.Icon;
                return (
                  <article
                    key={item.id}
                    className="mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className={`relative h-24 bg-gradient-to-br ${theme.coverClass}`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute left-3 top-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold ${theme.badgeClass}`}
                        >
                          <TimelineIcon className="h-3 w-3" />
                          {theme.label}
                        </span>
                      </div>
                      <p className="absolute bottom-2 right-3 text-[11px] font-medium text-white/95">
                        {new Date(item.at).toLocaleDateString("vi-VN")} •{" "}
                        {new Date(item.at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    <div className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DCFCE7] text-xs font-bold text-[#166534]">
                          {getMetaInitial(item.meta, item.title)}
                        </div>
                        <p className="text-xs font-medium text-[#475569]">{item.meta}</p>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-[#0F172A]">{item.title}</p>

                      {item.eventId ? (
                        <>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              disabled={workingTaskId === item.eventId}
                              onClick={() => handleToggleReaction(item.eventId!, "LIKE")}
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${
                                item.myReactions?.includes("LIKE")
                                  ? "border-[#DBEAFE] bg-[#EFF6FF] text-[#1D4ED8]"
                                  : "border-[#E2E8F0] bg-white text-[#334155]"
                              }`}
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                              {item.myReactions?.includes("LIKE") ? "Đã thích" : "Thích"}
                            </button>
                            <button
                              type="button"
                              disabled={workingTaskId === item.eventId}
                              onClick={() => handleToggleReaction(item.eventId!, "HEART")}
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${
                                item.myReactions?.includes("HEART")
                                  ? "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]"
                                  : "border-[#E2E8F0] bg-white text-[#334155]"
                              }`}
                            >
                              <Heart className="h-3.5 w-3.5" />
                              Quan tâm
                            </button>
                            <span className="inline-flex items-center gap-1 text-xs text-[#64748B]">
                              <MessageCircle className="h-3.5 w-3.5" />
                              {item.commentsCount ?? 0} bình luận
                            </span>
                            <span className="text-xs text-[#64748B]">{item.likesCount ?? 0} lượt thích</span>
                            <span className="text-xs text-[#64748B]">{item.reactionsCount ?? 0} tương tác</span>
                          </div>

                          <div className="mt-2 flex gap-2">
                            <input
                              value={commentDraftByEvent[item.eventId] ?? ""}
                              onChange={(e) =>
                                setCommentDraftByEvent((prev) => ({
                                  ...prev,
                                  [item.eventId!]: e.target.value,
                                }))
                              }
                              placeholder="Viết bình luận..."
                              className="w-full rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs"
                            />
                            <button
                              type="button"
                              disabled={workingTaskId === item.eventId}
                              onClick={() => handleSubmitComment(item.eventId!)}
                              className="rounded-full bg-[#16A34A] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                            >
                              Gửi
                            </button>
                          </div>

                          {item.latestComments?.length ? (
                            <div className="mt-2 space-y-1.5">
                              {item.latestComments.slice(0, TIMELINE_COMMENT_PREVIEW_LIMIT).map((comment) => (
                                <div key={comment.id} className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-1.5">
                                  <p className="text-[11px] font-semibold text-[#334155]">{comment.authorName}</p>
                                  <p className="mt-0.5 text-xs text-[#0F172A]">{comment.content}</p>
                                </div>
                              ))}
                              {(item.commentsCount ?? 0) > TIMELINE_COMMENT_PREVIEW_LIMIT ? (
                                <button
                                  type="button"
                                  onClick={() => handleOpenCommentsModal(item.eventId!, item.title)}
                                  className="inline-flex items-center gap-1 rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#334155]"
                                >
                                  Xem thêm {(item.commentsCount ?? 0) - TIMELINE_COMMENT_PREVIEW_LIMIT} bình luận
                                  <ArrowUpRight className="h-3 w-3" />
                                </button>
                              ) : null}
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <div className="mt-3 flex items-center gap-2">
                          <Link
                            href={
                              item.kind === "news_posted"
                                ? "/news"
                                : item.kind === "media_uploaded"
                                  ? "/gallery"
                                  : "/event"
                            }
                            className="inline-flex items-center gap-1 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-xs font-medium text-[#334155]"
                          >
                            Xem chi tiết
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                          <span className="text-xs text-[#64748B]">Cập nhật mới trong gia phả</span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#64748B]">Hôm nay chưa có cập nhật mới.</p>
          )}
        </section>

        <section className="rounded-2xl border border-[#D8E1EA] bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#334155]">Thông tin nhanh</h2>
          {isLoading ? (
            <p className="mt-3 text-sm text-[#64748B]">Đang tải dữ liệu...</p>
          ) : (
            <div className="mt-3 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#0F172A]">Hồ sơ còn thiếu</h3>
                <div className="mt-2 space-y-2">
                  {summary?.incompleteProfiles.slice(0, 5).map((member) => (
                    <article key={member.id} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2.5">
                      <p className="text-sm font-medium text-[#0F172A]">{member.fullName}</p>
                      <p className="mt-1 text-xs text-[#B45309]">{member.missingFields.join(", ")}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </section>

      <Dialog
        open={commentsModal.open}
        onOpenChange={(open) => {
          setCommentsModal((prev) => ({ ...prev, open }));
          if (!open) {
            setModalComments([]);
            setIsCommentsLoading(false);
          }
        }}
      >
        <DialogContent className="max-h-[82vh] overflow-hidden border-[#E2E8F0] bg-white p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-[#E2E8F0] px-4 py-3">
            <DialogTitle className="text-base font-semibold text-[#0F172A]">
              Bình luận sự kiện: {commentsModal.title}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[64vh] overflow-y-auto px-4 py-3">
            {isCommentsLoading ? (
              <p className="text-sm text-[#64748B]">Đang tải bình luận...</p>
            ) : modalComments.length ? (
              <div className="space-y-2">
                {modalComments.map((comment) => (
                  <article key={comment.id} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[#334155]">{comment.authorName}</p>
                      <p className="text-[11px] text-[#64748B]">
                        {new Date(comment.createdAt).toLocaleDateString("vi-VN")} •{" "}
                        {new Date(comment.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-[#0F172A]">{comment.content}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#64748B]">Chưa có bình luận nào.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
