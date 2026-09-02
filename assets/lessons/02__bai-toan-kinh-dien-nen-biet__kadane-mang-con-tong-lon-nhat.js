window.LESSONS["02:bai-toan-kinh-dien-nen-biet:kadane-mang-con-tong-lon-nhat"] = {

tom_tat: [
  "Kadane giải bài toán tìm một đoạn liên tiếp có tổng lớn nhất bằng cách chỉ giữ đáp án tốt nhất kết thúc đúng tại vị trí đang xét.",
  "Quyết định cốt lõi ở mỗi phần tử là: nối phần tử ấy vào đoạn trước, hay bỏ toàn bộ quá khứ và bắt đầu lại; so sánh `x` với `ending + x` trả lời câu hỏi đó.",
  "Bất biến phân biệt hai biến: `ending` là nghiệm bị buộc phải kết thúc tại chỉ số hiện tại, còn `best` là nghiệm tốt nhất trên mọi điểm kết thúc đã đi qua.",
  "Phiên bản chuẩn chạy O(n) thời gian, dùng O(1) bộ nhớ phụ; có thể trả cả tổng lẫn biên trái-phải mà không đổi độ phức tạp.",
  "Mảng toàn số âm, mảng rỗng, nhiều đoạn đồng hạng và quy ước cho phép đoạn rỗng là các điểm phải chốt trước khi code."
],

can_biet_truoc: [
  "Mảng và khái niệm đoạn con liên tiếp; phân biệt đoạn con với dãy con không cần liên tiếp.",
  "Độ phức tạp thời gian O(n), không gian O(1), và lý do một lần duyệt chưa tự động có nghĩa là đúng.",
  "Quy hoạch động, đặc biệt là cách định nghĩa trạng thái và viết quan hệ chuyển trạng thái.",
  "Tổng đoạn đầu để hiểu phương án vét cạn O(n²) dùng làm đối chứng."
],

dinh_nghia: "Cho mảng số `a` độ dài n, bài toán **mảng con tổng lớn nhất** yêu cầu chọn hai chỉ số l, r với 0 ≤ l ≤ r < n sao cho Σ a[i], từ i=l đến r, lớn nhất. Từ “mảng con” bắt buộc các phần tử nằm liền nhau; chọn ngày 1 rồi nhảy sang ngày 4 là một dãy con khác bài toán.\n\n**Kadane** là cách quy hoạch động nén bộ nhớ: tại mỗi vị trí i, tính tổng lớn nhất của một đoạn bắt buộc kết thúc ở i, rồi dùng các giá trị ấy để cập nhật nghiệm toàn cục. Với mảng không rỗng, thuật toán cần Θ(n) thời gian vì phải nhìn từng phần tử ít nhất một lần và Θ(1) bộ nhớ phụ vì chỉ giữ vài biến. Đây là cận tối ưu theo n trong mô hình phải đọc đầu vào.",

vi_sao_can: "Trong hệ thống thương mại điện tử xuyên suốt module, mỗi phút ta ghi **lợi nhuận ròng tăng thêm**: doanh thu trừ hoàn tiền, phí vận hành và trợ giá. Dãy `[4, -7, 3, 5, -2, 6, -11, 4]` không hỏi tổng cả ngày; đội vận hành muốn tìm một khoảng liên tục mà chiến dịch sinh lời mạnh nhất để đối chiếu với thời điểm bật quảng cáo.\n\nVét mọi cặp đầu-cuối rồi cộng lại tốn O(n³); dùng tổng đoạn đầu giảm còn O(n²), nhưng một năm dữ liệu theo giây có hơn 31 triệu mốc khiến số cặp là bất khả thi. Kadane tận dụng một sự thật rất riêng của phép cộng: nếu tổng quá khứ đang âm thì mang nó sang tương lai chỉ làm mọi đoạn tương lai tệ hơn. Bỏ quá khứ ấy là quyết định an toàn, không phải mẹo đoán.\n\nMẫu tư duy còn quan trọng hơn đáp án: đặt một ràng buộc địa phương “nghiệm phải kết thúc tại đây” khiến trạng thái dễ chuyển; sau đó lấy tốt nhất qua mọi trạng thái địa phương. Cách tách này xuất hiện lại trong bài dãy con tăng dài nhất, lợi nhuận mua bán cổ phiếu và nhiều bài quy hoạch động.",

co_che: "### Từ O(n²) đến một câu hỏi có hai lựa chọn\n\nVới mỗi điểm cuối r, phương án O(n²) thử mọi l và tính tổng nhờ tổng đoạn đầu. Kadane hỏi ngược: giả sử đã biết đoạn tốt nhất kết thúc ở r−1, khi nhìn `a[r]=x` thì đoạn tốt nhất kết thúc ở r chỉ có hai hình dạng. Nó hoặc chỉ gồm `[x]`, hoặc là đoạn tốt nhất kết thúc ở r−1 nối thêm x. Một đoạn khác kết thúc ở r nhưng có phần trước kém hơn không thể thắng, vì cộng cùng x giữ nguyên thứ tự lớn-nhỏ.\n\nDo đó `ending = max(x, ending + x)`. Công thức ngắn nhưng định nghĩa trạng thái mới là phần khó. `ending` không phải đáp án toàn cục; nó chịu ràng buộc phải chạm vị trí hiện tại. Ta cần `best = max(best, ending)` để nhớ điểm kết thúc tốt nhất từng thấy.\n\n### Bất biến vòng lặp\n\nSau khi xử lý chỉ số i:\n\n1. `ending` bằng tổng lớn nhất trong mọi đoạn có đầu bất kỳ nhưng cuối đúng tại i.\n2. `best` bằng tổng lớn nhất trong mọi đoạn nằm hoàn toàn trong `a[0..i]`.\n\nChứng minh quy nạp. Ở i=0, đoạn không rỗng duy nhất là `[a[0]]`, nên cả hai biến đều đúng. Giả sử mệnh đề đúng tại i−1. Mọi đoạn kết thúc tại i hoặc bắt đầu ở i, hoặc kéo dài một đoạn kết thúc tại i−1. Trong nhóm thứ hai, nối vào đoạn có `ending` lớn nhất luôn tốt nhất. Lấy `max` hai nhóm tạo đúng trạng thái mới; so nó với `best` cũ bao phủ mọi đoạn nằm trong đoạn đầu mới. Vì thế bất biến được giữ đến cuối.\n\n### Diễn tiến trên luồng lợi nhuận\n\n| i | x | ending trước + x | ending mới | best | quyết định |\n|---:|---:|---:|---:|---:|---|\n| 0 | 4 | — | 4 | 4 | bắt đầu |\n| 1 | -7 | -3 | -3 | 4 | nối vẫn hơn -7 |\n| 2 | 3 | 0 | 3 | 4 | bỏ quá khứ âm |\n| 3 | 5 | 8 | 8 | 8 | nối |\n| 4 | -2 | 6 | 6 | 8 | chịu lỗ tạm thời |\n| 5 | 6 | 12 | 12 | 12 | nối |\n| 6 | -11 | 1 | 1 | 12 | chưa cần bỏ |\n| 7 | 4 | 5 | 5 | 12 | nối |\n\nĐáp án là đoạn `[3, 5, -2, 6]`, tổng 12. Chi tiết dễ hiểu sai: gặp số âm không có nghĩa phải cắt ngay. Khoản −2 đáng chịu vì hai phía tạo tổng lớn hơn; tiêu chí cắt là tổng tích lũy trước đó gây hại cho điểm hiện tại, không phải dấu của riêng phần tử.\n\n### Khôi phục hai biên\n\nMuốn trả l và r, giữ `candidate_left`, vị trí bắt đầu của `ending`. Khi `x > ending+x`, ta bắt đầu lại và đặt `candidate_left=i`. Khi `ending` vượt `best`, chụp `candidate_left` và i vào nghiệm. Quy tắc đồng hạng phải được quyết định rõ: dùng `>` giữ đoạn xuất hiện sớm; dùng `>=` thiên về đoạn mới hơn. Nếu muốn đoạn ngắn nhất trong các nghiệm đồng tổng, cần so thêm độ dài chứ không thể hy vọng dấu bằng tự giải quyết.\n\n### Mảng toàn số âm và đoạn rỗng\n\nKhởi tạo `ending=best=0` làm kết quả của `[-8,-3,-5]` thành 0, tức ngầm cho phép chọn đoạn rỗng. Nếu đề yêu cầu đoạn không rỗng, đáp án đúng là −3 và phải khởi tạo từ phần tử đầu. Hai quy ước đều hợp lý trong nghiệp vụ khác nhau: “chọn một chiến dịch bắt buộc” dùng đoạn không rỗng; “có thể không chạy chiến dịch” cho phép 0. Lỗi nằm ở việc không nói rõ quy ước.\n\nMảng rỗng cũng không có `a[0]`. API nên ném `ValueError`, trả `None`, hoặc định nghĩa kết quả 0; lựa chọn phải thể hiện trong hợp đồng và test.\n\n### Vì sao không cần lưu bảng dp\n\nNếu viết `dp[i] = max(a[i], dp[i-1]+a[i])`, bảng n phần tử tốn O(n) bộ nhớ. Nhưng trạng thái i chỉ đọc i−1, nên giá trị cũ có thể bị ghi đè. Nén còn một biến hạ bộ nhớ phụ xuống O(1). Nếu cần truy vết biên, ba chỉ số vẫn là hằng số; không cần giữ cả bảng.\n\n### Giới hạn số và dữ liệu trực tuyến\n\nPython dùng số nguyên độ chính xác tùy ý nên không tràn với dữ liệu nguyên. Trong Java/C++, n phần tử gần giới hạn 32 bit có thể làm tổng vượt miền `int`; dùng kiểu 64 bit khi ràng buộc cho phép. Với số thực, phép cộng có sai số làm tròn; so sánh đồng hạng tuyệt đối có thể không ổn.\n\nKadane xử lý trực tuyến: mỗi số đến chỉ cần cập nhật vài biến, không phải giữ toàn bộ luồng. Đây là ưu điểm lớn khi theo dõi chỉ số theo phút. Tuy nhiên muốn trả chính các phần tử của đoạn sau khi luồng đã trôi qua, ta phải lưu dữ liệu tương ứng hoặc có nguồn đọc lại; O(1) chỉ đúng cho việc tính tổng và biên.\n\n### Khi nào Kadane không áp dụng trực tiếp\n\nNếu được phép chọn các phần tử không liên tiếp, bài toán đổi thành chọn mọi số dương theo quy ước đơn giản. Nếu cần đúng độ dài k, cửa sổ trượt thích hợp hơn. Nếu có nhiều truy vấn trên một mảng hay cập nhật điểm, segment tree lưu tổng, đoạn đầu tốt nhất, đoạn cuối tốt nhất và đoạn con tốt nhất sẽ phù hợp. Nếu mảng hai chiều, phải cố định cặp hàng rồi chạy Kadane theo cột, thường O(h²w), chứ không thể quét phẳng ma trận.",

vi_du: "### Python trả tổng và khoảng nửa mở\n\nĐoạn `[left, right)` hợp với slicing của Python và tránh nhập nhằng độ dài.\n\n```python\nfrom collections.abc import Sequence\n\ndef max_subarray(values: Sequence[int]) -> tuple[int, int, int]:\n    if not values:\n        raise ValueError(\"values phải không rỗng\")\n\n    ending = best = values[0]\n    candidate_left = best_left = 0\n    best_right = 1\n\n    for i in range(1, len(values)):\n        x = values[i]\n        if x > ending + x:\n            ending = x\n            candidate_left = i\n        else:\n            ending += x\n\n        if ending > best:\n            best = ending\n            best_left = candidate_left\n            best_right = i + 1\n\n    return best, best_left, best_right\n\nprofits = [4, -7, 3, 5, -2, 6, -11, 4]\ntotal, left, right = max_subarray(profits)\nassert (total, left, right) == (12, 2, 6)\nassert profits[left:right] == [3, 5, -2, 6]\nassert max_subarray([-8, -3, -5]) == (-3, 1, 2)\nassert max_subarray([9]) == (9, 0, 1)\n```\n\n### Bộ kiểm vét cạn cho test ngẫu nhiên\n\nMột oracle nhỏ O(n²) rất hữu ích để bắt lỗi chỉ số. Nó không dùng trong production, nhưng có thể so hàng nghìn mảng ngắn.\n\n```python\ndef brute(values):\n    best = None\n    answer = None\n    for left in range(len(values)):\n        total = 0\n        for right in range(left, len(values)):\n            total += values[right]\n            if best is None or total > best:\n                best = total\n                answer = (total, left, right + 1)\n    return answer\n\nimport random\nrng = random.Random(2026)\nfor _ in range(2_000):\n    data = [rng.randint(-20, 20) for _ in range(rng.randint(1, 12))]\n    assert max_subarray(data) == brute(data)\n```\n\nTest cố định seed để lỗi tái hiện được. Phép so sánh này còn kiểm chứng quy tắc đồng hạng “giữ nghiệm xuất hiện trước”, vì cả hai hàm chỉ cập nhật khi tổng lớn hơn nghiêm ngặt.",

so_sanh: "### Chọn công cụ theo dạng yêu cầu\n\n| Phương án | Thời gian | Bộ nhớ phụ | Điểm mạnh | Khi không nên dùng |\n|---|---:|---:|---|---|\n| Thử mọi đoạn và cộng lại | O(n³) | O(1) | dễ hình dung | gần như chỉ để giảng nhập môn |\n| Tổng đoạn đầu + mọi cặp | O(n²) | O(n) | oracle đơn giản, hỗ trợ tổng đoạn bất kỳ | n lớn hoặc dữ liệu trực tuyến |\n| Kadane | O(n) | O(1) | một truy vấn, luồng đến tuần tự | nhiều cập nhật và truy vấn xen kẽ |\n| Chia để trị | O(n log n) | O(log n) | minh họa đoạn cắt qua giữa, dễ song song hóa | chỉ cần một đáp án tuần tự |\n| Segment tree | dựng O(n), truy vấn/cập nhật O(log n) | O(n) | dữ liệu động, nhiều thao tác | một lần quét tĩnh vì cấu trúc quá nặng |\n\nKadane thắng đúng bài tĩnh một chiều vì loại bỏ được mọi tiền tố có tổng gây hại. Đừng biến nó thành phản xạ cho mọi câu có chữ “đoạn”: ràng buộc độ dài, phép nhân, phép XOR hoặc nhiều truy vấn có đại số khác và cần bất biến khác.",

loi_thuong_gap: [
  "Khởi tạo bằng 0 dù đề bắt buộc đoạn không rỗng; nhận biết bằng test toàn số âm trả 0 thay vì phần tử lớn nhất.",
  "Cập nhật `best` trước khi cập nhật `ending`; test một phần tử dương sau đoạn âm sẽ cho thấy nghiệm bị chậm một bước.",
  "Cắt cứ khi gặp phần tử âm; ví dụ `[5,-1,5]` phải giữ cả ba phần tử với tổng 9.",
  "Nhầm mảng con với dãy con; nếu code chọn hai số dương cách nhau nhưng bỏ số âm giữa thì đã giải bài khác.",
  "Trả biên phải lúc thì bao gồm, lúc thì không; đối chiếu `sum(a[l:r]) == best` để phát hiện lệch một.",
  "Dùng số nguyên 32 bit cho tổng lớn; test sát ràng buộc làm kết quả đổi dấu là dấu hiệu tràn số.",
  "Không quy định cách phá hòa; test có nhiều đoạn cùng tổng khiến kết quả thay đổi sau một sửa đổi tưởng vô hại."
],

tu_kiem_tra: [
  "Vì sao chỉ cần xét đoạn tốt nhất kết thúc ở i−1, thay vì mọi đoạn kết thúc tại đó?",
  "Hãy điền bảng `ending` và `best` cho `[2,-5,4,-1,2,-6,3]`, rồi chỉ ra biên nghiệm.",
  "Khởi tạo bằng 0 đang âm thầm thay đổi hợp đồng bài toán như thế nào?",
  "Sửa code để trong các nghiệm đồng tổng chọn đoạn ngắn nhất; cần thêm điều kiện phá hòa nào?",
  "Tại sao thuật toán là Ω(n) ngay cả khi đáp án nằm ở hai phần tử đầu?",
  "Nếu cần tổng lớn nhất của đoạn có độ dài đúng k, trạng thái Kadane thất bại ở đâu và cấu trúc nào thay thế?",
  "Hãy mô tả bốn đại lượng một nút segment tree phải lưu để ghép đáp án mảng con lớn nhất từ hai nửa."
],

tai_nguyen: [
  "Introduction to Algorithms — phần Dynamic Programming.",
  "The Algorithm Design Manual — các mẫu quy hoạch động và phân tích bài toán.",
  "Algorithms của Robert Sedgewick và Kevin Wayne — nền tảng phân tích giải thuật.",
  "Competitive Programming 4 — bài tập về maximum subarray và biến thể."
],

lien_he: [
  "Nối sang mảng Phân tích độ phức tạp: chứng minh Θ(n) gồm cả cận trên một vòng quét và cận dưới phải đọc đầu vào.",
  "Nối sang mảng Kỹ thuật giải thuật cốt lõi: Kadane là quy hoạch động được nén từ bảng một chiều xuống trạng thái hằng số.",
  "Nối sang mảng Cây: segment tree mở rộng cùng đại lượng sang dữ liệu có cập nhật và nhiều truy vấn.",
  "Nối sang mảng Kiểm thử: oracle vét cạn và property-based testing kiểm tra thuật toán tối ưu trên ca ngẫu nhiên nhỏ."
]

};
