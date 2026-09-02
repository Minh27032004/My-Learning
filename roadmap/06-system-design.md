# 06 — System Design (Thiết kế hệ thống)

> "Junior viết code cho máy tính chạy. Senior thiết kế hệ thống cho **con người, tiền bạc và sự cố** chịu được." — System Design chính là nơi ranh giới đó hiện ra rõ nhất.

System Design là kỹ năng phân biệt một kỹ sư biết "code chạy được" với một kỹ sư biết "code chạy được khi có 10 triệu người dùng, một data center cháy, và sếp cắt 30% ngân sách hạ tầng". Ở phỏng vấn, đây là vòng quyết định level (và lương) của bạn. Ở công việc thật, đây là thứ khiến hệ thống của bạn còn sống lúc 3 giờ sáng hay không.

**Điểm cốt lõi bạn phải khắc cốt ghi tâm xuyên suốt mảng này:** System Design **KHÔNG có đáp án đúng tuyệt đối**. Mọi quyết định đều là **đánh đổi (trade-off)**. Người phỏng vấn không nghe bạn "vẽ Kafka vào sơ đồ" — họ nghe bạn **giải thích vì sao chọn Kafka thay vì RabbitMQ trong bối cảnh cụ thể này, và bạn từ bỏ điều gì khi chọn**. Toàn bộ tài liệu này được viết để rèn cho bạn phản xạ "nêu đánh đổi" đó.

**Đặc biệt quan trọng cho định hướng AI/ML + Backend của bạn:** Mô hình ML/LLM ngày nay không chạy trên laptop — chúng chạy trên hệ thống phân tán, tốn GPU đắt đỏ, latency cao, chi phí inference khổng lồ. Một kỹ sư AI giỏi mà không hiểu system design sẽ tạo ra model tốt nhưng **không serve được ở quy mô thật**. Module 10 dành riêng cho điều này.

---

## 🎯 Mục tiêu

Sau khi hoàn thành mảng này, bạn có thể:

- [ ] Tiếp cận **bất kỳ** bài toán thiết kế hệ thống theo một framework có cấu trúc (requirements → estimation → high-level → deep dive → bottleneck), thay vì "vẽ bừa".
- [ ] Giải thích trôi chảy các đánh đổi của: scaling dọc/ngang, SQL/NoSQL, monolith/microservices, các consistency model, sync/async.
- [ ] Ước lượng (back-of-the-envelope estimation) QPS, dung lượng lưu trữ, băng thông cho một hệ thống.
- [ ] Thiết kế và **viết tài liệu** cho các hệ thống kinh điển: URL shortener, news feed, chat, rate limiter, hệ thống xem video.
- [ ] Thiết kế kiến trúc serving cho ML model và một pipeline **RAG/LLM ở quy mô** (vector DB, caching embedding, kiểm soát chi phí & latency).
- [ ] Tự tin bước vào một vòng phỏng vấn System Design cấp mid/senior.

---

## 🧱 Yêu cầu trước (Prerequisites)

System Design là mảng **nâng cao** — học **sau hoặc song song** với Backend. Đừng nhảy vào đây khi chưa có nền, bạn sẽ chỉ học vẹt thuật ngữ.

| Cần có trước | Mảng | Vì sao |
|---|---|---|
| Hiểu HTTP, REST, API, vòng đời 1 request | [05 — Backend](05-backend-web.md) | Mọi thiết kế đều xoay quanh request/response đi qua các tầng |
| Database cơ bản: index, transaction, ACID, SQL vs NoSQL | [04 — Database](04-database.md) | Module 4 (DB scaling) là phần mở rộng trực tiếp của mảng 04 |
| Cấu trúc dữ liệu & độ phức tạp (Big-O, hash table, cây) | [02 — Giải thuật & CTDL](02-giai-thuat-ctdl.md) | Cache (LRU), consistent hashing, B-tree index đều cần nền này |
| Mạng máy tính cơ bản: TCP/IP, DNS, port | [01 — Nền tảng CS](01-nen-tang-cs.md) | Load balancer Layer 4/7, CDN, latency đều là khái niệm mạng |

> **Phản biện cho bạn:** Nếu bạn thấy mình "hiểu cache là gì nhưng không biết khi nào cache gây hại" thì bạn CHƯA sẵn sàng — bạn đang ở mức thuộc định nghĩa, không phải mức hiểu đánh đổi. Quay lại nền tảng.

---

## ⏱️ Ước lượng thời gian

| Cường độ | Thời gian | Phù hợp với |
|---|---|---|
| Học song song Backend, ~5h/tuần | **3–4 tháng** | Sinh viên đang học nhiều mảng cùng lúc (khuyến nghị cho bạn) |
| Tập trung, ~15h/tuần | **6–8 tuần** | Đang chuẩn bị phỏng vấn gấp |
| "Cày" để phỏng vấn FAANG | **2–3 tháng** đọc DDIA + luyện 20–30 bài | Mục tiêu offer cao |

> System Design không phải kiến thức "học một lần xong". Nó là kỹ năng **tích lũy qua va chạm thực tế và đọc design doc của hệ thống thật**. Module này cho bạn bộ khung; chiều sâu đến từ việc bạn lặp lại nhiều năm.

---

# 📦 CÁC MODULE

---

## Module 1 — Nền tảng & Tư duy

### Lý thuyết cốt lõi

**Scalability — Vertical vs Horizontal scaling**
- **Vertical (scale up):** nhét thêm CPU/RAM/disk vào MỘT máy. Đơn giản, không cần đổi code, nhưng có **trần cứng** (không có server vô hạn lớn) và **single point of failure (SPOF)**.
- **Horizontal (scale out):** thêm NHIỀU máy. Gần như vô hạn, chịu lỗi tốt, nhưng **buộc bạn giải bài toán phân tán** (state ở đâu? đồng bộ thế nào? load balancer?).
- **Đánh đổi:** Vertical rẻ và nhanh lúc đầu → chọn khi chưa lớn. Horizontal là con đường dài hạn nhưng kéo theo toàn bộ độ phức tạp phân tán. **Sai lầm phổ biến: scale ngang quá sớm khi một con server to vẫn dư sức.**

**Latency vs Throughput** (đừng nhầm hai cái này — câu hỏi phỏng vấn rất hay bắt)
- **Latency:** thời gian xử lý MỘT request (ví dụ 50ms). "Nhanh hay chậm".
- **Throughput:** số request xử lý được mỗi giây (ví dụ 10.000 req/s). "Nhiều hay ít".
- **Đánh đổi:** batching làm throughput tăng nhưng latency của từng request tăng (phải chờ gom lô). Một hệ thống có thể throughput cao nhưng latency tệ, và ngược lại.

**Availability, Reliability**
- **Availability:** % thời gian hệ thống "sống". "Số 9": 99.9% = ~8.7h downtime/năm; 99.99% = ~52 phút/năm; 99.999% ("five nines") = ~5 phút/năm. **Mỗi số 9 thêm vào đắt theo cấp số mũ.**
- **Reliability:** hệ thống làm đúng chức năng, không mất/hỏng dữ liệu. Một hệ thống có thể "available" (luôn trả lời) nhưng "unreliable" (trả lời sai).
- **Đánh đổi:** đừng mặc định đòi "five nines". Một dashboard nội bộ chỉ cần 99% là đủ — đòi cao hơn là **đốt tiền vô ích (over-engineering)**.

