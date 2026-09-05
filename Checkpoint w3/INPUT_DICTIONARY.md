# INPUT_DICTIONARY

**Sản phẩm:** CFA Quest — Ethics diagnostic dungeon
**Học phần:** NHA408E · Nhóm 7
**Nguồn tham chiếu nội bộ:** `SOLUTION_STRUCTURE.md` v hiện hành, `ethics_bank_110.json` (110 câu)

---

## Quy tắc lọc

Một field chỉ được nằm trong file này nếu trả lời được **cả hai** câu:

1. Nghĩa của nó là gì, viết đủ để một thành viên khác không hiểu sai?
2. Nó làm output nào thay đổi?

Field không trả lời được câu 2 thì xuống Mục 5 (contextual) hoặc bị xoá.

Sản phẩm có ba output. Cột "Ảnh hưởng output" luôn trỏ về một trong ba:

- **O1 — Bảng chẩn đoán:** tỷ lệ đúng theo 5 cụm và 9 module
- **O2 — Arena kế tiếp:** đề được sinh ra từ cụm yếu
- **O3 — Kết quả Arena:** đỗ/trượt, Credit, lời giải từng câu sai

---

## 1. User input — người học nhập hoặc hệ thống ghi lại từ hành vi

| Field | Nghĩa | Đơn vị / Định dạng | Nguồn | Ảnh hưởng output |
|---|---|---|---|---|
| `selected_option` | Chỉ số phương án người học chọn cho một câu. Chỉ ghi nhận sau khi bấm Xác nhận; không cho đổi lại | int, 0–2 | Người dùng | O1, O2, O3 |
| `time_to_answer` | Số giây tính từ lúc câu hiện lên màn hình đến lúc bấm Xác nhận. **Chỉ đo, không giới hạn.** Không dùng để chấm điểm | int, giây | Hệ thống đo (timestamp render → timestamp submit) | O2 — chỉ chạy khi hai cụm bằng Accuracy và bằng cả độ khó trung bình |
| `item_used` | Câu này có dùng vật phẩm (Bùa Loại Trừ hoặc Cuộn Giấy Gợi Ý) hay không. Mỗi câu tối đa 1 vật phẩm | boolean | Người dùng | O1 — quyết định câu có vào mẫu chẩn đoán hay không |
| `item_type_used` | Loại vật phẩm đã dùng ở câu đó, nếu có | enum: `none` / `eliminate` / `hint` | Người dùng | O3 — hiển thị lại trong bảng lời giải |

**Lưu ý về `time_to_answer`:** Mục 10 của `SOLUTION_STRUCTURE.md` xếp "giới hạn thời gian mỗi câu" vào Out of Scope. Không mâu thuẫn — sản phẩm **đo** thời gian nhưng **không đặt hạn**. Người học không bị đếm ngược, không bị trừ điểm vì chậm.

---

## 2. Product information — nằm sẵn trong ngân hàng câu hỏi

Nguồn chung: `ethics_bank_110.json`, do nhóm tự biên soạn, gắn nhãn thủ công.

| Field | Nghĩa | Đơn vị / Định dạng | Ảnh hưởng output |
|---|---|---|---|
| `id` | Mã định danh duy nhất của câu. Cấu trúc `ETH-{cụm}-{module}-{số thứ tự}` | string, 110 giá trị duy nhất | O2 — chống lặp câu trong cùng một lượt chơi |
| `cluster` | Cụm chẩn đoán. **Đây là trục sinh đề.** Toàn bộ cơ chế Trap chạy trên trường này | enum: C1–C5 | O1, O2 |
| `module` | Module nội dung. **Đây là trục báo cáo, không phải trục sinh đề.** Ngoài ra ràng buộc phân bổ câu: Arena 1 phải rải qua hết module trong cụm, Trap phải chia đều 10 câu cho các module trong cụm | enum: GIPS, CODE, S1–S7 | O1 (bảng 9 dòng), O2 (ràng buộc phủ module) |
| `difficulty` | Mức khó do nhóm tự đánh giá. **Không phải trục chẩn đoán** | int, 1–3 | O2 — cân bằng Arena 1 (mỗi cụm đủ 3 mức) và là tiêu chí phân định thứ nhất khi hai cụm bằng Accuracy |
| `stem` | Đề bài. Tình huống giả định do nhóm dựng, kết bằng lead-in chuẩn CFA ("most likely", "least likely") | string | O3 |
| `options` | Ba phương án trả lời, đúng chuẩn CFA Level I | mảng 3 string | O3 |
| `answer` | Chỉ số phương án đúng trong `options` | int, 0–2 | O1, O2, O3 |
| `distractor_reason` | Lỗi tư duy dẫn tới từng phương án sai. Phần tử ở vị trí `answer` để rỗng | mảng 3 string | O3 — nội dung giải thích câu sai |
| `hint` | Một dòng gợi ý: Standard nào đang bị áp dụng. Không tiết lộ đáp án | string | O3 — chỉ hiện khi mua Cuộn Giấy Gợi Ý (4 Credit) |
| `explanation` | Lời giải: vì sao đáp án đúng, vì sao các phương án khác sai, và điều kiện nào sẽ làm kết luận đổi chiều | string | O3 |

