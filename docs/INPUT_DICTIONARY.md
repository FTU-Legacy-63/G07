# INPUT_DICTIONARY

**Sản phẩm:** CFA Quest — Ethics diagnostic dungeon
**Học phần:** NHA408E · Nhóm 7
**Nguồn tham chiếu nội bộ:** `SOLUTION_STRUCTURE.md` v hiện hành, `ethics_bank_110.json` (110 câu)
**Trạng thái:** đã đồng bộ với bản `SOLUTION_STRUCTURE.md` có Mục 5 ba công thức và bảng tổng kết sau Boss

---

## Quy tắc lọc

Một field chỉ được nằm trong file này nếu trả lời được **cả hai** câu:

1. Nghĩa của nó là gì, viết đủ để một thành viên khác không hiểu sai?
2. Nó làm output nào thay đổi?

Field không trả lời được câu 2 thì xuống Mục 5 (contextual) hoặc bị xoá.

Sản phẩm có **bốn** output. Cột "Ảnh hưởng output" luôn trỏ về một trong bốn:

- **O1 — Bảng chẩn đoán:** tỷ lệ đúng theo 5 cụm và 9 module, tính lại sau mỗi Arena
- **O2 — Arena kế tiếp:** đề được sinh ra từ cụm yếu
- **O3 — Kết quả Arena:** đỗ/trượt, Credit, lời giải từng câu sai
- **O4 — Bảng tổng kết sau Boss:** tỷ lệ đúng từng cụm qua 5 Arena, nhãn cải thiện, và `performance_score` toàn lượt

> **O4 là output mới so với bản Week 3.** Trước Week 3 sản phẩm chỉ có ba output. Bảng tổng kết sau Boss ở Mục 5 `SOLUTION_STRUCTURE.md` là output thứ tư, dùng bộ đếm riêng và không đọc `accuracy_cumulative`.

---

## 1. User input — người học nhập hoặc hệ thống ghi lại từ hành vi

| Field | Nghĩa | Đơn vị / Định dạng | Nguồn | Ảnh hưởng output |
|---|---|---|---|---|
| `selected_option` | Chỉ số phương án người học chọn cho một câu. Chỉ ghi nhận sau khi bấm Xác nhận; không cho đổi lại | int, 0–2 | Người dùng | O1, O2, O3, O4 |
| `time_to_answer` | Số giây tính từ lúc câu hiện lên màn hình đến lúc bấm Xác nhận. **Chỉ đo, không giới hạn.** Không dùng để chấm điểm | int, giây | Hệ thống đo (timestamp render → timestamp submit) | O2 — chỉ chạy khi hai cụm bằng Accuracy và bằng cả độ khó trung bình |
| `item_used` | Câu này có dùng vật phẩm (Bùa Loại Trừ hoặc Cuộn Giấy Gợi Ý) hay không | boolean | Người dùng | O1 — quyết định câu có vào mẫu chẩn đoán hay không; O4 — quyết định câu có vào tử số `performance_score` hay không |
| `item_type_used` | Loại vật phẩm đã dùng ở câu đó, nếu có | enum: `none` / `eliminate` / `hint` | Người dùng | O3 — hiển thị lại trong bảng lời giải |

**Lưu ý về `time_to_answer`:** Mục 10 của `SOLUTION_STRUCTURE.md` xếp "giới hạn thời gian mỗi câu" vào Out of Scope. Không mâu thuẫn — sản phẩm **đo** thời gian nhưng **không đặt hạn**. Người học không bị đếm ngược, không bị trừ điểm vì chậm.

### Bốn ràng buộc vật phẩm (Mục 8 `SOLUTION_STRUCTURE.md`)

Đây là ràng buộc lên chính `item_used`, không phải luật game phụ. Vi phạm bất kỳ dòng nào là lỗi engine, không phải lựa chọn của người chơi.

| # | Ràng buộc | Hệ quả lên dữ liệu |
|---|---|---|
| 1 | **Arena 1 không được dùng vật phẩm** | Mọi record của Arena 1 phải có `item_used = false`. Đây là điều kiện để `points_offered` của Arena 1 luôn bằng 30 |
| 2 | **Boss không được dùng vật phẩm** | Cột Boss của O4 không bao giờ bị rỗng mẫu vì item |
| 3 | **Mỗi Arena tối đa 1 vật phẩm** | Một cụm không thể bị rỗng mẫu chẩn đoán do dồn item |
| 4 | **Mỗi câu tối đa 1 vật phẩm** | `item_type_used` luôn là một giá trị đơn, không phải mảng |

