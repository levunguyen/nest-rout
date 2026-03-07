"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    Pencil,
    X,
    Check,
    Camera,
    Calendar,
    Briefcase,
} from "lucide-react";

interface ProfileData {
    name: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    birthday: string;
    job: string;
}

const initialProfile: ProfileData = {
    name: "Nguyễn Văn An",
    bio: "Frontend Developer & UI Designer. Đam mê tạo ra những trải nghiệm web đẹp mắt và trực quan.",
    email: "nguyenvanan@email.com",
    phone: "+84 912 345 678",
    location: "Hà Nội, Việt Nam",
    website: "https://nguyenvanan.dev",
    birthday: "15/03/1995",
    job: "Software Engineer",
};

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<ProfileData>(initialProfile);
    const [draft, setDraft] = useState<ProfileData>(initialProfile);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const previousAvatarUrlRef = useRef<string | null>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            if (previousAvatarUrlRef.current) {
                URL.revokeObjectURL(previousAvatarUrlRef.current);
            }
            previousAvatarUrlRef.current = url;
            setAvatarUrl(url);
        }
    };

    useEffect(() => {
        return () => {
            if (previousAvatarUrlRef.current) {
                URL.revokeObjectURL(previousAvatarUrlRef.current);
            }
        };
    }, []);

    const handleEdit = () => {
        setDraft(profile);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setDraft(profile);
        setIsEditing(false);
    };

    const handleSave = () => {
        setProfile(draft);
        setIsEditing(false);
    };

    const handleChange = (field: keyof ProfileData, value: string) => {
        setDraft((prev) => ({ ...prev, [field]: value }));
    };

    const infoItems = [
        { icon: Mail, label: "Email", field: "email" as const },
        { icon: Phone, label: "Điện thoại", field: "phone" as const },
        { icon: MapPin, label: "Địa điểm", field: "location" as const },
        { icon: Globe, label: "Website", field: "website" as const },
        { icon: Calendar, label: "Sinh nhật", field: "birthday" as const },
        { icon: Briefcase, label: "Nghề nghiệp", field: "job" as const },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-lg px-4 py-8">
                {/* Top bar */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Hồ sơ cá nhân</h2>
                    {!isEditing ? (
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-card transition-all hover:bg-secondary active:scale-95"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Chỉnh sửa
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-95"
                            >
                                <X className="h-3.5 w-3.5" />
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-card transition-all hover:opacity-90 active:scale-95"
                            >
                                <Check className="h-3.5 w-3.5" />
                                Lưu
                            </button>
                        </div>
                    )}
                </div>

                {/* Profile Card */}
                <div className="mb-4 rounded-2xl border border-border bg-card p-6 shadow-card">
                    <div className="flex items-start gap-5">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="h-20 w-20 overflow-hidden rounded-2xl border border-border bg-secondary shadow-card">
                                {avatarUrl ? (
                                    <Image
                                        src={avatarUrl}
                                        alt="Avatar"
                                        width={80}
                                        height={80}
                                        unoptimized
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <User className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-card transition-transform hover:scale-110">
                                    <Camera className="h-3.5 w-3.5" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {/* Name & Bio */}
                        <div className="min-w-0 flex-1 pt-1">
                            {isEditing ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={draft.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-lg font-semibold text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/15"
                                    />
                                    <textarea
                                        value={draft.bio}
                                        onChange={(e) => handleChange("bio", e.target.value)}
                                        rows={2}
                                        className="w-full resize-none rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/15"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-lg font-semibold text-foreground">{profile.name}</h1>
                                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="rounded-2xl border border-border bg-card shadow-card">
                    <div className="px-5 pb-1 pt-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Thông tin liên hệ
                        </h3>
                    </div>
                    {infoItems.map(({ icon: Icon, label, field }, index) => (
                        <div
                            key={field}
                            className={`flex items-center gap-3.5 px-5 py-3 ${index < infoItems.length - 1 ? "border-b border-border" : ""
                                }`}
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                    {label}
                                </p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={draft[field]}
                                        onChange={(e) => handleChange(field, e.target.value)}
                                        className="mt-0.5 w-full bg-transparent text-sm text-foreground outline-none"
                                    />
                                ) : (
                                    <p className="mt-0.5 truncate text-sm text-foreground">{profile[field]}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