**Latency numbers mọi engineer nên thuộc (con số gần đúng, đủ để ước lượng):**

| Thao tác | Thời gian (xấp xỉ) |
|---|---|
| Truy cập L1 cache | ~1 ns |
| Truy cập RAM (main memory) | ~100 ns |
| Đọc 1MB tuần tự từ RAM | ~10 µs (microsecond) |
| Round-trip trong cùng datacenter | ~500 µs |
| Đọc 1MB tuần tự từ SSD | ~1 ms |
| Đọc ngẫu nhiên từ disk (HDD seek) | ~10 ms |
| Round-trip mạng California → Hà Lan | ~150 ms |

> **Bài học rút ra:** RAM nhanh hơn disk khoảng **10.000 lần**; mạng xuyên lục địa cực đắt. Đây là lý do **caching tồn tại** và vì sao ta đặt data center gần người dùng (CDN). Bạn không cần nhớ con số chính xác, chỉ cần nhớ **bậc độ lớn (order of magnitude)**.

**Cách tiếp cận MỘT bài toán system design** (framework — dùng cả khi phỏng vấn lẫn làm việc thật):
1. **Làm rõ yêu cầu (requirements):** functional (làm gì?) + non-functional (bao nhiêu user? đọc nhiều hay ghi nhiều? cần consistency mạnh không? latency mục tiêu?). **ĐỪNG vẽ vội — hỏi trước.**
2. **Ước lượng (estimation):** QPS, storage, bandwidth. (Chi tiết ở Module 11.)
3. **High-level design:** vẽ các khối lớn (client → LB → service → DB → cache).
4. **Deep dive:** đào sâu 1–2 thành phần quan trọng theo gợi ý của người phỏng vấn.
5. **Tìm bottleneck & mở rộng:** SPOF ở đâu? Cái gì vỡ trước khi scale? Khắc phục thế nào?

