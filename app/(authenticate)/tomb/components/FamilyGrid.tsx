import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import FamilyMemberCard from "./FamilyMemberCard";
import SearchBar from "./SearchBar";
import MemberDetailModal from "./MemberDetailModal";
import { familyMembers, FamilyMember } from "../data/familyMembers";

const FamilyGrid = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredMembers = useMemo(() => {
        if (!searchQuery.trim()) return familyMembers;

        const query = searchQuery.toLowerCase();
        return familyMembers.filter(
            (member) =>
                member.name.toLowerCase().includes(query) ||
                member.cemetery.toLowerCase().includes(query) ||
                member.relation.toLowerCase().includes(query) ||
                member.location.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const handleMemberClick = (member: FamilyMember) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedMember(null), 300);
    };

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-10 text-center"
                >
                    <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                        Những Người Thân Yêu
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl font-sans text-muted-foreground">
                        Tưởng nhớ những thành viên trong gia đình đã yên nghỉ
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                </motion.div>

                {/* Results count */}
                {searchQuery && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6 text-center font-sans text-sm text-muted-foreground"
                    >
                        Tìm thấy {filteredMembers.length} kết quả
                        {filteredMembers.length === 0 && (
                            <span className="block mt-2 text-foreground/70">
                                Không tìm thấy thành viên phù hợp. Thử tìm kiếm với từ khóa khác.
                            </span>
                        )}
                    </motion.p>
                )}

                {/* Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredMembers.map((member, index) => (
                        <FamilyMemberCard
                            key={member.id}
                            member={member}
                            index={index}
                            onClick={() => handleMemberClick(member)}
                        />
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            <MemberDetailModal
                member={selectedMember}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </section>
    );
};

export default FamilyGrid;
