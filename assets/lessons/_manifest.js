/* =========================================================
   _manifest.js — danh sách bài học ĐÃ SOẠN SẴN.

   Bài nào có tên trong đây thì trang học đọc thẳng từ file,
   KHÔNG gọi API, không tốn hạn mức, nội dung ổn định không đổi.
   Bài nào chưa có thì mới nhờ AI sinh tại chỗ.

   THÊM MỘT BÀI SOẠN SẴN:
     1. Tạo file assets/lessons/<khoá đã đổi ":" thành "__">.js
        Ví dụ khoá  01:may-tinh...:he-nhi-phan...
        thành file  01__may-tinh...__he-nhi-phan....js
     2. Thêm đúng khoá đó vào mảng HAVE bên dưới
   ========================================================= */
(function () {
  "use strict";

  var HAVE = [
    // ---- Mảng 01 · Module 1: Máy tính hoạt động như thế nào ----
    "01:may-tinh-hoat-dong-nhu-the-nao:he-nhi-phan-hexa-bit-va-byte",
    "01:may-tinh-hoat-dong-nhu-the-nao:so-am-dang-bu-2-two-s-complement",
    "01:may-tinh-hoat-dong-nhu-the-nao:so-thuc-dau-phay-dong-ieee-754-va-loi-lam-tron",
    "01:may-tinh-hoat-dong-nhu-the-nao:unicode-utf-8-va-vi-sao-tieng-viet-hay-loi-font",
    "01:may-tinh-hoat-dong-nhu-the-nao:cpu-ram-cache-o-dia-chenh-lech-toc-do-hang-trieu-lan",
    "01:may-tinh-hoat-dong-nhu-the-nao:chu-ky-lenh-fetch-decode-execute",
    "01:may-tinh-hoat-dong-nhu-the-nao:compiled-vs-interpreted-vs-bytecode-c-python-java",
    "01:may-tinh-hoat-dong-nhu-the-nao:trinh-bien-dich-lam-gi-lexer-parser-sinh-ma",

    // ---- Mảng 01 · Module 2: Hệ điều hành ----
    "01:he-dieu-hanh:process-vs-thread-khac-nhau-o-bo-nho",
    "01:he-dieu-hanh:lap-lich-cpu-va-context-switch",
    "01:he-dieu-hanh:bo-nho-ao-phan-trang-swap",
    "01:he-dieu-hanh:stack-vs-heap-cai-nao-luu-gi",
    "01:he-dieu-hanh:deadlock-race-condition-critical-section",
    "01:he-dieu-hanh:he-thong-file-duong-dan-quyen-truy-cap",
    "01:he-dieu-hanh:concurrency-vs-parallelism-khac-nhau-that-su",
    "01:he-dieu-hanh:tin-hieu-tien-trinh-nen-exit-code",

    // ---- Mảng 01 · Module 3: Command line / Terminal ----
    "01:command-line-terminal:dieu-huong-cd-ls-pwd-tree",
    "01:command-line-terminal:thao-tac-file-cp-mv-rm-mkdir-touch",
    "01:command-line-terminal:pipe-va-redirect-2-1",
    "01:command-line-terminal:grep-find-sed-awk-bo-tu-xu-ly-van-ban",
    "01:command-line-terminal:bien-moi-truong-va-path",
    "01:command-line-terminal:quyen-file-chmod-chown-sudo",
    "01:command-line-terminal:ssh-scp-rsync",
    "01:command-line-terminal:viet-shell-script-co-ban-bien-if-for",

    // ---- Mảng 01 · Module 4: Mạng máy tính ----
    "01:mang-may-tinh:mo-hinh-tcp-ip-4-tang",
    "01:mang-may-tinh:ip-port-dns-phan-giai-ten-mien",
    "01:mang-may-tinh:tcp-vs-udp-tin-cay-doi-lay-toc-do",
    "01:mang-may-tinh:http-method-header-body-status-code",
    "01:mang-may-tinh:https-tls-handshake-chung-chi",
    "01:mang-may-tinh:cookie-session-va-trang-thai-tren-web",
    "01:mang-may-tinh:websocket-vs-polling",
    "01:mang-may-tinh:proxy-reverse-proxy-cdn-khai-quat",

    // ---- Mảng 01 · Module 5: Thành thạo một ngôn ngữ chính (Python) ----
    "01:thanh-thao-mot-ngon-ngu-chinh-python:cu-phap-kieu-du-lieu-toan-tu",
    "01:thanh-thao-mot-ngon-ngu-chinh-python:list-dict-set-tuple-chon-cai-nao-khi-nao",
    "01:thanh-thao-mot-ngon-ngu-chinh-python:comprehension-va-bieu-thuc-generator",
    "01:thanh-thao-mot-ngon-ngu-chinh-python:ham-tham-so-mac-dinh-args-kwargs",
    "01:thanh-thao-mot-ngon-ngu-chinh-python:module-package-import-va-name",
    "01:thanh-thao-mot-ngon-ngu-chinh-python:xu-ly-ngoai-le-try-except-else-finally",
    "01:thanh-thao-mot-ngon-ngu-chinh-python:doc-ghi-file-lam-viec-voi-json-va-csv",
    "01:thanh-thao-mot-ngon-ngu-chinh-python:decorator-ham-boc-ham",
    "01:thanh-thao-mot-ngon-ngu-chinh-python:generator-iterator-va-yield",
    "01:thanh-thao-mot-ngon-ngu-chinh-python:context-manager-va-cau-lenh-with",
    "01:thanh-thao-mot-ngon-ngu-chinh-python:type-hint-va-mypy",
    "01:thanh-thao-mot-ngon-ngu-chinh-python:chuan-pep-8-va-cach-format-tu-dong",
    "01:thanh-thao-mot-ngon-ngu-chinh-python:venv-pip-requirements-txt-pyproject-toml",

    // ---- Mảng 01 · Module 6: Lập trình hướng đối tượng ----
    "01:lap-trinh-huong-doi-tuong:class-object-thuoc-tinh-phuong-thuc",
    "01:lap-trinh-huong-doi-tuong:dong-goi-encapsulation",
    "01:lap-trinh-huong-doi-tuong:ke-thua-va-thu-tu-phan-giai-phuong-thuc-mro",
    "01:lap-trinh-huong-doi-tuong:da-hinh-polymorphism-va-duck-typing",
    "01:lap-trinh-huong-doi-tuong:truu-tuong-abstract-class-interface-protocol",
    "01:lap-trinh-huong-doi-tuong:composition-over-inheritance-vi-sao-nen-uu-tien",
    "01:lap-trinh-huong-doi-tuong:magic-method-init-repr-eq-len",
    "01:lap-trinh-huong-doi-tuong:dataclass-va-named-tuple",
    "01:lap-trinh-huong-doi-tuong:solid-single-responsibility",
    "01:lap-trinh-huong-doi-tuong:solid-open-closed",
    "01:lap-trinh-huong-doi-tuong:solid-liskov-substitution",
    "01:lap-trinh-huong-doi-tuong:solid-interface-segregation",
    "01:lap-trinh-huong-doi-tuong:solid-dependency-inversion",
    "01:lap-trinh-huong-doi-tuong:design-pattern-factory-strategy-observer",
    "01:lap-trinh-huong-doi-tuong:design-pattern-singleton-adapter-repository",

    // ---- Mảng 01 · Module 7: Bộ nhớ & cơ chế thực thi ----
    "01:bo-nho-co-che-thuc-thi:tham-chieu-vs-gia-tri-bien-tro-toi-dau",
    "01:bo-nho-co-che-thuc-thi:mutable-vs-immutable-va-bay-tham-so-mac-dinh",
    "01:bo-nho-co-che-thuc-thi:shallow-copy-vs-deep-copy",
    "01:bo-nho-co-che-thuc-thi:garbage-collection-va-reference-counting",
    "01:bo-nho-co-che-thuc-thi:gil-cua-python-vi-sao-thread-khong-tang-toc-cpu-bound",
    "01:bo-nho-co-che-thuc-thi:do-bo-nho-va-toi-uu-co-ban",

    // ---- Mảng 01 · Module 8: Clean Code & thiết kế ----
    "01:clean-code-thiet-ke:dat-ten-bien-ham-class-co-nghia",
    "01:clean-code-thiet-ke:ham-nho-lam-dung-mot-viec",
    "01:clean-code-thiet-ke:dry-kiss-yagni",
    "01:clean-code-thiet-ke:tranh-magic-number-va-co-boolean-trong-tham-so",
    "01:clean-code-thiet-ke:xu-ly-loi-tuong-minh-khong-nuot-exception",
    "01:clean-code-thiet-ke:comment-giai-thich-vi-sao-khong-phai-cai-gi",
    "01:clean-code-thiet-ke:nhan-dien-code-smell-va-refactor-an-toan",
    "01:clean-code-thiet-ke:doc-va-review-code-nguoi-khac",

    // ---- Mảng 01 · Module 9: Công cụ của dev ----
    "01:cong-cu-cua-dev:vs-code-phim-tat-extension-workspace",
    "01:cong-cu-cua-dev:debugger-breakpoint-step-watch-bo-thoi-quen-print",
    "01:cong-cu-cua-dev:linter-formatter-ruff-black",
    "01:cong-cu-cua-dev:pre-commit-hook-chay-kiem-tra-tu-dong",
    "01:cong-cu-cua-dev:quan-ly-moi-truong-venv-poetry-hoac-uv",
    "01:cong-cu-cua-dev:docker-co-ban-image-container-dockerfile",
    "01:cong-cu-cua-dev:doc-tai-lieu-chinh-thuc-thay-vi-chi-tim-stack-overflow",

    // ---- Mảng 02 · Module 1: Phân tích độ phức tạp ----
    "02:phan-tich-do-phuc-tap:ky-hieu-big-o-big-theta-big-omega",
    "02:phan-tich-do-phuc-tap:do-phuc-tap-thoi-gian-cua-vong-lap-long-nhau",
    "02:phan-tich-do-phuc-tap:do-phuc-tap-khong-gian",
    "02:phan-tich-do-phuc-tap:phan-tich-khau-hao-amortized-vi-sao-append-la-o-1",
    "02:phan-tich-do-phuc-tap:thang-so-sanh-o-1-o-log-n-o-n-o-n-log-n-o-n-o-2",
    "02:phan-tich-do-phuc-tap:uoc-luong-10-phep-tinh-1-giay",

    // ---- Mảng 02 · Module 2: Cấu trúc dữ liệu tuyến tính ----
    "02:cau-truc-du-lieu-tuyen-tinh:array-dynamic-array-va-co-che-nhan-doi-bo-nho",
    "02:cau-truc-du-lieu-tuyen-tinh:linked-list-don-doi-vong",
    "02:cau-truc-du-lieu-tuyen-tinh:stack-lifo-va-ung-dung-undo-duyet-bieu-thuc",
    "02:cau-truc-du-lieu-tuyen-tinh:queue-fifo-va-circular-queue",
    "02:cau-truc-du-lieu-tuyen-tinh:deque-hai-dau",
    "02:cau-truc-du-lieu-tuyen-tinh:ky-thuat-con-tro-cham-nhanh-tren-linked-list",

    // ---- Mảng 02 · Module 3: Hash ----
    "02:hash:ham-bam-va-bang-bam-hoat-dong-ra-sao",
    "02:hash:xu-ly-va-cham-chaining-vs-open-addressing",
    "02:hash:hash-map-hash-set-danh-doi-bo-nho-lay-toc-do",
    "02:hash:dem-tan-suat-va-bai-toan-two-sum",
    "02:hash:vi-sao-o-1-chi-la-trung-binh-xau-nhat-la-o-n",

    // ---- Mảng 02 · Module 4: Cây ----
    "02:cay:cay-nhi-phan-cay-nhi-phan-day-du-hoan-chinh",
    "02:cay:duyet-cay-preorder-inorder-postorder-level-order",
    "02:cay:binary-search-tree-tim-chen-xoa",
    "02:cay:cay-can-bang-avl-red-black-hieu-y-tuong",
    "02:cay:heap-va-priority-queue",
    "02:cay:trie-cay-tien-to-cho-tim-kiem-chuoi",
    "02:cay:segment-tree-fenwick-tree-nang-cao",

    // ---- Mảng 02 · Module 5: Đồ thị ----
    "02:do-thi:bieu-dien-ma-tran-ke-vs-danh-sach-ke",
    "02:do-thi:bfs-duyet-theo-chieu-rong",
    "02:do-thi:dfs-duyet-theo-chieu-sau",
    "02:do-thi:phat-hien-chu-trinh-co-huong-va-vo-huong",
    "02:do-thi:sap-xep-to-po-topological-sort",
    "02:do-thi:dijkstra-duong-di-ngan-nhat-trong-so-duong",
    "02:do-thi:bellman-ford-chap-nhan-trong-so-am",
    "02:do-thi:floyd-warshall-moi-cap-dinh",
    "02:do-thi:cay-khung-nho-nhat-kruskal-va-prim",
    "02:do-thi:union-find-disjoint-set-union",

    // ---- Mảng 02 · Module 6: Sắp xếp ----
    "02:sap-xep:bubble-selection-insertion-o-n-nhung-phai-hieu",
    "02:sap-xep:merge-sort-chia-de-tri-on-dinh-o-n-log-n",
    "02:sap-xep:quick-sort-phan-hoach-trung-binh-nhanh-nhat",
    "02:sap-xep:heap-sort",
    "02:sap-xep:counting-sort-radix-sort-bucket-sort-thoat-khoi-o-n-log-n",
    "02:sap-xep:tinh-on-dinh-cua-thuat-toan-sap-xep-va-khi-nao-no-quan-trong",
    "02:sap-xep:sap-xep-theo-khoa-tuy-chinh-trong-ngon-ngu-that",

    // ---- Mảng 02 · Module 7: Tìm kiếm ----
    "02:tim-kiem:tim-tuyen-tinh",
    "02:tim-kiem:tim-nhi-phan-va-cac-bien-the-bien-trai-bien-phai",
    "02:tim-kiem:binary-search-tren-dap-an-parametric-search",
    "02:tim-kiem:tim-trong-mang-xoay-vong",

    // ---- Mảng 02 · Module 8: Kỹ thuật giải thuật cốt lõi ----
    "02:ky-thuat-giai-thuat-cot-loi:de-quy-va-cay-de-quy",
    "02:ky-thuat-giai-thuat-cot-loi:quay-lui-backtracking-hoan-vi-to-hop-n-queens-sudoku",
    "02:ky-thuat-giai-thuat-cot-loi:chia-de-tri",
    "02:ky-thuat-giai-thuat-cot-loi:tham-lam-greedy-va-cach-chung-minh-tinh-dung",
    "02:ky-thuat-giai-thuat-cot-loi:quy-hoach-dong-memoization-vs-bottom-up",
    "02:ky-thuat-giai-thuat-cot-loi:dp-kinh-dien-leo-cau-thang-doi-tien-ba-lo-0-1",
    "02:ky-thuat-giai-thuat-cot-loi:dp-tren-chuoi-lcs-edit-distance-lis",
    "02:ky-thuat-giai-thuat-cot-loi:hai-con-tro-two-pointers",
    "02:ky-thuat-giai-thuat-cot-loi:cua-so-truot-sliding-window-co-dinh-va-co-gian",
    "02:ky-thuat-giai-thuat-cot-loi:tong-tien-to-prefix-sum-va-difference-array",
    "02:ky-thuat-giai-thuat-cot-loi:thao-tac-bit-and-or-xor-bitmask",

    // ---- Mảng 02 · Module 9: Bài toán kinh điển nên biết ----
    "02:bai-toan-kinh-dien-nen-biet:kadane-mang-con-tong-lon-nhat",
    "02:bai-toan-kinh-dien-nen-biet:bai-toan-ngoac-hop-le",
    "02:bai-toan-kinh-dien-nen-biet:thiet-ke-lru-cache",
    "02:bai-toan-kinh-dien-nen-biet:tron-k-danh-sach-da-sap-xep",
    "02:bai-toan-kinh-dien-nen-biet:top-k-phan-tu-bang-heap",
    "02:bai-toan-kinh-dien-nen-biet:kmp-rabin-karp-so-khop-chuoi",
    "02:bai-toan-kinh-dien-nen-biet:reservoir-sampling-fisher-yates-shuffle",

    // ---- Mảng 02 · Module 10: Luyện phỏng vấn ----
    "02:luyen-phong-van:nhan-dien-pattern-tu-de-bai",
    "02:luyen-phong-van:quy-trinh-tra-loi-lam-ro-vi-du-huong-tiep-can-code-test-toi-",
    "02:luyen-phong-van:noi-to-suy-nghi-trong-luc-code",
    "02:luyen-phong-van:blind-75-hoac-neetcode-150",
    "02:luyen-phong-van:mock-interview-voi-nguoi-that",

    // ---- Mảng 03: Git & GitHub (37 bài) ----
    "03:nen-tang:git-khac-github-o-cho-nao",
    "03:nen-tang:mo-hinh-phan-tan-va-vi-sao-commit-duoc-offline",
    "03:nen-tang:ba-khu-vuc-working-directory-staging-repository",
    "03:nen-tang:commit-la-snapshot-khong-phai-diff",
    "03:nen-tang:head-hash-sha-con-tro-nhanh",
    "03:nen-tang:cai-dat-va-cau-hinh-user-name-user-email",
    "03:nen-tang:ssh-key-thay-cho-go-mat-khau",
    "03:thao-tac-hang-ngay:git-init-va-git-clone",
    "03:thao-tac-hang-ngay:viet-gitignore-truoc-commit-dau-tien",
    "03:thao-tac-hang-ngay:git-status-doc-duoc-moi-trang-thai-file",
    "03:thao-tac-hang-ngay:git-add-va-git-add-p-de-chon-tung-doan",
    "03:thao-tac-hang-ngay:git-commit-va-cach-viet-message-tu-te",
    "03:thao-tac-hang-ngay:git-log-voi-oneline-graph-all",
    "03:thao-tac-hang-ngay:git-diff-chua-add-vs-da-add",
    "03:thao-tac-hang-ngay:git-show-va-git-blame",
    "03:hoan-tac:git-restore-bo-sua-doi-bo-staging",
    "03:hoan-tac:git-commit-amend",
    "03:hoan-tac:git-reset-soft-mixed-hard",
    "03:hoan-tac:git-revert-cho-commit-da-push",
    "03:hoan-tac:git-reflog-cuu-code-tuong-da-mat",
    "03:hoan-tac:git-clean-de-don-file-rac",
    "03:nhanh-cong-tac:branch-switch-checkout",
    "03:nhanh-cong-tac:merge-va-fast-forward",
    "03:nhanh-cong-tac:xu-ly-merge-conflict-khong-hoang",
    "03:nhanh-cong-tac:remote-push-pull-fetch",
    "03:nhanh-cong-tac:force-with-lease-thay-vi-force",
    "03:nhanh-cong-tac:rebase-va-luat-vang-cua-rebase",
    "03:nhanh-cong-tac:rebase-i-de-don-lich-su-truoc-khi-mo-pr",
    "03:nhanh-cong-tac:cherry-pick-stash-tag",
    "03:github-quy-trinh-nhom:pull-request-va-code-review",
    "03:github-quy-trinh-nhom:fork-upstream-de-dong-gop-ma-nguon-mo",
    "03:github-quy-trinh-nhom:issue-label-project-board",
    "03:github-quy-trinh-nhom:github-flow-vs-git-flow-vs-trunk-based",
    "03:github-quy-trinh-nhom:github-actions-ci-chay-test-tu-dong",
    "03:github-quy-trinh-nhom:readme-license-va-profile-gay-an-tuong",
    "03:github-quy-trinh-nhom:git-bisect-de-truy-commit-gay-bug",
    "03:github-quy-trinh-nhom:git-lfs-cho-file-model-va-dataset-nang"

  ];

  function initStore() {
  // Các mảng 04–07 và T0 được soạn trọn bộ. Sinh khóa trực tiếp từ curriculum
  // để tránh duy trì thủ công thêm 253 dòng dễ lệch slug 60 ký tự.
  var GENERATED_TRACKS = { "04": true, "05": true, "06": true, "07": true, "t0": true };
  function slug(s) {
    return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  }
  (window.CURRICULUM || []).forEach(function (track) {
    if (!GENERATED_TRACKS[track.id]) return;
    track.modules.forEach(function (module) {
      module.items.forEach(function (item) {
        HAVE.push(track.id + ":" + slug(module.name) + ":" + slug(item));
      });
    });
  });

  window.LESSONS = window.LESSONS || {};   // nơi các file bài học tự nạp vào
  var have = {};
  HAVE.forEach(function (k) { have[k] = true; });

  // Đường dẫn thư mục suy từ src của chính file này, để trang ở thư mục con
  // cũng nạp đúng.
  var self = document.currentScript;
  var base = self && self.src ? self.src.replace(/_manifest\.js(\?.*)?$/, "") : "assets/lessons/";

  function fileOf(key) { return base + key.replace(/:/g, "__") + ".js"; }

  /* Nạp một bài soạn sẵn. Trả về null nếu không có / nạp hỏng,
     để tầng trên biết mà chuyển sang gọi AI. */
  function load(key) {
    return new Promise(function (resolve) {
      if (!have[key]) { resolve(null); return; }
      if (window.LESSONS[key]) { resolve(window.LESSONS[key]); return; }

      var s = document.createElement("script");
      s.src = fileOf(key);
      s.async = false;
      s.onload = function () { resolve(window.LESSONS[key] || null); };
      s.onerror = function () {
        console.error("[lessons] Có trong manifest nhưng không nạp được:", key);
        resolve(null);
      };
      document.head.appendChild(s);

      // Không để trang treo nếu file im lặng không phản hồi
      setTimeout(function () { resolve(window.LESSONS[key] || null); }, 6000);
    });
  }

  window.LessonStore = {
    has: function (key) { return !!have[key]; },
    load: load,
    count: HAVE.length,
    keys: HAVE.slice()
  };
  }

  // Curriculum nạp các file mảng bất đồng bộ. Chờ ready để GENERATED_TRACKS
  // nhìn thấy đủ 04–07 và t0 trước khi đóng băng LessonStore.keys/count.
  if (window.Curriculum && !window.Curriculum.state.loaded) {
    window.Curriculum.ready(initStore);
  } else {
    initStore();
  }
})();
