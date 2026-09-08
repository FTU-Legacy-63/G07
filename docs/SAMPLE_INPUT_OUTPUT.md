# SAMPLE_INPUT_OUTPUT

**Sản phẩm:** CFA Quest — Ethics diagnostic dungeon  
**Học phần:** NHA408E · Nhóm 7  
**Mục tiêu Week 4:** chứng minh nhóm **dự đoán được output trước khi chạy sản phẩm** — từ 15 dòng input của Arena 1 suy ra được toàn bộ hành trình 5 Arena và bảng tổng kết cuối.

> Đây là **simulated data** để test logic. Không phải dữ liệu người học thật và không được dùng làm problem evidence.

---

## 0. Data structure dùng cho prototype

### Question bank
- Format: JSON array, nhúng trong `questions.js` để sản phẩm chạy được khi mở trực tiếp bằng trình duyệt.
- Nguồn: `ethics_bank_110.json`.
- Field chính dùng lúc chạy: `id, cluster, module, difficulty, stem, options, answer, distractor_reason, hint, explanation`.

### Runtime response record

```json
{
  "question_id": "ETH-C2-S1-003",
  "arena": "arena1",
  "attempt_index": 1,
  "selected_option": 0,
  "time_to_answer": 31,
  "item_used": false,
  "item_type_used": "none"
}
```

`arena` và `attempt_index` là hai field bắt buộc mới so với bản Week 3: không có `arena` thì không dựng được `accuracy_by_arena`, không có `attempt_index` thì không thực hiện được quy tắc "mốc chẩn đoán ghi theo lượt đầu".

Các state variable như `diagnostic_correct`, `accuracy_cumulative`, `credit_balance` **không phải input thô**; hệ thống tính từ question bank + response record.

---

## 1. Data flow

```text
ethics_bank_110.json (nhúng trong questions.js)
        +
User action / system timestamps
        ↓
Runtime response records  (kèm arena, attempt_index)
        ↓
Validation
        ↓
Join response với question bank theo question_id
        ↓
Check selected_option == answer
        ↓
┌──────────────┬────────────────────────┬─────────────────────┐
│ (2) arena_   │ (1) diagnostic_correct │ (3) performance_    │
│ score_correct│     /_attempted        │     by_arena        │
│ tính cả item │ loại câu dùng item     │ tử loại / mẫu tính  │
└──────────────┴────────────────────────┴─────────────────────┘
        ↓                ↓                        ↓
      O3           accuracy_cumulative      performance_score
                          ↓                        ↓
                   Rank weakness ─→ O2             │
                          ↓                        │
                   accuracy_by_arena ──────────────┘
                          ↓
                    O1  và  O4
```

---

## 2. Sample simulated input — Arena 1, lượt 1

Cấu trúc bắt buộc: **15 câu = 3 câu × 5 cụm**, mỗi cụm đủ 3 mức khó, rải hết các module trong cụm, và **không câu nào được dùng vật phẩm** (Mục 8 `SOLUTION_STRUCTURE.md`, ràng buộc số 1).

