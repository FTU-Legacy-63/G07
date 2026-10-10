# TESTING — Week 6 / Week 7 Revision

**Sản phẩm:** CFA Quest — Ethics  
**Học phần:** NHA408E · Nhóm 7  
**Nguồn rule:** `SOLUTION_STRUCTURE.md`, `INPUT_DICTIONARY.md`, `user-flow.md`, `feature-scope.md`, `ASSUMPTIONS.md` bản Week 7  
**Mục tiêu:** kiểm thử engine sau khi áp dụng thiết kế mới: progressive pass threshold, difficulty quota, timer/overtime penalty, Boss Gate 15 Credit, Boss dùng Bùa và World Quest.

---

## 1. Cấu trúc file test

9 cột bắt buộc:

**ID · Case · Input · Expected · Actual · Status · Author · Fix owner · Verifier**

Các nhóm mã:

| Mã | Nhóm | Nội dung |
|---|---|---|
| **T-S** | Chấm điểm & Credit | pass threshold theo round, reward tier, Boss bonus |
| **T-G** | Sinh đề | Arena 1, W1/W2, difficulty quota, Boss 7/5/3, fallback |
| **T-T** | Timer & penalty | timer 100/80/60, overtime, penalty, ví không âm |
| **T-B** | Boss Gate & Boss state | giá mở Boss, fail/retry, quit/relock, Bùa ở Boss |
| **T-Q** | World Quest | 15 câu 5/5/5, reward, replay, tách khỏi diagnosis, loại câu khỏi Boss |
| **T-I** | Thao tác sai / edge case | submit rỗng, reset, JSON lỗi, item rule, thoát giữa round |
| **T-F** | Khớp số liệu | `accuracy_by_arena`, `performance_score`, O4 và mốc 70% |

---

# 2. T-S — Chấm điểm và Credit

## 2.1 Nguyên tắc

Pass threshold mới:

| Round | Threshold | Biên pass |
|---|---:|---:|
| Arena 1 | 70% | 11/15 |
| Arena 2 | 75% | 8/10 |
| Arena 3 | 75% | 8/10 |
| Arena 4 | 85% | 9/10 |
| Boss | 90% | 14/15 |

Credit reward **không đổi**:

- đỗ và đạt từ 70% → `+2`;
- đỗ và đạt từ 80% → `+3`;
- đỗ và đạt từ 90% → `+4`;
- trượt → `0`;
- lần đầu vượt Boss → thêm `+5`.

> Reward tier và pass threshold là hai rule khác nhau.

## 2.2 Test table

| ID | Case | Input | Expected | Actual | Status | Author | Fix owner | Verifier |
|---|---|---|---|---|---|---|---|---|
| T-S01 | Arena 1 — ngay dưới ngưỡng | 10/15, Credit trước = 3 | 66,7% < 70% → **FAIL**; +0; Credit sau = 3 | Đã test — khớp Expected | ✅ Pass | Minh | — | Trang |
| T-S02 | Arena 1 — ngay trên ngưỡng | 11/15, Credit trước = 3 | 73,3% ≥ 70% → **PASS**; tier ≥70% → +2; Credit sau = 5 | Đã test — khớp Expected | ✅ Pass | Minh | — | Trang |
| **T-S03** | **Arena 2 — 7/10 không còn đủ để đỗ** | Arena 2, 7/10, Credit trước = 5 | 70% < 75% → **FAIL**; +0; Credit sau = 5 | Đã test — khớp Expected | ✅ Pass | Minh | — | Trang |
| T-S04 | Arena 2 — biên pass | Arena 2, 8/10, Credit trước = 5 | 80% ≥75% → **PASS**; tier ≥80% → +3; Credit sau = 8 | Đã test — khớp Expected | ✅ Pass | Minh | — | Trang |
| T-S05 | Arena 3 — ngay dưới ngưỡng | Arena 3, 7/10, không penalty, Credit trước = 8 | 70% <75% → **FAIL**; reward 0; Credit sau = 8 | Đã test — khớp Expected | ✅ Pass | Minh | — | Trang |
| T-S06 | Arena 3 — biên pass | Arena 3, 8/10, không penalty, Credit trước = 8 | 80% ≥75% → **PASS**; +3; Credit sau = 11 | Đã test — khớp Expected | ✅ Pass | Minh | — | Trang |
| T-S07 | Arena 4 — 8/10 vẫn trượt | Arena 4, 8/10, không penalty, Credit trước = 11 | 80% <85% → **FAIL**; reward 0 | Đã test — khớp Expected | ✅ Pass | Minh | — | Trang |
| T-S08 | Arena 4 — biên pass | Arena 4, 9/10, không penalty, Credit trước = 11 | 90% ≥85% → **PASS**; tier ≥90% → +4; Credit sau = 15 | Đã test — khớp Expected | ✅ Pass | Minh | — | Trang |
| T-S09 | Boss — 13/15 vẫn trượt | Boss đã mở, 13/15, không penalty | 86,7% <90% → **FAIL**; reward 0; không có +5 first-clear | Đã test — khớp Expected | ✅ Pass | Minh | — | Trang |
| T-S10 | Boss — biên pass lần đầu | Boss đã mở, 14/15, `bossClearedOnce=false`, không penalty | 93,3% ≥90% → **PASS**; +4 tier +5 first-clear | Đã test — khớp Expected | ✅ Pass | Minh | — | Trang |
| T-S11 | Boss — clear lần sau không còn +5 | Boss đã từng clear, 14/15, không penalty | PASS; +4; **không** cộng +5 | Đã test — khớp Expected | ✅ Pass | Minh | — | Trang |




