# Individual Footprint — Nguyễn Lê Phương Quỳnh

**Họ và tên:** Nguyễn Lê Phương Quỳnh

**Nhóm:** Nhóm 7

**Dự án:** CFA Quest - Ethics

**Học phần:** NHA408E - Technology Applications in Banking and Finance

**Vai trò chính:** Trưởng nhóm; thiết kế logic chẩn đoán và tính điểm; phụ trách code chính từ giữa kì đến cuối kì (engine, giao diện, lớp game, chế độ demo, công cụ và kiểm thử tự động); tích hợp sản phẩm

## 1. Vai trò trong dự án

Trong dự án CFA Quest - Ethics, em đảm nhận ba phần việc: thiết kế logic của game, code sản phẩm và điều phối nhóm.

Phần logic là toàn bộ "luật chơi có tính toán": cách sinh đề cho từng màn, ba bộ đếm điểm, cách xếp hạng cụm yếu, luật phân định khi hai cụm bằng điểm, bảng tổng kết sau Boss và giới hạn những gì sản phẩm được phép kết luận. Tất cả được viết thành đặc tả trong SOLUTION_STRUCTURE.md trước khi code.

Phần code gồm engine (sinh đề, chấm điểm, Credit, đồng hồ, cổng Boss, World Quest), giao diện, tutorial, lớp game hành động, chế độ demo, các công cụ trong `tools/` và bộ kiểm thử tự động trong `test/`. Em là người xác định yêu cầu, kiểm tra kết quả và chịu trách nhiệm cho phần code này.

Phần điều phối gồm chia việc theo từng tuần, nhận sản phẩm của các thành viên và đưa lên repo. Từ Week 7, em code toàn bộ một mình để các thành viên không ghi đè lên nhau; các bạn khác chuyển sang viết câu hỏi, kịch bản demo, tài liệu và thiết kế hình ảnh.

## 2. Dấu ấn cá nhân trong sản phẩm

### (1) Logic chẩn đoán có thể kiểm tra lại bằng tay

Mục tiêu của CFA Quest là chỉ ra cho người học cụm Ethics nào họ đang làm kém nhất trong phiên chơi, rồi cho họ luyện đúng cụm đó. Để kết quả này đáng tin, em tách điểm thành ba bộ đếm có nhiệm vụ riêng:

- arena_score_correct tính cả câu dùng vật phẩm, dùng để quyết định qua màn hay trượt.

- accuracy_cumulative bỏ câu dùng vật phẩm, dùng để xếp hạng cụm yếu.

- performance_score quy đổi độ khó 1/2/3 điểm, chỉ hiện ở bảng tổng kết sau Boss.

Nếu gộp hai bộ đếm đầu, người chơi dùng Bùa Loại Trừ để trả lời đúng sẽ làm cụm đó trông mạnh hơn thực tế, và game sẽ nhắm sai cụm ở các màn Trap. Tách ra như vậy thì vật phẩm giúp người chơi qua màn mà không làm sai dữ liệu chẩn đoán.

Ở Arena 1, mỗi cụm chỉ có 3 câu nên hòa điểm gần như chắc chắn xảy ra (5 cụm nhưng chỉ có 4 mức điểm 0–3). Em viết chuỗi phân định 3 bước sau tỷ lệ đúng (độ khó trung bình câu sai cao hơn → thời gian trả lời trung bình dài hơn → mã cụm C1–C5), không dùng ngẫu nhiên, để cùng một bộ câu trả lời luôn ra cùng một kết quả. Nhờ vậy giảng viên có thể tự tính tay và so với game.

### (2) Lớp game hành động không chạm vào logic chẩn đoán

Sau góp ý của thầy về việc đầu tư thêm cho giao diện, em thiết kế và code lớp game hành động: người chơi đi bằng W, A, S, D, đánh quái để mở từng câu hỏi; ở Boss, người chơi né đạn laser xoắn và chém trúng Boss mới mở được câu.

