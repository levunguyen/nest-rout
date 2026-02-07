"use client"

export default function AdminDashboard() {
    const stats = [
        { label: "Tổng người dùng", value: "24", color: "bg-blue-100 text-blue-700" },
        { label: "Quản trị viên", value: "3", color: "bg-red-100 text-red-700" },
        { label: "Người dùng hoạt động", value: "18", color: "bg-green-100 text-green-700" },
        { label: "Cây gia phả", value: "5", color: "bg-amber-100 text-amber-700" },
    ]

    const recentActivities = [
        { user: "Nguyễn Văn A", action: "Sửa thông tin person", time: "10 phút trước", type: "edit" },
        { user: "Trần Thị B", action: "Tạo tài khoản mới", time: "1 giờ trước", type: "create" },
        { user: "Lê Văn C", action: "Xóa media", time: "2 giờ trước", type: "delete" },
        { user: "Admin", action: "Backup dữ liệu", time: "3 giờ trước", type: "backup" },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Bảng điều khiển</h1>
                <p className="text-muted-foreground">Xem tổng quan về hệ thống quản lý gia phả</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-lg p-6 border border-border shadow-sm">
                        <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                        <p className={`text-4xl font-bold ${stat.color} rounded-lg p-2 text-center`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Hoạt động gần đây</h3>
                <div className="space-y-3">
                    {recentActivities.map((activity, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 hover:bg-secondary rounded-lg transition-colors">
                            <div>
                                <p className="font-semibold text-foreground">{activity.user}</p>
                                <p className="text-sm text-muted-foreground">{activity.action}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-4">Trạng thái hệ thống</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Database</span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Bình thường</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Storage</span>
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">85% đầy</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Backup</span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Hôm nay 02:00</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-4">Cảnh báo</h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-800">Storage sắp đầy - Hãy xóa hoặc sao lưu dữ liệu cũ</p>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">Cập nhật hệ thống có sẵn - Hãy kiểm tra thêm chi tiết</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
