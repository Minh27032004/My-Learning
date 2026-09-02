# 🧠 Giải Thuật & Cấu Trúc Dữ Liệu (DSA) — Lộ Trình Học Toàn Diện

> Từ gốc đến nâng cao, kèm luyện phỏng vấn LeetCode. Dành cho sinh viên Software Engineering định hướng AI/ML + Backend.

---

## 📖 Tại sao mảng này quan trọng?

Cấu trúc dữ liệu & Giải thuật (DSA) không phải là môn học "để qua môn" — nó là **cách bạn tư duy về hiệu năng**. Mọi đoạn code bạn viết đều có một độ phức tạp ẩn; người không học DSA viết code chạy được, người học DSA viết code **chạy được với 100 triệu bản ghi**.

Cụ thể với định hướng của bạn:

- **Phỏng vấn (Interview)**: Hầu hết công ty công nghệ (FAANG, startup tốt, công ty product) phỏng vấn vòng coding bằng bài DSA trên LeetCode/HackerRank. Đây là "vé vào cửa" gần như bắt buộc. Không có cách nào "lách" — bạn phải luyện.
- **Backend**: Chọn sai cấu trúc dữ liệu = query chậm, RAM phình to, server sập khi tải cao. Hiểu Hash Table giúp bạn biết vì sao `index` trong database nhanh; hiểu B-Tree giúp bạn hiểu chính cái index đó được lưu thế nào; hiểu Big-O giúp bạn biết khi nào một vòng lặp lồng nhau sẽ giết chết throughput.
- **AI/ML & Data Pipeline**: Đây là điểm nhiều người bỏ qua. Tối ưu data pipeline (tiền xử lý dataset hàng triệu dòng), vector search (k-NN, ANN trong RAG / vector DB), tổ chức feature store, batch/streaming — tất cả đều là bài toán DSA. Một thuật toán O(n²) trong bước preprocessing có thể biến job 5 phút thành 5 giờ. Hiểu Heap giúp bạn làm "top-k", hiểu cây giúp bạn hiểu KD-Tree/Ball-Tree trong nearest neighbor, hiểu DP giúp bạn hiểu Viterbi/sequence alignment.

> **Tư tưởng cốt lõi (2026)**: Ngành đã chuyển từ "cày 800 bài" sang **"nhận diện pattern + lập luận có cấu trúc"**. Mục tiêu không phải nhớ lời giải, mà là nhìn ràng buộc bài toán (`n ≤ 10^5`? mảng đã sort? cần contiguous?) là biết ngay dùng kỹ thuật nào.

---

## 🎯 Mục tiêu sau khi hoàn thành

Khi học xong lộ trình này, bạn sẽ có thể:

- [ ] Phân tích độ phức tạp time/space của bất kỳ đoạn code nào (Big-O, amortized).
- [ ] Tự cài đặt (from scratch) mọi cấu trúc dữ liệu cốt lõi mà không cần thư viện.
- [ ] Nhìn một bài toán mới và nhận diện được pattern/kỹ thuật phù hợp trong < 5 phút.
- [ ] Giải thành thạo các bài Medium trên LeetCode, đụng được Hard có gợi ý.
- [ ] Chọn đúng cấu trúc dữ liệu khi thiết kế hệ thống backend / data pipeline.
- [ ] Hoàn thành **NeetCode 150** (hoặc tối thiểu **Blind 75**).

---

## 🧱 Yêu cầu trước (Prerequisites)

- **Thành thạo ít nhất 1 ngôn ngữ lập trình** — xem **[Mảng 01: Nền tảng lập trình](01-nen-tang-cs.md)**. Cần biết: biến, vòng lặp, hàm, mảng cơ bản, OOP cơ bản (class/object), con trỏ/tham chiếu.
  - **Khuyến nghị ngôn ngữ luyện DSA**: **Python** (cú pháp gọn, tập trung vào logic — tốt cho người mới và rất hợp định hướng AI/ML), hoặc **C++** (nhanh, dạy bạn quản lý bộ nhớ — tốt cho competitive programming). **Java** cũng phổ biến trong phỏng vấn. Tránh dùng JavaScript để luyện DSA nặng (số nguyên lớn, thiếu thư viện sẵn).
- **Toán cơ bản**: lũy thừa, logarit (hiểu vì sao `log₂(n)` nhỏ), tổ hợp cơ bản, quy nạp (cho recursion). Không cần cao siêu.

---

## ⏱️ Ước lượng thời gian

| Cường độ | Thời lượng | Phù hợp với |
|---|---|---|
| Thư thả (1-1.5h/ngày) | **5-6 tháng** | Vừa học vừa làm việc khác |
| Đều đặn (2-3h/ngày) | **3-4 tháng** | Sinh viên có thời gian ổn định |
| Cường độ cao (4-5h/ngày) | **8-10 tuần** | Cày gấp trước mùa phỏng vấn |

> **Lưu ý thực tế**: Phần lý thuyết (Module 1-9) chiếm ~40% thời gian. Phần luyện bài (xuyên suốt + Module 10) chiếm ~60%. **DSA học bằng tay, không học bằng mắt** — đọc hiểu một thuật toán ≠ giải được bài dùng nó.

---

# 📦 Các Module

> Thứ tự được sắp từ dễ → khó và có tính phụ thuộc. Module 1 là nền cho tất cả. Module 8 (kỹ thuật giải thuật) là "linh hồn" của phỏng vấn — nhưng cần CTDL ở Module 2-5 làm công cụ trước.

---

## Module 1 — 📊 Phân Tích Độ Phức Tạp (Complexity Analysis)

> **Học cái này TRƯỚC TIÊN.** Nó là "đơn vị đo" cho mọi thứ phía sau. Không hiểu Big-O thì không đánh giá được giải pháp nào tốt hơn.

### Lý thuyết cốt lõi

- **Tại sao đo bằng tiệm cận (asymptotic)?** Vì ta quan tâm hành vi khi `n` lớn, không quan tâm hằng số máy. `2n` và `100n` đều là `O(n)`.
- **Ba ký hiệu** (đừng nhầm lẫn — đây là lỗi kinh điển):
  - **Big-O `O(f)`** — *cận trên* (upper bound): "không tệ hơn". Dùng nhiều nhất khi nói về worst case.
  - **Big-Ω `Ω(f)`** — *cận dưới* (lower bound): "không tốt hơn". Dùng nói về best case hoặc giới hạn lý thuyết của bài toán (vd: sắp xếp so sánh tối thiểu `Ω(n log n)`).
  - **Big-Θ `Θ(f)`** — *chặt hai phía* (tight bound): vừa là cận trên vừa là cận dưới. Khi nói "thuật toán này là Θ(n log n)" nghĩa là cả best/worst đều cùng bậc.