| # | Question ID | Cluster | Module | Difficulty | Correct option | Selected | Time (s) | Item used | Result |
|---|---|---|---|---:|---:|---:|---:|---|---|
| 1 | ETH-C1-GIPS-001 | C1 | GIPS | 1 | 1 | 1 | 24 | no | correct |
| 2 | ETH-C1-CODE-002 | C1 | CODE | 2 | 0 | 2 | 41 | no | wrong |
| 3 | ETH-C1-GIPS-010 | C1 | GIPS | 3 | 2 | 2 | 19 | no | correct |
| 4 | ETH-C2-S1-003 | C2 | S1 | 1 | 0 | 1 | 48 | no | wrong |
| 5 | ETH-C2-S1-005 | C2 | S1 | 2 | 2 | 2 | 37 | no | correct |
| 6 | ETH-C2-S2-009 | C2 | S2 | 3 | 2 | 0 | 52 | no | wrong |
| 7 | ETH-C3-S3-001 | C3 | S3 | 1 | 1 | 1 | 29 | no | correct |
| 8 | ETH-C3-S3-002 | C3 | S3 | 2 | 1 | 1 | 33 | no | correct |
| 9 | ETH-C3-S3-005 | C3 | S3 | 3 | 0 | 2 | 44 | no | wrong |
|10 | ETH-C4-S4-001 | C4 | S4 | 2 | 0 | 0 | 22 | no | correct |
|11 | ETH-C4-S5-002 | C4 | S5 | 1 | 2 | 2 | 25 | no | correct |
|12 | ETH-C4-S5-003 | C4 | S5 | 3 | 2 | 2 | 36 | no | correct |
|13 | ETH-C5-S6-002 | C5 | S6 | 1 | 0 | 0 | 20 | no | correct |
|14 | ETH-C5-S6-003 | C5 | S6 | 2 | 2 | 1 | 46 | no | wrong |
|15 | ETH-C5-S7-010 | C5 | S7 | 3 | 1 | 1 | 28 | no | correct |

**Hai thay đổi so với bản Week 3 của file này:**
- Dòng 2 đổi `difficulty` từ 1 sang 2. Bản cũ cho C1 hai câu mức 1 và không có câu mức 2, vi phạm quy tắc "mỗi cụm đủ 3 mức khó" ở Mục 4.
- Dòng 5 bỏ vật phẩm. Bản cũ cho câu này dùng hint trong Arena 1, mâu thuẫn trực tiếp với ràng buộc "Arena 1 không được dùng vật phẩm". Phần minh hoạ cơ chế loại câu dùng vật phẩm chuyển xuống **Mục 8**, đặt ở Crossroads là nơi vật phẩm được phép.

---

## 3. Expected process — tính tay

### 3.1 Arena score — công thức (2)

- Correct (tính cả câu dùng vật phẩm, ở đây không có): **10/15 = 66,7%**
- Vì `< 70%` → **FAIL**, Credit nhận: **0**

Người học phải chơi lại Arena 1 với bộ câu rút mới. Theo `ASSUMPTIONS.md` B12, **mốc chẩn đoán và `performance_score` vẫn ghi theo lượt 1 này**, còn điểm số và Credit ghi theo lượt đỗ. Toàn bộ chuỗi sinh đề ở Mục 4–6 dưới đây chạy trên dữ liệu lượt 1.

### 3.2 `accuracy_by_arena` sau Arena 1

Không câu nào dùng vật phẩm nên bộ đếm chẩn đoán trùng số câu thô.

| Cluster | correct | attempted | Accuracy |
|---|---:|---:|---:|
| C1 | 2 | 3 | 66,7% |
| C2 | 1 | 3 | **33,3%** |
| C3 | 2 | 3 | 66,7% |
| C4 | 3 | 3 | 100,0% |
| C5 | 2 | 3 | 66,7% |

`accuracy_cumulative` tại thời điểm này bằng đúng bảng trên vì mới có một Arena.

**W1 = C2** — Accuracy thấp nhất, không phải xử lý tie-break.

### 3.3 Diagnostic theo module

| Module | correct | attempted | Accuracy |
|---|---:|---:|---:|
| GIPS | 2 | 2 | 100,0% |
| CODE | 0 | 1 | 0,0% |
| S1 | 1 | 2 | 50,0% |
| S2 | 0 | 1 | 0,0% |
| S3 | 2 | 3 | 66,7% |
| S4 | 1 | 1 | 100,0% |
| S5 | 2 | 2 | 100,0% |
| S6 | 1 | 2 | 50,0% |
| S7 | 1 | 1 | 100,0% |

### 3.4 `performance_by_arena` cho Arena 1 — công thức (3)

`DIFFICULTY_POINTS = {1: 1, 2: 2, 3: 3}`

