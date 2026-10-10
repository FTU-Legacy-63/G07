# DEMO INPUT — CFA Quest Week 7 · Exact Seed 7

**Seed:** `7`  
**Run:** `runNo = 1`  
**Mục tiêu:** demo một lượt main path theo đúng engine Week 7 hiện tại, với **Question ID thật**, đáp án đúng và nút cần bấm cho từng câu.

> Điều kiện để bảng dưới đây khớp chính xác: reset state → reload → `CFAQ.setSeed(7)` → bắt đầu lượt chơi đầu tiên. Không dùng Bùa, không retry, không vào World Quest và không thực hiện thêm thao tác nào làm sinh đề ngoài flow chính.

---

## 1. Chuẩn bị

Mở Console:

```js
localStorage.removeItem("cfaQuestV12");
localStorage.removeItem("cfaQuestV12_inProgress");
localStorage.setItem("cfaQuestV12_runCount", "0");
location.reload();
```

Sau khi trang reload, mở Console lại:

```js
CFAQ.setSeed(7)
```

Sau đó bấm **Bắt đầu lượt chơi**.

Main path:

```text
Arena 1: 11/15
→ W1 = C2
→ Arena 2: 8/10
→ Arena 3: 8/10
→ W2 = C1
→ Arena 4: 9/10
→ Credit = 15
→ trả 15 Credit
→ Boss: 14/15
```

---

# 2. Arena 1 — The Gate

**Mục tiêu:** `11/15 = 73.3% → PASS`  
**Ngưỡng:** 70% · **Timer:** Không · **Bùa:** Không

| # | Question ID | Cluster | Độ khó | Đáp án đúng | Cần làm | Bấm |
|---:|---|:---:|:---:|:---:|:---:|:---:|
| 1 | `ETH-C1-GIPS-001` | C1 | Dễ (1) | B | **Sai** | A |
| 2 | `ETH-C1-CODE-001` | C1 | Vừa (2) | B | **Sai** | A |
| 3 | `ETH-C1-GIPS-009` | C1 | Khó (3) | A | **Đúng** | A |
| 4 | `ETH-C2-S1-003` | C2 | Dễ (1) | A | **Đúng** | A |
| 5 | `ETH-C2-S2-001` | C2 | Vừa (2) | B | **Sai** | A |
| 6 | `ETH-C2-S1-002` | C2 | Khó (3) | A | **Sai** | B |
| 7 | `ETH-C3-S3-001` | C3 | Dễ (1) | B | **Đúng** | B |
| 8 | `ETH-C3-S3-002` | C3 | Vừa (2) | B | **Đúng** | B |
| 9 | `ETH-C3-S3-005` | C3 | Khó (3) | A | **Đúng** | A |
| 10 | `ETH-C4-S4-005` | C4 | Dễ (1) | B | **Đúng** | B |
| 11 | `ETH-C4-S5-001` | C4 | Vừa (2) | B | **Đúng** | B |
| 12 | `ETH-C4-S4-003` | C4 | Khó (3) | C | **Đúng** | C |
| 13 | `ETH-C5-S6-002` | C5 | Dễ (1) | A | **Đúng** | A |
| 14 | `ETH-C5-S7-001` | C5 | Vừa (2) | A | **Đúng** | A |
| 15 | `ETH-C5-S6-004` | C5 | Khó (3) | B | **Đúng** | B |

Kết quả:

```text
C1 = 1/3
C2 = 1/3
C3 = 3/3
C4 = 3/3
C5 = 3/3
```

C1 và C2 cùng Accuracy. C2 sai các câu khó hơn:

```text
C1 wrong-difficulty average = (1 + 2) / 2 = 1.5
C2 wrong-difficulty average = (2 + 3) / 2 = 2.5
```

Vì vậy:

```text
W1 = C2
Credit: 3 + 2 = 5
```

---

# 3. Arena 2 — Trap I

