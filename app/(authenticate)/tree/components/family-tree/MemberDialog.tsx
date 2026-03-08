import { useState } from "react";
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
  allMembers: FamilyMember[];
  parents: FamilyMember[];
  onClose: () => void;
  onSave: (member: Omit<FamilyMember, "id">) => void;
  onDelete?: () => void;
}

export const MemberDialog = ({
  open,
  member,
  initialValues,
  lockParentSelection = false,
  allMembers,
  parents,
  onClose,
  onSave,
  onDelete,
}: MemberDialogProps) => {
  const [name, setName] = useState(member?.name ?? initialValues?.name ?? "");
  const [birthYear, setBirthYear] = useState(
    member?.birthYear?.toString() ?? initialValues?.birthYear?.toString() ?? "",
  );
  const [deathYear, setDeathYear] = useState(
    member?.deathYear?.toString() ?? initialValues?.deathYear?.toString() ?? "",
  );
  const [gender, setGender] = useState<"male" | "female">(
    member?.gender ?? initialValues?.gender ?? "male",
  );
  const [parentId, setParentId] = useState<string>(member?.parentId ?? initialValues?.parentId ?? "");
  const [generation, setGeneration] = useState(member?.generation ?? initialValues?.generation ?? 1);
  const [spouseIds, setSpouseIds] = useState<string[]>(member?.spouseIds ?? initialValues?.spouseIds ?? []);
  const [imageUrl, setImageUrl] = useState(member?.imageUrl ?? initialValues?.imageUrl ?? "");
  const [spouseSearch, setSpouseSearch] = useState("");

  const handleParentChange = (value: string) => {
    setParentId(value === "none" ? "" : value);
    if (value !== "none") {
      const parent = parents.find((p) => p.id === value);
      if (parent) {
        setGeneration(parent.generation + 1);
      }
    }
  };

  const handleSave = () => {
    const parsedBirthYear = parseInt(birthYear);
    const parsedDeathYear = deathYear ? parseInt(deathYear) : undefined;

    onSave({
      name,
      birthYear: parsedBirthYear,
      deathYear: parsedDeathYear,
      gender,
      parentId: parentId || undefined,
      generation,
      spouseIds,
      imageUrl: imageUrl.trim() || undefined,
    });
    onClose();
  };

  const spouseCandidatePool = allMembers.filter((m) => {
    if (m.id === member?.id) return false;
    if (spouseIds.includes(m.id)) return true;
    return m.generation === generation;
  });

  const normalizedSpouseSearch = spouseSearch.trim().toLowerCase();
  const spouseCandidates = (
    normalizedSpouseSearch.length === 0
      ? spouseCandidatePool.filter((m) => spouseIds.includes(m.id))
      : spouseCandidatePool.filter((m) => m.name.toLowerCase().includes(normalizedSpouseSearch))
  ).slice(0, 30);

  const toggleSpouse = (candidateId: string) => {
    setSpouseIds((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId],
    );
  };

  const parsedBirthYear = parseInt(birthYear);
  const parsedDeathYear = deathYear ? parseInt(deathYear) : undefined;
  const hasValidYears =
    Number.isFinite(parsedBirthYear) &&
    parsedBirthYear > 1800 &&
    (!parsedDeathYear || parsedDeathYear >= parsedBirthYear);
  const isValid = name.trim().length > 1 && hasValidYears;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-[#E2E8F0] bg-[#FCFDFC] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-[#0F172A]">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#DCFCE7] text-[#166534]">
              <Sparkles className="h-4 w-4" />
            </span>
            {member ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Thông tin cơ bản</p>
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
              <div className="grid gap-2">
                <Label className="text-[#0F172A]">Giới tính</Label>
                <Select value={gender} onValueChange={(v: "male" | "female") => setGender(v)}>
                  <SelectTrigger className="border-[#E2E8F0] bg-white focus:ring-[#16A34A]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    sideOffset={8}
                    className="z-[80] border-[#E2E8F0] bg-white shadow-xl"
                  >
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageUrl" className="text-[#0F172A]">Ảnh đại diện (URL)</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Quan hệ gia đình</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label className="text-[#0F172A]">Cha/Mẹ</Label>
                <Select value={parentId || "none"} onValueChange={handleParentChange}>
                  <SelectTrigger
                    disabled={lockParentSelection}
                    className="border-[#E2E8F0] bg-white focus:ring-[#16A34A]/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <SelectValue placeholder="Chọn cha/mẹ..." />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    sideOffset={8}
                    className="z-[80] border-[#E2E8F0] bg-white shadow-xl"
                  >
                    <SelectItem value="none">Không có (Tổ tiên)</SelectItem>
                    {parents.map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.name} (Đời {parent.generation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Vợ / Chồng</p>
            <div className="mb-3 grid gap-2">
              <Label htmlFor="spouseSearch" className="text-[#0F172A]">Tìm theo tên (lọc cùng đời)</Label>
              <Input
                id="spouseSearch"
                value={spouseSearch}
                onChange={(e) => setSpouseSearch(e.target.value)}
                placeholder="Nhập tên để tìm..."
                className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
              />
              <p className="text-xs text-[#64748B]">
                {normalizedSpouseSearch.length === 0
                  ? "Nhập từ khóa để tìm nhanh. Khi chưa tìm, chỉ hiển thị người đã chọn."
                  : `Hiển thị tối đa 30 kết quả. Tìm thấy ${spouseCandidates.length} mục.`}
              </p>
            </div>
            <div className="max-h-44 space-y-2 overflow-auto rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
              {spouseCandidates.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {normalizedSpouseSearch.length === 0
                    ? "Chưa chọn vợ/chồng. Hãy nhập tên để tìm."
                    : "Không có kết quả phù hợp."}
                </p>
              ) : (
                spouseCandidates.map((candidate) => (
                  <label
                    key={candidate.id}
                    className={[
                      "flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm transition",
                      spouseIds.includes(candidate.id)
                        ? "border-[#16A34A] bg-[#DCFCE7] text-[#166534]"
                        : "border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAF8]",
                    ].join(" ")}
                  >
                    <span>
                      {candidate.name} (Đời {candidate.generation})
                    </span>
                    <input
                      type="checkbox"
                      checked={spouseIds.includes(candidate.id)}
                      onChange={() => toggleSpouse(candidate.id)}
                      className="h-4 w-4"
                    />
                  </label>
                ))
              )}
            </div>
          </div>

          {!hasValidYears && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              Năm mất phải lớn hơn hoặc bằng năm sinh, và năm sinh phải hợp lệ.
            </p>
          )}
        </div>

        <DialogFooter className="mt-2 flex gap-2">
          {member && onDelete && (
            <Button variant="destructive" onClick={onDelete} className="mr-auto">
              Xóa
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="border-[#E2E8F0]">
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={!isValid} className="bg-[#16A34A] text-white hover:bg-[#15803D]">
            {member ? "Lưu thay đổi" : "Thêm mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