---

# 3. T-G — Sinh đề

## 3.1 Rule cần kiểm thử

Difficulty quota:

| Round | Easy / Medium / Hard | Số câu |
|---|---|---|
| Arena 1 | mỗi cụm 1/1/1 | tổng 5/5/5 |
| Arena 2 | 40/40/20% | 4/4/2 |
| Arena 3 | 20/50/30% | 2/5/3 |
| Arena 4 | 20/40/40% | 2/4/4 |
| Boss | 10/30/60% | 2/4/9 |

Boss cluster split:

```text
Weakest     = 7 câu = 1 easy + 2 medium + 4 hard
Second      = 5 câu = 1 easy + 1 medium + 3 hard
Third       = 3 câu = 0 easy + 1 medium + 2 hard
```

## 3.2 Test table

| ID | Case | Input | Expected | Actual | Status | Author | Fix owner | Verifier |
|---|---|---|---|---|---|---|---|---|
| T-G01 | Arena 1 giữ cấu trúc diagnostic cũ | Bank đủ câu C1–C5 / difficulty 1–3 | 15 câu; mỗi cụm đúng 3 câu `[1,2,3]`; tổng difficulty = 30 | Đã test — khớp Expected | ✅ Pass | Trang | — | Minh |
| T-G02 | Arena 2 chỉ lấy W1 | `W1=C2` | 10 câu; tất cả `cluster=C2` | Đã test — khớp Expected | ✅ Pass | Trang | — | Minh |
| T-G03 | Arena 2 đúng quota difficulty | `W1=C2`, bank đủ | 10 câu C2 gồm **4 easy + 4 medium + 2 hard** | Đã test — khớp Expected | ✅ Pass | Trang | — | Minh |
| T-G04 | Arena 3 giữ 2 câu/cụm | Bank đủ | 10 câu; C1–C5 mỗi cụm đúng 2 câu | Đã test — khớp Expected | ✅ Pass | Trang | — | Minh |
| T-G05 | Arena 3 đúng quota difficulty | Cùng input T-G04 | Toàn round = **2 easy + 5 medium + 3 hard**, đồng thời vẫn 2 câu/cụm | Đã test — khớp Expected | ✅ Pass | Trang | — | Minh |
| T-G06 | W2 bắt buộc khác W1 | `W1=C2`; sau Arena 3 C2 vẫn yếu nhất, C3 yếu thứ hai | Loại C2 khi chọn W2 → `W2=C3` | Đã test — khớp Expected | ✅ Pass | Trang | — | Minh |
| T-G07 | Arena 4 chỉ lấy W2 | `W2=C3` | 10 câu; tất cả `cluster=C3` | Đã test — khớp Expected | ✅ Pass | Trang | — | Minh |
| T-G08 | Arena 4 đúng quota difficulty | `W2=C3`, bank đủ | **2 easy + 4 medium + 4 hard** | Đã test — khớp Expected | ✅ Pass | Trang | — | Minh |
| T-G09 | Boss chọn đúng 3 cụm yếu nhất | Ranking sau Arena 4: C1 < C2 < C3 < C5 < C4 | `bossPlan=[C1:7,C2:5,C3:3]` | Đã test — khớp Expected | ✅ Pass | Trang | — | Minh |
| T-G10 | Boss đúng cluster split 7/5/3 | `bossPlan` như T-G09 | 15 câu: C1=7, C2=5, C3=3 | Đã test — khớp Expected | ✅ Pass | Trang | — | Minh |
| T-G11 | Boss đúng difficulty tổng | Boss bank đủ | 15 câu = **2 easy + 4 medium + 9 hard** | Đã test — khớp Expected | ✅ Pass | Trang | — | Minh |
| T-G12 | Boss đúng difficulty trong từng cluster | C1/C2/C3 theo `bossPlan` | C1 `1/2/4`; C2 `1/1/3`; C3 `0/1/2` | Đã test — khớp Expected | ✅ Pass | Trang | — | Minh |
| T-G13 | Fallback cấp 1 — hết câu mới đúng difficulty | Cụm cần hard nhưng toàn hard chưa gặp đã hết; vẫn còn hard từng gặp | Reuse câu **cùng difficulty hard**; ghi `bankLog` | Đã test — khớp Expected | ✅ Pass | Trang | — | Minh |
| T-G14 | Fallback cấp 2 — hết cả câu cùng difficulty | Không còn câu phù hợp mức yêu cầu | Hạ về **medium**; ghi `bankLog` | Đã test — khớp Expected | ✅ Pass | Trang | — | Minh |
| T-G15 | Tie-break W1 giữ logic cũ | C1,C2 cùng accuracy; C1 sai difficulty TB cao hơn | W1 chọn C1 theo tie-break hiện hành | Đã test — khớp Expected | ✅ Pass | Trang | — | Minh |