Nguyên tắc em giữ khi làm phần này: lớp game chỉ thay cách câu hỏi được mở ra, không đổi cách sinh đề và chấm điểm. Khi câu hỏi hiện, cả màn đứng hình. Thanh máu Boss giảm một nấc mỗi câu, bất kể đúng hay sai, để người chơi không đoán được kết quả trước khi hết màn. Lượt Boss thua vì mất hết tim (lượt trắng) không được tính vào performance_score, nên khả năng né đạn không làm lệch dữ liệu chẩn đoán.

## 3. Những việc đã thực sự làm

### 3.1. Thiết kế logic game

- Viết user flow: happy path 14 bước, alternative path, error path 7 tình huống (docs/user-flow.md).

- Viết feature scope: tính năng chính, phụ, tùy chọn, ranh giới Core–Optional và phần ngoài phạm vi (docs/feature-scope.md).

- Thiết kế ba công thức tính điểm, biến trạng thái, chuỗi phân định 3 bước, quy tắc loại câu dùng vật phẩm khỏi mẫu chẩn đoán.

- Thiết kế bảng tổng kết sau Boss (O4) với 4 điều kiện dán nhãn chạy theo thứ tự.

- Viết bảng claim boundary: sản phẩm chỉ nói "cụm có tỷ lệ đúng thấp nhất trong phiên này", không nói "đánh giá năng lực Ethics".

- Viết các tài liệu SOLUTION_STRUCTURE, INPUT_DICTIONARY, ASSUMPTIONS, SOURCE_USE_MAP, SAMPLE_INPUT_OUTPUT, MIDTERM_REVIEW, README.

- Làm file Excel minh họa một lượt chơi với mã câu thật: 8 sheet, hơn 692 công thức nối liền 5 màn, kèm macro VBA (W4/). Luật chặn màn khi trượt được viết bằng công thức, nên file vẫn chạy đúng khi tắt macro; VBA chỉ thêm hiệu ứng.

### 3.2. Code engine (sau giữa kì)

- Code luồng 5 màn Arena 1 → Arena 2 → Arena 3 → Arena 4 → Boss: sinh đề theo cụm, chia đều module, không lặp câu; xếp hạng cụm yếu; tính ba bộ đếm; dán nhãn O4.

- Theo góp ý giảng viên đầu tháng 10 rằng độ khó các màn đang phẳng, em đổi luật và code lại:

  - Ngưỡng qua màn tăng dần 70/75/75/85/90% thay cho 70% chung.

  - Tỷ lệ câu dễ/vừa/khó nặng dần qua từng màn.

  - Giới hạn thời gian mỗi câu ở Arena 3 (100 giây), Arena 4 (80 giây), Boss (60 giây); quá giờ trừ 1 Credit mỗi 10 giây.

  - Cổng Boss: trả 15 Credit một lần để mở; thoát giữa Boss thì mất 15 Credit và Boss khóa lại.

  - World Quest: màn phụ cho người thiếu Credit cày thêm, chỉ cộng Credit, không cộng điểm.

- Code trường hợp trượt Boss rồi đỗ: bảng O4 đọc lượt Boss đỗ và bỏ các câu đã gặp, performance_score lấy lượt đầu.

- Tích hợp ngân hàng câu hỏi qua các đợt mở rộng: 110 câu lúc giữa kì, 170 câu ở Week 6, hiện tại 220 câu (44 câu mỗi cụm) trong data/ethics_bank_220.json.

### 3.3. Code giao diện, tutorial, lớp game và chế độ demo

- Viết giao diện trong `src/cfa_quest_v11.html`, `src/cfa_quest_v11.js` (phần 3) và `src/cfa_quest_v11.css`: đổi tên trên màn hình thành Arena 2/3/4 (giữ id nội bộ), màn tiến trình gọn thành các thẻ (nay là 7 thẻ: Arena 1–4, World Quest, Boss, Bảng tổng kết), bấm vào thẻ màn đã qua mới xem bảng chẩn đoán, biểu đồ, cụm bị nhắm và giải thích câu sai.

- Gắn bộ hình pixel-art do Khôi vẽ vào game: nhân vật, quái, Boss, nền từng màn, cảnh chuyển, hộp thoại, đồng xu, thanh máu.

