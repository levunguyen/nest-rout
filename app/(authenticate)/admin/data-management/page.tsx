"use client";

import { CheckCircle2, AlertTriangle, CircleX } from "lucide-react";

export default function DataManagement() {
  const records = [
    { id: 1, type: "Person", name: "Nguyễn Văn A", status: "valid", issues: [] },
    { id: 2, type: "Person", name: "Trần Thị B", status: "warning", issues: ["Ngày sinh > ngày mất"] },
    { id: 3, type: "Family", name: "Nguyễn - Trần", status: "error", issues: ["Quan hệ không hợp lệ", "Cha mẹ trùng nhau"] },
    { id: 4, type: "Event", name: "Hôn nhân 2020", status: "valid", issues: [] },
  ] as const;

  const deletedRecords = [
    { id: "deleted_1", type: "Person", name: "Lê Văn C", deletedDate: "2025-01-19", deletedBy: "Admin" },
    { id: "deleted_2", type: "Media", name: "photo_old.jpg", deletedDate: "2025-01-18", deletedBy: "Nguyễn Văn A" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-[#0F172A]">Quản lý dữ liệu phả hệ</h1>
        <p className="mt-2 text-sm text-[#475569]">Kiểm tra lỗi dữ liệu, chuẩn hóa và phục hồi bản ghi đã xóa.</p>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0F172A]">Kiểm tra chất lượng dữ liệu</h2>
          <button className="rounded-lg bg-[#16A34A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#15803D]">Quét lỗi dữ liệu</button>
        </div>
        <div className="space-y-2">
          {records.map((record) => (
            <article key={record.id} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  {record.status === "valid" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#16A34A]" />
                  ) : record.status === "warning" ? (
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-[#B45309]" />
                  ) : (
                    <CircleX className="mt-0.5 h-4 w-4 text-[#B91C1C]" />
                  )}
                  <div>
                    <p className="font-medium text-[#0F172A]">{record.type}: {record.name}</p>
                    {record.issues.length > 0 && (
                      <ul className="mt-1 text-xs text-[#B91C1C]">
                        {record.issues.map((issue) => (
                          <li key={issue}>- {issue}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    record.status === "valid"
                      ? "bg-[#DCFCE7] text-[#166534]"
                      : record.status === "warning"
                        ? "bg-[#FEF3C7] text-[#92400E]"
                        : "bg-[#FEE2E2] text-[#991B1B]"
                  }`}
                >
                  {record.status === "valid" ? "Hợp lệ" : record.status === "warning" ? "Cảnh báo" : "Lỗi"}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0F172A]">Gộp bản ghi trùng lặp</h2>
          <p className="mt-2 text-sm text-[#475569]">Tìm và gộp tự động các hồ sơ có khả năng trùng thông tin.</p>
          <button className="mt-4 rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-[#F8FAF8]">
            Tìm bản ghi trùng
          </button>
        </article>

        <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0F172A]">Chuẩn hóa dữ liệu</h2>
          <div className="mt-3 space-y-2">
            {["Chuẩn hóa tên địa danh", "Chuẩn hóa tên gọi", "Chuẩn hóa định dạng ngày"].map((task) => (
              <button
                key={task}
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] px-3 py-2 text-left text-sm text-[#334155] hover:bg-white"
              >
                {task}
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0F172A]">Phục hồi dữ liệu đã xóa</h2>
        <div className="mt-3 space-y-2">
          {deletedRecords.map((record) => (
            <div key={record.id} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
              <div>
                <p className="font-medium text-[#0F172A]">{record.type}: {record.name}</p>
                <p className="text-xs text-[#64748B]">
                  Xóa bởi {record.deletedBy} vào {record.deletedDate}
                </p>
              </div>
              <button className="rounded-lg bg-[#16A34A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#15803D]">Khôi phục</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
