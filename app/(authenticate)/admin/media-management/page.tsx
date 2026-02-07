"use client"

import { MdDelete, MdWarning } from "react-icons/md"

export default function MediaManagement() {
    const mediaFiles = [
        { id: 1, name: "photo_001.jpg", size: "2.5 MB", type: "Ảnh cá nhân", usedBy: "Nguyễn Văn A", uploadedDate: "2025-01-15" },
        { id: 2, name: "photo_002.jpg", size: "2.5 MB", type: "Ảnh cá nhân", usedBy: "Trần Thị B", uploadedDate: "2025-01-14", duplicate: true },
        { id: 3, name: "birth_cert_001.pdf", size: "1.8 MB", type: "Giấy khai sinh", usedBy: "Lê Văn C", uploadedDate: "2025-01-10" },
        { id: 4, name: "certificate.pdf", size: "1.8 MB", type: "Giấy khai sinh", usedBy: "Nguyễn Văn A", uploadedDate: "2025-01-09", duplicate: true },
        { id: 5, name: "wedding_photo.jpg", size: "3.2 MB", type: "Ảnh hôn lễ", usedBy: "Trần - Nguyễn", uploadedDate: "2025-01-05" },
    ]

    const storageStats = {
        used: 450,
        total: 500,
        percentUsed: 90,
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý media & tài liệu</h1>
                <p className="text-muted-foreground">Quản lý ảnh, tài liệu, và giới hạn dung lượng</p>
            </div>

            {/* Storage Usage */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Dung lượng lưu trữ</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-foreground font-medium">Sử dụng: {storageStats.used} GB / {storageStats.total} GB</span>
                        <span className={`font-bold ${storageStats.percentUsed > 80 ? "text-red-600" : "text-green-600"}`}>
                            {storageStats.percentUsed}%
                        </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-4">
                        <div
                            className={`h-4 rounded-full transition-all ${storageStats.percentUsed > 80 ? "bg-red-600" : "bg-green-600"}`}
                            style={{ width: `${storageStats.percentUsed}%` }}
                        />
                    </div>
                    {storageStats.percentUsed > 80 && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                            <MdWarning className="text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-800">Dung lượng sắp đầy! Hãy xóa các file không cần thiết hoặc nâng cấp gói lưu trữ.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Settings */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Cài đặt upload</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Giới hạn kích thước file (MB)</label>
                        <input type="number" defaultValue="50" className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Định dạng file được phép</label>
                        <input
                            type="text"
                            defaultValue="jpg, jpeg, png, pdf, doc, docx"
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                    <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium">
                        Lưu cài đặt
                    </button>
                </div>
            </div>

            {/* Duplicate Files */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">File trùng lặp</h3>
                <div className="space-y-2">
                    {mediaFiles
                        .filter((f) => f.duplicate)
                        .map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary transition-colors">
                                <div>
                                    <p className="font-semibold text-foreground">{file.name}</p>
                                    <p className="text-sm text-muted-foreground">{file.size} • {file.type}</p>
                                </div>
                                <button
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Xóa"
                                >
                                    <MdDelete size={18} />
                                </button>
                            </div>
                        ))}
                </div>
            </div>

            {/* All Media Files */}
            <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-secondary border-b border-border">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tên file</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Loại</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Kích thước</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Được sử dụng bởi</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ngày upload</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mediaFiles.map((file) => (
                            <tr key={file.id} className="border-b border-border hover:bg-secondary transition-colors">
                                <td className="px-6 py-4 font-medium text-foreground">
                                    {file.name}
                                    {file.duplicate && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Trùng</span>}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{file.type}</td>
                                <td className="px-6 py-4 text-muted-foreground">{file.size}</td>
                                <td className="px-6 py-4 text-muted-foreground">{file.usedBy}</td>
                                <td className="px-6 py-4 text-muted-foreground">{file.uploadedDate}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Xem"
                                    >
                                        👁
                                    </button>
                                    <button
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Xóa"
                                    >
                                        <MdDelete size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
