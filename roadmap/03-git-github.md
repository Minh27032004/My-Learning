# 🌿 Lộ trình học Git & GitHub (từ cơ bản đến nâng cao)

> "Code mà không dùng Git giống như leo núi không có dây bảo hiểm: đi được, nhưng ngã một phát là mất trắng."

Git là **kỹ năng sống còn** của mọi kỹ sư phần mềm — không phải kỹ năng "phụ". Dù bạn theo AI/ML hay Backend, bạn sẽ dùng Git **mỗi ngày, suốt sự nghiệp**:

- **Lưu lịch sử**: quay lại bất kỳ phiên bản nào của code, không sợ "sửa hỏng là mất".
- **Cộng tác nhóm**: nhiều người sửa cùng 1 project mà không đè lên nhau.
- **Hồ sơ nhà tuyển dụng**: GitHub profile chính là CV sống của dev. Recruiter **luôn** xem GitHub của bạn.
- **Thử nghiệm an toàn**: tạo branch để thử ý tưởng AI/ML mới, hỏng thì xóa branch, code chính vẫn nguyên.
- **Hạ tầng MLOps/DevOps**: CI/CD, deploy, reproduce experiment đều khởi nguồn từ Git.

👉 **Lời khuyên thẳng thắn**: Hãy học Git **SỚM** và **dùng liên tục cho MỌI project nhỏ** (kể cả bài tập 1 file). Đừng đợi "project lớn rồi mới học" — vì lúc đó áp lực deadline sẽ khiến bạn dùng Git theo kiểu copy-paste lệnh mà không hiểu, rất dễ làm mất code. Hiểu cơ chế từ đầu mới là khoản đầu tư tốt nhất.

---

## 🎯 Mục tiêu sau lộ trình

Hoàn thành xong, bạn sẽ:

- Hiểu **cơ chế bên dưới** của Git (3 khu vực, commit là snapshot, hash SHA, HEAD) chứ không học vẹt lệnh.
- Tự tin làm các thao tác hằng ngày: `add`, `commit`, `branch`, `merge`, `push`, `pull`.
- **Xử lý merge conflict** không hoảng loạn.
- Biết **undo** mọi tình huống: lỡ commit sai, lỡ `reset --hard`, lỡ push nhầm, xóa nhầm branch.
- Dùng `rebase`, `cherry-pick`, `stash`, `reflog` như dân chuyên nghiệp.
- Cộng tác qua **Pull Request**, code review, và áp dụng branching strategy phù hợp.
- Dựng được **GitHub profile gây ấn tượng** với nhà tuyển dụng.

---

## 🧱 Yêu cầu trước (prerequisites)

