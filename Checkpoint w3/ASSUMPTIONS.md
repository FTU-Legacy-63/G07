# ASSUMPTIONS

**Sản phẩm:** CFA Quest — Ethics diagnostic dungeon  
**Học phần:** NHA408E · Nhóm 7  
**Đối chiếu với:** `INPUT_DICTIONARY.md`, `SOLUTION_STRUCTURE.md`, `SOURCE_USE_MAP.md`, `SAMPLE_INPUT_OUTPUT.md`  
**Trạng thái:** đã đồng bộ với bản `SOLUTION_STRUCTURE.md` có Mục 5 ba công thức và bảng tổng kết sau Boss

---

## 0. Mục đích của file

Mọi giả định có thể làm thay đổi output phải được ghi rõ, không được ẩn trong code.

File này tách giả định thành 4 nhóm:

- **A — Assumptions về người dùng và hành vi**
- **B — Assumptions về logic chẩn đoán/game**
- **C — Assumptions về dữ liệu/ngân hàng câu hỏi**
- **D — Assumptions về kỹ thuật và prototype**

Mỗi giả định đều ghi: giả định là gì; output nào bị ảnh hưởng; rủi ro nếu giả định sai; cách kiểm chứng hoặc xử lý.

Bốn output chuẩn:
- **O1 — Bảng chẩn đoán:** Accuracy theo 5 cụm và 9 module;
- **O2 — Arena kế tiếp:** đề được sinh từ cụm yếu;
- **O3 — Kết quả Arena:** đỗ/trượt, Credit, lời giải;
- **O4 — Bảng tổng kết sau Boss:** tỷ lệ đúng từng cụm qua 5 Arena, nhãn cải thiện, `performance_score` toàn lượt.

---

## 1. Assumption register

