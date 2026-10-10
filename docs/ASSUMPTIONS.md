# ASSUMPTIONS

**Sản phẩm:** CFA Quest — Ethics diagnostic dungeon  
**Học phần:** NHA408E · Nhóm 7  
**Đối chiếu với:** `INPUT_DICTIONARY.md`, `SOLUTION_STRUCTURE.md`, `SOURCE_USE_MAP.md`, `SAMPLE_INPUT_OUTPUT.md`  
**Trạng thái:** cập nhật theo thiết kế Week 7 — progressive difficulty, timer/penalty, Boss Gate và World Quest

---

## 0. Mục đích của file

Mọi giả định có thể làm thay đổi output phải được ghi rõ, không được ẩn trong code.

File này tách giả định thành 4 nhóm:

- **A — Assumptions về người dùng và hành vi**
- **B — Assumptions về logic chẩn đoán/game**
- **C — Assumptions về dữ liệu/ngân hàng câu hỏi**
- **D — Assumptions về kỹ thuật và prototype**

Mỗi giả định đều ghi:

- giả định là gì;
- output nào bị ảnh hưởng;
- rủi ro nếu giả định sai;
- cách kiểm chứng hoặc xử lý.

Bốn output chuẩn:

- **O1 — Bảng chẩn đoán:** Accuracy theo 5 cụm và 9 module.
- **O2 — Arena kế tiếp:** đề được sinh từ cụm yếu và theo difficulty quota của round.
- **O3 — Kết quả Arena / progression:** đỗ/trượt, Credit, timer penalty, Boss Gate, World Quest và lời giải.
- **O4 — Bảng tổng kết sau Boss:** tỷ lệ đúng từng cụm qua 5 Arena, nhãn cải thiện, `performance_score` toàn lượt.

> World Quest là dữ liệu progression, **không phải dữ liệu chẩn đoán**.  
> Kết quả Quest không được cộng vào O1 và không được đưa vào O4.

---

## 1. Assumption register

