"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaBell,
    FaHome,
    FaSitemap,
    FaMap,
    FaUser,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";

export default function Topbar() {
    const pathname = usePathname();
    const [profileOpen, setProfileOpen] = useState(false);
    const [notiOpen, setNotiOpen] = useState(false);

    const profileRef = useRef<HTMLDivElement>(null);
    const notiRef = useRef<HTMLDivElement>(null);

    const navLinks = [
        { name: "Đóng Góp", icon: FaHome, path: "/donate" },
        { name: "Mộ Phần", icon: FaSitemap, path: "/tomb" },
        { name: "Tưởng Niệm", icon: FaMap, path: "/memory" },
        { name: "Ký Ức", icon: FaMap, path: "/memory" },
        { name: "Tư Liệu", icon: FaMap, path: "/memory" },
    ];

    const notifications = [
        {
            id: 1,
            title: "Thêm thành viên mới",
            description: "Nguyễn Văn A đã được thêm vào cây",
            time: "5 phút trước",
            unread: true,
        },
        {
            id: 2,
            title: "Cập nhật thông tin",
            description: "Trần Thị B vừa được chỉnh sửa hồ sơ",
            time: "1 giờ trước",
            unread: false,
        },
    ];

    const hasUnread = notifications.some((n) => n.unread);

    // Click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node))
                setProfileOpen(false);
            if (notiRef.current && !notiRef.current.contains(e.target as Node))
                setNotiOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
            <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
                {/* LEFT */}
                <nav className="flex items-center gap-2">
                    {navLinks.map((link) => {
                        const isActive = pathname.startsWith(link.path);
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                  ${isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <Icon />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                    {/* 🔔 Notification */}
                    <div className="relative" ref={notiRef}>
                        <button
                            onClick={() => setNotiOpen(!notiOpen)}
                            className="relative p-2 rounded-full hover:bg-gray-100 transition"
                        >
                            <FaBell className="text-gray-600 text-lg" />
                            {hasUnread && (
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
                            )}
                        </button>

                        <AnimatePresence>
                            {notiOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                                    transition={{ duration: 0.18 }}
                                    className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg overflow-hidden"
                                >
                                    <div className="px-4 py-3 font-semibold text-sm border-b">
                                        Thông báo
                                    </div>

                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`px-4 py-3 text-sm cursor-pointer hover:bg-gray-50
                          ${n.unread ? "bg-blue-50" : ""}`}
                                            >
                                                <div className="font-medium text-gray-800">
                                                    {n.title}
                                                </div>
                                                <div className="text-gray-600 text-xs">
                                                    {n.description}
                                                </div>
                                                <div className="text-gray-400 text-xs mt-1">
                                                    {n.time}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t text-center">
                                        <Link
                                            href="/notifications"
                                            className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"
                                        >
                                            Xem tất cả
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* 👤 Profile dropdown (giữ như cũ) */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-3 px-2 py-1 rounded-full hover:bg-gray-100"
                        >
                            <Image
                                src="/profile.jpeg"
                                alt="Profile"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                Profile Name
                            </span>
                        </button>

                        <AnimatePresence>
                            {profileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                                    transition={{ duration: 0.18 }}
                                    className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg"
                                >
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
                                    >
                                        <FaUser /> Profile
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
                                    >
                                        <FaCog /> Settings
                                    </Link>
                                    <div className="h-px bg-gray-200 my-1" />
                                    <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50">
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
