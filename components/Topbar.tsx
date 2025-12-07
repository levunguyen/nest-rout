"use client";
import Link from "next/link";
import Image from "next/image";
import { FaBell } from "react-icons/fa";
import {
    FaHome,
    FaSitemap,
    FaMap,

} from "react-icons/fa";
import { usePathname } from "next/navigation";




export default function Topbar() {

    const pathname = usePathname();
    const navLink = [
        { name: "Donate", icon: <FaHome />, path: "/donate" },
        { name: "Tomb", icon: <FaSitemap />, path: "/tomb" },
        { name: "Memory", icon: <FaMap />, path: "/memory" },

    ];
    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-20">

            {/* LEFT - Logo + menu items */}
            <div className="flex items-center gap-6">
                {navLink.map((link) => {
                    const isActive = pathname === link.path || (pathname.startsWith(link.path) && link.path !== "/");
                    return (
                        <Link className={isActive ? "font-bold mr-4" : "text-blue-500 mr-4"} href={link.path} key={link.name}> {link.name}</Link>
                    );

                })

                }

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
                        src="/profile.jpeg"      // có thể đổi hình avatar
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