- **Time vs Space complexity**: thời gian (số phép tính) vs bộ nhớ phụ (extra memory, KHÔNG tính input). Recursion tốn space ở **call stack** — đừng quên!
- **Các bậc phổ biến** (thuộc lòng thứ tự): `O(1)` < `O(log n)` < `O(n)` < `O(n log n)` < `O(n²)` < `O(2ⁿ)` < `O(n!)`.
- **Amortized analysis (phân tích khấu hao)**: chi phí *trung bình* trên một chuỗi thao tác, kể cả khi một thao tác lẻ tốn kém. Ví dụ kinh điển: **Dynamic Array** `push` là `O(1)` amortized dù lúc resize tốn `O(n)` — vì resize hiếm xảy ra (nhân đôi capacity). Hai phương pháp: **aggregate** và **accounting/potential method**.
- **Cách tính độ phức tạp thực tế**:
  - Vòng lặp đơn → `O(n)`; lồng nhau → nhân vào (`O(n²)`).
  - Chia đôi mỗi bước → có `log n`.
  - Đệ quy → dùng **Master Theorem** cho dạng `T(n) = aT(n/b) + f(n)`.
  - Mẹo thực chiến: nhìn ràng buộc `n` để đoán độ phức tạp đích. `n ≤ 20` → mùi `O(2ⁿ)`/backtracking; `n ≤ 500` → `O(n³)` ok; `n ≤ 10^5` → cần `O(n log n)`; `n ≤ 10^9` → cần `O(log n)` hoặc toán.

### 📚 Tài nguyên

- 📕 **CLRS** (Introduction to Algorithms) — Chương 2, 3, 4 (đặc biệt 4.5 Master Theorem). Chuẩn học thuật, hơi nặng.
- 📗 **Grokking Algorithms** — Chương 1 (Big-O bằng hình minh hoạ, cực dễ hiểu cho người mới).
- 🌐 **Big-O Cheat Sheet** (bigocheatsheet.com) — bảng tra cứu in ra dán bàn.
- 🎥 **NeetCode** — video "Big O Notation" và playlist DSA cơ bản.

### 🏋️ Bài tập & Checklist

- [ ] Tự tính Big-O cho 10 đoạn code (vòng lặp đơn/lồng/đệ quy).
- [ ] Giải thích được vì sao `dynamic array push` là `O(1)` amortized.
- [ ] Phân biệt rành mạch O, Θ, Ω bằng lời.
- [ ] Áp dụng Master Theorem cho Merge Sort `T(n)=2T(n/2)+O(n)` ra `O(n log n)`.
- [ ] Nhìn ràng buộc `n` đoán được độ phức tạp mục tiêu.

---

## Module 2 — 📏 Cấu Trúc Dữ Liệu Tuyến Tính (Linear Data Structures)

### Lý thuyết cốt lõi

| CTDL | Truy cập index | Tìm kiếm | Chèn/Xoá đầu | Chèn/Xoá cuối | Ghi chú |
|---|---|---|---|---|---|
| **Array (tĩnh)** | `O(1)` | `O(n)` | `O(n)` | `O(n)` | Kích thước cố định, liền kề bộ nhớ → cache-friendly |
| **Dynamic Array** (vector/list/ArrayList) | `O(1)` | `O(n)` | `O(n)` | `O(1)` amortized | Tự resize (nhân đôi) |
| **Singly Linked List** | `O(n)` | `O(n)` | `O(1)` | `O(n)`* | Mỗi node trỏ next |
| **Doubly Linked List** | `O(n)` | `O(n)` | `O(1)` | `O(1)`* | Có cả prev/next, dễ xoá ngược |
| **Stack** (LIFO) | — | — | — | push/pop `O(1)` | "Vào sau ra trước" |
| **Queue** (FIFO) | — | — | enqueue/dequeue `O(1)` | — | "Vào trước ra trước" |
| **Deque** | — | — | `O(1)` 2 đầu | `O(1)` 2 đầu | Hàng đợi 2 đầu |

> *Cuối list `O(1)` nếu có con trỏ `tail`. **Circular Linked List**: node cuối trỏ về đầu — dùng cho buffer vòng (round-robin scheduler, ring buffer).

- **Array vs Linked List — đánh đổi cốt lõi**: Array truy cập ngẫu nhiên `O(1)` và cache-friendly (dữ liệu liền kề) nhưng chèn/xoá giữa tốn `O(n)`. Linked List chèn/xoá `O(1)` (khi đã có con trỏ) nhưng không random access và cache kém. **Thực tế: 90% trường hợp Dynamic Array thắng** vì cache locality — Linked List bị lạm dụng nhiều hơn cần thiết.
- **Stack** ứng dụng: undo/redo, kiểm tra ngoặc cân bằng, DFS, call stack, đảo ngược, biểu thức hậu tố.
- **Queue** ứng dụng: BFS, hàng đợi tác vụ (job queue/message queue trong backend!), buffering streaming data.
- **Deque** ứng dụng: sliding window maximum, lưu lịch sử có giới hạn.

### 📚 Tài nguyên

- 📕 CLRS — Chương 10 (Elementary Data Structures).
- 🌐 **VisuAlgo** (visualgo.net) — xem animation linked list/stack/queue, cực kỳ trực quan.
- 🎥 NeetCode — Arrays & Hashing, Stack, Linked List playlists.

### 🏋️ Bài tập (LeetCode — gợi ý ~15-20 bài)

- **Stack** (~5 bài): Valid Parentheses, Min Stack, Daily Temperatures, Evaluate Reverse Polish Notation, Largest Rectangle in Histogram (Hard).
- **Linked List** (~7 bài): Reverse Linked List, Merge Two Sorted Lists, Linked List Cycle (Floyd), Reorder List, Remove Nth Node From End, Copy List with Random Pointer, LRU Cache (kết hợp DLL + Hash).
- **Queue/Deque** (~3 bài): Implement Queue using Stacks, Sliding Window Maximum (Hard).

### Checklist

- [ ] Tự cài Dynamic Array (có logic resize) from scratch.
- [ ] Tự cài Singly + Doubly Linked List (insert/delete/reverse).
- [ ] Tự cài Stack & Queue (cả bằng array lẫn linked list).
- [ ] Hiểu kỹ thuật **Floyd Cycle Detection** (fast/slow pointer).
- [ ] Cài được **LRU Cache** (đây là bài "must-know" cho cả phỏng vấn lẫn backend caching).

