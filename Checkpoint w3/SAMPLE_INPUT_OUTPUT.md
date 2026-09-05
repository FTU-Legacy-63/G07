# SAMPLE_INPUT_OUTPUT

**Sản phẩm:** CFA Quest — Ethics diagnostic dungeon  
**Học phần:** NHA408E · Nhóm 7  
**Mục tiêu Week 3:** chứng minh input hiện tại đủ để đọc, validate, chạy logic chẩn đoán và sinh output mẫu.

> Đây là **simulated data** để test logic. Không phải dữ liệu người học thật và không được dùng làm problem evidence.

---

## 0. Data structure dùng cho prototype

### Question bank
- Format: JSON array.
- Nguồn: `ethics_bank_110.json`.
- Mỗi object có các field chính dùng lúc chạy:
  `id, cluster, module, difficulty, stem, options, answer, distractor_reason, hint, explanation`.

### Runtime response record
Mỗi câu sau khi người học bấm Xác nhận sinh một record:

```json
{
  "question_id": "ETH-C2-S1-003",
  "selected_option": 0,
  "time_to_answer": 31,
  "item_used": false,
  "item_type_used": "none"
}
```

Các state variable như `diagnostic_correct`, `accuracy`, `credit_balance` **không phải input thô**; hệ thống tính từ question bank + response record.

---

## 1. Data flow

```text
ethics_bank_110.json
        +
User action / system timestamps
        ↓
Runtime response records
        ↓
Validation
- question_id tồn tại
- selected_option ∈ {0,1,2}
- time_to_answer >= 0
- item_type_used hợp lệ
- item_used khớp item_type_used
        ↓
Join response với question bank theo question_id
        ↓
Check selected_option == answer
        ↓
Arena score
+ Diagnostic counters (loại câu dùng item)
        ↓
Accuracy theo cluster/module
        ↓
Rank weakness
        ↓
Sinh Targeted Arena tiếp theo
        ↓
O1 + O2 + O3
```

---

## 2. Sample simulated input — Arena 1

Để early logic test dễ kiểm tra bằng tay, sample dưới đây giữ đúng cấu trúc **15 câu = 3 câu × 5 cụm**.

| # | Question ID | Cluster | Module | Difficulty | Correct option | Selected | Time (s) | Item used | Result |
|---|---|---|---|---:|---:|---:|---:|---|---|
| 1 | ETH-C1-GIPS-001 | C1 | GIPS | 1 | 1 | 1 | 24 | no | correct |
| 2 | ETH-C1-CODE-002 | C1 | CODE | 1 | 0 | 2 | 41 | no | wrong |
| 3 | ETH-C1-GIPS-010 | C1 | GIPS | 3 | 2 | 2 | 19 | no | correct |
| 4 | ETH-C2-S1-003 | C2 | S1 | 1 | 0 | 1 | 48 | no | wrong |
| 5 | ETH-C2-S1-005 | C2 | S1 | 2 | 2 | 2 | 37 | yes — hint | correct |
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

> Row #5 dùng item. Câu này **vẫn tính đúng vào Arena score**, nhưng bị loại khỏi `diagnostic_correct[C2]` và `diagnostic_attempted[C2]`.

---

## 3. Expected process — tính tay

### 3.1 Arena score

Số đúng tính cả câu dùng item:

- Correct: 10/15
- Accuracy Arena: `10 ÷ 15 = 66.7%`
- Vì `< 70%` → **FAIL**
- Credit nhận từ Arena này: **0**

Nếu đây là lượt thật, Arena kế tiếp bị khóa và người học phải retry Arena 1.  
Tuy nhiên để test riêng cơ chế diagnostic/sinh Trap, ta vẫn tính O1/O2 từ sample này.

### 3.2 Diagnostic counters theo cluster

| Cluster | Correct không dùng item | Attempted không dùng item | Diagnostic Accuracy |
|---|---:|---:|---:|
| C1 | 2 | 3 | 66.7% |
| C2 | 0 | 2 | 0.0% |
| C3 | 2 | 3 | 66.7% |
| C4 | 3 | 3 | 100.0% |
| C5 | 2 | 3 | 66.7% |

**W1 = C2** vì có Accuracy thấp nhất.

### 3.3 Diagnostic theo module

| Module | Correct | Attempted | Accuracy |
|---|---:|---:|---:|
| GIPS | 2 | 2 | 100.0% |
| CODE | 0 | 1 | 0.0% |
| S1 | 0 | 1 | 0.0% |
| S2 | 0 | 1 | 0.0% |
| S3 | 2 | 3 | 66.7% |
| S4 | 1 | 1 | 100.0% |
| S5 | 2 | 2 | 100.0% |
| S6 | 1 | 2 | 50.0% |
| S7 | 1 | 1 | 100.0% |

Lưu ý: câu C2/S1 dùng hint không đi vào mẫu chẩn đoán, nên S1 chỉ còn 1 attempted trong bảng này.

---

## 4. Expected output

### O1 — Weakness Profile

```text
C1  66.7%
C2   0.0%  ← weakest
C3  66.7%
C4 100.0%
C5  66.7%
```