| ID | Assumption | Ảnh hưởng | Rủi ro nếu sai | Cách kiểm chứng / xử lý | Owner | Status |
|---|---|---|---|---|---|---|
| A1 | Người dùng mục tiêu đã học lý thuyết CFA Level I Ethics và đang ở giai đoạn luyện MCQ, không cần sản phẩm dạy từ đầu | O3, toàn UX | Nếu người dùng chưa có nền tảng, lời giải ngắn và cơ chế Trap có thể không đủ để học | Quan sát/phỏng vấn đúng target user; không mở rộng MVP thành course | Trang, Khôi | Chưa kiểm chứng |
| A2 | Repeated MCQ practice có thể làm giảm willingness to continue practice | Lý do tồn tại của engagement layer | Nếu không đúng, gamification có thể chỉ làm UI phức tạp hơn mà không tăng giá trị | Thực hiện observation/interview thật; đo willingness trước/sau | Trang, Khôi | Chưa kiểm chứng |
| A3 | Weakness Profile theo cụm/module giúp người học quyết định phần nên luyện tiếp | O1, O2 | Nếu người dùng không hiểu hoặc không tin profile, Targeted Arena mất ý nghĩa | Hỏi sau practice: profile có giúp chọn phần luyện tiếp không; kiểm tra khả năng giải thích kết quả | Khôi, Quỳnh | Chưa kiểm chứng |
| A4 | Người học đọc được bảng tổng kết O4 và hiểu đúng nhãn "Đã cải thiện" là kết luận **trong phiên**, không phải kết luận về năng lực | O4 | Nhãn bị đọc quá mạnh; người học tin mình đã nắm Standard đó và ngừng luyện | Đặt câu chú thích ngay dưới bảng; hỏi lại người thử nghiệm xem họ hiểu nhãn nghĩa là gì | Khôi, Quỳnh | Chưa kiểm chứng |
| B1 | Bảng ánh xạ 9 module → 5 cụm là đủ hợp lý để dùng làm trục chẩn đoán và sinh Trap | O1, O2 | Cụm gộp không hợp lý có thể che lấp weakness ở module nhỏ hơn | Giữ báo cáo 9 module để nhìn chi tiết; ghi rõ đây là mapping nội bộ | Quỳnh | Chấp nhận cho MVP |
| B2 | `accuracy_cumulative[c] = diagnostic_correct[c] ÷ diagnostic_attempted[c]` là chỉ báo đủ dùng để xếp hạng weakness | O1, O2 | Mẫu ít hoặc difficulty không cân bằng có thể làm xếp hạng yếu sai | Arena 1 cân bằng 3 mức khó; theo dõi sample size; dùng tie-break cố định | Minh, Trang | Chấp nhận cho MVP |
| B3 | Câu đã dùng vật phẩm phải bị loại khỏi mẫu chẩn đoán nhưng vẫn tính vào điểm Arena | O1, O3 | Nếu vẫn đưa vào chẩn đoán, vật phẩm có thể làm Accuracy tăng giả tạo; nếu loại khỏi Arena score thì vật phẩm mất giá trị game | Unit test riêng hai bộ đếm | Minh | Đã chốt |
| **B4** | **Các ngưỡng đỗ 70/75/75/85/90%, Credit 2/3/4, Boss bonus +5, giới hạn thời gian 100/80/60 giây, penalty theo block 10 giây, giá mở Boss 15 Credit và reward World Quest 0/2/3/4 đều là game-design assumptions của prototype** | O3 | Các con số có thể quá dễ, quá khó hoặc làm economy mất cân bằng | Mô phỏng + playtest; điều chỉnh đồng thời ở `SOLUTION_STRUCTURE.md`, `INPUT_DICTIONARY.md`, `user-flow.md`, `feature-scope.md` và file này; không trình bày như chuẩn CFA | Quỳnh, Minh | **Chấp nhận cho MVP, chưa kiểm chứng bằng người chơi thật** |
| B5 | Trap II phải nhắm cụm khác W1 | O2 | Nếu cho lặp W1, một cụm có thể chiếm cả hai Trap và bỏ qua weakness thứ hai | Rule cứng: khi chọn W2, loại W1 khỏi tập ứng viên | Trang | Đã chốt |
| B6 | Chuỗi tie-break hiện có đủ để luôn chọn được một cụm khi Accuracy bằng nhau | O2 | Nếu time/difficulty bị nhiễu hoặc sample nhỏ, tie-break có thể không phản ánh weakness thật | Chỉ dùng tie-break sau Accuracy; cuối cùng dùng mã cụm để deterministic | Minh, Trang | Cần code đúng |
| **B7** | **Thời gian trả lời có thể dùng đồng thời cho hai mục đích khác nhau: tie-break trong chẩn đoán và penalty progression ở Arena 3, Arena 4, Boss** | O2, O3 | Browser timer có thể bị nhiễu khi đổi tab, máy chậm hoặc mất focus; người chơi bị phạt dù thời gian không phản ánh thời gian suy nghĩ thật | Ghi rõ đây là limitation; không auto-submit; penalty chỉ dựa trên rule đã công bố; playtest trước khi coi các mốc 100/80/60 là hợp lý | Minh | **Cập nhật Week 7** |
| **B8** | **Ngưỡng 70% cộng với `Δ ≥ 0` vẫn là điều kiện để dán nhãn "Đã cải thiện" cho một cụm trong O4** | O4 | Ngưỡng 70% áp lên slot 7/5/3 câu cho độ chặt khác nhau: 5/7, 4/5, 3/3 | Giữ như logic cũ; ghi rõ độ chặt không đều dưới bảng O4; không lấy Boss pass 90% để thay mốc O4 này | Quỳnh, Minh | **Giữ nguyên** |
| B9 | Mốc chẩn đoán chỉ gồm Arena 1 + Crossroads, loại Trap ra khỏi baseline | O4 | Baseline chỉ có 5 câu/cụm; mỗi câu thay đổi tỷ lệ mạnh | Luôn hiển thị mẫu số; không dùng baseline để so giữa người chơi | Quỳnh, Minh | Đã chốt |
| B10 | `accuracy_cumulative` bao gồm cả câu ở Trap và được dùng để xếp hạng `boss_clusters` | O1, O2, O4 | Trap có thể đẩy chính cụm vừa luyện ra khỏi top 3 yếu nhất, làm Boss không đo lại cụm đó | Khi báo cáo, chỉ kết luận trên cụm thực sự xuất hiện ở Boss và nêu riêng cụm bị rơi khỏi Boss | Quỳnh | Đã chốt về cơ chế |
| B11 | `difficulty` 1–3 đủ tin cậy để làm trọng số cho `performance_score` | O4 | Nhãn difficulty chủ quan, chưa calibrate | Chỉ gọi đây là chỉ số nội bộ sản phẩm; calibrate sau playtest | Hồng, Minh | Chấp nhận cho MVP |
| B12 | Khi người chơi trượt và chơi lại, mốc chẩn đoán và `performance_score` ghi theo lượt làm đầu tiên; điểm và Credit ghi theo lượt đỗ | O3, O4 | Nếu ghi ngược, replay có thể làm chỉ số tốt giả tạo | Lưu `attempt_index`; chú thích ở bảng tổng kết khi có retry | Minh, Khôi | Đã chốt |
| **B13** | **Difficulty quota theo round — Arena 2 = 4/4/2, Arena 3 = 2/5/3, Arena 4 = 2/4/4, Boss = 2/4/9 — là mức tăng độ khó hợp lý cho prototype** | O2, O3 | Tỷ lệ câu khó có thể tăng quá nhanh; Boss có 9 câu khó có thể quá khó với người mới | Playtest clear-rate theo round; nếu thay quota phải cập nhật generation, test và tài liệu cùng lúc | Quỳnh, Hồng, Minh | **Chưa kiểm chứng bằng người chơi thật** |
| **B14** | **Boss Gate giá 15 Credit tạo được mức "phải cày tới một mức nhất định" mà không chặn người chơi giỏi** | O3 | 15 có thể quá thấp khiến Quest vô nghĩa hoặc quá cao khiến người yếu phải grind quá lâu | Dùng mô phỏng hiện tại làm baseline; theo dõi số lượt Quest cần chơi trong playtest | Quỳnh, Minh | **Chấp nhận theo mô phỏng tay** |
| **B15** | **World Quest là cách hợp lý để người thiếu Credit tiếp tục progression mà không làm bẩn chẩn đoán** | O2, O3 | Quest lặp câu cũ nên dễ dần; người chơi có thể farm Credit bằng nhớ đáp án | Không đưa Quest vào diagnostic/O4; theo dõi số lượt Quest; giữ reward thấp hơn mức khiến farm quá nhanh | Quỳnh, Minh | **Chấp nhận cho MVP** |
| **B16** | **Câu đã xuất hiện ở World Quest phải bị loại khỏi Boss để tránh Boss kiểm tra lại đúng câu vừa được luyện** | O2 | Nếu Quest chơi nhiều lần, pool câu dành cho Boss có thể cạn nhanh hơn | Quest ưu tiên câu cũ trước; Boss dùng fallback/log khi pool thiếu | Trang, Hồng, Minh | **Đã chốt Week 7** |
| C1 | Ngân hàng câu hỏi hiện có đủ để phục vụ một lượt chính và các allocation của Arena | O2 | Nếu một cụm/mức difficulty thiếu câu, engine phải reuse hoặc hạ difficulty | Validation bank trước khi chạy; fallback và `bankLog` | Hồng, Trang | Cần kiểm tra tự động |
| **C2** | **`difficulty` 1–3 do nhóm tự gắn đủ dùng cho bốn việc: cân bằng Arena 1, difficulty quota theo round, tie-break và trọng số `performance_score`** | O2, O4 | Nhãn difficulty chủ quan có thể làm cả generation và performance score lệch | Không diễn giải difficulty như kết luận học tập; calibrate sau playtest | Hồng, Quỳnh | **Đã mở rộng vai trò ở Week 7, chưa kiểm định** |
| C3 | Nội dung `stem/options/answer/explanation/distractor_reason/hint` do nhóm tự biên soạn đủ chính xác cho prototype | O3 | Sai nội dung/đáp án làm feedback học tập sai | Peer review nội bộ theo batch | Hồng, Quỳnh | Cần review |
| C4 | `sub_standard` chỉ dùng cho biên soạn/coverage, không cần ở runtime output | Không trực tiếp O1–O4 | Nếu code phụ thuộc field này ngoài dự kiến, Input Dictionary và source map sẽ lệch | Không đọc `sub_standard` trong engine runtime | Hồng, Trang | Đã chốt |
| C5 | `topic="ETHICS"` và `item_type` không làm thay đổi logic MVP | Không trực tiếp O1–O4 | Nếu UI/engine branch theo hai field này, tài liệu hiện tại sẽ thiếu rule | Giữ contextual; nếu code đọc thì cập nhật Input Dictionary trước | Quỳnh | Đã chốt |
| **C6** | **Mỗi cụm hiện chỉ có khoảng 9–10 câu khó, nên việc giữ quota hard ở các round sau vẫn có nguy cơ cạn pool khi replay** | O2 | Người chơi trượt Arena 4 nhiều lần có thể làm W2 hết câu khó trước Boss | Cho phép reuse cùng difficulty; nếu vẫn thiếu thì hạ về medium; ghi `bankLog`; bổ sung bank sau | Hồng, Trang | **Limitation đã biết** |
| D1 | Prototype dùng HTML/CSS/JavaScript thuần + dữ liệu tĩnh, không cần backend/API | Toàn flow | Nếu cần sync thiết bị/account thì kiến trúc hiện tại không đủ | Giữ ngoài scope; lưu tiến trình local browser | Minh, Khôi | Đã chốt |
| D2 | User input trong một phiên được hệ thống ghi đúng: option, timestamp render/submit, trạng thái vật phẩm | O1–O4 | Event ghi sai sẽ làm diagnosis/score/penalty sai | Validation tại submit; log event tối thiểu; test edge case | Minh | Cần test |
| **D3** | **Khi thiếu câu mới đúng mức difficulty, cho phép dùng lại câu cùng mức đã gặp; nếu vẫn thiếu thì hạ về medium** | O2 | Repetition có thể làm kết quả bị ảnh hưởng bởi nhớ đáp án; hạ difficulty làm round không còn đúng quota ban đầu | Chỉ dùng khi pool thiếu; ghi `bankLog`; bổ sung bank dựa trên log | Trang, Hồng | **Fallback Week 7** |
| **D4** | **Ràng buộc vật phẩm được engine cưỡng chế: Arena 1 không dùng; Arena 2–4 tối đa 1 Bùa/round; Boss tối đa 1 Bùa; World Quest không dùng; mỗi câu tối đa 1 vật phẩm** | O1, O3, O4 | Nếu lọt rule, chẩn đoán hoặc progression có thể sai; đặc biệt Boss/Quest sẽ chạy khác thiết kế | Validation ở tầng ghi record, không chỉ UI; test riêng từng round | Minh, Khôi | **Cập nhật Week 7** |
| **D5** | **Timer trình duyệt đủ dùng cho prototype để đo `timeMs` và tính overtime** | O3 | Chuyển tab, máy chậm hoặc scheduler của browser có thể làm thời gian ghi được lệch | Ghi limitation; không coi timer là đo năng lực chuẩn hoá; playtest trên nhiều máy | Minh, Khôi | **Chưa kiểm chứng** |
| **D6** | **State Boss có thể phân biệt rõ "trượt Boss" và "thoát giữa Boss"** | O3 | Nếu hai trạng thái bị gộp, engine có thể trừ 15 Credit sai hoặc cho retry miễn phí sai luật | State riêng cho `boss_unlocked`, phí đã trả và quit/fail; test hai nhánh riêng | Minh | **Cần test** |
| **D7** | **World Quest được lưu riêng khỏi dữ liệu Arena chẩn đoán và có danh sách câu đã dùng để Boss loại** | O1, O2, O3, O4 | Nếu state bị trộn, Quest làm tăng Accuracy giả hoặc Boss lặp đúng câu Quest | Tách `quest_history` / `quest_used_question_ids`; unit test bảo đảm Quest không chạm counter diagnosis | Minh, Trang | **Cần test** |

