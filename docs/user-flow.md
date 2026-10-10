# USER FLOW — CFA QUEST · ETHICS

**Học phần:** NHA408E · **Nhóm:** 7  
**Nguồn chính:** `SOLUTION_STRUCTURE.md` bản Week 7 và thiết kế cập nhật sau feedback.  
**Phạm vi file:** mô tả đường đi của người chơi, các nhánh phụ, đường lỗi, Boss Gate, World Quest, timer và luật vật phẩm.

> File này mô tả **flow vận hành**. Logic chẩn đoán W1/W2, cách tính `accuracy_cumulative`, bảng tổng kết O4 và các công thức chi tiết vẫn lấy từ `SOLUTION_STRUCTURE.md`.

---

## 1. Điểm vào và điểm ra

- **Điểm bắt đầu:** người chơi vào chủ đề Ethics.
- **Không có menu chọn cụm muốn luyện.** Hệ thống dùng dữ liệu sai của người chơi để chọn cụm tiếp theo.
- **Điểm kết thúc:** bảng tổng kết sau khi vượt Boss.
- **Một đường chính không trượt, không cần World Quest:** 60 câu  
  `15 + 10 + 10 + 10 + 15`.
- Nếu người chơi phải làm World Quest, mỗi lượt Quest cộng thêm **15 câu**, nhưng **không được tính vào dữ liệu chẩn đoán và không đi vào bảng tổng kết sau Boss**.

Luồng tổng quát:

```text
Vào Ethics
   ↓
Arena 1
   ↓
Chẩn đoán W1
   ↓
Arena 2 — Trap I
   ↓
Arena 3 — Crossroads
   ↓
Xác định W2 khác W1
   ↓
Arena 4 — Trap II
   ↓
Xác định 3 cụm yếu nhất
   ↓
Kiểm tra Credit
   ├── đủ 15 → trả 15 → Boss
   └── thiếu → World Quest → cộng Credit → kiểm tra lại
   ↓
Vượt Boss
   ↓
Bảng tổng kết
```

---

## 2. Happy path

Kịch bản dưới đây giả định người chơi:

- đỗ từng Arena ngay lượt cần xét,
- không thoát giữa chừng,
- không bị thiếu Credit tới mức phải làm nhiều vòng Quest,
- và đi hết hành trình tới Boss.

| Step | User action | System response |
|---|---|---|
| 1 | Vào chủ đề Ethics | Mở **Arena 1 — The Gate**, 15 câu |
| 2 | Làm Arena 1 | Mỗi cụm 3 câu; mỗi cụm có 1 dễ + 1 vừa + 1 khó; không được dùng Bùa |
| 3 | Kết thúc Arena 1 | Chấm điểm, xét pass **70% = tối thiểu 11/15**, cộng Credit nếu đỗ, hiện bảng chẩn đoán |
| 4 | Đọc bảng chẩn đoán | Hệ thống xác định **W1 = cụm yếu nhất** theo logic chẩn đoán hiện có |
| 5 | *(tuỳ chọn)* Mua Bùa | Trừ 3 Credit nếu mua; từ Arena 2 trở đi mỗi round tối đa 1 Bùa |
| 6 | Vào **Arena 2 — Trap I** | Sinh 10 câu từ W1 với difficulty mix **4 dễ / 4 vừa / 2 khó** |
| 7 | Kết thúc Arena 2 | Xét pass **75% = tối thiểu 8/10**; nếu đỗ thì nhận Credit theo bậc thưởng |
| 8 | Vào **Arena 3 — The Crossroads** | Sinh 10 câu, mỗi cụm 2 câu; tổng difficulty mix **2 dễ / 5 vừa / 3 khó** |
| 9 | Làm Arena 3 | Mỗi câu có giới hạn **100 giây**; hết giờ không tự nộp, bắt đầu tính overtime |
| 10 | Kết thúc Arena 3 | Xét pass **75% = tối thiểu 8/10**; cộng thưởng và trừ penalty; tính lại xếp hạng để xác định **W2**, bắt buộc khác W1 |
| 11 | Vào **Arena 4 — Trap II** | Sinh 10 câu từ W2 với difficulty mix **2 dễ / 4 vừa / 4 khó** |
| 12 | Làm Arena 4 | Mỗi câu có giới hạn **80 giây**; hết giờ không tự nộp |
| 13 | Kết thúc Arena 4 | Xét pass **85% = tối thiểu 9/10**; cộng thưởng, trừ penalty, xếp hạng lại toàn bộ 5 cụm |
| 14 | Sau khi đỗ Arena 4 | Xác định **3 cụm yếu nhất** để dùng cho Boss và World Quest |
| 15 | Hệ thống kiểm tra ví | Nếu `Credit >= 15`, cho phép trả 15 Credit để mở Boss; nếu thiếu thì mở World Quest |
| 16 | Trả 15 Credit | Boss chuyển sang trạng thái mở |
| 17 | Vào **Boss** | Sinh 15 câu từ 3 cụm yếu nhất, chia **7 / 5 / 3**; tổng difficulty mix **2 dễ / 4 vừa / 9 khó** |
| 18 | Làm Boss | Mỗi câu có giới hạn **60 giây**; được dùng tối đa 1 Bùa Loại Trừ |
| 19 | Kết thúc Boss | Xét pass **90% = tối thiểu 14/15**; cộng bậc thưởng, +5 Credit nếu là lần đầu vượt Boss, trừ penalty |
| 20 | Vượt Boss | Mở bảng tổng kết sau Boss và hiển thị `performance_score` của hành trình chính |

