/* =========================================================
   settings.js — điều phối trang cai-dat.html.
   Toàn bộ giao diện sinh từ dữ liệu: thêm một mảng vào
   assets/curriculum/ là ô prompt của nó tự xuất hiện ở đây.
   ========================================================= */
(function () {
  "use strict";

  var cfg = window.AIConfig;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function flash(id, msg, isError) {
    var n = document.getElementById(id);
    if (!n) return;
    n.textContent = msg;
    n.style.color = isError ? "var(--danger)" : "var(--ok)";
    n.setAttribute("data-on", "1");
    clearTimeout(n._t);
    n._t = setTimeout(function () { n.removeAttribute("data-on"); }, 2200);
  }

  /* ---------- 1. Thẻ nhà cung cấp ----------
     Bài học: bản trước chỉ hiện ô nhập key của nhà cung cấp ĐANG chọn.
     Mặc định là "giả lập" nên trang mở ra không có ô nhập key nào —
     người dùng tưởng chức năng hỏng. Giờ hiện hết, không giấu gì. */
  function buildProvider() { buildPanels(); }

  function buildPanels() {
    var host = document.getElementById("provider-panels");
    host.textContent = "";
    var c = cfg.get();

    cfg.PROVIDERS.forEach(function (p) {
      host.appendChild(p.id === "mock" ? mockCard(c) : providerCard(p, c));
    });
  }

  function markActive() {
    var active = cfg.get().provider;
    Array.prototype.forEach.call(document.querySelectorAll(".prov"), function (card) {
      var on = card.dataset.p === active;
      card.classList.toggle("active", on);
      var btn = card.querySelector(".prov-use");
      if (btn) {
        btn.textContent = on ? "Đang dùng" : "Dùng cái này";
        btn.disabled = on;
      }
    });
  }

  function head(p, c, extra) {
    var h = el("div", "prov-head");
    h.appendChild(el("span", "prov-name", p.label));
    if (extra) h.appendChild(extra);

    var use = el("button", "btn prov-use", "Dùng cái này");
    use.type = "button";
    use.addEventListener("click", function () {
      cfg.save({ provider: p.id });
      markActive();
      flash("test-status", "Đang dùng " + p.label);
    });
    h.appendChild(use);
    return h;
  }

  function providerCard(p, c) {
    var card = el("article", "prov");
    card.dataset.p = p.id;

    var state = el("span", "prov-state");
    function refreshState(val) {
      var has = !!(val || "").trim();
      state.textContent = has ? "đã có key" : "chưa có key";
      state.classList.toggle("has", has);
    }
    refreshState(c.keys[p.id]);

    card.appendChild(head(p, c, state));

    /* --- ô nhập key --- */
    var kf = el("div", "field");
    kf.appendChild(el("label", null, "API key"));

    var row = el("div", "inline");
    var input = document.createElement("input");
    input.type = "password";
    input.className = "key";
    input.value = c.keys[p.id] || "";
    input.placeholder = "dán key vào đây rồi bấm ra ngoài";
    input.autocomplete = "off";
    input.spellcheck = false;

    var toggle = el("button", "btn", "Hiện");
    toggle.type = "button";
    toggle.addEventListener("click", function () {
      var showing = input.type === "text";
      input.type = showing ? "password" : "text";
      toggle.textContent = showing ? "Hiện" : "Ẩn";
    });

    function save() {
      var patch = { keys: {} };
      patch.keys[p.id] = input.value.trim();
      cfg.save(patch);
      refreshState(input.value);
      flash("test-status", "Đã lưu key " + p.label);
    }
    // Lưu ở cả ba thời điểm: gõ xong, rời ô, và dán —
    // để không ai dán key rồi đóng tab mà mất trắng.
    input.addEventListener("change", save);
    input.addEventListener("blur", save);
    input.addEventListener("paste", function () { setTimeout(save, 0); });

    row.appendChild(input);
    row.appendChild(toggle);
    kf.appendChild(row);

    if (p.keyUrl) {
      var hint = el("p", "hint");
      var a = el("a", null, p.keyUrl);
      a.href = p.keyUrl; a.target = "_blank"; a.rel = "noopener";
      hint.appendChild(document.createTextNode("Lấy key tại "));
      hint.appendChild(a);
      kf.appendChild(hint);
    }
    card.appendChild(kf);

    // Nhà cung cấp nào có đường miễn phí thì nói rõ điều kiện
    if (p.free) {
      var freeBox = el("p", "free-note", p.free);
      card.appendChild(freeBox);
    }

    /* --- model --- */
    var mf = el("div", "field");
    mf.appendChild(el("label", null, "Model"));

    var mrow = el("div", "inline");
    var ms = el("select");

    function fill(list, selected) {
      ms.textContent = "";
      list.forEach(function (m) {
        var o = el("option", null, m.note ? m.id + "  —  " + m.note : m.id);
        o.value = m.id;
        if (selected === m.id) o.selected = true;
        ms.appendChild(o);
      });
      // Model đang lưu không có trong danh sách → vẫn giữ lại để không mất lựa chọn
      if (selected && !list.some(function (m) { return m.id === selected; })) {
        var o = el("option", null, selected + "  —  đang dùng");
        o.value = selected; o.selected = true;
        ms.insertBefore(o, ms.firstChild);
      }
    }
    fill(cfg.MODELS[p.id] || [], c.models[p.id]);

    ms.addEventListener("change", function () {
      var patch = { models: {} };
      patch.models[p.id] = ms.value;
      cfg.save(patch);
      flash("test-status", "Đã lưu model");
    });

    var note = el("p", "hint",
      "Danh sách dựng sẵn có thể lỗi thời. Bấm “Tải danh sách” để lấy đúng model mà key của bạn dùng được.");

    // Danh sách cứng luôn có ngày hết hạn — nút này hỏi thẳng API
    var refresh = el("button", "btn", "Tải danh sách");
    refresh.type = "button";
    refresh.title = "Hỏi API xem key này dùng được model nào";
    refresh.addEventListener("click", async function () {
      var prev = cfg.get().provider;
      refresh.disabled = true;
      refresh.textContent = "Đang hỏi…";
      try {
        cfg.save({ provider: p.id });               // listModels đọc provider hiện tại
        var ids = await window.AI.listModels();
        fill(ids.map(function (id) { return { id: id }; }), ms.value);
        note.textContent = "Key này dùng được " + ids.length + " model.";
        note.style.color = "var(--ok)";
      } catch (e) {
        note.textContent = e.message;
        note.style.color = "var(--danger)";
      } finally {
        cfg.save({ provider: prev });
        markActive();
        refresh.disabled = false;
        refresh.textContent = "Tải danh sách";
      }
    });

    mrow.appendChild(ms);
    mrow.appendChild(refresh);
    mf.appendChild(mrow);
    mf.appendChild(note);

    /* --- Thử từng model: cách duy nhất biết chắc model nào dùng được ---
       Danh sách API trả về là model TỒN TẠI, không có nghĩa là key của bạn
       được phép gọi. Free tier bị chặn nhiều model. Chỉ có gọi thật mới biết. */
    var probeRow = el("div", "row");
    probeRow.style.marginTop = "10px";
    var probe = el("button", "btn", "Thử từng model");
    probe.type = "button";
    probeRow.appendChild(probe);
    var probeNote = el("span", "small muted");
    probeRow.appendChild(probeNote);
    mf.appendChild(probeRow);

    var results = el("div", "probe-out");
    mf.appendChild(results);

    probe.addEventListener("click", async function () {
      var prev = cfg.get().provider;
      var ids = Array.prototype.map.call(ms.options, function (o) { return o.value; });

      probe.disabled = true;
      results.textContent = "";
      cfg.save({ provider: p.id });

      var ok = 0, rateLimited = 0;

      for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        probeNote.textContent = "đang thử " + (i + 1) + "/" + ids.length + "…";

        var row = el("div", "probe");
        var nameEl = el("code", null, id);
        row.appendChild(nameEl);
        var st = el("span", "probe-st", "…");
        row.appendChild(st);
        results.appendChild(row);

        var patch = { models: {} };
        patch.models[p.id] = id;
        cfg.save(patch);

        try {
          await window.AI.askJSONOnce({
            system: "Trả lời cực ngắn.",
            user: 'Trả về JSON {"ok":"1"}',
            schema: { type: "object", properties: { ok: { type: "string" } },
                      required: ["ok"], additionalProperties: false }
          });
          ok++;
          row.classList.add("good");
          st.textContent = "dùng được";
          // Bấm vào dòng xanh để chọn luôn model đó
          row.style.cursor = "pointer";
          row.title = "Bấm để chọn model này";
          (function (chosen) {
            row.addEventListener("click", function () {
              var pt = { models: {} }; pt.models[p.id] = chosen;
              cfg.save(pt);
              ms.value = chosen;
              flash("test-status", "Đã chọn " + chosen);
            });
          })(id);
        } catch (e) {
          // "rate" = bị chặn tốc độ, chờ là hết → đáng dừng sớm.
          // "model" (hạn mức 0) = model không có trong gói → cứ thử tiếp cái khác.
          var isRate = e.code === "rate";
          row.classList.add(isRate ? "warnish" : "bad");
          st.textContent = shortErr(e);
          if (isRate) rateLimited++;
        }

        // Free tier giới hạn số request mỗi phút — nghỉ giữa các lần gọi
        await new Promise(function (r) { setTimeout(r, 1200); });

        // Dừng ngay khi bị chặn tốc độ: thử tiếp chỉ đốt thêm lượt vô ích
        if (rateLimited >= 2) {
          results.appendChild(el("p", "hint",
            "Dừng sớm vì đang bị chặn tốc độ — thử tiếp chỉ tốn thêm lượt. " +
            "Đợi khoảng một phút rồi bấm lại."));
          break;
        }
      }

      // Trả về model cũ nếu không có cái nào chạy được
      if (!ok) { var back = { models: {} }; back.models[p.id] = ms.value; cfg.save(back); }
      cfg.save({ provider: prev });
      markActive();

      probe.disabled = false;
      probeNote.textContent = ok
        ? ok + "/" + ids.length + " model dùng được — bấm vào dòng xanh để chọn"
        : "Không model nào dùng được với key này";
      probeNote.style.color = ok ? "var(--ok)" : "var(--danger)";
    });

    card.appendChild(mf);
    return card;
  }

  /* Rút gọn thông điệp lỗi cho vừa một dòng */
  function shortErr(e) {
    var m = String(e.message || "");
    if (/hạn mức = 0|KHÔNG nằm trong gói/i.test(m)) return "không có trong gói miễn phí";
    if (/quá nhanh/i.test(m)) return "gọi quá nhanh — đợi rồi thử lại";
    if (/hết hạn mức TRONG NGÀY/i.test(m)) return "hết lượt hôm nay";
    if (e.code === "rate") return "bị chặn tốc độ";
    if (/not valid|invalid.*key|unauthor|permission/i.test(m)) return "key không hợp lệ";
    // Lỗi "shape" nghĩa là GỌI ĐƯỢC nhưng đọc không ra — lỗi phía trang này
    if (e.code === "shape") return "gọi được, nhưng đọc response không ra";
    if (e.code === "parse") return "trả về không phải JSON";
    if (e.code === "model" || /no longer|not found|not available/i.test(m)) return "không dùng được với key này";
    if (/billing|paid|tier/i.test(m)) return "cần bật billing";
    var num = m.match(/Lỗi (\d+)/);
    return num ? "lỗi " + num[1] : m.slice(0, 60);
  }

  function mockCard(c) {
    var p = { id: "mock", label: "Giả lập — không cần key" };
    var card = el("article", "prov");
    card.dataset.p = "mock";
    card.appendChild(head(p, c, null));

    var f = el("div", "field");
    f.appendChild(el("label", null, "Kiểu dữ liệu trả về"));
    var s = el("select");
    [["ok", "Trả dữ liệu hợp lệ"],
     ["badjson", "Trả JSON hỏng — để thử đường lỗi"],
     ["error", "Trả lỗi 429 — để thử đường lỗi"]].forEach(function (pair) {
      var o = el("option", null, pair[1]);
      o.value = pair[0];
      if ((c.mockMode || "ok") === pair[0]) o.selected = true;
      s.appendChild(o);
    });
    s.addEventListener("change", function () {
      cfg.save({ mockMode: s.value });
      flash("test-status", "Đã lưu");
    });
    f.appendChild(s);
    f.appendChild(el("p", "hint",
      "Không gọi mạng, không tốn token. Dùng để xem thử giao diện trước khi có key."));
    card.appendChild(f);
    return card;
  }

  /* ---------- 3. Nút gửi thử ---------- */
  function buildTest() {
    var btn = document.getElementById("test-btn");
    var out = document.getElementById("test-out");

    btn.addEventListener("click", async function () {
      out.textContent = "";
      btn.disabled = true;
      btn.textContent = "Đang gửi…";

      try {
        var res = await window.AI.askJSONOnce({
          system: "Bạn trả lời cực ngắn bằng tiếng Việt.",
          user: 'Trả về JSON có trường "ok" bằng đúng chuỗi "Kết nối thành công".',
          schema: {
            type: "object",
            properties: { ok: { type: "string" } },
            required: ["ok"],
            additionalProperties: false
          }
        });
        var box = el("div", "tip");
        box.appendChild(el("b", null, "Thành công"));
        box.appendChild(el("p", null, "Model trả về: " + JSON.stringify(res)));
        out.appendChild(box);
      } catch (e) {
        var bad = el("div", "danger-box");
        bad.appendChild(el("b", null, "Thất bại · mã lỗi: " + (e.code || "?")));
        bad.appendChild(el("p", null, e.message));
        if (e.detail) {
          var d = el("details");
          d.appendChild(el("summary", null, "Xem chi tiết nhà cung cấp trả về"));

          var tools = el("p", "small muted");
          tools.appendChild(window.HocUI.diagButton(function () {
            var c = cfg.get();
            return "Nhà cung cấp: " + c.provider + " · model: " + (c.models[c.provider] || "?") +
                   "\nLỗi: " + e.code + " — " + e.message + "\n\n" + e.detail;
          }));
          d.appendChild(tools);

          var pre = el("pre");
          pre.style.cssText = "overflow-x:auto;font-size:12px;color:var(--text-dim);white-space:pre-wrap";
          pre.textContent = window.HocUI.redact(e.detail);
          d.appendChild(pre);
          bad.appendChild(d);
        }
        out.appendChild(bad);
      } finally {
        btn.disabled = false;
        btn.textContent = "Gửi thử một yêu cầu";
      }
    });
  }

  /* ---------- 4. Ô prompt ---------- */
  function promptBox(level, id, kind, label, placeholder) {
    var wrap = el("div");
    wrap.appendChild(el("div", "lvl", label));
    var ta = document.createElement("textarea");
    ta.value = cfg.userPrompt(level, id, kind);
    ta.placeholder = placeholder;
    ta.rows = 4;
    ta.addEventListener("change", function () {
      cfg.setUserPrompt(level, id, kind, ta.value.trim());
      flash("prompt-status", "Đã lưu");
    });
    wrap.appendChild(ta);
    return wrap;
  }

  function buildPrompts() {
    var P = window.Prompts;

    // --- Tầng gốc ---
    var g = document.getElementById("prompt-global");
    var gd = el("details");
    gd.open = false;
    var gs = el("summary");
    gs.appendChild(el("span", "mod-name", "Tầng 1 — Prompt gốc (áp dụng cho mọi mảng)"));
    gd.appendChild(gs);
    var gp = el("div", "prompt-pair");
    gp.appendChild(promptBox("global", null, "lesson", "Bài đọc", P.BASE.lesson));
    gp.appendChild(promptBox("global", null, "quiz", "Câu hỏi", P.BASE.quiz));
    gd.appendChild(gp);
    g.appendChild(gd);

    // --- Tầng mảng + module ---
    var host = document.getElementById("prompt-tracks");
    window.CURRICULUM.forEach(function (track) {
      var td = el("details", "track-prompts");
      td.style.setProperty("--hue", track.color);
      var ts = el("summary");
      ts.appendChild(el("span", "mod-name", track.id.toUpperCase() + " — " + track.title));
      ts.appendChild(el("span", "mod-count", track.modules.length + " module"));
      td.appendChild(ts);

      var tp = el("div", "prompt-pair");
      tp.appendChild(promptBox("track", track.id, "lesson", "Tầng 2 — Bài đọc",
        (track.prompts && track.prompts.lesson) || "(kế thừa tầng gốc)"));
      tp.appendChild(promptBox("track", track.id, "quiz", "Tầng 2 — Câu hỏi",
        (track.prompts && track.prompts.quiz) || "(kế thừa tầng gốc)"));
      td.appendChild(tp);

      track.modules.forEach(function (mod) {
        var modId = track.id + ":" + window.Curriculum.slug(mod.name);
        var md = el("details", "mod-prompts");
        var msum = el("summary");
        msum.appendChild(el("span", "mod-name", mod.name));
        var has = cfg.userPrompt("module", modId, "lesson") || cfg.userPrompt("module", modId, "quiz");
        msum.appendChild(el("span", "mod-count", has ? "đã tuỳ biến" : "mặc định"));
        md.appendChild(msum);

        var mp = el("div", "prompt-pair");
        mp.appendChild(promptBox("module", modId, "lesson", "Tầng 3 — Bài đọc", "(kế thừa tầng mảng)"));
        mp.appendChild(promptBox("module", modId, "quiz", "Tầng 3 — Câu hỏi", "(kế thừa tầng mảng)"));
        md.appendChild(mp);
        td.appendChild(md);
      });

      host.appendChild(td);
    });
  }

  /* ---------- 5. Nút xoá ---------- */
  function buildResets() {
    var armed = {};
    function confirmTwice(btn, label, action) {
      btn.addEventListener("click", function () {
        if (!armed[label]) {
          armed[label] = true;
          btn.textContent = "Chắc chưa? Bấm lại";
          setTimeout(function () { armed[label] = false; btn.textContent = label; }, 3500);
          return;
        }
        armed[label] = false;
        btn.textContent = label;
        action();
      });
    }

    confirmTwice(document.getElementById("reset-prompts"),
      "Khôi phục toàn bộ prompt mặc định", function () {
        cfg.save({ prompts: { global: {}, track: {}, module: {} } });
        // ghi đè hẳn, deepMerge không xoá được khoá cũ
        var c = cfg.get();
        c.prompts = { global: {}, track: {}, module: {} };
        try { localStorage.setItem("hoc.ai.config.v1", JSON.stringify(c)); } catch (e) {}
        location.reload();
      });

    confirmTwice(document.getElementById("reset-all"),
      "Xoá toàn bộ cấu hình", function () { cfg.reset(); location.reload(); });
  }

  window.Curriculum.ready(function () {
    buildProvider();
    markActive();
    buildTest();
    buildPrompts();
    buildResets();
    if (cfg.volatile) {
      var w = document.createElement("div");
      w.className = "warn";
      w.innerHTML = "<b>Cảnh báo</b><p>Trình duyệt đang chặn localStorage — cấu hình sẽ mất khi đóng tab.</p>";
      document.querySelector("main").prepend(w);
    }
  });
})();