---

## Module 3 — #️⃣ Hash (Hash Table / Hash Map / Set)

> Đây là CTDL **được hỏi nhiều nhất trong phỏng vấn**. Rất nhiều bài "biến O(n²) thành O(n)" chỉ nhờ một cái hash map.

### Lý thuyết cốt lõi

- **Hash Table / Hash Map**: ánh xạ key → value, truy cập/chèn/xoá trung bình `O(1)`, worst case `O(n)` (khi collision dồn cục).
- **Hàm băm (hash function)**: biến key bất kỳ → chỉ số mảng. Tiêu chí tốt: phân bố đều, nhanh, deterministic. Vd đơn giản: `hash(key) % capacity`.
- **Xử lý va chạm (collision handling)** — hai key khác nhau ra cùng index:
  - **Chaining (móc xích)**: mỗi bucket là một linked list. Đơn giản, phổ biến (Java HashMap, Python trước đây).
  - **Open Addressing (địa chỉ mở)**: nếu đầy thì dò sang ô khác — *linear probing*, *quadratic probing*, *double hashing*. Tiết kiệm bộ nhớ, cache tốt hơn nhưng phức tạp khi xoá.
- **Load factor** (`số phần tử / capacity`): vượt ngưỡng (~0.7) thì **rehash** (cấp phát lớn hơn, băm lại) — đây là lý do `O(1)` chỉ là *amortized average*.
- **Set**: như Hash Map nhưng chỉ lưu key (kiểm tra "đã tồn tại chưa" `O(1)`).
- **Ứng dụng**: đếm tần suất (frequency count), khử trùng lặp, caching, index trong database, "đã thấy chưa" trong duyệt đồ thị, two-sum. Trong AI/ML: vocab → token id, feature hashing, dedup dataset.

### 📚 Tài nguyên

- 📕 CLRS — Chương 11 (Hash Tables).
- 📗 Grokking Algorithms — Chương 5 (Hash Tables, rất dễ hiểu).
- 🌐 VisuAlgo — Hash Table (xem chaining vs open addressing).

### 🏋️ Bài tập (LeetCode — ~10 bài)

Two Sum, Group Anagrams, Top K Frequent Elements, Valid Anagram, Contains Duplicate, Longest Consecutive Sequence, Subarray Sum Equals K, LRU Cache.

### Checklist

- [ ] Tự cài Hash Map from scratch (dùng chaining).
- [ ] Giải thích collision và 2 cách xử lý.
- [ ] Hiểu vì sao load factor → rehash → `O(1)` chỉ là amortized.
- [ ] Phản xạ: thấy "đếm/dedup/tra cứu nhanh" là nghĩ tới Hash.

---

## Module 4 — 🌳 Cây (Trees)

> Cây xuất hiện *khắp nơi*: filesystem, DOM, database index, decision tree (ML!), parser. Phỏng vấn rất hay hỏi.

### Lý thuyết cốt lõi

- **Binary Tree**: mỗi node tối đa 2 con. Thuật ngữ: root, leaf, height, depth, độ sâu.
- **Binary Search Tree (BST)**: con trái < node < con phải. Tìm/chèn/xoá `O(h)` với `h` là chiều cao → `O(log n)` nếu cân bằng, nhưng **`O(n)` nếu suy biến** thành "que" (insert dữ liệu đã sort). Đây chính là lý do cần cây cân bằng.
- **Cây cân bằng (self-balancing)**:
  - **AVL Tree**: cân bằng nghiêm ngặt (chênh lệch chiều cao ≤ 1), xoay (rotation) sau mỗi thao tác. Tìm kiếm nhanh hơn, nhưng insert/delete nhiều rotation hơn.
  - **Red-Black Tree**: cân bằng lỏng hơn nhưng ít rotation → ghi nhanh hơn. Dùng trong `std::map` (C++), `TreeMap` (Java), Linux kernel. **B-Tree/B+Tree** (mở rộng) là nền tảng của index database (MySQL, PostgreSQL) và filesystem.
- **Heap (min-heap / max-heap)**: cây nhị phân hoàn chỉnh, cha ≤ con (min) hoặc cha ≥ con (max). Cài bằng **array**. `peek` `O(1)`, `push`/`pop` `O(log n)`. Dùng cho **Priority Queue**, top-k, Dijkstra, Heap Sort, median stream.
- **Trie (prefix tree)**: cây lưu chuỗi theo ký tự. Tìm prefix `O(L)` với `L` độ dài chuỗi. Dùng cho autocomplete, spell-check, IP routing, từ điển.
- **Segment Tree**: truy vấn & cập nhật **range** (sum/min/max trên đoạn) `O(log n)`. Mạnh cho competitive programming.
- **Fenwick Tree / BIT (Binary Indexed Tree)**: prefix sum + cập nhật điểm `O(log n)`, code gọn hơn Segment Tree (dùng bit `i & (-i)`) nhưng kém linh hoạt hơn.
- **Duyệt cây (Traversal)** — phải thuộc nằm lòng:
  - **DFS** (đệ quy/stack): **Preorder** (Node→L→R), **Inorder** (L→Node→R — *với BST cho ra dãy tăng dần!*), **Postorder** (L→R→Node — dùng khi xoá cây / tính từ dưới lên).
  - **BFS** (queue): duyệt theo tầng (level-order) — dùng cho "shortest path không trọng số", duyệt theo level.

### 📚 Tài nguyên

- 📕 CLRS — Ch 12 (BST), Ch 13 (Red-Black), Ch 6 (Heaps).
- 🌐 VisuAlgo — BST, AVL, Heap, các animation xoay cây cực hay.
- 🎥 NeetCode — Trees, Heap/Priority Queue, Tries playlists.
- 🌐 **cp-algorithms.com** — Segment Tree, Fenwick Tree (chuẩn cho competitive).

### 🏋️ Bài tập (LeetCode — ~18-22 bài)

- **Binary Tree/BST** (~10): Invert Binary Tree, Max Depth, Diameter, Balanced Binary Tree, Same Tree, Lowest Common Ancestor, Level Order Traversal (BFS), Validate BST, Kth Smallest in BST, Construct Tree from Preorder+Inorder.
- **Heap** (~5): Kth Largest Element, Last Stone Weight, K Closest Points to Origin, Task Scheduler, Find Median from Data Stream (Hard — two heaps).
- **Trie** (~3): Implement Trie, Design Add and Search Words, Word Search II (Hard).

### Checklist

