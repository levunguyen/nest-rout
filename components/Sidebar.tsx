"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    FaHome,
    FaSitemap,
    FaMap,
    FaBlog,
    FaSearch,
    FaUsers,
    FaUserFriends,
    FaCalendarAlt,
    FaMoneyBill,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.localStorage.getItem("sidebar-collapsed") === "1";
    });

    const menu = [
        { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
        { name: "Gia Phả", icon: <FaSitemap />, path: "/tree" },
        { name: "Bản Đồ", icon: <FaMap />, path: "/maps" },
        { name: "Tin Tức", icon: <FaBlog />, path: "/news" },
        { name: "Tìm Kiếm", icon: <FaSearch />, path: "/search" },
        { name: "People", icon: <FaUsers />, path: "/people" },
        { name: "Quản lý", icon: <FaUserFriends />, path: "/admin/dashboard" },
        { name: "Sự Kiện", icon: <FaCalendarAlt />, path: "/event" },
        { name: "Thanh Toán", icon: <FaMoneyBill />, path: "/billing" },
    ];

    const toggleSidebar = () => {
        setIsCollapsed((prev) => {
            const next = !prev;
            window.localStorage.setItem("sidebar-collapsed", next ? "1" : "0");
            return next;
        });
    };

    return (
        <aside
            className={[
                "h-screen bg-white border-r border-gray-200 flex flex-col py-4 px-3 sticky top-0",
                "transition-all duration-300 ease-in-out",
                isCollapsed ? "w-20" : "w-60",
            ].join(" ")}
        >
            <div className={["mb-6 flex", isCollapsed ? "justify-center" : "justify-end"].join(" ")}>
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                    aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
                    title={isCollapsed ? "Mở rộng" : "Thu gọn"}
                >
                    {isCollapsed ? <FaChevronRight className="text-sm" /> : <FaChevronLeft className="text-sm" />}
                </button>
            </div>

            {/* LOGO */}
            <div className={["mb-8 flex items-center px-2", isCollapsed ? "justify-center" : "gap-3"].join(" ")}>
                <Image
                    src="/logo.png"   // đặt logo vào /public/logo.png
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-md"
                />
                <span className={[
                    "text-lg font-semibold text-gray-700 transition-opacity duration-200",
                    isCollapsed ? "w-0 overflow-hidden opacity-0" : "opacity-100",
                ].join(" ")}>
                    Genealogy
                </span>
            </div>

            {/* MENU */}
            <nav className="flex flex-col gap-1">
                {menu.map((item) => {
                    const active = pathname === item.path;

                    return (
                        <a
                            key={item.name}
                            href={item.path}
                            title={isCollapsed ? item.name : undefined}
                            className={`flex items-center px-3 py-2 rounded-md text-sm transition
                ${active
                                    ? "bg-gray-100 text-gray-900 font-medium"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }
                ${isCollapsed ? "justify-center" : "gap-3"}
              `}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {!isCollapsed && item.name}
                        </a>
                    );
                })}
            </nav>
        </aside>
    );
}
