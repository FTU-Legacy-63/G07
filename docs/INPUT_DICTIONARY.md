# INPUT_DICTIONARY

**Sản phẩm:** CFA Quest — Ethics diagnostic dungeon  
**Học phần:** NHA408E · Nhóm 7  
**Nguồn tham chiếu nội bộ:** `SOLUTION_STRUCTURE.md` bản Week 7, `ethics_bank_170.json` (170 câu)  
**Trạng thái:** đặc tả dữ liệu đã cập nhật theo thiết kế Week 7; code phải đồng bộ lại các field và rule bên dưới

---

## Quy tắc lọc

Một field chỉ được nằm trong file này nếu trả lời được **cả hai** câu:

1. Nghĩa của nó là gì, viết đủ để một thành viên khác không hiểu sai?
2. Nó làm output nào thay đổi?

Field không trả lời được câu 2 thì xuống Mục 5 (contextual) hoặc bị xoá.

Sản phẩm có **bốn** output chính. Cột "Ảnh hưởng output" luôn trỏ về một hoặc nhiều output sau:

- **O1 — Bảng chẩn đoán:** tỷ lệ đúng theo 5 cụm và 9 module, tính lại sau mỗi Arena.
- **O2 — Arena kế tiếp:** đề được sinh ra từ cụm yếu, đồng thời tuân theo tỉ lệ dễ/vừa/khó của round.
- **O3 — Kết quả Arena / tiến trình game:** đỗ/trượt, Credit, phạt quá giờ, trạng thái mở Boss, kết quả World Quest và lời giải từng câu sai.
- **O4 — Bảng tổng kết sau Boss:** tỷ lệ đúng từng cụm qua 5 Arena, nhãn cải thiện, và `performance_score` toàn lượt.

> **World Quest không phải dữ liệu chẩn đoán.** Kết quả Quest được lưu riêng để cấp Credit và phục vụ tiến trình game; không cộng vào O1, không làm thay đổi `W1`, `W2`, `boss_clusters`, và không được đưa vào O4.

---

## 1. User input — người học nhập hoặc hệ thống ghi lại từ hành vi

| Field | Nghĩa | Đơn vị / Định dạng | Nguồn | Ảnh hưởng output |
|---|---|---|---|---|
| `selected_option` | Chỉ số phương án người học chọn cho một câu. Chỉ ghi nhận sau khi bấm Xác nhận; không cho đổi lại | int, 0–2 | Người dùng | O1, O2, O3, O4 |
| `timeMs` | Thời gian từ lúc câu hiện lên đến lúc người học bấm Xác nhận | int, mili giây | Hệ thống đo (timestamp render → timestamp submit) | O2 — tie-break khi cần; O3 — tính quá giờ và phạt Credit ở Arena 3, Arena 4, Boss |
| `item_used` | Câu này có dùng Bùa Loại Trừ hay không | boolean | Người dùng | O1 — quyết định câu có vào mẫu chẩn đoán hay không; O4 — quyết định câu có vào tử số `performance_score` hay không |
| `item_type_used` | Loại vật phẩm đã dùng ở câu đó, nếu có | enum: `none` / `eliminate` | Người dùng | O3 — hiển thị lại trong bảng lời giải |

### 1.1 Quy tắc thời gian

`timeMs` là field thời gian gốc của từng record. Giới hạn thời gian không làm câu tự nộp; người chơi vẫn được chọn đáp án sau khi hết giờ.

Giới hạn theo round:

| Round | Giới hạn |
|---|---:|
| Arena 1 | Không giới hạn |
| Arena 2 | Không giới hạn |
| Arena 3 | 100 giây/câu |
| Arena 4 | 80 giây/câu |
| Boss | 60 giây/câu |
| World Quest | Không giới hạn |

Từ `timeMs`, engine sinh ra `overtime_seconds` và `time_penalty_credit` ở Mục 3.2.

Với `t` là số giây đã dùng và `L` là giới hạn của round:

```text
time_penalty_credit = ceil(max(0, t - L) / 10)
```

- Trả lời đúng bằng giới hạn: phạt `0`.
- Quá từ 1 đến 10 giây: phạt `1 Credit`.
- Quá từ 11 đến 20 giây: phạt `2 Credit`.
- Phạt tính riêng từng câu.
- Tổng phạt của round được trừ sau khi chấm round, kể cả khi người chơi trượt.
- `credit_balance` không được xuống dưới `0`.
- Thoát giữa Arena 3 hoặc Arena 4 không xoá tiền phạt của các câu đã trả lời trước khi thoát.
- Ở Boss, tiền phạt được trừ vào phần thưởng sau Boss; ví vẫn không âm.

