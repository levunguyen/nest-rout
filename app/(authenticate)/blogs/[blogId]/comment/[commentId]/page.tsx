import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquareText } from "lucide-react";
import { getBlogById, getCommentById } from "../../../data";

interface CommentDetailsPageProps {
  params: Promise<{ blogId: string; commentId: string }>;
}

export default async function CommentDetailsPage({ params }: CommentDetailsPageProps) {
  const { blogId, commentId } = await params;
  const post = getBlogById(blogId);
  const comment = getCommentById(blogId, commentId);

  if (!post || !comment) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F8FAF8] px-4 py-8 text-[#0F172A] md:px-8">
      <div className="mx-auto max-w-3xl space-y-5">
        <Link
          href={`/blogs/${blogId}`}
          className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium hover:bg-[#F8FAF8]"
        >
          <ArrowLeft className="h-4 w-4 text-[#16A34A]" />
          Quay lại bài viết
        </Link>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#16A34A]">Bình luận chi tiết</p>
          <h1 className="mt-2 text-2xl font-bold">{post.title}</h1>

          <div className="mt-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                <MessageSquareText className="h-4 w-4 text-[#16A34A]" />
                {comment.author}
              </div>
              <p className="text-xs text-[#64748B]">{comment.date}</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#475569]">{comment.content}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
