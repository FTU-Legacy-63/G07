# Individual Footprint — Nguyễn Vũ Anh Minh

**Họ và tên:** Nguyễn Vũ Anh Minh

**Nhóm:** Nhóm 7 (G07)

**Dự án:** CFA Quest - Ethics

**Học phần:** NHA408E - Technology Applications in Banking and Finance

**Vai trò chính:** Đề xuất ý tưởng ban đầu của game; thiết kế cơ chế Credit và Shop; cùng Khôi thiết kế UI/UX hướng dẫn người chơi (Week 6, 7); xây dựng file testing và bug log (Week 6).

## 1. Vai trò trong dự án

- Trong dự án CFA Quest - Ethics, em đảm nhận bốn phần việc: **đưa ra ý tưởng ban đầu, thiết kế nền kinh tế của game (Credit và Shop), cùng Khôi thiết kế UI/UX hướng dẫn người chơi, và xây dựng bộ kiểm thử cùng bug log cho bản build Week 6.**

- **Phần ý tưởng là điểm xuất phát của cả nhóm**: thay vì làm một bộ đề trắc nghiệm có chấm điểm, em đề xuất một hầm ngục nhiều màn, trong đó dữ liệu sai của người học quyết định các màn sau. Ý tưởng này sau đó được Quỳnh viết thành đặc tả logic trong SOLUTION_STRUCTURE.md.

- **Phần Credit và Shop là cơ chế thưởng, tiêu Credit và vật phẩm hỗ trợ; giao diện Shop và các dòng cảnh báo tại nút vật phẩm do em thiết kế**. Phần UI/UX hướng dẫn do em và Khôi cùng làm ở Week 6 và Week 7: cách luật chơi được đưa đến người chơi đúng lúc (thẻ hướng dẫn, banner, tooltip, hộp xác nhận).

- **Phần testing và bug log ở Week 6 là việc em làm riêng**: dựng khung file test, viết và chạy các test chấm điểm, Credit và khớp số liệu trên engine thật, rồi lập bug log để cả nhóm theo dõi lỗi.

## 2. Dấu ấn cá nhân trong sản phẩm

**(1) Ý tưởng gốc: để dữ liệu sai của người học chọn bài luyện**

Vấn đề em muốn giải quyết: người tự ôn Ethics biết mình sai bao nhiêu câu nhưng không biết sai tập trung ở Standard nào, nên lần luyện sau vẫn làm dàn trải như lần trước. Ý tưởng em đưa ra là một hầm ngục 5 đấu trường, trong đó chỉ Arena 1 có đề cố định; các Arena còn lại được sinh từ chính dữ liệu sai của người chơi. Người học không tự chọn mình luyện gì, dữ liệu sai của họ chọn hộ. Câu này về sau trở thành project statement trong README của nhóm.

**(2) Credit và Shop là cơ chế hỗ trợ, không được làm sai dữ liệu chẩn đoán**

- Credit khởi đầu là 3. Đỗ một Arena được 2, 3 hoặc 4 Credit theo mức 70%, 80%, 90%. Vượt Boss lần đầu được thưởng thêm 5 Credit. Credit dùng để mua Bùa Loại Trừ và (ở các bản sau) để mở cổng Boss.

- Nguyên tắc em giữ khi thiết kế Shop: **vật phẩm giúp người chơi qua màn nhưng không được làm nhiễu bảng chẩn đoán**. Vì vậy câu dùng vật phẩm vẫn tính vào điểm đỗ/trượt, nhưng bị loại khỏi mẫu chẩn đoán cụm. Nguyên tắc này khớp với cách Quỳnh tách ba bộ đếm điểm.

- **Credit còn tạo ra một lựa chọn thật cho người chơi: mua Bùa để dễ qua màn, hoặc giữ Credit để đủ mở Boss.** Khi cổng Boss thu 15 Credit, mỗi lần mua Bùa đều làm người chơi cách xa mốc này hơn.

**(3) UI/UX: mỗi thẻ chỉ dạy một luật, hiện đúng lúc cần**

