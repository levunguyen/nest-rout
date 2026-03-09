"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Coins,
  HandCoins,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { donations as initialDonations, familyMembers, donationGoal } from "./data/mockData";
import { AddDonationDialog } from "./components/AddDonationDialog";
import type { Donation } from "./types/donation";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

const formatCurrencyCompact = (amount: number) => {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  return new Intl.NumberFormat("vi-VN").format(Math.round(amount));
};

export default function DonatePage() {
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [keyword, setKeyword] = useState("");

  const years = useMemo(() => {
    const result = Array.from(new Set(donations.map((item) => new Date(item.date).getFullYear()))).sort(
      (a, b) => b - a,
    );
    return result;
  }, [donations]);

  const selectedYear = yearFilter === "all" ? null : Number(yearFilter);

  const yearlySummary = useMemo(() => {
    const totals = new Map<number, number>();
    donations.forEach((donation) => {
      const year = new Date(donation.date).getFullYear();
      totals.set(year, (totals.get(year) ?? 0) + donation.amount);
    });

    const sortedYears = Array.from(totals.keys()).sort((a, b) => a - b);
    return sortedYears.map((year, index) => {
      const total = totals.get(year) ?? 0;
      const previousTotal = index > 0 ? totals.get(sortedYears[index - 1]) ?? 0 : 0;
      const delta = total - previousTotal;
      const deltaPct = previousTotal > 0 ? (delta / previousTotal) * 100 : null;
      return { year, total, delta, deltaPct };
    });
  }, [donations]);

  const latestYearSummary = yearlySummary[yearlySummary.length - 1] ?? null;

  const filteredDonations = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return donations
      .filter((donation) => (selectedYear ? new Date(donation.date).getFullYear() === selectedYear : true))
      .filter((donation) => {
        if (!q) return true;
        return (
          donation.memberName.toLowerCase().includes(q) ||
          donation.purpose.toLowerCase().includes(q) ||
          donation.note?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [donations, keyword, selectedYear]);

  const totalFund = useMemo(
    () => donations.reduce((sum, donation) => sum + donation.amount, 0),
    [donations],
  );

  const yearlyTotal = useMemo(() => {
    if (!selectedYear) return totalFund;
    return donations
      .filter((donation) => new Date(donation.date).getFullYear() === selectedYear)
      .reduce((sum, donation) => sum + donation.amount, 0);
  }, [donations, selectedYear, totalFund]);

  const progressPercent = Math.min((totalFund / donationGoal) * 100, 100);
  const contributorCount = new Set(donations.map((donation) => donation.memberId)).size;
  const avgDonation = donations.length > 0 ? totalFund / donations.length : 0;

  const maxYearTotal = Math.max(...yearlySummary.map((item) => item.total), 1);

  const onAddDonation = (donation: Omit<Donation, "id">) => {
    const created: Donation = { ...donation, id: `d-${Date.now()}` };
    setDonations((prev) => [created, ...prev]);
  };

  return (
    <main className="min-h-screen bg-[#F6F8F7] px-4 py-8 text-[#0F172A] md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(22,163,74,0.16),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.14),_transparent_40%)]" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#166534]">
                <Sparkles className="h-3.5 w-3.5" />
                Family Fund Ledger
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
                Sổ quỹ đóng góp dòng họ
              </h1>
              <p className="mt-3 text-sm text-[#475569] md:text-base">
                Lưu trữ toàn bộ lịch sử đóng góp và theo dõi xu hướng tăng/giảm quỹ theo từng năm.
              </p>
            </div>
            <AddDonationDialog members={familyMembers} onAddDonation={onAddDonation} />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs text-[#64748B]">Tổng quỹ hiện tại</p>
            <p className="mt-2 text-3xl font-bold text-[#0F172A]">{formatCurrencyCompact(totalFund)} ₫</p>
            <p className="mt-1 text-xs text-[#166534]">{progressPercent.toFixed(1)}% mục tiêu</p>
          </article>
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs text-[#64748B]">Đóng góp trong phạm vi lọc</p>
            <p className="mt-2 text-3xl font-bold text-[#0F172A]">{formatCurrencyCompact(yearlyTotal)} ₫</p>
            <p className="mt-1 text-xs text-[#475569]">{selectedYear ? `Năm ${selectedYear}` : "Tất cả các năm"}</p>
          </article>
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs text-[#64748B]">Người đóng góp</p>
            <p className="mt-2 text-3xl font-bold text-[#0F172A]">{contributorCount}</p>
            <p className="mt-1 text-xs text-[#475569]">Thành viên đã từng đóng góp</p>
          </article>
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs text-[#64748B]">Trung bình mỗi lượt</p>
            <p className="mt-2 text-3xl font-bold text-[#0F172A]">{formatCurrencyCompact(avgDonation)} ₫</p>
            <p className="mt-1 text-xs text-[#475569]">{donations.length} lượt đóng góp</p>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-[#0F172A]">
                <TrendingUp className="h-5 w-5 text-[#16A34A]" />
                Quỹ tăng/giảm theo năm
              </h2>
            </div>

            <div className="space-y-4">
              {yearlySummary.map((item) => {
                const width = (item.total / maxYearTotal) * 100;
                const isUp = item.delta >= 0;
                return (
                  <div key={item.year} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#0F172A]">Năm {item.year}</p>
                      <p className="text-sm font-bold text-[#0F172A]">{formatCurrency(item.total)}</p>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#16A34A] to-[#0EA5E9]"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-end">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          isUp ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEE2E2] text-[#991B1B]"
                        }`}
                      >
                        {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                        {item.delta >= 0 ? "+" : ""}
                        {formatCurrency(item.delta)}
                        {item.deltaPct !== null ? ` (${item.deltaPct >= 0 ? "+" : ""}${item.deltaPct.toFixed(1)}%)` : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-[#0F172A]">
              <Target className="h-5 w-5 text-[#16A34A]" />
              Mục tiêu quỹ
            </h2>
            <div className="mt-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-4">
              <p className="text-xs text-[#64748B]">Đã đạt</p>
              <p className="mt-1 text-2xl font-bold text-[#0F172A]">{formatCurrency(totalFund)}</p>
              <p className="mt-1 text-xs text-[#475569]">Mục tiêu: {formatCurrency(donationGoal)}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#16A34A] to-[#22C55E]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-right text-xs font-medium text-[#166534]">
                {progressPercent.toFixed(1)}% hoàn thành
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] px-3 py-2">
                <span className="inline-flex items-center gap-2 text-sm text-[#334155]">
                  <Coins className="h-4 w-4 text-[#16A34A]" />
                  Tổng lượt đóng góp
                </span>
                <strong className="text-[#0F172A]">{donations.length}</strong>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] px-3 py-2">
                <span className="inline-flex items-center gap-2 text-sm text-[#334155]">
                  <Users className="h-4 w-4 text-[#16A34A]" />
                  Người tham gia
                </span>
                <strong className="text-[#0F172A]">{contributorCount}</strong>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] px-3 py-2">
                <span className="inline-flex items-center gap-2 text-sm text-[#334155]">
                  <HandCoins className="h-4 w-4 text-[#16A34A]" />
                  Trung bình/lượt
                </span>
                <strong className="text-[#0F172A]">{formatCurrency(avgDonation)}</strong>
              </div>
            </div>

            {latestYearSummary && (
              <div className="mt-4 rounded-xl border border-[#E2E8F0] bg-white p-3">
                <p className="text-xs text-[#64748B]">Xu hướng năm gần nhất</p>
                <p className="mt-1 text-sm font-semibold text-[#0F172A]">Năm {latestYearSummary.year}</p>
                <p
                  className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${
                    latestYearSummary.delta >= 0 ? "text-[#166534]" : "text-[#991B1B]"
                  }`}
                >
                  {latestYearSummary.delta >= 0 ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {latestYearSummary.delta >= 0 ? "Tăng" : "Giảm"}{" "}
                  {formatCurrency(Math.abs(latestYearSummary.delta))} so với năm trước
                </p>
              </div>
            )}
          </article>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-[#0F172A]">
              <CalendarDays className="h-5 w-5 text-[#16A34A]" />
              Lịch sử đóng góp
            </h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Tìm người đóng góp / mục đích..."
                  className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 sm:w-72"
                />
              </div>
              <select
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
                className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
              >
                <option value="all">Tất cả năm</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    Năm {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredDonations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAF8] p-8 text-center text-sm text-[#64748B]">
              Không có dữ liệu đóng góp phù hợp bộ lọc hiện tại.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#E2E8F0]">
              <div className="grid grid-cols-12 gap-3 border-b border-[#E2E8F0] bg-[#F8FAF8] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                <div className="col-span-2">Ngày</div>
                <div className="col-span-3">Thành viên</div>
                <div className="col-span-3">Mục đích</div>
                <div className="col-span-2">Ghi chú</div>
                <div className="col-span-2 text-right">Số tiền</div>
              </div>
              {filteredDonations.map((donation, index) => (
                <div
                  key={donation.id}
                  className={`grid grid-cols-12 items-center gap-3 px-4 py-3 text-sm ${
                    index < filteredDonations.length - 1 ? "border-b border-[#E2E8F0]" : ""
                  }`}
                >
                  <div className="col-span-2 text-[#475569]">
                    {new Date(donation.date).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="col-span-3 font-medium text-[#0F172A]">{donation.memberName}</div>
                  <div className="col-span-3 text-[#475569]">{donation.purpose}</div>
                  <div className="col-span-2 text-[#64748B]">{donation.note || "—"}</div>
                  <div className="col-span-2 text-right font-semibold text-[#16A34A]">
                    {formatCurrency(donation.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
