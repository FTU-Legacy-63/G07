# SOURCE_USE_MAP

**Sản phẩm:** CFA Quest — Ethics diagnostic dungeon  
**Học phần:** NHA408E · Nhóm 7  
**Đối chiếu với:** `INPUT_DICTIONARY.md`, `SOLUTION_STRUCTURE.md`, `README.md`, `ASSUMPTIONS.md`, `SAMPLE_INPUT_OUTPUT.md`, `user-flow.md`, `feature-scope.md`  
**Trạng thái:** cập nhật theo thiết kế Week 7 — progressive difficulty, timer/penalty, Boss Gate và World Quest

---

## 0. File này dùng để làm gì

Phân biệt rõ:

- **Operational data** — dữ liệu sản phẩm dùng để chạy và tạo O1/O2/O3/O4.
- **Problem evidence** — bằng chứng chứng minh problem/user difficulty có căn cứ.

File này là **source register + traceability map**: mỗi nguồn phải nói rõ lấy thông tin gì, dùng để làm gì, limitation nào tồn tại và ai chịu trách nhiệm.

> **Trạng thái hiện tại:** operational data đủ rõ để xây prototype; problem evidence thật vẫn chưa có. Kế hoạch observation/interview không được xem là evidence cho tới khi nhóm thực hiện và lưu kết quả.

Bốn output:

- **O1 — Bảng chẩn đoán:** Accuracy theo 5 cụm và 9 module.
- **O2 — Arena kế tiếp:** cụm được chọn + bộ câu hỏi được sinh theo difficulty quota của round.
- **O3 — Kết quả Arena / progression:** pass/fail, Credit, timer penalty, Boss Gate, World Quest và lời giải.
- **O4 — Bảng tổng kết sau Boss:** kết quả từng cụm qua 5 Arena + `performance_score`.

> World Quest tạo dữ liệu progression riêng nhưng **không được cộng vào O1 hoặc O4**.

---

## 1. Source register

