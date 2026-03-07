"use client"

import { useState } from "react"

export default function LogsMonitoring() {
    const [logs] = useState([
        { id: 1, type: "login", user: "Nguyễn Văn A", action: "Đăng nhập", time: "2025-01-20 10:30", status: "success", ip: "192.168.1.1" },
        { id: 2, type: "edit", user: "Trần Thị B", action: "Sửa Person (ID: 123)", time: "2025-01-20 10:15", status: "success", ip: "192.168.1.2" },
        { id: 3, type: "delete", user: "Lê Văn C", action: "Xóa Media", time: "2025-01-20 09:45", status: "success", ip: "192.168.1.3" },
        { id: 4, type: "error", user: "Admin", action: "Database query timeout", time: "2025-01-20 08:30", status: "error", ip: "192.168.0.1" },
        { id: 5, type: "login", user: "Trần Thị B", action: "Đăng nhập", time: "2025-01-20 08:00", status: "success", ip: "192.168.1.2" },
    ])

    const [filterType, setFilterType] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")

    const filteredLogs = logs.filter((log) => {
        if (filterType !== "all" && log.type !== filterType) return false
        if (filterStatus !== "all" && log.status !== filterStatus) return false
        return true
    })

    const getTypeColor = (type: string) => {
        switch (type) {
            case "login":
                return "bg-blue-100 text-blue-700"
            case "edit":
                return "bg-amber-100 text-amber-700"
            case "delete":
                return "bg-red-100 text-red-700"
            case "error":
                return "bg-red-100 text-red-700"
            default:
                return "bg-gray-100 text-gray-700"
        }
    }

    const getStatusColor = (status: string) => {
        return status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Nhật ký & Giám sát hệ thống</h1>
                <p className="text-muted-foreground">Theo dõi hoạt động, lỗi, và hiệu suất hệ thống</p>
            </div>

            {/* System Alerts */}
            <div className="space-y-3">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                    <span className="text-amber-600 text-2xl mt-1">⚠</span>
                    <div>
                        <p className="font-semibold text-amber-900">Cảnh báo: Database response slow</p>
                        <p className="text-sm text-amber-800">Đang xảy ra từ 10:30 AM hôm nay</p>
                    </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                    <span className="text-blue-600 text-2xl mt-1">ℹ</span>
                    <div>
                        <p className="font-semibold text-blue-900">Thông báo: Backup thành công</p>
                        <p className="text-sm text-blue-800">Sao lưu dữ liệu tự động lúc 02:00 AM thành công</p>
                    </div>
                </div>
            </div>

            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-border shadow-sm text-center">
                    <p className="text-muted-foreground text-sm mb-1">Login lần cuối 24h</p>
                    <p className="text-2xl font-bold text-foreground">18</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-border shadow-sm text-center">
                    <p className="text-muted-foreground text-sm mb-1">Lỗi hệ thống</p>
                    <p className="text-2xl font-bold text-red-600">2</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-border shadow-sm text-center">
                    <p className="text-muted-foreground text-sm mb-1">Thay đổi dữ liệu</p>
                    <p className="text-2xl font-bold text-amber-600">45</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-border shadow-sm text-center">
                    <p className="text-muted-foreground text-sm mb-1">Uptime hệ thống</p>
                    <p className="text-2xl font-bold text-green-600">99.9%</p>
                </div>
            </div>

            {/* Logs Filters */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Bộ lọc nhật ký</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Loại</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="all">Tất cả</option>
                            <option value="login">Đăng nhập</option>
                            <option value="edit">Chỉnh sửa</option>
                            <option value="delete">Xóa</option>
                            <option value="error">Lỗi</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Trạng thái</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="all">Tất cả</option>
                            <option value="success">Thành công</option>
                            <option value="error">Lỗi</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-secondary border-b border-border">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Thời gian</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Người dùng</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Hành động</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Loại</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log) => (
                            <tr key={log.id} className="border-b border-border hover:bg-secondary transition-colors">
                                <td className="px-6 py-4 text-muted-foreground text-sm">{log.time}</td>
                                <td className="px-6 py-4 font-medium text-foreground">{log.user}</td>
                                <td className="px-6 py-4 text-muted-foreground">{log.action}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                                        {log.type === "login" ? "Đăng nhập" : log.type === "edit" ? "Chỉnh sửa" : log.type === "delete" ? "Xóa" : "Lỗi"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                                        {log.status === "success" ? "Thành công" : "Lỗi"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground text-sm font-mono">{log.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredLogs.length === 0 && (
                    <div className="px-6 py-8 text-center text-muted-foreground">Không tìm thấy nhật ký nào</div>
                )}
            </div>

            {/* Export Logs */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Xuất nhật ký</h3>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium text-foreground">
                        Xuất CSV
                    </button>
                    <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium text-foreground">
                        Xuất PDF
                    </button>
                    <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium text-foreground">
                        Xuất JSON
                    </button>
                </div>
            </div>
        </div>
    )
}
