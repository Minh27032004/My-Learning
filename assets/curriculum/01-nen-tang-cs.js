/* Mảng 01 — Nền tảng Khoa học Máy tính
   Xem docs/them-cong-nghe-moi.md để biết cách thêm mảng mới. */
window.CURRICULUM.push(
{
  "id": "01",
  "kind": "lo-trinh",
  "title": "Nền tảng Khoa học Máy tính",
  "tag": "Móng nhà",
  "color": "#f2a65a",
  "why": "Biết máy tính thật sự làm gì khi chạy code. Thiếu tầng này, bạn vẫn viết được app, nhưng sẽ đứng hình khi gặp lỗi tràn bộ nhớ, encoding, hay câu hỏi phỏng vấn về process/thread.",
  "folder": "https://github.com/Minh27032004/My-Learning/blob/main/roadmap/01-nen-tang-cs.md",
  "page": null,
  "pageLabel": null,
  "prompts": {
    "lesson": "Giải thích ở mức cơ chế: chuyện gì thực sự xảy ra bên dưới. Khi nói về bộ nhớ hay CPU, dùng con số cụ thể để người đọc cảm được độ lớn. Ví dụ code ưu tiên Python.",
    "quiz": "Ưu tiên câu hỏi kiểm tra hiểu cơ chế, không hỏi thuộc lòng định nghĩa. Dạng tốt: 'điều gì xảy ra nếu...', 'vì sao kết quả lại là...'. Với chủ đề số học nhị phân hay dấu phẩy động, cho số cụ thể và bắt tính."
  },
  "modules": [
    {
      "name": "Máy tính hoạt động như thế nào",
      "items": [
        "Hệ nhị phân, hexa, bit và byte",
        "Số âm dạng bù 2 (two's complement)",
        "Số thực dấu phẩy động IEEE-754 và lỗi làm tròn",
        "Unicode, UTF-8 và vì sao tiếng Việt hay lỗi font",
        "CPU, RAM, cache, ổ đĩa — chênh lệch tốc độ hàng triệu lần",
        "Chu kỳ lệnh: fetch → decode → execute",
        "Compiled vs interpreted vs bytecode (C, Python, Java)",
        "Trình biên dịch làm gì: lexer → parser → sinh mã"
      ]
    },
    {
      "name": "Hệ điều hành",
      "items": [
        "Process vs thread — khác nhau ở bộ nhớ",
        "Lập lịch CPU và context switch",
        "Bộ nhớ ảo, phân trang, swap",
        "Stack vs heap — cái nào lưu gì",
        "Deadlock, race condition, critical section",
        "Hệ thống file, đường dẫn, quyền truy cập",
        "Concurrency vs parallelism (khác nhau thật sự)",
        "Tín hiệu, tiến trình nền, exit code"
      ]
    },
    {
      "name": "Command line / Terminal",
      "items": [
        "Điều hướng: cd, ls, pwd, tree",
        "Thao tác file: cp, mv, rm, mkdir, touch",
        "Pipe | và redirect > >> 2>&1",
        "grep, find, sed, awk — bộ tứ xử lý văn bản",
        "Biến môi trường và PATH",
        "Quyền file: chmod, chown, sudo",
        "ssh, scp, rsync",
        "Viết shell script cơ bản (biến, if, for)"
      ]
    },
    {
      "name": "Mạng máy tính",
      "items": [
        "Mô hình TCP/IP 4 tầng",
        "IP, port, DNS phân giải tên miền",
        "TCP vs UDP — tin cậy đổi lấy tốc độ",
        "HTTP: method, header, body, status code",
        "HTTPS, TLS handshake, chứng chỉ",
        "Cookie, session, và trạng thái trên web",
        "WebSocket vs polling",
        "Proxy, reverse proxy, CDN (khái quát)"
      ]
    },
    {
      "name": "Thành thạo một ngôn ngữ chính (Python)",
      "items": [
        "Cú pháp, kiểu dữ liệu, toán tử",
        "list / dict / set / tuple — chọn cái nào khi nào",
        "Comprehension và biểu thức generator",
        "Hàm, tham số mặc định, *args / **kwargs",
        "Module, package, import và __name__",
        "Xử lý ngoại lệ: try/except/else/finally",
        "Đọc ghi file, làm việc với JSON và CSV",
        "Decorator — hàm bọc hàm",
        "Generator, iterator và yield",
        "Context manager và câu lệnh with",
        "Type hint và mypy",
        "Chuẩn PEP 8 và cách format tự động",
        "venv, pip, requirements.txt / pyproject.toml"
      ]
    },
    {
      "name": "Lập trình hướng đối tượng",
      "items": [
        "Class, object, thuộc tính, phương thức",
        "Đóng gói (encapsulation)",
        "Kế thừa và thứ tự phân giải phương thức (MRO)",
        "Đa hình (polymorphism) và duck typing",
        "Trừu tượng: abstract class, interface, Protocol",
        "Composition over inheritance — vì sao nên ưu tiên",
        "Magic method: __init__, __repr__, __eq__, __len__",
        "dataclass và named tuple",
        "SOLID: Single Responsibility",
        "SOLID: Open/Closed",
        "SOLID: Liskov Substitution",
        "SOLID: Interface Segregation",
        "SOLID: Dependency Inversion",
        "Design pattern: Factory, Strategy, Observer",
        "Design pattern: Singleton, Adapter, Repository"
      ]
    },
    {
      "name": "Bộ nhớ & cơ chế thực thi",
      "items": [
        "Tham chiếu vs giá trị, biến trỏ tới đâu",
        "Mutable vs immutable và bẫy tham số mặc định",
        "Shallow copy vs deep copy",
        "Garbage collection và reference counting",
        "GIL của Python — vì sao thread không tăng tốc CPU-bound",
        "Đo bộ nhớ và tối ưu cơ bản"
      ]
    },
    {
      "name": "Clean Code & thiết kế",
      "items": [
        "Đặt tên biến, hàm, class có nghĩa",
        "Hàm nhỏ, làm đúng một việc",
        "DRY, KISS, YAGNI",
        "Tránh magic number và cờ boolean trong tham số",
        "Xử lý lỗi tường minh, không nuốt exception",
        "Comment giải thích VÌ SAO, không phải CÁI GÌ",
        "Nhận diện code smell và refactor an toàn",
        "Đọc và review code người khác"
      ]
    },
    {
      "name": "Công cụ của dev",
      "items": [
        "VS Code: phím tắt, extension, workspace",
        "Debugger: breakpoint, step, watch (bỏ thói quen print)",
        "Linter & formatter: ruff, black",
        "pre-commit hook chạy kiểm tra tự động",
        "Quản lý môi trường: venv, poetry hoặc uv",
        "Docker cơ bản: image, container, Dockerfile",
        "Đọc tài liệu chính thức thay vì chỉ tìm Stack Overflow"
      ]
    }
  ]
}
);