| # | Source | Information used | Purpose | Access date / status | Limitation | Owner |
|---|---|---|---|---|---|---|
| 1 | `data/ethics_bank_170.json` — ngân hàng 170 câu do nhóm tự biên soạn | Runtime dùng: `id, cluster, module, difficulty, stem, options, answer, distractor_reason, explanation`. Biên soạn dùng thêm `sub_standard`. `topic` và `item_type` hiện chỉ contextual | **Operational.** Cấp nội dung cho O1–O4; `cluster` điều khiển targeted generation; `difficulty` điều khiển difficulty quota, tie-break và `performance_score` | Repo hiện hành dùng bank 170 câu, 34 câu/cụm | Không phải câu thi CFA thật; difficulty tự đánh giá, chưa calibrate; explanation/distractor chưa external review; số câu hard mỗi cụm hữu hạn nên replay có thể làm cạn pool | Hồng (content), Quỳnh (dictionary/traceability) |
| 2 | Runtime session data từ người chơi + hệ thống | `selected_option`, `timeMs`, `item_used`, `item_type_used`, `question_id`, `arena`, `attempt_index`; timer/overtime; trạng thái Credit; Boss unlock; Quest history | **Operational.** Kết hợp với Source 1 để chấm Arena, cập nhật bộ đếm, tính penalty, quản lý progression và sinh O1–O4 | Sinh trong từng phiên; không phải external source | Có thể lỗi timestamp/event; browser timer có thể lệch khi đổi tab hoặc máy chậm; không có account/backend nên không bảo đảm persistence ngoài browser | Minh (engine), Khôi (UI/QA) |
| 3 | Cấu trúc Standards/Sub-standards dùng làm taxonomy biên soạn | Tên Standard I–VII và sub-standard con; khung để gắn `sub_standard` và kiểm tra coverage | **Operational support / authoring.** Không phải runtime input của engine | External reference cụ thể chưa được nhóm ghi vào repo | Nguồn gốc tham chiếu chưa đủ traceable; nhóm chỉ dùng taxonomy, không tuyên bố là tài liệu chính thức hay trích nguyên văn | Hồng, Quỳnh |
| 4 | Bảng ánh xạ 9 module → 5 cụm trong `SOLUTION_STRUCTURE.md` | C1=GIPS+CODE; C2=S1+S2; C3=S3; C4=S4+S5; C5=S6+S7 | **Operational rule.** Trục chẩn đoán và targeted generation cho O1/O2; trục dòng của O4 | N/A — design choice nội bộ | Chưa đối chiếu trọng số đề thi CFA thật; thay mapping làm thay logic phân bổ bank và chẩn đoán | Quỳnh |
| 5 | **Gameplay & progression rules** trong `SOLUTION_STRUCTURE.md` bản Week 7 | Pass threshold `70/75/75/85/90`; Credit reward `+2/+3/+4`; Boss bonus `+5`; Bùa giá `3`; timer `100/80/60`; penalty theo block 10 giây; difficulty quota từng round; W2 ≠ W1; Boss 7/5/3; Boss Gate 15 Credit; Boss được dùng tối đa 1 Bùa; World Quest 15 câu và reward `0/+2/+3/+4`; quit/retry Boss | **Operational rule.** Tạo O2/O3, ràng buộc mẫu của O1 và quyết định progression trước Boss | N/A — design choice nội bộ Week 7 | Không phải rule CFA Institute; các ngưỡng/timer/penalty/Boss price/Quest reward chưa được kiểm chứng bằng user data | Quỳnh, Minh |
| 5b | **Scoring & reporting rules** trong `SOLUTION_STRUCTURE.md` | (1) `accuracy_cumulative`; (2) `arena_score_correct`; (3) `performance_score`; `DIFFICULTY_POINTS={1:1,2:2,3:3}`; baseline = Arena 1 + Crossroads; rule nhãn O4 dùng mốc 70% + Δ; quy tắc lượt đầu/lượt đỗ; `accuracy_by_arena` | **Operational rule.** Nguồn chính sinh O4 và một phần O1/O2/O3 | N/A — design choice nội bộ | Mốc 70% của O4 và difficulty points do nhóm tự đặt; không được nhầm với Boss pass 90%; slot Boss 7/5/3 làm độ chặt mốc 70% không đều | Quỳnh, Minh |
| 6 | `README.md` / `PROJECT PROPOSAL.md` — problem hypotheses và observation plan | Hypothesis: repeated MCQ có thể gây nhàm chán; learner cần biết weakness và lý do sai; câu hỏi observation/interview dự kiến | **Problem-evidence plan, chưa phải evidence** | Chưa thực hiện đầy đủ | Không được dùng để claim problem đã được chứng minh | Trang, Khôi |
| 7 | Observation/interview result của target user | Câu trả lời, hành vi, willingness to continue, usefulness của Weakness Profile, phản ứng với difficulty/timer/Boss Gate/Quest và khả năng đọc đúng O4 | **Problem evidence thật** khi được thu thập | Chưa có file / chưa thu thập đủ | Sample nhỏ; self-report bias; cần ghi ngày, participant criteria và cách thu thập | Trang, Khôi |

---

## 2. Operational data vs problem evidence

### Operational data đã sẵn sàng

- Question bank 170 câu (Source 1).
- User response/session fields, gồm `arena`, `attempt_index`, `timeMs`, item state, Credit state, Boss/Quest state (Source 2).
- Mapping cluster/module (Source 4).
- Gameplay & progression rules Week 7 (Source 5).
- Scoring & reporting rules sinh O4 (Source 5b).

Các nguồn trên đủ để prototype chạy với sample/simulated data và đủ để nhóm dự đoán output trước khi có dữ liệu người dùng thật.

### Problem evidence chưa sẵn sàng

Hiện nhóm mới có hypothesis và kế hoạch observation.

Câu trả lời đúng nếu bị hỏi:

> "Nhóm đã xác định cách thu thập problem evidence nhưng chưa có đủ evidence người dùng thật. Các threshold, timer, penalty, Boss Gate và Quest hiện vẫn là design assumptions của prototype."

---

## 3. Field traceability

