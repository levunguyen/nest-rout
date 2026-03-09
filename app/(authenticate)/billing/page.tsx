"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  CreditCard,
  Download,
  ReceiptText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type BillingCycle = "monthly" | "yearly";
type PlanKey = "member" | "premium";
type InvoiceStatus = "paid" | "pending" | "failed";

type Plan = {
  key: PlanKey;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  highlighted?: boolean;
};

type Invoice = {
  id: string;
  issuedAt: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
  downloadUrl: string;
};

const plans: Plan[] = [
  {
    key: "member",
    name: "Member",
    description: "Gói cơ bản để quản lý gia phả cá nhân.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "Tạo và chỉnh sửa cây gia phả",
      "Quản lý tối đa 100 thành viên",
      "Lưu trữ dữ liệu cơ bản",
    ],
  },
  {
    key: "premium",
    name: "Premium",
    description: "Dành cho dòng họ cần cộng tác và lưu trữ nâng cao.",
    monthlyPrice: 19,
    yearlyPrice: 190,
    highlighted: true,
    features: [
      "Không giới hạn thành viên",
      "Mời cộng tác theo vai trò",
      "Lưu trữ ảnh/tư liệu nâng cao",
      "Ưu tiên hỗ trợ kỹ thuật",
      "Báo cáo hoạt động gia phả",
    ],
  },
];

const invoices: Invoice[] = [
  {
    id: "INV-2026-001",
    issuedAt: "2026-03-01",
    description: "Premium - Tháng 03/2026",
    amount: 19,
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "INV-2026-000",
    issuedAt: "2026-02-01",
    description: "Premium - Tháng 02/2026",
    amount: 19,
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "INV-2026-NEG",
    issuedAt: "2026-01-01",
    description: "Premium - Tháng 01/2026",
    amount: 19,
    status: "failed",
    downloadUrl: "#",
  },
];

const statusUi: Record<InvoiceStatus, { label: string; className: string }> = {
  paid: { label: "Đã thanh toán", className: "bg-[#DCFCE7] text-[#166534]" },
  pending: { label: "Đang xử lý", className: "bg-[#FEF3C7] text-[#92400E]" },
  failed: { label: "Thất bại", className: "bg-[#FEE2E2] text-[#991B1B]" },
};

