# CFA QUEST — ETHICS

## Mã nhóm

G07 — Nhóm 7, học phần NHA408E (Technology Applications in Banking and Finance), FTU 2026

## Thành viên

| Họ tên | Mã sinh viên | Vai trò chính |
| ------ | ------------ | ------------- |
| Nguyễn Lê Phương Quỳnh | 2412380042 | **Project Leader · Main Developer**: điều phối nhóm và phạm vi sản phẩm; thiết kế logic chẩn đoán, công thức tính điểm; code chính từ giữa kì đến cuối kì (engine, giao diện, lớp game, chế độ demo, công cụ, kiểm thử tự động); tích hợp và tài liệu chính |
| Trần Nhật Hồng | 2412380019 | **Content Leader**: biên soạn và rà soát ngân hàng câu hỏi Ethics; kịch bản demo; tổng hợp giới hạn sản phẩm |
| Kim Mai Trang | 2412380048 | **Generation Logic & QA**: quy tắc sinh đề cho 5 Arena; kiểm thử sinh đề; ràng buộc kiểm tra ngân hàng câu hỏi; rà soát nhất quán tài liệu |
| Nguyễn Vũ Anh Minh |  | **Game Economy & Testing**: cơ chế Credit, Shop và vật phẩm; kiểm thử chấm điểm; đồng thiết kế tutorial |
| Nguyễn Minh Khôi | 2412380021  | **UI/UX & Art**: thiết kế giao diện, bộ hình pixel-art và asset; thiết kế tutorial; kiểm thử thao tác và thiết bị |

## Mô tả ngắn về sản phẩm

CFA Quest là một web game giúp người tự ôn CFA Level I biết mình đang yếu ở nhóm Standards nào trong môn Ethics, rồi tự sinh bài luyện nhắm đúng phần đó. Người chơi đi qua 5 Arena như một hầm ngục: Arena đầu tiên dùng để chẩn đoán, các Arena sau được tạo từ chính những câu người chơi làm sai. Cuối hành trình, game cho biết cụm kiến thức nào đã cải thiện và cụm nào cần ôn tiếp.

## Vấn đề sản phẩm giải quyết

Khi tự luyện trắc nghiệm Ethics, người học thường chỉ biết điểm tổng, ví dụ đúng 10/15 câu. Con số này không cho biết lỗi sai đang dồn vào Standard nào. Các Standards trong Ethics lại có nhiều tình huống gần giống nhau, nên người học dễ ôn dàn trải theo cảm giác: luyện tiếp phần đã chắc, bỏ sót phần đang sai nhiều.

CFA Quest nối bốn bước mà bộ đề cố định không làm được: ghi nhận lỗi sai theo từng cụm kiến thức → xác định cụm yếu → sinh đề luyện nhắm vào cụm đó → kiểm tra lại ở vòng cuối. Người chơi không phải tự chọn luyện gì; dữ liệu bài làm của họ chọn hộ.

## Người dùng mục tiêu

Người dùng chính là thí sinh đang tự ôn CFA Level I, đã học xong lý thuyết Ethics và chuyển sang giai đoạn luyện câu hỏi trắc nghiệm.

Việc người dùng cần làm (user task): đi hết hành trình 5 Arena và biết sau đó nên ôn lại cụm Standards nào.

Sản phẩm cũng có thể dùng trong lớp học hoặc buổi ôn nhóm để minh họa cách dữ liệu bài làm được dùng để cá nhân hóa bài luyện.

## Tính năng chính

