# 05 — Backend & Web Development: Lộ trình học toàn diện

> **Backend là nơi code và model biến thành sản phẩm chạy thật.** Một model ML chính xác 99% nằm trong notebook **không phải sản phẩm** — nó chỉ là một file `.pkl` hoặc một checkpoint. Sản phẩm là khi có người gửi `POST /predict` từ điện thoại ở Hà Nội, request đi qua HTTPS, được xác thực, validate, đưa vào model, trả JSON về trong 200ms, có log để debug và chịu được 1000 người dùng cùng lúc. **Cái cầu nối giữa "code chạy được trên máy tôi" và "hệ thống phục vụ người thật" chính là backend.**
>
> Với định hướng **AI/ML + Backend** của bạn, đây là mảng quan trọng bậc nhất: nó là nơi bạn "đóng gói" (serve/deploy) model thành **API**. Cộng đồng AI gần như mặc định dùng **Python + FastAPI** cho việc này, nên học tốt mảng này bạn vừa thành backend engineer thực thụ, vừa có khả năng tự tay đưa model của mình ra production — kỹ năng mà rất nhiều "data scientist thuần" thiếu.
>
> Lộ trình này dùng **Python + FastAPI** làm trục chính (tính tới 2026, FastAPI ~0.137.x, chạy trên Python 3.12/3.13). Lý do chọn FastAPI và so sánh với các lựa chọn khác được giải thích kỹ ở Module 3. Ta sẽ đi từ **cách web hoạt động ở tầng nền** → **thiết kế API** → **xây API thật có DB + auth + test** → **triển khai Docker/cloud** → **phục vụ AI model**.

---

## 🎯 Mục tiêu

Sau lộ trình này, bạn có thể:

- Giải thích rành mạch một request đi từ trình duyệt tới server và quay về như thế nào: **DNS → TCP → TLS → HTTP → response**, đọc được header, status code, cookie.
- Thiết kế **REST API** sạch sẽ: endpoint đặt tên đúng, dùng HTTP method và status code chuẩn, biết khi nào cần versioning và idempotency.
- So sánh và **chọn đúng** giữa **REST / GraphQL / gRPC** theo bài toán.
- Tự tay xây một **REST API hoàn chỉnh bằng FastAPI**: routing, Pydantic model, validation, dependency injection, async, middleware, error handling, kết nối DB qua SQLAlchemy.
- Cài đặt **Authentication & Authorization**: JWT, OAuth2, hash mật khẩu bằng bcrypt, RBAC, và phòng các lỗ hổng **OWASP Top 10**.
- Tổ chức code backend theo **layered architecture** (controller–service–repository), quản lý config/secret đúng cách.
- Viết **test** (pytest): unit, integration, mocking, đo coverage.
- Tối ưu vận hành: **caching (Redis)**, rate limiting, pagination, **background task / Celery**, logging, monitoring.
- **Đóng gói và deploy**: Docker, CI/CD, đưa lên cloud (Render/Railway/AWS/GCP), đặt sau Nginx reverse proxy.
- **Wrap một model ML/LLM thành REST API** có streaming response — chiếc cầu nối thẳng sang mảng 07.

## 🧱 Yêu cầu trước (prerequisites)

- **[Mảng 01 — Nền tảng CS](01-nen-tang-cs.md):** thành thạo Python (hàm, OOP, exception, virtualenv, đọc tài liệu), quen **terminal**, hiểu cơ bản về tiến trình/luồng (sẽ giúp hiểu async).
- **[Mảng 04 — Database](04-database.md):** viết được SQL, thiết kế schema, hiểu transaction & index. **Backend không có DB chỉ là cái vỏ.** Nên học 04 trước hoặc song song — Module 4 ở đây sẽ kết nối thẳng vào kiến thức DB.
- Quen **Git** ([Mảng 03](03-git-github.md)) — mọi project ở đây nên được version control ngay từ commit đầu.
- Hiểu **JSON** ở mức đọc/viết được (không cần sâu).

## ⏱️ Ước lượng thời gian

| Mức độ | Cam kết | Thời lượng | Đạt tới đâu |
|--------|---------|-----------|-------------|
| Nền tảng đủ dùng | ~10h/tuần | **5–6 tuần** | Module 1–5: hiểu web, REST, xây API FastAPI có auth |
| Vững vàng (khuyến nghị) | ~10h/tuần | **10–12 tuần** | Thêm Module 6–9 + project lớn: kiến trúc, test, vận hành, deploy Docker |
| Chuyên sâu | dài hạn | liên tục | Module 10 + tối ưu serving, microservices, đào sâu System Design (mảng 06) |