Module detail phải cho thấy C2 yếu ở cả S1 và S2 trong sample này.

### O2 — Targeted Arena

Nếu engine được yêu cầu sinh Trap I từ profile trên:

```text
target_cluster = "C2"
question_count = 10
module_distribution = S1: 5, S2: 5
exclude = used_question_ids
```

Engine phải:
1. lọc bank với `cluster == "C2"`;
2. loại các `id` đã dùng;
3. lấy 5 câu S1 + 5 câu S2 nếu bank đủ;
4. nếu thiếu một module thì bù từ module còn lại và ghi log.

### O3 — Arena result

```text
Arena 1
Score: 10/15 = 66.7%
Status: FAIL
Credit earned: 0
Weakest cluster: C2
Incorrect questions: #2, #4, #6, #9, #14
```

Với từng câu sai, O3 phải có:
- stem;
- phương án người học chọn;
- đáp án đúng;
- `distractor_reason[selected_option]`;
- `explanation`;
- item đã dùng hay không.

---

## 5. Early logic test

| Test | Input | Expected process | Expected output | Actual | Issue |
|---|---|---|---|---|---|
| T1 — item exclusion | C2 có 3 câu, 1 câu đúng nhưng dùng hint | Arena score tính cả 3; diagnostic chỉ tính 2 câu không item | Arena: 1 correct từ row dùng item vẫn được tính; Diagnostic C2 = 0/2 | Chờ code | — |
| T2 — weakest cluster | Accuracy C1=66.7, C2=0, C3=66.7, C4=100, C5=66.7 | sort tăng dần theo accuracy | W1=C2 | Chờ code | — |
| T3 — pass threshold | 10/15 đúng | 10/15=66.7% <70% | FAIL, +0 Credit | Chờ code | — |
| T4 — exact pass edge | 7/10 đúng | 7/10=70% | PASS | Chờ code | — |
| T5 — invalid option | `selected_option=3` | validation reject | không ghi response / không chuyển câu | Chờ code | — |
| T6 — invalid item state | `item_used=false`, `item_type_used="hint"` | validation reject hoặc normalize theo rule đã chốt | không được vào scoring khi record còn mâu thuẫn | Chờ code | Cần chốt implementation |
| T7 — duplicate question | question id đã có trong `used_question_ids` | filter trước random | không xuất hiện lại nếu pool còn câu mới | Chờ code | — |
| T8 — W2 exclusion | sau Arena 3, W1 vẫn thấp nhất | rank candidates nhưng loại W1 | W2 là cụm yếu nhất còn lại | Chờ code | — |

---

## 6. Input validation ban đầu

| Field | Rule | Missing handling |
|---|---|---|
| `question_id` | required; phải tồn tại trong bank | chặn submit |
| `selected_option` | integer 0–2 | chặn submit |
| `time_to_answer` | number/integer >= 0 | nếu timestamp lỗi: lưu `null`, không dùng time tie-break |
| `item_used` | boolean | mặc định `false` chỉ khi UI xác nhận chưa dùng item |
| `item_type_used` | `none`, `eliminate`, `hint` | phải khớp với `item_used` |
| `answer` | integer 0–2; chỉ đọc từ bank | bank validation fail nếu thiếu/sai |
| `cluster` | C1–C5 | bank validation fail |
| `module` | GIPS, CODE, S1–S7 | bank validation fail |
| `difficulty` | integer 1–3 | bank validation fail |
| `options` | array đúng 3 phần tử | bank validation fail |

### Cross-field validation

- `item_used = false` ⇒ `item_type_used = "none"`.
- `item_used = true` ⇒ `item_type_used ∈ {"eliminate","hint"}`.
- `answer < len(options)`.
- `question_id` không được lặp trong cùng Arena.
- Trong một lượt chơi, ưu tiên không lặp `question_id` cho tới khi pool cạn.

---

## 7. Invalid sample

```json
{
  "question_id": "ETH-C2-S1-003",
  "selected_option": 3,
  "time_to_answer": -5,
  "item_used": false,
  "item_type_used": "hint"
}
```

Record này phải bị reject vì:
- option ngoài range 0–2;
- thời gian âm;
- `item_used` và `item_type_used` mâu thuẫn.

---

## 8. Limitation của sample

- Đây là simulated data, không phản ánh ability thật của CFA candidate.
- Sample chỉ chứng minh **logic path có thể tính được**, không chứng minh Trap cải thiện learning.
- Difficulty trong sample dùng nhãn hiện có của bank, vốn do nhóm tự đánh giá.
- Module accuracy có sample size rất nhỏ; không nên diễn giải như kết luận học tập đáng tin.
- Problem evidence vẫn phải đến từ observation/interview thật, không phải từ file này.

---

## 9. Owner

| Hạng mục | Owner |
|---|---|
| Sample runtime structure | Minh |
| Question ID/content consistency | Hồng |
| Diagnostic expected output | Trang, Minh |
| Validation cases | Minh, Khôi |
| Documentation / traceability | Quỳnh |