**Target:** `W1 = C2`  
**Mục tiêu:** `8/10 = 80% → PASS`  
**Ngưỡng:** 75% · **Difficulty mix:** `4 Dễ / 4 Vừa / 2 Khó` · **Timer:** Không

| # | Question ID | Cluster | Độ khó | Đáp án đúng | Cần làm | Bấm |
|---:|---|:---:|:---:|:---:|:---:|:---:|
| 1 | `ETH-C2-S2-006` | C2 | Dễ (1) | B | **Đúng** | B |
| 2 | `ETH-C2-S2-016` | C2 | Vừa (2) | B | **Đúng** | B |
| 3 | `ETH-C2-S1-009` | C2 | Vừa (2) | A | **Đúng** | A |
| 4 | `ETH-C2-S1-017` | C2 | Khó (3) | C | **Sai** | A |
| 5 | `ETH-C2-S2-004` | C2 | Vừa (2) | B | **Đúng** | B |
| 6 | `ETH-C2-S1-007` | C2 | Dễ (1) | A | **Đúng** | A |
| 7 | `ETH-C2-S2-011` | C2 | Khó (3) | C | **Sai** | A |
| 8 | `ETH-C2-S2-007` | C2 | Dễ (1) | A | **Đúng** | A |
| 9 | `ETH-C2-S1-016` | C2 | Vừa (2) | B | **Đúng** | B |
| 10 | `ETH-C2-S1-006` | C2 | Dễ (1) | B | **Đúng** | B |

Kết quả:

```text
8/10 = 80% → PASS
Credit: 5 + 3 = 8
```

Hai câu cố ý sai đều là câu khó. Việc này giúp C2 tiếp tục được xếp yếu hơn C1 khi hai cụm về sau có cùng Accuracy.

---

# 4. Arena 3 — The Crossroads

**Mục tiêu:** `8/10 = 80% → PASS`  
**Ngưỡng:** 75% · **Difficulty mix:** `2 Dễ / 5 Vừa / 3 Khó`  
**Timer:** `100 giây/câu`

| # | Question ID | Cluster | Độ khó | Đáp án đúng | Cần làm | Bấm |
|---:|---|:---:|:---:|:---:|:---:|:---:|
| 1 | `ETH-C4-S4-016` | C4 | Vừa (2) | B | **Đúng** | B |
| 2 | `ETH-C5-S6-005` | C5 | Vừa (2) | A | **Đúng** | A |
| 3 | `ETH-C2-S1-004` | C2 | Vừa (2) | B | **Đúng** | B |
| 4 | `ETH-C1-GIPS-010` | C1 | Khó (3) | C | **Đúng** | C |
| 5 | `ETH-C3-S3-027` | C3 | Vừa (2) | B | **Sai** | A |
| 6 | `ETH-C2-S2-005` | C2 | Khó (3) | A | **Đúng** | A |
| 7 | `ETH-C4-S5-013` | C4 | Vừa (2) | B | **Đúng** | B |
| 8 | `ETH-C1-CODE-002` | C1 | Dễ (1) | A | **Sai** | B |
| 9 | `ETH-C5-S7-008` | C5 | Dễ (1) | C | **Đúng** | C |
| 10 | `ETH-C3-S3-020` | C3 | Khó (3) | A | **Đúng** | A |

Kết quả theo cluster:

| Cluster | Arena 1 | Crossroads | Baseline sau Arena 3 |
|:---:|---:|---:|---:|
| C1 | 1/3 | 1/2 | **2/5 = 40%** |
| C2 | 1/3 | 2/2 | **3/5 = 60%** |
| C3 | 3/3 | 1/2 | **4/5 = 80%** |
| C4 | 3/3 | 2/2 | **5/5 = 100%** |
| C5 | 3/3 | 2/2 | **5/5 = 100%** |

`W1 = C2` nên khi chọn W2 phải loại C2. Cluster yếu nhất còn lại là C1:

```text
W2 = C1
Arena 3 = 8/10 → PASS
Credit: 8 + 3 = 11
```

Không để câu nào vượt 100 giây.

---

# 5. Arena 4 — Trap II

