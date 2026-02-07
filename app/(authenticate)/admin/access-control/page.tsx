"use client"

import { useState } from "react"

export default function AccessControl() {
    const [logs, setLogs] = useState([
        { id: 1, user: "Nguyễn Văn A", action: "Sửa Person (ID: 123)", time: "2025-01-20 10:30", field: "birthDate", oldValue: "1950-05-15", newValue: "1950-05-16" },
        { id: 2, user: "Trần Thị B", action: "Xóa Family (ID: 45)", time: "2025-01-20 09:15", field: "family", oldValue: "Nguyễn - Trần", newValue: "-" },
        { id: 3, user: "Lê Văn C", action: "Thêm Media", time: "2025-01-20 08:00", field: "photo", oldValue: "-", newValue: "photo_001.jpg" },
    ])

    const permissions = [
        { resource: "Person", viewer: true, editor: true, admin: true },
        { resource: "Family", viewer: true, editor: true, admin: true },
        { resource: "Event", viewer: true, editor: true, admin: true },
        { resource: "Media", viewer: false, editor: true, admin: true },
        { resource: "Source", viewer: true, editor: true, admin: true },
        { resource: "Citation", viewer: false, editor: true, admin: true },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Kiểm soát truy cập & Bảo mật dữ liệu</h1>
                <p className="text-muted-foreground">Quản lý quyền truy cập và theo dõi nhật ký thay đổi</p>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Cấu hình riêng tư người còn sống</h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 hover:bg-secondary rounded-lg cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-foreground">Ẩn ngày sinh của người còn sống</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 hover:bg-secondary rounded-lg cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-foreground">Ẩn địa chỉ của người còn sống</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 hover:bg-secondary rounded-lg cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-foreground">Ẩn quan hệ hôn nhân của người còn sống</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 hover:bg-secondary rounded-lg cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-foreground">Yêu cầu xác nhận đặc biệt trước khi xuất dữ liệu</span>
                    </label>
                </div>
                <button className="mt-4 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium">
                    Lưu cấu hình
                </button>
            </div>

            {/* Permissions Matrix */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Ma trận quyền hạn</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="px-4 py-2 text-left font-semibold text-foreground">Loại dữ liệu</th>
                                <th className="px-4 py-2 text-center font-semibold text-foreground">Chỉ xem</th>
                                <th className="px-4 py-2 text-center font-semibold text-foreground">Chỉnh sửa</th>
                                <th className="px-4 py-2 text-center font-semibold text-foreground">Quản trị</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((perm) => (
                                <tr key={perm.resource} className="border-b border-border hover:bg-secondary">
                                    <td className="px-4 py-3 font-medium text-foreground">{perm.resource}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${perm.viewer ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                            {perm.viewer ? "✓" : "✗"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${perm.editor ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                            {perm.editor ? "✓" : "✗"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${perm.admin ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                            {perm.admin ? "✓" : "✗"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Audit Log */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Nhật ký thay đổi (Audit Log)</h3>
                <div className="space-y-3">
                    {logs.map((log) => (
                        <div key={log.id} className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-semibold text-foreground">{log.user}</p>
                                    <p className="text-sm text-muted-foreground">{log.action}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">{log.time}</p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <p><strong>Trường:</strong> {log.field}</p>
                                <p><strong>Từ:</strong> {log.oldValue} → <strong>Thành:</strong> {log.newValue}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