Luật của game khá nhiều: ba bộ đếm điểm, ngưỡng tăng dần, đồng hồ và phạt quá giờ, cổng Boss, World Quest. Em và Khôi cùng thiết kế lịch giới thiệu luật theo nguyên tắc mỗi thẻ chỉ dạy một luật, tối đa vài câu ngắn; luật nặng thì tách thành thẻ A, thẻ B; mỗi thẻ chỉ hiện một lần. Luật nào cần tra lại thì có nút “Luật chơi” luôn mở được. Trong phần này, em đặc biệt chú ý các luật liên quan đến Credit và vật phẩm, vì đây là chỗ người chơi dễ hiểu nhầm nhất.

**(4) Kiểm thử trên engine thật, và phân biệt rõ test đã chạy với test chưa chạy**

File testing Week 6 không dừng ở ví dụ lý thuyết. Em trích nguyên văn các hàm thuần (passed, creditFor, buildAccuracyByArena, buildPerformanceByArena) từ src/cfa_quest_v11.js (bản Week 6; từ ngày 21/10/2026 các hàm này nằm trong src/cfa_quest_engine.js), chạy độc lập bằng Node và đối chiếu với kết quả tính tay. Test nào cần giao diện thật (T-F02) được để trạng thái Pending và ghi rõ thủ tục chạy, thay vì điền một kết quả chưa có. Bug log cũng giữ nguyên tắc này: một test Pending được ghi là “chưa phải bug”, không bị tính như lỗi đã xác nhận.

## 3. Những việc đã thực sự làm

### 3.1. Ý tưởng và định hướng ban đầu

- Đề xuất ý tưởng gốc: hầm ngục 5 Arena, Arena 1 cố định, các Arena sau sinh từ dữ liệu sai; Trap nhắm cụm yếu, Boss kiểm tra lại.

- Xác định người dùng mục tiêu (thí sinh CFA Level I đã học xong lý thuyết Ethics, đang luyện MCQ) và user task: đi hết 5 Arena và biết cụm nào đã cải thiện, cụm nào chưa.

- Đề xuất ràng buộc “người học không tự chọn bài luyện” để giao diện không có bước chọn nội dung, giữ đúng lý do tồn tại của sản phẩm.

### 3.2. Thiết kế và code Credit, Shop

- Cơ chế Credit: khởi đầu 3; đỗ nhận 2/3/4 Credit theo mức 70/80/90%; +5 khi vượt Boss lần đầu (SOLUTION_STRUCTURE Mục 8).

- Thiết kế hai vật phẩm ở bản đầu: Bùa Loại Trừ (3 Credit, loại 1 phương án sai, từ 3 còn 2) và Cuộn Giấy Gợi Ý (4 Credit, hiện Standard đang áp dụng). Sau scope freeze ngày 20/09, nhóm chỉ giữ Bùa Loại Trừ.

- Luật dùng vật phẩm: Arena 1 và Boss không dùng; mỗi Arena tối đa 1 vật phẩm; mỗi câu tối đa 1.

- Code trong src/cfa_quest_v11.js (bản Week 5–6): khối 1 (creditTiers, ITEMS), hàm creditFor(), renderItemBox và useItem, khối 12 (Shop). Sau khi tách engine ngày 21/10/2026, creditTiers, ITEMS và creditFor() nằm trong src/cfa_quest_engine.js; renderItemBox, useItem và khối 12 (Shop) vẫn ở src/cfa_quest_v11.js.

- Soạn thông báo tại Shop và nút vật phẩm: “Mỗi Arena sử dụng tối đa 1 vật phẩm”, “Arena 1 không dùng vật phẩm”, “Boss không dùng vật phẩm”, “Còn thiếu X Credit”.

### 3.3. Thiết kế Shop và UI/UX hướng dẫn (cùng Khôi, Week 6, 7)

- Thiết kế giao diện Shop: hai vật phẩm, giá bằng Credit, số dư hiện có; ghi rõ hiệu ứng của vật phẩm ngay tại chỗ.

- Viết dòng cảnh báo bắt buộc tại nút vật phẩm: “Câu này vẫn tính điểm đỗ/trượt, nhưng không tính vào chẩn đoán cụm”, vì đây là quy tắc khó tự đoán nhất của sản phẩm.

