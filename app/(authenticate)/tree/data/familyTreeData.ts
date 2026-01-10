import { FamilyMember } from "../types/FamilyTree";

// Sample avatar URLs for males and females
const maleAvatars = [
  "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&crop=face",
];

const femaleAvatars = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face",
];

// Helper to get a random avatar based on gender and index
const getAvatar = (gender: "male" | "female", index: number) => {
  const avatars = gender === "male" ? maleAvatars : femaleAvatars;
  return avatars[index % avatars.length];
};

// 100 members across 7 generations - structured family tree
export const initialFamilyData: FamilyMember[] = [
  // Generation 0 - Tổ tiên (Root ancestors)
  { id: "a1", name: "Nguyễn Văn Tiên Tổ", birthYear: 1850, deathYear: 1920, gender: "male", generation: 0, spouseIds: ["a2", "a3"], imageUrl: getAvatar("male", 0) },
  { id: "a2", name: "Hoàng Thị Tổ Mẫu", birthYear: 1855, deathYear: 1925, gender: "female", generation: 0, imageUrl: getAvatar("female", 0) },
  // Second wife of a1 - demonstrating multiple spouses
  { id: "a3", name: "Lê Thị Thứ Phi", birthYear: 1860, deathYear: 1930, gender: "female", generation: 0, imageUrl: getAvatar("female", 1) },

  // Generation 1 - Children of a1 (4 couples = 8 members)
  { id: "1", name: "Nguyễn Văn Tổ", birthYear: 1875, deathYear: 1945, gender: "male", generation: 1, parentId: "a1", spouseIds: ["2"], imageUrl: getAvatar("male", 1) },
  { id: "2", name: "Trần Thị Lan", birthYear: 1878, deathYear: 1950, gender: "female", generation: 1, imageUrl: getAvatar("female", 2) },
  { id: "3", name: "Nguyễn Văn Đức", birthYear: 1878, deathYear: 1948, gender: "male", generation: 1, parentId: "a1", spouseIds: ["4"], imageUrl: getAvatar("male", 2) },
  { id: "4", name: "Lê Thị Hoa", birthYear: 1882, deathYear: 1955, gender: "female", generation: 1, imageUrl: getAvatar("female", 3) },
  { id: "5", name: "Nguyễn Thị Mai", birthYear: 1880, deathYear: 1952, gender: "female", generation: 1, parentId: "a1", imageUrl: getAvatar("female", 4) },
  { id: "6", name: "Phạm Văn Hùng", birthYear: 1877, deathYear: 1949, gender: "male", generation: 1, spouseIds: ["5"], imageUrl: getAvatar("male", 3) },
  // Children from second wife (a3) - Lê Thị Thứ Phi
  { id: "7", name: "Nguyễn Văn Khánh", birthYear: 1885, deathYear: 1960, gender: "male", generation: 1, parentId: "a1", spouseIds: ["8"], imageUrl: getAvatar("male", 4) },
  { id: "8", name: "Đỗ Thị Ngọc", birthYear: 1888, deathYear: 1965, gender: "female", generation: 1, imageUrl: getAvatar("female", 5) },
  { id: "9a", name: "Nguyễn Văn Hưng", birthYear: 1888, deathYear: 1965, gender: "male", generation: 1, parentId: "a1", spouseIds: ["9b"], imageUrl: getAvatar("male", 5) },
  { id: "9b", name: "Trương Thị Xuân", birthYear: 1892, deathYear: 1970, gender: "female", generation: 1, imageUrl: getAvatar("female", 6) },
  { id: "9c", name: "Nguyễn Thị Bạch", birthYear: 1890, deathYear: 1968, gender: "female", generation: 1, parentId: "a1", imageUrl: getAvatar("female", 7) },
  { id: "9d", name: "Lý Văn Thắng", birthYear: 1887, deathYear: 1965, gender: "male", generation: 1, spouseIds: ["9c"], imageUrl: getAvatar("male", 6) },

  // Generation 2 - Children of gen 1 (10 couples = 20 members)
  // Children of 1
  { id: "10", name: "Nguyễn Văn Phúc", birthYear: 1900, deathYear: 1975, gender: "male", generation: 2, parentId: "1", spouseIds: ["11"], imageUrl: getAvatar("male", 5) },
  { id: "11", name: "Vũ Thị Hương", birthYear: 1905, deathYear: 1980, gender: "female", generation: 2, imageUrl: getAvatar("female", 6) },
  { id: "12", name: "Nguyễn Thị Thuỷ", birthYear: 1903, deathYear: 1978, gender: "female", generation: 2, parentId: "1", imageUrl: getAvatar("female", 7) },
  { id: "13", name: "Hoàng Văn Bình", birthYear: 1900, deathYear: 1976, gender: "male", generation: 2, spouseIds: ["12"], imageUrl: getAvatar("male", 6) },
  { id: "14", name: "Nguyễn Văn Quân", birthYear: 1906, deathYear: 1982, gender: "male", generation: 2, parentId: "1", spouseIds: ["15"], imageUrl: getAvatar("male", 7) },
  { id: "15", name: "Bùi Thị Liên", birthYear: 1910, deathYear: 1988, gender: "female", generation: 2, imageUrl: getAvatar("female", 8) },
  // Children of 3
  { id: "16", name: "Nguyễn Văn Thành", birthYear: 1905, deathYear: 1980, gender: "male", generation: 2, parentId: "3", spouseIds: ["17"], imageUrl: getAvatar("male", 8) },
  { id: "17", name: "Đặng Thị Thu", birthYear: 1908, deathYear: 1985, gender: "female", generation: 2, imageUrl: getAvatar("female", 9) },
  { id: "18", name: "Nguyễn Thị Hạnh", birthYear: 1908, deathYear: 1983, gender: "female", generation: 2, parentId: "3", imageUrl: getAvatar("female", 0) },
  { id: "19", name: "Cao Văn Long", birthYear: 1905, deathYear: 1980, gender: "male", generation: 2, spouseIds: ["18"], imageUrl: getAvatar("male", 9) },
  // Children of 5
  { id: "20", name: "Phạm Văn Tuấn", birthYear: 1902, deathYear: 1978, gender: "male", generation: 2, parentId: "5", spouseIds: ["21"], imageUrl: getAvatar("male", 0) },
  { id: "21", name: "Ngô Thị Phương", birthYear: 1906, deathYear: 1982, gender: "female", generation: 2, imageUrl: getAvatar("female", 1) },
  { id: "22", name: "Phạm Thị Nga", birthYear: 1905, deathYear: 1980, gender: "female", generation: 2, parentId: "5", imageUrl: getAvatar("female", 2) },
  { id: "23", name: "Đinh Văn Khôi", birthYear: 1902, deathYear: 1977, gender: "male", generation: 2, spouseIds: ["22"], imageUrl: getAvatar("male", 1) },
  // Children of 7
  { id: "24", name: "Nguyễn Văn Hiếu", birthYear: 1912, deathYear: 1988, gender: "male", generation: 2, parentId: "7", spouseIds: ["25"], imageUrl: getAvatar("male", 2) },
  { id: "25", name: "Lý Thị Hồng", birthYear: 1915, deathYear: 1992, gender: "female", generation: 2, imageUrl: getAvatar("female", 3) },
  { id: "26", name: "Nguyễn Thị Yến", birthYear: 1915, deathYear: 1990, gender: "female", generation: 2, parentId: "7", imageUrl: getAvatar("female", 4) },
  { id: "27", name: "Trịnh Văn Đạt", birthYear: 1912, deathYear: 1987, gender: "male", generation: 2, spouseIds: ["26"], imageUrl: getAvatar("male", 3) },
  // Children of 9a (Nguyễn Văn Hưng - con vợ 2)
  { id: "28", name: "Nguyễn Văn Phương", birthYear: 1915, deathYear: 1990, gender: "male", generation: 2, parentId: "9a", spouseIds: ["28b"], imageUrl: getAvatar("male", 4) },
  { id: "28b", name: "Đào Thị Liễu", birthYear: 1918, deathYear: 1995, gender: "female", generation: 2, imageUrl: getAvatar("female", 5) },
  { id: "29", name: "Nguyễn Thị Cúc", birthYear: 1918, deathYear: 1995, gender: "female", generation: 2, parentId: "9a", imageUrl: getAvatar("female", 6) },
  { id: "29b", name: "Hoàng Văn Lợi", birthYear: 1915, deathYear: 1992, gender: "male", generation: 2, spouseIds: ["29"], imageUrl: getAvatar("male", 5) },
  // Children of 9c (Nguyễn Thị Bạch - con vợ 2)
  { id: "29c", name: "Lý Văn Hùng", birthYear: 1912, deathYear: 1988, gender: "male", generation: 2, parentId: "9c", spouseIds: ["29d"], imageUrl: getAvatar("male", 6) },
  { id: "29d", name: "Trần Thị Hạnh", birthYear: 1916, deathYear: 1992, gender: "female", generation: 2, imageUrl: getAvatar("female", 7) },

  // Children of 10
  { id: "30", name: "Nguyễn Văn Minh", birthYear: 1928, deathYear: 2005, gender: "male", generation: 3, parentId: "10", spouseIds: ["31"], imageUrl: getAvatar("male", 4) },
  { id: "31", name: "Trần Thị Liên", birthYear: 1932, gender: "female", generation: 3, imageUrl: getAvatar("female", 5) },
  { id: "32", name: "Nguyễn Thị Hà", birthYear: 1930, deathYear: 2010, gender: "female", generation: 3, parentId: "10", imageUrl: getAvatar("female", 6) },
  { id: "33", name: "Phan Văn Tâm", birthYear: 1928, deathYear: 2008, gender: "male", generation: 3, spouseIds: ["32"], imageUrl: getAvatar("male", 5) },
  // Children of 12
  { id: "34", name: "Hoàng Văn Nam", birthYear: 1925, deathYear: 2000, gender: "male", generation: 3, parentId: "12", spouseIds: ["35"], imageUrl: getAvatar("male", 6) },
  { id: "35", name: "Lê Thị Nga", birthYear: 1928, deathYear: 2005, gender: "female", generation: 3, imageUrl: getAvatar("female", 7) },
  // Children of 14
  { id: "36", name: "Nguyễn Văn Khang", birthYear: 1935, deathYear: 2015, gender: "male", generation: 3, parentId: "14", spouseIds: ["37"], imageUrl: getAvatar("male", 7) },
  { id: "37", name: "Mai Thị Lan", birthYear: 1938, gender: "female", generation: 3, imageUrl: getAvatar("female", 8) },
  { id: "38", name: "Nguyễn Thị Loan", birthYear: 1938, deathYear: 2018, gender: "female", generation: 3, parentId: "14", imageUrl: getAvatar("female", 9) },
  { id: "39", name: "Võ Văn Hải", birthYear: 1935, deathYear: 2015, gender: "male", generation: 3, spouseIds: ["38"], imageUrl: getAvatar("male", 8) },
  // Children of 16
  { id: "40", name: "Nguyễn Văn Sơn", birthYear: 1932, deathYear: 2010, gender: "male", generation: 3, parentId: "16", spouseIds: ["41"], imageUrl: getAvatar("male", 9) },
  { id: "41", name: "Đinh Thị Thu", birthYear: 1935, gender: "female", generation: 3, imageUrl: getAvatar("female", 0) },
  { id: "42", name: "Nguyễn Thị Ngọc", birthYear: 1935, deathYear: 2012, gender: "female", generation: 3, parentId: "16", imageUrl: getAvatar("female", 1) },
  { id: "43", name: "Lưu Văn Hải", birthYear: 1932, deathYear: 2010, gender: "male", generation: 3, spouseIds: ["42"], imageUrl: getAvatar("male", 0) },
  // Children of 18
  { id: "44", name: "Cao Văn Đức", birthYear: 1930, deathYear: 2008, gender: "male", generation: 3, parentId: "18", spouseIds: ["45"], imageUrl: getAvatar("male", 1) },
  { id: "45", name: "Nguyễn Thị Hạnh", birthYear: 1933, gender: "female", generation: 3, imageUrl: getAvatar("female", 2) },
  // Children of 20
  { id: "46", name: "Phạm Văn Tùng", birthYear: 1928, deathYear: 2005, gender: "male", generation: 3, parentId: "20", spouseIds: ["47"], imageUrl: getAvatar("male", 2) },
  { id: "47", name: "Hoàng Thị Oanh", birthYear: 1932, gender: "female", generation: 3, imageUrl: getAvatar("female", 3) },
  { id: "48", name: "Phạm Thị Bích", birthYear: 1930, deathYear: 2008, gender: "female", generation: 3, parentId: "20", imageUrl: getAvatar("female", 4) },
  { id: "49", name: "Nguyễn Văn Kiên", birthYear: 1928, deathYear: 2006, gender: "male", generation: 3, spouseIds: ["48"], imageUrl: getAvatar("male", 3) },
  // Children of 22
  { id: "50", name: "Đinh Văn Cường", birthYear: 1930, deathYear: 2010, gender: "male", generation: 3, parentId: "22", spouseIds: ["51"], imageUrl: getAvatar("male", 4) },
  { id: "51", name: "Trịnh Thị Mai", birthYear: 1933, gender: "female", generation: 3, imageUrl: getAvatar("female", 5) },
  // Children of 24
  { id: "52", name: "Nguyễn Văn Hoà", birthYear: 1940, deathYear: 2018, gender: "male", generation: 3, parentId: "24", spouseIds: ["53"], imageUrl: getAvatar("male", 5) },
  { id: "53", name: "Phan Thị Kim", birthYear: 1943, gender: "female", generation: 3, imageUrl: getAvatar("female", 6) },
  { id: "54", name: "Nguyễn Thị Uyên", birthYear: 1942, deathYear: 2020, gender: "female", generation: 3, parentId: "24", imageUrl: getAvatar("female", 7) },
  { id: "55", name: "Đoàn Văn Thắng", birthYear: 1940, deathYear: 2018, gender: "male", generation: 3, spouseIds: ["54"], imageUrl: getAvatar("male", 6) },
  // Children of 26
  { id: "56", name: "Trịnh Văn Bảo", birthYear: 1938, deathYear: 2015, gender: "male", generation: 3, parentId: "26", spouseIds: ["57"], imageUrl: getAvatar("male", 7) },
  { id: "57", name: "Lê Thị Hằng", birthYear: 1942, gender: "female", generation: 3, imageUrl: getAvatar("female", 8) },

  // Generation 4 - Children of gen 3 (12 couples + 4 singles = 28 members)
  // Children of 30
  { id: "60", name: "Nguyễn Văn An", birthYear: 1955, gender: "male", generation: 4, parentId: "30", spouseIds: ["61"], imageUrl: getAvatar("male", 8) },
  { id: "61", name: "Lý Thị Diệu", birthYear: 1958, gender: "female", generation: 4, imageUrl: getAvatar("female", 9) },
  { id: "62", name: "Nguyễn Thị Bích", birthYear: 1958, gender: "female", generation: 4, parentId: "30", imageUrl: getAvatar("female", 0) },
  { id: "63", name: "Trần Văn Phong", birthYear: 1955, gender: "male", generation: 4, spouseIds: ["62"], imageUrl: getAvatar("male", 9) },
  // Children of 34
  { id: "64", name: "Hoàng Văn Tuấn", birthYear: 1952, gender: "male", generation: 4, parentId: "34", spouseIds: ["65"], imageUrl: getAvatar("male", 0) },
  { id: "65", name: "Nguyễn Thị Yến", birthYear: 1955, gender: "female", generation: 4, imageUrl: getAvatar("female", 1) },
  // Children of 36
  { id: "66", name: "Nguyễn Văn Quang", birthYear: 1962, gender: "male", generation: 4, parentId: "36", spouseIds: ["67"], imageUrl: getAvatar("male", 1) },
  { id: "67", name: "Phạm Thị Hương", birthYear: 1965, gender: "female", generation: 4, imageUrl: getAvatar("female", 2) },
  { id: "68", name: "Nguyễn Thị Dung", birthYear: 1965, gender: "female", generation: 4, parentId: "36", imageUrl: getAvatar("female", 3) },
  { id: "69", name: "Cao Văn Hùng", birthYear: 1962, gender: "male", generation: 4, spouseIds: ["68"], imageUrl: getAvatar("male", 2) },
  // Children of 40
  { id: "70", name: "Nguyễn Văn Đức", birthYear: 1960, gender: "male", generation: 4, parentId: "40", spouseIds: ["71"], imageUrl: getAvatar("male", 3) },
  { id: "71", name: "Hoàng Thị Liên", birthYear: 1963, gender: "female", generation: 4, imageUrl: getAvatar("female", 4) },
  // Children of 44
  { id: "72", name: "Cao Văn Thành", birthYear: 1958, gender: "male", generation: 4, parentId: "44", spouseIds: ["73"], imageUrl: getAvatar("male", 4) },
  { id: "73", name: "Đặng Thị Hoa", birthYear: 1961, gender: "female", generation: 4, imageUrl: getAvatar("female", 5) },
  // Children of 46
  { id: "74", name: "Phạm Văn Long", birthYear: 1955, gender: "male", generation: 4, parentId: "46", spouseIds: ["75"], imageUrl: getAvatar("male", 5) },
  { id: "75", name: "Vũ Thị Nhung", birthYear: 1958, gender: "female", generation: 4, imageUrl: getAvatar("female", 6) },
  { id: "76", name: "Phạm Thị Thuỳ", birthYear: 1958, gender: "female", generation: 4, parentId: "46", imageUrl: getAvatar("female", 7) },
  // Children of 50
  { id: "77", name: "Đinh Văn Hậu", birthYear: 1958, gender: "male", generation: 4, parentId: "50", spouseIds: ["78"], imageUrl: getAvatar("male", 6) },
  { id: "78", name: "Ngô Thị Lan", birthYear: 1961, gender: "female", generation: 4, imageUrl: getAvatar("female", 8) },
  // Children of 52
  { id: "79", name: "Nguyễn Văn Kiên", birthYear: 1968, gender: "male", generation: 4, parentId: "52", spouseIds: ["80"], imageUrl: getAvatar("male", 7) },
  { id: "80", name: "Trần Thị Hằng", birthYear: 1971, gender: "female", generation: 4, imageUrl: getAvatar("female", 9) },
  // Children of 56
  { id: "81", name: "Trịnh Văn Dũng", birthYear: 1965, gender: "male", generation: 4, parentId: "56", spouseIds: ["82"], imageUrl: getAvatar("male", 8) },
  { id: "82", name: "Mai Thị Hoa", birthYear: 1968, gender: "female", generation: 4, imageUrl: getAvatar("female", 0) },
  { id: "83", name: "Trịnh Thị Trang", birthYear: 1968, gender: "female", generation: 4, parentId: "56", imageUrl: getAvatar("female", 1) },

  // Generation 5 - Children of gen 4 (6 couples + 4 singles = 16 members)
  // Children of 60
  { id: "85", name: "Nguyễn Văn Cường", birthYear: 1982, gender: "male", generation: 5, parentId: "60", spouseIds: ["86"], imageUrl: getAvatar("male", 9) },
  { id: "86", name: "Lê Thị Kim", birthYear: 1985, gender: "female", generation: 5, imageUrl: getAvatar("female", 2) },
  { id: "87", name: "Nguyễn Thị Như", birthYear: 1985, gender: "female", generation: 5, parentId: "60", imageUrl: getAvatar("female", 3) },
  // Children of 64
  { id: "88", name: "Hoàng Văn Dũng", birthYear: 1978, gender: "male", generation: 5, parentId: "64", spouseIds: ["89"], imageUrl: getAvatar("male", 0) },
  { id: "89", name: "Phan Thị Lan", birthYear: 1981, gender: "female", generation: 5, imageUrl: getAvatar("female", 4) },
  // Children of 66
  { id: "90", name: "Nguyễn Văn Hiếu", birthYear: 1988, gender: "male", generation: 5, parentId: "66", spouseIds: ["91"], imageUrl: getAvatar("male", 1) },
  { id: "91", name: "Đinh Thị Uyên", birthYear: 1991, gender: "female", generation: 5, imageUrl: getAvatar("female", 5) },
  { id: "92", name: "Nguyễn Thị Thuỳ", birthYear: 1990, gender: "female", generation: 5, parentId: "66", imageUrl: getAvatar("female", 6) },
  // Children of 70
  { id: "93", name: "Nguyễn Văn Sơn", birthYear: 1988, gender: "male", generation: 5, parentId: "70", spouseIds: ["94"], imageUrl: getAvatar("male", 2) },
  { id: "94", name: "Trịnh Thị Hồng", birthYear: 1991, gender: "female", generation: 5, imageUrl: getAvatar("female", 7) },
  // Children of 74
  { id: "95", name: "Phạm Văn Đạt", birthYear: 1982, gender: "male", generation: 5, parentId: "74", spouseIds: ["96"], imageUrl: getAvatar("male", 3) },
  { id: "96", name: "Nguyễn Thị Mai", birthYear: 1985, gender: "female", generation: 5, imageUrl: getAvatar("female", 8) },
  { id: "97", name: "Phạm Thị Hương", birthYear: 1985, gender: "female", generation: 5, parentId: "74", imageUrl: getAvatar("female", 9) },
  // Children of 79
  { id: "98", name: "Nguyễn Văn Khôi", birthYear: 1995, gender: "male", generation: 5, parentId: "79", imageUrl: getAvatar("male", 4) },
  { id: "99", name: "Nguyễn Thị Linh", birthYear: 1998, gender: "female", generation: 5, parentId: "79", imageUrl: getAvatar("female", 0) },
  // Children of 81
  { id: "100", name: "Trịnh Văn Hoà", birthYear: 1992, gender: "male", generation: 5, parentId: "81", imageUrl: getAvatar("male", 5) },

  // Generation 6 - Children of gen 5 (8 members)
  // Children of 85
  { id: "101", name: "Nguyễn Văn Phong", birthYear: 2010, gender: "male", generation: 6, parentId: "85", imageUrl: getAvatar("male", 6) },
  { id: "102", name: "Nguyễn Thị Diệu", birthYear: 2013, gender: "female", generation: 6, parentId: "85", imageUrl: getAvatar("female", 1) },
  // Children of 88
  { id: "103", name: "Hoàng Văn Bảo", birthYear: 2005, gender: "male", generation: 6, parentId: "88", imageUrl: getAvatar("male", 7) },
  { id: "104", name: "Hoàng Thị Linh", birthYear: 2008, gender: "female", generation: 6, parentId: "88", imageUrl: getAvatar("female", 2) },
  // Children of 90
  { id: "105", name: "Nguyễn Văn Khang", birthYear: 2015, gender: "male", generation: 6, parentId: "90", imageUrl: getAvatar("male", 8) },
  // Children of 93
  { id: "106", name: "Nguyễn Thị An", birthYear: 2018, gender: "female", generation: 6, parentId: "93", imageUrl: getAvatar("female", 3) },
  // Children of 95
  { id: "107", name: "Phạm Văn Duy", birthYear: 2012, gender: "male", generation: 6, parentId: "95", imageUrl: getAvatar("male", 9) },
  { id: "108", name: "Phạm Thị Hà", birthYear: 2015, gender: "female", generation: 6, parentId: "95", imageUrl: getAvatar("female", 4) },
];
