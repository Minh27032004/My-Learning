# 04 — Database (Cơ sở dữ liệu): Lộ trình học toàn diện

> Database là **nền móng** của gần như mọi phần mềm nghiêm túc. Với một Software Engineer định hướng **Backend + AI/ML**, nó đóng hai vai trò:
>
> 1. **Với Backend:** Hầu hết logic nghiệp vụ cuối cùng đều quy về "đọc/ghi dữ liệu một cách đúng đắn, nhanh, và an toàn". Một API đẹp nhưng query chậm, thiếu index, hoặc transaction sai sẽ sập dưới tải thật. Hiểu DB tốt là khác biệt giữa "code chạy được" và "hệ thống chịu được production".
> 2. **Với AI/ML:** Toàn bộ data pipeline (thu thập → làm sạch → feature → huấn luyện) đứng trên database/warehouse. Và đặc biệt, kiến trúc **RAG (Retrieval-Augmented Generation)** — xương sống của hầu hết ứng dụng LLM hiện nay — phụ thuộc vào **Vector Database**: ta biến văn bản thành **embeddings** (vector số), lưu vào DB, rồi tìm các đoạn "gần nghĩa nhất" với câu hỏi của user bằng **similarity search**, đưa vào prompt để LLM trả lời có căn cứ. Không hiểu DB thì không xây được RAG cho ra hồn.
>
> Lộ trình này dùng **PostgreSQL** làm DB chính. Lý do: mạnh ngang các DB thương mại, miễn phí & mã nguồn mở, chuẩn SQL tốt, và quan trọng nhất với bạn — có extension **`pgvector`** để làm vector search ngay trong cùng một DB quan hệ. Học một công cụ "ăn được cả hai mảng" là lựa chọn tối ưu về thời gian.

---

## 🎯 Mục tiêu

Sau lộ trình này, bạn có thể:

- Hiểu **bản chất** của DBMS, mô hình quan hệ, và biết khi nào chọn SQL vs NoSQL.
- Viết được SQL từ cơ bản đến nâng cao: JOIN nhiều bảng, subquery, **CTE**, **window functions**.
- **Thiết kế schema** đúng chuẩn: ERD, khóa chính/ngoại, quan hệ, chuẩn hóa và biết khi nào denormalize.
- **Đọc query plan** (`EXPLAIN`), đánh index hợp lý, tối ưu truy vấn chậm.
- Hiểu **ACID, transaction, isolation levels**, xử lý race condition và deadlock.
- Nắm các họ **NoSQL**, lý thuyết **CAP**, mô hình **BASE** và eventual consistency.
- Xây được pipeline **RAG** với **vector database** (pgvector): embeddings + similarity search.
- Kết nối DB từ code an toàn: **ORM vs raw SQL**, migration, connection pooling, chống **SQL injection**.

## 🧱 Yêu cầu trước (prerequisites)

- Biết một ngôn ngữ lập trình bất kỳ (Python rất hợp vì dùng được cho cả backend lẫn AI).
- Quen dùng **terminal/command line** cơ bản.
- Hiểu khái niệm dữ liệu kiểu bảng (đã từng dùng Excel/Google Sheets là đủ trực giác ban đầu).
- Không cần biết toán cao cấp; phần vector search chỉ cần hiểu trực giác "khoảng cách giữa hai vector".

## ⏱️ Ước lượng thời gian

| Mức độ | Cam kết | Thời lượng | Đạt tới đâu |
|--------|---------|-----------|-------------|
| Nền tảng đủ dùng | ~10h/tuần | **4–5 tuần** | Module 1–6: viết SQL tốt, thiết kế schema, hiểu index & transaction |
| Vững vàng (khuyến nghị) | ~10h/tuần | **8–10 tuần** | Thêm Module 7–9 + project: NoSQL, vector DB/RAG, vận hành thực tế |
| Chuyên sâu | dài hạn | liên tục | Tối ưu nâng cao, replication, sharding, partitioning, tuning production |

> **Nguyên tắc học DB:** lý thuyết chỉ thấm khi **gõ query thật trên data thật**. Cài Postgres sớm (Docker hoặc bản cài đặt), nạp một dataset mẫu, và làm bài tập ngay từ Module 2. Đừng đọc chay.

---

## 📦 Module 1 — Khái niệm nền tảng

**Lý thuyết cốt lõi:**

- **Database** = tập hợp dữ liệu có tổ chức, lưu trữ lâu dài. **DBMS** (Database Management System) = phần mềm quản lý DB đó (PostgreSQL, MySQL, MongoDB, Redis...). DBMS lo hộ ta: lưu trữ trên đĩa, truy vấn, đồng thời (concurrency), toàn vẹn dữ liệu, sao lưu, phân quyền — thay vì tự viết tay bằng file.
- **Phân loại lớn:**
  - **Relational (SQL):** dữ liệu là các **bảng** (table) gồm hàng (row/tuple) và cột (column/attribute), liên kết với nhau qua khóa. Dùng ngôn ngữ **SQL**. VD: PostgreSQL, MySQL, SQL Server, Oracle, SQLite. Mạnh khi dữ liệu có cấu trúc rõ, cần quan hệ chặt và **giao dịch ACID**.
  - **Non-relational (NoSQL):** không bắt buộc schema bảng cứng. Gồm nhiều họ (document, key-value, column-family, graph — xem Module 7). Mạnh khi cần linh hoạt schema, scale ngang lớn, hoặc dạng dữ liệu đặc thù.
- **Mô hình dữ liệu (data model):** cách ta hình dung và tổ chức dữ liệu. Mô hình quan hệ (relational model, do **E.F. Codd** đề xuất 1970) dựa trên lý thuyết tập hợp: dữ liệu là các quan hệ (relation = bảng), thao tác bằng đại số quan hệ. Đây là nền tảng toán học khiến SQL "có thể tối ưu được tự động".
- **Schema:** bản thiết kế cấu trúc DB (có những bảng nào, cột gì, kiểu dữ liệu, ràng buộc). **Schema-on-write** (SQL: định nghĩa trước khi ghi) vs **schema-on-read** (nhiều NoSQL/data lake: áp cấu trúc khi đọc).

**Đánh đổi cần nhớ ngay:** SQL cho bạn **tính nhất quán mạnh và truy vấn linh hoạt** nhưng schema cứng và scale ngang khó hơn. NoSQL cho **linh hoạt và scale dễ** nhưng thường đánh đổi tính nhất quán và khả năng JOIN. Đa số ứng dụng nên **bắt đầu bằng SQL** và chỉ thêm NoSQL khi có lý do cụ thể — đây là sai lầm phổ biến: chọn NoSQL vì "nghe ngầu" rồi khổ sở vì thiếu transaction.