- Week 6 đến Week 7: cùng Khôi xây dựng bảng lịch giới thiệu luật (tutorial) theo từng thời điểm: mới vào game, trước và sau từng Arena, lần đầu mở Shop, lần đầu quá giờ, sau Arena 4 (đủ hoặc thiếu Credit), vào World Quest, hộp xác nhận trả 15 Credit, trước và sau Boss.

- Cùng chọn hình thức hiện phù hợp với từng luật: thẻ bấm Tiếp có nút Bỏ qua, banner nhỏ, coach mark chỉ vào bảng chẩn đoán, tooltip tại Shop, toast không chặn khi bị phạt quá giờ, modal có sơ đồ nhánh “đủ Credit → Boss / thiếu → World Quest → cộng Credit → xét lại”, hộp xác nhận nhấn mạnh luật mất 15 Credit khi thoát giữa Boss.

- Cùng Khôi cập nhật tutorial sau khi đối chiếu với code: phạt quá giờ làm tròn lên (quá 1–10 giây trừ 1 Credit, 11–20 giây trừ 2 Credit, đúng giây thứ 100 không bị phạt); tiền phạt trừ khi làm xong round chứ không trừ ngay; bảng chẩn đoán luôn tính theo lần làm đầu tiên; Bùa loại 1 trong 3 phương án; thoát giữa Arena 3, Arena 4, Boss và Quest mỗi nơi có hậu quả khác nhau.

- Cùng soạn ghi chú triển khai cho phần tích hợp: lưu cờ tutorial_seen bằng key riêng tách khỏi cfaQuestV12 để Reset không làm hiện lại hướng dẫn; bọc localStorage trong try/catch; gọi tên đầy đủ “cụm yếu nhất (W1)”; demo đồng hồ dùng câu giả.

- Ghi rõ các điểm còn cần xác nhận trong tài liệu tutorial: thẻ “Sau Boss” viết theo luật cập nhật ngày 14/10 mà SOLUTION_STRUCTURE và hàm conclude() chưa có; ba câu chú thích ở thẻ C là đề xuất lấy từ Mục 14 (Claim boundary).

### 3.4. Testing và bug log (Week 6)

- Dựng cấu trúc file test với 9 cột bắt buộc (ID, Case, Input, Expected, Actual, Status, Author, Fix owner, Verifier) và 4 nhóm mã: T-S (chấm điểm và Credit), T-G (sinh đề), T-I (thao tác sai), T-F (khớp số liệu).

- Viết và chạy nhóm T-S: 6 test cho passed() và creditFor(), phủ các biên 70%, 80%, 90% và thưởng vượt Boss lần đầu. Cả 6 test khớp 100% với Expected; Trang tham gia verify các test ngưỡng đỗ/trượt này.

- Viết nhóm T-F: T-F01 kiểm tra câu dùng Bùa bị loại khỏi mẫu chẩn đoán nhưng vẫn tính điểm Arena (kết quả accuracy 9/9, performance 18/20, khớp Expected); T-F02 kiểm tra performance_score tính tay so với số app hiển thị, hiện Pending vì cần chạy trên trình duyệt thật với ảnh chụp.

- Phát hiện giả định sai khi đọc code: CFAQ.setSeed(7) chỉ cố định hàm shuffle(), còn Arena 1 không dùng RNG vì buildArena1() lấy câu theo thứ tự ngân hàng. Em sửa lại kỳ vọng của T-F02 để người test không bối rối khi Arena 1 không đổi sau khi đặt seed.

- Dựng khung T-G và T-I, tái dùng các case T7, T9, T10, T11, T12, T16 từ SAMPLE_INPUT_OUTPUT Mục 9 để nhóm không phải làm lại từ đầu. Các test T-G sau đó do Trang điền và rà.

- Lập bug log (bản v3): quy tắc ghi bug, 3 mức độ Critical/Major/Minor theo checkpoint Week 6, 5 trạng thái, quy tắc chốt bug (người sửa chuyển Đã sửa, người khác chạy lại bước tái hiện rồi mới Đã xác nhận). Ghi dòng bug đầu tiên: README chưa cập nhật trạng thái build (Minor, Mới); và một dòng theo dõi T-F02 đang Pending, đánh dấu rõ “chưa phải bug”.

