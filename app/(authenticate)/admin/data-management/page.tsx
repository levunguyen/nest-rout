"use client"

import { useState } from "react"
import { MdCheckCircle, MdError } from "react-icons/md"

export default function DataManagement() {
    const [records] = useState([
        { id: 1, type: "Person", name: "Nguyễn Văn A", status: "valid", issues: [] },
        { id: 2, type: "Person", name: "Trần Thị B", status: "warning", issues: ["Ngày sinh > ngày mất"] },
        { id: 3, type: "Family", name: "Nguyễn - Trần", status: "error", issues: ["Quan hệ không hợp lệ", "Cha mẹ trùng nhau"] },
        { id: 4, type: "Event", name: "Hôn nhân 2020", status: "valid", issues: [] },
    ])

    const [deletedRecords] = useState([
        { id: "deleted_1", type: "Person", name: "Lê Văn C", deletedDate: "2025-01-19", deletedBy: "Admin" },
        { id: "deleted_2", type: "Media", name: "photo_old.jpg", deletedDate: "2025-01-18", deletedBy: "Nguyễn Văn A" },
    ])

    const handleRestoreRecord = () => {
        alert("Khôi phục thành công!")
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý dữ liệu phả hệ</h1>
                <p className="text-muted-foreground">Kiểm tra lỗi, gộp bản ghi, và quản lý dữ liệu</p>
            </div>

            {/* Data Quality Check */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Kiểm tra chất lượng dữ liệu</h3>
                <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium mb-4">
                    Quét lỗi dữ liệu
                </button>

                <div className="space-y-2">
                    {records.map((record) => (
                        <div key={record.id} className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    {record.status === "valid" ? (
                                        <MdCheckCircle className="text-green-600 text-xl mt-1" />
                                    ) : record.status === "warning" ? (
                                        <span className="text-amber-600 text-xl mt-1">⚠</span>
                                    ) : (
                                        <MdError className="text-red-600 text-xl mt-1" />
                                    )}
                                    <div>
                                        <p className="font-semibold text-foreground">{record.type}: {record.name}</p>
                                        {record.issues.length > 0 && (
                                            <ul className="text-sm text-red-600 mt-1">
                                                {record.issues.map((issue, idx) => (
                                                    <li key={idx}>- {issue}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${record.status === "valid"
                                        ? "bg-green-100 text-green-700"
                                        : record.status === "warning"
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-red-100 text-red-700"
                                    }`}>
                                    {record.status === "valid" ? "Hợp lệ" : record.status === "warning" ? "Cảnh báo" : "Lỗi"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Merge Duplicates */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Gộp bản ghi trùng lặp</h3>
                <p className="text-muted-foreground mb-4">Tìm và gộp các bản ghi trùng lặp</p>
                <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium">
                    Tìm bản ghi trùng
                </button>
            </div>

            {/* Restore Deleted Records */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Phục hồi dữ liệu đã xóa</h3>
                <div className="space-y-2">
                    {deletedRecords.length === 0 ? (
                        <p className="text-muted-foreground">Không có dữ liệu đã xóa</p>
                    ) : (
                        deletedRecords.map((record) => (
                            <div key={record.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary transition-colors">
                                <div>
                                    <p className="font-semibold text-foreground">{record.type}: {record.name}</p>
                                    <p className="text-sm text-muted-foreground">Xóa bởi {record.deletedBy} vào {record.deletedDate}</p>
                                </div>
                                <button
                                    onClick={handleRestoreRecord}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    Khôi phục
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Standardize Data */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Chuẩn hóa dữ liệu</h3>
                <div className="space-y-3">
                    <button className="w-full px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium text-foreground">
                        Chuẩn hóa tên địa danh
                    </button>
                    <button className="w-full px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium text-foreground">
                        Chuẩn hóa tên gọi
                    </button>
                    <button className="w-full px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium text-foreground">
                        Chuẩn hóa định dạng ngày
                    </button>
                </div>
            </div>
        </div>
    )
}
