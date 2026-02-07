"use client"

import { useState } from "react"

export default function SystemConfiguration() {
    const [settings, setSettings] = useState({
        language: "vi",
        dateFormat: "DD/MM/YYYY",
        placeStandard: "vietnam",
        databaseHost: "localhost",
        databasePort: "5432",
        storagePath: "/data/storage",
        maxUploadSize: "50",
        enableReports: true,
        enableCharts: true,
        enableMaps: true,
    })

    const handleSave = () => {
        alert("Cài đặt đã được lưu thành công!")
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Cấu hình hệ thống</h1>
                <p className="text-muted-foreground">Quản lý cài đặt ngôn ngữ, định dạng, và cơ sở dữ liệu</p>
            </div>

            {/* General Settings */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Cài đặt chung</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Ngôn ngữ</label>
                        <select
                            value={settings.language}
                            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Định dạng ngày tháng</label>
                        <select
                            value={settings.dateFormat}
                            onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Chuẩn địa danh</label>
                        <select
                            value={settings.placeStandard}
                            onChange={(e) => setSettings({ ...settings, placeStandard: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="vietnam">Việt Nam</option>
                            <option value="international">Quốc tế</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Database Settings */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Cấu hình Database</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Host</label>
                        <input
                            type="text"
                            value={settings.databaseHost}
                            onChange={(e) => setSettings({ ...settings, databaseHost: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Port</label>
                        <input
                            type="text"
                            value={settings.databasePort}
                            onChange={(e) => setSettings({ ...settings, databasePort: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Đường dẫn lưu trữ</label>
                        <input
                            type="text"
                            value={settings.storagePath}
                            onChange={(e) => setSettings({ ...settings, storagePath: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Giới hạn kích thước upload (MB)</label>
                        <input
                            type="number"
                            value={settings.maxUploadSize}
                            onChange={(e) => setSettings({ ...settings, maxUploadSize: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                </div>
            </div>

            {/* Feature Settings */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Bật / tắt module</h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 hover:bg-secondary rounded-lg cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.enableReports}
                            onChange={(e) => setSettings({ ...settings, enableReports: e.target.checked })}
                            className="w-4 h-4"
                        />
                        <span className="text-foreground">Bật Reports</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 hover:bg-secondary rounded-lg cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.enableCharts}
                            onChange={(e) => setSettings({ ...settings, enableCharts: e.target.checked })}
                            className="w-4 h-4"
                        />
                        <span className="text-foreground">Bật Charts</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 hover:bg-secondary rounded-lg cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.enableMaps}
                            onChange={(e) => setSettings({ ...settings, enableMaps: e.target.checked })}
                            className="w-4 h-4"
                        />
                        <span className="text-foreground">Bật Maps</span>
                    </label>
                </div>
            </div>

            {/* Server Status */}
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Trạng thái máy chủ</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                        <span className="text-foreground">Database</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Kết nối</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                        <span className="text-foreground">Storage</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Bình thường</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                        <span className="text-foreground">API</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Hoạt động</span>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium w-full"
            >
                Lưu cài đặt
            </button>
        </div>
    )
}
