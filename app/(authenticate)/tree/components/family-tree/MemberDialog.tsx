import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { FamilyMember } from "../../types/FamilyTree";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";

interface MemberDialogProps {
  open: boolean;
  member?: FamilyMember | null;
  initialValues?: Partial<Omit<FamilyMember, "id">>;
  lockParentSelection?: boolean;
  lockGeneration?: boolean;
  allMembers: FamilyMember[];
  parents: FamilyMember[];
  onClose: () => void;
  onSave: (member: Omit<FamilyMember, "id">) => Promise<boolean>;
  onDelete?: () => void;
}

export const MemberDialog = ({
  open,
  member,
  initialValues,
  lockParentSelection = false,
  lockGeneration = false,
  allMembers,
  parents,
  onClose,
  onSave,
  onDelete,
}: MemberDialogProps) => {
  const [name, setName] = useState(member?.name ?? initialValues?.name ?? "");
  const [birthYear, setBirthYear] = useState(member?.birthYear?.toString() ?? initialValues?.birthYear?.toString() ?? "");
  const [deathYear, setDeathYear] = useState(member?.deathYear?.toString() ?? initialValues?.deathYear?.toString() ?? "");
  const [address, setAddress] = useState(member?.address ?? initialValues?.address ?? "");
  const [city, setCity] = useState(member?.city ?? initialValues?.city ?? "");
  const [country, setCountry] = useState(member?.country ?? initialValues?.country ?? "");
  const [phone, setPhone] = useState(member?.phone ?? initialValues?.phone ?? "");
  const [gender, setGender] = useState<"male" | "female" | "other">(member?.gender ?? initialValues?.gender ?? "other");
  const [parentId, setParentId] = useState<string>(member?.parentId ?? initialValues?.parentId ?? "");
  const [generation, setGeneration] = useState(member?.generation ?? initialValues?.generation ?? 1);
  const [spouseIds, setSpouseIds] = useState<string[]>(member?.spouseIds ?? initialValues?.spouseIds ?? []);
  const [parentSearch, setParentSearch] = useState(() => {
    const initialParentId = member?.parentId ?? initialValues?.parentId ?? "";
    if (!initialParentId) return "";
    return allMembers.find((m) => m.id === initialParentId)?.name ?? "";
  });
  const [spouseSearch, setSpouseSearch] = useState(() => {
    const initialSpouseIds = member?.spouseIds ?? initialValues?.spouseIds ?? [];
    if (!initialSpouseIds[0]) return "";
    return allMembers.find((m) => m.id === initialSpouseIds[0])?.name ?? "";
  });
  const [isParentDropdownOpen, setIsParentDropdownOpen] = useState(false);
  const [isSpouseDropdownOpen, setIsSpouseDropdownOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(member?.imageUrl ?? initialValues?.imageUrl ?? "");
  const [isDesktop, setIsDesktop] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const query = "(min-width: 1024px)";
    const mediaQuery = window.matchMedia(query);
    const update = () => setIsDesktop(mediaQuery.matches);
    update();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  const handleParentSelect = (parent: FamilyMember) => {
    setParentId(parent.id);
    setGeneration(parent.generation + 1);
    setParentSearch(parent.name);
    setIsParentDropdownOpen(false);
  };

  const handleSave = async () => {
    if (isSaving) return;
    const parsedBirthYear = birthYear ? parseInt(birthYear) : undefined;
    const parsedDeathYear = deathYear ? parseInt(deathYear) : undefined;
    const selectedParent = parentId ? allMembers.find((candidate) => candidate.id === parentId) : undefined;
    const finalGeneration =
      lockGeneration && selectedParent ? selectedParent.generation + 1 : generation;
    setIsSaving(true);
    const ok = await onSave({
      name,
      birthYear: parsedBirthYear,
      deathYear: parsedDeathYear,
      address: address.trim() || undefined,
      city: city.trim() || undefined,
      country: country.trim() || undefined,
      phone: phone.trim() || undefined,
      gender,
      parentId: parentId || undefined,
      generation: finalGeneration,
      spouseIds,
      imageUrl: imageUrl.trim() || undefined,
    });
    setIsSaving(false);
    if (ok) {
      onClose();
    }
  };

  const deferredParentSearch = useDeferredValue(parentSearch);
  const deferredSpouseSearch = useDeferredValue(spouseSearch);

  const availableParents = useMemo(
    () => parents.filter((candidate) => candidate.id !== member?.id),
    [parents, member?.id],
  );
  const normalizedParentSearch = deferredParentSearch.trim().toLowerCase();
  const hasParentQuery = normalizedParentSearch.length > 0;
  const parentCandidates = useMemo(
    () =>
      availableParents
        .filter((candidate) =>
          hasParentQuery ? candidate.name.toLowerCase().includes(normalizedParentSearch) : true,
        )
        .slice(0, 40),
    [availableParents, hasParentQuery, normalizedParentSearch],
  );

  const spouseCandidatePool = useMemo(
    () =>
      allMembers.filter((m) => {
        if (m.id === member?.id) return false;
        if (spouseIds.includes(m.id)) return true;
        return m.generation === generation;
      }),
    [allMembers, generation, member?.id, spouseIds],
  );

  const normalizedSpouseSearch = deferredSpouseSearch.trim().toLowerCase();
  const hasSpouseQuery = normalizedSpouseSearch.length > 0;
  const spouseCandidates = useMemo(
    () =>
      spouseCandidatePool
        .filter((candidate) =>
          hasSpouseQuery ? candidate.name.toLowerCase().includes(normalizedSpouseSearch) : true,
        )
        .slice(0, 30),
    [hasSpouseQuery, normalizedSpouseSearch, spouseCandidatePool],
  );

  const toggleSpouse = (candidate: FamilyMember) => {
    const next = spouseIds.includes(candidate.id)
      ? spouseIds.filter((id) => id !== candidate.id)
      : [...spouseIds, candidate.id];
    setSpouseIds(next);
    setSpouseSearch(candidate.name);
    setIsSpouseDropdownOpen(false);
  };

  const parsedBirthYear = birthYear ? parseInt(birthYear) : undefined;
  const parsedDeathYear = deathYear ? parseInt(deathYear) : undefined;
  const hasValidYears =
    (parsedBirthYear === undefined || (Number.isFinite(parsedBirthYear) && parsedBirthYear > 0)) &&
    (parsedDeathYear === undefined ||
      (Number.isFinite(parsedDeathYear) &&
        (parsedBirthYear === undefined || parsedDeathYear >= parsedBirthYear)));
  const isValid = name.trim().length > 1 && hasValidYears;

  useEffect(() => {
    if (!lockGeneration || !parentId) return;
    const selectedParent = allMembers.find((candidate) => candidate.id === parentId);
    if (!selectedParent) return;
    const nextGeneration = selectedParent.generation + 1;
    if (generation !== nextGeneration) {
      setGeneration(nextGeneration);
    }
  }, [allMembers, generation, lockGeneration, parentId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-[#E2E8F0] bg-[#FCFDFC] sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-[#0F172A]">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#DCFCE7] text-[#166534]">
              <Sparkles className="h-4 w-4" />
            </span>
            {member ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}
          </DialogTitle>
        </DialogHeader>

        {isDesktop ? (
          <div className="grid gap-4 py-2 lg:grid-cols-2">
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Thông tin cơ bản
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="name" className="text-[#0F172A]">Họ và tên</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập họ và tên..."
                    className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="birthYear" className="text-[#0F172A]">Năm sinh</Label>
                  <Input
                    id="birthYear"
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    placeholder="VD: 1990"
                    className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deathYear" className="text-[#0F172A]">Năm mất (nếu có)</Label>
                  <Input
                    id="deathYear"
                    type="number"
                    value={deathYear}
                    onChange={(e) => setDeathYear(e.target.value)}
                    placeholder="Để trống nếu còn sống"
                    className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
                  />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label className="text-[#0F172A]">Giới tính</Label>
                  <Select
                    value={gender}
                    onValueChange={(v: "male" | "female" | "other") => setGender(v)}
                  >
                    <SelectTrigger className="border-[#E2E8F0] bg-white focus:ring-[#16A34A]/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" sideOffset={8} className="z-[80] border-[#E2E8F0] bg-white shadow-xl">
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác/Không rõ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2 md:col-span-2 border-t border-[#E2E8F0] pt-3">
                  <Label htmlFor="spouseSearch" className="text-[#0F172A]">Vợ / Chồng</Label>
                  <div className="relative">
                    <Input
                      id="spouseSearch"
                      value={spouseSearch}
                      onChange={(e) => {
                        setSpouseSearch(e.target.value);
                        setIsSpouseDropdownOpen(true);
                      }}
                      onFocus={() => setIsSpouseDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setIsSpouseDropdownOpen(false), 120)}
                      placeholder="Nhập tên để tìm..."
                      className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
                    />
                    {hasSpouseQuery && isSpouseDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-36 space-y-2 overflow-auto rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3 shadow-md">
                        {spouseCandidates.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Không có kết quả phù hợp.</p>
                        ) : (
                          spouseCandidates.map((candidate) => (
                            <button
                              key={candidate.id}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => toggleSpouse(candidate)}
                              className={[
                                "flex w-full items-center rounded-md border px-3 py-2 text-left text-sm transition",
                                spouseIds.includes(candidate.id)
                                  ? "border-[#16A34A] bg-[#DCFCE7] text-[#166534]"
                                  : "border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAF8]",
                              ].join(" ")}
                            >
                              <span>{candidate.name}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Quan hệ gia đình
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label className="text-[#0F172A]">Cha/Mẹ</Label>
                  <div className="relative">
                    <Input
                      id="parentSearch"
                      value={parentSearch}
                      onChange={(e) => {
                        setParentSearch(e.target.value);
                        setIsParentDropdownOpen(true);
                      }}
                      onFocus={() => setIsParentDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setIsParentDropdownOpen(false), 120)}
                      placeholder="Nhập để tìm cha/mẹ theo tên..."
                      disabled={lockParentSelection}
                      className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    {!lockParentSelection && hasParentQuery && isParentDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-36 space-y-2 overflow-auto rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-2 shadow-md">
                        {parentCandidates.length === 0 ? (
                          <p className="px-1 text-xs text-[#64748B]">Không tìm thấy kết quả phù hợp.</p>
                        ) : (
                          parentCandidates.map((parent) => (
                            <button
                              key={parent.id}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleParentSelect(parent)}
                              className={[
                                "flex w-full items-center rounded-md border px-2 py-1.5 text-left text-sm transition",
                                parentId === parent.id
                                  ? "border-[#16A34A] bg-[#DCFCE7] text-[#166534]"
                                  : "border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAF8]",
                              ].join(" ")}
                            >
                              <span>{parent.name}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  {lockParentSelection && (
                    <p className="text-xs text-[#64748B]">
                      Đang thêm vợ/chồng nên không chọn quan hệ cha/mẹ cho thành viên này.
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[#0F172A]">Đời thứ</Label>
                    <Input
                      type="number"
                      value={generation}
                      onChange={(e) => setGeneration(parseInt(e.target.value) || 1)}
                      min={-1}
                      max={20}
                      disabled={lockGeneration}
                      className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
                    />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="imageUrl" className="text-[#0F172A]">Ảnh đại diện (URL)</Label>
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
                    />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="address" className="text-[#0F172A]">Địa chỉ</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Số nhà, đường..."
                      className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="city" className="text-[#0F172A]">Thành phố</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="VD: Hà Nội"
                      className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country" className="text-[#0F172A]">Quốc gia</Label>
                    <Input
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="VD: Việt Nam"
                      className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
                    />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="phone" className="text-[#0F172A]">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+84 9xx xxx xxx"
                      className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
                    />
                  </div>
              </div>
            </div>

            {!hasValidYears && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 lg:col-span-2">
                Năm mất phải lớn hơn hoặc bằng năm sinh, và năm sinh phải hợp lệ.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Thông tin cơ bản</p>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-[#0F172A]">Họ và tên</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập họ và tên..." className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="birthYear" className="text-[#0F172A]">Năm sinh</Label>
                  <Input id="birthYear" type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} placeholder="VD: 1990" className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deathYear" className="text-[#0F172A]">Năm mất (nếu có)</Label>
                  <Input id="deathYear" type="number" value={deathYear} onChange={(e) => setDeathYear(e.target.value)} placeholder="Để trống nếu còn sống" className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[#0F172A]">Giới tính</Label>
                  <Select
                    value={gender}
                    onValueChange={(v: "male" | "female" | "other") => setGender(v)}
                  >
                    <SelectTrigger className="border-[#E2E8F0] bg-white focus:ring-[#16A34A]/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" sideOffset={8} className="z-[80] border-[#E2E8F0] bg-white shadow-xl">
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác/Không rõ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2 border-t border-[#E2E8F0] pt-3">
                  <Label htmlFor="spouseSearchMobile" className="text-[#0F172A]">Vợ / Chồng</Label>
                  <div className="relative">
                    <Input
                      id="spouseSearchMobile"
                      value={spouseSearch}
                      onChange={(e) => {
                        setSpouseSearch(e.target.value);
                        setIsSpouseDropdownOpen(true);
                      }}
                      onFocus={() => setIsSpouseDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setIsSpouseDropdownOpen(false), 120)}
                      placeholder="Nhập tên để tìm..."
                      className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
                    />
                    {hasSpouseQuery && isSpouseDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 space-y-2 overflow-auto rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3 shadow-md">
                        {spouseCandidates.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Không có kết quả phù hợp.</p>
                        ) : (
                          spouseCandidates.map((candidate) => (
                            <button
                              key={candidate.id}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => toggleSpouse(candidate)}
                              className={[
                                "flex w-full items-center rounded-md border px-3 py-2 text-left text-sm transition",
                                spouseIds.includes(candidate.id)
                                  ? "border-[#16A34A] bg-[#DCFCE7] text-[#166534]"
                                  : "border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAF8]",
                              ].join(" ")}
                            >
                              <span>{candidate.name}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Quan hệ gia đình</p>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label className="text-[#0F172A]">Cha/Mẹ</Label>
                  <div className="relative">
                    <Input
                      id="parentSearchMobile"
                      value={parentSearch}
                      onChange={(e) => {
                        setParentSearch(e.target.value);
                        setIsParentDropdownOpen(true);
                      }}
                      onFocus={() => setIsParentDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setIsParentDropdownOpen(false), 120)}
                      placeholder="Nhập để tìm cha/mẹ theo tên..."
                      disabled={lockParentSelection}
                      className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    {!lockParentSelection && hasParentQuery && isParentDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-36 space-y-2 overflow-auto rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-2 shadow-md">
                        {parentCandidates.length === 0 ? (
                          <p className="px-1 text-xs text-[#64748B]">Không tìm thấy kết quả phù hợp.</p>
                        ) : (
                          parentCandidates.map((parent) => (
                            <button
                              key={parent.id}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleParentSelect(parent)}
                              className={[
                                "flex w-full items-center rounded-md border px-2 py-1.5 text-left text-sm transition",
                                parentId === parent.id
                                  ? "border-[#16A34A] bg-[#DCFCE7] text-[#166534]"
                                  : "border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAF8]",
                              ].join(" ")}
                            >
                              <span>{parent.name}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[#0F172A]">Đời thứ</Label>
                  <Input
                    type="number"
                    value={generation}
                    onChange={(e) => setGeneration(parseInt(e.target.value) || 1)}
                    min={-1}
                    max={20}
                    disabled={lockGeneration}
                    className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imageUrl" className="text-[#0F172A]">Ảnh đại diện (URL)</Label>
                  <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address" className="text-[#0F172A]">Địa chỉ</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Số nhà, đường..." className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city" className="text-[#0F172A]">Thành phố</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="VD: Hà Nội" className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country" className="text-[#0F172A]">Quốc gia</Label>
                  <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="VD: Việt Nam" className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-[#0F172A]">Số điện thoại</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+84 9xx xxx xxx" className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20" />
                </div>
              </div>
            </div>

            {!hasValidYears && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                Năm mất phải lớn hơn hoặc bằng năm sinh, và năm sinh phải hợp lệ.
              </p>
            )}
          </div>
        )}

        <DialogFooter className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          {member && onDelete && (
            <Button variant="destructive" onClick={onDelete} className="mr-auto">
              Xóa
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="border-[#E2E8F0]">
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid || isSaving}
            className="bg-[#16A34A] text-white hover:bg-[#15803D]"
          >
            {isSaving ? "Đang lưu..." : member ? "Lưu thay đổi" : "Thêm mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
