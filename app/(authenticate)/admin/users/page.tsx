"use client"

import React from "react"

import { useState } from "react"
import { MdEdit, MdDelete, MdAdd, MdRefresh } from "react-icons/md"

interface User {
    id: string
    name: string
    email: string
    role: "admin" | "edit" | "view"
    status: "active" | "inactive"
    familyTrees: string[]
    createdAt: string
}

const mockUsers: User[] = [
    {
        id: "1",
        name: "Nguyễn Văn A",
        email: "nguyenvana@email.com",
        role: "admin",
        status: "active",
        familyTrees: ["Gia phả Nguyễn"],
        createdAt: "2025-01-15",
    },
    {
        id: "2",
        name: "Trần Thị B",
        email: "tranthib@email.com",
        role: "edit",
        status: "active",
        familyTrees: ["Gia phả Nguyễn", "Gia phả Trần"],
        createdAt: "2025-01-10",
    },
    {
        id: "3",
        name: "Lê Văn C",
        email: "levanc@email.com",
        role: "view",
        status: "active",
        familyTrees: ["Gia phả Nguyễn"],
        createdAt: "2025-01-05",
    },
]

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>(mockUsers)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "view" as const,
    })

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.email) return

        const newUser: User = {
            id: String(users.length + 1),
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: "active",
            familyTrees: [],
            createdAt: new Date().toISOString().split("T")[0],
        }

        setUsers([...users, newUser])
        setFormData({ name: "", email: "", password: "", role: "view" })
        setShowModal(false)
    }

    const handleDeleteUser = (id: string) => {
        if (confirm("Bạn chắc chắn muốn xóa người dùng này?")) {
            setUsers(users.filter((u) => u.id !== id))
        }
    }

    const handleToggleStatus = (id: string) => {
        setUsers(
            users.map((u) =>
                u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u
            )
        )
    }

    const handleResetPassword = () => {
        alert("Mật khẩu đã được reset. Gửi email tới người dùng với mật khẩu tạm thời.")
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý người dùng</h1>
                    <p className="text-muted-foreground">Tạo, sửa và xóa tài khoản người dùng</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
                >
                    <MdAdd /> Tạo người dùng
                </button>
            </div>

            {/* Create User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-foreground mb-4">Tạo tài khoản mới</h3>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Tên</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nhập tên"
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Nhập email"
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Mật khẩu</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Nhập mật khẩu tạm thời"
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Vai trò</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) =>
                                        setFormData({ ...formData, role: e.target.value as User["role"] })
                                    }
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                >
                                    <option value="view">Chỉ xem</option>
                                    <option value="edit">Chỉnh sửa</option>
                                    <option value="admin">Quản trị</option>
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
                                >
                                    Tạo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-secondary border-b border-border">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tên</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Vai trò</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Cây gia phả</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-border hover:bg-secondary transition-colors">
                                <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                                <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === "admin"
                                                ? "bg-red-100 text-red-700"
                                                : user.role === "edit"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-blue-100 text-blue-700"
                                            }`}
                                    >
                                        {user.role === "admin" ? "Quản trị" : user.role === "edit" ? "Chỉnh sửa" : "Chỉ xem"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggleStatus(user.id)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${user.status === "active"
                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {user.status === "active" ? "Hoạt động" : "Vô hiệu"}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground text-sm">{user.familyTrees.join(", ") || "-"}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button
                                        onClick={handleResetPassword}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Reset mật khẩu"
                                    >
                                        <MdRefresh size={18} />
                                    </button>
                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                        title="Chỉnh sửa"
                                    >
                                        <MdEdit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Xóa"
                                    >
                                        <MdDelete size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
