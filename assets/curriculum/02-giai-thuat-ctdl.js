/* Mảng 02 — Giải thuật & Cấu trúc dữ liệu
   Xem docs/them-cong-nghe-moi.md để biết cách thêm mảng mới. */
window.CURRICULUM.push(
{
  "id": "02",
  "kind": "lo-trinh",
  "title": "Giải thuật & Cấu trúc dữ liệu",
  "tag": "Tư duy giải quyết vấn đề",
  "color": "#5ed3c4",
  "why": "Đây là môn được kiểm tra trực tiếp trong mọi vòng phỏng vấn kỹ thuật, và cũng là thứ quyết định code của bạn chạy 0,2 giây hay 20 giây. Học một lần, dùng cả đời.",
  "folder": "https://github.com/Minh27032004/My-Learning/blob/main/roadmap/02-giai-thuat-ctdl.md",
  "page": null,
  "pageLabel": null,
  "prompts": {
    "lesson": "Luôn nêu độ phức tạp thời gian và không gian. Có ít nhất một ví dụ code Python chạy được, và một ví dụ về trường hợp biên dễ sai.",
    "quiz": "Mỗi câu phải liên quan tới độ phức tạp, tính đúng đắn, hoặc trường hợp biên. Không hỏi thuộc lòng định nghĩa. Ưu tiên dạng: cho đoạn code hoặc dữ liệu vào, hỏi kết quả hoặc độ phức tạp."
  },
  "modules": [
    {
      "name": "Phân tích độ phức tạp",
      "items": [
        "Ký hiệu Big-O, Big-Theta, Big-Omega",
        "Độ phức tạp thời gian của vòng lặp lồng nhau",
        "Độ phức tạp không gian",
        "Phân tích khấu hao (amortized) — vì sao append là O(1)",
        "Thang so sánh: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)",
        "Ước lượng: 10⁸ phép tính ≈ 1 giây"
      ]
    },
    {
      "name": "Cấu trúc dữ liệu tuyến tính",
      "items": [
        "Array / dynamic array và cơ chế nhân đôi bộ nhớ",
        "Linked list đơn, đôi, vòng",
        "Stack (LIFO) và ứng dụng: undo, duyệt biểu thức",
        "Queue (FIFO) và circular queue",
        "Deque — hai đầu",
        "Kỹ thuật con trỏ chậm/nhanh trên linked list"
      ]
    },
    {
      "name": "Hash",
      "items": [
        "Hàm băm và bảng băm hoạt động ra sao",
        "Xử lý va chạm: chaining vs open addressing",
        "Hash map, hash set, đánh đổi bộ nhớ lấy tốc độ",
        "Đếm tần suất và bài toán two-sum",
        "Vì sao O(1) chỉ là trung bình, xấu nhất là O(n)"
      ]
    },
    {
      "name": "Cây",
      "items": [
        "Cây nhị phân, cây nhị phân đầy đủ / hoàn chỉnh",
        "Duyệt cây: preorder, inorder, postorder, level-order",
        "Binary Search Tree: tìm, chèn, xoá",
        "Cây cân bằng: AVL, Red-Black (hiểu ý tưởng)",
        "Heap và priority queue",
        "Trie (cây tiền tố) cho tìm kiếm chuỗi",
        "Segment tree / Fenwick tree (nâng cao)"
      ]
    },
    {
      "name": "Đồ thị",
      "items": [
        "Biểu diễn: ma trận kề vs danh sách kề",
        "BFS — duyệt theo chiều rộng",
        "DFS — duyệt theo chiều sâu",
        "Phát hiện chu trình (có hướng và vô hướng)",
        "Sắp xếp tô-pô (topological sort)",
        "Dijkstra — đường đi ngắn nhất, trọng số dương",
        "Bellman-Ford — chấp nhận trọng số âm",
        "Floyd-Warshall — mọi cặp đỉnh",
        "Cây khung nhỏ nhất: Kruskal và Prim",
        "Union-Find (Disjoint Set Union)"
      ]
    },
    {
      "name": "Sắp xếp",
      "items": [
        "Bubble, Selection, Insertion — O(n²) nhưng phải hiểu",
        "Merge Sort — chia để trị, ổn định, O(n log n)",
        "Quick Sort — phân hoạch, trung bình nhanh nhất",
        "Heap Sort",
        "Counting Sort, Radix Sort, Bucket Sort — thoát khỏi O(n log n)",
        "Tính ổn định của thuật toán sắp xếp và khi nào nó quan trọng",
        "Sắp xếp theo khoá tuỳ chỉnh trong ngôn ngữ thật"
      ]
    },
    {
      "name": "Tìm kiếm",
      "items": [
        "Tìm tuyến tính",
        "Tìm nhị phân và các biến thể biên trái / biên phải",
        "Binary search trên đáp án (parametric search)",
        "Tìm trong mảng xoay vòng"
      ]
    },
    {
      "name": "Kỹ thuật giải thuật cốt lõi",
      "items": [
        "Đệ quy và cây đệ quy",
        "Quay lui (backtracking): hoán vị, tổ hợp, N-Queens, Sudoku",
        "Chia để trị",
        "Tham lam (greedy) và cách chứng minh tính đúng",
        "Quy hoạch động: memoization vs bottom-up",
        "DP kinh điển: leo cầu thang, đổi tiền, ba lô 0/1",
        "DP trên chuỗi: LCS, edit distance, LIS",
        "Hai con trỏ (two pointers)",
        "Cửa sổ trượt (sliding window) cố định và co giãn",
        "Tổng tiền tố (prefix sum) và difference array",
        "Thao tác bit: AND/OR/XOR, bitmask"
      ]
    },
    {
      "name": "Bài toán kinh điển nên biết",
      "items": [
        "Kadane — mảng con tổng lớn nhất",
        "Bài toán ngoặc hợp lệ",
        "Thiết kế LRU cache",
        "Trộn K danh sách đã sắp xếp",
        "Top-K phần tử bằng heap",
        "KMP / Rabin-Karp — so khớp chuỗi",
        "Reservoir sampling, Fisher-Yates shuffle"
      ]
    },
    {
      "name": "Luyện phỏng vấn",
      "items": [
        "Nhận diện pattern từ đề bài",
        "Quy trình trả lời: làm rõ → ví dụ → hướng tiếp cận → code → test → tối ưu",
        "Nói to suy nghĩ trong lúc code",
        "Blind 75 hoặc NeetCode 150",
        "Mock interview với người thật"
      ]
    }
  ]
}
);
