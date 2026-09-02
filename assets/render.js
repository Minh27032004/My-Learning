/* =========================================================
   render.js — dựng bản đồ học từ dữ liệu đã nạp.

   Nguyên tắc: KHÔNG hard-code mảng nào. Thêm một công nghệ mới
   vào assets/curriculum/ là nó tự xuất hiện ở đây, ở thanh nav,
   và ở trang cài đặt — không sửa file này.
   ========================================================= */
(function () {
  "use strict";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function buildTrack(track, host) {
    var C = window.Curriculum;

    var node = el("article", "node");
    node.style.setProperty("--hue", track.color);
    node.id = "mang-" + track.id;

    var head = el("header", "track-head");

    var line = el("div", "track-line");
    line.appendChild(el("span", "track-id", track.id.toUpperCase()));
    line.appendChild(el("h2", null, track.title));
    if (track.tag) line.appendChild(el("span", "track-tag", track.tag));
    head.appendChild(line);

    if (track.why) head.appendChild(el("p", "track-why", track.why));

    var links = el("div", "track-links");
    if (track.page) {
      var a1 = el("a", "btn btn-primary", track.pageLabel || "Mở trang chi tiết");
      a1.href = track.page;
      links.appendChild(a1);
    }
    if (track.folder) {
      var a2 = el("a", "btn", "Roadmap đầy đủ ↗");
      a2.href = track.folder;
      // Roadmap là file markdown đặt trên kho mã, để nơi đó render giúp.
      if (/^https?:/.test(track.folder)) { a2.target = "_blank"; a2.rel = "noopener"; }
      links.appendChild(a2);
    }
    if (links.childNodes.length) head.appendChild(links);

    var prog = el("div", "track-prog");
    var bar = el("div", "bar");
    bar.appendChild(document.createElement("i"));
    prog.appendChild(bar);
    prog.appendChild(el("span", "pct", "0/0"));
    head.appendChild(prog);

    var body = el("div", "track-body");
    body.setAttribute("data-track", track.id);
    body.appendChild(head);

    track.modules.forEach(function (mod) {
      var d = el("details");
      var sum = el("summary");
      sum.appendChild(el("span", "mod-name", mod.name));
      sum.appendChild(el("span", "mod-count", mod.items.length + " mục"));
      d.appendChild(sum);

      var ul = el("ul", "checklist");
      mod.items.forEach(function (item) {
        var key = C.keyOf(track.id, mod.name, item);

        var li = el("li", "chk");
        var box = document.createElement("input");
        box.type = "checkbox";
        box.setAttribute("data-k", key);
        box.title = "Đánh dấu đã học";

        // Bấm vào CHỮ để mở trang học; bấm vào Ô để đánh dấu đã học.
        var a = el("a", "chk-text", item);
        a.href = "hoc.html?t=" + encodeURIComponent(key);

        li.appendChild(box);
        li.appendChild(a);

        // Đánh dấu bài đã có nội dung soạn sẵn — đọc được ngay, không cần API
        if (window.LessonStore && window.LessonStore.has(key)) {
          var mark = el("span", "has-lesson", "đã soạn");
          mark.title = "Bài này có nội dung viết tay, không cần API key";
          li.appendChild(mark);
        }
        ul.appendChild(li);
      });
      d.appendChild(ul);
      body.appendChild(d);
    });

    node.appendChild(body);
    host.appendChild(node);
  }

  function buildNav(all) {
    var nav = document.getElementById("track-nav");
    if (!nav) return;
    nav.textContent = "";
    all.forEach(function (t) {
      var a = el("a", null, t.id.toUpperCase() + " " + (t.short || shortTitle(t.title)));
      a.href = "#mang-" + t.id;
      nav.appendChild(a);
    });
    var s = el("a", "nav-settings", "Cài đặt");
    s.href = "cai-dat.html";
    nav.appendChild(s);
  }

  // Tiêu đề dài không vừa thanh nav — lấy vài từ đầu cho gọn.
  // Mảng nào muốn tên riêng thì đặt trường `short` trong dữ liệu.
  function shortTitle(title) {
    var words = title.split(/\s+/);
    if (words.length <= 2) return title;
    // Cắt 2 từ đầu rồi bỏ liên từ bị treo lại ở cuối ("Git &" → "Git")
    var out = words.slice(0, 2).join(" ").replace(/[\s&/+,\-–—]+$/, "");
    return out || words[0];
  }

  function render(state) {
    var C = window.Curriculum;
    var host = document.getElementById("tracks");
    if (!host) return;

    if (state.failed.length) {
      var warn = el("div", "danger-box");
      warn.innerHTML = "<b>Không nạp được dữ liệu</b><p>Thiếu file: <code>" +
        state.failed.join("</code>, <code>") +
        "</code>. Kiểm tra lại danh sách trong <code>assets/curriculum/_manifest.js</code>.</p>";
      host.appendChild(warn);
    }

    var roadmap = C.tracks("lo-trinh");
    var tech = C.tracks("cong-nghe");

    roadmap.forEach(function (t) { buildTrack(t, host); });

    // Công nghệ tách thành nhóm riêng: chúng không nằm trong thứ tự lộ trình
    if (tech.length) {
      var sep = el("div", "tech-divider");
      sep.appendChild(el("h2", null, "Công nghệ & thư viện"));
      sep.appendChild(el("p", "muted small",
        "Học khi cần, không theo thứ tự. Không tính vào gợi ý “học gì tiếp theo”."));
      host.appendChild(sep);
      tech.forEach(function (t) { buildTrack(t, host); });
    }

    buildNav(roadmap.concat(tech));

    var total = 0;
    window.CURRICULUM.forEach(function (t) { total += C.countItems(t); });
    var totalEl = document.getElementById("total-items");
    if (totalEl) totalEl.textContent = total;

    var trackEl = document.getElementById("total-tracks");
    if (trackEl) trackEl.textContent = window.CURRICULUM.length;

    firstRunNotice();

    // Dữ liệu đã có trong DOM → giờ mới bật các hành vi chung
    document.dispatchEvent(new CustomEvent("map:rendered"));
    setTimeout(nextUp, 0);
  }

  /* ---- Người mở trang lần đầu chưa có key thì phải được dẫn đường ----
     Trang dùng chung cho nhóm: mỗi người tự nhập key của mình. */
  function firstRunNotice() {
    var host = document.getElementById("first-run");
    if (!host || !window.AIConfig) return;

    var s = window.AIConfig.get();
    var hasKey = ["gemini", "openai", "claude"].some(function (p) {
      return (s.keys[p] || "").trim();
    });
    if (hasKey) return;

    host.hidden = false;
    host.className = "note";
    host.appendChild(el("b", null, "Lần đầu mở trang?"));
    host.appendChild(el("p", null,
      "Tài liệu và câu hỏi được sinh bằng AI, dùng API key của chính bạn — " +
      "key nằm trong trình duyệt này và không ai khác thấy được. " +
      "Chưa có key thì cứ để chế độ Giả lập để xem thử giao diện trước."));

    var row = el("div", "row");
    var a = el("a", "btn btn-primary", "Nhập API key →");
    a.href = "cai-dat.html";
    a.style.setProperty("--hue", "var(--accent)");
    row.appendChild(a);
    var b = el("a", "btn", "Xem thử bằng chế độ Giả lập");
    b.href = "cai-dat.html";
    row.appendChild(b);
    host.appendChild(row);
  }

  /* ---- "Học gì tiếp theo": CHỈ duyệt mảng thuộc lộ trình ---- */
  function nextUp() {
    var target = document.getElementById("next-item");
    if (!target) return;
    var ctx = document.getElementById("next-context");
    var link = document.getElementById("next-link");

    var box = null;
    var roadmap = window.Curriculum.tracks("lo-trinh");
    for (var i = 0; i < roadmap.length && !box; i++) {
      var node = document.getElementById("mang-" + roadmap[i].id);
      if (node) box = node.querySelector("input[type=checkbox]:not(:checked)");
    }

    if (!box) {
      target.textContent = "Hết lộ trình rồi.";
      if (ctx) ctx.textContent = "Giờ là lúc xây portfolio và đi phỏng vấn.";
      if (link) link.hidden = true;
      return;
    }

    var a = box.nextElementSibling;
    target.textContent = a.textContent;

    var nodeEl = box.closest(".node");
    var det = box.closest("details");
    if (ctx && nodeEl && det) {
      ctx.textContent = "Mảng " + nodeEl.id.replace("mang-", "").toUpperCase() + " · " +
        nodeEl.querySelector("h2").textContent + " → " + det.querySelector(".mod-name").textContent;
    }
    if (link) { link.hidden = false; link.href = a.href; }
  }

  window.Curriculum.ready(render);
  document.addEventListener("change", function (e) {
    if (e.target.matches && e.target.matches("input[type=checkbox][data-k]")) nextUp();
  });
})();
