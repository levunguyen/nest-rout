const notifications = [
  { id: 1, title: "Thêm thành viên mới", detail: "Nguyễn Văn A đã được thêm vào cây." },
  { id: 2, title: "Cập nhật hồ sơ", detail: "Thông tin thành viên vừa được chỉnh sửa." },
];

export default function NotificationsPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Thông báo</h1>
      <div className="space-y-3">
        {notifications.map((n) => (
          <article key={n.id} className="rounded-xl border bg-card p-4">
            <h2 className="font-semibold text-foreground">{n.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{n.detail}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
