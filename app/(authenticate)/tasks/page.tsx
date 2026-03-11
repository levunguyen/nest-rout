"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, ThumbsUp } from "lucide-react";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
type ReactionType = "LIKE" | "HEART";

type ActionItem = {
  id: string;
  title: string;
  dueAt: string;
  assignee: string;
  taskStatus: TaskStatus;
  commentsCount: number;
  reactionsCount: number;
  myReactions: string[];
  latestComments: {
    id: string;
    content: string;
    createdAt: string;
    authorName: string;
  }[];
};

type TaskSummary = {
  myTodayTasks: ActionItem[];
  reminders: {
    id: string;
    title: string;
    dueAt: string;
    level: "high" | "medium" | "low";
    message: string;
  }[];
  actionItems: ActionItem[];
};

const taskStyle: Record<TaskStatus, string> = {
  TODO: "bg-[#E2E8F0] text-[#334155]",
  IN_PROGRESS: "bg-[#DBEAFE] text-[#1D4ED8]",
  DONE: "bg-[#DCFCE7] text-[#166534]",
};

const taskLabel: Record<TaskStatus, string> = {
  TODO: "Chưa làm",
  IN_PROGRESS: "Đang làm",
  DONE: "Đã xong",
};

const levelStyle: Record<"high" | "medium" | "low", string> = {
  high: "bg-[#FEE2E2] text-[#991B1B]",
  medium: "bg-[#FEF3C7] text-[#92400E]",
  low: "bg-[#E2E8F0] text-[#334155]",
};

