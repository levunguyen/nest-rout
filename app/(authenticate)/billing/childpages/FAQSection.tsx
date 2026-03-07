"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Tôi có thể hủy gói đăng ký bất cứ lúc nào không?",
    a: "Có. Bạn có thể hủy bất cứ lúc nào và tiếp tục dùng đến hết chu kỳ hiện tại.",
  },
  {
    q: "Phương thức thanh toán nào được hỗ trợ?",
    a: "Hỗ trợ thẻ Visa/Mastercard, ví điện tử và chuyển khoản ngân hàng.",
  },
  {
    q: "Có thể chuyển đổi giữa các gói không?",
    a: "Có. Bạn có thể nâng cấp hoặc hạ cấp và hệ thống sẽ tính theo phần chênh lệch.",
  },
  {
    q: "Dữ liệu thanh toán có an toàn không?",
    a: "Thông tin thanh toán được xử lý qua cổng bảo mật và truyền tải qua kết nối mã hóa.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto mt-12 max-w-3xl px-6 pb-16">
      <h2 className="mb-4 text-center text-2xl font-bold text-[#0F172A]">Câu hỏi thường gặp</h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div key={faq.q} className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-sm font-medium text-[#0F172A]">{faq.q}</span>
              <ChevronDown className={`h-4 w-4 text-[#64748B] transition ${openIndex === index ? "rotate-180" : ""}`} />
            </button>
            {openIndex === index ? <p className="px-4 pb-4 text-sm text-[#475569]">{faq.a}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