- `points_earned` — cộng độ khó của câu **đúng và không dùng vật phẩm**: dòng 1(1) + 3(3) + 5(2) + 7(1) + 8(2) + 10(2) + 11(1) + 12(3) + 13(1) + 15(3) = **19**
- `points_offered` — cộng độ khó của **mọi** câu đã hỏi: 5 cụm × (1+2+3) = **30**

```js
performance_by_arena["arena1"] = { points_earned: 19, points_offered: 30 }
```

> **Điểm kiểm tra tự động:** `points_offered` của Arena 1 phải bằng 30 với mọi người chơi. Sample này thoả. Nếu engine trả về số khác, lỗi nằm ở khâu sinh đề Arena 1, không nằm ở khâu tính điểm.

Arena 1 riêng lẻ: 19/30 = 63,3%. Con số này **không phải** `performance_score` — chỉ số cuối cùng cộng gộp cả 5 Arena, tính ở Mục 6.

---

## 4. Expected output sau Arena 1

### O1 — Weakness Profile

```text
C1  66.7%   (2/3)
C2  33.3%   (1/3)  ← weakest
C3  66.7%   (2/3)
C4 100.0%   (3/3)
C5  66.7%   (2/3)
```

Bảng module phải cho thấy C2 yếu ở cả S1 (50%) và S2 (0%).

### O2 — Targeted Arena

```text
target_cluster = "C2"
question_count = 10
module_distribution = S1: 5, S2: 5
exclude = used_question_ids   // 15 id của Arena 1
```

Engine phải: lọc bank với `cluster == "C2"` → loại các `id` đã dùng → lấy 5 câu S1 + 5 câu S2 → nếu thiếu một module thì bù từ module còn lại và ghi log.

### O3 — Arena result

```text
Arena 1 · lượt 1
Score: 10/15 = 66.7%
Status: FAIL — chơi lại, Arena 2 bị khoá
Credit earned: 0
Weakest cluster: C2 (Standards I–II)
Incorrect questions: #2, #4, #6, #9, #14
```

Với từng câu sai, O3 phải có: stem · phương án người học chọn · đáp án đúng · `distractor_reason[selected_option]` · `explanation` · trạng thái vật phẩm.

---

## 5. Chuỗi hành trình đầy đủ — dự đoán trước khi chạy

Đây là phần Week 4 yêu cầu: **một đường đi hoàn chỉnh từ input tới output cuối, dự đoán được bằng tay.** Số liệu Arena 2–5 dưới đây là giả định của kịch bản, không tính ra từ Mục 2; nhưng **mọi bước chuyển giữa chúng đều bị luật ràng buộc và phải tính ra đúng như bảng.**

| Bước | Sự kiện | `accuracy_cumulative` sau bước đó | Kết luận engine phải ra |
|---|---|---|---|
| 1 | Arena 1: C1 2/3 · C2 1/3 · C3 2/3 · C4 3/3 · C5 2/3 | C2 = 33,3% thấp nhất | **W1 = C2** |
| 2 | Trap I: 10 câu C2 (5 S1 + 5 S2), đúng 7 → 7/10 = 70% PASS, +2 Credit | C2 = 8/13 = 61,5% | — |
| 3 | Crossroads: 2 câu/cụm — C1 1/2 · C2 2/2 · C3 0/2 · C4 2/2 · C5 2/2 = 7/10 = 70% PASS | C1 3/5 = 60% · C2 10/15 = 66,7% · **C3 2/5 = 40%** · C4 5/5 = 100% · C5 4/5 = 80% | **W2 = C3** (thấp nhất, và khác W1) |
| 4 | Trap II: 10 câu C3, đúng 9 → 90% PASS, +4 Credit | C3 = 11/15 = 73,3% | — |
| 5 | Xếp hạng lại: C1 60% < C2 66,7% < C3 73,3% < C5 80% < C4 100% | — | **`boss_clusters` = [C1, C2, C3]** → phân bổ **7 / 5 / 3** |
| 6 | Boss: C1 4/7 · C2 4/5 · C3 3/3 = 11/15 = 73,3% PASS, +2 Credit, +5 bonus | — | Sinh O4 |

