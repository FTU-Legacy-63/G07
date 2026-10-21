**Nhóm 7 · NHA408E · Phiên bản cập nhật bằng `ethics_bank_220.json` (220 câu)**

## 1. KỊCH BẢN 1 — CHUẨN

**Mục đích:** trình diễn toàn bộ 5 màn, phân định W1 và Boss bằng độ khó trung bình câu sai, mở Boss khi có đúng 15 Credit, và xuất bảng O4. **Bắt đầu:** Arena 1 (3 Credit). **Dừng:** bảng tổng kết sau Boss. Không Bùa, không World Quest, không quá giờ.

#### Arena 1 — The Gate

**Mục tiêu:** 11/15 (73,3%) → **ĐỖ** (ngưỡng 70%). C1 và C2 cùng 1/3; C2 có độ khó sai trung bình 2,5 > C1 1,5 ⇒ **W1 = C2**.

| # | `question_id` | Cụm | Độ khó | Đáp án đúng | Bấm | `selected_option` | Đúng/Sai | `timeMs` | `item_used` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `ETH-C1-GIPS-001` | C1 | 1 | B | C | 2 | **Sai** | 30 000 | false |
| 2 | `ETH-C1-CODE-001` | C1 | 2 | B | C | 2 | **Sai** | 30 000 | false |
| 3 | `ETH-C1-GIPS-009` | C1 | 3 | A | A | 0 | Đúng | 30 000 | false |
| 4 | `ETH-C2-S1-003` | C2 | 1 | A | A | 0 | Đúng | 30 000 | false |
| 5 | `ETH-C2-S2-001` | C2 | 2 | B | C | 2 | **Sai** | 30 000 | false |
| 6 | `ETH-C2-S1-002` | C2 | 3 | A | B | 1 | **Sai** | 30 000 | false |
| 7 | `ETH-C3-S3-001` | C3 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 8 | `ETH-C3-S3-002` | C3 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 9 | `ETH-C3-S3-005` | C3 | 3 | A | A | 0 | Đúng | 30 000 | false |
| 10 | `ETH-C4-S4-005` | C4 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 11 | `ETH-C4-S5-001` | C4 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 12 | `ETH-C4-S4-003` | C4 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 13 | `ETH-C5-S6-002` | C5 | 1 | A | A | 0 | Đúng | 30 000 | false |
| 14 | `ETH-C5-S7-001` | C5 | 2 | A | A | 0 | Đúng | 30 000 | false |
| 15 | `ETH-C5-S6-004` | C5 | 3 | B | B | 1 | Đúng | 30 000 | false |

**Tổng màn:** 11/15 = 73,3%; `points_earned / points_offered` = **22/30**.

#### Arena 2 — Trap I

**Mục tiêu:** 8/10 (80%) → **ĐỖ** (ngưỡng 75%). Đủ 4 dễ, 4 vừa, 2 khó; 5 câu module S1 và 5 câu S2. Hai câu sai đều khó.

| # | `question_id` | Cụm | Độ khó | Đáp án đúng | Bấm | `selected_option` | Đúng/Sai | `timeMs` | `item_used` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `ETH-C2-S1-006` | C2 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 2 | `ETH-C2-S2-003` | C2 | 1 | A | A | 0 | Đúng | 30 000 | false |
| 3 | `ETH-C2-S1-001` | C2 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 4 | `ETH-C2-S1-011` | C2 | 3 | C | A | 0 | **Sai** | 30 000 | false |
| 5 | `ETH-C2-S2-002` | C2 | 2 | C | C | 2 | Đúng | 30 000 | false |
| 6 | `ETH-C2-S2-006` | C2 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 7 | `ETH-C2-S2-005` | C2 | 3 | A | B | 1 | **Sai** | 30 000 | false |
| 8 | `ETH-C2-S1-007` | C2 | 1 | A | A | 0 | Đúng | 30 000 | false |
| 9 | `ETH-C2-S2-004` | C2 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 10 | `ETH-C2-S1-004` | C2 | 2 | B | B | 1 | Đúng | 30 000 | false |

**Tổng màn:** 8/10 = 80,0%; `points_earned / points_offered` = **12/18**.

#### Arena 3 — The Crossroads

**Mục tiêu:** 8/10 (80%) → **ĐỖ** (ngưỡng 75%; thời gian tối đa 100 giây/câu). Sau màn, W2 = C1 dựa trên `accuracy_cumulative` đã gồm Arena 2. Câu 4 là `ETH-C1-GIPS-010`, chọn C, không dùng Bùa.

| # | `question_id` | Cụm | Độ khó | Đáp án đúng | Bấm | `selected_option` | Đúng/Sai | `timeMs` | `item_used` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `ETH-C4-S4-001` | C4 | 2 | A | A | 0 | Đúng | 30 000 | false |
| 2 | `ETH-C5-S6-001` | C5 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 3 | `ETH-C2-S1-005` | C2 | 2 | C | C | 2 | Đúng | 30 000 | false |
| 4 | `ETH-C1-GIPS-010` | C1 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 5 | `ETH-C3-S3-027` | C3 | 2 | B | C | 2 | **Sai** | 30 000 | false |
| 6 | `ETH-C2-S2-009` | C2 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 7 | `ETH-C4-S5-004` | C4 | 2 | A | A | 0 | Đúng | 30 000 | false |
| 8 | `ETH-C1-CODE-002` | C1 | 1 | A | B | 1 | **Sai** | 30 000 | false |
| 9 | `ETH-C5-S7-002` | C5 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 10 | `ETH-C3-S3-020` | C3 | 3 | A | A | 0 | Đúng | 30 000 | false |

