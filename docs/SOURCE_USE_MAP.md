# SOURCE_USE_MAP

**Sản phẩm:** CFA Quest — Ethics diagnostic dungeon  
**Học phần:** NHA408E · Nhóm 7  
**Đối chiếu với:** `INPUT_DICTIONARY.md`, `SOLUTION_STRUCTURE.md`, `README.md`, `ASSUMPTIONS.md`, `SAMPLE_INPUT_OUTPUT.md`  
**Trạng thái:** đã đồng bộ với bản `SOLUTION_STRUCTURE.md` có Mục 5 ba công thức và bảng tổng kết sau Boss

---

## 0. File này dùng để làm gì

Phân biệt rõ:

- **Operational data** — dữ liệu sản phẩm dùng để chạy và tạo O1/O2/O3/O4.
- **Problem evidence** — bằng chứng chứng minh problem/user difficulty có căn cứ.

File này là **source register + traceability map**: mỗi nguồn phải nói rõ lấy thông tin gì, dùng để làm gì, limitation nào tồn tại và ai chịu trách nhiệm.

> **Trạng thái hiện tại:** operational data đủ rõ để xây prototype; problem evidence thật vẫn chưa có. Kế hoạch observation/interview không được xem là evidence cho tới khi nhóm thực hiện và lưu kết quả.

Bốn output: **O1** bảng chẩn đoán · **O2** Arena kế tiếp · **O3** kết quả Arena · **O4** bảng tổng kết sau Boss.

---

## 1. Source register

| # | Source | Information used | Purpose | Access date / status | Limitation | Owner |
|---|---|---|---|---|---|---|
| 1 | `ethics_bank_110.json` — ngân hàng câu hỏi do nhóm tự biên soạn | Runtime dùng: `id, cluster, module, difficulty, stem, options, answer, distractor_reason, hint, explanation`. Biên soạn dùng thêm `sub_standard`. `topic` và `item_type` hiện chỉ contextual | **Operational.** Cấp nội dung cho O1–O4; đồng thời dùng để kiểm tra coverage câu hỏi. **`difficulty` nay còn là trọng số điểm của `performance_score` ở O4** | Biên soạn nội bộ Tuần 2–3. **Ngày hoàn tất từng batch chưa được ghi** | Không phải câu thi thật; difficulty tự đánh giá và **chưa calibrate dù đã lên màn hình**; explanation/distractor chưa được external review; `topic`/`item_type` không làm thay đổi output | Hồng (content), Quỳnh (dictionary/traceability) |
| 2 | Runtime session data từ người chơi + hệ thống | `selected_option`, `time_to_answer`, `item_used`, `item_type_used`, `question_id`, **`arena`**, **`attempt_index`** | **Operational.** Kết hợp với Source 1 để chấm Arena, cập nhật ba bộ đếm và sinh O1–O4 | Sinh trong từng phiên; không phải external source | Có thể lỗi timestamp/event; không có account/backend nên không bảo đảm persistence ngoài browser. Thiếu `arena` thì không dựng được `accuracy_by_arena`, tức mất luôn O4 | Minh (engine), Khôi (UI/QA) |
| 3 | Cấu trúc Standards/Sub-standards dùng làm taxonomy biên soạn | Tên Standard I–VII và sub-standard con; khung để gắn `sub_standard` và kiểm tra coverage | **Operational support / authoring.** Không phải runtime input của engine | **External reference cụ thể chưa được nhóm ghi vào repo** | Nguồn gốc tham chiếu chưa đủ traceable; nhóm chỉ dùng taxonomy, không tuyên bố là tài liệu chính thức hay trích nguyên văn | Hồng, Quỳnh |
| 4 | Bảng ánh xạ 9 module → 5 cụm trong `SOLUTION_STRUCTURE.md` Mục 2 | C1=GIPS+CODE; C2=S1+S2; C3=S3; C4=S4+S5; C5=S6+S7 | **Operational rule.** Trục chẩn đoán và sinh Trap cho O1/O2, và trục dòng của bảng O4 | N/A — design choice nội bộ | Chưa đối chiếu trọng số đề thi CFA thật; thay mapping sẽ làm thay toàn bộ logic phân bổ bank | Quỳnh |
| 5 | **Game rules** trong `SOLUTION_STRUCTURE.md` Mục 4 và Mục 8 | Pass ≥70%; Credit 2/3/4; Boss bonus +5; giá vật phẩm 3/4; W2 ≠ W1; Boss 7/5/3 và **không loại trừ cụm nào**; **bốn ràng buộc vật phẩm: Arena 1 không dùng · Boss không dùng · mỗi Arena tối đa 1 · mỗi câu tối đa 1**; số dư Credit khởi tạo 3 | **Operational rule.** Tạo O2/O3, ràng buộc mẫu của O1, và quyết định cột nào của O4 có dữ liệu | N/A — design choice nội bộ | Không phải rule CFA Institute; chưa cân bằng bằng playtest người dùng thật | Quỳnh, Minh |
| **5b** | **Scoring & reporting rules** trong `SOLUTION_STRUCTURE.md` Mục 5 | Ba công thức (1) `accuracy_cumulative` (2) `arena_score_correct` (3) `performance_score`; bảng quy đổi `DIFFICULTY_POINTS = {1:1, 2:2, 3:3}`; định nghĩa mốc chẩn đoán = Arena 1 + Crossroads; ngưỡng Boss ≥70% và Δ ≥ 0; **bốn điều kiện dán nhãn `improvement_label` chạy theo thứ tự**; quy tắc ghi theo lượt đầu (mốc chẩn đoán, performance) và lượt đỗ (điểm, Credit); ba quy tắc lưu `accuracy_by_arena` | **Operational rule.** Đây là nguồn duy nhất sinh ra **O4** | N/A — design choice nội bộ, ban hành cùng bản `SOLUTION_STRUCTURE.md` hiện hành | Ngưỡng 70% và bảng quy đổi độ khó do nhóm tự đặt, chưa playtest. Ngưỡng 70% có độ chặt không đều trên slot 7/5/3 (xem `ASSUMPTIONS.md` B8). `accuracy_cumulative` gồm cả Trap nên cụm được luyện tốt có thể rơi khỏi Boss (B10) | Quỳnh, Minh |
| 6 | `README.md` / `PROJECT_PROPOSAL.md` — problem hypotheses và observation plan | Hypothesis: repeated MCQ có thể gây nhàm chán; learner cần biết weakness và lý do sai; bộ câu hỏi quan sát/phỏng vấn dự kiến | **Problem-evidence plan, chưa phải evidence.** Dùng để xác định điều cần kiểm chứng | **CHƯA THỰC HIỆN** | Không được dùng để claim problem đã được chứng minh | Trang, Khôi |
| 7 | Observation/interview result của target user | Câu trả lời, hành vi, willingness to continue, usefulness của Weakness Profile **và khả năng đọc đúng nhãn ở O4** | **Problem evidence thật** khi được thu thập | **CHƯA CÓ FILE / CHƯA THU THẬP** | Sample nhỏ; self-report bias; cần ghi ngày, participant criteria và cách thu thập | Trang, Khôi |

