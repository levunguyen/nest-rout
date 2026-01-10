import { useState, useEffect } from "react";
import { FamilyMember } from "../../types/FamilyTree";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface MemberDialogProps {
  open: boolean;
  member?: FamilyMember | null;
  parents: FamilyMember[];
  onClose: () => void;
  onSave: (member: Omit<FamilyMember, "id">) => void;
  onDelete?: () => void;
}

export const MemberDialog = ({
  open,
  member,
  parents,
  onClose,
  onSave,
  onDelete,
}: MemberDialogProps) => {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [deathYear, setDeathYear] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [parentId, setParentId] = useState<string>("");
  const [generation, setGeneration] = useState(1);

  useEffect(() => {
    if (member) {
      setName(member.name);
      setBirthYear(member.birthYear.toString());
      setDeathYear(member.deathYear?.toString() || "");
      setGender(member.gender);
      setParentId(member.parentId || "");
      setGeneration(member.generation);
    } else {
      setName("");
      setBirthYear("");
      setDeathYear("");
      setGender("male");
      setParentId("");
      setGeneration(1);
    }
  }, [member, open]);

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
    onSave({
      name,
      birthYear: parseInt(birthYear),
      deathYear: deathYear ? parseInt(deathYear) : undefined,
      gender,
      parentId: parentId || undefined,
      generation,
    });
    onClose();
  };

  const isValid = name.trim() && birthYear && parseInt(birthYear) > 1800;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {member ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ và tên..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="birthYear">Năm sinh</Label>
              <Input
                id="birthYear"
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="VD: 1990"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deathYear">Năm mất (nếu có)</Label>
              <Input
                id="deathYear"
                type="number"
                value={deathYear}
                onChange={(e) => setDeathYear(e.target.value)}
                placeholder="Để trống nếu còn sống"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Giới tính</Label>
            <Select value={gender} onValueChange={(v: "male" | "female") => setGender(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Cha/Mẹ</Label>
            <Select value={parentId || "none"} onValueChange={handleParentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn cha/mẹ..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không có (Tổ tiên)</SelectItem>
                {parents.map((parent) => (
                  <SelectItem key={parent.id} value={parent.id}>
                    {parent.name} (Đời {parent.generation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Đời thứ</Label>
            <Input
              type="number"
              value={generation}
              onChange={(e) => setGeneration(parseInt(e.target.value) || 1)}
              min={1}
              max={10}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          {member && onDelete && (
            <Button variant="destructive" onClick={onDelete} className="mr-auto">
              Xóa
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {member ? "Lưu thay đổi" : "Thêm mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