- Biết dùng **terminal/command line** cơ bản (`cd`, `ls`/`dir`, `mkdir`, `pwd`). Nếu chưa, học 1-2 tiếng về CLI trước.
- Có 1 trình soạn thảo (khuyến nghị **VS Code**).
- Tài khoản **GitHub** (miễn phí — tạo tại https://github.com).
- **KHÔNG cần** biết ngôn ngữ lập trình nào cụ thể — Git làm việc với mọi loại file.

---

## ⏱️ Ước lượng thời gian

| Mức độ | Module | Thời gian |
|---|---|---|
| Cơ bản (bắt buộc) | 1 → 5 | ~10–15 giờ học + thực hành |
| Trung cấp | 6 → 7 | ~8–10 giờ |
| Nâng cao / nghề nghiệp | 8 → 10 | ~10 giờ + làm project |
| **Tổng** | | **~1 tháng** nếu học đều ~1h/ngày |

> Quan trọng hơn số giờ: **dùng Git cho mọi project thật**. Cơ bắp Git được xây bằng lặp lại, không phải bằng đọc.

---

# 📦 Các Module

---

## Module 1 — Git là gì & vì sao cần. Cài đặt & cấu hình

### 1.1. Lý thuyết

**Version Control System (VCS)** = hệ thống quản lý phiên bản: ghi lại từng thay đổi của file theo thời gian để bạn có thể xem lại, so sánh, và quay về phiên bản cũ.

**Git vs GitHub — đừng nhầm lẫn (lỗi kinh điển của người mới):**

| | **Git** | **GitHub** |
|---|---|---|
| Bản chất | Phần mềm chạy trên máy bạn (CLI) | Dịch vụ web (cloud) host repo Git |
| Ai tạo | Linus Torvalds (2005) | Công ty (nay thuộc Microsoft) |
| Cần internet? | Không (chạy offline) | Có |
| Vai trò | Công cụ quản lý phiên bản | Nơi lưu trữ + cộng tác (PR, Issues, CI) |
| Thay thế bằng | — | GitLab, Bitbucket, Gitea... |

> **Ẩn dụ**: Git là "máy ảnh + album" trên máy bạn. GitHub là "ổ cứng đám mây + mạng xã hội" để chia sẻ album đó. Bạn có thể dùng Git mà không cần GitHub.

**Mô hình phân tán (distributed):** Khác với các VCS cũ (SVN — tập trung, phải online mới commit được), Git là **distributed**: **mỗi máy clone về có TOÀN BỘ lịch sử repo** (full copy). Hệ quả:

- Commit, xem log, tạo branch... **offline được hết** → nhanh.
- Không có "máy chủ trung tâm bắt buộc" — server chết, mỗi dev vẫn giữ bản đầy đủ.
- An toàn: lịch sử được nhân bản trên nhiều máy.

### 1.2. Cài đặt

```bash
# Kiểm tra đã cài chưa
git --version
# Ví dụ output: git version 2.45.0
```

- **Windows**: tải tại https://git-scm.com → cài kèm "Git Bash" (terminal kiểu Unix, rất nên dùng).
- **macOS**: `brew install git` hoặc cài Xcode Command Line Tools.
- **Linux**: `sudo apt install git` (Debian/Ubuntu) / `sudo dnf install git` (Fedora).

### 1.3. Cấu hình lần đầu (BẮT BUỘC làm ngay sau khi cài)

```bash
# Đặt tên & email — sẽ gắn vào MỌI commit của bạn (như chữ ký)
git config --global user.name "Tran Nhat Minh"
git config --global user.email "nhatminhtran104@gmail.com"

# Đặt editor mặc định (VS Code) — dùng khi Git cần bạn nhập text dài
git config --global core.editor "code --wait"

# Đặt tên branch mặc định là 'main' (chuẩn hiện đại, thay cho 'master' cũ)
git config --global init.defaultBranch main

# Xem lại toàn bộ cấu hình
git config --list
```

**Cơ chế bên dưới:** `--global` ghi vào file `~/.gitconfig` (Windows: `C:\Users\PC\.gitconfig`), áp dụng cho mọi repo. Có 3 cấp config (ưu tiên tăng dần): `--system` (cả máy) → `--global` (user) → `--local` (riêng 1 repo, ghi vào `.git/config`). Repo cụ thể có thể override global.

> ⚠️ **Email rất quan trọng**: GitHub dùng email trong commit để gắn commit vào tài khoản bạn (tạo "ô xanh" contribution). Email sai = commit không tính vào profile.

### 1.4. SSH key (để push/pull không phải gõ mật khẩu mỗi lần)

Có 2 cách kết nối tới GitHub: **HTTPS** (dễ, dùng Personal Access Token) và **SSH** (khuyến nghị cho lâu dài).

```bash
# 1. Tạo SSH key mới (ed25519 — thuật toán hiện đại, an toàn)
ssh-keygen -t ed25519 -C "nhatminhtran104@gmail.com"
# Nhấn Enter để dùng đường dẫn mặc định (~/.ssh/id_ed25519)
# Có thể đặt passphrase hoặc để trống

# 2. Khởi động ssh-agent và add key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 3. Copy public key (phần .pub) để dán lên GitHub
cat ~/.ssh/id_ed25519.pub
# Copy toàn bộ output → GitHub → Settings → SSH and GPG keys → New SSH key → dán

# 4. Test kết nối
ssh -T git@github.com
# Thành công: "Hi <username>! You've successfully authenticated..."
```

**Cơ chế:** SSH dùng cặp khóa **public/private**. Bạn đưa **public key** cho GitHub, giữ **private key** trên máy. Khi push, máy bạn "ký" bằng private key, GitHub xác thực bằng public key tương ứng → không cần mật khẩu. **TUYỆT ĐỐI không** chia sẻ file `id_ed25519` (không có `.pub`).

### 🏋️ Bài tập Module 1

1. Cài Git, chạy `git --version`.
2. Cấu hình `user.name`, `user.email`, kiểm tra bằng `git config --list`.
3. Tạo SSH key và add lên GitHub, chạy `ssh -T git@github.com` thành công.

### ✅ Checklist Module 1

- [ ] Phân biệt được Git vs GitHub bằng lời của mình
- [ ] Giải thích được "distributed" nghĩa là gì
- [ ] Đã cấu hình `user.name` + `user.email`
- [ ] Đã tạo và add SSH key, test kết nối thành công

---

## Module 2 — Cơ chế cốt lõi (HIỂU CÁI NÀY = HIỂU GIT)

> 🧠 Đây là module **quan trọng nhất**. 90% người dùng Git "sợ Git" vì bỏ qua phần này và học vẹt lệnh. Đọc kỹ.

### 2.1. Ba khu vực (The Three Areas)

Git tổ chức công việc qua 3 vùng:

```
 Working Directory          Staging Area (Index)          Repository (.git)
 (thư mục làm việc)          (vùng chờ commit)            (kho lưu vĩnh viễn)
        │                            │                            │
        │  git add <file>            │      git commit            │
        ├───────────────────────────►├───────────────────────────►│
        │                            │                            │
        │◄──────────────────────────────────────────────────────┤
        │              git checkout / git restore                 │
```

| Khu vực | Là gì | Lệnh đưa file vào |
|---|---|---|
| **Working Directory** | Các file bạn đang sửa, thấy bằng mắt | (bạn edit trực tiếp) |
| **Staging Area / Index** | Vùng "tạm" gom thay đổi sẽ vào commit kế tiếp | `git add` |
| **Repository** | Lịch sử commit đã lưu vĩnh viễn trong `.git/` | `git commit` |

> **Tại sao có Staging Area?** Đây là điểm thiên tài của Git: nó cho bạn **chọn lọc** chính xác thay đổi nào vào commit nào. Sửa 5 file nhưng chỉ muốn commit 2 file liên quan tới 1 tính năng? `git add` đúng 2 file đó thôi. Commit vì thế gọn gàng, có ý nghĩa.

### 2.2. Vòng đời file (file lifecycle)

```
Untracked ──(git add)──► Staged ──(git commit)──► Committed/Unmodified
    ▲                                                      │
    │                                                  (edit file)
    │                                                      ▼
    └──────────────── Modified ◄───────────────────────────
                          │
                      (git add)
                          ▼
                       Staged
```

- **Untracked**: file mới, Git chưa từng biết tới.
- **Modified**: file đã được track nhưng vừa bị sửa, chưa stage.
- **Staged**: đã `git add`, sẵn sàng vào commit.
- **Committed (Unmodified)**: đã lưu an toàn trong repo, khớp với bản commit gần nhất.

### 2.3. Commit là gì?

Một **commit** KHÔNG phải là "diff/thay đổi" như nhiều người nghĩ. Commit là một **snapshot (ảnh chụp) toàn bộ trạng thái project** tại thời điểm đó. Mỗi commit chứa:

- **Snapshot** của các file (thực ra Git tối ưu: file không đổi thì trỏ tới bản cũ, không copy lại).
- **Metadata**: tác giả, email, thời gian, commit message.
- **Con trỏ tới commit cha (parent)** → tạo thành chuỗi lịch sử.
- Một **hash SHA-1** (40 ký tự hex, ví dụ `a3f5e9c...`) là **định danh duy nhất**, tính từ nội dung. Đổi 1 ký tự nội dung → hash khác hoàn toàn. Đây là cách Git đảm bảo toàn vẹn dữ liệu.

```bash
# Xem 1 commit và hash của nó
git log --oneline -1
# Ví dụ: a3f5e9c (HEAD -> main) Add login feature
#        ^^^^^^^ 7 ký tự đầu của hash SHA, đủ để định danh
```

### 2.4. HEAD là gì?

**HEAD** là một con trỏ đặc biệt, chỉ tới "**bạn đang đứng ở đâu**" trong lịch sử — thường là commit mới nhất của branch hiện tại.

```bash
cat .git/HEAD
# Output: ref: refs/heads/main   → HEAD đang trỏ tới branch main
```

- `HEAD` = commit hiện tại.
- `HEAD~1` (hoặc `HEAD^`) = commit cha (lùi 1 bước).
- `HEAD~3` = lùi 3 commit.

Hiểu HEAD là chìa khóa để dùng `reset`, `rebase`, `checkout` sau này.

### 🏋️ Bài tập Module 2

1. Tạo thư mục, `git init`, tạo 1 file. Chạy `git status` — file ở trạng thái nào? (Untracked)
2. `git add file` → `git status` lại → trạng thái gì? (Staged)
3. `git commit` → `git status` → trạng thái gì? Sửa file → `git status` → (Modified).
4. Mở file `.git/HEAD` bằng editor, đọc nội dung, giải thích nó trỏ đi đâu.

### ✅ Checklist Module 2

- [ ] Vẽ lại được sơ đồ 3 khu vực và lệnh chuyển giữa chúng
- [ ] Giải thích 4 trạng thái file
- [ ] Hiểu commit là **snapshot + hash + parent**, không phải "diff"
- [ ] Biết HEAD là gì, `HEAD~1` nghĩa là gì

---

## Module 3 — Thao tác cơ bản hằng ngày

### 3.1. Khởi tạo & lấy repo

```bash
# Biến thư mục hiện tại thành Git repo (tạo thư mục ẩn .git/)
git init

# Sao chép 1 repo có sẵn từ remote về máy (kèm toàn bộ lịch sử)
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git   # bằng SSH
```

**Cơ chế:** `git init` tạo thư mục `.git/` — "bộ não" chứa toàn bộ object, branch, config. Xóa `.git/` = mất hết lịch sử Git (file vẫn còn). `git clone` = `init` + tải toàn bộ history + tự set remote tên `origin`.

### 3.2. Vòng lặp cơ bản: status → add → commit

```bash
# Xem trạng thái hiện tại (DÙNG LIÊN TỤC — đây là lệnh bạn gõ nhiều nhất)
git status

# Stage 1 file
git add index.html

# Stage tất cả file thay đổi
git add .

# Stage có chọn lọc từng phần (hunk) trong file — công cụ pro
git add -p

# Commit với message ngắn
git commit -m "Add navigation bar"

# Commit kèm message dài (mở editor để viết title + body)
git commit
```

### 3.3. Xem lịch sử & khác biệt

```bash
# Lịch sử đầy đủ
git log

# Gọn 1 dòng/commit (DÙNG NHIỀU NHẤT)
git log --oneline

# Có đồ thị branch
git log --oneline --graph --all

# Xem khác biệt: Working Directory vs Staging (thay đổi CHƯA add)
git diff

# Xem khác biệt: Staging vs commit cuối (thay đổi ĐÃ add, chờ commit)
git diff --staged

# Xem ai sửa dòng nào (điều tra bug)
git blame index.html
```

**Phân biệt `git diff` thường xuyên nhầm:** `git diff` (không tham số) chỉ hiện thay đổi **chưa stage**. Sau khi `git add`, muốn xem lại phải dùng `git diff --staged`.

### 3.4. `.gitignore` — bỏ qua file không nên track

Tạo file tên `.gitignore` ở gốc repo, liệt kê các pattern file/thư mục Git nên **lờ đi** (không track, không commit):

```gitignore
# Dependencies
node_modules/
venv/
__pycache__/

# Biến môi trường & secret — TUYỆT ĐỐI không commit
.env
*.key
config/secrets.yml

# File build / tạm
dist/
build/
*.log

# File của IDE / OS
.vscode/
.DS_Store

# AI/ML: dữ liệu lớn, model nặng, checkpoint
data/raw/
*.h5
*.ckpt
*.pkl
```

**Cơ chế quan trọng:** `.gitignore` **chỉ có tác dụng với file CHƯA được track**. Nếu file đã lỡ commit rồi mới thêm vào `.gitignore`, Git vẫn tiếp tục track. Phải gỡ thủ công:

```bash
# Gỡ file khỏi tracking nhưng giữ lại trên đĩa
git rm --cached .env
git commit -m "Stop tracking .env"
```

> 💡 Lấy template `.gitignore` chuẩn cho mọi ngôn ngữ tại https://github.com/github/gitignore (ví dụ `Python.gitignore` đã có sẵn đủ thứ cho AI/ML).

### 3.5. Viết commit message TỐT

Commit message tệ (`fix`, `update`, `asdf`) khiến lịch sử vô dụng. Quy ước phổ biến:

- **Dòng 1 (title)**: ≤ 50 ký tự, viết ở **thể mệnh lệnh** (imperative): "Add", "Fix", "Remove" — không phải "Added", "Fixing".
- Dòng trống.
- **Body** (tùy chọn): giải thích **TẠI SAO** thay đổi, không phải "cái gì" (code đã nói cái gì).

```bash
git commit -m "Fix login redirect loop on expired token"

# Hoặc đầy đủ:
git commit
# Title: Fix login redirect loop on expired token
#
# Body:  Token hết hạn khiến middleware redirect vô hạn về /login.
#        Thêm kiểm tra refresh token trước khi redirect.
```

### 🏋️ Bài tập Module 3

1. Tạo repo mới, viết file `README.md`, commit lần đầu với message tử tế.
2. Tạo `.gitignore` chặn thư mục `node_modules/` và file `.env`. Tạo thử 2 file/thư mục đó, chạy `git status` để xác nhận Git lờ chúng.
3. Sửa README, dùng `git diff` xem thay đổi trước khi `git add`. Sau khi add, dùng `git diff --staged`.
4. Thực hiện 5 commit, xem `git log --oneline --graph`.

### ✅ Checklist Module 3

- [ ] Thành thạo vòng lặp `status → add → commit`
- [ ] Phân biệt `git diff` vs `git diff --staged`
- [ ] Viết được `.gitignore` và hiểu vì sao nó không gỡ file đã track
- [ ] Viết commit message theo chuẩn imperative

---

## Module 4 — Branch & Merge

### 4.1. Branch là gì?

**Branch** = một con trỏ (pointer) di động tới một commit. Nó **siêu nhẹ** (chỉ là 1 file chứa 1 hash 40 ký tự) — nên tạo branch trong Git cực nhanh và rẻ, không như copy thư mục.

Branch cho phép bạn phát triển tính năng song song mà không ảnh hưởng `main`.

```bash
# Liệt kê branch (dấu * = branch hiện tại)
git branch

# Tạo branch mới (chưa chuyển sang)
git branch feature-login

# Chuyển sang branch (lệnh CŨ, vẫn dùng được)
git checkout feature-login

# Lệnh MỚI (Git 2.23+), rõ nghĩa hơn — KHUYẾN NGHỊ dùng:
git switch feature-login

# Tạo + chuyển sang luôn (1 lệnh)
git switch -c feature-login      # mới
git checkout -b feature-login    # cũ, tương đương

# Xóa branch (sau khi đã merge)
git branch -d feature-login

# Xóa branch ÉP (chưa merge — cẩn thận)
git branch -D feature-login
```

> 💡 **Vì sao có `switch`/`restore` mới?** Lệnh `checkout` cũ làm QUÁ nhiều việc (đổi branch, khôi phục file, tạo branch...) gây rối cho người mới. Git tách ra: `git switch` chuyên đổi branch, `git restore` chuyên khôi phục file. Nên dùng cặp mới cho rõ ràng.

### 4.2. Merge — gộp branch

```bash
# Về branch đích (thường là main) trước
git switch main

# Gộp feature-login vào main
git merge feature-login
```

**Hai kiểu merge — phải hiểu khác biệt:**

**a) Fast-forward merge** — xảy ra khi `main` KHÔNG có commit mới nào kể từ lúc tách branch. Git chỉ cần "đẩy con trỏ main tiến lên" tới commit của branch. Không tạo commit merge mới.