**Target:** `W2 = C1`  
**Mục tiêu:** `9/10 = 90% → PASS`  
**Ngưỡng:** 85% · **Difficulty mix:** `2 Dễ / 4 Vừa / 4 Khó`  
**Timer:** `80 giây/câu`

| # | Question ID | Cluster | Độ khó | Đáp án đúng | Cần làm | Bấm |
|---:|---|:---:|:---:|:---:|:---:|:---:|
| 1 | `ETH-C1-GIPS-017` | C1 | Khó (3) | C | **Đúng** | C |
| 2 | `ETH-C1-CODE-003` | C1 | Dễ (1) | B | **Sai** | A |
| 3 | `ETH-C1-GIPS-014` | C1 | Khó (3) | C | **Đúng** | C |
| 4 | `ETH-C1-CODE-010` | C1 | Khó (3) | A | **Đúng** | A |
| 5 | `ETH-C1-CODE-013` | C1 | Vừa (2) | B | **Đúng** | B |
| 6 | `ETH-C1-GIPS-003` | C1 | Dễ (1) | C | **Đúng** | C |
| 7 | `ETH-C1-GIPS-013` | C1 | Vừa (2) | B | **Đúng** | B |
| 8 | `ETH-C1-CODE-016` | C1 | Vừa (2) | B | **Đúng** | B |
| 9 | `ETH-C1-CODE-009` | C1 | Khó (3) | C | **Đúng** | C |
| 10 | `ETH-C1-GIPS-008` | C1 | Vừa (2) | A | **Đúng** | A |

Kết quả:

```text
9/10 = 90% → PASS
Credit: 11 + 4 = 15
```

Không để câu nào vượt 80 giây.

---

# 6. Ranking sau Arena 4

Diagnostic cumulative:

| Cluster | Correct / Attempted | Accuracy |
|:---:|---:|---:|
| C1 | 11/15 | 73.3% |
| C2 | 11/15 | 73.3% |
| C3 | 4/5 | 80.0% |
| C4 | 5/5 | 100% |
| C5 | 5/5 | 100% |

C1 và C2 cùng Accuracy, nhưng average difficulty của câu sai là:

```text
C1: (1 + 2 + 1 + 1) / 4 = 1.25
C2: (2 + 3 + 3 + 3) / 4 = 2.75
```

C2 bị xếp yếu hơn C1.

Boss plan:

| Thứ tự yếu | Cluster | Số câu Boss |
|---:|:---:|---:|
| 1 | **C2** | 7 |
| 2 | **C1** | 5 |
| 3 | **C3** | 3 |

---

# 7. Boss Gate

Sau Arena 4:

```text
Credit = 15
```

| Bước | Credit trước | Thay đổi | Credit sau |
|---|---:|---:|---:|
| Đỗ Arena 4 | 11 | +4 | 15 |
| Mở Boss | 15 | -15 | **0** |

Main demo đủ Credit nên **không cần World Quest**.

---

# 8. Boss

**Boss plan:** `C2 = 7 câu · C1 = 5 câu · C3 = 3 câu`  
**Mục tiêu:** `14/15 = 93.3% → PASS`  
**Ngưỡng:** 90% · **Difficulty mix:** `2 Dễ / 4 Vừa / 9 Khó`  
**Timer:** `60 giây/câu` · **Bùa:** không dùng trong demo

