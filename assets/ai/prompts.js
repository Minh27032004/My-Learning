/* =========================================================
   prompts.js — ghép system prompt theo cascade 4 tầng và
   định nghĩa schema JSON mà model buộc phải tuân theo.

   Tầng 1  prompt gốc      (dựng sẵn, người dùng ghi đè được)
   Tầng 2  prompt mảng     (nằm trong dữ liệu mảng, ghi đè được)
   Tầng 3  prompt module   (chỉ có nếu người dùng tự viết)
   Tầng 4  ngữ cảnh        (tự động: tên mảng / module / chủ đề)

   Các tầng CỘNG DỒN, không thay thế nhau.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Tầng 1: prompt gốc dựng sẵn ---------- */
  var BASE = {
    lesson: [
      "Bạn là một giảng viên kỹ thuật giỏi, đang dạy một sinh viên Software Engineering",
      "định hướng AI/ML và Backend. Người học muốn hiểu CƠ CHẾ, không muốn học vẹt.",
      "",
      "Quy tắc bắt buộc:",
      "- Viết bằng tiếng Việt. GIỮ NGUYÊN thuật ngữ kỹ thuật tiếng Anh (pointer, index,",
      "  gradient descent, deadlock...). Không dịch máy móc thuật ngữ.",
      "- Giải thích VÌ SAO, không chỉ CÁI GÌ. Mỗi khẳng định quan trọng phải kèm lý do.",
      "- Nêu đánh đổi. Không có kỹ thuật nào chỉ toàn ưu điểm — nói cả mặt yếu.",
      "- Ưu tiên ví dụ cụ thể và số liệu thật hơn định nghĩa trừu tượng.",
      "- Code phải chạy được, không phải giả code. Đặt tên biến có nghĩa.",
      "- KHÔNG bịa số liệu, tên paper, hay đường link. Không chắc thì nói là không chắc.",
      "- Được dùng markdown: **đậm**, `code`, khối ```code```, danh sách gạch đầu dòng.",
      "- Không viết lời chào, không viết lời kết, không hỏi lại người học.",
      "- Không nhắc lại đề bài, vào thẳng nội dung."
    ].join("\n"),

    quiz: [
      "Bạn là người ra đề kiểm tra cho một sinh viên Software Engineering",
      "định hướng AI/ML và Backend.",
      "",
      "Quy tắc bắt buộc:",
      "- Viết bằng tiếng Việt, GIỮ NGUYÊN thuật ngữ kỹ thuật tiếng Anh.",
      "- Mỗi câu có đúng 4 lựa chọn, chỉ một đáp án đúng.",
      "- Ba đáp án sai phải HỢP LÝ, phản ánh hiểu lầm thật mà người học hay mắc.",
      "  Đáp án sai lộ liễu là đề kém.",
      "- Giải thích phải nói RÕ vì sao đáp án đúng là đúng VÀ vì sao đáp án sai",
      "  hấp dẫn nhưng sai ở chỗ nào.",
      "- Kiểm tra hiểu biết, không kiểm tra trí nhớ máy móc.",
      "- Độ khó tăng dần: vài câu đầu cơ bản, các câu sau vận dụng.",
      "- Được dùng `code` và khối ```code``` trong đề bài nếu cần."
    ].join("\n")
  };

  /* ---------- Schema JSON ép model trả đúng cấu trúc ---------- */
  var SCHEMAS = {
    lesson: {
      type: "object",
      properties: {
        tom_tat:        { type: "array",  items: { type: "string" } },
        can_biet_truoc: { type: "array",  items: { type: "string" } },
        dinh_nghia:     { type: "string" },
        vi_sao_can:     { type: "string" },
        co_che:         { type: "string" },
        vi_du:          { type: "string" },
        so_sanh:        { type: "string" },
        loi_thuong_gap: { type: "array",  items: { type: "string" } },
        tu_kiem_tra:    { type: "array",  items: { type: "string" } },
        tai_nguyen:     { type: "array",  items: { type: "string" } },
        lien_he:        { type: "array",  items: { type: "string" } }
      },
      required: ["tom_tat", "can_biet_truoc", "dinh_nghia", "vi_sao_can", "co_che",
                 "vi_du", "so_sanh", "loi_thuong_gap", "tu_kiem_tra", "tai_nguyen", "lien_he"],
      additionalProperties: false
    },

    quiz: {
      type: "object",
      properties: {
        cau_hoi: {
          type: "array",
          items: {
            type: "object",
            properties: {
              de_bai:     { type: "string" },
              lua_chon:   { type: "array", items: { type: "string" } },
              dap_an:     { type: "integer" },
              giai_thich: { type: "string" }
            },
            required: ["de_bai", "lua_chon", "dap_an", "giai_thich"],
            additionalProperties: false
          }
        }
      },
      required: ["cau_hoi"],
      additionalProperties: false
    }
  };

  /* ---------- Ghép cascade ---------- */
  function layers(kind, ctx) {
    var cfg = window.AIConfig;
    var out = [];

    // Tầng 1 — gốc (người dùng ghi đè được)
    out.push(cfg.userPrompt("global", null, kind) || BASE[kind]);

    // Tầng 2 — mảng: ưu tiên bản người dùng viết, không có thì lấy trong dữ liệu mảng
    var trackOverride = cfg.userPrompt("track", ctx.track.id, kind);
    var trackBuiltin = (ctx.track.prompts && ctx.track.prompts[kind]) || "";
    var track = trackOverride || trackBuiltin;
    if (track) out.push("Yêu cầu riêng cho mảng " + ctx.track.title + ":\n" + track);

    // Tầng 3 — module: chỉ tồn tại nếu người dùng tự viết
    var modId = ctx.track.id + ":" + window.Curriculum.slug(ctx.module.name);
    var mod = cfg.userPrompt("module", modId, kind);
    if (mod) out.push("Yêu cầu riêng cho module " + ctx.module.name + ":\n" + mod);

    return out.join("\n\n");
  }

  /* ---------- Ba mức độ sâu ---------- */
  var DEPTH = {
    ngan: {
      label: "Ngắn gọn",
      words: "khoảng 600–800 từ",
      note: "Viết súc tích, đi thẳng vào ý chính. Vẫn phải đủ các mục nhưng mỗi mục ngắn."
    },
    vua: {
      label: "Vừa đủ",
      words: "khoảng 1200–1800 từ",
      note: "Cân bằng giữa chi tiết và thời gian đọc. Đây là mức mặc định."
    },
    sau: {
      label: "Chuyên sâu",
      words: "khoảng 2500–3500 từ",
      note: "Đào sâu tới mức người đọc hiểu được cả những trường hợp biên. " +
            "Phần cơ chế phải đi tới tận gốc, không dừng ở mô tả bề mặt."
    }
  };

  /* ---------- Dựng request cho bài đọc ---------- */
  function lesson(ctx, depth) {
    var d = DEPTH[depth] || DEPTH.vua;

    return {
      system: layers("lesson", ctx),
      schema: SCHEMAS.lesson,
      user: [
        "Viết tài liệu học cho chủ đề sau.",
        "",
        "Mảng:      " + ctx.track.title,
        "Module:    " + ctx.module.name,
        "CHỦ ĐỀ:    " + ctx.item,
        "",
        "Bám sát ĐÚNG chủ đề trên, không lan sang chủ đề khác cùng module.",
        "Độ dài mục tiêu: " + d.words + ". " + d.note,
        "",
        "Điền đầy đủ các trường sau:",
        "",
        "- tom_tat: 3-5 gạch đầu dòng. Đọc riêng phần này là nắm được ý chính.",
        "  Viết SAU CÙNG, sau khi đã viết xong các phần khác.",
        "",
        "- can_biet_truoc: 2-4 mục. Kiến thức cần có trước để hiểu được bài này.",
        "  Nếu là chủ đề nền tảng không cần gì trước, ghi rõ 'Không cần kiến thức nền'.",
        "",
        "- dinh_nghia: 2-4 câu. Nó là cái gì, nói bằng ngôn ngữ đời thường trước,",
        "  rồi mới tới định nghĩa chính xác.",
        "",
        "- vi_sao_can: vì sao người học cần biết, dùng vào việc gì THẬT trong nghề.",
        "  Nêu một tình huống cụ thể sẽ gặp.",
        "",
        "- co_che: PHẦN DÀI NHẤT VÀ QUAN TRỌNG NHẤT. Giải thích bên dưới nó hoạt động",
        "  ra sao, từng bước một. Dùng ẩn dụ nếu giúp dễ hiểu, nhưng phải nói rõ",
        "  ẩn dụ đó sai ở chỗ nào. Có số liệu cụ thể khi nói về hiệu năng hay dung lượng.",
        "",
        "- vi_du: ví dụ cụ thể chạy được. Nếu là chủ đề lập trình thì phải có code,",
        "  kèm giải thích Ý NGHĨA từng dòng quan trọng. Nếu không phải lập trình thì",
        "  đưa một tình huống thực tế được phân tích từng bước.",
        "",
        "- so_sanh: so với những cách làm khác thì hơn kém chỗ nào, khi nào NÊN dùng",
        "  và khi nào KHÔNG nên. Nếu chủ đề không có phương án thay thế, hãy nói về",
        "  đánh đổi bên trong chính nó.",
        "",
        "- loi_thuong_gap: 3-6 mục. Mỗi mục nêu một hiểu lầm hoặc lỗi hay mắc,",
        "  kèm vì sao người ta hay mắc và cách tránh.",
        "",
        "- tu_kiem_tra: 3-5 câu hỏi để người đọc tự vấn sau khi đọc xong.",
        "  Đây KHÔNG phải trắc nghiệm, mà là câu hỏi mở kiểu 'bạn có giải thích được...'.",
        "",
        "- tai_nguyen: 2-4 nguồn nên tìm đọc thêm. Ghi TÊN sách, khoá học, hoặc tên",
        "  mục trong tài liệu chính thức. TUYỆT ĐỐI KHÔNG bịa đường link URL —",
        "  chỉ ghi tên để người học tự tìm.",
        "",
        "- lien_he: 2-4 mục, nối chủ đề này với kiến thức khác trong lộ trình,",
        "  nói rõ nối như thế nào chứ không chỉ liệt kê tên."
      ].join("\n")
    };
  }

  /* ---------- Dựng request cho quiz ---------- */
  function quiz(ctx, asked, count) {
    var n = count || 10;
    var lines = [
      "Ra " + n + " câu hỏi trắc nghiệm cho chủ đề sau.",
      "",
      "Mảng:      " + ctx.track.title,
      "Module:    " + ctx.module.name,
      "CHỦ ĐỀ:    " + ctx.item,
      "",
      "Bám sát ĐÚNG chủ đề trên. Trả về đúng " + n + " câu trong mảng cau_hoi.",
      "dap_an là chỉ số 0-3 của đáp án đúng trong mảng lua_chon."
    ];

    if (asked && asked.length) {
      lines.push(
        "",
        "TUYỆT ĐỐI KHÔNG hỏi lại " + asked.length + " ý đã hỏi dưới đây,",
        "kể cả khi diễn đạt khác đi hay đổi số liệu. Hãy khai thác khía cạnh MỚI:",
        ""
      );
      // Chỉ gửi đề bài, cắt bớt cho gọn — đủ để model nhận ra ý đã hỏi
      asked.slice(-150).forEach(function (q, i) {
        lines.push((i + 1) + ". " + String(q).slice(0, 160));
      });
    }

    /* `count` KHÔNG được gửi lên nhà cung cấp nào (adapter chỉ đọc system/
       user/schema) — nó tồn tại để chế độ giả lập biết phải dựng bao nhiêu
       câu. Không có nó, mock luôn trả cứng 10 câu và mọi phép thử tính năng
       "chọn số câu" đều cho kết quả sai lệch. */
    return { system: layers("quiz", ctx), schema: SCHEMAS.quiz, user: lines.join("\n"), count: n };
  }

  window.Prompts = {
    BASE: BASE,
    SCHEMAS: SCHEMAS,
    DEPTH: DEPTH,
    lesson: lesson,
    quiz: quiz,
    layers: layers
  };
})();