```
Trước:  main → A
                \
        feature → A → B → C

FF:     main ────────────► C   (main "đuổi kịp" feature)
        feature ─────────► C
```

**b) Three-way merge** — xảy ra khi CẢ HAI branch đều có commit mới (lịch sử rẽ nhánh). Git tìm commit tổ tiên chung, gộp 2 nhánh, và tạo một **merge commit** mới có **2 parent**.

```
        A → B → C  (main có commit D riêng)
         \        
          → X → Y  (feature)
Kết quả:  A → B → C → M  (M = merge commit, parent = C và Y)
                   ↗
              X → Y
```

```bash
# Ép luôn tạo merge commit kể cả khi có thể FF (giữ dấu vết branch)
git merge --no-ff feature-login
```

### 4.3. ⚔️ Merge Conflict — xử lý kỹ

**Conflict xảy ra khi**: hai branch sửa **cùng một dòng** của **cùng một file** theo cách khác nhau. Git không biết chọn bản nào → dừng lại và nhờ bạn quyết định. **Đây KHÔNG phải lỗi, là chuyện bình thường.**

Ví dụ tạo conflict (làm thử để hiểu):

```bash
# Trên main
git switch main
echo "Xin chao" > greeting.txt
git add greeting.txt && git commit -m "Add greeting (Vietnamese)"

# Tạo branch, sửa cùng dòng
git switch -c feature-english
echo "Hello" > greeting.txt
git add greeting.txt && git commit -m "Add greeting (English)"

# Quay về main, sửa cùng dòng đó khác đi
git switch main
echo "Chao ban" > greeting.txt
git add greeting.txt && git commit -m "Change greeting"

# Merge → CONFLICT!
git merge feature-english
```

