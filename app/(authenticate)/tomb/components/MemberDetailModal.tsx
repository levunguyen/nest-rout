import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Navigation, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { FamilyMember } from "../data/familyMembers";
import { Button } from "./ui/button";

interface MemberDetailModalProps {
    member: FamilyMember | null;
    isOpen: boolean;
    onClose: () => void;
}

const MemberDetailModal = ({ member, isOpen, onClose }: MemberDetailModalProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!member) return null;

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev < member.graveImages.length - 1 ? prev + 1 : 0
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev > 0 ? prev - 1 : member.graveImages.length - 1
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-4 z-50 mx-auto my-auto flex max-h-[90vh] max-w-3xl flex-col overflow-hidden rounded-2xl bg-card shadow-2xl md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 z-10 rounded-full bg-card/80 p-2 text-foreground/70 backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Image Gallery */}
                        <div className="relative aspect-video w-full shrink-0 bg-secondary">
                            <img
                                src={member.graveImages[currentImageIndex]}
                                alt={`Mộ phần ${member.name}`}
                                className="h-full w-full object-cover"
                            />

                            {/* Image Navigation */}
                            {member.graveImages.length > 1 && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>

                                    {/* Image Indicators */}
                                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                                        {member.graveImages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`h-2 w-2 rounded-full transition-all ${idx === currentImageIndex
                                                    ? "w-6 bg-primary-foreground"
                                                    : "bg-primary-foreground/50"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Relation Badge */}
                            <div className="absolute left-4 top-4">
                                <span className="rounded-full bg-primary px-4 py-1.5 font-sans text-sm font-medium text-primary-foreground shadow-lg">
                                    {member.relation}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Header */}
                            <div className="mb-6">
                                <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                                    {member.name}
                                </h2>
                                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span className="font-sans">
                                        {member.birthYear} — {member.deathYear}
                                    </span>
                                </div>
                            </div>

                            {/* Bio */}
                            {member.bio && (
                                <div className="mb-6">
                                    <p className="font-sans leading-relaxed text-foreground/80">
                                        {member.bio}
                                    </p>
                                </div>
                            )}

                            {/* Grave Details */}
                            <div className="rounded-xl bg-secondary/50 p-4">
                                <h3 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
                                    <MapPin className="h-5 w-5 text-memorial-sage" />
                                    Thông Tin Mộ Phần
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1">
                                            <p className="font-sans text-sm font-medium text-foreground">
                                                {member.cemetery}
                                            </p>
                                            <p className="font-sans text-sm text-muted-foreground">
                                                {member.location}
                                            </p>
                                        </div>
                                    </div>

                                    {member.graveDetails && (
                                        <div className="grid grid-cols-2 gap-3 border-t border-border/50 pt-3">
                                            {member.graveDetails.section && (
                                                <div>
                                                    <p className="font-sans text-xs text-muted-foreground">Khu vực</p>
                                                    <p className="font-sans text-sm font-medium text-foreground">
                                                        {member.graveDetails.section}
                                                    </p>
                                                </div>
                                            )}
                                            {member.graveDetails.row && (
                                                <div>
                                                    <p className="font-sans text-xs text-muted-foreground">Hàng</p>
                                                    <p className="font-sans text-sm font-medium text-foreground">
                                                        {member.graveDetails.row}
                                                    </p>
                                                </div>
                                            )}
                                            {member.graveDetails.plot && (
                                                <div>
                                                    <p className="font-sans text-xs text-muted-foreground">Số mộ</p>
                                                    <p className="font-sans text-sm font-medium text-foreground">
                                                        {member.graveDetails.plot}
                                                    </p>
                                                </div>
                                            )}
                                            {member.graveDetails.direction && (
                                                <div className="flex items-center gap-1">
                                                    <div>
                                                        <p className="font-sans text-xs text-muted-foreground">Hướng</p>
                                                        <p className="flex items-center gap-1 font-sans text-sm font-medium text-foreground">
                                                            <Navigation className="h-3 w-3" />
                                                            {member.graveDetails.direction}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MemberDetailModal;