| ID | Assumption | Ảnh hưởng | Rủi ro nếu sai | Cách kiểm chứng / xử lý | Owner | Status |
|---|---|---|---|---|---|---|
| A1 | Người dùng mục tiêu đã học lý thuyết CFA Level I Ethics và đang ở giai đoạn luyện MCQ, không cần sản phẩm dạy từ đầu | O3, toàn UX | Nếu người dùng chưa có nền tảng, lời giải ngắn và cơ chế Trap có thể không đủ để học | Quan sát/phỏng vấn đúng target user; không mở rộng MVP thành course | Trang, Khôi | Chưa kiểm chứng |
| A2 | Repeated MCQ practice có thể làm giảm willingness to continue practice | Lý do tồn tại của engagement layer | Nếu không đúng, gamification có thể chỉ làm UI phức tạp hơn mà không tăng giá trị | Thực hiện observation/interview thật; đo willingness trước/sau | Trang, Khôi | Chưa kiểm chứng |
| A3 | Weakness Profile theo cụm/module giúp người học quyết định phần nên luyện tiếp | O1, O2 | Nếu người dùng không hiểu hoặc không tin profile, Targeted Arena mất ý nghĩa | Hỏi sau practice: profile có giúp chọn phần luyện tiếp không; kiểm tra khả năng giải thích kết quả | Khôi, Quỳnh | Chưa kiểm chứng |
| A4 | Người học đọc được bảng tổng kết O4 và hiểu đúng nhãn "Đã cải thiện" là kết luận **trong phiên**, không phải kết luận về năng lực | O4 | Nhãn bị đọc quá mạnh; người học tin mình đã nắm Standard đó và ngừng luyện | Khôi đặt câu chú thích ngay dưới bảng, không để trong tooltip; hỏi lại người thử nghiệm xem họ hiểu nhãn nghĩa là gì | Khôi, Quỳnh | Chưa kiểm chứng |
| B1 | Bảng ánh xạ 9 module → 5 cụm là đủ hợp lý để dùng làm trục chẩn đoán và sinh Trap | O1, O2 | Cụm gộp không hợp lý có thể che lấp weakness ở module nhỏ hơn | Giữ báo cáo 9 module để nhìn chi tiết; ghi rõ đây là mapping nội bộ, chưa phản ánh trọng số đề CFA thật | Quỳnh | Chấp nhận cho MVP |
| B2 | `accuracy_cumulative[c] = diagnostic_correct[c] ÷ diagnostic_attempted[c]` là chỉ báo đủ dùng để xếp hạng weakness | O1, O2 | Mẫu ít hoặc độ khó không cân bằng có thể làm xếp hạng yếu sai | Arena 1 cân bằng 3 mức khó; theo dõi sample size; dùng tie-break cố định | Minh, Trang | Chấp nhận cho MVP |
| B3 | Câu đã dùng vật phẩm phải bị loại khỏi mẫu chẩn đoán nhưng vẫn tính vào điểm Arena | O1, O3 | Nếu vẫn đưa vào chẩn đoán, vật phẩm có thể làm Accuracy tăng giả tạo; nếu loại khỏi Arena score thì vật phẩm mất giá trị game | Unit test riêng 2 bộ đếm; code cấm dùng biến `correct`/`score`/`accuracy` trần | Minh | Đã chốt |
| B4 | Ngưỡng pass `>= 70%`, Credit 2/3/4 và Boss bonus +5 là mức hợp lý cho prototype | O3 | Quá dễ/khó sẽ làm progression và Shop mất cân bằng | Chạy thử nội bộ; điều chỉnh sau playtest; không trình bày như chuẩn CFA Institute | Quỳnh, Minh | Chấp nhận cho MVP |
| B5 | Trap II phải nhắm cụm khác W1 | O2 | Nếu cho lặp W1, một cụm có thể chiếm cả hai Trap và bỏ qua weakness thứ hai | Rule cứng: khi chọn W2, loại W1 khỏi tập ứng viên | Trang | Đã chốt |
| B6 | Tie-break theo (1) độ khó trung bình câu sai cao hơn, (2) thời gian trung bình dài hơn, (3) mã cụm là đủ để luôn chọn được một cụm | O2 | Nếu `time_to_answer` thiếu hoặc sample quá nhỏ, tie-break có thể không phản ánh weakness thật | Missing time bỏ qua tiêu chí thời gian; cuối cùng luôn có mã cụm làm tie-break deterministic | Minh, Trang | Cần code đúng |
| B7 | `time_to_answer` chỉ dùng để phân định, không dùng làm điểm hay giới hạn thời gian | O2 | Nếu người dùng bị gián đoạn, thời gian có thể nhiễu | Chỉ dùng sau khi Accuracy và difficulty đã hòa; không hiển thị như performance score | Minh | Đã chốt |
| **B8** | **Ngưỡng `Boss ≥ 70%` cộng với `Δ ≥ 0` là điều kiện đủ để dán nhãn "Đã cải thiện" cho một cụm** | O4 | Ngưỡng 70% áp lên slot 7/5/3 câu cho ra độ chặt rất khác nhau: slot 7 câu cần 5/7 (71,4%), slot 5 câu cần 4/5 (80%), **slot 3 câu cần 3/3 (100%)**. Cụm yếu thứ ba bị chấm khắt khe nhất trong khi được hỏi ít nhất | Ghi rõ độ chặt không đều ngay dưới bảng O4, coi là đánh đổi đã biết. Nếu playtest cho thấy slot 3 câu gần như không bao giờ đạt nhãn, đổi sang luật "số câu sai tối đa" (7 câu ≤2 sai · 5 câu ≤1 sai · 3 câu ≤1 sai) và cập nhật đồng thời `SOLUTION_STRUCTURE.md` Mục 5 | Quỳnh, Minh | **Chấp nhận cho MVP, có điều kiện rà lại** |
| **B9** | **Mốc chẩn đoán chỉ gồm Arena 1 + Crossroads, loại Trap ra khỏi baseline** | O4 | Nếu tính cả Trap, hai cụm bị nhắm được cộng thêm 10 câu mà ba cụm kia không có; các dòng trong cùng một bảng bị đem so bằng lượng dữ liệu khác nhau. Rủi ro còn lại: baseline chỉ có 5 câu/cụm (3+2), mỗi câu đáng 20 điểm phần trăm | Luôn hiển thị mẫu số dạng `x/5` trên bảng, không chỉ hiển thị phần trăm. Không dùng baseline để so giữa hai người chơi khác nhau | Quỳnh, Minh | Đã chốt |
| **B10** | **`accuracy_cumulative` bao gồm cả câu ở Trap, và được dùng để xếp hạng `boss_clusters`** | O1, O2, O4 | Trap bơm 10 câu vào đúng cụm vừa được luyện. Nếu Trap có tác dụng, cụm đó bị đẩy lên khỏi nhóm ba cụm yếu nhất và **không được hỏi lại ở Boss** — tức là chính những trường hợp cơ chế chạy tốt lại là những trường hợp không đo được. `SOLUTION_STRUCTURE.md` Mục 5 coi đây là bằng chứng cơ chế hoạt động; nhưng nó cũng làm câu hỏi nghiên cứu của MVP không đo được trên đúng nhóm đó | Ghi rõ đây là chọn lọc có hệ thống, không phải ngẫu nhiên. Khi báo cáo kết quả, chỉ kết luận trên các cụm **thực sự xuất hiện ở Boss**, và nêu số cụm bị rơi khỏi Boss như một con số riêng. Xem thêm mục 2 và mục 6 | Quỳnh | **Đã chốt về cơ chế, chưa chốt về cách báo cáo** |
| **B11** | **`difficulty` 1–3 đủ tin cậy để làm trọng số điểm cho `performance_score` (bảng quy đổi 1/2/3)** | O4 | Nhãn khó là đánh giá chủ quan chưa calibrate. Nếu nhãn lệch, `performance_score` lệch theo — và đây là con số duy nhất nhóm tuyên bố so sánh được giữa hai người chơi | `performance_score` chỉ được trình bày là chỉ số **nội bộ sản phẩm**, không phải thang năng lực. Arena 1 có trần cố định 30 điểm nên dùng làm điểm kiểm tra: nếu `points_offered` của Arena 1 khác 30, lỗi nằm ở khâu sinh đề. Calibrate lại nhãn sau playtest | Hồng, Minh | Chấp nhận cho MVP |
| **B12** | **Khi người chơi trượt và chơi lại, mốc chẩn đoán và `performance_score` ghi theo lượt làm đầu tiên; điểm số và Credit ghi theo lượt đỗ** | O3, O4 | Nếu ghi ngược, người trượt hai lần rồi làm lại bộ câu đã biết đáp án sẽ có chỉ số cao hơn người qua ngay lần đầu. Rủi ro còn lại: người chơi có thể thấy vô lý khi bảng tổng kết hiện con số thấp hơn điểm mình vừa đạt | Bảng tổng kết thêm một dòng chú thích khi lượt chơi có ít nhất một lần trượt. Lưu `attempt_index` để truy vết | Minh, Khôi | Đã chốt |
| C1 | 110 câu tự biên soạn đủ cho một lượt sạch không lặp theo worst-case allocation | O2 | Nếu phân bổ thực tế thiếu ở module/cụm, engine phải lặp câu hoặc phá constraint phủ module | Validation bank trước khi chạy; `validate.html` kiểm tra worst case 22 câu của cụm W1; fallback cho phép lặp và log thiếu câu | Hồng, Trang | Cần kiểm tra tự động |
| **C2** | **`difficulty` 1–3 do nhóm tự gắn đủ dùng cho ba việc: cân bằng Arena 1, tie-break, và làm trọng số điểm ở `performance_score`** | O2, **O4** | Nhãn khó chủ quan có thể làm cân bằng giả **và làm lệch con số hiển thị công khai**. Đây là thay đổi so với bản Week 3, khi difficulty còn là nhãn nội bộ | Ranh giới: difficulty **không** được dùng làm output học tập — không có màn hình nào nói "bạn yếu ở câu khó". Nó chỉ vào một chỗ hiển thị duy nhất là `performance_score`, và chỗ đó có ghi giới hạn kèm theo (xem B11). Playtest và điều chỉnh nhãn sau | Hồng, Quỳnh | **Đã sửa phạm vi, chưa kiểm định** |
| C3 | Nội dung `stem/options/answer/explanation/distractor_reason/hint` do nhóm tự biên soạn đủ chính xác cho prototype | O3 | Sai nội dung/đáp án sẽ làm feedback học tập sai | Peer review nội bộ theo batch; ghi issue và sửa trước demo | Hồng, Quỳnh | Cần review |
| C4 | `sub_standard` chỉ dùng cho biên soạn/coverage, không cần ở runtime output | Không trực tiếp O1–O4 | Nếu code phụ thuộc vào field này ngoài dự kiến, Input Dictionary và source map sẽ lệch | Không đọc `sub_standard` trong engine runtime; dùng script kiểm tra coverage riêng | Hồng, Trang | Đã chốt |
| C5 | `topic="ETHICS"` và `item_type` không làm thay đổi logic MVP | Không trực tiếp O1–O4 | Nếu UI hoặc engine bắt đầu branch theo hai field này, tài liệu hiện tại sẽ thiếu rule | Giữ contextual; nếu code đọc thì cập nhật Input Dictionary trước | Quỳnh | Đã chốt |
| D1 | Prototype dùng HTML/CSS/JavaScript thuần + dữ liệu tĩnh nhúng trong `.js`, không cần backend/API | Toàn flow | Nếu cần sync thiết bị/account thì kiến trúc hiện tại không đủ | Giữ out of scope; lưu tiến trình local browser. Nhúng dữ liệu vào `.js` thay vì fetch JSON để sản phẩm chạy được khi mở trực tiếp bằng trình duyệt, không cần server | Minh, Khôi | Đã chốt |
| D2 | User input trong một phiên được hệ thống ghi đúng: option 0–2, timestamp render/submit, trạng thái vật phẩm | O1–O4 | Event bị ghi sai sẽ làm chẩn đoán/score sai | Validation tại submit; log event tối thiểu; test edge case | Minh | Cần test |
| D3 | Khi thiếu câu mới trong bank, cho phép dùng lại câu cũ và xáo thứ tự phương án là fallback chấp nhận được | O2 | Repetition có thể làm kết quả bị ảnh hưởng bởi nhớ đáp án | Chỉ dùng khi hết pool; báo người chơi; log để bổ sung bank | Trang, Hồng | Fallback |
| **D4** | **Bốn ràng buộc vật phẩm (Arena 1 không dùng · Boss không dùng · mỗi Arena tối đa 1 · mỗi câu tối đa 1) được engine cưỡng chế, không phụ thuộc kỷ luật người chơi** | O1, O4 | Nếu một ràng buộc lọt lưới, mẫu chẩn đoán của một cụm có thể bị rỗng, hoặc `points_offered` của Arena 1 khác 30 và điểm kiểm tra tự động mất tác dụng | Validation ở tầng ghi record, không chỉ ở tầng UI. Test case riêng cho từng ràng buộc | Minh, Khôi | Cần test |

