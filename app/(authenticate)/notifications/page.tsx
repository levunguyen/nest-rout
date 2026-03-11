"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type NotificationItem = {
  id: string;
  type: "MEMBER_ADDED";
  title: string;
  description: string;
  createdAt: string;
};

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/notifications", { cache: "no-store" });
        const payload = await response.json().catch(() => ({}));
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        if (!response.ok) {
          setError(payload?.error ?? "Không thể tải thông báo.");
          setItems([]);
          return;
        }
        setItems(Array.isArray(payload?.data) ? payload.data : []);
      } catch {
        setError("Không thể tải thông báo.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Thông báo</h1>
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}
      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Đang tải thông báo...</p>
        ) : items.length ? (
          items.map((n) => (
            <article key={n.id} className="rounded-xl border bg-card p-4">
              <h2 className="font-semibold text-foreground">{n.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{n.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(n.createdAt).toLocaleString("vi-VN")}
              </p>
            </article>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Chưa có thông báo mới.</p>
        )}
      </div>
    </main>
  );
}
