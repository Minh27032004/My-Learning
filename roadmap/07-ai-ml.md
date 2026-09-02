# 07 — AI / Machine Learning: Lộ trình học toàn diện (từ nền tảng đến hệ thống)

> Đây là **mảng quan trọng nhất** trong định hướng của bạn (AI/ML Engineer + Backend). Cũng vì thế nó là file **dài nhất** và được viết **sâu nhất**. Hãy đọc kỹ phần triết lý dưới đây trước khi lao vào học — nó quyết định bạn sẽ thành một kỹ sư hiểu bản chất hay chỉ là người "gọi API và cầu nguyện".

## 🧭 Triết lý: "Từ nền tảng đến hệ thống" — và vì sao KHÔNG nên nhảy thẳng vào LLM

Năm 2026, ai cũng có thể gọi API của Claude hay GPT trong 5 dòng code và làm ra một chatbot. Điều đó tạo ra một **cái bẫy ngọt ngào**: rất nhiều người mới nhảy thẳng vào "LLM engineering", học vài prompt, ghép LangChain, và tưởng mình là AI Engineer. Nhưng khi hệ thống chạy production và bắt đầu sai — RAG trả lời lạc đề, model hallucination, latency cao, chi phí token đốt tiền, fine-tune không cải thiện gì — họ **không biết vì sao**, vì họ thiếu nền móng.

Một AI/ML Engineer thực thụ khác "người ghép API" ở chỗ: khi mọi thứ vỡ, họ hiểu **cơ chế bên dưới** đủ để chẩn đoán. Họ biết vì sao embedding cosine similarity hoạt động (vì hiểu vector, dot product). Họ biết vì sao learning rate quá cao làm loss "nổ" (vì hiểu gradient descent). Họ biết khi nào fine-tune vô nghĩa và nên dùng RAG (vì hiểu phân biệt "kiến thức" vs "hành vi" của model).

Vì vậy lộ trình này đi **theo đúng thứ tự lịch sử và logic của ngành**:

```
Python + Toán  →  ML cổ điển  →  Deep Learning  →  NLP & Transformer  →  LLM Engineering  →  RAG  →  Agents  →  Fine-tuning  →  MLOps
   (nền tảng)      (trực giác)     (mạng nơ-ron)     (cầu nối tới LLM)      (hiện đại)       (ứng dụng)  (tự chủ)   (tối ưu)    (hệ thống)
```

Bạn **không cần học hết mọi thứ trước khi chạm vào LLM** — đó là hiểu lầm ngược lại. Cái bạn cần là **đủ nền móng để không bị mù**. Cụ thể: bạn nên có thể tự code một mạng nơ-ron nhỏ và hiểu attention hoạt động ra sao *trước khi* xây hệ thống RAG/Agent nghiêm túc. Lộ trình này thiết kế để bạn đạt điều đó nhanh nhất có thể mà không bỏ qua nền tảng.

> **Lưu ý phản biện:** Nếu mục tiêu trước mắt của bạn chỉ là *làm sản phẩm AI app nhanh* (ví dụ một startup cần MVP chatbot tuần sau), bạn **có thể** học Giai đoạn 0 + 5 + 6 trước, rồi quay lại lấp nền móng (1–4) sau. Đây là con đường "application engineer" hợp lệ. Nhưng nếu muốn trở thành **ML Engineer thực sự** (train/fine-tune/tối ưu model, không chỉ gọi API), thì nền móng 1–4 là **bắt buộc, không thể bỏ**. File này viết theo con đường đầy đủ.

---

## 🎯 Mục tiêu tổng

Sau toàn bộ lộ trình, bạn có thể:

- Viết Python thành thạo cho data/AI: NumPy vectorization, Pandas, visualization, code sạch và có type hints.
- Nắm **trực giác toán** nền tảng (đại số tuyến tính, giải tích, xác suất-thống kê) đủ để hiểu mọi thuật toán ML/DL — không học vẹt công thức.
- Hiểu và áp dụng **ML cổ điển**: chọn đúng thuật toán, đánh giá đúng metric, tránh overfitting, làm pipeline end-to-end với scikit-learn.
- Hiểu và tự xây **mạng nơ-ron** bằng PyTorch: viết training loop, dùng GPU, hiểu backprop, regularization; nắm CNN/RNN/Transformer.
- Hiểu sâu **Transformer & LLM**: self-attention, pretraining, fine-tuning, RLHF, tokens, context window — đọc hiểu paper, tự build GPT nhỏ.
- Làm chủ **LLM Engineering 2026**: API Claude/GPT/Gemini/open models, tool calling, structured output, prompt & **context engineering**, multi-LLM orchestration.
- Xây hệ thống **RAG** chất lượng production: chunking, embedding, hybrid search, reranking, đánh giá; biết GraphRAG và agentic RAG.
- Xây **AI Agents**: ReAct, planning, memory, tool use, multi-agent; dùng LangGraph/CrewAI/Claude Agent SDK + MCP.
- **Fine-tune** model với LoRA/QLoRA, hiểu quantization/distillation, và biết **khi nào KHÔNG nên** fine-tune.
- Vận hành **MLOps/LLMOps**: experiment tracking, versioning, serving (FastAPI/vLLM), monitoring drift, tối ưu chi phí/latency — và **thiết kế hệ thống AI end-to-end**.

## 🧱 Yêu cầu trước (prerequisites)

| Mảng | Vì sao cần | Mức tối thiểu |
|------|-----------|---------------|
| **[01 — Python](01-nen-tang-cs.md)** | Toàn bộ AI/ML viết bằng Python | Hàm, OOP cơ bản, đọc/ghi file, cài package |
| **[02 — Giải thuật & CTDL](02-giai-thuat-ctdl.md)** | Tư duy độ phức tạp (Big-O), cấu trúc dữ liệu cho data pipeline | Hiểu list/dict/set, đệ quy, Big-O cơ bản |
| **[04 — Database](04-database.md)** | Data pipeline & đặc biệt **Vector Database** cho RAG | SQL cơ bản, đã đọc Module vector DB (pgvector) |
| **[05 — Backend](05-backend-web.md)** *(học song song / sau)* | Để **serve** model qua API thật | Có thể học sau Giai đoạn 3 |
| **[06 — System Design](06-system-design.md)** *(học sau)* | Thiết kế hệ thống AI quy mô lớn | Học cùng Giai đoạn 9 |

> Bạn **không cần giỏi toán từ trước**. Giai đoạn 1 sẽ xây toán từ trực giác. Nhưng bạn **cần thoải mái với Python**, vì đó là công cụ làm việc hằng ngày.

## ⏱️ Ước lượng thời gian

Mảng này **dài** — đừng kỳ vọng xong trong vài tháng. Đây là hành trình **1–2 năm** để vững vàng. Ước lượng theo cam kết ~12–15h/tuần:

| Giai đoạn | Nội dung | Thời lượng | Ghi chú |
|-----------|----------|-----------|---------|
| **0** | Python cho AI + thư viện nền tảng | 2–3 tuần | Có thể rút ngắn nếu đã quen Python |
| **1** | Toán nền tảng (trực giác) | 3–4 tuần | Học song song, không cần "xong" mới đi tiếp |
| **2** | ML cổ điển | 6–8 tuần | Nền tảng tư duy quan trọng nhất |
| **3** | Deep Learning | 8–10 tuần | PyTorch + CNN/RNN |
| **4** | NLP & Transformer | 4–6 tuần | Cầu nối tới LLM, build GPT nhỏ |
| **5** | LLM Engineering | 4–6 tuần | Bắt đầu phần "hiện đại" |
| **6** | RAG & Vector DB | 3–4 tuần | Ứng dụng giá trị cao nhất hiện nay |
| **7** | AI Agents | 4–5 tuần | Xu hướng nóng 2026 |
| **8** | Fine-tuning & tối ưu | 3–4 tuần | Chuyên sâu, cần GPU |
| **9** | MLOps & System Design AI | 5–6 tuần | Biến "demo" thành "sản phẩm" |

**Tổng cộng nền tảng đủ dùng (0–6): ~7–9 tháng.** Vững vàng toàn bộ (0–9): **~12–18 tháng** học đều đặn. Đừng vội — sâu hơn rộng.

---

## 🗺️ Sơ đồ đường đi tổng quan

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PHẦN A — NỀN TẢNG (bắt buộc, đừng bỏ)                                    │
│                                                                            │
│  [0] Python + NumPy/Pandas ──┐                                            │
│                               ├──► [2] ML cổ điển ──► [3] Deep Learning   │
│  [1] Toán (trực giác) ───────┘         (sklearn)        (PyTorch)         │
│                                                            │               │
│                                                            ▼               │
│                                          [4] NLP & Transformer            │
│                                          (attention, BERT/GPT, nanoGPT)   │
└──────────────────────────────────────────────────────────┬───────────────┘
                                                             │
┌────────────────────────────────────────────────────────── ▼ ─────────────┐
│  PHẦN B — AI HIỆN ĐẠI (LLM era 2026)                                      │
│                                                                            │
│  [5] LLM Engineering ──► [6] RAG & Vector DB ──► [7] AI Agents            │
│  (API, prompt,            (embedding, hybrid       (ReAct, LangGraph,     │
│   tool calling)            search, rerank)          MCP, multi-agent)     │
│         │                        │                       │                │
│         └────────────┬───────────┴───────────────────────┘                │
│                      ▼                                                      │
│        [8] Fine-tuning (LoRA/QLoRA) ──► [9] MLOps & System Design AI      │
│        (khi prompt/RAG không đủ)         (serve, monitor, scale, cost)    │
└────────────────────────────────────────────────────────────────────────────┘