---

# 4. T-T — Timer và overtime penalty

## 4.1 Rule

Timer:

```text
Arena 3 = 100 giây/câu
Arena 4 = 80 giây/câu
Boss    = 60 giây/câu
```

Không timer:

```text
Arena 1
Arena 2
World Quest
```

Công thức:

```text
penalty = ceil(max(0, t - L) / 10)
```

Hết giờ:

- không auto-submit;
- chuyển sang đếm overtime;
- người chơi vẫn trả lời bình thường.

## 4.2 Boundary tests

| ID | Case | Input | Expected | Actual | Status | Author | Fix owner | Verifier |
|---|---|---|---|---|---|---|---|---|
| T-T01 | Đúng bằng giới hạn | Arena 3, `t=100`, `L=100` | overtime=0; penalty=0 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-T02 | Quá 1 giây | Arena 3, `t=101` | overtime=1; penalty=1 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-T03 | Quá đúng 10 giây | Arena 3, `t=110` | overtime=10; penalty=1 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-T04 | Quá 11 giây | Arena 3, `t=111` | overtime=11; penalty=2 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-T05 | Arena 4 example | `t=95`, `L=80` | overtime=15; penalty=2 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-T06 | Boss example | `t=91`, `L=60` | overtime=31; penalty=4 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-T07 | Hết timer không auto-submit | Arena 4, chờ quá 80s nhưng chưa chọn đáp án | Câu vẫn mở; timer chuyển sang overtime; không tự chấm | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-T08 | Trượt vẫn bị phạt | Arena 4, 8/10 FAIL, tổng penalty=3, Credit trước=8 | reward=0; Credit sau=`max(0,8-3)=5` | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-T09 | Ví không âm | Arena 3, Credit trước=2, penalty=5 | Credit sau=0, không âm | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-T10 | Reward và penalty cùng round | Arena 4, 9/10 PASS; +4; penalty=3; Credit trước=8 | Net +1 → Credit sau=9 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-T11 | Arena 1 không timer | Arena 1 | Không countdown; không penalty | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-T12 | Arena 2 không timer | Arena 2 | Không countdown; không penalty | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-T13 | Quest không timer | World Quest | Không countdown; không penalty | Đã test — khớp Expected | ✅ Pass | — | — | — |

---

# 5. T-B — Boss Gate và Boss state

## 5.1 Rule

Boss chỉ mở khi:

```text
Đỗ Arena 4
+
credit_balance >= 15
+
trả 15 Credit
```

Boss được dùng tối đa **1 Bùa Loại Trừ**.

Fail Boss và quit Boss là hai nhánh khác nhau.

## 5.2 Test table

| ID | Case | Input | Expected | Actual | Status | Author | Fix owner | Verifier |
|---|---|---|---|---|---|---|---|---|
| T-B01 | Thiếu Credit — Boss bị khoá | Đã đỗ Arena 4; Credit=14 | Không vào Boss; hiển thị thiếu 1 Credit; World Quest khả dụng | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-B02 | Đúng 15 Credit | Đã đỗ Arena 4; Credit=15 | Cho trả 15; Credit sau=0; Boss mở | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-B03 | Nhiều hơn 15 Credit | Credit=18 | Trả 15; Credit sau=3; Boss mở | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-B04 | Không trừ 15 hai lần trong cùng lần mở | Boss đã mở, phí đã trả | Vào Boss không bị trừ thêm | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-B05 | Trượt Boss không phải trả lại phí | Boss đã mở; 13/15 FAIL | Boss vẫn mở; retry được; không trừ thêm 15 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-B06 | Retry Boss phải rút đề mới | Sau T-B05 | Lần retry tạo bộ Boss mới theo rule generation | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-B07 | Quit Boss không hoàn phí | Đã trả 15 rồi thoát giữa Boss | Lượt bị huỷ; 15 Credit không hoàn | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-B08 | Quit Boss làm relock | Tiếp T-B07 | `boss_unlocked=false`; muốn vào lại phải trả 15 mới | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-B09 | Boss cho dùng 1 Bùa | Boss đang chơi; còn Bùa | Cho dùng Bùa thứ nhất | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-B10 | Boss chặn Bùa thứ hai | Boss đã dùng 1 Bùa | Chặn lần thứ hai | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-B11 | Bùa đúng vẫn tính pass score | Boss, câu dùng Bùa trả lời đúng | Tăng `arena_score_correct` | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-B12 | Bùa không vào diagnosis | Cùng record T-B11 | Câu bị loại khỏi diagnostic counters / O4 evidence | Đã test — khớp Expected | ✅ Pass | — | — | — |

---

# 6. T-Q — World Quest

## 6.1 Rule

World Quest chỉ mở sau khi đỗ Arena 4.

Một lượt:

```text
15 câu
3 cụm yếu nhất
5 câu/cụm
difficulty ngẫu nhiên
không timer
không pass/fail
không Bùa
replay không giới hạn
```

Reward:

| Score | Reward |
|---|---:|
| 0–8 | 0 |
| 9–11 | +2 |
| 12–13 | +3 |
| 14–15 | +4 |

Quest ưu tiên câu đã gặp ở Arena 1–4. Không đủ mới lấy câu chưa gặp.

Câu đã ra ở Quest **không được xuất hiện trong Boss**.

## 6.2 Test table

| ID | Case | Input | Expected | Actual | Status | Author | Fix owner | Verifier |
|---|---|---|---|---|---|---|---|---|
| T-Q01 | Quest chưa mở trước Arena 4 | Chưa đỗ Arena 4 | Không cho vào Quest | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q02 | Quest mở sau Arena 4 | Đã đỗ Arena 4 | `quest_available=true` | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q03 | Quest đúng 15 câu | `boss_clusters=[C1,C2,C3]` | Tổng 15 câu | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q04 | Quest đúng 5/5/5 cluster | Cùng T-Q03 | C1=5, C2=5, C3=5 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q05 | Quest không có pass/fail | Bất kỳ score | Không có state PASS/FAIL; chỉ chấm score và reward | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q06 | Reward dưới 60% | 8/15 | +0 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q07 | Reward biên 60% | 9/15 | +2 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q08 | Reward giữa tier | 11/15 | +2 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q09 | Reward biên 80% | 12/15 | +3 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q10 | Reward 13/15 | 13/15 | +3 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q11 | Reward biên 90% | 14/15 | +4 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q12 | Reward 15/15 | 15/15 | +4 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q13 | Replay Quest | Hoàn thành Quest rồi vào lại | Cho chơi lại; `quest_attempt_index` tăng | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q14 | Quest không dùng Bùa | Đang ở Quest và thử dùng Bùa | Chặn | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q15 | Quest không có timer | Làm Quest >100s/câu | Không penalty | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q16 | Ưu tiên câu đã gặp | 3 cụm có đủ câu từng gặp A1–A4 | Quest rút từ pool đã gặp trước | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q17 | Thiếu câu đã gặp | Pool seen không đủ 15 | Phần thiếu được lấy từ câu chưa gặp | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q18 | Quest không làm đổi diagnostic | Snapshot counters trước Quest; chơi Quest | `diagnostic_correct/attempted`, W1/W2, `boss_clusters` không đổi | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q19 | Quest không vào O4 | Có nhiều lượt Quest | `accuracy_by_arena` và `performance_score` chỉ gồm 5 Arena | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-Q20 | Boss loại toàn bộ câu Quest | Lưu `quest_used_question_ids`; sau đó build Boss | Giao `quest_used_question_ids ∩ boss_question_ids = ∅` | Đã test — khớp Expected | ✅ Pass | — | — | — |

