# CFA Quest — Ethics

**Học phần:** NHA408E — Technology Applications in Banking and Finance · FTU 2026  
**Nhóm 7:** Quỳnh (trưởng nhóm) · Hồng · Trang · Minh · Khôi

---

## Project statement

Thí sinh tự ôn CFA Level I môn Ethics thường biết mình sai bao nhiêu câu nhưng khó xác định lỗi đang tập trung ở Standard nào. Nếu không có chẩn đoán, lần luyện sau dễ tiếp tục làm dàn trải.

**CFA Quest là một hầm ngục 5 Arena. Arena 1 tạo chẩn đoán ban đầu; các Arena sau được sinh từ dữ liệu sai của chính người học.** Hệ thống đo tỷ lệ đúng theo 5 cụm nội dung, xác định cụm yếu, rồi lọc ngân hàng **170 câu** để tạo bài luyện nhắm đúng phần đó.

Week 7 giữ nguyên core diagnostic logic nhưng tăng độ khó theo hành trình bằng:

- pass threshold tăng theo round;
- tỷ lệ câu khó tăng theo round;
- timer ở Arena 3, Arena 4 và Boss;
- Credit penalty khi quá giờ;
- Boss Gate yêu cầu 15 Credit;
- World Quest để người thiếu Credit luyện thêm trước Boss.

Người học không tự chọn mình luyện gì. **Dữ liệu sai của họ chọn hộ.**

**Người dùng mục tiêu:** thí sinh đã học xong lý thuyết Ethics và đang ở giai đoạn luyện MCQ.  
**User task:** đi hết 5 Arena và biết cụm nào đã cải thiện, cụm nào vẫn cần luyện tiếp.  
**Main output:** bảng chẩn đoán 5 cụm / 9 module + đề luyện được sinh tự động từ bảng chẩn đoán đó.

---

## Luồng Week 7

```text
Arena 1
15 câu · pass 70%
        ↓
Xác định W1
        ↓
Arena 2
10 câu W1 · pass 75%
        ↓
Arena 3
10 câu · pass 75% · 100 giây/câu
        ↓
Xác định W2 khác W1
        ↓
Arena 4
10 câu W2 · pass 85% · 80 giây/câu
        ↓
Xác định 3 cụm yếu nhất
        ↓
Credit ≥ 15?
   ├── Không → World Quest → cộng Credit → xét lại
   └── Có   → trả 15 Credit
                    ↓
                  Boss
          15 câu · pass 90%
          60 giây/câu
                    ↓
             Bảng tổng kết
```

### Pass threshold

| Round | Số câu | Ngưỡng đỗ | Số câu đúng tối thiểu |
|---|---:|---:|---:|
| Arena 1 | 15 | 70% | 11/15 |
| Arena 2 | 10 | 75% | 8/10 |
| Arena 3 | 10 | 75% | 8/10 |
| Arena 4 | 10 | 85% | 9/10 |
| Boss | 15 | 90% | 14/15 |

### Difficulty mix

| Round | Easy / Medium / Hard |
|---|---|
| Arena 1 | mỗi cụm 1 / 1 / 1 |
| Arena 2 | 4 / 4 / 2 |
| Arena 3 | 2 / 5 / 3 |
| Arena 4 | 2 / 4 / 4 |
| Boss | 2 / 4 / 9 |

Boss vẫn lấy ba cụm yếu nhất theo tỷ lệ:

```text
7 / 5 / 3 câu
```

---

## Boss Gate và World Quest

Đỗ Arena 4 chưa đủ để vào Boss.

Người chơi phải có và trả:

```text
15 Credit
```

Nếu thiếu Credit, **World Quest** được mở:

- 15 câu;
- 3 cụm yếu nhất, mỗi cụm 5 câu;
- không timer;
- không pass/fail;
- không dùng Bùa;
- có thể chơi nhiều lần.

Reward Quest:

| Kết quả | Credit |
|---|---:|
| 0–8/15 | 0 |
| 9–11/15 | +2 |
| 12–13/15 | +3 |
| 14–15/15 | +4 |

World Quest chỉ phục vụ luyện tập và kiếm Credit. Kết quả Quest **không được cộng vào dữ liệu chẩn đoán và không đi vào bảng tổng kết sau Boss**.

---

## Timer và Credit penalty

Timer áp dụng ở ba round cuối:

| Round | Giới hạn |
|---|---:|
| Arena 3 | 100 giây/câu |
| Arena 4 | 80 giây/câu |
| Boss | 60 giây/câu |

Hết giờ không auto-submit. Người chơi vẫn được trả lời và hệ thống tính overtime.

```text
penalty = ceil(max(0, t - L) / 10)
```

Trong đó:

- `t` = số giây đã dùng;
- `L` = giới hạn của round.