| Field / rule | Source gốc | Runtime? | Output |
|---|---|---|---|
| `selected_option` | Source 2 | Có | O1, O2, O3, O4 |
| `timeMs` | Source 2 | Có | O2 (tie-break khi cần); O3 (timer/overtime/penalty) |
| `item_used` | Source 2 | Có | O1; O3; O4 |
| `item_type_used` | Source 2 | Có | O3 |
| `arena` | Source 2 | Có | O3, O4 |
| `attempt_index` | Source 2 | Có | O3, O4 |
| `id` / `question_id` | Source 1 + Source 2 | Có | O2 — chống lặp/fallback và loại câu Quest khỏi Boss |
| `cluster` | Source 1 + Source 4 | Có | O1, O2, O4 |
| `module` | Source 1 + Source 4 | Có | O1, O2 coverage |
| `difficulty` | Source 1 | Có | O2 — quota difficulty + tie-break; O4 — trọng số `performance_score` |
| `stem`, `options`, `answer` | Source 1 | Có | O1, O3 |
| `distractor_reason`, `explanation` | Source 1 | Có | O3 |
| `sub_standard` | Source 1 + taxonomy Source 3 | Không | Authoring/coverage |
| `topic`, `item_type` | Source 1 | Không | Contextual |
| Công thức `accuracy_cumulative` | Source 5b | Có | O1, O2 |
| Công thức `arena_score_correct` | Source 5b | Có | O3 |
| `performance_score` | Source 5b | Có | O4 |
| `DIFFICULTY_POINTS` | Source 5b | Có | O4 |
| `baseline_accuracy` | Source 5b | Có | O4 |
| `improvement_label` + mốc 70% + Δ | Source 5b | Có | O4 |
| Quy tắc lượt đầu / lượt đỗ | Source 5b | Có | O3, O4 |
| `arena_pass_percent` theo round | Source 5 | Có | O3 |
| Difficulty quota từng round | Source 5 + Source 1 `difficulty` | Có | O2 |
| `time_limit_seconds` | Source 5 | Có | O3 |
| `overtime_seconds` | Source 2 + Source 5 | Có | O3 |
| `time_penalty_credit` | Source 2 + Source 5 | Có | O3 |
| `round_time_penalty_credit` | Source 2 + Source 5 | Có | O3 |
| `credit_balance` | Source 5 + runtime Source 2 | Có | O3 |
| `round_credit_reward` | Source 5 | Có | O3 |
| `boss_first_clear_bonus` | Source 5 | Có | O3 |
| `W1` | Source 4 + Source 5b | Có | O2 |
| `W2` + rule `W2 ≠ W1` | Source 5 | Có | O2 |
| `boss_clusters` | Source 5 + Source 5b | Có | O2, O4 |
| Boss split `7/5/3` | Source 5 | Có | O2, O4 |
| Boss difficulty split `2/4/9` | Source 5 | Có | O2 |
| `used_question_ids` | Source 2 | Có | O2 |
| `bankLog` | Source 5 + runtime Source 2 | Có | O2 — QA/fallback |
| `boss_unlocked` | Source 5 + runtime Source 2 | Có | O3 |
| `boss_unlock_cost = 15` | Source 5 | Có | O3 |
| `boss_unlock_paid` | Source 5 + runtime Source 2 | Có | O3 |
| `boss_cleared_once` | Source 5 + runtime Source 2 | Có | O3 |
| `quest_available` | Source 5 + runtime Source 2 | Có | O3 |
| `quest_attempt_index` | Source 2 | Có | O3 |
| `quest_score_correct` | Source 2 + Source 5 | Có | O3 |
| `quest_credit_reward` | Source 5 | Có | O3 |
| `quest_history` | Source 2 | Có | O3 |
| `quest_used_question_ids` | Source 2 + Source 5 | Có | O2 — Boss phải loại |
| Item rule: Arena 1 không dùng | Source 5 | Có | O1, O3, O4 |
| Item rule: Arena 2–4 tối đa 1 Bùa | Source 5 | Có | O1, O3, O4 |
| Item rule: Boss tối đa 1 Bùa | Source 5 | Có | O1, O3, O4 |
| Item rule: Quest không dùng Bùa | Source 5 | Có | O3 |
| Quest không tham gia diagnosis/O4 | Source 5 + Source 5b | Có | O1, O4 |

