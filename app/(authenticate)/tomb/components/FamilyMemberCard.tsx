import { motion } from "framer-motion";
import { MapPin, Calendar, Heart } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { FamilyMember } from "../data/familyMembers";

interface FamilyMemberCardProps {
    member: FamilyMember;
    index: number;
    onClick: () => void;
}

const FamilyMemberCard = ({ member, index, onClick }: FamilyMemberCardProps) => {
    const { name, birthYear, deathYear, relation, location, cemetery, graveImages } = member;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
        >
            <Card
                className="group cursor-pointer overflow-hidden border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-memorial-sage/10"
                onClick={onClick}
            >
                <CardContent className="p-0">
                    {/* Image Section */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                        {graveImages && graveImages.length > 0 ? (
                            <img
                                src={graveImages[0]}
                                alt={name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-memorial-cream to-secondary">
                                <Heart className="h-12 w-12 text-memorial-sage/30" />
                            </div>
                        )}

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-all duration-300 group-hover:bg-foreground/20">
                            <span className="translate-y-4 rounded-full bg-card px-4 py-2 font-sans text-sm font-medium text-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                Xem chi tiết
                            </span>
                        </div>

                        {/* Relation Badge */}
                        <div className="absolute left-3 top-3">
                            <span className="rounded-full bg-card/90 px-3 py-1 font-sans text-xs font-medium text-foreground/80 backdrop-blur-sm">
                                {relation}
                            </span>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-3 p-4">
                        <div>
                            <h3 className="font-serif text-xl font-semibold text-foreground">
                                {name}
                            </h3>
                            <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="font-sans text-sm">
                                    {birthYear} — {deathYear}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1.5 border-t border-border/50 pt-3">
                            <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-memorial-sage" />
                                <div>
                                    <p className="font-sans text-sm font-medium text-foreground">
                                        {cemetery}
                                    </p>
                                    <p className="font-sans text-xs text-muted-foreground">
                                        {location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default FamilyMemberCard;