Mỗi block 10 giây quá giờ bị trừ 1 Credit. Trượt round vẫn bị phạt và ví không xuống dưới 0.

---

## Credit và Bùa

Người chơi bắt đầu với:

```text
3 Credit
```

Reward khi **đỗ** round:

| Tỷ lệ đúng | Credit |
|---|---:|
| từ 70% | +2 |
| từ 80% | +3 |
| từ 90% | +4 |

Lần đầu vượt Boss được thêm:

```text
+5 Credit
```

**Bùa Loại Trừ:** 3 Credit.

Rule vật phẩm:

- Arena 1: không dùng Bùa;
- Arena 2–4: tối đa 1 Bùa/round;
- Boss: tối đa 1 Bùa;
- World Quest: không dùng Bùa.

Câu đúng nhờ Bùa vẫn tính vào điểm pass/fail nhưng không được dùng làm dữ liệu chẩn đoán.

---

## Ranh giới của sản phẩm

Main path không retry và không cần World Quest vẫn có:

```text
15 + 10 + 10 + 10 + 15 = 60 câu
```

Nếu người chơi retry hoặc làm World Quest, tổng số câu sẽ lớn hơn 60.

Sản phẩm **xác định cụm có tỷ lệ đúng thấp trong phạm vi một lượt chơi**. Nó không:

- chẩn đoán năng lực Ethics theo chuẩn psychometric;
- dự báo kết quả thi CFA thật;
- chứng minh Trap hoặc World Quest gây ra learning;
- coi timer là thước đo năng lực chuẩn hóa.

`performance_score` là chỉ số nội bộ của sản phẩm, không phải standardized ability score.

Các giá trị sau là **design choices của project**, chưa được kiểm chứng bằng dữ liệu người chơi đủ lớn:

- pass threshold `70/75/75/85/90`;
- difficulty mix từng round;
- timer `100/80/60`;
- penalty theo block 10 giây;
- Boss Gate 15 Credit;
- Quest reward `0/+2/+3/+4`;
- mapping 9 module → 5 cụm;
- difficulty label 1–3.

Chi tiết:

- [`docs/ASSUMPTIONS.md`](docs/ASSUMPTIONS.md)
- [`W6/limitations.md`](W6/limitations.md)
- [`docs/SOLUTION_STRUCTURE.md`](docs/SOLUTION_STRUCTURE.md)

> **Không nhầm hai ngưỡng:** Boss cần 90% để pass, nhưng nhãn cải thiện của từng cluster trong O4 vẫn dùng mốc 70% theo logic reporting hiện tại.

---

## Chạy sản phẩm

### Bản hiện tại

Mở:

[`src/cfa_quest_v11.html`](src/cfa_quest_v11.html)

> Tên file `v11` được giữ để không phá các link cũ trong repo; tài liệu Week 7 mô tả logic hiện hành cần được đồng bộ vào build này.

Engine:

[`src/cfa_quest_v11.js`](src/cfa_quest_v11.js)

Question bank nhúng:

[`src/cfa_quest_v11_bank.js`](src/cfa_quest_v11_bank.js)

Dữ liệu gốc:

[`data/ethics_bank_170.json`](data/ethics_bank_170.json)

### Bản v11 dự phòng / lịch sử

Lịch sử của file chạy v11 được giữ trong GitHub:

[History — `src/cfa_quest_v11.html`](https://github.com/FTU-Legacy-63/G07/commits/main/src/cfa_quest_v11.html)

[History — `src/cfa_quest_v11.js`](https://github.com/FTU-Legacy-63/G07/commits/main/src/cfa_quest_v11.js)

Nếu nhóm tách Week 7 thành file `v12` riêng sau này, thay phần **Bản hiện tại** bằng link `v12` và giữ hai link history/v11 này làm fallback.

---

## Midterm evidence links

Phần dưới giữ vai trò **historical evidence** của các checkpoint trước. Week 7 không viết lại nội dung Midterm.

| Yêu cầu Week 4 | Tìm ở đâu |
|---|---|
| **Logic chain** — user → input → process → output → user action | [`docs/SOLUTION_STRUCTURE.md`](docs/SOLUTION_STRUCTURE.md) |
| **Input dictionary** | [`docs/INPUT_DICTIONARY.md`](docs/INPUT_DICTIONARY.md) |
| **Source & use** | [`docs/SOURCE_USE_MAP.md`](docs/SOURCE_USE_MAP.md) |
| **Assumptions** | [`docs/ASSUMPTIONS.md`](docs/ASSUMPTIONS.md) |
| **Expected result** | [`docs/SAMPLE_INPUT_OUTPUT.md`](docs/SAMPLE_INPUT_OUTPUT.md) |
| **Progress evidence** | [`docs/MIDTERM_REVIEW.md`](docs/MIDTERM_REVIEW.md) |
| **Midterm verification** | [`MIDTERM_VERIFICATION.md`](MIDTERM_VERIFICATION.md) |

---

## Cấu trúc repo

```text
README.md

PROJECT PROPOSAL.md
MIDTERM_VERIFICATION.md

data/
  ethics_bank_170.json         ngân hàng 170 câu, 34 câu × 5 cụm

src/
  cfa_quest_v11.html           file mở để chạy sản phẩm
  cfa_quest_v11.js             engine
  cfa_quest_v11_bank.js        bản nhúng của bank để chạy bằng file://
  cfa_quest_v11.css
  cfa_dungeon_ui_v10_skipfix_updated.css

docs/
  SOLUTION_STRUCTURE.md        core flow + diagnostic + Week 7 progression
  INPUT_DICTIONARY.md          field/state/counter definitions
  user-flow.md                 main path + alternative/error path
  feature-scope.md             core/supporting/out-of-scope
  ASSUMPTIONS.md               design assumptions + risks
  SOURCE_USE_MAP.md            source & field traceability
  SAMPLE_INPUT_OUTPUT.md       sample input/output
  MIDTERM_REVIEW.md            historical Midterm document
  WEEK5_CHECKPOINT.md          historical checkpoint

W6/
  testing.md                   test suite Week 7
  demo-input.md                deterministic demo input
  limitations.md               limitations và interpretation boundary

W4/
  CFA_Quest_user_flow.xlsm     historical v11 workbook
  VBA_CFA_Quest.bas

tools/
  validate_question_bank.html  offline question-bank validator
```

Dữ liệu được nhúng trong `.js` để sản phẩm có thể mở trực tiếp bằng `file://`, không cần dựng local server.

---

## Trạng thái hiện tại

| Hạng mục | Trạng thái |
|---|---|
| Ngân hàng 170 câu | ✅ Hoàn thành |
| Diagnostic logic O1–O4 | ✅ Hoàn thành |
| Progressive pass threshold | ✅ Hoàn thành / đã test |
| Difficulty mix theo round | ✅ Hoàn thành / đã test |
| Timer + overtime penalty | ✅ Hoàn thành / đã test |
| Boss Gate 15 Credit | ✅ Hoàn thành / đã test |
| World Quest | ✅ Hoàn thành / đã test |
| Boss dùng 1 Bùa | ✅ Hoàn thành / đã test |
| Test suite Week 7 | ✅ Pass |
| Demo seed 7 | ✅ Có kịch bản deterministic |
| Observation/interview người dùng thật | Chưa đủ dữ liệu để validate các design assumptions |

---

## Revision

| Mốc | Thay đổi | Lý do |
|---|---|---|
| Week 6 | Chỉ giữ Bùa Loại Trừ 3 Credit | Freeze scope vật phẩm |
| Week 6 | Bank 110 → 170 câu | Tăng coverage câu hỏi |
| **Week 7** | Pass threshold → `70/75/75/85/90` | Round sau khó hơn round trước |
| **Week 7** | Thêm difficulty quota theo round | Tăng tỷ lệ câu khó dần |
| **Week 7** | Thêm timer `100/80/60` + Credit penalty | Tăng áp lực ở ba round cuối |
| **Week 7** | Boss cần trả 15 Credit | Tạo progression gate trước Boss |
| **Week 7** | Boss được dùng tối đa 1 Bùa | Thêm hỗ trợ ở round khó nhất |
| **Week 7** | Thêm World Quest | Cho người thiếu Credit có đường luyện và kiếm thêm Credit |

---

## Open questions / limitations cần theo dõi

1. Boss 90% với 9 câu hard có thể quá khó; chưa có clear-rate từ sample người chơi đủ lớn.
2. Arena 2 và Arena 3 cùng threshold 75%; khác biệt difficulty phụ thuộc question mix và timer.
3. Replay Arena 4 có thể làm cạn pool câu hard của W2.
4. Quest lặp câu cũ nên có thể dễ dần do memory effect.
5. Browser timer có thể lệch khi đổi tab hoặc máy chậm.
6. Mốc O4 70% trên slot Boss 7/5/3 có độ chặt khác nhau.
7. Các design assumptions cần được validate bằng user testing thật.

Chi tiết tại [`W6/limitations.md`](W6/limitations.md).

---

## Bản quyền

Toàn bộ 170 câu hỏi, tình huống, lời giải và lý do gây nhiễu do nhóm tự biên soạn.

Tình huống là tình huống giả định, không trích nguyên văn tài liệu CFA Institute hoặc GIPS Standards. Tên Standard được dùng cho mục đích phân loại học thuật. Không có tài liệu nguồn thương mại nào được đưa vào repo hoặc lịch sử commit.
