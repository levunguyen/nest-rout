"use client";

import { Download, RotateCcw, Trash2, Upload } from "lucide-react";
import { useState } from "react";

export default function BackupRestore() {
  const [backups, setBackups] = useState([
    { id: 1, date: "2025-01-20", time: "02:00", size: "125 MB", type: "Tự động", format: "GEDCOM" },
    { id: 2, date: "2025-01-19", time: "02:00", size: "124 MB", type: "Tự động", format: "GEDCOM" },
    { id: 3, date: "2025-01-18", time: "14:30", size: "123 MB", type: "Thủ công", format: "CSV" },
  ]);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupSchedule, setBackupSchedule] = useState("daily");

  const handleManualBackup = () => {
    const newBackup = {
      id: backups.length + 1,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      size: "125 MB",
      type: "Thủ công",
      format: "GEDCOM",
    };
    setBackups((prev) => [newBackup, ...prev]);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-[#0F172A]">Sao lưu & phục hồi</h1>
        <p className="mt-2 text-sm text-[#475569]">Thiết lập backup định kỳ, tạo backup thủ công và phục hồi nhanh dữ liệu.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0F172A]">Cài đặt sao lưu tự động</h2>
          <label className="mt-3 flex items-center gap-2 text-sm text-[#334155]">
            <input type="checkbox" checked={autoBackupEnabled} onChange={(e) => setAutoBackupEnabled(e.target.checked)} />
            Bật sao lưu tự động
          </label>
          {autoBackupEnabled && (
            <select
              value={backupSchedule}
              onChange={(e) => setBackupSchedule(e.target.value)}
              className="mt-3 w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
            >
              <option value="daily">Hàng ngày (02:00)</option>
              <option value="weekly">Hàng tuần (Thứ 2 - 02:00)</option>
              <option value="monthly">Hàng tháng (ngày 1 - 02:00)</option>
            </select>
          )}
        </article>

        <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0F172A]">Sao lưu thủ công</h2>
          <button
            onClick={handleManualBackup}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15803D]"
          >
            <Download className="h-4 w-4" />
            Sao lưu ngay
          </button>
        </article>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="border-b border-[#E2E8F0] px-5 py-3">
          <h2 className="text-lg font-semibold text-[#0F172A]">Lịch sử sao lưu</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAF8]">
              <tr>
                {["Ngày tạo", "Loại", "Định dạng", "Kích thước", "Hành động"].map((head) => (
                  <th key={head} className="px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr key={backup.id} className="border-t border-[#E2E8F0]">
                  <td className="px-4 py-3 text-sm text-[#334155]">{backup.date} {backup.time}</td>
                  <td className="px-4 py-3 text-sm text-[#475569]">{backup.type}</td>
                  <td className="px-4 py-3 text-sm text-[#475569]">{backup.format}</td>
                  <td className="px-4 py-3 text-sm text-[#475569]">{backup.size}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg p-2 text-[#166534] hover:bg-[#DCFCE7]"><Download className="h-4 w-4" /></button>
                      <button className="rounded-lg p-2 text-[#1D4ED8] hover:bg-[#EFF6FF]"><RotateCcw className="h-4 w-4" /></button>
                      <button className="rounded-lg p-2 text-[#B91C1C] hover:bg-[#FEF2F2]"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0F172A]">Xuất dữ liệu</h2>
          <div className="mt-3 grid gap-2">
            {["GEDCOM", "CSV", "JSON"].map((format) => (
              <button key={format} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] px-3 py-2 text-left text-sm hover:bg-white">
                {format}
              </button>
            ))}
          </div>
        </article>
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0F172A]">Nhập dữ liệu</h2>
          <div className="mt-3 rounded-lg border-2 border-dashed border-[#CBD5E1] p-6 text-center">
            <p className="text-sm text-[#64748B]">Kéo thả file hoặc chọn từ máy tính</p>
            <button className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm">
              <Upload className="h-4 w-4 text-[#16A34A]" />
              Chọn file
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}
