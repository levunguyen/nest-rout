"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MdEmail, MdLock } from "react-icons/md"
import { Sparkles, TreePine } from "lucide-react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))

            if (email && password) {
                router.push("/dashboard")
            } else {
                setError("Please fill in all fields")
            }
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#F8FAF8] px-4 py-10 text-[#0F172A] md:px-8">
            <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-sm md:grid-cols-2">
                <section className="relative hidden bg-[#DCFCE7] p-10 md:block">
                    <div className="absolute right-6 top-6 rounded-full border border-[#16A34A]/30 bg-white/70 px-3 py-1 text-xs font-medium text-[#166534]">
                        Family Heritage Platform
                    </div>
                    <Link href="/" className="inline-flex items-center gap-2">
                        <TreePine className="h-7 w-7 text-[#16A34A]" />
                        <span className="text-2xl font-bold">Gia Phả Việt</span>
                    </Link>
                    <h1 className="mt-10 text-4xl font-bold leading-tight">
                        Chào mừng bạn trở lại
                        <span className="mt-2 block text-[#16A34A]">tiếp nối di sản gia đình.</span>
                    </h1>
                    <p className="mt-4 max-w-md text-sm text-[#475569]">
                        Đăng nhập để quản lý cây gia phả, cập nhật thành viên và lưu giữ ký ức cho các thế hệ sau.
                    </p>

                    <div className="mt-10 space-y-3">
                        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                            <p className="text-xs font-semibold text-[#16A34A]">BẢO MẬT</p>
                            <p className="mt-1 text-sm text-[#475569]">Phân quyền theo vai trò và theo dõi thay đổi dữ liệu.</p>
                        </div>
                        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                            <p className="text-xs font-semibold text-[#16A34A]">CỘNG TÁC</p>
                            <p className="mt-1 text-sm text-[#475569]">Nhiều thành viên cùng xây dựng gia phả trên một nền tảng.</p>
                        </div>
                    </div>
                </section>

                <section className="p-6 md:p-10">
                    <div className="mb-8">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#166534]">
                            <Sparkles className="h-3.5 w-3.5" />
                            Sign in
                        </div>
                        <h2 className="text-3xl font-bold text-[#0F172A]">Đăng nhập tài khoản</h2>
                        <p className="mt-2 text-sm text-[#475569]">Nhập thông tin để truy cập không gian gia phả của bạn.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-[#0F172A]">
                                Email
                            </label>
                            <div className="relative">
                                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#16A34A]" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-[#0F172A]">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-sm font-medium text-[#16A34A] hover:text-[#15803D]">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <div className="relative">
                                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#16A34A]" />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-[#16A34A] py-2.5 text-sm font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isLoading ? "Signing in..." : "Đăng nhập"}
                        </button>
                    </form>

                    <div className="mt-7 text-center">
                        <p className="text-sm text-[#475569]">Chưa có tài khoản?</p>
                        <Link href="/signup" className="mt-1 inline-block text-sm font-semibold text-[#16A34A] hover:text-[#15803D]">
                            Tạo tài khoản mới
                        </Link>
                    </div>

                    <div className="mt-6 rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                        <p className="text-xs text-[#475569]">
                            <span className="font-semibold text-[#166534]">Demo tip:</span> Nhập bất kỳ email và mật khẩu để vào dashboard.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    )
}
