"use client";

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
} from "react-icons/fa";

export default function Sidebar() {
    const pathname = usePathname();

    const menu = [
        { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
        { name: "Gia Phả", icon: <FaSitemap />, path: "/tree" },
        { name: "Bản Đồ", icon: <FaMap />, path: "/maps" },
        { name: "Blogs", icon: <FaBlog />, path: "/blogs" },
        { name: "Tìm Kiếm", icon: <FaSearch />, path: "/search" },
        { name: "People", icon: <FaUsers />, path: "/people" },
        { name: "Family", icon: <FaUserFriends />, path: "/family" },
        { name: "Sự Kiện", icon: <FaCalendarAlt />, path: "/event" },
        { name: "Billing", icon: <FaMoneyBill />, path: "/billing" },
    ];

    return (
        <aside className="w-60 h-screen bg-white border-r border-gray-200 flex flex-col py-4 px-3 sticky top-0">

            {/* LOGO */}
            <div className="flex items-center gap-3 px-2 mb-8">
                <Image
                    src="/logo.png"   // đặt logo vào /public/logo.png
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-md"
                />
                <span className="text-lg font-semibold text-gray-700">
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
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm
                ${active
                                    ? "bg-gray-100 text-gray-900 font-medium"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }
              `}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.name}
                        </a>
                    );
                })}
            </nav>
        </aside>
    );
}