---

## 2. Các giả định có rủi ro cao nhất

### B13 — Progressive difficulty và Boss 90%

Week 7 cố ý làm round sau khó hơn round trước:

- Arena 2: `4 easy / 4 medium / 2 hard`
- Arena 3: `2 / 5 / 3`
- Arena 4: `2 / 4 / 4`
- Boss: `2 / 4 / 9`

Boss đồng thời yêu cầu **14/15 câu đúng = 90%**.

Đây là assumption có rủi ro cao vì tỷ lệ 9 câu hard + ngưỡng 90% có thể quá khó với người mới học.

**Quyết định MVP:** giữ thiết kế để đáp ứng mục tiêu difficulty tăng dần, nhưng không được tuyên bố đây là mức difficulty đã được kiểm chứng. Cần đo clear-rate thật trong playtest.

---

### B14 — Boss Gate 15 Credit

Giá 15 Credit được chọn từ mô phỏng tay:

```text
3 Credit khởi đầu
+2 Arena 1
+3 Arena 2
+3 Arena 3
+4 Arena 4
= 15 Credit
```

Một người đỗ cả bốn round ngay lần đầu, ở mức vừa đủ, không mua Bùa và không bị phạt giờ có vừa đủ 15 Credit để mở Boss.

Người dùng Bùa, bị penalty hoặc trượt nhiều lần có thể thiếu Credit và phải đi World Quest.