### 1.2 Ràng buộc vật phẩm

Đây là ràng buộc lên chính `item_used`, không phải luật phụ. Vi phạm là lỗi engine.

| # | Ràng buộc | Hệ quả lên dữ liệu |
|---|---|---|
| 1 | **Arena 1 không được dùng vật phẩm** | Mọi record Arena 1 phải có `item_used = false` |
| 2 | **Arena 2, Arena 3, Arena 4 và Boss tối đa 1 Bùa Loại Trừ mỗi round** | Mỗi round có nhiều nhất 1 record `item_used = true` |
| 3 | **Mỗi câu tối đa 1 vật phẩm** | `item_type_used` luôn là một giá trị đơn, không phải mảng |
| 4 | **World Quest không được dùng vật phẩm** | Mọi record Quest phải có `item_used = false` |

Câu trả lời đúng nhờ Bùa vẫn được tính vào `arena_score_correct` để xét đỗ/trượt, nhưng bị loại khỏi dữ liệu chẩn đoán và khỏi tử số `performance_score`.

---

## 2. Product information — nằm sẵn trong ngân hàng câu hỏi

Nguồn chung: `ethics_bank_170.json`, do nhóm tự biên soạn và gắn nhãn thủ công.

| Field | Nghĩa | Đơn vị / Định dạng | Ảnh hưởng output |
|---|---|---|---|
| `id` | Mã định danh duy nhất của câu. Cấu trúc `ETH-{cụm}-{module}-{số thứ tự}` | string, duy nhất trong bank | O2 — chống lặp không đúng luật và loại câu Quest khỏi Boss |
| `cluster` | Cụm chẩn đoán. **Đây là trục sinh đề chính** | enum: C1–C5 | O1, O2, O4 |
| `module` | Module nội dung. **Đây là trục báo cáo, không phải trục chọn cụm yếu** | enum: GIPS, CODE, S1–S7 | O1, O2 |
| `difficulty` | Mức khó do nhóm tự đánh giá: 1=dễ, 2=vừa, 3=khó | int, 1–3 | O2 — quyết định tỉ lệ dễ/vừa/khó theo round, cân bằng Arena 1 và fallback; O4 — trọng số `performance_score` |
| `stem` | Đề bài. Tình huống giả định do nhóm dựng | string | O3 |
| `options` | Ba phương án trả lời | mảng 3 string | O3 |
| `answer` | Chỉ số phương án đúng trong `options` | int, 0–2 | O1, O2, O3, O4 |
| `distractor_reason` | Lỗi tư duy dẫn tới từng phương án sai. Phần tử tại `answer` để rỗng | mảng 3 string | O3 |
| `hint` | Một dòng gợi ý về Standard đang áp dụng | string | Bản hiện tại chưa dùng feature hint |
| `explanation` | Lời giải sau câu hỏi | string | O3 |

### 2.1 Vai trò của `difficulty` trong bản Week 7

`difficulty` có bốn vai trò:

1. Arena 1 giữ cách rút cũ: mỗi cụm 3 câu, gồm 1 dễ + 1 vừa + 1 khó.
2. Arena 2–Boss phải tuân theo quota dễ/vừa/khó của round.
3. `difficulty` tiếp tục tham gia tie-break khi xác định cụm yếu nếu Accuracy bằng nhau.
4. `difficulty` tiếp tục là trọng số của `performance_score`, với `{1:1, 2:2, 3:3}`.

Quota độ khó:

| Round | Dễ / Vừa / Khó | Số câu Dễ / Vừa / Khó |
|---|---|---|
| Arena 1 | theo từng cụm: 1/1/1 | tổng 5/5/5 |
| Arena 2 | 40/40/20% | 4/4/2 |
| Arena 3 | 20/50/30% | 2/5/3 |
| Arena 4 | 20/40/40% | 2/4/4 |
| Boss | 10/30/60% | 2/4/9 |

Boss chia ba cụm yếu nhất theo 7/5/3 câu:

| Cụm trong Boss | Tổng câu | Dễ | Vừa | Khó |
|---|---:|---:|---:|---:|
| Cụm yếu nhất | 7 | 1 | 2 | 4 |
| Cụm yếu thứ hai | 5 | 1 | 1 | 3 |
| Cụm yếu thứ ba | 3 | 0 | 1 | 2 |

