"use client"
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/components/lib/utils";

const faqs = [
    {
        q: "Tôi có thể hủy gói đăng ký bất cứ lúc nào không?",
        a: "Có, bạn có thể hủy bất cứ lúc nào. Bạn sẽ tiếp tục sử dụng dịch vụ cho đến hết chu kỳ thanh toán hiện tại.",
    },
    {
        q: "Phương thức thanh toán nào được hỗ trợ?",
        a: "Chúng tôi hỗ trợ thẻ Visa, Mastercard, American Express và các ví điện tử phổ biến.",
    },
    {
        q: "Có thể chuyển đổi giữa các gói không?",
        a: "Có, bạn có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào. Phần chênh lệch sẽ được tính theo tỷ lệ.",
    },
    {
        q: "Dữ liệu của tôi có an toàn không?",
        a: "Chúng tôi sử dụng mã hóa SSL/TLS và tuân thủ các tiêu chuẩn bảo mật quốc tế để bảo vệ dữ liệu của bạn.",
    },
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="mx-auto mt-24 max-w-2xl px-6 pb-24">
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
                Câu hỏi thường gặp
            </h2>
            <div className="space-y-3">
                {faqs.map((faq, i) => (
                    <div key={i} className="glass-card rounded-xl overflow-hidden">
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="flex w-full items-center justify-between p-5 text-left"
                        >
                            <span className="text-sm font-medium text-foreground">{faq.q}</span>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                                    openIndex === i && "rotate-180"
                                )}
                            />
                        </button>
                        <div
                            className={cn(
                                "overflow-hidden transition-all duration-200",
                                openIndex === i ? "max-h-40 pb-5 px-5" : "max-h-0"
                            )}
                        >
                            <p className="text-sm text-muted-foreground">{faq.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQSection;
