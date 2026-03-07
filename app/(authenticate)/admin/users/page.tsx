"use client";

import { useMemo, useState } from "react";
import { Edit3, KeyRound, Plus, Trash2, UserCheck } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "edit" | "view";
  status: "active" | "inactive";
  familyTrees: string[];
  createdAt: string;
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
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "view" as User["role"],
  });

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      admins: users.filter((u) => u.role === "admin").length,
    };
  }, [users]);

  const resetForm = () => setFormData({ name: "", email: "", password: "", role: "view" });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    const newUser: User = {
      id: String(Date.now()),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: "active",
      familyTrees: [],
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [newUser, ...prev]);
    setShowCreate(false);
    resetForm();
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? { ...u, name: formData.name, email: formData.email, role: formData.role } : u)),
    );
    setEditingUser(null);
    resetForm();
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: "", role: user.role });
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Bạn chắc chắn muốn xóa người dùng này?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u)),
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">Quản lý người dùng</h1>
            <p className="mt-2 text-sm text-[#475569]">Tạo, chỉnh sửa và quản lý trạng thái tài khoản quản trị.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15803D]"
          >
            <Plus className="h-4 w-4" />
            Tạo người dùng
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-xs text-[#64748B]">Tổng người dùng</p>
          <p className="mt-1 text-2xl font-bold text-[#0F172A]">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-xs text-[#64748B]">Đang hoạt động</p>
          <p className="mt-1 text-2xl font-bold text-[#16A34A]">{stats.active}</p>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-xs text-[#64748B]">Quản trị viên</p>
          <p className="mt-1 text-2xl font-bold text-[#0F172A]">{stats.admins}</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAF8]">
              <tr>
                {["Tên", "Email", "Vai trò", "Trạng thái", "Cây gia phả", "Hành động"].map((head) => (
                  <th key={head} className="px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#E2E8F0] last:border-b-0">
                  <td className="px-4 py-3 font-medium text-[#0F172A]">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-[#475569]">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#DCFCE7] px-2.5 py-1 text-xs font-medium text-[#166534]">
                      {user.role === "admin" ? "Quản trị" : user.role === "edit" ? "Chỉnh sửa" : "Chỉ xem"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(user.id)}
                      className={[
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        user.status === "active" ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#E2E8F0] text-[#475569]",
                      ].join(" ")}
                    >
                      {user.status === "active" ? "Hoạt động" : "Vô hiệu"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#475569]">{user.familyTrees.join(", ") || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-lg p-2 text-[#166534] hover:bg-[#DCFCE7]" title="Reset mật khẩu">
                        <KeyRound className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(user)}
                        className="rounded-lg p-2 text-[#0F172A] hover:bg-[#F1F5F9]"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id)}
                        className="rounded-lg p-2 text-[#B91C1C] hover:bg-[#FEF2F2]"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {(showCreate || editingUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#0F172A]">{editingUser ? "Chỉnh sửa người dùng" : "Tạo người dùng mới"}</h3>
            <form onSubmit={editingUser ? handleEditUser : handleCreateUser} className="mt-4 space-y-3">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Họ và tên"
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
              />
              {!editingUser && (
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Mật khẩu tạm"
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                />
              )}
              <select
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value as User["role"] }))}
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
              >
                <option value="view">Chỉ xem</option>
                <option value="edit">Chỉnh sửa</option>
                <option value="admin">Quản trị</option>
              </select>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#16A34A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#15803D]"
                >
                  <UserCheck className="h-4 w-4" />
                  {editingUser ? "Lưu thay đổi" : "Tạo tài khoản"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreate(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  className="flex-1 rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-[#F8FAF8]"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