---

## 2. Các giả định có rủi ro cao nhất

### B10 — Trap nằm trong mẫu xếp hạng Boss
Đây hiện là giả định rủi ro nhất, cao hơn cả B1, vì nó đụng thẳng vào **câu hỏi mà MVP phải trả lời**.

Cơ chế: `accuracy_cumulative` gồm cả câu Trap. Trap I bơm 10 câu vào W1, Trap II bơm 10 câu vào W2. Nếu người học làm tốt hai Trap đó, hai cụm này được đẩy lên và có thể rơi khỏi nhóm ba cụm yếu nhất — nghĩa là **không được hỏi lại ở Boss**.

Hệ quả: câu hỏi *"với một cụm đã bị Trap nhắm, tỷ lệ đúng ở Boss có cao hơn mốc chẩn đoán không?"* chỉ đo được trên những cụm mà Trap **chưa** kéo lên đủ. Đây là chọn lọc có hệ thống, nghiêng về phía làm kết quả trông tệ hơn thực tế.

**Quyết định MVP:** giữ cơ chế, không loại Trap khỏi mẫu xếp hạng — vì việc W1 rơi khỏi Boss tự nó đã là một tín hiệu có ý nghĩa. Nhưng khi báo cáo, nhóm phải nói cả hai vế:
1. trên các cụm bị Trap nhắm **và** có mặt ở Boss, Δ bằng bao nhiêu;
2. có bao nhiêu cụm bị Trap nhắm nhưng **không** vào Boss.

