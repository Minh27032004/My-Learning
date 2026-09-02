/* Mảng 04 — Database
   Xem docs/them-cong-nghe-moi.md để biết cách thêm mảng mới. */
window.CURRICULUM.push(
{
  "id": "04",
  "kind": "lo-trinh",
  "title": "Database",
  "tag": "Nơi dữ liệu thật sự sống",
  "color": "#a98bfa",
  "why": "Mọi ứng dụng thật đều cần lưu dữ liệu, và mọi pipeline AI đều bắt đầu từ một truy vấn. SQL là kỹ năng hiếm khi lỗi thời — cú pháp bạn học hôm nay vẫn dùng được sau 20 năm.",
  "folder": "https://github.com/Minh27032004/My-Learning/blob/main/roadmap/04-database.md",
  "page": null,
  "pageLabel": null,
  "prompts": {
    "lesson": "Ví dụ bằng SQL chạy được trên PostgreSQL. Khi nói về hiệu năng, giải thích index hoặc query plan liên quan.",
    "quiz": "Ưu tiên câu hỏi dạng tình huống: cho một truy vấn hoặc lược đồ, hỏi điều gì sẽ xảy ra, kết quả trả về gì, hoặc vì sao chậm. Tránh hỏi thuộc lòng cú pháp."
  },
  "modules": [
    {
      "name": "Khái niệm nền tảng",
      "items": [
        "CSDL quan hệ vs phi quan hệ",
        "Bảng, hàng, cột, khoá chính, khoá ngoại",
        "Lược đồ (schema) và kiểu dữ liệu",
        "Chọn hệ quản trị: PostgreSQL, MySQL, SQLite"
      ]
    },
    {
      "name": "SQL",
      "items": [
        "SELECT, WHERE, ORDER BY, LIMIT",
        "Hàm tổng hợp và GROUP BY / HAVING",
        "INNER / LEFT / RIGHT / FULL JOIN",
        "Self join và cross join",
        "Truy vấn con (subquery) tương quan và không tương quan",
        "CTE với WITH, và CTE đệ quy",
        "Window function: ROW_NUMBER, RANK, LAG, LEAD",
        "INSERT, UPDATE, DELETE, UPSERT",
        "DDL: CREATE, ALTER, DROP",
        "View, materialized view",
        "Stored procedure và trigger (biết để tránh lạm dụng)"
      ]
    },
    {
      "name": "Thiết kế CSDL",
      "items": [
        "Mô hình thực thể - quan hệ (ERD)",
        "Quan hệ 1-1, 1-n, n-n và bảng trung gian",
        "Chuẩn hoá 1NF, 2NF, 3NF",
        "Khi nào cố ý phá chuẩn hoá để tăng tốc",
        "Ràng buộc: NOT NULL, UNIQUE, CHECK, FOREIGN KEY",
        "Chọn kiểu khoá chính: tự tăng vs UUID"
      ]
    },
    {
      "name": "Hiệu năng",
      "items": [
        "Index B-tree hoạt động thế nào",
        "Composite index và thứ tự cột",
        "Covering index",
        "Khi nào index làm CHẬM hệ thống",
        "Đọc EXPLAIN / query plan",
        "Vấn đề truy vấn N+1",
        "Phân trang hiệu quả (keyset thay vì OFFSET lớn)"
      ]
    },
    {
      "name": "Transaction & tính đúng đắn",
      "items": [
        "ACID: Atomicity, Consistency, Isolation, Durability",
        "BEGIN / COMMIT / ROLLBACK",
        "Mức cô lập và các hiện tượng dirty/non-repeatable/phantom read",
        "Khoá bi quan vs lạc quan",
        "Deadlock: phát hiện và phòng tránh"
      ]
    },
    {
      "name": "NoSQL & phân tán",
      "items": [
        "Document DB: MongoDB",
        "Key-value: Redis",
        "Wide-column: Cassandra (khái quát)",
        "Graph DB: Neo4j (khái quát)",
        "Lý thuyết CAP và BASE",
        "Khi nào NoSQL thật sự hơn SQL — và khi nào không"
      ]
    },
    {
      "name": "Database cho AI/ML",
      "items": [
        "Embedding và vector là gì",
        "Tìm kiếm tương đồng: cosine, dot product, L2",
        "Chỉ mục xấp xỉ: HNSW, IVF",
        "pgvector trên PostgreSQL",
        "So sánh Qdrant, Milvus, Chroma, Pinecone",
        "Vì sao RAG cần vector DB",
        "Data warehouse vs data lake vs lakehouse"
      ]
    },
    {
      "name": "Vận hành thực tế",
      "items": [
        "ORM (SQLAlchemy) vs raw SQL — đánh đổi",
        "SQL injection và truy vấn tham số hoá",
        "Migration với Alembic",
        "Connection pooling",
        "Sao lưu và phục hồi",
        "Seed data và fixture cho test"
      ]
    }
  ]
}
);