---

## 2. Product information — nằm sẵn trong ngân hàng câu hỏi

Nguồn chung: `ethics_bank_110.json`, do nhóm tự biên soạn, gắn nhãn thủ công.

| Field | Nghĩa | Đơn vị / Định dạng | Ảnh hưởng output |
|---|---|---|---|
| `id` | Mã định danh duy nhất của câu. Cấu trúc `ETH-{cụm}-{module}-{số thứ tự}` | string, 110 giá trị duy nhất | O2 — chống lặp câu trong cùng một lượt chơi |
| `cluster` | Cụm chẩn đoán. **Đây là trục sinh đề.** Toàn bộ cơ chế Trap chạy trên trường này | enum: C1–C5 | O1, O2, O4 |
| `module` | Module nội dung. **Đây là trục báo cáo, không phải trục sinh đề.** Ngoài ra ràng buộc phân bổ câu: Arena 1 phải rải qua hết module trong cụm, Trap phải chia đều 10 câu cho các module trong cụm | enum: GIPS, CODE, S1–S7 | O1 (bảng 9 dòng), O2 (ràng buộc phủ module) |
| `difficulty` | Mức khó do nhóm tự đánh giá. **Không phải trục chẩn đoán.** Có **ba** công dụng, xem ô ghi chú bên dưới | int, 1–3 | O2 — cân bằng Arena 1 và tie-break; **O4 — trọng số điểm của `performance_score`** |
| `stem` | Đề bài. Tình huống giả định do nhóm dựng, kết bằng lead-in chuẩn CFA ("most likely", "least likely") | string | O3 |
| `options` | Ba phương án trả lời, đúng chuẩn CFA Level I | mảng 3 string | O3 |
| `answer` | Chỉ số phương án đúng trong `options` | int, 0–2 | O1, O2, O3, O4 |
| `distractor_reason` | Lỗi tư duy dẫn tới từng phương án sai. Phần tử ở vị trí `answer` để rỗng | mảng 3 string | O3 — nội dung giải thích câu sai |
| `hint` | Một dòng gợi ý: Standard nào đang bị áp dụng. Không tiết lộ đáp án | string | O3 — chỉ hiện khi mua Cuộn Giấy Gợi Ý (4 Credit) |
| `explanation` | Lời giải: vì sao đáp án đúng, vì sao các phương án khác sai, và điều kiện nào sẽ làm kết luận đổi chiều | string | O3 |

> **`difficulty` đã đổi vai từ Week 3.** Bản trước dùng nó cho hai việc nội bộ (cân bằng Arena 1, tie-break) và không hiện ra màn hình. Bản hiện hành dùng nó làm **trọng số điểm** cho `performance_score` — một con số hiển thị công khai ở màn tổng kết. Bảng quy đổi: `{1: 1, 2: 2, 3: 3}`. Vì đây là nhãn chủ quan do nhóm tự gắn, giới hạn của việc dùng nó làm trọng số phải được đọc kèm `ASSUMPTIONS.md` mục **C2** và **B11**.

---

## 3. State variables — hệ thống tự tính, không ai nhập vào

Đây là nhóm quan trọng nhất: O1 và O4 được sinh ra hoàn toàn từ nhóm này.

### 3.1 Bộ đếm chẩn đoán — phục vụ O1, O2

| Field | Nghĩa | Đơn vị / Định dạng | Ảnh hưởng output |
|---|---|---|---|
| `diagnostic_correct[c]` | Số câu **đúng** thuộc cụm c, **đã loại bỏ mọi câu có `item_used = true`**. Cộng dồn toàn hành trình, **bao gồm cả câu ở Trap I và Trap II**, không reset giữa các Arena | int | O1 — tử số |
| `diagnostic_attempted[c]` | Số câu **đã làm** thuộc cụm c, cùng điều kiện loại vật phẩm và cùng phạm vi cộng dồn | int | O1 — mẫu số |
| `accuracy_cumulative[c]` | `diagnostic_correct[c] ÷ diagnostic_attempted[c]`. Tính lại sau mỗi Arena. **Công thức (1) Mục 5 `SOLUTION_STRUCTURE.md`** | float, 0.0–1.0 | O1, O2 |