- [ ] Tự cài BST (insert/delete/search) + cả 3 traversal (đệ quy & lặp).
- [ ] Cài Min-Heap from scratch bằng array (heapify up/down).
- [ ] Hiểu vì sao Inorder của BST cho dãy tăng dần.
- [ ] Cài được Trie.
- [ ] Giải thích vì sao database dùng B-Tree thay vì BST thường (đĩa/disk I/O).
- [ ] (Nâng cao) Cài Segment Tree hoặc Fenwick Tree.

---

## Module 5 — 🕸️ Đồ Thị (Graphs)

> Đồ thị là tổng quát hoá của cây. Mạng xã hội, bản đồ, dependency, knowledge graph (AI!), recommendation — tất cả là graph.

### Lý thuyết cốt lõi

- **Biểu diễn**:
  - **Adjacency List**: mỗi đỉnh giữ danh sách hàng xóm. Tốn `O(V+E)` bộ nhớ. **Tốt cho đồ thị thưa (sparse)** — hầu hết trường hợp thực tế.
  - **Adjacency Matrix**: ma trận `V×V`. Tốn `O(V²)`. Kiểm tra cạnh `O(1)`, tốt cho đồ thị dày (dense) hoặc cần check cạnh liên tục.
- **Duyệt**:
  - **BFS** (queue): tìm **đường ngắn nhất theo số cạnh** (đồ thị không trọng số), duyệt theo lớp. `O(V+E)`.
  - **DFS** (stack/đệ quy): tìm thành phần liên thông, phát hiện chu trình, topological sort, backtracking trên graph. `O(V+E)`.
- **Đường đi ngắn nhất (Shortest Path)**:
  - **Dijkstra** (dùng min-heap): trọng số **không âm**, `O((V+E) log V)`. Đây là phiên bản phải biết. (Xem Module 9.)
  - **Bellman-Ford**: cho phép **trọng số âm**, phát hiện chu trình âm, `O(V·E)`. Chậm hơn nhưng linh hoạt hơn.
  - **Floyd-Warshall**: đường ngắn nhất **mọi cặp đỉnh** (all-pairs), `O(V³)`, dùng DP. Tốt khi `V` nhỏ.
- **Cây khung nhỏ nhất (MST)**:
  - **Kruskal**: sort cạnh + Union-Find, `O(E log E)`. Tư duy "gộp cạnh nhỏ nhất nếu không tạo chu trình".
  - **Prim**: mọc từ một đỉnh bằng heap, `O(E log V)`. Giống Dijkstra.
- **Topological Sort**: sắp xếp đỉnh trên **DAG** (đồ thị có hướng không chu trình) theo thứ tự phụ thuộc. Dùng Kahn (BFS đếm in-degree) hoặc DFS. Ứng dụng: build system, lịch học môn tiên quyết, task scheduling, **dependency resolution trong ML pipeline (DAG như Airflow!)**.
- **Union-Find / DSU (Disjoint Set Union)**: quản lý các nhóm rời nhau, `union` và `find` gần `O(1)` (nhờ *path compression* + *union by rank*). Dùng cho Kruskal, đếm thành phần liên thông, phát hiện chu trình.

### 📚 Tài nguyên

- 📕 CLRS — Phần VI (Graph Algorithms, Ch 22-25).
- 📗 Grokking Algorithms — Ch 6 (BFS), Ch 9 (Dijkstra).
- 🌐 VisuAlgo — Graph Traversal, SSSP, MST, Union-Find.
- 🌐 cp-algorithms.com — toàn bộ graph (chuẩn vàng).

### 🏋️ Bài tập (LeetCode — ~18-20 bài)

- **BFS/DFS grid & graph**: Number of Islands, Clone Graph, Max Area of Island, Rotting Oranges, Pacific Atlantic Water Flow, Walls and Gates.
- **Topological/DSU**: Course Schedule I & II, Redundant Connection, Number of Connected Components, Graph Valid Tree, Accounts Merge.
- **Shortest path nâng cao**: Network Delay Time (Dijkstra), Cheapest Flights Within K Stops (Bellman-Ford), Swim in Rising Water.

### Checklist

- [ ] Cài đồ thị bằng cả adjacency list và matrix.
- [ ] Cài BFS & DFS (đệ quy + lặp).
- [ ] Cài Dijkstra với min-heap.
- [ ] Cài Union-Find (có path compression + union by rank).
- [ ] Cài Topological Sort (cả Kahn lẫn DFS).
- [ ] Hiểu khi nào dùng Dijkstra vs Bellman-Ford vs Floyd-Warshall.

---

## Module 6 — 🔀 Thuật Toán Sắp Xếp (Sorting)

> Bạn sẽ hiếm khi tự viết sort trong production (đã có `sort()` built-in), nhưng **hiểu nguyên lý là bắt buộc** — vừa để phỏng vấn, vừa để biết cái `sort()` kia đang làm gì.

### Lý thuyết cốt lõi

| Thuật toán | Trung bình | Worst | Space | Stable? | Ghi chú |
|---|---|---|---|---|---|
| **Bubble Sort** | `O(n²)` | `O(n²)` | `O(1)` | ✅ | Chỉ để dạy học, không dùng thực |
| **Selection Sort** | `O(n²)` | `O(n²)` | `O(1)` | ❌ | Ít swap nhất |
| **Insertion Sort** | `O(n²)` | `O(n²)` | `O(1)` | ✅ | **Nhanh cho mảng nhỏ/gần sort** — dùng làm "đáy" của quicksort lai |
| **Merge Sort** | `O(n log n)` | `O(n log n)` | `O(n)` | ✅ | Divide & Conquer, ổn định, dùng cho linked list & external sort |
| **Quick Sort** | `O(n log n)` | `O(n²)`* | `O(log n)` | ❌ | Nhanh nhất thực tế, in-place. *Worst khi pivot tệ |
| **Heap Sort** | `O(n log n)` | `O(n log n)` | `O(1)` | ❌ | In-place, không cần thêm bộ nhớ, nhưng cache kém |
| **Counting Sort** | `O(n+k)` | `O(n+k)` | `O(k)` | ✅ | Không so sánh! Chỉ cho số nguyên phạm vi nhỏ `k` |
| **Radix Sort** | `O(d·(n+k))` | — | `O(n+k)` | ✅ | Sort theo từng chữ số, cho số nguyên/chuỗi |

