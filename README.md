# CFA Quest — Ethics

**Học phần:** NHA408E — Technology Applications in Banking and Finance · FTU 2026  
**Nhóm 7:** Quỳnh (trưởng nhóm) · Hồng · Trang · Minh · Khôi. Xem phân công chi tiết tại [WEEK5_CHECKPOINT Mục 10](docs/WEEK5_CHECKPOINT.md#10-ownership-v%C3%A0-integration-evidence).
---

## Project statement

Thí sinh tự ôn CFA Level I môn Ethics biết mình sai bao nhiêu câu, nhưng không biết sai tập trung ở Standard nào — nên lần luyện sau vẫn làm dàn trải như lần trước.

**CFA Quest là một hầm ngục 5 đấu trường, trong đó chỉ Arena 1 có đề cố định. Bốn Arena còn lại được sinh ra từ chính dữ liệu sai của người học.** Hệ thống đo tỷ lệ đúng theo 5 cụm nội dung, tìm cụm thấp nhất, rồi lọc ngân hàng 170 câu để hỏi lại đúng phần đó.

Người học không tự chọn mình luyện gì. Dữ liệu sai của họ chọn hộ.

**Người dùng mục tiêu:** thí sinh đã học xong lý thuyết Ethics, đang ở giai đoạn luyện MCQ.  
**User task:** đi hết 5 Arena và biết cụm nào đã cải thiện, cụm nào chưa.  
**Main output:** bảng chẩn đoán 5 cụm / 9 module + đề luyện sinh tự động từ bảng đó.

---

## Ranh giới của sản phẩm

Sản phẩm **xác định cụm có tỷ lệ đúng thấp nhất trong một phiên chơi 60 câu**. Nó không chẩn đoán năng lực Ethics, không dự báo kết quả thi thật, và chưa chứng minh cơ chế Trap cải thiện việc học.

`performance_score` so sánh được giữa hai người chơi **trong sản phẩm này**, không phải thang đo năng lực chuẩn hoá.

Ngưỡng 70%, bảng ánh xạ 9 module → 5 cụm, và nhãn độ khó 1–3 đều do nhóm tự đặt. Chi tiết ở [`docs/ASSUMPTIONS.md`](docs/ASSUMPTIONS.md); phát biểu đầy đủ ở [`docs/SOLUTION_STRUCTURE.md` Mục 14](docs/SOLUTION_STRUCTURE.md).

---

## Midterm evidence links

| Yêu cầu Week 4 | Tìm ở đâu |
|---|---|
| **Logic chain** — user → input → process → output → user action | [`SOLUTION_STRUCTURE.md` Mục 1](docs/SOLUTION_STRUCTURE.md), [Mục 3](docs/SOLUTION_STRUCTURE.md), [Mục 12](docs/SOLUTION_STRUCTURE.md) |
| **Logic specification** — input/state → công thức → output → claim boundary | [`SOLUTION_STRUCTURE.md` Mục 5.0](docs/SOLUTION_STRUCTURE.md) (bảng 5 cột) và Mục 5 (ba công thức, bảng tổng kết O4) |
| **Claim boundary** | [`SOLUTION_STRUCTURE.md` Mục 14](docs/SOLUTION_STRUCTURE.md) — bảng "được nói / không được nói" cho cả bốn output |
| **Input dictionary** — nghĩa từng field và output nào bị ảnh hưởng | [`docs/INPUT_DICTIONARY.md`](docs/INPUT_DICTIONARY.md) |
| **Source & use** — nguồn nào cấp gì, giới hạn nào | [`docs/SOURCE_USE_MAP.md`](docs/SOURCE_USE_MAP.md) |
| **Assumptions** — 24 giả định, rủi ro, cách kiểm chứng | [`docs/ASSUMPTIONS.md`](docs/ASSUMPTIONS.md) |
| **Expected result** — một sample dự đoán được trước khi chạy | [`docs/SAMPLE_INPUT_OUTPUT.md` Mục 2–6](docs/SAMPLE_INPUT_OUTPUT.md): 15 dòng input → toàn bộ hành trình → bảng tổng kết |
| **Explanation + limitation** | [`SAMPLE_INPUT_OUTPUT.md` Mục 7](docs/SAMPLE_INPUT_OUTPUT.md) (kết quả nói gì / không nói gì) và [Mục 11](docs/SAMPLE_INPUT_OUTPUT.md) |
| **MVP + out of scope** | [`SOLUTION_STRUCTURE.md` Mục 6](docs/SOLUTION_STRUCTURE.md) và [Mục 10](docs/SOLUTION_STRUCTURE.md) |
| **Progress evidence** | [`docs/MIDTERM_REVIEW.md` Part D](docs/MIDTERM_REVIEW.md) |
| **Individual output & ownership** | [`docs/MIDTERM_REVIEW.md` Part E](docs/MIDTERM_REVIEW.md) |
| **Tổng hợp Part A–E** | [`docs/MIDTERM_REVIEW.md`](docs/MIDTERM_REVIEW.md) |

---

## Cấu trúc repo

```text
README.md                      ← bạn đang ở đây
PROJECT PROPOSAL.md
MIDTERM_VERIFICATION.md
data/
  ethics_bank_170.json         ngân hàng 170 câu (34 câu × 5 cụm), nguồn dữ liệu gốc
src/
  cfa_quest_v11.html           file mở để chạy sản phẩm
  cfa_quest_v11.js             engine: sinh đề, chấm điểm, xếp hạng cụm, bảng tổng kết
  cfa_quest_v11_bank.js        bản nhúng của data/ethics_bank_170.json, chỉ dùng khi mở bằng file://
  cfa_quest_v11.css
  cfa_dungeon_ui_v10_skipfix_updated.css   giao diện nền dùng lại từ v10
docs/
  SOLUTION_STRUCTURE.md        tài liệu lõi: core flow, ba công thức, O4, claim boundary
  INPUT_DICTIONARY.md          nghĩa từng field, ba bộ đếm, quy tắc đặt tên biến
  ASSUMPTIONS.md               giả định, rủi ro, câu không được biến thành claim
  SOURCE_USE_MAP.md            nguồn nào cấp gì, traceability từng field
  SAMPLE_INPUT_OUTPUT.md       sample tính tay, 16 test case, validation
  user-flow.md                 đường chính, đường phụ, đường lỗi
  feature-scope.md             tính năng chính, phụ, phần đã hoãn
  MIDTERM_REVIEW.md            tổng hợp Part A–E cho giữa kỳ
  WEEK5_CHECKPOINT.md
tools/
  validate_question_bank.html  công cụ QA offline cho ngân hàng câu hỏi
W4/
  CFA_Quest_user_flow.xlsm     workbook minh hoạ một lượt chơi, kèm VBA
  VBA_CFA_Quest.bas
```

**Dữ liệu nhúng trong `.js` chứ không fetch JSON** — để người chấm mở file bằng cách bấm đúp là chạy được, không cần dựng local server.

---

## Trạng thái hiện tại

| Hạng mục | Trạng thái |
|---|---|
| Ngân hàng 170 câu | Xong, đã validate cấu trúc |
| Đặc tả logic (3 công thức, O1–O4) | Xong |
| Sample tính tay dự đoán được output | Xong |
| Claim boundary | Xong |
| Engine JavaScript | Chưa bắt đầu |
| Giao diện | Chưa bắt đầu |
| Observation/interview người dùng thật | **Chưa có** — problem evidence vẫn là open item |

---

## Open questions

1. `accuracy_cumulative` gồm cả câu Trap, nên cụm được Trap luyện tốt có thể rơi khỏi Boss và không được đo lại. Giữ cơ chế và báo cáo cả hai vế, hay đổi sang xếp hạng Boss bằng mốc chẩn đoán? (`ASSUMPTIONS.md` B10)
2. Ngưỡng 70% ở O4 chặt không đều trên slot 7/5/3 câu — slot 3 câu thành ra phải đúng tuyệt đối. Giữ, hay đổi sang luật "số câu sai tối đa"? (`ASSUMPTIONS.md` B8)
3. Chưa có problem evidence thật. Kế hoạch observation đã có nhưng chưa thực hiện. (`SOURCE_USE_MAP.md` Source 6, 7)

---

## Bản quyền

Toàn bộ 170 câu hỏi, tình huống, lời giải và lý do gây nhiễu do nhóm tự biên soạn. Tình huống là tình huống giả định, không trích nguyên văn tài liệu CFA Institute hay GIPS Standards. Tên Standard được dùng cho mục đích phân loại học thuật. Không có tài liệu nguồn thương mại nào trong repo hoặc trong lịch sử commit.