Khi cụm không còn **câu mới** đúng mức khó cần rút:

1. ưu tiên lấy lại câu **cùng mức khó** mà người chơi đã gặp;
2. nếu cũng không còn câu phù hợp thì hạ xuống mức **vừa**;
3. mỗi lần fallback phải ghi vào `bankLog`.

---

## 3. State variables — hệ thống tự tính, không ai nhập vào

Đây là nhóm quan trọng nhất: O1 và O4 được sinh ra hoàn toàn từ các bộ đếm Arena; O3 còn đọc thêm state về Credit, timer, Boss và World Quest.

### 3.1 Bộ đếm chẩn đoán — phục vụ O1, O2

| Field | Nghĩa | Đơn vị / Định dạng | Ảnh hưởng output |
|---|---|---|---|
| `diagnostic_correct[c]` | Số câu đúng thuộc cụm c, **loại mọi câu có `item_used = true`**. Chỉ tính dữ liệu của 5 Arena, không tính World Quest | int | O1 — tử số |
| `diagnostic_attempted[c]` | Số câu đã làm thuộc cụm c, cùng điều kiện loại vật phẩm và không tính Quest | int | O1 — mẫu số |
| `accuracy_cumulative[c]` | `diagnostic_correct[c] ÷ diagnostic_attempted[c]`. Tính lại sau mỗi Arena | float, 0.0–1.0 | O1, O2 |

> Câu ở Arena 2 và Arena 4 vẫn nằm trong `accuracy_cumulative`. World Quest thì **không**.

### 3.2 Bộ đếm điểm Arena, timer và Credit — phục vụ O3

| Field | Nghĩa | Đơn vị / Định dạng | Ảnh hưởng output |
|---|---|---|---|
| `arena_score_correct` | Số câu đúng trong Arena hiện tại, **tính cả câu có `item_used = true`**. Reset khi vào round mới | int | O3 — đỗ/trượt và Credit |
| `arena_question_count` | Tổng số câu của round hiện tại: 15 ở Arena 1/Boss; 10 ở Arena 2–4; 15 ở Quest | int | O3 |
| `arena_pass_percent` | Ngưỡng đỗ của round hiện tại. Chỉ áp dụng cho 5 Arena, không áp dụng World Quest | int, % | O3 |
| `arena_passed` | `arena_score_correct ÷ arena_question_count` đạt ngưỡng của round hay không | boolean | O3 — mở tiến trình tiếp theo, cấp Credit |
| `time_limit_seconds` | Giới hạn thời gian của một câu ở round hiện tại; `null` nếu không có giới hạn | int hoặc null | O3 — tính phạt |
| `overtime_seconds` | Số giây vượt giới hạn của một câu: `max(0, ceil(timeMs/1000) - time_limit_seconds)`; bằng 0 nếu round không có timer | int, ≥0 | O3 |
| `time_penalty_credit` | Credit bị phạt cho một câu: `ceil(overtime_seconds / 10)` | int, ≥0 | O3 |
| `round_time_penalty_credit` | Tổng `time_penalty_credit` của các câu đã xác nhận trong round | int, ≥0 | O3 |
| `credit_balance` | Credit đang có. Khởi tạo = 3; không bao giờ âm | int, ≥0 | O3 — mua Bùa, trả phí mở Boss |
| `round_credit_reward` | Credit thưởng theo tỷ lệ đúng: ≥70% `+2`, ≥80% `+3`, ≥90% `+4`; trượt round không được thưởng | int: 0/2/3/4 | O3 |
| `boss_first_clear_bonus` | Thưởng thêm khi lần đầu vượt Boss | int, cố định +5 khi thỏa điều kiện | O3 |

Ngưỡng đỗ:

| Round | Số câu | `arena_pass_percent` | Số câu đúng tối thiểu |
|---|---:|---:|---:|
| Arena 1 | 15 | 70% | 11/15 |
| Arena 2 | 10 | 75% | 8/10 |
| Arena 3 | 10 | 75% | 8/10 |
| Arena 4 | 10 | 85% | 9/10 |
| Boss | 15 | 90% | 14/15 |

> **Không được dùng một hằng `70%` chung cho pass/fail.**  
> Ngưỡng 70% của bảng tổng kết O4 là một rule khác và vẫn giữ nguyên.

### 3.3 Bộ đếm theo Arena — phục vụ O4

