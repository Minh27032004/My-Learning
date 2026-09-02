/* =========================================================
   md.js — render một tập con markdown, AN TOÀN.

   Nội dung ở đây do model sinh ra hoặc do người soạn, tức là dữ liệu
   không kiểm soát được hoàn toàn. Quy trình bắt buộc: escape TOÀN BỘ
   HTML trước, rồi mới dựng lại đúng những thẻ mình cho phép.
   Không bao giờ đi đường ngược lại.

   Hỗ trợ: ```khối code```, `code`, **đậm**, *nghiêng*,
           ### tiêu đề, - danh sách, | bảng |, đoạn văn,
           ảnh SVG nội bộ: ![chú thích](assets/diagrams/tên-file.svg).
   ========================================================= */
(function () {
  "use strict";

  var MARK = "BLOCK";      // dấu giữ chỗ cho khối code, ký tự điều khiển
  var MARK_END = "";       // nên không thể xuất hiện trong nội dung thật

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function inline(s) {
    return s
      .replace(/`([^`]+)`/g, function (_, c) { return "<code>" + c + "</code>"; })
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  }

  /* Tách "| a | b |" thành ["a", "b"] */
  function cells(line) {
    return line.trim().replace(/^\||\|$/g, "").split("|")
      .map(function (c) { return c.trim(); });
  }

  /* Dòng kẻ ngang của bảng: |---|:--:|---| */
  function isSeparator(line) {
    var t = line.trim();
    return t.indexOf("-") >= 0 && /^\|?[\s:|-]+$/.test(t);
  }

  function render(text) {
    if (!text) return "";

    // 1. Escape trước tiên — không có ngoại lệ
    var src = escapeHtml(text);

    // 2. Tách khối code ra khỏi luồng xử lý, thay bằng dấu giữ chỗ, để dấu *
    //    và ` bên trong code không bị hiểu nhầm là markdown
    var blocks = [];
    src = src.replace(/```([a-zA-Z0-9+#-]*)\n?([\s\S]*?)```/g, function (_, lang, code) {
      blocks.push({ lang: lang || "code", code: code.replace(/\n$/, "") });
      return MARK + (blocks.length - 1) + MARK_END;
    });

    // 3. Xử lý theo dòng
    var out = [];
    var lines = src.split("\n");
    var list = null;
    var para = [];

    function flushPara() {
      if (para.length) { out.push("<p>" + inline(para.join(" ")) + "</p>"); para = []; }
    }
    function flushList() {
      if (list) { out.push("<ul>" + list.join("") + "</ul>"); list = null; }
    }

    for (var i = 0; i < lines.length; i++) {
      var t = lines[i].trim();

      // --- khối code ---
      var ph = t.match(new RegExp("^" + MARK + "(\\d+)" + MARK_END + "$"));
      if (ph) {
        flushPara(); flushList();
        var b = blocks[+ph[1]];
        out.push(
          '<div class="code" data-lang="' + escapeHtml(b.lang) + '">' +
          "<pre><code>" + b.code + "</code></pre></div>"
        );
        continue;
      }

      if (!t) { flushPara(); flushList(); continue; }

      // --- hình minh họa nội bộ ---
      // Chỉ cho phép SVG tương đối trong assets/diagrams; không nhận URL tùy ý,
      // data: hoặc javascript:. Caption đã được escape ở bước 1.
      var image = t.match(/^!\[([^\]]*)\]\((assets\/diagrams\/[a-zA-Z0-9._\/-]+\.svg)\)$/);
      if (image) {
        flushPara(); flushList();
        out.push(
          '<figure class="lesson-diagram"><img src="' + image[2] + '" alt="' +
          escapeHtml(image[1]) + '" loading="lazy"><figcaption>' +
          inline(image[1]) + '</figcaption></figure>'
        );
        continue;
      }

      // --- tiêu đề phụ: ### → h4, #### → h5 ---
      var h = t.match(/^(#{2,5})\s+(.*)$/);
      if (h) {
        flushPara(); flushList();
        var lvl = Math.min(6, h[1].length + 1);
        out.push("<h" + lvl + ' class="md-h">' + inline(h[2]) + "</h" + lvl + ">");
        continue;
      }

      // --- bảng: dòng có | và dòng NGAY SAU là dòng kẻ ---
      if (t.charAt(0) === "|" && i + 1 < lines.length && isSeparator(lines[i + 1])) {
        flushPara(); flushList();
        var head = cells(t);
        var rows = [];
        i += 2;                                   // bỏ qua dòng kẻ
        while (i < lines.length && lines[i].trim().charAt(0) === "|") {
          rows.push(cells(lines[i]));
          i++;
        }
        i--;                                      // trả lại một dòng cho vòng lặp

        var html = '<div class="table-scroll"><table><thead><tr>';
        head.forEach(function (c) { html += "<th>" + inline(c) + "</th>"; });
        html += "</tr></thead><tbody>";
        rows.forEach(function (r) {
          html += "<tr>";
          for (var c = 0; c < head.length; c++) {
            html += "<td>" + inline(r[c] || "") + "</td>";
          }
          html += "</tr>";
        });
        out.push(html + "</tbody></table></div>");
        continue;
      }

      // --- danh sách ---
      var li = t.match(/^[-*+]\s+(.*)$/) || t.match(/^\d+[.)]\s+(.*)$/);
      if (li) {
        flushPara();
        if (!list) list = [];
        list.push("<li>" + inline(li[1]) + "</li>");
        continue;
      }

      flushList();
      para.push(t);
    }

    flushPara(); flushList();
    return out.join("\n");
  }

  /* Đổ markdown vào một phần tử, rồi gắn nút copy cho các khối code */
  function into(node, text) {
    node.innerHTML = render(text);
    if (window.HocUI && window.HocUI.initCopy) window.HocUI.initCopy();
    return node;
  }

  window.MD = { render: render, into: into, escape: escapeHtml };
})();