> **Đổi tên so với bản Week 3.** Field này trước đây tên `accuracy[c]`. Tên trần `accuracy` bị cấm dùng trong code kể từ khi có `accuracy_by_arena`, vì hai biến đọc cùng một tập câu trả lời nhưng cho hai con số khác nhau.

> **Trap có nằm trong `accuracy_cumulative` không:** **CÓ.** Câu ở Trap I và Trap II vào cả tử lẫn mẫu. Đây là lựa chọn có chủ ý, có hệ quả, và được ghi ở `ASSUMPTIONS.md` mục **B10** — đọc trước khi code.

### 3.2 Bộ đếm điểm Arena — phục vụ O3

| Field | Nghĩa | Đơn vị / Định dạng | Ảnh hưởng output |
|---|---|---|---|
| `arena_score_correct` | Số câu đúng trong Arena hiện tại, **tính cả câu có `item_used = true`**. Reset về 0 khi vào Arena mới. **Công thức (2)** | int | O3 — đỗ/trượt và Credit |
| `arena_question_count` | Tổng số câu của Arena hiện tại (15 hoặc 10) | int | O3 — mẫu số của ngưỡng 70% |
| `arena_passed` | Arena hiện tại đỗ hay trượt. Ngưỡng: `arena_score_correct ÷ arena_question_count ≥ 0.70` | boolean | O3 — mở khoá Arena kế tiếp, cấp Credit |
| `credit_balance` | Số Credit đang có. Khởi tạo = 3 | int, ≥ 0 | O3 — quyết định có mua được vật phẩm không. Gián tiếp tác động O1 qua `item_used` |

### 3.3 Bộ đếm theo Arena — phục vụ O4

| Field | Nghĩa | Đơn vị / Định dạng | Ảnh hưởng output |
|---|---|---|---|
| `accuracy_by_arena[c][arena]` | Cặp số `{correct, attempted}` của cụm c **riêng trong từng Arena**, không cộng dồn. Cùng điều kiện loại câu dùng vật phẩm như 3.1 | object lồng 2 tầng | O4 — mọi ô của bảng tổng kết |
| `baseline_accuracy[c]` | Mốc chẩn đoán của cụm c: `(arena1.correct + crossroads.correct) ÷ (arena1.attempted + crossroads.attempted)`. **Không gồm Trap** | float | O4 — cột so sánh gốc |
| `delta[c]` | `boss_accuracy[c] − baseline_accuracy[c]`. Không hiển thị trực tiếp; là biến trung gian để dán nhãn | float, có thể âm | O4 |
| `improvement_label[c]` | Nhãn kết luận của cụm c, nhận một trong bốn giá trị theo bảng điều kiện Mục 5 `SOLUTION_STRUCTURE.md` | enum: `not_retested` / `improved` / `improved_insufficient` / `needs_work` | O4 — cột Kết luận |
| `performance_by_arena[arena]` | Cặp số `{points_earned, points_offered}` theo Arena. `points_earned` cộng điểm độ khó của câu **đúng và không dùng vật phẩm**; `points_offered` cộng điểm độ khó của **mọi câu đã hỏi**. Không chia theo cụm | object | O4 |
| `performance_score` | `Σ points_earned ÷ Σ points_offered` trên cả 5 Arena. **Công thức (3)** | float, 0.0–1.0 | O4 — con số so sánh giữa người chơi |

### 3.4 Biến điều khiển sinh đề

| Field | Nghĩa | Đơn vị / Định dạng | Ảnh hưởng output |
|---|---|---|---|
| `W1` | Cụm có `accuracy_cumulative` thấp nhất tại thời điểm sau Arena 1 | enum: C1–C5 | O2 — nội dung Trap I |
| `W2` | Cụm có `accuracy_cumulative` thấp nhất tại thời điểm sau Arena 3, **bắt buộc khác `W1`** | enum: C1–C5 | O2 — nội dung Trap II |
| `boss_clusters` | Ba cụm có `accuracy_cumulative` thấp nhất sau Arena 4, xếp theo thứ tự yếu dần, phân bổ 7/5/3 câu. **Không loại trừ W1/W2** | mảng 3 enum | O2 — nội dung Boss |
| `used_question_ids` | Danh sách `id` các câu đã ra trong lượt chơi hiện tại | mảng string | O2 — lọc bank khi sinh Arena, chống lặp câu |
| `attempt_index[arena]` | Lượt làm thứ mấy của Arena đó. Bắt đầu từ 1, tăng mỗi lần chơi lại sau khi trượt | int, ≥ 1 | O4 — quyết định lượt nào được ghi vào mốc chẩn đoán |

