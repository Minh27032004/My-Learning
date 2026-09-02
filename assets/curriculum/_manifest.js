/* =========================================================
   _manifest.js — danh sách mảng + bộ nạp + tiện ích tra cứu

   THÊM MỘT CÔNG NGHỆ MỚI:
     1. Tạo file assets/curriculum/<ten-file>.js
     2. Thêm tên file (không có .js) vào mảng FILES bên dưới
     3. Xong. Không sửa gì khác.

   Vì sao dùng thẻ <script> cổ điển chứ không phải ES module `import`:
   trang này phải mở được bằng file:// (nháy đúp), mà ES module bị
   chặn CORS trên file://. Thẻ script thường thì không.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1. Danh sách file mảng, theo đúng thứ tự hiển thị ---------- */
  var FILES = [
    "01-nen-tang-cs",
    "02-giai-thuat-ctdl",
    "03-git-github",
    "04-database",
    "05-backend-web",
    "06-system-design",
    "07-ai-ml",
    "t0-thu-nghiem"   // ← thêm công nghệ mới ở đây, một dòng là đủ
  ];

  /* ---------- 2. Kho dữ liệu ---------- */
  window.CURRICULUM = window.CURRICULUM || [];

  /* ---------- 3. Tiện ích dùng chung ----------
     slug() phải giữ nguyên công thức cũ, nếu không mọi tiến độ đã tick sẽ mất. */
  function slug(s) {
    return String(s).normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d").replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);
  }

  function keyOf(trackId, moduleName, itemText) {
    return trackId + ":" + slug(moduleName) + ":" + slug(itemText);
  }

  /* Tra ngược một khoá chủ đề về đầy đủ ngữ cảnh — hoc.html cần cái này */
  function find(key) {
    for (var i = 0; i < window.CURRICULUM.length; i++) {
      var track = window.CURRICULUM[i];
      for (var j = 0; j < track.modules.length; j++) {
        var mod = track.modules[j];
        for (var k = 0; k < mod.items.length; k++) {
          if (keyOf(track.id, mod.name, mod.items[k]) === key) {
            return {
              key: key,
              item: mod.items[k],
              module: mod,
              track: track,
              // để trang học biết đi tiếp / lùi lại trong cùng module
              prev: k > 0 ? keyOf(track.id, mod.name, mod.items[k - 1]) : null,
              next: k < mod.items.length - 1 ? keyOf(track.id, mod.name, mod.items[k + 1]) : null
            };
          }
        }
      }
    }
    return null;
  }

  /* Lọc theo loại: "lo-trinh" (có thứ tự) hoặc "cong-nghe" (học khi cần) */
  function tracks(kind) {
    if (!kind) return window.CURRICULUM.slice();
    return window.CURRICULUM.filter(function (t) { return (t.kind || "lo-trinh") === kind; });
  }

  function countItems(track) {
    return track.modules.reduce(function (n, m) { return n + m.items.length; }, 0);
  }

  var state = { loaded: false, failed: [] };

  function ready(cb) {
    if (state.loaded) { cb(state); return; }
    document.addEventListener("curriculum:ready", function () { cb(state); }, { once: true });
  }

  window.Curriculum = {
    slug: slug,
    keyOf: keyOf,
    find: find,
    tracks: tracks,
    countItems: countItems,
    ready: ready,
    state: state
  };

  /* ---------- 4. Nạp các file mảng ---------- */
  // Suy ra thư mục gốc từ src của chính file này, nên trang ở thư mục con
  // (03-Git-GitHub/git.html) cũng nạp đúng đường dẫn.
  var self = document.currentScript;
  var base = self && self.src ? self.src.replace(/_manifest\.js(\?.*)?$/, "") : "assets/curriculum/";

  var remaining = FILES.length;
  if (!remaining) { finish(); return; }

  FILES.forEach(function (name) {
    var s = document.createElement("script");
    s.src = base + name + ".js";
    s.async = false;              // giữ đúng thứ tự thực thi giữa các file
    s.onload = function () { if (--remaining === 0) finish(); };
    s.onerror = function () {
      state.failed.push(name);
      if (--remaining === 0) finish();
    };
    document.head.appendChild(s);
  });

  // Lưới an toàn: nếu sau 8 giây vẫn chưa nạp xong file nào, gần như chắc chắn
  // trình duyệt đang chặn việc nạp script cục bộ. Báo rõ còn hơn để trang trắng.
  setTimeout(function () {
    if (state.loaded) return;
    state.stalled = true;
    console.error("[curriculum] Quá thời gian chờ nạp dữ liệu.");
    finish();
  }, 8000);

  function finish() {
    if (state.loaded) return;
    state.loaded = true;

    if (!window.CURRICULUM.length) {
      var box = document.createElement("div");
      box.className = "danger-box";
      box.style.cssText = "margin:80px auto;max-width:760px";
      box.innerHTML =
        "<b>Không nạp được dữ liệu chủ đề</b>" +
        "<p>Trình duyệt đang chặn việc nạp file cục bộ. Cách xử lý: mở terminal tại thư mục " +
        "<code>📚 Học</code> rồi chạy</p>" +
        "<p><code>python -m http.server 8000</code></p>" +
        "<p>sau đó vào <code>http://localhost:8000</code>. " +
        "Tiến độ đã tick ở chế độ <code>file://</code> sẽ không mang sang được, vì trình duyệt " +
        "coi hai cách mở này là hai nơi lưu trữ khác nhau.</p>";
      (document.querySelector("main") || document.body).prepend(box);
    }

    if (state.failed.length) {
      console.error("[curriculum] Không nạp được:", state.failed.join(", "));
    }
    document.dispatchEvent(new CustomEvent("curriculum:ready", { detail: state }));
  }
})();