| **ID** | **Case**                      | **Kết quả**                    |
|--------|-------------------------------|--------------------------------|
| T-S01  | Arena 1 đúng 11/15 (73,3%)    | PASS, +2 Credit, Credit 3 → 5  |
| T-S02  | Arena 1 đúng 10/15 (66,7%)    | FAIL, 0 Credit, Trap I bị khoá |
| T-S03  | Trap I đúng 7/10 (70,0%)      | PASS, +2 Credit, 5 → 7         |
| T-S04  | Trap I đúng 8/10 (80,0%)      | PASS, +3 Credit, 7 → 10        |
| T-S05  | Trap I đúng 9/10 (90,0%)      | PASS, +4 Credit, 10 → 14       |
| T-S06  | Boss đúng 11/15, lần đầu vượt | PASS, +2 và +5 thưởng, 14 → 21 |

### 3.5. Phối hợp với nhóm

- Gửi nội dung Shop, tutorial và kết quả test cho Quỳnh để tích hợp. Từ Week 7 chỉ Quỳnh sửa code, nên em làm việc bằng cách gửi tài liệu, ghi chú triển khai và bug log thay vì sửa trực tiếp.

- Đối chiếu nội dung tutorial và tài liệu với hành vi thật của game, chỉ ra chỗ lệch để nhóm sửa.

- Ghi chú về lịch sử commit: toàn bộ file do nhóm trưởng upload thay cả nhóm nên tên người commit không phải tác giả nội dung. Tác giả từng phần được ghi ở WEEK5_CHECKPOINT Mục 10.

## 4. File, tính năng, dữ liệu, logic, giao diện, tài liệu hoặc phần demo đã đóng góp