---

## 4. Ba khái niệm "trả lời đúng"

Sản phẩm đếm cùng một tập câu trả lời bằng **ba** công thức xử lý câu dùng vật phẩm theo ba cách khác nhau. Đây là chỗ dễ sai nhất khi code.

| | (1) `accuracy_cumulative` | (2) `arena_score_correct` | (3) `performance_score` |
|---|---|---|---|
| Dùng để | Chẩn đoán — chọn cụm cho Trap và Boss | Chấm điểm — đỗ/trượt, Credit | Phân biệt hai người cùng điểm |
| Đơn vị đếm | Số câu | Số câu | Điểm độ khó (1/2/3) |
| Câu dùng vật phẩm — tử số | **Loại** | Tính | **Loại** |
| Câu dùng vật phẩm — mẫu số | **Loại** | Tính | **Tính** |
| Phạm vi | Cộng dồn toàn hành trình | Reset mỗi Arena | Cộng gộp cả 60 câu |
| Chia theo cụm | Có (5 bộ đếm) | Không | Không |
| Ghi theo lượt nào khi chơi lại | Lượt **đầu tiên** | Lượt **đỗ** | Lượt **đầu tiên** |

**Vì sao mẫu số của (3) khác (1):** ở (1), câu dùng vật phẩm bị loại hẳn vì nó không cho biết người học có nắm cụm đó hay không — giữ lại sẽ đẩy Accuracy của cụm lên cao giả tạo, cụm đó thoát khỏi vị trí yếu nhất, và Trap bắn sang cụm khác. Ở (3), câu đó **ở lại mẫu số** vì chỉ số này đo phần người chơi tự làm được trên toàn bộ những gì đã gặp: vật phẩm giúp qua màn, không mua được `performance_score`.

**`performance_score` không tham gia chuỗi chẩn đoán.** Nó không quyết định `W1`, `W2`, `boss_clusters`, không quyết định đỗ/trượt, không cấp Credit. Nếu một nhánh code đọc `performance_score` để ra quyết định, đó là lỗi.

**Cấm dùng tên biến `correct`, `score`, `right`, `accuracy` trần trong code.** Luôn viết đủ tiền tố: `diagnostic_`, `arena_score_`, `accuracy_cumulative`, `accuracy_by_arena`, `performance_`.

### Ba quy tắc lưu của `accuracy_by_arena`

1. Lưu **cặp số**, không lưu phần trăm. `baseline_accuracy` phải cộng được `(1+2)/(3+2)`; hai phần trăm thì không cộng được.
2. Đếm theo `diagnostic_correct` / `diagnostic_attempted`, tức loại câu dùng vật phẩm khỏi cả tử lẫn mẫu.
3. Arena nào không hỏi cụm đó thì **không tạo key**, không đặt `attempted: 0`. Đặt 0 sẽ sinh phép chia cho 0 và một ô 0% giả trên bảng.

### Điểm kiểm tra tự động

`performance_by_arena["arena1"].points_offered` **luôn phải bằng 30** — vì Arena 1 có 5 cụm × 3 mức khó × 1 câu, và không được dùng vật phẩm. Nếu engine tính ra số khác, lỗi nằm ở khâu sinh đề Arena 1, không nằm ở khâu tính điểm.

---

## 5. Field contextual — giữ trong dữ liệu, không ảnh hưởng output

| Field | Vì sao giữ |
|---|---|
| `topic` | Hằng số `"ETHICS"` ở cả 110 câu. Chỉ có nghĩa nếu sau này thêm chủ đề khác (FSA, Quantitative...). Hiện tại không có nhánh code nào đọc nó |
| `item_type` | Nhãn `concept` / `vignette`. Không có logic nào đọc |

---

## 6. Field phục vụ biên soạn, không phải input lúc chạy

| Field | Dùng lúc nào | Ai dùng |
|---|---|---|
| `sub_standard` | Lúc soạn đề. Kiểm tra ngân hàng đã phủ đủ các sub-standard chưa (hiện có 28 giá trị: GIPS-fundamentals, GIPS-composite, GIPS-disclosures, GIPS-verification, CODE-code-vs-standards, CODE-six-components, I(A)–I(D), II(A)–II(B), III(A)–III(E), IV(A)–IV(C), V(A)–V(C), VI(A)–VI(C), VII(A)–VII(B)). Đồng thời là khoá nối sang `SOURCE_USE_MAP.md` | Hồng (nội dung), Quỳnh (tài liệu) |

