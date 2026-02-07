"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MdDashboard, MdPeople, MdSecurity, MdDataUsage, MdPermMedia, MdBackup, MdSettings, MdHistory } from "react-icons/md"

interface NavItem {
    label: string
    href: string
    icon: React.ReactNode
}

const navItems: NavItem[] = [
    { label: "Bảng điều khiển", href: "/admin/dashboard", icon: <MdDashboard /> },
    { label: "Quản lý người dùng", href: "/admin/users", icon: <MdPeople /> },
    { label: "Kiểm soát truy cập", href: "/admin/access-control", icon: <MdSecurity /> },
    { label: "Quản lý dữ liệu", href: "/admin/data-management", icon: <MdDataUsage /> },
    { label: "Quản lý media", href: "/admin/media-management", icon: <MdPermMedia /> },
    { label: "Sao lưu & Phục hồi", href: "/admin/backup-restore", icon: <MdBackup /> },
    { label: "Cấu hình hệ thống", href: "/admin/system-config", icon: <MdSettings /> },
    { label: "Nhật ký & Giám sát", href: "/admin/logs-monitoring", icon: <MdHistory /> },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-border shadow-lg overflow-y-auto">
                <div className="p-6 border-b border-border">
                    <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
                </div>

                <nav className="space-y-1 p-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === item.href
                                    ? "bg-accent text-accent-foreground font-semibold"
                                    : "text-foreground hover:bg-secondary"
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white border-b border-border p-6 shadow-sm">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-foreground">Quản trị hệ thống</h2>
                        <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium">
                            Đăng xuất
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto">
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