### 2.1 Pass threshold theo round

| Round | Số câu | Ngưỡng đỗ | Số câu đúng tối thiểu | Timer |
|---|---:|---:|---:|---|
| Arena 1 | 15 | 70% | 11/15 | Không |
| Arena 2 | 10 | 75% | 8/10 | Không |
| Arena 3 | 10 | 75% | 8/10 | 100 giây/câu |
| Arena 4 | 10 | 85% | 9/10 | 80 giây/câu |
| Boss | 15 | 90% | 14/15 | 60 giây/câu |

> Arena 2 và Arena 3 cùng ngưỡng 75%. Arena 3 khó hơn nhờ tỷ lệ câu khó cao hơn và có timer.

### 2.2 Difficulty mix theo round

| Round | Dễ / Vừa / Khó | Số câu Dễ / Vừa / Khó |
|---|---|---|
| Arena 1 | theo từng cụm 1/1/1 | tổng 5/5/5 |
| Arena 2 | 40/40/20% | 4/4/2 |
| Arena 3 | 20/50/30% | 2/5/3 |
| Arena 4 | 20/40/40% | 2/4/4 |
| Boss | 10/30/60% | 2/4/9 |

Boss chia độ khó theo ba cụm:

| Cụm trong Boss | Tổng câu | Dễ | Vừa | Khó |
|---|---:|---:|---:|---:|
| Cụm yếu nhất | 7 | 1 | 2 | 4 |
| Cụm yếu thứ hai | 5 | 1 | 1 | 3 |
| Cụm yếu thứ ba | 3 | 0 | 1 | 2 |

---

## 3. Boss Gate và World Quest

### 3.1 Khi nào World Quest xuất hiện

World Quest chỉ xuất hiện **sau khi người chơi đỗ Arena 4**.

Tại thời điểm đó:

1. hệ thống đã có đủ dữ liệu để xác định 3 cụm yếu nhất;
2. 3 cụm này được dùng cho cả kế hoạch Boss và World Quest;
3. hệ thống kiểm tra `credit_balance`.

```text
Đỗ Arena 4
    ↓
Xác định 3 cụm yếu nhất
    ↓
Ví ≥ 15 Credit?
   /           \
 Không          Có
  ↓              ↓
World Quest    Trả 15 Credit
  ↓              ↓
Cộng Credit      Boss mở
  ↓
Xét lại ví
  └──────────────→
```

### 3.2 Luật mở Boss

- Đỗ Arena 4 **chưa đủ** để vào Boss.
- Người chơi phải có và trả **15 Credit**.
- 15 Credit chỉ bị trừ khi mở Boss.
- Người đã đủ 15 Credit có thể bỏ qua World Quest.
- Không mở Boss thì chưa có bảng tổng kết sau Boss.

### 3.3 Cấu trúc World Quest

Một lượt World Quest có:

- **15 câu**;
- lấy từ đúng **3 cụm yếu nhất**;
- mỗi cụm **5 câu**;
- độ khó ngẫu nhiên;
- **không có timer**;
- **không có ngưỡng đỗ/trượt**;
- **không được dùng Bùa**;
- có thể chơi **bao nhiêu lần cũng được**.

Nguồn câu:

1. ưu tiên câu người chơi đã gặp ở Arena 1–4 thuộc 3 cụm này;
2. nếu không đủ mới lấy câu chưa gặp;
3. câu đã xuất hiện trong Quest phải được ghi lại để **Boss không hỏi lại** câu đó.

Lý do không ưu tiên câu mới cho Quest: Quest có thể được cày nhiều lần. Nếu mỗi lần đều tiêu thụ câu mới thì pool câu khó dành cho Boss sẽ nhanh chóng bị cạn.

### 3.4 Reward của World Quest

| Kết quả Quest | Credit nhận |
|---|---:|
| 0–8/15 | 0 |
| 9–11/15 | +2 |
| 12–13/15 | +3 |
| 14–15/15 | +4 |

Sau mỗi lượt Quest:

```text
Chấm Quest
   ↓
Cộng Credit
   ↓
Kiểm tra lại ví
   ├── <15 → có thể chơi Quest tiếp
   └── ≥15 → có thể trả 15 để mở Boss
```

### 3.5 World Quest không được làm thay đổi chẩn đoán

Kết quả Quest phải lưu riêng.

Quest **không được**:

- cộng vào `diagnostic_correct`;
- cộng vào `diagnostic_attempted`;
- làm thay đổi W1 hoặc W2;
- làm thay đổi `boss_clusters`;
- đi vào `accuracy_by_arena`;
- đi vào `performance_score`;
- làm thay đổi bảng tổng kết sau Boss.

Lý do: Quest ưu tiên lặp câu đã gặp, nên người chơi có thể nhớ đáp án. Nếu đưa Quest vào chẩn đoán, dữ liệu sẽ bị đẩy lên bởi hiệu ứng ghi nhớ.

---

## 4. Alternative path

### A1. Trượt Arena 1–4

Nếu người chơi không đạt ngưỡng của round:

- vẫn hiện kết quả và lời giải;
- **không nhận Credit thưởng của round**;
- Arena kế tiếp vẫn khoá;
- được chơi lại với bộ câu rút mới;
- không giới hạn số lần retry;
- penalty thời gian đã phát sinh ở Arena 3/4 vẫn được xử lý theo luật timer.

Boundary:

| Round | Fail | Pass |
|---|---|---|
| Arena 1 | 10/15 trở xuống | 11/15 trở lên |
| Arena 2 | 7/10 trở xuống | 8/10 trở lên |
| Arena 3 | 7/10 trở xuống | 8/10 trở lên |
| Arena 4 | 8/10 trở xuống | 9/10 trở lên |
| Boss | 13/15 trở xuống | 14/15 trở lên |

### A2. Trượt Boss

Nếu người chơi đã trả 15 Credit và vào Boss nhưng **trượt Boss**:

- Boss vẫn ở trạng thái mở;
- không hoàn 15 Credit;
- không yêu cầu trả thêm 15 Credit;
- lần sau rút một bộ Boss mới;
- người chơi được retry cho tới khi vượt Boss.

```text
Boss
 ↓
FAIL
 ↓
Boss vẫn mở
 ↓
Rút đề Boss mới
 ↓
Retry
```

### A3. Thoát giữa Arena 3 hoặc Arena 4

- lượt đang chơi bị huỷ;
- Bùa được hoàn theo luật cũ;
- nhưng penalty của các câu **đã xác nhận trước khi thoát** vẫn bị trừ;
- người chơi không thể thoát để né tiền phạt đã phát sinh.

### A4. Thoát giữa Boss

Thoát Boss khác với trượt Boss:

- lượt Boss bị huỷ;
- **15 Credit đã trả không hoàn**;
- Boss bị khoá lại;
- muốn vào Boss lại phải có và trả **15 Credit mới**;
- các penalty đã phát sinh trước khi thoát vẫn phải được xử lý theo luật timer.

Mục đích của rule này là tránh việc người chơi thoát Boss khi gặp đề khó chỉ để đổi sang đề khác.

### A5. Không mua Bùa

Shop/Bùa không phải điều kiện bắt buộc để đi hết hành trình.

Người chơi có thể:

- không mua Bùa;
- vẫn đỗ từng Arena;
- nếu đủ 15 Credit thì vào Boss bình thường.

### A6. Đúng toàn bộ Arena 1

Nếu nhiều cụm có cùng tỷ lệ đúng sau Arena 1, hệ thống dùng **chuỗi tie-break hiện có trong `SOLUTION_STRUCTURE.md`** để xác định W1.

Week 7 **không thay đổi logic tie-break**.

---

## 5. Timer và phạt quá giờ

Timer chỉ áp dụng cho:

- Arena 3: **100 giây/câu**;
- Arena 4: **80 giây/câu**;
- Boss: **60 giây/câu**.

### 5.1 Khi hết giờ

Hết giới hạn **không** làm câu bị nộp tự động.

Flow:

```text
Câu xuất hiện
   ↓
Đếm ngược
   ↓
Chạm 0
   ↓
Không auto-submit
   ↓
Chuyển sang đếm overtime
   ↓
Người chơi vẫn chọn đáp án
   ↓
Bấm Xác nhận
   ↓
Tính penalty của câu
```

### 5.2 Công thức penalty

Với:

- `t` = số giây người chơi đã dùng;
- `L` = giới hạn của round.

```text
penalty = ceil(max(0, t - L) / 10)
```

Ví dụ:

| Round | Thời gian | Quá giờ | Phạt |
|---|---:|---:|---:|
| Arena 3, L=100 | 100s | 0s | 0 |
| Arena 3, L=100 | 104s | 4s | -1 Credit |
| Arena 3, L=100 | 110s | 10s | -1 Credit |
| Arena 4, L=80 | 95s | 15s | -2 Credit |
| Boss, L=60 | 91s | 31s | -4 Credit |