export default function TasksPage() {
  const router = useRouter();
  const [data, setData] = useState<TaskSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workingTaskId, setWorkingTaskId] = useState<string | null>(null);
  const [commentDraftByEvent, setCommentDraftByEvent] = useState<Record<string, string>>({});

  const normalizeApiError = useCallback(
    (raw?: string) => {
      if (!raw) return "Không thể tải dữ liệu công việc.";
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

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/dashboard/summary", { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(normalizeApiError(payload?.error));
        setData(null);
        return;
      }
      setData({
        myTodayTasks: payload?.data?.myTodayTasks ?? [],
        reminders: payload?.data?.reminders ?? [],
        actionItems: payload?.data?.actionItems ?? [],
      });
    } catch {
      setError("Không thể tải dữ liệu công việc.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [normalizeApiError]);

  useEffect(() => {
    load();
  }, [load]);

  const handleTaskStatus = async (eventId: string, taskStatus: TaskStatus) => {
    setWorkingTaskId(eventId);
    setError("");
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskStatus }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(normalizeApiError(payload?.error || "Không thể cập nhật trạng thái việc."));
        return;
      }
      await load();
    } catch {
      setError("Không thể cập nhật trạng thái việc.");
    } finally {
      setWorkingTaskId(null);
    }
  };

  const handleToggleReaction = async (eventId: string, type: ReactionType) => {
    setWorkingTaskId(eventId);
    setError("");
    try {
      const response = await fetch(`/api/events/${eventId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(normalizeApiError(payload?.error || "Không thể tương tác."));
        return;
      }
      await load();
    } catch {
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
      await load();
    } catch {
      setError("Không thể gửi bình luận.");
    } finally {
      setWorkingTaskId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#EEF2F7] px-4 py-6 text-[#0F172A] md:px-8 md:py-8">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <section className="rounded-2xl border border-[#D8E1EA] bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-bold text-[#0F172A]">Công việc</h1>
          <p className="mt-1 text-sm text-[#475569]">Nơi tập trung việc của bạn, nhắc việc và công việc chưa hoàn thành của gia phả.</p>
          <div className="mt-3">
            <Link href="/dashboard" className="text-sm font-semibold text-[#16A34A] hover:text-[#15803D]">Quay lại dashboard</Link>
          </div>
        </section>

        {error ? <div className="rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-sm text-[#991B1B]">{error}</div> : null}

        <section className="rounded-2xl border border-[#D8E1EA] bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#334155]">Việc của tôi hôm nay</h2>
          <div className="mt-3 space-y-3">
            {loading ? (
              <p className="text-sm text-[#64748B]">Đang tải dữ liệu...</p>
            ) : data?.myTodayTasks.length ? (
              data.myTodayTasks.map((item) => (
                <article key={item.id} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-[#0F172A]">{item.title}</p>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${taskStyle[item.taskStatus]}`}>{taskLabel[item.taskStatus]}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#64748B]">Hạn: {new Date(item.dueAt).toLocaleDateString("vi-VN")} • {item.assignee}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.taskStatus !== "IN_PROGRESS" && item.taskStatus !== "DONE" ? (
                      <button
                        type="button"
                        disabled={workingTaskId === item.id}
                        onClick={() => handleTaskStatus(item.id, "IN_PROGRESS")}
                        className="rounded-full border border-[#DBEAFE] bg-white px-3 py-1 text-xs font-medium text-[#1D4ED8] disabled:opacity-60"
                      >
                        Bắt đầu làm
                      </button>
                    ) : null}
                    {item.taskStatus !== "DONE" ? (
                      <button
                        type="button"
                        disabled={workingTaskId === item.id}
                        onClick={() => handleTaskStatus(item.id, "DONE")}
                        className="rounded-full bg-[#16A34A] px-3 py-1 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        Hoàn thành
                      </button>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <p className="text-sm text-[#64748B]">Hôm nay bạn chưa có việc được giao.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8E1EA] bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#334155]">Nhắc việc</h2>
          {loading ? (
            <p className="mt-3 text-sm text-[#64748B]">Đang tải dữ liệu...</p>
          ) : data?.reminders.length ? (
            <div className="mt-3 space-y-3">
              {data.reminders.map((item) => (
                <article key={item.id} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-[#0F172A]">{item.title}</p>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${levelStyle[item.level]}`}>
                      {item.level === "high" ? "Gấp" : item.level === "medium" ? "Tuần này" : "Sắp tới"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#64748B]">{item.message}</p>
                  <p className="mt-1 text-xs text-[#334155]">Hạn: {new Date(item.dueAt).toLocaleDateString("vi-VN")}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#64748B]">Chưa có nhắc việc mới.</p>
          )}
        </section>

        <section className="rounded-2xl border border-[#D8E1EA] bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#334155]">Việc chưa xong</h2>
            <Link href="/event" className="text-xs font-semibold text-[#16A34A] hover:text-[#15803D]">Đi tới lịch sự kiện</Link>
          </div>
          {loading ? (
            <p className="text-sm text-[#64748B]">Đang tải dữ liệu...</p>
          ) : data?.actionItems.length ? (
            <div className="space-y-3">
              {data.actionItems.map((item) => (
                <article key={item.id} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-[#0F172A]">{item.title}</p>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${taskStyle[item.taskStatus]}`}>{taskLabel[item.taskStatus]}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#64748B]">{item.assignee} • {new Date(item.dueAt).toLocaleDateString("vi-VN")}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={workingTaskId === item.id}
                      onClick={() => handleToggleReaction(item.id, "LIKE")}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${
                        item.myReactions.includes("LIKE")
                          ? "border-[#DBEAFE] bg-[#EFF6FF] text-[#1D4ED8]"
                          : "border-[#E2E8F0] bg-white text-[#334155]"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {item.myReactions.includes("LIKE") ? "Đã thích" : "Thích"}
                    </button>
                    <button
                      type="button"
                      disabled={workingTaskId === item.id}
                      onClick={() => handleToggleReaction(item.id, "HEART")}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${
                        item.myReactions.includes("HEART")
                          ? "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]"
                          : "border-[#E2E8F0] bg-white text-[#334155]"
                      }`}
                    >
                      <Heart className="h-3.5 w-3.5" />
                      Quan tâm
                    </button>
                    <span className="inline-flex items-center gap-1 text-xs text-[#64748B]">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {item.commentsCount} bình luận
                    </span>
                  </div>

                  <div className="mt-2 flex gap-2">
                    <input
                      value={commentDraftByEvent[item.id] ?? ""}
                      onChange={(e) =>
                        setCommentDraftByEvent((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                      placeholder="Viết bình luận..."
                      className="w-full rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs"
                    />
                    <button
                      type="button"
                      disabled={workingTaskId === item.id}
                      onClick={() => handleSubmitComment(item.id)}
                      className="rounded-full bg-[#16A34A] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      Gửi
                    </button>
                  </div>

                  {item.latestComments.length ? (
                    <div className="mt-3 space-y-2">
                      {item.latestComments.map((comment) => (
                        <div key={comment.id} className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2">
                          <p className="text-xs font-medium text-[#334155]">{comment.authorName}</p>
                          <p className="mt-1 text-xs text-[#0F172A]">{comment.content}</p>
                          <p className="mt-1 text-[11px] text-[#64748B]">{new Date(comment.createdAt).toLocaleString("vi-VN")}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#64748B]">Chưa có việc cần làm trong 30 ngày tới.</p>
          )}
        </section>
      </section>
    </main>
  );
}
