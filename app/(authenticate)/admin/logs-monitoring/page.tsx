"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Info } from "lucide-react";

const logs = [
  { id: 1, type: "login", user: "Nguyễn Văn A", action: "Đăng nhập", time: "2025-01-20 10:30", status: "success", ip: "192.168.1.1" },
  { id: 2, type: "edit", user: "Trần Thị B", action: "Sửa Person (ID: 123)", time: "2025-01-20 10:15", status: "success", ip: "192.168.1.2" },
  { id: 3, type: "delete", user: "Lê Văn C", action: "Xóa Media", time: "2025-01-20 09:45", status: "success", ip: "192.168.1.3" },
  { id: 4, type: "error", user: "Admin", action: "Database query timeout", time: "2025-01-20 08:30", status: "error", ip: "192.168.0.1" },
  { id: 5, type: "login", user: "Trần Thị B", action: "Đăng nhập", time: "2025-01-20 08:00", status: "success", ip: "192.168.1.2" },
];

export default function LogsMonitoring() {
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredLogs = useMemo(
    () =>
      logs.filter((log) => {
        if (filterType !== "all" && log.type !== filterType) return false;
        if (filterStatus !== "all" && log.status !== filterStatus) return false;
        return true;
      }),
    [filterStatus, filterType],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-[#0F172A]">Nhật ký & giám sát hệ thống</h1>
        <p className="mt-2 text-sm text-[#475569]">Theo dõi hoạt động quản trị, lỗi vận hành và các chỉ số ổn định hệ thống.</p>
      </section>

      <section className="space-y-3">
        <div className="flex items-start gap-2 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-[#B45309]" />
          <div>
            <p className="text-sm font-semibold text-[#92400E]">Cảnh báo: Database response slow</p>
            <p className="text-xs text-[#B45309]">Đang xảy ra từ 10:30 AM hôm nay</p>
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] p-3">
          <Info className="mt-0.5 h-4 w-4 text-[#1D4ED8]" />
          <div>
            <p className="text-sm font-semibold text-[#1D4ED8]">Thông báo: Backup thành công</p>
            <p className="text-xs text-[#2563EB]">Sao lưu dữ liệu tự động lúc 02:00 AM thành công</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Login 24h", value: "18" },
          { label: "Lỗi hệ thống", value: "2" },
          { label: "Thay đổi dữ liệu", value: "45" },
          { label: "Uptime", value: "99.9%" },
        ].map((stat) => (
          <article key={stat.label} className="rounded-xl border border-[#E2E8F0] bg-white p-4 text-center shadow-sm">
            <p className="text-xs text-[#64748B]">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-[#0F172A]">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0F172A]">Bộ lọc nhật ký</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm">
            <option value="all">Tất cả loại</option>
            <option value="login">Đăng nhập</option>
            <option value="edit">Chỉnh sửa</option>
            <option value="delete">Xóa</option>
            <option value="error">Lỗi</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm">
            <option value="all">Tất cả trạng thái</option>
            <option value="success">Thành công</option>
            <option value="error">Lỗi</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAF8]">
              <tr>
                {["Thời gian", "Người dùng", "Hành động", "Loại", "Trạng thái", "IP"].map((head) => (
                  <th key={head} className="px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-[#E2E8F0] last:border-b-0">
                  <td className="px-4 py-3 text-sm text-[#475569]">{log.time}</td>
                  <td className="px-4 py-3 font-medium text-[#0F172A]">{log.user}</td>
                  <td className="px-4 py-3 text-sm text-[#475569]">{log.action}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-xs font-medium text-[#1D4ED8]">{log.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${log.status === "success" ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEE2E2] text-[#991B1B]"}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-[#64748B]">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs.length === 0 ? <p className="p-4 text-sm text-[#64748B]">Không tìm thấy nhật ký phù hợp.</p> : null}
      </section>
    </div>
  );
}