- **Giới hạn lý thuyết**: mọi thuật toán sort **dựa trên so sánh** không thể nhanh hơn `Ω(n log n)`. Counting/Radix vượt qua được vì **không so sánh** (đổi lại có ràng buộc về kiểu dữ liệu).
- **Stable (ổn định)**: giữ nguyên thứ tự tương đối các phần tử bằng nhau — quan trọng khi sort theo nhiều khoá (multi-key sort).
- **Khi nào dùng gì**: Thực tế built-in sort dùng **Introsort** (C++: quicksort + heapsort fallback) hoặc **Timsort** (Python/Java: merge + insertion, tối ưu cho dữ liệu gần sort). Counting/Radix khi sort hàng triệu số nguyên nhỏ (vd: phân loại theo nhãn trong data pipeline).

### 📚 Tài nguyên

- 📕 CLRS — Ch 2 (Insertion/Merge), Ch 7 (Quicksort), Ch 8 (Counting/Radix).
- 🌐 **VisuAlgo — Sorting** (xem animation cạnh nhau, đỉnh cao trực quan).
- 🌐 toptal.com/developers/sorting-algorithms (so sánh động).

### 🏋️ Bài tập (LeetCode — ~6-8 bài)

Sort Colors (Dutch National Flag), Merge Intervals, Largest Number, Kth Largest (quickselect — biến thể quicksort), Sort an Array (tự cài), Sort List (merge sort trên linked list), Maximum Gap (radix/bucket).

### Checklist

- [ ] Tự cài Merge Sort & Quick Sort from scratch.
- [ ] Tự cài Heap Sort.
- [ ] Giải thích vì sao sort so sánh tối thiểu là `Ω(n log n)`.
- [ ] Hiểu stable vs unstable và khi nào cần stable.
- [ ] Hiểu **Quickselect** (tìm phần tử thứ k, `O(n)` trung bình).

---

## Module 7 — 🔎 Thuật Toán Tìm Kiếm (Searching)

### Lý thuyết cốt lõi

- **Linear Search**: quét tuần tự `O(n)`. Dùng khi dữ liệu chưa sort hoặc nhỏ.
- **Binary Search**: dữ liệu **đã sort**, chia đôi mỗi bước `O(log n)`. **Cực kỳ quan trọng** — bài binary search thường khó vì cài sai biên (off-by-one).
- **Các biến thể (variants) — đây mới là phần hay bị hỏi**:
  - **Lower bound / Upper bound**: tìm vị trí đầu tiên/cuối cùng thoả điều kiện (vd phần tử ≥ x đầu tiên).
  - **Tìm trong mảng đã xoay (rotated sorted array)**: vẫn `O(log n)` bằng cách xác định nửa nào đang sort.
  - **Binary search trên đáp án (binary search on answer)**: không search trên mảng mà search trên **không gian giá trị đáp án** — kỹ thuật mạnh cho bài "tìm giá trị nhỏ nhất/lớn nhất thoả điều kiện monotonic" (vd: Koko Eating Bananas, Capacity to Ship Packages). **Đây là kỹ thuật phỏng vấn cao cấp rất đáng đầu tư.**

### 📚 Tài nguyên

- 📗 Grokking Algorithms — Ch 1 (Binary Search trực quan).
- 🎥 NeetCode — Binary Search playlist.
- 🌐 LeetCode Explore — Binary Search card (phân loại 3 template chuẩn).

### 🏋️ Bài tập (LeetCode — ~8-10 bài)

Binary Search, Search a 2D Matrix, Find Minimum in Rotated Sorted Array, Search in Rotated Sorted Array, Koko Eating Bananas, Time Based Key-Value Store, Median of Two Sorted Arrays (Hard), Find First and Last Position.

### Checklist

- [ ] Cài binary search đúng biên (không off-by-one) — viết được cả `lower_bound`/`upper_bound`.
- [ ] Giải được bài rotated sorted array.
- [ ] Nắm kỹ thuật **binary search on answer** (nhận diện: "tìm min/max thoả điều kiện monotonic").

---

## Module 8 — 🧩 Kỹ Thuật Giải Thuật Cốt Lõi (Core Algorithmic Techniques)

> **Đây là module quan trọng nhất cho phỏng vấn.** CTDL là "danh từ", kỹ thuật ở đây là "động từ". Đa số bài LeetCode Medium/Hard là về việc nhận ra dùng kỹ thuật nào.

### 8.1 Recursion (Đệ quy)

- Hàm gọi chính nó, có **base case** (điều kiện dừng) và **recursive case**. Nền tảng cho D&C, backtracking, DP, duyệt cây.
- Tốn space ở call stack `O(độ sâu)`. Cẩn thận stack overflow.
- **Tail recursion** & cách chuyển đệ quy → vòng lặp.

### 8.2 Backtracking (Quay lui)

- Thử mọi khả năng, "quay lui" khi đi vào ngõ cụt. Khung: *choose → explore → un-choose*.
- Độ phức tạp thường mũ (`O(2ⁿ)`, `O(n!)`) → chỉ dùng khi `n` nhỏ.
- Dạng kinh điển: subsets, permutations, combinations, N-Queens, Sudoku, word search.

### 8.3 Divide & Conquer (Chia để trị)

- Chia bài toán thành các bài con độc lập, giải rồi gộp. Vd: Merge Sort, Quick Sort, binary search, closest pair of points.
- Phân tích bằng Master Theorem.

### 8.4 Greedy (Tham lam)

- Mỗi bước chọn phương án **tối ưu cục bộ**, hy vọng ra tối ưu toàn cục. **Chỉ đúng khi bài toán có "greedy choice property"** — phải chứng minh, không phải lúc nào cũng đúng!
- Vd: activity selection, Huffman coding, đổi tiền (với hệ tiền chuẩn), Dijkstra/Prim/Kruskal.
- **Cạm bẫy**: greedy hay "trông có vẻ đúng" nhưng sai — nếu nghi ngờ, kiểm chứng bằng DP.

### 8.5 Dynamic Programming (Quy hoạch động) ⭐ — học kỹ phần này

> DP là nỗi sợ lớn nhất của người luyện phỏng vấn. Bí quyết: **nhận ra cấu trúc, không học thuộc lời giải.**

- **Điều kiện áp dụng**:
  1. **Bài toán con gối nhau (overlapping subproblems)**: cùng một bài con bị tính lại nhiều lần (vd Fibonacci đệ quy thuần tính `fib(3)` rất nhiều lần).
  2. **Cấu trúc con tối ưu (optimal substructure)**: lời giải tối ưu của bài lớn xây từ lời giải tối ưu của bài con.
