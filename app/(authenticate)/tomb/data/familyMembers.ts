

export interface FamilyMember {
    id: string;
    name: string;
    birthYear: string;
    deathYear: string;
    relation: string;
    location: string;
    cemetery: string;
    graveImages: string[];
    bio?: string;
    graveDetails?: {
        row?: string;
        plot?: string;
        section?: string;
        direction?: string;
    };
}

export const familyMembers: FamilyMember[] = [
    {
        id: "1",
        name: "Nguyễn Văn An",
        birthYear: "1920",
        deathYear: "1995",
        relation: "Ông Nội",
        location: "Quận Bình Tân, TP.HCM",
        cemetery: "Nghĩa trang Bình Hưng Hòa",
        graveImages: [
            "/assets/grave-1.jpg",
            "/assets/grave-2.jpg",
        ],
        bio: "Người cha, người ông đáng kính của gia đình. Ông đã dành cả đời mình cho sự nghiệp giáo dục và nuôi dạy con cháu nên người.",
        graveDetails: {
            row: "A",
            plot: "15",
            section: "Khu 3",
            direction: "Hướng Đông",
        },
    },
    {
        id: "2",
        name: "Trần Thị Bích",
        birthYear: "1925",
        deathYear: "2000",
        relation: "Bà Nội",
        location: "Quận Bình Tân, TP.HCM",
        cemetery: "Nghĩa trang Bình Hưng Hòa",
        graveImages: [
            "/assets/grave-1.jpg",
            "/assets/grave-2.jpg",
        ],
        bio: "Người bà hiền từ, tận tụy với gia đình. Bà luôn là chỗ dựa tinh thần cho con cháu trong mọi hoàn cảnh.",
        graveDetails: {
            row: "A",
            plot: "16",
            section: "Khu 3",
            direction: "Hướng Đông",
        },
    },
    {
        id: "3",
        name: "Lê Văn Minh",
        birthYear: "1918",
        deathYear: "1990",
        relation: "Ông Ngoại",
        location: "Huyện Bình Chánh, TP.HCM",
        cemetery: "Nghĩa trang Đa Phước",
        graveImages: [
            "/assets/grave-1.jpg",
            "/assets/grave-2.jpg",
        ],
        bio: "Người thầy thuốc giỏi, đã cống hiến cho y học và chữa trị cho nhiều người bệnh trong suốt cuộc đời.",
        graveDetails: {
            row: "B",
            plot: "22",
            section: "Khu 1",
            direction: "Hướng Nam",
        },
    },
    {
        id: "4",
        name: "Phạm Thị Hương",
        birthYear: "1922",
        deathYear: "2005",
        relation: "Bà Ngoại",
        location: "Huyện Bình Chánh, TP.HCM",
        cemetery: "Nghĩa trang Đa Phước",
        graveImages: [
            "/assets/grave-1.jpg",
            "/assets/grave-2.jpg",
        ],
        bio: "Người phụ nữ mạnh mẽ, đảm đang. Bà đã nuôi dạy các con thành người tử tế và luôn sống trong lòng con cháu.",
        graveDetails: {
            row: "B",
            plot: "23",
            section: "Khu 1",
            direction: "Hướng Nam",
        },
    },
    {
        id: "5",
        name: "Nguyễn Văn Tùng",
        birthYear: "1950",
        deathYear: "2020",
        relation: "Chú Hai",
        location: "Huyện Củ Chi, TP.HCM",
        cemetery: "Nghĩa trang Củ Chi",
        graveImages: [
            "/images/grave-1.jpg",
            "/images/grave-2.jpg",
        ],
        bio: "Người anh, người chú đáng mến của gia đình. Chú đã sống một cuộc đời trọn vẹn và đầy ý nghĩa.",
        graveDetails: {
            row: "C",
            plot: "08",
            section: "Khu 2",
            direction: "Hướng Tây",
        },
    },
    {
        id: "6",
        name: "Nguyễn Thị Mai",
        birthYear: "1955",
        deathYear: "2018",
        relation: "Cô Ba",
        location: "Quận 12, TP.HCM",
        cemetery: "Nghĩa trang Gò Dưa",
        graveImages: [
            "/assets/grave-1.jpg",
            "/assets/grave-2.jpg",
        ],
        bio: "Người cô hiền hậu, luôn yêu thương và quan tâm đến các cháu. Cô đã để lại nhiều kỷ niệm đẹp trong gia đình.",
        graveDetails: {
            row: "D",
            plot: "12",
            section: "Khu 4",
            direction: "Hướng Bắc",
        },
    },
];