**Tổng màn:** 8/10 = 80,0%; `points_earned / points_offered` = **18/21**.

#### Arena 4 — Trap II

**Mục tiêu:** 9/10 (90%) → **ĐỖ** (ngưỡng 85%, tối đa 80 giây/câu). Chỉ có câu của W2 = C1; một câu mức dễ cố ý trả lời sai.

| # | `question_id` | Cụm | Độ khó | Đáp án đúng | Bấm | `selected_option` | Đúng/Sai | `timeMs` | `item_used` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `ETH-C1-GIPS-011` | C1 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 2 | `ETH-C1-CODE-003` | C1 | 1 | B | C | 2 | **Sai** | 30 000 | false |
| 3 | `ETH-C1-CODE-009` | C1 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 4 | `ETH-C1-GIPS-014` | C1 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 5 | `ETH-C1-CODE-004` | C1 | 2 | C | C | 2 | Đúng | 30 000 | false |
| 6 | `ETH-C1-GIPS-003` | C1 | 1 | C | C | 2 | Đúng | 30 000 | false |
| 7 | `ETH-C1-GIPS-002` | C1 | 2 | A | A | 0 | Đúng | 30 000 | false |
| 8 | `ETH-C1-CODE-007` | C1 | 2 | C | C | 2 | Đúng | 30 000 | false |
| 9 | `ETH-C1-CODE-010` | C1 | 3 | A | A | 0 | Đúng | 30 000 | false |
| 10 | `ETH-C1-GIPS-004` | C1 | 2 | B | B | 1 | Đúng | 30 000 | false |

**Tổng màn:** 9/10 = 90,0%; `points_earned / points_offered` = **21/22**.

### Ranking sau Arena 4, Boss Gate

| Mốc | C1 | C2 | C3 | C4 | C5 |
|---|---|---|---|---|---|
| Sau Arena 1 | 1/3 = 33,3% | 1/3 = 33,3% | 3/3 = 100,0% | 3/3 = 100,0% | 3/3 = 100,0% |
| Sau Arena 3 | 2/5 = 40,0% | 11/15 = 73,3% | 4/5 = 80,0% | 5/5 = 100,0% | 5/5 = 100,0% |
| Sau Arena 4 | 11/15 = 73,3% | 11/15 = 73,3% | 4/5 = 80,0% | 5/5 = 100,0% | 5/5 = 100,0% |

Sau Arena 1, **W1=C2**: C1 và C2 cùng 1/3, nhưng độ khó trung bình câu sai **2,5 > 1,5**. Sau Arena 3, C1 thấp nhất (**2/5 = 40%**) nên **W2=C1**. Sau Arena 4, C1 = C2 = 11/15; độ khó sai TB của C2 **2,75** lớn hơn C1 **1,25**. Do đó Boss lấy **C2:7, C1:5, C3:3**.

| Bước | Số dư trước | Phát sinh | Số dư sau |
|---|---|---|---|
| Sau Đỗ Arena 4 | 11 | +4 | 15 |
| Mở Boss | 15 | −15 | 0 |

#### Boss — C2 (7), C1 (5), C3 (3)

**Mục tiêu:** 14/15 = 93,3% → **ĐỖ** (ngưỡng 90%, 60 giây/câu). Phân bổ: C2 = (1 dễ, 2 vừa, 4 khó); C1 = (1 dễ, 1 vừa, 3 khó); C3 = (0 dễ, 1 vừa, 2 khó). Chỉ sai câu khó cuối cùng của C3.

| # | `question_id` | Cụm | Độ khó | Đáp án đúng | Bấm | `selected_option` | Đúng/Sai | `timeMs` | `item_used` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `ETH-C2-S1-010` | C2 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 2 | `ETH-C2-S2-013` | C2 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 3 | `ETH-C2-S1-008` | C2 | 2 | C | C | 2 | Đúng | 30 000 | false |
| 4 | `ETH-C2-S2-010` | C2 | 3 | A | A | 0 | Đúng | 30 000 | false |
| 5 | `ETH-C2-S1-014` | C2 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 6 | `ETH-C2-S2-011` | C2 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 7 | `ETH-C2-S1-017` | C2 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 8 | `ETH-C1-GIPS-006` | C1 | 1 | C | C | 2 | Đúng | 30 000 | false |
| 9 | `ETH-C1-CODE-008` | C1 | 2 | A | A | 0 | Đúng | 30 000 | false |
| 10 | `ETH-C1-GIPS-017` | C1 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 11 | `ETH-C1-CODE-011` | C1 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 12 | `ETH-C1-GIPS-018` | C1 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 13 | `ETH-C3-S3-004` | C3 | 2 | C | C | 2 | Đúng | 30 000 | false |
| 14 | `ETH-C3-S3-009` | C3 | 3 | A | A | 0 | Đúng | 30 000 | false |
| 15 | `ETH-C3-S3-021` | C3 | 3 | C | A | 0 | **Sai** | 30 000 | false |

**Tổng màn:** 14/15 = 93,3%; `points_earned / points_offered` = **34/37**.

### Kết quả mong đợi

| Mốc | Kết quả | Chú giải |
|---|---|---|
| Arena 1 | 11/15, Đỗ | W1 = C2, phân định độ khó sai |
| Arena 2 | 8/10, Đỗ | 10 câu C2 |
| Arena 3 | 8/10, Đỗ | W2 = C1, tỷ lệ đúng tích lũy thấp nhất |
| Arena 4 | 9/10, Đỗ | Boss ranking: C2, C1, C3 |
| Boss Gate | 15 Credit | Trừ 15 để mở Boss |
| Boss | 14/15, Đỗ | C2=7/7; C1=5/5; C3=2/3 |