- Code tutorial dạy luật bằng thẻ, coach mark và toast, thay cho phương án NPC dẫn truyện đã bỏ (nay ở `src/cfa_quest_v11.js` phần 2 và `src/cfa_quest_v11.css` phần 4).

- Ngày 22/10/2026 gộp các file giao diện rời thành một file JS và một file CSS, giữ nguyên thứ tự nạp: 4 file JS cũ (lớp game, tutorial, giao diện chính, lớp skin) thành `src/cfa_quest_v11.js`; 6 file CSS cũ thành `src/cfa_quest_v11.css`. Đầu mỗi file ghi rõ phần nào gộp từ file nào.

- Code lớp game hành động trên canvas:

  - Arena 1–4 và World Quest: tối đa 4 quái trên màn, quái chậm hơn nhân vật, tự chém khi quái vào tầm, bất tử 1 giây sau mỗi câu.

  - Boss: đứng yên, báo hiệu trước mỗi đợt bắn, tia đầu tiên ngắm vào nhân vật, chiều xoay đổi sau mỗi đợt; người chơi có 2 tim; trả lời xong thì bị đẩy ra đường tròn bán kính R; mỗi lần mở khóa có 2 lượt trắng, mất tim lần thứ 3 tính là thoát.

  - Đồng xu Credit rơi sau khi hết màn, tự bay về nhân vật sau vài giây.

  - Mọi tham số (tốc độ, bán kính, thời gian) nằm trong một khối GAME_CONFIG để chỉnh sau khi chơi thử chỉ sửa một chỗ.

- Code chế độ demo ?demo=1: ô chọn 1 trong 4 kịch bản (chuẩn, lật qua/trượt, hòa điểm, bật/tắt vật phẩm) và nút "Chạy kịch bản". Lượt demo không ghi đè tiến trình chơi thường đã lưu.

### 3.4. Công cụ và kiểm thử tự động

- Viết bộ kiểm thử tự động trong `test/`: 3 file, 20 test, chạy bằng `node --test` ở thư mục gốc repo, hiện pass 20/20.
  - `test/engine_seed7.test.js` (6 test): khớp từng con số của Seed 7 trong `W6/demo-input.md`; phạt quá giờ làm tròn lên theo bước 10 giây; thoát giữa Arena 3 vẫn trừ phạt quá giờ; thoát giữa Boss không hoàn Credit mở Boss; Bùa bị cấm ở Arena 1 và World Quest; thưởng World Quest theo bậc 90/80/60%.
  - `test/scenarios.test.js` (8 test): chạy 4 kịch bản demo qua engine, kiểm tra kết quả engine khớp kết quả mong đợi trong `W6/demo-input.md` và đáp án đúng ghi trong kịch bản khớp ngân hàng câu hỏi.
  - `test/white_run.test.js` (6 test): luật lượt trắng ở Boss, gồm mất hết tim lần 1 vẫn giữ Boss mở, ví dụ `lượt trắng → trượt 12/15 → đỗ 14/15`, mất hết tim lần thứ 3 tính là thoát Boss, thoát chủ động, bản lưu cũ chưa có trường lượt trắng, và `whiteRun()` chỉ dùng cho Boss.

- Viết `tools/build_scenarios.js`: đọc các bảng câu hỏi trong `W6/demo-input.md` (kịch bản do Hồng soạn) và sinh tự động `src/cfa_quest_scenarios.js` cho chế độ demo. Sửa kịch bản chỉ cần sửa tài liệu rồi chạy lại lệnh, không sửa tay file `.js`.

- Viết bộ script Python `tools/asset_pipeline/` (11 file): tách khung, làm sạch nền, dựng sprite sheet, nền và phần tử giao diện từ bộ hình pixel-art của Khôi, xuất WebP và sinh danh mục `src/asset/assets.js`. Bộ ảnh gốc khoảng 183 MB được đưa về khoảng 6,1 MB để game tải nhanh.

- Code công cụ kiểm tra ngân hàng câu hỏi chạy offline `tools/validate_question_bank.html` (bộ ràng buộc kiểm tra do Trang đề xuất, ghi ở `docs/WEEK5_CHECKPOINT.md` Mục 10).

