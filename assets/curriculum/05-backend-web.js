/* Mảng 05 — Backend & Web
   Xem docs/them-cong-nghe-moi.md để biết cách thêm mảng mới. */
window.CURRICULUM.push(
{
  "id": "05",
  "kind": "lo-trinh",
  "title": "Backend & Web",
  "tag": "Nơi model AI thành sản phẩm",
  "color": "#55b0f5",
  "why": "Một model chạy trong notebook không phải sản phẩm. Backend là thứ biến nó thành API mà người khác gọi được, có auth, có test, có log, chịu được tải.",
  "folder": "https://github.com/Minh27032004/My-Learning/blob/main/roadmap/05-backend-web.md",
  "page": null,
  "pageLabel": null,
  "prompts": {
    "lesson": "Ví dụ code bằng Python với FastAPI. Luôn nêu khía cạnh bảo mật và lỗi thường gặp khi triển khai thật.",
    "quiz": "Ưu tiên câu hỏi về đánh đổi thiết kế và bảo mật: 'cách làm nào an toàn hơn', 'điều gì sai trong đoạn code này'. Tránh hỏi thuộc lòng mã trạng thái HTTP."
  },
  "modules": [
    {
      "name": "Web hoạt động thế nào",
      "items": [
        "Vòng đời một request từ trình duyệt tới server",
        "DNS, TCP handshake, TLS",
        "HTTP method và ý nghĩa ngữ nghĩa của chúng",
        "Status code: 2xx, 3xx, 4xx, 5xx",
        "Header quan trọng: Content-Type, Authorization, Cache-Control",
        "Cookie, session, và stateless",
        "CORS — vì sao trình duyệt chặn request của bạn"
      ]
    },
    {
      "name": "Thiết kế API",
      "items": [
        "Nguyên tắc REST và thiết kế tài nguyên",
        "Đặt tên endpoint, versioning",
        "Phân trang, lọc, sắp xếp",
        "Định dạng lỗi nhất quán",
        "Idempotency và retry an toàn",
        "OpenAPI / Swagger",
        "So sánh REST vs GraphQL vs gRPC vs WebSocket"
      ]
    },
    {
      "name": "Framework & xây API thật",
      "items": [
        "Chọn ngôn ngữ backend: Python, Node, Go, Java",
        "FastAPI: routing, dependency injection, async",
        "Pydantic để validate dữ liệu vào/ra",
        "Middleware và exception handler",
        "Kết nối database qua ORM",
        "Cấu hình bằng biến môi trường",
        "Django và Flask — biết khác biệt",
        "Node.js + Express (tham khảo)"
      ]
    },
    {
      "name": "Auth & bảo mật",
      "items": [
        "Authentication vs authorization",
        "Băm mật khẩu bằng bcrypt / argon2 (không bao giờ lưu thô)",
        "Session-based vs token-based",
        "JWT: cấu trúc, ký, hạn dùng, refresh token",
        "OAuth2 và đăng nhập bằng Google/GitHub",
        "RBAC — phân quyền theo vai trò",
        "OWASP Top 10",
        "Rate limiting và chống brute force",
        "Quản lý secret, không commit .env"
      ]
    },
    {
      "name": "Kiến trúc & chất lượng",
      "items": [
        "Phân tầng: router → service → repository",
        "Dependency injection và tách phụ thuộc",
        "DTO và tách model DB khỏi model API",
        "Xử lý lỗi tập trung",
        "Cấu trúc thư mục project quy mô vừa"
      ]
    },
    {
      "name": "Testing",
      "items": [
        "pytest: fixture, parametrize",
        "Unit test vs integration test vs e2e",
        "Mock và fake dependency ngoài",
        "Test database riêng và dữ liệu mẫu",
        "Đo coverage — và vì sao 100% không phải mục tiêu",
        "TDD: đỏ → xanh → refactor"
      ]
    },
    {
      "name": "Hiệu năng & vận hành",
      "items": [
        "async/await và I/O-bound vs CPU-bound",
        "Cache bằng Redis",
        "Tác vụ nền với Celery / RQ / background task",
        "Logging có cấu trúc và request ID",
        "Health check và graceful shutdown",
        "Đo hiệu năng: load test cơ bản"
      ]
    },
    {
      "name": "Triển khai",
      "items": [
        "Đóng gói bằng Docker, viết Dockerfile gọn",
        "docker-compose cho app + DB + Redis",
        "CI/CD với GitHub Actions",
        "Deploy lên Render / Railway / Fly.io",
        "Nginx làm reverse proxy",
        "HTTPS với Let's Encrypt",
        "Biến môi trường theo từng môi trường (dev/staging/prod)",
        "Khái quát về cloud: AWS EC2/S3/RDS"
      ]
    },
    {
      "name": "Phục vụ model AI",
      "items": [
        "Đóng gói model thành endpoint dự đoán",
        "Xử lý file upload (ảnh, audio)",
        "Streaming response cho LLM (SSE)",
        "Hàng đợi cho tác vụ suy luận nặng",
        "Giới hạn kích thước input và timeout"
      ]
    }
  ]
}
);