| # | Question ID | Cluster | Độ khó | Đáp án đúng | Cần làm | Bấm |
|---:|---|:---:|:---:|:---:|:---:|:---:|
| 1 | `ETH-C3-S3-021` | C3 | Khó (3) | C | **Đúng** | C |
| 2 | `ETH-C2-S2-002` | C2 | Vừa (2) | C | **Đúng** | C |
| 3 | `ETH-C1-CODE-011` | C1 | Khó (3) | C | **Đúng** | C |
| 4 | `ETH-C2-S2-010` | C2 | Khó (3) | A | **Đúng** | A |
| 5 | `ETH-C1-GIPS-011` | C1 | Khó (3) | C | **Đúng** | C |
| 6 | `ETH-C2-S1-011` | C2 | Khó (3) | C | **Đúng** | C |
| 7 | `ETH-C1-CODE-014` | C1 | Khó (3) | C | **Đúng** | C |
| 8 | `ETH-C2-S2-012` | C2 | Dễ (1) | A | **Đúng** | A |
| 9 | `ETH-C3-S3-006` | C3 | Vừa (2) | C | **Đúng** | C |
| 10 | `ETH-C2-S1-001` | C2 | Vừa (2) | B | **Đúng** | B |
| 11 | `ETH-C2-S1-014` | C2 | Khó (3) | C | **Đúng** | C |
| 12 | `ETH-C1-GIPS-016` | C1 | Vừa (2) | B | **Đúng** | B |
| 13 | `ETH-C3-S3-017` | C3 | Dễ (1) | A | **Sai** | B |
| 14 | `ETH-C2-S2-014` | C2 | Khó (3) | C | **Đúng** | C |
| 15 | `ETH-C1-CODE-005` | C1 | Dễ (1) | A | **Đúng** | A |

Kết quả theo cluster:

```text
C2 = 7/7 = 100%
C1 = 5/5 = 100%
C3 = 2/3 = 66.7%

Boss total = 14/15 = 93.3% → PASS
```

Không để câu nào vượt 60 giây.

Credit sau Boss:

```text
Credit trước Boss result = 0
Boss reward              = +4
First clear bonus        = +5
Penalty                  = 0
--------------------------------
Credit cuối              = 9
```

---

# 9. Kết quả O4 cần thấy

| Cluster | Baseline | Boss | Expected |
|:---:|---:|---:|---|
| C1 | 2/5 = 40% | 5/5 = 100% | **Đã cải thiện** |
| C2 | 3/5 = 60% | 7/7 = 100% | **Đã cải thiện** |
| C3 | 4/5 = 80% | 2/3 = 66.7% | **Cần cải thiện tiếp** |

Lưu ý:

```text
Boss cần 90% để PASS.
Nhãn O4 của từng cluster vẫn dùng mốc 70%.
```

---

# 10. Credit summary

| Bước | Kết quả | Thay đổi | Ví sau |
|---|---|---:|---:|
| Bắt đầu | — | — | 3 |
| Arena 1 | 11/15 | +2 | 5 |
| Arena 2 | 8/10 | +3 | 8 |
| Arena 3 | 8/10 | +3 | 11 |
| Arena 4 | 9/10 | +4 | 15 |
| Mở Boss | đủ 15 Credit | -15 | 0 |
| Boss | 14/15, first clear | +4 +5 | **9** |

---

# 11. Checklist trước khi demo

- [ ] Reset đúng ba key `cfaQuestV12`
- [ ] Reload xong mới chạy `CFAQ.setSeed(7)`
- [ ] `runNo = 1`
- [ ] Arena 1 = 11/15
- [ ] W1 = C2
- [ ] Arena 2 = 8/10
- [ ] Arena 3 = 8/10
- [ ] W2 = C1
- [ ] Arena 4 = 9/10
- [ ] Credit trước Boss = 15
- [ ] Boss plan = C2(7) / C1(5) / C3(3)
- [ ] Boss Gate trừ 15 Credit
- [ ] Boss = 14/15
- [ ] Câu Boss duy nhất cố ý sai = `ETH-C3-S3-017`
- [ ] Không dùng Bùa
- [ ] Không có overtime penalty
- [ ] Credit cuối = 9
- [ ] C1 = Đã cải thiện
- [ ] C2 = Đã cải thiện
- [ ] C3 = Cần cải thiện tiếp

---

## Ghi chú

Bảng này chỉ đúng cho **main path Seed 7** với điều kiện ở đầu file. Nếu:

- retry một Arena;
- dùng World Quest;
- thay seed;
- đổi question bank;
- sửa thuật toán shuffle/generation;

thì Question ID từ round đó trở đi có thể thay đổi.
