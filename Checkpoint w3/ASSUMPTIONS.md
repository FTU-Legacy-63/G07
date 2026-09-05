# ASSUMPTIONS

**Sản phẩm:** CFA Quest — Ethics diagnostic dungeon  
**Học phần:** NHA408E · Nhóm 7  
**Đối chiếu với:** `INPUT_DICTIONARY.md`, `SOLUTION_STRUCTURE.md`, `SOURCE_USE_MAP.md`, `week-3.md`

---

## 0. Mục đích của file

Week 3 yêu cầu mọi giả định có thể làm thay đổi output phải được ghi rõ, không được ẩn trong code.

File này tách giả định thành 4 nhóm:

- **A — Assumptions về người dùng và hành vi**
- **B — Assumptions về logic chẩn đoán/game**
- **C — Assumptions về dữ liệu/ngân hàng câu hỏi**
- **D — Assumptions về kỹ thuật và prototype**

Mỗi giả định đều ghi:
1. giả định là gì;
2. output nào bị ảnh hưởng;
3. rủi ro nếu giả định sai;
4. cách kiểm chứng hoặc xử lý.

Ba output chuẩn:
- **O1 — Bảng chẩn đoán:** Accuracy theo 5 cụm và 9 module;
- **O2 — Arena kế tiếp:** đề được sinh từ cụm yếu;
- **O3 — Kết quả Arena:** đỗ/trượt, Credit, lời giải.

---

## 1. Assumption register

| ID | Assumption | Ảnh hưởng | Rủi ro nếu sai | Cách kiểm chứng / xử lý | Owner | Status |
|---|---|---|---|---|---|---|
| A1 | Người dùng mục tiêu đã học lý thuyết CFA Level I Ethics và đang ở giai đoạn luyện MCQ, không cần sản phẩm dạy từ đầu | O3, toàn UX | Nếu người dùng chưa có nền tảng, lời giải ngắn và cơ chế Trap có thể không đủ để học | Quan sát/phỏng vấn đúng target user; không mở rộng MVP thành course | Trang, Khôi | Chưa kiểm chứng |
| A2 | Repeated MCQ practice có thể làm giảm willingness to continue practice | Lý do tồn tại của engagement layer | Nếu không đúng, gamification có thể chỉ làm UI phức tạp hơn mà không tăng giá trị | Thực hiện observation/interview thật; đo willingness trước/sau | Trang, Khôi | Chưa kiểm chứng |
| A3 | Weakness Profile theo cụm/module giúp người học quyết định phần nên luyện tiếp | O1, O2 | Nếu người dùng không hiểu hoặc không tin profile, Targeted Arena mất ý nghĩa | Hỏi sau practice: profile có giúp chọn phần luyện tiếp không; kiểm tra khả năng giải thích kết quả | Khôi, Quỳnh | Chưa kiểm chứng |
| B1 | Bảng ánh xạ 9 module → 5 cụm là đủ hợp lý để dùng làm trục chẩn đoán và sinh Trap | O1, O2 | Cụm gộp không hợp lý có thể che lấp weakness ở module nhỏ hơn | Giữ báo cáo 9 module để nhìn chi tiết; ghi rõ đây là mapping nội bộ, chưa phản ánh trọng số đề CFA thật | Quỳnh | Chấp nhận cho MVP |
| B2 | `accuracy[c] = diagnostic_correct[c] / diagnostic_attempted[c]` là chỉ báo đủ dùng để xếp hạng weakness | O1, O2 | Mẫu ít hoặc độ khó không cân bằng có thể làm xếp hạng yếu sai | Arena 1 cân bằng 3 mức khó; theo dõi sample size; dùng tie-break cố định | Minh, Trang | Chấp nhận cho MVP |
| B3 | Câu đã dùng item phải bị loại khỏi mẫu chẩn đoán nhưng vẫn tính vào điểm Arena | O1, O3 | Nếu vẫn đưa vào chẩn đoán, item có thể làm Accuracy tăng giả tạo; nếu loại khỏi Arena score thì item mất giá trị game | Unit test riêng 2 bộ đếm; code cấm dùng biến `correct`/`score` trần | Minh | Đã chốt |
| B4 | Ngưỡng pass `>= 70%`, Credit 2/3/4 và Boss bonus +5 là mức hợp lý cho prototype | O3 | Quá dễ/khó sẽ làm progression và Shop mất cân bằng | Chạy thử nội bộ; điều chỉnh sau playtest; không trình bày như chuẩn CFA Institute | Quỳnh, Minh | Chấp nhận cho MVP |
| B5 | Trap II phải nhắm cụm khác W1 | O2 | Nếu cho lặp W1, một cụm có thể chiếm cả hai Trap và bỏ qua weakness thứ hai | Rule cứng: khi chọn W2, loại W1 khỏi tập ứng viên | Trang | Đã chốt |
| B6 | Tie-break theo (1) độ khó trung bình câu sai cao hơn, (2) thời gian trung bình dài hơn, (3) mã cụm là đủ để luôn chọn được một cụm | O2 | Nếu `time_to_answer` thiếu hoặc sample quá nhỏ, tie-break có thể không phản ánh weakness thật | Missing time bỏ qua tiêu chí thời gian; cuối cùng luôn có mã cụm làm tie-break deterministic | Minh, Trang | Cần code đúng |
| B7 | `time_to_answer` chỉ dùng để phân định, không dùng làm điểm hay giới hạn thời gian | O2 | Nếu người dùng bị gián đoạn, thời gian có thể nhiễu | Chỉ dùng sau khi Accuracy và difficulty đã hòa; không hiển thị như performance score | Minh | Đã chốt |
| C1 | 110 câu tự biên soạn đủ cho một lượt sạch không lặp theo worst-case allocation | O2 | Nếu phân bổ thực tế thiếu ở module/cụm, engine phải lặp câu hoặc phá constraint phủ module | Validation bank trước khi chạy; fallback cho phép lặp và log thiếu câu | Hồng, Trang | Cần kiểm tra tự động |
| C2 | `difficulty` 1–3 do nhóm tự gắn đủ dùng để cân bằng Arena 1 và tie-break | O2 | Nhãn khó chủ quan có thể làm cân bằng giả | Không dùng difficulty như output học tập; playtest và điều chỉnh nhãn sau | Hồng | Chưa kiểm định |
| C3 | Nội dung `stem/options/answer/explanation/distractor_reason/hint` do nhóm tự biên soạn đủ chính xác cho prototype | O3 | Sai nội dung/đáp án sẽ làm feedback học tập sai | Peer review nội bộ theo batch; ghi issue và sửa trước demo | Hồng, Quỳnh | Cần review |
| C4 | `sub_standard` chỉ dùng cho biên soạn/coverage, không cần ở runtime output | Không trực tiếp O1/O2/O3 | Nếu code phụ thuộc vào field này ngoài dự kiến, Input Dictionary và source map sẽ lệch | Không đọc `sub_standard` trong engine runtime; dùng script kiểm tra coverage riêng | Hồng, Trang | Đã chốt |
| C5 | `topic="ETHICS"` và `item_type` không làm thay đổi logic MVP | Không trực tiếp O1/O2/O3 | Nếu UI hoặc engine bắt đầu branch theo hai field này, tài liệu hiện tại sẽ thiếu rule | Giữ contextual; nếu code đọc thì cập nhật Input Dictionary trước | Quỳnh | Đã chốt |
| D1 | Prototype dùng HTML/CSS/JavaScript thuần + JSON tĩnh, không cần backend/API | Toàn flow | Nếu cần sync thiết bị/account thì kiến trúc hiện tại không đủ | Giữ out of scope; lưu tiến trình local browser | Minh, Khôi | Đã chốt |
| D2 | User input trong một phiên được hệ thống ghi đúng: option 0–2, timestamp render/submit, trạng thái item | O1, O2, O3 | Event bị ghi sai sẽ làm chẩn đoán/score sai | Validation tại submit; log event tối thiểu; test edge case | Minh | Cần test |
| D3 | Khi thiếu câu mới trong bank, cho phép dùng lại câu cũ và xáo thứ tự phương án là fallback chấp nhận được | O2 | Repetition có thể làm kết quả bị ảnh hưởng bởi nhớ đáp án | Chỉ dùng khi hết pool; báo người chơi; log để bổ sung bank | Trang, Hồng | Fallback |