| Field | Nghĩa | Đơn vị / Định dạng | Ảnh hưởng output |
|---|---|---|---|
| `accuracy_by_arena[c][arena]` | Cặp `{correct, attempted}` của cụm c riêng trong từng Arena; loại câu dùng vật phẩm; **không có World Quest** | object lồng 2 tầng | O4 |
| `baseline_accuracy[c]` | Mốc chẩn đoán của cụm c theo logic hiện hành trong `SOLUTION_STRUCTURE.md` | float | O4 |
| `delta[c]` | `boss_accuracy[c] − baseline_accuracy[c]` | float, có thể âm | O4 |
| `improvement_label[c]` | Nhãn kết luận của cụm c theo rule O4. Mốc đánh giá cải thiện vẫn là 70%, không đổi theo Boss pass threshold | enum: `not_retested` / `improved` / `improved_insufficient` / `needs_work` | O4 |
| `performance_by_arena[arena]` | `{points_earned, points_offered}` theo từng Arena. Quest không có entry | object | O4 |
| `performance_score` | `Σ points_earned ÷ Σ points_offered` trên **5 Arena**, không tính Quest | float, 0.0–1.0 | O4 |

### 3.4 Biến điều khiển sinh đề

| Field | Nghĩa | Đơn vị / Định dạng | Ảnh hưởng output |
|---|---|---|---|
| `W1` | Cụm có `accuracy_cumulative` thấp nhất sau Arena 1 | enum: C1–C5 | O2 — Arena 2 |
| `W2` | Cụm có `accuracy_cumulative` thấp nhất sau Arena 3, bắt buộc khác `W1` | enum: C1–C5 | O2 — Arena 4 |
| `boss_clusters` | Ba cụm có `accuracy_cumulative` thấp nhất sau Arena 4, xếp yếu dần, phân bổ 7/5/3 | mảng 3 enum | O2 — Boss và World Quest |
| `used_question_ids` | Danh sách câu đã xuất hiện trong 5 Arena của lượt chơi | mảng string | O2 — chống lặp và hỗ trợ fallback |
| `quest_used_question_ids` | Tập `id` đã xuất hiện trong World Quest. **Boss không được rút các id này** | mảng string | O2 |
| `bankLog` | Log mọi trường hợp thiếu câu đúng quota/mức khó và phải dùng fallback | mảng string | O2 — kiểm tra chất lượng bank |
| `attempt_index[arena]` | Lượt làm thứ mấy của Arena đó | int, ≥1 | O3, O4 |

### 3.5 Trạng thái mở Boss

| Field | Nghĩa | Đơn vị / Định dạng | Ảnh hưởng output |
|---|---|---|---|
| `boss_unlocked` | Người chơi hiện có quyền vào Boss hay không | boolean | O3 |
| `boss_unlock_cost` | Giá mở Boss | int, cố định 15 Credit | O3 |
| `boss_unlock_paid` | Đợt mở Boss hiện tại đã trừ 15 Credit hay chưa | boolean | O3 |
| `boss_cleared_once` | Người chơi đã từng vượt Boss trong run hiện tại chưa | boolean | O3 — quyết định thưởng +5 |

Luật cập nhật state:

- Sau khi đỗ Arena 4, nếu `credit_balance >= 15`, người chơi có thể trả 15 Credit để đặt `boss_unlocked = true`.
- Nếu chưa đủ 15 Credit, Boss vẫn khoá và người chơi có thể vào World Quest.
- **Trượt Boss:** `boss_unlocked` vẫn là `true`; chơi lại với đề mới, không trả thêm 15 Credit.
- **Thoát giữa Boss:** lượt Boss bị huỷ, 15 Credit đã trả không hoàn, và `boss_unlocked = false`. Muốn vào lại phải kiếm đủ và trả 15 Credit lần nữa.

### 3.6 World Quest

| Field | Nghĩa | Đơn vị / Định dạng | Ảnh hưởng output |
|---|---|---|---|
| `quest_available` | Quest đã được mở hay chưa. Chỉ mở sau khi đỗ Arena 4 | boolean | O3 |
| `quest_attempt_index` | Số lần đã chơi Quest trong run | int, ≥0 | O3 |
| `quest_score_correct` | Số câu đúng ở lượt Quest hiện tại | int, 0–15 | O3 |
| `quest_credit_reward` | Credit nhận sau Quest theo kết quả | int: 0/2/3/4 | O3 |
| `quest_history` | Lịch sử các lượt Quest: điểm, Credit nhận, question ids | mảng object | O3 |
| `quest_used_question_ids` | Tất cả câu đã xuất hiện ở Quest trong run, dùng để loại khỏi Boss | mảng string | O2 |