### O4: baseline và sự thay đổi sau Boss

| Cụm | Baseline (Arena 1 + Arena 3) | Boss | `delta` (điểm %) | Nhãn O4 |
|---|---|---|---|---|
| C1 | 2/5 = 40,0% | 5/5 = 100,0% | +60,0 | Đã cải thiện |
| C2 | 3/5 = 60,0% | 7/7 = 100,0% | +40,0 | Đã cải thiện |
| C3 | 4/5 = 80,0% | 2/3 = 66,7% | -13,3 | Cần cải thiện tiếp |
| C4 | 5/5 = 100,0% | Không kiểm tra | — | Không kiểm tra lại ở Boss |
| C5 | 5/5 = 100,0% | Không kiểm tra | — | Không kiểm tra lại ở Boss |

### `points_earned` / `points_offered` và `performance_score`

| Màn | Câu đúng | Số câu | `points_earned` | `points_offered` | Tỷ lệ điểm độ khó |
|---|---|---|---|---|---|
| arena1 | 11 | 15 | 22 | 30 | 73,3% |
| `trap1` (Arena 2) | 8 | 10 | 12 | 18 | 66,7% |
| `crossroads` (Arena 3) | 8 | 10 | 18 | 21 | 85,7% |
| `trap2` (Arena 4) | 9 | 10 | 21 | 22 | 95,5% |
| boss | 14 | 15 | 34 | 37 | 91,9% |
| **Tổng 5 màn** | **50** | **60** | **107** | **128** | **83,6%** |

**`performance_score` theo `buildPerformanceByArena()` và `renderReport()` của `src/cfa_quest_v11.js`: 107/128 = 83,59375%, màn hình hiển thị `Math.round(83,59375)` = **84%**. World Quest không tính. Boss tính lượt hoàn thành đầu tiên, không tính lượt trắng và lượt thoát (`docs/SOLUTION_STRUCTURE.md` mục 5.3). K1 không có lượt trắng nên đó là lượt 1 (14/15).**

### Sổ Credit

| Bước | Thay đổi | Ví sau |
|---|---|---|
| Bắt đầu | — | 3 |
| Đỗ Arena 1 | +2 | 5 |
| Đỗ Arena 2 | +3 | 8 |
| Đỗ Arena 3 | +3 | 11 |
| Đỗ Arena 4 | +4 | 15 |
| Mở Boss | −15 | 0 |
| Thưởng Đỗ Boss | +4 | 4 |
| First-clear bonus | +5 | **9** |

**Lời nói khi present:** “Arena 1, C1 và C2 đều đúng 1/3; các câu sai của C2 có độ khó trung bình cao hơn nên hệ thống chọn C2 làm W1.” “Sau Arena 4, C2 tiếp tục xếp yếu hơn C1 khi cả hai cùng 11/15; Boss vì vậy kiểm tra C2 nhiều hơn.” “Bảng O4 so kết quả Boss với baseline từ Arena 1 và Arena 3, chỉ phản ánh dữ liệu trong trò chơi.”

**Checklist:** [ ] 60 ID khớp bank; [ ] A1=11, A2=8, A3=8, A4=9; [ ] W1=C2, W2=C1; [ ] Boss C2/C1/C3=7/5/3 và 2/4/9; [ ] O4 đủ 5 cụm; [ ] Credit 3→5→8→11→15→0→9; [ ] đối chiếu kết quả engine; [ ] kiểm tra `performance_score`.

**Thời gian diễn tập thực tế:** Chưa đo.

---

## 2. KỊCH BẢN 2 — LẬT PASS/FAIL

**Mục đích:** chỉ sửa câu 15 của Arena 1 so với Kịch bản 1, từ chọn B (đúng) sang A (sai); kiểm tra ngưỡng 70% và dữ liệu chẩn đoán vẫn được ghi nhận. **Bắt đầu:** Arena 1 (3 Credit). **Dừng:** kết quả Trượt Arena 1; Arena 2 chưa mở.

#### Arena 1 — The Gate (biến thể)

**Mục tiêu:** 10/15 (66,7%) → **TRƯỢT**. Câu thay đổi duy nhất: `ETH-C5-S6-004`, độ khó 3, `answer=1` (B), `selected_option=0` (A).

| # | `question_id` | Cụm | Độ khó | Đáp án đúng | Bấm | `selected_option` | Đúng/Sai | `timeMs` | `item_used` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `ETH-C1-GIPS-001` | C1 | 1 | B | C | 2 | **Sai** | 30 000 | false |
| 2 | `ETH-C1-CODE-001` | C1 | 2 | B | C | 2 | **Sai** | 30 000 | false |
| 3 | `ETH-C1-GIPS-009` | C1 | 3 | A | A | 0 | Đúng | 30 000 | false |
| 4 | `ETH-C2-S1-003` | C2 | 1 | A | A | 0 | Đúng | 30 000 | false |
| 5 | `ETH-C2-S2-001` | C2 | 2 | B | C | 2 | **Sai** | 30 000 | false |
| 6 | `ETH-C2-S1-002` | C2 | 3 | A | B | 1 | **Sai** | 30 000 | false |
| 7 | `ETH-C3-S3-001` | C3 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 8 | `ETH-C3-S3-002` | C3 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 9 | `ETH-C3-S3-005` | C3 | 3 | A | A | 0 | Đúng | 30 000 | false |
| 10 | `ETH-C4-S4-005` | C4 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 11 | `ETH-C4-S5-001` | C4 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 12 | `ETH-C4-S4-003` | C4 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 13 | `ETH-C5-S6-002` | C5 | 1 | A | A | 0 | Đúng | 30 000 | false |
| 14 | `ETH-C5-S7-001` | C5 | 2 | A | A | 0 | Đúng | 30 000 | false |
| 15 | `ETH-C5-S6-004` | C5 | 3 | B | A | 0 | **Sai** | 30 000 | false |

