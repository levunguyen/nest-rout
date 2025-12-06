export default async function CommentDetails({
    params,
}: {
    params: Promise<{ blogId: string; commentId: string }>;
}) {
    const { blogId, commentId } = await params
    return <h1> Blog details {blogId} comment {commentId}</h1>

}