**Ba chỗ engine dễ sai, và sample này bắt được cả ba:**

1. **Bước 3 — W2 phải khác W1.** Nếu engine không loại W1 khỏi tập ứng viên thì vẫn ra C3 trong sample này (C3 40% < C2 66,7%), nên sample này *không* test được luật B5. Cần một sample riêng cho tình huống W1 vẫn thấp nhất — xem test T8.
2. **Bước 5 — Boss không loại trừ cụm nào.** C2 và C3 đã bị Trap nhắm nhưng vẫn vào Boss. Nếu engine loại chúng ra, `boss_clusters` sẽ thành [C1, C5, C4] — sai.
3. **Bước 5 — Trap nằm trong mẫu xếp hạng.** C3 vào Trap II với 40% và ra với 73,3% nhờ 10 câu Trap. Nếu engine loại câu Trap khỏi `accuracy_cumulative`, C3 vẫn ở 40% và sẽ đứng đầu danh sách yếu — cho ra `boss_clusters` = [C3, C1, C2] và phân bổ 7 câu cho C3 thay vì 3. Xem `ASSUMPTIONS.md` B10.

---

## 6. O4 — Bảng tổng kết sau Boss

### 6.1 Bảng hiển thị

`performance_score` toàn lượt: **70,4%** (tính ở 6.3)

| Cụm | Arena 1 | Trap I | Crossroads | Trap II | Boss | Kết luận |
|---|---|---|---|---|---|---|
| C1 | 2/3 | -- | 1/2 | -- | 4/7 | Cần cải thiện tiếp |
| C2 | 1/3 | 7/10 | 2/2 | -- | 4/5 | Đã cải thiện |
| C3 | 2/3 | -- | 0/2 | 9/10 | 3/3 | Đã cải thiện |
| C4 | 3/3 | -- | 2/2 | -- | -- | Không kiểm tra lại ở Boss |
| C5 | 2/3 | -- | 2/2 | -- | -- | Không kiểm tra lại ở Boss |

> Ô ghi `--` là Arena không hỏi cụm đó, **không phải** người chơi sai hết. Trong `accuracy_by_arena` các ô này **không tồn tại key**, không phải `attempted: 0`.

### 6.2 Cách ra từng nhãn — tính tay

`baseline_accuracy[c] = (arena1.correct + crossroads.correct) ÷ (arena1.attempted + crossroads.attempted)`  
`delta[c] = boss_accuracy[c] − baseline_accuracy[c]`

| Cụm | Mốc chẩn đoán | Boss | Δ | Điều kiện khớp | `improvement_label` |
|---|---|---|---:|---|---|
| C1 | (2+1)/(3+2) = 3/5 = 60,0% | 4/7 = 57,1% | −2,9 đ.pt | Không thoả #2 (Boss <70%), không thoả #3 (Δ ≤ 0) → rơi vào #4 | `needs_work` |
| C2 | (1+2)/(3+2) = 3/5 = 60,0% | 4/5 = 80,0% | +20,0 đ.pt | #2: Boss ≥70% và Δ ≥ 0 | `improved` |
| C3 | (2+0)/(3+2) = 2/5 = 40,0% | 3/3 = 100,0% | +60,0 đ.pt | #2 | `improved` |
| C4 | (3+2)/5 = 100,0% | không hỏi | — | #1 | `not_retested` |
| C5 | (2+2)/5 = 80,0% | không hỏi | — | #1 | `not_retested` |

Bốn điều kiện chạy **theo thứ tự**, dừng ở điều kiện đầu tiên khớp. Nếu engine chạy #2 trước #1, cụm C4/C5 sẽ chia cho `undefined`.