**Tổng màn:** 10/15 = 66,7%; `points_earned / points_offered` = **19/30**.

### Kết quả mong đợi

| Chỉ tiêu | K1 | K2 |
|---|---|---|
| Số câu đúng | 11/15 | 10/15 |
| Trạng thái | Đỗ | **Trượt** |
| Credit thưởng | +2 | **0** |
| Ví sau Arena 1 | 5 | 3 |
| Arena 2 | Mở | **Khóa** |
| Chẩn đoán C5 | 3/3 | **2/3** |
| Điểm độ khó | 22/30 | **19/30** |
| W1 | C2 sau khi Đỗ | Chưa công bố khi Trượt |

| Mốc | C1 | C2 | C3 | C4 | C5 |
|---|---|---|---|---|---|
| Sau Arena 1 | 1/3 = 33,3% | 1/3 = 33,3% | 3/3 = 100,0% | 3/3 = 100,0% | 2/3 = 66,7% |

Vì hai cụm C1/C2 vẫn có tỷ lệ đúng bằng 1/3 và độ khó sai 1,5 / 2,5, dữ liệu lượt đầu tiếp tục hỗ trợ **W1=C2 nếu một lượt sau đủ điều kiện công bố W1**. K2 không mô phỏng lượt retry. Không có bảng O4 và **chưa có `performance_score` toàn lượt** vì chưa hoàn thành 5 Arena; số **19/30** chỉ là `performance_by_arena.arena1` cho lượt này.

### Sổ Credit

| Bước | Thay đổi | Ví sau |
|---|---|---|
| Bắt đầu | — | 3 |
| Trượt Arena 1 | +0 | 3 |

**Lời nói khi present:** “Hai kịch bản chỉ khác nhau ở đáp án câu 15: B thành A. Từ 11 câu đúng giảm còn 10, tỷ lệ đúng dưới 70% nên Arena 1 trượt và không nhận Credit.” “Hệ thống vẫn có dữ liệu chẩn đoán của lượt đầu, nhưng W1 chưa được công bố vì người chơi chưa qua Arena 1.”

**Checklist:** [ ] chỉ một lựa chọn khác K1; [ ] 10/15; [ ] 19/30; [ ] ví 3; [ ] Arena 2 khóa; [ ] so engine. **Thời gian diễn tập:** Chưa đo.

---

## 3. KỊCH BẢN 3 — HÒA ĐIỂM, PHÂN ĐỊNH BẰNG THỜI GIAN

**Mục đích:** kiểm chứng W1 được phân định ở bước thời gian sau khi hai cụm hòa tỷ lệ đúng và độ khó trung bình câu sai. **Bắt đầu:** Arena 1 (3 Credit). **Dừng:** kết quả Arena 1 và W1.

#### Arena 1 — The Gate (biến thể hòa điểm)

**Mục tiêu:** 11/15 (73,3%) → **ĐỖ**. Sáu dòng đầu được thay lựa chọn theo yêu cầu; câu C1 trả lời trong 30 giây, C2 trong 45 giây. Từ câu 7–15 như K1.

| # | `question_id` | Cụm | Độ khó | Đáp án đúng | Bấm | `selected_option` | Đúng/Sai | `timeMs` | `item_used` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `ETH-C1-GIPS-001` | C1 | 1 | B | A | 0 | **Sai** | 30 000 | false |
| 2 | `ETH-C1-CODE-001` | C1 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 3 | `ETH-C1-GIPS-009` | C1 | 3 | A | B | 1 | **Sai** | 30 000 | false |
| 4 | `ETH-C2-S1-003` | C2 | 1 | A | B | 1 | **Sai** | 45 000 | false |
| 5 | `ETH-C2-S2-001` | C2 | 2 | B | B | 1 | Đúng | 45 000 | false |
| 6 | `ETH-C2-S1-002` | C2 | 3 | A | B | 1 | **Sai** | 45 000 | false |
| 7 | `ETH-C3-S3-001` | C3 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 8 | `ETH-C3-S3-002` | C3 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 9 | `ETH-C3-S3-005` | C3 | 3 | A | A | 0 | Đúng | 30 000 | false |
| 10 | `ETH-C4-S4-005` | C4 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 11 | `ETH-C4-S5-001` | C4 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 12 | `ETH-C4-S4-003` | C4 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 13 | `ETH-C5-S6-002` | C5 | 1 | A | A | 0 | Đúng | 30 000 | false |
| 14 | `ETH-C5-S7-001` | C5 | 2 | A | A | 0 | Đúng | 30 000 | false |
| 15 | `ETH-C5-S6-004` | C5 | 3 | B | B | 1 | Đúng | 30 000 | false |

**Tổng màn:** 11/15 = 73,3%; `points_earned / points_offered` = **22/30**.

### Bốn bước xác định W1

| Bước | C1 | C2 | Kết quả |
|---|---|---|---|
| 1. Tỷ lệ đúng | 1/3 | 1/3 | Hòa |
| 2. Độ khó TB câu sai | (1+3)/2 = 2,0 | (1+3)/2 = 2,0 | Hòa |
| 3. Thời gian TB mọi câu | 30 giây | 45 giây | **W1=C2** |
| 4. Thứ tự mã C1–C5 | Không cần | Không cần | Bước 3 đã quyết định |