---

## 2. Operational data vs problem evidence

### Operational data đã sẵn sàng
- Question bank tĩnh (Source 1).
- User response/session fields, gồm `arena` và `attempt_index` (Source 2).
- Mapping cluster/module (Source 4).
- Game rules (Source 5).
- Scoring & reporting rules sinh ra O4 (Source 5b).

Các nguồn này đủ để prototype chạy với sample/simulated data, và đủ để nhóm dự đoán output trước khi có code — xem `SAMPLE_INPUT_OUTPUT.md` Mục 5 và 6.

### Problem evidence chưa sẵn sàng
Hiện nhóm mới có hypothesis và kế hoạch observation. Câu trả lời đúng nếu bị hỏi:

> "Nhóm đã xác định cách thu thập problem evidence nhưng chưa có evidence người dùng thật. Đây là open item."

---

## 3. Field traceability

| Field / rule | Source gốc | Runtime? | Output |
|---|---|---|---|
| `selected_option` | Source 2 | Có | O1, O2, O3, O4 |
| `time_to_answer` | Source 2 | Có | O2 (tie-break cuối) |
| `item_used` | Source 2 | Có | O1; O4 (tử số performance); gián tiếp O2 |
| `item_type_used` | Source 2 | Có | O3 |
| `arena` | Source 2 | Có | **O4 — không có thì không dựng được `accuracy_by_arena`** |
| `attempt_index` | Source 2 | Có | **O4 — quyết định lượt nào vào mốc chẩn đoán** |
| `id` | Source 1 | Có | O2 |
| `cluster` | Source 1 + rule Source 4 | Có | O1, O2, O4 |
| `module` | Source 1 + rule Source 4 | Có | O1, O2 coverage |
| `difficulty` | Source 1 | Có | O2 (cân bằng, tie-break); **O4 (trọng số `performance_score`)** |
| `stem`, `options`, `answer` | Source 1 | Có | O1/O3 |
| `distractor_reason`, `hint`, `explanation` | Source 1 | Có | O3 |
| `sub_standard` | Source 1 + taxonomy Source 3 | **Không** | authoring/coverage |
| `topic`, `item_type` | Source 1 | **Không** | contextual |
| Công thức (1) `accuracy_cumulative` | Source 5b | Có | O1, O2 |
| Công thức (2) `arena_score_correct` | Source 5b | Có | O3 |
| **Công thức (3) `performance_score`** | **Source 5b** | Có | **O4** |
| **`DIFFICULTY_POINTS`** | **Source 5b** | Có | **O4** |
| **`baseline_accuracy` (mốc chẩn đoán)** | **Source 5b** | Có | **O4** |
| **Ngưỡng Boss ≥70% + Δ ≥ 0, 4 nhãn `improvement_label`** | **Source 5b** | Có | **O4** |
| **Quy tắc lượt đầu / lượt đỗ** | **Source 5b** | Có | **O3, O4** |
| Pass ≥70% / Credit / giá vật phẩm | Source 5 | Có | O3 |
| W2 ≠ W1 · Boss 7/5/3 · Boss không loại trừ cụm | Source 5 | Có | O2, O4 |
| **Bốn ràng buộc vật phẩm** | **Source 5** | Có | **O1 (mẫu chẩn đoán), O4 (trần điểm Arena 1 = 30)** |