Lúc sản phẩm chạy, `sub_standard` không xuất hiện ở bất kỳ màn hình nào. Bảng chẩn đoán dừng ở tầng module.

---

## 7. Trạng thái các việc phải chốt trước Week 4

| # | Việc | Người | Trạng thái |
|---|---|---|---|
| 1 | Viết lại công thức Accuracy ở Mục 5 `SOLUTION_STRUCTURE.md`, ghi điều kiện loại câu dùng vật phẩm ngay tại công thức | Quỳnh | **Xong** — Mục 5, công thức (1) |
| 2 | Bổ sung `time_to_answer` vào danh sách Input Mục 1 `SOLUTION_STRUCTURE.md` | Quỳnh | **Xong** |
| 3 | Quyết định `item_type`: sửa nhãn cho khớp nội dung hay xoá khỏi JSON | Hồng | **Chưa** — vẫn để nguyên trạng ở Mục 5 file này |
| 4 | Xác nhận engine đo `time_to_answer` bằng timestamp render và submit | Minh | Khi dựng khung engine |
| 5 | Đặt tên biến trong code khớp file này | Minh, Trang | Khi dựng khung engine |

## 7b. Việc phát sinh từ bản `SOLUTION_STRUCTURE.md` mới

| # | Việc | Người | Hạn |
|---|---|---|---|
| 6 | Đổi tên `accuracy` → `accuracy_cumulative` ở mọi chỗ trong repo, kể cả comment code | Minh, Trang | Trước buổi code đầu tiên |
| 7 | Bổ sung validation: mọi record thuộc Arena 1 và Boss phải có `item_used = false`; mỗi Arena tối đa 1 record có `item_used = true` | Minh | Cùng đợt #6 |
| 8 | Bổ sung `validate.html`: kiểm tra worst case cụm W1 tiêu thụ đúng 22 câu (3+10+2+7) mà bank không cạn | Trang | Trước integration |
| 9 | Xác nhận cách ghi khi người chơi trượt: `accuracy_by_arena` và `performance_by_arena` ghi theo `attempt_index = 1`; `arena_score_correct` và Credit ghi theo lượt đỗ | Minh | Trước buổi code đầu tiên |

---

## 8. Chủ sở hữu

| Nội dung | Người chịu trách nhiệm |
|---|---|
| File này, và việc đồng bộ với `SOLUTION_STRUCTURE.md` | Quỳnh |
| Nghĩa và chất lượng các field trong ngân hàng câu hỏi (Mục 2, Mục 6) | Hồng |
| State variables và cách tính (Mục 3, Mục 4) | Mô tả state variables và ba công thức (Mục 3, 4): Quỳnh — Triển khai và test: Minh |
| Cơ chế sinh Arena đọc đúng các field ở Mục 2, Mục 3 | Trang |
| Nhãn hiển thị trên giao diện không được đổi nghĩa của field | Khôi |
| Phạm vi và ưu tiên khi phải cắt field | Quỳnh |

---

## 9. Giới hạn của file này

- Toàn bộ ngân hàng câu hỏi do nhóm tự biên soạn, tình huống là tình huống giả định. Không phải dữ liệu thật, không trích nguyên văn tài liệu CFA Institute. Chi tiết về nguồn và giới hạn nằm ở `SOURCE_USE_MAP.md`.
- Ngưỡng đỗ 70%, ngưỡng 70% để dán nhãn "Đã cải thiện" ở O4, và bảng ánh xạ 9 module → 5 cụm đều do nhóm tự đặt, chưa đối chiếu với trọng số đề thi thật. Ghi và giải thích ở `ASSUMPTIONS.md`.
- Mức độ khó 1–3 do nhóm tự đánh giá, chưa qua kiểm định trên người học thật. Việc dùng nó làm trọng số điểm ở `performance_score` kế thừa toàn bộ giới hạn này.
- `performance_score` chỉ so sánh được giữa những người chơi **trong cùng sản phẩm này**. Nó không phải thang đo năng lực chuẩn hoá và không dự báo kết quả thi CFA.
