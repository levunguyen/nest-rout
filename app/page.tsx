"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ChevronRight,
  HeartHandshake,
  Landmark,
  Lock,
  Sparkles,
  Star,
  TreePine,
} from "lucide-react";
import heroBg from "../public/hero-bg.jpg";
import grandfather from "../public/images/grandfather.png";
import grandmother from "../public/images/grandmother.png";
import dad from "../public/images/dad.png";
import nephew from "../public/images/nephew.png";
import memorial from "../public/images/hero-memorial.jpg";
import grave1 from "../public/images/grave-1.jpg";
import grave2 from "../public/images/grave-2.jpg";
import grave3 from "../public/images/grave-3.jpg";

const highlights = [
  {
    icon: <TreePine className="h-5 w-5" />,
    title: "Sơ đồ gia phả trực quan",
    description: "Dễ theo dõi nhiều thế hệ, thêm/sửa thành viên nhanh với giao diện rõ ràng.",
    image: grandfather,
    imageAlt: "Sơ đồ gia phả",
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: "Bảo mật theo vai trò",
    description: "Phân quyền quản trị, chỉnh sửa, xem và theo dõi thay đổi dữ liệu dễ dàng.",
    image: grave1,
    imageAlt: "Bảo mật dữ liệu gia phả",
  },
  {
    icon: <HeartHandshake className="h-5 w-5" />,
    title: "Cộng tác dòng họ",
    description: "Nhiều thành viên cùng cập nhật ký ức, tư liệu và các mốc sự kiện gia đình.",
    image: dad,
    imageAlt: "Thành viên gia đình cộng tác",
  },
  {
    icon: <Landmark className="h-5 w-5" />,
    title: "Lưu giữ di sản",
    description: "Gắn kết lịch sử gia đình với ảnh, bài viết và các cột mốc theo thời gian.",
    image: grave2,
    imageAlt: "Di sản và ký ức gia đình",
  },
];

const testimonials = [
  {
    name: "Nguyễn Văn Minh",
    role: "Trưởng họ Nguyễn, Hà Nội",
    text: "Nhờ ứng dụng này, dòng họ chúng tôi đã số hóa được gia phả 12 đời.",
    stars: 5,
  },
  {
    name: "Trần Thị Hương",
    role: "Giáo viên, TP. Hồ Chí Minh",
    text: "Giao diện rất đẹp và dễ sử dụng, ngay cả người lớn tuổi cũng thao tác được.",
    stars: 5,
  },
  {
    name: "Lê Hoàng Nam",
    role: "Việt kiều, California",
    text: "Ứng dụng giúp tôi kết nối với dòng họ và hiểu rõ hơn về tổ tiên.",
    stars: 5,
  },
];

const metrics = [
  { value: "50K+", label: "Dòng họ đang sử dụng" },
  { value: "2M+", label: "Thành viên được lưu trữ" },
  { value: "99.9%", label: "Độ ổn định hệ thống" },
];