---

## 4. Source quality check

| Source | Origin rõ? | Relevant? | Freshness cần thiết? | Accessible? | Limitation ghi rõ? | Status |
|---|---|---|---|---|---|---|
| 1 Question bank | Có — nội bộ | Có | Không | Có | Có | Ready, cần QA content |
| 2 Runtime session data | Có — user/system | Có | Theo phiên | Có | Có | Ready, cần validation cho `arena`/`attempt_index` |
| 3 Taxonomy Standard/sub-standard | **Chưa đủ** | Có cho authoring | Không | Chưa ghi source cụ thể | Có | Open |
| 4 Cluster mapping | Có — nội bộ | Có | Không | Có | Có | Ready as assumption |
| 5 Game rules | Có — nội bộ | Có | Không | Có | Có | Ready as assumption |
| **5b Scoring & reporting rules** | Có — nội bộ | Có | Không | Có | Có — B8, B9, B10, B11, B12 | **Ready as assumption, chưa playtest** |
| 6 Observation plan | Có — nội bộ | Có | Không | Có | Có | Plan only |
| 7 Observation result | Chưa có | Sẽ có | N/A | Chưa có | N/A | Missing evidence |

---

## 5. Việc phải chốt

| # | Việc | Owner | Hạn | Trạng thái |
|---|---|---|---|---|
| 1 | Ghi ngày hoàn tất / review từng batch question bank | Hồng | Trước buổi code đầu tiên | Chưa |
| 2 | Ghi external reference cụ thể dùng để kiểm tra taxonomy Standard/sub-standard, hoặc ghi rõ "internal taxonomy only" nếu không dùng nguồn ngoài | Hồng, Quỳnh | Trước Week 4 nộp | Chưa |
| 3 | Chạy bank validation: unique `id`, options=3, answer 0–2, cluster/module/difficulty hợp lệ, đủ số câu mỗi cụm/module | Hồng, Trang | Trước integration | Chưa |
| 4 | Thực hiện ít nhất một vòng observation/interview target user và lưu result thành evidence riêng | Trang, Khôi | Trước Week 6 | Chưa |
| 5 | Chạy early logic tests trong `SAMPLE_INPUT_OUTPUT.md` Mục 9 và điền cột Actual/Issue | Minh, Khôi | Khi engine có bản đầu | Chưa |
| 6 | Nếu có nguồn công khai đáng tin về cấu trúc/weighting Ethics, chỉ dùng để **đối chiếu** mapping; không tự động thay design nếu không phục vụ MVP | Quỳnh | Trước khi khoá scope | Chưa |
| **7** | **`validate.html`: assert `Σ difficulty` của một bộ Arena 1 hợp lệ luôn bằng 30; và assert cụm W1 tiêu thụ đúng 22 câu (3+10+2+7) mà bank không cạn** | Trang | Trước integration | Chưa |
| **8** | **Kiểm tra phân bổ độ khó thật của bank so với thiết kế 4/4/3 mỗi module 11 câu — nếu lệch thì `points_offered` của các Arena ngẫu nhiên lệch theo và `performance_score` giữa hai người chơi so bằng hai trần khác nhau** | Hồng, Trang | Trước integration | Chưa |
| **9** | **Ghi rõ trong README: `performance_score` là chỉ số nội bộ sản phẩm, không phải thang đo năng lực chuẩn hoá** | Quỳnh | Trước Week 4 nộp | Chưa |

---

## 6. Bản quyền và giới hạn

- `stem`, `options`, `distractor_reason`, `hint`, `explanation` do nhóm tự viết; tình huống giả định.
- Nhóm không tuyên bố câu hỏi là câu thi CFA thật hay được CFA Institute phê duyệt.
- Tên Standard/GIPS được dùng cho mục đích học thuật/phân loại.
- Tài liệu nguồn thương mại **không** được đưa vào repo hoặc lịch sử commit.
- Không có API, market data real-time hoặc external user database.
- Sample/simulated data chỉ để kiểm tra logic, không phải problem evidence.
- Mapping cụm, difficulty, pass threshold, game economy, **ngưỡng 70% của O4 và bảng quy đổi độ khó** đều là assumptions/design choices nội bộ; chi tiết xem `ASSUMPTIONS.md`.
- **`performance_score` so sánh được giữa hai người chơi trong cùng sản phẩm này; nó không phải thang đo năng lực chuẩn hoá và không dự báo kết quả thi CFA.**

---

## 7. Ownership

| Nội dung | Owner |
|---|---|
| Source register / traceability | Quỳnh |
| Question-bank content + taxonomy | Hồng |
| Runtime input + validation | Minh |
| Arena generation | Trang |
| Scoring & reporting rules (Source 5b) | Quỳnh, Minh |
| UI event capture + QA + hiển thị O4 | Khôi |
| Problem evidence collection | Trang, Khôi |