| Mốc | C1 | C2 | C3 | C4 | C5 |
|---|---|---|---|---|---|
| Sau Arena 1 | 1/3 = 33,3% | 1/3 = 33,3% | 3/3 = 100,0% | 3/3 = 100,0% | 3/3 = 100,0% |

**`points_earned / points_offered`: 22/30** (chưa có `performance_score` toàn lượt vì kịch bản dừng ở Arena 1); Arena 1 Đỗ, thưởng +2 Credit → ví 5. W1 = C2 do **thời gian trả lời trung bình dài hơn**, không phải do bốc thăm.

### Sổ Credit

| Bước | Thay đổi | Ví sau |
|---|---|---|
| Bắt đầu | — | 3 |
| Đỗ Arena 1 | +2 | 5 |

**Lời nói khi present:** “C1 và C2 đều đúng 1/3 và cùng có độ khó trung bình câu sai bằng 2,0.” “Engine phải xét bước tiếp theo: thời gian trung bình C2 là 45 giây, C1 là 30 giây, vì thế C2 được chọn làm W1.” “Ở chế độ demo, `timeMs` là dữ liệu cố định; thời gian người chơi thật có thể biến thiên khi chuyển tab.”

**Biến thể ngoài menu demo:** Nếu đổi thời gian câu 4–6 thành 30 000 ms, W1 sẽ là C1 theo thứ tự mã cụm. Chỉ dùng cho test T-G17, không thêm kịch bản thứ năm.

**Checklist:** [ ] câu 1–6 đúng lời giải ngân hàng; [ ] C1/C2=1/3; [ ] độ khó sai TB cùng 2,0; [ ] C2=45 giây, C1=30 giây; [ ] W1=C2; [ ] 22/30; [ ] ví 5; [ ] so engine. **Thời gian diễn tập:** Chưa đo.

---

## 4. KỊCH BẢN 4 — BẬT/TẮT BÙA LOẠI TRỪ

**Mục đích:** so với K1, chỉ dùng Bùa ở Arena 3 câu 4 (`ETH-C1-GIPS-010`, vẫn trả lời C đúng), khiến điểm Đỗ/Trượt không đổi nhưng chẩn đoán và điểm độ khó thay đổi. Vì mua Bùa mất 3 Credit, cần World Quest trước Boss. **Bắt đầu:** Arena 1 (3 Credit). **Dừng:** bảng O4 sau Boss.

#### Arena 1 — The Gate (giống K1)

**Mục tiêu:** 11/15 → ĐỖ. Toàn bộ mã câu, thứ tự, lựa chọn và thời gian giống K1.

| # | `question_id` | Cụm | Độ khó | Đáp án đúng | Bấm | `selected_option` | Đúng/Sai | `timeMs` | `item_used` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `ETH-C1-GIPS-001` | C1 | 1 | B | C | 2 | **Sai** | 30 000 | false |
| 2 | `ETH-C1-CODE-001` | C1 | 2 | B | C | 2 | **Sai** | 30 000 | false |
| 3 | `ETH-C1-GIPS-009` | C1 | 3 | A | A | 0 | Đúng | 30 000 | false |
| 4 | `ETH-C2-S1-003` | C2 | 1 | A | A | 0 | Đúng | 30 000 | false |
| 5 | `ETH-C2-S2-001` | C2 | 2 | B | C | 2 | **Sai** | 30 000 | false |
| 6 | `ETH-C2-S1-002` | C2 | 3 | A | B | 1 | **Sai** | 30 000 | false |
| 7 | `ETH-C3-S3-001` | C3 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 8 | `ETH-C3-S3-002` | C3 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 9 | `ETH-C3-S3-005` | C3 | 3 | A | A | 0 | Đúng | 30 000 | false |
| 10 | `ETH-C4-S4-005` | C4 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 11 | `ETH-C4-S5-001` | C4 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 12 | `ETH-C4-S4-003` | C4 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 13 | `ETH-C5-S6-002` | C5 | 1 | A | A | 0 | Đúng | 30 000 | false |
| 14 | `ETH-C5-S7-001` | C5 | 2 | A | A | 0 | Đúng | 30 000 | false |
| 15 | `ETH-C5-S6-004` | C5 | 3 | B | B | 1 | Đúng | 30 000 | false |

**Tổng màn:** 11/15 = 73,3%; `points_earned / points_offered` = **22/30**.

#### Arena 2 — Trap I (giống K1)

**Mục tiêu:** 8/10 → ĐỖ. Sau màn này ví = 8; mua 1 Bùa Loại Trừ giá 3 trước khi dùng ở Arena 3, còn 5 Credit.

| # | `question_id` | Cụm | Độ khó | Đáp án đúng | Bấm | `selected_option` | Đúng/Sai | `timeMs` | `item_used` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `ETH-C2-S1-006` | C2 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 2 | `ETH-C2-S2-003` | C2 | 1 | A | A | 0 | Đúng | 30 000 | false |
| 3 | `ETH-C2-S1-001` | C2 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 4 | `ETH-C2-S1-011` | C2 | 3 | C | A | 0 | **Sai** | 30 000 | false |
| 5 | `ETH-C2-S2-002` | C2 | 2 | C | C | 2 | Đúng | 30 000 | false |
| 6 | `ETH-C2-S2-006` | C2 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 7 | `ETH-C2-S2-005` | C2 | 3 | A | B | 1 | **Sai** | 30 000 | false |
| 8 | `ETH-C2-S1-007` | C2 | 1 | A | A | 0 | Đúng | 30 000 | false |
| 9 | `ETH-C2-S2-004` | C2 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 10 | `ETH-C2-S1-004` | C2 | 2 | B | B | 1 | Đúng | 30 000 | false |

