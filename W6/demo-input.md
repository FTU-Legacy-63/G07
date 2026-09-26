# Demo input — CFA Quest v11 (Seed 7)

## Mục tiêu
Tạo một lượt demo không trượt Arena nào và khi mở **Bảng tổng kết** có đồng thời:
- **C2 = Đã cải thiện**
- **C3 = Cần cải thiện tiếp**

## Chuẩn bị trước demo
`CFAQ.setSeed(7)` chỉ cố định RNG. Arena 1 còn phụ thuộc `runNo`, vì vậy để kịch bản dưới đây khớp **đúng ID và đúng thứ tự câu**, hãy đưa lượt chơi về `runNo = 1`. Mở Console và chạy:

```js
localStorage.removeItem("cfaQuestV11");
localStorage.removeItem("cfaQuestV11_inProgress");
localStorage.setItem("cfaQuestV11_runCount", "0");
location.reload();
```

Sau khi trang reload, mở Console lại và chạy:

```js
CFAQ.setSeed(7)
```

Sau đó bấm **Bắt đầu lượt chơi**. **Không dùng Bùa Loại Trừ** ở Trap/Crossroads, vì câu dùng item bị loại khỏi dữ liệu chẩn đoán.

## Arena 1 · The Gate

| # | Question ID | Cluster | Đáp án đúng | Cần làm | Bấm |
|---:|---|:---:|:---:|:---:|:---:|
| 1 | `ETH-C1-GIPS-001` | C1 | B | **Đúng** | **B** |
| 2 | `ETH-C1-CODE-001` | C1 | B | **Đúng** | **B** |
| 3 | `ETH-C1-GIPS-009` | C1 | A | **Đúng** | **A** |
| 4 | `ETH-C2-S1-003` | C2 | A | **Sai** | **B** |
| 5 | `ETH-C2-S2-001` | C2 | B | **Sai** | **C** |
| 6 | `ETH-C2-S1-002` | C2 | A | **Sai** | **B** |
| 7 | `ETH-C3-S3-001` | C3 | B | **Đúng** | **B** |
| 8 | `ETH-C3-S3-002` | C3 | B | **Đúng** | **B** |
| 9 | `ETH-C3-S3-005` | C3 | A | **Sai** | **B** |
| 10 | `ETH-C4-S4-005` | C4 | B | **Đúng** | **B** |
| 11 | `ETH-C4-S5-001` | C4 | B | **Đúng** | **B** |
| 12 | `ETH-C4-S4-003` | C4 | C | **Đúng** | **C** |
| 13 | `ETH-C5-S6-002` | C5 | A | **Đúng** | **A** |
| 14 | `ETH-C5-S7-001` | C5 | A | **Đúng** | **A** |
| 15 | `ETH-C5-S6-004` | C5 | B | **Đúng** | **B** |

**Kết quả cần đạt: 11/15 = 73.3%**.

Sau Arena 1: C2 = 0/3, C3 = 2/3, C1/C4/C5 = 3/3. **W1 phải là C2**.

## Trap I

| # | Question ID | Cluster | Đáp án đúng | Cần làm | Bấm |
|---:|---|:---:|:---:|:---:|:---:|
| 1 | `ETH-C2-S1-013` | C2 | B | **Đúng** | **B** |
| 2 | `ETH-C2-S1-009` | C2 | A | **Đúng** | **A** |
| 3 | `ETH-C2-S1-005` | C2 | C | **Đúng** | **C** |
| 4 | `ETH-C2-S2-016` | C2 | B | **Đúng** | **B** |
| 5 | `ETH-C2-S1-016` | C2 | B | **Đúng** | **B** |
| 6 | `ETH-C2-S2-015` | C2 | A | **Đúng** | **A** |
| 7 | `ETH-C2-S2-013` | C2 | B | **Đúng** | **B** |
| 8 | `ETH-C2-S2-011` | C2 | C | **Sai** | **A** |
| 9 | `ETH-C2-S1-010` | C2 | B | **Sai** | **C** |
| 10 | `ETH-C2-S2-014` | C2 | C | **Sai** | **A** |

**Kết quả cần đạt: 7/10 = 70.0%**.

Trap I đạt đúng ngưỡng 70% và khóa mục tiêu ở C2.

## The Crossroads