---

## 3. State variables — hệ thống tự tính, không ai nhập vào

Đây là nhóm quan trọng nhất: output chính của sản phẩm (Weakness Profile) được sinh ra hoàn toàn từ nhóm này.

| Field | Nghĩa | Đơn vị / Định dạng | Ảnh hưởng output |
|---|---|---|---|
| `diagnostic_correct[c]` | Số câu **đúng** thuộc cụm c, **đã loại bỏ mọi câu có `item_used = true`**. Cộng dồn toàn hành trình, không reset giữa các Arena | int | O1 — tử số Accuracy |
| `diagnostic_attempted[c]` | Số câu **đã làm** thuộc cụm c, **đã loại bỏ mọi câu có `item_used = true`**. Cộng dồn toàn hành trình | int | O1 — mẫu số Accuracy |
| `accuracy[c]` | `diagnostic_correct[c] ÷ diagnostic_attempted[c]`. Tính lại sau mỗi Arena | float, 0.0–1.0 | O1, O2 |
| `arena_score_correct` | Số câu đúng trong Arena hiện tại, **tính cả câu có `item_used = true`**. Reset về 0 khi vào Arena mới | int | O3 — đỗ/trượt và Credit |
| `arena_question_count` | Tổng số câu của Arena hiện tại (15 hoặc 10) | int | O3 — mẫu số của ngưỡng 70% |
| `W1` | Cụm có `accuracy` thấp nhất tại thời điểm sau Arena 1 | enum: C1–C5 | O2 — nội dung Trap I |
| `W2` | Cụm có `accuracy` thấp nhất tại thời điểm sau Arena 3, **bắt buộc khác `W1`** | enum: C1–C5 | O2 — nội dung Trap II |
| `boss_clusters` | Ba cụm yếu nhất sau Arena 4, xếp theo thứ tự yếu dần, phân bổ 7/5/3 câu | mảng 3 enum | O2 — nội dung Boss |
| `credit_balance` | Số Credit đang có. Khởi tạo = 3 | int, ≥ 0 | O3 — quyết định có mua được vật phẩm không. Gián tiếp tác động O1 qua `item_used` |
| `used_question_ids` | Danh sách `id` các câu đã ra trong lượt chơi hiện tại | mảng string | O2 — lọc bank khi sinh Arena, chống lặp câu |
| `arena_passed` | Arena hiện tại đỗ hay trượt. Ngưỡng: `arena_score_correct ÷ arena_question_count ≥ 0.70` | boolean | O3 — mở khoá Arena kế tiếp, cấp Credit |

---

## 4. Hai bộ đếm 

Sản phẩm có **hai khái niệm "trả lời đúng" khác nhau**. 

| | `diagnostic_correct` | `arena_score_correct` |
|---|---|---|
| Dùng để | Chẩn đoán — chọn cụm cho Trap | Chấm điểm — đỗ/trượt, Credit |
| Câu dùng vật phẩm | **Loại khỏi mẫu** | **Tính bình thường** |
| Phạm vi | Cộng dồn toàn hành trình | Reset mỗi Arena |
| Chia theo | Từng cụm (5 bộ đếm) | Toàn Arena (1 bộ đếm) |

**Vì sao loại câu dùng vật phẩm khỏi chẩn đoán:** trả lời đúng sau khi Bùa Loại Trừ đã bỏ đi một phương án sai không chứng minh người học nắm được cụm đó. Đưa vào mẫu sẽ đẩy `accuracy` của cụm lên cao giả tạo, cụm đó thoát khỏi vị trí yếu nhất, và Trap bắn sang cụm khác. Lỗ hổng thật bị bỏ qua.