### 6.3 `performance_score` toàn lượt

| Arena | `points_earned` | `points_offered` | Nguồn |
|---|---:|---:|---|
| arena1 | 19 | 30 | tính ra từ Mục 3.4 |
| trap1 | 12 | 19 | giả định kịch bản |
| crossroads | 13 | 19 | giả định kịch bản |
| trap2 | 17 | 19 | giả định kịch bản |
| boss | 20 | 28 | giả định kịch bản |
| **Tổng** | **81** | **115** | |

```text
performance_score = 81 ÷ 115 = 70,4%
```

Chỉ dòng `arena1` được suy ra từ input ở Mục 2. Bốn dòng còn lại là giả định để minh hoạ phép cộng gộp; muốn tính ra thật thì phải có log đủ 60 dòng kèm `difficulty` từng câu. Đây là khoảng trống đã biết của sample này, ghi ở Mục 10.

### 6.4 Dòng chú thích bắt buộc dưới bảng

Vì lượt chơi này có một lần trượt (Arena 1 lượt 1), bảng tổng kết phải hiện:

> *Mốc chẩn đoán và performance score đọc theo lượt làm đầu tiên của mỗi Arena. Điểm số và Credit đọc theo lượt đỗ.*

Và, độc lập với việc trượt hay không:

> *Nhãn kết luận tính trên 3–7 câu ở Boss và 5 câu ở mốc chẩn đoán. Ngưỡng 70% có độ chặt khác nhau theo số câu: slot 7 câu cần 5/7, slot 5 câu cần 4/5, slot 3 câu cần 3/3.*

---

## 7. Giải thích và giới hạn của kết quả này

**Kết quả nói gì:** trong phiên chơi này, C3 vào cửa ở mức thấp nhất trong hai cụm được Trap nhắm (40% ở mốc chẩn đoán) và trả lời đúng cả 3 câu C3 ở Boss. C2 đi từ 60% lên 80%. C1 không được Trap nhắm và không đổi (60% → 57,1%).

**Kết quả không nói gì:**
- Không nói người học "đã nắm được" Standard III. C3 chỉ có 3 câu ở Boss — sai một câu là tụt xuống 66,7% và mất nhãn.
- Không nói Trap là nguyên nhân của mức tăng. Người học còn đọc lời giải sau mỗi Arena, còn làm lại Arena 1, và các câu ở Boss có độ khó khác các câu ở mốc chẩn đoán.
- Không so được với người chơi khác, trừ `performance_score` — và chỉ so trong phạm vi sản phẩm này.
- C1 mang nhãn `needs_work` với Δ = −2,9 điểm phần trăm trên mẫu 5 câu và 7 câu. Chênh lệch này nhỏ hơn giá trị của một câu.

---

## 8. Biến thể — minh hoạ cơ chế loại câu dùng vật phẩm

Giả sử ở **Crossroads** (Arena được phép dùng vật phẩm, tối đa 1 câu), người học dùng Cuộn Giấy Gợi Ý ở một câu thuộc C1 và trả lời đúng.

| Chỉ số | Không dùng vật phẩm | Dùng vật phẩm ở 1 câu C1 |
|---|---|---|
| `arena_score_correct` Crossroads | 7/10 = 70% PASS | 7/10 = 70% PASS — **không đổi** |
| `accuracy_by_arena["C1"]["crossroads"]` | `{1, 2}` | `{0, 1}` — câu đó bị loại khỏi cả tử lẫn mẫu |
| `baseline_accuracy[C1]` | (2+1)/(3+2) = 60,0% | (2+0)/(3+1) = **50,0%** |
| `performance_by_arena["crossroads"]` | earned 13 / offered 19 | earned giảm theo độ khó câu đó / offered **giữ 19** |
| Nhãn C1 ở O4 | Δ = −2,9 → `needs_work` | Δ = 57,1 − 50,0 = +7,1, Boss 57,1% <70% → `improved_insufficient` |

