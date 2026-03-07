import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3, Sparkles, TreePine, Users } from "lucide-react";
import memorial from "../../../public/images/hero-memorial.jpg";
import grave1 from "../../../public/images/grave-1.jpg";
import grave2 from "../../../public/images/grave-2.jpg";
import grave3 from "../../../public/images/grave-3.jpg";
import grandfather from "../../../public/images/grandfather.png";
import grandmother from "../../../public/images/grandmother.png";
import dad from "../../../public/images/dad.png";
import nephew from "../../../public/images/nephew.png";
import uncle from "../../../public/images/uncle.png";

const stats = [
  { label: "Tổng thành viên", value: "112,361", icon: Users, note: "+4.2% tháng này" },
  { label: "Dòng họ đang quản lý", value: "24,560", icon: TreePine, note: "+1,245 hồ sơ mới" },
  { label: "Quyên góp cộng đồng", value: "45M", icon: Sparkles, note: "Mục tiêu tháng đạt 78%" },
];

const upcomingEvents = [
  { name: "Giỗ tổ chi 1 - họ Nguyễn", date: "10/03/2026", time: "09:00" },
  { name: "Họp mặt mùa xuân", date: "15/03/2026", time: "08:30" },
  { name: "Lễ tưởng niệm gia tộc", date: "20/03/2026", time: "19:00" },
];

const recentUpdates = [
  "Đã thêm 18 hồ sơ thành viên mới vào cây gia phả.",
  "Đã cập nhật 6 sự kiện lịch sử gia đình trong tuần này.",
  "Đã chia sẻ 24 ảnh tư liệu cho các nhánh liên quan.",
];

const deathAnniversaries = [
  { name: "Cụ Nguyễn Văn Hòa", branch: "Chi 1 - Họ Nguyễn", date: "10/03/2026", lunar: "01/02 ÂL", place: "Từ đường họ Nguyễn", image: grandfather },
  { name: "Cụ Trần Thị Lý", branch: "Chi 2 - Họ Trần", date: "14/03/2026", lunar: "05/02 ÂL", place: "Nhà thờ tổ chi 2", image: grave1 },
  { name: "Ông Lê Văn Thành", branch: "Chi 3 - Họ Lê", date: "19/03/2026", lunar: "10/02 ÂL", place: "Tư gia trưởng chi", image: grave2 },
  { name: "Bà Phạm Thị Hương", branch: "Chi 4 - Họ Phạm", date: "24/03/2026", lunar: "15/02 ÂL", place: "Nhà thờ họ Phạm", image: grave3 },
];

const birthdayUniversityMembers = [
  { name: "Nguyễn Thị Lan", birthday: "12/03/2026", university: "ĐH Quốc gia Hà Nội", major: "Lịch sử", image: grandmother },
  { name: "Trần Minh Đức", birthday: "18/03/2026", university: "ĐH Bách Khoa TP.HCM", major: "CNTT", image: dad },
  { name: "Lê Hoàng Phúc", birthday: "21/03/2026", university: "ĐH Cần Thơ", major: "Nông nghiệp", image: uncle },
  { name: "Phạm Gia Hân", birthday: "25/03/2026", university: "ĐH Kinh tế Quốc dân", major: "Tài chính", image: nephew },
];

export default function AuthenticationPage() {
  return (
    <main className="min-h-screen bg-[#F8FAF8] px-4 py-6 text-[#0F172A] md:px-8 md:py-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white">
          <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#166534]">
                <Sparkles className="h-3.5 w-3.5" />
                Dashboard tổng quan
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                Quản lý gia phả hiện đại,
                <span className="block text-[#16A34A]">trực quan và tập trung.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm text-[#475569] md:text-base">
                Theo dõi thành viên, lịch sự kiện và hoạt động cộng đồng từ một nơi duy nhất với giao diện
                sáng, rõ ràng.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/tree"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15803D]"
                >
                  Mở cây gia phả
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/event"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAF8]"
                >
                  Xem lịch sự kiện
                  <CalendarDays className="h-4 w-4 text-[#16A34A]" />
                </Link>
              </div>
            </div>

            <div className="relative h-64 overflow-hidden rounded-2xl border border-[#E2E8F0] md:h-full">
              <Image src={memorial} alt="Gia đình nhiều thế hệ" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent" />
              <div className="absolute bottom-3 left-3 rounded-md bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#166534]">
                Kết nối các thế hệ trong một nền tảng
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <article key={item.label} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#475569]">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-[#0F172A]">{item.value}</p>
                  <p className="mt-2 text-xs font-medium text-[#166534]">{item.note}</p>
                </div>
                <span className="rounded-lg bg-[#DCFCE7] p-2 text-[#16A34A]">
                  <item.icon className="h-5 w-5" />
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Sự kiện sắp tới</h2>
              <Link href="/event" className="text-sm font-semibold text-[#16A34A] hover:text-[#15803D]">
                Xem tất cả
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.name}
                  className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-[#0F172A]">{event.name}</p>
                    <p className="mt-1 text-sm text-[#475569]">{event.date}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#166534]">
                    <Clock3 className="h-3.5 w-3.5 text-[#16A34A]" />
                    {event.time}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Cập nhật gần đây</h2>
            <div className="space-y-3">
              {recentUpdates.map((update) => (
                <div key={update} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                  <p className="text-sm text-[#475569]">{update}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A]">Kho tư liệu gia đình - Danh sách giỗ</h2>
            <Link href="/event" className="text-sm font-semibold text-[#16A34A] hover:text-[#15803D]">
              Quản lý lịch giỗ
            </Link>
          </div>
          <div className="space-y-3">
            {deathAnniversaries.map((item) => (
              <article
                key={`${item.name}-${item.date}`}
                className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-4"
              >
                <div className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-[#0F172A]">{item.name}</p>
                        <p className="text-sm text-[#475569]">{item.branch}</p>
                      </div>
                      <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-[#166534]">
                        Dương lịch: {item.date}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#475569]">
                      <span className="rounded-md border border-[#E2E8F0] bg-white px-2 py-1">Âm lịch: {item.lunar}</span>
                      <span className="rounded-md border border-[#E2E8F0] bg-white px-2 py-1">Địa điểm: {item.place}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A]">Sinh nhật & Đại học thành viên</h2>
            <Link href="/people" className="text-sm font-semibold text-[#16A34A] hover:text-[#15803D]">
              Xem hồ sơ thành viên
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {birthdayUniversityMembers.map((member) => (
              <article
                key={`${member.name}-${member.birthday}`}
                className="flex gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-4"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#0F172A]">{member.name}</p>
                  <p className="mt-1 text-sm text-[#475569]">Sinh nhật: {member.birthday}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#475569]">
                    <span className="rounded-md border border-[#E2E8F0] bg-white px-2 py-1">Trường: {member.university}</span>
                    <span className="rounded-md border border-[#E2E8F0] bg-white px-2 py-1">Ngành: {member.major}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