Không được chỉ báo cáo vế (1).

### B8 — Ngưỡng 70% trên slot 7/5/3
Cùng một nhãn "Đã cải thiện" nhưng độ chặt không đều:

| Slot Boss | Cần đúng tối thiểu | Tỷ lệ thực tế |
|---|---|---|
| 7 câu | 5/7 | 71,4% |
| 5 câu | 4/5 | 80,0% |
| 3 câu | 3/3 | 100% |

**Quyết định MVP:** giữ ngưỡng 70%, ghi công khai độ chặt không đều dưới bảng O4. Không dùng nhãn của slot 3 câu để so ngang với nhãn của slot 7 câu.

### B1 — 9 module → 5 cụm
Giả định cấu trúc quan trọng nhất vì **O1, O2 và O4 cùng phụ thuộc vào nó**. Mapping này là đề xuất nội bộ của nhóm, không phải cấu trúc trọng số đề thi thật.

**Quyết định MVP:** giữ mapping hiện tại. Bảng 9 module vẫn phải hiển thị để người học thấy chi tiết hơn.

### C2 / B11 — Difficulty làm trọng số điểm
Difficulty là đánh giá chủ quan, chưa calibrate, nhưng từ bản `SOLUTION_STRUCTURE.md` hiện hành nó đã thành trọng số của một con số hiển thị công khai.