**Tổng màn:** 8/10 = 80,0%; `points_earned / points_offered` = **12/18**.

#### Arena 3 — The Crossroads (có Bùa)

**Mục tiêu:** 8/10 → ĐỖ. Dòng 4: `ETH-C1-GIPS-010`, `answer=C`, `selected_option=2`, `item_used=true`; mọi thuộc tính khác giống K1. Điểm Đỗ/Trượt giữ nguyên; câu đúng có Bùa loại khỏi chẩn đoán và tử số điểm độ khó.

| # | `question_id` | Cụm | Độ khó | Đáp án đúng | Bấm | `selected_option` | Đúng/Sai | `timeMs` | `item_used` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `ETH-C4-S4-001` | C4 | 2 | A | A | 0 | Đúng | 30 000 | false |
| 2 | `ETH-C5-S6-001` | C5 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 3 | `ETH-C2-S1-005` | C2 | 2 | C | C | 2 | Đúng | 30 000 | false |
| 4 | `ETH-C1-GIPS-010` | C1 | 3 | C | C | 2 | Đúng | 30 000 | true |
| 5 | `ETH-C3-S3-027` | C3 | 2 | B | C | 2 | **Sai** | 30 000 | false |
| 6 | `ETH-C2-S2-009` | C2 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 7 | `ETH-C4-S5-004` | C4 | 2 | A | A | 0 | Đúng | 30 000 | false |
| 8 | `ETH-C1-CODE-002` | C1 | 1 | A | B | 1 | **Sai** | 30 000 | false |
| 9 | `ETH-C5-S7-002` | C5 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 10 | `ETH-C3-S3-020` | C3 | 3 | A | A | 0 | Đúng | 30 000 | false |

**Tổng màn:** 8/10 = 80,0%; `points_earned / points_offered` = **15/21**.

#### Arena 4 — Trap II (giống K1)

**Mục tiêu:** 9/10 → ĐỖ. Sau Arena 4 ví = 12, chưa đủ 15 để mở Boss.

| # | `question_id` | Cụm | Độ khó | Đáp án đúng | Bấm | `selected_option` | Đúng/Sai | `timeMs` | `item_used` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `ETH-C1-GIPS-011` | C1 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 2 | `ETH-C1-CODE-003` | C1 | 1 | B | C | 2 | **Sai** | 30 000 | false |
| 3 | `ETH-C1-CODE-009` | C1 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 4 | `ETH-C1-GIPS-014` | C1 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 5 | `ETH-C1-CODE-004` | C1 | 2 | C | C | 2 | Đúng | 30 000 | false |
| 6 | `ETH-C1-GIPS-003` | C1 | 1 | C | C | 2 | Đúng | 30 000 | false |
| 7 | `ETH-C1-GIPS-002` | C1 | 2 | A | A | 0 | Đúng | 30 000 | false |
| 8 | `ETH-C1-CODE-007` | C1 | 2 | C | C | 2 | Đúng | 30 000 | false |
| 9 | `ETH-C1-CODE-010` | C1 | 3 | A | A | 0 | Đúng | 30 000 | false |
| 10 | `ETH-C1-GIPS-004` | C1 | 2 | B | B | 1 | Đúng | 30 000 | false |

**Tổng màn:** 9/10 = 90,0%; `points_earned / points_offered` = **21/22**.

### Cumulative và tác động của Bùa

| Mốc | C1 | C2 | C3 | C4 | C5 |
|---|---|---|---|---|---|
| Sau Arena 1 | 1/3 = 33,3% | 1/3 = 33,3% | 3/3 = 100,0% | 3/3 = 100,0% | 3/3 = 100,0% |
| Sau Arena 3 | 1/4 = 25,0% | 11/15 = 73,3% | 4/5 = 80,0% | 5/5 = 100,0% | 5/5 = 100,0% |
| Sau Arena 4 | 10/14 = 71,4% | 11/15 = 73,3% | 4/5 = 80,0% | 5/5 = 100,0% | 5/5 = 100,0% |


| Chỉ tiêu | K1 (không Bùa) | K4 (có Bùa) |
|---|---|---|
| Arena 3 | 8/10 Đỗ | **8/10 Đỗ** |
| Chẩn đoán C1 ở Arena 3 | 1/2 | **0/1** |
| C1 tích lũy sau Arena 3 | 2/5=40,0% | **1/4=25,0%** |
| C1 tích lũy sau Arena 4 | 11/15=73,3% | **10/14=71,4%** |
| C2 tích lũy sau Arena 4 | 11/15=73,3% | 11/15=73,3% |
| W2 | C1 | C1 |
| Ba cụm Boss | C2:7, C1:5, C3:3 | **C1:7, C2:5, C3:3** |
| Điểm độ khó Arena 3 | 18/21 | **15/21** |
| Ví sau Arena 4 | 15 | 12 |

### World Quest — kiếm đủ Credit để mở Boss

#### World Quest — C1 (5), C2 (5), C3 (5)

**Mục tiêu:** 12/15 → nhận **+3 Credit** theo bảng thưởng nêu trong yêu cầu. Sử dụng 15 mã câu đã xuất hiện ở Arena 1–4 (được phép lặp riêng tại World Quest), không Bùa, không áp dụng ngưỡng Đỗ/Trượt.