**Đây là điểm quan trọng nhất để test:** dùng một vật phẩm ở Crossroads làm **đổi nhãn kết luận** của C1, dù điểm Arena không đổi một chữ. Ba công thức phải được cài tách bạch, nếu không kết quả cuối sẽ sai mà điểm số vẫn trông đúng.

---

## 9. Early logic test

| Test | Input | Expected process | Expected output | Actual | Issue |
|---|---|---|---|---|---|
| T1 — item exclusion | Crossroads, 1 câu C1 dùng hint và đúng | Arena score tính cả; `accuracy_by_arena` loại khỏi tử và mẫu | Arena 7/10; `accuracy_by_arena["C1"]["crossroads"] = {0,1}` | Chờ code | — |
| T2 — weakest cluster | Accuracy C1 66,7 · C2 33,3 · C3 66,7 · C4 100 · C5 66,7 | sort tăng dần | W1 = C2 | Chờ code | — |
| T3 — pass threshold | 10/15 đúng | 66,7% < 70% | FAIL, +0 Credit, khoá Arena 2 | Chờ code | — |
| T4 — exact pass edge | 7/10 đúng | 70% | PASS | Chờ code | — |
| T5 — invalid option | `selected_option = 3` | validation reject | không ghi response / không chuyển câu | Chờ code | — |
| T6 — invalid item state | `item_used=false`, `item_type_used="hint"` | validation reject | không được vào scoring | Chờ code | Cần chốt implementation |
| T7 — duplicate question | id đã có trong `used_question_ids` | filter trước random | không xuất hiện lại nếu pool còn câu mới | Chờ code | — |
| T8 — W2 exclusion | sau Crossroads, W1 (C2) vẫn thấp nhất | rank ứng viên nhưng loại W1 | W2 là cụm yếu nhất **còn lại** | Chờ code | Cần sample riêng, sample Mục 5 không chạm luật này |
| **T9 — Arena 1 no item** | record Arena 1 có `item_used = true` | validation reject ở tầng ghi record | record bị từ chối, không chỉ ẩn nút trên UI | Chờ code | — |
| **T10 — Boss no item** | record Boss có `item_used = true` | như T9 | record bị từ chối | Chờ code | — |
| **T11 — max 1 item/Arena** | 2 record cùng `arena` có `item_used = true` | chặn từ record thứ hai | record thứ hai bị từ chối, hiện thông báo | Chờ code | — |
| **T12 — offered = 30** | Arena 1 bất kỳ | Σ difficulty của 15 câu | `points_offered == 30`, nếu khác thì báo lỗi sinh đề | Chờ code | Dùng làm assert trong `validate.html` |
| **T13 — key rỗng, không phải 0** | C4 không xuất hiện ở Boss | không tạo key `boss` cho C4 | O4 hiện `--`, không hiện 0%; không có phép chia cho 0 | Chờ code | — |
| **T14 — thứ tự 4 điều kiện** | C4: không hỏi ở Boss, baseline 100% | chạy #1 trước #2 | `not_retested`, không throw | Chờ code | — |
| **T15 — ghi theo lượt đầu** | Arena 1 trượt lượt 1 (10/15), đỗ lượt 2 (12/15) | `accuracy_by_arena` và `performance_by_arena` lấy `attempt_index = 1`; Credit lấy lượt 2 | baseline dùng 2/3-1/3-2/3-3/3-2/3; Credit = 3 | Chờ code | — |
| **T16 — Boss 7/5/3** | ranking C1 60 · C2 66,7 · C3 73,3 · C5 80 · C4 100 | lấy 3 cụm thấp nhất, không loại W1/W2 | `boss_clusters = [C1, C2, C3]`, phân bổ 7/5/3 | Chờ code | — |

---

## 10. Input validation

