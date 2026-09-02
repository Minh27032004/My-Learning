/* =========================================================
   config.js — đọc/ghi cấu hình AI trong localStorage.
   Chỉ biết về lưu trữ. Không biết HTTP, không biết DOM.

   Đây là NGOẠI LỆ có chủ ý của nguyên tắc "không lưu gì":
   không lưu key và prompt thì mỗi lần mở trang phải nhập lại.
   Kết quả quiz, bài đọc, câu hỏi thì tuyệt đối không lưu.
   ========================================================= */
(function () {
  "use strict";

  var KEY = "hoc.ai.config.v1";

  var DEFAULTS = {
    provider: "mock",
    keys:  { gemini: "", openrouter: "", openai: "", claude: "" },
    models: {
      gemini: "gemini-3.1-flash-lite",
      openrouter: "openrouter/free",
      openai: "gpt-5.6",
      claude: "claude-opus-5"
    },
    /* Số câu hỏi xin mỗi lượt. Mặc định 5 chứ không phải 10 vì thời gian chờ
       tỉ lệ THẲNG với lượng chữ model phải sinh ra: 10 câu mất 10-20 giây,
       5 câu chỉ còn một nửa. Ai cần nhiều câu một lượt thì tự chọn 10/20. */
    soCau: 5,

    // "" nghĩa là dùng mặc định dựng sẵn — không phải "prompt rỗng"
    prompts: { global: {}, track: {}, module: {} }
  };

  /* Danh sách model dựng sẵn — CHỈ là gợi ý ban đầu.
     Bài học ngày 2026-08-29: tài liệu của Google vẫn liệt kê dòng 2.5 là
     "active" nhưng API trả 404 "no longer available to new users".
     Vì vậy trang Cài đặt có nút hỏi thẳng API xem key của bạn dùng được
     model nào — tin API, đừng tin danh sách cứng ở đây. */
  var MODELS = {
    gemini: [
      { id: "gemini-3.1-flash-lite",  note: "★ MIỄN PHÍ · 15 lần/phút · 1.500 lần/ngày" },
      { id: "gemini-3-flash-preview", note: "MIỄN PHÍ · 10 lần/phút · 1.500 lần/ngày · thông minh hơn" },
      { id: "gemini-3.5-flash-lite",  note: "có thể tính phí" },
      { id: "gemini-3.5-flash",       note: "có thể tính phí" },
      { id: "gemini-3.7-flash",       note: "có thể tính phí · mạnh nhất" },
      { id: "gemini-2.5-flash",       note: "tài khoản mới KHÔNG dùng được" }
    ],
    openrouter: [
      { id: "openrouter/free", note: "MIỄN PHÍ — tự chọn model đang rảnh" }
    ],
    openai: [
      { id: "gpt-5.6",     note: "khuyến nghị cho dự án mới" },
      { id: "gpt-4o-mini", note: "rẻ" }
    ],
    claude: [
      { id: "claude-opus-5",    note: "mạnh nhất, mặc định" },
      { id: "claude-sonnet-5",  note: "rẻ hơn, nhanh hơn" },
      { id: "claude-haiku-4-5", note: "rẻ nhất" }
    ]
  };

  var PROVIDERS = [
    { id: "gemini", label: "Google Gemini — miễn phí, khuyến nghị",
      keyUrl: "https://aistudio.google.com/apikey",
      free: "Free tier cho 1.500 request/ngày — thoải mái học. NHƯNG chỉ MỘT SỐ model được miễn phí, " +
            "và tài khoản mới KHÔNG dùng được dòng 2.5. Chọn “gemini-3.1-flash-lite” là chạy được ngay. " +
            "Không chắc thì bấm “Thử từng model” bên dưới." },
    { id: "openrouter", label: "OpenRouter — phương án dự phòng",
      keyUrl: "https://openrouter.ai/keys",
      free: "Đăng ký email/GitHub, không cần thẻ. Model “openrouter/free” tự chọn model miễn phí đang rảnh. " +
            "Chỉ 50 request/ngày — ít hơn Gemini nhiều, dùng khi Gemini trục trặc." },
    { id: "openai", label: "OpenAI", keyUrl: "https://platform.openai.com/api-keys", free: null },
    { id: "claude", label: "Anthropic Claude", keyUrl: "https://console.anthropic.com/settings/keys", free: null },
    { id: "mock",   label: "Giả lập — không cần key", keyUrl: null, free: null }
  ];

  function storage() {
    try {
      localStorage.setItem("__t", "1"); localStorage.removeItem("__t");
      return localStorage;
    } catch (e) {
      var mem = {};
      return {
        getItem: function (k) { return k in mem ? mem[k] : null; },
        setItem: function (k, v) { mem[k] = String(v); },
        removeItem: function (k) { delete mem[k]; },
        volatile: true
      };
    }
  }
  var store = storage();

  function deepMerge(base, patch) {
    var out = {};
    Object.keys(base).forEach(function (k) { out[k] = base[k]; });
    Object.keys(patch || {}).forEach(function (k) {
      var v = patch[k];
      out[k] = (v && typeof v === "object" && !Array.isArray(v))
        ? deepMerge(base[k] || {}, v)
        : v;
    });
    return out;
  }

  function get() {
    var raw;
    try { raw = JSON.parse(store.getItem(KEY) || "{}"); } catch (e) { raw = {}; }
    return deepMerge(DEFAULTS, raw);
  }

  function save(patch) {
    var next = deepMerge(get(), patch);
    try { store.setItem(KEY, JSON.stringify(next)); } catch (e) { /* bỏ qua */ }
    return next;
  }

  function reset() {
    try { store.removeItem(KEY); } catch (e) { /* bỏ qua */ }
  }

  /* Nhà cung cấp hiện tại đã dùng được chưa? */
  function status() {
    var c = get();
    if (c.provider === "mock") return { ok: true, provider: "mock" };
    var k = (c.keys[c.provider] || "").trim();
    return {
      ok: !!k,
      provider: c.provider,
      reason: k ? null : "Chưa nhập API key cho " + c.provider
    };
  }

  /* --- Prompt do người dùng ghi đè. "" hoặc thiếu = kế thừa tầng trên --- */
  function userPrompt(level, id, kind) {
    var c = get();
    var bucket = c.prompts[level] || {};
    var entry = level === "global" ? bucket : (bucket[id] || {});
    return (entry[kind] || "").trim();
  }

  function setUserPrompt(level, id, kind, text) {
    var patch = { prompts: {} };
    if (level === "global") {
      patch.prompts.global = {};
      patch.prompts.global[kind] = text;
    } else {
      patch.prompts[level] = {};
      patch.prompts[level][id] = {};
      patch.prompts[level][id][kind] = text;
    }
    return save(patch);
  }

  window.AIConfig = {
    get: get,
    save: save,
    reset: reset,
    status: status,
    userPrompt: userPrompt,
    setUserPrompt: setUserPrompt,
    PROVIDERS: PROVIDERS,
    MODELS: MODELS,
    volatile: !!store.volatile
  };
})();
