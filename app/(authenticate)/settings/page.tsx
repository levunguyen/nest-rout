export default function SettingsPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Cài đặt</h1>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="font-semibold text-foreground">Tài khoản</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cấu hình hồ sơ, thông tin đăng nhập và bảo mật tài khoản.
        </p>
      </section>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="font-semibold text-foreground">Thông báo</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tuỳ chỉnh loại thông báo bạn muốn nhận.
        </p>
      </section>
    </main>
  );
}