Git báo conflict và sửa file `greeting.txt` thành:

```text
<<<<<<< HEAD
Chao ban
=======
Hello
>>>>>>> feature-english
```

- Phần `<<<<<<< HEAD` đến `=======`: nội dung của branch hiện tại (main).
- Phần `=======` đến `>>>>>>> feature-english`: nội dung của branch được merge vào.

**Cách giải quyết:**

```bash
# 1. Mở file, XÓA các dấu <<<<<<<, =======, >>>>>>> và quyết định nội dung cuối cùng
#    (giữ 1 bản, giữ cả 2, hoặc viết lại hoàn toàn)
#    Ví dụ sửa thành:  Chao ban / Hello

# 2. Đánh dấu đã giải quyết bằng cách add file
git add greeting.txt

# 3. Hoàn tất merge (commit merge)
git commit          # hoặc git merge --continue

# Nếu muốn HỦY merge giữa chừng, quay lại trạng thái trước merge:
git merge --abort
```

> 💡 VS Code có giao diện resolve conflict trực quan với nút "Accept Current / Incoming / Both" — rất nên dùng khi mới học.

### 🏋️ Bài tập Module 4

1. Tạo branch `feature-x`, thêm vài commit, merge vào `main` bằng fast-forward. Quan sát `git log --graph`.
2. **Cố tình gây conflict** theo ví dụ trên rồi tự resolve. Lặp lại cho tới khi không còn hoảng.
3. Thử `git merge --abort` để thấy mình luôn có đường lui.

### ✅ Checklist Module 4

- [ ] Tạo, chuyển, xóa branch bằng cả `switch` và `checkout`
- [ ] Phân biệt fast-forward vs 3-way merge
- [ ] Tự gây và resolve được merge conflict
- [ ] Biết `git merge --abort` để hủy an toàn

---

## Module 5 — Làm việc với Remote (GitHub)

### 5.1. Remote là gì?

**Remote** = phiên bản repo nằm ở nơi khác (thường trên GitHub). Tên mặc định là `origin`.

```bash
# Xem các remote đang có (kèm URL)
git remote -v

# Thêm remote tên origin
git remote add origin git@github.com:user/repo.git

# Đổi URL remote
git remote set-url origin git@github.com:user/new-repo.git
```

### 5.2. Push — đẩy commit lên remote

```bash
# Push branch main lên origin LẦN ĐẦU (-u set "upstream" để lần sau gõ gọn)
git push -u origin main

# Các lần sau chỉ cần
git push
```

**`-u` / upstream là gì?** Nó thiết lập **tracking relationship**: branch `main` local "gắn" với `origin/main`. Sau đó `git push`/`git pull` tự biết đẩy/kéo từ đâu, không cần ghi rõ remote + branch mỗi lần.

### 5.3. Fetch vs Pull — KHÁC BIỆT QUAN TRỌNG

```bash
# FETCH: chỉ TẢI commit mới từ remote về, KHÔNG đụng vào code đang làm
git fetch origin
# → cập nhật origin/main, nhưng main local của bạn chưa đổi
# → bạn có thể xem trước: git log main..origin/main

# PULL: = FETCH + MERGE (tải về RỒI gộp ngay vào branch hiện tại)
git pull
```

| | `git fetch` | `git pull` |
|---|---|---|
| Tải commit mới về | ✅ | ✅ |
| Tự động merge vào code bạn | ❌ | ✅ |
| An toàn (không làm hỏng work) | ✅ Rất an toàn | ⚠️ Có thể gây conflict bất ngờ |

> 💡 **Thói quen tốt**: khi nghi ngờ, dùng `git fetch` trước để **xem** có gì mới, rồi mới quyết định merge. `git pull` tiện nhưng "gộp ngay" đôi khi gây conflict lúc bạn chưa sẵn sàng.

```bash
# Biến thể: pull nhưng rebase thay vì merge (lịch sử thẳng, đẹp hơn)
git pull --rebase
```

### 5.4. Tracking branch & lấy branch của người khác

```bash
# Tải về thông tin tất cả branch remote
git fetch origin

# Tạo branch local theo dõi branch remote
git switch feature-abc          # Git tự đoán origin/feature-abc nếu trùng tên
git switch -c local-name origin/feature-abc   # đặt tên khác
```

### 🏋️ Bài tập Module 5

1. Tạo repo trên GitHub (rỗng), kết nối repo local bằng `git remote add origin`, `git push -u origin main`.
2. Sửa file trực tiếp trên web GitHub (tạo commit ở remote), rồi `git fetch` ở local — quan sát `git log origin/main` so với `main`. Sau đó `git pull` để đồng bộ.
3. So sánh trải nghiệm `git pull` và `git fetch` + `git merge` thủ công.

### ✅ Checklist Module 5

- [ ] Hiểu `origin`, upstream tracking là gì
- [ ] Phân biệt rõ `fetch` vs `pull`
- [ ] Push/pull thành thạo với một repo GitHub thật

---

## Module 6 — Undo & Sửa lỗi (CỰC KỲ QUAN TRỌNG)

> 🛟 Module này là "phao cứu sinh". Người biết undo dùng Git tự tin; người không biết thì sợ hãi mỗi lần gõ lệnh. Học kỹ.

### 6.1. `git restore` — bỏ thay đổi / unstage (lệnh mới, rõ ràng)

```bash
# Bỏ thay đổi CHƯA stage trong file (về lại bản commit cuối) — MẤT thay đổi, cẩn thận
git restore index.html

# Unstage file (gỡ khỏi staging, GIỮ thay đổi trong working dir)
git restore --staged index.html
```

### 6.2. `git reset` — di chuyển HEAD (3 mức — HIỂU KỸ KHÁC BIỆT)

`git reset <commit>` dời con trỏ branch về commit chỉ định. Khác biệt nằm ở **chuyện gì xảy ra với Staging và Working Directory**:

| Mode | HEAD/branch lùi | Staging Area | Working Directory | Dùng khi |
|---|---|---|---|---|
| `--soft` | ✅ lùi | **giữ nguyên** (vẫn staged) | **giữ nguyên** | Gộp/sửa commit nhưng giữ hết thay đổi đã stage |
| `--mixed` (mặc định) | ✅ lùi | reset (unstage) | **giữ nguyên** | Bỏ commit, giữ code để sửa & stage lại |
| `--hard` | ✅ lùi | reset | **XÓA SẠCH** ⚠️ | Vứt bỏ hoàn toàn (NGUY HIỂM) |

```bash
# Hủy commit cuối nhưng GIỮ thay đổi đã staged (để gộp/commit lại)
git reset --soft HEAD~1

# Hủy commit cuối, đưa thay đổi về working dir (mặc định)
git reset HEAD~1
git reset --mixed HEAD~1   # tương đương

# Hủy commit cuối VÀ XÓA mọi thay đổi — KHÔNG HOÀN TÁC dễ dàng
git reset --hard HEAD~1
```

> ⚠️ **`git reset --hard` là con dao hai lưỡi nguy hiểm nhất.** Nó xóa thay đổi trong working directory **không qua thùng rác**. Quy tắc: chỉ dùng khi bạn CHẮC CHẮN muốn vứt. Còn commit lỡ mất vì `reset --hard` thì cứu được bằng `reflog` (xem 6.6).