Cấu trúc Quest:

- 15 câu.
- Dùng đúng `boss_clusters`: mỗi cụm 5 câu.
- Độ khó ngẫu nhiên.
- Không timer.
- Không ngưỡng đỗ.
- Không dùng Bùa.
- Có thể chơi bao nhiêu lần cũng được.
- Ưu tiên câu người chơi đã gặp ở Arena 1–4 thuộc ba cụm đó; không đủ mới lấy câu chưa gặp.
- Không ghi vào bộ đếm chẩn đoán và không ghi vào bảng tổng kết Boss.
- Câu đã ra ở Quest không được xuất hiện trong Boss.

Thưởng Quest:

| Kết quả | `quest_credit_reward` |
|---|---:|
| 0–8/15 | 0 |
| 9–11/15 | +2 |
| 12–13/15 | +3 |
| 14–15/15 | +4 |

---

## 4. Ba khái niệm "trả lời đúng"

Sản phẩm xử lý cùng một câu trả lời theo ba bộ đếm khác nhau. Đây là chỗ dễ sai nhất khi code.

| | (1) `accuracy_cumulative` | (2) `arena_score_correct` | (3) `performance_score` |
|---|---|---|---|
| Dùng để | Chẩn đoán — chọn cụm cho Arena 2, Arena 4, Boss | Chấm điểm — đỗ/trượt, Credit | Phân biệt hiệu suất toàn lượt |
| Đơn vị đếm | Số câu | Số câu | Điểm độ khó (1/2/3) |
| Câu dùng Bùa — tử số | **Loại** | Tính | **Loại** |
| Câu dùng Bùa — mẫu số | **Loại** | Tính | **Tính** |
| Phạm vi | 5 Arena, cộng dồn theo rule chẩn đoán | Reset mỗi Arena | 5 Arena |
| World Quest | **Không tính** | Dùng bộ đếm Quest riêng | **Không tính** |
| Chia theo cụm | Có | Không | Không |

**Vì sao mẫu số của (3) khác (1):** ở (1), câu dùng vật phẩm bị loại hẳn vì nó không chứng minh người học tự nắm kiến thức. Ở (3), câu đó vẫn nằm trong `points_offered` vì `performance_score` đo phần người chơi tự làm được trên toàn bộ phần nội dung đã gặp.

**`performance_score` không tham gia chuỗi chẩn đoán.** Nó không quyết định `W1`, `W2`, `boss_clusters`, không quyết định đỗ/trượt, không cấp Credit.

**World Quest cũng không tham gia chuỗi chẩn đoán.** Quest chỉ dùng để luyện tập và kiếm Credit.

**Cấm dùng tên biến `correct`, `score`, `right`, `accuracy` trần trong code.** Luôn viết rõ tiền tố/phạm vi: `diagnostic_`, `arena_score_`, `quest_`, `accuracy_cumulative`, `accuracy_by_arena`, `performance_`.

### Ba quy tắc lưu của `accuracy_by_arena`

1. Lưu **cặp số**, không lưu phần trăm.
2. Đếm theo `diagnostic_correct` / `diagnostic_attempted`, tức loại câu dùng vật phẩm khỏi cả tử lẫn mẫu.
3. Arena nào không hỏi cụm đó thì không tạo key giả `attempted: 0`.

### Điểm kiểm tra tự động

`performance_by_arena["arena1"].points_offered` luôn phải bằng 30 vì Arena 1 có 5 cụm × (1+2+3 điểm độ khó) và không dùng vật phẩm.

Ngoài ra engine phải kiểm tra:

- Arena 2 có đúng `4/4/2` câu dễ/vừa/khó.
- Arena 3 có đúng `2/5/3`, đồng thời mỗi cụm đúng 2 câu.
- Arena 4 có đúng `2/4/4`.
- Boss có đúng `2/4/9` và split ba cụm là `7/5/3`.
- World Quest có đúng 15 câu, `5/5/5` theo ba `boss_clusters`.
- Không có `quest_used_question_ids` nào xuất hiện trong Boss.
- `credit_balance` không âm sau khi trừ penalty.
- Pass boundary đúng: `11/15`, `8/10`, `8/10`, `9/10`, `14/15`.

