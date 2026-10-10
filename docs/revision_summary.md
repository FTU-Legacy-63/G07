# REVISION SUMMARY — Week 7

**Sản phẩm:** CFA Quest — Ethics  
**Học phần:** NHA408E · Nhóm 7  
**Mục đích:** ghi lại thay đổi từ bản v11 sang thiết kế Week 7 và lý do thay đổi sau góp ý của giảng viên.

---

## 1. Vì sao phải sửa

Ở bản v11, logic chẩn đoán đã đúng hướng nhưng độ khó giữa các round còn khá phẳng:

- tất cả round đều dùng ngưỡng đỗ 70%;
- chưa có tỉ lệ easy/medium/hard riêng theo round;
- thời gian chỉ được ghi nhận, chưa dùng để tạo áp lực;
- Boss tự mở sau Arena 4;
- người chơi thiếu Credit không có vòng luyện thêm.

Feedback yêu cầu ba điểm:

1. **Round sau phải khó hơn round trước.**
2. **Người chơi phải đạt đến một mức progression nhất định mới được đi tiếp.**
3. **Game phải có cơ chế hỗ trợ người chơi vượt các round khó.**

Week 7 vì vậy giữ nguyên core diagnostic logic nhưng thay đổi progression và difficulty.

---

## 2. Tóm tắt trước / sau

| Hạng mục | v11 | Week 7 |
|---|---|---|
| Pass threshold | 70% cho cả 5 round | Arena 1: 70% · Arena 2: 75% · Arena 3: 75% · Arena 4: 85% · Boss: 90% |
| Difficulty | Rút theo cluster, chưa có quota easy/medium/hard riêng | Mỗi round có difficulty mix riêng, càng về sau càng nhiều câu hard |
| Arena 3 timer | Không giới hạn | 100 giây/câu |
| Arena 4 timer | Không giới hạn | 80 giây/câu |
| Boss timer | Không giới hạn | 60 giây/câu |
| Quá giờ | Không phạt | Trừ Credit theo từng block 10 giây quá giờ |
| Mở Boss | Tự mở sau khi đỗ Arena 4 | Đỗ Arena 4 **và trả 15 Credit** |
| Bùa ở Boss | Không được dùng | Được dùng tối đa 1 Bùa Loại Trừ |
| Kiếm thêm Credit | Không có | Thêm **World Quest** |
| Boss retry | Theo flow cũ | Trượt Boss được retry mà không trả lại 15 Credit |
| Quit Boss | Chưa có rule riêng | Mất 15 Credit đã trả và Boss bị khoá lại |
| O4 improvement threshold | 70% | **Giữ nguyên 70%** |
| Core diagnostic logic | W1/W2/Boss 7/5/3 | **Giữ nguyên** |

---

## 3. Pass threshold mới

| Round | Số câu | Ngưỡng đỗ | Số câu đúng tối thiểu |
|---|---:|---:|---:|
| Arena 1 | 15 | 70% | 11/15 |
| Arena 2 | 10 | 75% | 8/10 |
| Arena 3 | 10 | 75% | 8/10 |
| Arena 4 | 10 | 85% | 9/10 |
| Boss | 15 | 90% | 14/15 |

Arena 2 và Arena 3 cùng threshold 75%.

Arena 3 vẫn khó hơn Arena 2 nhờ:

- tỷ lệ câu hard cao hơn;
- có timer 100 giây/câu.

Credit reward tier giữ nguyên:

```text
≥70% → +2
≥80% → +3
≥90% → +4
```

Người chơi chỉ nhận reward nếu round đó **đỗ**.

---

## 4. Difficulty mix mới

| Round | Easy / Medium / Hard | Số câu |
|---|---|---|
| Arena 1 | mỗi cluster 1/1/1 | tổng 5/5/5 |
| Arena 2 | 40/40/20% | 4/4/2 |
| Arena 3 | 20/50/30% | 2/5/3 |
| Arena 4 | 20/40/40% | 2/4/4 |
| Boss | 10/30/60% | 2/4/9 |

Boss vẫn lấy ba cluster yếu nhất theo:

```text
7 / 5 / 3 câu
```

Difficulty trong Boss:

| Cluster trong Boss | Tổng câu | Easy | Medium | Hard |
|---|---:|---:|---:|---:|
| Yếu nhất | 7 | 1 | 2 | 4 |
| Yếu thứ hai | 5 | 1 | 1 | 3 |
| Yếu thứ ba | 3 | 0 | 1 | 2 |

Nếu thiếu câu mới đúng difficulty:

1. dùng lại câu đã gặp ở cùng difficulty;
2. nếu vẫn thiếu thì hạ xuống medium;
3. ghi vào `bankLog`.

---

## 5. Timer và penalty

Timer mới:

| Round | Giới hạn |
|---|---:|
| Arena 3 | 100 giây/câu |
| Arena 4 | 80 giây/câu |
| Boss | 60 giây/câu |

Hết giờ:

- không auto-submit;
- người chơi vẫn được trả lời;
- app chuyển sang đếm overtime;
- penalty tính riêng từng câu.

Công thức:

```text
penalty = ceil(max(0, t - L) / 10)
```

Trong đó:

- `t` = số giây đã dùng;
- `L` = giới hạn của round.

Ví dụ:

```text
Arena 3: 104s → -1 Credit
Arena 3: 110s → -1 Credit
Arena 4: 95s  → -2 Credit
Boss:    91s  → -4 Credit
```

Trượt round vẫn bị penalty.

Credit không được xuống dưới 0.

---

## 6. Boss Gate

Boss không còn tự mở sau Arena 4.

Điều kiện mới:

```text
Đỗ Arena 4
+
Có ít nhất 15 Credit
+
Trả 15 Credit
=
Boss mở
```

Lý do chọn 15 Credit:

```text
3 Credit khởi đầu
+2 Arena 1
+3 Arena 2
+3 Arena 3
+4 Arena 4
= 15 Credit
```

Một người đỗ cả 4 round ngay lần đầu, không mua Bùa và không bị penalty sẽ vừa đủ mở Boss.

### Fail Boss

Nếu người chơi trượt Boss:

- Boss vẫn mở;
- không cần trả thêm 15 Credit;
- lần sau rút đề mới.

### Quit Boss

Nếu người chơi thoát giữa Boss:

- lượt Boss bị huỷ;
- 15 Credit đã trả không hoàn;
- Boss bị khoá lại;
- muốn vào lại phải kiếm và trả 15 Credit mới.

---

## 7. World Quest

World Quest mở sau khi đỗ Arena 4.

Mục đích:

> cho người thiếu Credit có một vòng luyện thêm để kiếm đủ Credit mở Boss.

Một lượt Quest:

- 15 câu;
- dùng 3 cluster yếu nhất;
- mỗi cluster 5 câu;
- difficulty ngẫu nhiên;
- không timer;
- không pass/fail;
- không dùng Bùa;
- có thể chơi nhiều lần.

Reward:

| Kết quả | Credit |
|---|---:|
| 0–8/15 | 0 |
| 9–11/15 | +2 |
| 12–13/15 | +3 |
| 14–15/15 | +4 |

Quest ưu tiên câu đã gặp ở Arena 1–4.

Nếu không đủ mới lấy câu chưa gặp.

Câu đã xuất hiện trong Quest phải bị loại khỏi Boss.

Quan trọng:

```text
World Quest không tham gia diagnostic.
```

Quest không làm thay đổi:

- W1;
- W2;
- `boss_clusters`;
- `diagnostic_correct`;
- `diagnostic_attempted`;
- `accuracy_by_arena`;
- `performance_score`;
- bảng tổng kết sau Boss.

---

## 8. Bùa ở Boss

v11:

```text
Boss không được dùng item.
```

Week 7:

```text
Boss được dùng tối đa 1 Bùa Loại Trừ.
```

Bùa Loại Trừ:

```text
Giá = 3 Credit
```

Câu đúng nhờ Bùa:

- vẫn tính vào `arena_score_correct`;
- vẫn giúp pass Boss;
- không được dùng làm dữ liệu diagnostic.

---

## 9. Những gì giữ nguyên

Week 7 chỉ làm gameplay khó hơn và thêm progression gate. Core diagnostic logic không đổi.

Giữ nguyên:

- 5 round chính với số câu `15 / 10 / 10 / 10 / 15`;
- Arena 2 nhắm W1;
- Arena 4 nhắm W2;
- W2 bắt buộc khác W1;
- Boss lấy 3 cluster yếu nhất;
- Boss split `7 / 5 / 3`;
- Arena 1 mỗi cluster có 3 câu đủ easy/medium/hard;
- tie-break khi cluster bằng điểm;
- `arena_score_correct` và diagnostic counter là hai bộ đếm riêng;
- câu dùng Bùa có thể giúp pass nhưng không làm tăng diagnostic;
- bảng tổng kết sau Boss vẫn dùng **mốc 70%** cho nhãn improvement.

### Không nhầm hai threshold

```text
Boss pass threshold = 90%
O4 improvement threshold = 70%
```

Hai rule này phục vụ hai mục đích khác nhau.

---

## 10. File bị ảnh hưởng

Các file đã cập nhật theo Week 7:

```text
docs/SOLUTION_STRUCTURE.md
docs/INPUT_DICTIONARY.md
docs/user-flow.md
docs/feature-scope.md
docs/ASSUMPTIONS.md
docs/SOURCE_USE_MAP.md

W6/testing.md
W6/demo-input.md
W6/limitations.md

README.md
```

File mới:

```text
docs/revision_summary.md
```

`W4/CFA_Quest_user_flow.xlsm` được xem là historical v11 artifact nếu chưa cập nhật.

Các file Midterm giữ nguyên như historical evidence.

---

## 11. Limitations của thay đổi Week 7

Các con số mới hiện vẫn là design choices của project:

- threshold `70/75/75/85/90`;
- timer `100/80/60`;
- penalty theo block 10 giây;
- Boss Gate 15 Credit;
- Quest reward `0/+2/+3/+4`.

Các limitation chính:

1. Chưa có đủ dữ liệu người chơi thật để xác nhận các con số trên là tối ưu.
2. Arena 2 và Arena 3 cùng threshold 75%; khác biệt difficulty phụ thuộc question mix và timer.
3. Mỗi cluster chỉ có khoảng 9–10 hard questions; replay có thể làm cạn hard pool.
4. Quest lặp câu cũ nên có thể dễ dần do người chơi nhớ đáp án.
5. Browser timer có thể lệch nếu đổi tab hoặc máy chậm.
6. Boss 90% với 9 câu hard có thể quá khó với người mới.

Chi tiết nằm trong:

```text
W6/limitations.md
```

---

## 12. Kết luận revision

Week 7 không thay đổi mục tiêu chẩn đoán của CFA Quest.

Thay đổi tập trung vào ba vấn đề từ feedback:

```text
Round sau khó hơn round trước
+
Người chơi phải đạt progression nhất định mới vào Boss
+
Người thiếu progression có World Quest để luyện và kiếm thêm Credit
```

Core loop vẫn là:

```text
Diagnose
→ Rank Weakness
→ Generate Targeted Arena
→ Re-Diagnose
→ Verify at Boss
```
