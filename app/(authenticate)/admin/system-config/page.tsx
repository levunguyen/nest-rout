"use client";

import { useState } from "react";

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
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-[#0F172A]">Cấu hình hệ thống</h1>
        <p className="mt-2 text-sm text-[#475569]">Quản lý cài đặt ngôn ngữ, database, lưu trữ và module hệ thống.</p>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0F172A]">Cài đặt chung</h2>
          <div className="mt-3 space-y-3">
            <select value={settings.language} onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm">
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
            <select value={settings.dateFormat} onChange={(e) => setSettings((s) => ({ ...s, dateFormat: e.target.value }))} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm">
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
            <select value={settings.placeStandard} onChange={(e) => setSettings((s) => ({ ...s, placeStandard: e.target.value }))} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm">
              <option value="vietnam">Việt Nam</option>
              <option value="international">Quốc tế</option>
            </select>
          </div>
        </article>

        <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0F172A]">Database & Storage</h2>
          <div className="mt-3 space-y-3">
            <input value={settings.databaseHost} onChange={(e) => setSettings((s) => ({ ...s, databaseHost: e.target.value }))} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm" />
            <input value={settings.databasePort} onChange={(e) => setSettings((s) => ({ ...s, databasePort: e.target.value }))} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm" />
            <input value={settings.storagePath} onChange={(e) => setSettings((s) => ({ ...s, storagePath: e.target.value }))} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm" />
            <input type="number" value={settings.maxUploadSize} onChange={(e) => setSettings((s) => ({ ...s, maxUploadSize: e.target.value }))} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm" />
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0F172A]">Bật / tắt module</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {[
            { key: "enableReports", label: "Reports" },
            { key: "enableCharts", label: "Charts" },
            { key: "enableMaps", label: "Maps" },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3 text-sm">
              <input
                type="checkbox"
                checked={settings[item.key as keyof typeof settings] as boolean}
                onChange={(e) => setSettings((s) => ({ ...s, [item.key]: e.target.checked }))}
              />
              {item.label}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0F172A]">Trạng thái máy chủ</h2>
        <div className="mt-3 space-y-2">
          {["Database", "Storage", "API"].map((service) => (
            <div key={service} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
              <span className="text-sm text-[#334155]">{service}</span>
              <span className="rounded-full bg-[#DCFCE7] px-2.5 py-1 text-xs font-medium text-[#166534]">Hoạt động</span>
            </div>
          ))}
        </div>
      </section>

      <button className="w-full rounded-lg bg-[#16A34A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#15803D]">
        Lưu cấu hình
      </button>
    </div>
  );
}