| **Nhóm đầu ra**      | **Phần cụ thể**                                                                                                 | **Bằng chứng đóng góp**                                                                                                                           |
|----------------------|-----------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| Ý tưởng gốc          | Hầm ngục 5 Arena sinh từ dữ liệu sai; ràng buộc người học không tự chọn bài luyện                               | README (Project statement); PROJECT PROPOSAL.md                                                                                                   |
| Logic Credit         | Credit khởi đầu 3; đỗ 2/3/4 theo 70/80/90%; +5 khi vượt Boss lần đầu                                            | [docs/SOLUTION_STRUCTURE.md](https://github.com/FTU-Legacy-63/G07/blob/main/docs/SOLUTION_STRUCTURE.md) Mục 8; [src/cfa_quest_engine.js](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_engine.js) khối 1 (`creditTiers`) và `creditFor()` |
| Logic và code Shop   | Bùa Loại Trừ, Cuộn Giấy Gợi Ý (đã gỡ ở scope freeze), luật dùng vật phẩm, ô vật phẩm, màn Shop                  | [docs/SOLUTION_STRUCTURE.md](https://github.com/FTU-Legacy-63/G07/blob/main/docs/SOLUTION_STRUCTURE.md) Mục 8; [src/cfa_quest_engine.js](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_engine.js): `ITEMS`; [src/cfa_quest_v11.js](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_v11.js): `renderItemBox`, `useItem`, khối 12 (Shop) |
| UI/UX Shop           | Số dư, giá, hiệu ứng vật phẩm, cảnh báo “không tính vào chẩn đoán cụm”                                          | docs/WEEK5_CHECKPOINT.md Mục 5.2, 5.3                                                                                                             |
| Tutorial (cùng Khôi) | Lịch giới thiệu luật theo thời điểm, hình thức hiện từng thẻ, ghi chú triển khai, sơ đồ nhánh modal sau Arena 4 | File Tutorial — CFA Quest·Ethics (bản 17/10/2026); [src/cfa_quest_v11.js](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_v11.js) phần 2 và [src/cfa_quest_v11.css](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_v11.css) phần 4 (Quỳnh tích hợp; trước 22/10/2026 là file riêng `cfa_quest_tutorial.js`/`.css`); thư mục Drive của nhóm |
| Testing Week 6       | Cấu trúc 4 nhóm T-S, T-G, T-I, T-F; 6 test T-S Pass; T-F01 Pass; T-F02 Pending; sửa giả định về CFAQ.setSeed    | W6/testing.md                                                                                                                                     |
| Bug log Week 6       | Quy tắc ghi bug, mức độ, trạng thái, quy tắc chốt bug; bug README chưa cập nhật; dòng theo dõi T-F02            | bug-log-v3.md                                                                                                                                     |
| Ownership            | Dòng của Minh trong bảng phân công                                                                              | docs/WEEK5_CHECKPOINT.md Mục 10                                                                                                                   |

## 5. Phần đóng góp đó kết nối thế nào với sản phẩm cuối cùng

**(1) Ý tưởng gốc là khung của cả sản phẩm**

Từ câu “dữ liệu sai của họ chọn hộ”, Quỳnh viết thành ba công thức, chuỗi phân định và bảng tổng kết; Hồng viết câu hỏi gắn nhãn cụm, module, độ khó; Trang xây quy tắc sinh đề; Khôi làm giao diện và hình ảnh; **Khôi và em cùng soạn phần hướng dẫn người chơi**. Mọi tính năng sau này đều được kiểm tra lại bằng câu hỏi: nó có giữ nguyên việc để dữ liệu sai của người học chọn bài luyện hay không.

**(2) Credit và Shop tạo ra lựa chọn cho người chơi**

**Không có Credit, Shop và cổng Boss thì lượt chơi chỉ là chuỗi 5 bài kiểm tra nối nhau**. Credit cho người chơi một thứ để cân nhắc: tiêu vào Bùa để dễ qua màn hay giữ lại để mở Boss. Cơ chế này sau đó được Quỳnh mở rộng thành cổng Boss 15 Credit và World Quest.

**(3) UI/UX và tutorial giúp người chơi tự hiểu luật**

**Game có nhiều luật mà người mới không thể đoán**: câu dùng Bùa không vào chẩn đoán, Δ lấy mốc từ Arena 1 và Arena 3, hai con số 70% mang hai nghĩa khác nhau. Mỗi luật được dạy đúng lúc nó bắt đầu có hiệu lực, thay vì dồn vào một trang hướng dẫn dài ở đầu game. Nút “Luật chơi” và “Xem lại hướng dẫn” giúp nhóm mở lại tutorial khi demo cho giảng viên.

**(4) Testing và bug log cho nhóm bằng chứng rằng các con số của game kiểm tra lại được**

Các công thức Credit, ngưỡng đỗ và performance_score đều được đối chiếu với hàm thật trong engine. Nhờ vậy khi giảng viên hỏi “con số này ở đâu ra”, nhóm có test với Input, Expected và Actual để chỉ ra. Bug log cho cả nhóm một nơi chung theo dõi lỗi, kèm quy tắc rằng lỗi Critical phải được sửa hoặc ghi thành limitation trước khi chốt bản nộp.

## 6. Điều cá nhân học được

**(1) Một cơ chế thưởng phải đi cùng một câu hỏi: nó có làm sai dữ liệu không?**

Ban đầu em nghĩ Credit và vật phẩm chỉ là phần “game hóa”. Khi viết luật dùng vật phẩm em nhận ra mỗi cơ chế thưởng đều chạm vào điểm số. Từ đó em luôn hỏi trước: cơ chế này ảnh hưởng đến bộ đếm nào, và có làm bảng chẩn đoán sai đi không.

**(2) Luật khó hiểu cần được nói đúng chỗ, không nói nhiều, và người chưa biết gì về sản phẩm cũng phải hiểu được**

Khi cùng Khôi soạn tutorial, em thử viết mọi luật vào một thẻ và thấy người đọc sẽ bỏ qua. Chia mỗi thẻ một luật, gắn vào đúng thời điểm, hiệu quả hơn nhiều. Em cũng học được rằng cần gọi tên đầy đủ (“cụm yếu nhất”) thay vì dùng ký hiệu nội bộ (“W1”), vì người chơi mới không biết các ký hiệu này.

**(3) Test phải chạy trên code thật, không phải trên giả định**

Chỉ khi đọc code để viết T-F02, em mới thấy kỳ vọng ban đầu về seed là sai: Arena 1 không dùng RNG nên setSeed không làm nó đổi. Nếu chỉ viết test theo đặc tả mà không đối chiếu code, lỗi hiểu nhầm này sẽ đến tay người test.

**(4) Ghi trung thực trạng thái của từng test**

Một test chạy bằng hàm thuần chưa chứng minh được màn hình hiển thị đúng. Vì vậy em tách “Pass” (đã chạy hàm thật) khỏi “Pending” (cần ảnh chụp từ giao diện thật), và không ghi kết quả cho test chưa chạy.

**(5) Biết gỡ bớt tính năng**

Cuộn Giấy Gợi Ý là vật phẩm em thiết kế nhưng nhóm gỡ ra ở scope freeze. Em học được rằng việc giữ một vật phẩm chạy rõ ràng quan trọng hơn có hai vật phẩm mà luật chồng chéo.

## 7. Khó khăn đã gặp và cách xử lý

**(1) Các con số Credit là do nhóm tự đề xuất**

Mức 2/3/4 Credit theo 70/80/90% và thưởng +5 khi vượt Boss không có nguồn bên ngoài để đối chiếu. WEEK5_CHECKPOINT Mục 11 ghi rõ đây là phần nhóm tự đề xuất, và nếu bỏ đi thì tổng Credit giảm khoảng một phần ba. Cách xử lý: ghi các con số này vào danh sách giả định, không trình bày như chuẩn đã kiểm chứng, và để Quỳnh tinh chỉnh khi thêm cổng Boss và World Quest.

**(2) Vật phẩm cạnh tranh với mục tiêu mở Boss**

Khi cổng Boss cần 15 Credit, mua Bùa làm người chơi xa mốc hơn. Cách xử lý là dùng UI chứ không đổi luật: thẻ B tại Shop nói thẳng điều này, và hộp xác nhận trả 15 Credit nhắc luật thoát giữa Boss.

**(3) T-F02 không chạy được bằng hàm thuần**

Test performance_score cần toàn bộ 60 câu và giao diện thật, nên không thể kiểm bằng Node như các test khác. Cách xử lý: viết thủ tục 6 bước (đặt seed, chơi và ghi từng câu, tính tay từng Arena, đọc số app, chụp ảnh, so sánh), kèm bảng tính tay để trống, và để Status là Pending cho đến khi có ảnh chụp.

**(4) Một người không nên vừa test vừa xác nhận**

Theo quy tắc Week 6, test đang Pass vẫn cần người khác đóng vai Fix owner hoặc Verifier. Em ghi nhắc điều này trong file test và bug log (cột Người sửa, Người xác nhận, quy tắc chốt bug), để không có lỗi nào được đóng khi chỉ một người đã kiểm tra.

**(5) Tutorial phải khớp với code và đặc tả đang thay đổi**

Tutorial viết theo luật cập nhật ngày 14/10, nhưng SOLUTION_STRUCTURE và hàm conclude() chưa có thay đổi này. Cách xử lý: ghi rõ ở mục “Còn cần xác nhận” của tài liệu, để nhóm đối chiếu khi có bản mới thay vì tự sửa luật trong tutorial.

## 8. Lời nhắn cho sinh viên khóa sau

**(1) Chốt ý tưởng bằng một câu trước khi làm**

Nhóm em chốt được ý tưởng bằng câu: “Dữ liệu sai của họ chọn hộ”. Mọi quyết định sau đó, từ việc bỏ menu chọn nội dung đến việc loại câu dùng vật phẩm khỏi chẩn đoán, đều kiểm tra lại bằng câu này.

**(2) Cơ chế thưởng không được phá dữ liệu**

Nếu sản phẩm có điểm, tiền hay vật phẩm, hãy ghi rõ từng thứ ảnh hưởng đến con số nào trước khi làm giao diện.

**(3) Dạy luật đúng lúc, mỗi lần một luật**

Đừng viết một trang hướng dẫn dài. Hãy liệt kê khoảnh khắc người chơi cần từng luật, rồi gắn một thẻ ngắn vào đúng khoảnh khắc đó.

**(4) Viết test sau khi đọc code, và ghi rõ test nào chưa chạy**

Hãy ghi Input đủ để người khác chạy lại (ví dụ Credit trước Arena), trích hàm thật từ engine thay vì tự viết lại công thức, và để test chưa chạy ở trạng thái Pending. Một bug log trung thực hữu ích hơn một bug log trông sạch.