### 6.3. `git revert` — undo AN TOÀN cho commit đã push

```bash
# Tạo MỘT commit MỚI có nội dung ngược lại commit cũ (không xóa lịch sử)
git revert <hash>
```

**`reset` vs `revert` — chọn cái nào?**

- `reset`: **viết lại lịch sử** (xóa commit). Chỉ dùng cho commit **CHƯA push / chỉ ở local**.
- `revert`: **thêm commit đảo ngược**, lịch sử cũ vẫn còn. Dùng cho commit **ĐÃ push lên remote / branch chung**. An toàn cho cộng tác.

> 📌 Quy tắc vàng: **Không bao giờ viết lại lịch sử (reset/rebase) trên branch mà người khác đã pull.** Dùng `revert`.

### 6.4. `git commit --amend` — sửa commit gần nhất

```bash
# Sửa message commit cuối
git commit --amend -m "Message đúng hơn"

# Lỡ quên add 1 file vào commit cuối? Add rồi amend (không tạo commit mới):
git add file-quen.txt
git commit --amend --no-edit    # --no-edit = giữ nguyên message cũ
```

> ⚠️ `--amend` cũng **viết lại lịch sử** (tạo commit mới thay commit cũ). Đừng amend commit đã push (trừ khi force-push trên branch riêng của bạn).

### 6.5. `git stash` — cất tạm thay đổi

Tình huống: đang làm dở thì cần chuyển branch gấp để fix bug, nhưng chưa muốn commit.

```bash
# Cất tạm mọi thay đổi (working dir + staging) vào "ngăn kéo", trả working dir sạch
git stash

# Cất kèm mô tả
git stash push -m "Đang làm dở form login"

# Xem danh sách stash
git stash list

# Lấy lại stash mới nhất và XÓA khỏi danh sách
git stash pop

# Lấy lại nhưng GIỮ trong danh sách
git stash apply

# Xóa 1 stash
git stash drop stash@{0}
```

### 6.6. `git reflog` — CỨU TINH khi "tưởng mất hết"

`reflog` ghi lại **mọi lần HEAD di chuyển** (commit, reset, checkout, rebase...) trong ~90 ngày — kể cả commit đã bị `reset --hard` "xóa". Đây là cách lấy lại commit tưởng đã mất:

```bash
# Xem lịch sử di chuyển của HEAD
git reflog
# Ví dụ:
# a3f5e9c HEAD@{0}: reset: moving to HEAD~1
# 9b2c1d4 HEAD@{1}: commit: Tinh nang quan trong vua bi mat   ← commit "đã mất"!

# Khôi phục về đúng commit đó
git reset --hard 9b2c1d4
# hoặc tạo branch mới từ nó:
git branch cuu-commit 9b2c1d4
```

> 💡 **Ghi nhớ**: Trong Git, gần như **không có gì thực sự mất** trong 90 ngày, miễn là nó từng được commit. `reflog` là bùa hộ mệnh. Đây là lý do nên commit thường xuyên.

### 6.7. `git clean` — xóa file untracked

```bash
# Xem trước file untracked sẽ bị xóa (LUÔN chạy -n trước)
git clean -n

# Xóa file untracked
git clean -f

# Xóa cả thư mục untracked
git clean -fd
```

> ⚠️ File untracked KHÔNG nằm trong Git nên `clean` xóa là **mất vĩnh viễn**, reflog không cứu được. Luôn `-n` (dry run) trước.

### 🏋️ Bài tập Module 6

1. Commit nhầm 1 file rác → dùng `git reset --soft HEAD~1` để hủy commit, giữ thay đổi.
2. Tạo vài commit, `git reset --hard HEAD~2` để "mất" 2 commit, rồi dùng `git reflog` + `git reset --hard` để **cứu lại**. (Bài tập quan trọng nhất module này!)
3. Đang sửa dở → `git stash` → chuyển branch → quay lại → `git stash pop`.
4. Tạo commit, push, rồi `git revert` nó. Quan sát lịch sử có 2 commit (gốc + revert).

### ✅ Checklist Module 6

- [ ] Phân biệt rõ `reset --soft / --mixed / --hard`
- [ ] Biết khi nào dùng `reset` vs `revert` (local vs đã push)
- [ ] Dùng được `git stash`
- [ ] **Đã tự cứu commit bằng `git reflog`** (rất quan trọng)
- [ ] Hiểu `git clean` xóa vĩnh viễn, luôn `-n` trước

---

## Module 7 — Lịch sử nâng cao: Rebase, Cherry-pick, Tag

### 7.1. `git rebase` — viết lại lịch sử cho thẳng

`rebase` "nhổ" các commit của branch bạn và "trồng lại" lên đỉnh branch khác → lịch sử **tuyến tính, sạch đẹp**, không có merge commit.

```bash
git switch feature
git rebase main
# Lấy các commit của feature, đặt lại lên trên commit mới nhất của main
```

**Merge vs Rebase — KHI NÀO DÙNG:**

```
Trạng thái đầu:    A → B → C   (main)
                    \
                     D → E      (feature)

MERGE (git merge):  A → B → C → M       Giữ nguyên lịch sử thật, có merge commit M.
                     \         ↗        ƯU: trung thực. NHƯỢC: lịch sử rối nếu nhiều branch.
                      D → E ───

REBASE (git rebase main):  A → B → C → D' → E'   Lịch sử thẳng tắp.
                           ƯU: sạch, dễ đọc. NHƯỢC: tạo commit MỚI (D',E' khác hash) = viết lại lịch sử.
```

> 📌 **Quy tắc vàng của rebase**: **KHÔNG rebase branch đã push/chia sẻ với người khác.** Rebase đổi hash commit → người khác đã pull bản cũ sẽ bị xung đột lịch sử nghiêm trọng. Chỉ rebase branch **riêng tư, chưa push** (hoặc branch chỉ mình bạn dùng).
>
> Dùng `merge` khi muốn ghi lại lịch sử trung thực (branch chung); dùng `rebase` để dọn dẹp branch cá nhân **trước khi** tạo PR.

### 7.2. Interactive rebase — dọn dẹp commit (squash/edit/reorder)

Công cụ mạnh để "nắn" lại lịch sử trước khi push/PR:

```bash
# Sửa 3 commit gần nhất
git rebase -i HEAD~3
```

Git mở editor liệt kê commit kèm lệnh có thể đổi:

```text
pick a3f5e9c Add login form
pick 9b2c1d4 Fix typo
pick c7d8e2a Fix typo again

# Đổi 'pick' thành:
# reword = đổi message
# edit   = dừng để sửa nội dung commit
# squash = gộp vào commit phía TRÊN (giữ cả 2 message)
# fixup  = gộp vào commit trên (BỎ message của commit này)
# drop   = xóa commit
# (đổi thứ tự dòng = reorder commit)
```

Ví dụ gộp 2 commit "Fix typo" vào commit đầu:

```text
pick   a3f5e9c Add login form
fixup  9b2c1d4 Fix typo
fixup  c7d8e2a Fix typo again
```

→ Kết quả: 1 commit gọn "Add login form" thay vì 3 commit lộn xộn.

### 7.3. `git cherry-pick` — "hái" 1 commit cụ thể