Quy tắc vàng: KHÔNG nhảy sang PHẦN B mà chưa hiểu attention ở [4].
              KHÔNG fine-tune ở [8] khi chưa thử prompt + RAG.
```

---

# 📦 GIAI ĐOẠN 0 — Công cụ & Python cho AI

> **Mục tiêu:** Trang bị "bộ đồ nghề" để mọi giai đoạn sau diễn ra trơn tru. Đây là phần *bạn dùng mỗi ngày* — đầu tư kỹ sẽ tiết kiệm hàng trăm giờ về sau.

## Module 0.1 — Python nâng cao cho data/AI

**Lý thuyết cốt lõi (trực giác trước):**

- **List/dict/set comprehension:** cách viết "Pythonic" để biến đổi dữ liệu trong 1 dòng. Thay vì vòng `for` dài, `[x**2 for x in nums if x > 0]`. Quan trọng vì code xử lý data đọc gọn hơn và thường nhanh hơn.
- **Generator & `yield`:** sinh dữ liệu *lười* (lazy) — chỉ tạo phần tử khi cần, không nạp hết vào RAM. Cực kỳ quan trọng khi xử lý dataset lớn (vài GB) không vừa bộ nhớ. Đây là nền của khái niệm "data streaming" trong training.
- **Decorator:** hàm bọc hàm khác để thêm hành vi (đo thời gian, cache, log). Bạn sẽ gặp liên tục: `@torch.no_grad()`, `@app.get(...)`, `@cache`. Hiểu để không "thấy mà sợ".
- **OOP:** class, kế thừa, `__init__`, `__call__`. PyTorch model là một class kế thừa `nn.Module`; hiểu OOP là điều kiện để đọc code DL.
- **Type hints:** `def f(x: int) -> list[str]:`. Không bắt buộc chạy nhưng giúp code rõ ràng, IDE gợi ý tốt, và là chuẩn trong codebase chuyên nghiệp.
- **Môi trường & package:** **virtual env** cô lập dependency mỗi project (tránh "xung đột phiên bản địa ngục"). Công cụ: `venv`/`pip` (chuẩn), `conda` (phổ biến trong khoa học dữ liệu, quản cả non-Python), và **`uv`** (2026 — trình quản lý cực nhanh viết bằng Rust, đang dần thay pip/poetry trong nhiều dự án mới).

**Khi nào dùng gì:** `conda` khi cần CUDA/thư viện khoa học phức tạp; `uv` cho dự án Python thuần muốn tốc độ; `venv+pip` là mặc định an toàn nếu mới bắt đầu.

**📚 Tài nguyên:**
- *"Python for Data Analysis"* (Wes McKinney — tác giả Pandas) — chương đầu về Python/NumPy.
- Real Python (realpython.com) — các bài về decorator, generator, OOP.
- Corey Schafer (YouTube) — series Python OOP & decorators rất rõ.

**🏋️ Bài tập:**
- [ ] Viết lại 5 vòng `for` thành comprehension.
- [ ] Viết một generator đọc file CSV lớn từng dòng (không dùng Pandas).
- [ ] Viết decorator `@timer` đo thời gian chạy một hàm.
- [ ] Tạo virtual env cho project AI đầu tiên bằng cả `venv` và `uv`, so sánh tốc độ cài.

## Module 0.2 — Thư viện nền tảng

**Lý thuyết cốt lõi:**

- **NumPy:** thư viện tính toán số nền tảng. Khái niệm cốt lõi:
  - **`ndarray`** — mảng n-chiều, lưu liền khối trong bộ nhớ → nhanh hơn list Python hàng chục lần.
  - **Vectorization** — thay vòng lặp bằng phép toán trên cả mảng (`a + b` thay vì lặp từng phần tử). *Trực giác:* phép toán chạy ở tầng C/SIMD, không phải interpreter Python. **Đây là tư duy nền của cả ML/DL** — tensor trong PyTorch chính là "NumPy có GPU + autograd".
  - **Broadcasting** — quy tắc tự "kéo dãn" mảng kích thước khác nhau để tính được với nhau (vd cộng vector vào từng hàng ma trận). Hiểu broadcasting là chìa khóa đọc code DL mà không hoảng vì lỗi shape.
- **Pandas:** thao tác dữ liệu dạng bảng (`DataFrame`). Lọc, nhóm (`groupby`), gộp (`merge/join` — giống SQL), xử lý missing value, đọc/ghi CSV/Parquet. 80% thời gian dự án ML thực tế là làm sạch dữ liệu bằng Pandas.
- **Matplotlib/Seaborn:** trực quan hóa. *Trực giác quan trọng:* "vẽ data ra trước khi model hóa" — phát hiện outlier, phân phối lệch, tương quan. Seaborn = Matplotlib gói đẹp hơn cho thống kê.
- **Jupyter Notebook:** môi trường chạy code theo cell, thấy kết quả ngay — lý tưởng để thử nghiệm/khám phá. Lưu ý: notebook tốt cho *khám phá*, nhưng code production nên đưa vào file `.py`.

**📚 Tài nguyên:**
- NumPy official "Absolute Beginner's Guide".
- Kaggle Learn — *Pandas* (miễn phí, làm tay ngay).
- *"Python Data Science Handbook"* (Jake VanderPlas) — miễn phí online, phần NumPy/Pandas/Matplotlib.

**🏋️ Bài tập & mini-project:**
- [ ] NumPy: tính tích vô hướng, nhân ma trận, chuẩn hóa cột — **không dùng vòng `for`**.
- [ ] Pandas: tải dataset Titanic, tính tỉ lệ sống sót theo giới tính/hạng vé, xử lý missing age.
- [ ] Vẽ histogram + heatmap tương quan của một dataset bất kỳ.
- [ ] **Mini-project EDA:** chọn 1 dataset Kaggle, viết notebook khám phá hoàn chỉnh (5–10 biểu đồ + nhận xét).

**✅ Checklist Giai đoạn 0:**
- [ ] Tự tin viết code Python sạch (comprehension, OOP, type hints).
- [ ] Hiểu vectorization & broadcasting, viết được code NumPy không dùng `for`.
- [ ] Làm chủ Pandas cho data wrangling cơ bản.
- [ ] Quản lý môi trường ảo thành thạo.

---

# 📦 GIAI ĐOẠN 1 — Toán nền tảng cho ML (trực giác, không hàn lâm)

> **Mục tiêu:** Hiểu *trực giác* đủ để không bao giờ "mù" khi đọc thuật toán. **Đừng** sa đà chứng minh định lý. Quy tắc: học toán **đúng lúc cần** — gặp khái niệm nào trong ML thì quay lại đào sâu khái niệm đó. Có thể học song song với Giai đoạn 2.

## Module 1.1 — Đại số tuyến tính

**Trực giác cốt lõi (vì sao quan trọng cho ML/DL):** Mọi dữ liệu trong ML đều là **vector và ma trận**. Một ảnh = ma trận pixel. Một câu = chuỗi vector embedding. Một mạng nơ-ron = chuỗi phép **nhân ma trận**. Hiểu đại số tuyến tính = hiểu "data và model thực ra là gì".

- **Vector:** danh sách số, biểu diễn một điểm/hướng trong không gian nhiều chiều. *Embedding* (cốt lõi của LLM/RAG) chính là vector — "ý nghĩa" được mã hóa thành tọa độ.
- **Dot product (tích vô hướng):** đo độ "cùng hướng" của hai vector. **Đây chính là nền của cosine similarity** trong vector search/RAG. Hai văn bản gần nghĩa → embedding cùng hướng → dot product/cosine cao.
- **Ma trận & nhân ma trận:** một phép biến đổi không gian. Một layer của neural network = `output = activation(W·x + b)` — bản chất là nhân ma trận. Hiểu shape `(m×n)·(n×p)=(m×p)` để không bao giờ bị lỗi dimension mismatch.
- **Eigenvalue/eigenvector:** hướng mà phép biến đổi chỉ "kéo dãn" chứ không "xoay". Nền của **PCA** (giảm chiều dữ liệu) và hiểu sâu về ma trận hiệp phương sai.

**📚 Tài nguyên:**
- **3Blue1Brown — *Essence of Linear Algebra*** (YouTube). **Bắt buộc xem.** Đây là tài nguyên trực quan tốt nhất từng có cho đại số tuyến tính — xem trước khi đụng công thức.
- Khan Academy — Linear Algebra (luyện tay).

## Module 1.2 — Giải tích

**Trực giác cốt lõi:** Học máy = **tối ưu hóa** = "đi xuống dốc để tìm điểm thấp nhất của hàm loss". Giải tích là công cụ tìm dốc.

- **Đạo hàm:** độ dốc của hàm tại một điểm — "tăng đầu vào một chút thì đầu ra đổi bao nhiêu".
- **Gradient:** đạo hàm trong nhiều chiều — vector chỉ hướng tăng nhanh nhất. **Gradient descent** đi *ngược* gradient để giảm loss. Đây là cơ chế *học* của gần như mọi model ML/DL.
- **Chain rule (quy tắc dây chuyền):** đạo hàm của hàm hợp. **Đây chính là backpropagation** — cách mạng nơ-ron lan truyền lỗi ngược qua các layer để cập nhật trọng số. Không hiểu chain rule = không hiểu vì sao DL học được.

**📚 Tài nguyên:**
- **3Blue1Brown — *Essence of Calculus*** (YouTube). Cũng bắt buộc.
- Khan Academy — Calculus (đạo hàm, đạo hàm riêng, chain rule).

## Module 1.3 — Xác suất & Thống kê

**Trực giác cốt lõi:** ML là "ra quyết định dưới sự bất định". Model không nói "chắc chắn", nó nói "xác suất". Hiểu xác suất = hiểu output của model thực sự nghĩa gì.

- **Phân phối (distribution):** normal/Gaussian, Bernoulli, ... — mô tả "dữ liệu phân bố thế nào".
- **Kỳ vọng & phương sai:** trung bình và độ "tản" — nền của bias-variance tradeoff.
- **Định lý Bayes:** cập nhật niềm tin khi có bằng chứng mới. Nền của Naive Bayes và tư duy xác suất nói chung.
- **Maximum Likelihood Estimation (MLE):** "chọn tham số khiến dữ liệu quan sát được trở nên *khả dĩ nhất*". Đây là nguyên lý đứng sau việc *train* hầu hết model (cross-entropy loss chính là negative log-likelihood).

**📚 Tài nguyên:**
- Sách ***"Mathematics for Machine Learning"*** (Deisenroth, Faisal, Ong) — miễn phí PDF online. Gói gọn cả 3 mảng toán đúng mức cần cho ML.
- StatQuest with Josh Starmer (YouTube) — giải thích thống kê/ML cực dễ hiểu, "BAM!".
- Khan Academy — Statistics & Probability.

**🏋️ Bài tập Giai đoạn 1:**
- [ ] Code gradient descent từ đầu (chỉ NumPy) để tìm cực tiểu của `f(x)=x²`.
- [ ] Tính cosine similarity giữa 2 vector và giải thích nó liên hệ dot product thế nào.
- [ ] Vẽ phân phối normal và minh họa luật số lớn bằng mô phỏng.
- [ ] Tự suy lại bằng tay: vì sao chain rule cho phép tính gradient qua nhiều layer.

**✅ Checklist Giai đoạn 1:**
- [ ] Hiểu vector/ma trận/nhân ma trận và liên hệ tới neural network.
- [ ] Giải thích được gradient descent & backprop *bằng lời*.
- [ ] Hiểu dot product ↔ cosine similarity ↔ embedding.
- [ ] Nắm Bayes, MLE, bias-variance ở mức trực giác.

> **Phản biện:** Bạn KHÔNG cần "xong" Giai đoạn 1 mới đi tiếp. Nhiều người kẹt ở đây hàng tháng vì cầu toàn. Hãy xem hết 3Blue1Brown (2 series), nắm trực giác, rồi **đi tiếp** — quay lại đào sâu khi gặp khái niệm trong Giai đoạn 2–4.

---

# 📦 GIAI ĐOẠN 2 — Machine Learning cổ điển

> **Mục tiêu:** Xây **tư duy ML** đúng đắn. Đây là giai đoạn quan trọng nhất cho nền tảng tư duy — nhiều khái niệm (overfitting, train/test split, metrics) áp dụng cho *cả* deep learning và LLM. Bỏ qua giai đoạn này là lý do số 1 khiến người ta "biết gọi model nhưng không biết đánh giá nó".

## Module 2.1 — Khái niệm & quy trình ML

**Lý thuyết cốt lõi:**

- **3 loại học máy:**
  - **Supervised** (có nhãn): học từ cặp (input, output). VD dự đoán giá nhà, phân loại email spam. Phổ biến nhất.
  - **Unsupervised** (không nhãn): tìm cấu trúc ẩn. VD phân cụm khách hàng (clustering), giảm chiều (PCA).
  - **Reinforcement Learning** (học tăng cường): agent học qua thưởng/phạt khi tương tác môi trường. Nền của RLHF trong LLM.
- **Train/Validation/Test split:** chia dữ liệu để *huấn luyện*, *tinh chỉnh siêu tham số*, và *đánh giá khách quan*. **Sai lầm chết người:** đánh giá trên dữ liệu đã train → ảo tưởng model giỏi (data leakage).
- **Overfitting vs Underfitting:** *Overfit* = học thuộc lòng cả nhiễu, giỏi trên train kém trên test. *Underfit* = model quá đơn giản, dở ở mọi nơi. **Bias-variance tradeoff** là khung tư duy cân bằng hai cái này.
- **Cross-validation (k-fold):** đánh giá ổn định hơn bằng cách chia dữ liệu nhiều lần.
- **Feature engineering:** biến dữ liệu thô thành đặc trưng model học tốt. *Trực giác:* "đôi khi một feature tốt giá trị hơn một model phức tạp". (Lưu ý: DL tự học feature, nhưng ML cổ điển vẫn phụ thuộc nặng vào bước này.)
- **Metrics — chọn đúng thước đo:**
  - Phân loại: **accuracy** (cẩn thận với dữ liệu mất cân bằng), **precision** (trong số dự đoán dương, đúng bao nhiêu), **recall** (trong số thực dương, bắt được bao nhiêu), **F1** (cân bằng precision/recall), **ROC-AUC**.
  - Hồi quy: **MSE/RMSE**, **MAE**, **R²**.
  - *Trực giác chọn metric:* chẩn đoán ung thư ưu tiên **recall** (đừng bỏ sót bệnh nhân); lọc spam ưu tiên **precision** (đừng chặn nhầm mail quan trọng).

## Module 2.2 — Các thuật toán cốt lõi

**Lý thuyết cốt lõi (trực giác + khi nào dùng):**

- **Linear Regression:** vẽ đường thẳng hợp dữ liệu nhất (tối thiểu MSE). Nền tảng nhất, dạy bạn ý tưởng "fit hàm".
- **Logistic Regression:** dù tên "regression" nhưng dùng để **phân loại** — đẩy đầu ra qua sigmoid thành xác suất. Baseline cực mạnh, luôn nên thử đầu tiên.
- **Decision Tree:** chuỗi câu hỏi if/else học từ dữ liệu. Dễ diễn giải nhưng dễ overfit.
- **Random Forest:** "rừng" nhiều cây bỏ phiếu — giảm overfit, mạnh và ổn định. Lựa chọn an toàn cho dữ liệu bảng.
- **Gradient Boosting (XGBoost / LightGBM / CatBoost):** xây cây tuần tự, mỗi cây sửa lỗi cây trước. **Vua của dữ liệu bảng (tabular) — thắng phần lớn Kaggle competition không phải ảnh/text.** Nếu data là bảng, hãy thử cái này trước cả deep learning.
- **SVM:** tìm "siêu phẳng" tách lớp với lề lớn nhất. Mạnh với dữ liệu chiều cao, ít mẫu.
- **KNN:** "giống ai thì gán nhãn theo người đó" — đơn giản, không train, nhưng chậm khi data lớn.
- **Naive Bayes:** áp Bayes với giả định "ngây thơ" các feature độc lập. Nhanh, tốt cho phân loại văn bản.
- **K-Means:** phân cụm không giám sát — gom điểm gần nhau thành k nhóm.
- **PCA:** giảm chiều giữ phương sai lớn nhất — nén dữ liệu, trực quan hóa, khử nhiễu.

**Khi nào dùng gì (tóm tắt):** Dữ liệu **bảng** → bắt đầu với Logistic Regression (baseline) rồi **XGBoost/LightGBM**. Dữ liệu **ảnh/âm thanh/text dài** → cần deep learning (Giai đoạn 3+). Cần **diễn giải** → tree đơn/linear. Cần **phân cụm/khám phá** → K-Means/PCA.

## Module 2.3 — Công cụ & quy trình end-to-end

- **scikit-learn:** thư viện ML cổ điển chuẩn. API nhất quán: `.fit()`, `.predict()`, `.transform()`. Học `Pipeline` để gộp tiền xử lý + model, tránh data leakage.
- **Quy trình ML end-to-end:** xác định bài toán → thu thập/làm sạch dữ liệu → EDA → feature engineering → chia train/val/test → chọn & train model → tinh chỉnh (GridSearch/Optuna) → đánh giá → triển khai.

**📚 Tài nguyên:**
- **Andrew Ng — *Machine Learning Specialization*** (Coursera, bản mới với Python). **Điểm khởi đầu kinh điển** cho trực giác ML.
- **Aurélien Géron — *"Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow"*** (3rd ed). Sách gối đầu giường — phần 1 cho ML cổ điển. **Cực kỳ khuyến nghị.**
- **Kaggle** — thi đấu thật, học từ notebook công khai của người khác. Bắt đầu với Titanic, House Prices.
- StatQuest (YouTube) — giải thích từng thuật toán bằng hình.

**🏋️ Bài tập & project:**
- [ ] Toàn bộ Module 1–9 của Andrew Ng Specialization + làm lab.
- [ ] **Project: Dự đoán giá nhà** (House Prices, Kaggle) — pipeline đầy đủ: EDA → feature engineering → so sánh Linear/RandomForest/XGBoost → đánh giá RMSE → nộp Kaggle.
- [ ] Code Linear Regression + Logistic Regression từ đầu bằng NumPy (không sklearn) để hiểu cơ chế.
- [ ] Thực hành cross-validation & tuning siêu tham số với GridSearchCV.

**✅ Checklist Giai đoạn 2:**
- [ ] Giải thích được overfitting/underfitting & bias-variance tradeoff.
- [ ] Chọn đúng metric cho từng loại bài toán & biết vì sao.
- [ ] Biết khi nào dùng thuật toán nào (đặc biệt: tabular → boosting).
- [ ] Xây pipeline scikit-learn hoàn chỉnh không rò rỉ dữ liệu.
- [ ] Hoàn thành ít nhất 1 project Kaggle end-to-end.

---

# 📦 GIAI ĐOẠN 3 — Deep Learning

> **Mục tiêu:** Hiểu và tự xây mạng nơ-ron bằng **PyTorch**. Đây là nền tảng *trực tiếp* dẫn tới Transformer và LLM. Sau giai đoạn này bạn phải tự viết được một training loop và hiểu mọi dòng trong đó.

## Module 3.1 — Neural Network cơ bản

**Trực giác cốt lõi:** Một neural network là một **hàm số rất linh hoạt** học cách ánh xạ input → output bằng cách điều chỉnh trọng số qua gradient descent. "Deep" = nhiều layer xếp chồng, mỗi layer học đặc trưng trừu tượng hơn.

- **Neuron & Layer:** neuron = `output = activation(Σ wᵢxᵢ + b)`. Layer = nhiều neuron song song. Mạng = nhiều layer nối tiếp.
- **Activation functions:** thêm tính **phi tuyến** (không có nó, mạng sâu chỉ tương đương 1 layer tuyến tính). **ReLU** (mặc định, đơn giản, hiệu quả), Sigmoid/Tanh (cũ, hay bão hòa gradient), **GELU/SwiGLU** (dùng trong Transformer hiện đại).
- **Forward pass:** đẩy dữ liệu qua mạng để ra dự đoán.
- **Loss function:** đo sai số. Cross-entropy (phân loại), MSE (hồi quy).
- **Backpropagation:** dùng chain rule (Giai đoạn 1!) lan truyền gradient ngược để biết mỗi trọng số "góp" bao nhiêu vào lỗi.
- **Gradient descent & optimizer:** **SGD** (cơ bản), **Adam/AdamW** (mặc định hiện đại — thích nghi learning rate, dùng cho hầu hết DL/LLM).
- **Learning rate:** "bước nhảy" khi đi xuống dốc. Quá lớn → loss nổ/dao động; quá nhỏ → học rất chậm. Siêu tham số quan trọng nhất.
- **Batch & Epoch:** *batch* = nhóm mẫu xử lý cùng lúc (GPU thích batch lớn); *epoch* = một lượt quét hết dữ liệu.
- **Regularization:** chống overfit — **Dropout** (ngẫu nhiên "tắt" neuron khi train), **Batch Normalization** (chuẩn hóa đầu vào layer, ổn định & tăng tốc training), weight decay, early stopping.

## Module 3.2 — Các kiến trúc cốt lõi

- **CNN (Convolutional Neural Network):** chuyên cho **ảnh/dữ liệu lưới**. Trực giác: "bộ lọc trượt" phát hiện đặc trưng cục bộ (cạnh → hình → vật thể). Nền của computer vision.
- **RNN / LSTM / GRU:** chuyên cho **chuỗi** (text, time-series) — có "bộ nhớ" trạng thái. LSTM/GRU giải quyết vấn đề "quên" của RNN thuần (vanishing gradient). *Lưu ý lịch sử:* đây là tiền thân của Transformer; Transformer ra đời để khắc phục điểm yếu "không song song hóa được" của RNN.
- **Autoencoder:** học nén dữ liệu thành biểu diễn cô đọng (latent) rồi tái tạo — nền của giảm chiều, khử nhiễu, và tư duy "embedding".
- **Embedding:** ánh xạ đối tượng rời rạc (từ, sản phẩm) thành vector dày đặc có ý nghĩa. **Khái niệm cầu nối tới NLP/LLM/RAG** — hãy nắm thật chắc.

## Module 3.3 — Framework: PyTorch (ưu tiên) & TensorFlow/Keras

**Vì sao PyTorch trước:** Là **chuẩn de facto của nghiên cứu lẫn công nghiệp 2026**. Pythonic, dễ debug (define-by-run), hệ sinh thái LLM (HuggingFace, vLLM) đều xoay quanh PyTorch. TensorFlow/Keras vẫn dùng nhiều trong production cũ và mobile (TF Lite) — nên biết nhưng học sau.

- **Tensor:** "NumPy array có GPU + autograd". Hiểu `.to(device)`, `dtype`, `shape`.
- **Autograd:** PyTorch tự tính gradient (`loss.backward()`) — bạn không cần code backprop tay (nhưng phải *hiểu* nó).
- **Training loop:** xương sống bạn sẽ viết hàng trăm lần:
  ```
  for epoch in range(epochs):
      for X, y in dataloader:
          optimizer.zero_grad()        # xóa gradient cũ
          pred = model(X)              # forward
          loss = loss_fn(pred, y)      # tính loss
          loss.backward()             # backprop
          optimizer.step()            # cập nhật trọng số
  ```
- **GPU:** vì sao DL cần GPU (song song hóa nhân ma trận khổng lồ). Dùng **Google Colab** (GPU miễn phí) nếu chưa có máy mạnh.

**📚 Tài nguyên:**
- **Andrew Ng — *Deep Learning Specialization*** (Coursera) — 5 khóa, trực giác DL vững.
- **fast.ai — *Practical Deep Learning for Coders*** — cách tiếp cận "top-down", làm được ngay rồi đào sâu. Rất hợp người thực hành.
- **d2l.ai — *"Dive into Deep Learning"*** — sách miễn phí, code đi kèm lý thuyết, có bản PyTorch.
- **PyTorch official tutorials** — "60 Minute Blitz" để khởi động.

**🏋️ Bài tập & project:**
- [ ] Code một mạng nơ-ron **từ đầu bằng NumPy** (forward + backprop tay) cho XOR — để *thật sự* hiểu backprop.
- [ ] Viết lại bằng PyTorch, so sánh.
- [ ] **Project: Phân loại ảnh** — train CNN trên MNIST rồi CIFAR-10; thử transfer learning với ResNet pretrained trên dataset riêng.
- [ ] Thí nghiệm: đổi learning rate, thêm/bớt dropout & batchnorm — quan sát loss curve.

**✅ Checklist Giai đoạn 3:**
- [ ] Giải thích forward/backprop/gradient descent bằng lời + code tay được.
- [ ] Viết training loop PyTorch hoàn chỉnh, chạy trên GPU.
- [ ] Hiểu CNN vs RNN và khi nào dùng cái nào.
- [ ] Nắm vững khái niệm **embedding** (cầu nối tới Giai đoạn 4).
- [ ] Train được model phân loại ảnh đạt accuracy hợp lý.

---

# 📦 GIAI ĐOẠN 4 — NLP & Transformer (cầu nối tới LLM)

> **Mục tiêu:** Đây là **giai đoạn bản lề**. Hiểu Transformer = hiểu *vì sao* LLM hoạt động. Đừng vội sang Giai đoạn 5 trước khi bạn có thể giải thích self-attention bằng lời và (lý tưởng) tự build một GPT nhỏ. Đây là ranh giới giữa "AI Engineer hiểu bản chất" và "người gọi API".

## Module 4.1 — NLP cổ điển (nền tảng ngắn)

- **Tokenization:** cắt văn bản thành đơn vị (từ, subword). Hiện đại dùng **subword** (BPE, WordPiece, SentencePiece) — cân bằng giữa từ vựng nhỏ và xử lý từ lạ. *Đây là lý do "tokens" tính tiền trong API LLM.*
- **Word embeddings — Word2Vec, GloVe:** biểu diễn từ thành vector sao cho từ gần nghĩa gần nhau. Phát hiện kinh điển: `vua - đàn ông + phụ nữ ≈ nữ hoàng`. Là *tiền thân* của embedding hiện đại nhưng **tĩnh** (một từ một vector, bất kể ngữ cảnh).
- **TF-IDF:** trọng số từ theo tần suất & độ hiếm — baseline cổ điển cho tìm kiếm/phân loại văn bản; vẫn hữu ích trong **hybrid search** của RAG (phần BM25).
- **RNN cho NLP:** xử lý chuỗi tuần tự — bối cảnh lịch sử trước khi Transformer thống trị.

## Module 4.2 — Attention & Transformer (TRỌNG TÂM)

**Trực giác cốt lõi:** Transformer giải quyết hai vấn đề của RNN — (1) không song song hóa được, (2) khó nhớ phụ thuộc xa. Ý tưởng then chốt: **attention** — mỗi từ "nhìn" tất cả từ khác và quyết định "chú ý" vào từ nào để hiểu ngữ cảnh của chính mình. Tất cả tính song song.

- **Self-attention:** với mỗi token, tạo 3 vector **Query, Key, Value**. Điểm attention = độ tương đồng Query·Key (lại là **dot product**!) → softmax thành trọng số → tổng có trọng số của Value. *Trực giác:* "từ này nên chú ý từ kia bao nhiêu". Đây là embedding **động** — nghĩa của từ thay đổi theo ngữ cảnh.
- **Multi-head attention:** chạy nhiều "đầu" attention song song để học các loại quan hệ khác nhau (cú pháp, ngữ nghĩa, ...).
- **Positional encoding:** vì attention không có khái niệm thứ tự, ta *tiêm* thông tin vị trí vào. (Hiện đại: RoPE — rotary position embedding.)
- **Kiến trúc encoder-decoder:** encoder hiểu input (BERT-style), decoder sinh output (GPT-style). LLM hiện đại chủ yếu **decoder-only**.
- **Đọc paper *"Attention is All You Need"* (2017):** paper khai sinh Transformer. Đừng sợ — đọc cùng "The Illustrated Transformer" sẽ thông.

## Module 4.3 — Pretrained models & HuggingFace

- **BERT (encoder-only):** hiểu ngữ cảnh hai chiều — mạnh cho phân loại, NER, tìm kiếm, **tạo embedding**.
- **GPT family (decoder-only):** sinh văn bản tự hồi quy (đoán token tiếp theo) — nền của LLM hội thoại hiện đại.
- **HuggingFace Transformers:** thư viện "App Store của model". `pipeline()` để dùng nhanh, `AutoModel`/`AutoTokenizer` để tùy biến. Hub có hàng trăm nghìn model pretrained. **Bắt buộc thành thạo** — đây là công cụ trung tâm của hệ sinh thái.

**📚 Tài nguyên:**
- **Jay Alammar — *"The Illustrated Transformer"*** & *"Illustrated GPT-2"*. **Đọc đầu tiên.** Trực quan tuyệt vời.
- **Andrej Karpathy — *"Let's build GPT from scratch"*** & **nanoGPT** (YouTube + GitHub). **Phải xem.** Karpathy code GPT từ con số 0 — sau video này bạn *thật sự* hiểu Transformer. Cả series "Neural Networks: Zero to Hero" đều vàng.
- **HuggingFace Course** (huggingface.co/learn) — miễn phí, thực hành Transformers + datasets.
- *"Attention is All You Need"* — paper gốc (arXiv).

**🏋️ Bài tập & project:**
- [ ] Code self-attention từ đầu bằng PyTorch (Q, K, V, softmax).
- [ ] Làm theo nanoGPT của Karpathy — train một GPT nhỏ sinh text (vd thơ Shakespeare).
- [ ] **Project: Phân tích cảm xúc (Sentiment Analysis)** — fine-tune BERT (HuggingFace) trên dataset review, so sánh với baseline TF-IDF + Logistic Regression.
- [ ] Dùng `pipeline()` thử các tác vụ: summarization, NER, QA.

**✅ Checklist Giai đoạn 4 (BẢN LỀ):**
- [ ] Giải thích self-attention (Q/K/V) bằng lời, không nhìn tài liệu.
- [ ] Hiểu vì sao Transformer thay thế RNN.
- [ ] Phân biệt encoder-only (BERT) vs decoder-only (GPT) và khi nào dùng.
- [ ] Đã tự build/train một GPT nhỏ (nanoGPT).
- [ ] Thành thạo HuggingFace Transformers cơ bản.

> **Mốc quan trọng:** Vượt qua checklist này, bạn đã có nền tảng để bước vào "kỷ nguyên LLM" mà **không bị mù**. Từ đây mọi thứ "hiện đại" sẽ làm bạn *aha* thay vì *choáng*.

---

# 📦 GIAI ĐOẠN 5 — LLM Engineering (trọng tâm hiện đại 2026)

> **Mục tiêu:** Làm chủ việc *xây ứng dụng* trên nền LLM. Đây là kỹ năng tạo giá trị nhanh nhất trên thị trường 2026. Nhờ nền tảng Giai đoạn 4, bạn hiểu *bên trong hộp đen*, nên sẽ debug được khi mọi thứ sai.

## Module 5.1 — Hiểu LLM hoạt động

**Lý thuyết cốt lõi:**

- **Pretraining:** huấn luyện trên lượng text khổng lồ với mục tiêu "đoán token tiếp theo" → model học ngữ pháp, sự kiện, lý luận. Tốn hàng triệu USD, chỉ các lab lớn làm.
- **Post-training / Fine-tuning & RLHF:** sau pretrain, model được "dạy nghe lời": **SFT** (supervised fine-tuning trên cặp hỏi-đáp), rồi **RLHF/RLAIF/DPO** (căn chỉnh theo phản hồi con người/AI) để hữu ích & an toàn. *Đây là vì sao ChatGPT "biết nghe" còn GPT thô thì không.*
- **Tokens & context window:** model "nhìn" thế giới qua token. **Context window** = số token tối đa model xử lý cùng lúc (2026: nhiều model 200K–1M+ token). Hiểu để quản lý chi phí & cắt ngữ cảnh hợp lý.
- **Temperature & sampling:** temperature cao → sáng tạo/ngẫu nhiên; thấp → xác định/nhất quán. top-p, top-k điều khiển đa dạng output.
- **In-context learning & prompt engineering:** LLM học "tức thời" từ ví dụ trong prompt mà không cần đổi trọng số — đây là phép màu khiến few-shot hoạt động.

## Module 5.2 — Làm việc với API (cập nhật model 2026)

Các họ model frontier & open chính giữa **2026** (mảng này đổi *rất nhanh* — luôn kiểm tra leaderboard như **llm-stats.com**, **lmarena.ai**, **Artificial Analysis** trước khi chọn):

| Nhà cung cấp | Model frontier 2026 | Điểm mạnh |
|--------------|---------------------|-----------|
| **Anthropic** | **Claude Opus 4.x / Sonnet** (họ Claude) | Lý luận, coding agent, an toàn, MCP-native; mạnh nhất trên GPQA reasoning |
| **OpenAI** | **GPT-5.5** (họ GPT-5) | Coding-arena mạnh nhất head-to-head, hệ sinh thái rộng |
| **Google** | **Gemini 3 Pro / 3.5 Flash** | Multimodal, context cực dài, giá tốt ở bản Flash |
| **xAI** | **Grok 4** | Reasoning, tích hợp dữ liệu thời gian thực |
| **DeepSeek** | **DeepSeek V4 Pro** (open, MIT) | Mở, rẻ kinh ngạc (~34× rẻ hơn GPT-5.5/token), gần frontier về coding |
| **Alibaba** | **Qwen 3.7 Max** | Rẻ nhất top 10 (~$1.25/M tok), benchmark mạnh |
| **Meta** | **Llama 4** | Open-weights phổ biến, hệ sinh thái lớn |
| **Mistral** | **Mistral Medium 3.5** | Open/châu Âu, gọn nhẹ |
| **Moonshot** | **Kimi K2.6** (MoE 1T params, 256K ctx) | Open, đa phương thức ảnh+video |
| **Z.AI** | **GLM-5** | Open, mạnh ở coding |

**Kỹ năng API cốt lõi (giống nhau giữa các nhà cung cấp):**
- **Streaming:** nhận output từng token (UX tốt hơn cho chatbot).
- **Function/Tool calling:** model trả về "ý định gọi hàm" có cấu trúc → bạn chạy hàm → đưa kết quả lại. **Nền tảng của Agents.**
- **Structured output:** ép model trả JSON đúng schema (JSON mode / response_format / tool schema) — quan trọng để tích hợp vào hệ thống.
- **Multimodal:** gửi ảnh/audio cùng text.

> **Phản biện chọn model:** Đừng mặc định dùng model đắt nhất. Nguyên tắc 2026: **router theo task** — task đơn giản (phân loại, trích xuất) dùng model nhỏ/rẻ (Flash/Haiku/Qwen); task khó (lý luận, code phức tạp) mới dùng frontier. Chênh lệch chi phí có thể **10–100×**.

## Module 5.3 — Multi-LLM orchestration

- **LangChain:** framework "dao đa năng" để ghép prompt, model, tool, memory. Mạnh nhưng đôi khi abstraction quá dày — 2026 nhiều đội dùng có chọn lọc.
- **LlamaIndex:** mạnh về **kết nối & cấu trúc hóa dữ liệu** cho RAG. Pattern phổ biến 2026: **LlamaIndex (data) + LangGraph (orchestration agent)**.
- **Điều phối nhiều model:** chọn model theo **task & chi phí** (router), fallback khi model lỗi, so sánh output. Có thể tự viết bằng SDK gốc — không nhất thiết phải dùng framework nặng.

## Module 5.4 — Prompt & Context Engineering nâng cao

**Trực giác 2026:** Ngành đã dịch từ "prompt engineering" sang **"context engineering"** — nghệ thuật *quản lý toàn bộ ngữ cảnh* đưa vào model (system prompt, ví dụ, dữ liệu RAG, lịch sử, tool results, bộ nhớ) chứ không chỉ "câu lệnh khéo". Grounding output trên dữ liệu thật giảm hallucination mạnh.

- **Few-shot prompting:** đưa vài ví dụ mẫu để model bắt chước.
- **Chain-of-Thought (CoT):** "hãy suy nghĩ từng bước" → model lý luận trung gian, tăng độ chính xác bài toán phức tạp.
- **ReAct (Reason + Act):** xen kẽ *suy luận* và *hành động* (gọi tool) — nền của agent.
- **Self-consistency, prompt chaining, structured prompting.**

**📚 Tài nguyên:**
- **Docs chính thức:** Anthropic (anthropic.com/docs — prompt engineering guide rất tốt), OpenAI, Google AI.
- **DeepLearning.AI short courses** (Andrew Ng + đối tác): "ChatGPT Prompt Engineering for Developers", "Functions/Tools", "LangChain for LLM App Dev".
- **Prompt Engineering Guide** (promptingguide.ai).
- **Awesome-Context-Engineering** (GitHub) — tổng hợp cập nhật.

**🏋️ Bài tập & project:**
- [ ] Gọi API của 3 nhà cung cấp khác nhau (vd Claude, GPT, Gemini) cho cùng một task, so sánh chất lượng/chi phí.
- [ ] Triển khai streaming + tool calling (vd LLM gọi hàm thời tiết/máy tính).
- [ ] Ép structured output JSON đúng schema, parse vào Pydantic.
- [ ] **Project: Trợ lý hỏi-đáp đa model** có router chọn model rẻ/đắt theo độ khó câu hỏi.

**✅ Checklist Giai đoạn 5:**
- [ ] Giải thích pretraining vs fine-tuning vs RLHF.
- [ ] Thành thạo streaming, tool calling, structured output.
- [ ] Biết chọn model theo task & chi phí (không mặc định đắt nhất).
- [ ] Áp dụng được few-shot, CoT, ReAct.
- [ ] Hiểu "context engineering" và quản lý ngữ cảnh có chủ đích.

---

# 📦 GIAI ĐOẠN 6 — RAG & Vector Database

> **Mục tiêu:** Xây hệ thống cho LLM "trả lời có căn cứ" trên dữ liệu *riêng* của bạn. **RAG là ứng dụng LLM tạo giá trị doanh nghiệp lớn nhất 2026.** Phần này liên kết chặt với [04 — Database (vector DB)](04-database.md).

## Module 6.1 — RAG: kiến trúc & vì sao cần

**Trực giác cốt lõi:** LLM chỉ "biết" những gì có trong dữ liệu pretrain (có cutoff thời gian) và **không biết** dữ liệu riêng của bạn (tài liệu nội bộ, dữ liệu mới). RAG giải quyết bằng cách: *trước khi* hỏi LLM, ta **tìm** các đoạn tài liệu liên quan rồi **nhét vào prompt** làm ngữ cảnh. → Model trả lời dựa trên dữ liệu thật, giảm hallucination, trích nguồn được, cập nhật mà không cần retrain.

**Pipeline RAG cơ bản:**
```
Tài liệu → Chunking (cắt đoạn) → Embedding (vector) → lưu Vector DB
                                                            │