- **Hai cách cài**:
  - **Memoization (top-down)**: đệ quy + cache kết quả. Dễ nghĩ, code tự nhiên từ công thức truy hồi. Tốn call stack.
  - **Tabulation (bottom-up)**: điền bảng từ nhỏ đến lớn bằng vòng lặp. Nhanh hơn (không overhead đệ quy), dễ tối ưu bộ nhớ.
- **Quy trình giải 1 bài DP** (làm theo từng bước):
  1. Định nghĩa **state** (trạng thái) — `dp[i]` nghĩa là gì?
  2. Tìm **công thức truy hồi (recurrence/transition)**.
  3. Xác định **base case**.
  4. Xác định **thứ tự tính** và đáp án nằm ở đâu.
  5. (Tối ưu) giảm chiều bộ nhớ nếu chỉ cần vài state trước đó.
- **Các dạng DP kinh điển (phải thuộc)**:
  - **Knapsack** (0/1 và unbounded): chọn đồ vật tối đa hoá giá trị trong giới hạn sức chứa.
  - **LIS** (Longest Increasing Subsequence): dãy con tăng dài nhất — `O(n²)` DP hoặc `O(n log n)` với binary search.
  - **LCS** (Longest Common Subsequence): dãy con chung dài nhất hai chuỗi.
  - **Edit Distance (Levenshtein)**: số thao tác ít nhất biến chuỗi A → B. Ứng dụng: spell-check, **so khớp DNA/sequence alignment trong bioinformatics & NLP**.
  - **Coin Change**, **House Robber**, **DP trên lưới (grid)**, **DP trên cây**, **bitmask DP**.

### 8.6 Two Pointers (Hai con trỏ)

- Hai chỉ số chạy trên mảng (thường đã sort) → biến `O(n²)` thành `O(n)`. Hai biến thể: hai đầu chụm vào (two sum sorted), hoặc cùng chiều (remove duplicates).

### 8.7 Sliding Window (Cửa sổ trượt)

- Cho bài toán **subarray/substring liên tục (contiguous)**. Mở rộng cửa sổ (di chuyển `right`) đến khi vi phạm điều kiện, rồi co lại (`left`). `O(n)`.
- **Phân biệt với Two Pointers**: Two Pointers hai con trỏ có thể chạy độc lập; Sliding Window duy trì một **đoạn liền kề** có ràng buộc. (Lỗi của 2026: nhiều người nhầm hai cái này.)

### 8.8 Prefix Sum (Tổng tiền tố)

- Tiền xử lý mảng tổng cộng dồn → trả lời "tổng đoạn `[i..j]`" trong `O(1)`. Mở rộng: prefix XOR, prefix product, 2D prefix sum. Cực hữu ích cho range queries và bài "subarray sum".

### 8.9 Bit Manipulation (Thao tác bit)

- Các phép `&`, `|`, `^`, `~`, `<<`, `>>`. Mẹo: `x & (x-1)` xoá bit thấp nhất; `x & (-x)` lấy bit thấp nhất (dùng trong Fenwick); XOR để tìm số lẻ/khử cặp; bitmask để biểu diễn tập hợp con.

### 📚 Tài nguyên

- 📕 CLRS — Ch 4 (D&C), Ch 15 (DP), Ch 16 (Greedy).
- 📗 Grokking Algorithms — Ch 8 (Greedy), Ch 9 (DP).
- 🎥 **NeetCode — 1-D DP & 2-D DP playlists** (giảng DP cực dễ hiểu).
- 🎥 **Aditya Verma (YouTube)** — DP playlist huyền thoại, dạy DP theo "pattern".
- 🌐 **LeetCode Patterns / Sliding Window roadmap** — luyện theo nhóm.

### 🏋️ Bài tập (LeetCode — đây là phần cày nhiều nhất, ~50-60 bài)

- **Two Pointers** (~6): Valid Palindrome, Two Sum II, 3Sum, Container With Most Water, Trapping Rain Water (Hard).
- **Sliding Window** (~6): Best Time to Buy/Sell Stock, Longest Substring Without Repeating Characters, Longest Repeating Character Replacement, Permutation in String, Minimum Window Substring (Hard).
- **Prefix Sum** (~4): Subarray Sum Equals K, Product of Array Except Self, Range Sum Query.
- **Backtracking** (~8): Subsets, Combination Sum, Permutations, Word Search, Palindrome Partitioning, N-Queens, Letter Combinations of Phone Number.
- **DP** (~20-25): Climbing Stairs, House Robber I/II, Coin Change, Longest Increasing Subsequence, Longest Common Subsequence, Word Break, Decode Ways, Unique Paths, Edit Distance, 0/1 Knapsack (Partition Equal Subset Sum), Longest Palindromic Substring, Maximum Product Subarray, Best Time to Buy/Sell Stock with Cooldown.
- **Greedy** (~5): Maximum Subarray (Kadane), Jump Game I/II, Gas Station, Hand of Straights.
- **Bit Manipulation** (~5): Single Number, Number of 1 Bits, Counting Bits, Reverse Bits, Missing Number, Sum of Two Integers.

### Checklist

- [ ] Viết được khung backtracking tổng quát (choose/explore/un-choose).
- [ ] Giải được ≥ 3 dạng DP kinh điển không cần xem lời giải (knapsack, LCS, LIS).
- [ ] Phân biệt rõ memoization vs tabulation, chuyển đổi được giữa hai.
- [ ] Phân biệt Two Pointers vs Sliding Window.
- [ ] Nhận diện pattern qua ràng buộc bài toán (mảng sorted? contiguous? n nhỏ?).
- [ ] Hiểu khi nào greedy đúng và khi nào phải dùng DP.

---

## Module 9 — ⭐ Các Thuật Toán/Bài Toán "Hay" Nên Biết

> Không thuộc một nhóm cố định nhưng xuất hiện đủ thường xuyên để đáng học riêng.

### Lý thuyết cốt lõi

- **KMP (Knuth-Morris-Pratt) & String Matching**: tìm chuỗi con trong văn bản `O(n+m)` (thay vì `O(n·m)` ngây thơ) nhờ bảng *failure/LPS*. Họ hàng: Rabin-Karp (rolling hash), Z-algorithm. Ứng dụng: search, plagiarism detection, bioinformatics.
- **Kadane's Algorithm**: tìm subarray tổng lớn nhất `O(n)` — DP một dòng. Phải thuộc.
- **Dijkstra với Heap**: bản hiệu năng cao của Dijkstra dùng priority queue, `O((V+E) log V)`. (Đã nêu Module 5 — nhấn mạnh lại vì cực hay hỏi.)
- **Fast Exponentiation (Binary Exponentiation)**: tính `aⁿ` trong `O(log n)` bằng bình phương lặp. Mở rộng: modular exponentiation (mật mã RSA), lũy thừa ma trận (tính Fibonacci `O(log n)`).
- **Sieve of Eratosthenes**: liệt kê mọi số nguyên tố ≤ `n` trong `O(n log log n)`. Nền tảng cho bài toán số học.
- **A\* Search**: Dijkstra + heuristic (hàm ước lượng) → tìm đường thông minh hơn cho game/robotics/pathfinding. Là cầu nối tới search trong AI.