Lấy **một (hoặc vài) commit cụ thể** từ branch khác áp vào branch hiện tại — không merge cả branch.

```bash
# Áp commit có hash này vào branch hiện tại
git cherry-pick a3f5e9c

# Nhiều commit
git cherry-pick a3f5e9c 9b2c1d4
```

> Dùng khi: hotfix nằm trên branch khác mà bạn chỉ cần đúng commit đó, không muốn lấy cả branch.

### 7.4. `git tag` — đánh dấu phiên bản

Tag = nhãn cố định gắn vào 1 commit, thường để đánh dấu **release** (v1.0.0).

```bash
# Tag nhẹ (chỉ là tên)
git tag v1.0.0

# Tag có chú thích (KHUYẾN NGHỊ cho release — kèm message, tác giả, ngày)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Đẩy tag lên remote (push thường KHÔNG đẩy tag)
git push origin v1.0.0
git push origin --tags     # đẩy tất cả tag

# Liệt kê tag
git tag
```

### 🏋️ Bài tập Module 7

1. Tạo branch `feature`, vài commit; trên `main` cũng thêm commit. Rebase `feature` lên `main`, so sánh `git log --graph` với kết quả nếu merge.
2. Tạo 3 commit "rác" (typo), dùng `git rebase -i HEAD~3` + `fixup` để gộp thành 1 commit sạch.
3. Cherry-pick 1 commit từ branch này sang branch khác.
4. Tạo tag `v1.0.0` có annotation và push lên GitHub.

### ✅ Checklist Module 7

- [ ] Giải thích merge vs rebase và **quy tắc vàng không rebase branch đã chia sẻ**
- [ ] Dùng được interactive rebase để squash/reword
- [ ] Hiểu cherry-pick dùng khi nào
- [ ] Tạo và push được tag

---

## Module 8 — Workflow nhóm & GitHub

### 8.1. Fork & Pull Request (PR) — trái tim của cộng tác open-source

- **Fork**: tạo bản sao repo của người khác về tài khoản GitHub của bạn (khi bạn không có quyền push trực tiếp).
- **Pull Request**: yêu cầu chủ repo "kéo" (pull) thay đổi của bạn vào repo họ — kèm chỗ để review, thảo luận.

**Quy trình đóng góp chuẩn (contribute vào dự án open-source):**

```bash
# 1. Fork repo trên GitHub (nút Fork) → repo về tài khoản bạn

# 2. Clone bản fork của BẠN về máy
git clone git@github.com:YOUR_USERNAME/repo.git
cd repo

# 3. Thêm remote 'upstream' trỏ tới repo GỐC (để đồng bộ về sau)
git remote add upstream git@github.com:ORIGINAL_OWNER/repo.git

# 4. Tạo branch cho tính năng (KHÔNG làm trên main)
git switch -c fix-typo-readme

# 5. Sửa, commit
git add . && git commit -m "Fix typo in README"

# 6. Push branch lên fork của bạn (origin)
git push -u origin fix-typo-readme

# 7. Lên GitHub → bấm "Compare & pull request" → mô tả → tạo PR
```

```bash
# Đồng bộ fork với repo gốc (khi gốc có commit mới)
git fetch upstream
git switch main
git merge upstream/main
git push origin main
```

### 8.2. Code review

PR là nơi reviewer **comment vào từng dòng**, yêu cầu sửa, approve hoặc request changes. Khi được yêu cầu sửa:

```bash
# Sửa theo góp ý, commit thêm, push lại — PR TỰ CẬP NHẬT (không cần tạo PR mới)
git add . && git commit -m "Address review: rename variable"
git push
```

### 8.3. Branching strategy — chọn theo quy mô team

| Chiến lược | Mô tả | Phù hợp |
|---|---|---|
| **GitHub Flow** | Chỉ có `main` + các feature branch ngắn hạn → PR → merge → deploy. Đơn giản nhất. | Team nhỏ, web app, deploy liên tục. **Khuyến nghị cho sinh viên/dự án cá nhân.** |
| **Git Flow** | Nhiều branch dài hạn: `main`, `develop`, `feature/*`, `release/*`, `hotfix/*`. Phức tạp. | Sản phẩm có release theo phiên bản, team lớn. |
| **Trunk-based** | Mọi người commit thẳng vào `main` (qua PR nhỏ, nhanh), branch sống cực ngắn. Cần CI mạnh + feature flag. | Team có kỷ luật CI/CD cao, công ty lớn (Google). |

> 💡 Bắt đầu bằng **GitHub Flow** — đủ dùng 95% trường hợp và không gây rối.

### 8.4. Bảo vệ branch `main`

Trên GitHub: **Settings → Branches → Branch protection rules**. Thiết lập:

- Cấm push thẳng vào `main` — bắt buộc qua PR.
- Bắt buộc ≥1 review approve trước khi merge.
- Bắt buộc CI (test) pass mới được merge.

→ Ngăn người (kể cả chính bạn) đẩy code lỗi thẳng vào nhánh chính.

### 8.5. Resolve conflict trong PR

Khi PR báo "This branch has conflicts":

```bash
# Cách chuẩn: cập nhật branch của bạn với main mới nhất, resolve tại local
git switch fix-typo-readme
git fetch origin
git merge origin/main        # (hoặc git rebase origin/main)
# → resolve conflict như Module 4, rồi:
git add . && git commit
git push
# PR tự cập nhật, conflict biến mất
```

### 🏋️ Bài tập Module 8

1. Fork một repo "good first issue" trên GitHub, tạo branch, sửa nhỏ, mở PR thật.
2. Tự tạo repo, bật branch protection cho `main`, thử push thẳng → bị chặn → làm qua PR.
3. Cùng 1 bạn (hoặc 2 account) tạo conflict trong PR rồi resolve.

### ✅ Checklist Module 8

- [ ] Hiểu luồng Fork → branch → PR → review → merge
- [ ] Phân biệt 3 branching strategy, biết chọn GitHub Flow khi nào
- [ ] Cấu hình được branch protection
- [ ] Resolve được conflict trong PR

---

## Module 9 — GitHub nâng cao & xây dựng hồ sơ

### 9.1. GitHub Actions / CI cơ bản

**GitHub Actions** = hệ thống CI/CD tích hợp sẵn: tự động chạy lệnh (test, build, deploy) khi có sự kiện (push, PR...). Cấu hình bằng file YAML trong `.github/workflows/`.

```yaml
# .github/workflows/ci.yml — tự động chạy test mỗi khi push hoặc mở PR
name: CI

on:                        # khi nào chạy
  push:
    branches: [ main ]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest # chạy trên máy ảo Ubuntu của GitHub
    steps:
      - uses: actions/checkout@v4        # tải code repo về runner
      - uses: actions/setup-python@v5    # cài Python (hợp với hướng AI/ML)
        with:
          python-version: '3.12'
      - run: pip install -r requirements.txt
      - run: pytest                       # chạy test; fail thì PR báo đỏ
```

**Cơ chế:** GitHub phát hiện file trong `.github/workflows/`, lắng nghe sự kiện `on:`, khởi tạo máy ảo (runner) sạch, chạy tuần tự các `steps`. Kết quả (xanh/đỏ) hiện ngay trên PR. Đây là nền tảng của **MLOps** (auto train/test model) mà bạn sẽ cần.

### 9.2. Issues & Projects