**Cấm dùng tên biến `correct`, `score`, `right` trần trong code.** Luôn viết đủ tiền tố `diagnostic_` hoặc `arena_score_`.

---

## 5. Field contextual — giữ trong dữ liệu, không ảnh hưởng output

| Field | Vì sao giữ |
|---|---|---|
| `topic` | Hằng số `"ETHICS"` ở cả 110 câu. Chỉ có nghĩa nếu sau này thêm chủ đề khác (FSA, Quantitative...). Hiện tại không có nhánh code nào đọc nó | 
| `item_type` | Nhãn `concept` / `vignette`. Không có logic nào đọc | 

---

## 6. Field phục vụ biên soạn, không phải input lúc chạy

Loại này không phải contextual, cũng không phải input sản phẩm. Nó tồn tại để nhóm kiểm soát chất lượng ngân hàng câu hỏi.

| Field | Dùng lúc nào | Ai dùng |
|---|---|---|
| `sub_standard` | Lúc soạn đề. Kiểm tra ngân hàng đã phủ đủ các sub-standard chưa (hiện có 28 giá trị: GIPS-fundamentals, GIPS-composite, GIPS-disclosures, GIPS-verification, CODE-code-vs-standards, CODE-six-components, I(A)–I(D), II(A)–II(B), III(A)–III(E), IV(A)–IV(C), V(A)–V(C), VI(A)–VI(C), VII(A)–VII(B)). Đồng thời là khoá nối sang `SOURCE_USE_MAP.md` | Hồng (nội dung), Quỳnh (tài liệu) |

Lúc sản phẩm chạy, `sub_standard` không xuất hiện ở bất kỳ màn hình nào. Bảng chẩn đoán dừng ở tầng module.

---

## 7. Việc phải chốt trước Week 4

| # | Việc | Người thực hiện | Hạn |
|---|---|---|---|
| 1 | Sửa Mục 5 `SOLUTION_STRUCTURE.md`: viết lại công thức Accuracy thành `diagnostic_correct[c] ÷ diagnostic_attempted[c]`, ghi rõ điều kiện loại câu dùng vật phẩm ngay tại công thức thay vì để ở Mục 8 | Quỳnh | Trước buổi code đầu tiên |
| 2 | Bổ sung `time_to_answer` vào danh sách Input ở Mục 1 `SOLUTION_STRUCTURE.md` | Quỳnh | Cùng đợt với #1 |
| 3 | Quyết định `item_type`: sửa lại nhãn cho khớp nội dung, hay xoá hẳn khỏi JSON. Không được để nguyên trạng sai | Hồng | Trước khi bổ sung batch câu hỏi tiếp theo |
| 4 | Xác nhận engine đo `time_to_answer` bằng timestamp lúc render và lúc submit | Minh | Khi dựng khung engine |
| 5 | Đặt tên biến trong code khớp đúng file này, không tự đặt tên khác | Minh, Trang | Khi dựng khung engine |

---

## 8. Chủ sở hữu

| Nội dung | Người chịu trách nhiệm |
|---|---|
| File này, và việc đồng bộ với `SOLUTION_STRUCTURE.md` | Quỳnh |
| Nghĩa và chất lượng các field trong ngân hàng câu hỏi (Mục 2, Mục 6) | Hồng |
| State variables và cách tính (Mục 3, Mục 4) | Minh |
| Cơ chế sinh Arena đọc đúng các field ở Mục 2, Mục 3 | Trang |
| Nhãn hiển thị trên giao diện không được đổi nghĩa của field | Khôi |
| Phạm vi và ưu tiên khi phải cắt field | Quỳnh |

---

## 9. Giới hạn của file này

- Toàn bộ ngân hàng câu hỏi do nhóm tự biên soạn, tình huống là tình huống giả định. Không phải dữ liệu thật, không trích nguyên văn tài liệu CFA Institute. Chi tiết về nguồn và giới hạn nằm ở `SOURCE_USE_MAP.md`.
- Ngưỡng đỗ 70% và bảng ánh xạ 9 module → 5 cụm là do nhóm tự đặt, chưa đối chiếu với trọng số đề thi thật. Hai điểm này được ghi và giải thích ở `ASSUMPTIONS.md`.
- Mức độ khó 1–3 do nhóm tự đánh giá, chưa qua kiểm định trên người học thật.