### 📚 Tài nguyên
- **Sách:** *Designing Data-Intensive Applications* (DDIA) — Martin Kleppmann. **Đây là kinh thánh của mảng này.** Chương 1 nói chính xác về reliability/scalability/maintainability. Nếu chỉ đọc 1 cuốn cả đời, đọc cuốn này.
- **GitHub:** [System Design Primer](https://github.com/donnemartin/system-design-primer) — repo miễn phí ~280k sao, có hẳn phần "latency numbers every programmer should know".
- **YouTube/Web:** [ByteByteGo](https://bytebytego.com) của Alex Xu — diagram đẹp, dễ hiểu, có newsletter miễn phí.
- **Tương tác:** [Latency Numbers (interactive)](https://colin-scott.github.io/personal_website/research/interactive_latency.html) — xem các con số trên thay đổi theo năm.

### 🏋️ Bài tập
- [ ] Tự tính: nếu mỗi request mất 50ms và bạn có 4 thread, throughput tối đa bao nhiêu req/s?
- [ ] Giải thích bằng lời cho một người không biết kỹ thuật: vì sao Netflix đặt server ở nhiều nơi trên thế giới?
- [ ] Viết ra 3 hệ thống bạn dùng hàng ngày và đoán: chúng read-heavy hay write-heavy?

### ✅ Checklist Module 1
- [ ] Phân biệt rõ vertical vs horizontal scaling và đánh đổi của mỗi cái.
- [ ] Phân biệt latency vs throughput không cần nghĩ.
- [ ] Hiểu "số 9" và biết khi nào KHÔNG cần availability cao.
- [ ] Thuộc bậc độ lớn của latency numbers (RAM vs disk vs network).
- [ ] Thuộc lòng 5 bước của framework tiếp cận bài toán.

---

## Module 2 — Load Balancing

### Lý thuyết cốt lõi

Load balancer (LB) đứng trước nhiều server, phân phối request để không server nào quá tải. Là điều kiện tiên quyết của horizontal scaling.

**Thuật toán phân phối:**
- **Round Robin:** lần lượt từng server. Đơn giản, nhưng không biết server nào đang bận.
- **Weighted Round Robin:** server mạnh hơn nhận nhiều hơn (theo trọng số).
- **Least Connections:** gửi đến server đang ít kết nối nhất. Tốt khi request có thời gian xử lý khác nhau.
- **IP Hash / Consistent Hashing:** hash IP client → luôn về cùng server (hữu ích cho session, cache locality).

**Layer 4 vs Layer 7** (đánh đổi quan trọng):
- **Layer 4 (transport — TCP/UDP):** chỉ nhìn IP + port, không đọc nội dung. **Rất nhanh, ít CPU**, nhưng "ngu" — không định tuyến theo URL/header được.
- **Layer 7 (application — HTTP):** đọc được URL, header, cookie. Định tuyến thông minh (ví dụ `/api` → service A, `/img` → service B), SSL termination, nhưng **tốn CPU hơn, chậm hơn**.
- **Đánh đổi:** cần thông minh (routing theo path, A/B testing) → L7. Cần thuần tốc độ, throughput cực cao → L4.

**Health check:** LB định kỳ "ping" server; server nào không trả lời thì bị loại khỏi danh sách. **Đây là cơ chế biến một cụm server thành hệ thống chịu lỗi.**

**Sticky session (session affinity):** ép một user luôn về cùng server (để giữ session trong RAM server đó).
- **Đánh đổi / Phản biện:** sticky session **chống lại tinh thần horizontal scaling** — nếu server đó chết, user mất session; load cũng phân phối lệch. **Giải pháp tốt hơn: làm server stateless**, đẩy session ra Redis/DB dùng chung. Sticky session là "code smell" ở quy mô lớn.

### 📚 Tài nguyên
- System Design Primer — mục "Load balancer" và "Reverse proxy".
- ByteByteGo: video "Load Balancing Algorithms".
- Docs thực chiến: NGINX, HAProxy, AWS ELB/ALB (ALB là L7, NLB là L4).

### 🏋️ Bài tập
- [ ] Vẽ sơ đồ: 1 LB trước 3 web server, có health check. Chuyện gì xảy ra khi 1 server chết?
- [ ] So sánh: khi nào dùng ALB (L7) vs NLB (L4) trên AWS?

### ✅ Checklist Module 2
- [ ] Kể được ≥3 thuật toán LB và khi nào dùng cái nào.
- [ ] Giải thích L4 vs L7 và đánh đổi tốc độ/thông minh.
- [ ] Hiểu vì sao sticky session là giải pháp tệ ở quy mô lớn và thay bằng gì.

---

## Module 3 — Caching

### Lý thuyết cốt lõi

Cache lưu kết quả "đắt tiền" (query DB, gọi API, tính toán) để lần sau lấy nhanh. Lý do tồn tại: nhìn lại latency numbers — RAM nhanh hơn disk ~10.000 lần.

**Cache ở đâu (nhiều tầng):**
- **Client (browser cache):** gần user nhất, nhưng khó kiểm soát/xóa.
- **CDN:** cache nội dung tĩnh (ảnh, JS, CSS, video) gần user về mặt địa lý.
- **Server-side (Redis/Memcached):** cache kết quả query, session.
- **Database cache:** buffer pool nội bộ của DB.

**Cache strategies (đánh đổi giữa đơn giản, độ tươi của dữ liệu, và rủi ro mất dữ liệu):**
- **Cache-aside (lazy loading):** app hỏi cache trước; miss thì đọc DB, ghi vào cache. Phổ biến nhất. Nhược: lần miss đầu chậm; có thể đọc dữ liệu cũ.
- **Write-through:** ghi vào cache VÀ DB cùng lúc. Dữ liệu luôn tươi, nhưng ghi chậm hơn.
- **Write-back (write-behind):** ghi vào cache trước, ghi xuống DB sau (async). Ghi cực nhanh, nhưng **rủi ro mất dữ liệu nếu cache chết trước khi flush**.

**Eviction policies (cache đầy thì bỏ cái nào?):**
- **LRU (Least Recently Used):** bỏ cái lâu nhất không được dùng. Mặc định phổ biến.
- **LFU (Least Frequently Used):** bỏ cái ít được dùng nhất.
- **TTL (time-to-live):** mỗi entry tự hết hạn sau X giây.

**Redis vs Memcached:**
- **Memcached:** thuần key-value trong RAM, đơn giản, đa luồng, cực nhanh cho cache đơn giản.
- **Redis:** nhiều cấu trúc dữ liệu (list, set, sorted set, hash), có persistence, pub/sub, hỗ trợ cluster. Linh hoạt hơn nhiều → ngày nay thường là lựa chọn mặc định.

**Cache invalidation — "một trong hai vấn đề khó nhất của khoa học máy tính":**
- Dữ liệu trong cache có thể **lệch** với nguồn (DB). Khi DB đổi, cache phải biết để cập nhật/xóa.
- Các vấn đề kinh điển phải biết:
  - **Cache stampede / thundering herd:** một key hot hết hạn, hàng nghìn request cùng lúc miss và đập vào DB. Khắc phục: lock/single-flight, jitter cho TTL.
  - **Stale data:** đọc dữ liệu cũ vì cache chưa cập nhật. Đây là đánh đổi consistency để lấy tốc độ.
- **Phản biện:** cache làm hệ thống nhanh hơn nhưng thêm một "nguồn sự thật" thứ hai → tăng độ phức tạp và class lỗi mới (đọc dữ liệu sai). **Đừng cache khi dữ liệu thay đổi liên tục và phải luôn chính xác** (ví dụ số dư tài khoản đang giao dịch).

### 📚 Tài nguyên
- DDIA — phần về caching và materialized views.
- [Redis docs](https://redis.io/docs/) + [Redis University](https://university.redis.com/) (miễn phí).
- ByteByteGo: "Top caching strategies", "Cache invalidation".

### 🏋️ Bài tập
- [ ] Code thử một LRU cache bằng tay (HashMap + doubly linked list) — đây cũng là bài leetcode kinh điển.
- [ ] Cài Redis local, cache kết quả một query chậm, đo latency trước/sau.
- [ ] Mô tả một tình huống cache stampede và 2 cách phòng.

### ✅ Checklist Module 3
- [ ] Kể được các tầng cache (client → CDN → server → DB).
- [ ] Phân biệt cache-aside / write-through / write-back và đánh đổi.
- [ ] Giải thích LRU vs LFU.
- [ ] Nói được vì sao cache invalidation khó và 2 vấn đề (stampede, stale data).
- [ ] Nêu được khi nào KHÔNG nên cache.

---

## Module 4 — Database Scaling

> Đây là phần mở rộng trực tiếp của [04 — Database](04-database.md). Hãy chắc bạn đã nắm ACID, index, transaction trước.

### Lý thuyết cốt lõi

**Replication (master–slave / primary–replica):** copy dữ liệu ra nhiều bản.
- **Read replica:** ghi vào master, đọc từ các replica → chịu được read-heavy. **Đánh đổi: replication lag** — replica có thể trễ vài ms→s so với master, gây đọc dữ liệu cũ (eventual consistency).
- Failover: master chết → một replica lên làm master.

**Sharding / Partitioning:** chia dữ liệu ra nhiều DB (mỗi shard giữ một phần).
- **Theo range** (A–M / N–Z), **theo hash** (hash(user_id) % N), hoặc **theo directory** (bảng tra cứu).
- **Đánh đổi (rất nặng):**
  - Truy vấn cross-shard (JOIN nhiều shard) trở nên **cực kỳ đắt hoặc bất khả thi**.
  - **Hotspot:** một shard nóng hơn các shard khác (ví dụ shard chứa user nổi tiếng).
  - **Resharding** (thêm shard) khó → đây là lúc **consistent hashing** cứu bạn (giảm lượng key phải di chuyển khi thêm/bớt node).
- **Phản biện:** sharding là "vũ khí hạng nặng" — đừng shard khi read replica + cache vẫn đủ. Nhiều startup shard quá sớm rồi gánh độ phức tạp khủng khiếp.

**SQL vs NoSQL ở quy mô lớn:**
- **SQL (Postgres, MySQL):** schema chặt, ACID mạnh, JOIN mạnh. Scale ngang khó hơn (nhưng đã tốt hơn nhiều với các giải pháp như Vitess, CockroachDB).
- **NoSQL:** mỗi loại tối ưu một việc — document (MongoDB), key-value (DynamoDB, Redis), wide-column (Cassandra), graph (Neo4j). Scale ngang dễ, nhưng thường **đánh đổi consistency** (eventual) và mất JOIN/transaction mạnh.
- **Đánh đổi:** chọn theo **access pattern**, không theo hype. "Cần transaction tài chính chặt chẽ" → SQL. "Cần ghi cực nhanh, dữ liệu time-series khổng lồ, chấp nhận eventual" → Cassandra.

**CAP theorem (ôn lại):** khi có **Partition** (mạng chia cắt — điều CHẮC CHẮN xảy ra trong hệ phân tán), bạn phải chọn:
- **CP (Consistency + Partition tolerance):** thà từ chối trả lời còn hơn trả lời sai (ví dụ hệ ngân hàng).
- **AP (Availability + Partition tolerance):** vẫn trả lời, chấp nhận có thể cũ (ví dụ feed mạng xã hội).
- **Lưu ý quan trọng:** "CA" gần như vô nghĩa trong thực tế vì partition là điều không tránh được. Câu hỏi thật là **CP hay AP**. Mở rộng: **PACELC** (khi không partition thì chọn giữa Latency và Consistency).

**Consistency patterns:** strong consistency (luôn đọc giá trị mới nhất) vs eventual consistency (cuối cùng sẽ hội tụ) vs read-your-own-writes. Chi tiết ở Module 8.

### 📚 Tài nguyên
- **DDIA chương 5 (Replication), 6 (Partitioning), 7 (Transactions), 9 (Consistency)** — phần lõi nhất của cả cuốn sách cho mảng này.
- ByteByteGo: "Database sharding", "Consistent hashing explained".
- [Use The Index, Luke](https://use-the-index-luke.com/) — hiểu sâu index trước khi nói scaling.

### 🏋️ Bài tập
- [ ] Vẽ sơ đồ 1 master + 2 read replica. Giải thích replication lag gây bug gì ở tầng app.
- [ ] Thiết kế sharding key cho một bảng `messages` của app chat 100 triệu user — giải thích vì sao.
- [ ] Cho 3 hệ thống, phân loại CP hay AP và biện luận.

### ✅ Checklist Module 4
- [ ] Giải thích replication + replication lag + eventual consistency.
- [ ] Hiểu sharding, các chiến lược, và 3 cái khó (cross-shard, hotspot, resharding).
- [ ] Biết consistent hashing giải quyết gì.
- [ ] Chọn SQL/NoSQL theo access pattern, không theo hype.
- [ ] Giải thích CAP đúng (CP vs AP, "CA" là cái bẫy) và biết PACELC.

---

## Module 5 — Message Queue & Async

### Lý thuyết cốt lõi

**Vì sao cần queue / xử lý bất đồng bộ:**
- **Decoupling:** producer và consumer không cần biết nhau, không cần online cùng lúc.
- **Buffering / smoothing:** chịu được spike traffic (queue hấp thụ, consumer xử lý từ từ).
- **Tác vụ chậm tách khỏi request:** ví dụ gửi email, encode video → trả response cho user ngay, làm việc nặng ở background.

**Kafka vs RabbitMQ vs SQS (đánh đổi):**
- **Kafka:** log phân tán, throughput cực cao, lưu message lâu (replay được), tốt cho event streaming, data pipeline, log. Phức tạp vận hành. **Là "sổ cái sự kiện", không phải hàng đợi truyền thống.**
- **RabbitMQ:** message broker truyền thống, routing linh hoạt (exchange, binding), tốt cho task queue, độ trễ thấp. Throughput thấp hơn Kafka.
- **SQS (AWS):** managed, không cần vận hành, đơn giản, co giãn tự động. Đánh đổi: ít tính năng hơn, khóa vào AWS (vendor lock-in).

**Pub/Sub vs Queue:**
- **Queue (point-to-point):** mỗi message được MỘT consumer xử lý.
- **Pub/Sub:** mỗi message được phát cho NHIỀU subscriber.

**Event-driven architecture:** các service giao tiếp qua event thay vì gọi trực tiếp. Linh hoạt, mở rộng tốt, nhưng **khó debug/trace hơn** (luồng chạy không tuyến tính) và khó suy luận về consistency.

**Đảm bảo delivery (delivery semantics) — phải nắm rõ:**
- **At-most-once:** có thể mất message, không bao giờ trùng. (nhanh, dùng khi mất được)
- **At-least-once:** không mất, nhưng **có thể trùng** → consumer phải **idempotent** (xử lý 2 lần cho kết quả y như 1 lần). Đây là lựa chọn phổ biến nhất.
- **Exactly-once:** lý tưởng nhưng **rất khó/đắt** trong hệ phân tán; thường là "at-least-once + idempotency" giả lập ra.

**Backpressure:** khi producer nhanh hơn consumer, queue phình to. Cần cơ chế: chặn producer, drop message, hoặc scale consumer. **Bỏ qua backpressure = queue tràn RAM = sập.**

### 📚 Tài nguyên
- DDIA chương 11 (Stream Processing).
- [Kafka: The Definitive Guide](https://www.confluent.io/resources/kafka-the-definitive-guide/) (Confluent, miễn phí).
- ByteByteGo: "Why do we need a message queue?", "Kafka vs RabbitMQ".

### 🏋️ Bài tập
- [ ] Thiết kế luồng "upload video → encode → thông báo" dùng queue. Vẽ ra.
- [ ] Viết một consumer idempotent (dùng dedup key) cho at-least-once delivery.
- [ ] Giải thích khi nào chọn Kafka vs RabbitMQ vs SQS cho 3 tình huống khác nhau.

### ✅ Checklist Module 5
- [ ] Nêu ≥3 lý do dùng queue.
- [ ] So sánh Kafka / RabbitMQ / SQS và đánh đổi.
- [ ] Phân biệt at-most / at-least / exactly-once và vì sao cần idempotency.
- [ ] Giải thích backpressure và cách xử lý.

---

## Module 6 — Kiến trúc: Monolith vs Microservices

### Lý thuyết cốt lõi

**Monolith:** toàn bộ app trong một codebase/một deploy unit.
- **Ưu:** đơn giản để bắt đầu, dễ debug (1 chỗ), transaction nội bộ dễ, không có độ trễ mạng giữa các phần, deploy 1 phát.
- **Nhược:** lớn lên thì khó bảo trì, mọi người đạp chân nhau, scale phải scale cả khối, một bug có thể kéo sập tất cả.

**Microservices:** chia thành nhiều service nhỏ, deploy độc lập.
- **Ưu:** mỗi team sở hữu một service, scale độc lập từng phần, lỗi cô lập, tự do chọn công nghệ.
- **Nhược (THẬT SỰ, đừng theo hype):**
  - **Độ phức tạp phân tán bùng nổ:** network call thay cho function call (có thể fail, chậm, timeout).
  - **Distributed transaction cực khó** (xem Module 8 — saga).
  - **Khó debug & trace** qua nhiều service (cần distributed tracing).
  - **Tốn hạ tầng & DevOps** (mỗi service cần deploy, monitor, log riêng).
  - **Data consistency** trở thành ác mộng (mỗi service một DB).

> **Phản biện mạnh (cực kỳ quan trọng cho bạn):** Microservices là **giải pháp cho vấn đề TỔ CHỨC** (nhiều team lớn cần làm việc độc lập), **không phải vấn đề kỹ thuật**. Một startup 5 người chia 15 microservices là **thảm họa over-engineering kinh điển**. Lời khuyên của Martin Fowler & nhiều senior: **"Monolith First"** — bắt đầu bằng monolith sạch sẽ (module hóa tốt), chỉ tách microservice khi **đau thật sự** vì lý do tổ chức/scale cụ thể.

**Service communication:**
- **Sync (REST/gRPC):** gọi và chờ. Đơn giản, nhưng tạo coupling thời gian (callee chết → caller chết theo nếu không có circuit breaker). gRPC nhanh hơn REST (binary, HTTP/2).
- **Async (qua queue/event):** không chờ. Tách rời tốt, nhưng phức tạp luồng.

**API Gateway:** một cửa ngõ duy nhất trước các microservice — lo authentication, rate limiting, routing, tổng hợp response. Tránh để client phải biết hàng chục service.

**Service discovery:** trong môi trường động (container lên/xuống liên tục), service cần tìm nhau qua tên thay vì IP cứng (ví dụ Consul, etcd, hoặc DNS nội bộ của Kubernetes).

**KHI NÀO KHÔNG NÊN microservices:**
- Team nhỏ, sản phẩm chưa rõ product-market fit.
- Domain chưa hiểu rõ (chia sai biên giới service còn tệ hơn monolith).
- Chưa có nền tảng DevOps/observability vững.

### 📚 Tài nguyên
- Martin Fowler: ["MonolithFirst"](https://martinfowler.com/bliki/MonolithFirst.html) và ["Microservices"](https://martinfowler.com/articles/microservices.html) — đọc bắt buộc.
- Sam Newman — *Building Microservices* (sách).
- ByteByteGo: "Monolith vs Microservices".

### 🏋️ Bài tập
- [ ] Viết ra: cho một app e-commerce mới của startup 4 người — chọn monolith hay microservices? Biện luận.
- [ ] Vẽ kiến trúc microservices với API Gateway + service discovery cho 3 service.
- [ ] Liệt kê 5 "chi phí ẩn" khi chuyển từ monolith sang microservices.

### ✅ Checklist Module 6
- [ ] Nêu ưu/nhược THẬT của cả hai, không thiên kiến.
- [ ] Hiểu microservices giải bài toán tổ chức, không phải kỹ thuật.
- [ ] Biết "Monolith First" và lý do.
- [ ] Phân biệt sync (REST/gRPC) vs async communication.
- [ ] Liệt kê được ≥3 trường hợp KHÔNG nên microservices.

---

## Module 7 — Các thành phần & Pattern hệ thống

### Lý thuyết cốt lõi

**CDN (Content Delivery Network):** mạng server phân tán địa lý, cache nội dung tĩnh gần user. Giảm latency (xem latency numbers — round-trip xuyên lục địa ~150ms), giảm tải origin server. Pull (lazy) vs Push CDN.

**Object Storage (S3 và tương tự):** lưu file lớn (ảnh, video, backup) dạng object, rẻ, gần như vô hạn, độ bền cực cao (11 số 9). **Đừng lưu file blob trong DB quan hệ** — lưu file vào S3, lưu URL vào DB.

**Search (Elasticsearch):** DB quan hệ tệ ở full-text search & truy vấn phức tạp trên text. Elasticsearch (inverted index) chuyên cho search, log analytics. **Đánh đổi: thường là eventual consistency** — index trễ so với nguồn.

**Rate limiting:** giới hạn số request/đơn vị thời gian (chống abuse, bảo vệ hệ thống). Thuật toán: token bucket, leaky bucket, fixed window, sliding window log/counter. (Đây cũng là một bài phỏng vấn kinh điển — Module 11.)

**Các pattern phục hồi (resilience) phải biết:**
- **Circuit breaker:** khi một service downstream liên tục fail, "ngắt cầu dao" — ngừng gọi một thời gian để nó hồi phục, thay vì đập liên tục làm tệ thêm. (3 trạng thái: closed → open → half-open.)
- **Retry với exponential backoff + jitter:** thử lại khi lỗi tạm thời, nhưng giãn thời gian (và thêm nhiễu ngẫu nhiên) để tránh "retry storm" đồng loạt làm sập downstream.
- **Idempotency:** thao tác lặp lại nhiều lần cho kết quả như một lần (dùng idempotency key). Cốt lõi để retry an toàn — đặc biệt với thanh toán.
- **Timeout & bulkhead:** luôn đặt timeout (đừng chờ vô hạn); cô lập tài nguyên để một phần hỏng không kéo sập cả hệ.

### 📚 Tài nguyên
- System Design Primer — các mục CDN, object store, search.
- [AWS Architecture / Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/) — cách nghĩ về resilience.
- ByteByteGo: "Rate limiting", "Circuit breaker pattern".
- Release It! — Michael Nygard (sách kinh điển về resilience pattern).

### 🏋️ Bài tập
- [ ] Thiết kế luồng upload + serve ảnh đại diện dùng S3 + CDN.
- [ ] Implement token bucket rate limiter bằng Redis.
- [ ] Mô phỏng circuit breaker: vẽ 3 trạng thái và điều kiện chuyển.

### ✅ Checklist Module 7
- [ ] Hiểu vai trò CDN và khi nào cần.
- [ ] Biết dùng object storage cho file, không nhét vào DB.
- [ ] Biết khi nào cần Elasticsearch và đánh đổi consistency.
- [ ] Kể ≥2 thuật toán rate limiting.
- [ ] Giải thích circuit breaker, retry+backoff+jitter, idempotency.

---

## Module 8 — Tính nhất quán & Hệ phân tán

### Lý thuyết cốt lõi

**Consistency models (từ mạnh → yếu):**
- **Strong / Linearizable:** mọi đọc thấy ghi mới nhất ngay lập tức (như thể có một bản duy nhất). Đắt, chậm, khó scale.
- **Sequential / Causal:** giữ thứ tự nhân-quả.
- **Eventual:** cuối cùng các bản sao hội tụ; tạm thời có thể đọc cũ. Rẻ, scale tốt, dùng nhiều ở AP system.
- **Read-your-own-writes:** user luôn thấy thay đổi của chính mình (kể cả khi người khác chưa thấy).

**Distributed transactions (giao dịch trải nhiều service/DB):**
- **2PC (Two-Phase Commit):** prepare → commit. Đảm bảo atomic nhưng **blocking, chậm, có SPOF ở coordinator** → ít dùng ở quy mô lớn.
- **Saga pattern:** chia transaction lớn thành chuỗi transaction cục bộ; nếu một bước fail thì chạy **compensating transaction** (hoàn tác) cho các bước trước.
  - **Choreography** (mỗi service phát/nghe event) vs **Orchestration** (một orchestrator điều phối).
  - **Đánh đổi:** saga đánh đổi atomicity lấy availability — hệ thống trải qua trạng thái trung gian "không nhất quán tạm thời", và bạn phải tự viết logic hoàn tác (phức tạp, dễ sai).

**Idempotency (nhắc lại vì cực quan trọng trong phân tán):** trong mạng không tin cậy, request có thể bị gửi lại → mọi thao tác ghi quan trọng nên idempotent.

**Đồng hồ phân tán (cơ bản):**
- Đồng hồ vật lý giữa các máy **không bao giờ đồng bộ hoàn hảo** → không thể tin tuyệt đối vào timestamp để xác định thứ tự sự kiện.
- **Logical clock / Lamport timestamp** và **Vector clock** giúp suy luận thứ tự nhân-quả mà không cần đồng hồ vật lý chính xác. (Chỉ cần hiểu khái niệm ở mức này, không cần đào sâu toán.)

### 📚 Tài nguyên
- **DDIA chương 5, 7, 8, 9** — phần lõi về consistency, transaction, "the trouble with distributed systems".
- ByteByteGo / microservices.io: ["Saga pattern"](https://microservices.io/patterns/data/saga.html).
- Bài "Jepsen" (jepsen.io) — kiểm thử thực tế các DB phân tán phá vỡ lời hứa consistency thế nào (đọc để hiểu thực tế phũ phàng).

### 🏋️ Bài tập
- [ ] Thiết kế luồng đặt vé (trừ tiền + giữ ghế + gửi vé) bằng saga. Vẽ compensating transaction.
- [ ] Cho một tình huống, xác định cần strong hay eventual consistency và biện luận.

### ✅ Checklist Module 8
- [ ] Phân biệt strong / causal / eventual / read-your-own-writes.
- [ ] Hiểu vì sao 2PC ít dùng ở quy mô lớn.
- [ ] Giải thích saga + compensating transaction + choreography vs orchestration.
- [ ] Hiểu vì sao không tin tuyệt đối vào timestamp; biết Lamport/vector clock giải gì.

---

## Module 9 — Observability & Vận hành

> "Bạn không thể vận hành thứ bạn không nhìn thấy." Observability là cách hệ thống "nói cho bạn biết nó đang ốm".

### Lý thuyết cốt lõi

**Ba trụ cột của observability:**
- **Logs:** bản ghi sự kiện rời rạc ("user X login lúc Y"). Cần **structured logging** (JSON) + tập trung (centralized) để search được (ví dụ stack ELK: Elasticsearch + Logstash + Kibana, hoặc Loki).
- **Metrics:** số liệu tổng hợp theo thời gian (CPU, QPS, latency p99, error rate). Nhẹ, lưu lâu được. **Prometheus** thu thập + **Grafana** vẽ biểu đồ là combo kinh điển.
- **Tracing (distributed tracing):** theo dấu MỘT request đi qua nhiều service (ví dụ OpenTelemetry, Jaeger). Cứu tinh khi debug microservices — biết chính xác bước nào chậm/lỗi.

**Lưu ý về metrics latency:** đừng nhìn **trung bình (average)** — nó nói dối. Nhìn **percentile**: p50, p95, **p99** (1% request chậm nhất). Với hệ lớn, p99 mới là thứ user phàn nàn.

**Alerting:** cảnh báo khi vượt ngưỡng. **Phản biện: cảnh báo quá nhiều = "alert fatigue"** → kỹ sư bơ luôn cảnh báo thật. Chỉ alert những thứ **đáng để dựng người dậy lúc 3h sáng** (actionable, ảnh hưởng user).

**SLA / SLO / SLI (phân biệt rạch ròi — hay bị nhầm):**
- **SLI (Indicator):** chỉ số đo thực tế (ví dụ "99.95% request thành công trong 30 ngày qua").
- **SLO (Objective):** mục tiêu nội bộ bạn đặt ra (ví dụ "duy trì ≥99.9% availability").
- **SLA (Agreement):** cam kết với KHÁCH HÀNG có **hậu quả pháp lý/tiền bạc** nếu vi phạm (ví dụ "dưới 99.9% thì hoàn tiền"). SLA luôn lỏng hơn SLO một chút (để có biên an toàn).
- **Error budget:** 100% − SLO = ngân sách lỗi cho phép. Còn budget thì được ưu tiên ra feature; hết budget thì dừng feature, tập trung ổn định. (Tư duy SRE của Google.)

### 📚 Tài nguyên
- **Google SRE Book** (miễn phí online: [sre.google/books](https://sre.google/books/)) — chuẩn vàng về SLO/SLI/error budget.
- [Prometheus](https://prometheus.io/docs/) + [Grafana](https://grafana.com/docs/) docs.
- [OpenTelemetry docs](https://opentelemetry.io/docs/) — chuẩn tracing/metrics hiện đại.
- ByteByteGo: "Logging, metrics, and tracing".

### 🏋️ Bài tập
- [ ] Dựng Prometheus + Grafana local, scrape metrics của một app nhỏ, vẽ dashboard QPS & latency.
- [ ] Định nghĩa SLI/SLO cho một API và tính error budget tháng.
- [ ] Phân biệt 3 alert: cái nào nên page lúc 3h sáng, cái nào chỉ cần ticket?

### ✅ Checklist Module 9
- [ ] Phân biệt logs / metrics / traces và khi nào dùng cái nào.
- [ ] Hiểu vì sao dùng percentile (p99) thay vì average.
- [ ] Phân biệt SLA / SLO / SLI và hiểu error budget.
- [ ] Hiểu alert fatigue và nguyên tắc chỉ alert cái actionable.

---

## Module 10 — System Design cho AI/ML ⭐ (quan trọng nhất với mục tiêu của bạn)

> Đây là nơi nền Backend + System Design của bạn gặp định hướng AI/ML. Phần lớn ứng viên AI giỏi model nhưng **mù về serving ở quy mô** — nắm phần này là lợi thế cạnh tranh lớn.

### Lý thuyết cốt lõi

**Thiết kế hệ thống ML Serving:**
- **Model serving:** đưa model đã train ra phục vụ request. Công cụ: TorchServe, NVIDIA Triton, KServe, BentoML, Ray Serve, hoặc vLLM/TGI cho LLM.
- **Batch vs Real-time (online) inference (đánh đổi cốt lõi):**
  - **Batch:** chạy định kỳ trên lô dữ liệu lớn (ví dụ tính đề xuất qua đêm). Throughput cao, rẻ, latency không quan trọng.
  - **Real-time:** trả lời từng request ngay (ví dụ chống gian lận khi thanh toán). Latency là tối thượng, đắt hơn.
  - Lai: **near-real-time / micro-batch**, và **request batching** (gom nhiều request vào một lần forward qua GPU để tăng throughput — đánh đổi thêm chút latency, cực phổ biến khi serve LLM).
- **Feature store:** kho feature dùng chung cho cả training và serving (ví dụ Feast, Tecton). Giải quyết **training–serving skew** (feature lúc train khác lúc serve → model tệ trong thực tế) và bài toán **online (low-latency) vs offline (batch) feature**.
- **Model versioning & A/B testing / shadow deployment / canary:** triển khai model mới an toàn, so sánh với model cũ trên traffic thật trước khi thay toàn bộ.

**Thiết kế hệ thống LLM / RAG ở quy mô** (chủ đề nóng nhất 2025–2026):
- **Kiến trúc RAG cơ bản:** query → embedding → tìm trong **vector DB** (top-k tương tự) → nhồi context vào prompt → gọi LLM → trả lời. Mỗi mắt xích đều có bài toán scaling riêng.
- **Vector DB scaling:** (Pinecone, Weaviate, Milvus, Qdrant, pgvector). Index ANN (HNSW, IVF) đánh đổi **recall vs latency vs bộ nhớ**. Hàng tỉ vector → sharding + quantization (giảm độ chính xác để tiết kiệm RAM).
- **Caching embeddings & responses:**
  - Cache embedding của document để khỏi tính lại (tốn tiền API).
  - **Semantic caching:** cache câu trả lời theo *ý nghĩa* câu hỏi (so khớp embedding gần giống) thay vì khớp chuỗi chính xác — cắt mạnh chi phí & latency cho câu hỏi lặp.
  - **Prompt/KV caching:** nhiều nhà cung cấp LLM cho cache phần prompt prefix lặp lại để giảm chi phí token (xem tài nguyên của nhà cung cấp bạn dùng).
- **Chi phí & latency của LLM (bài toán sống còn):**
  - Token đầu vào/đầu ra đều tốn tiền; output dài + context lớn = đắt và chậm.
  - **Streaming** token về client để cải thiện *cảm nhận* latency (time-to-first-token).
  - **Model routing / cascade:** câu dễ → model nhỏ/rẻ; câu khó → model lớn. Tiết kiệm đáng kể.
  - Kiểm soát context window, cắt bớt retrieval không cần thiết.
- **GPU serving:** GPU đắt và khan hiếm → tối ưu **utilization** là tối thượng:
  - **Continuous/in-flight batching** (vLLM): gom nhiều request đang chạy để GPU không "rảnh tay".
  - **PagedAttention / KV cache management:** quản lý bộ nhớ KV hiệu quả khi nhiều request đồng thời.
  - **Quantization** (INT8/INT4/FP8): model nhẹ hơn, chạy nhanh hơn, đánh đổi chút chất lượng.
  - **Autoscaling GPU** khó hơn CPU (cold start nạp model lâu, GPU đắt khi để rảnh) → cân bằng giữa chi phí và độ trễ scale.

> **Đánh đổi xuyên suốt AI serving:** **chất lượng ↔ chi phí ↔ latency** là tam giác bạn luôn phải cân. Model to hơn = thông minh hơn nhưng chậm và đắt. Cache nhiều = rẻ và nhanh nhưng rủi ro trả lời cũ/sai. Không có cấu hình "tốt nhất" — chỉ có "phù hợp với ràng buộc của bài toán".

### 📚 Tài nguyên
- **Designing Machine Learning Systems** — Chip Huyen (sách kinh điển, cực hợp định hướng của bạn). Kèm blog [huyenchip.com](https://huyenchip.com/blog/).
- *AI Engineering* — Chip Huyen (2024/2025) — cập nhật về LLM/RAG serving ở quy mô.
- [vLLM docs](https://docs.vllm.ai/) — hiểu continuous batching & PagedAttention thực chiến.
- Tài liệu vector DB: Pinecone learning center, Qdrant/Weaviate docs.
- Made With ML ([madewithml.com](https://madewithml.com/)) — MLOps & ML system design thực hành.
- ByteByteGo gần đây có nhiều bài về "design ChatGPT / RAG system" — tìm bản mới nhất.

### 🏋️ Bài tập
- [ ] Thiết kế hệ thống recommend sản phẩm: phần nào batch, phần nào real-time? Vẽ ra.
- [ ] Thiết kế một RAG chatbot cho tài liệu nội bộ công ty 10.000 nhân viên: ước lượng số vector, chọn vector DB, đặt cache ở đâu, kiểm soát chi phí LLM thế nào.
- [ ] Cho ngân sách GPU cố định, đề xuất chiến lược tăng throughput serving LLM (batching, quantization, routing).

### ✅ Checklist Module 10
- [ ] Phân biệt batch vs real-time inference và đánh đổi.
- [ ] Hiểu feature store giải quyết gì (training–serving skew).
- [ ] Vẽ được kiến trúc RAG đầy đủ và biết bottleneck từng mắt xích.
- [ ] Hiểu vector DB scaling (ANN index, recall vs latency, quantization).
- [ ] Nắm các đòn giảm chi phí/latency LLM (semantic cache, streaming, routing, batching).
- [ ] Hiểu vì sao GPU utilization là tối thượng và các kỹ thuật tối ưu.

---

## Module 11 — Luyện phỏng vấn System Design

### Framework trả lời (HỌC THUỘC — đây là xương sống mọi câu trả lời)

1. **Làm rõ yêu cầu (Requirements) — 5 phút:**
   - Functional: hệ thống làm gì? (ví dụ: rút gọn URL, redirect)
   - Non-functional: bao nhiêu user? read/write ratio? latency mục tiêu? cần consistency mạnh không? availability bao nhiêu 9?
   - **Đây là bước ăn điểm nhất** — người phỏng vấn muốn thấy bạn không lao vào vẽ mà biết hỏi và **chốt scope**.

2. **Ước lượng (Back-of-the-envelope estimation):**
   - DAU → QPS (nhớ chia cho 86.400 giây/ngày; tính peak ≈ 2–3× trung bình).
   - Storage: số bản ghi × kích thước × số năm.
   - Bandwidth: QPS × kích thước payload.
   - *Ví dụ:* 100M URL/tháng ≈ ~40 write/s; đọc gấp ~10 lần ≈ ~400 read/s; mỗi URL ~500 byte × 100M × 12 tháng × 5 năm ≈ ~300GB. (Con số tròn để biện luận, không cần chính xác.)

3. **High-level design:** vẽ các khối lớn + data flow. Client → API Gateway/LB → service → cache → DB. Định nghĩa API chính & data model (schema).

4. **Deep dive:** đào sâu 1–2 phần theo gợi ý người phỏng vấn (ví dụ: cách sinh short key độc nhất? sharding ra sao? cache key hot thế nào?).

5. **Tìm bottleneck & mở rộng:** SPOF ở đâu? Điều gì vỡ ở 10×, 100× traffic? Đề xuất khắc phục (thêm cache, shard, queue, replica). **Chủ động nêu đánh đổi của mỗi quyết định.**

> **Mẹo vàng:** Luôn **nói to suy nghĩ** (think out loud) và **chủ động nêu trade-off**. Người phỏng vấn chấm *quá trình tư duy*, không chấm "đáp án đúng". Câu "Tôi chọn X vì..., đánh đổi là mất Y, nhưng trong bối cảnh này chấp nhận được" là câu ăn điểm.

### Các bài kinh điển (làm theo thứ tự khó tăng dần)
1. **URL Shortener (TinyURL):** sinh key độc nhất, redirect, đọc-nặng, cache. *Bài nhập môn hoàn hảo.*
2. **Rate Limiter:** token/leaky bucket, distributed (dùng Redis), đồng bộ qua nhiều node.
3. **Pastebin / image host:** object storage + CDN + metadata DB.
4. **News Feed (Facebook/Twitter):** fan-out on write vs fan-out on read (đánh đổi kinh điển cho user thường vs celebrity), feed ranking.
5. **Chat (WhatsApp/Messenger):** WebSocket, online presence, delivery/read receipt, lưu message, sharding theo conversation.
6. **Typeahead / Search autocomplete:** trie, top-k, cache prefix.
7. **YouTube/Netflix (video):** upload → encode (queue) → object storage → CDN; adaptive bitrate streaming; metadata.
8. **Web crawler, Uber/ride-sharing (geo-indexing), Notification system, Google Drive (file sync):** mức nâng cao.

### 📚 Tài nguyên
- **Grokking the Modern System Design Interview** (Educative) — bộ bài giải có cấu trúc, rất hợp luyện phỏng vấn.
- **System Design Interview – An Insider's Guide, Vol 1 & 2** — Alex Xu (gần như sách giáo khoa phỏng vấn).
- [System Design Primer](https://github.com/donnemartin/system-design-primer) — có lời giải mẫu nhiều bài kinh điển, miễn phí.
- [ByteByteGo](https://bytebytego.com) — Alex Xu, video + newsletter.
- YouTube: **Gaurav Sen**, **Hussein Nasser**, **System Design Interview** — xem giải bài kinh điển.
- Luyện nói: **Pramp**, **interviewing.io** — phỏng vấn thử với người thật.

### 🏋️ Bài tập
- [ ] Giải **đầy đủ 5 bước** cho URL Shortener — tự bấm giờ 45 phút như phỏng vấn thật.
- [ ] Làm news feed: trình bày fan-out on write vs on read và chọn cho từng loại user.
- [ ] Giải chat system: vẽ WebSocket + presence + sharding.
- [ ] Quay video tự mình giải 1 bài, xem lại để bắt lỗi "vẽ mà không nêu trade-off".

### ✅ Checklist Module 11
- [ ] Thuộc lòng 5 bước và áp được cho bài lạ.
- [ ] Làm estimation (QPS/storage/bandwidth) nhanh, không hoảng.
- [ ] Giải trọn vẹn ≥5 bài kinh điển có nêu trade-off.
- [ ] Luyện ≥2 buổi phỏng vấn thử nói thành tiếng.

---

# 🛠️ Project / Bài tập thực hành tổng

> System Design học bằng cách **viết design doc**, không phải đọc suông. Tự ép mình sản xuất tài liệu thiết kế — đây cũng là kỹ năng làm việc thật (RFC/design doc nội bộ công ty).

1. **Viết design doc cho 3 hệ thống kinh điển** (URL shortener, news feed, chat). Mỗi doc gồm: requirements → estimation → sơ đồ kiến trúc → data model → API → deep dive → bottleneck → **bảng liệt kê các trade-off đã chọn**. Lưu vào thư mục này (ví dụ `design-docs/`).
2. **Vẽ kiến trúc bằng công cụ:** [Excalidraw](https://excalidraw.com/) (vẽ tay nhanh), draw.io, hoặc Mermaid (vẽ bằng code, nhúng được vào Markdown).
3. **Project AI/ML (gắn định hướng của bạn):** viết design doc cho một **RAG system phục vụ 10.000 user**: chọn vector DB, chiến lược cache (embedding + semantic), kiểm soát chi phí LLM, GPU autoscaling, observability. Đây là tài liệu bạn có thể đem khoe khi phỏng vấn AI/Backend.
4. **(Tùy chọn) Build nhỏ để cảm nhận:** dựng một URL shortener thật (API + Postgres + Redis cache + một LB như NGINX trước 2 instance). Đo latency cache hit/miss. Lý thuyết sẽ "thấm" hơn nhiều khi tay bạn chạm vào.

---

# ⚠️ Lỗi & hiểu lầm thường gặp

- **Over-engineering:** thiết kế cho 1 tỉ user khi mới có 100. **YAGNI** (You Aren't Gonna Need It). Đa số startup chết vì thiếu khách hàng, không phải vì thiếu scale. Bắt đầu đơn giản, scale khi có dữ liệu chứng minh cần.
- **Microservices khi chưa cần:** chia nhỏ quá sớm → "distributed monolith" (tệ nhất của cả hai: phức tạp phân tán + coupling chặt). **Monolith First.**
- **Vẽ sơ đồ mà không nêu trade-off:** lỗi tử thần trong phỏng vấn. Vẽ Kafka, Redis, Cassandra nhưng không giải thích *vì sao* và *từ bỏ gì* = trượt.
- **Bỏ qua bước làm rõ yêu cầu:** lao vào thiết kế khi chưa biết quy mô, read/write ratio → thiết kế lạc đề.
- **Sùng bái công nghệ (hype-driven design):** "dùng Kafka vì nó ngầu". Chọn công cụ theo **bài toán & access pattern**, không theo xu hướng.
- **Tin tuyệt đối vào average latency:** luôn nhìn p99. Average che giấu trải nghiệm tệ của nhóm user xui xẻo.
- **Quên SPOF:** mọi thành phần đơn lẻ (1 DB, 1 LB, 1 cache) đều là điểm chết tiềm tàng. Hỏi "cái này chết thì sao?" cho từng khối.
- **Coi exactly-once là miễn phí:** trong phân tán nó rất khó; thực tế là at-least-once + idempotency.
- **Quên chi phí (tiền & vận hành):** giải pháp "đẹp về kỹ thuật" mà đốt tiền hoặc cần đội DevOps 10 người để nuôi thì là giải pháp tồi cho startup. **Đánh đổi luôn bao gồm cả tiền và độ phức tạp vận hành.**

---

# ✅ Checklist tự đánh giá tổng

Bạn "qua" mảng này khi có thể tick hầu hết các mục sau **mà không cần tra cứu**:

- [ ] Giải thích vertical vs horizontal scaling, latency vs throughput, availability vs reliability — kèm đánh đổi.
- [ ] Thuộc bậc độ lớn của latency numbers và biết suy ra hệ quả (vì sao cache, vì sao CDN).
- [ ] Áp dụng được framework 5 bước cho một bài toán thiết kế lạ.
- [ ] Làm back-of-the-envelope estimation (QPS, storage, bandwidth) trôi chảy.
- [ ] Giải thích load balancing (thuật toán, L4/L7, sticky session) và đánh đổi.
- [ ] Nắm caching đầy đủ: tầng cache, strategies, eviction, và vì sao invalidation khó.
- [ ] Giải thích replication, sharding, consistent hashing, CAP (CP vs AP), PACELC.
- [ ] So sánh Kafka/RabbitMQ/SQS và hiểu delivery semantics + idempotency.
- [ ] Tranh luận có cơ sở về monolith vs microservices — không thiên kiến theo hype.
- [ ] Biết các pattern resilience: circuit breaker, retry+backoff, idempotency, rate limiting.
- [ ] Phân biệt các consistency model và hiểu saga pattern.
- [ ] Phân biệt logs/metrics/traces, SLA/SLO/SLI, error budget; dùng p99 thay vì average.
- [ ] **Thiết kế được hệ thống ML serving và một RAG/LLM pipeline ở quy mô, kèm bài toán chi phí/latency/GPU.**
- [ ] Giải trọn vẹn ≥5 bài phỏng vấn kinh điển, **luôn nêu trade-off**.
- [ ] Viết được ≥2 design doc hoàn chỉnh và tự phản biện được thiết kế của mình.

---

# 🔗 Học gì tiếp theo

- **Đào sâu DDIA toàn bộ** (nếu mới đọc lướt): đây là khoản đầu tư dài hạn giá trị nhất cho sự nghiệp backend/phân tán.
- **Cloud & Infrastructure:** học sâu một cloud (AWS/GCP) + **Kubernetes** + **Infrastructure as Code** (Terraform) — đưa thiết kế giấy thành hệ thống thật. (Khả năng là mảng 07+ trong lộ trình của bạn.)
- **MLOps chuyên sâu:** nối tiếp Module 10 — model deployment, monitoring drift, feature store thực chiến, LLMOps (đánh giá, guardrail, observability cho LLM). Cực hợp định hướng AI/ML của bạn.
- **Distributed Systems hàn lâm:** nếu thích chiều sâu — consensus (Raft, Paxos), khóa học [MIT 6.824](https://pdos.csail.mit.edu/6.824/) (miễn phí, kinh điển).
- **Đọc engineering blog của công ty lớn:** Netflix, Uber, Discord, Stripe, Cloudflare — cách họ giải bài toán scale thật. Đây là "system design ngoài đời" sống động nhất.
- **Liên kết ngược:** ôn lại [04 — Database](04-database.md) ở góc nhìn scaling, và củng cố [05 — Backend](05-backend-web.md) bằng các pattern resilience bạn vừa học.

---

> **Lời nhắn cuối:** Đừng học mảng này để "thuộc bài". Học để xây được phản xạ: trước mọi quyết định kỹ thuật, tự hỏi *"Mình đang đánh đổi gì để lấy gì, và trong bối cảnh này có đáng không?"*. Khi phản xạ đó thành bản năng, bạn đã tư duy như một senior — bất kể bạn dùng công nghệ nào. Chúc bạn học vui và thiết kế ra những hệ thống vừa thông minh vừa **không sập lúc 3h sáng**. 🚀
