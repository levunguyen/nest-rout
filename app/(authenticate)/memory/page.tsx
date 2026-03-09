import Image from "next/image";
import {
  BookOpenText,
  CalendarDays,
  Flame,
  HeartHandshake,
  Landmark,
  Sparkles,
  Star,
} from "lucide-react";

type AncestorStory = {
  id: string;
  title: string;
  generation: string;
  period: string;
  summary: string;
  image: string;
};

type FamilyMemory = {
  id: string;
  year: string;
  title: string;
  description: string;
};

type ImportantEvent = {
  id: string;
  date: string;
  title: string;
  detail: string;
  kind: "family" | "traditional" | "achievement";
};

const ancestorStories: AncestorStory[] = [
  {
    id: "as-1",
    title: "Cụ tổ lập nghiệp tại miền Trung",
    generation: "Đời thứ 1",
    period: "Khoảng 1890 - 1930",
    summary:
      "Khởi đầu từ nghề nông, cụ tổ gây dựng nền nếp gia đình bằng tinh thần cần cù, tiết kiệm và coi trọng chữ tín.",
    image: "/images/grandfather.png",
  },
  {
    id: "as-2",
    title: "Bà tổ gìn giữ gia phong",
    generation: "Đời thứ 2",
    period: "Khoảng 1920 - 1970",
    summary:
      "Bà là người kết nối các nhánh trong họ, duy trì việc giỗ tổ và truyền lại nề nếp kính trên nhường dưới.",
    image: "/images/grandmother.png",
  },
  {
    id: "as-3",
    title: "Thế hệ mở rộng dòng họ",
    generation: "Đời thứ 3",
    period: "Khoảng 1950 - 2000",
    summary:
      "Con cháu học hành, lập nghiệp ở nhiều nơi nhưng vẫn giữ truyền thống trở về sum họp mỗi dịp quan trọng.",
    image: "/images/dad.png",
  },
];

const familyMemories: FamilyMemory[] = [
  {
    id: "fm-1",
    year: "1998",
    title: "Lần đầu chụp ảnh đại gia đình",
    description: "Bức ảnh đầu tiên có đủ 4 thế hệ được treo tại nhà thờ họ.",
  },
  {
    id: "fm-2",
    year: "2008",
    title: "Tu sửa từ đường",
    description: "Con cháu cùng góp công, góp của để trùng tu lại không gian thờ tự.",
  },
  {
    id: "fm-3",
    year: "2016",
    title: "Chuyến về quê đông đủ nhất",
    description: "Đại gia đình hơn 60 người tụ họp trong lễ tưởng niệm và tảo mộ.",
  },
  {
    id: "fm-4",
    year: "2024",
    title: "Số hóa gia phả",
    description: "Thế hệ trẻ cùng nhau lưu lại ký ức, hình ảnh và câu chuyện cho con cháu mai sau.",
  },
];

const importantEvents: ImportantEvent[] = [
  {
    id: "ev-1",
    date: "15/01/2024",
    title: "Lễ giỗ tổ đầu năm",
    detail: "Tổ chức tại nhà thờ họ với sự tham gia của các chi nhánh trong và ngoài tỉnh.",
    kind: "traditional",
  },
  {
    id: "ev-2",
    date: "20/04/2024",
    title: "Trao học bổng khuyến học",
    detail: "Quỹ gia tộc trao học bổng cho 12 cháu có thành tích học tập tốt.",
    kind: "achievement",
  },
  {
    id: "ev-3",
    date: "02/09/2024",
    title: "Ngày hội đoàn viên",
    detail: "Con cháu các thế hệ gặp gỡ, chia sẻ kỷ niệm và cập nhật gia phả.",
    kind: "family",
  },
];

const eventTone = {
  family: "bg-[#dbeafe] text-[#1d4ed8]",
  traditional: "bg-[#dcfce7] text-[#15803d]",
  achievement: "bg-[#fef3c7] text-[#b45309]",
} as const;

const eventLabel = {
  family: "Gia đình",
  traditional: "Truyền thống",
  achievement: "Thành tựu",
} as const;

export default function MemoryPage() {
  return (
    <main className="min-h-screen bg-[#f5f8f4] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-[#dfe8dc] bg-white p-6 shadow-sm md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,197,94,0.12),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#22c55e]/30 bg-[#dcfce7] px-3 py-1 text-xs font-semibold text-[#166534]">
              <Sparkles className="h-3.5 w-3.5" />
              Family Memory Space
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-[#0f172a] md:text-5xl">Kho ký ức dòng họ</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#475569] md:text-base">
              Lưu giữ câu chuyện tổ tiên, những kỷ niệm của gia đình và các sự kiện quan trọng để các thế hệ
              hiểu về cội nguồn, truyền thống và hành trình phát triển của dòng họ.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Landmark className="h-5 w-5 text-[#16a34a]" />
            <h2 className="text-xl font-bold text-[#0f172a]">Câu chuyện về tổ tiên</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {ancestorStories.map((story) => (
              <article key={story.id} className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-[#fcfefc]">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <p className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf3] px-2 py-1 text-[11px] font-semibold text-[#166534]">
                    <Flame className="h-3 w-3" />
                    {story.generation}
                  </p>
                  <h3 className="text-base font-semibold text-[#0f172a]">{story.title}</h3>
                  <p className="text-xs text-[#64748b]">{story.period}</p>
                  <p className="text-sm leading-6 text-[#475569]">{story.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-[#16a34a]" />
              <h2 className="text-xl font-bold text-[#0f172a]">Những kỷ niệm của gia đình</h2>
            </div>

            <div className="space-y-3">
              {familyMemories.map((memory) => (
                <div key={memory.id} className="rounded-xl border border-[#e2e8f0] bg-[#f8faf8] p-4">
                  <div className="flex items-start gap-3">
                    <span className="rounded-lg bg-[#dcfce7] px-2 py-1 text-xs font-bold text-[#166534]">
                      {memory.year}
                    </span>
                    <div>
                      <h3 className="font-semibold text-[#0f172a]">{memory.title}</h3>
                      <p className="mt-1 text-sm text-[#475569]">{memory.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <BookOpenText className="h-5 w-5 text-[#16a34a]" />
              <h2 className="text-xl font-bold text-[#0f172a]">Những sự kiện quan trọng</h2>
            </div>

            <div className="space-y-3">
              {importantEvents.map((event) => (
                <div key={event.id} className="rounded-xl border border-[#e2e8f0] bg-white p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="inline-flex items-center gap-1 text-xs font-semibold text-[#475569]">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {event.date}
                    </p>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${eventTone[event.kind]}`}>
                      {eventLabel[event.kind]}
                    </span>
                  </div>
                  <h3 className="mt-2 font-semibold text-[#0f172a]">{event.title}</h3>
                  <p className="mt-1 text-sm text-[#475569]">{event.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-[#bfdbfe] bg-[#eff6ff] p-3 text-sm text-[#1e3a8a]">
              <p className="inline-flex items-center gap-2 font-medium">
                <Star className="h-4 w-4" />
                Gợi ý: Bạn có thể dùng mục này để ghi lại các mốc giỗ tổ, lễ đoàn viên, thành tựu học tập của con cháu.
              </p>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