**📚 Tài nguyên:**
- Sách **"Database System Concepts"** (Silberschatz, Korth, Sudarshan) — Chương 1–2. Đây là sách giáo khoa kinh điển, đọc để có nền lý thuyết vững.
- PostgreSQL docs — [Chapter 1: Getting Started](https://www.postgresql.org/docs/current/tutorial-start.html).
- Bài viết "A relational database overview" của Oracle hoặc bất kỳ tổng quan relational model nào.

**🏋️ Bài tập:**
- [ ] Cài PostgreSQL (khuyến nghị qua Docker: `docker run --name pg -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres`) và kết nối bằng `psql` hoặc DBeaver/pgAdmin.
- [ ] Viết 1 đoạn ngắn (cho chính bạn) phân biệt DB vs DBMS vs schema bằng lời của bạn.
- [ ] Liệt kê 3 ứng dụng bạn dùng hằng ngày và đoán xem nên dùng SQL hay NoSQL, vì sao.

**Checklist module:**
- [ ] Phân biệt được DB, DBMS, schema.
- [ ] Giải thích được relational vs non-relational và đánh đổi.
- [ ] Cài và kết nối được PostgreSQL.

---

## 📦 Module 2 — SQL từ cơ bản đến nâng cao

Đây là module **dài và quan trọng nhất**. Hãy dành nhiều thời gian gõ thật. Ta dùng một schema mẫu xuyên suốt:

```sql
-- Schema mẫu cho ví dụ
CREATE TABLE customers (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    city        TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
    id          SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    amount      NUMERIC(10,2) NOT NULL,
    status      TEXT DEFAULT 'pending',
    created_at  TIMESTAMPTZ DEFAULT now()
);
```

### 2.1 Truy vấn cơ bản: SELECT / WHERE / ORDER BY

```sql
-- Lấy tên và thành phố của khách ở Hà Nội, sắp theo tên
SELECT name, city
FROM customers
WHERE city = 'Hanoi'
ORDER BY name ASC;

-- WHERE với nhiều điều kiện, LIKE, IN, BETWEEN
SELECT * FROM orders
WHERE amount BETWEEN 100 AND 500
  AND status IN ('paid', 'shipped')
  AND created_at >= '2026-01-01';
```

**Cơ chế:** DB đọc dữ liệu, lọc theo `WHERE`, rồi sắp xếp `ORDER BY`. Thứ tự logic thực thi: `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`. Hiểu thứ tự này giải thích vì sao bạn **không dùng được alias trong `SELECT` ở mệnh đề `WHERE`** (vì `WHERE` chạy trước `SELECT`).

### 2.2 Aggregate & GROUP BY / HAVING

```sql
-- Tổng doanh thu và số đơn theo từng khách
SELECT customer_id,
       COUNT(*)      AS so_don,
       SUM(amount)   AS tong_tien,
       AVG(amount)   AS trung_binh
FROM orders
GROUP BY customer_id
HAVING SUM(amount) > 1000      -- HAVING lọc SAU khi gom nhóm
ORDER BY tong_tien DESC;
```

**Phân biệt then chốt:** `WHERE` lọc **hàng trước khi gom nhóm**; `HAVING` lọc **nhóm sau khi gom**. Aggregate functions phổ biến: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`. Lỗi kinh điển: đưa cột không nằm trong `GROUP BY` và không bọc aggregate vào `SELECT` → Postgres báo lỗi.

### 2.3 JOIN — phần quan trọng nhất của SQL

JOIN ghép hàng từ nhiều bảng dựa trên điều kiện liên kết. Giả sử:

- `customers`: (1, An), (2, Bình), (3, Cường — chưa có đơn nào)
- `orders`: (101, customer_id=1), (102, customer_id=1), (103, customer_id=99 — khách không tồn tại, giả định data lỗi để minh họa)

```sql
-- INNER JOIN: chỉ giữ hàng KHỚP ở CẢ HAI bảng
SELECT c.name, o.id AS order_id, o.amount
FROM customers c
INNER JOIN orders o ON o.customer_id = c.id;
-- Kết quả: An-101, An-102, Bình-(nếu có đơn). Cường BỊ LOẠI (không có đơn).
-- Đơn 103 cũng bị loại (customer_id=99 không khớp khách nào).
```

```sql
-- LEFT JOIN: giữ TẤT CẢ hàng bảng TRÁI (customers), bên phải không khớp → NULL
SELECT c.name, o.id AS order_id, o.amount
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
-- Kết quả: An-101, An-102, Bình-..., Cường-NULL-NULL (giữ Cường dù không có đơn!)
```

```sql
-- RIGHT JOIN: giữ TẤT CẢ hàng bảng PHẢI (orders), bên trái không khớp → NULL
SELECT c.name, o.id AS order_id
FROM customers c
RIGHT JOIN orders o ON o.customer_id = c.id;
-- Kết quả: An-101, An-102, ..., NULL-103 (giữ đơn 103 dù không có khách khớp!)
```

```sql
-- FULL OUTER JOIN: giữ TẤT CẢ hàng cả hai bảng, không khớp → NULL ở bên thiếu
SELECT c.name, o.id AS order_id
FROM customers c
FULL OUTER JOIN orders o ON o.customer_id = c.id;
-- Kết quả: gồm Cường (không đơn) VÀ đơn 103 (không khách).
```

**Trực giác hình ảnh (Venn):** `INNER` = phần giao; `LEFT` = cả vòng trái + giao; `RIGHT` = cả vòng phải + giao; `FULL` = hợp của hai vòng. Trong thực tế bạn dùng `INNER` và `LEFT` ~95% thời gian. `RIGHT` thường viết lại được thành `LEFT` (đổi chỗ hai bảng) cho dễ đọc. `FULL` hiếm, hay dùng để **đối soát dữ liệu** giữa hai bảng.

```sql
-- SELF JOIN: bảng tự nối với chính nó (VD: nhân viên - quản lý)
SELECT e.name AS nhan_vien, m.name AS quan_ly
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

### 2.4 Subquery (truy vấn lồng)

```sql
-- Khách có chi tiêu trên trung bình
SELECT name FROM customers
WHERE id IN (
    SELECT customer_id FROM orders
    GROUP BY customer_id
    HAVING SUM(amount) > (SELECT AVG(amount) FROM orders)
);
```

Subquery có thể nằm ở `WHERE`, `FROM` (gọi là derived table), hoặc `SELECT` (scalar subquery). **Correlated subquery** là loại tham chiếu bảng ngoài, chạy lại cho mỗi hàng → cẩn thận hiệu năng.

### 2.5 CTE — `WITH` (Common Table Expression)

```sql
-- CTE giúp tách query phức tạp thành các bước đọc rõ ràng
WITH doanh_thu_khach AS (
    SELECT customer_id, SUM(amount) AS tong
    FROM orders
    GROUP BY customer_id
)
SELECT c.name, d.tong
FROM doanh_thu_khach d
JOIN customers c ON c.id = d.customer_id
WHERE d.tong > 1000;
```

**Cái hay của CTE:** dễ đọc hơn subquery lồng nhiều tầng, và hỗ trợ **recursive CTE** để duyệt cấu trúc cây/đồ thị (VD: cây danh mục, sơ đồ tổ chức). Đánh đổi: ở một số DB cũ, CTE từng là "optimization fence" (không được tối ưu xuyên qua) — Postgres hiện đại (12+) đã inline được nên thường không lo.

### 2.6 Window functions — vũ khí cho phân tích dữ liệu

```sql
-- Xếp hạng đơn theo giá trị TRONG TỪNG khách, không gom mất hàng
SELECT customer_id, id, amount,
       ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC) AS hang,
       SUM(amount)  OVER (PARTITION BY customer_id) AS tong_cua_khach,
       amount - LAG(amount) OVER (PARTITION BY customer_id ORDER BY created_at) AS chenh_so_voi_don_truoc
FROM orders;
```

**Khác biệt cốt lõi với `GROUP BY`:** `GROUP BY` **gộp** nhiều hàng thành một; window function **giữ nguyên từng hàng** nhưng tính thêm giá trị "nhìn qua một cửa sổ" các hàng liên quan. Cực mạnh cho: xếp hạng (`RANK`, `DENSE_RANK`, `ROW_NUMBER`), chạy tổng tích lũy (running total), so sánh với hàng trước/sau (`LAG`/`LEAD`), top-N theo nhóm. Đây cũng là kỹ năng **rất hay gặp khi làm data cho ML** (feature engineering, time-series).

### 2.7 INSERT / UPDATE / DELETE (DML)

```sql
INSERT INTO customers (name, city) VALUES ('Dũng', 'Da Nang');
INSERT INTO customers (name, city) VALUES ('E', 'Hue'), ('F', 'Hue');  -- nhiều hàng

UPDATE orders SET status = 'shipped' WHERE id = 101;

DELETE FROM orders WHERE status = 'cancelled' AND created_at < '2025-01-01';

-- UPSERT (Postgres): chèn, nếu trùng khóa thì cập nhật
INSERT INTO customers (id, name) VALUES (1, 'An updated')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
```

> ⚠️ **Luôn chạy `SELECT` với cùng `WHERE` trước khi `UPDATE`/`DELETE`** để xem mình sắp đụng vào bao nhiêu hàng. Quên `WHERE` = sửa/xóa cả bảng. Trên production, bọc trong transaction (Module 6).

### 2.8 DDL — CREATE / ALTER / DROP

```sql
CREATE TABLE products (
    id    SERIAL PRIMARY KEY,
    name  TEXT NOT NULL,
    price NUMERIC(10,2) CHECK (price >= 0)
);

ALTER TABLE products ADD COLUMN sku TEXT UNIQUE;          -- thêm cột
ALTER TABLE products ALTER COLUMN name SET NOT NULL;      -- đổi ràng buộc
ALTER TABLE products RENAME COLUMN name TO title;         -- đổi tên cột

DROP TABLE products;          -- xóa cả bảng (không hồi lại được nếu không có backup!)
TRUNCATE orders;              -- xóa hết hàng nhưng giữ cấu trúc bảng (nhanh hơn DELETE)
```

**📚 Tài nguyên (theo thứ tự nên học):**
- [**SQLBolt**](https://sqlbolt.com/) — học SELECT/JOIN tương tác trong trình duyệt, làm trước tiên.
- [**Mode SQL Tutorial**](https://mode.com/sql-tutorial/) — đặc biệt phần Intermediate & Advanced (window functions giải thích cực hay).
- [**PostgreSQL Tutorial**](https://www.postgresqltutorial.com/) — tham chiếu cú pháp Postgres cụ thể.
- [**pgexercises.com**](https://pgexercises.com/) — bài tập SQL thật trên Postgres, có đáp án.
- Sách "Database System Concepts" — chương SQL.

**🏋️ Bài tập:**
- [ ] Hoàn thành toàn bộ SQLBolt.
- [ ] Làm hết phần JOIN và Aggregate trên pgexercises.
- [ ] Viết query trả lời: "Top 3 khách chi tiêu nhiều nhất mỗi tháng" (gợi ý: window function + date_trunc).
- [ ] Viết một recursive CTE duyệt cây danh mục sản phẩm.

**Checklist module:**
- [ ] Viết được query có nhiều JOIN, giải thích được khác biệt 4 loại JOIN bằng ví dụ.
- [ ] Phân biệt `WHERE` vs `HAVING`, `GROUP BY` vs window function.
- [ ] Viết được CTE và một window function thực tế.
- [ ] Dùng được UPSERT và DDL cơ bản.

---

## 📦 Module 3 — Thiết kế CSDL quan hệ

**Lý thuyết cốt lõi:**

- **ERD (Entity-Relationship Diagram):** sơ đồ mô tả các thực thể (entity → bảng), thuộc tính (attribute → cột), và quan hệ (relationship) giữa chúng. Vẽ ERD trước khi `CREATE TABLE` giúp tránh thiết kế sai phải làm lại tốn kém.
- **Primary key (PK):** cột (hoặc nhóm cột) định danh **duy nhất** mỗi hàng, không NULL. Khuyến nghị dùng **surrogate key** (id tự tăng `SERIAL`/`IDENTITY`, hoặc `UUID`) thay vì khóa nghiệp vụ (như email) vì khóa nghiệp vụ có thể đổi.
- **Foreign key (FK):** cột tham chiếu PK của bảng khác → tạo liên kết và **đảm bảo toàn vẹn tham chiếu** (referential integrity): không cho phép `orders.customer_id` trỏ tới khách không tồn tại.
- **Các loại quan hệ:**
  - **1-1 (one-to-one):** mỗi hàng A ↔ tối đa một hàng B (VD: user ↔ user_profile). Thường tách bảng để cô lập cột ít dùng/nhạy cảm.
  - **1-n (one-to-many):** một hàng A có nhiều hàng B (VD: 1 khách ↔ nhiều đơn). FK đặt ở bảng "nhiều" (`orders.customer_id`). Đây là quan hệ phổ biến nhất.
  - **n-n (many-to-many):** nhiều A ↔ nhiều B (VD: sinh viên ↔ môn học). Cần **bảng trung gian (junction/join table)** chứa hai FK:

```sql
CREATE TABLE student_course (
    student_id INTEGER REFERENCES students(id),
    course_id  INTEGER REFERENCES courses(id),
    enrolled_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (student_id, course_id)   -- khóa kép, chống đăng ký trùng
);
```

### Chuẩn hóa (Normalization)

Mục tiêu: loại bỏ **dư thừa dữ liệu** và **anomaly** (bất thường khi insert/update/delete). Ý tưởng: mỗi sự thật chỉ lưu một nơi.

- **1NF (First Normal Form):** mỗi ô chứa **giá trị nguyên tử** (atomic), không lưu danh sách trong một ô (không `tags = "a,b,c"`). Không có nhóm cột lặp (`phone1, phone2, phone3` → tách bảng phones).
- **2NF:** đã 1NF, **và** mọi cột non-key phụ thuộc vào **toàn bộ** khóa chính (chỉ liên quan khi PK là khóa kép). VD: bảng `order_items(order_id, product_id, product_name)` — `product_name` chỉ phụ thuộc `product_id` chứ không phụ thuộc cả cặp khóa → vi phạm 2NF → tách `product_name` về bảng `products`.
- **3NF:** đã 2NF, **và** không có **phụ thuộc bắc cầu** (transitive): cột non-key không phụ thuộc vào cột non-key khác. VD: `employees(id, dept_id, dept_name)` — `dept_name` phụ thuộc `dept_id` (non-key) → tách bảng `departments`.
- **BCNF (Boyce-Codd):** phiên bản chặt hơn của 3NF: mọi phụ thuộc hàm `X → Y` thì `X` phải là **siêu khóa**. Xử lý vài trường hợp hiếm mà 3NF còn bỏ sót (khi có nhiều khóa ứng viên chồng lấn). Thực tế đạt **3NF là đủ cho phần lớn ứng dụng**.

**Mẹo nhớ 3NF (lời thề của nhân chứng):** mỗi cột non-key phải phụ thuộc vào *"the key, the whole key, and nothing but the key"* (khóa, toàn bộ khóa, và chỉ khóa mà thôi) — tương ứng 1NF, 2NF, 3NF.

### Khi nào DENORMALIZE (cố ý phá chuẩn hóa)?

Chuẩn hóa tốt cho **tính đúng đắn và ghi dữ liệu**, nhưng query phải JOIN nhiều bảng → có thể chậm khi đọc. **Denormalization** = cố ý lưu trùng vài dữ liệu để giảm JOIN, tăng tốc đọc. Áp dụng khi:

- Hệ thống **đọc nhiều hơn ghi rất nhiều** và JOIN là bottleneck đã đo được.
- Cần precompute giá trị tổng hợp (VD: lưu sẵn `order_count` trong bảng `customers`).
- Làm **data warehouse/analytics** (mô hình sao — star schema — chấp nhận trùng lặp để query nhanh).

> ⚠️ **Quy tắc vàng:** chuẩn hóa trước (đến 3NF), denormalize sau **chỉ khi có số liệu chứng minh cần**. Denormalize sớm = tự rước nguy cơ dữ liệu không nhất quán (cập nhật một nơi quên nơi kia).

**📚 Tài nguyên:**
- "Database System Concepts" — chương ER Model & Normalization.
- [PostgreSQL docs — Data Definition](https://www.postgresql.org/docs/current/ddl.html).
- Công cụ vẽ ERD: [dbdiagram.io](https://dbdiagram.io/), [drawSQL](https://drawsql.app/), hoặc Mermaid `erDiagram`.

**🏋️ Bài tập:**
- [ ] Vẽ ERD cho một blog: users, posts, comments, tags (post-tag là n-n).
- [ ] Cho một bảng phẳng (Excel xuất ra) lộn xộn, chuẩn hóa nó lên 3NF.
- [ ] Thiết kế schema cho thư viện: sách, tác giả (n-n), thành viên, lượt mượn.

**Checklist module:**
- [ ] Vẽ được ERD và chuyển thành `CREATE TABLE` đúng PK/FK.
- [ ] Xử lý được quan hệ n-n bằng bảng trung gian.
- [ ] Giải thích được 1NF/2NF/3NF/BCNF bằng ví dụ và biết khi nào denormalize.

---

## 📦 Module 4 — Ràng buộc & toàn vẹn dữ liệu (Constraints & Integrity)

**Lý thuyết cốt lõi:** đẩy quy tắc nghiệp vụ xuống **tận DB** thay vì chỉ tin vào code ứng dụng. Vì sao? Vì có thể có nhiều ứng dụng/script cùng ghi vào một DB; ràng buộc ở DB là "tuyến phòng thủ cuối cùng" không ai vượt qua được.

```sql
CREATE TABLE accounts (
    id       SERIAL PRIMARY KEY,
    email    TEXT NOT NULL UNIQUE,                    -- NOT NULL + UNIQUE
    age      INTEGER CHECK (age >= 18),               -- CHECK: ràng buộc miền giá trị
    balance  NUMERIC(12,2) NOT NULL DEFAULT 0,        -- DEFAULT: giá trị mặc định
    country  TEXT DEFAULT 'VN',
    referrer_id INTEGER REFERENCES accounts(id)
        ON DELETE SET NULL                            -- hành vi khi cha bị xóa
);
```

- **`NOT NULL`** — cột bắt buộc có giá trị.
- **`UNIQUE`** — không cho giá trị trùng (DB tự tạo index để enforce).
- **`CHECK`** — biểu thức bool phải đúng (VD `price >= 0`, `status IN (...)`).
- **`DEFAULT`** — giá trị tự điền khi không cung cấp.
- **`PRIMARY KEY`** = `NOT NULL` + `UNIQUE` + là khóa định danh.
- **`FOREIGN KEY`** — toàn vẹn tham chiếu. Hành vi khi hàng cha bị xóa/sửa:
  - `ON DELETE RESTRICT/NO ACTION` (mặc định): chặn xóa cha nếu còn con.
  - `ON DELETE CASCADE`: xóa cha → xóa luôn con (cẩn thận, dễ xóa nhầm dây chuyền).
  - `ON DELETE SET NULL`: xóa cha → set FK con về NULL.

**Đánh đổi:** ràng buộc ở DB giúp dữ liệu **luôn sạch** bất kể code có bug, nhưng làm migration phức tạp hơn và có thể chậm khi import dữ liệu lớn (có thể tạm tắt rồi bật lại). Triết lý đúng: **dùng ràng buộc DB cho các bất biến (invariant) cốt lõi**, kết hợp validation ở tầng ứng dụng cho UX (báo lỗi đẹp cho user).

**📚 Tài nguyên:** [PostgreSQL docs — Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html).

**🏋️ Bài tập:**
- [ ] Thêm CHECK đảm bảo `orders.amount > 0` và `status` chỉ nhận giá trị hợp lệ.
- [ ] Thử insert dữ liệu vi phạm từng loại constraint, đọc thông báo lỗi.
- [ ] So sánh hành vi `ON DELETE CASCADE` vs `SET NULL` bằng thí nghiệm thật.

**Checklist module:**
- [ ] Dùng đúng 5 loại constraint chính.
- [ ] Hiểu referential integrity và các hành vi `ON DELETE`.

---

## 📦 Module 5 — Indexing & Hiệu năng

**Lý thuyết cốt lõi:**

- **Index** = cấu trúc dữ liệu phụ giúp DB **tìm hàng nhanh** mà không quét toàn bảng (sequential scan). Ví von: như **mục lục cuối sách** — thay vì lật từng trang tìm từ "transaction", bạn tra mục lục để nhảy thẳng tới trang.
- **B-tree index** (mặc định ở Postgres): cây cân bằng cho phép tìm kiếm, so sánh khoảng (`<`, `>`, `BETWEEN`), và `ORDER BY` với độ phức tạp ~O(log n). Phù hợp đại đa số trường hợp. (Postgres còn có Hash, GiST, GIN, BRIN cho nhu cầu đặc biệt — GIN cho full-text/JSONB, và HNSW/IVFFlat cho vector ở Module 8.)

```sql
CREATE INDEX idx_orders_customer ON orders(customer_id);     -- index 1 cột
CREATE INDEX idx_orders_cust_date ON orders(customer_id, created_at);  -- composite
CREATE UNIQUE INDEX idx_accounts_email ON accounts(email);
```

- **Composite index (index nhiều cột):** thứ tự cột **rất quan trọng** — tuân theo **"leftmost prefix rule"**. Index `(customer_id, created_at)` dùng được cho query lọc theo `customer_id` hoặc `customer_id AND created_at`, nhưng **không** dùng hiệu quả cho query chỉ lọc `created_at`. Đặt cột hay lọc bằng `=` lên trước, cột lọc khoảng/sắp xếp sau.
- **Khi NÊN đánh index:** cột hay xuất hiện trong `WHERE`, `JOIN ... ON`, `ORDER BY`; cột FK; cột có tính chọn lọc cao (nhiều giá trị khác nhau).
- **Khi KHÔNG nên (chi phí của index):** mỗi index làm **chậm `INSERT`/`UPDATE`/`DELETE`** (phải cập nhật cả index) và tốn dung lượng. Bảng ghi rất nhiều / cột ít giá trị (VD `gender` chỉ 2 giá trị → index gần như vô dụng) / bảng nhỏ (quét cả bảng còn nhanh hơn). **Đừng đánh index bừa "cho chắc"** — đó là sai lầm phổ biến làm chậm cả hệ thống.

### EXPLAIN / Query plan — kỹ năng đắt giá nhất

```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 42;
```

- `EXPLAIN` cho biết **kế hoạch** DB định thực thi; `EXPLAIN ANALYZE` chạy thật và đo thời gian thực tế.
- Đọc plan tìm: **`Seq Scan`** (quét toàn bảng — dấu hiệu thiếu index trên bảng lớn) vs **`Index Scan`** (tốt); ước lượng số hàng (`rows`) lệch nhiều so với thực tế (`actual rows`) → thống kê lỗi thời, chạy `ANALYZE`; toán tử JOIN tốn kém (Nested Loop trên dữ liệu lớn).

**Quy trình tối ưu một query chậm:**
1. Tái hiện và đo bằng `EXPLAIN ANALYZE`.
2. Tìm bước tốn nhất (cost/time cao, Seq Scan trên bảng lớn).
3. Thêm/sửa index phù hợp, viết lại query (tránh function trên cột bị index như `WHERE lower(email)=...` làm mất index — dùng functional index), giảm dữ liệu phải đọc.
4. Đo lại để xác nhận có cải thiện thật.

**📚 Tài nguyên:**
- [**Use The Index, Luke!**](https://use-the-index-luke.com/) — tài nguyên kinh điển, MIỄN PHÍ, giải thích index và query tuning cực dễ hiểu. **Đọc kỹ tài nguyên này.**
- [PostgreSQL docs — Indexes](https://www.postgresql.org/docs/current/indexes.html) và [Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html).
- Công cụ trực quan hóa plan: [explain.dalibo.com](https://explain.dalibo.com/).

**🏋️ Bài tập:**
- [ ] Nạp bảng 1 triệu hàng (dùng `generate_series`), chạy query lọc trước và sau khi đánh index, so sánh `EXPLAIN ANALYZE`.
- [ ] Tạo composite index và chứng minh leftmost prefix rule bằng thí nghiệm.
- [ ] Tìm một query có Seq Scan, tối ưu nó xuống Index Scan.

**Checklist module:**
- [ ] Giải thích B-tree index và khi nào nên/không nên đánh index.
- [ ] Đọc được output `EXPLAIN ANALYZE` và nhận ra Seq Scan vs Index Scan.
- [ ] Tối ưu được ít nhất một query chậm có đo lường.

---

## 📦 Module 6 — Transactions & ACID

**Lý thuyết cốt lõi:**

- **Transaction** = một nhóm thao tác được coi là **một đơn vị nguyên vẹn**: hoặc tất cả thành công, hoặc không gì cả. Kinh điển: chuyển tiền A → B gồm hai bước (trừ A, cộng B) — không được phép chỉ chạy một nửa.

```sql
BEGIN;
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;
    UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;      -- xác nhận, lưu vĩnh viễn
-- nếu có lỗi giữa chừng:
-- ROLLBACK;  -- hủy toàn bộ, quay về trạng thái trước BEGIN
```

- **ACID — 4 đảm bảo của transaction:**
  - **A — Atomicity (Tính nguyên tử):** toàn bộ hoặc không gì cả. Lỗi giữa chừng → tự rollback.
  - **C — Consistency (Tính nhất quán):** transaction đưa DB từ một trạng thái hợp lệ sang trạng thái hợp lệ khác (không vi phạm constraint). Lưu ý: chữ C này khác với "consistency" trong CAP theorem (Module 7) — đừng nhầm.
  - **I — Isolation (Tính cô lập):** các transaction chạy đồng thời không "giẫm chân" nhau; kết quả như thể chúng chạy lần lượt.
  - **D — Durability (Tính bền vững):** đã `COMMIT` thì dữ liệu tồn tại kể cả mất điện/crash (nhờ ghi write-ahead log xuống đĩa).

### Isolation levels — đánh đổi giữa đúng đắn và hiệu năng

Cô lập càng cao càng an toàn nhưng càng chậm (nhiều khóa hơn). Chuẩn SQL có 4 mức, từ thấp đến cao, và các **hiện tượng (anomaly)** chúng cho phép:

| Isolation level | Dirty Read | Non-repeatable Read | Phantom Read |
|---|---|---|---|
| **Read Uncommitted** | Có thể | Có thể | Có thể |
| **Read Committed** | Không | Có thể | Có thể |
| **Repeatable Read** | Không | Không | Có thể (Postgres chặn luôn) |
| **Serializable** | Không | Không | Không |

- **Dirty read:** đọc được dữ liệu của transaction khác **chưa commit** (có thể bị rollback → đọc rác).
- **Non-repeatable read:** đọc cùng một hàng hai lần trong cùng transaction ra kết quả khác (vì transaction khác đã commit sửa đổi giữa chừng).
- **Phantom read:** chạy cùng một query lọc hai lần ra **số hàng khác** (transaction khác đã thêm/xóa hàng khớp điều kiện).

> Mặc định của **PostgreSQL là Read Committed**. Khi cần tính đúng đắn cao (báo cáo tài chính, đặt vé) dùng `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;`. Đánh đổi: Serializable có thể khiến transaction bị **abort** do xung đột, ứng dụng phải sẵn sàng **retry**.

### Deadlock & Race condition

- **Race condition:** hai transaction cùng đọc-rồi-ghi một dữ liệu, kết quả phụ thuộc thứ tự chạy → sai. VD: hai người cùng mua vé cuối cùng. **Cách phòng:** dùng khóa rõ ràng `SELECT ... FOR UPDATE` (khóa hàng để không ai sửa cho tới khi commit), hoặc cập nhật nguyên tử (`UPDATE ... SET stock = stock - 1 WHERE stock > 0`), hoặc tăng isolation level.
- **Deadlock:** TX1 giữ khóa A chờ khóa B, TX2 giữ khóa B chờ khóa A → kẹt nhau vĩnh viễn. DB tự phát hiện và **hủy một transaction** làm "nạn nhân". **Cách giảm:** luôn khóa các tài nguyên theo **cùng một thứ tự** trong mọi transaction; giữ transaction ngắn gọn.

**📚 Tài nguyên:**
- "Database System Concepts" — chương Transactions & Concurrency Control.
- [PostgreSQL docs — Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html).
- Sách **"Designing Data-Intensive Applications"** (Martin Kleppmann) — chương 7 (Transactions). Sách này là **must-read** cho ai làm backend nghiêm túc.

**🏋️ Bài tập:**
- [ ] Mở hai phiên `psql`, mô phỏng dirty read / non-repeatable read ở các isolation level khác nhau.
- [ ] Tạo deadlock cố ý giữa hai phiên và quan sát Postgres hủy một bên.
- [ ] Viết logic "mua vé cuối" an toàn bằng `SELECT ... FOR UPDATE`.

**Checklist module:**
- [ ] Giải thích từng chữ trong ACID.
- [ ] Phân biệt 4 isolation levels và 3 anomaly tương ứng.
- [ ] Biết phòng race condition và xử lý deadlock.

---

## 📦 Module 7 — NoSQL & lý thuyết phân tán

**Lý thuyết cốt lõi — 4 họ NoSQL chính:**

1. **Document store — MongoDB:** lưu dữ liệu dạng tài liệu JSON/BSON, schema linh hoạt. Hợp với dữ liệu lồng nhau, thay đổi cấu trúc thường xuyên (catalog sản phẩm, CMS). Đánh đổi: JOIN yếu, dễ trùng lặp dữ liệu.
2. **Key-Value — Redis:** bản đồ khóa → giá trị, **cực nhanh** (thường in-memory). Hợp với cache, session, leaderboard, rate limiting, hàng đợi. Đánh đổi: chỉ truy vấn theo khóa, không query phức tạp.
3. **Column-family / wide-column — Cassandra:** tối ưu ghi cực lớn, scale ngang phẳng, phân tán nhiều node. Hợp với time-series, log, IoT ở quy mô khổng lồ. Đánh đổi: phải thiết kế theo truy vấn (query-first), không linh hoạt query về sau.
4. **Graph — Neo4j:** lưu nút (node) và cạnh (edge) với thuộc tính; truy vấn quan hệ nhiều bậc cực nhanh (ngôn ngữ Cypher). Hợp với mạng xã hội, gợi ý, phát hiện gian lận, knowledge graph. Đánh đổi: không hợp cho khối lượng dữ liệu bảng đơn giản.

### Khi nào chọn NoSQL vs SQL?

| Chọn **SQL** khi... | Chọn **NoSQL** khi... |
|---|---|
| Dữ liệu có cấu trúc rõ, quan hệ chặt | Schema thay đổi liên tục / không đoán trước |
| Cần transaction ACID mạnh (tài chính) | Cần scale ngang cực lớn, ưu tiên throughput |
| Query phức tạp, ad-hoc, nhiều JOIN | Pattern truy cập đơn giản theo khóa |
| Đa số ứng dụng CRUD/nghiệp vụ thông thường | Dạng dữ liệu đặc thù (graph, cache, time-series) |

> **Phản biện thực tế:** đừng coi đây là "SQL vs NoSQL" loại trừ nhau. Hệ thống lớn thường **polyglot persistence**: Postgres làm nguồn sự thật, Redis làm cache, Elasticsearch cho tìm kiếm, vector DB cho RAG. Chọn công cụ theo từng bài toán.

### Lý thuyết CAP & BASE

- **CAP theorem:** một hệ phân tán **không thể đồng thời đảm bảo cả 3**: **C**onsistency (mọi node đọc cùng dữ liệu mới nhất), **A**vailability (luôn trả lời), **P**artition tolerance (chịu được khi mạng giữa các node đứt). Vì mạng **luôn có thể đứt** (P là bắt buộc trong thực tế), bạn thực sự chỉ chọn được giữa **CP** (ưu tiên nhất quán, có thể từ chối phục vụ — VD MongoDB cấu hình mạnh, HBase) hoặc **AP** (ưu tiên luôn sẵn sàng, chấp nhận dữ liệu tạm lệch — VD Cassandra, DynamoDB).
- **BASE** (đối lập triết lý với ACID): **B**asically **A**vailable, **S**oft state, **E**ventual consistency. Hệ ưu tiên sẵn sàng, chấp nhận **eventual consistency** — dữ liệu các node sẽ **hội tụ về nhất quán sau một khoảng thời gian**, không tức thì. VD: bạn đăng bài, bạn bè ở vùng khác vài giây sau mới thấy — đó là eventual consistency, và thường là chấp nhận được.

**📚 Tài nguyên:**
- **"Designing Data-Intensive Applications"** (Kleppmann) — chương 5, 6, 9 cho replication, partitioning, consistency. **Đây là cuốn quan trọng nhất** cho phần phân tán.
- [MongoDB University](https://learn.mongodb.com/) (khóa miễn phí), [Redis docs](https://redis.io/docs/), [Neo4j Graph Academy](https://graphacademy.neo4j.com/).
- Bài giải thích CAP theorem (tìm "CAP theorem illustrated").

**🏋️ Bài tập:**
- [ ] Cài Redis (Docker), dùng làm cache cho một query Postgres chậm; đo cải thiện.
- [ ] Mô hình hóa cùng một dữ liệu blog ở dạng quan hệ (Postgres) và document (MongoDB), so sánh.
- [ ] Vẽ một quyết định kiến trúc: chọn DB nào cho cache, cho dữ liệu chính, cho tìm kiếm.

**Checklist module:**
- [ ] Kể được 4 họ NoSQL và use case tiêu biểu.
- [ ] Quyết định SQL vs NoSQL có lý lẽ cho một bài toán cho trước.
- [ ] Giải thích CAP và phân biệt ACID vs BASE / eventual consistency.

---

## 📦 Module 8 — Database cho AI/ML

Đây là module **đắt giá nhất với định hướng AI/ML** của bạn.

### Vector Database & Embeddings

- **Embedding** = biểu diễn một mẩu dữ liệu (đoạn văn, ảnh, audio) thành một **vector số nhiều chiều** (VD 768 hoặc 1536 chiều) bằng một model. Tính chất quan trọng: **dữ liệu gần nghĩa → vector gần nhau trong không gian**. "Con chó" và "chú cún" có vector gần nhau; "con chó" và "phương trình bậc hai" thì xa.
- **Similarity search:** cho một vector truy vấn (embedding của câu hỏi user), tìm các vector **gần nhất** trong DB. Độ đo phổ biến: **cosine similarity**, **L2 (Euclidean)**, **inner product**. Tìm chính xác (brute-force) tốn kém ở quy mô lớn → dùng **ANN (Approximate Nearest Neighbor)** với chỉ mục như **HNSW** (đồ thị, recall cao, mặc định nên dùng) hoặc **IVFFlat** (phân cụm, nhẹ hơn nhưng phải train).

### Vì sao cần cho RAG?

**RAG (Retrieval-Augmented Generation)** giải quyết điểm yếu của LLM: chúng không biết dữ liệu riêng của bạn và hay "bịa" (hallucinate). Luồng RAG điển hình:

1. **Index (offline):** cắt tài liệu thành chunk → tạo embedding mỗi chunk → lưu vào vector DB.
2. **Query (online):** embedding câu hỏi user → **similarity search** lấy top-k chunk liên quan nhất → nhét các chunk đó vào prompt làm ngữ cảnh → LLM trả lời **dựa trên dữ liệu thật**, kèm trích dẫn nguồn.

Vector DB chính là tầng **retrieval** này — không có nó thì không có "R" trong RAG.

### Ví dụ thực tế với `pgvector` (Postgres)

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
    id        SERIAL PRIMARY KEY,
    content   TEXT,
    embedding vector(1536)        -- khớp số chiều của model embedding bạn dùng
);

-- Tạo index ANN bằng HNSW với độ đo cosine
CREATE INDEX ON documents
    USING hnsw (embedding vector_cosine_ops);

-- Tìm 5 đoạn gần nghĩa nhất với vector câu hỏi ($1 là embedding truyền từ code)
SELECT id, content,
       embedding <=> $1 AS distance     -- <=> : cosine distance trong pgvector
FROM documents
ORDER BY embedding <=> $1               -- càng nhỏ càng gần
LIMIT 5;
```

> Toán tử pgvector: `<=>` cosine distance, `<->` L2 distance, `<#>` negative inner product.

### So sánh các Vector DB (cập nhật 2026)

| Công cụ | Loại | Điểm mạnh | Khi nào chọn |
|---|---|---|---|
| **pgvector** | Extension Postgres | Dùng chung DB quan hệ sẵn có, không thêm hạ tầng, miễn phí; bản 0.7+ có HNSW song song | **< ~5 triệu vector** và đã có Postgres — lựa chọn thực dụng nhất để bắt đầu |
| **Qdrant** | Mã nguồn mở (Rust) | Hiệu năng cao, lọc payload mạnh, free tier tốt | Cần filter phức tạp + tự host, hiệu năng cao |
| **Pinecone** | Managed (cloud) | Vận hành cực đơn giản (serverless), giữ recall ở quy mô lớn không cần tuning | Production RAG quy mô lớn, muốn đỡ phải lo ops |
| **Weaviate** | Mã nguồn mở | **Hybrid search** (vector + keyword) tốt nhất, có module tạo embedding sẵn, kết hợp knowledge graph | RAG cần chất lượng retrieval cao, khi keyword cũng quan trọng |
| **Chroma** | Mã nguồn mở (nhẹ) | Cực đơn giản, hợp prototype/local, tích hợp tốt với LangChain | Học tập, demo, app nhỏ chạy local |

> **Lời khuyên lộ trình:** bắt đầu với **pgvector** (đỡ học thêm hạ tầng, hiểu nguyên lý), rồi thử **Chroma** cho prototype LangChain. Chỉ chuyển sang Qdrant/Pinecone/Weaviate khi vượt quy mô của pgvector hoặc cần hybrid search/ops được lo hộ. Ở quy mô 100M vector, Pinecone/Weaviate giữ recall tốt mà ít phải tuning, còn pgvector đòi tinh chỉnh tham số HNSW kỹ.

### Data Warehouse vs Data Lake (cơ bản)

- **Data Warehouse** (VD: BigQuery, Snowflake, Redshift): kho dữ liệu **đã làm sạch, có cấu trúc**, tối ưu cho **phân tích/BI** (OLAP). Schema-on-write, dùng SQL. Khác với DB giao dịch (OLTP) ở chỗ tối ưu cho query quét lớn chứ không phải ghi nhỏ liên tục.
- **Data Lake** (VD: S3 + Parquet, Delta Lake): chứa dữ liệu **thô đủ mọi định dạng** (cấu trúc, bán cấu trúc, phi cấu trúc), schema-on-read, rẻ, linh hoạt — kho nguyên liệu cho ML/feature engineering.
- **Lakehouse** (Databricks, Iceberg): kiến trúc lai, gộp ưu điểm cả hai. Bạn sẽ gặp khi làm pipeline ML quy mô lớn.
- **OLTP vs OLAP:** OLTP = giao dịch nhỏ, nhiều, nhanh (app backend — Postgres). OLAP = phân tích, quét khối lượng lớn (warehouse). Pipeline ML thường lấy dữ liệu OLTP → ETL/ELT → warehouse/lake → huấn luyện model.

**📚 Tài nguyên:**
- [pgvector GitHub](https://github.com/pgvector/pgvector) — README là tài liệu chính.
- [Supabase — pgvector / AI & Vectors docs](https://supabase.com/docs/guides/ai) (rất thực hành cho RAG).
- Docs của [Qdrant](https://qdrant.tech/documentation/), [Pinecone](https://docs.pinecone.io/), [Weaviate](https://weaviate.io/developers/weaviate), [Chroma](https://docs.trychroma.com/).
- So sánh vector DB 2026: [Firecrawl](https://www.firecrawl.dev/blog/best-vector-databases), [DataCamp](https://www.datacamp.com/blog/the-top-5-vector-databases).
- Để hiểu RAG end-to-end, học cùng mảng **07 AI** (LangChain/LlamaIndex).

**🏋️ Bài tập:**
- [ ] Cài pgvector, tạo embedding cho ~50 đoạn văn (dùng model bất kỳ, VD sentence-transformers), lưu và chạy similarity search.
- [ ] So sánh kết quả top-k với 3 độ đo (`<=>`, `<->`, `<#>`).
- [ ] (Nâng cao) Xây mini-RAG: hỏi đáp trên một tài liệu PDF của bạn.

**Checklist module:**
- [ ] Giải thích embedding, similarity search, và vai trò vector DB trong RAG.
- [ ] Chạy được similarity search với pgvector + HNSW.
- [ ] Phân biệt warehouse vs lake và OLTP vs OLAP.

---

## 📦 Module 9 — Thực hành & vận hành

**Lý thuyết cốt lõi:**

### ORM vs Raw SQL — đánh đổi

- **ORM** (SQLAlchemy cho Python, Prisma cho Node, Hibernate cho Java): ánh xạ bảng ↔ object/class, viết DB bằng ngôn ngữ lập trình thay vì SQL chuỗi.
  - **Ưu:** tăng tốc CRUD, type-safe, tránh viết SQL lặp lại, dễ refactor, hỗ trợ migration.
  - **Nhược:** ẩn đi SQL thật → dễ sinh query kém hiệu quả; kinh điển là **N+1 query problem** (lặp lấy quan hệ thành N+1 truy vấn thay vì 1 JOIN). Query phân tích phức tạp viết bằng ORM gượng gạo.
- **Raw SQL:** kiểm soát hoàn toàn, tối ưu được; nhưng dài dòng, dễ lỗi cú pháp, và **phải tự lo chống injection**.

> **Lựa chọn thực tế:** dùng **ORM cho 90% CRUD thông thường**, **rớt xuống raw SQL cho query phức tạp/báo cáo/tối ưu hiệu năng**. Các ORM tốt cho phép trộn cả hai. Quan trọng: **luôn biết ORM sinh ra SQL gì** (bật log query) — đừng dùng ORM như hộp đen.

```python
# SQLAlchemy (ORM) — ví dụ truy vấn an toàn, có tham số hóa
from sqlalchemy import select
stmt = select(Order).where(Order.customer_id == customer_id)
orders = session.scalars(stmt).all()
```

### SQL Injection & cách phòng

- **SQL injection:** kẻ tấn công nhét SQL độc qua input người dùng. Lỗi gốc: **ghép chuỗi** input vào câu SQL.

```python
# ❌ SAI — lỗ hổng injection. Nếu user_input = "1; DROP TABLE users; --"
query = f"SELECT * FROM users WHERE id = {user_input}"

# ✅ ĐÚNG — parameterized query (prepared statement)
cur.execute("SELECT * FROM users WHERE id = %s", (user_input,))
```

- **Phòng thủ chính: LUÔN dùng parameterized query / prepared statement** — DB tách biệt "câu lệnh" và "dữ liệu", input không bao giờ được hiểu là SQL. ORM làm việc này tự động (nhưng cẩn thận khi dùng raw SQL trong ORM). Bổ sung: nguyên tắc **least privilege** (tài khoản app không cần quyền `DROP`), validate input, không lộ thông báo lỗi DB ra ngoài.

### Migration, Backup, Connection Pooling

- **Migration:** quản lý thay đổi schema theo phiên bản, có thể tái lập trên mọi môi trường và rollback. Công cụ: **Alembic** (SQLAlchemy), **Prisma Migrate**, Flyway, Liquibase. Nguyên tắc: mỗi thay đổi schema là một file migration được version-control cùng code; **không bao giờ sửa schema production bằng tay**.
- **Backup:** `pg_dump` (logical, một DB) / `pg_basebackup` + WAL archiving (physical, point-in-time recovery). Quy tắc **3-2-1** (3 bản sao, 2 phương tiện, 1 off-site) và **kiểm tra restore định kỳ** — backup chưa từng restore thử coi như chưa có backup.
- **Connection pooling:** mở kết nối DB rất tốn kém; pool **tái sử dụng** một tập kết nối có sẵn. Postgres chịu giới hạn số connection → app nhiều instance phải qua pooler như **PgBouncer** (hoặc pool trong ORM/driver). Không có pooling, hệ thống dễ sập vì cạn connection dưới tải.

**📚 Tài nguyên:**
- [SQLAlchemy docs](https://docs.sqlalchemy.org/) / [Prisma docs](https://www.prisma.io/docs) (dùng context7 để lấy bản mới nhất).
- [Alembic tutorial](https://alembic.sqlalchemy.org/), [PgBouncer](https://www.pgbouncer.org/).
- [OWASP — SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html).
- [PostgreSQL docs — Backup and Restore](https://www.postgresql.org/docs/current/backup.html).

**🏋️ Bài tập:**
- [ ] Kết nối Postgres từ Python bằng cả raw `psycopg` và SQLAlchemy; bật log để xem SQL ORM sinh ra.
- [ ] Cố ý viết một query injectable rồi sửa thành parameterized; thử exploit để hiểu cơ chế.
- [ ] Tạo và áp một migration bằng Alembic, rồi rollback.
- [ ] Tái hiện và sửa N+1 query problem (eager loading / JOIN).

**Checklist module:**
- [ ] Kết nối DB từ code, hiểu đánh đổi ORM vs raw SQL.
- [ ] Viết parameterized query và giải thích vì sao nó chặn injection.
- [ ] Dùng được migration tool; biết về backup & connection pooling.

---

## 🛠️ Project thực hành tổng hợp

> Làm **một project xuyên suốt** sẽ ép bạn dùng kiến thức của mọi module. Đề xuất: **"Hệ thống Q&A tài liệu có RAG"** (kết hợp đẹp cả backend lẫn AI).

**Phần A — Thiết kế & SQL (Module 1–6):**
- [ ] Thiết kế ERD cho app: `users`, `documents`, `chunks`, `chat_sessions`, `messages` (có quan hệ 1-n và n-n nếu cần như `document_tags`).
- [ ] Viết `CREATE TABLE` đầy đủ PK/FK/constraints, chuẩn hóa tới 3NF.
- [ ] Viết ≥ 8 query "thật": thống kê người dùng hoạt động nhất (window function), tài liệu được hỏi nhiều nhất (JOIN + GROUP BY), lịch sử chat của một session (JOIN), dùng CTE cho báo cáo.
- [ ] Bọc thao tác tạo session + message đầu tiên trong **transaction**.
- [ ] Đánh index hợp lý cho các query trên và chứng minh bằng `EXPLAIN ANALYZE`.

**Phần B — Vector & RAG (Module 8):**
- [ ] Bật `pgvector`, thêm cột `embedding` cho `chunks`, tạo HNSW index.
- [ ] Pipeline: nạp tài liệu → cắt chunk → tạo embedding → lưu DB.
- [ ] Endpoint hỏi đáp: embedding câu hỏi → similarity search top-k → ghép prompt → gọi LLM trả lời kèm trích dẫn.

**Phần C — Backend & vận hành (Module 9):**
- [ ] Kết nối DB qua SQLAlchemy, dùng connection pool.
- [ ] Tất cả query nhận input đều parameterized (kiểm chứng không có injection).
- [ ] Quản lý schema bằng Alembic migration.
- [ ] Viết script `pg_dump` backup và thử restore sang DB mới.

**Mở rộng:** thêm Redis cache cho câu hỏi lặp lại; so sánh latency pgvector vs Qdrant trên cùng dataset.

---

## ⚠️ Lỗi & hiểu lầm thường gặp

- **Chọn NoSQL chỉ vì "trendy"** rồi khốn khổ vì thiếu transaction/JOIN. Mặc định nên bắt đầu bằng Postgres.
- **Đánh index bừa "cho chắc ăn"** → làm chậm ghi và tốn dung lượng mà không tăng tốc đọc. Index theo query thật, đo bằng `EXPLAIN`.
- **`SELECT *` trong production code** → kéo cột thừa, dễ vỡ khi schema đổi, mất cơ hội index-only scan. Liệt kê cột cần.
- **Quên `WHERE` ở `UPDATE`/`DELETE`** → sửa/xóa cả bảng. Luôn `SELECT` thử trước, dùng transaction.
- **Ghép chuỗi để build SQL** → lỗ hổng injection. Luôn parameterized.
- **Nhầm chữ "C" của ACID (Consistency) với "C" của CAP** — hai khái niệm hoàn toàn khác.
- **Tưởng `JOIN` mặc định là `LEFT`** — `JOIN` trần = `INNER JOIN`, sẽ **rớt** các hàng không khớp (hay gây "mất dữ liệu" khó hiểu).
- **N+1 query problem khi dùng ORM** — lặp truy vấn quan hệ trong vòng lặp. Dùng eager loading / JOIN.
- **Tin rằng `COUNT(*)` luôn nhanh** — trên bảng lớn không có điều kiện, nó vẫn quét nhiều. Cẩn thận với pagination kiểu `OFFSET` lớn (chậm) → ưu tiên keyset pagination.
- **Lưu danh sách trong một cột phân tách bằng dấu phẩy** — vi phạm 1NF, không index/JOIN được. Tách bảng (hoặc dùng kiểu array/JSONB có chủ đích của Postgres nếu thực sự phù hợp).
- **Coi backup là xong khi đã dump** — backup chưa từng restore thử là backup không tồn tại.

---

## ✅ Checklist tự đánh giá tổng

**Nền tảng & SQL:**
- [ ] Phân biệt được SQL vs NoSQL và biện luận lựa chọn cho một bài toán.
- [ ] Viết thành thạo SELECT/WHERE/GROUP BY/HAVING và 4 loại JOIN.
- [ ] Dùng được subquery, CTE, và window functions cho bài toán phân tích.
- [ ] Viết được DML (kèm UPSERT) và DDL an toàn.

**Thiết kế & toàn vẹn:**
- [ ] Vẽ ERD và chuyển thành schema chuẩn 3NF với PK/FK/constraints đúng.
- [ ] Xử lý quan hệ 1-1/1-n/n-n; biết khi nào denormalize.

**Hiệu năng & giao dịch:**
- [ ] Đọc `EXPLAIN ANALYZE`, đánh index hợp lý, tối ưu query chậm có đo lường.
- [ ] Giải thích ACID, 4 isolation levels, xử lý race condition & deadlock.

**Phân tán & AI:**
- [ ] Kể 4 họ NoSQL, giải thích CAP và ACID vs BASE.
- [ ] Chạy similarity search với pgvector và giải thích vai trò trong RAG.
- [ ] Phân biệt warehouse/lake, OLTP/OLAP.

**Vận hành:**
- [ ] Kết nối DB từ code an toàn (ORM/raw, parameterized).
- [ ] Dùng migration, hiểu backup & connection pooling.
- [ ] Hoàn thành project RAG tổng hợp end-to-end.

---

## 🔗 Học gì tiếp theo

- **→ Mảng 05 — Backend:** giờ bạn đã có DB, hãy học cách phục vụ nó qua API. DB là tầng persistence của mọi backend; kiến thức transaction, connection pooling, ORM, chống injection ở đây dùng trực tiếp. Repository pattern, caching layer, và thiết kế API quanh dữ liệu là bước kế tiếp tự nhiên.
- **→ Mảng 07 — AI/ML:** module 8 (vector DB) là cây cầu sang đây. Học tiếp **RAG đầy đủ** (chunking strategy, reranking, evaluation), framework **LangChain/LlamaIndex**, và cách embedding model ảnh hưởng chất lượng retrieval. Data warehouse/lake nối sang **data engineering & MLOps** cho pipeline huấn luyện.
- **Đào sâu DB (tùy chọn):** replication & high availability, sharding/partitioning, sách **"Designing Data-Intensive Applications"** đọc trọn vẹn, và tuning Postgres cho production.

---

*Nguồn tham khảo cập nhật vector DB 2026: [Firecrawl - Best Vector Databases 2026](https://www.firecrawl.dev/blog/best-vector-databases), [DataCamp - Top Vector Databases](https://www.datacamp.com/blog/the-top-5-vector-databases), [Groovyweb - Vector DB by Use Case](https://www.groovyweb.co/blog/vector-database-comparison-2026).*