* Ngân hàng 220 câu hỏi Ethics do nhóm tự biên soạn, gắn nhãn theo 5 cụm chẩn đoán, 9 module và 3 mức độ khó. Mỗi câu có lời giải và phân tích phương án gây nhiễu.
* Hành trình 5 Arena (60 câu nếu không phải chơi lại). Arena 1 chẩn đoán ban đầu; Arena 2 luyện cụm yếu nhất, Arena 4 luyện cụm yếu tiếp theo; Boss kiểm tra lại 3 cụm yếu nhất.
* Độ khó tăng dần theo vòng: ngưỡng đỗ cao hơn, nhiều câu khó hơn, có giới hạn thời gian ở 3 vòng cuối.
* Credit, Shop và Bùa Loại Trừ để hỗ trợ người chơi ở vòng khó; World Quest để luyện thêm và kiếm Credit trước khi mở Boss.
* Lớp game hành động: di chuyển bằng W, A, S, D, đánh quái để mở câu hỏi, né đạn ở Boss. Lớp này chỉ quyết định khi nào câu hỏi hiện ra, không ảnh hưởng chấm điểm hay chẩn đoán.
* Bảng chẩn đoán sau mỗi Arena và bảng tổng kết sau Boss, cho biết cụm nào đã cải thiện, cụm nào cần ôn tiếp.
* Chế độ demo có 4 kịch bản dựng sẵn để tái hiện kết quả đã tính trước khi trình bày.

## Cách hoạt động

```text
Arena 1: 15 câu, đủ 5 cụm  →  xác định cụm yếu nhất (W1)
Arena 2: 10 câu thuộc W1
Arena 3: 10 câu, đủ 5 cụm  →  xác định cụm yếu thứ hai (W2, khác W1)
Arena 4: 10 câu thuộc W2   →  xác định 3 cụm yếu nhất
Boss:    15 câu chia 7/5/3 cho 3 cụm yếu nhất (cần 15 Credit để mở)
         →  Bảng tổng kết: cụm nào cải thiện, cụm nào cần ôn tiếp
```

Ngưỡng đỗ tăng dần 70% / 75% / 75% / 85% / 90%. Câu trả lời đúng nhờ Bùa vẫn tính cho đỗ/trượt nhưng không được dùng để chẩn đoán, để kết quả chẩn đoán phản ánh đúng phần người chơi tự làm.

Chi tiết luật, công thức và cách phân định khi hai cụm bằng điểm: [`docs/SOLUTION_STRUCTURE.md`](docs/SOLUTION_STRUCTURE.md) (Mục 5: công thức, Mục 15: lớp hành động).

## Cách mở hoặc chạy sản phẩm

Cách nhanh nhất:

```text
1. Mở link demo bằng máy tính có bàn phím.
2. Bấm bắt đầu, đọc các thẻ hướng dẫn luật chơi.
3. Dùng W, A, S, D di chuyển; nhân vật tự chém quái trong tầm, mỗi con quái mở một câu hỏi.
4. Chọn đáp án và bấm Xác nhận. Hết quái thì màn kết thúc, xem kết quả và bảng chẩn đoán.
5. Đi tiếp qua Arena 2–4, mua Bùa ở Shop nếu cần, chơi World Quest nếu thiếu Credit mở Boss.
6. Vượt Boss để xem bảng tổng kết.
```

Chạy từ repo (không cần cài đặt, không cần server):

```text
1. Tải repo về máy (Code → Download ZIP) và giải nén.
2. Mở thư mục src/, bấm đúp cfa_quest_v11.html.
3. Màn hình đầu hiện dòng "Ngân hàng hợp lệ: 220 câu, 5 cụm, 9 module." là chạy đúng.
```

Chạy bộ kiểm thử tự động (cần Node.js): mở thư mục repo và gõ `node --test`.

Sản phẩm chạy hoàn toàn trên trình duyệt, không cần đăng nhập, không gọi API bên ngoài; tiến trình lưu trên trình duyệt của người chơi. Chưa hỗ trợ thiết bị chỉ có màn hình cảm ứng.

## Link demo

* Bản chính thức (đề bốc ngẫu nhiên): https://ftu-legacy-63.github.io/G07/src/cfa_quest_v11.html
* Chế độ demo có kịch bản: https://ftu-legacy-63.github.io/G07/src/cfa_quest_v11.html?demo=1
* Bản dự phòng và hướng dẫn chạy offline: [`W6/deployment.md`](W6/deployment.md)
* Tài khoản demo: không cần.