**Quyết định MVP:** giữ 15 Credit vì nó tạo khoảng cách progression đúng mục tiêu thiết kế. Chưa có dữ liệu người chơi thật xác nhận đây là mức grind hợp lý.

---

### B15 — World Quest lặp câu cũ nhưng không làm bẩn diagnosis

World Quest ưu tiên câu đã gặp ở Arena 1–4.

Điều này làm Quest có thể dễ dần do người chơi nhớ đáp án.

Nếu Quest được cộng vào diagnostic, Accuracy của ba cụm yếu sẽ tăng vì memory effect chứ không phản ánh đúng learning.

**Quyết định MVP:**

- Quest chỉ dùng để luyện và kiếm Credit;
- không cộng Quest vào `diagnostic_correct`;
- không cộng vào `diagnostic_attempted`;
- không đưa vào `accuracy_by_arena`;
- không đưa vào `performance_score`;
- không ảnh hưởng O4.

---

### B7 / D5 — Timer có thể không phản ánh đúng thời gian suy nghĩ

Timer dùng đồng hồ của trình duyệt.

Chuyển tab, máy chậm hoặc browser bị block có thể làm `timeMs` khác thời gian người chơi thực sự suy nghĩ.

Week 7 vẫn dùng timer vì mục tiêu là tạo áp lực gameplay ở ba round cuối.