**Quyết định MVP:** cho phép, với ba ranh giới cứng:
- `performance_score` **không** tham gia chuỗi `Diagnose → Rank → Filter → Generate`;
- không có màn hình nào diễn giải difficulty như kết luận học tập;
- mọi chỗ trình bày `performance_score` phải đi kèm một dòng nói đây là chỉ số nội bộ sản phẩm.

### B4 — 70% và Credit
Ngưỡng pass, Credit và giá vật phẩm là game design assumption, không phải chuẩn chính thức của CFA Institute.

**Quyết định MVP:** dùng để kiểm thử progression. Nếu playtest cho thấy người chơi bị chặn quá nhiều hoặc Credit dư thừa, nhóm được điều chỉnh nhưng phải cập nhật đồng thời `SOLUTION_STRUCTURE.md`, `INPUT_DICTIONARY.md` và file này.

### A2/A3 — Problem evidence
Hai claim — (1) luyện MCQ lặp lại gây nhàm chán; (2) weakness profile hữu ích cho quyết định luyện tiếp — **chưa được xem là đã chứng minh** cho tới khi có observation/interview thật.

---

## 3. Assumptions không được biến thành claim

Khi thuyết trình, nhóm không được nói:

- "70% là ngưỡng CFA chuẩn";
- "5 cụm phản ánh đúng trọng số Ethics thật";
- "difficulty đã được kiểm định";
- "người học CFA chắc chắn thấy MCQ nhàm chán";
- "Trap đã được chứng minh cải thiện learning";
- **"Sản phẩm chẩn đoán được năng lực Ethics của người học"** — sản phẩm chỉ xác định cụm có tỷ lệ đúng thấp nhất **trong phiên chơi này**;
- **"Nhãn *Đã cải thiện* nghĩa là người học đã nắm được Standard đó"** — nhãn chỉ nói tỷ lệ đúng của cụm đó ở Boss tăng so với mốc chẩn đoán và đạt ≥70% trên 3–7 câu;
- **"`performance_score` cho biết người chơi mạnh hơn người khác"** — nó so được giữa hai người chơi trong cùng sản phẩm này, không phải thang đo năng lực chuẩn hoá và không dự báo kết quả thi thật;
- **"Δ dương chứng minh Trap có tác dụng"** — mỗi cụm chỉ có 3–7 câu ở Boss và 5 câu ở mốc chẩn đoán; đây là quan sát trong một phiên, không phải kết quả kiểm định.