> **Nguyên tắc học Backend:** kiến thức chỉ dính khi **gọi API thật và đọc response thật**. Cài [Postman](https://www.postman.com/) hoặc dùng `curl`/`httpie` từ Module 1. Mỗi khái niệm (header, status code, JWT...) hãy *quan sát tận mắt* nó trên dây, đừng chỉ đọc. Và **dựng project xuyên suốt**: thay vì làm 10 ví dụ rời rạc, hãy xây dần một API duy nhất (xem mục Project) qua từng module.

---

## 📦 Module 1 — Nền tảng: Web hoạt động như thế nào

**Lý thuyết cốt lõi:**

- **Mô hình client–server:** **client** (trình duyệt, app mobile, một service khác) *gửi yêu cầu*; **server** *lắng nghe và trả lời*. Web về bản chất là vô vàn cặp **request–response** rời rạc chạy trên giao thức **HTTP**.
- **Một request đi qua những đâu** (rất nên thuộc lòng chuỗi này):
  1. **DNS resolution:** `api.example.com` → địa chỉ IP (vì máy tính định tuyến bằng IP, không bằng tên).
  2. **TCP handshake:** client và server bắt tay 3 bước (SYN → SYN-ACK → ACK) để mở một kết nối tin cậy.
  3. **TLS handshake** (nếu HTTPS): trao đổi khóa, xác thực chứng chỉ → từ đây dữ liệu được **mã hóa**.
  4. **HTTP request:** client gửi dòng `METHOD /path HTTP/1.1` + headers + (tùy chọn) body.
  5. **Server xử lý** → trả **HTTP response**: status line + headers + body.
- **HTTP methods** (động từ — *làm gì với tài nguyên*):

  | Method | Ý nghĩa | Idempotent? | Có body? |
  |--------|---------|-------------|----------|
  | `GET` | Lấy dữ liệu, **không** được gây side-effect | ✅ | thường không |
  | `POST` | Tạo mới / hành động không idempotent | ❌ | có |
  | `PUT` | Thay thế **toàn bộ** tài nguyên | ✅ | có |
  | `PATCH` | Cập nhật **một phần** | ❌ (về lý thuyết) | có |
  | `DELETE` | Xóa tài nguyên | ✅ | thường không |

  *Idempotent* = gọi 1 lần hay 100 lần cho cùng kết quả trạng thái. Quan trọng vì khi mạng lỗi và client retry, method idempotent thì an toàn.

- **Status codes** (server trả về tình trạng):
  - `2xx` thành công — `200 OK`, `201 Created`, `204 No Content`.
  - `3xx` chuyển hướng — `301`, `304 Not Modified`.
  - `4xx` **lỗi phía client** — `400 Bad Request`, `401 Unauthorized` (chưa đăng nhập), `403 Forbidden` (đã đăng nhập nhưng không có quyền), `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity` (FastAPI dùng cho validation), `429 Too Many Requests`.
  - `5xx` **lỗi phía server** — `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`.
  - *Hiểu lầm chí mạng:* trả `200` kèm `{"error": "..."}`. Hãy để status code phản ánh đúng kết quả — client và monitoring dựa vào nó.
- **Headers:** metadata của request/response. Cần nhớ: `Content-Type` (vd `application/json`), `Authorization` (vd `Bearer <token>`), `Accept`, `User-Agent`, `Cache-Control`, `Set-Cookie`/`Cookie`.
- **HTTPS/TLS:** mã hóa đường truyền, chống nghe lén và giả mạo. Production **bắt buộc** HTTPS. Chứng chỉ thường lấy miễn phí qua **Let's Encrypt**.
- **Cookies:** server gửi `Set-Cookie`, trình duyệt tự đính kèm lại ở các request sau → cách HTTP (vốn *stateless*) "nhớ" được phiên đăng nhập. Lưu ý các flag bảo mật: `HttpOnly`, `Secure`, `SameSite`.
- **HTTP/1.1 vs HTTP/2 vs HTTP/3:** HTTP/2 ghép nhiều request trên một kết nối (multiplexing); HTTP/3 chạy trên QUIC (UDP). Biết sự tồn tại là đủ cho giai đoạn này.

**📚 Tài nguyên:**
- [MDN — HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) và [HTTP Messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages) — tài liệu chuẩn vàng, đọc kỹ.
- [MDN — HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) (bookmark để tra).
- [Cloudflare — What is HTTPS / TLS](https://www.cloudflare.com/learning/ssl/what-is-https/) — giải thích trực quan.
- [roadmap.sh/backend](https://roadmap.sh/backend) — bản đồ tổng thể, dùng để định hướng cả mảng.

**🏋️ Bài tập:**
- Mở DevTools (tab Network) trên một trang bất kỳ, quan sát method, status, header của từng request.
- Dùng `curl -v https://httpbin.org/get` và đọc từng dòng request/response. Thử `curl -X POST httpbin.org/post -d '{"a":1}' -H "Content-Type: application/json"`.
- Tự vẽ lại sơ đồ "request đi qua DNS → TCP → TLS → HTTP" bằng giấy.

**Checklist:**
- [ ] Giải thích được khác biệt `401` vs `403`, `PUT` vs `PATCH`.
- [ ] Hiểu idempotency và vì sao nó liên quan tới retry.
- [ ] Đọc được một cặp request/response thô trong DevTools.
- [ ] Giải thích vì sao cookie giúp HTTP "có trạng thái".

---

## 📦 Module 2 — REST API & so sánh kiến trúc API

**Lý thuyết cốt lõi:**

- **REST** (Representational State Transfer) là **một phong cách kiến trúc**, không phải chuẩn cứng. Các nguyên tắc chính:
  - **Resource-based:** mọi thứ là *tài nguyên* (resource), định danh bằng URL. Dùng **danh từ số nhiều**, không nhét động từ vào URL.
  - **Stateless:** mỗi request tự chứa đủ thông tin (vd token), server không nhớ phiên giữa các request → dễ scale ngang.
  - **Dùng đúng HTTP method + status code** làm ngữ nghĩa.
- **Thiết kế endpoint tốt** (cực kỳ quan trọng cho điểm review/phỏng vấn):

  ```text
  ✅ ĐÚNG                              ❌ SAI
  GET    /users                       GET  /getAllUsers
  GET    /users/42                    GET  /user?id=42 (cho 1 resource)
  POST   /users                       POST /createUser
  PATCH  /users/42                    POST /updateUser/42
  DELETE /users/42                    GET  /deleteUser/42  (GET không được xóa!)
  GET    /users/42/orders             GET  /getOrdersOfUser?u=42
  GET    /products?category=ai&page=2&limit=20   (filter/paginate qua query param)
  ```
- **JSON** là định dạng trao đổi mặc định: gọn, ngôn ngữ nào cũng parse được. Quy ước key thường dùng `snake_case` hoặc `camelCase` — *chọn một và nhất quán*.
- **Versioning:** API công khai sẽ đổi theo thời gian; đừng phá vỡ client cũ. Cách phổ biến: prefix URL `(/v1/users)` — đơn giản, dễ thấy nhất; hoặc qua header. Nhược điểm URL-versioning: phình route. Khởi đầu cứ `/v1` cho minh bạch.
- **Idempotency ở tầng API:** với `POST` (vd thanh toán), client gửi kèm **`Idempotency-Key`** để server nhận diện và bỏ qua request lặp do retry — tránh trừ tiền 2 lần.
- **HATEOAS** (Hypermedia as the Engine of Application State): response kèm các *link* dẫn tới hành động kế tiếp (vd `"links": {"next": "/users?page=3"}`). Là cấp cao nhất của REST (Richardson Maturity Model level 3). Thực tế *rất ít* API thương mại làm đầy đủ HATEOAS — biết khái niệm là đủ, đừng over-engineer.
- **So sánh 3 kiểu API** (câu hỏi phỏng vấn kinh điển — *"khi nào dùng gì"*):

  | Tiêu chí | **REST** | **GraphQL** | **gRPC** |
  |----------|----------|-------------|----------|
  | Định dạng | JSON qua HTTP | JSON, 1 endpoint, client tự chọn field | Protobuf (nhị phân) qua HTTP/2 |
  | Điểm mạnh | Đơn giản, ai cũng hiểu, cache HTTP tốt | Client lấy *đúng* dữ liệu cần, tránh over/under-fetching | **Cực nhanh**, type-safe nhờ schema, streaming 2 chiều |
  | Điểm yếu | Over/under-fetching, nhiều round-trip | Cache khó, dễ query nặng, độ phức tạp server cao | Khó debug bằng mắt, trình duyệt không gọi trực tiếp được |
  | Hợp khi | Đa số API public/CRUD, app vừa | App có nhiều client với nhu cầu dữ liệu khác nhau (vd mobile + web) | **Giao tiếp service-to-service nội bộ**, độ trễ thấp, microservices |

  *Liên hệ AI:* phần lớn API phục vụ model là **REST** (dễ tích hợp, ai cũng gọi được). **gRPC** xuất hiện khi các microservice ML nói chuyện với nhau trong cluster cần độ trễ thấp (vd KServe, Triton hỗ trợ gRPC).

**📚 Tài nguyên:**
- Sách **"Designing Web APIs"** (Brenda Jin, Saurabh Sahni, Amir Shevat — O'Reilly) — gối đầu giường về thiết kế API.
- [restfulapi.net](https://restfulapi.net/) — tổng hợp nguyên tắc REST.
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines) — chuẩn thực dụng, đáng đọc.
- [GraphQL chính chủ](https://graphql.org/learn/) và [gRPC docs](https://grpc.io/docs/) — đọc phần "intro" để nắm khi nào dùng.

**🏋️ Bài tập:**
- Thiết kế (trên giấy) toàn bộ endpoint cho một blog: users, posts, comments — đủ CRUD + filter + pagination.
- Chỉ ra 5 endpoint "xấu" của một API thật bạn từng dùng và viết lại cho chuẩn REST.

**Checklist:**
- [ ] Đặt được tên endpoint chuẩn REST cho một domain mới.
- [ ] Giải thích over-fetching/under-fetching và GraphQL giải quyết ra sao.
- [ ] Nói được 1 tình huống nên chọn gRPC thay vì REST.

---

## 📦 Module 3 — Chọn ngôn ngữ & framework backend

**Lý thuyết cốt lõi:**

- **Khuyến nghị chính: Python + [FastAPI](https://fastapi.tiangolo.com/).** Lý do *đặc biệt hợp AI/ML*:
  1. **Cùng hệ sinh thái Python với model:** PyTorch, TensorFlow, scikit-learn, Transformers, LangChain... đều là Python. Wrap model thành API mà không phải nhảy ngôn ngữ → ít ma sát, ít bug serialize.
  2. **Async native (`async/await`):** xử lý hàng nghìn request đồng thời hiệu quả — quan trọng khi gọi LLM/DB (tác vụ I/O chờ lâu). Benchmark 2026 cho thấy FastAPI ~2ms latency dưới tải nặng so với ~5ms (Node) và ~15ms (Django thuần).
  3. **Type hints + [Pydantic](https://docs.pydantic.dev/):** khai báo kiểu dữ liệu → tự validate request, tự sinh lỗi rõ ràng. Đây là "vũ khí" giảm bug nhất của FastAPI.
  4. **Auto docs:** tự sinh tài liệu tương tác **Swagger UI** (`/docs`) và **ReDoc** (`/redoc`) từ code — đồng đội test API ngay trên trình duyệt, không cần viết doc tay.
  5. Là **framework Python tăng trưởng nhanh nhất** (2026 đã vượt Flask/Django về độ phổ biến trong dev web Python), cộng đồng AI gần như mặc định dùng nó để serve model.
- **Giới thiệu các lựa chọn khác** (để bạn *hiểu trade-off*, không phải để học hết):
  - **Node.js + Express/NestJS (JavaScript/TypeScript):** mạnh ở real-time (WebSocket, chat), full-stack JS (chung ngôn ngữ với frontend). *Không hợp* khi cốt lõi là tính toán ML — hệ sinh thái ML của JS yếu hơn Python rất nhiều.
  - **Django (Python):** "batteries included" — có sẵn ORM, admin panel, auth, migration. Tuyệt cho **SaaS có nhiều nghiệp vụ** (user, billing, quản trị). Nặng và mặc định đồng bộ (sync); với pure ML inference thì hơi cồng kềnh.
  - **Go, Java/Spring, Rust:** hiệu năng/đồng thời rất cao cho hệ thống lớn, nhưng xa hệ ML Python — để dành khi bạn đã vững và có nhu cầu cụ thể.
- **Một pattern thực tế đáng biết (2026):** nhiều AI SaaS dùng **cả Django lẫn FastAPI** — Django lo "vỏ" sản phẩm (auth, thanh toán, admin), **FastAPI lo phần inference/compute nặng**. Bạn không cần làm vậy ngay, nhưng biết để không tưởng phải "chọn một mất một".

> **Phản biện cho định hướng của bạn:** đừng học dàn trải nhiều framework cùng lúc. **Đào sâu FastAPI** tới mức production-ready trước. Một engineer giỏi *một* framework + hiểu nguyên lý chung sẽ học framework thứ hai trong vài ngày. Học hời hợt ba cái thì chẳng deploy nổi cái nào.

**📚 Tài nguyên:**
- [FastAPI — Tutorial chính chủ](https://fastapi.tiangolo.com/tutorial/) — *chất lượng cực cao*, đọc và gõ theo từ đầu tới cuối.
- [RealPython — FastAPI](https://realpython.com/fastapi-python-web-apis/) và các bài backend Python khác.
- [Django docs](https://docs.djangoproject.com/) (lướt phần overview) để hiểu triết lý đối lập với FastAPI.

**🏋️ Bài tập:**
- Cài Python 3.12+, tạo virtualenv, `pip install "fastapi[standard]"`, dựng "hello world" API và mở `/docs`.
- Viết một bảng so sánh ngắn của riêng bạn: với *dự án của tôi*, vì sao FastAPI hợp hơn Django.

**Checklist:**
- [ ] Cài và chạy được FastAPI app đầu tiên, mở Swagger UI.
- [ ] Giải thích được 3 lý do FastAPI hợp AI serving.
- [ ] Biết khi nào *không* nên dùng FastAPI (vd cần admin panel sẵn → Django).

---

## 📦 Module 4 — Xây dựng API thật với FastAPI

**Lý thuyết cốt lõi + ví dụ code:**

- **Routing & app cơ bản:**
  ```python
  from fastapi import FastAPI

  app = FastAPI(title="My API", version="1.0.0")

  @app.get("/")
  async def root():
      return {"message": "ok"}

  @app.get("/items/{item_id}")          # path parameter
  async def get_item(item_id: int, q: str | None = None):  # query parameter
      return {"item_id": item_id, "q": q}
  ```
  Chạy: `fastapi dev main.py` (chế độ dev có auto-reload) — `fastapi-cli` đi kèm bản `fastapi[standard]`.

- **Request/Response model bằng Pydantic** — *trái tim của FastAPI*:
  ```python
  from pydantic import BaseModel, EmailStr, Field

  class UserCreate(BaseModel):           # model nhận vào (request)
      email: EmailStr
      password: str = Field(min_length=8)
      age: int | None = Field(default=None, ge=0, le=120)

  class UserOut(BaseModel):              # model trả ra — KHÔNG chứa password!
      id: int
      email: EmailStr

  @app.post("/users", response_model=UserOut, status_code=201)
  async def create_user(user: UserCreate):
      # user đã được validate tự động; sai kiểu → FastAPI tự trả 422
      ...
      return UserOut(id=1, email=user.email)
  ```
  *Cơ chế:* FastAPI đọc type hint → validate body → ép kiểu → sinh schema OpenAPI. `response_model` lọc output, tránh **lộ field nhạy cảm** (như password hash) — một lỗi bảo mật rất hay gặp.

- **Dependency Injection (DI):** tách logic dùng chung (lấy DB session, lấy user hiện tại) ra khỏi route, tái sử dụng + dễ test.
  ```python
  from fastapi import Depends

  def get_db():
      db = SessionLocal()
      try:
          yield db          # yield → cleanup tự động sau request
      finally:
          db.close()

  @app.get("/users/{uid}")
  async def read_user(uid: int, db = Depends(get_db)):
      ...
  ```

- **async/await:** dùng `async def` cho route gọi I/O (DB async, HTTP tới LLM). Nếu trong route có code **blocking** (vd thư viện sync, hoặc inference CPU nặng), FastAPI tự chạy `def` (không async) trong **thread pool** để không chặn event loop. *Quy tắc:* I/O chờ lâu → `async def` + thư viện async; CPU nặng → để `def` (hoặc đẩy sang background, xem Module 8).

- **Middleware:** code chạy *trước/sau mọi request* — vd đo thời gian, gắn request-id, CORS.
  ```python
  from fastapi.middleware.cors import CORSMiddleware
  app.add_middleware(CORSMiddleware, allow_origins=["https://myapp.com"])
  ```

- **Error handling:**
  ```python
  from fastapi import HTTPException

  @app.get("/users/{uid}")
  async def read_user(uid: int):
      user = ...
      if not user:
          raise HTTPException(status_code=404, detail="User not found")
      return user
  ```
  Có thể đăng ký `@app.exception_handler(...)` để chuẩn hóa format lỗi toàn app.

- **Kết nối database với SQLAlchemy** (nối thẳng vào [mảng 04](04-database.md)):
  ```python
  from sqlalchemy import create_engine
  from sqlalchemy.orm import sessionmaker, DeclarativeBase, Mapped, mapped_column

  engine = create_engine(settings.DATABASE_URL)   # vd postgresql://...
  SessionLocal = sessionmaker(bind=engine)

  class Base(DeclarativeBase): ...
  class User(Base):
      __tablename__ = "users"
      id: Mapped[int] = mapped_column(primary_key=True)
      email: Mapped[str] = mapped_column(unique=True)
  ```
  Dùng **[Alembic](https://alembic.sqlalchemy.org/)** để quản lý **migration** (thay đổi schema có version, rollback được). Cho async dùng `asyncpg` + `create_async_engine`.

**📚 Tài nguyên:**
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/) — đặc biệt các mục *Request Body, Dependencies, SQL Databases*.
- [Pydantic docs](https://docs.pydantic.dev/latest/) — đọc về validation và `Field`.
- [SQLAlchemy 2.0 ORM docs](https://docs.sqlalchemy.org/en/20/orm/) + [FastAPI SQL guide](https://fastapi.tiangolo.com/tutorial/sql-databases/).
- [TestDriven.io — FastAPI courses](https://testdriven.io/courses/) (một số miễn phí, chất lượng cao).

**🏋️ Bài tập:**
- Xây CRUD đầy đủ cho resource `items`: model Pydantic vào/ra, validate, kết nối Postgres qua SQLAlchemy, dùng `Depends(get_db)`.
- Thêm middleware đo và log thời gian xử lý mỗi request (gắn vào header `X-Process-Time`).
- Thiết lập Alembic và tạo migration đầu tiên.

**Checklist:**
- [ ] Tách rõ model request vs response, dùng `response_model` để giấu field nhạy cảm.
- [ ] Dùng được `Depends` cho DB session.
- [ ] Phân biệt khi nào dùng `async def` vs `def`.
- [ ] Chạy được migration với Alembic.

---

## 📦 Module 5 — Authentication & Authorization + Bảo mật

**Lý thuyết cốt lõi:**

- **Phân biệt 2 khái niệm** (hay bị lẫn): **Authentication** = *bạn là ai?* (đăng nhập). **Authorization** = *bạn được làm gì?* (phân quyền).
- **Session vs Token** — hai cách giữ trạng thái đăng nhập:
  - **Session (stateful):** server lưu phiên (thường trong Redis), trả về **session id** trong cookie. Ưu: thu hồi (logout) tức thì. Nhược: server phải lưu trạng thái → khó scale ngang thuần túy.
  - **Token / JWT (stateless):** server ký một **JWT** chứa thông tin user, client gửi kèm mỗi request trong `Authorization: Bearer <token>`. Ưu: server không cần lưu → scale ngang dễ, hợp microservices. Nhược: **khó thu hồi trước khi hết hạn** (phải dùng blacklist/refresh token).
- **JWT — cơ chế:** gồm 3 phần ngăn bởi dấu chấm `header.payload.signature`. Header + payload chỉ là **Base64, KHÔNG mã hóa** (ai cũng đọc được — *đừng để dữ liệu bí mật trong payload!*). Signature = ký bằng secret key của server → đảm bảo token *không bị sửa*. Server xác minh chữ ký để tin payload. Dùng **access token** ngắn hạn + **refresh token** dài hạn.
- **OAuth2:** chuẩn *ủy quyền* (vd "Đăng nhập bằng Google"). Ứng dụng của bạn không thấy mật khẩu Google của user; nó nhận một token do Google cấp. FastAPI có sẵn `OAuth2PasswordBearer` để dựng flow password.
- **Password hashing:** **TUYỆT ĐỐI không lưu mật khẩu dạng thô**. Hash bằng thuật toán *chậm, có salt* như **bcrypt** (hoặc argon2). "Chậm" là cố ý — để brute-force tốn kém.
  ```python
  from passlib.context import CryptContext
  pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
  hashed = pwd.hash("my-password")
  pwd.verify("my-password", hashed)   # -> True
  ```
- **API keys:** cách đơn giản cho machine-to-machine (vd cho client gọi API model của bạn). Cấp key, gửi qua header, đối chiếu DB. Kém linh hoạt hơn OAuth nhưng đủ cho nhiều ca dùng.
- **RBAC (Role-Based Access Control):** gán **role** (user/admin/...) cho user, kiểm tra quyền trong dependency:
  ```python
  def require_admin(user = Depends(get_current_user)):
      if user.role != "admin":
          raise HTTPException(403, "Admin only")
      return user
  ```
- **OWASP Top 10 — các lỗ hổng phải biết & cách chặn:**
  - **Injection (SQL injection):** *không bao giờ* nối chuỗi vào câu SQL. Dùng **parameterized query / ORM** (SQLAlchemy chặn sẵn nếu dùng đúng).
  - **XSS (Cross-Site Scripting):** chèn script độc qua input hiển thị lại. Backend: validate/escape output; với template phải auto-escape.
  - **CSRF (Cross-Site Request Forgery):** lừa trình duyệt user gửi request có cookie. Chống bằng **CSRF token** và cookie `SameSite`. (API dùng JWT trong header thay vì cookie thì ít bị CSRF hơn.)
  - **Broken Authentication / Access Control:** kiểm tra quyền ở *mọi* endpoint nhạy cảm, không tin client.
  - **Security Misconfiguration / lộ secret:** không commit `.env`, tắt debug ở prod, dùng HTTPS.
  - Còn lại: SSRF, insecure deserialization, dùng thư viện có CVE... — đọc full Top 10.

**📚 Tài nguyên:**
- [FastAPI — Security tutorial](https://fastapi.tiangolo.com/tutorial/security/) (OAuth2 + JWT, có code đầy đủ).
- [jwt.io](https://jwt.io/) — dán thử một JWT vào để *thấy* 3 phần của nó.
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — đọc một lượt, là kiến thức nền bảo mật.
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) — tra cứu cách phòng từng lỗi.

**🏋️ Bài tập:**
- Thêm vào API ở Module 4: đăng ký (hash bcrypt) → đăng nhập (trả JWT) → endpoint `/me` yêu cầu token hợp lệ.
- Thêm RBAC: endpoint `/admin/...` chỉ role admin gọi được.
- Tự tạo một lỗ hổng SQL injection (nối chuỗi) rồi sửa lại bằng parameterized query để *thấy* sự khác biệt.

**Checklist:**
- [ ] Phân biệt authentication vs authorization, session vs JWT (kèm trade-off).
- [ ] Giải thích 3 phần của JWT và vì sao không để secret trong payload.
- [ ] Hash & verify mật khẩu đúng cách (bcrypt + salt).
- [ ] Liệt kê và biết cách chặn ít nhất SQLi, XSS, CSRF.

---

## 📦 Module 6 — Kiến trúc & tổ chức code backend

**Lý thuyết cốt lõi:**

- **Vì sao cần kiến trúc:** một file `main.py` 2000 dòng sẽ thành "big ball of mud" — sửa một chỗ vỡ ba chỗ, không test nổi. Mục tiêu: **tách trách nhiệm (separation of concerns)** để dễ đọc, test, thay thế.
- **Layered architecture (controller–service–repository)** — mẫu thực dụng nhất cho API:
  - **Controller / Router:** nhận HTTP request, validate (Pydantic), gọi service, trả response. *Không* chứa logic nghiệp vụ.
  - **Service:** **logic nghiệp vụ** (business rules). Không biết gì về HTTP, không biết SQL cụ thể.
  - **Repository:** truy cập dữ liệu (DB). Service gọi repository để đọc/ghi, không tự viết query.
  - Lợi ích: đổi DB chỉ sửa repository; test service bằng cách mock repository; route mỏng dễ đọc.
- **MVC:** Model–View–Controller, phổ biến ở Django/Rails. Với API thuần (không render HTML) thì layered architecture ở trên gần gũi hơn.
- **Clean Architecture (mức cơ bản):** quy tắc cốt lõi là **dependency rule** — tầng trong (business/domain) *không phụ thuộc* tầng ngoài (DB, framework, web). Framework là *chi tiết*, có thể thay. Với project nhỏ/vừa, **đừng over-engineer**: layered 3 tầng là quá đủ; chỉ tiến tới clean architecture đầy đủ khi domain đủ phức tạp.
- **Cấu trúc thư mục gợi ý (FastAPI, theo module nghiệp vụ):**
  ```text
  app/
    main.py                # khởi tạo FastAPI app
    core/                  # config, security, settings
    api/
      v1/
        users.py           # router (controller)
    services/
      user_service.py      # business logic
    repositories/
      user_repo.py         # truy cập DB
    models/                # SQLAlchemy models (DB)
    schemas/               # Pydantic models (request/response)
    db/                    # engine, session
    tests/
  ```
- **Config & environment variables:** *không hardcode* secret/connection string. Đọc từ biến môi trường, quản lý bằng **Pydantic Settings**:
  ```python
  from pydantic_settings import BaseSettings
  class Settings(BaseSettings):
      database_url: str
      jwt_secret: str
      model_config = {"env_file": ".env"}
  settings = Settings()
  ```
  File `.env` để **trong `.gitignore`**; cung cấp `.env.example` (không có giá trị thật) cho đồng đội.
- **Dependency management:** dùng [`uv`](https://docs.astral.sh/uv/) (rất nhanh, xu hướng 2026) hoặc Poetry; pin version trong `pyproject.toml`/`requirements.txt` + lockfile để build *reproducible*.

**📚 Tài nguyên:**
- [netflix/dispatch](https://github.com/Netflix/dispatch) hoặc [fastapi-best-practices](https://github.com/zhanymkanov/fastapi-best-practices) — cấu trúc project thực chiến để tham khảo.
- Sách **"Clean Architecture"** (Robert C. Martin) — đọc phần *dependency rule* để hiểu triết lý (đừng áp dụng máy móc).
- [12-Factor App](https://12factor.net/) — nguyên tắc vàng về config/env cho ứng dụng cloud-native.

**🏋️ Bài tập:**
- Refactor API ở Module 4–5 thành 3 tầng controller–service–repository.
- Chuyển toàn bộ config sang Pydantic Settings + `.env`, đảm bảo không còn giá trị hardcode.

**Checklist:**
- [ ] Giải thích trách nhiệm từng tầng và *vì sao* tách.
- [ ] Project không còn secret hardcode; `.env` đã trong `.gitignore`.
- [ ] Hiểu dependency rule và khi nào *không* cần clean architecture.

---

## 📦 Module 7 — Testing

**Lý thuyết cốt lõi:**

- **Vì sao test:** không phải để "có cho đẹp" mà để **sửa code mà không sợ vỡ** (regression). Code có test là code dám refactor.
- **Kim tự tháp test:** nhiều **unit test** (rẻ, nhanh) → ít **integration test** → rất ít **e2e** (đắt, chậm).
  - **Unit test:** kiểm tra một hàm/đơn vị cô lập (vd một hàm service), mock các phụ thuộc.
  - **Integration test:** kiểm tra nhiều phần ghép lại (vd route → service → DB thật, thường dùng DB test riêng).
- **pytest** — framework test chuẩn của Python:
  ```python
  from fastapi.testclient import TestClient
  from app.main import app

  client = TestClient(app)

  def test_create_user():
      r = client.post("/users", json={"email": "a@b.com", "password": "12345678"})
      assert r.status_code == 201
      assert r.json()["email"] == "a@b.com"
      assert "password" not in r.json()        # đảm bảo không lộ password
  ```
- **Fixtures:** `@pytest.fixture` để chuẩn bị dữ liệu/tài nguyên dùng chung (vd DB test, client). FastAPI cho phép **override dependency** để cắm DB test thay DB thật.
- **Mocking:** thay một phụ thuộc thật (vd API bên ngoài, model nặng) bằng đối tượng giả để test nhanh và xác định. Dùng `unittest.mock` / `pytest-mock`. *Nguyên tắc:* mock ranh giới hệ thống (mạng, DB ngoài), **đừng mock thứ bạn đang test**.
- **Test coverage:** `pytest --cov` đo % code được test chạm tới. Coverage cao *không* đảm bảo đúng, nhưng coverage thấp chắc chắn có rủi ro. Đừng tôn thờ con số 100%.
- **TDD (Test-Driven Development) cơ bản:** vòng **Red → Green → Refactor** — viết test (đỏ/fail) trước → viết code tối thiểu cho pass (xanh) → dọn dẹp. Không bắt buộc dùng mọi lúc, nhưng tập TDD vài tính năng giúp bạn thiết kế code dễ test hơn.

**📚 Tài nguyên:**
- [pytest docs](https://docs.pytest.org/) và [FastAPI — Testing](https://fastapi.tiangolo.com/tutorial/testing/).
- [RealPython — Getting Started With Testing in Python](https://realpython.com/python-testing/).
- Sách **"Architecture Patterns with Python"** (Percival & Gregory, free online tại [cosmicpython.com](https://www.cosmicpython.com/)) — test + kiến trúc cho Python backend, *rất khuyến nghị*.

**🏋️ Bài tập:**
- Viết unit test cho tầng service (mock repository) và integration test cho route (dùng `TestClient` + DB test).
- Đạt coverage tối thiểu cho luồng auth (đăng ký/đăng nhập/`/me`).
- Thử làm 1 tính năng nhỏ theo TDD.

**Checklist:**
- [ ] Phân biệt unit vs integration test và biết khi nào dùng cái nào.
- [ ] Viết được fixture và override dependency cho DB test.
- [ ] Biết mock đúng ranh giới, không mock nhầm.
- [ ] Chạy được `pytest --cov` và đọc báo cáo.

---

## 📦 Module 8 — Hiệu năng & Vận hành

**Lý thuyết cốt lõi:**

- **Caching với [Redis](https://redis.io/):** lưu tạm kết quả tốn công (query nặng, kết quả model) trong bộ nhớ → lần sau trả ngay. Mẫu phổ biến **cache-aside**: đọc cache trước; miss thì query DB rồi ghi vào cache kèm **TTL** (thời gian sống). *Bẫy:* **cache invalidation** (làm mới khi dữ liệu đổi) là một trong những việc khó nhất — cache sai còn tệ hơn không cache.
- **Rate limiting:** giới hạn số request/đơn vị thời gian để chống lạm dụng & bảo vệ tài nguyên (đặc biệt với endpoint gọi LLM tốn tiền). Thuật toán hay dùng: **token bucket**, **sliding window**. Thư viện: [`slowapi`](https://github.com/laurentS/slowapi) cho FastAPI, hoặc làm ở tầng Nginx/API gateway. Trả `429 Too Many Requests` khi vượt.
- **Pagination:** *không bao giờ* trả toàn bộ bảng. Hai kiểu:
  - **Offset/limit** (`?page=2&limit=20`): đơn giản nhưng chậm và dễ lệch khi data thay đổi ở trang sâu.
  - **Cursor-based** (`?after=<id>`): nhanh, ổn định cho dataset lớn/feed — nên dùng cho production thật.
- **Background tasks / Job queue:** request không nên *chờ* việc nặng (gửi email, xử lý ảnh, chạy inference lâu). Trả `202 Accepted` ngay rồi xử lý nền.
  - FastAPI có `BackgroundTasks` cho việc *nhẹ, ngắn*.
  - Việc nặng/cần độ tin cậy → dùng **[Celery](https://docs.celeryq.dev/)** + broker (Redis/RabbitMQ): producer đẩy job vào queue, **worker** chạy riêng. Cho phép retry, scale worker độc lập. (Đối thủ nhẹ hơn: [Dramatiq](https://dramatiq.io/), [arq](https://github.com/python-arq/arq) — async-native.)
- **Logging:** dùng **structured logging** (log dạng JSON, có `request_id`) thay vì `print`. Phân level (DEBUG/INFO/WARNING/ERROR). Đây là *mắt* của bạn khi production lỗi.
- **Monitoring cơ bản:** thu thập **metrics** (Prometheus) — latency, request/s, tỉ lệ lỗi; trực quan hóa bằng Grafana. Thêm **health check** endpoint (`/health`) cho load balancer kiểm tra. Khái niệm "3 trụ observability": **logs, metrics, traces**.

**📚 Tài nguyên:**
- [Redis docs](https://redis.io/docs/latest/) (đọc về caching pattern & TTL).
- [Celery — First Steps](https://docs.celeryq.dev/en/stable/getting-started/first-steps-with-celery.html).
- [slowapi](https://github.com/laurentS/slowapi) cho rate limiting.
- Bài viết về [cursor vs offset pagination](https://www.cockroachlabs.com/blog/pagination-and-filtering/) (hoặc tương đương).

**🏋️ Bài tập:**
- Cache kết quả một endpoint đọc nhiều bằng Redis (có TTL) và đo chênh lệch thời gian.
- Thêm rate limit (vd 60 req/phút) cho endpoint nhạy cảm, kiểm tra trả `429`.
- Chuyển một tác vụ "gửi email" (giả lập sleep) sang Celery worker.
- Cài structured logging + endpoint `/health`.

**Checklist:**
- [ ] Cài cache-aside với TTL và hiểu rủi ro cache invalidation.
- [ ] Triển khai rate limiting trả `429`.
- [ ] Dùng cursor pagination cho dataset lớn.
- [ ] Đẩy việc nặng sang background/Celery, trả `202`.

---

## 📦 Module 9 — Triển khai (Deployment)

**Lý thuyết cốt lõi:**

- **Docker & container hóa:** đóng gói app + mọi phụ thuộc + runtime vào một **image** → "chạy giống hệt nhau ở mọi máy", diệt bệnh "trên máy tôi chạy được". Container nhẹ hơn VM vì chia sẻ kernel host.
  ```dockerfile
  FROM python:3.12-slim
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt
  COPY . .
  # production chạy bằng uvicorn worker do gunicorn quản lý, hoặc uvicorn trực tiếp
  CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
  ```
  *Nâng cao:* **multi-stage build** để image gọn; `.dockerignore` để loại file thừa; chạy bằng user không phải root.
- **`docker compose`:** chạy nhiều service cùng lúc cho môi trường dev (API + Postgres + Redis) bằng một file `compose.yaml` — cực tiện để dựng môi trường local giống prod.
- **Môi trường dev / staging / prod:** *cùng code, khác config*. Dev để code; **staging** giống prod để test trước khi phát hành; prod phục vụ người thật. Khác biệt nằm ở biến môi trường, không ở source.
- **CI/CD cơ bản:** **CI** (Continuous Integration) = mỗi push tự chạy lint + test. **CD** (Continuous Delivery/Deployment) = pass test thì tự build image và deploy. Dùng **GitHub Actions** (workflow YAML): `on: push` → cài deps → `pytest` → build Docker → deploy.
- **Deploy lên cloud:**
  - **[Render](https://render.com/) / [Railway](https://railway.app/) / [Fly.io](https://fly.io/):** PaaS đơn giản, deploy từ GitHub trong vài phút — *bắt đầu ở đây*, đừng nhảy thẳng vào AWS.
  - **AWS / GCP / Azure:** mạnh & linh hoạt (ECS/EKS, Cloud Run, App Runner) nhưng dốc học. **GCP Cloud Run** hoặc **AWS App Runner** chạy container serverless rất hợp để serve model trả tiền theo dùng.
- **Reverse proxy (Nginx):** đứng *trước* app, lo TLS termination (HTTPS), load balancing, phục vụ file tĩnh, đệm request. App (uvicorn) không nên *trực tiếp* hứng internet ở prod.
- **Biến môi trường & secrets:** inject secret qua môi trường của nền tảng (Render/Railway/cloud secret manager), **không** nhét vào image hay commit. Dùng secret manager (AWS Secrets Manager, GCP Secret Manager) khi quy mô lớn.

**📚 Tài nguyên:**
- [Docker — Get started](https://docs.docker.com/get-started/) và [FastAPI — Deployment](https://fastapi.tiangolo.com/deployment/).
- [GitHub Actions docs](https://docs.github.com/en/actions) (đọc phần "Building and testing Python").
- [Render docs](https://render.com/docs) — hướng dẫn deploy FastAPI + Postgres rất thẳng.
- [Nginx beginner's guide](https://nginx.org/en/docs/beginners_guide.html).

**🏋️ Bài tập:**
- Viết `Dockerfile` + `compose.yaml` chạy API + Postgres + Redis local bằng một lệnh.
- Lập GitHub Actions: push → chạy `pytest` → (nếu pass) build image.
- Deploy API lên Render/Railway với Postgres thật, cấu hình biến môi trường, gọi được từ internet qua HTTPS.

**Checklist:**
- [ ] Đóng gói app thành Docker image và chạy được.
- [ ] Dùng `docker compose` dựng môi trường multi-service.
- [ ] Có pipeline CI chạy test tự động khi push.
- [ ] Deploy thành công lên cloud, secret không lộ trong code.

---

## 📦 Module 10 — Phục vụ AI model (cầu nối tới [mảng 07](07-ai-ml.md))

> Đây là *điểm hội tụ* của toàn bộ lộ trình: bạn đã có Backend, giờ dùng nó để biến model thành sản phẩm.

**Lý thuyết cốt lõi:**

- **Wrap model thành REST API — mẫu cơ bản:** load model **một lần** lúc app khởi động (dùng `lifespan`), không load lại mỗi request:
  ```python
  from contextlib import asynccontextmanager
  from fastapi import FastAPI
  from pydantic import BaseModel

  ml = {}

  @asynccontextmanager
  async def lifespan(app: FastAPI):
      ml["model"] = load_model("model.pkl")   # load 1 lần khi startup
      yield
      ml.clear()                               # dọn khi shutdown

  app = FastAPI(lifespan=lifespan)

  class PredictIn(BaseModel):
      text: str

  class PredictOut(BaseModel):
      label: str
      score: float

  @app.post("/predict", response_model=PredictOut)
  def predict(req: PredictIn):           # def (không async) → CPU-bound chạy ở thread pool
      result = ml["model"].predict(req.text)
      return PredictOut(label=result.label, score=result.score)
  ```
  *Vì sao `def` chứ không `async def`:* inference là **CPU-bound**; FastAPI tự đẩy hàm `def` vào thread pool, tránh chặn event loop. (Còn gọi LLM qua mạng là **I/O-bound** → nên `async def`.)

- **Streaming response (quan trọng cho LLM):** LLM sinh token dần dần — trả từng phần để user thấy chữ "chạy ra" ngay thay vì chờ cả câu. Dùng `StreamingResponse` (hoặc **SSE** — Server-Sent Events):
  ```python
  from fastapi.responses import StreamingResponse

  @app.post("/chat")
  async def chat(req: PredictIn):
      async def gen():
          async for token in llm.stream(req.text):
              yield token
      return StreamingResponse(gen(), media_type="text/event-stream")
  ```

- **Xử lý request nặng (long-running inference):** không bắt client chờ HTTP timeout. Mẫu **async job**:
  1. `POST /jobs` → đẩy việc vào **Celery/queue**, trả ngay `202 Accepted` + `job_id`.
  2. Worker (có thể trên máy có **GPU**) chạy inference.
  3. Client `GET /jobs/{id}` để hỏi trạng thái/kết quả (polling), hoặc nhận qua webhook/WebSocket.

- **Vì sao FastAPI thống trị AI serving:**
  1. **Cùng ngôn ngữ với model** (Python) → không phải bắc cầu sang ngôn ngữ khác.
  2. **Async** xử lý tốt I/O khi gọi LLM/vector DB; thread pool lo phần CPU-bound.
  3. **Pydantic** validate input model chặt chẽ, **auto docs** để team thử model ngay.
  4. Là **chuẩn de-facto:** [LangServe](https://python.langchain.com/docs/langserve/), nhiều ví dụ của [Hugging Face](https://huggingface.co/), [Ray Serve](https://docs.ray.io/en/latest/serve/index.html), [BentoML](https://www.bentoml.com/) đều xoay quanh hoặc tương thích FastAPI.

- **Khi nào cần serving framework chuyên dụng** (biết để định hướng): mô hình lớn cần batching động, GPU, autoscale → dùng **BentoML, Ray Serve, NVIDIA Triton, KServe, vLLM** (cho LLM). FastAPI vẫn thường làm lớp API phía trước.

> **Phản biện thực tế:** đừng tự host LLM khổng lồ khi mới bắt đầu — tốn GPU và rất khó vận hành. Giai đoạn đầu, "phục vụ AI" thường là **gọi API của model có sẵn** (Anthropic/OpenAI/local model nhỏ) rồi *bọc nghiệp vụ* (auth, rate limit, RAG, logging) quanh nó — và đó chính xác là những gì 9 module trước dạy bạn.

**📚 Tài nguyên:**
- [FastAPI — Lifespan](https://fastapi.tiangolo.com/advanced/events/) & [Streaming/StreamingResponse](https://fastapi.tiangolo.com/advanced/custom-response/).
- [BentoML docs](https://docs.bentoml.com/) và [Ray Serve](https://docs.ray.io/en/latest/serve/index.html) — serving production.
- [Hugging Face — Serving models](https://huggingface.co/docs) và [vLLM](https://docs.vllm.ai/) (serve LLM hiệu năng cao).
- Mảng [07 — AI/ML](07-ai-ml.md) để hiểu *bản thân model* mà bạn đang serve.

**🏋️ Bài tập:**
- Train (hoặc tải sẵn) một model phân loại đơn giản (vd sentiment), wrap thành `POST /predict` với Pydantic + load qua `lifespan`.
- Làm endpoint `/chat` **streaming** gọi một LLM (API có sẵn) và trả token dần.
- Biến một inference "nặng" thành async job (Celery) trả `202` + `job_id`, thêm `GET /jobs/{id}`.

**Checklist:**
- [ ] Load model một lần qua `lifespan`, không load mỗi request.
- [ ] Phân biệt CPU-bound (`def`) vs I/O-bound (`async def`) trong serving.
- [ ] Cài đặt được streaming response cho LLM.
- [ ] Thiết kế luồng async job cho inference nặng.

---

## 🛠️ Project thực hành

> Triết lý: **xây MỘT project xuyên suốt**, lớn dần qua các module — đó là cách kiến thức kết dính và là thứ đẹp nhất trong CV.

### Project chính — "Task Manager API" production-ready
Một REST API quản lý công việc (users + projects + tasks), nâng cấp dần:

1. **(M1–4)** CRUD đầy đủ bằng FastAPI + Pydantic, lưu Postgres qua SQLAlchemy, migration bằng Alembic, có `/docs`.
2. **(M5)** Auth: đăng ký/đăng nhập JWT, hash bcrypt, RBAC (user thường chỉ thấy task của mình; admin thấy tất cả).
3. **(M6)** Refactor sang layered architecture (controller–service–repository), config qua Pydantic Settings + `.env`.
4. **(M7)** Bộ test pytest: unit cho service, integration cho route + DB test, có coverage.
5. **(M8)** Thêm Redis cache cho endpoint đọc nhiều, rate limiting, cursor pagination, gửi email nhắc deadline qua Celery.
6. **(M9)** Dockerize + `docker compose` (API + Postgres + Redis), GitHub Actions chạy test, deploy lên Render/Railway sau Nginx (HTTPS).

### Bonus — "ML Model API" (nối sang mảng 07)
Tách một service FastAPI riêng:
- `POST /predict`: phân loại text (model sentiment/spam), load qua `lifespan`.
- `POST /chat`: gọi một LLM với **streaming response**.
- Có auth bằng **API key**, **rate limit** (vì gọi model tốn tài nguyên/tiền), logging, và **Dockerfile** riêng.
- *Mở rộng:* nối với **vector DB (pgvector)** từ [mảng 04](04-database.md) để làm một endpoint **RAG** hoàn chỉnh.

> Đẩy cả hai lên GitHub với README, ảnh demo Swagger, và link deploy. Đây là portfolio "biết build sản phẩm AI thật", không phải "biết train model trong notebook".

---

## ⚠️ Lỗi & hiểu lầm thường gặp

- **Trả `200` cho mọi thứ** (kể cả lỗi) với `{"error": ...}` trong body. → Dùng status code đúng ngữ nghĩa.
- **Lộ field nhạy cảm** (password hash, token) vì không tách `response_model`. → Luôn có model output riêng.
- **Hardcode secret / commit `.env`.** → Biến môi trường + `.gitignore` + `.env.example`.
- **Lưu mật khẩu thô hoặc hash bằng MD5/SHA-256 không salt.** → bcrypt/argon2.
- **Nhét dữ liệu bí mật vào payload JWT** vì tưởng nó "mã hóa". → JWT chỉ *ký*, payload ai cũng đọc được.
- **Dùng `async def` cho route nhưng gọi thư viện blocking bên trong** (vd `time.sleep`, driver DB sync) → chặn cả event loop, tệ hơn cả sync. → Hiểu rõ async vs sync.
- **Nối chuỗi vào SQL** → SQL injection. → ORM/parameterized query.
- **Không test, hoặc test chạm DB thật của dev** → flaky, chậm. → DB test riêng + mock ranh giới.
- **Load model trong mỗi request** → chậm kinh khủng. → Load một lần qua `lifespan`.
- **Bắt client chờ inference nặng qua HTTP** → timeout. → Async job + queue.
- **Over-engineer kiến trúc** (clean architecture đầy đủ cho CRUD nhỏ) → phức tạp vô ích. → Bắt đầu layered 3 tầng.
- **Nhảy thẳng AWS khi mới học deploy.** → Bắt đầu Render/Railway, lên AWS/GCP khi thực sự cần.

---

## ✅ Checklist tự đánh giá tổng

**Nền tảng web & API:**
- [ ] Giải thích trọn vẹn vòng đời một request (DNS → TCP → TLS → HTTP → response).
- [ ] Dùng đúng HTTP method, status code, header; hiểu idempotency.
- [ ] Thiết kế REST API sạch; biết khi nào chọn GraphQL/gRPC.

**Xây dựng API (FastAPI):**
- [ ] Tự dựng API CRUD có validation (Pydantic), DI, async, error handling.
- [ ] Kết nối DB qua SQLAlchemy + migration Alembic.
- [ ] Tổ chức code theo layered architecture, config qua env.

**Bảo mật:**
- [ ] Cài auth JWT + OAuth2 + bcrypt + RBAC.
- [ ] Biết và phòng được SQLi, XSS, CSRF và các mục OWASP Top 10 cốt lõi.

**Chất lượng & vận hành:**
- [ ] Viết unit + integration test (pytest), đọc coverage.
- [ ] Cài caching (Redis), rate limiting, pagination, background task (Celery).
- [ ] Có logging có cấu trúc + health check.

**Triển khai:**
- [ ] Dockerize + `docker compose` + CI/CD + deploy cloud sau Nginx/HTTPS.

**AI serving:**
- [ ] Wrap model thành REST API, load qua `lifespan`, làm streaming, xử lý job nặng.

> Tick được phần lớn checklist này = bạn *thực sự* là một backend engineer biết đưa AI ra production — không chỉ học vẹt.

---

## 🔗 Học gì tiếp theo

- **[Mảng 06 — System Design](06-system-design.md):** API của bạn giờ chạy ổn cho 1 server. System Design dạy *scale* nó cho hàng triệu user: load balancer, replication, sharding, message queue, CDN, caching nhiều tầng, CAP theorem. Đây là bước trưởng thành từ "code API" sang "thiết kế hệ thống" — và là phần lớn phỏng vấn senior.
- **[Mảng 07 — AI / ML](07-ai-ml.md):** giờ bạn đã biết *cách serve* model, hãy đào sâu *bản thân model*: toán nền → ML → DL → NLP → Transformer → LLM Engineering → **RAG** (dùng vector DB từ mảng 04) → **Agents** → **MLOps**. Module 10 ở đây chính là chiếc cầu: mọi thứ bạn học ở mảng 07 cuối cùng sẽ được "đóng gói" bằng đúng kỹ năng backend này.
- **Học song song:** mảng 05 và 06 bổ trợ nhau; có thể bắt đầu đọc System Design ngay khi project chính của bạn cần chịu tải hơn.

> 🧠 Đánh dấu tiến độ ngay trên bản đồ học tập sau mỗi module. Chúc bạn build được sản phẩm thật! 🚀