---

# 7. T-I — Thao tác sai / edge case

Các behavior v11 không bị thay đổi vẫn phải regression test sau khi merge code Week 7.

| ID | Case | Input | Expected | Actual | Status | Author | Fix owner | Verifier |
|---|---|---|---|---|---|---|---|---|
| T-I01 | Submit khi chưa chọn đáp án | Không chọn option rồi bấm Xác nhận | Chặn chuyển câu; báo chọn một phương án | Đã test — khớp Expected | ✅ Pass | Khoi | — | Hồng |
| T-I02 | Reset khi đang làm dở Arena | Bấm Reset giữa round | Có confirm; xác nhận mới xoá run | Đã test — khớp Expected | ✅ Pass | Khoi | — | Hồng |
| T-I03 | Reset tại Dashboard | Bấm Reset khi không có round active | Có confirm riêng cho Dashboard | Đã test — khớp Expected | ✅ Pass | Khoi | — | Hồng |
| T-I04 | Nạp JSON không hợp lệ | Nạp file lỗi parse | Bắt lỗi, hiển thị toast/message; app không crash | Đã test — khớp Expected | ✅ Pass | Khoi | — | Hồng |
| T-I05 | Mua Bùa khi không đủ Credit | Credit <3 | Chặn mua; hiển thị thiếu Credit | Đã test — khớp Expected | ✅ Pass | Khoi | — | Hồng |
| T-I06 | Dùng Bùa lần 2 ở Arena 2–4 | Đã dùng 1 Bùa trong round | Chặn | Đã test — khớp Expected | ✅ Pass | Khoi | — | Hồng |
| T-I07 | Arena 1 không dùng Bùa | Thử dùng Bùa ở Arena 1 | Chặn | Đã test — khớp Expected | ✅ Pass | Khoi | — | Hồng |
| T-I08 | World Quest không dùng Bùa | Thử dùng Bùa ở Quest | Chặn | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-I09 | Thoát Arena 1/2 | Đã dùng Bùa ở Arena 2 rồi quit | Lượt huỷ; Bùa hoàn theo rule cũ | Đã test — khớp Expected | ✅ Pass | Khoi | — | Hồng |
| T-I10 | Thoát Arena 3/4 sau khi có penalty | Có câu đã submit quá giờ rồi quit | Lượt huỷ; Bùa hoàn; **penalty đã phát sinh vẫn bị trừ** | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-I11 | Quit để né timer penalty | Arena 4 đã có overtime rồi quit | Penalty không biến mất | Đã test — khớp Expected | ✅ Pass | — | — | — |

---

# 8. T-F — Khớp số liệu và bảng tổng kết

## 8.1 Câu dùng Bùa: Arena score vs diagnostic vs performance

| ID | Case | Input | Expected | Actual | Status | Author | Fix owner | Verifier |
|---|---|---|---|---|---|---|---|---|
| T-F01 | Bùa tính Arena score nhưng loại khỏi diagnostic | Arena 2, 10/10; 1 câu dùng Bùa và đúng | `arena_score_correct=10`; diagnostic của cluster chỉ `9/9` | Đã test — khớp Expected | ✅ Pass | Minh | — | Hồng |
| T-F02 | Bùa không kiếm `performance_score` numerator | Câu Bùa difficulty 2, đúng | `points_offered` vẫn +2; `points_earned` không +2 | Đã test — khớp Expected | ✅ Pass | Minh | — | Hồng |
| T-F03 | Quest không vào `performance_score` | Hoàn thành 5 Arena + nhiều Quest | Σ points chỉ lấy 5 Arena | Đã test — khớp Expected | ✅ Pass | — | — | — |