| Field | Rule | Missing handling |
|---|---|---|
| `question_id` | required; phải tồn tại trong bank | chặn submit |
| `arena` | enum: `arena1`, `trap1`, `crossroads`, `trap2`, `boss` | chặn submit — không có thì không dựng được `accuracy_by_arena` |
| `attempt_index` | integer ≥ 1 | mặc định 1; nếu Arena đã trượt mà vẫn ghi 1 là lỗi |
| `selected_option` | integer 0–2 | chặn submit |
| `time_to_answer` | number ≥ 0 | timestamp lỗi: lưu `null`, không dùng time tie-break |
| `item_used` | boolean | mặc định `false` chỉ khi UI xác nhận chưa dùng vật phẩm |
| `item_type_used` | `none`, `eliminate`, `hint` | phải khớp với `item_used` |
| `answer` | integer 0–2; chỉ đọc từ bank | bank validation fail |
| `cluster` | C1–C5 | bank validation fail |
| `module` | GIPS, CODE, S1–S7 | bank validation fail |
| `difficulty` | integer 1–3 | bank validation fail — thiếu là hỏng `performance_score` |
| `options` | array đúng 3 phần tử | bank validation fail |

### Cross-field validation

- `item_used = false` ⇒ `item_type_used = "none"`.
- `item_used = true` ⇒ `item_type_used ∈ {"eliminate","hint"}`.
- `arena ∈ {"arena1","boss"}` ⇒ `item_used = false`. *(mới)*
- Trong cùng một `arena` và cùng `attempt_index`, tối đa **một** record có `item_used = true`. *(mới)*
- `answer < len(options)`.
- `question_id` không được lặp trong cùng Arena.
- Trong một lượt chơi, ưu tiên không lặp `question_id` cho tới khi pool cạn.

### Invalid sample

```json
{
  "question_id": "ETH-C2-S1-003",
  "arena": "arena1",
  "attempt_index": 1,
  "selected_option": 3,
  "time_to_answer": -5,
  "item_used": true,
  "item_type_used": "none"
}
```

Bị reject vì: option ngoài range 0–2; thời gian âm; `item_used` và `item_type_used` mâu thuẫn; **và `arena = "arena1"` không được phép có `item_used = true`**.

---

## 11. Limitation của sample

- Đây là simulated data, không phản ánh ability thật của CFA candidate.
- Sample chứng minh **logic path tính được và dự đoán được**, không chứng minh Trap cải thiện learning.
- Chỉ Arena 1 (Mục 2) là dữ liệu dòng-theo-dòng. Arena 2–5 ở Mục 5 là số tổng hợp giả định; các bước chuyển giữa chúng bị luật ràng buộc nên vẫn kiểm tra được, nhưng chưa phải log đầy đủ 60 dòng.
- Vì thiếu log 60 dòng, bốn dòng `performance_by_arena` từ Trap I trở đi là giả định. Chỉ dòng `arena1` (19/30) truy được về input.
- Mốc chẩn đoán chỉ có 5 câu/cụm; mỗi câu đáng 20 điểm phần trăm. Boss có 3–7 câu/cụm. Không được diễn giải Δ như kết quả kiểm định.
- Sample này không chạm luật W2 ≠ W1 (xem T8) và không chạm nhánh tie-break (xem T2).
- Difficulty trong sample dùng nhãn hiện có của bank, do nhóm tự đánh giá.
- Problem evidence vẫn phải đến từ observation/interview thật, không phải từ file này.

---

## 12. Owner

| Hạng mục | Owner |
|---|---|
| Sample runtime structure, `arena` / `attempt_index` | Minh |
| Question ID/content consistency | Hồng |
| Diagnostic expected output (Mục 3, 4) | Trang, Minh |
| Chuỗi hành trình và O4 (Mục 5, 6, 7) | Quỳnh |
| Validation cases (Mục 9, 10) | Minh, Khôi |
| Hiển thị O4 và hai dòng chú thích bắt buộc (6.4) | Khôi |
| Documentation / traceability | Quỳnh |
