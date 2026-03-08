"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, MessageCircle, Send, User2 } from "lucide-react";

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

type ApiNewsComment = {
  id: string;
  content: string;
  authorName?: string | null;
  createdAt: string;
  createdBy?: { fullName: string } | null;
};

const formatDate = (value: string) => new Date(value).toLocaleDateString("vi-VN");
const formatDateTime = (value: string) => new Date(value).toLocaleString("vi-VN");
const formatReadTime = (minutes: number) => `${minutes} phút đọc`;

export default function NewsDetailsPage() {
  const router = useRouter();
  const params = useParams<{ newsId: string }>();
  const newsId = params.newsId;

  const [post, setPost] = useState<ApiNewsPost | null>(null);
  const [comments, setComments] = useState<ApiNewsComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [authorInput, setAuthorInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayAuthor = useMemo(() => {
    if (!post) return "Gia Phả Việt Team";
    return post.authorName || post.createdBy?.fullName || "Gia Phả Việt Team";
  }, [post]);

  useEffect(() => {
    const load = async () => {
      if (!newsId) return;
      setIsLoading(true);
      setError(null);

      try {
        const [postRes, commentsRes] = await Promise.all([
          fetch(`/api/news/${newsId}`, { method: "GET" }),
          fetch(`/api/news/${newsId}/comments`, { method: "GET" }),
        ]);

        const postPayload = await postRes.json().catch(() => ({}));
        const commentsPayload = await commentsRes.json().catch(() => ({}));

        if (postRes.status === 401 || commentsRes.status === 401) {
          router.push("/login");
          return;
        }

        if (!postRes.ok) {
          setError(postPayload?.error || "Không thể tải bài viết");
          setPost(null);
          setComments([]);
          return;
        }

        if (!commentsRes.ok) {
          setError(commentsPayload?.error || "Không thể tải bình luận");
          setPost(postPayload.data as ApiNewsPost);
          setComments([]);
          return;
        }

        setPost(postPayload.data as ApiNewsPost);
        setComments((commentsPayload.data ?? []) as ApiNewsComment[]);
      } catch {
        setError("Lỗi kết nối khi tải bài viết");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [newsId, router]);

  const handleSubmitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsId || !commentInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/news/${newsId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentInput.trim(),
          authorName: authorInput.trim() || undefined,
        }),
      });
      const payload = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        setError(payload?.error || "Không thể gửi bình luận");
        return;
      }

      setComments((prev) => [...prev, payload.data as ApiNewsComment]);
      setCommentInput("");
      setAuthorInput("");
      setError(null);
    } catch {
      setError("Lỗi kết nối khi gửi bình luận");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAF8] px-4 py-8 text-[#0F172A] md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-[#F8FAF8]"
        >
          <ArrowLeft className="h-4 w-4 text-[#16A34A]" />
          Quay lại danh sách tin tức
        </Link>

        {isLoading ? (
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-sm text-[#475569]">Đang tải bài viết...</section>
        ) : error && !post ? (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-8 text-sm text-red-600">{error}</section>
        ) : post ? (
          <>
            <article className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
              <div className="relative h-72 md:h-96">
                <Image src={post.imageUrl || "/images/hero-memorial.jpg"} alt={post.title} fill className="object-cover" />
              </div>
              <div className="p-6 md:p-8">
                <span className="inline-flex rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#166534]">
                  {post.category}
                </span>
                <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">{post.title}</h1>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#64748B]">
                  <span className="inline-flex items-center gap-1">
                    <User2 className="h-3.5 w-3.5 text-[#16A34A]" />
                    {displayAuthor}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5 text-[#16A34A]" />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5 text-[#16A34A]" />
                    {formatReadTime(post.readTimeMinutes)}
                  </span>
                </div>

                <div className="mt-6 space-y-4 text-sm leading-7 text-[#334155]">
                  {(Array.isArray(post.content) ? post.content : []).map((paragraph, index) => (
                    <p key={`${post.id}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </article>

            <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-[#16A34A]" />
                <h2 className="text-lg font-semibold">Bình luận ({comments.length})</h2>
              </div>

              <form onSubmit={handleSubmitComment} className="mb-6 space-y-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-4">
                <input
                  type="text"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  placeholder="Tên hiển thị (tuỳ chọn)"
                  className="w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm outline-none focus:border-[#16A34A]"
                />
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Nhập bình luận của bạn..."
                  className="min-h-24 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm outline-none focus:border-[#16A34A]"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || commentInput.trim().length < 2}
                    className="inline-flex items-center gap-2 rounded-md bg-[#16A34A] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
                  </button>
                </div>
              </form>

              {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-sm text-[#64748B]">Chưa có bình luận nào cho bài viết này.</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[#0F172A]">
                          {comment.authorName || comment.createdBy?.fullName || "Thành viên dòng họ"}
                        </p>
                        <p className="text-xs text-[#64748B]">{formatDateTime(comment.createdAt)}</p>
                      </div>
                      <p className="mt-2 text-sm text-[#475569]">{comment.content}</p>
                      <Link
                        href={`/news/${newsId}/comment/${comment.id}`}
                        className="mt-3 inline-block text-xs font-semibold text-[#16A34A] hover:text-[#15803D]"
                      >
                        Xem chi tiết bình luận
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
