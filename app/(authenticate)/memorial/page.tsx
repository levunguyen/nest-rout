"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Camera,
  ChevronDown,
  Copy,
  Heart,
  Loader2,
  PlayCircle,
  Search,
  Share2,
  TreePine,
  UserRound,
  X,
} from "lucide-react";

type FamilyMember = {
  id: string;
  fullName: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  birthYear?: number | null;
  deathYear?: number | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  generation: number;
  parentId?: string | null;
  spouseIds: string[];
  imageUrl?: string | null;
  relation?: string | null;
  note?: string | null;
};

type TimelineItem = {
  year: string;
  title: string;
  description: string;
};

type VideoItem = {
  id: string;
  title: string;
  description: string;
  src: string;
  thumbnail: string;
};

type AlbumItem = {
  id: string;
  title: string;
  src: string;
};

const fallbackPortrait = "/images/grandfather.png";
const fallbackCover = "/images/hero-memorial.jpg";

export default function MemorialPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState("");

  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState(-1);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const [activeVideoId, setActiveVideoId] = useState("v1");
  const [activeAlbum, setActiveAlbum] = useState<AlbumItem | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setIsLoadingMembers(true);
        setMembersError("");
        const response = await fetch("/api/family-members", { cache: "no-store" });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          setMembersError(result?.error ?? "Không thể tải danh sách thành viên.");
          return;
        }

        const rows = Array.isArray(result?.data) ? (result.data as FamilyMember[]) : [];
        setMembers(rows);
      } catch {
        setMembersError("Không thể tải danh sách thành viên.");
      } finally {
        setIsLoadingMembers(false);
      }
    };

    loadMembers();
  }, []);

  useEffect(() => {
    if (members.length === 0) return;

    const fromUrl = searchParams.get("memberId");
    const existsFromUrl = fromUrl ? members.some((member) => member.id === fromUrl) : false;
    const defaultMember = members.find((member) => member.deathYear != null) ?? members[0];
    const nextId = existsFromUrl && fromUrl ? fromUrl : defaultMember?.id ?? "";

    setSelectedMemberId((current) => (current ? current : nextId));
  }, [members, searchParams]);

  const selectableMembers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const base = members.filter((member) => member.deathYear != null);
    if (!normalized) return base;
    return base.filter((member) => {
      return (
        member.fullName.toLowerCase().includes(normalized) ||
        (member.relation ?? "").toLowerCase().includes(normalized) ||
        String(member.generation).includes(normalized)
      );
    });
  }, [members, query]);

  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedMemberId) ?? null,
    [members, selectedMemberId],
  );

  useEffect(() => {
    if (!selectedMember) return;
    setQuery(selectedMember.fullName);
  }, [selectedMember]);

  const parentMember = useMemo(() => {
    if (!selectedMember?.parentId) return null;
    return members.find((member) => member.id === selectedMember.parentId) ?? null;
  }, [members, selectedMember]);

  const spouseMembers = useMemo(() => {
    if (!selectedMember) return [];
    return members.filter((member) => selectedMember.spouseIds.includes(member.id));
  }, [members, selectedMember]);

  const childMembers = useMemo(() => {
    if (!selectedMember) return [];
    return members.filter((member) => member.parentId === selectedMember.id);
  }, [members, selectedMember]);

  const lifeSpan = useMemo(() => {
    if (!selectedMember) return "";
    const birth = selectedMember.birthYear ?? "?";
    const death = selectedMember.deathYear ?? "?";
    return `${birth} - ${death}`;
  }, [selectedMember]);

  const memorialRole = useMemo(() => {
    if (!selectedMember) return "";
    if (selectedMember.relation?.trim()) return selectedMember.relation;
    return `Đời thứ ${selectedMember.generation}`;
  }, [selectedMember]);

  const locationLabel = useMemo(() => {
    if (!selectedMember) return "";
    const parts = [selectedMember.city, selectedMember.country].filter(Boolean);
    return parts.join(", ");
  }, [selectedMember]);

  const timelineItems: TimelineItem[] = useMemo(() => {
    if (!selectedMember) return [];

    const items: TimelineItem[] = [];

    if (selectedMember.birthYear) {
      items.push({
        year: String(selectedMember.birthYear),
        title: `Sinh ra trong dòng họ`,
        description: locationLabel
          ? `Quê quán ghi nhận tại ${locationLabel}.`
          : "Bắt đầu hành trình cuộc đời trong đại gia đình.",
      });
    }

    items.push({
      year: selectedMember.birthYear ? String(selectedMember.birthYear + 22) : "Trưởng thành",
      title: "Giai đoạn trưởng thành",
      description: selectedMember.note?.trim()
        ? selectedMember.note
        : `${selectedMember.fullName} luôn được nhắc đến với sự gắn bó cùng gia đình và họ tộc.`,
    });

    if (spouseMembers.length > 0) {
      items.push({
        year: "Hôn phối",
        title: "Gắn kết gia đình",
        description: `Đồng hành cùng ${spouseMembers.map((person) => person.fullName).join(", ")}.`,
      });
    }

    if (childMembers.length > 0) {
      items.push({
        year: "Gia đạo",
        title: "Nuôi dưỡng thế hệ sau",
        description: `Là cha/mẹ của ${childMembers.length} người con, tiếp nối truyền thống gia đình.`,
      });
    }

    if (selectedMember.deathYear) {
      items.push({
        year: String(selectedMember.deathYear),
        title: "An nghỉ",
        description: "Con cháu gìn giữ ký ức và các giá trị tốt đẹp mà người đã để lại.",
      });
    }

    return items;
  }, [childMembers.length, locationLabel, selectedMember, spouseMembers]);

  const videos: VideoItem[] = useMemo(() => {
    if (!selectedMember) return [];
    return [
      {
        id: "v1",
        title: `Tư liệu tưởng niệm ${selectedMember.fullName}`,
        description: "Video ghi lại những khoảnh khắc đáng nhớ của gia đình.",
        src: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        thumbnail: selectedMember.imageUrl || fallbackCover,
      },
      {
        id: "v2",
        title: "Lời kể của con cháu",
        description: "Những chia sẻ và câu chuyện truyền lại trong dòng họ.",
        src: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        thumbnail: fallbackCover,
      },
    ];
  }, [selectedMember]);

  const albums: AlbumItem[] = useMemo(() => {
    if (!selectedMember) return [];
    return [
      { id: "a1", title: `Chân dung ${selectedMember.fullName}`, src: selectedMember.imageUrl || fallbackPortrait },
      { id: "a2", title: "Ngày đoàn viên", src: "/images/hero-memorial.jpg" },
      { id: "a3", title: "Lễ tưởng niệm", src: "/images/grandmother.png" },
      { id: "a4", title: "Tảo mộ", src: "/images/grave-1.jpg" },
      { id: "a5", title: "Nhà thờ họ", src: "/images/grave-2.jpg" },
      { id: "a6", title: "Kỷ niệm gia đình", src: "/images/grave-3.jpg" },
    ];
  }, [selectedMember]);

  useEffect(() => {
    if (videos.length > 0) {
      setActiveVideoId(videos[0].id);
    }
  }, [videos]);

  const activeVideo = useMemo(
    () => videos.find((video) => video.id === activeVideoId) ?? videos[0],
    [activeVideoId, videos],
  );

  const selectMember = (member: FamilyMember) => {
    setSelectedMemberId(member.id);
    setQuery(member.fullName);
    setIsDropdownOpen(false);
    setActiveOptionIndex(-1);
    router.replace(`/memorial?memberId=${member.id}`, { scroll: false });
  };

  const onCopyShareLink = async () => {
    if (!selectedMemberId) return;
    try {
      const url = `${window.location.origin}/memorial?memberId=${selectedMemberId}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7f4] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-lg font-semibold text-[#0f172a]">Tìm người để mở trang tưởng niệm</h2>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsDropdownOpen(true);
                setActiveOptionIndex(-1);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={(event) => {
                if (!isDropdownOpen && event.key === "ArrowDown") {
                  setIsDropdownOpen(true);
                  return;
                }
                if (!selectableMembers.length) return;

                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActiveOptionIndex((current) => (current + 1) % selectableMembers.length);
                }
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActiveOptionIndex((current) =>
                    current <= 0 ? selectableMembers.length - 1 : current - 1,
                  );
                }
                if (event.key === "Enter" && activeOptionIndex >= 0) {
                  event.preventDefault();
                  selectMember(selectableMembers[activeOptionIndex]);
                }
                if (event.key === "Escape") {
                  setIsDropdownOpen(false);
                  setActiveOptionIndex(-1);
                }
              }}
              placeholder="Nhập tên người đã mất..."
              className="w-full rounded-xl border border-[#d1d5db] bg-white py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20"
            />
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />

            {isDropdownOpen && (
              <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-[#e2e8f0] bg-white p-1 shadow-lg">
                {isLoadingMembers ? (
                  <div className="flex items-center gap-2 px-3 py-3 text-sm text-[#64748b]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải danh sách thành viên...
                  </div>
                ) : membersError ? (
                  <div className="px-3 py-3 text-sm text-[#b91c1c]">{membersError}</div>
                ) : selectableMembers.length === 0 ? (
                  <div className="px-3 py-3 text-sm text-[#64748b]">Không tìm thấy người phù hợp.</div>
                ) : (
                  selectableMembers.map((member, index) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => selectMember(member)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                        index === activeOptionIndex
                          ? "bg-[#f0fdf4] text-[#14532d]"
                          : "text-[#0f172a] hover:bg-[#f8fafc]"
                      }`}
                    >
                      <span className="font-medium">{member.fullName}</span>
                      <span className="text-xs text-[#64748b]">Đời {member.generation}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </section>

        {!selectedMember ? (
          <section className="rounded-2xl border border-dashed border-[#cbd5e1] bg-white p-8 text-center text-sm text-[#64748b]">
            Chưa có dữ liệu người đã mất để hiển thị memorial. Hãy thêm thành viên và chọn người cần tưởng niệm.
          </section>
        ) : (
          <>
            <section className="relative overflow-hidden rounded-3xl border border-[#dbe6da] bg-gradient-to-br from-[#f6fffa] via-white to-[#eef9f1] p-6 shadow-sm md:p-8">
              <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#16a34a]/10 blur-3xl" />
              <div className="relative grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
                <div className="mx-auto h-44 w-44 overflow-hidden rounded-full border-4 border-white shadow-lg md:h-52 md:w-52">
                  <Image
                    src={selectedMember.imageUrl || fallbackPortrait}
                    alt={selectedMember.fullName}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-[#16a34a]/30 bg-[#dcfce7] px-3 py-1 text-xs font-semibold text-[#166534]">
                    <Heart className="h-3.5 w-3.5" />
                    Trang tưởng niệm gia đình
                  </p>
                  <h1 className="mt-4 text-3xl font-bold text-[#0f172a] md:text-5xl">{selectedMember.fullName}</h1>
                  <p className="mt-2 text-sm font-medium text-[#166534] md:text-base">
                    {lifeSpan} • {memorialRole}
                  </p>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-[#334155] md:text-base">
                    “{selectedMember.note?.trim() || `${selectedMember.fullName} luôn được con cháu tưởng nhớ và trân trọng.`}”
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={onCopyShareLink}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#16a34a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15803d]"
                    >
                      <Share2 className="h-4 w-4" />
                      Chia sẻ link
                    </button>
                    <button
                      type="button"
                      onClick={onCopyShareLink}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#cbd5e1] bg-white px-4 py-2.5 text-sm font-semibold text-[#334155] hover:bg-[#f8fafc]"
                    >
                      <Copy className="h-4 w-4" />
                      {copied ? "Đã sao chép" : "Sao chép liên kết"}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
              <article className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm md:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-[#16a34a]" />
                  <h2 className="text-xl font-bold text-[#0f172a]">Timeline cuộc đời</h2>
                </div>
                <div className="space-y-4">
                  {timelineItems.map((item) => (
                    <div
                      key={item.year + item.title}
                      className="relative rounded-xl border border-[#e2e8f0] bg-[#f8faf8] p-4 pl-14"
                    >
                      <div className="absolute left-4 top-4 rounded-lg bg-[#dcfce7] px-2 py-1 text-xs font-bold text-[#166534]">
                        {item.year}
                      </div>
                      <p className="font-semibold text-[#0f172a]">{item.title}</p>
                      <p className="mt-1 text-sm text-[#475569]">{item.description}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm md:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-[#16a34a]" />
                  <h2 className="text-xl font-bold text-[#0f172a]">Video kỷ niệm</h2>
                </div>

                {activeVideo ? (
                  <>
                    <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-black">
                      <video key={activeVideo.id} src={activeVideo.src} controls className="h-[230px] w-full object-contain" />
                    </div>
                    <h3 className="mt-3 font-semibold text-[#0f172a]">{activeVideo.title}</h3>
                    <p className="mt-1 text-sm text-[#475569]">{activeVideo.description}</p>
                  </>
                ) : null}

                <div className="mt-4 grid gap-2">
                  {videos.map((video) => (
                    <button
                      key={video.id}
                      type="button"
                      onClick={() => setActiveVideoId(video.id)}
                      className={`flex items-center gap-3 rounded-lg border p-2 text-left transition ${
                        video.id === activeVideoId
                          ? "border-[#16a34a] bg-[#f0fdf4]"
                          : "border-[#e2e8f0] bg-white hover:bg-[#f8fafc]"
                      }`}
                    >
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        width={96}
                        height={64}
                        className="h-14 w-20 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#0f172a]">{video.title}</p>
                        <p className="line-clamp-1 text-xs text-[#64748b]">{video.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </article>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <article className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm md:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-[#16a34a]" />
                  <h2 className="text-xl font-bold text-[#0f172a]">Album ảnh kỷ niệm</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {albums.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveAlbum(item)}
                      className="group overflow-hidden rounded-xl border border-[#e2e8f0] bg-[#f8faf8] text-left"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={item.src}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <p className="px-3 py-2 text-sm font-medium text-[#0f172a]">{item.title}</p>
                    </button>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm md:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-[#16a34a]" />
                  <h2 className="text-xl font-bold text-[#0f172a]">Cây gia phả của người đó</h2>
                </div>

                <div className="space-y-3">
                  {parentMember ? (
                    <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3">
                      <p className="text-sm font-semibold text-[#0f172a]">{parentMember.fullName}</p>
                      <p className="text-xs text-[#64748b]">Cha/Mẹ</p>
                    </div>
                  ) : null}

                  <div className="rounded-xl border border-[#16a34a]/20 bg-[#f0fdf4] p-3">
                    <p className="text-sm font-semibold text-[#166534]">{selectedMember.fullName}</p>
                    <p className="text-xs text-[#15803d]">Người được tưởng niệm</p>
                  </div>

                  {spouseMembers.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#16a34a]">Phối ngẫu</p>
                      {spouseMembers.map((spouse) => (
                        <div key={spouse.id} className="rounded-lg border border-[#e2e8f0] bg-white p-3">
                          <p className="text-sm font-semibold text-[#0f172a]">{spouse.fullName}</p>
                          <p className="text-xs text-[#64748b]">Đời {spouse.generation}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {childMembers.length > 0 ? (
                    <div className="border-l-2 border-dashed border-[#86efac] pl-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#16a34a]">Con cái</p>
                      <div className="space-y-2">
                        {childMembers.map((node) => (
                          <div key={node.id} className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3">
                            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
                              <UserRound className="h-4 w-4 text-[#16a34a]" />
                              {node.fullName}
                            </p>
                            <p className="mt-1 text-xs text-[#64748b]">Đời {node.generation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[#64748b]">Chưa có dữ liệu con cái trong gia phả.</p>
                  )}
                </div>
              </article>
            </section>
          </>
        )}
      </div>

      {activeAlbum ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-white">
            <button
              type="button"
              onClick={() => setActiveAlbum(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-[#0f172a] hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative h-[68vh] bg-black">
              <Image src={activeAlbum.src} alt={activeAlbum.title} fill sizes="100vw" className="object-contain" />
            </div>
            <p className="border-t border-[#e2e8f0] px-4 py-3 text-sm font-semibold text-[#0f172a]">{activeAlbum.title}</p>
          </div>
        </div>
      ) : null}

    </main>
  );
}