## 8.2 O4 vẫn dùng mốc 70%, không dùng Boss threshold 90%

Week 7 đổi Boss pass thành 90% nhưng **không đổi nhãn improvement theo cluster**.

| ID | Case | Input | Expected | Actual | Status | Author | Fix owner | Verifier |
|---|---|---|---|---|---|---|---|---|
| T-F04 | Boss pass threshold không làm đổi O4 threshold | Cluster Boss đạt 5/7 =71,4%, Δ≥0; toàn Boss đủ 14/15 để pass | Cluster có thể nhận nhãn `improved` theo rule O4 70%; không đòi cluster đó ≥90% | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-F05 | Slot 5 câu | Boss cluster 4/5=80%, Δ≥0 | Đạt mốc 70% của O4 | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-F06 | Slot 3 câu | Boss cluster 2/3=66,7%, Δ≥0 | Không đạt mốc 70% | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-F07 | Slot 3 câu đủ mốc | Boss cluster 3/3=100%, Δ≥0 | Đạt mốc 70% | Đã test — khớp Expected | ✅ Pass | — | — | — |
| T-F08 | `performance_score` app = tính tay | Một run Week 7 cố định bằng seed sau khi engine hoàn tất | `Σ points_earned / Σ points_offered` của 5 Arena = số UI | Đã test — khớp Expected | ✅ Pass | Minh | — | Hồng |

---

# 9. Integration journey — Credit đi qua một lượt

Hai case dưới đây lấy đúng logic minh hoạ Week 7 để kiểm tra các module không sai khi ghép lại.

## T-E2E01 — Người chơi giỏi, bỏ qua Quest

Input:

| Bước | Kết quả |
|---|---|
| Start | 3 Credit |
| Arena 1 | 14/15 → +4 |
| Arena 2 | 9/10 → +4 |
| Arena 3 | 9/10, không overtime → +4 |
| Arena 4 | 9/10, 1 câu quá 3s → +4 -1 |
| Boss Gate | trả 15 |
| Boss | 14/15, first clear, không penalty → +4 +5 |

Expected:

```text
Start       3
A1          7
A2         11
A3         15
A4         18
Pay Boss    3
Boss       12
```

| ID | Expected | Actual | Status |
|---|---|---|---|
| T-E2E01 | Ví cuối = **12**; Quest không xuất hiện bắt buộc | Đã test — khớp Expected | ✅ Pass |

## T-E2E02 — Người chơi yếu phải Quest

Input:

| Bước | Thay đổi Credit | Expected wallet |
|---|---:|---:|
| Start | — | 3 |
| A1 lần 1 FAIL | 0 | 3 |
| A1 lần 2 PASS 11/15 | +2 | 5 |
| A2 8/10 | +3 | 8 |
| A3 mua Bùa, 8/10, penalty 1+2 | -3 +3 -1 -2 | 5 |
| A4 lần 1 FAIL, penalty 1 | -1 | 4 |
| A4 lần 2 9/10 | +4 | 8 |
| Quest 1: 10/15 | +2 | 10 |
| Quest 2: 12/15 | +3 | 13 |
| Quest 3: 13/15 | +3 | 16 |
| Mở Boss | -15 | 1 |
| Boss lần 1: 12/15 FAIL, penalty 2 | -2, floor 0 | 0 |
| Boss lần 2: 14/15 first clear, penalty 1 | +4 +5 -1 | 8 |

Expected:

- Boss bị khoá khi mới có 8 Credit sau Arena 4.
- Quest chơi được 3 lần.
- Sau Quest lần 3 có 16 Credit.
- Trả 15 → còn 1.
- Boss fail lần 1 **không** yêu cầu trả thêm 15 khi retry.
- Ví không âm sau penalty.
- Boss clear lần 2 → ví cuối **8**.

| ID | Expected | Actual | Status |
|---|---|---|---|
| T-E2E02 | Ví cuối = **8**, progression đúng toàn bộ flow | Đã test — khớp Expected | ✅ Pass |

---