### 📚 Tài nguyên

- 🌐 **cp-algorithms.com** — KMP, Sieve, Binary Exponentiation, Z-function (chuẩn vàng).
- 📕 CLRS — String Matching (Ch 32), Number-Theoretic Algorithms (Ch 31).
- 🌐 **Codeforces** + **CSES Problem Set** (cses.fi/problemset) — luyện các thuật toán này ở môi trường competitive.

### 🏋️ Bài tập

LeetCode: Maximum Subarray (Kadane), Pow(x,n) (fast exp), Implement strStr() (KMP/string matching), Count Primes (Sieve). CSES Problem Set cho bản competitive sâu hơn.

### Checklist

- [ ] Cài fast exponentiation (cả modular).
- [ ] Cài Sieve of Eratosthenes.
- [ ] Hiểu ý tưởng bảng LPS của KMP.
- [ ] Hiểu A* khác Dijkstra ở điểm nào (heuristic).

---

## Module 10 — 🎯 Chiến Lược Luyện Phỏng Vấn (Interview Prep Strategy)

> Lý thuyết xong rồi, đây là phần biến kiến thức thành **offer**.

### 10.1 Tư duy nhận diện pattern (quan trọng nhất 2026)

Ngành đã chuyển từ "cày 500-800 bài mù quáng" sang **lập luận có cấu trúc**: nhìn *signal words*, *ràng buộc*, *cấu trúc dữ liệu input* để chọn kỹ thuật. Bảng nhận diện nhanh:

| Tín hiệu trong đề | Kỹ thuật khả dĩ |
|---|---|
| Mảng/chuỗi đã **sorted** | Binary Search, Two Pointers |
| **Subarray/substring liên tục** (contiguous) | Sliding Window, Prefix Sum |
| "Top K", "K lớn/nhỏ nhất", "median" | Heap / Quickselect |
| "Đếm", "đã thấy chưa", "dedup" | Hash Map / Set |
| "Tất cả tổ hợp/hoán vị/tập con" | Backtracking |
| "Số cách", "min/max", "tối ưu" + có lựa chọn | Dynamic Programming |
| "Đường ngắn nhất", "kết nối", "lan toả" | BFS / DFS / Dijkstra / Union-Find |
| `n ≤ 20` | Backtracking / bitmask (mũ chấp nhận được) |
| Cần `O(log n)` / `n` rất lớn | Binary Search / toán / cấu trúc cây |
| "Prefix", "autocomplete", "từ điển" | Trie |
| "Phụ thuộc", "thứ tự", "tiên quyết" | Topological Sort |

### 10.2 Lộ trình LeetCode 2026

- **NeetCode 150** (neetcode.io/practice) — **lựa chọn hàng đầu**. Bao trùm Blind 75 + lấp các lỗ hổng (tries, intervals, bit manipulation, advanced graphs) + có **video walkthrough** từng bài. Theo thống kê 2024-2026, bài trong NeetCode 150 xuất hiện ~52% các buổi phỏng vấn (Blind 75 ~38%). NeetCode tổ chức **theo pattern**, đúng với tư duy 2026.
- **Blind 75** — nếu **gấp thời gian** (1 list rút gọn cũng phủ phần lớn phỏng vấn).
- **Grind 75** (grind75.com) — biến thể có thể chỉnh theo số tuần/số giờ bạn có, sắp xếp theo độ ưu tiên.
- **NeetCode 250 / 450** — nếu muốn cày sâu hơn sau khi xong 150.

> **Khuyến nghị thực tế**: Bắt đầu bằng **NeetCode Roadmap** (nó vẽ đúng đồ thị phụ thuộc giữa các chủ đề), bám theo từng pattern. Đừng nhảy lung tung.

### 10.3 Cách tiếp cận 1 bài từ đầu (khung UMPIRE / clarify-first)

1. **Hiểu đề (Understand)**: hỏi lại ràng buộc — `n` bao lớn? có số âm/trùng? input rỗng? Đừng code vội.
2. **Ví dụ (Match/Examples)**: tự tạo 1-2 test case tay, kể cả edge case (rỗng, 1 phần tử, trùng nhau).
3. **Brute force trước**: nói ra lời giải ngây thơ + độ phức tạp. **Luôn có brute force trong túi** — thà có lời giải chậm còn hơn không có gì.
4. **Tối ưu (Plan)**: nhận diện pattern, đề xuất cải tiến, nói rõ time/space mới.
5. **Code sạch (Implement)**: vừa viết vừa giải thích (think aloud — giám khảo chấm cả tư duy).
6. **Kiểm thử (Review/Evaluate)**: chạy tay qua test, soi edge case, off-by-one.

> **Quy tắc thời gian luyện**: Nếu kẹt > **25-30 phút**, xem hint/lời giải, **hiểu kỹ rồi tự code lại từ đầu không nhìn**. Cày một bài mãi không ra chỉ phí thời gian. Quan trọng là **spaced repetition** — quay lại bài đã làm sau vài ngày/tuần.

### 📚 Tài nguyên

- 🌐 **neetcode.io** — Roadmap + 150/250, video. Tài nguyên #1.
- 📘 **Cracking the Coding Interview** (Gayle McDowell) — kinh điển cho quy trình & câu hỏi behavioral.
- 🌐 **LeetCode** (leetcode.com) — sân tập chính, đọc cả phần Discuss/Editorial.
- 🌐 **Grokking the Coding Interview** (educative.io) — dạy theo 16 pattern, rất hợp tư duy 2026.
- 🌐 **AlgoMonster**, **Codeforces** (luyện tốc độ & tư duy thi đấu).

### Checklist

- [ ] Thuộc bảng nhận diện pattern (mục 10.1).
- [ ] Hoàn thành Blind 75 (tối thiểu).
- [ ] Hoàn thành NeetCode 150 (mục tiêu).
- [ ] Luyện think-aloud (giải thích trong khi code) qua mock interview.
- [ ] Làm ≥ 5 mock interview (pramp.com, hoặc với bạn bè).

---

