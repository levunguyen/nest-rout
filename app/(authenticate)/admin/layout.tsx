"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ActivitySquare,
  Database,
  FolderArchive,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Logs,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Bảng điều khiển", href: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Người dùng", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
  { label: "Kiểm soát truy cập", href: "/admin/access-control", icon: <LockKeyhole className="h-4 w-4" /> },
  { label: "Dữ liệu", href: "/admin/data-management", icon: <Database className="h-4 w-4" /> },
  { label: "Media", href: "/admin/media-management", icon: <FolderArchive className="h-4 w-4" /> },
  { label: "Sao lưu", href: "/admin/backup-restore", icon: <ShieldCheck className="h-4 w-4" /> },
  { label: "Cấu hình", href: "/admin/system-config", icon: <Settings className="h-4 w-4" /> },
  { label: "Nhật ký", href: "/admin/logs-monitoring", icon: <Logs className="h-4 w-4" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="mx-auto grid max-w-[1600px] gap-0 lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-0 hidden h-screen border-r border-[#E2E8F0] bg-white lg:block">
          <div className="flex h-full flex-col p-4">
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-xs font-medium text-[#166534]">
                <ActivitySquare className="h-3.5 w-3.5" />
                Admin workspace
              </div>
              <h1 className="mt-3 text-xl font-bold text-[#0F172A]">Quản trị hệ thống</h1>
              <p className="mt-1 text-xs text-[#64748B]">Family Heritage Platform</p>
            </div>

            <nav className="mt-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-[#DCFCE7] text-[#166534]"
                        : "text-[#334155] hover:bg-[#F8FAF8] hover:text-[#0F172A]",
                    ].join(" ")}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-[#F8FAF8]"
            >
              <LogOut className="h-4 w-4 text-[#16A34A]" />
              Đăng xuất
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white/95 px-4 py-4 backdrop-blur md:px-6">
            <h2 className="text-lg font-semibold text-[#0F172A]">Admin Center</h2>
          </header>
          <main className="px-4 py-5 md:px-6 md:py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
