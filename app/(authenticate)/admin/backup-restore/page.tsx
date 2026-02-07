"use client"

import { useState } from "react"
import { MdDownload, MdUpload, MdDelete } from "react-icons/md"

export default function BackupRestore() {
    const [backups, setBackups] = useState([
        { id: 1, date: "2025-01-20", time: "02:00", size: "125 MB", type: "Tự động", format: "GEDCOM" },
        { id: 2, date: "2025-01-19", time: "02:00", size: "124 MB", type: "Tự động", format: "GEDCOM" },
        { id: 3, date: "2025-01-18", time: "14:30", size: "123 MB", type: "Thủ công", format: "CSV" },
    ])

    const [autoBackupEnabled, setAutoBackupEnabled] = useState(true)
    const [backupSchedule, setBackupSchedule] = useState("daily")

    const handleManualBackup = () => {
        alert("Bắt đầu sao lưu dữ liệu...")
        const newBackup = {
            id: backups.length + 1,
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            size: "125 MB",
            type: "Thủ công",
            format: "GEDCOM",
        }
        setBackups([newBackup, ...backups])
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Sao lưu & Phục hồi dữ liệu</h1>
                <p className="text-muted-foreground">Quản lý backup, restore, và xuất dữ liệu</p>
            </div>

            {/* Auto Backup Settings */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Cài đặt sao lưu tự động</h3>
                <div className="space-y-4">
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={autoBackupEnabled}
                            onChange={(e) => setAutoBackupEnabled(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <span className="text-foreground font-medium">Bật sao lưu tự động</span>
                    </label>

                    {autoBackupEnabled && (
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Tần suất sao lưu</label>
                            <select
                                value={backupSchedule}
                                onChange={(e) => setBackupSchedule(e.target.value)}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                                <option value="daily">Hàng ngày (02:00 AM)</option>
                                <option value="weekly">Hàng tuần (Thứ 2 02:00 AM)</option>
                                <option value="monthly">Hàng tháng (1/tháng 02:00 AM)</option>
                            </select>
                        </div>
                    )}

                    <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium">
                        Lưu cài đặt
                    </button>
                </div>
            </div>

            {/* Manual Backup */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Sao lưu thủ công</h3>
                <button
                    onClick={handleManualBackup}
                    className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
                >
                    <MdDownload /> Sao lưu ngay bây giờ
                </button>
            </div>

            {/* Backup History */}
            <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <h3 className="text-xl font-bold text-foreground p-6 border-b border-border">Lịch sử sao lưu</h3>
                <table className="w-full">
                    <thead className="bg-secondary border-b border-border">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ngày tạo</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Loại</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Định dạng</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Kích thước</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {backups.map((backup) => (
                            <tr key={backup.id} className="border-b border-border hover:bg-secondary transition-colors">
                                <td className="px-6 py-4 font-medium text-foreground">
                                    {backup.date} {backup.time}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{backup.type}</td>
                                <td className="px-6 py-4 text-muted-foreground">{backup.format}</td>
                                <td className="px-6 py-4 text-muted-foreground">{backup.size}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Tải xuống">
                                        <MdDownload size={18} />
                                    </button>
                                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Phục hồi">
                                        <MdUpload size={18} />
                                    </button>
                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                                        <MdDelete size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Xuất dữ liệu</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors text-left">
                        <p className="font-semibold text-foreground mb-1">GEDCOM</p>
                        <p className="text-sm text-muted-foreground">Định dạng chuẩn cho phần mềm gia phả</p>
                    </button>
                    <button className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors text-left">
                        <p className="font-semibold text-foreground mb-1">CSV</p>
                        <p className="text-sm text-muted-foreground">Bảng tính có thể mở trong Excel</p>
                    </button>
                    <button className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors text-left">
                        <p className="font-semibold text-foreground mb-1">JSON</p>
                        <p className="text-sm text-muted-foreground">Định dạng dữ liệu có cấu trúc</p>
                    </button>
                </div>
            </div>

            {/* Import Data */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Nhập dữ liệu</h3>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <p className="text-muted-foreground mb-3">Kéo và thả file hoặc nhấp để chọn</p>
                    <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium text-foreground">
                        Chọn file
                    </button>
                    <p className="text-xs text-muted-foreground mt-3">Hỗ trợ GEDCOM, CSV, JSON</p>
                </div>
            </div>
        </div>
    )
}
