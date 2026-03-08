"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { MdEmail, MdLock, MdPerson } from "react-icons/md"
import { Sparkles, TreePine } from "lucide-react"
import memorial from "../../../public/images/hero-memorial.jpg"

export default function SignupPage() {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()
    const invitationToken = searchParams.get("inviteToken") ?? undefined

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (!agreedToTerms) {
            setError("Please agree to the terms and conditions")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    password,
                    invitationToken,
                }),
            })

            const payload = await response.json().catch(() => ({}))

            if (!response.ok) {
                const fieldErrors = payload?.details?.fieldErrors as Record<string, string[] | undefined> | undefined
                const firstFieldError = fieldErrors
                    ? Object.values(fieldErrors).flat().find(Boolean)
                    : undefined
                setError(firstFieldError ?? payload?.error ?? "Đăng ký thất bại. Vui lòng thử lại.")
                return
            }

            router.push("/dashboard")
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
                        Tạo tài khoản mới
                        <span className="mt-2 block text-[#16A34A]">cho dòng họ của bạn.</span>
                    </h1>
                    <p className="mt-4 max-w-md text-sm text-[#475569]">
                        Bắt đầu xây dựng cây gia phả, kết nối các thế hệ và lưu giữ di sản gia đình trên một nền tảng tập trung.
                    </p>

                    <div className="relative mt-8 h-48 overflow-hidden rounded-2xl border border-[#E2E8F0] shadow-sm">
                        <Image src={memorial} alt="Gia đình nhiều thế hệ" fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/45 via-[#0F172A]/15 to-transparent" />
                        <p className="absolute bottom-3 left-3 rounded-md bg-white/85 px-2 py-1 text-xs font-medium text-[#166534]">
                            Lưu giữ ký ức gia đình
                        </p>
                    </div>

                    <div className="mt-6 space-y-3">
                        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                            <p className="text-xs font-semibold text-[#16A34A]">KHỞI TẠO NHANH</p>
                            <p className="mt-1 text-sm text-[#475569]">Thiết lập không gian gia phả chỉ trong vài bước đơn giản.</p>
                        </div>
                        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                            <p className="text-xs font-semibold text-[#16A34A]">SẴN SÀNG CỘNG TÁC</p>
                            <p className="mt-1 text-sm text-[#475569]">Mời người thân cùng cập nhật thông tin và ký ức gia đình.</p>
                        </div>
                    </div>
                </section>

                <section className="p-6 md:p-10">
                    <div className="mb-8">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#166534]">
                            <Sparkles className="h-3.5 w-3.5" />
                            Create account
                        </div>
                        <h2 className="text-3xl font-bold text-[#0F172A]">Đăng ký tài khoản</h2>
                        <p className="mt-2 text-sm text-[#475569]">Điền thông tin để bắt đầu quản lý gia phả của bạn.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="block text-sm font-medium text-[#0F172A]">
                                Họ và tên
                            </label>
                            <div className="relative">
                                <MdPerson className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#16A34A]" />
                                <input
                                    id="fullName"
                                    type="text"
                                    placeholder="Nguyễn Văn A"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-[#0F172A]">
                                Email
                            </label>
                            <div className="relative">
                                <MdEmail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#16A34A]" />
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
                            <label htmlFor="password" className="block text-sm font-medium text-[#0F172A]">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <MdLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#16A34A]" />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Tạo mật khẩu mạnh"
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#0F172A]">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <MdLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#16A34A]" />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Nhập lại mật khẩu"
                                    minLength={8}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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

                        <div className="flex items-start gap-3">
                            <input
                                id="terms"
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 h-4 w-4 cursor-pointer rounded border-[#94A3B8] text-[#16A34A] focus:ring-[#16A34A]/30"
                            />
                            <label htmlFor="terms" className="text-sm text-[#475569]">
                                Tôi đồng ý với{" "}
                                <Link href="#" className="font-medium text-[#16A34A] hover:text-[#15803D] underline">
                                    Điều khoản dịch vụ
                                </Link>{" "}
                                và{" "}
                                <Link href="#" className="font-medium text-[#16A34A] hover:text-[#15803D] underline">
                                    Chính sách bảo mật
                                </Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-[#16A34A] py-2.5 text-sm font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                        </button>
                    </form>

                    <div className="mt-7 text-center">
                        <p className="text-sm text-[#475569]">Đã có tài khoản?</p>
                        <Link href="/login" className="mt-1 inline-block text-sm font-semibold text-[#16A34A] hover:text-[#15803D]">
                            Đăng nhập tại đây
                        </Link>
                    </div>

                    <div className="mt-6 rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                        <p className="text-xs text-[#475569]">
                            <span className="font-semibold text-[#166534]">Demo tip:</span> Nhập bất kỳ thông tin hợp lệ để tạo tài khoản và vào dashboard.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    )
}
