"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  TreePine,
  Shield,
  Users,
  BookOpen,
  Clock,
  Share2,
  Star,
  ChevronRight,
} from "lucide-react";
import heroBg from "../public/hero-bg.jpg";

const features = [
  {
    icon: <TreePine className="h-6 w-6" />,
    title: "Cây Gia Phả Trực Quan",
    desc: "Xây dựng sơ đồ gia phả đẹp mắt, dễ dàng thêm thành viên qua nhiều thế hệ.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Bảo Mật Tuyệt Đối",
    desc: "Dữ liệu được mã hóa và sao lưu tự động trên hệ thống cloud an toàn.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Cộng Tác Dòng Họ",
    desc: "Nhiều thành viên cùng chỉnh sửa, phân quyền admin, editor, viewer.",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Xuất Bản Gia Phả",
    desc: "Xuất gia phả thành sách in chuẩn dòng họ Việt Nam với nhiều mẫu đẹp.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Lưu Trữ Ký Ức",
    desc: "Ghi lại video, audio và timeline sự kiện quý giá của gia đình.",
  },
  {
    icon: <Share2 className="h-6 w-6" />,
    title: "Chia Sẻ Dễ Dàng",
    desc: "Chia sẻ gia phả riêng tư trong dòng họ hoặc công khai cho cộng đồng.",
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

const stats = [
  { value: "50,000+", label: "Dòng họ" },
  { value: "2M+", label: "Thành viên" },
  { value: "500+", label: "Năm lịch sử" },
  { value: "99.9%", label: "Uptime" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <TreePine className="h-6 w-6 text-accent" />
            <span className="font-display text-xl font-bold text-foreground">
              Gia Phả Việt
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Tính năng</a>
            <a href="#testimonials" className="hover:text-foreground">Đánh giá</a>
            <Link href="/pricing" className="hover:text-foreground">
              Bảng giá
            </Link>
          </div>

          <Link
            href="/signup"
            className="rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground"
          >
            Bắt Đầu Ngay
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroBg}
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-36">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-bold text-foreground"
          >
            Lưu Giữ Di Sản,
            <br />
            <span className="text-accent">Kết Nối Thế Hệ</span>
          </motion.h1>

          <div className="mt-8">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
            >
              Tạo Gia Phả Miễn Phí
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-5xl grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="px-6 py-8 text-center"
            >
              <div className="font-display text-2xl md:text-3xl font-bold text-accent">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Tính Năng <span className="text-accent">Nổi Bật</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Mọi thứ bạn cần để xây dựng và bảo tồn gia phả dòng họ một cách chuyên nghiệp.
          </p>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                {f.icon}
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-secondary/50 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Được Tin Dùng Bởi <span className="text-accent">Hàng Nghìn Dòng Họ</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Nghe chia sẻ từ những người đã sử dụng ứng dụng để gìn giữ di sản gia đình.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-5">
                  &quot;{t.text}&quot;
                </p>
                <div>
                  <div className="font-semibold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 md:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Bắt Đầu Lưu Giữ Di Sản <span className="text-accent">Ngay Hôm Nay</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Miễn phí, không cần thẻ tín dụng. Tạo gia phả đầu tiên của bạn trong vài phút.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-gold)] hover:brightness-110 transition-all"
          >


            Tạo Gia Phả Miễn Phí
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>




    </div>
  );
}
