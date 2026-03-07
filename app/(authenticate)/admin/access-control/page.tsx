"use client";

import { ShieldCheck } from "lucide-react";

export default function AccessControl() {
  const logs = [
    { id: 1, user: "Nguyễn Văn A", action: "Sửa Person (ID: 123)", time: "2025-01-20 10:30", field: "birthDate", oldValue: "1950-05-15", newValue: "1950-05-16" },
    { id: 2, user: "Trần Thị B", action: "Xóa Family (ID: 45)", time: "2025-01-20 09:15", field: "family", oldValue: "Nguyễn - Trần", newValue: "-" },
    { id: 3, user: "Lê Văn C", action: "Thêm Media", time: "2025-01-20 08:00", field: "photo", oldValue: "-", newValue: "photo_001.jpg" },
  ];

  const permissions = [
    { resource: "Person", viewer: true, editor: true, admin: true },
    { resource: "Family", viewer: true, editor: true, admin: true },
    { resource: "Event", viewer: true, editor: true, admin: true },
    { resource: "Media", viewer: false, editor: true, admin: true },
    { resource: "Source", viewer: true, editor: true, admin: true },
    { resource: "Citation", viewer: false, editor: true, admin: true },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-[#0F172A]">Kiểm soát truy cập</h1>
        <p className="mt-2 text-sm text-[#475569]">Quản lý quyền hạn theo vai trò và giám sát thay đổi dữ liệu nhạy cảm.</p>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0F172A]">Cấu hình riêng tư người còn sống</h2>
        <div className="mt-3 space-y-2">
          {[
            "Ẩn ngày sinh của người còn sống",
            "Ẩn địa chỉ của người còn sống",
            "Ẩn quan hệ hôn nhân của người còn sống",
            "Yêu cầu xác nhận trước khi xuất dữ liệu",
          ].map((item, idx) => (
            <label key={item} className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3 text-sm text-[#334155]">
              <input type="checkbox" defaultChecked={idx < 3} className="h-4 w-4" />
              {item}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0F172A]">Ma trận quyền hạn</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAF8]">
                <th className="px-3 py-2 text-left">Loại dữ liệu</th>
                <th className="px-3 py-2 text-center">Chỉ xem</th>
                <th className="px-3 py-2 text-center">Chỉnh sửa</th>
                <th className="px-3 py-2 text-center">Quản trị</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm) => (
                <tr key={perm.resource} className="border-b border-[#E2E8F0] last:border-b-0">
                  <td className="px-3 py-2 font-medium text-[#0F172A]">{perm.resource}</td>
                  {[perm.viewer, perm.editor, perm.admin].map((enabled, idx) => (
                    <td key={idx} className="px-3 py-2 text-center">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${enabled ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#E2E8F0] text-[#475569]"}`}>
                        {enabled ? "Cho phép" : "Chặn"}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-[#0F172A]">
          <ShieldCheck className="h-5 w-5 text-[#16A34A]" />
          Nhật ký thay đổi
        </h2>
        <div className="mt-4 space-y-3">
          {logs.map((log) => (
            <article key={log.id} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-[#0F172A]">{log.user}</p>
                  <p className="text-sm text-[#475569]">{log.action}</p>
                </div>
                <p className="text-xs text-[#64748B]">{log.time}</p>
              </div>
              <p className="mt-2 text-xs text-[#475569]">
                Trường <strong>{log.field}</strong>: <strong>{log.oldValue}</strong> {"->"} <strong>{log.newValue}</strong>
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
