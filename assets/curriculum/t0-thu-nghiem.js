/* Mảng thử nghiệm — dùng để kiểm tra khả năng mở rộng.
   Đây là file MẪU: chép file này, đổi nội dung là có công nghệ mới.
   Xoá file này và dòng "t0-thu-nghiem" trong _manifest.js khi không cần nữa. */
window.CURRICULUM.push({
  id: "t0",
  kind: "cong-nghe",
  title: "TanStack Query",
  tag: "Quản lý server state",
  color: "#ff5f7e",
  why: "Mảng mẫu để kiểm tra: thêm một công nghệ mới chỉ cần tạo file này và thêm một dòng vào _manifest.js — không sửa HTML, không sửa CSS, không sửa JS.",
  folder: null,
  page: null,
  pageLabel: null,
  prompts: {
    lesson: "Ví dụ code bằng TypeScript với React. Luôn so sánh với cách làm thủ công bằng useEffect + useState để thấy rõ nó giải quyết vấn đề gì.",
    quiz: "Ưu tiên câu hỏi tình huống: cho một đoạn code dùng useQuery, hỏi điều gì xảy ra khi component remount, khi key đổi, hoặc khi mạng lỗi."
  },
  modules: [
    {
      name: "Nền tảng",
      items: [
        "Server state khác client state ở chỗ nào",
        "useQuery: queryKey, queryFn, và vòng đời một query",
        "Cache, staleTime và gcTime"
      ]
    }
  ]
});
