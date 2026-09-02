# 01 — Nền tảng Khoa học Máy tính

> Đây là **móng nhà** của toàn bộ sự nghiệp lập trình. Bạn có thể học framework mới trong vài tuần, nhưng nếu không hiểu *máy tính chạy chương trình thế nào*, *bộ nhớ hoạt động ra sao*, hay *vì sao code chậm*, bạn sẽ mãi dừng ở mức "copy-paste cho chạy" mà không bao giờ debug được vấn đề khó hay tối ưu được hệ thống.

Với mục tiêu **AI/ML Engineer**: bạn sẽ làm việc với dataset hàng chục GB, train model tốn RAM/VRAM, và phải hiểu vì sao một vòng lặp Python chậm gấp 100 lần NumPy. Không có nền tảng, bạn không hiểu nổi lỗi `CUDA out of memory` hay `OOM killed`.

Với mục tiêu **Backend Engineer**: bạn sẽ vận hành service chịu hàng nghìn request/giây, debug memory leak, phân biệt I/O-bound vs CPU-bound để chọn đúng concurrency model. Tất cả đều bắt rễ từ mảng này.

Phần lớn kiến thức ở đây **không lỗi thời** — nó đúng cho năm 1990 và vẫn đúng năm 2026. Đầu tư thời gian học kỹ một lần, dùng cả đời.

---

## 🎯 Mục tiêu (học xong làm được gì)

