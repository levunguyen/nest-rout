"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MdEmail, MdLock, MdPerson } from "react-icons/md"
import { BiLeaf } from "react-icons/bi"

export default function SignupPage() {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

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
            await new Promise((resolve) => setTimeout(resolve, 1500))

            if (fullName && email && password) {
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
                    <h1 className="text-3xl font-serif font-bold text-amber-900 mb-2">Create Your Account</h1>
                    <p className="text-amber-800/70">Start building your family tree today</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8 mb-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="block text-sm font-medium text-amber-900">
                                Full Name
                            </label>
                            <div className="relative">
                                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                                <input
                                    id="fullName"
                                    type="text"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 placeholder:text-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-600"
                                    required
                                />
                            </div>
                        </div>

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
                                    className="w-full pl-10 pr-4 py-2 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 placeholder:text-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-600"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-amber-900">
                                Password
                            </label>
                            <div className="relative">
                                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 placeholder:text-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-600"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-amber-900">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 placeholder:text-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-600"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <div className="flex items-start gap-3">
                            <input
                                id="terms"
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-amber-300 text-amber-700 cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-sm text-amber-800">
                                I agree to the{" "}
                                <Link href="#" className="text-amber-700 hover:text-amber-800 underline">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="#" className="text-amber-700 hover:text-amber-800 underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition"
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>
                </div>

                <div className="text-center">
                    <p className="text-amber-800/70 mb-2">Already have an account?</p>
                    <Link href="/login" className="text-amber-700 hover:text-amber-800 font-semibold transition">
                        Sign in here
                    </Link>
                </div>

                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-700">
                        <span className="font-semibold">Demo tip:</span> Enter any information to create an account and explore the
                        app
                    </p>
                </div>
            </div>
        </main>
    )
}
