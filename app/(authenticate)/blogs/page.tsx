import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { blogPosts } from "./data";

function LeadStory({ postId }: { postId: string }) {
  const post = blogPosts.find((p) => p.id === postId);
  if (!post) return null;

  return (
    <article className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
      <div className="relative h-72 md:h-96">
        <Image src={post.image} alt={post.title} fill className="object-cover" />
      </div>
      <div className="space-y-3 p-6">
        <span className="inline-flex rounded-md border border-[#16A34A]/20 bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#166534]">
          {post.category}
        </span>
        <h2 className="text-2xl font-bold leading-tight text-[#0F172A] md:text-4xl">{post.title}</h2>
        <p className="text-sm leading-6 text-[#475569]">{post.excerpt}</p>
        <div className="flex flex-wrap gap-4 text-xs text-[#64748B]">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5 text-[#16A34A]" />
            {post.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5 text-[#16A34A]" />
            {post.readTime}
          </span>
        </div>
        <Link
          href={`/blogs/${post.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#16A34A] hover:text-[#15803D]"
        >
          Đọc toàn bộ bài
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function SideHeadline({ postId }: { postId: string }) {
  const post = blogPosts.find((p) => p.id === postId);
  if (!post) return null;

  return (
    <article className="border-b border-[#E2E8F0] pb-4 last:border-b-0 last:pb-0">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#16A34A]">{post.category}</p>
      <Link href={`/blogs/${post.id}`} className="mt-1 block text-base font-bold leading-snug text-[#0F172A] hover:text-[#15803D]">
        {post.title}
      </Link>
      <p className="mt-1 text-xs text-[#64748B]">{post.date}</p>
    </article>
  );
}

function NewsRow({ postId }: { postId: string }) {
  const post = blogPosts.find((p) => p.id === postId);
  if (!post) return null;

  return (
    <article className="grid gap-4 border-b border-[#E2E8F0] pb-5 md:grid-cols-4">
      <div className="relative h-40 overflow-hidden rounded-xl md:col-span-1">
        <Image src={post.image} alt={post.title} fill className="object-cover" />
      </div>
      <div className="space-y-2 md:col-span-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#16A34A]">{post.category}</p>
        <Link href={`/blogs/${post.id}`} className="block text-xl font-bold leading-snug text-[#0F172A] hover:text-[#15803D]">
          {post.title}
        </Link>
        <p className="line-clamp-2 text-sm text-[#475569]">{post.excerpt}</p>
        <div className="flex items-center gap-4 text-xs text-[#64748B]">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </article>
  );
}

export default function BlogsPage() {
  const leadId = blogPosts.find((post) => post.featured)?.id ?? blogPosts[0]?.id;
  const sideIds = blogPosts.filter((post) => post.id !== leadId).slice(0, 4).map((post) => post.id);
  const latestIds = blogPosts.filter((post) => post.id !== leadId).map((post) => post.id);

  return (
    <main className="min-h-screen bg-[#F8FAF8] px-4 py-8 text-[#0F172A] md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#16A34A]">Gia Phả Việt Newsroom</p>
              <h1 className="mt-2 text-3xl font-bold md:text-5xl">Tin tức gia đình</h1>
            </div>
            <p className="text-sm text-[#475569]">{new Date().toLocaleDateString("vi-VN")}</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">{leadId ? <LeadStory postId={leadId} /> : null}</div>
          <aside className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#0F172A]">Tin nhanh</h2>
            <div className="mt-4 space-y-4">
              {sideIds.map((postId) => (
                <SideHeadline key={postId} postId={postId} />
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#0F172A]">Mới nhất</h2>
            <div className="mt-5 space-y-5">
              {latestIds.map((postId) => (
                <NewsRow key={postId} postId={postId} />
              ))}
            </div>
          </div>
          <aside className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#0F172A]">Bản tin theo chủ đề</h2>
            <div className="mt-4 space-y-2">
              {["Hướng dẫn", "Kho tư liệu", "Bảo mật", "Sự kiện", "Cộng đồng"].map((tag) => (
                <span key={tag} className="inline-flex rounded-md border border-[#E2E8F0] bg-[#F8FAF8] px-3 py-1 text-xs text-[#475569]">
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm text-[#475569]">
              Cập nhật liên tục các bài viết giúp dòng họ chuẩn hóa dữ liệu, quản lý sự kiện và lưu giữ di sản số.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
