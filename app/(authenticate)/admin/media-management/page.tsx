"use client";

import { Eye, Trash2, TriangleAlert } from "lucide-react";

export default function MediaManagement() {
  const mediaFiles = [
    { id: 1, name: "photo_001.jpg", size: "2.5 MB", type: "Ảnh cá nhân", usedBy: "Nguyễn Văn A", uploadedDate: "2025-01-15" },
    { id: 2, name: "photo_002.jpg", size: "2.5 MB", type: "Ảnh cá nhân", usedBy: "Trần Thị B", uploadedDate: "2025-01-14", duplicate: true },
    { id: 3, name: "birth_cert_001.pdf", size: "1.8 MB", type: "Giấy khai sinh", usedBy: "Lê Văn C", uploadedDate: "2025-01-10" },
    { id: 4, name: "certificate.pdf", size: "1.8 MB", type: "Giấy khai sinh", usedBy: "Nguyễn Văn A", uploadedDate: "2025-01-09", duplicate: true },
    { id: 5, name: "wedding_photo.jpg", size: "3.2 MB", type: "Ảnh hôn lễ", usedBy: "Trần - Nguyễn", uploadedDate: "2025-01-05" },
  ];

  const storageStats = { used: 450, total: 500, percentUsed: 90 };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-[#0F172A]">Quản lý media & tài liệu</h1>
        <p className="mt-2 text-sm text-[#475569]">Kiểm soát dung lượng, file trùng lặp và chất lượng kho dữ liệu media.</p>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0F172A]">Dung lượng lưu trữ</h2>
          <span className={`text-sm font-semibold ${storageStats.percentUsed > 80 ? "text-[#B91C1C]" : "text-[#166534]"}`}>
            {storageStats.used} / {storageStats.total} GB
          </span>
        </div>
        <div className="mt-3 h-3 w-full rounded-full bg-[#E2E8F0]">
          <div className={`h-3 rounded-full ${storageStats.percentUsed > 80 ? "bg-[#EF4444]" : "bg-[#16A34A]"}`} style={{ width: `${storageStats.percentUsed}%` }} />
        </div>
        {storageStats.percentUsed > 80 && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] p-3">
            <TriangleAlert className="mt-0.5 h-4 w-4 text-[#B91C1C]" />
            <p className="text-sm text-[#991B1B]">Dung lượng sắp đầy. Hãy dọn dẹp file trùng hoặc sao lưu dữ liệu cũ.</p>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0F172A]">Cài đặt upload</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input type="number" defaultValue="50" className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm" />
          <input type="text" defaultValue="jpg, jpeg, png, pdf, doc, docx" className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm" />
        </div>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0F172A]">File trùng lặp</h2>
        <div className="mt-3 space-y-2">
          {mediaFiles
            .filter((f) => f.duplicate)
            .map((file) => (
              <div key={file.id} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                <div>
                  <p className="font-medium text-[#0F172A]">{file.name}</p>
                  <p className="text-xs text-[#64748B]">{file.size} • {file.type}</p>
                </div>
                <button className="rounded-lg p-2 text-[#B91C1C] hover:bg-[#FEF2F2]">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAF8]">
              <tr>
                {["Tên file", "Loại", "Kích thước", "Được sử dụng bởi", "Ngày upload", "Hành động"].map((head) => (
                  <th key={head} className="px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mediaFiles.map((file) => (
                <tr key={file.id} className="border-b border-[#E2E8F0] last:border-b-0">
                  <td className="px-4 py-3 font-medium text-[#0F172A]">
                    {file.name}
                    {file.duplicate ? <span className="ml-2 rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[10px] text-[#92400E]">Trùng</span> : null}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#475569]">{file.type}</td>
                  <td className="px-4 py-3 text-sm text-[#475569]">{file.size}</td>
                  <td className="px-4 py-3 text-sm text-[#475569]">{file.usedBy}</td>
                  <td className="px-4 py-3 text-sm text-[#475569]">{file.uploadedDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg p-2 text-[#166534] hover:bg-[#DCFCE7]"><Eye className="h-4 w-4" /></button>
                      <button className="rounded-lg p-2 text-[#B91C1C] hover:bg-[#FEF2F2]"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