Câu hỏi → Embedding → Similarity search ───────────────────┘
       → lấy top-k đoạn liên quan → (Rerank) → nhét vào prompt → LLM trả lời
```

- **Chunking:** cắt tài liệu thành đoạn vừa phải. *Đánh đổi:* đoạn quá lớn → loãng ngữ cảnh & tốn token; quá nhỏ → mất mạch. Có chiến lược theo câu/đoạn/semantic, kèm overlap.
- **Embedding:** mã hóa đoạn & câu hỏi thành vector. Model phổ biến 2026: OpenAI `text-embedding-3-large` (mặc định an toàn), các open model (BGE, E5, Voyage, Cohere embed).
- **Retrieval:** tìm đoạn gần nghĩa nhất bằng **cosine similarity** (lại là dot product chuẩn hóa!).
- **Reranking:** dùng **cross-encoder** xếp lại top-k để tăng độ chính xác. *2026: rerank là "đòn tăng precision lớn nhất" — thêm 10–25% precision, giảm hallucination rõ rệt.*
- **Đánh giá RAG:** đo *retrieval* (recall@k, MRR) và *generation* (faithfulness, answer relevancy). Công cụ: **RAGAS**, **TruLens**, LangSmith. **Đừng "cảm tính" — phải đo.**

## Module 6.2 — Vector Database

- **Vai trò:** lưu hàng triệu vector và tìm "hàng xóm gần nhất" (ANN) cực nhanh.
- **Index — HNSW:** đồ thị phân tầng cho **Approximate Nearest Neighbor** — đánh đổi chính xác lấy tốc độ (tìm gần đúng nhưng nhanh hơn vạn lần so với quét tuyến tính).
- **Các lựa chọn 2026:**
  - **pgvector** (extension Postgres) — nếu đã dùng Postgres và < ~5–10 triệu vector, đây là giải pháp production đủ tốt, **không cần dịch vụ riêng**. Lựa chọn khôn ngoan cho backend đã có Postgres.
  - **Qdrant** — mã nguồn mở, hiệu năng cao, viết bằng Rust; rất được ưa chuộng cho agentic RAG.
  - **Pinecone** — managed (không lo vận hành), dễ scale.
  - **Chroma** — nhẹ, tốt cho prototype/local.
  - **Weaviate**, **Milvus** — nhiều tính năng, scale lớn.
  - *2026:* hầu hết đều hỗ trợ **hybrid retrieval (BM25 + dense)** sẵn.

## Module 6.3 — RAG nâng cao

- **Hybrid search:** kết hợp **dense** (embedding, hiểu nghĩa) + **sparse/BM25** (khớp từ khóa) qua **RRF (Reciprocal Rank Fusion, k≈60)**. *2026: hybrid + RRF là mặc định đúng cho mọi hệ production.*
- **Agentic RAG:** một agent *quyết định* khi nào cần tìm kiếm, phân rã câu hỏi, lặp nhiều vòng truy hồi — thay vì pipeline cứng một lượt.
- **GraphRAG:** truy hồi trên **knowledge graph** (thực thể + quan hệ) thay vì chunk phẳng — mạnh cho câu hỏi cần tổng hợp nhiều mối liên hệ. Nhiều hệ 2026 kết hợp agent truy vấn graph.
- **Adaptive RAG:** router phân loại độ phức tạp câu hỏi → chọn pipeline phù hợp. Đây là "best practice mới nổi" 2026.

**📚 Tài nguyên:**
- LlamaIndex & LangChain RAG docs/tutorials.
- Tài liệu của Qdrant/Pinecone/Weaviate (đều có guide RAG tốt).
- DeepLearning.AI: "Building & Evaluating Advanced RAG", "Knowledge Graphs for RAG".
- Module Vector DB trong [04 — Database](04-database.md).

**🏋️ Bài tập & project:**
- [ ] Xây RAG cơ bản: nạp PDF → chunk → embed → pgvector/Chroma → hỏi đáp có trích nguồn.
- [ ] Thêm hybrid search + reranking, đo cải thiện bằng RAGAS.
- [ ] So sánh 2 chiến lược chunking và 2 model embedding.
- [ ] **Project lớn: Chatbot RAG trên tài liệu riêng** (vd hỏi đáp tài liệu công ty/sách giáo trình) — có đánh giá định lượng, trích dẫn nguồn, UI đơn giản.

**✅ Checklist Giai đoạn 6:**
- [ ] Giải thích vì sao cần RAG & toàn bộ pipeline.
- [ ] Hiểu chunking/embedding/retrieval/rerank và đánh đổi của từng bước.
- [ ] Biết chọn vector DB phù hợp ngữ cảnh (đặc biệt pgvector cho backend có Postgres).
- [ ] Triển khai hybrid search + rerank và **đo** chất lượng RAG.
- [ ] Hoàn thành chatbot RAG có trích nguồn + đánh giá.

---

# 📦 GIAI ĐOẠN 7 — AI Agents

> **Mục tiêu:** Xây hệ thống LLM **tự chủ** — biết lập kế hoạch, dùng tool, ghi nhớ, và phối hợp nhiều agent để giải bài toán nhiều bước. Đây là **biên giới nóng nhất 2026** (Gartner dự đoán 40% ứng dụng doanh nghiệp sẽ có agent chuyên biệt cuối 2026).

## Module 7.1 — Khái niệm agent

**Trực giác cốt lõi:** Một agent = **LLM + vòng lặp + tool + bộ nhớ**. Thay vì trả lời một phát, agent *lý luận → hành động (gọi tool) → quan sát kết quả → lý luận tiếp* cho tới khi xong nhiệm vụ. LLM là "bộ não", tool là "tay chân", bộ nhớ là "ký ức".

- **ReAct (Reason + Act):** mẫu nền tảng — xen kẽ suy luận và hành động.
- **Planning:** phân rã nhiệm vụ lớn thành các bước (có thể tạo kế hoạch trước, hoặc lập kế hoạch động).
- **Tool use:** gọi API, chạy code, tìm kiếm web, truy vấn DB — dựa trên **function calling** (Giai đoạn 5).
- **Memory:** ngắn hạn (trong context) và dài hạn (lưu vector DB và truy hồi lại — chính là RAG cho ký ức agent).
- **Multi-agent systems:** nhiều agent chuyên trách phối hợp (vd: planner → researcher → writer → reviewer). Đánh đổi: mạnh hơn nhưng phức tạp, khó debug, tốn token.

## Module 7.2 — Framework & chuẩn (cập nhật 2026)

| Framework | Đặc điểm | Khi nào dùng |
|-----------|----------|--------------|
| **LangGraph** | Đồ thị trạng thái, kiểm soát rõ branching/retry/human-in-the-loop; ~34.5M download/tháng | Workflow phức tạp, cần kiểm soát chặt, production |
| **CrewAI** | Đơn giản, agent theo "vai trò"; chạy được trong ~20 phút | Multi-agent nhanh, vai trò rõ ràng |
| **Claude Agent SDK** (Anthropic) | Cùng kiến trúc chạy Claude Code; hooks, MCP, skills, subagents native | Agent production trên hệ Anthropic |
| **OpenAI Agents SDK** | Trừu tượng "handoff" giữa agent; chạy với 100+ model | Hệ OpenAI, kế thừa Swarm |
| **AutoGen** (Microsoft) | Hội thoại nhiều agent, mạnh nghiên cứu | Thử nghiệm multi-agent |

- **MCP (Model Context Protocol):** **chuẩn công nghiệp 2026** để kết nối agent ↔ tool/dữ liệu. Khởi nguồn từ Anthropic, nay thuộc **Linux Foundation / Agentic AI Foundation**, được Anthropic, OpenAI, Google, Microsoft, AWS hậu thuẫn; tích hợp sẵn trong VS Code, JetBrains. *Học MCP = học "USB-C của AI tools".*

> **Phản biện:** Đừng vội multi-agent. Đa số bài toán giải tốt bằng **một agent + tool + RAG**. Multi-agent thêm độ phức tạp, chi phí và điểm gãy. Chỉ dùng khi nhiệm vụ thực sự cần phân vai.

## Module 7.3 — Xây & đánh giá agent

- **Quan sát (observability):** trace từng bước (LangSmith, Langfuse) — agent là hộp đen nhiều bước, không trace thì không debug được.
- **Đánh giá:** đo tỉ lệ hoàn thành nhiệm vụ, số bước, chi phí, độ an toàn (tránh vòng lặp vô hạn, tool lỗi).
- **Guardrails:** giới hạn hành động, xác nhận của người (human-in-the-loop) cho hành động nguy hiểm.

**📚 Tài nguyên:**
- Docs chính thức: LangGraph, CrewAI, **Anthropic Claude Agent SDK**, OpenAI Agents SDK, **modelcontextprotocol.io**.
- Anthropic — *"Building effective agents"* (bài viết kinh điển về pattern agent).
- DeepLearning.AI: "AI Agents in LangGraph", "Multi-Agent Systems".

**🏋️ Bài tập & project:**
- [ ] Xây agent ReAct đơn giản từ đầu (LLM + 2-3 tool: search, calculator).
- [ ] Tạo một **MCP server** nhỏ và kết nối agent vào.
- [ ] **Project lớn: Research Agent** — nhận một câu hỏi, tự tìm web nhiều vòng, tổng hợp, trích nguồn, xuất báo cáo. (Portfolio nổi bật!)
- [ ] Thêm tracing (Langfuse) + đánh giá tỉ lệ hoàn thành.

**✅ Checklist Giai đoạn 7:**
- [ ] Giải thích vòng lặp agent (ReAct) & vai trò memory/tool/planning.
- [ ] Xây được agent có tool calling chạy ổn định.
- [ ] Hiểu & dùng được MCP.
- [ ] Biết khi nào KHÔNG nên dùng multi-agent.
- [ ] Có tracing & đánh giá agent định lượng.

---

# 📦 GIAI ĐOẠN 8 — Fine-tuning & tối ưu model

> **Mục tiêu:** Biết *khi nào* và *làm sao* tùy biến model. **Quan trọng nhất là tư duy quyết định:** đa số trường hợp KHÔNG cần fine-tune. Phần này cần GPU (Colab/Kaggle/cloud).

## Module 8.1 — Cây quyết định: Prompt vs RAG vs Fine-tune

**Trực giác cốt lõi — phân biệt "kiến thức" vs "hành vi":**
- Thiếu **kiến thức/dữ liệu mới** → dùng **RAG** (rẻ, cập nhật dễ, trích nguồn). *Đây là lựa chọn đầu tiên cho hầu hết case.*
- Chỉ cần điều chỉnh nhẹ cách trả lời → **prompt/few-shot engineering** (rẻ nhất, thử trước).
- Cần thay đổi **hành vi/phong cách/định dạng nhất quán** hoặc nhồi domain chuyên sâu mà prompt không tải nổi, hoặc cần model nhỏ chạy rẻ cho task hẹp → **fine-tune**.

> **Sai lầm kinh điển:** fine-tune để "dạy kiến thức mới" — thường tốn kém mà kém hiệu quả hơn RAG, và model dễ quên (catastrophic forgetting). **Thứ tự đúng: Prompt → RAG → Fine-tune.**

## Module 8.2 — Kỹ thuật fine-tuning

- **Full fine-tuning:** cập nhật toàn bộ trọng số — tốn GPU khủng khiếp, ít ai làm với model lớn.
- **PEFT (Parameter-Efficient Fine-Tuning):**
  - **LoRA:** chỉ train các ma trận "low-rank" nhỏ chèn vào, đóng băng phần còn lại → giảm tham số train hàng trăm lần, chất lượng gần full.
  - **QLoRA:** LoRA trên model đã **quantize 4-bit** → fine-tune model lớn trên *một* GPU consumer. Cách phổ biến nhất cho cá nhân/đội nhỏ 2026.
  - DoRA, ReLoRA, Spectrum — biến thể nâng cao.
- **Quantization:** nén trọng số (FP16 → INT8/INT4) để giảm bộ nhớ & tăng tốc inference, đánh đổi chút chất lượng. Quan trọng để chạy model lớn trên phần cứng hạn chế.
- **Distillation:** "trò nhỏ học từ thầy lớn" — train model nhỏ bắt chước model lớn để chạy rẻ/nhanh.
- **Chuẩn bị dataset:** chất lượng dữ liệu > số lượng. Định dạng instruction/chat, làm sạch, cân bằng. *Đây là phần quyết định thành bại — "garbage in, garbage out".*
- **Đánh giá:** đo trên held-out set + đánh giá định tính; coi chừng overfit.

**Công cụ 2026:**
- **Unsloth** — fine-tune nhanh gấp ~2×, giảm ~70% bộ nhớ; lựa chọn hàng đầu cho cá nhân.
- **Axolotl** — chuẩn công nghiệp cấu hình bằng file YAML, hỗ trợ gần như mọi kỹ thuật.
- **HuggingFace PEFT / TRL** — thư viện nền.
- **Serving adapter:** giữ LoRA adapter tách rời, nạp lên base quantized khi inference (qua **vLLM**/**TGI**) — phục vụ nhiều adapter trên cùng base hiệu quả.

**📚 Tài nguyên:**
- HuggingFace PEFT & TRL docs, Unsloth notebooks (Colab miễn phí), Axolotl docs.
- DeepLearning.AI: "Finetuning Large Language Models".
- Bài QLoRA paper (Dettmers et al.) cho người muốn đào sâu.

**🏋️ Bài tập & project:**
- [ ] Quantize một model open (vd Llama/Qwen) và đo chênh lệch chất lượng/tốc độ.
- [ ] **Project: QLoRA fine-tune** một model nhỏ (vd Qwen/Llama 8B) cho task hẹp (vd phân loại/định dạng đặc thù) bằng Unsloth trên Colab; so sánh với prompt-only.
- [ ] Viết "cây quyết định" cho một use case thật: nên prompt/RAG/fine-tune?

**✅ Checklist Giai đoạn 8:**
- [ ] Quyết định đúng prompt vs RAG vs fine-tune cho một bài toán.
- [ ] Giải thích LoRA/QLoRA & quantization bằng trực giác.
- [ ] Chuẩn bị được dataset fine-tune chất lượng.
- [ ] Fine-tune thành công 1 model nhỏ & đánh giá khách quan.

---

# 📦 GIAI ĐOẠN 9 — MLOps & Thiết kế hệ thống AI

> **Mục tiêu:** Biến "notebook chạy được" thành **hệ thống production** đáng tin, scale được, kiểm soát chi phí. Đây là kỹ năng phân biệt *kỹ sư* với *người làm demo*. Liên kết chặt với [05 — Backend](05-backend-web.md) và [06 — System Design](06-system-design.md).

## Module 9.1 — MLOps / LLMOps

**Trực giác cốt lõi:** ML khác phần mềm thường ở chỗ kết quả phụ thuộc **dữ liệu** (luôn thay đổi) và **model** (suy giảm theo thời gian). MLOps là DevOps cộng thêm quản lý *data* và *model*.

- **Experiment tracking:** ghi lại mọi lần train (siêu tham số, metric, artifact) để tái lập & so sánh. Công cụ: **MLflow** (mã nguồn mở, có Model Registry & quản trị), **Weights & Biases** (W&B — 2026 dùng cả để theo dõi gradient flow & độc tính model khi train).
- **Model & data versioning:** **DVC** (version dữ liệu như Git), Model Registry để quản lý vòng đời model (staging → production).
- **Pipeline:** tự động hóa luồng data → train → eval → deploy (Airflow, Prefect, Kubeflow, ZenML).
- **CI/CD cho ML:** test dữ liệu & model, tự động retrain/redeploy khi đạt ngưỡng.
- **Monitoring:** theo dõi **data drift** (phân phối input đổi), **model drift / concept drift** (quan hệ input→output đổi) → cảnh báo retrain. Với LLM còn theo dõi hallucination, độc hại, chi phí token, latency.
- **Feature store:** kho feature dùng chung giữa train & serving, tránh "train/serving skew".

## Module 9.2 — Serving & tối ưu inference

- **Serve model thường:** **FastAPI** (đóng gói model thành REST API — liên kết [05 Backend]), **BentoML** (đóng gói & deploy chuyên cho ML), TorchServe.
- **Serve LLM:** **vLLM** (chuẩn 2026 cho throughput cao nhờ PagedAttention & continuous batching), **TGI** (HuggingFace), SGLang, Ollama (local). Hỗ trợ nạp nhiều LoRA adapter trên một base.
- **Batch vs real-time inference:** batch (xử lý lô lớn, rẻ, độ trễ chấp nhận được) vs real-time (độ trễ thấp cho user). Chọn theo yêu cầu sản phẩm.
- **GPU & tối ưu:** quantization, batching, caching (prompt cache, KV cache), chọn model nhỏ hơn khi đủ dùng.
- **Tối ưu chi phí/latency LLM:** **prompt caching**, **semantic cache** (cache câu hỏi gần giống), **model routing** (rẻ/đắt theo độ khó), streaming, giới hạn context. *Đây là kỹ năng "tiền bạc" — chi phí LLM ở quy mô lớn rất đáng kể.*

## Module 9.3 — Thiết kế hệ thống AI end-to-end

Tổng hợp mọi thứ thành kiến trúc thật. Một hệ thống AI app điển hình 2026:
```
User → API Gateway → Backend (FastAPI) → [Orchestrator/Agent]
                                           ├─ LLM Router (chọn model theo task/chi phí)
                                           ├─ RAG: Vector DB (pgvector/Qdrant) + Rerank
                                           ├─ Tools / MCP servers
                                           ├─ Cache (prompt/semantic) + Queue (async)
                                           └─ Observability (trace, cost, drift, eval)
                            ↑ Guardrails / Auth / Rate limit / Fallback model
