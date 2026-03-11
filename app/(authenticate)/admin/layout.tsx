"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MailPlus,
  Database,
  FolderArchive,
  LayoutDashboard,
  LockKeyhole,
  Logs,
  Newspaper,
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
  { label: "Mời thành viên", href: "/admin/invitations", icon: <MailPlus className="h-4 w-4" /> },
  { label: "Tin tức", href: "/admin/news", icon: <Newspaper className="h-4 w-4" /> },
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
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-5 md:px-6 md:py-6">
        <section className="sticky top-16 z-20 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white/95 shadow-sm backdrop-blur">
          <nav className="no-scrollbar flex items-center gap-2 overflow-x-auto p-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
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
        </section>

        <main>{children}</main>
      </div>
    </div>
  );
}