---

## 4. Rule traceability theo output

### O1 — Bảng chẩn đoán

| Rule / data | Source |
|---|---|
| Đáp án đúng/sai | Source 1 + Source 2 |
| Cluster/module | Source 1 + Source 4 |
| Loại câu dùng Bùa khỏi diagnostic | Source 5b |
| Không tính World Quest | Source 5 |
| `accuracy_cumulative` | Source 5b |

### O2 — Arena kế tiếp

| Rule / data | Source |
|---|---|
| W1/W2/boss_clusters | Source 4 + Source 5 + Source 5b |
| Cluster targeted | Source 5 |
| Difficulty quota | Source 5 + Source 1 |
| Boss 7/5/3 | Source 5 |
| Boss 2/4/9 easy/medium/hard | Source 5 |
| Reuse/fallback khi bank thiếu | Source 5 |
| `bankLog` | Source 5 + Source 2 |
| Loại câu Quest khỏi Boss | Source 5 + Source 2 |

### O3 — Kết quả / progression

| Rule / data | Source |
|---|---|
| Pass threshold 70/75/75/85/90 | Source 5 |
| Reward +2/+3/+4 | Source 5 |
| Boss bonus +5 | Source 5 |
| Timer 100/80/60 | Source 5 |
| Overtime/penalty | Source 2 + Source 5 |
| Credit không âm | Source 5 |
| Bùa giá 3 Credit | Source 5 |
| Boss Gate 15 Credit | Source 5 |
| World Quest reward | Source 5 |
| Boss fail vs quit behavior | Source 5 |
| Lời giải / distractor reason | Source 1 |

### O4 — Bảng tổng kết sau Boss

| Rule / data | Source |
|---|---|
| `accuracy_by_arena` | Source 5b |
| Baseline = Arena 1 + Crossroads | Source 5b |
| `delta` | Source 5b |
| `improvement_label` | Source 5b |
| Mốc O4 70% | Source 5b |
| `performance_score` | Source 5b + Source 1 difficulty |
| Không tính World Quest | Source 5 |
| Boss pass 90% không thay mốc O4 70% | Source 5 + Source 5b |

---

## 5. Source quality check

| Source | Origin rõ? | Relevant? | Freshness cần thiết? | Accessible? | Limitation ghi rõ? | Status |
|---|---|---|---|---|---|---|
| 1 Question bank 170 | Có — nội bộ | Có | Không | Có | Có | Ready, cần QA content + hard-pool coverage |
| 2 Runtime session data | Có — user/system | Có | Theo phiên | Có | Có | Ready, cần validation timer/Boss/Quest state |
| 3 Taxonomy Standard/sub-standard | Chưa đủ | Có cho authoring | Không | Chưa ghi source cụ thể | Có | Open |
| 4 Cluster mapping | Có — nội bộ | Có | Không | Có | Có | Ready as assumption |
| 5 Gameplay & progression rules | Có — nội bộ | Có | Không | Có | Có | Ready as assumption, chưa playtest |
| 5b Scoring & reporting rules | Có — nội bộ | Có | Không | Có | Có | Ready as assumption, chưa playtest |
| 6 Observation plan | Có — nội bộ | Có | Không | Có | Có | Plan only |
| 7 Observation result | Chưa có | Sẽ có | N/A | Chưa có | N/A | Missing evidence |

---

## 6. Việc phải chốt