# 🛠️ Project & Cột Mốc Thực Hành

Lý thuyết phải biến thành code. Dưới đây là các cột mốc tăng dần:

1. **🧱 Tự cài lại CTDL (DSA from scratch library)**: Tạo một repo, tự implement Dynamic Array, Linked List (single/double), Stack, Queue, Deque, Hash Map, Min/Max Heap, BST, Trie, Graph (+ BFS/DFS), Union-Find. Viết unit test cho từng cái. → *Đây là project chứng minh bạn hiểu sâu, dùng để ôn lại trước phỏng vấn.*
2. **📈 Phân tích & benchmark sort**: Cài 6-7 thuật toán sort, đo thời gian thực tế trên dữ liệu cỡ khác nhau, vẽ biểu đồ so sánh với lý thuyết Big-O.
3. **🗂️ Mini-project ứng dụng**: chọn 1 trong:
   - Autocomplete engine (dùng Trie).
   - URL shortener / LRU cache (Hash + DLL).
   - Maze solver có visualize (BFS/DFS/A*) — rất hợp cầu nối AI.
   - Spell checker (Edit Distance / BK-Tree).
4. **🎯 Cột mốc LeetCode**: Đặt mục tiêu **giải tối thiểu 5-8 bài mỗi chủ đề** trước khi sang chủ đề tiếp theo. Theo dõi tiến độ bằng NeetCode tracker. Mục tiêu cuối: **150 bài NeetCode**.

---

# ⚠️ Lỗi & Hiểu Lầm Thường Gặp

- **Học bằng mắt, không bằng tay**: xem video giải hiểu hết, nhưng không tự code lại → đến phỏng vấn trắng tay. **Luôn tự code lại không nhìn.**
- **Cày số lượng, bỏ qua pattern**: làm 300 bài nhưng mỗi bài như mới → không tiến bộ. Học theo nhóm pattern và rút ra quy luật.
- **Nhầm Big-O**: nói "O(n) trung bình" mà không phân biệt average/worst; quên amortized; quên cộng space của call stack đệ quy.
- **Lạm dụng Linked List**: nghĩ linked list "nhanh hơn array" cho chèn — thực tế cache locality khiến Dynamic Array thắng hầu hết trường hợp.
- **Off-by-one trong Binary Search**: sai biên `left`/`right`/`mid`, vòng lặp vô hạn. Hãy thuộc một template chuẩn và dùng nhất quán.
- **Greedy "trông đúng nhưng sai"**: áp dụng greedy mà không chứng minh greedy choice property → ra kết quả sai trên test khuất. Khi nghi ngờ, đối chiếu DP.
- **Sợ DP nên né**: DP không khó nếu làm theo quy trình 5 bước (state → transition → base → order → answer). Né DP = mất ~20% bài Medium/Hard.
- **Nhầm Sliding Window với Two Pointers**: window là đoạn liền kề có ràng buộc; two pointers có thể chạy độc lập.
- **Tối ưu sớm (premature optimization)**: nhảy vào tìm lời giải "đỉnh" mà chưa có brute force → kẹt cứng. Luôn có lời giải chạy được trước, tối ưu sau.

---

# ✅ Checklist Tự Đánh Giá Tổng

- [ ] **Module 1**: Phân tích được Big-O/Θ/Ω + amortized cho code bất kỳ.
- [ ] **Module 2**: Cài & hiểu mọi CTDL tuyến tính + LRU Cache.
- [ ] **Module 3**: Cài Hash Map, hiểu collision & rehash.
- [ ] **Module 4**: Cài BST/Heap/Trie + thuộc 3 kiểu traversal + BFS.
- [ ] **Module 5**: Cài BFS/DFS/Dijkstra/Union-Find/Topo Sort.
- [ ] **Module 6**: Cài Merge/Quick/Heap Sort + hiểu khi nào dùng gì.
- [ ] **Module 7**: Binary Search đúng biên + biến thể (rotated, on-answer).
- [ ] **Module 8**: Thành thạo Recursion/Backtracking/Greedy/DP/Two Pointers/Sliding Window/Prefix Sum/Bit.
- [ ] **Module 9**: Hiểu KMP/Kadane/Fast Exp/Sieve/A*.
- [ ] **Module 10**: Thuộc bảng nhận diện pattern + hoàn thành NeetCode 150.
- [ ] **Project**: Có repo "DSA from scratch" + 1 mini-project ứng dụng.
- [ ] **Tự tin**: Nhìn bài Medium lạ, nhận ra hướng trong < 5 phút.

---

# 🔗 Học Gì Tiếp Theo?

Sau khi vững DSA, đây là các hướng nối tiếp theo định hướng AI/ML + Backend của bạn:

- **➡️ Mảng 03 — Thiết kế Hệ thống (System Design)**: DSA cho bạn nền để hiểu caching (Hash/LRU), database index (B-Tree), load balancing, consistent hashing. Bước tiếp logic cho Backend.
- **➡️ Cơ sở dữ liệu (Databases)**: index, query optimization — áp dụng trực tiếp cây & hash đã học.
- **➡️ Toán cho ML (Linear Algebra, Probability)**: nền cho AI/ML; kết hợp với DSA để hiểu các thuật toán ML (KD-Tree cho k-NN, DP cho Viterbi/sequence models).
- **➡️ Competitive Programming nâng cao** (nếu thích): CSES Problem Set, Codeforces — đẩy DSA lên tầng cao (advanced graph, advanced DP, computational geometry).
- **➡️ Specialized DS cho AI**: Vector databases & ANN (HNSW, IVF), B+Tree trong storage engine — nơi DSA gặp data pipeline thực chiến.

---

> *"Cấu trúc dữ liệu là cách bạn tổ chức suy nghĩ. Giải thuật là cách bạn hành động trên suy nghĩ đó. Học chúng một lần, dùng cả sự nghiệp."*

**Nguồn tham khảo (cập nhật 2026)**:
[NeetCode 150 vs Blind 75 (2026)](https://www.codeintuition.io/blogs/neetcode-150-vs-blind-75) ·
[NeetCode 150 vs Blind 75 — LastRound AI](https://lastroundai.com/blog/neetcode-150-vs-blind-75) ·
[15 LeetCode Patterns (2025)](https://www.lockedinai.com/blog/master-15-leetcode-patterns) ·
[Top LeetCode Patterns — DesignGurus](https://www.designgurus.io/blog/top-lc-patterns) ·
[Sliding Window vs Two Pointers](https://leetcopilot.dev/leetcode-pattern/sliding-window/sliding-window-vs-two-pointers)
