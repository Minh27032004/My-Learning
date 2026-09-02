/* Mảng 03 — Git & GitHub
   Xem docs/them-cong-nghe-moi.md để biết cách thêm mảng mới. */
window.CURRICULUM.push(
{
  "id": "03",
  "kind": "lo-trinh",
  "title": "Git & GitHub",
  "tag": "Học sớm, dùng mỗi ngày",
  "color": "#f0724f",
  "why": "Công cụ duy nhất bạn sẽ mở mỗi ngày suốt sự nghiệp, dù làm AI hay backend. Học sớm và dùng cho MỌI project, kể cả bài tập một file.",
  "folder": "https://github.com/Minh27032004/My-Learning/blob/main/roadmap/03-git-github.md",
  "page": "03-Git-GitHub/git.html",
  "pageLabel": "Mở sổ tay lệnh Git",
  "prompts": {
    "lesson": "Mỗi lệnh phải trả lời bốn câu: dùng khi nào, gõ thế nào, bên dưới nó làm gì, bẫy nằm ở đâu. Code là lệnh shell thật, chạy được.",
    "quiz": "Ưu tiên câu hỏi tình huống: 'bạn vừa làm X, giờ muốn Y, dùng lệnh nào'. Hỏi cả về hậu quả: lệnh nào mất code vĩnh viễn, lệnh nào an toàn khi đã push."
  },
  "modules": [
    {
      "name": "Nền tảng",
      "items": [
        "Git khác GitHub ở chỗ nào",
        "Mô hình phân tán và vì sao commit được offline",
        "Ba khu vực: working directory, staging, repository",
        "Commit là snapshot, không phải diff",
        "HEAD, hash SHA, con trỏ nhánh",
        "Cài đặt và cấu hình user.name / user.email",
        "SSH key thay cho gõ mật khẩu"
      ]
    },
    {
      "name": "Thao tác hằng ngày",
      "items": [
        "git init và git clone",
        "Viết .gitignore trước commit đầu tiên",
        "git status — đọc được mọi trạng thái file",
        "git add, và git add -p để chọn từng đoạn",
        "git commit và cách viết message tử tế",
        "git log với --oneline --graph --all",
        "git diff: chưa add vs đã add",
        "git show và git blame"
      ]
    },
    {
      "name": "Hoàn tác",
      "items": [
        "git restore — bỏ sửa đổi, bỏ staging",
        "git commit --amend",
        "git reset: --soft / --mixed / --hard",
        "git revert cho commit đã push",
        "git reflog — cứu code tưởng đã mất",
        "git clean để dọn file rác"
      ]
    },
    {
      "name": "Nhánh & cộng tác",
      "items": [
        "branch, switch, checkout",
        "merge và fast-forward",
        "Xử lý merge conflict không hoảng",
        "remote, push, pull, fetch",
        "--force-with-lease thay vì --force",
        "rebase và luật vàng của rebase",
        "rebase -i để dọn lịch sử trước khi mở PR",
        "cherry-pick, stash, tag"
      ]
    },
    {
      "name": "GitHub & quy trình nhóm",
      "items": [
        "Pull Request và code review",
        "Fork + upstream để đóng góp mã nguồn mở",
        "Issue, label, project board",
        "GitHub Flow vs Git Flow vs Trunk-based",
        "GitHub Actions: CI chạy test tự động",
        "README, LICENSE, và profile gây ấn tượng",
        "git bisect để truy commit gây bug",
        "Git LFS cho file model và dataset nặng"
      ]
    }
  ]
}
);
