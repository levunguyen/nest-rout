"use client";

import { AlertTriangle, Database, HardDrive, ShieldCheck, Users } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Tổng người dùng", value: "24", icon: Users },
    { label: "Quản trị viên", value: "3", icon: ShieldCheck },
    { label: "Người dùng hoạt động", value: "18", icon: Users },
    { label: "Cây gia phả", value: "5", icon: Database },
  ];

  const recentActivities = [
    { user: "Nguyễn Văn A", action: "Sửa thông tin person", time: "10 phút trước" },
    { user: "Trần Thị B", action: "Tạo tài khoản mới", time: "1 giờ trước" },
    { user: "Lê Văn C", action: "Xóa media", time: "2 giờ trước" },
    { user: "Admin", action: "Backup dữ liệu", time: "3 giờ trước" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-[#0F172A]">Bảng điều khiển</h1>
        <p className="mt-2 text-sm text-[#475569]">Tổng quan hoạt động và sức khỏe hệ thống quản lý gia phả.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#64748B]">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-[#0F172A]">{stat.value}</p>
              </div>
              <span className="rounded-lg bg-[#DCFCE7] p-2 text-[#16A34A]">
                <stat.icon className="h-5 w-5" />
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0F172A]">Hoạt động gần đây</h3>
          <div className="mt-4 space-y-3">
            {recentActivities.map((activity) => (
              <div key={`${activity.user}-${activity.time}`} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                <p className="font-medium text-[#0F172A]">{activity.user}</p>
                <p className="text-sm text-[#475569]">{activity.action}</p>
                <p className="mt-1 text-xs text-[#64748B]">{activity.time}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0F172A]">Trạng thái hệ thống</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
              <span className="inline-flex items-center gap-2 text-sm text-[#334155]">
                <Database className="h-4 w-4 text-[#16A34A]" />
                Database
              </span>
              <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#166534]">Bình thường</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
              <span className="inline-flex items-center gap-2 text-sm text-[#334155]">
                <HardDrive className="h-4 w-4 text-[#16A34A]" />
                Storage
              </span>
              <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-medium text-[#92400E]">85% đầy</span>
            </div>
            <div className="rounded-lg border border-[#FDE68A] bg-[#FFFBEB] p-3">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-[#92400E]">
                <AlertTriangle className="h-4 w-4" />
                Cảnh báo dung lượng
              </p>
              <p className="mt-1 text-xs text-[#B45309]">Storage sắp đầy, nên xóa media cũ hoặc sao lưu ngoài hệ thống.</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