```
Các vấn đề thiết kế cần cân nhắc: độ trễ (streaming, async), độ tin cậy (fallback model, retry), chi phí (cache, routing), an toàn (guardrails, PII), đánh giá liên tục (eval offline + online), khả năng quan sát.

**📚 Tài nguyên:**
- *"Designing Machine Learning Systems"* (Chip Huyen) — **sách MLOps must-read.** Bản mới cập nhật cho cả LLM.
- *"AI Engineering"* (Chip Huyen, 2025) — tập trung kỷ nguyên LLM, cực hợp lộ trình này.
- Docs: MLflow, W&B, DVC, vLLM, BentoML, FastAPI.
- Made With ML (madewithml.com) — khóa MLOps thực hành miễn phí.
- [06 — System Design](06-system-design.md) cho nền tảng thiết kế hệ thống chung.

**🏋️ Bài tập & project:**
- [ ] Track một thí nghiệm train bằng MLflow/W&B, version data bằng DVC.
- [ ] Đóng gói model bằng FastAPI + Docker, deploy thử (Render/Railway/Hugging Face Spaces).
- [ ] Serve một LLM open bằng vLLM, đo throughput/latency.
- [ ] **Project tổng hợp: Đưa chatbot RAG/Agent lên production** — có API, cache, monitoring chi phí/latency, fallback model, và một dashboard đánh giá.
- [ ] Viết một **thiết kế hệ thống AI** (1-2 trang) cho một sản phẩm giả định, nêu rõ đánh đổi.

**✅ Checklist Giai đoạn 9:**
- [ ] Track experiment & version data/model bài bản.
- [ ] Serve model qua API (FastAPI) và LLM qua vLLM.
- [ ] Hiểu & phát hiện data/model drift.
- [ ] Áp dụng kỹ thuật tối ưu chi phí/latency LLM.
- [ ] Vẽ & bảo vệ được một kiến trúc hệ thống AI end-to-end.

---

# 🛠️ Các project thực hành lớn (Portfolio theo cấp độ)

Đây là "bằng chứng năng lực" quan trọng hơn cả chứng chỉ. Mỗi cấp độ một project, đẩy lên GitHub có README đẹp:

| Cấp độ | Project | Kỹ năng thể hiện | Mảng liên quan |
|--------|---------|------------------|----------------|
| **ML cổ điển** | Dự đoán giá nhà (House Prices) | EDA, feature engineering, XGBoost, đánh giá | Giai đoạn 2 |
| **Deep Learning** | Phân loại ảnh (CIFAR-10 + transfer learning) | CNN, PyTorch, GPU, transfer learning | Giai đoạn 3 |
| **NLP** | Phân tích cảm xúc (fine-tune BERT) | Transformer, HuggingFace, so baseline | Giai đoạn 4 |
| **LLM** | Chatbot RAG trên tài liệu riêng | RAG, vector DB, rerank, đánh giá RAG | Giai đoạn 5–6 |
| **Agent** | Research Agent (tự tìm web + báo cáo) | Agent, tool use, MCP, tracing | Giai đoạn 7 |
| **Fine-tune** | QLoRA cho task hẹp | PEFT, dataset, đánh giá | Giai đoạn 8 |
| **Production** | Đưa 1 project lên prod (API + monitoring + cost) | MLOps, serving, system design | Giai đoạn 9 |

> **Lời khuyên portfolio:** 3 project *làm sâu* (có đánh giá định lượng, README giải thích đánh đổi, code sạch) giá trị hơn 10 project demo nông. Nhà tuyển dụng AI/ML 2026 đánh giá cao việc bạn biết *đo lường* và *tối ưu*, không chỉ "chạy được".

---

# ⚠️ Lỗi & hiểu lầm thường gặp

- **Nhảy thẳng vào LLM, bỏ nền tảng (1–4).** Hệ quả: không debug được khi RAG/agent sai, không hiểu vì sao. → Đọc lại phần Triết lý đầu file.
- **Học vẹt công thức toán mà không nắm trực giác** (hoặc ngược lại, kẹt mãi ở toán mà không tiến). → Xem 3Blue1Brown lấy trực giác, rồi đi tiếp, đào sâu khi cần.
- **Chỉ đọc/xem mà không code.** ML/DL là kỹ năng vận động — phải gõ tay. *Karpathy: "You don't understand it until you can code it."*
- **Fine-tune mọi thứ.** → Thứ tự đúng: Prompt → RAG → Fine-tune.
- **Mặc định dùng model đắt nhất.** → Router theo task tiết kiệm 10–100×.
- **Đánh giá RAG/agent bằng cảm tính.** → Phải có metric (RAGAS, eval set, tracing).
- **Đánh giá model trên dữ liệu đã train (data leakage).** → Luôn giữ test set sạch.
- **Lạm dụng multi-agent & framework nặng.** → Bắt đầu đơn giản, chỉ thêm phức tạp khi cần.
- **Bỏ qua chi phí & latency cho tới khi production.** → Tính sớm; ở quy mô lớn đây là yếu tố sống còn.
- **Chạy theo mọi model/framework mới.** Mảng này đổi hằng tuần. → Nắm *nguyên lý bất biến* (attention, embedding, gradient), công cụ chỉ là phương tiện.

---

# ✅ Checklist tự đánh giá tổng

- [ ] **GĐ 0:** Python sạch + NumPy/Pandas/visualization thành thạo.
- [ ] **GĐ 1:** Trực giác đại số tuyến tính, giải tích (gradient/chain rule), xác suất-thống kê.
- [ ] **GĐ 2:** Tư duy ML đúng (overfit, metrics, chọn thuật toán) + 1 project Kaggle.
- [ ] **GĐ 3:** Tự viết training loop PyTorch, hiểu backprop, train CNN.
- [ ] **GĐ 4 (BẢN LỀ):** Giải thích self-attention, build nanoGPT, dùng HuggingFace.
- [ ] **GĐ 5:** LLM API (streaming, tool calling, structured output), prompt/context engineering, chọn model theo chi phí.
- [ ] **GĐ 6:** Xây RAG production (hybrid + rerank) và **đo** được chất lượng.
- [ ] **GĐ 7:** Xây agent có tool + MCP + tracing & đánh giá.
- [ ] **GĐ 8:** Quyết định & thực hiện fine-tune (QLoRA) đúng lúc.
- [ ] **GĐ 9:** Serve, monitor, tối ưu chi phí và thiết kế hệ thống AI end-to-end.

---

# 🔗 Liên kết các mảng khác

- **[01 — Python](01-nen-tang-cs.md):** ngôn ngữ nền cho toàn bộ AI/ML.
- **[02 — Giải thuật & CTDL](02-giai-thuat-ctdl.md):** tư duy độ phức tạp cho data pipeline & tối ưu.
- **[03 — Git/GitHub](03-git-github.md):** version code & cộng tác; portfolio đặt trên GitHub.
- **[04 — Database](04-database.md):** data pipeline & **Vector Database (pgvector)** cho RAG — học kèm Giai đoạn 6.
- **[05 — Backend](05-backend-web.md):** **serve model** qua API (FastAPI) — học kèm Giai đoạn 9.
- **[06 — System Design](06-system-design.md):** nền tảng thiết kế hệ thống cho **System Design AI** — học kèm Giai đoạn 9.

---

> **Lời cuối:** Mảng này dài và đổi nhanh, nhưng **nguyên lý cốt lõi thì bền vững**: dữ liệu là vector, model học bằng gradient, attention là trái tim của LLM, và "đo lường" là kim chỉ nam. Nắm chắc nền tảng (1–4), bạn sẽ học mọi công cụ mới trong vài ngày thay vì vài tháng. *Đi từ nền tảng đến hệ thống — đó là con đường của một kỹ sư thực thụ.*
