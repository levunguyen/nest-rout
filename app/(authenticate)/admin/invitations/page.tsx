"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Copy, Link2, RefreshCw, Send } from "lucide-react";

type InvitationRole = "ADMIN" | "EDITOR" | "VIEWER";
type InvitationStatus = "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";

interface InvitationItem {
  id: string;
  email: string;
  role: InvitationRole;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  invitationUrl: string;
}

const roleLabels: Record<InvitationRole, string> = {
  ADMIN: "Quản trị tenant",
  EDITOR: "Biên tập",
  VIEWER: "Chỉ xem",
};

const statusLabels: Record<InvitationStatus, string> = {
  PENDING: "Đang chờ",
  ACCEPTED: "Đã chấp nhận",
  REVOKED: "Đã thu hồi",
  EXPIRED: "Hết hạn",
};

const statusClassName: Record<InvitationStatus, string> = {
  PENDING: "bg-[#EFF6FF] text-[#1D4ED8]",
  ACCEPTED: "bg-[#DCFCE7] text-[#166534]",
  REVOKED: "bg-[#FEE2E2] text-[#991B1B]",
  EXPIRED: "bg-[#E2E8F0] text-[#475569]",
};

export default function InvitationsPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InvitationRole>("VIEWER");
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [latestInvitationUrl, setLatestInvitationUrl] = useState("");
  const [invitations, setInvitations] = useState<InvitationItem[]>([]);

  const pendingCount = useMemo(
    () => invitations.filter((inv) => inv.status === "PENDING").length,
    [invitations],
  );

  const fetchInvitations = async () => {
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/invitations", { method: "GET" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload?.error ?? "Không thể tải danh sách lời mời.");
        return;
      }
      setInvitations(payload?.data ?? []);
    } catch {
      setError("Không thể tải danh sách lời mời.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleCreateInvitation = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLatestInvitationUrl("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
          expiresInDays,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload?.error ?? "Tạo lời mời thất bại.");
        return;
      }

      setSuccess("Đã tạo lời mời thành công.");
      setLatestInvitationUrl(payload?.data?.invitationUrl ?? "");
      setEmail("");
      await fetchInvitations();
    } catch {
      setError("Tạo lời mời thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyText = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setSuccess("Đã sao chép link mời.");
    } catch {
      setError("Không thể sao chép link.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">Mời thành viên vào gia phả</h1>
            <p className="mt-2 text-sm text-[#475569]">
              Tạo lời mời theo email cho tenant hiện tại. Người nhận đăng ký bằng link sẽ tự động vào đúng gia phả.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchInvitations}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-[#F8FAF8]"
          >
            <RefreshCw className="h-4 w-4 text-[#16A34A]" />
            Làm mới
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-xs text-[#64748B]">Tổng lời mời</p>
          <p className="mt-1 text-2xl font-bold text-[#0F172A]">{invitations.length}</p>
        </article>
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-xs text-[#64748B]">Đang chờ</p>
          <p className="mt-1 text-2xl font-bold text-[#1D4ED8]">{pendingCount}</p>
        </article>
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-xs text-[#64748B]">Đã chấp nhận</p>
          <p className="mt-1 text-2xl font-bold text-[#166534]">
            {invitations.filter((inv) => inv.status === "ACCEPTED").length}
          </p>
        </article>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0F172A]">Tạo lời mời mới</h2>
        <form onSubmit={handleCreateInvitation} className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email người nhận"
            required
            className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as InvitationRole)}
            className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
          >
            <option value="VIEWER">Viewer</option>
            <option value="EDITOR">Editor</option>
            <option value="ADMIN">Admin</option>
          </select>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#475569]">Hết hạn sau (ngày)</label>
            <input
              type="number"
              min={1}
              max={30}
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(Number(e.target.value))}
              aria-label="Hết hạn sau (ngày)"
              title="Hết hạn sau (ngày)"
              className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15803D] disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            Mời
          </button>
        </form>

        {(error || success) && (
          <div
            className={[
              "mt-4 rounded-lg border px-3 py-2 text-sm",
              error
                ? "border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]"
                : "border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]",
            ].join(" ")}
          >
            {error || success}
          </div>
        )}

        {latestInvitationUrl && (
          <div className="mt-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
            <p className="text-xs font-semibold text-[#475569]">Link mời vừa tạo</p>
            <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center">
              <p className="truncate text-sm text-[#0F172A]">{latestInvitationUrl}</p>
              <button
                type="button"
                onClick={() => copyText(latestInvitationUrl)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-sm hover:bg-[#F8FAF8]"
              >
                <Copy className="h-4 w-4 text-[#16A34A]" />
                Sao chép
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0F172A]">Danh sách lời mời</h2>

        {isLoading ? (
          <p className="mt-3 text-sm text-[#64748B]">Đang tải...</p>
        ) : invitations.length === 0 ? (
          <div className="mt-3 rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAF8] p-4 text-sm text-[#64748B]">
            Chưa có lời mời nào trong tenant hiện tại.
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {invitations.map((invitation) => (
              <article
                key={invitation.id}
                className="flex flex-col gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-[#0F172A]">{invitation.email}</p>
                  <p className="mt-1 text-xs text-[#64748B]">
                    Vai trò: {roleLabels[invitation.role]} | Hết hạn:{" "}
                    {new Date(invitation.expiresAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClassName[invitation.status]}`}
                  >
                    {statusLabels[invitation.status]}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(invitation.invitationUrl)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs hover:bg-[#F8FAF8]"
                  >
                    <Link2 className="h-3.5 w-3.5 text-[#16A34A]" />
                    Copy
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