- **Issues**: phiếu theo dõi bug / tính năng / câu hỏi. Gắn label, assignee, milestone. Commit/PR có thể tự đóng issue: ghi `Fixes #12` trong message PR.
- **Projects**: bảng Kanban (To do / In progress / Done) để quản lý công việc, liên kết với Issues/PR.

### 9.3. README đẹp

README là "bộ mặt" repo. Nên có: tiêu đề + mô tả 1 dòng, badge (build status), ảnh/GIF demo, cách cài đặt & chạy, tech stack, license. Markdown + ảnh + badge từ https://shields.io.

### 9.4. GitHub Pages

Host **website tĩnh miễn phí** thẳng từ repo:

- **Settings → Pages** → chọn branch (vd `main`, thư mục `/root` hoặc `/docs`).
- Repo `username.github.io` sẽ thành trang chủ tại `https://username.github.io`.
- Dùng để host **portfolio cá nhân** — rất giá trị khi xin việc.

### 9.5. Releases

Đóng gói phiên bản chính thức từ tag: **Releases → Draft a new release** → chọn tag → mô tả changelog → đính kèm file binary nếu cần.

### 9.6. 💼 Hồ sơ GitHub gây ấn tượng nhà tuyển dụng

Recruiter và tech lead **thực sự xem GitHub của bạn**. Để gây ấn tượng:

1. **Profile README đặc biệt**: tạo repo trùng tên username (vd `nhatminhtran104`) → README của repo đó hiện ngay trang profile. Giới thiệu bản thân, kỹ năng, project nổi bật.
2. **Vài project chất lượng > nhiều project rác**: 2-3 project có README tử tế, code sạch, có test, có demo. Hướng AI/ML: 1 project end-to-end (data → train → API serve model), 1 backend (REST API có CI).
3. **Commit history đều & sạch**: commit thường xuyên với message tử tế cho thấy thói quen làm việc kỷ luật. "Ô xanh" (contribution graph) đều đặn tạo ấn tượng tốt.
4. **Đóng góp open-source**: dù chỉ là PR sửa docs — chứng tỏ bạn biết quy trình cộng tác thật.
5. **Pin** 6 repo tốt nhất lên profile.
6. **KHÔNG** để repo đầy file rác, không có README, hoặc commit "asdf". Recruiter sẽ thấy.

### 🏋️ Bài tập Module 9

1. Tạo workflow GitHub Actions chạy test/lint tự động cho 1 repo của bạn, push và xem nó chạy.
2. Tạo Profile README (repo trùng username) giới thiệu bản thân.
3. Dựng portfolio bằng GitHub Pages.
4. Mở 1 Issue trong repo của bạn, tham chiếu nó từ 1 PR bằng `Fixes #1`.

### ✅ Checklist Module 9

- [ ] Viết được 1 workflow GitHub Actions chạy CI
- [ ] Có Profile README
- [ ] Đã thử GitHub Pages
- [ ] Hiểu Issues, label, đóng issue qua PR

---

## Module 10 — Best Practices & Tình huống thực tế

### 10.1. Nguyên tắc vàng

- **Commit nhỏ & thường xuyên**: mỗi commit = 1 thay đổi logic độc lập. Dễ review, dễ revert, dễ tìm bug (`git bisect`).
- **TUYỆT ĐỐI không commit secret**: API key, password, `.env`, private key. Thêm vào `.gitignore` NGAY. (Xem 10.3 nếu lỡ commit.)
- **Pull trước khi push**: `git pull` (hoặc `--rebase`) để đồng bộ trước, tránh bị từ chối push.
- **Mỗi tính năng = 1 branch**: đừng làm mọi thứ trên `main`.
- **Đọc `git status` và `git diff` TRƯỚC khi commit**: kiểm tra mình thực sự đang commit cái gì.

### 10.2. Conventional Commits (semantic commit messages)

Quy ước message có cấu trúc, giúp tự sinh changelog & dễ đọc:

```text
<type>(<scope>): <mô tả ngắn>

feat:     thêm tính năng mới
fix:      sửa bug
docs:     thay đổi tài liệu
style:    format, không đổi logic
refactor: tái cấu trúc code
test:     thêm/sửa test
chore:    việc lặt vặt (cập nhật dependency...)
```

Ví dụ:

```bash
git commit -m "feat(auth): add JWT refresh token"
git commit -m "fix(api): handle null user in /profile endpoint"
git commit -m "docs(readme): add installation guide"
```

### 10.3. 🆘 Thoát các "tình huống Git kinh điển"

**a) Lỡ commit nhưng CHƯA push, muốn sửa message:**
```bash
git commit --amend -m "Message đúng"
```

**b) Lỡ commit file rác / secret nhưng CHƯA push:**
```bash
git reset --soft HEAD~1     # hủy commit, giữ thay đổi để sửa lại
# rồi gỡ file rác, thêm .gitignore, commit lại
```

**c) Lỡ PUSH commit có secret (.env, API key):**
```bash
# 1. COI NHƯ KEY ĐÃ LỘ → đổi/revoke key NGAY (quan trọng nhất!)
# 2. Gỡ file khỏi toàn bộ lịch sử (dùng git-filter-repo — công cụ khuyến nghị)
pip install git-filter-repo
git filter-repo --path .env --invert-paths
# 3. Force push (cảnh báo team trước)
git push origin --force --all
```
> Lưu ý: chỉ xóa khỏi lịch sử là CHƯA đủ — key đã public coi như bị lộ, BẮT BUỘC revoke.

**d) Lỡ `git reset --hard` mất commit:**
```bash
git reflog                  # tìm hash commit đã mất
git reset --hard <hash>     # khôi phục
```

**e) Xóa nhầm branch (chưa merge):**
```bash
git reflog                  # tìm commit cuối của branch đã xóa
git branch ten-branch <hash>   # tạo lại branch tại đó
```

**f) Commit nhầm vào `main` thay vì branch mới:**
```bash
git branch feature-moi       # đánh dấu commit hiện tại bằng branch mới
git reset --hard HEAD~1      # đưa main lùi về (commit vẫn an toàn ở feature-moi)
git switch feature-moi       # tiếp tục làm trên branch đúng
```

**g) Lỡ push lên nhầm branch:**
```bash
# Revert trên branch nhầm (an toàn vì đã push), rồi cherry-pick sang branch đúng
git revert <hash>
git switch branch-dung
git cherry-pick <hash>
```

**h) `git push` bị từ chối (rejected — remote có commit mới):**
```bash
git pull --rebase           # lấy commit remote về, đặt commit bạn lên trên
git push                    # rồi push lại
```

### ✅ Checklist Module 10

- [ ] Áp dụng commit nhỏ + Conventional Commits
- [ ] KHÔNG commit secret; biết xử lý khi lỡ commit/push secret
- [ ] Thoát được ít nhất 5 tình huống kinh điển ở 10.3

---

# 📋 Cheat Sheet — Lệnh Git hay dùng nhất

