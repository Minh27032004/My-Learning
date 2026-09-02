/* Mảng 06 — System Design
   Xem docs/them-cong-nghe-moi.md để biết cách thêm mảng mới. */
window.CURRICULUM.push(
{
  "id": "06",
  "kind": "lo-trinh",
  "title": "System Design",
  "tag": "Học sau cùng, hoặc song song với 05",
  "color": "#e57bb0",
  "why": "Vòng phỏng vấn quyết định lương ở cấp mid/senior. Nhưng đừng học sớm: không xây API bao giờ mà bàn về sharding thì chỉ là học thuộc từ khoá.",
  "folder": "https://github.com/Minh27032004/My-Learning/blob/main/roadmap/06-system-design.md",
  "page": null,
  "pageLabel": null,
  "prompts": {
    "lesson": "Luôn nêu đánh đổi, không có lời khuyên tuyệt đối. Dùng con số ước lượng cụ thể khi bàn về quy mô.",
    "quiz": "Ưu tiên câu hỏi đánh đổi: cho một ràng buộc hệ thống, hỏi lựa chọn nào phù hợp và vì sao. Không hỏi định nghĩa suông."
  },
  "modules": [
    {
      "name": "Nền tảng & tư duy",
      "items": [
        "Scale dọc vs scale ngang",
        "Latency, throughput, availability, SLA/SLO",
        "Ước lượng dung lượng (back-of-envelope)",
        "Đánh đổi là bản chất của thiết kế hệ thống",
        "Single point of failure"
      ]
    },
    {
      "name": "Các khối xây dựng",
      "items": [
        "Load balancer: L4 vs L7, thuật toán phân phối",
        "Caching: cache-aside, write-through, write-back",
        "Chính sách đuổi cache: LRU, LFU, TTL",
        "CDN và cache tại biên",
        "Replication: master-slave, đọc từ replica",
        "Sharding và chọn shard key",
        "Message queue: Kafka, RabbitMQ, SQS",
        "Xử lý đồng bộ vs bất đồng bộ",
        "API gateway, service discovery",
        "Blob storage cho file lớn"
      ]
    },
    {
      "name": "Kiến trúc",
      "items": [
        "Monolith vs microservices — khi nào chọn cái nào",
        "Modular monolith (lựa chọn bị đánh giá thấp)",
        "Event-driven architecture",
        "CQRS và event sourcing (khái quát)",
        "Saga pattern cho transaction phân tán"
      ]
    },
    {
      "name": "Hệ phân tán",
      "items": [
        "CAP và PACELC",
        "Nhất quán mạnh vs nhất quán cuối cùng",
        "Đồng thuận: Raft, Paxos (hiểu ý tưởng)",
        "Idempotency key",
        "Circuit breaker, retry với exponential backoff",
        "Rate limiting: token bucket, leaky bucket",
        "Consistent hashing"
      ]
    },
    {
      "name": "Observability",
      "items": [
        "Ba trụ cột: log, metric, trace",
        "Prometheus + Grafana",
        "Distributed tracing (OpenTelemetry)",
        "Cảnh báo và on-call",
        "Postmortem không đổ lỗi"
      ]
    },
    {
      "name": "System design cho AI/ML",
      "items": [
        "Kiến trúc phục vụ model ở quy mô lớn",
        "Batch inference vs online inference",
        "Feature store",
        "Pipeline huấn luyện lại và phát hiện drift",
        "Thiết kế hệ thống RAG chịu tải",
        "Quản lý chi phí và giới hạn tốc độ gọi LLM",
        "Cache kết quả LLM (semantic cache)"
      ]
    },
    {
      "name": "Bài kinh điển để luyện",
      "items": [
        "Rút gọn URL (TinyURL)",
        "Rate limiter",
        "Bảng tin mạng xã hội (news feed)",
        "Ứng dụng chat thời gian thực",
        "Ô tìm kiếm gợi ý (typeahead)",
        "Google Drive / hệ thống lưu file",
        "Uber / dịch vụ theo vị trí",
        "Hệ thống gợi ý (recommendation)"
      ]
    }
  ]
}
);
