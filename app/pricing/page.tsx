import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "0đ",
    description: "Dành cho cá nhân mới bắt đầu",
    cta: "Bắt đầu miễn phí",
  },
  {
    name: "Pro",
    price: "19$/tháng",
    description: "Dành cho nhóm nhỏ cần nhiều tính năng hơn",
    cta: "Nâng cấp Pro",
  },
  {
    name: "Enterprise",
    price: "Liên hệ",
    description: "Dành cho tổ chức lớn cần tuỳ chỉnh",
    cta: "Liên hệ tư vấn",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-center text-4xl font-bold text-foreground">Bảng giá</h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          Chọn gói phù hợp để bắt đầu lưu trữ và quản lý gia phả.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground">{plan.name}</h2>
              <p className="mt-2 text-3xl font-bold text-foreground">{plan.price}</p>
              <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
              <Link
                href="/billing"
                className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
