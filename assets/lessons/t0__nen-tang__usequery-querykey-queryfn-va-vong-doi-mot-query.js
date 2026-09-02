window.LESSONS["t0:nen-tang:usequery-querykey-queryfn-va-vong-doi-mot-query"] = {

"tom_tat": [
  "“useQuery: queryKey, queryFn, và vòng đời một query” phải được hiểu như một cơ chế có input, state, output và failure mode; không phải định nghĩa để học thuộc.",
  "Mô hình hóa query identity, lifecycle, freshness và garbage collection bằng timeline cụ thể.",
  "Kết luận chỉ đáng tin khi có baseline, phép đo/kiểm thử và điều kiện áp dụng được ghi rõ."
],

"can_biet_truoc": [
  "Mô hình nền của module “Nền tảng”.",
  "Biết đọc TypeScript/React ở mức cơ bản.",
  "Phân biệt correctness, performance, security và operability; một giải pháp có thể tốt ở trục này nhưng tệ ở trục khác."
],

"dinh_nghia": "**useQuery: queryKey, queryFn, và vòng đời một query** thuộc TanStack Query, module **Nền tảng**. Hãy định nghĩa nó bằng ba lớp: contract quan sát được từ bên ngoài; state/invariant phải giữ bên trong; và giả định môi trường để guarantee còn đúng. Nếu bỏ lớp giả định, câu “luôn nhanh”, “luôn nhất quán” hay “mô hình tốt” thường trở thành sai.",

"vi_sao_can": "Chủ đề này quan trọng vì nó thay đổi một quyết định trên critical path của hệ thống. Server state là bản sao bất đồng bộ; cache phải mô tả identity, freshness và invalidation thay vì giả vờ dữ liệu local vĩnh viễn đúng. Trong project thật, giá trị không nằm ở việc gọi đúng API mà ở khả năng dự đoán điều gì xảy ra khi dữ liệu lớn hơn, dependency chậm, input lệch phân phối, hai thao tác cạnh tranh hoặc deploy phiên bản mới.",

"co_che": "### Mental model\n\nMô hình hóa query identity, lifecycle, freshness và garbage collection bằng timeline cụ thể.\n\n![Sơ đồ Nền tảng](assets/diagrams/t0-nen-tang.svg)\n\n### Cơ chế từng bước\n\n1. Xác định input và boundary: ai tạo dữ liệu, schema/shape nào hợp lệ, lỗi được biểu diễn ra sao. 2. Theo dõi state qua từng ranh giới trong sơ đồ; tại mỗi bước ghi rõ dữ liệu được copy, cache, biến đổi hay persist. 3. Nêu invariant của **useQuery: queryKey, queryFn, và vòng đời một query** và chỉ ra thao tác nào có thể phá nó. 4. Chọn phép đo: latency percentile, rows scanned, throughput, memory, loss/metric hoặc error budget tùy miền. 5. Dựng phản ví dụ nhỏ nhất trước khi tối ưu.\n\n### Tính đúng đắn và độ phức tạp\n\nKhông ghi Big-O máy móc nếu bottleneck là I/O, network hoặc accelerator. Tách CPU complexity, memory, số round-trip, bytes transferred và contention. Với hệ phân tán/ML, thêm quality/consistency guarantee. Một tối ưu hợp lệ phải giữ contract hoặc công khai contract mới.\n\n### Failure và phục hồi\n\nKiểm ít nhất timeout, retry, partial result, duplicate, stale state và resource exhaustion khi phù hợp. query key thiếu biến, request race, retry không idempotent, stale UI, over-fetch và cache lifetime. Phục hồi phải idempotent hoặc có deduplication; alert phải gắn với tác động người dùng/SLO, không chỉ mức tài nguyên.",

"vi_du": "### Khung thực hành có thể chạy/triển khai\n\n```tsx\n// Khung minh họa cho: useQuery: queryKey, queryFn, và vòng đời một query\nconst query = useQuery({\n  queryKey: ['resource', id],\n  queryFn: ({ signal }) => fetchResource(id, signal),\n  staleTime: 30_000,\n})\n```\n\nBiến khung này thành thí nghiệm bằng dataset/input nhỏ có expected output, một ca biên và một failure được tiêm chủ động. Ghi phiên bản dependency, seed/config và môi trường. Không lấy một lần chạy làm benchmark; warm-up, lặp nhiều vòng và báo phân phối hoặc khoảng dao động.",

"so_sanh": "Đừng so tên công nghệ; so theo workload. Với **useQuery: queryKey, queryFn, và vòng đời một query**, đặt ít nhất hai phương án cạnh nhau trên các trục: guarantee/correctness, latency trung vị và p99, throughput, memory/storage, độ phức tạp vận hành, chi phí, khả năng debug và lock-in. Phương án đơn giản thường thắng ở quy mô nhỏ; phương án phân tán/tối ưu chỉ đáng dùng khi bottleneck đã đo vượt chi phí phức tạp mới.",

"loi_thuong_gap": [
  "Dùng thuật ngữ “useQuery: queryKey, queryFn, và vòng đời một query” nhưng không nêu contract và giả định.",
  "Chỉ test happy path hoặc cùng phân phối với dữ liệu phát triển.",
  "Tối ưu metric cục bộ nhưng làm xấu p99, consistency, security hoặc chi phí vận hành.",
  "Tin vào default của framework/database/model mà không kiểm version và execution/runtime behavior.",
  "Không có rollback, migration tương thích hoặc cách tái hiện kết quả."
],

"tu_kiem_tra": [
  "Vẽ lại luồng của “useQuery: queryKey, queryFn, và vòng đời một query” và ghi state tại từng node.",
  "Nêu một invariant, một failure mode và tín hiệu quan sát failure đó.",
  "Thiết kế benchmark/eval tránh leakage và warm-cache bias.",
  "Khi scale tăng 10 lần, bottleneck nào xuất hiện trước và vì sao?",
  "Nêu tình huống phương án đơn giản hơn là lựa chọn tốt hơn."
],

"tai_nguyen": [
  "TanStack Query official documentation",
  "Tài liệu chính thức của công nghệ đang dùng",
  "Roadmap nội bộ: TanStack Query / Nền tảng"
],

"lien_he": "“useQuery: queryKey, queryFn, và vòng đời một query” nối sang các mảng khác qua cùng ba câu hỏi: dữ liệu/state nằm đâu, contract nào phải giữ, và failure được quan sát/phục hồi thế nào. Khi hệ thống có model AI, quyết định ở bài này ảnh hưởng trực tiếp data quality, serving latency, privacy và khả năng tái lập."
};
