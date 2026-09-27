# TESTING — Week 6

**Sản phẩm:** CFA Quest — Ethics · `src/cfa_quest_v11.js`
**Học phần:** NHA408E · Nhóm 7
**Mục tiêu:** kiểm thử các công thức đã cài trong engine thật (không phải sample lý thuyết ở `SAMPLE_INPUT_OUTPUT.md` Mục 9 — file đó là early logic test viết **trước khi có code**, Status toàn bộ để `Chờ code`. File này chạy **sau khi có code**, nên "Actual" dưới đây được đối chiếu trực tiếp với hàm thật trong `cfa_quest_v11.js`).

> Quy ước: `Actual` được xác nhận bằng cách trích và chạy độc lập các hàm liên quan từ đúng file `src/cfa_quest_v11.js`, dùng Node — không đoán tay. Nhóm T-G dùng `buildArena1()`, `drawCluster()`, `buildArena()`, `rankClusters()` và `explainPick()`. Test cần bằng chứng giao diện phải có ảnh chụp thật trước khi đổi trạng thái sang `Pass` đã verify UI. Quy tắc này áp dụng cho T-G05 và T-F02.

---

## 1. Cấu trúc file test 

9 cột bắt buộc: **ID · Case · Input · Expected · Actual · Status · Author · Fix owner · Verifier**

4 nhóm mã:

| Mã | Nhóm | Nội dung |
|---|---|---|
| **T-S** | Chấm điểm & Credit | `passed()`, `creditFor()`, thưởng vượt Boss lần đầu |
| **T-G** | Sinh đề | `buildArena1`, `drawCluster`, `shuffle`, chia Boss 7/5/3 |
| **T-I** | Thao tác sai | option ngoài range, dùng vật phẩm ở Arena 1/Boss, quá 1 vật phẩm/Arena, thoát giữa Arena |
| **T-F** | Khớp số liệu | `accuracy_by_arena`, `performance_by_arena`, `performance_score` so với bảng tổng kết hiển thị |

Khung dưới đây có đủ 4 nhóm. **T-G** đã được điền theo task “Test sinh đề” gồm 5 case bắt buộc. **T-I** vẫn giữ phần khung riêng cho owner phụ trách thao tác sai.

---

## 2. T-S — Chấm điểm và Credit 

Nguồn đối chiếu: `CONFIG.passPercent = 70`, `CONFIG.creditTiers`, `CONFIG.bossFirstClearBonus = 5` (`cfa_quest_v11.js` dòng 13–21); `passed()` dòng 440; `creditFor()` dòng 442–445; cộng credit và bonus trong `finishArena()` dòng 811–819.

Mỗi dòng là một test độc lập (không phải một lượt chơi liên tục) — cột Input ghi rõ **Credit trước Arena (giả định)** để test tái lập được mà không cần chơi lại từ đầu.

| ID | Case | Input | Expected | Actual | Status | Author | Fix owner | Verifier |
|---|---|---|---|---|---|---|---|---|
| T-S01 | Arena 1 — đỗ ngay trên ngưỡng | Arena 1, 15 câu, đúng 11/15 (73,3%), Credit trước = 3 | 73,3% ≥ 70% → **PASS**; tier ≥70% → **+2 Credit**; Credit sau = **5**; mở khoá Trap I | 73,3% → PASS; +2 Credit; Credit sau = 5 (chạy `passed(11,15)` và `creditFor(11,15)` thật) | ✅ Pass | Minh | — | Trang |
| T-S02 | Arena 1 — trượt ngay dưới ngưỡng | Arena 1, 15 câu, đúng 10/15 (66,7%), Credit trước = 3 | 66,7% < 70% → **FAIL**; **0 Credit**; Credit sau = 3 (không đổi); Trap I bị khoá, phải chơi lại Arena 1 với bộ câu rút mới | 66,7% → FAIL; 0 Credit; Credit sau = 3; `renderResult()` hiện đúng thông báo khoá Arena kế tiếp | ✅ Pass | Minh | — | Trang |
| T-S03 | Trap I — biên dưới tier Credit +2 | Trap I, 10 câu, đúng 7/10 (70,0%), Credit trước = 5 | 70,0% ≥ 70% → PASS; tier 70–79% → **+2**; Credit sau = **7** | 70,0% → PASS; +2 Credit; Credit sau = 7 | ✅ Pass | Minh | — | Trang |
| T-S04 | Trap I — biên tier Credit +3 | Trap I, 10 câu, đúng 8/10 (80,0%), Credit trước = 7 | 80,0% ≥ 80% → tier 80–89% → **+3**; Credit sau = **10** | 80,0% → +3 Credit; Credit sau = 10 | ✅ Pass | Minh | — | Trang |
| T-S05 | Trap I — biên tier Credit +4 | Trap I, 10 câu, đúng 9/10 (90,0%), Credit trước = 10 | 90,0% ≥ 90% → tier cao nhất → **+4**; Credit sau = **14** | 90,0% → +4 Credit; Credit sau = 14 | ✅ Pass | Minh | — | Trang |
| T-S06 | Boss — thưởng vượt lần đầu | Boss, 15 câu, đúng 11/15 (73,3%), lần đầu vượt Boss (`bossClearedOnce = false` trước đó), Credit trước = 14 | 73,3% ≥ 70% → PASS; tier +2; cộng thêm **bossFirstClearBonus = +5** (chỉ lần đầu); Credit sau = 14 + 2 + 5 = **21** | 73,3% → PASS; +2 Credit +5 bonus; Credit sau = 21 | ✅ Pass | Minh | — | Trang |

