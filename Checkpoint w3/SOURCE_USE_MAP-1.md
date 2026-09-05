# SOURCE_USE_MAP

**Sản phẩm:** CFA Quest — Ethics diagnostic dungeon  
**Học phần:** NHA408E · Nhóm 7  
**Đối chiếu với:** `INPUT_DICTIONARY.md`, `SOLUTION_STRUCTURE.md`, `README.md`, `ASSUMPTIONS.md`, `SAMPLE_INPUT_OUTPUT.md`, `week-3.md`

---

## 0. File này dùng để làm gì

Week 3 yêu cầu phân biệt rõ:

- **Operational data** — dữ liệu sản phẩm dùng để chạy và tạo O1/O2/O3.
- **Problem evidence** — bằng chứng chứng minh problem/user difficulty có căn cứ.

File này là **source register + traceability map**: mỗi nguồn phải nói rõ lấy thông tin gì, dùng để làm gì, limitation nào tồn tại và ai chịu trách nhiệm.

> **Trạng thái hiện tại:** operational data đủ rõ để xây prototype; problem evidence thật vẫn chưa có. Kế hoạch observation/interview không được xem là evidence cho tới khi nhóm thực hiện và lưu kết quả.

---

## 1. Source register

| # | Source | Information used | Purpose | Access date / status | Limitation | Owner |
|---|---|---|---|---|---|---|
| 1 | `ethics_bank_110.json` — ngân hàng câu hỏi do nhóm tự biên soạn | Runtime dùng: `id, cluster, module, difficulty, stem, options, answer, distractor_reason, hint, explanation`. Biên soạn dùng thêm `sub_standard`. `topic` và `item_type` hiện chỉ contextual | **Operational.** Cấp nội dung cho O1/O2/O3; đồng thời dùng để kiểm tra coverage câu hỏi | Biên soạn nội bộ Tuần 2–3. **Ngày hoàn tất từng batch chưa được ghi** | Không phải câu thi thật; difficulty tự đánh giá; explanation/distractor chưa được external review; `topic`/`item_type` không làm thay đổi output hiện tại | Hồng (content), Quỳnh (dictionary/traceability) |
| 2 | Runtime session data từ người chơi + hệ thống | `selected_option`, `time_to_answer`, `item_used`, `item_type_used`, `question_id` | **Operational.** Kết hợp với Source 1 để chấm Arena, cập nhật diagnostic counters và sinh O1/O2/O3 | Sinh trong từng phiên; không phải external source | Có thể lỗi timestamp/event; không có account/backend nên không bảo đảm persistence ngoài browser | Minh (engine), Khôi (UI/QA) |
| 3 | Cấu trúc Standards/Sub-standards dùng làm taxonomy biên soạn | Tên Standard I–VII và sub-standard con; khung để gắn `sub_standard` và kiểm tra coverage | **Operational support / authoring.** Không phải runtime input của engine | **External reference cụ thể chưa được nhóm ghi vào repo** | Nguồn gốc tham chiếu chưa đủ traceable; nhóm chỉ dùng taxonomy, không tuyên bố là tài liệu chính thức hay trích nguyên văn | Hồng, Quỳnh |
| 4 | Bảng ánh xạ 9 module → 5 cụm trong `SOLUTION_STRUCTURE.md` | C1=GIPS+CODE; C2=S1+S2; C3=S3; C4=S4+S5; C5=S6+S7 | **Operational rule.** Trục chẩn đoán và sinh Trap cho O1/O2 | N/A — design choice nội bộ | Chưa đối chiếu trọng số đề thi CFA thật; thay mapping sẽ làm thay toàn bộ logic phân bổ bank | Quỳnh |
| 5 | Game rules trong `SOLUTION_STRUCTURE.md` | Pass 70%; Credit 2/3/4; Boss bonus +5; item price 3/4; W2 khác W1; Boss 7/5/3 | **Operational rule.** Tạo O2/O3 và ảnh hưởng gián tiếp O1 qua item use | N/A — design choice nội bộ | Không phải rule CFA Institute; chưa cân bằng bằng playtest người dùng thật | Quỳnh, Minh |
| 6 | `README.md` / `PROJECT_PROPOSAL.md` — problem hypotheses và observation plan | Hypothesis: repeated MCQ có thể gây nhàm chán; learner cần biết weakness và lý do sai; bộ câu hỏi quan sát/phỏng vấn dự kiến | **Problem-evidence plan, chưa phải evidence.** Dùng để xác định điều cần kiểm chứng | **CHƯA THỰC HIỆN** | Không được dùng để claim problem đã được chứng minh | Trang, Khôi |
| 7 | Observation/interview result của target user | Câu trả lời, hành vi, willingness to continue, usefulness của Weakness Profile | **Problem evidence thật** khi được thu thập | **CHƯA CÓ FILE / CHƯA THU THẬP** | Sample nhỏ; self-report bias; cần ghi ngày, participant criteria và cách thu thập | Trang, Khôi |

---

## 2. Operational data vs problem evidence

