import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FamilyMember, Donation } from "../types/donation";
import { Coins, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface AddDonationDialogProps {
    members: FamilyMember[];
    onAddDonation: (donation: Omit<Donation, "id">) => void;
}

const purposes = [
    "Xây dựng nhà thờ họ",
    "Giỗ tổ",
    "Tu sửa mộ phần",
    "Quỹ học bổng",
    "Hoạt động từ thiện",
    "Khác",
];

export function AddDonationDialog({ members, onAddDonation }: AddDonationDialogProps) {
    const [open, setOpen] = useState(false);
    const [memberId, setMemberId] = useState("");
    const [amount, setAmount] = useState("");
    const [purpose, setPurpose] = useState("");
    const [note, setNote] = useState("");

    const handleSubmit = () => {
        if (!memberId || !amount || !purpose) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        const member = members.find((m) => m.id === memberId);
        if (!member) return;

        onAddDonation({
            memberId,
            memberName: member.name,
            amount: parseFloat(amount),
            purpose,
            date: new Date().toISOString().split("T")[0],
            note: note || undefined,
        });

        toast.success("Đã thêm đóng góp thành công!");
        setOpen(false);
        setMemberId("");
        setAmount("");
        setPurpose("");
        setNote("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 rounded-lg bg-[#16A34A] px-4 py-2.5 text-white hover:bg-[#15803D]">
                    <Plus className="h-4 w-4" />
                    Thêm đóng góp
                </Button>
            </DialogTrigger>
            <DialogContent className="border-[#E2E8F0] bg-[#FCFDFC] sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl text-[#0F172A]">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#DCFCE7] text-[#166534]">
                            <Sparkles className="h-4 w-4" />
                        </span>
                        Ghi nhận đóng góp mới
                    </DialogTitle>
                    <DialogDescription className="text-[#64748B]">
                        Lưu trữ một lần đóng góp vào sổ quỹ của gia đình.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                            Thông tin đóng góp
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="grid gap-2 sm:col-span-2">
                                <Label htmlFor="member" className="text-[#0F172A]">Thành viên</Label>
                                <Select value={memberId} onValueChange={setMemberId}>
                                    <SelectTrigger className="border-[#E2E8F0] bg-white focus:ring-[#16A34A]/20">
                                        <SelectValue placeholder="Chọn thành viên đóng góp" />
                                    </SelectTrigger>
                                    <SelectContent
                                        position="popper"
                                        side="bottom"
                                        sideOffset={8}
                                        className="z-[120] max-h-64 border-[#E2E8F0] bg-white shadow-xl"
                                    >
                                        {members.map((member) => (
                                            <SelectItem key={member.id} value={member.id}>
                                                {member.avatar} {member.name} - {member.relationship}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="amount" className="text-[#0F172A]">Số tiền (VNĐ)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="Ví dụ: 2000000"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="purpose" className="text-[#0F172A]">Mục đích</Label>
                                <Select value={purpose} onValueChange={setPurpose}>
                                    <SelectTrigger className="border-[#E2E8F0] bg-white focus:ring-[#16A34A]/20">
                                        <SelectValue placeholder="Chọn mục đích đóng góp" />
                                    </SelectTrigger>
                                    <SelectContent
                                        position="popper"
                                        side="top"
                                        sideOffset={8}
                                        className="z-[120] max-h-64 border-[#E2E8F0] bg-white shadow-xl"
                                    >
                                        {purposes.map((p) => (
                                            <SelectItem key={p} value={p}>
                                                {p}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                        <Label htmlFor="note" className="mb-2 block text-[#0F172A]">Ghi chú (tùy chọn)</Label>
                        <Textarea
                            id="note"
                            placeholder="Ví dụ: Đóng góp đợt đầu cho quỹ xây nhà thờ họ..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="min-h-24 border-[#E2E8F0] focus-visible:ring-[#16A34A]/20"
                        />
                    </div>

                    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                        <p className="inline-flex items-center gap-2 text-sm font-medium text-[#0F172A]">
                            <Coins className="h-4 w-4 text-[#16A34A]" />
                            Lưu ý
                        </p>
                        <p className="mt-1 text-xs text-[#64748B]">
                            Sau khi lưu, khoản đóng góp sẽ xuất hiện ngay trong lịch sử và thống kê theo năm.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} className="border-[#E2E8F0]">
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} className="bg-[#16A34A] text-white hover:bg-[#15803D]">
                        <Plus className="mr-1 h-4 w-4" />
                        Lưu đóng góp
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