---

## 2. Các giả định có rủi ro cao nhất

### B1 — 9 module → 5 cụm
Đây là giả định cấu trúc quan trọng nhất vì **O1 và O2 cùng phụ thuộc vào nó**. Mapping này là đề xuất nội bộ của nhóm, không phải cấu trúc trọng số đề thi thật.

**Quyết định MVP:** giữ mapping hiện tại để engine đơn giản và đủ 5 cụm cho dungeon. Bảng 9 module vẫn phải hiển thị để người học thấy chi tiết hơn.

### C2 — Difficulty 1–3
Difficulty hiện là đánh giá chủ quan của nhóm, chưa qua calibration.

**Quyết định MVP:** chỉ dùng để:
- cân bằng Arena 1;
- tie-break khi Accuracy bằng nhau.

Không được diễn giải difficulty như một measurement khoa học về năng lực người học.

### B4 — 70% và Credit
Ngưỡng pass, Credit và giá item là game design assumption, không phải chuẩn chính thức của CFA Institute.

**Quyết định MVP:** dùng để kiểm thử progression. Nếu playtest cho thấy người chơi bị chặn quá nhiều hoặc Credit dư thừa, nhóm được điều chỉnh nhưng phải cập nhật đồng thời `SOLUTION_STRUCTURE.md`, `INPUT_DICTIONARY.md` và file này.

### A2/A3 — Problem evidence
Hai claim:
1. luyện MCQ lặp lại gây nhàm chán;
2. weakness profile hữu ích cho quyết định luyện tiếp;

**chưa được xem là đã chứng minh** cho tới khi có observation/interview thật.

---

## 3. Assumptions không được biến thành claim

Khi thuyết trình, nhóm không nên nói:

- “70% là ngưỡng CFA chuẩn”;
- “5 cụm phản ánh đúng trọng số Ethics thật”;
- “difficulty đã được kiểm định”;
- “người học CFA chắc chắn thấy MCQ nhàm chán”;
- “Trap đã được chứng minh cải thiện learning”.

Cách nói đúng ở Week 3:

> “Đây là assumption/design choice của prototype; nhóm ghi rõ limitation và sẽ kiểm chứng bằng playtest/observation.”

---

## 4. Trigger phải cập nhật file này

Phải sửa `ASSUMPTIONS.md` nếu có một trong các thay đổi sau:

- đổi mapping 9 module → 5 cụm;
- đổi công thức Accuracy hoặc tie-break;
- đổi rule item-used;
- đổi pass threshold/Credit/item price;
- đổi số câu hoặc phân bổ Arena;
- thêm API/backend/real-time data;
- có kết quả observation/playtest mới làm assumption được xác nhận hoặc bác bỏ.

---

## 5. Owner

| Nhóm assumption | Owner chính |
|---|---|
| Target user / problem evidence | Trang, Khôi |
| Diagnostic logic / tie-break / counters | Minh, Trang |
| Mapping cluster / scope / game economy | Quỳnh, Minh |
| Question-bank quality / difficulty | Hồng |
| Runtime validation / browser implementation | Minh, Khôi |