**Quyết định MVP:**

- không auto-submit khi hết giờ;
- chỉ dùng overtime để trừ Credit theo rule công khai;
- không diễn giải timer như chỉ số năng lực;
- ghi rõ limitation trong `W6/limitations.md`.

---

### C6 — Pool câu hard có thể cạn

Thiết kế mới tăng số câu hard:

- Arena 2: 2 hard
- Arena 3: 3 hard
- Arena 4: 4 hard
- Boss: 9 hard

Mỗi cụm hiện chỉ có khoảng 9–10 câu hard.

Nếu người chơi replay Arena 4 từ hai lần trở lên, W2 có thể hết câu hard mới trước Boss.

**Quyết định MVP:** engine dùng fallback:

1. lấy lại câu đã gặp ở cùng difficulty;
2. nếu vẫn không đủ thì hạ về medium;
3. ghi `bankLog`.

Đây là limitation, không được coi fallback là behavior lý tưởng.

---

### B10 — Trap nằm trong mẫu xếp hạng Boss

`accuracy_cumulative` gồm cả câu Trap.

Nếu người học làm tốt Trap I/II, chính cụm được luyện có thể bị đẩy lên và rơi khỏi nhóm ba cụm yếu nhất ở Boss.

**Quyết định MVP:** giữ logic hiện tại. Khi báo cáo phải tách:

1. cụm bị Trap nhắm và vẫn có mặt ở Boss;
2. cụm bị Trap nhắm nhưng không còn nằm trong Boss.

---

### B8 — Mốc 70% trên slot 7/5/3

Boss pass threshold đã đổi thành 90%, nhưng **mốc 70% của nhãn cải thiện O4 không đổi**.

Cùng một mốc 70% nhưng số câu ít làm độ chặt khác nhau:

| Slot Boss | Cần đúng tối thiểu | Tỷ lệ thực tế |
|---|---:|---:|
| 7 câu | 5/7 | 71,4% |
| 5 câu | 4/5 | 80,0% |
| 3 câu | 3/3 | 100% |

**Quyết định MVP:** giữ logic O4 cũ. Không thay 70% bằng 90%.

---

### B1 — 9 module → 5 cụm

Mapping 9 module → 5 cụm là cấu trúc nội bộ của sản phẩm, không phải cấu trúc trọng số đề thi thật.

**Quyết định MVP:** giữ mapping hiện tại; bảng 9 module vẫn phải hiển thị để người học thấy chi tiết hơn.

---

### C2 / B11 — Difficulty là nhãn chủ quan

Difficulty 1–3 hiện ảnh hưởng nhiều hơn v11:

- cân bằng Arena 1;
- difficulty quota Arena 2–Boss;
- tie-break;
- `performance_score`.

Nếu nhãn difficulty sai, cả generation lẫn score đều bị ảnh hưởng.

**Quyết định MVP:** cho phép dùng trong prototype nhưng phải ghi rõ chưa calibrate.

---

## 3. Assumptions không được biến thành claim

Khi thuyết trình, nhóm **không được nói**:

- "70/75/75/85/90 là ngưỡng CFA chuẩn";
- "100/80/60 giây là thời gian chuẩn của CFA";
- "phạt mỗi 10 giây là mức tối ưu";
- "15 Credit là giá Boss đã được kiểm chứng";
- "reward Quest 0/2/3/4 là mức tối ưu";
- "Boss 90% với 9 câu khó là difficulty phù hợp cho mọi người học";
- "5 cụm phản ánh đúng trọng số Ethics thật";
- "difficulty đã được kiểm định";
- "World Quest chứng minh learning";
- "người học CFA chắc chắn thấy MCQ nhàm chán";
- "Trap đã được chứng minh cải thiện learning";
- **"Sản phẩm chẩn đoán được năng lực Ethics của người học"** — sản phẩm chỉ xác định cụm có tỷ lệ đúng thấp nhất trong phiên;
- **"Nhãn Đã cải thiện nghĩa là người học đã nắm được Standard"** — nhãn chỉ là kết quả nội bộ theo rule O4;
- **"`performance_score` là thang đo năng lực chuẩn hoá"** — đây chỉ là chỉ số nội bộ;
- **"Δ dương chứng minh Trap có tác dụng"** — mỗi cụm chỉ có ít câu ở Boss và baseline.

Cách nói đúng:

> "Đây là assumption/design choice của prototype. Các con số về threshold, timer, penalty, Boss Gate và World Quest hiện dựa trên mô phỏng thiết kế, chưa được kiểm chứng bằng dữ liệu người chơi thật."

---

## 4. Trigger phải cập nhật file này

Phải sửa `ASSUMPTIONS.md` nếu có một trong các thay đổi sau:

- đổi mapping 9 module → 5 cụm;
- đổi công thức `accuracy_cumulative`, `arena_score_correct`, `performance_score` hoặc tie-break;
- đổi rule item-used;
- đổi pass threshold của bất kỳ round nào;
- đổi difficulty quota theo round;
- đổi giới hạn timer;
- đổi công thức penalty;
- đổi Credit reward;
- đổi giá Bùa;
- đổi giá Boss;
- đổi rule fail/quit Boss;
- đổi reward World Quest;
- đổi cách Quest chọn câu;
- đổi rule loại câu Quest khỏi Boss;
- cho Quest tham gia diagnostic hoặc O4;
- đổi số câu hoặc phân bổ Arena, kể cả 7/5/3 của Boss;
- đổi mốc 70% của nhãn O4 hoặc định nghĩa `improvement_label`;
- đổi bảng quy đổi `DIFFICULTY_POINTS`;
- đổi quy tắc ghi theo lượt đầu / lượt đỗ;
- thêm API/backend/real-time data;
- có kết quả observation/playtest mới làm assumption được xác nhận hoặc bác bỏ.

---

## 5. Owner

| Nhóm assumption | Owner chính |
|---|---|
| Target user / problem evidence | Trang, Khôi |
| Diagnostic logic / tie-break / counters | Mô tả: Quỳnh · Triển khai: Minh, Trang |
| Mapping cluster / scope / game economy | Quỳnh, Minh |
| Difficulty quota / question-bank quality | Hồng, Quỳnh |
| Timer / penalty / Boss Gate / World Quest state | Minh, Khôi |
| Bảng tổng kết O4 / nhãn cải thiện / claim boundary | Quỳnh |
| Runtime validation / browser implementation | Minh, Khôi |

---

## 6. Open items — cần kiểm chứng sau khi có bản Week 7 chạy được

| # | Vấn đề | Vì sao chưa chốt được | Người quyết |
|---|---|---|---|
| 1 | Boss 90% + 9 câu hard có quá khó không | Chưa có clear-rate người chơi thật | Quỳnh, Minh |
| 2 | Timer 100/80/60 có tạo áp lực hợp lý không | Hiện chỉ là design choice | Quỳnh, Minh |
| 3 | Penalty mỗi block 10 giây có quá nặng không | Chưa có dữ liệu overtime thật | Quỳnh, Minh |
| 4 | Boss Gate 15 Credit có làm người yếu grind quá lâu không | Mới dựa trên mô phỏng tay | Quỳnh, Minh |
| 5 | Reward Quest 0/2/3/4 có khiến farm Credit quá nhanh/chậm không | Chưa có dữ liệu số lượt Quest | Quỳnh, Minh |
| 6 | Replay Arena 4 có làm cạn hard pool quá thường xuyên không | Phụ thuộc distribution thật của bank | Hồng, Trang |
| 7 | Quest lặp câu cũ có trở nên quá dễ sau vài lượt không | Chưa có playtest | Quỳnh, Hồng |
| 8 | Cách báo cáo hệ quả B10 — cụm bị Trap nhắm nhưng không vào Boss | Cần log từ engine | Quỳnh |
| 9 | Có đổi rule O4 70% trên slot 7/5/3 hay không | Cần playtest mới biết slot 3 câu có quá chặt không | Quỳnh, Minh |

---

## 7. Các limitation Week 7 phải được phản ánh sang `W6/limitations.md`

Các limitation sau không chỉ nằm ở file Assumptions; chúng phải được copy/diễn giải lại trong `W6/limitations.md`:

1. Pass threshold, timer, penalty, Boss price và Quest reward đều do nhóm tự đặt, chưa có dữ liệu người chơi thật.
2. Arena 2 và Arena 3 cùng ngưỡng 75%; độ khó tăng giữa hai round chủ yếu đến từ difficulty mix và timer.
3. Mỗi cụm chỉ có khoảng 9–10 câu hard; replay Arena 4 có thể làm cạn pool trước Boss.
4. Quest lặp câu cũ nên có thể dễ dần do nhớ đáp án.
5. Browser timer có thể lệch so với thời gian người chơi thật sự suy nghĩ.
6. Boss yêu cầu 90% trong khi có 9 câu hard; có thể quá khó với người mới học.