### 5.3 Khi nào trừ penalty

- Phạt tính **riêng từng câu**.
- Tổng phạt của Arena được trừ sau khi chấm round.
- **Trượt round vẫn bị phạt.**
- `credit_balance` không bao giờ xuống dưới 0.
- Arena 3/4: penalty trừ vào ví sau khi chấm round.
- Boss: penalty trừ vào phần thưởng sau Boss; ví vẫn không âm.

Ví dụ Arena 4:

```text
Đúng 9/10 → reward +4
1 câu quá 4s → -1
1 câu quá 15s → -2

Net = +1 Credit
```

---

## 6. Credit flow

### 6.1 Credit khởi đầu

Người chơi bắt đầu với:

```text
3 Credit
```

### 6.2 Credit thưởng theo kết quả Arena

Bậc thưởng **giữ nguyên**:

| Tỷ lệ đúng của round | Credit thưởng |
|---|---:|
| Đỗ và đạt từ 70% | +2 |
| Đỗ và đạt từ 80% | +3 |
| Đỗ và đạt từ 90% | +4 |
| Trượt | 0 |
| Vượt Boss lần đầu | +5 bổ sung |

Lưu ý:

- reward tier và pass threshold là **hai rule khác nhau**;
- ví dụ Arena 4 cần 85% để đỗ, nên người đỗ Arena 4 luôn rơi vào bậc thưởng `+4`.

### 6.3 Credit dùng vào đâu

Credit dùng cho:

- mua Bùa Loại Trừ: **3 Credit**;
- mở Boss: **15 Credit**.

World Quest là cơ chế kiếm thêm Credit nếu người chơi thiếu tiền mở Boss.

---

## 7. Error path

| # | Tình huống | Xử lý |
|---|---|---|
| E1 | Xác nhận khi chưa chọn phương án | Chặn chuyển câu |
| E2 | Mua Bùa khi không đủ Credit | Vô hiệu hoá nút và báo còn thiếu bao nhiêu Credit |
| E3 | Dùng Bùa thứ hai trong cùng một round | Chặn — mỗi round tối đa 1 Bùa |
| E4 | Dùng Bùa ở Arena 1 | Chặn |
| E5 | Dùng Bùa trong World Quest | Chặn |
| E6 | Ngân hàng thiếu câu mới đúng mức difficulty cần rút | Dùng câu cùng mức đã gặp; nếu vẫn thiếu thì hạ xuống mức vừa; ghi `bankLog` |
| E7 | Hết timer ở Arena 3/4/Boss | Không auto-submit; chuyển sang overtime |
| E8 | Penalty lớn hơn số Credit đang có | Trừ tới 0, không cho ví âm |
| E9 | Người chơi chưa đủ 15 Credit nhưng bấm vào Boss | Chặn, hiển thị số Credit còn thiếu và đường sang World Quest |
| E10 | Quest đã dùng một câu | Ghi `question_id` để Boss loại câu đó |
| E11 | Mất dữ liệu trình duyệt | Khởi tạo tiến trình mới, báo bắt đầu lại |

Các lỗi chia thành ba nhóm:

1. **Chặn thao tác:** E1–E5, E9.  
   Giao diện phải nói rõ vì sao thao tác bị chặn.

2. **Engine tự fallback:** E6, E8, E10.  
   Logic phải có state/log để kiểm tra lại.

3. **Flow đặc biệt:** E7, E11.  
   Timer tiếp tục bằng overtime; mất storage thì khởi tạo lại tiến trình.

---

## 8. Luật dùng Bùa chi phối flow

| # | Luật | Hệ quả |
|---|---|---|
| 1 | Arena 1 không dùng Bùa | Giữ dữ liệu chẩn đoán gốc sạch |
| 2 | Arena 2, Arena 3, Arena 4 và Boss tối đa 1 Bùa mỗi round | Không cho dồn nhiều vật phẩm vào cùng một round |
| 3 | World Quest không dùng Bùa | Quest chỉ là vòng luyện + kiếm Credit |
| 4 | Mỗi câu tối đa 1 vật phẩm | Không stack effect trên cùng một câu |
| 5 | Bùa Loại Trừ giá 3 Credit | Mua Bùa làm giảm số Credit có thể dùng để mở Boss |

Câu trả lời đúng nhờ Bùa:

- **được tính** vào `arena_score_correct`;
- **được tính** để xét đỗ/trượt;
- **không được tính** vào dữ liệu chẩn đoán;
- **không được dùng** làm bằng chứng trong `performance_score` theo logic hiện hành.

Boss được dùng tối đa 1 Bùa. Đây là thay đổi so với v11.

---


```
