"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Eye,
  ImageIcon,
  Loader2,
  Plus,
  RefreshCcw,
  Trash2,
  TriangleAlert,
  Video,
} from "lucide-react";

type MediaKind = "image" | "video";

interface MediaFile {
  id: string;
  name: string;
  kind: MediaKind;
  category: string;
  usedBy: string;
  uploadedDate: string;
  url: string;
  sizeMb: number;
  mimeType?: string | null;
  originalName?: string | null;
}

export default function MediaManagement() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    kind: "image" as MediaKind,
    name: "",
    category: "",
    usedBy: "",
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const fetchMedia = useCallback(async (showError = true) => {
    try {
      setError("");
      const response = await fetch("/api/media", { cache: "no-store" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (showError) {
          setError(result?.error ?? "Không thể tải danh sách media.");
        }
        return;
      }
      setMediaFiles(Array.isArray(result?.data) ? (result.data as MediaFile[]) : []);
    } catch {
      if (showError) {
        setError("Không thể tải danh sách media.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const duplicateNames = useMemo(() => {
    const nameCount = new Map<string, number>();
    mediaFiles.forEach((file) => {
      const key = file.name.trim().toLowerCase();
      nameCount.set(key, (nameCount.get(key) ?? 0) + 1);
    });
    return new Set(
      Array.from(nameCount.entries())
        .filter(([, count]) => count > 1)
        .map(([name]) => name),
    );
  }, [mediaFiles]);

  const storageStats = useMemo(() => {
    const used = mediaFiles.reduce((sum, file) => sum + file.sizeMb, 0);
    const total = 500;
    const percentUsed = Math.min((used / total) * 100, 100);
    return { used, total, percentUsed };
  }, [mediaFiles]);

  const duplicateFiles = useMemo(
    () => mediaFiles.filter((file) => duplicateNames.has(file.name.trim().toLowerCase())),
    [duplicateNames, mediaFiles],
  );

  const handleCreate = async () => {
    setError("");
    setSuccess("");

    const name = form.name.trim();
    const category = form.category.trim();
    const usedBy = form.usedBy.trim();

    if (!name || !category || !usedBy || !uploadFile) {
      setError("Vui lòng nhập đầy đủ thông tin và chọn file upload.");
      return;
    }

    const ext = name.split(".").pop()?.toLowerCase();
    if (form.kind === "image" && !["jpg", "jpeg", "png", "webp"].includes(ext ?? "")) {
      setError("Tên file ảnh cần có đuôi jpg, jpeg, png hoặc webp.");
      return;
    }
    if (form.kind === "video" && !["mp4", "mov", "webm"].includes(ext ?? "")) {
      setError("Tên file video cần có đuôi mp4, mov hoặc webm.");
      return;
    }

    try {
      setIsUploading(true);

      const uploadPayload = new FormData();
      uploadPayload.set("file", uploadFile);
      const uploadResponse = await fetch("/api/media/upload", {
        method: "POST",
        body: uploadPayload,
      });
      const uploadResult = await uploadResponse.json().catch(() => ({}));
      if (!uploadResponse.ok) {
        setError(uploadResult?.error ?? "Upload file thất bại.");
        return;
      }

      const createResponse = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          kind: form.kind,
          category,
          usedBy,
          url: uploadResult?.data?.url,
          sizeMb: Number(uploadResult?.data?.sizeMb ?? 0),
          mimeType: uploadResult?.data?.mimeType,
          originalName: uploadResult?.data?.originalName,
        }),
      });
      const createResult = await createResponse.json().catch(() => ({}));
      if (!createResponse.ok) {
        setError(createResult?.error ?? "Lưu metadata media thất bại.");
        return;
      }

      const created = createResult?.data as MediaFile | undefined;
      if (created) {
        setMediaFiles((prev) => [created, ...prev]);
      }

      setForm({ kind: "image", name: "", category: "", usedBy: "" });
      setUploadFile(null);
      setSuccess("Đã upload và thêm media mới thành công.");
    } catch {
      setError("Upload file thất bại.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError("");
    setSuccess("");
    try {
      setDeletingId(id);
      const response = await fetch(`/api/media/${id}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result?.error ?? "Xóa media thất bại.");
        return;
      }

      setMediaFiles((prev) => prev.filter((file) => file.id !== id));
      if (selectedFile?.id === id) {
        setSelectedFile(null);
      }
      setSuccess("Đã xóa media thành công.");
    } catch {
      setError("Xóa media thất bại.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">Quản lý media & tài liệu</h1>
            <p className="mt-2 text-sm text-[#475569]">
              Quản trị kho ảnh/video của dòng họ, thêm tư liệu mới và kiểm soát file trùng lặp.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              fetchMedia();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#F8FAFC]"
          >
            <RefreshCcw className="h-4 w-4" />
            Làm mới
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0F172A]">Thêm ảnh / video mới</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <select
              value={form.kind}
              onChange={(event) => setForm((prev) => ({ ...prev, kind: event.target.value as MediaKind }))}
              className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
            >
              <option value="image">Ảnh</option>
              <option value="video">Video</option>
            </select>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Tên file (vd: gioto-2026.jpg)"
              className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
            />
            <input
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              placeholder="Chủ đề (Giỗ tổ, Tưởng niệm...)"
              className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
            />
            <input
              value={form.usedBy}
              onChange={(event) => setForm((prev) => ({ ...prev, usedBy: event.target.value }))}
              placeholder="Được sử dụng bởi"
              className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
            />
            <input
              type="file"
              accept={form.kind === "image" ? ".jpg,.jpeg,.png,.webp,image/*" : ".mp4,.mov,.webm,video/*"}
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null;
                setUploadFile(nextFile);
                if (nextFile) {
                  setForm((prev) => ({
                    ...prev,
                    name: prev.name.trim().length > 0 ? prev.name : nextFile.name,
                  }));
                }
              }}
              className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
            />
            <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAF8] px-3 py-2 text-xs text-[#64748B]">
              {uploadFile ? `Đã chọn: ${uploadFile.name}` : "Chưa chọn file upload"}
            </div>
          </div>

          {(error || success) && (
            <div
              className={`mt-3 rounded-lg border px-3 py-2 text-sm ${
                error
                  ? "border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]"
                  : "border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]"
              }`}
            >
              {error || success}
            </div>
          )}

          <button
            type="button"
            onClick={handleCreate}
            disabled={isUploading}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {isUploading ? "Đang upload..." : "Thêm media"}
          </button>
        </article>

        <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A]">Dung lượng lưu trữ</h2>
            <span
              className={`text-sm font-semibold ${storageStats.percentUsed > 80 ? "text-[#B91C1C]" : "text-[#166534]"}`}
            >
              {storageStats.used.toFixed(1)} / {storageStats.total} MB
            </span>
          </div>
          <div className="mt-3 h-3 w-full rounded-full bg-[#E2E8F0]">
            <div
              className={`h-3 rounded-full ${storageStats.percentUsed > 80 ? "bg-[#EF4444]" : "bg-[#16A34A]"}`}
              style={{ width: `${storageStats.percentUsed}%` }}
            />
          </div>
          {storageStats.percentUsed > 80 && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] p-3">
              <TriangleAlert className="mt-0.5 h-4 w-4 text-[#B91C1C]" />
              <p className="text-sm text-[#991B1B]">
                Dung lượng sắp đầy. Hãy dọn dẹp file trùng hoặc sao lưu dữ liệu cũ.
              </p>
            </div>
          )}

          <div className="mt-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3 text-sm text-[#475569]">
            Tổng media: <strong className="text-[#0F172A]">{mediaFiles.length}</strong> file
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0F172A]">File trùng lặp theo tên</h2>
        <div className="mt-3 space-y-2">
          {duplicateFiles.length === 0 ? (
            <p className="text-sm text-[#64748B]">Không phát hiện file trùng tên.</p>
          ) : (
            duplicateFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-[#0F172A]">{file.name}</p>
                  <p className="text-xs text-[#64748B]">
                    {file.sizeMb.toFixed(1)} MB • {file.category}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(file.id)}
                  disabled={deletingId === file.id}
                  className="rounded-lg p-2 text-[#B91C1C] hover:bg-[#FEF2F2] disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAF8]">
              <tr>
                {["Tên file", "Loại", "Kích thước", "Được sử dụng bởi", "Ngày upload", "Hành động"].map((head) => (
                  <th key={head} className="px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#64748B]">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải dữ liệu...
                    </span>
                  </td>
                </tr>
              ) : mediaFiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#64748B]">
                    Chưa có media nào trong tenant này.
                  </td>
                </tr>
              ) : (
                mediaFiles.map((file) => {
                  const duplicated = duplicateNames.has(file.name.trim().toLowerCase());
                  return (
                    <tr key={file.id} className="border-b border-[#E2E8F0] last:border-b-0">
                      <td className="px-4 py-3 font-medium text-[#0F172A]">
                        <span className="inline-flex items-center gap-2">
                          {file.kind === "image" ? (
                            <ImageIcon className="h-4 w-4 text-[#16A34A]" />
                          ) : (
                            <Video className="h-4 w-4 text-[#0EA5E9]" />
                          )}
                          {file.name}
                        </span>
                        {duplicated ? (
                          <span className="ml-2 rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[10px] text-[#92400E]">
                            Trùng
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#475569]">{file.category}</td>
                      <td className="px-4 py-3 text-sm text-[#475569]">{file.sizeMb.toFixed(1)} MB</td>
                      <td className="px-4 py-3 text-sm text-[#475569]">{file.usedBy}</td>
                      <td className="px-4 py-3 text-sm text-[#475569]">{file.uploadedDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedFile(file)}
                            className="rounded-lg p-2 text-[#166534] hover:bg-[#DCFCE7]"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(file.id)}
                            disabled={deletingId === file.id}
                            className="rounded-lg p-2 text-[#B91C1C] hover:bg-[#FEF2F2] disabled:opacity-60"
                          >
                            {deletingId === file.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3">
              <h3 className="font-semibold text-[#0F172A]">{selectedFile.name}</h3>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="rounded-lg border border-[#E2E8F0] px-2 py-1 text-xs hover:bg-[#F8FAF8]"
              >
                Đóng
              </button>
            </div>
            <div className="h-[420px] bg-black">
              {selectedFile.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedFile.url} alt={selectedFile.name} className="h-full w-full object-contain" />
              ) : (
                <video src={selectedFile.url} controls className="h-full w-full object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
