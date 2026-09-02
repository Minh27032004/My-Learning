/* =========================================================
   provider.js — một interface, bốn nhà cung cấp.

     await AI.askJSON({ system, user, schema, signal }) → object

   Module này CHỈ biết HTTP. Nó không biết quiz là gì, bài đọc là gì.
   Thêm nhà cung cấp thứ năm = thêm một object vào ADAPTERS.

   Shape request xác minh từ tài liệu chính thức ngày 2026-08-29.
   Shape RESPONSE chưa xác minh được (trang tài liệu 404), nên phần
   trích xuất text cố ý thử nhiều dạng và phơi raw JSON khi thất bại —
   thà báo lỗi rõ ràng còn hơn hỏng im lặng.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Đếm số request đã gửi trong phiên này ----------
     Free tier tính theo LƯỢT GỌI, và trang này gọi ở nhiều chỗ hơn người dùng
     tưởng: mở trang học, đổi độ sâu, bấm sinh lại, dò model. Không hiện ra thì
     không ai hiểu vì sao hết lượt nhanh. Chỉ nằm trong bộ nhớ, không lưu. */
  var counter = { total: 0, byModel: {} };

  /* ---------- Lỗi có phân loại, để giao diện hiển thị đúng cách ---------- */
  function AIError(code, message, detail) {
    var e = new Error(message);
    e.code = code;          // no-key | http | network | parse | shape | aborted
    e.detail = detail;
    return e;
  }

  /* ---------- Trích nội dung từ response ----------
     Ba nhà cung cấp, mỗi bên một shape, và shape còn đổi theo thời gian.
     Thay vì liệt kê từng đường dẫn cứng (cách này đã hỏng một lần với
     Gemini /v1beta/interactions), duyệt đệ quy toàn bộ cây JSON và
     nhặt ứng viên. Vì luôn yêu cầu model trả JSON, ứng viên đúng là
     chuỗi/object parse được thành JSON. */

  // Bỏ qua các nhánh chắc chắn không chứa nội dung, tránh nhặt nhầm
  // Gồm cả các khoá ECHO LẠI REQUEST — nếu không bỏ, ta sẽ nhặt trúng
  // chính prompt mình vừa gửi đi và tưởng đó là câu trả lời.
  var SKIP_KEYS = /^(usage|usage_metadata|safety|safetyRatings|promptFeedback|metadata|model|id|created|object|logprobs|citations?|thinking|reasoning|input|prompt|request|instructions?|system_instruction|systemInstruction|messages|schema|response_format|responseSchema)$/i;
  var TEXTY_KEYS = /^(text|output_text|content|response|answer|message|result|parsed|value)$/i;

  function collectCandidates(node, key, depth, strs, objs) {
    if (node == null || depth > 12) return;

    if (typeof node === "string") {
      if (node.length > 1 && (!key || !SKIP_KEYS.test(key))) {
        strs.push({ v: node, keyed: key ? TEXTY_KEYS.test(key) : false });
      }
      return;
    }

    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        collectCandidates(node[i], key, depth + 1, strs, objs);
      }
      return;
    }

    if (typeof node === "object") {
      // Object cũng có thể chính là kết quả (khi API tự parse sẵn), nhưng
      // nó CŨNG có thể chỉ là lớp bọc. Ghi lại độ sâu để ưu tiên lớp trong cùng.
      if (key && TEXTY_KEYS.test(key)) objs.push({ v: node, depth: depth });
      for (var k in node) {
        if (!Object.prototype.hasOwnProperty.call(node, k)) continue;
        if (SKIP_KEYS.test(k)) continue;
        collectCandidates(node[k], k, depth + 1, strs, objs);
      }
    }
  }

  function unfence(s) {
    return String(s).trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  function extractText(json) {
    if (typeof json === "string") return json;

    var strs = [], objs = [];
    collectCandidates(json, null, 0, strs, objs);

    // Chuỗi: ưu tiên khoá "có vẻ là nội dung", rồi tới chuỗi dài nhất
    strs.sort(function (a, b) {
      if (a.keyed !== b.keyed) return a.keyed ? -1 : 1;
      return String(b.v).length - String(a.v).length;
    });

    // VÒNG 1 — chuỗi parse được thành JSON. Đây là trường hợp gần như luôn đúng,
    // vì mình đã yêu cầu model trả JSON.
    for (var i = 0; i < strs.length; i++) {
      var s = unfence(strs[i].v);
      if (s.charAt(0) === "{" || s.charAt(0) === "[") {
        try { JSON.parse(s); return s; } catch (e) { /* thử ứng viên kế */ }
      }
    }

    // VÒNG 2 — API đã parse sẵn thành object. Lấy lớp SÂU NHẤT: lớp nông hơn
    // thường chỉ là vỏ bọc kiểu {type:"output_text", parsed:{...}}.
    if (objs.length) {
      objs.sort(function (a, b) { return b.depth - a.depth; });
      return objs[0].v;
    }

    // VÒNG 3 — không có JSON nào. Trả chuỗi dài nhất để tầng trên báo lỗi parse
    // kèm nội dung thật, thay vì báo "không tìm thấy gì".
    for (var j = 0; j < strs.length; j++) {
      if (String(strs[j].v).length > 20) return strs[j].v;
    }

    throw AIError("shape",
      "Không tìm thấy nội dung trong response của nhà cung cấp.",
      JSON.stringify(json, null, 2).slice(0, 6000));
  }

  /* ---------- Đọc chi tiết lỗi quota của Google ----------
     Google trả 429 RESOURCE_EXHAUSTED cho HAI chuyện hoàn toàn khác nhau:
       (a) bạn gọi quá nhiều  → chờ là hết
       (b) model KHÔNG có trong gói của bạn → hạn mức bằng 0, chờ bao lâu cũng vô ích
     Không phân biệt hai cái này thì người dùng ngồi đợi vô ích cả ngày. */
  function readQuota(body) {
    if (Array.isArray(body)) body = body[0] || {};
    var err = (body && body.error) || {};
    var details = err.details || [];
    var out = { zero: false, perMinute: false, perDay: false, retry: null, quotaId: null };

    details.forEach(function (d) {
      if (/QuotaFailure/.test(d["@type"] || "")) {
        (d.violations || []).forEach(function (v) {
          var id = v.quotaId || v.quotaMetric || "";
          out.quotaId = out.quotaId || id;
          if (String(v.quotaValue) === "0") out.zero = true;
          if (/PerMinute/i.test(id)) out.perMinute = true;
          if (/PerDay/i.test(id)) out.perDay = true;
        });
      }
      if (/RetryInfo/.test(d["@type"] || "") && d.retryDelay) out.retry = d.retryDelay;
    });
    return out;
  }

  function quotaMessage(q, model) {
    if (q.zero) {
      return "Model “" + model + "” KHÔNG nằm trong gói miễn phí của bạn " +
             "(hạn mức = 0). Chờ bao lâu cũng không dùng được — phải đổi model khác " +
             "hoặc bật billing.";
    }
    if (q.perMinute) {
      return "Gọi quá nhanh (quá số lần cho phép mỗi phút)" +
             (q.retry ? ". Đợi " + q.retry + " rồi thử lại." : ". Đợi một phút rồi thử lại.");
    }
    if (q.perDay) {
      return "Đã dùng hết hạn mức TRONG NGÀY của model này. Mai mới được tiếp, " +
             "hoặc đổi sang model khác.";
    }
    return null;
  }

  /* ---------- Lấy thông điệp lỗi mà nhà cung cấp trả về ---------- */
  function providerMessage(body) {
    if (!body) return "";
    if (typeof body === "string") return body.slice(0, 500);
    // Google đôi khi bọc lỗi trong một mảng: [{ "error": {...} }]
    if (Array.isArray(body)) body = body[0] || {};
    var e = body.error || body;
    if (typeof e === "string") return e.slice(0, 500);
    return (e && (e.message || e.msg || e.detail)) || JSON.stringify(body).slice(0, 500);
  }

  /* ================= ADAPTERS ================= */
  var ADAPTERS = {

    /* --- Gemini: model nằm TRONG body, không phải trong URL --- */
    gemini: {
      url: function () {
        return "https://generativelanguage.googleapis.com/v1beta/interactions";
      },
      headers: function (key) {
        return { "content-type": "application/json", "x-goog-api-key": key };
      },
      body: function (req, model) {
        return {
          model: model,
          system_instruction: req.system,
          input: req.user,
          response_format: {
            type: "text",
            mime_type: "application/json",
            schema: req.schema
          }
        };
      }
    },

    /* --- OpenRouter: OpenAI-compatible, có model miễn phí ---
       Model "openrouter/free" tự định tuyến sang model miễn phí nào đang rảnh
       và có hỗ trợ tính năng mình cần. Không phải model miễn phí nào cũng ép
       được JSON theo schema, nên có bodyNoSchema để lùi về prompt thuần. */
    openrouter: {
      url: function () { return "https://openrouter.ai/api/v1/chat/completions"; },
      headers: function (key) {
        return {
          "content-type": "application/json",
          "Authorization": "Bearer " + key,
          "HTTP-Referer": location.origin,
          "X-Title": "Ban do hoc tap"
        };
      },
      body: function (req, model) {
        return {
          model: model,
          messages: [
            { role: "system", content: req.system },
            { role: "user",   content: req.user }
          ],
          response_format: {
            type: "json_schema",
            json_schema: { name: "ket_qua", strict: true, schema: req.schema }
          }
        };
      },
      bodyNoSchema: function (req, model) {
        return {
          model: model,
          messages: [
            { role: "system",
              content: req.system +
                "\n\nBẮT BUỘC: chỉ trả về một object JSON hợp lệ, không kèm chữ nào khác, " +
                "không bọc trong ```. Đúng theo schema sau:\n" + JSON.stringify(req.schema) },
            { role: "user", content: req.user }
          ]
        };
      }
    },

    /* --- OpenAI: Responses API, schema nằm trong text.format --- */
    openai: {
      url: function () { return "https://api.openai.com/v1/responses"; },
      headers: function (key) {
        return { "content-type": "application/json", "Authorization": "Bearer " + key };
      },
      body: function (req, model) {
        return {
          model: model,
          input: [
            { role: "system", content: req.system },
            { role: "user",   content: req.user }
          ],
          text: {
            format: {
              type: "json_schema",
              name: "ket_qua",
              schema: req.schema,
              strict: true
            }
          },
          max_output_tokens: 16000
        };
      }
    },

    /* --- Claude: cần header cho phép gọi thẳng từ browser --- */
    claude: {
      url: function () { return "https://api.anthropic.com/v1/messages"; },
      headers: function (key) {
        return {
          "content-type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          // Không có dòng này thì browser chặn CORS. Anthropic gọi đây là
          // "dangerous" vì key nằm trong máy client — đúng mô hình
          // bring-your-own-key mà trang này đang dùng.
          "anthropic-dangerous-direct-browser-access": "true"
        };
      },
      body: function (req, model) {
        return {
          model: model,
          max_tokens: 16000,
          system: req.system,
          messages: [{ role: "user", content: req.user }],
          output_config: { format: { type: "json_schema", schema: req.schema } }
        };
      }
    }
  };

  /* ================= Giả lập ================= */
  function mockAnswer(req) {
    var mode = (window.AIConfig.get().mockMode) || "ok";
    if (mode === "error") {
      throw AIError("http", "Giả lập lỗi 429: hết hạn mức.", "mockMode = error");
    }
    if (mode === "badjson") {
      throw AIError("parse", "Model trả về JSON hỏng.", "{ dinh_nghia: 'thiếu ngoặc kép' ...");
    }

    var props = req.schema.properties || {};

    // Schema lạ (ví dụ nút "gửi thử") — dựng object khớp đúng required
    if (!props.cau_hoi && !props.dinh_nghia) {
      var generic = {};
      (req.schema.required || []).forEach(function (k) {
        generic[k] = "Kết nối giả lập thành công";
      });
      return generic;
    }

    if (!props.cau_hoi) {
      var depth = (window.AIConfig.get().depth) || "vua";
      return {
        tom_tat: [
          "Đây là **nội dung giả lập**, không phải bài học thật.",
          "Mức độ sâu đang chọn: `" + depth + "`.",
          "Cắm API key ở trang Cài đặt để có nội dung thật."
        ],
        can_biet_truoc: [
          "Biết mở trang Cài đặt",
          "Có một API key (hoặc chưa có thì cứ ở chế độ này)"
        ],
        dinh_nghia: "**Nội dung giả lập.** Dữ liệu cứng để kiểm tra giao diện, không gọi mạng và không tốn token.",
        vi_sao_can: "Dùng chế độ này để xem giao diện chạy đúng chưa trước khi cắm API key thật. Cũng dùng để thử các đường lỗi mà không phải cố tình làm hỏng key.",
        co_che: "Provider `mock` trả về object dựng sẵn khớp schema.\n\n```js\n// Không có request HTTP nào được gửi đi\nfunction mockAnswer(req) {\n  if (req.schema.properties.cau_hoi) return FAKE_QUIZ;\n  return FAKE_LESSON;   // ← bạn đang đọc cái này\n}\n```\n\nDòng `if` phân biệt yêu cầu quiz với yêu cầu bài đọc dựa vào schema, nên cùng một hàm phục vụ được cả hai. Đổi `mockMode` ở trang Cài đặt để thử đường lỗi.",
        vi_du: "Bấm ba nút **Ngắn / Vừa / Chuyên sâu** ở trên: mỗi lần bấm là một request mới với độ dài mục tiêu khác nhau. Ở chế độ giả lập bạn chỉ thấy nhãn đổi, còn với nhà cung cấp thật thì độ dài bài đọc đổi hẳn.",
        so_sanh: "So với việc cắm key thật để test: chế độ giả lập **nhanh hơn** (400ms), **miễn phí**, và **lặp lại được** — cùng input luôn ra cùng output. Đổi lại, nó không phát hiện được lỗi thật của nhà cung cấp. Dùng nó để kiểm tra giao diện, đừng dùng để kiểm tra tích hợp.",
        loi_thuong_gap: [
          "Tưởng đây là nội dung thật — không phải, đây là dữ liệu cứng.",
          "Quên đổi sang nhà cung cấp thật sau khi kiểm tra xong.",
          "Thấy bài đọc luôn giống nhau rồi nghĩ nút *Sinh lại* hỏng — thật ra mock luôn trả một kết quả."
        ],
        tu_kiem_tra: [
          "Bạn có giải thích được vì sao chế độ giả lập lại cần thiết không?",
          "Ba mức độ sâu khác nhau ở chỗ nào trong prompt gửi đi?",
          "Nếu model trả về JSON hỏng thì trang sẽ làm gì?"
        ],
        tai_nguyen: [
          "File `assets/ai/provider.js` trong workspace này",
          "Tài liệu `docs/them-cong-nghe-moi.md`"
        ],
        lien_he: [
          "Trang **Cài đặt** — nơi chọn nhà cung cấp và model",
          "Mảng 05 Backend → module Testing: chế độ giả lập ở đây chính là một *test double*, cùng ý tưởng với mock/stub trong unit test"
        ]
      };
    }

    // Tôn trọng số câu được yêu cầu, y như nhà cung cấp thật — nếu trả cứng
    // 10 câu thì không thể kiểm tra được tính năng chọn số câu bằng mock.
    var soCau = parseInt(req.count, 10) > 0 ? parseInt(req.count, 10) : 10;
    var qs = [];
    for (var i = 1; i <= soCau; i++) {
      qs.push({
        de_bai: "Câu giả lập số " + i + " — chọn đáp án B để thấy trạng thái đúng.",
        lua_chon: ["Đáp án A (sai)", "Đáp án B (đúng)", "Đáp án C (sai)", "Đáp án D (sai)"],
        dap_an: 1,
        giai_thich: "Đây là giải thích giả lập. Với nhà cung cấp thật, chỗ này nói rõ vì sao đáp án đúng là đúng và vì sao các đáp án sai lại hấp dẫn."
      });
    }
    return { cau_hoi: qs };
  }

  /* ================= Điểm vào duy nhất ================= */
  async function askJSON(req) {
    var cfg = window.AIConfig.get();
    var name = cfg.provider;

    if (name === "mock") {
      await new Promise(function (r) { setTimeout(r, 400); });  // giả lập độ trễ
      return mockAnswer(req);
    }

    var adapter = ADAPTERS[name];
    if (!adapter) throw AIError("no-key", "Chưa chọn nhà cung cấp hợp lệ.");

    var key = (cfg.keys[name] || "").trim();
    if (!key) throw AIError("no-key", "Chưa nhập API key cho " + name + ".");

    var model = cfg.models[name];

    async function send(bodyFn) {
      counter.total++;                 // đếm MỌI lần gọi thật, kể cả lần thử lại
      counter.byModel[model] = (counter.byModel[model] || 0) + 1;
      var r;
      try {
        r = await fetch(adapter.url(model), {
          method: "POST",
          headers: adapter.headers(key),
          body: JSON.stringify(bodyFn(req, model)),
          signal: req.signal
        });
      } catch (e) {
        if (e.name === "AbortError") throw AIError("aborted", "Đã huỷ yêu cầu.");
        throw AIError("network",
          "Không kết nối được tới " + name + ". Kiểm tra mạng.", String(e));
      }
      var text = await r.text();
      var body;
      try { body = JSON.parse(text); } catch (e) { body = text; }
      return { res: r, raw: text, payload: body };
    }

    var out = await send(adapter.body);

    // Model không hỗ trợ ép JSON theo schema → lùi về yêu cầu JSON bằng prompt
    if (!out.res.ok && adapter.bodyNoSchema &&
        /response_format|json_schema|structured|schema/i.test(providerMessage(out.payload))) {
      out = await send(adapter.bodyNoSchema);
    }

    var res = out.res, raw = out.raw, payload = out.payload;

    if (!res.ok) {
      var msg = providerMessage(payload);

      // 429: phân biệt "gọi quá nhanh" với "model không có trong gói của bạn"
      if (res.status === 429) {
        var q = readQuota(payload);
        var human = quotaMessage(q, model);
        if (q.zero) {
          throw AIError("model", human, raw.slice(0, 4000));      // đổi model, đừng đợi
        }
        throw AIError("rate", human || msg, raw.slice(0, 4000));
      }

      // Model bị khai tử / không có quyền dùng là lỗi rất hay gặp và có cách
      // xử lý riêng, nên tách khỏi lỗi HTTP chung.
      var badModel = /model/i.test(msg) &&
        /not (found|available|supported)|no longer|does not exist|deprecat|access/i.test(msg);
      throw AIError(badModel ? "model" : "http",
        "Lỗi " + res.status + " từ " + name + ": " + msg,
        raw.slice(0, 4000));
    }

    var text = extractText(payload);
    try {
      return typeof text === "string" ? JSON.parse(text) : text;
    } catch (e) {
      throw AIError("parse",
        "Model trả về nội dung không phải JSON hợp lệ.", String(text).slice(0, 4000));
    }
  }

  /* Gọi có thử lại 1 lần khi JSON hỏng — model đôi khi chỉ trượt một lần */
  async function askJSONRetry(req) {
    try {
      return await askJSON(req);
    } catch (e) {
      if (e.code === "parse") return await askJSON(req);
      throw e;
    }
  }

  /* ================= Hỏi API xem key này dùng được model nào =================
     Danh sách hard-code luôn có ngày hết hạn. Cái này thì không. */
  var LIST = {
    gemini: {
      url: "https://generativelanguage.googleapis.com/v1beta/models",
      headers: function (k) { return { "x-goog-api-key": k }; },
      parse: function (j) {
        return (j.models || [])
          .map(function (m) { return String(m.name || m.id || "").replace(/^models\//, ""); })
          .filter(function (id) { return id && !/embedding|aqa|imagen|veo|tts/i.test(id); });
      }
    },
    openrouter: {
      url: "https://openrouter.ai/api/v1/models",
      headers: function (k) { return { "Authorization": "Bearer " + k }; },
      parse: function (j) {
        var all = (j.data || []).map(function (m) { return m.id; });
        // Chỉ giữ model miễn phí, cộng thêm router tự chọn
        var free = all.filter(function (id) { return /:free$/.test(id); });
        return ["openrouter/free"].concat(free);
      }
    },
    openai: {
      url: "https://api.openai.com/v1/models",
      headers: function (k) { return { "Authorization": "Bearer " + k }; },
      parse: function (j) {
        return (j.data || [])
          .map(function (m) { return m.id; })
          .filter(function (id) { return /^(gpt|o\d)/i.test(id) && !/audio|realtime|image|tts|whisper|embedding/i.test(id); });
      }
    },
    claude: {
      url: "https://api.anthropic.com/v1/models?limit=100",
      headers: function (k) {
        return {
          "x-api-key": k,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        };
      },
      parse: function (j) { return (j.data || []).map(function (m) { return m.id; }); }
    }
  };

  async function listModels() {
    var cfg = window.AIConfig.get();
    var name = cfg.provider;

    if (name === "mock") return ["mock-model"];

    var spec = LIST[name];
    if (!spec) throw AIError("no-key", "Nhà cung cấp này không hỗ trợ liệt kê model.");

    var key = (cfg.keys[name] || "").trim();
    if (!key) throw AIError("no-key", "Nhập API key trước đã.");

    var res;
    try {
      res = await fetch(spec.url, { headers: spec.headers(key) });
    } catch (e) {
      throw AIError("network", "Không kết nối được tới " + name + ".", String(e));
    }

    var raw = await res.text();
    var json;
    try { json = JSON.parse(raw); } catch (e) { json = raw; }

    if (!res.ok) {
      throw AIError("http",
        "Lỗi " + res.status + " từ " + name + ": " + providerMessage(json), raw.slice(0, 3000));
    }

    var ids = spec.parse(json);
    if (!ids.length) {
      throw AIError("shape", "API trả về danh sách rỗng.", raw.slice(0, 3000));
    }
    return ids.sort();
  }

  window.AI = {
    askJSON: askJSONRetry,
    askJSONOnce: askJSON,
    listModels: listModels,
    counter: counter,
    AIError: AIError
  };
})();
