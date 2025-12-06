"use client";

import Image from "next/image";
import { FaBell } from "react-icons/fa";

export default function Topbar() {
    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-20">

            {/* LEFT - Logo + menu items */}
            <div className="flex items-center gap-6">



                {/* Main menu (giống ảnh bạn gửi) */}
                <nav className="flex items-center gap-6 text-sm text-gray-600">
                    <a href="#" className="hover:text-black flex items-center gap-1">
                        Donate
                    </a>
                    <a href="#" className="hover:text-black flex items-center gap-1">
                        Tomb
                    </a>
                    <a href="#" className="hover:text-black flex items-center gap-1">
                        Memory
                    </a>
                    <a href="#" className="hover:text-black flex items-center gap-1">
                        Bài Văn Cúng
                    </a>
                </nav>
            </div>

            {/* RIGHT - Notifications + Profile */}
            <div className="flex items-center gap-6">
                {/* Notification bell */}
                <button className="relative">
                    <FaBell className="text-gray-500 text-lg hover:text-gray-700" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                        3
                    </span>
                </button>

                {/* Profile dropdown placeholder */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <Image
                        src="/profile.jpg"      // có thể đổi hình avatar
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        Profile Name
                    </span>
                </div>
            </div>
        </header>
    );
}