Cách nói đúng:

> "Đây là assumption/design choice của prototype; nhóm ghi rõ limitation và sẽ kiểm chứng bằng playtest/observation."

---

## 4. Trigger phải cập nhật file này

Phải sửa `ASSUMPTIONS.md` nếu có một trong các thay đổi sau:

- đổi mapping 9 module → 5 cụm;
- đổi công thức (1) `accuracy_cumulative`, (2) `arena_score_correct` hoặc (3) `performance_score`, hoặc đổi tie-break;
- đổi rule item-used, hoặc đổi bất kỳ ràng buộc nào trong bốn ràng buộc vật phẩm;
- đổi pass threshold/Credit/giá vật phẩm;
- đổi số câu hoặc phân bổ Arena, kể cả tỷ lệ 7/5/3 của Boss;
- **đổi định nghĩa mốc chẩn đoán, ngưỡng 70% của O4, hoặc bốn nhãn `improvement_label`;**
- **đổi bảng quy đổi `DIFFICULTY_POINTS`;**
- **đổi quy tắc ghi theo lượt đầu / lượt đỗ;**
- thêm API/backend/real-time data;
- có kết quả observation/playtest mới làm assumption được xác nhận hoặc bác bỏ.

---

## 5. Owner

| Nhóm assumption | Owner chính |
|---|---|
| Target user / problem evidence | Trang, Khôi |
| Diagnostic logic / tie-break / counters | Minh, Trang |
| Mapping cluster / scope / game economy | Quỳnh, Minh |
| Bảng tổng kết O4, nhãn cải thiện, claim boundary | Quỳnh |
| Question-bank quality / difficulty | Hồng |
| Runtime validation / browser implementation | Minh, Khôi |

---

## 6. Open items — phải chốt trước khi khoá phạm vi

| # | Vấn đề | Vì sao chưa chốt được | Người quyết | Hạn |
|---|---|---|---|---|
| 1 | Cách báo cáo hệ quả của B10: nêu riêng số cụm bị Trap nhắm nhưng không vào Boss | Chưa chạy engine nên chưa biết tần suất xảy ra | Quỳnh | Trước Week 6 |
| 2 | Có đổi B8 sang luật "số câu sai tối đa" hay không | Phải playtest mới biết slot 3 câu có đạt nhãn được không | Quỳnh, Minh | Sau bản engine đầu tiên |
| 3 | Phạm vi câu hỏi nghiên cứu cuối `SOLUTION_STRUCTURE.md`: giới hạn ở so sánh **trong cùng một cụm** giữa mốc chẩn đoán và Boss, không so giữa các cụm và không so giữa người chơi | Câu hỏi hiện tại rộng hơn mức dữ liệu 3–7 câu/cụm có thể đỡ | Quỳnh | Trước Week 4 nộp |
| 4 | `item_type` giữ hay xoá khỏi JSON | Chờ Hồng rà lại nhãn | Hồng | Trước batch câu hỏi tiếp theo |