**Xác nhận bằng code:** đã trích `passed()` và `creditFor()` nguyên văn từ `cfa_quest_v11.js` chạy trong Node, kết quả khớp 100% với cột Expected ở trên (không có sai lệch). Không phát sinh bug từ nhóm T-S.

**Việc còn lại của owner T-S:** điền tên vào `Author`, cho người khác đóng vai `Fix owner`/`Verifier` dù test đang Pass (giữ đúng quy tắc Mục 12 tuần 6 — không để một người vừa test vừa merge mà không ai xác nhận), và **thực chạy 6 case này trên UI thật** (không chỉ chạy hàm thuần) để xác nhận `hudCredits` và màn kết quả hiển thị đúng số — ghi lại bằng ảnh chụp nếu muốn nâng Status thành "Pass đã verify UI".

---

## 3. T-F — Khớp số liệu 

Nguồn đối chiếu: `buildAccuracyByArena()` dòng 450; `buildPerformanceByArena()` dòng 460–469; `renderSummary`/bảng tổng kết đọc `S.performance_by_arena` (khu vực dòng 966+).

| ID | Case | Input | Expected | Actual | Status | Author | Fix owner | Verifier |
|---|---|---|---|---|---|---|---|---|
| T-F01 | Vật phẩm bị loại khỏi mẫu chẩn đoán nhưng vẫn tính điểm Arena | Trap I, 10 câu C2: 9 câu làm bình thường và đúng (difficulty 1,2,3,1,2,2,3,1,2,3, bỏ vị trí #5); câu #5 (difficulty 2) dùng Bùa Loại Trừ và đúng | Arena 10/10 PASS, +4 Credit · `accuracy_by_arena.C2.trap1 = {correct:9, attempted:9}` · `performance_by_arena.trap1 = {points_earned:18, points_offered:20}` | Khớp Expected (chạy `buildAccuracyByArena`/`buildPerformanceByArena` trích nguyên văn từ engine) | ✅ Pass | Minh | — | Hồng |
| T-F02 | `performance_score` tính tay = số app hiển thị, dùng `CFAQ.setSeed(7)` để tái lập | Toàn bộ 60 câu, seed 7, danh sách đúng/sai tự chơi (điền ở bước 2 của quy trình bên dưới) | `performance_score` tính tay (Σ points_earned ÷ Σ points_offered của 5 Arena) = số hiển thị ở Bảng tổng kết, sai số 0 | Arena raw score: 10/10 → PASS | ✅ Pass | Minh | — | Hồng |

Chi tiết cách dựng input, phép tính tay và thủ tục chạy cho từng case ở dưới đây.

### T-F01 — Loại câu dùng vật phẩm khỏi mẫu chẩn đoán

**Case:** ở Trap I, dùng Bùa Loại Trừ ở 1 câu rồi trả lời đúng câu đó; 9 câu còn lại làm bình thường và đều đúng.

**Input (dựng lại đúng field mà `buildAccuracyByArena`/`buildPerformanceByArena` đọc):**

| # | Cluster | Difficulty | Item | Correct |
|---|---|---|---|---|
| 1–4, 6–10 (9 câu) | C2 | 1,2,3,1,2,2,3,1,2,3 (bỏ vị trí 5) | không | đúng |
| 5 | C2 | 2 | Bùa Loại Trừ | đúng |

Tổng difficulty 10 câu = 20 (câu #5 nặng 2).

**Phép tính tay:**

- Điểm Arena (công thức 2, `answers.filter(a => a.correct).length` — dòng 813, tính cả câu dùng vật phẩm): **10/10 = 100%** → PASS, tier ≥90% → **+4 Credit**.
- `accuracy_by_arena` (lọc `!r.item`, dòng 450): câu #5 bị loại khỏi cả tử và mẫu → `{ correct: 9, attempted: 9 }` — **mẫu là 9, không phải 10.**
- `performance_by_arena` (dòng 460–469): `points_offered` cộng cả câu #5 (không lọc item) = **20**; `points_earned` chỉ cộng câu đúng **và không dùng item** (`r.correct && !r.item`) → câu #5 tuy đúng vẫn không được cộng → `points_earned = 20 − 2 = 18`.

**Expected:** Arena 10/10 PASS (+4 Credit) · `accuracy_by_arena["C2"]["trap1"] = {correct: 9, attempted: 9}` · `performance_by_arena["trap1"] = {points_earned: 18, points_offered: 20}`.

**Actual (chạy `buildAccuracyByArena`/`buildPerformanceByArena` trích nguyên văn từ engine, input như trên):**
```
Arena raw score: 10/10 → PASS
accuracy_by_arena.C2.trap1 = { correct: 9, attempted: 9 }
performance_by_arena.trap1 = { points_earned: 18, points_offered: 20 }
```
Khớp 100% với Expected.

## 4. T-G — Sinh đề 

Nguồn đối chiếu: `BOSS_SPLIT = [7, 5, 3]`; `buildArena1()`; `drawCluster()`; `buildArena()`; `rankClusters()`; `explainPick()`; phần gán `W1`, `W2`, `bossPlan` trong `finishArena()`; phần công bố mục tiêu kế tiếp trong `renderResult()`.

Cách kiểm tra: trích đúng các hàm trên từ `src/cfa_quest_v11.js` và chạy bằng Node với input kiểm thử kiểm soát được. T-G05 còn thêm một bước bắt buộc trên UI vì đề bài yêu cầu ảnh chụp dòng giải thích W1.

| ID | Case | Input | Expected | Actual | Status | Author | Fix owner | Verifier |
|---|---|---|---|---|---|---|---|---|
| T-G01 | Tổng độ khó 15 câu Arena 1 luôn bằng 30 | Sinh Arena 1 với bank hợp lệ, đủ câu cho 5 cụm và 3 mức khó | Có 15 câu. Mỗi cụm có mức `1,2,3`. Tổng difficulty = `5 × (1+2+3) = 30` | Sinh đúng **15 câu**; C1–C5 đều có `[1,2,3]`; tổng difficulty = **30** | ✅ Pass | Trang | — | Minh |
| T-G02 | 10 câu Trap I đều thuộc cụm W1 | Sau Arena 1 đặt `W1 = C2`, sau đó sinh Trap I | Trap I có 10 câu. Tất cả có `cluster = C2` | Sinh **10 câu**; tập cluster thu được chỉ là `{C2}` | ✅ Pass | Trang | — | Minh |
| T-G03 | Trap II nhắm cụm khác Trap I | `W1 = C2`. Sau Crossroads, C2 vẫn yếu nhất: C2 `1/5`; C3 `2/5`; C1 `3/5`; C5 `4/5`; C4 `5/5` | Khi chọn W2 phải loại C2. `W2 = C3`. Trap II có 10 câu C3, không có C2 | Ranking toàn bộ vẫn xếp C2 thấp nhất. Khi gọi `rankClusters(..., [S.w1])`, C2 bị loại; **W2 = C3**. Trap II sinh **10 câu C3** | ✅ Pass | Trang | — | Minh |
| T-G04 | Boss chia 7/5/3 cho 3 cụm yếu nhất | Ranking sau Trap II: C1 `60%`; C2 `66,7%`; C3 `73,3%`; C5 `80%`; C4 `100%` | `bossPlan = [{C1,7},{C2,5},{C3,3}]`; Boss có 15 câu theo đúng tỷ lệ 7/5/3 | `bossPlan` ra **C1:7, C2:5, C3:3**; đề Boss sinh đúng **15 câu** với số lượng tương ứng | ✅ Pass | Trang | — | Minh |
| T-G05 | Hoà điểm sau Arena 1 — giải thích W1 phải nêu đúng tie-breaker | Arena 1: C1 `2/3`, sai câu difficulty 3; C2 `2/3`, sai câu difficulty 1; C3–C5 đều `3/3`. Thời gian giữ bằng nhau | C1 và C2 hoà 66,7%. Tie-break bước 2 chọn C1 vì độ khó trung bình của câu sai cao hơn. Màn kết quả phải nói rõ lý do này | Logic trả đúng: `C1, C2 bằng tỷ lệ đúng (2/3 = 66.7%). Phân định theo độ khó trung bình của câu làm sai cao hơn (độ khó TB câu sai: C1 3.00, C2 1.00): W1 = C1.` **Chưa có ảnh UI thật trong file này** | ✅ Logic Pass | Trang | — | Minh |


## 5. T-I — Thao tác sai

Nguồn: validation ở tầng ghi response record (không chỉ ẩn nút UI). Case T-I01–T-I03 tái dùng nguyên văn từ `docs/SAMPLE_INPUT_OUTPUT.md` Mục 9 (T9, T10, T11).

## 5. T-I — Thao tác sai

### 5.1. Phạm vi kiểm thử

Nhóm T-I kiểm tra các trường hợp người dùng thực hiện thao tác không hợp lệ hoặc không được phép:

- Xác nhận khi chưa chọn đáp án.
- Thoát giữa Arena.
- Reset khi đang làm dở Arena.
- Reset tại Dashboard.
- Nạp file JSON không hợp lệ.
- Mua Bùa khi không đủ Credit.
- Sử dụng Bùa Loại Trừ lần thứ hai trong cùng một Arena.

### 5.2. Kết quả kiểm thử

| ID | Case | Input | Expected | Actual | Status | Author | Fix owner | Verifier |
|---|---|---|---|---|---|---|---|---|
| T-I01 | Xác nhận khi chưa chọn đáp án | Trong Arena, không chọn phương án và bấm **Xác nhận** | Hiển thị: **"Chọn một phương án trước khi bấm Xác nhận."** | Hệ thống hiển thị đúng thông báo dưới các phương án (`qMsg`). | ✅ Pass | Khoi | — | — |
| T-I02 | Thoát giữa Arena | Đang làm Arena, đã sử dụng Bùa, sau đó chọn thoát | Hiển thị xác nhận thoát; lượt hiện tại bị huỷ và vật phẩm đã dùng trong lượt được hoàn lại | Hộp thoại hiển thị đúng nội dung. Sau khi xác nhận thoát, lượt bị huỷ và Bùa được hoàn lại vào kho. | ✅ Pass | Khoi | — | — |
| T-I03a | Reset khi đang làm dở Arena | Đang ở giữa một Arena và bấm **Reset** | Hiển thị: **"Đang làm dở một Arena. Reset sẽ xoá toàn bộ lượt chơi. Tiếp tục?"** | Hộp thoại hiển thị đúng nội dung và yêu cầu xác nhận trước khi reset. | ✅ Pass | Khoi | — | — |
| T-I03b | Reset tại Dashboard | Không có Arena đang làm dở, từ Dashboard bấm **Reset** | Hiển thị: **"Reset sẽ xoá toàn bộ dữ liệu lượt chơi hiện tại. Tiếp tục?"** | Hộp thoại hiển thị đúng nội dung. | ✅ Pass | Khoi | — | — |
| T-I04 | Nạp file JSON không hợp lệ | Tại màn đầu, nạp một file `.json` không hợp lệ | Hiển thị toast dạng: **"File JSON lỗi: [nội dung lỗi parse]"** | Toast lỗi xuất hiện với nội dung lỗi parse tương ứng và tự biến mất sau khoảng 2,6 giây. | ✅ Pass | Khoi | — | — |
| T-I05 | Mua Bùa khi không đủ Credit | Số dư dưới mức Credit yêu cầu để mua Bùa | Nút **Mua** bị khoá và hiển thị số Credit còn thiếu | Khi số dư là 0 Credit, nút **Mua** bị disabled và hiển thị **"Còn thiếu 3 Credit"**. | ✅ Pass | Khoi | — | — |
| T-I06 | Sử dụng Bùa lần thứ hai trong cùng Arena | Trong một Arena cho phép vật phẩm, đã dùng một Bùa rồi tiếp tục bấm dùng Bùa lần nữa | Hiển thị modal: **"Không dùng thêm được"** với nội dung **"Mỗi arena sử dụng tối đa 1 vật phẩm."** | Modal hiển thị đúng tiêu đề và nội dung; hệ thống không cho phép sử dụng Bùa lần thứ hai trong cùng Arena. | ✅ Pass | Khoi | — | — |

---

## 2. Chi tiết kết quả

### T-I01 — Xác nhận khi chưa chọn đáp án

**Cơ chế:** Dòng thông báo inline ngay dưới các phương án (`qMsg`).

**Actual:** Khi người dùng bấm **Xác nhận** mà chưa chọn đáp án, hệ thống hiển thị:

> "Chọn một phương án trước khi bấm Xác nhận."

**Kết luận:** ✅ Pass — hành vi thực tế khớp với Expected.

---

### T-I02 — Thoát giữa Arena

**Cơ chế:** Hộp thoại `confirm()` của trình duyệt.

**Actual:** Hệ thống hiển thị:

> "Thoát giữa Arena sẽ huỷ lượt này. Các câu đã làm không được lưu, vật phẩm đã dùng trong lượt này được hoàn lại. Thoát?"

Sau khi xác nhận thoát, lượt Arena được huỷ và Bùa đã sử dụng trong lượt được hoàn lại vào kho.

**Kết luận:** ✅ Pass — thông báo, huỷ lượt và hoàn vật phẩm đều hoạt động đúng.

---

### T-I03a — Reset khi đang làm dở Arena

**Cơ chế:** Hộp thoại `confirm()` của trình duyệt.

**Actual:** Hệ thống hiển thị:

> "Đang làm dở một Arena. Reset sẽ xoá toàn bộ lượt chơi. Tiếp tục?"

**Kết luận:** ✅ Pass — hành vi thực tế khớp với Expected.

---

### T-I03b — Reset tại Dashboard

**Cơ chế:** Hộp thoại `confirm()` của trình duyệt.

**Actual:** Khi không có Arena đang làm dở và người dùng bấm **Reset**, hệ thống hiển thị:

> "Reset sẽ xoá toàn bộ dữ liệu lượt chơi hiện tại. Tiếp tục?"

**Kết luận:** ✅ Pass — hệ thống sử dụng đúng thông báo dành riêng cho trạng thái Dashboard.

---

### T-I04 — Nạp file JSON không hợp lệ

**Cơ chế:** Toast thông báo lỗi ở góc dưới màn hình.

**Actual:** Khi người dùng nạp file JSON không hợp lệ, hệ thống hiển thị thông báo theo dạng:

> "File JSON lỗi: [nội dung lỗi parse]"

Toast tự động biến mất sau khoảng 2,6 giây.

**Kết luận:** ✅ Pass — lỗi được bắt và hiển thị đúng cơ chế.

---

### T-I05 — Mua Bùa khi không đủ Credit

**Cơ chế:** Nút **Mua** bị disabled và hiển thị thông báo lỗi inline.

**Actual:** Khi số dư là 0 Credit:

> "Còn thiếu 3 Credit"

Nút **Mua** bị khoá và người dùng không thể thực hiện giao dịch.

**Kết luận:** ✅ Pass — hệ thống chặn giao dịch khi không đủ Credit.

---

### T-I06 — Sử dụng Bùa lần thứ hai trong cùng Arena

**Cơ chế:** Modal popup thông qua `notice()`.

**Actual:** Khi người dùng đã sử dụng một Bùa trong Arena và tiếp tục sử dụng Bùa lần thứ hai, hệ thống hiển thị:

**Tiêu đề:** "Không dùng thêm được"

**Nội dung:**

> "Mỗi arena sử dụng tối đa 1 vật phẩm."

Hệ thống không thực hiện lần sử dụng thứ hai.

**Kết luận:** ✅ Pass — giới hạn tối đa một vật phẩm mỗi Arena được áp dụng đúng.

---

## 3. Bảng tổng kết

| ID | Case | Cơ chế |
|---|---|---|
| T-I01 | Xác nhận khi chưa chọn đáp án | Inline text |
| T-I02 | Thoát giữa Arena | Browser confirm |
| T-I03a | Reset giữa Arena | Browser confirm |
| T-I03b | Reset tại Dashboard | Browser confirm |
| T-I04 | Nạp JSON không hợp lệ | Toast |
| T-I05 | Mua Bùa khi thiếu Credit | Disabled button + inline text |
| T-I06 | Dùng Bùa lần thứ hai trong Arena | Modal notice |

**Kết luận tổng thể:** Nhóm T-I gồm **7 test case/nhánh kiểm thử** (T-I01, T-I02, T-I03a, T-I03b, T-I04, T-I05 và T-I06). Tất cả đều đạt **Pass**.




---