| # | Việc | Owner | Hạn | Trạng thái |
|---|---|---|---|---|
| 1 | Ghi ngày hoàn tất/review từng batch question bank | Hồng | Trước final | Chưa |
| 2 | Ghi external reference cụ thể dùng để kiểm tra taxonomy Standard/sub-standard, hoặc ghi rõ `internal taxonomy only` | Hồng, Quỳnh | Trước final | Chưa |
| 3 | Chạy bank validation: unique `id`, options=3, answer 0–2, cluster/module/difficulty hợp lệ | Hồng, Trang | Trước integration | Chưa |
| 4 | Kiểm tra đủ quota difficulty cho A2 `4/4/2`, A3 `2/5/3`, A4 `2/4/4`, Boss `2/4/9` | Hồng, Trang | Trước integration | Chưa |
| 5 | Assert Arena 3 vẫn đúng 2 câu/cụm đồng thời đủ `2/5/3` difficulty | Trang | Trước integration | Chưa |
| 6 | Assert Boss đúng 7/5/3 theo cluster và 2/4/9 theo difficulty | Trang | Trước integration | Chưa |
| 7 | Test fallback: thiếu câu mới đúng difficulty → reuse cùng difficulty → hạ medium; mọi lần fallback có `bankLog` | Trang, Minh | Trước integration | Chưa |
| 8 | Test pass boundary: 10/15 fail–11/15 pass; 7/10 fail–8/10 pass; 8/10 fail–9/10 pass; 13/15 fail–14/15 pass | Minh, Khôi | Khi engine Week 7 chạy | Chưa |
| 9 | Test timer boundary: `L`, `L+1`, `L+10`, `L+11` | Minh, Khôi | Khi engine Week 7 chạy | Chưa |
| 10 | Test fail round vẫn bị penalty và ví không âm | Minh, Khôi | Khi engine Week 7 chạy | Chưa |
| 11 | Test Boss Gate: <15 bị chặn; đủ 15 trừ đúng một lần | Minh, Khôi | Khi engine Week 7 chạy | Chưa |
| 12 | Test Boss fail không trả lại 15; quit Boss làm khoá lại và phải trả 15 mới | Minh, Khôi | Khi engine Week 7 chạy | Chưa |
| 13 | Test Quest 15 câu = 5/5/5; reward 0/2/3/4; replay được | Minh, Trang | Khi engine Week 7 chạy | Chưa |
| 14 | Assert Quest không làm thay đổi diagnostic/O4 | Minh, Trang | Khi engine Week 7 chạy | Chưa |
| 15 | Assert `quest_used_question_ids ∩ boss_question_ids = ∅` | Minh, Trang | Khi engine Week 7 chạy | Chưa |
| 16 | Thực hiện ít nhất một vòng observation/interview target user và lưu result thành evidence riêng | Trang, Khôi | Trước final | Chưa |
| 17 | Ghi rõ trong README: threshold/timer/penalty/Boss Gate/Quest reward là design assumptions, `performance_score` không phải standardized ability score | Quỳnh | Trước final | Chưa |

---

## 7. Bản quyền và giới hạn

- `stem`, `options`, `distractor_reason`, `hint`, `explanation` do nhóm tự viết; tình huống giả định.
- Nhóm không tuyên bố câu hỏi là câu thi CFA thật hay được CFA Institute phê duyệt.
- Tên Standard/GIPS được dùng cho mục đích học thuật/phân loại.
- Tài liệu nguồn thương mại không được đưa vào repo hoặc lịch sử commit.
- Không có API, market data real-time hoặc external user database.
- Sample/simulated data chỉ để kiểm tra logic, không phải problem evidence.
- Mapping cụm, difficulty, pass threshold, timer, penalty, Boss Gate, World Quest reward, mốc 70% của O4 và bảng quy đổi độ khó đều là assumptions/design choices nội bộ.
- Arena 2 và Arena 3 cùng pass threshold 75%; khác biệt difficulty đến từ question mix và timer.
- Mỗi cụm chỉ có số lượng câu hard hữu hạn; replay có thể buộc engine reuse/fallback.
- World Quest lặp câu cũ nên có thể dễ dần do nhớ đáp án; vì vậy Quest không được dùng làm diagnostic evidence.
- Browser timer có thể lệch so với thời gian người chơi thực sự suy nghĩ.
- Boss 90% với 9 câu hard có thể quá khó; chưa có clear-rate người chơi thật.
- `performance_score` chỉ là chỉ số nội bộ sản phẩm; không phải thang đo năng lực chuẩn hoá và không dự báo kết quả thi CFA.

---

## 8. Ownership

Phân công owner chi tiết giữ theo file quản lý công việc của nhóm.

