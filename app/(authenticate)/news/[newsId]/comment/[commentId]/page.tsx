"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageSquareText } from "lucide-react";

type ApiNewsPost = {
  id: string;
  title: string;
};

type ApiNewsComment = {
  id: string;
  content: string;
  authorName?: string | null;
  createdAt: string;
  createdBy?: { fullName: string } | null;
};

const formatDateTime = (value: string) => new Date(value).toLocaleString("vi-VN");

export default function CommentDetailsPage() {
  const router = useRouter();
  const params = useParams<{ newsId: string; commentId: string }>();
  const newsId = params.newsId;
  const commentId = params.commentId;

  const [post, setPost] = useState<ApiNewsPost | null>(null);
  const [comment, setComment] = useState<ApiNewsComment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const commentAuthor = useMemo(() => {
    if (!comment) return "";
    return comment.authorName || comment.createdBy?.fullName || "Thành viên dòng họ";
  }, [comment]);

  useEffect(() => {
    const load = async () => {
      if (!newsId || !commentId) return;
      setIsLoading(true);
      setError(null);

      try {
        const [postRes, commentRes] = await Promise.all([
          fetch(`/api/news/${newsId}`, { method: "GET" }),
          fetch(`/api/news/${newsId}/comments/${commentId}`, { method: "GET" }),
        ]);

        const postPayload = await postRes.json().catch(() => ({}));
        const commentPayload = await commentRes.json().catch(() => ({}));

        if (postRes.status === 401 || commentRes.status === 401) {
          router.push("/login");
          return;
        }

        if (!postRes.ok || !commentRes.ok) {
          setError(postPayload?.error || commentPayload?.error || "Không thể tải dữ liệu bình luận");
          setPost(null);
          setComment(null);
          return;
        }

        setPost(postPayload.data as ApiNewsPost);
        setComment(commentPayload.data as ApiNewsComment);
      } catch {
        setError("Lỗi kết nối khi tải chi tiết bình luận");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [newsId, commentId, router]);

  return (
    <main className="min-h-screen bg-[#F8FAF8] px-4 py-8 text-[#0F172A] md:px-8">
      <div className="mx-auto max-w-3xl space-y-5">
        <Link
          href={`/news/${newsId}`}
          className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium hover:bg-[#F8FAF8]"
        >
          <ArrowLeft className="h-4 w-4 text-[#16A34A]" />
          Quay lại bài viết
        </Link>

        {isLoading ? (
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 text-sm text-[#475569]">Đang tải bình luận...</section>
        ) : error || !post || !comment ? (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            {error || "Không tìm thấy bình luận"}
          </section>
        ) : (
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#16A34A]">Bình luận chi tiết</p>
            <h1 className="mt-2 text-2xl font-bold">{post.title}</h1>

            <div className="mt-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                  <MessageSquareText className="h-4 w-4 text-[#16A34A]" />
                  {commentAuthor}
                </div>
                <p className="text-xs text-[#64748B]">{formatDateTime(comment.createdAt)}</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#475569]">{comment.content}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
