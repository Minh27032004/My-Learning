/* =========================================================
   hoc.js — hành vi dùng chung cho các trang học
   Gồm 4 việc: copy code · lưu tiến độ · thanh %  · lọc tìm kiếm
   Tất cả đều "progressive": trang vẫn đọc được nếu JS lỗi.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 0. localStorage an toàn ----------
     Mở file bằng file:// có thể bị chặn storage → không được để vỡ trang. */
  var store = (function () {
    try {
      var k = "__t";
      localStorage.setItem(k, "1");
      localStorage.removeItem(k);
      return localStorage;
    } catch (e) {
      var mem = {};
      return {
        getItem: function (k) { return k in mem ? mem[k] : null; },
        setItem: function (k, v) { mem[k] = String(v); },
        removeItem: function (k) { delete mem[k]; },
        _volatile: true
      };
    }
  })();

  var KEY = "hoc.progress.v1";

  function loadState() {
    try { return JSON.parse(store.getItem(KEY) || "{}"); } catch (e) { return {}; }
  }
  function saveState(s) {
    try { store.setItem(KEY, JSON.stringify(s)); } catch (e) { /* bỏ qua */ }
  }

  /* ---------- 1. Nút copy cho mọi code block ---------- */
  function textOf(pre) {
    // lấy text thuần, bỏ mọi thẻ tô màu
    return pre.innerText.replace(/ /g, " ");
  }

  function copyText(str) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(str);
    }
    // fallback cho file:// hoặc trình duyệt cũ
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = str;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy") ? resolve() : reject();
      } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  function initCopy() {
    var blocks = document.querySelectorAll(".code");
    Array.prototype.forEach.call(blocks, function (block) {
      var pre = block.querySelector("pre");
      if (!pre) return;
      // Trang học chèn code block động và gọi lại hàm này — đừng gắn nút hai lần
      if (block.dataset.copyInit) return;
      block.dataset.copyInit = "1";

      var head = block.querySelector(".code-head");
      if (!head) {
        head = document.createElement("div");
        head.className = "code-head";
        var lang = document.createElement("span");
        lang.className = "lang";
        lang.textContent = block.dataset.lang || "bash";
        head.appendChild(lang);
        block.insertBefore(head, pre);
      }

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy";
      btn.textContent = "Sao chép";
      btn.addEventListener("click", function () {
        copyText(textOf(pre)).then(function () {
          btn.textContent = "Đã chép ✓";
          btn.dataset.copied = "1";
          setTimeout(function () {
            btn.textContent = "Sao chép";
            btn.removeAttribute("data-copied");
          }, 1600);
        }, function () {
          btn.textContent = "Chép tay giúp mình";
        });
      });
      head.appendChild(btn);
    });
  }

  /* ---------- 2. Checkbox tiến độ + đồng bộ localStorage ----------
     Bản đồ được dựng bất đồng bộ (sau khi nạp xong dữ liệu mảng), nên
     KHÔNG gắn listener vào từng ô — dùng uỷ quyền sự kiện ở document và
     đồng bộ lại mỗi khi có ô mới xuất hiện. */
  function syncFromStore() {
    var state = loadState();
    var boxes = document.querySelectorAll("input[type=checkbox][data-k]");
    Array.prototype.forEach.call(boxes, function (box) {
      box.checked = !!state[box.dataset.k];
    });
    refresh();
  }

  function initProgress() {
    document.addEventListener("change", function (e) {
      var box = e.target;
      if (!box.matches || !box.matches("input[type=checkbox][data-k]")) return;
      var s = loadState();
      if (box.checked) { s[box.dataset.k] = 1; } else { delete s[box.dataset.k]; }
      saveState(s);
      refresh();
    });

    if (store._volatile) {
      var w = document.getElementById("storage-warn");
      if (w) w.hidden = false;
    }

    syncFromStore();
    document.addEventListener("map:rendered", syncFromStore);
  }

  /* Tính lại mọi thanh % (theo từng khối [data-track] và tổng toàn trang) */
  function refresh() {
    var totalAll = 0, doneAll = 0;

    Array.prototype.forEach.call(document.querySelectorAll("[data-track]"), function (track) {
      var boxes = track.querySelectorAll("input[type=checkbox][data-k]");
      var done = 0;
      Array.prototype.forEach.call(boxes, function (b) { if (b.checked) done++; });
      totalAll += boxes.length;
      doneAll += done;

      var pct = boxes.length ? Math.round((done / boxes.length) * 100) : 0;
      var fill = track.querySelector(".bar > i");
      if (fill) fill.style.width = pct + "%";
      var label = track.querySelector(".pct");
      if (label) label.textContent = done + "/" + boxes.length + " · " + pct + "%";

      var node = track.closest(".node");
      if (node) node.dataset.done = (boxes.length && done === boxes.length) ? "1" : "0";
    });

    var gp = document.getElementById("global-pct");
    var gb = document.getElementById("global-bar");
    var pctAll = totalAll ? Math.round((doneAll / totalAll) * 100) : 0;
    if (gp) gp.textContent = doneAll + " / " + totalAll + " mục · " + pctAll + "%";
    if (gb) gb.style.width = pctAll + "%";
  }

  /* ---------- 3. Ô lọc / tìm nhanh ---------- */
  function initFilter() {
    var input = document.getElementById("filter");
    if (!input) return;
    var targets = document.querySelectorAll("[data-searchable]");
    var sections = document.querySelectorAll("section[id]");
    var empty = document.getElementById("filter-empty");

    function apply() {
      var q = input.value.trim().toLowerCase();
      var hits = 0;

      Array.prototype.forEach.call(targets, function (el) {
        var match = !q || el.textContent.toLowerCase().indexOf(q) !== -1;
        el.hidden = !match;
        if (match) hits++;
      });

      // ẩn luôn section không còn thẻ nào hiện
      Array.prototype.forEach.call(sections, function (sec) {
        if (!q) { sec.hidden = false; return; }
        var visible = sec.querySelectorAll("[data-searchable]:not([hidden])").length;
        var selfMatch = sec.querySelectorAll("[data-searchable]").length === 0 &&
                        sec.textContent.toLowerCase().indexOf(q) !== -1;
        sec.hidden = !(visible || selfMatch);
      });

      if (empty) empty.hidden = !(q && hits === 0);
    }

    input.addEventListener("input", apply);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { input.value = ""; apply(); }
    });

    // phím tắt "/" để nhảy vào ô tìm — thói quen của dân dùng terminal
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== input &&
          !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
        e.preventDefault();
        input.focus();
      }
    });
  }

  /* ---------- 4. Scrollspy cho rail điều hướng ---------- */
  function initSpy() {
    var links = document.querySelectorAll("[data-spy] a[href^='#']");
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    Array.prototype.forEach.call(links, function (a) {
      var id = a.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (el) map[id] = a;
    });

    // Nhiều section cùng cắt qua dải quan sát → chọn cái nằm CAO NHẤT
    // trong tài liệu, thay vì cái phát tín hiệu sau cùng.
    var visible = {};
    var order = Object.keys(map);

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });

      var current = null;
      for (var i = 0; i < order.length; i++) {
        if (visible[order[i]]) { current = order[i]; break; }
      }
      Array.prototype.forEach.call(links, function (a) { a.removeAttribute("aria-current"); });
      if (current) map[current].setAttribute("aria-current", "true");
    }, { rootMargin: "-80px 0px -70% 0px" });

    order.forEach(function (id) { obs.observe(document.getElementById(id)); });
  }

  /* ---------- 5. Nút reset tiến độ ---------- */
  function initReset() {
    var btn = document.getElementById("reset-progress");
    if (!btn) return;
    var armed = false, timer;
    btn.addEventListener("click", function () {
      if (!armed) {
        armed = true;
        btn.textContent = "Chắc chưa? Bấm lại để xoá";
        timer = setTimeout(function () { armed = false; btn.textContent = "Xoá tiến độ"; }, 3500);
        return;
      }
      clearTimeout(timer);
      armed = false;
      saveState({});
      Array.prototype.forEach.call(document.querySelectorAll("input[type=checkbox][data-k]"), function (b) { b.checked = false; });
      refresh();
      btn.textContent = "Đã xoá";
      setTimeout(function () { btn.textContent = "Xoá tiến độ"; }, 1600);
    });
  }

  /* Che mọi thứ trông giống API key trước khi cho copy đi chỗ khác.
     Response bình thường không chứa key, nhưng thông điệp lỗi thì có thể. */
  function redact(text) {
    return String(text)
      .replace(/AIza[0-9A-Za-z_\-]{20,}/g, "AIza…ĐÃ-CHE")
      .replace(/sk-[A-Za-z0-9_\-]{16,}/g, "sk-…ĐÃ-CHE")
      .replace(/AQ\.[A-Za-z0-9_\-]{16,}/g, "AQ.…ĐÃ-CHE")
      .replace(/\b[A-Za-z0-9_\-]{32,}\b/g, function (m) {
        return m.slice(0, 4) + "…ĐÃ-CHE";       // chuỗi dài lạ → che cho chắc
      });
  }

  /* Nút "sao chép để gửi đi" cho các hộp lỗi — đã che key sẵn */
  function diagButton(getText) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "btn";
    b.textContent = "Sao chép (đã che key)";
    b.addEventListener("click", function () {
      copyText(redact(getText())).then(function () {
        b.textContent = "Đã chép ✓";
        setTimeout(function () { b.textContent = "Sao chép (đã che key)"; }, 1800);
      }, function () {
        b.textContent = "Không chép được — bôi đen rồi Ctrl+C";
      });
    });
    return b;
  }

  /* API dùng chung cho các trang khác — đừng viết lại logic lưu trữ lần hai */
  window.HocUI = {
    redact: redact,
    diagButton: diagButton,
    initCopy: initCopy,
    refresh: refresh,
    sync: syncFromStore,
    isDone: function (key) { return !!loadState()[key]; },
    setDone: function (key, on) {
      var s = loadState();
      if (on) { s[key] = 1; } else { delete s[key]; }
      saveState(s);
    }
  };

  /* ---------- Cảnh báo trình duyệt đang chặn lưu trữ ----------
     config.js đã có đường lui: localStorage hỏng thì rơi về một object
     trong bộ nhớ và bật cờ AIConfig.volatile. Nhưng TRƯỚC ĐÂY không nơi
     nào ĐỌC cờ đó, nên người dùng không hề biết mình đang ở chế độ này.

     Hậu quả thật đã gặp: mở app bằng file:// (nháy đúp), Chrome chặn
     localStorage → nhập key ở trang Cài đặt thì thử model chạy ngon (key
     còn trong RAM của ĐÚNG trang đó), nhưng sang trang học là trang khác,
     RAM khác, key biến mất → bấm "Làm bài tập" không ra gì.

     Đặt ở hoc.js vì file này được nạp ở CẢ hoc.html lẫn cai-dat.html. */
  function warnVolatileStorage() {
    if (!window.AIConfig || !window.AIConfig.volatile) return;

    var box = document.createElement("div");
    box.className = "danger-box";
    box.style.cssText = "margin:0 0 22px";
    box.innerHTML =
      "<b>Trình duyệt đang chặn lưu trữ — API key sẽ mất khi bạn đổi trang</b>" +
      "<p>Key vừa nhập chỉ sống trong bộ nhớ của đúng trang này. Chuyển sang trang khác " +
      "là mất, nên trang học sẽ báo “chưa có key” dù bạn vừa nhập xong.</p>" +
      "<p>Nguyên nhân gần như luôn là mở file bằng cách nháy đúp (<code>file://</code>). " +
      "Cách xử lý: mở terminal tại thư mục <code>📚 Học</code> rồi chạy</p>" +
      "<p><code>python -m http.server 8000</code></p>" +
      "<p>sau đó vào <code>http://localhost:8000</code> và nhập key lại một lần ở đó.</p>";

    var host = document.querySelector("main") || document.body;
    host.prepend(box);
  }

  document.addEventListener("DOMContentLoaded", function () {
    /* Cảnh báo lưu trữ chạy TRƯỚC và TÁCH BIỆT: nó là thứ giải thích vì sao
       cả app "im lặng không hoạt động", nên không được để một init khác
       (trang này thiếu phần tử trang kia có) ném lỗi và nuốt mất nó. */
    try { warnVolatileStorage(); } catch (e) { console.error("[hoc] cảnh báo lưu trữ:", e); }

    initCopy();
    initProgress();
    initFilter();
    initSpy();
    initReset();
  });
})();