| # | `question_id` | Cụm | Độ khó | Đáp án đúng | Bấm | `selected_option` | Đúng/Sai | `timeMs` | `item_used` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `ETH-C1-GIPS-001` | C1 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 2 | `ETH-C1-CODE-001` | C1 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 3 | `ETH-C1-GIPS-009` | C1 | 3 | A | A | 0 | Đúng | 30 000 | false |
| 4 | `ETH-C1-GIPS-010` | C1 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 5 | `ETH-C1-GIPS-011` | C1 | 3 | C | A | 0 | **Sai** | 30 000 | false |
| 6 | `ETH-C2-S1-003` | C2 | 1 | A | A | 0 | Đúng | 30 000 | false |
| 7 | `ETH-C2-S2-001` | C2 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 8 | `ETH-C2-S1-002` | C2 | 3 | A | A | 0 | Đúng | 30 000 | false |
| 9 | `ETH-C2-S1-006` | C2 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 10 | `ETH-C2-S1-005` | C2 | 2 | C | A | 0 | **Sai** | 30 000 | false |
| 11 | `ETH-C3-S3-001` | C3 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 12 | `ETH-C3-S3-002` | C3 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 13 | `ETH-C3-S3-005` | C3 | 3 | A | A | 0 | Đúng | 30 000 | false |
| 14 | `ETH-C3-S3-027` | C3 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 15 | `ETH-C3-S3-020` | C3 | 3 | A | B | 1 | **Sai** | 30 000 | false |

**Tổng màn:** 12/15 = 80,0%, thưởng +3 Credit. World Quest không vào `performance_score`.

World Quest đúng lần lượt **C1=4/5, C2=4/5, C3=4/5**. Các câu World Quest không được trộn vào các mốc `accuracy_cumulative` Arena ở bảng bên trên. Credit 12 → 15 → trừ 15 mở Boss → 0.

#### Boss — C1 (7), C2 (5), C3 (3)

**Mục tiêu:** 14/15 = 93,3% → **ĐỖ**. C1 nhận (1/2/4), C2 (1/1/3), C3 (0/1/2). Sai một câu khó C3. Không lặp câu World Quest hoặc Arena 1–4; tối đa 60 giây/câu.

| # | `question_id` | Cụm | Độ khó | Đáp án đúng | Bấm | `selected_option` | Đúng/Sai | `timeMs` | `item_used` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `ETH-C1-GIPS-006` | C1 | 1 | C | C | 2 | Đúng | 30 000 | false |
| 2 | `ETH-C1-CODE-008` | C1 | 2 | A | A | 0 | Đúng | 30 000 | false |
| 3 | `ETH-C1-GIPS-017` | C1 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 4 | `ETH-C1-CODE-011` | C1 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 5 | `ETH-C1-GIPS-018` | C1 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 6 | `ETH-C1-GIPS-005` | C1 | 2 | A | A | 0 | Đúng | 30 000 | false |
| 7 | `ETH-C1-CODE-014` | C1 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 8 | `ETH-C2-S1-010` | C2 | 1 | B | B | 1 | Đúng | 30 000 | false |
| 9 | `ETH-C2-S2-013` | C2 | 2 | B | B | 1 | Đúng | 30 000 | false |
| 10 | `ETH-C2-S2-010` | C2 | 3 | A | A | 0 | Đúng | 30 000 | false |
| 11 | `ETH-C2-S1-014` | C2 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 12 | `ETH-C2-S2-011` | C2 | 3 | C | C | 2 | Đúng | 30 000 | false |
| 13 | `ETH-C3-S3-004` | C3 | 2 | C | C | 2 | Đúng | 30 000 | false |
| 14 | `ETH-C3-S3-009` | C3 | 3 | A | A | 0 | Đúng | 30 000 | false |
| 15 | `ETH-C3-S3-021` | C3 | 3 | C | A | 0 | **Sai** | 30 000 | false |

**Tổng màn:** 14/15 = 93,3%; `points_earned / points_offered` = **34/37**.

### Kết quả mong đợi và O4

| Cụm | Baseline (Arena 1 + Arena 3) | Boss | `delta` (điểm %) | Nhãn O4 |
|---|---|---|---|---|
| C1 | 1/4 = 25,0% | 7/7 = 100,0% | +75,0 | Đã cải thiện |
| C2 | 3/5 = 60,0% | 5/5 = 100,0% | +40,0 | Đã cải thiện |
| C3 | 4/5 = 80,0% | 2/3 = 66,7% | -13,3 | Cần cải thiện tiếp |
| C4 | 5/5 = 100,0% | Không kiểm tra | — | Không kiểm tra lại ở Boss |
| C5 | 5/5 = 100,0% | Không kiểm tra | — | Không kiểm tra lại ở Boss |

| Màn | Câu đúng | Số câu | `points_earned` | `points_offered` | Tỷ lệ điểm độ khó |
|---|---|---|---|---|---|
| arena1 | 11 | 15 | 22 | 30 | 73,3% |
| `trap1` (Arena 2) | 8 | 10 | 12 | 18 | 66,7% |
| `crossroads` (Arena 3) | 8 | 10 | 15 | 21 | 71,4% |
| `trap2` (Arena 4) | 9 | 10 | 21 | 22 | 95,5% |
| boss | 14 | 15 | 34 | 37 | 91,9% |
| **Tổng 5 màn** | **50** | **60** | **104** | **128** | **81,2%** |

**`performance_score` theo `buildPerformanceByArena()` và `renderReport()` của `src/cfa_quest_v11.js`: 104/128 = 81,25%, màn hình hiển thị `Math.round(81,25)` = **81%**. World Quest không tính. Khác K1 đúng **−3 điểm earned** do câu C1 khó dùng Bùa tại Arena 3; offered không đổi.**

**Đối chiếu với hàm engine:** K1 = 107/128 → **84%**; K4 = 104/128 → **81%**. Hai tỷ lệ là kết quả chính xác của công thức hiện hành; bước còn thiếu là kiểm thử tích hợp UI và dữ liệu cố định.

