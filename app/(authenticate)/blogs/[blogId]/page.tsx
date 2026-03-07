import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, MessageCircle, User2 } from "lucide-react";
import { getBlogById, getCommentsByBlogId } from "../data";

interface BlogDetailsPageProps {
  params: Promise<{ blogId: string }>;
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { blogId } = await params;
  const post = getBlogById(blogId);

  if (!post) {
    notFound();
  }

  const comments = getCommentsByBlogId(blogId);

  return (
    <main className="min-h-screen bg-[#F8FAF8] px-4 py-8 text-[#0F172A] md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-[#F8FAF8]"
        >
          <ArrowLeft className="h-4 w-4 text-[#16A34A]" />
          Quay lại danh sách blog
        </Link>

        <article className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="relative h-72 md:h-96">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>
          <div className="p-6 md:p-8">
            <span className="inline-flex rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#166534]">
              {post.category}
            </span>
            <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">{post.title}</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#64748B]">
              <span className="inline-flex items-center gap-1">
                <User2 className="h-3.5 w-3.5 text-[#16A34A]" />
                {post.author}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5 text-[#16A34A]" />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5 text-[#16A34A]" />
                {post.readTime}
              </span>
            </div>

            <div className="mt-6 space-y-4 text-sm leading-7 text-[#334155]">
              {post.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-[#16A34A]" />
            <h2 className="text-lg font-semibold">Bình luận</h2>
          </div>
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm text-[#64748B]">Chưa có bình luận nào cho bài viết này.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#0F172A]">{comment.author}</p>
                    <p className="text-xs text-[#64748B]">{comment.date}</p>
                  </div>
                  <p className="mt-2 text-sm text-[#475569]">{comment.content}</p>
                  <Link
                    href={`/blogs/${blogId}/comment/${comment.id}`}
                    className="mt-3 inline-block text-xs font-semibold text-[#16A34A] hover:text-[#15803D]"
                  >
                    Xem chi tiết bình luận
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