- Giải thích được một dòng code đi từ source → chạy trên CPU như thế nào (compile/interpret, RAM, CPU register).
- Phân biệt rõ **stack vs heap**, **process vs thread**, **value vs reference**, **stack vs heap allocation** — và biết khi nào dùng cái nào.
- Dùng thành thạo terminal (bash + PowerShell) để điều hướng, quản lý file, set biến môi trường — không còn sợ "màn hình đen".
- Hiểu mô hình **client-server**, biết một request HTTP đi qua DNS → IP → port → TCP như thế nào.
- Viết code **một ngôn ngữ động (Python)** và **một ngôn ngữ static-typed (Java hoặc C#)** ở mức vững: biến, kiểu, control flow, hàm, OOP, error handling, I/O.
- Áp dụng **OOP** và nguyên tắc **SOLID/DRY/KISS** để viết code người khác đọc hiểu được.
- Set up môi trường dev chuyên nghiệp: VS Code, debugger, virtual environment, package manager.

## 🧱 Yêu cầu trước

- Biết dùng máy tính ở mức cơ bản (cài phần mềm, quản lý thư mục).
- Tiếng Anh đọc hiểu tài liệu kỹ thuật (mức B1 trở lên là đủ; nhiều tài nguyên có phụ đề Việt).
- Tư duy logic và **sự kiên nhẫn** — đây là phần khô nhất nhưng quan trọng nhất. Không có yêu cầu code trước.

## ⏱️ Ước lượng thời gian học

| Cường độ | Thời gian |
|---|---|
| Toàn thời gian (6-8h/ngày) | **6-8 tuần** |
| Bán thời gian (2-3h/ngày, có đi học/đi làm) | **3-4 tháng** |
| Cuối tuần (10h/tuần) | **5-6 tháng** |

> **Lời khuyên thực dụng:** Đừng cố "học thuộc" hết module 1-4 trước khi viết dòng code đầu tiên. Học song song — đọc về OS/mạng vài hôm, rồi nhảy ngay vào Python (module 5), quay lại đào sâu lý thuyết khi gặp khái niệm cần. Học CS thuần lý thuyết mà không code sẽ chán và quên nhanh.

---

## 📦 Module 1 — Máy tính hoạt động như thế nào

**Lý thuyết cốt lõi:**

- **Hệ nhị phân (binary) & thập lục phân (hex):** vì sao máy tính chỉ hiểu 0/1 (transistor bật/tắt); cách đổi qua lại decimal ↔ binary ↔ hex; vì sao dev hay dùng hex (1 chữ hex = 4 bit, gọn hơn nhị phân; dùng cho mã màu `#FF5733`, địa chỉ bộ nhớ `0x7fff`).
- **Bit, byte và đơn vị:** 1 byte = 8 bit; KB/MB/GB; phân biệt KB (1000) vs KiB (1024); vì sao `char` thường 1 byte, `int` 4 byte.
- **Biểu diễn dữ liệu:** số nguyên (signed/unsigned, two's complement — vì sao có số âm), số thực (floating point IEEE 754 — **vì sao `0.1 + 0.2 != 0.3`**), ký tự (ASCII vs Unicode/UTF-8 — vì sao tiếng Việt cần Unicode).
- **Kiến trúc von Neumann:** CPU (ALU + control unit + register), RAM (bộ nhớ tạm, mất điện là mất), ổ đĩa (lưu lâu dài, chậm hơn RAM nhiều lần); **cache** L1/L2/L3 và vì sao "locality" quan trọng cho hiệu năng.
- **Chu kỳ thực thi (fetch-decode-execute):** CPU lấy lệnh từ RAM, giải mã, thực thi; clock speed (GHz) nghĩa là gì; vì sao nhiều core không tự động làm chương trình nhanh hơn.
- **Compile vs Interpret:** compiled (C/C++/Rust → machine code, chạy nhanh, phải build lại mỗi OS) vs interpreted (Python/JS → chạy qua interpreter, linh hoạt nhưng chậm) vs **hybrid (Java/C# → bytecode + JIT trên VM)**. Hiểu vì sao Python chậm và vì sao ML lib viết core bằng C/C++.
- **Stack vs Heap (bộ nhớ chương trình):** stack (cấp phát/giải phóng tự động theo lời gọi hàm, nhanh, kích thước cố định, gây *stack overflow* khi đệ quy sâu) vs heap (cấp phát động lúc runtime, linh hoạt, chậm hơn, phải quản lý/GC); biến local nằm ở stack, object lớn nằm ở heap.

**📚 Tài nguyên:**

- **Sách:** *Code: The Hidden Language of Computer Hardware and Software* — Charles Petzold (kinh điển, giải thích từ con số 0 cực dễ hiểu).
- **Sách:** *Computer Systems: A Programmer's Perspective (CS:APP)* — Bryant & O'Hallaron (sâu hơn, dùng làm tham khảo, không cần đọc hết).
- **Khóa học:** **CS50** của Harvard (CS50x trên edX/cs50.harvard.edu) — Week 0-4 phủ binary, memory, C. Miễn phí, có phụ đề.
- **Khóa học:** *Crash Course Computer Science* (YouTube, 40 tập ngắn) — tổng quan tuyệt vời cho người mới.
- **Tiếng Việt:** kênh **Tự học lập trình / Phạm Huy Hoàng (toidicodedao)** blog, và các bài về "máy tính hoạt động thế nào".
- **Tương tác:** [Floating Point Visualizer](https://float.exposed/) để tận mắt thấy IEEE 754.

**🏋️ Bài tập thực hành:**

- Tự tay đổi `42`, `255`, `-7` sang binary và hex bằng giấy, rồi kiểm tra bằng Python: `bin(42)`, `hex(255)`.
- Chạy `print(0.1 + 0.2)` trong Python — giải thích vì sao ra `0.30000000000000004`.
- Viết hàm đệ quy tính giai thừa cực sâu (vd `factorial(100000)`) để **gây stack overflow** và quan sát lỗi.
- Đo: tạo list 10 triệu phần tử bằng vòng lặp Python vs `numpy.arange` — so thời gian, suy ngẫm về compile vs interpret.

**Checklist:**
- [ ] Đổi được decimal ↔ binary ↔ hex bằng tay
- [ ] Giải thích được two's complement và floating point error
- [ ] Phân biệt rõ CPU / RAM / ổ đĩa / cache và tốc độ tương đối
- [ ] Nói rõ compile vs interpret vs JIT, cho ví dụ ngôn ngữ
- [ ] Vẽ được sơ đồ stack vs heap và biết biến nào nằm đâu

---

## 📦 Module 2 — Hệ điều hành cơ bản

**Lý thuyết cốt lõi:**

- **OS làm gì:** lớp trung gian giữa phần cứng và ứng dụng; quản lý CPU, RAM, thiết bị; cung cấp **system call** (cách chương trình "xin" OS đọc file, mở socket...).
- **Process vs Thread:** process = chương trình đang chạy, có không gian bộ nhớ riêng (cô lập, an toàn, tốn tài nguyên khi tạo); thread = luồng thực thi trong process, **chia sẻ bộ nhớ** (nhẹ, nhanh, nhưng dễ race condition). Hiểu để chọn `multiprocessing` vs `threading` trong Python — đặc biệt với **GIL** (vì sao thread Python không tăng tốc CPU-bound).
- **Scheduling:** OS luân phiên chia CPU cho nhiều process (time-slicing); khái niệm context switch (tốn chi phí); preemptive vs cooperative; vì sao máy "đa nhiệm" dù chỉ vài core.
- **Memory management:** virtual memory (mỗi process tưởng mình có cả RAM), paging, swap (khi hết RAM dùng đĩa → chậm); **OOM killer** trên Linux (vì sao process bị "Killed" khi train model).
- **File system:** cây thư mục, đường dẫn tuyệt đối vs tương đối, permission (rwx, `chmod 755`), inode (khái niệm); khác biệt path Windows (`C:\`, `\`) vs Unix (`/`).
- **Khác biệt cho dev:** **Linux** (chuẩn của server/deploy, Docker, hầu hết AI infra) vs **macOS** (Unix-based, dev tốt, đắt) vs **Windows** (phổ biến nhưng hay vướng path/dòng lệnh — **dùng WSL2 để có Linux trong Windows**). Khuyến nghị mạnh: làm quen Linux sớm.

**📚 Tài nguyên:**

- **Sách (miễn phí, vàng):** *Operating Systems: Three Easy Pieces (OSTEP)* — ostep.org. Đọc 3 phần: Virtualization, Concurrency, Persistence.
- **Khóa học:** *MIT 6.S081 / Berkeley CS162* (nâng cao, để dành sau).
- **Thực hành Linux:** [Linux Journey](https://linuxjourney.com/) (miễn phí, từng bước), *The Linux Command Line* — William Shotts (PDF miễn phí, linuxcommand.org).
- **WSL2:** trang chính thức Microsoft Learn — "Install WSL".
- **Tiếng Việt:** tài liệu "Cài đặt WSL2" và series Linux cơ bản trên các blog dev Việt.

**🏋️ Bài tập thực hành:**

- Cài **WSL2 + Ubuntu** (nếu dùng Windows) hoặc dùng máy ảo VirtualBox.
- Mở Task Manager (Windows) / `htop` (Linux) — quan sát process, RAM, CPU theo thời gian thực.
- Viết script Python chạy `multiprocessing` vs `threading` cho tác vụ tính toán nặng — đo và giải thích sự khác biệt (GIL).
- Tạo file, đổi permission bằng `chmod`, thử đọc file không có quyền và quan sát lỗi.

**Checklist:**
- [ ] Giải thích process vs thread + khi nào dùng cái nào
- [ ] Hiểu GIL của Python và hệ quả với CPU-bound
- [ ] Biết virtual memory / swap / OOM là gì
- [ ] Đọc hiểu Linux file permission (rwx, chmod)
- [ ] Cài và dùng được WSL2 hoặc Linux

---

## 📦 Module 3 — Command line / Terminal

**Lý thuyết cốt lõi:**

- **Vì sao dev BẮT BUỘC dùng terminal:** GUI không có cho server; thao tác lặp lại tự động hóa được; mọi công cụ pro (git, docker, ssh, package manager) đều CLI-first; nhanh hơn click chuột rất nhiều.
- **Shell là gì:** chương trình diễn giải lệnh — **bash/zsh** (Linux/macOS) vs **PowerShell** / cmd (Windows). Hiểu prompt, lệnh, argument, flag (`-l`, `--help`).
- **Lệnh điều hướng & file (bash):** `pwd`, `ls -la`, `cd`, `mkdir`, `rm -rf` (cẩn thận!), `cp`, `mv`, `cat`, `less`, `head`/`tail`, `grep`, `find`, `|` (pipe), `>` `>>` (redirect), `*` (wildcard).
- **Tương đương PowerShell:** `Get-Location` (pwd), `Get-ChildItem`/`ls`, `Set-Location`/`cd`, `Copy-Item`, `Remove-Item`, `Select-String` (grep). Biết bash ≠ PowerShell về cú pháp.
- **Biến môi trường (env):** `PATH` (vì sao gõ `python` chạy được), `echo $PATH` (bash) / `$env:PATH` (PowerShell); set tạm thời vs vĩnh viễn; vì sao `.env` quan trọng (API key, config — **không commit lên git**).
- **Tiện ích sống còn:** `man <lệnh>` / `--help`, autocomplete (Tab), history (mũi tên ↑), Ctrl+C (dừng), Ctrl+R (tìm lệnh cũ).

**📚 Tài nguyên:**

- **Sách (miễn phí):** *The Linux Command Line* — William Shotts (linuxcommand.org/tlcl.php).
- **Tương tác:** [learnshell.org](https://www.learnshell.org/), [cmdchallenge.com](https://cmdchallenge.com/) (giải đố bằng lệnh shell — rất vui).
- **MIT:** *The Missing Semester of Your CS Education* (missing-semester-vn cũng có bản dịch tiếng Việt) — phủ shell, scripting, vim, git cực thực dụng.
- **PowerShell:** Microsoft Learn — "PowerShell 101".
- **Cheat sheet:** in ra dán bàn — tìm "Linux command cheat sheet".

**🏋️ Bài tập thực hành:**

- Hoàn thành toàn bộ [cmdchallenge.com](https://cmdchallenge.com/).
- Chỉ dùng terminal (không dùng GUI file explorer): tạo cấu trúc thư mục project, di chuyển file, đổi tên hàng loạt.
- Viết một file `.env`, đọc biến trong Python bằng `os.environ` / thư viện `python-dotenv`.
- Dùng `grep` + pipe để tìm tất cả dòng chứa từ "error" trong một file log.

**Checklist:**
- [ ] Điều hướng & quản lý file hoàn toàn bằng terminal
- [ ] Phân biệt cú pháp bash vs PowerShell
- [ ] Hiểu PATH và cách thêm chương trình vào PATH
- [ ] Dùng pipe `|` và redirect `>` thành thạo
- [ ] Quản lý biến môi trường, biết dùng `.env`

---

## 📦 Module 4 — Mạng máy tính cơ bản

**Lý thuyết cốt lõi:**

- **Client-Server:** client (browser, app) gửi request → server xử lý → trả response; vì sao kiến trúc này là nền của web/API/backend.
- **IP / DNS / Port:** IP (địa chỉ máy, IPv4 `192.168.1.1` vs IPv6); **DNS** dịch tên miền (`google.com`) → IP (giống danh bạ); **port** (cổng dịch vụ — 80 HTTP, 443 HTTPS, 22 SSH, 5432 PostgreSQL); khái niệm `localhost` / `127.0.0.1`.
- **HTTP/HTTPS:** request-response; **HTTP methods** (GET, POST, PUT, DELETE); **status code** (2xx ok, 3xx redirect, 4xx lỗi client, 5xx lỗi server); header, body; HTTPS = HTTP + mã hóa TLS (vì sao quan trọng). Đây là phần backend dùng hằng ngày.
- **TCP vs UDP (mức khái niệm):** TCP (đáng tin cậy, có thứ tự, bắt tay 3 bước — dùng cho web/API/file) vs UDP (nhanh, không đảm bảo — dùng cho video call/game/streaming). Hiểu đánh đổi reliability vs speed.
- **Mô hình phân lớp:** ý tưởng OSI/TCP-IP layer (không cần thuộc lòng 7 lớp, nhưng hiểu dữ liệu được "bọc" qua các lớp).

**📚 Tài nguyên:**

- **Khóa học:** *Computer Networking: A Top-Down Approach* — Kurose & Ross (sách chuẩn ĐH; có khóa video tương ứng).
- **Video:** *Crash Course Computer Science* tập về Internet & WWW; kênh **Practical Networking** (YouTube).
- **Thực hành:** [HTTPBin](https://httpbin.org/) để test request; công cụ **Postman** hoặc **curl**.
- **Tài liệu:** **MDN Web Docs** — phần "HTTP" (developer.mozilla.org) — chuẩn vàng, miễn phí.
- **Tiếng Việt:** bài "DNS là gì", "TCP/IP là gì" trên các blog dev Việt; video của **F8 / Sơn Đặng** phần kiến thức nền web.

**🏋️ Bài tập thực hành:**

- Dùng `ping google.com` và `nslookup google.com` — xem IP và đo độ trễ.
- Gửi request bằng `curl`: `curl -X GET https://httpbin.org/get`, rồi POST có body JSON.
- Mở DevTools trình duyệt (tab Network) → load một trang → quan sát request, status code, header thật.
- Viết server HTTP nhỏ bằng Python (`python -m http.server 8000`) và truy cập `localhost:8000`.

**Checklist:**
- [ ] Giải thích trọn vẹn vòng đời một request từ gõ URL đến nhận trang
- [ ] Hiểu vai trò DNS, IP, port
- [ ] Thuộc các HTTP method và nhóm status code chính
- [ ] Phân biệt TCP vs UDP và khi nào dùng
- [ ] Gửi được request bằng curl/Postman và đọc response

---

## 📦 Module 5 — Chọn & thành thạo ngôn ngữ lập trình chính

> **Chiến lược kép (rất quan trọng cho định hướng của bạn):**
> - **Python** — ngôn ngữ chính cho AI/ML (PyTorch, TensorFlow, pandas, scikit-learn) và backend hiện đại (FastAPI, Django). Dễ học, đọc như tiếng Anh.
> - **Một ngôn ngữ static-typed** — **Java** (backend doanh nghiệp, Android, hệ sinh thái khổng lồ) hoặc **C#** (.NET, game Unity) hoặc **C++** (sát phần cứng, hiểu memory sâu nhất). Học cái này để **hiểu sâu kiểu dữ liệu, bộ nhớ, OOP nghiêm túc** — những thứ Python "giấu" đi.
>
> Khuyến nghị thực dụng: **Python trước (vững), rồi Java** (cân bằng giữa độ nghiêm và tính ứng dụng). Nếu muốn hiểu memory tận gốc thì chọn C++.

**Lý thuyết cốt lõi (áp dụng cho cả 2 ngôn ngữ):**

- **Biến & kiểu dữ liệu:** int, float, string, bool, list/array, dict/map, set, tuple; mutable vs immutable.
- **Typing — khái niệm nền tảng phải hiểu rõ:**
  - **Static typing** (Java/C++): kiểu xác định lúc *compile*, bắt lỗi sớm, IDE gợi ý tốt, code dài hơn.
  - **Dynamic typing** (Python/JS): kiểu xác định lúc *runtime*, viết nhanh, dễ dính lỗi kiểu lúc chạy. (Python có **type hints** + `mypy` để bù đắp — nên dùng.)
  - **Strongly typed** (Python, Java): không tự ngầm đổi kiểu lung tung (`"1" + 1` lỗi).
  - **Weakly typed** (JS, C): tự ép kiểu ngầm (`"1" + 1 = "11"`). Hiểu 2 trục này độc lập nhau.
- **Control flow:** `if/elif/else`, `for`, `while`, `break`/`continue`, switch/match.
- **Hàm (function):** tham số, return, default arg, `*args`/`**kwargs` (Python); function overloading (Java); pass-by-value vs pass-by-reference (xem Module 7).
- **Scope:** local vs global; block scope vs function scope; closure (khái niệm); vì sao biến global nguy hiểm.
- **Error handling:** `try/except/finally` (Python) / `try/catch` (Java); exception vs error; tự định nghĩa exception; **không nuốt lỗi im lặng** (`except: pass` là code smell).
- **I/O:** đọc/ghi file, đọc input người dùng, làm việc với JSON/CSV (cực quan trọng cho cả AI lẫn backend).

**📚 Tài nguyên:**

*Python:*
- **Sách (miễn phí online):** *Automate the Boring Stuff with Python* — Al Sweigart (automatetheboringstuff.com) — hoàn hảo cho người mới, thực dụng.
- **Sách:** *Python Crash Course* — Eric Matthes (dự án thực tế).
- **Docs:** [docs.python.org/3/tutorial](https://docs.python.org/3/tutorial/) — tutorial chính thức.
- **Khóa học:** *CS50's Introduction to Programming with Python* (CS50P, Harvard, miễn phí).
- **Tiếng Việt:** khóa Python của **F8 (fullstack.edu.vn)** — miễn phí, chất lượng, có cộng đồng hỗ trợ.

*Java / static-typed:*
- **Sách:** *Head First Java* (dễ vào, vui) → *Effective Java* — Joshua Bloch (sau khi vững, kinh điển).
- **Docs:** Oracle Java Tutorials (chính thức).
- **C# thay thế:** *C# in Depth*, Microsoft Learn .NET.
- **C++ thay thế:** *A Tour of C++* — Bjarne Stroustrup; learncpp.com (miễn phí, rất tốt).

**🏋️ Bài tập thực hành:**

- Giải 30-50 bài trên [Exercism](https://exercism.org/) (có track Python + Java, có mentor miễn phí) hoặc HackerRank phần "Problem Solving" mức Easy.
- Viết chương trình CLI: máy tính, quản lý todo list lưu ra file JSON, parse một file CSV và tính thống kê.
- **Viết CÙNG một bài toán bằng Python VÀ Java** (vd: đọc CSV, lọc dữ liệu) — cảm nhận khác biệt static vs dynamic typing.
- Cố tình gây các lỗi kiểu (`TypeError`, `NullPointerException`) và học cách đọc stack trace.

**Checklist:**
- [ ] Viết thành thạo biến, control flow, hàm trong Python
- [ ] Giải thích static vs dynamic, strong vs weak typing + cho ví dụ
- [ ] Dùng type hints + mypy trong Python
- [ ] Viết được chương trình tương tự bằng một ngôn ngữ static-typed
- [ ] Xử lý lỗi đúng cách (try/except có ý nghĩa, không nuốt lỗi)
- [ ] Đọc/ghi file, JSON, CSV thành thạo

---

## 📦 Module 6 — Lập trình hướng đối tượng (OOP)

**Lý thuyết cốt lõi:**

- **Class vs Object:** class = bản thiết kế (blueprint), object = thực thể cụ thể (instance); constructor (`__init__` / constructor); thuộc tính (attribute/field) & phương thức (method); `self`/`this`.
- **4 trụ cột:**
  - **Encapsulation (đóng gói):** gom dữ liệu + hành vi, ẩn chi tiết bên trong (private/public), expose qua method; getter/setter; vì sao tránh để state lộ ra ngoài.
  - **Inheritance (kế thừa):** class con kế thừa class cha; `super()`; lợi ích tái dùng nhưng **rủi ro coupling chặt**.
  - **Polymorphism (đa hình):** cùng một interface, nhiều cài đặt khác nhau; method overriding; duck typing trong Python ("nếu nó kêu quạc quạc thì coi như con vịt").
  - **Abstraction (trừu tượng):** ẩn độ phức tạp sau interface đơn giản; chỉ phơi bày cái cần thiết.
- **Interface vs Abstract class:** interface (chỉ định nghĩa "phải có gì", không có cài đặt — Java `interface`, Python `Protocol`/ABC) vs abstract class (có thể có cài đặt một phần); khi nào dùng cái nào.
- **Composition over Inheritance:** vì sao "has-a" (chứa) thường tốt hơn "is-a" (kế thừa); kế thừa sâu nhiều tầng là code smell; ví dụ thực tế.
- **Liên hệ ML/Backend:** PyTorch `nn.Module` là OOP thuần; mọi web framework (Django models, FastAPI) đều OOP. Nắm OOP là bắt buộc.

**📚 Tài nguyên:**

- **Sách:** *Head First Object-Oriented Analysis and Design*; *Effective Java* (phần OOP).
- **Web:** [refactoring.guru](https://refactoring.guru/) — giải thích OOP + design patterns cực trực quan (có hình minh họa).
- **Python OOP:** Real Python — series "Object-Oriented Programming in Python".
- **Tiếng Việt:** bài giảng OOP của **F8** và các bài "4 tính chất OOP" trên blog dev Việt (cẩn thận: nhiều bài Việt giải thích sai/máy móc — đối chiếu nguồn Anh).

**🏋️ Bài tập thực hành:**

- Mô hình hóa một hệ thống đời thực bằng class: `BankAccount` (deposit/withdraw, encapsulate balance), `Animal → Dog/Cat` (inheritance + polymorphism), `Shape → Circle/Rectangle` (abstract + tính area).
- Refactor một đoạn code dùng kế thừa sâu thành composition.
- Cài cùng một interface `PaymentMethod` với nhiều implementation (CreditCard, Momo, PayPal).

**Checklist:**
- [ ] Định nghĩa và dùng class/object thành thạo (Python + Java)
- [ ] Giải thích rõ 4 trụ cột + ví dụ code cho từng cái
- [ ] Phân biệt interface vs abstract class + khi nào dùng
- [ ] Hiểu và áp dụng được composition over inheritance
- [ ] Nhận ra OOP trong code framework thực tế (PyTorch/Django)

---

## 📦 Module 7 — Quản lý bộ nhớ & cơ chế thực thi

**Lý thuyết cốt lõi:**

- **Value vs Reference:** value type (int, bool — copy giá trị) vs reference type (object, list — copy địa chỉ); **bug kinh điển**: sửa list trong hàm làm thay đổi list gốc; `is` vs `==` trong Python.
- **Pass-by-value vs pass-by-reference:** Python truyền "object reference by value" (gây bối rối — giải thích kỹ); Java tương tự; C++ có cả hai (`&`, con trỏ).
- **Con trỏ & tham chiếu (C/C++):** con trỏ là gì (biến chứa địa chỉ bộ nhớ), `*` (dereference), `&` (lấy địa chỉ); vì sao dangling pointer/null pointer nguy hiểm; hiểu cái này giúp hiểu *mọi* ngôn ngữ khác.
- **Garbage Collection (GC):** Python (reference counting + cycle detector), Java/C# (GC theo generation); ưu điểm (không lo memory leak thủ công) vs nhược (pause, tốn CPU, không kiểm soát thời điểm); vì sao **vẫn có memory leak** dù có GC (giữ reference không cần thiết, cache vô hạn).
- **Quản lý thủ công vs tự động:** C/C++ (`malloc`/`free`, `new`/`delete` — mạnh nhưng dễ lỗi) vs Rust (ownership — không GC mà vẫn an toàn) vs GC languages.
- **Liên hệ AI/Backend:** vì sao train model bị OOM (tensor giữ trên GPU); vì sao backend bị memory leak (connection không đóng); `del`, `gc.collect()`, context manager (`with`).

**📚 Tài nguyên:**

- **Sách:** *Computer Systems: A Programmer's Perspective* (chương memory); learncpp.com (phần pointers — hiểu con trỏ tốt nhất qua C++).
- **Python memory:** Real Python — "Memory Management in Python"; tài liệu về `id()`, `is`, reference counting.
- **Java GC:** Oracle docs về Garbage Collection; bài blog về JVM heap.
- **Visualizer:** [Python Tutor](https://pythontutor.com/) — **CỰC KỲ KHUYẾN NGHỊ** — xem từng bước biến/object trong bộ nhớ một cách trực quan.

**🏋️ Bài tập thực hành:**

- Trên [Python Tutor](https://pythontutor.com/): chạy code sửa list trong hàm, quan sát reference; chạy code có biến trỏ cùng object.
- Viết code minh họa bug "mutable default argument" của Python (`def f(x=[])`) và giải thích.
- (Nếu học C/C++) viết chương trình dùng con trỏ, cố tình tạo dangling pointer, dùng Valgrind phát hiện leak.
- Tạo một vòng tham chiếu (circular reference) trong Python và quan sát GC xử lý.

**Checklist:**
- [ ] Giải thích value vs reference + viết được ví dụ bug kinh điển
- [ ] Hiểu Python truyền tham số kiểu gì
- [ ] Hiểu con trỏ là gì (dù không dùng C hằng ngày)
- [ ] Giải thích GC hoạt động thế nào + vì sao vẫn leak được
- [ ] Dùng context manager (`with`) để quản lý tài nguyên đúng cách

---

## 📦 Module 8 — Clean Code & nguyên tắc thiết kế

> Code chạy được chỉ là mức tối thiểu. Code mà **người khác (và bạn 6 tháng sau) đọc hiểu, sửa được** mới là kỹ năng phân biệt junior với senior. Đây là module nhà tuyển dụng đánh giá cao nhất.

**Lý thuyết cốt lõi:**

- **Đặt tên (naming):** tên biến/hàm phải nói rõ ý định (`elapsed_time_seconds` thay vì `t`); tránh viết tắt khó hiểu; quy ước (snake_case Python, camelCase Java); tên hàm là động từ, tên class là danh từ.
- **Hàm nhỏ, một nhiệm vụ:** mỗi hàm làm đúng một việc; ít tham số; tránh hàm 200 dòng; tránh side effect ẩn.
- **DRY (Don't Repeat Yourself):** không copy-paste logic; trích xuất thành hàm/module. Nhưng **cảnh báo**: DRY quá đà tạo abstraction sai cũng tệ — "duplication tốt hơn abstraction sai".
- **KISS (Keep It Simple):** giải pháp đơn giản nhất hoạt động được; tránh over-engineering.
- **YAGNI (You Aren't Gonna Need It):** đừng viết tính năng "phòng khi sau này cần"; chỉ làm cái đang thực sự cần.
- **SOLID (5 nguyên tắc OOP — giải thích từng cái):**
  - **S — Single Responsibility:** mỗi class chỉ có một lý do để thay đổi.
  - **O — Open/Closed:** mở để mở rộng, đóng để sửa đổi (thêm tính năng không phải sửa code cũ).
  - **L — Liskov Substitution:** class con phải thay thế được class cha mà không vỡ logic.
  - **I — Interface Segregation:** nhiều interface nhỏ chuyên biệt hơn một interface khổng lồ.
  - **D — Dependency Inversion:** phụ thuộc vào abstraction, không vào implementation cụ thể (nền của dependency injection — cực quan trọng cho backend testable).
- **Code smells:** hàm quá dài, class "god object", magic number, comment giải thích code tệ (thay vì viết code rõ), nesting sâu, biến global, dead code.
- **Comment đúng cách:** giải thích *vì sao* chứ không phải *cái gì* (code đã nói cái gì rồi).

**📚 Tài nguyên:**

- **Sách (kinh điển bắt buộc):** *Clean Code* — Robert C. Martin (đọc có chọn lọc, một số ý gây tranh cãi — đọc kèm tư duy phản biện).
- **Sách:** *The Pragmatic Programmer* — Hunt & Thomas (tuyệt vời, thực dụng hơn Clean Code).
- **Sách:** *Refactoring* — Martin Fowler (cách cải thiện code có hệ thống).
- **Web:** [refactoring.guru](https://refactoring.guru/) — phần Code Smells + Refactoring + SOLID + Design Patterns.
- **Phản biện:** đọc thêm bài "It's probably time to stop recommending Clean Code" để có góc nhìn cân bằng — không có quy tắc nào tuyệt đối.
- **Tiếng Việt:** series "Clean Code" và "SOLID" trên blog **toidicodedao** (Phạm Huy Hoàng) — giải thích dễ hiểu.

**🏋️ Bài tập thực hành:**

- Lấy một file code cũ của chính bạn (vd bài tập Module 5), refactor: đổi tên rõ ràng, tách hàm nhỏ, bỏ lặp.
- Tìm một repo nhỏ trên GitHub, nhận diện 5 code smell và đề xuất cách sửa.
- Viết một class vi phạm SOLID, rồi refactor cho tuân thủ — ghi lại trước/sau.
- Áp dụng Dependency Inversion: viết service nhận database qua interface, inject mock khi test.

**Checklist:**
- [ ] Đặt tên biến/hàm/class rõ ràng theo quy ước
- [ ] Viết hàm nhỏ, một nhiệm vụ
- [ ] Giải thích được DRY, KISS, YAGNI + biết khi nào KHÔNG áp dụng máy móc
- [ ] Giải thích từng chữ trong SOLID + cho ví dụ code
- [ ] Nhận diện được code smell phổ biến
- [ ] Refactor code tệ thành code sạch một cách có hệ thống

---

## 📦 Module 9 — Công cụ dev cơ bản

**Lý thuyết cốt lõi:**

- **IDE / Editor — VS Code:** cài đặt, extension thiết yếu (Python, Pylance, GitLens, Error Lens); IntelliSense (autocomplete), go-to-definition (F12), rename symbol, command palette (Ctrl+Shift+P); integrated terminal; settings.json. (Nâng cao sau: PyCharm cho Python, IntelliJ cho Java.)
- **Debugger — kỹ năng sống còn (đừng chỉ `print`):** breakpoint, step over / step into / step out, watch variable, call stack, conditional breakpoint; cách debug trong VS Code; vì sao debugger nhanh hơn print gấp nhiều lần. **Đây là skill phân biệt dev xịn.**
- **Package manager:** **pip** (Python — cài thư viện từ PyPI, `requirements.txt`), **npm** (JavaScript/Node), Maven/Gradle (Java); semantic versioning (`1.2.3`); lock file (vì sao cần để reproducible).
- **Virtual environment (Python — BẮT BUỘC hiểu):** vì sao cần cô lập dependency mỗi project (tránh "dependency hell"); `venv`, `virtualenv`; công cụ hiện đại **`uv`** (2026, cực nhanh, thay pip+venv) hoặc `poetry`/`conda` (conda phổ biến trong ML để quản cả Python lẫn CUDA); kích hoạt/thoát môi trường.
- **Khác:** linter (flake8/ruff), formatter (black — tự format code), `.gitignore` (xem mảng 03 Git).

**📚 Tài nguyên:**

- **VS Code:** docs chính thức code.visualstudio.com — "Getting Started" + "Python in VS Code".
- **Debugger:** VS Code docs "Debugging"; tìm video "VS Code Python debugging tutorial".
- **pip/venv:** docs.python.org — "venv"; packaging.python.org.
- **uv (mới, đáng học 2026):** docs.astral.sh/uv — package/env manager siêu nhanh đang thành chuẩn mới.
- **conda (cho ML):** docs.anaconda.com.
- **Tiếng Việt:** video "Cài đặt VS Code cho Python" và "Virtual environment là gì" trên YouTube dev Việt / F8.

**🏋️ Bài tập thực hành:**

- Cài VS Code + extension Python, cấu hình formatter (black/ruff) tự chạy khi lưu.
- Tạo virtual environment bằng `venv` (và thử cả `uv`), cài `requests`, ghi `requirements.txt`, tái tạo môi trường ở thư mục khác.
- Đặt breakpoint trong một chương trình có bug, dùng debugger từng bước tìm ra lỗi (KHÔNG dùng print).
- Tạo conditional breakpoint chỉ dừng khi biến đạt giá trị nhất định.

**Checklist:**
- [ ] Dùng VS Code thành thạo: navigation, IntelliSense, command palette
- [ ] **Debug bằng breakpoint thay vì print**
- [ ] Hiểu và dùng pip + requirements.txt
- [ ] Tạo và quản lý virtual environment (venv/uv/conda)
- [ ] Cấu hình formatter + linter cho project

---

## 🛠️ Project thực hành cuối mảng

> Làm ít nhất **1 project**, làm được cả 2 thì rất tốt. Mục tiêu: ép bạn dùng *gần hết* kiến thức 9 module trong một bài thực tế.

### Project 1 — CLI Expense Tracker (Quản lý chi tiêu bằng dòng lệnh)
- **Yêu cầu:** ứng dụng terminal cho thêm/sửa/xóa/liệt kê khoản chi; lưu vào file JSON; tính thống kê (tổng theo tháng, theo danh mục).
- **Phủ kiến thức:** terminal (M3), Python OOP (M5,6) — class `Expense`, `ExpenseManager`; file I/O + JSON (M5); error handling; clean code + SOLID (M8); venv + git (M9); debugger khi có bug.
- **Nâng cấp:** viết lại phần core bằng Java/C# để so sánh static vs dynamic typing.

### Project 2 — Mini HTTP Server / URL Health Checker
- **Yêu cầu:** chương trình nhận danh sách URL, gửi HTTP request kiểm tra trạng thái (status code, thời gian phản hồi), in báo cáo; thêm chế độ chạy đa luồng để hiểu thread vs process.
- **Phủ kiến thức:** mạng/HTTP (M4), process/thread + GIL (M2), value/reference (M7), package manager (`requests`, M9), clean code (M8).

---

## ⚠️ Lỗi & hiểu lầm thường gặp

- **"Học framework là đủ, bỏ qua nền tảng."** → Sai. Không có nền tảng, bạn debug mò mẫm và mãi không lên senior. Framework đến rồi đi, nền tảng ở lại.
- **Nhầm `=` (gán) với `==` (so sánh)** và nhầm value vs reference → nguồn bug số 1 của người mới.
- **Tưởng float chính xác tuyệt đối** → `0.1 + 0.2 != 0.3`; không bao giờ dùng float cho tiền tệ (dùng `Decimal`).
- **Lạm dụng kế thừa** thay vì composition → tạo cây class rối, khó sửa.
- **Nuốt lỗi:** `except: pass` → lỗi bị giấu, debug ác mộng. Luôn xử lý hoặc log có ý nghĩa.
- **Không dùng virtual environment** → cài thư viện lung tung vào Python hệ thống, "dependency hell", vỡ máy.
- **Debug bằng `print` mọi lúc** → chậm và bừa. Học debugger.
- **Học thụ động (chỉ xem video không code)** → "tutorial hell". Phải tự gõ, tự gây lỗi, tự sửa.
- **Nghĩ Clean Code là luật tuyệt đối** → mọi nguyên tắc đều có ngoại lệ; ưu tiên tính rõ ràng và bối cảnh thực tế.
- **Học cùng lúc quá nhiều thứ** → loãng. Vững Python trước rồi mới mở rộng.

---

## ✅ Checklist tự đánh giá tổng

Tick hết = sẵn sàng sang mảng tiếp theo. Nếu còn ô trống, quay lại module tương ứng.

- [ ] Giải thích trọn vẹn hành trình của code: source → (compile/interpret) → CPU/RAM → kết quả
- [ ] Phân biệt rành mạch stack vs heap, process vs thread, value vs reference
- [ ] Dùng terminal (bash + PowerShell) tự tin cho mọi thao tác file & môi trường
- [ ] Giải thích một request HTTP đi từ trình duyệt đến server và quay về
- [ ] Viết chương trình hoàn chỉnh bằng Python (vững) + đọc hiểu/viết cơ bản một ngôn ngữ static-typed
- [ ] Phân biệt static/dynamic, strong/weak typing với ví dụ
- [ ] Thiết kế bằng OOP và giải thích 4 trụ cột + SOLID có ví dụ
- [ ] Hiểu GC và quản lý bộ nhớ; tránh được memory leak cơ bản
- [ ] Viết code sạch: tên rõ, hàm nhỏ, không lặp, không code smell
- [ ] Set up môi trường dev pro: VS Code + debugger + venv + package manager
- [ ] Hoàn thành ít nhất 1 project cuối mảng và đẩy lên GitHub

---

## 🔗 Học gì tiếp theo

Khi đã vững mảng này, đi tiếp theo thứ tự đề xuất:

- **➡️ [02 — Giải thuật & Cấu trúc dữ liệu](02-giai-thuat-ctdl.md)** — Big-O, array/linked list/stack/queue/tree/graph/hash table, sorting, searching, đệ quy, dynamic programming. **Bắt buộc** cho cả phỏng vấn lẫn viết code hiệu quả (đặc biệt AI/ML xử lý dữ liệu lớn).
- **➡️ [03 — Git & Quản lý mã nguồn](03-git-github.md)** — version control, branch/merge/rebase, GitHub workflow, pull request. Học **song song ngay từ Module 9** — dùng git để lưu mọi project ở trên.

> **Gợi ý lộ trình:** học mảng 01 này → bắt đầu 03 Git ngay khi tới Module 9 (dùng git cho project) → rồi dồn lực cho 02 Giải thuật. Sau đó mới rẽ nhánh sâu vào AI/ML hoặc Backend tùy mục tiêu.

---

*Chúc bạn học vui và kiên trì. Nền tảng vững thì xây cao tới đâu cũng không sợ sập. 🚀*
