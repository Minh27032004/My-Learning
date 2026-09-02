# Thêm một công nghệ mới vào bản đồ học

> Ba bước, khoảng 2 phút. **Không sửa HTML, không sửa CSS, không sửa JS.**

---

## Bước 1 — Tạo file dữ liệu

Tạo `assets/curriculum/<ten-file>.js`. Quy ước đặt tên:

| Loại | Tiền tố | Ví dụ |
|---|---|---|
| Nằm trong lộ trình có thứ tự | số | `08-devops.js` |
| Công nghệ / thư viện học khi cần | chữ `t` | `t1-tanstack-query.js` |

Cách nhanh nhất: chép `t0-thu-nghiem.js` rồi sửa nội dung.

```js
window.CURRICULUM.push({
  id: "t1",                       // duy nhất, ngắn — dùng làm khoá tiến độ
  kind: "cong-nghe",              // "cong-nghe" | "lo-trinh"
  title: "TanStack Query",
  short: "TanStack",              // tuỳ chọn — tên hiển thị trên thanh nav
  tag: "Quản lý server state",
  color: "#ff5f7e",               // mã hex, không phải tên biến CSS
  why: "Một đoạn ngắn: học cái này để làm gì, vì sao đáng học.",

  folder: null,                   // "05-Backend-Web/README.md" nếu có roadmap .md
  page: null,                     // "duong-dan/trang.html" nếu có trang viết tay
  pageLabel: null,                // chữ trên nút mở trang đó

  prompts: {                      // tuỳ chọn — thiếu thì kế thừa prompt gốc
    lesson: "Ví dụ code bằng TypeScript với React...",
    quiz:   "Ưu tiên câu hỏi tình huống..."
  },

  modules: [
    {
      name: "Nền tảng",
      items: [
        "Server state khác client state ở chỗ nào",
        "useQuery: queryKey, queryFn, và vòng đời một query"
      ]
    }
  ]
});
```

## Bước 2 — Khai báo trong manifest

Mở `assets/curriculum/_manifest.js`, thêm tên file (không có `.js`) vào mảng `FILES`:

```js
var FILES = [
  "01-nen-tang-cs",
  ...
  "t1-tanstack-query"    // ← thêm dòng này
];
```

Thứ tự trong mảng chính là thứ tự hiển thị.

## Bước 3 — Mở lại trang

Xong. Mảng mới tự động xuất hiện ở:

- Bản đồ `index.html`, đúng màu bạn đặt
- Thanh nav trên cùng
- Trang `cai-dat.html` với đầy đủ ô chỉnh prompt cho từng module
- Trang học `hoc.html` cho từng chủ đề

---

## `kind` quan trọng hơn bạn nghĩ

| | `"lo-trinh"` | `"cong-nghe"` |
|---|---|---|
| Vị trí trên bản đồ | theo thứ tự `id` | nhóm riêng ở cuối |
| Tính vào "học gì tiếp theo" | **có** | **không** |
| Dùng khi | kiến thức nền có thứ tự trước sau | thư viện/framework học khi cần |

Đặt sai thành `"lo-trinh"` cho một thư viện sẽ khiến gợi ý "học gì tiếp theo" bảo bạn
đi học TanStack Query trước khi học xong Database. Đó là lý do có hai loại.

---

## Vài quy tắc ngầm nên biết

**Khoá tiến độ sinh từ chữ.** Công thức: `id + ":" + slug(tên module) + ":" + slug(tên mục)`.
Hệ quả: đảo thứ tự mục vẫn giữ nguyên tick, nhưng **sửa chữ của một mục sẽ mất tick của
riêng mục đó**. Sửa lỗi chính tả trong tên mục = mục đó bị coi như mới.

**`id` không được trùng.** Hai mảng cùng `id` sẽ dẫm lên khoá tiến độ của nhau.

**Viết tên mục ở mức "một buổi học".** Mỗi mục sẽ thành một trang tài liệu + một bộ quiz,
nên "Đại số tuyến tính" là quá rộng, còn "Cú pháp của toán tử `@` trong numpy" là quá hẹp.
Mức vừa: *"Vector, ma trận, phép nhân ma trận"*.

**Prompt của mảng quyết định chất lượng câu hỏi.** Nếu quiz cứ hỏi định nghĩa suông,
sửa `prompts.quiz` của mảng đó chứ đừng sửa prompt gốc — prompt gốc áp dụng cho mọi mảng.

---

## Gỡ một mảng

Xoá dòng tương ứng trong `FILES` là đủ (giữ lại file cũng không sao). Tiến độ đã tick
vẫn nằm trong `localStorage`, thêm lại sẽ hiện lại nguyên vẹn.
