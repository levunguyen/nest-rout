"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MdEmail, MdLock } from "react-icons/md"
import { BiLeaf } from "react-icons/bi"

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
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition">
                        <BiLeaf className="w-8 h-8 text-amber-700" />
                        <span className="text-2xl font-serif font-bold text-amber-900">FamilyRoots</span>
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-amber-900 mb-2">Welcome Back</h1>
                    <p className="text-amber-800/70">Sign in to access your family tree</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8 mb-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-amber-900">
                                Email Address
                            </label>
                            <div className="relative">
                                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 placeholder:text-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-amber-900">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-sm text-amber-700 hover:text-amber-800 transition">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 placeholder:text-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-amber-600 text-white font-semibold py-2 rounded-lg transition"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>

                <div className="text-center">
                    <p className="text-amber-800/70 mb-2">Don't have an account?</p>
                    <Link href="/signup" className="text-amber-700 hover:text-amber-800 font-semibold transition">
                        Create one now
                    </Link>
                </div>

                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-700">
                        <span className="font-semibold">Demo tip:</span> Enter any email and password to explore the app
                    </p>
                </div>
            </div>
        </main>
    )
}
