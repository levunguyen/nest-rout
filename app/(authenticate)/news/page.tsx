"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Clock3, MessageCircle } from "lucide-react";

type ApiNewsPost = {
  id: string;
  title: string;
  excerpt?: string | null;
  content: string[];
  imageUrl?: string | null;
  category: string;
  readTimeMinutes: number;
  featured: boolean;
  publishedAt: string;
  authorName?: string | null;
  createdBy?: { fullName: string } | null;
  _count?: { comments: number };
};

type MePayload = {
  activeFamilyTreeId?: string | null;
  tenants?: { id: string; role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER" }[];
};

const formatDate = (value: string) => new Date(value).toLocaleDateString("vi-VN");
const formatReadTime = (minutes: number) => `${minutes} phút đọc`;

function LeadStory({
  post,
  canManagePins,
  isPinToggling,
  onTogglePin,
}: {
  post: ApiNewsPost;
  canManagePins: boolean;
  isPinToggling: boolean;
  onTogglePin: (post: ApiNewsPost) => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
      <div className="relative h-72 md:h-96">
        <Image src={post.imageUrl || "/images/hero-memorial.jpg"} alt={post.title} fill className="object-cover" />
      </div>
      <div className="space-y-3 p-6">
        <span className="inline-flex rounded-md border border-[#16A34A]/20 bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#166534]">
          {post.category}
        </span>
        <h2 className="text-2xl font-bold leading-tight text-[#0F172A] md:text-4xl">{post.title}</h2>
        <p className="text-sm leading-6 text-[#475569]">{post.excerpt || "Bài viết đang được cập nhật nội dung tóm tắt."}</p>
        <div className="flex flex-wrap gap-4 text-xs text-[#64748B]">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5 text-[#16A34A]" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5 text-[#16A34A]" />
            {formatReadTime(post.readTimeMinutes)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5 text-[#16A34A]" />
            {post._count?.comments ?? 0} bình luận
          </span>
        </div>
        <Link
          href={`/news/${post.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#16A34A] hover:text-[#15803D]"
        >
          Đọc toàn bộ bài
          <ArrowRight className="h-4 w-4" />
        </Link>
        {canManagePins ? (
          <button
            type="button"
            disabled={isPinToggling}
            onClick={() => onTogglePin(post)}
            className="ml-3 inline-flex items-center rounded-full border border-[#E2E8F0] bg-[#F8FAF8] px-3 py-1 text-xs font-semibold text-[#0F172A] disabled:opacity-60"
          >
            {isPinToggling ? "Đang cập nhật..." : post.featured ? "Bỏ ghim" : "Ghim bài"}
          </button>
        ) : null}
      </div>
    </article>
  );
}

function SideHeadline({ post }: { post: ApiNewsPost }) {
  return (
    <article className="border-b border-[#E2E8F0] pb-4 last:border-b-0 last:pb-0">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#16A34A]">{post.category}</p>
      <Link href={`/news/${post.id}`} className="mt-1 block text-base font-bold leading-snug text-[#0F172A] hover:text-[#15803D]">
        {post.title}
      </Link>
      <p className="mt-1 text-xs text-[#64748B]">{formatDate(post.publishedAt)}</p>
    </article>
  );
}

function NewsRow({
  post,
  canManagePins,
  isPinToggling,
  onTogglePin,
}: {
  post: ApiNewsPost;
  canManagePins: boolean;
  isPinToggling: boolean;
  onTogglePin: (post: ApiNewsPost) => void;
}) {
  return (
    <article className="grid gap-4 border-b border-[#E2E8F0] pb-5 md:grid-cols-4">
      <div className="relative h-40 overflow-hidden rounded-xl md:col-span-1">
        <Image src={post.imageUrl || "/images/hero-memorial.jpg"} alt={post.title} fill className="object-cover" />
      </div>
      <div className="space-y-2 md:col-span-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#16A34A]">{post.category}</p>
        <Link href={`/news/${post.id}`} className="block text-xl font-bold leading-snug text-[#0F172A] hover:text-[#15803D]">
          {post.title}
        </Link>
        <p className="line-clamp-2 text-sm text-[#475569]">{post.excerpt || "Bài viết đang được cập nhật nội dung tóm tắt."}</p>
        <div className="flex items-center gap-4 text-xs text-[#64748B]">
          <span>{formatDate(post.publishedAt)}</span>
          <span>{formatReadTime(post.readTimeMinutes)}</span>
          {canManagePins ? (
            <button
              type="button"
              disabled={isPinToggling}
              onClick={() => onTogglePin(post)}
              className="rounded-full border border-[#E2E8F0] bg-[#F8FAF8] px-2.5 py-1 font-semibold text-[#0F172A] disabled:opacity-60"
            >
              {isPinToggling ? "Đang cập nhật..." : post.featured ? "Bỏ ghim" : "Ghim"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function NewsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<ApiNewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canManagePins, setCanManagePins] = useState(false);
  const [pinTogglingId, setPinTogglingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [newsResponse, meResponse] = await Promise.all([
          fetch("/api/news?limit=50", { method: "GET" }),
          fetch("/api/auth/me", { method: "GET" }),
        ]);
        const payload = await newsResponse.json().catch(() => ({}));
        const mePayload = await meResponse.json().catch(() => ({}));

        if (newsResponse.status === 401 || meResponse.status === 401) {
          router.push("/login");
          return;
        }

        if (!newsResponse.ok) {
          setError(payload?.error || "Không thể tải danh sách tin tức");
          setPosts([]);
          return;
        }

        const meData = (mePayload?.data ?? {}) as MePayload;
        const activeTenant = meData.tenants?.find((tenant) => tenant.id === meData.activeFamilyTreeId);
        setCanManagePins(Boolean(activeTenant && ["OWNER", "ADMIN", "EDITOR"].includes(activeTenant.role)));
        setPosts((payload?.data ?? []) as ApiNewsPost[]);
      } catch {
        setError("Lỗi kết nối khi tải tin tức");
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [router]);

  const handleTogglePin = async (post: ApiNewsPost) => {
    if (!canManagePins || pinTogglingId) return;
    const nextFeatured = !post.featured;
    const previousPosts = posts;
    setPinTogglingId(post.id);
    setError(null);
    setPosts((prev) =>
      prev.map((item) =>
        item.id === post.id
          ? {
              ...item,
              featured: nextFeatured,
            }
          : item,
      ),
    );

    try {
      const response = await fetch(`/api/news/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: nextFeatured }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setPosts(previousPosts);
        setError(payload?.error || "Không thể cập nhật trạng thái ghim.");
      }
    } catch {
      setPosts(previousPosts);
      setError("Không thể cập nhật trạng thái ghim.");
    } finally {
      setPinTogglingId(null);
    }
  };

  const { leadPost, sidePosts, latestPosts, categories } = useMemo(() => {
    if (posts.length === 0) {
      return {
        leadPost: null as ApiNewsPost | null,
        sidePosts: [] as ApiNewsPost[],
        latestPosts: [] as ApiNewsPost[],
        categories: [] as string[],
      };
    }

    const lead = posts.find((p) => p.featured) ?? posts[0];
    const side = posts.filter((p) => p.id !== lead.id).slice(0, 4);
    const latest = posts.filter((p) => p.id !== lead.id);
    const tags = Array.from(new Set(posts.map((p) => p.category))).slice(0, 8);

    return {
      leadPost: lead,
      sidePosts: side,
      latestPosts: latest,
      categories: tags,
    };
  }, [posts]);

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

        {isLoading ? (
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-sm text-[#475569]">Đang tải tin tức...</section>
        ) : error ? (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-8 text-sm text-red-600">{error}</section>
        ) : posts.length === 0 ? (
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-sm text-[#475569]">
            Chưa có bài viết nào trong cây gia phả hiện tại.
          </section>
        ) : (
          <>
            <section className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {leadPost ? (
                  <LeadStory
                    post={leadPost}
                    canManagePins={canManagePins}
                    isPinToggling={pinTogglingId === leadPost.id}
                    onTogglePin={handleTogglePin}
                  />
                ) : null}
              </div>
              <aside className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-[#0F172A]">Tin nhanh</h2>
                <div className="mt-4 space-y-4">
                  {sidePosts.map((post) => (
                    <SideHeadline key={post.id} post={post} />
                  ))}
                </div>
              </aside>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:col-span-2">
                <h2 className="text-2xl font-bold text-[#0F172A]">Mới nhất</h2>
                <div className="mt-5 space-y-5">
                  {latestPosts.map((post) => (
                    <NewsRow
                      key={post.id}
                      post={post}
                      canManagePins={canManagePins}
                      isPinToggling={pinTogglingId === post.id}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </div>
              </div>
              <aside className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-[#0F172A]">Bản tin theo chủ đề</h2>
                <div className="mt-4 space-y-2">
                  {categories.map((tag) => (
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
          </>
        )}
      </div>
    </main>
  );
}
