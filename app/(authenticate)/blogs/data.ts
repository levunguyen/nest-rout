export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
  featured?: boolean;
  content: string[];
}

export interface BlogComment {
  id: string;
  blogId: string;
  author: string;
  date: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Số hóa gia phả: bắt đầu từ đâu để không bị rối dữ liệu?",
    author: "Gia Phả Việt Team",
    date: "March 1, 2026",
    category: "Hướng dẫn",
    excerpt:
      "Lộ trình 5 bước giúp gia đình bắt đầu lưu trữ gia phả số một cách rõ ràng, dễ mở rộng và dễ cộng tác lâu dài.",
    image: "/images/hero-memorial.jpg",
    readTime: "6 phút đọc",
    featured: true,
    content: [
      "Bước đầu tiên khi số hóa gia phả là thống nhất cấu trúc dữ liệu: họ tên, năm sinh, quan hệ, ảnh và mốc sự kiện. Không nên nhập tự do ngay từ đầu vì sẽ khó chuẩn hóa về sau.",
      "Tiếp theo, hãy chia dữ liệu theo từng nhánh gia đình và phân quyền người phụ trách. Mỗi nhánh nên có một đầu mối cập nhật để tránh trùng lặp hoặc sai thông tin.",
      "Cuối cùng, kiểm tra định kỳ dữ liệu và sao lưu. Khi có quy trình rõ ràng, gia phả số sẽ trở thành tài sản tri thức lâu dài cho các thế hệ.",
    ],
  },
  {
    id: "2",
    title: "Cách ghi chép ngày giỗ và mốc sự kiện gia đình hiệu quả",
    author: "Nguyễn Minh Anh",
    date: "February 20, 2026",
    category: "Quản lý sự kiện",
    excerpt:
      "Thiết lập lịch giỗ theo âm lịch/dương lịch và đồng bộ nhắc việc để cả gia đình không bỏ lỡ các dịp quan trọng.",
    image: "/images/grave-1.jpg",
    readTime: "4 phút đọc",
    content: [
      "Mỗi sự kiện nên có tối thiểu: tên sự kiện, người liên quan, ngày âm lịch, ngày dương lịch, địa điểm và người phụ trách.",
      "Đối với ngày giỗ, nên lưu cả thông tin đời thứ và chi họ để dễ lọc danh sách khi quy mô dữ liệu lớn.",
      "Nếu gia đình ở nhiều nơi, hãy thêm ghi chú online/offline để tổ chức linh hoạt hơn.",
    ],
  },
  {
    id: "3",
    title: "Quản lý ảnh tư liệu gia đình: đặt tên và phân loại chuẩn",
    author: "Lê Hoàng Nam",
    date: "February 7, 2026",
    category: "Kho tư liệu",
    excerpt:
      "Một quy tắc đặt tên ảnh thống nhất sẽ giúp truy xuất ký ức nhanh hơn và giảm thất lạc dữ liệu theo thời gian.",
    image: "/images/grandfather.png",
    readTime: "5 phút đọc",
    content: [
      "Nên đặt tên ảnh theo mẫu: YYYYMMDD_nhanhgia_hoten_sukien. Điều này giúp tìm kiếm rất nhanh mà không cần mở từng ảnh.",
      "Tách ảnh chân dung, ảnh sự kiện, ảnh từ đường và ảnh tài liệu giấy thành từng thư mục rõ ràng.",
      "Sau khi phân loại, nên thêm mô tả ngắn cho ảnh quan trọng để con cháu dễ hiểu bối cảnh lịch sử.",
    ],
  },
  {
    id: "4",
    title: "Phân quyền cộng tác trong gia phả số cho từng thế hệ",
    author: "Trần Thu Hương",
    date: "January 29, 2026",
    category: "Bảo mật",
    excerpt:
      "Mô hình phân quyền theo vai trò giúp dữ liệu luôn chính xác và hạn chế chỉnh sửa nhầm khi nhiều người cùng dùng.",
    image: "/images/dad.png",
    readTime: "7 phút đọc",
    content: [
      "Nên có các vai trò: quản trị viên, biên tập viên và người xem. Mỗi vai trò chỉ nên có quyền cần thiết.",
      "Các thay đổi quan trọng như sửa quan hệ huyết thống hoặc xóa hồ sơ nên yêu cầu xác nhận hai bước.",
      "Lịch sử chỉnh sửa cần được lưu để có thể khôi phục khi có sai sót.",
    ],
  },
  {
    id: "5",
    title: "Kết nối thế hệ trẻ với di sản gia đình qua nền tảng số",
    author: "Phạm Gia Hân",
    date: "January 10, 2026",
    category: "Cộng đồng",
    excerpt:
      "Gợi ý cách đưa câu chuyện gia đình vào trải nghiệm số để thế hệ trẻ thấy gần gũi và chủ động tham gia.",
    image: "/images/nephew.png",
    readTime: "5 phút đọc",
    content: [
      "Thế hệ trẻ thường tương tác tốt với nội dung trực quan: timeline, ảnh, video và câu chuyện ngắn.",
      "Hãy tạo các hoạt động theo tháng như bổ sung một câu chuyện tổ tiên hoặc số hóa một album cũ.",
      "Khi có sự tham gia liên tục, gia phả số không chỉ là dữ liệu mà còn là cầu nối cảm xúc.",
    ],
  },
];

export const blogComments: BlogComment[] = [
  {
    id: "1",
    blogId: "1",
    author: "Nguyễn Văn Long",
    date: "March 2, 2026",
    content: "Bài viết rất dễ áp dụng, đặc biệt phần chuẩn hóa dữ liệu ban đầu.",
  },
  {
    id: "2",
    blogId: "1",
    author: "Lê Hồng Nhung",
    date: "March 3, 2026",
    content: "Gia đình mình đã thử mô hình phân nhánh, làm việc nhóm hiệu quả hơn hẳn.",
  },
  {
    id: "3",
    blogId: "2",
    author: "Trần Minh Phúc",
    date: "February 21, 2026",
    content: "Phần kết hợp âm lịch và dương lịch rất hữu ích cho lịch giỗ.",
  },
];

export const getBlogById = (id: string) => blogPosts.find((post) => post.id === id);
export const getCommentsByBlogId = (blogId: string) =>
  blogComments.filter((comment) => comment.blogId === blogId);
export const getCommentById = (blogId: string, commentId: string) =>
  blogComments.find((comment) => comment.blogId === blogId && comment.id === commentId);