### Sổ Credit

| Bước | Thay đổi | Ví sau |
|---|---|---|
| Bắt đầu | — | 3 |
| Đỗ Arena 1 | +2 | 5 |
| Đỗ Arena 2 | +3 | 8 |
| Mua 1 Bùa | −3 | 5 |
| Đỗ Arena 3 | +3 | 8 |
| Đỗ Arena 4 | +4 | 12 |
| World Quest 12/15 | +3 | 15 |
| Mở Boss | −15 | 0 |
| Đỗ Boss | +4 | 4 |
| First-clear bonus | +5 | **9** |

**Khi present:** “Arena 3 câu 4 dùng Bùa nhưng vẫn chọn đúng C; Arena vẫn Đỗ 8/10 như kịch bản chuẩn.” “Vì câu đúng có Bùa bị loại khỏi chẩn đoán nên C1 trở thành cụm yếu nhất và được kiểm tra 7 câu Boss thay vì 5.” “Mua Bùa làm ví chỉ còn 12 Credit sau Arena 4, người chơi cần World Quest để nhận thêm 3 Credit rồi mới mở Boss.”

**Checklist:** [ ] 45 câu Arena giống K1, chỉ một `item_used` đổi thành true; [ ] 8/10 Arena 3 nhưng 15/21 điểm độ khó; [ ] C1 1/4 sau A3, 10/14 sau A4; [ ] WQ 15 câu đúng 5/5/5 và 12/15 kết quả, +3 Credit; [ ] Boss 7/5/3 và 2/4/9 không lặp; [ ] tổng điểm độ khó 104/128; [ ] O4 đủ 5 cụm; [ ] ví cuối 9; [ ] so engine.

---

## Phụ lục A — Bảng kỳ vọng kỹ thuật để đối chiếu `src/cfa_quest_v11.js`

Dữ liệu dưới đây là **kết quả tính từ chính luật/công thức code đã gửi**, không phải log chứng minh rằng lớp game demo mới đã được chạy. Dùng để lập trình nút **Chạy kịch bản** và kiểm thử so sánh.

| Chỉ tiêu | K1 — Chuẩn | K2 — Lật trượt | K3 — Hòa thời gian | K4 — Dùng Bùa |
|---|---|---|---|---|
| Mốc dừng | Tổng kết sau Boss | Kết quả Arena 1 | Kết quả Arena 1 | Tổng kết sau Boss |
| W1 | C2 — trung bình độ khó sai | chưa công bố (đang trượt) | C2 — thời gian TB 45s > 30s | C2 — trung bình độ khó sai |
| W2 | C1 | chưa có | chưa có | C1 |
| Boss clusters | C2(7), C1(5), C3(3) | chưa có | chưa có | C1(7), C2(5), C3(3) |
| `points_earned/offered` Arena 1 | 22/30 | 19/30 | 22/30 | 22/30 |
| Arena 2 | 12/18 | — | — | 12/18 |
| Arena 3 | 18/21 | — | — | 15/21 |
| Arena 4 | 21/22 | — | — | 21/22 |
| Boss | 34/37 | — | — | 34/37 |
| `performance_score` trên màn tổng kết | **84% (107/128)** | Chưa có | Chưa có | **81% (104/128)** |
| World Quest | Không | Không | Không | 12/15, +3 Credit |
| Ví cuối tại điểm dừng | **9** | **3** | **5** | **9** |
| Lượt trắng Boss | 0 | Không chơi | Không chơi | 0 |

**Hai bộ đếm khác nhau của câu dùng Bùa:** Arena 3 câu 4 của K4 có `selected_option=2` (C) = đáp án đúng, vì vậy `arena_score_correct` vẫn bằng 8/10; song câu này bị loại khỏi cả tử và mẫu `accuracy_cumulative` của C1. Ở `performance_score`, độ khó 3 của câu đó vẫn nằm trong `points_offered` nhưng không vào `points_earned`.

### Các chuỗi giải thích engine cần trả về

- **K1, K4 sau Arena 1:** W1 = C2, phân định theo `độ khó trung bình của câu làm sai cao hơn` (C2 2,50; C1 1,50).
- **K3 sau Arena 1:** W1 = C2, phân định theo `thời gian trả lời trung bình dài hơn` (C2 45,0 giây; C1 30,0 giây), sau khi đã hòa tỷ lệ đúng và độ khó câu sai.
- **K1, K4 sau Arena 3:** W2 = C1 vì có tỷ lệ đúng thấp nhất khi loại W1 = C2; K1 C1 2/5 = 40%, K4 C1 1/4 = 25%.
- **K1 sau Arena 4:** C2 xếp yếu nhất do C2 và C1 đều 11/15, nhưng độ khó trung bình câu sai của C2 = 2,75, cao hơn C1 = 1,25.
- **K4 sau Arena 4:** C1 xếp yếu nhất do tỷ lệ đúng 10/14 = 71,4% thấp hơn C2 11/15 = 73,3%; không áp dụng tie-break để chọn C1 ở bước này.

### Dữ liệu cần so sánh sau khi code demo

`points_offered` tiêu chuẩn luôn 30/18/21/22/37; `points_earned` là 22/12/18/21/34 (K1) và 22/12/15/21/34 (K4). Theo `renderReport()`, tổng điểm có trọng số phải hiện 84% / 81% chứ không làm tròn một chữ số thập phân. Theo `conclude()`, C1/C2 được nhãn **Đã cải thiện**, C3 **Cần cải thiện tiếp**, C4/C5 **Không kiểm tra lại ở Boss** ở cả K1 và K4.


