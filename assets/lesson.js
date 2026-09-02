/* =========================================================
   lesson.js — điều phối trang hoc.html.

   Biết: luồng người dùng và DOM.
   KHÔNG biết: nhà cung cấp nào đang dùng, request trông ra sao.
   Mọi thứ liên quan tới AI đi qua window.AI và window.Prompts.

   Trạng thái nằm trong bộ nhớ trang, không ghi xuống đâu cả —
   trừ ô "đã học xong", vốn là tiến độ chung của bản đồ.
   ========================================================= */
(function () {
  "use strict";

  var ctx = null;          // { key, item, module, track, prev, next }
  var lessonData = null;
  var questions = [];      // toàn bộ câu hỏi đang hiện
  var asked = [];          // đề bài đã hỏi — chống lặp, chỉ trong phiên này
  var answered = 0, correct = 0;
  var busy = false;
  var controller = null;

  function $(id) { return document.getElementById(id); }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ================= Thông báo lỗi =================
     MỌI thông báo đều nhận `where` — id của vùng sẽ chứa nó.

     Vì sao cần tham số này: trang học rất dài (bài chuyên sâu ~15.000px).
     Trước đây mọi thông báo đều đổ vào #alert ở ĐẦU trang, trong khi nút
     "Làm bài tập" nằm ở CUỐI trang — người bấm nút ở dưới không thấy gì,
     tưởng nút hỏng. Báo lỗi phải hiện NGAY CẠNH thứ vừa được bấm. */
  function clearAlert(where) {
    var host = $(where || "alert");
    if (host) host.textContent = "";
  }

  function showError(e, retry, where) {
    var box = el("div", "danger-box");
    box.appendChild(el("b", null, "Không lấy được nội dung · " + (e.code || "lỗi")));
    box.appendChild(el("p", null, e.message || String(e)));

    // Model nhỏ + mức Chuyên sâu = bài dài, rất dễ bị cắt giữa chừng → JSON hỏng
    if (e.code === "parse" && currentDepth() === "sau") {
      box.appendChild(el("p", null,
        "Bài ở mức Chuyên sâu rất dài, model đang dùng có thể bị cắt giữa chừng nên " +
        "trả về JSON không hoàn chỉnh. Thử hạ xuống mức Vừa, hoặc đổi sang model mạnh hơn."));
    }

    if (e.code === "model") {
      box.appendChild(el("p", null,
        "Model đang chọn không dùng được với key của bạn. Vào Cài đặt, bấm " +
        "“Tải danh sách” ở ô Model để lấy đúng những model mà key này gọi được, rồi chọn lại."));
    }

    var row = el("div", "row");
    if (retry) {
      var again = el("button", "btn", "Thử lại");
      again.type = "button";
      again.addEventListener("click", function () { clearAlert(); retry(); });
      row.appendChild(again);
    }
    if (e.code === "no-key" || e.code === "http" || e.code === "model") {
      var cfg = el("a", "btn", "Mở trang Cài đặt");
      cfg.href = "cai-dat.html";
      row.appendChild(cfg);
    }
    box.appendChild(row);

    if (e.detail) {
      var d = el("details");
      d.appendChild(el("summary", null, "Xem nguyên văn nhà cung cấp trả về"));

      var tools = el("p", "small muted");
      tools.appendChild(window.HocUI.diagButton(function () {
        return "Lỗi: " + e.code + " — " + e.message + "\n\n" + e.detail;
      }));
      d.appendChild(tools);

      var pre = el("pre");
      pre.style.cssText = "overflow-x:auto;font-size:12px;color:var(--text-dim);white-space:pre-wrap";
      pre.textContent = window.HocUI.redact(e.detail);
      d.appendChild(pre);
      box.appendChild(d);
    }

    clearAlert(where);
    $(where || "alert").appendChild(box);
    revealAlert(where);
  }

  /* Hộp báo lỗi cao hơn nửa màn hình, đặt ngay trên nút thì mép trên vẫn có
     thể tràn ra ngoài tầm nhìn. Kéo nó vào giữa để đọc được trọn vẹn. */
  function revealAlert(where) {
    if (!where) return;                 // #alert đầu trang: người dùng vốn đã ở đó
    var host = $(where);
    if (!host || !host.firstChild) return;
    host.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  function needSetup(where) {
    var s = window.AIConfig.status();
    if (s.ok) return false;
    var box = el("div", "note");
    box.appendChild(el("b", null, "Chưa cấu hình AI"));
    box.appendChild(el("p", null,
      s.reason + ". Vào trang Cài đặt nhập key, hoặc chọn chế độ Giả lập để xem thử giao diện."));
    var a = el("a", "btn", "Mở trang Cài đặt →");
    a.href = "cai-dat.html";
    box.appendChild(a);
    clearAlert(where);
    $(where || "alert").appendChild(box);
    revealAlert(where);
    return true;
  }

  /* Model đang dùng — mỗi người trong nhóm một key, một model, nên chất lượng
     bài đọc và câu hỏi khác nhau. Hiện ra để không ai thắc mắc vô cớ. */
  function showModelChip() {
    var chip = $("model-chip");
    if (!chip) return;
    var c = window.AIConfig.get();
    var label = window.AIConfig.PROVIDERS.filter(function (p) { return p.id === c.provider; })[0];
    var n = window.AI.counter.total;
    chip.textContent = (c.provider === "mock"
      ? "chế độ giả lập"
      : (label ? label.label.split(" ")[0] : c.provider) + " · " + c.models[c.provider]) +
      (n ? "  ·  " + n + " lượt gọi" : "");
  }

  /* ================= Khung xương lúc chờ ================= */
  function skeleton(host, label) {
    host.textContent = "";
    var l = el("div", "loading");
    l.appendChild(el("div", "spin"));
    l.appendChild(el("span", null, label));
    host.appendChild(l);
    for (var i = 0; i < 6; i++) {
      var s = el("div", "skel");
      s.style.width = (55 + Math.random() * 45) + "%";
      host.appendChild(s);
    }
  }

  /* ================= Bài đọc ================= */
  var SECTIONS = [
    ["tom_tat",        "Tóm tắt nhanh",              "highlight"],
    ["can_biet_truoc", "Cần biết trước",             "pre"],
    ["dinh_nghia",     "Là cái gì",                  "lead"],
    ["vi_sao_can",     "Vì sao cần biết",            ""],
    ["co_che",         "Cơ chế bên dưới",            ""],
    ["vi_du",          "Ví dụ cụ thể",               ""],
    ["so_sanh",        "So sánh & đánh đổi",         ""],
    ["loi_thuong_gap", "Lỗi & hiểu lầm thường gặp",  "warnish"],
    ["tu_kiem_tra",    "Tự kiểm tra",                "check"],
    ["tai_nguyen",     "Đọc thêm",                   ""],
    ["lien_he",        "Liên hệ với phần khác",      ""]
  ];

  function currentDepth() {
    return window.AIConfig.get().depth || "vua";
  }

  /* Bài soạn sẵn được ưu tiên tuyệt đối: đúng, ổn định, không tốn hạn mức.
     Chỉ khi chưa có mới nhờ AI sinh. */
  async function loadLesson(forceAI) {
    if (busy) return;

    if (!forceAI && window.LessonStore && window.LessonStore.has(ctx.key)) {
      busy = true;
      clearAlert();
      $("lesson-toc").hidden = true;
      skeleton($("lesson"), "Đang mở bài soạn sẵn…");

      var stored = await window.LessonStore.load(ctx.key);
      busy = false;

      if (stored) {
        lessonData = stored;
        renderLesson();
        markSource("soan-san");
        $("quiz").hidden = false;
        return;
      }
      // Nạp hỏng thì rơi xuống dùng AI, không để trang trắng
    }

    if (needSetup()) { $("lesson").textContent = ""; return; }

    busy = true;
    clearAlert();
    $("regen").disabled = true;
    $("lesson-toc").hidden = true;
    skeleton($("lesson"),
      "Đang soạn tài liệu “" + window.Prompts.DEPTH[currentDepth()].label.toLowerCase() +
      "” cho " + ctx.item + "…");

    controller = new AbortController();
    var req = window.Prompts.lesson(ctx, currentDepth());
    req.signal = controller.signal;

    try {
      lessonData = await window.AI.askJSON(req);
      renderLesson();
      markSource("ai");
      $("quiz").hidden = false;
    } catch (e) {
      $("lesson").textContent = "";
      showError(e, loadLesson);
    } finally {
      busy = false;
      $("regen").disabled = false;
      showModelChip();          // cập nhật số lượt đã gọi
    }
  }

  function renderLesson() {
    var host = $("lesson");
    host.textContent = "";

    var present = [];

    SECTIONS.forEach(function (s) {
      var key = s[0], title = s[1], style = s[2];
      var val = lessonData[key];
      if (!val || (Array.isArray(val) && !val.length)) return;

      var sec = el("section", "sec" + (style ? " sec-" + style : ""));
      sec.id = "sec-" + key;
      sec.appendChild(el("h3", null, title));

      var body = el("div", "sec-body");
      if (Array.isArray(val)) {
        window.MD.into(body, val.map(function (x) { return "- " + x; }).join("\n"));
      } else {
        window.MD.into(body, val);
        if (style === "lead") body.classList.add("lead-def");
      }
      sec.appendChild(body);
      host.appendChild(sec);
      present.push({ id: sec.id, title: title });
    });

    buildToc(present);
    showReadingTime();
  }

  /* Bài đọc giờ dài hơn hẳn — cần mục lục để nhảy nhanh */
  function buildToc(list) {
    var toc = $("lesson-toc");
    toc.textContent = "";
    if (list.length < 4) { toc.hidden = true; return; }

    list.forEach(function (s) {
      var a = el("a", null, s.title);
      a.href = "#" + s.id;
      toc.appendChild(a);
    });
    toc.hidden = false;
  }

  /* Người đọc phải biết chữ trước mắt mình từ đâu ra — soạn sẵn thì tin được,
     AI sinh thì phải kiểm chứng. Không nói rõ là thiếu trung thực. */
  function markSource(kind) {
    var bar = $("source-mark");
    bar.textContent = "";
    bar.className = "source-mark " + kind;

    if (kind === "soan-san") {
      bar.appendChild(el("b", null, "Bài soạn sẵn"));
      bar.appendChild(el("span", null,
        "Nội dung viết tay, cố định, không gọi API và không tốn hạn mức. " +
        "Ba nút độ sâu không áp dụng cho bài này."));
      var ai = el("button", "btn btn-ghost", "Nhờ AI viết bản khác");
      ai.type = "button";
      ai.addEventListener("click", function () { loadLesson(true); });
      bar.appendChild(ai);
      $("regen").hidden = true;
      document.querySelector(".depth").hidden = true;
    } else {
      bar.appendChild(el("b", null, "Do AI sinh"));
      bar.appendChild(el("span", null,
        "Chưa có bài soạn sẵn cho chủ đề này. Nội dung dưới đây có thể sai — " +
        "gặp chỗ đáng ngờ thì đối chiếu với roadmap .md của mảng."));
      $("regen").hidden = false;
      document.querySelector(".depth").hidden = false;
    }
    bar.hidden = false;
  }

  function showReadingTime() {
    var words = $("lesson").textContent.trim().split(/\s+/).length;
    var mins = Math.max(1, Math.round(words / 200));   // ~200 từ/phút tiếng Việt
    var chip = $("read-time");
    chip.textContent = "≈ " + mins + " phút đọc · " + words.toLocaleString("vi-VN") + " từ";
    chip.hidden = false;
  }

  /* ================= Quiz =================
     Vùng thông báo RIÊNG cho phần bài tập, nằm ngay dưới nút bấm.
     Bài đọc dùng #alert ở đầu trang, bài tập dùng vùng này — hai chỗ
     tách biệt vì chúng cách nhau cả chục nghìn pixel. */
  var QUIZ_ALERT = "quiz-alert";

  /* Số câu xin mỗi lượt — người dùng chọn được, vì đây là thứ quyết định
     thời gian chờ nhiều nhất (model sinh chữ TUẦN TỰ, gấp đôi số câu là
     gấp đôi thời gian). Chỉ nhận 5/10/20, giá trị lạ thì lùi về 5. */
  function currentCount() {
    var n = parseInt(window.AIConfig.get().soCau, 10);
    return (n === 5 || n === 10 || n === 20) ? n : 5;
  }

  /* Bấm lúc đang bận: trước đây `return` im lặng, không dấu vết gì.
     Trạng thái bận gần như luôn là "bài đọc đang tải" — nói thẳng ra
     để người dùng biết chờ, thay vì tưởng nút hỏng. */
  function showBusyNote() {
    var box = el("div", "note");
    box.appendChild(el("b", null, "Đang bận"));
    box.appendChild(el("p", null,
      "Bài đọc hoặc một yêu cầu trước đó chưa xong. Đợi nó chạy xong rồi bấm lại."));
    clearAlert(QUIZ_ALERT);
    $(QUIZ_ALERT).appendChild(box);
    revealAlert(QUIZ_ALERT);
  }

  function validate(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(function (q) {
      return q && typeof q.de_bai === "string" && q.de_bai.trim() &&
             Array.isArray(q.lua_chon) && q.lua_chon.length === 4 &&
             typeof q.dap_an === "number" && q.dap_an >= 0 && q.dap_an <= 3 &&
             typeof q.giai_thich === "string";
    });
  }

  async function fetchQuestions(btn, label) {
    /* Phản hồi NGAY tại nút, TRƯỚC mọi kiểm tra có thể thoát sớm.
       Trước đây hai lệnh `return` bên dưới chạy trước khi nút kịp đổi chữ,
       nên bấm nút mà không có bất kỳ dấu hiệu nào — không phân biệt được
       "app đang bận", "chưa có key" với "nút hỏng". */
    var oldText = label || btn.textContent;
    clearAlert(QUIZ_ALERT);

    if (busy) {
      showBusyNote();
      return;
    }
    if (needSetup(QUIZ_ALERT)) return;

    busy = true;
    btn.disabled = true;
    btn.textContent = "Đang ra đề…";

    controller = new AbortController();
    var soCau = currentCount();
    var req = window.Prompts.quiz(ctx, asked, soCau);
    req.signal = controller.signal;

    try {
      var data = await window.AI.askJSON(req);
      var got = validate(data.cau_hoi);

      if (!got.length) {
        throw { code: "shape", message: "Model không trả về câu hỏi nào hợp lệ.",
                detail: JSON.stringify(data, null, 2).slice(0, 3000) };
      }

      var dropped = (data.cau_hoi || []).length - got.length;
      var start = questions.length;
      got.forEach(function (q) {
        questions.push(q);
        asked.push(q.de_bai);
      });
      renderQuestions(start);
      updateScore();

      $("quiz-start").hidden = true;
      $("quiz-area").hidden = false;
      $("quiz-foot").hidden = false;
      $("score").hidden = false;

      var warn = [];
      if (dropped > 0) warn.push("Bỏ " + dropped + " câu sai định dạng.");
      if (asked.length > 50) warn.push("Đã hỏi " + asked.length + " câu — câu hỏi sẽ bắt đầu lặp ý, nên đổi chủ đề.");
      $("dup-warn").textContent = warn.join(" ");

    } catch (e) {
      showError(e, function () { fetchQuestions(btn, label); }, QUIZ_ALERT);
    } finally {
      busy = false;
      btn.disabled = false;
      btn.textContent = oldText;
    }
  }

  function renderQuestions(from) {
    var list = $("qlist");

    for (var i = from; i < questions.length; i++) {
      (function (idx) {
        var q = questions[idx];
        var li = el("li", "q");
        li.id = "q-" + idx;

        li.appendChild(el("div", "q-num", "Câu " + (idx + 1)));

        var body = el("div", "q-body");
        window.MD.into(body, q.de_bai);
        li.appendChild(body);

        var opts = el("ul", "opts");
        q.lua_chon.forEach(function (text, oi) {
          var wrap = document.createElement("li");
          var b = el("button", "opt");
          b.type = "button";
          b.appendChild(el("span", "letter", "ABCD"[oi]));
          var span = el("span");
          span.innerHTML = window.MD.render(text).replace(/^<p>|<\/p>$/g, "");
          b.appendChild(span);
          b.addEventListener("click", function () { answer(idx, oi, li, opts); });
          wrap.appendChild(b);
          opts.appendChild(wrap);
        });
        li.appendChild(opts);

        list.appendChild(li);
      })(i);
    }
  }

  function answer(qi, chosen, li, opts) {
    if (li.dataset.answered) return;
    li.dataset.answered = "1";

    var q = questions[qi];
    var right = chosen === q.dap_an;
    answered++;
    if (right) correct++;

    var buttons = opts.querySelectorAll(".opt");
    Array.prototype.forEach.call(buttons, function (b, i) {
      b.disabled = true;
      if (i === q.dap_an) b.classList.add("is-correct");
      else if (i === chosen) b.classList.add("is-chosen-wrong");
      else b.classList.add("dimmed");
    });

    li.classList.add(right ? "correct" : "wrong");

    var ex = el("div", "explain");
    ex.appendChild(el("span", "lbl", right ? "Chính xác" : "Chưa đúng — đáp án là " + "ABCD"[q.dap_an]));
    var body = el("div");
    window.MD.into(body, q.giai_thich);
    ex.appendChild(body);
    li.appendChild(ex);

    updateScore();
  }

  function updateScore() {
    var pct = answered ? Math.round((correct / answered) * 100) : 0;
    $("score-pct").textContent = answered ? pct + "%" : "—";
    $("score-sub").textContent = answered
      ? "đúng " + correct + "/" + answered + " · còn " + (questions.length - answered) + " câu chưa làm"
      : "chưa trả lời câu nào";
    $("score-bar").style.width = pct + "%";
    $("score-bar").style.background = answered && pct < 50 ? "var(--danger)"
      : answered && pct < 80 ? "var(--warn)" : "var(--ok)";
  }

  /* Bộ chọn số câu. Khác nút độ sâu ở một điểm quan trọng: đổi số câu KHÔNG
     gọi API ngay — nó chỉ đổi cho LƯỢT SAU, vì gọi lại tức thì sẽ đốt hạn
     mức chỉ để đổi một con số. */
  function initCount() {
    var btns = document.querySelectorAll("#quiz [data-n]");
    if (!btns.length) return;

    function paint() {
      var cur = currentCount();
      Array.prototype.forEach.call(btns, function (b) {
        b.setAttribute("aria-pressed", parseInt(b.dataset.n, 10) === cur ? "true" : "false");
      });
      // Nhãn nút phải khớp lựa chọn, nếu không người dùng bấm "Thêm 10 câu"
      // mà chỉ ra 5 câu thì tưởng app hỏng.
      var more = $("more-q");
      if (more) more.textContent = "Thêm " + cur + " câu";
      var note = $("socau-note");
      if (note) {
        note.textContent = cur <= 5 ? "nhanh nhất"
          : (cur === 10 ? "chờ lâu gấp đôi" : "chờ lâu gấp bốn");
      }
    }

    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener("click", function () {
        window.AIConfig.save({ soCau: parseInt(b.dataset.n, 10) });
        paint();
      });
    });
    paint();
  }

  /* Đổi độ sâu là sinh lại ngay — không bắt người dùng bấm thêm nút nữa */
  function initDepth() {
    /* Lọc theo [data-d], KHÔNG chỉ theo .depth-btn: bộ chọn số câu dùng lại
       cùng class đó để khỏi nhân đôi CSS, nên selector rộng sẽ vớ nhầm nút
       của nó và nổ ở DEPTH[undefined]. Chọn theo THUỘC TÍNH mới là dấu hiệu
       nhận dạng đúng của nhóm này. */
    var btns = document.querySelectorAll(".depth-btn[data-d]");

    function paint() {
      var cur = currentDepth();
      Array.prototype.forEach.call(btns, function (b) {
        b.setAttribute("aria-pressed", b.dataset.d === cur ? "true" : "false");
        b.title = window.Prompts.DEPTH[b.dataset.d].words;
      });
    }

    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener("click", function () {
        if (busy || b.dataset.d === currentDepth()) return;
        window.AIConfig.save({ depth: b.dataset.d });
        paint();
        loadLesson();
      });
    });
    paint();
  }

  /* ================= Tải về ================= */
  function download(name, text) {
    var blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function lessonMarkdown() {
    var out = ["# " + ctx.item, "",
      "> " + ctx.track.title + " → " + ctx.module.name, ""];
    SECTIONS.forEach(function (p) {
      var v = lessonData[p[0]];
      if (!v || (Array.isArray(v) && !v.length)) return;
      out.push("## " + p[1], "");
      out.push(Array.isArray(v) ? v.map(function (x) { return "- " + x; }).join("\n") : v, "");
    });

    var c = window.AIConfig.get();
    out.push("---", "",
      "_Sinh bởi AI (" + c.provider + " · " + (c.models[c.provider] || "") + ", mức " +
      window.Prompts.DEPTH[currentDepth()].label.toLowerCase() + ") ngày " +
      new Date().toLocaleDateString("vi-VN") + ". Có thể sai — đối chiếu lại trước khi tin._");
    return out.join("\n");
  }

  function quizMarkdown() {
    var out = ["# Câu hỏi — " + ctx.item, "",
      "> " + ctx.track.title + " → " + ctx.module.name, ""];
    questions.forEach(function (q, i) {
      out.push("### Câu " + (i + 1), "", q.de_bai, "");
      q.lua_chon.forEach(function (o, oi) { out.push("- " + "ABCD"[oi] + ". " + o); });
      out.push("", "**Đáp án: " + "ABCD"[q.dap_an] + "** — " + q.giai_thich, "");
    });
    return out.join("\n");
  }

  /* ================= Khởi tạo ================= */
  function fail(msg) {
    $("topic-title").textContent = "Không mở được chủ đề";
    var box = el("div", "danger-box");
    box.appendChild(el("b", null, "Sai đường dẫn"));
    box.appendChild(el("p", null, msg));
    var a = el("a", "btn", "← Về bản đồ");
    a.href = "index.html";
    box.appendChild(a);
    $("alert").appendChild(box);
  }

  function start() {
    var key = new URLSearchParams(location.search).get("t");
    if (!key) { fail("Địa chỉ thiếu tham số chủ đề."); return; }

    ctx = window.Curriculum.find(key);
    if (!ctx) {
      fail("Không tìm thấy chủ đề có khoá “" + key + "”. Có thể tên chủ đề đã đổi trong dữ liệu.");
      return;
    }

    document.documentElement.style.setProperty("--hue", ctx.track.color);
    document.title = ctx.item + " — " + ctx.track.title;
    $("topic-title").textContent = ctx.item;

    var crumb = $("crumb");
    var back = el("a", null, ctx.track.id.toUpperCase() + " " + ctx.track.title);
    back.href = "index.html#mang-" + ctx.track.id;
    crumb.appendChild(back);
    crumb.appendChild(el("span", "dot", "→"));
    crumb.appendChild(el("span", null, ctx.module.name));

    $("topic-bar").hidden = false;
    showModelChip();

    var done = $("done-box");
    done.checked = window.HocUI.isDone(ctx.key);
    done.addEventListener("change", function () {
      window.HocUI.setDone(ctx.key, done.checked);
    });

    if (ctx.prev) { $("prev-topic").hidden = false; $("prev-topic").href = "hoc.html?t=" + encodeURIComponent(ctx.prev); }
    if (ctx.next) { $("next-topic").hidden = false; $("next-topic").href = "hoc.html?t=" + encodeURIComponent(ctx.next); }

    initDepth();
    initCount();
    $("regen").addEventListener("click", loadLesson);
    $("dl-lesson").addEventListener("click", function () {
      if (!lessonData) return;
      download(window.Curriculum.slug(ctx.item) + ".md", lessonMarkdown());
    });
    $("start-quiz").addEventListener("click", function () {
      fetchQuestions($("start-quiz"), "Làm bài tập");
    });
    $("more-q").addEventListener("click", function () {
      // Nhãn tính lúc BẤM, không cố định — vì người dùng đổi số câu được
      fetchQuestions($("more-q"), "Thêm " + currentCount() + " câu");
    });
    $("dl-quiz").addEventListener("click", function () {
      if (!questions.length) return;
      download(window.Curriculum.slug(ctx.item) + "-cau-hoi.md", quizMarkdown());
    });

    // Cho phép vào thẳng phần bài tập kể cả khi bài đọc lỗi
    $("quiz").hidden = false;

    loadLesson();
  }

  window.Curriculum.ready(start);
})();