export default function BillingPage() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [currentPlan] = useState<PlanKey>("member");
  const [selectedUpgrade, setSelectedUpgrade] = useState<PlanKey>("premium");

  const currentPlanInfo = plans.find((plan) => plan.key === currentPlan) ?? plans[0];
  const selectedPlanInfo = plans.find((plan) => plan.key === selectedUpgrade) ?? plans[1];

  const selectedPrice = cycle === "monthly" ? selectedPlanInfo.monthlyPrice : selectedPlanInfo.yearlyPrice;
  const selectedPeriodLabel = cycle === "monthly" ? "tháng" : "năm";

  const totalPaid = useMemo(
    () =>
      invoices
        .filter((invoice) => invoice.status === "paid")
        .reduce((sum, invoice) => sum + invoice.amount, 0),
    [],
  );

  const nextInvoiceDate = "2026-04-01";

  return (
    <main className="min-h-screen bg-[#F8FAF8] px-4 py-8 text-[#0F172A] md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#166534]">
                <Sparkles className="h-3.5 w-3.5" />
                Billing Center
              </span>
              <h1 className="mt-3 text-3xl font-bold md:text-4xl">Thanh toán & Nâng cấp gói</h1>
              <p className="mt-2 text-sm text-[#475569]">
                Quản lý gói hiện tại, nâng cấp lên Premium và theo dõi toàn bộ hóa đơn của bạn.
              </p>
            </div>
            <div className="inline-flex rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-1">
              <button
                type="button"
                onClick={() => setCycle("monthly")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  cycle === "monthly" ? "bg-[#16A34A] text-white" : "text-[#334155]"
                }`}
              >
                Hàng tháng
              </button>
              <button
                type="button"
                onClick={() => setCycle("yearly")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  cycle === "yearly" ? "bg-[#16A34A] text-white" : "text-[#334155]"
                }`}
              >
                Hàng năm
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <p className="text-xs text-[#64748B]">Gói hiện tại</p>
            <p className="mt-1 text-2xl font-bold text-[#0F172A]">{currentPlanInfo.name}</p>
            <p className="mt-1 text-xs text-[#475569]">{currentPlanInfo.description}</p>
          </article>
          <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <p className="text-xs text-[#64748B]">Tổng đã thanh toán</p>
            <p className="mt-1 text-2xl font-bold text-[#0F172A]">${totalPaid}</p>
            <p className="mt-1 text-xs text-[#475569]">Trong lịch sử hóa đơn hiện có</p>
          </article>
          <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <p className="text-xs text-[#64748B]">Hóa đơn kế tiếp</p>
            <p className="mt-1 text-2xl font-bold text-[#0F172A]">
              {new Date(nextInvoiceDate).toLocaleDateString("vi-VN")}
            </p>
            <p className="mt-1 text-xs text-[#475569]">Tự động gia hạn theo chu kỳ đã chọn</p>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold text-[#0F172A]">Nâng cấp lên Premium</h2>
            <p className="mt-1 text-sm text-[#475569]">
              Chọn gói phù hợp và tiến hành nâng cấp để mở toàn bộ tính năng nâng cao.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {plans.map((plan) => {
                const price = cycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
                const isCurrent = plan.key === currentPlan;
                const isSelected = plan.key === selectedUpgrade;
                return (
                  <button
                    key={plan.key}
                    type="button"
                    disabled={isCurrent}
                    onClick={() => setSelectedUpgrade(plan.key)}
                    className={[
                      "rounded-xl border p-4 text-left transition",
                      isSelected ? "border-[#16A34A] bg-[#F0FDF4]" : "border-[#E2E8F0] bg-white hover:bg-[#F8FAF8]",
                      isCurrent ? "cursor-not-allowed opacity-80" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-[#0F172A]">{plan.name}</p>
                        <p className="mt-1 text-sm text-[#475569]">{plan.description}</p>
                      </div>
                      {plan.highlighted ? (
                        <span className="rounded-full bg-[#DCFCE7] px-2 py-1 text-[11px] font-semibold text-[#166534]">
                          Recommended
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-4 text-3xl font-bold text-[#0F172A]">
                      {price === 0 ? "Miễn phí" : `$${price}`}
                    </p>
                    <p className="text-xs text-[#64748B]">/{cycle === "monthly" ? "tháng" : "năm"}</p>
                    <ul className="mt-3 space-y-1.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-[#334155]">
                          <Check className="mt-0.5 h-4 w-4 text-[#16A34A]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {isCurrent ? (
                      <span className="mt-4 inline-flex rounded-md border border-[#E2E8F0] bg-[#F8FAF8] px-2.5 py-1 text-xs font-medium text-[#475569]">
                        Gói đang dùng
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-4">
              <div>
                <p className="text-sm text-[#475569]">Gói sẽ nâng cấp</p>
                <p className="text-xl font-bold text-[#0F172A]">
                  {selectedPlanInfo.name} • {selectedPrice === 0 ? "Miễn phí" : `$${selectedPrice}/${selectedPeriodLabel}`}
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15803D]">
                Nâng cấp ngay
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0F172A]">Thông tin thanh toán</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-[#0F172A]">
                  <CreditCard className="h-4 w-4 text-[#16A34A]" />
                  Payment Method
                </p>
                <p className="mt-1 text-sm text-[#475569]">Visa **** 2048</p>
              </div>
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-[#0F172A]">
                  <CalendarDays className="h-4 w-4 text-[#16A34A]" />
                  Billing Cycle
                </p>
                <p className="mt-1 text-sm text-[#475569]">
                  {cycle === "monthly" ? "Gia hạn mỗi tháng" : "Gia hạn mỗi năm"}
                </p>
              </div>
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-[#0F172A]">
                  <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
                  Security
                </p>
                <p className="mt-1 text-sm text-[#475569]">Dữ liệu thanh toán được mã hóa bảo mật.</p>
              </div>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A]">Lịch sử hóa đơn</h2>
            <button className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-[#F8FAF8]">
              <Download className="h-4 w-4 text-[#16A34A]" />
              Tải tất cả
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#E2E8F0]">
            <div className="grid grid-cols-12 gap-3 border-b border-[#E2E8F0] bg-[#F8FAF8] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              <div className="col-span-3">Mã</div>
              <div className="col-span-2">Ngày</div>
              <div className="col-span-3">Mô tả</div>
              <div className="col-span-2 text-right">Số tiền</div>
              <div className="col-span-2 text-right">Trạng thái</div>
            </div>
            {invoices.map((invoice, index) => (
              <div
                key={invoice.id}
                className={`grid grid-cols-12 items-center gap-3 px-4 py-3 text-sm ${index < invoices.length - 1 ? "border-b border-[#E2E8F0]" : ""}`}
              >
                <div className="col-span-3 font-medium text-[#0F172A]">{invoice.id}</div>
                <div className="col-span-2 text-[#475569]">
                  {new Date(invoice.issuedAt).toLocaleDateString("vi-VN")}
                </div>
                <div className="col-span-3 text-[#475569]">{invoice.description}</div>
                <div className="col-span-2 text-right font-semibold text-[#0F172A]">${invoice.amount}</div>
                <div className="col-span-2 flex justify-end">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusUi[invoice.status].className}`}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {statusUi[invoice.status].label}
                  </span>
                </div>
                <div className="col-span-12 flex justify-end">
                  <a
                    href={invoice.downloadUrl}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#16A34A] hover:text-[#15803D]"
                  >
                    <ReceiptText className="h-3.5 w-3.5" />
                    Tải hóa đơn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
