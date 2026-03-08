"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

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

type ApiNewsListResponse = {
  data: ApiNewsPost[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  error?: string;
};

type NewsFormState = {
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  readTimeMinutes: number;
  featured: boolean;
  authorName: string;
};

const NEWS_CATEGORIES = [
  "Tin tức",
  "Thông báo dòng họ",
  "Sự kiện gia phả",
  "Ngày giỗ - Tưởng niệm",
  "Sinh nhật - Mừng thọ",
  "Tư liệu - Lịch sử họ tộc",
  "Hướng dẫn sử dụng",
  "Hoạt động cộng đồng",
] as const;

const emptyForm: NewsFormState = {
  title: "",
  excerpt: "",
  content: "",
  imageUrl: "",
  category: "Tin tức",
  readTimeMinutes: 5,
  featured: false,
  authorName: "",
};

const toEditorState = (post: ApiNewsPost): NewsFormState => ({
  title: post.title,
  excerpt: post.excerpt ?? "",
  content: Array.isArray(post.content) ? post.content.join("\n\n") : "",
  imageUrl: post.imageUrl ?? "",
  category: post.category,
  readTimeMinutes: post.readTimeMinutes,
  featured: post.featured,
  authorName: post.authorName ?? post.createdBy?.fullName ?? "",
});

const formatDate = (value: string) => new Date(value).toLocaleDateString("vi-VN");

export default function AdminNewsPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<ApiNewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NewsFormState>(emptyForm);

  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"publishedAt" | "title" | "comments">("publishedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const isEditing = !!editingId;

  const categories = useMemo(
    () =>
      Array.from(new Set([...NEWS_CATEGORIES, ...posts.map((post) => post.category)])).sort((a, b) =>
        a.localeCompare(b, "vi"),
      ),
    [posts],
  );

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        sortBy,
        sortOrder,
      });

      if (searchKeyword.trim()) {
        query.set("search", searchKeyword.trim());
      }
      if (categoryFilter !== "all") {
        query.set("category", categoryFilter);
      }

      const response = await fetch(`/api/news?${query.toString()}`, { method: "GET" });
      const payload = (await response.json().catch(() => ({}))) as ApiNewsListResponse;

      if (response.status === 401) {
        router.push("/login");
        return;
      }
      if (response.status === 403) {
        setError("Bạn không có quyền quản trị tin tức.");
        setPosts([]);
        return;
      }
      if (!response.ok) {
        setError(payload?.error || "Không thể tải danh sách bài viết");
        setPosts([]);
        return;
      }

      setPosts(payload.data ?? []);
      setTotal(payload.meta?.total ?? 0);
      setTotalPages(payload.meta?.totalPages ?? 1);
    } catch {
      setError("Lỗi kết nối khi tải bài viết");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchKeyword, categoryFilter, sortBy, sortOrder, router]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const startEdit = (post: ApiNewsPost) => {
    setEditingId(post.id);
    setForm(toEditorState(post));
    setError(null);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearchKeyword(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchKeyword("");
    setPage(1);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const contentParagraphs = form.content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    if (form.title.trim().length < 2 || contentParagraphs.length === 0) {
      setError("Tiêu đề và nội dung là bắt buộc.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim() || undefined,
      content: contentParagraphs,
      imageUrl: form.imageUrl.trim() || undefined,
      category: form.category.trim() || "Tin tức",
      readTimeMinutes: Math.max(1, Math.min(180, Number(form.readTimeMinutes) || 5)),
      featured: form.featured,
      authorName: form.authorName.trim() || undefined,
    };

    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(isEditing ? `/api/news/${editingId}` : "/api/news", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.push("/login");
        return;
      }
      if (!response.ok) {
        setError(data?.error || "Không thể lưu bài viết");
        return;
      }

      await loadPosts();
      resetForm();
    } catch {
      setError("Lỗi kết nối khi lưu bài viết");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (post: ApiNewsPost) => {
    const ok = window.confirm(`Xóa bài viết \"${post.title}\"?`);
    if (!ok) return;

    setError(null);
    try {
      const response = await fetch(`/api/news/${post.id}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.push("/login");
        return;
      }
      if (!response.ok) {
        setError(payload?.error || "Không thể xóa bài viết");
        return;
      }

      if (editingId === post.id) {
        resetForm();
      }

      // If deleting last item on page, go back one page.
      if (posts.length === 1 && page > 1) {
        setPage((prev) => Math.max(1, prev - 1));
      } else {
        await loadPosts();
      }
    } catch {
      setError("Lỗi kết nối khi xóa bài viết");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-[#0F172A]">Quản trị Tin Tức</h1>
        <p className="mt-2 text-sm text-[#475569]">Tạo, cập nhật và quản lý bài viết theo từng tenant cây gia phả.</p>
      </section>

      {error && (
        <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</section>
      )}

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#0F172A]">Danh sách bài viết</h2>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-[#F8FAF8]"
            >
              <Plus className="h-4 w-4 text-[#16A34A]" />
              Bài viết mới
            </button>
          </div>

          <div className="mb-4 space-y-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Tìm theo tiêu đề, mô tả, chủ đề..."
                  className="w-full rounded-md border border-[#E2E8F0] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#16A34A]"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-[#16A34A] px-3 py-2 text-sm font-medium text-white hover:bg-[#15803D]"
              >
                Tìm
              </button>
              {searchKeyword && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="inline-flex items-center justify-center rounded-md border border-[#E2E8F0] px-3 py-2 text-sm text-[#334155] hover:bg-white"
                  title="Xóa tìm kiếm"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>

            <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm outline-none focus:border-[#16A34A]"
              >
                <option value="all">Tất cả chủ đề</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm outline-none focus:border-[#16A34A]"
              >
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={50}>50 / trang</option>
              </select>
            </div>

            <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as "publishedAt" | "title" | "comments");
                  setPage(1);
                }}
                className="rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm outline-none focus:border-[#16A34A]"
              >
                <option value="publishedAt">Sắp xếp: Ngày đăng</option>
                <option value="title">Sắp xếp: Tiêu đề</option>
                <option value="comments">Sắp xếp: Số bình luận</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as "asc" | "desc");
                  setPage(1);
                }}
                className="rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm outline-none focus:border-[#16A34A]"
              >
                <option value="desc">Giảm dần</option>
                <option value="asc">Tăng dần</option>
              </select>

              <div className="rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#475569]">
                Tổng: <span className="font-semibold text-[#0F172A]">{total}</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-4 text-sm text-[#475569]">
              <Loader2 className="h-4 w-4 animate-spin text-[#16A34A]" />
              Đang tải danh sách...
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-4 text-sm text-[#475569]">
              Không có bài viết phù hợp.
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => {
                const active = editingId === post.id;
                return (
                  <div
                    key={post.id}
                    className={[
                      "rounded-lg border p-4 transition",
                      active ? "border-[#16A34A] bg-[#F0FDF4]" : "border-[#E2E8F0] bg-[#F8FAF8]",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{post.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5 text-[#16A34A]" />
                            {formatDate(post.publishedAt)}
                          </span>
                          <span className="rounded bg-white px-2 py-0.5">{post.category}</span>
                          <span>{post.readTimeMinutes} phút</span>
                          <span>{post._count?.comments ?? 0} bình luận</span>
                          {post.featured && (
                            <span className="inline-flex items-center gap-1 rounded bg-[#DCFCE7] px-2 py-0.5 text-[#166534]">
                              <Star className="h-3 w-3" /> Nổi bật
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(post)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F1F5F9]"
                          title="Sửa bài"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(post)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 hover:bg-red-50"
                          title="Xóa bài"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
            <p className="text-xs text-[#64748B]">
              Trang <span className="font-semibold text-[#0F172A]">{page}</span> / {Math.max(1, totalPages)}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1 || loading}
                className="inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs text-[#334155] disabled:opacity-50"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Trước
              </button>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages || loading}
                className="inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs text-[#334155] disabled:opacity-50"
              >
                Sau <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0F172A]">{isEditing ? "Cập nhật bài viết" : "Tạo bài viết mới"}</h2>
          <form onSubmit={handleSave} className="mt-4 space-y-3">
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Tiêu đề"
              className="w-full rounded-md border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#16A34A]"
            />
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Mô tả ngắn"
              className="min-h-16 w-full rounded-md border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#16A34A]"
            />
            <textarea
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Nội dung bài viết (mỗi đoạn cách nhau 1 dòng trống)"
              className="min-h-36 w-full rounded-md border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#16A34A]"
            />
            <input
              value={form.imageUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="URL ảnh đại diện"
              className="w-full rounded-md border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#16A34A]"
            />
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-md border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#16A34A]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-[#64748B]">
                  Chọn chủ đề cố định cho tin tức gia phả để thống nhất dữ liệu.
                </p>
              </div>
              <div>
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={form.readTimeMinutes}
                  onChange={(e) => setForm((prev) => ({ ...prev, readTimeMinutes: Number(e.target.value) || 5 }))}
                  placeholder="Phút đọc (mặc định 5)"
                  className="w-full rounded-md border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#16A34A]"
                />
                <p className="mt-1 text-xs text-[#64748B]">
                  Đây là thời gian ước tính để đọc bài (ví dụ 5 = khoảng 5 phút).
                </p>
              </div>
            </div>
            <input
              value={form.authorName}
              onChange={(e) => setForm((prev) => ({ ...prev, authorName: e.target.value }))}
              placeholder="Tên tác giả hiển thị (tuỳ chọn)"
              className="w-full rounded-md border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#16A34A]"
            />
            <label className="inline-flex items-center gap-2 text-sm text-[#334155]">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                className="h-4 w-4"
              />
              Đặt là bài nổi bật
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-md bg-[#16A34A] px-4 py-2 text-sm font-medium text-white hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isEditing ? "Lưu thay đổi" : "Tạo bài viết"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-[#E2E8F0] px-4 py-2 text-sm text-[#334155] hover:bg-[#F8FAF8]"
                >
                  Hủy chỉnh sửa
                </button>
              )}
            </div>
          </form>
        </article>
      </section>

    </div>
  );
}
