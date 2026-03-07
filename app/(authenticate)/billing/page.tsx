"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, CreditCard, ReceiptText, ShieldCheck, Sparkles } from "lucide-react";

type Plan = {
  name: string;
  description: string;
  monthly: number;
  yearly: number;
  features: string[];
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    description: "Dành cho cá nhân mới bắt đầu",
    monthly: 0,
    yearly: 0,
    features: ["1 dự án", "1GB lưu trữ", "Hỗ trợ cộng đồng", "Tính năng cơ bản"],
  },
  {
    name: "Pro",
    description: "Dành cho chuyên gia và đội nhỏ",
    monthly: 19,
    yearly: 182,
    featured: true,
    features: [
      "Không giới hạn dự án",
      "50GB lưu trữ",
      "Hỗ trợ ưu tiên 24/7",
      "Tính năng nâng cao",
      "API access",
      "Tùy chỉnh thương hiệu",
    ],
  },
  {
    name: "Enterprise",
    description: "Dành cho doanh nghiệp lớn",
    monthly: 79,
    yearly: 758,
    features: ["Mọi tính năng Pro", "Lưu trữ không giới hạn", "Quản lý đội nhóm", "SSO & SAML", "SLA 99.99%"],
  },
];

const faqs = [
  {
    q: "Tôi có thể hủy gói bất cứ lúc nào không?",
    a: "Có. Bạn có thể hủy bất cứ lúc nào và vẫn sử dụng dịch vụ đến hết chu kỳ hiện tại.",
  },
  {
    q: "Tôi có thể chuyển đổi giữa các gói không?",
    a: "Có. Bạn có thể nâng cấp hoặc hạ cấp bất kỳ lúc nào, hệ thống sẽ tính phần chênh lệch theo chu kỳ.",
  },
  {
    q: "Dữ liệu thanh toán có an toàn không?",
    a: "Thông tin thanh toán được xử lý qua cổng thanh toán chuẩn bảo mật và mã hóa theo tiêu chuẩn hiện hành.",
  },
];

export default function BillingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const yearlySavings = useMemo(() => {
    return plans.map((plan) => ({
      name: plan.name,
      saving: Math.max(0, plan.monthly * 12 - plan.yearly),
    }));
  }, []);

  return (
    <main className="min-h-screen bg-[#F8FAF8] px-4 py-8 text-[#0F172A] md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#166534]">
                <Sparkles className="h-3.5 w-3.5" />
                Billing & Subscription
              </span>
              <h1 className="mt-3 text-3xl font-bold md:text-4xl">Chọn gói phù hợp với bạn</h1>
              <p className="mt-2 text-sm text-[#475569]">Bắt đầu miễn phí, nâng cấp khi cần. Hủy bất cứ lúc nào.</p>
            </div>
            <div className="inline-flex rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-1">
              <button
                onClick={() => setIsYearly(false)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${!isYearly ? "bg-[#16A34A] text-white" : "text-[#334155]"}`}
              >
                Hàng tháng
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${isYearly ? "bg-[#16A34A] text-white" : "text-[#334155]"}`}
              >
                Hàng năm
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => {
            const price = isYearly ? plan.yearly : plan.monthly;
            const saving = yearlySavings.find((item) => item.name === plan.name)?.saving ?? 0;
            return (
              <article
                key={plan.name}
                className={`rounded-2xl border bg-white p-5 shadow-sm ${plan.featured ? "border-[#16A34A]" : "border-[#E2E8F0]"}`}
              >
                {plan.featured ? (
                  <span className="mb-2 inline-flex rounded-full bg-[#DCFCE7] px-2.5 py-1 text-xs font-semibold text-[#166534]">
                    Phổ biến nhất
                  </span>
                ) : null}
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p className="mt-1 text-sm text-[#475569]">{plan.description}</p>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-[#0F172A]">{price === 0 ? "Miễn phí" : `$${price}`}</p>
                  {price > 0 ? <p className="text-xs text-[#64748B]">/{isYearly ? "năm" : "tháng"}</p> : null}
                  {isYearly && saving > 0 ? <p className="mt-1 text-xs text-[#166534]">Tiết kiệm ${saving}/năm</p> : null}
                </div>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-[#334155]">
                      <Check className="mt-0.5 h-4 w-4 text-[#16A34A]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-5 w-full rounded-lg py-2.5 text-sm font-semibold ${plan.featured ? "bg-[#16A34A] text-white hover:bg-[#15803D]" : "border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAF8]"}`}
                >
                  {price === 0 ? "Bắt đầu miễn phí" : `Chọn ${plan.name}`}
                </button>
              </article>
            );
          })}
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold text-[#0F172A]">Gói hiện tại</h3>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-4">
              <div>
                <p className="text-sm text-[#64748B]">Bạn đang dùng</p>
                <p className="text-xl font-bold text-[#0F172A]">Starter Plan</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-medium hover:bg-white">Hủy gói</button>
                <button className="rounded-lg bg-[#16A34A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#15803D]">Nâng cấp</button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-[#0F172A]">
                  <CreditCard className="h-4 w-4 text-[#16A34A]" />
                  Phương thức thanh toán
                </p>
                <p className="mt-2 text-sm text-[#475569]">Chưa thêm thẻ</p>
              </div>
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-[#0F172A]">
                  <ReceiptText className="h-4 w-4 text-[#16A34A]" />
                  Hóa đơn tiếp theo
                </p>
                <p className="mt-2 text-sm text-[#475569]">Không có hóa đơn</p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-[#0F172A]">
              <ShieldCheck className="h-5 w-5 text-[#16A34A]" />
              Billing Notes
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-[#475569]">
              <li>- Thanh toán theo chu kỳ, có thể đổi gói bất cứ lúc nào.</li>
              <li>- Gói năm giúp tiết kiệm chi phí so với gói tháng.</li>
              <li>- Hóa đơn và lịch sử giao dịch luôn có trong tài khoản.</li>
            </ul>
          </article>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0F172A]">Câu hỏi thường gặp</h3>
          <div className="mt-3 space-y-2">
            {faqs.map((item, index) => (
              <div key={item.q} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8]">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-medium text-[#0F172A]">{item.q}</span>
                  <ChevronDown className={`h-4 w-4 text-[#64748B] transition ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                {openFaq === index ? <p className="px-4 pb-3 text-sm text-[#475569]">{item.a}</p> : null}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