const familyMoments = [
  { src: grandfather, title: "Gia đình thế hệ trước", note: "Lưu chân dung và thông tin tổ tiên." },
  { src: grandmother, title: "Ký ức dòng họ", note: "Gắn ảnh, tài liệu, câu chuyện theo từng đời." },
  { src: dad, title: "Kết nối hiện tại", note: "Theo dõi thành viên và các mốc sự kiện quan trọng." },
  { src: nephew, title: "Trao lại cho thế hệ sau", note: "Dễ chia sẻ để con cháu cùng tiếp nối." },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#0F172A]">
      <nav className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <TreePine className="h-6 w-6 text-[#16A34A]" />
            <span className="text-xl font-bold tracking-tight">Gia Phả Việt</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-[#475569] md:flex">
            <a href="#highlights" className="hover:text-slate-900">
              Tính năng
            </a>
            <a href="#gallery" className="hover:text-slate-900">
              Hình ảnh
            </a>
            <a href="#reviews" className="hover:text-slate-900">
              Đánh giá
            </a>
            <Link href="/pricing" className="hover:text-slate-900">
              Bảng giá
            </Link>
          </div>

          <Link
            href="/signup"
            className="rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D]"
          >
            Đăng ký
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroBg}
            alt="Family heritage background"
            fill
            priority
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(22,163,74,0.10),_transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/45 to-white/85" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#166534]">
              <Sparkles className="h-3.5 w-3.5" />
              Nền tảng quản lý gia phả hiện đại
            </span>
            <h1 className="text-4xl font-bold leading-tight text-[#0F172A] md:text-6xl">
              Lưu giữ gia phả,
              <span className="block text-[#16A34A]">kết nối thế hệ.</span>
            </h1>
            <p className="max-w-xl text-[#475569]">
              Một nơi tập trung để lưu trữ thành viên, sự kiện và ký ức dòng họ với giao diện dễ
              dùng cho mọi lứa tuổi.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#15803D]"
            >
              Xem bảng giá
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm"
          >
            <div className="relative h-72 overflow-hidden rounded-xl md:h-80">
              <Image src={memorial} alt="Gia đình và ký ức dòng họ" fill className="object-cover" />
            </div>
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute -left-3 top-6 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 shadow-md"
            >
              <p className="text-xs font-semibold text-[#16A34A]">Gia phả số hóa</p>
            </motion.div>
            <motion.div
              animate={{ y: [3, -3, 3] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute -right-3 bottom-8 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 shadow-md"
            >
              <p className="text-xs font-semibold text-[#16A34A]">Kết nối đa thế hệ</p>
            </motion.div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                  <div className="text-xl font-bold text-[#16A34A]">{metric.value}</div>
                  <div className="mt-1 text-xs text-[#475569]">{metric.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="highlights" className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#0F172A] md:text-4xl">Tính năng nổi bật</h2>
          <p className="mt-2 text-[#475569]">Thiết kế tối ưu cho việc số hóa và duy trì gia phả dài hạn.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {highlights.map((item, i) => (
            <motion.article
              key={item.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/35 to-transparent" />
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute left-4 top-4 inline-flex rounded-lg bg-white/90 p-2 text-[#16A34A] shadow"
                >
                  {item.icon}
                </motion.div>
              </div>

              <div className="relative p-6">
                <div className="absolute right-4 top-4 flex -space-x-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {[grave1, grave2, grave3].map((img, idx) => (
                    <span key={idx} className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-white">
                      <Image src={img} alt="" fill className="object-cover" />
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#475569]">{item.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#0F172A] md:text-4xl">Bộ sưu tập gia đình</h2>
          <p className="mt-2 text-[#475569]">
            Lưu ảnh chân dung, hình tư liệu và các khoảnh khắc quan trọng theo từng nhánh gia đình.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {familyMoments.map((item, i) => (
            <motion.article
              key={item.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -5 }}
              className="group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm"
            >
              <div className="relative h-56 overflow-hidden md:h-64">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#0F172A]">{item.title}</h3>
                <p className="mt-1 text-sm text-[#475569]">{item.note}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="reviews" className="border-y border-[#E2E8F0] bg-[#F8FAF8] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-[#0F172A] md:text-4xl">Được nhiều dòng họ tin dùng</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((review, i) => (
              <motion.article
                key={review.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-5"
              >
                <div className="mb-3 flex items-center gap-1">
                  {Array.from({ length: review.stars }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-[#16A34A] text-[#16A34A]" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-[#475569]">&quot;{review.text}&quot;</p>
                <div className="mt-4">
                  <div className="text-sm font-semibold text-[#0F172A]">{review.name}</div>
                  <div className="text-xs text-[#64748B]">{review.role}</div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
        <div className="rounded-2xl border border-[#16A34A]/25 bg-[#DCFCE7] p-8">
          <h2 className="text-3xl font-bold text-[#0F172A] md:text-4xl">Sẵn sàng bắt đầu gia phả của bạn?</h2>
          <p className="mx-auto mt-3 max-w-xl text-[#475569]">
            Bắt đầu miễn phí và nâng cấp khi cần thêm công cụ quản lý nâng cao.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-7 py-3 text-sm font-semibold text-white hover:bg-[#15803D]"
          >
            Bắt đầu ngay
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