| # | Question ID | Cluster | Đáp án đúng | Cần làm | Bấm |
|---:|---|:---:|:---:|:---:|:---:|
| 1 | `ETH-C1-GIPS-003` | C1 | C | **Đúng** | **C** |
| 2 | `ETH-C5-S7-002` | C5 | B | **Đúng** | **B** |
| 3 | `ETH-C4-S4-004` | C4 | C | **Đúng** | **C** |
| 4 | `ETH-C4-S5-016` | C4 | B | **Đúng** | **B** |
| 5 | `ETH-C3-S3-006` | C3 | C | **Đúng** | **C** |
| 6 | `ETH-C1-CODE-016` | C1 | B | **Sai** | **C** |
| 7 | `ETH-C5-S6-015` | C5 | A | **Đúng** | **A** |
| 8 | `ETH-C2-S1-001` | C2 | B | **Đúng** | **B** |
| 9 | `ETH-C2-S2-017` | C2 | C | **Sai** | **A** |
| 10 | `ETH-C3-S3-009` | C3 | A | **Sai** | **B** |

**Kết quả cần đạt: 7/10 = 70.0%**.

Crossroads = 7/10. Mốc Arena 1 + Crossroads: **C2 = 1/5 = 20%**, **C3 = 3/5 = 60%**, **C1 = 4/5 = 80%**, C4 = C5 = 5/5. Do W2 loại W1=C2, **W2 phải là C3**.

## Trap II

| # | Question ID | Cluster | Đáp án đúng | Cần làm | Bấm |
|---:|---|:---:|:---:|:---:|:---:|
| 1 | `ETH-C3-S3-026` | C3 | A | **Đúng** | **A** |
| 2 | `ETH-C3-S3-027` | C3 | B | **Đúng** | **B** |
| 3 | `ETH-C3-S3-017` | C3 | A | **Đúng** | **A** |
| 4 | `ETH-C3-S3-031` | C3 | C | **Đúng** | **C** |
| 5 | `ETH-C3-S3-032` | C3 | A | **Đúng** | **A** |
| 6 | `ETH-C3-S3-023` | C3 | A | **Đúng** | **A** |
| 7 | `ETH-C3-S3-013` | C3 | A | **Đúng** | **A** |
| 8 | `ETH-C3-S3-003` | C3 | A | **Sai** | **B** |
| 9 | `ETH-C3-S3-015` | C3 | B | **Sai** | **C** |
| 10 | `ETH-C3-S3-010` | C3 | B | **Sai** | **C** |

**Kết quả cần đạt: 7/10 = 70.0%**.

Trap II = 7/10. Trước Boss, chẩn đoán cộng dồn đưa thứ tự yếu nhất thành **C2 → C3 → C1**, nên Boss phải chia **C2 7 câu, C3 5 câu, C1 3 câu**.

## Boss

| # | Question ID | Cluster | Đáp án đúng | Cần làm | Bấm |
|---:|---|:---:|:---:|:---:|:---:|
| 1 | `ETH-C3-S3-018` | C3 | C | **Đúng** | **C** |
| 2 | `ETH-C2-S2-008` | C2 | B | **Đúng** | **B** |
| 3 | `ETH-C1-CODE-006` | C1 | B | **Đúng** | **B** |
| 4 | `ETH-C3-S3-011` | C3 | C | **Sai** | **A** |
| 5 | `ETH-C3-S3-008` | C3 | A | **Sai** | **B** |
| 6 | `ETH-C2-S1-014` | C2 | C | **Đúng** | **C** |
| 7 | `ETH-C2-S2-009` | C2 | C | **Đúng** | **C** |
| 8 | `ETH-C2-S1-006` | C2 | B | **Đúng** | **B** |
| 9 | `ETH-C2-S2-007` | C2 | A | **Đúng** | **A** |
| 10 | `ETH-C1-CODE-012` | C1 | A | **Đúng** | **A** |
| 11 | `ETH-C3-S3-016` | C3 | B | **Sai** | **C** |
| 12 | `ETH-C2-S1-017` | C2 | C | **Đúng** | **C** |
| 13 | `ETH-C2-S2-006` | C2 | B | **Đúng** | **B** |
| 14 | `ETH-C3-S3-024` | C3 | B | **Sai** | **C** |
| 15 | `ETH-C1-GIPS-004` | C1 | B | **Đúng** | **B** |

**Kết quả cần đạt: 11/15 = 73.3%**.

Boss = 11/15 = 73.3%, đủ đỗ. Theo cluster: **C2 7/7**, **C3 1/5**, **C1 3/3**.

## Kết quả cuối cần nhìn thấy
- **C2:** mốc chẩn đoán = 1/5 = 20%; Boss = 7/7 = 100% → **Đã cải thiện**.
- **C3:** mốc chẩn đoán = 3/5 = 60%; Boss = 1/5 = 20% → **Cần cải thiện tiếp**.
- **C1:** mốc chẩn đoán = 4/5 = 80%; Boss = 3/3 = 100% → **Đã cải thiện**.

Kịch bản này cố ý tạo kết quả đối lập để chứng minh logic O4; không dùng nó làm bằng chứng rằng Trap gây ra learning.