### Operational data đã sẵn sàng
- Question bank tĩnh.
- User response/session fields.
- Mapping cluster/module.
- Diagnostic/game rules.

Các nguồn này đủ để prototype chạy với sample/simulated data.

### Problem evidence chưa sẵn sàng
Hiện nhóm mới có hypothesis và kế hoạch observation. Vì vậy câu trả lời đúng nếu được hỏi ở Week 3 là:

> “Nhóm đã xác định cách thu thập problem evidence nhưng chưa có evidence người dùng thật. Đây là open item trước checkpoint tiếp theo.”

---

## 3. Field traceability

| Field / rule | Source gốc | Runtime? | Output |
|---|---|---|---|
| `selected_option` | Source 2 | Có | O1, O2, O3 |
| `time_to_answer` | Source 2 | Có | O2 (tie-break cuối) |
| `item_used` | Source 2 | Có | O1; gián tiếp O2 |
| `item_type_used` | Source 2 | Có | O3 |
| `id` | Source 1 | Có | O2 |
| `cluster` | Source 1 + rule Source 4 | Có | O1, O2 |
| `module` | Source 1 + rule Source 4 | Có | O1, O2 coverage |
| `difficulty` | Source 1 | Có | O2 |
| `stem`, `options`, `answer` | Source 1 | Có | O1/O3 |
| `distractor_reason`, `hint`, `explanation` | Source 1 | Có | O3 |
| `sub_standard` | Source 1 + taxonomy Source 3 | **Không** | authoring/coverage |
| `topic`, `item_type` | Source 1 | **Không** | contextual |
| Accuracy formula | `SOLUTION_STRUCTURE.md` / `INPUT_DICTIONARY.md` | Có | O1, O2 |
| Pass/Credit/item price | Source 5 | Có | O3 |
| W2 khác W1 / Boss 7-5-3 | Source 5 | Có | O2 |

---

## 4. Source quality check theo Week 3

| Source | Origin rõ? | Relevant? | Freshness cần thiết? | Accessible? | Limitation ghi rõ? | Status |
|---|---|---|---|---|---|---|
| Question bank | Có — nội bộ | Có | Không | Có | Có | Ready, cần QA content |
| Runtime session data | Có — user/system | Có | Theo phiên | Có | Có | Ready, cần validation |
| Taxonomy Standard/sub-standard | **Chưa đủ** | Có cho authoring | Không | Chưa ghi source cụ thể | Có | Open |
| Cluster mapping | Có — nội bộ | Có | Không | Có | Có | Ready as assumption |
| Game rules | Có — nội bộ | Có | Không | Có | Có | Ready as assumption |
| Observation plan | Có — nội bộ | Có | Không | Có | Có | Plan only |
| Observation result | Chưa có | Sẽ có | N/A | Chưa có | N/A | Missing evidence |

---

## 5. Việc phải chốt trước Week 4

| # | Việc | Owner | Hạn |
|---|---|---|---|
| 1 | Ghi ngày hoàn tất / review từng batch question bank | Hồng | Trước buổi code đầu tiên |
| 2 | Ghi external reference cụ thể dùng để kiểm tra taxonomy Standard/sub-standard, hoặc ghi rõ “internal taxonomy only” nếu không dùng nguồn ngoài | Hồng, Quỳnh | Trước checkpoint |
| 3 | Chạy bank validation: unique `id`, options=3, answer 0–2, cluster/module/difficulty hợp lệ, đủ số câu mỗi cụm/module | Hồng, Trang | Trước integration |
| 4 | Thực hiện ít nhất một vòng observation/interview target user và lưu result thành evidence riêng | Trang, Khôi | Trước checkpoint giữa kỳ |
| 5 | Chạy early logic tests trong `SAMPLE_INPUT_OUTPUT.md` và điền cột Actual/Issue | Minh, Khôi | Khi engine có bản đầu |
| 6 | Nếu có nguồn công khai đáng tin về cấu trúc/weighting Ethics, chỉ dùng để **đối chiếu** mapping; không tự động thay design nếu không phục vụ MVP | Quỳnh | Trước khi khóa scope |

---

## 6. Bản quyền và giới hạn

- `stem`, `options`, `distractor_reason`, `hint`, `explanation` do nhóm tự viết; tình huống giả định.
- Nhóm không tuyên bố câu hỏi là câu thi CFA thật hay được CFA Institute phê duyệt.
- Tên Standard/GIPS được dùng cho mục đích học thuật/phân loại.
- Không có API, market data real-time hoặc external user database.
- Sample/simulated data chỉ để kiểm tra logic, không phải problem evidence.
- Mapping cụm, difficulty, pass threshold và game economy là assumptions/design choices nội bộ; chi tiết xem `ASSUMPTIONS.md`.

---

## 7. Ownership

| Nội dung | Owner |
|---|---|
| Source register / traceability | Quỳnh |
| Question-bank content + taxonomy | Hồng |
| Runtime input + validation | Minh |
| Arena generation | Trang |
| UI event capture + QA | Khôi |
| Problem evidence collection | Trang, Khôi |
