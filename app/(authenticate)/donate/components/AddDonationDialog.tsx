import { useState } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { FamilyMember, Donation } from "../types/donation";
import { Plus } from "lucide-react";
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
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4" />
                    Thêm đóng góp
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thêm đóng góp mới</DialogTitle>
                    <DialogDescription>
                        Ghi nhận đóng góp của thành viên trong gia đình
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="member">Thành viên</Label>
                        <Select value={memberId} onValueChange={setMemberId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn thành viên" />
                            </SelectTrigger>
                            <SelectContent>
                                {members.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                        {member.avatar} {member.name} - {member.relationship}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Số tiền (VNĐ)</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="Nhập số tiền"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="purpose">Mục đích</Label>
                        <Select value={purpose} onValueChange={setPurpose}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn mục đích" />
                            </SelectTrigger>
                            <SelectContent>
                                {purposes.map((p) => (
                                    <SelectItem key={p} value={p}>
                                        {p}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                        <Textarea
                            id="note"
                            placeholder="Thêm ghi chú..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit}>Lưu đóng góp</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