### 3.5. Điều phối và tích hợp

- Chia việc cho các thành viên theo từng tuần, mỗi việc gắn với một sản phẩm cụ thể.

- Nhận sản phẩm của các thành viên và đưa lên repo G07. Vì chỉ em commit, ở WEEK5_CHECKPOINT em ghi rõ tên người commit không phải là tác giả nội dung và ghi tác giả từng phần ở bảng mục 10.

- Kiểm tra công việc của các thành viên còn lại trước khi đưa vào sản phẩm hoàn chỉnh.

- Chốt thu hẹp phạm vi: bỏ vật phẩm thứ hai (Cuộn Giấy Gợi Ý), bỏ 4 tính năng kiểu giao diện thi Prometric, bỏ chế độ chơi cổ điển, chỉ hỗ trợ máy tính.

## 4. File, tính năng, dữ liệu, logic, giao diện, tài liệu hoặc phần demo đã đóng góp

| Nhóm đầu ra | Phần cụ thể | Bằng chứng đóng góp |
|---|---|---|
| Logic | Ba công thức tính điểm, chuỗi phân định 3 bước, bảng O4 và 4 nhãn, claim boundary, luật lớp game | [docs/SOLUTION_STRUCTURE.md](https://github.com/FTU-Legacy-63/G07/blob/main/docs/SOLUTION_STRUCTURE.md) Mục 5, 14, 15 |
| Luồng và phạm vi | User flow 14 bước và 7 tình huống lỗi; feature scope | [docs/user-flow.md](https://github.com/FTU-Legacy-63/G07/blob/main/docs/user-flow.md); [docs/feature-scope.md](https://github.com/FTU-Legacy-63/G07/blob/main/docs/feature-scope.md) |
| Dữ liệu đầu vào | Từ điển biến, 24 giả định, bảng nguồn | [docs/INPUT_DICTIONARY.md](https://github.com/FTU-Legacy-63/G07/blob/main/docs/INPUT_DICTIONARY.md); [docs/ASSUMPTIONS.md](https://github.com/FTU-Legacy-63/G07/blob/main/docs/ASSUMPTIONS.md); [docs/SOURCE_USE_MAP.md](https://github.com/FTU-Legacy-63/G07/blob/main/docs/SOURCE_USE_MAP.md) |
| Minh họa tính tay | File Excel một lượt chơi với mã câu thật, macro VBA | [W4/CFA_Quest_user_flow.xlsm](https://github.com/FTU-Legacy-63/G07/blob/main/W4/CFA_Quest_user_flow.xlsm); [W4/VBA_CFA_Quest.bas](https://github.com/FTU-Legacy-63/G07/blob/main/W4/VBA_CFA_Quest.bas) |
| Engine | Sinh đề, chấm điểm, Credit, đồng hồ và phạt quá giờ, cổng Boss, World Quest, lượt trắng, bảng tổng kết | [src/cfa_quest_engine.js](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_engine.js) (tách khỏi `cfa_quest_v11.js` ngày 21/10/2026, sau tag [`v1.0-core`](https://github.com/FTU-Legacy-63/G07/releases/tag/v1.0-core)) |
| Giao diện | Màn tiến trình, màn câu hỏi, màn kết quả, Shop, bảng tổng kết; gắn hình của Khôi | [src/cfa_quest_v11.html](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_v11.html); [src/cfa_quest_v11.js](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_v11.js) phần 3 và phần 4 (lớp skin); [src/cfa_quest_v11.css](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_v11.css) |
| Tích hợp tutorial | Đưa kịch bản tutorial (nội dung do Khôi và Minh thiết kế) vào game dưới dạng thẻ luật, coach mark, toast | [src/cfa_quest_v11.js](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_v11.js) phần 2; [src/cfa_quest_v11.css](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_v11.css) phần 4 (trước 22/10/2026 là file riêng `cfa_quest_tutorial.js`/`.css`) |
| Lớp game hành động | Di chuyển, quái, chém, Boss bắn laser, 2 tim, lượt trắng, đồng xu; tham số gom trong `GAME_CONFIG` | [src/cfa_quest_v11.js](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_v11.js) phần 1; [src/cfa_quest_v11.css](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_v11.css) phần 5–6 |
| Chế độ demo | 4 kịch bản, nút "Chạy kịch bản", không ghi đè tiến trình | [src/cfa_quest_v11.js](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_v11.js) khối 15; [src/cfa_quest_scenarios.js](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_scenarios.js); [link `?demo=1`](https://ftu-legacy-63.github.io/G07/src/cfa_quest_v11.html?demo=1) |
| Kiểm thử tự động | 20 test chạy bằng `node --test`, pass 20/20: Seed 7, 4 kịch bản demo, phạt quá giờ, thoát giữa vòng, Bùa, thưởng World Quest, lượt trắng | [test/](https://github.com/FTU-Legacy-63/G07/tree/main/test): [engine_seed7](https://github.com/FTU-Legacy-63/G07/blob/main/test/engine_seed7.test.js), [scenarios](https://github.com/FTU-Legacy-63/G07/blob/main/test/scenarios.test.js), [white_run](https://github.com/FTU-Legacy-63/G07/blob/main/test/white_run.test.js) |
| Công cụ | Sinh file kịch bản demo từ tài liệu; xử lý bộ hình thành asset WebP và danh mục ảnh; kiểm tra ngân hàng câu hỏi offline | [tools/build_scenarios.js](https://github.com/FTU-Legacy-63/G07/blob/main/tools/build_scenarios.js); [tools/asset_pipeline/](https://github.com/FTU-Legacy-63/G07/tree/main/tools/asset_pipeline) → [src/asset/assets.js](https://github.com/FTU-Legacy-63/G07/blob/main/src/asset/assets.js); [tools/validate_question_bank.html](https://github.com/FTU-Legacy-63/G07/blob/main/tools/validate_question_bank.html) |
| Điều phối | Bảng phân công có sản phẩm và bằng chứng từng người | [docs/WEEK5_CHECKPOINT.md](https://github.com/FTU-Legacy-63/G07/blob/main/docs/WEEK5_CHECKPOINT.md) Mục 10 |

## 5. Phần đóng góp đó kết nối thế nào với sản phẩm cuối cùng

### (1) Solution structure là nguồn để cả nhóm làm việc

SOLUTION_STRUCTURE.md là file gốc cho mọi phần khác: Hồng viết câu hỏi theo cách gắn nhãn cụm, module, độ khó trong đặc tả; Hồng viết 4 kịch bản demo dựa trên các công thức trong đó; Khôi vẽ hình theo danh sách cảnh và đối tượng của lớp game. Khi luật thay đổi, em sửa ở đặc tả trước, các file khác trỏ về đó.

### (2) Engine biến luật thành kết quả người chơi nhìn thấy

Ba bộ đếm, cách xếp hạng cụm và bảng O4 là phần tạo ra giá trị học tập của game: cuối lượt chơi, người học thấy cụm nào yếu, cụm nào đã cải thiện qua Trap và Boss, kèm giải thích câu sai. Nếu không có engine, các công thức chỉ nằm trên file Excel.

### (3) Lớp game và giao diện giữ người chơi qua 60 câu

Một lượt chơi đầy đủ có 60 câu qua 5 màn. Đánh quái, né đạn và nhặt xu chia lượt chơi thành nhiều điểm tương tác nhỏ, giúp người chơi không thấy đây là một bài trắc nghiệm dài.

### (4) Chế độ demo giúp tiết kiệm thời gian khi trình bày sản phẩm

Với 4 kịch bản cố định, nhóm có thể thuyết trình một cách nhanh chóng: đổi đúng một câu trả lời thì một màn đổi từ qua sang trượt; hai cụm hòa điểm thì chuỗi phân định chọn đúng cụm; bật/tắt vật phẩm thì hai bộ đếm chạy độc lập.

## 6. Điều cá nhân học được

### (1) Làm rõ ý tưởng của mình trước rồi mới code

Ở các bản đầu, cùng một nội dung nằm ở nhiều file và các bản bị lệch nhau. Từ đó em giữ nguyên tắc mỗi nội dung chỉ nằm ở một file, file khác trỏ về. Khi bắt đầu làm lớp game, em liệt kê và chốt toàn bộ đầu việc, tham số và luật Boss trước khi viết dòng code đầu tiên. Nhờ vậy khi code ít phải đập đi làm lại.

### (2) Dùng AI để code nhanh, nhưng mình phải biết code đang làm gì

AI giúp em viết code nhanh hơn rất nhiều, nhưng AI không biết luật game của nhóm. Nên em luôn tự kiểm tra code bằng các trường hợp tính tay trước khi đưa lên repo.

### (3) Thu hẹp phạm vi đúng lúc

Nhóm từng định làm 4 tính năng kiểu giao diện thi Prometric, vật phẩm thứ hai, chế độ chơi cổ điển và bản điện thoại. Em bỏ hết các phần này để dồn thời gian cho phần cốt lõi và lớp game. Em học được rằng một sản phẩm nhỏ chạy ổn và giải thích được có giá trị hơn một sản phẩm nhiều tính năng làm dở.

## 7. Khó khăn đã gặp và cách xử lý

### (1) Câu hỏi bị dùng lại làm bẩn dữ liệu chẩn đoán

Khi người chơi trượt một màn, màn đó được chơi lại với đề mới bốc từ cùng một cụm. Với ngân hàng 22 câu mỗi cụm lúc giữa kì, một vòng Arena 1 đã dùng hết câu, nên lần chơi lại gặp lại câu cũ và kết quả ở Arena 3, Boss bị sai lệch. Em chọn đây là vấn đề lớn nhất trong bài tự kiểm giữa kì. Cách xử lý: mở rộng ngân hàng lên 170 câu rồi 220 câu, và quy định bảng O4 bỏ các câu đã gặp khỏi cột Boss.

### (2) Độ khó ở các màn không có sự phân hoá

Dựa vào nhận xét của thầy em đổi ngưỡng qua màn, tỷ lệ độ khó, thêm đồng hồ, cổng Boss và World Quest. Khó khăn là tăng độ khó mà không làm sai bảng chẩn đoán. Em giữ nhãn ở bảng O4 theo ngưỡng 70% cũ; các ngưỡng cao hơn chỉ dùng để quyết định qua màn.

### (3) Thua do bị Boss tấn công không được ảnh hưởng tới chẩn đoán

Khi thêm Boss bắn laser, người nắm Ethics tốt nhưng phản xạ khi chơi game kém có thể thua Boss. Em xử lý bằng luật lượt trắng: thua vì mất tim không tính vào bộ đếm, mỗi lần mở khóa có 2 lượt trắng. Để Boss không quá khó hoặc quá dễ, em mô phỏng nhiều tổ hợp số tia, tốc độ xoay, tốc độ đạn trước khi chốt tham số.

### (4) Nhiều người cùng sửa code thì ghi đè lên nhau

Ở các tuần đầu, nhiều bản code được gửi qua lại thủ công và dễ lẫn phiên bản. Từ Week 7, em code toàn bộ một mình, các thành viên khác làm phần không đụng vào code (câu hỏi, kịch bản, tài liệu, hình ảnh) và gửi lại để em tích hợp.

## 8. Lời nhắn cho sinh viên khóa sau

### (1) Viết luật ra giấy trước khi mở máy code

Nếu luật chỉ nằm trong đầu, mỗi lần nhờ AI viết code sẽ ra một phiên bản khác nhau. Hãy viết mô tả chi tiết có công thức và ví dụ tính tay, rồi đưa đặc tả đó cho AI. Khi có lỗi, so code với đặc tả là biết sai ở đâu.

### (2) Phần trang trí không được chạm vào phần tính điểm

Thêm hiệu ứng, lớp game hay hình ảnh là tốt, nhưng hãy tách chúng khỏi engine. Với CFA Quest, lớp game hành động có thể gỡ ra mà luật sinh đề và chấm điểm vẫn chạy nguyên vẹn.
