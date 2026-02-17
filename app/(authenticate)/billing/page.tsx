"use client";
import { useState } from "react";
import BillingToggle from "./childpages/BillingToggle";
import PricingCard from "./childpages/PricingCard";
import CurrentPlanSection from "./childpages/CurrentPlanSection";
import FAQSection from "./childpages/FAQSection";

const plans = [
    {
        name: "Starter",
        price: { monthly: 0, yearly: 0 },
        description: "Dành cho cá nhân mới bắt đầu",
        features: [
            "1 dự án",
            "1GB lưu trữ",
            "Hỗ trợ cộng đồng",
            "Tính năng cơ bản",
        ],
        cta: "Bắt đầu miễn phí",
    },
    {
        name: "Pro",
        price: { monthly: 19, yearly: 182 },
        description: "Dành cho chuyên gia và đội nhỏ",
        features: [
            "Không giới hạn dự án",
            "50GB lưu trữ",
            "Hỗ trợ ưu tiên 24/7",
            "Tính năng nâng cao",
            "API access",
            "Tùy chỉnh thương hiệu",
        ],
        featured: true,
        cta: "Nâng cấp Pro",
    },
    {
        name: "Enterprise",
        price: { monthly: 79, yearly: 758 },
        description: "Dành cho doanh nghiệp lớn",
        features: [
            "Mọi tính năng Pro",
            "Lưu trữ không giới hạn",
            "Quản lý đội nhóm",
            "SSO & SAML",
            "SLA 99.99%",
            "Quản lý tài khoản riêng",
        ],
        cta: "Liên hệ bán hàng",
    },
];

const Index = () => {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="pt-20 pb-4 text-center px-6">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Chọn gói phù hợp với bạn
                </h1>
                <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                    Bắt đầu miễn phí, nâng cấp khi cần. Không ràng buộc, hủy bất cứ lúc nào.
                </p>
                <div className="mt-8">
                    <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="mx-auto mt-12 max-w-5xl px-6">
                <div className="grid gap-6 md:grid-cols-3">
                    {plans.map((plan) => (
                        <PricingCard key={plan.name} {...plan} isYearly={isYearly} />
                    ))}
                </div>
            </section>

            {/* Billing Management */}
            <CurrentPlanSection />

            {/* FAQ */}
            <FAQSection />
        </div>
    );
};

export default Index;
