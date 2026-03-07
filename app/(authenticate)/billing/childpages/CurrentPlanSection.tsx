"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, CreditCard, Receipt, Settings, X, Zap } from "lucide-react";
import UpgradeFlowModal from "./UpgradeFlowModal";

export default function CurrentPlanSection() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelled, setIsCancelled] = useState(false);
  const [showUpgradeFlow, setShowUpgradeFlow] = useState(false);

  return (
    <section className="mx-auto mt-12 max-w-4xl px-6">
      <h2 className="mb-4 text-2xl font-bold text-[#0F172A]">Quản lý thanh toán</h2>

      <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-[#DCFCE7] p-2 text-[#16A34A]">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-[#64748B]">Gói hiện tại</p>
              <p className="text-lg font-semibold text-[#0F172A]">Starter Plan</p>
              {isCancelled ? <p className="text-xs text-[#B91C1C]">Đã hủy — Còn hiệu lực đến 15/03/2026</p> : null}
            </div>
          </div>

          <div className="flex gap-2">
            {!isCancelled ? (
              <button
                onClick={() => setShowCancelModal(true)}
                className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-medium text-[#475569] hover:bg-[#F8FAF8]"
              >
                Hủy gói
              </button>
            ) : (
              <button
                onClick={() => setIsCancelled(false)}
                className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-[#F8FAF8]"
              >
                Kích hoạt lại
              </button>
            )}
            {!isCancelled ? (
              <button
                onClick={() => setShowUpgradeFlow(true)}
                className="rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D]"
              >
                Nâng cấp
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-4">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-[#0F172A]">
              <CreditCard className="h-4 w-4 text-[#16A34A]" />
              Phương thức thanh toán
            </p>
            <p className="mt-2 text-sm text-[#475569]">Chưa thêm thẻ</p>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-4">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-[#0F172A]">
              <Receipt className="h-4 w-4 text-[#16A34A]" />
              Hóa đơn tiếp theo
            </p>
            <p className="mt-2 text-sm text-[#475569]">Không có hóa đơn</p>
            <Link href="/billing" className="mt-2 inline-block text-sm font-medium text-[#16A34A] hover:text-[#15803D]">
              Xem lịch sử
            </Link>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-4">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-[#0F172A]">
              <Settings className="h-4 w-4 text-[#16A34A]" />
              Cài đặt
            </p>
            <p className="mt-2 text-sm text-[#475569]">Quản lý thông tin thanh toán</p>
          </div>
        </div>
      </article>

      {showCancelModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-[#0F172A]">
                <AlertTriangle className="h-5 w-5 text-[#B91C1C]" />
                Hủy gói đăng ký
              </h3>
              <button onClick={() => setShowCancelModal(false)} className="text-[#64748B] hover:text-[#0F172A]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-[#475569]">Bạn sẽ mất quyền truy cập các tính năng cao cấp khi chu kỳ hiện tại kết thúc.</p>
            <div className="mt-3 space-y-2">
              {["Quá đắt", "Không dùng nhiều", "Thiếu tính năng", "Khác"].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setCancelReason(reason)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                    cancelReason === reason ? "border border-[#FCA5A5] bg-[#FEF2F2] text-[#B91C1C]" : "border border-[#E2E8F0] bg-[#F8FAF8] text-[#334155]"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 rounded-lg border border-[#E2E8F0] py-2 text-sm">
                Giữ gói
              </button>
              <button
                onClick={() => {
                  setIsCancelled(true);
                  setCancelReason("");
                  setShowCancelModal(false);
                }}
                className="flex-1 rounded-lg bg-[#B91C1C] py-2 text-sm font-semibold text-white"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <UpgradeFlowModal isOpen={showUpgradeFlow} onClose={() => setShowUpgradeFlow(false)} />
    </section>
  );
}