## Ví dụ sử dụng

Kịch bản 1 trong chế độ demo đi hết 5 Arena với đáp án cố định. Arena 1 đúng 11/15 câu (đỗ), cụm yếu nhất là C2, nên Arena 2 gồm 10 câu C2. Arena 3 xác định cụm yếu tiếp theo là C1, nên Arena 4 gồm 10 câu C1. Sau Arena 4, Boss được chia C2 (7 câu), C1 (5 câu), C3 (3 câu). Bảng tổng kết cho kết quả C1 và C2 đã cải thiện, C3 cần cải thiện tiếp.

Bốn kịch bản (chuẩn, lật đỗ/trượt, hòa điểm, bật/tắt Bùa) và kết quả mong đợi của từng kịch bản: [`W6/demo-input.md`](W6/demo-input.md).

## Ghi chú về dữ liệu

Toàn bộ 220 câu hỏi, tình huống, lời giải và lý do gây nhiễu do nhóm tự biên soạn cho mục đích học tập. Tình huống là giả định, không trích nguyên văn tài liệu của CFA Institute hay GIPS Standards; tên Standard chỉ dùng để phân loại. Nhóm không đưa tài liệu luyện thi thương mại nào vào repo.

Các con số như ngưỡng đỗ, tỷ lệ câu khó, giới hạn thời gian, giá mở Boss và mức thưởng Credit là lựa chọn thiết kế của nhóm, chưa được kiểm chứng bằng dữ liệu người chơi thật.

* Dữ liệu câu hỏi: [`data/ethics_bank_220.json`](data/ethics_bank_220.json)
* Định nghĩa trường dữ liệu: [`docs/INPUT_DICTIONARY.md`](docs/INPUT_DICTIONARY.md)
* Nguồn và cách dùng: [`docs/SOURCE_USE_MAP.md`](docs/SOURCE_USE_MAP.md)
* Giả định thiết kế: [`docs/ASSUMPTIONS.md`](docs/ASSUMPTIONS.md)

## Kiểm thử

20 test tự động kiểm tra luật game (chấm điểm, sinh đề, Credit, Boss, World Quest) và 4 kịch bản demo, hiện đều đạt. Danh sách test case và kết quả: [`W6/testing.md`](W6/testing.md). Lỗi đã gặp và cách xử lý: [`W6/bug-log.md`](W6/bug-log.md).

## Hạn chế

Sản phẩm chỉ xác định cụm có tỷ lệ đúng thấp trong một lượt chơi. Nó không đo năng lực Ethics theo chuẩn, không dự báo kết quả thi CFA thật, và chưa chứng minh được rằng việc luyện trong game làm người chơi tiến bộ. Số câu mỗi cụm trong một lượt còn ít, nên kết quả chẩn đoán chỉ nên dùng làm gợi ý ôn tập.

Danh sách đầy đủ: [`W6/limitations.md`](W6/limitations.md).

---

## Bản quyền

Toàn bộ 220 câu hỏi, tình huống, lời giải và lý do gây nhiễu do nhóm tự biên soạn.

Tình huống là tình huống giả định, không trích nguyên văn tài liệu CFA Institute hoặc GIPS Standards. Tên Standard được dùng cho mục đích phân loại học thuật. Không có tài liệu nguồn thương mại nào được đưa vào repo hoặc lịch sử commit.

## Ghi chú thêm

CFA Quest là sản phẩm MVP cho môn học, hiện chỉ làm môn Ethics trong 10 môn của CFA Level I. Nhóm ưu tiên phần lõi là chẩn đoán điểm yếu và sinh đề theo dữ liệu sai; lớp game hành động được xây sau, trên một engine đã khóa luật và có kiểm thử.

Nếu phát triển tiếp, nhóm có thể mở rộng ngân hàng câu hỏi để chẩn đoán đáng tin hơn, thêm các môn khác của CFA Level I, chỉnh độ khó dựa trên dữ liệu chơi thử với người dùng thật, và làm điều khiển cảm ứng cho điện thoại.
