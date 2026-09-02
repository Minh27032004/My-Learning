# Bản đồ học tập — Software Engineering & AI/ML

Một trang web tĩnh gom **439 chủ đề** cần học để đi từ nền tảng khoa học máy tính tới
AI/ML engineering, xếp theo thứ tự ưu tiên, có đánh dấu tiến độ và **bài đọc soạn sẵn cho từng chủ đề**.

**Truy cập:** trang được publish qua Cloudflare Pages và giới hạn bằng Cloudflare Access —
chỉ các email trong danh sách cho phép mới mở được.

---

## Có gì trong này

| | |
|---|---|
| **7 mảng · 58 module · 439 chủ đề** | Nền tảng CS → Giải thuật → Git → Database → Backend → System Design → AI/ML |
| **439 bài đọc soạn sẵn** | ~1,55 triệu từ, đọc thẳng từ file — **không gọi API, không cần mạng** |
| **Quiz trắc nghiệm** | Sinh theo chủ đề bằng AI, chấm ngay tại chỗ |
| **Tiến độ cá nhân** | Tick từng chủ đề, lưu trong `localStorage` của trình duyệt |
| **Không backend, không build** | HTML + CSS + JavaScript thuần. Không npm, không bundler, không framework |

Ba trang chính:

| Trang | Vai trò |
|---|---|
| `index.html` | Bản đồ toàn bộ chủ đề, dựng động từ dữ liệu trong `assets/curriculum/` |
| `hoc.html?t=<khoá>` | Bài đọc + quiz cho một chủ đề |
| `cai-dat.html` | Chọn nhà cung cấp AI, nhập API key, tuỳ biến prompt |

---

## Chạy tại máy

**Cách 1 — nháy đúp `index.html`.** Chạy được ngay, không cần cài gì.

**Cách 2 — qua HTTP server** (khuyến nghị):

```bash
python -m http.server 8000
# rồi mở http://localhost:8000
```

Vì sao nên dùng cách 2: trình duyệt coi `file://` và `http://localhost` là **hai origin khác nhau**,
nên tiến độ đã tick ở cách này không thấy được ở cách kia. Chọn một cách rồi dùng nhất quán.

---

## Về API key

Toàn bộ bài đọc soạn sẵn **hoạt động không cần key**. Key chỉ cần khi bạn muốn sinh quiz,
hoặc sinh lại bài đọc ở độ sâu khác.

Trang này **không có backend**. Điều đó có nghĩa:

- Key bạn nhập nằm trong `localStorage` của **chính trình duyệt bạn**, không gửi đi đâu khác.
- Request gọi **thẳng** từ trình duyệt tới nhà cung cấp (Google / OpenAI / Anthropic / OpenRouter).
- Repo này **không chứa key nào**, và không thu thập gì của bạn.

Đánh đổi cần biết: gọi thẳng từ trình duyệt nghĩa là key nằm trong bộ nhớ tab đang mở.
Với công cụ học cá nhân thì chấp nhận được, nhưng **đừng dùng lại mô hình này cho sản phẩm thật** —
ở sản phẩm thật, key phải nằm ở server và trình duyệt gọi qua proxy của bạn.

Dùng miễn phí: lấy key Gemini tại [aistudio.google.com/apikey](https://aistudio.google.com/apikey),
hoặc chọn chế độ **Giả lập** để xem giao diện trước khi có key.

---

## Cấu trúc

```
index.html · hoc.html · cai-dat.html
assets/
├── curriculum/     dữ liệu chủ đề — mỗi mảng một file + _manifest.js liệt kê
├── lessons/        439 bài soạn sẵn — mỗi bài một file
├── diagrams/       hình SVG dùng trong bài
├── ai/             config · prompts · provider (adapter cho từng nhà cung cấp)
├── hoc.css         toàn bộ style
└── *.js            render bản đồ · markdown · luồng trang học
roadmap/            7 file lộ trình chi tiết (lý thuyết · bài tập · project)
docs/               hướng dẫn mở rộng
```

Ranh giới thiết kế đáng chú ý: `assets/ai/provider.js` **chỉ biết HTTP**, không biết
mình đang phục vụ trang nào; còn `assets/lesson.js` **chỉ biết luồng người dùng**,
không biết nhà cung cấp nào đang chạy. Đổi nhà cung cấp không phải sửa trang, và
ngược lại.

---

## Thêm một công nghệ mới

Tạo một file trong `assets/curriculum/`, thêm tên file vào mảng `FILES` trong `_manifest.js`.
**Không phải sửa HTML, CSS hay JS.** File `t0-thu-nghiem.js` là ví dụ mẫu chép được ngay.

Chi tiết: [`docs/them-cong-nghe-moi.md`](docs/them-cong-nghe-moi.md).

---

## Ghi chú triển khai

Site chạy trên **Cloudflare Pages**, build từ nhánh `main`, không có bước build
(output directory là thư mục gốc). File `.nojekyll` giữ lại để trang vẫn deploy được
lên GitHub Pages nếu cần — Jekyll bỏ qua mọi file bắt đầu bằng `_`, và dự án có hai
file `_manifest.js` là bộ nạp trung tâm, thiếu chúng thì trang trắng.

---

## Vì sao không dùng framework hay bundler

Đây là lựa chọn có chủ đích, không phải lười:

- **Mở được bằng `file://`.** Đó là lý do dự án dùng thẻ `<script>` cổ điển chứ không phải
  ES module `import` — `import` bị chặn CORS trên `file://`, thẻ script thường thì không.
- **Không có bước build nghĩa là không có gì để hỏng.** Sửa một file, tải lại trang, xong.
- **Tải đầu ~108 KB chưa nén, 16 request.** Thêm React + bundler vào đây chỉ làm nó nặng hơn
  và chậm hơn, đổi lại không có tính năng nào.

Khi nào thì lựa chọn này **sai**: nếu trang cần state phức tạp chia sẻ giữa nhiều view, hoặc
cần render lại liên tục theo dữ liệu thay đổi. Ở đây thì không — dữ liệu tĩnh, render một lần.