---

## 5. Field contextual — giữ trong dữ liệu, không ảnh hưởng output

| Field | Vì sao giữ |
|---|---|
| `topic` | Hằng số `"ETHICS"` trong bank. Chỉ có nghĩa nếu sau này thêm môn/chủ đề khác |
| `item_type` | Nhãn `concept` / `vignette`. Không ảnh hưởng trực tiếp output |

---

## 6. Field phục vụ biên soạn, không phải input lúc chạy

| Field | Dùng lúc nào | Ai dùng |
|---|---|---|
| `sub_standard` | Lúc soạn đề. Kiểm tra ngân hàng đã phủ đủ các sub-standard chưa và nối sang `SOURCE_USE_MAP.md` | Nhóm nội dung / tài liệu |

Lúc sản phẩm chạy, `sub_standard` không xuất hiện ở màn hình chẩn đoán; bảng chẩn đoán dừng ở tầng module.

---

## 7. Việc code phải đồng bộ từ thiết kế Week 7

| # | Việc cần làm | Điều kiện hoàn thành |
|---|---|---|
| 1 | Đổi pass threshold từ một hằng 70% sang ngưỡng theo round | Arena 1/2/3/4/Boss = 70/75/75/85/90 |
| 2 | Giữ riêng threshold 70% của nhãn O4 | Boss 90% không làm thay đổi rule nhãn từng cụm |
| 3 | Dùng `timeMs` để tính `overtime_seconds`, `time_penalty_credit`, `round_time_penalty_credit` | Boundary `L`, `L+1`, `L+10`, `L+11` cho kết quả đúng |
| 4 | Sửa rule item ở Boss | Boss cho dùng tối đa 1 Bùa Loại Trừ |
| 5 | Sinh đề theo difficulty quota | A2 4/4/2, A3 2/5/3, A4 2/4/4, Boss 2/4/9 |
| 6 | Ghi `bankLog` khi phải fallback mức khó | Mọi fallback có log |
| 7 | Thêm Boss gate | Đỗ A4 chưa đủ; phải trả 15 Credit |
| 8 | Thêm state retry/quit Boss | Fail không trả lại; quit mất phí và khoá lại |
| 9 | Thêm World Quest | 15 câu, 5/5/5, reward 0/2/3/4, replay được |
| 10 | Tách dữ liệu Quest khỏi diagnosis | Quest không làm đổi O1/O4 |
| 11 | Loại câu Quest khỏi Boss | `quest_used_question_ids ∩ boss_question_ids = ∅` |
| 12 | Đổi `storageKey` sang version mới | Tiến trình v11 cũ không làm hỏng state Week 7 |

---

## 8. Owner

Phân công owner cụ thể giữ theo file quản lý công việc của nhóm. File này chỉ định nghĩa dữ liệu và điều kiện để code/tài liệu dùng cùng một nghĩa.

---

## 9. Giới hạn của file này

- Toàn bộ ngân hàng câu hỏi do nhóm tự biên soạn; mức độ khó 1–3 là nhãn chủ quan.
- Các ngưỡng đỗ `70/75/75/85/90`, giới hạn giờ `100/80/60`, mức phạt theo block 10 giây, giá mở Boss 15 Credit và bậc thưởng Quest đều là con số do nhóm tự đặt, chưa được kiểm chứng bằng dữ liệu người chơi thật.
- Arena 2 và Arena 3 cùng ngưỡng 75%; độ khó tăng giữa hai round đến từ tỉ lệ câu khó và timer ở Arena 3.
- Mỗi cụm chỉ có số lượng câu khó hữu hạn. Replay Arena 4 nhiều lần có thể làm cụm W2 hết câu khó trước Boss; khi đó engine phải reuse/fallback và ghi `bankLog`.
- Quest ưu tiên lặp câu cũ nên người chơi có thể nhớ đáp án và Quest dễ dần. Nhóm chấp nhận vì Quest không dùng để chẩn đoán.
- Thời gian đo bằng đồng hồ trình duyệt; đổi tab hoặc máy chậm có thể làm `timeMs` lệch so với thời gian suy nghĩ thật.
- Boss yêu cầu 90% trong khi có 9 câu khó; độ khó này chưa được kiểm chứng bằng clear-rate người chơi thật.
- `performance_score` chỉ có nghĩa nội bộ trong sản phẩm này; không phải thang đo năng lực chuẩn hoá và không dự báo kết quả thi CFA.