| Mục đích | Lệnh |
|---|---|
| Cấu hình tên/email | `git config --global user.name/.email "..."` |
| Tạo repo | `git init` |
| Clone repo | `git clone <url>` |
| Xem trạng thái | `git status` |
| Stage file | `git add <file>` / `git add .` |
| Commit | `git commit -m "msg"` |
| Sửa commit cuối | `git commit --amend` |
| Xem lịch sử | `git log --oneline --graph --all` |
| Xem thay đổi chưa stage | `git diff` |
| Xem thay đổi đã stage | `git diff --staged` |
| Tạo + chuyển branch | `git switch -c <branch>` |
| Chuyển branch | `git switch <branch>` |
| Liệt kê branch | `git branch` |
| Xóa branch | `git branch -d <branch>` |
| Gộp branch | `git merge <branch>` |
| Hủy merge đang dở | `git merge --abort` |
| Rebase | `git rebase <branch>` |
| Interactive rebase | `git rebase -i HEAD~n` |
| Cherry-pick | `git cherry-pick <hash>` |
| Bỏ thay đổi 1 file | `git restore <file>` |
| Unstage file | `git restore --staged <file>` |
| Hủy commit (giữ code) | `git reset --soft HEAD~1` |
| Hủy commit (xóa code) | `git reset --hard HEAD~1` ⚠️ |
| Undo an toàn (đã push) | `git revert <hash>` |
| Cất tạm thay đổi | `git stash` / `git stash pop` |
| Cứu commit đã mất | `git reflog` |
| Thêm remote | `git remote add origin <url>` |
| Push lần đầu | `git push -u origin main` |
| Push | `git push` |
| Tải về (không merge) | `git fetch` |
| Tải về + merge | `git pull` |
| Tạo tag | `git tag -a v1.0.0 -m "..."` |

---

# 🛠️ Project thực hành (làm để thực sự nắm)

### Project 1 — Repo cá nhân hoàn chỉnh (1-2 ngày)
Tạo 1 repo cho project học tập của bạn (vd notebook AI/ML hoặc 1 REST API nhỏ):
- `git init`, `.gitignore` chuẩn (chặn `__pycache__/`, `.env`, data lớn).
- Ít nhất 10 commit theo **Conventional Commits**.
- Dùng branch cho mỗi tính năng, merge qua `--no-ff`.
- README đẹp + 1 workflow GitHub Actions chạy `pytest`/lint.
- Tag `v1.0.0` + tạo Release.

### Project 2 — Cộng tác qua PR (cần 1 bạn hoặc 2 account)
- 2 người cùng clone 1 repo.
- Mỗi người tạo branch, sửa **cùng 1 file** để **cố tình gây conflict**.
- Mở PR, review chéo (comment, request changes), resolve conflict, merge.
- Bật branch protection cho `main`.

### Project 3 — Portfolio GitHub gây ấn tượng (1 tuần)
- Profile README (repo trùng username) giới thiệu bản thân theo hướng AI/ML + Backend.
- Pin 3 project chất lượng có README + demo + CI.
- Dựng trang portfolio bằng GitHub Pages.
- Đóng góp ít nhất 1 PR thật vào 1 dự án open-source ("good first issue").

---

# ⚠️ Lỗi & hiểu lầm thường gặp

1. **Nhầm Git = GitHub.** Git là công cụ local; GitHub chỉ là 1 nơi host. Bạn dùng Git được mà không cần GitHub.
2. **`git reset --hard` bừa bãi.** Nó xóa thay đổi working dir không qua thùng rác. Luôn tự hỏi "mình có chắc muốn vứt không?". May là commit đã tạo thì còn cứu được bằng `reflog`.
3. **Rebase branch đã chia sẻ.** Đổi hash commit → vỡ lịch sử của người khác. Chỉ rebase branch riêng tư, chưa push.
4. **Dùng `reset` cho commit đã push.** Viết lại lịch sử chung gây loạn. Đã push thì dùng `revert`.
5. **Commit secret (.env, API key).** Một khi đã push, coi như lộ — phải revoke key, không chỉ xóa file.
6. **Commit message vô nghĩa** (`fix`, `update`, `asdf`). Lịch sử trở nên vô dụng khi cần truy vết.
7. **Lẫn lộn `fetch` và `pull`.** `pull` = `fetch` + `merge` tự động (có thể gây conflict bất ngờ). `fetch` chỉ tải về, an toàn để xem trước.
8. **`.gitignore` không gỡ file đã track.** Phải `git rm --cached` thủ công.
9. **Sợ Git nên dùng nút bấm mù trong IDE.** Hiểu CLI giúp bạn biết chuyện gì đang xảy ra và tự cứu khi rối.
10. **Làm mọi thứ trên `main`.** Dùng branch cho mỗi tính năng để cô lập rủi ro.

---

# ✅ Checklist tự đánh giá tổng

**Cơ bản**
- [ ] Cài & cấu hình Git, tạo SSH key
- [ ] Phân biệt Git vs GitHub, hiểu mô hình distributed
- [ ] Vẽ được 3 khu vực, hiểu commit là snapshot + hash, HEAD là gì
- [ ] Thành thạo `status / add / commit / log / diff`, viết `.gitignore`

**Branch & Remote**
- [ ] Tạo/chuyển/merge branch, xử lý merge conflict
- [ ] Phân biệt fast-forward vs 3-way merge
- [ ] Push/pull/fetch thành thạo, phân biệt fetch vs pull

**Undo & nâng cao**
- [ ] Phân biệt `reset --soft/mixed/hard`, biết `reset` vs `revert`
- [ ] Dùng `stash`, đã từng cứu commit bằng `reflog`
- [ ] Dùng rebase (kể cả interactive), cherry-pick, tag
- [ ] Biết quy tắc vàng: không rebase/reset branch đã chia sẻ

**Cộng tác & nghề nghiệp**
- [ ] Đã mở 1 PR thật, review code, resolve conflict trong PR
- [ ] Hiểu các branching strategy, bật branch protection
- [ ] Viết được workflow GitHub Actions cơ bản
- [ ] Có GitHub profile (Profile README + project chất lượng + portfolio Pages)
- [ ] Áp dụng Conventional Commits
- [ ] Thoát được các tình huống Git kinh điển ở Module 10

---

# 🔗 Học gì tiếp theo

- **Git nâng cao**: `git bisect` (nhị phân tìm commit gây bug), `git worktree` (nhiều working dir cùng lúc), submodules, `git hooks` (tự động chạy script khi commit/push), `pre-commit` framework (lint/format tự động).
- **CI/CD sâu hơn**: GitHub Actions nâng cao (matrix build, caching, secrets, deploy tự động), tiến tới **MLOps** (DVC để version dữ liệu/model — rất hợp hướng AI/ML).
- **Cộng tác chuyên nghiệp**: review code chuẩn, viết PR description tốt, semantic versioning, changelog tự động (semantic-release).
- **Tài nguyên hay**:
  - Sách miễn phí *Pro Git* (https://git-scm.com/book/vi/v2) — có bản tiếng Việt.
  - Trò chơi học branching trực quan: https://learngitbranching.js.org (rất nên chơi!).
  - GitHub Skills: https://skills.github.com.
  - `git help <lệnh>` hoặc `git <lệnh> --help` — tài liệu chính thống ngay trong terminal.

---

> 🌱 **Lời cuối**: Git không học bằng cách đọc — học bằng cách **làm và làm sai**. Hãy tạo một repo "nháp" và phá nó thoải mái: gây conflict, `reset --hard`, rồi cứu bằng `reflog`. Khi đã tự cứu mình vài lần, bạn sẽ không bao giờ sợ Git nữa. Chúc bạn code vui và commit sạch! 🚀
