# MIDTERM REVIEW — CFA Quest (Ethics)

**Học phần:** NHA408E · FTU 2026 · **Nhóm 7**  
**Ngày nộp:** `08/09/2026`  
**Câu hỏi giữa kỳ là "hướng đi hiện tại có giải thích được và kiểm tra được không".**

---

## Part A · Project logic chain

**Problem.** Thí sinh tự ôn CFA Level I môn Ethics biết mình sai bao nhiêu câu nhưng không biết sai tập trung ở Standard nào, nên lần luyện sau vẫn làm dàn trải.

**User.** Người đã học xong lý thuyết Ethics, đang ở giai đoạn luyện MCQ. Không phải người mới bắt đầu — sản phẩm không dạy lại lý thuyết.

**User task.** Đi hết 5 Arena và biết cụm kiến thức nào đã cải thiện, cụm nào chưa.

**Chuỗi logic.**

```text
Đáp án sai của người học
        ↓
Tỷ lệ đúng theo 5 cụm  (loại câu dùng vật phẩm)
        ↓
Xếp hạng, lấy cụm thấp nhất
        ↓
Lọc ngân hàng 110 câu theo cụm đó
        ↓
Sinh Arena kế tiếp
        ↓
Chẩn đoán lại → Boss → bảng tổng kết đối chiếu
```

**Điểm khác biệt.** Bộ đề trắc nghiệm thường trả lời *"tôi được bao nhiêu điểm"*. Sản phẩm này trả lời *"lần sau tôi nên luyện gì"* — và tự sinh luôn đề đó.

**Bằng chứng:** [`SOLUTION_STRUCTURE.md` Mục 0, 1, 3, 12](SOLUTION_STRUCTURE.md)

---

## Part B · Input, financial logic and output

### B1. Input

| Nhóm | Field | Nguồn |
|---|---|---|
| Người học nhập | `selected_option`, `item_used`, `item_type_used` | Hành vi người dùng |
| Hệ thống ghi | `time_to_answer`, `arena`, `attempt_index` | Timestamp render → submit |
| Dữ liệu tĩnh | `id`, `cluster`, `module`, `difficulty`, `stem`, `options`, `answer`, `distractor_reason`, `hint`, `explanation` | `ethics_bank_110.json` |

Không đăng nhập, không API, không dữ liệu thời gian thực.

**Bằng chứng:** [`INPUT_DICTIONARY.md` Mục 1, 2](INPUT_DICTIONARY.md)

### B2. Logic — ba công thức đếm cùng một tập câu trả lời theo ba cách

| Công thức | Tử số | Mẫu số | Ra output |
|---|---|---|---|
| (1) `accuracy_cumulative[c]` | Loại câu dùng vật phẩm | Loại | O1, O2 — xếp hạng cụm yếu |
| (2) `arena_score_correct` | Tính cả | Tính cả | O3 — đỗ/trượt, Credit |
| (3) `performance_score` | Loại | **Tính cả** | O4 — phân biệt hai người cùng điểm |

Đây là chỗ dễ sai nhất khi code, nên tài liệu cấm dùng tên biến `correct`, `score`, `accuracy` trần.

**Logic sinh nhãn ở bảng tổng kết** chạy bốn điều kiện theo thứ tự: cụm không được hỏi ở Boss → Boss ≥70% và Δ ≥ 0 → Boss <70% và Δ > 0 → còn lại. Chạy sai thứ tự sẽ chia cho `undefined`.

### B3. Output

| # | Output | Nội dung |
|---|---|---|
| O1 | Bảng chẩn đoán | Tỷ lệ đúng 5 cụm + 9 module, tính lại sau mỗi Arena |
| O2 | Arena kế tiếp | Đề lọc từ cụm yếu, chia đều theo module |
| O3 | Kết quả Arena | Đỗ/trượt, Credit, lời giải từng câu sai |
| O4 | Bảng tổng kết sau Boss | Tỷ lệ đúng từng cụm qua 5 Arena, nhãn cải thiện, `performance_score` |

### B4. Claim boundary

Sản phẩm **xác định cụm có tỷ lệ đúng thấp nhất trong một phiên 60 câu**. Nó không chẩn đoán năng lực Ethics, không chứng minh Trap cải thiện learning, không dự báo kết quả thi thật.

Bốn điểm dễ gây misunderstanding, ranh giới của `performance_score`, và bảng cỡ mẫu từng chỉ số: [`SOLUTION_STRUCTURE.md` Mục 14](SOLUTION_STRUCTURE.md).

**Bằng chứng Part B:** [`SOLUTION_STRUCTURE.md` Mục 5.0, Mục 5, Mục 14](SOLUTION_STRUCTURE.md) · [`INPUT_DICTIONARY.md` Mục 3, 4](INPUT_DICTIONARY.md) · [`ASSUMPTIONS.md`](ASSUMPTIONS.md)

---

## Part C · Minimum viable version

**MVP phải kiểm chứng đúng một điều:** dữ liệu sai của người học có sinh ra được đề luyện đúng chỗ yếu hay không.

**Đường đi tối thiểu, không nhánh phụ:**

```text
Arena 1 (15 câu) → bảng tỷ lệ đúng 5 cụm → công bố cụm yếu nhất
    → sinh Trap I từ cụm đó → người học làm Trap I → tỷ lệ đúng cụm đó thay đổi
```

**Trong phạm vi MVP:** 5 Arena, ngân hàng 110 câu, tính lại điểm yếu sau mỗi Arena, Shop 2 vật phẩm, bảng chẩn đoán 2 tầng, bảng tổng kết O4, lưu tiến trình trên trình duyệt.

**Fallback nếu thiếu thời gian:** ngân hàng 75 câu chấp nhận lặp; điểm yếu chỉ tính một lần sau Arena 1; báo cáo chỉ ở tầng cụm; Shop còn 1 vật phẩm. **Không được cắt cơ chế Trap** — cắt Trap là sản phẩm mất lý do tồn tại.

**Ngoài phạm vi:** chủ đề khác ngoài Ethics · tài khoản/đăng nhập/đồng bộ · bảng xếp hạng · sinh câu hỏi bằng AI · giới hạn thời gian mỗi câu · cảnh báo lệ thuộc vật phẩm.

**Bằng chứng:** [`SOLUTION_STRUCTURE.md` Mục 6, 10](SOLUTION_STRUCTURE.md)

---

## Part D · Current progress evidence

### D1. Sample dự đoán được output trước khi chạy

Đây là bằng chứng chính của Part D. Từ **15 dòng input của Arena 1**, nhóm tính tay ra toàn bộ hành trình và bảng tổng kết cuối:

```text
15 dòng input → W1 = C2 → Trap I (7/10) → W2 = C3 → Trap II (9/10)
    → boss_clusters = [C1, C2, C3] → phân bổ 7/5/3 → bảng tổng kết
```

Kết quả dự đoán:

| Cụm | Mốc chẩn đoán | Boss | Δ | Nhãn |
|---|---|---|---:|---|
| C1 | 3/5 = 60,0% | 4/7 = 57,1% | −2,9 đ.pt | Cần cải thiện tiếp |
| C2 | 3/5 = 60,0% | 4/5 = 80,0% | +20,0 đ.pt | Đã cải thiện |
| C3 | 2/5 = 40,0% | 3/3 = 100,0% | +60,0 đ.pt | Đã cải thiện |
| C4 | 5/5 = 100,0% | không hỏi | — | Không kiểm tra lại ở Boss |
| C5 | 4/5 = 80,0% | không hỏi | — | Không kiểm tra lại ở Boss |

`performance_score` toàn lượt: 81/115 = 70,4%. Riêng Arena 1: 19/30, và con số 30 là **điểm kiểm tra tự động** — trần điểm Arena 1 luôn bằng 30 với mọi người chơi, nếu engine ra số khác thì lỗi ở khâu sinh đề.

**Bằng chứng:** [`SAMPLE_INPUT_OUTPUT.md` Mục 2–6](SAMPLE_INPUT_OUTPUT.md)

### D2. Kết quả này nghĩa là gì, và không nghĩa là gì

**Nghĩa là:** trong phiên này, C3 vào cửa ở 40% và đúng cả 3 câu ở Boss; C2 đi từ 60% lên 80%; C1 không được Trap nhắm và không đổi.

**Không nghĩa là:** người học đã nắm Standard III (C3 chỉ có 3 câu ở Boss — sai một câu là mất nhãn); Trap là nguyên nhân của mức tăng; kết quả lặp lại được ở phiên sau.

**Bằng chứng:** [`SAMPLE_INPUT_OUTPUT.md` Mục 7, 11](SAMPLE_INPUT_OUTPUT.md)

### D3. Hạng mục đã hoàn thành

| Hạng mục | Trạng thái | Bằng chứng |
|---|---|---|
| Ngân hàng 110 câu, đã validate cấu trúc | Xong | `data/ethics_bank_110.json` · commit `⟨hash⟩` |
| Đặc tả ba công thức và bốn output | Xong | `SOLUTION_STRUCTURE.md` Mục 5 |
| Claim boundary | Xong | `SOLUTION_STRUCTURE.md` Mục 14 |
| Từ điển input, 3 nhóm state variable | Xong | `INPUT_DICTIONARY.md` |
| 24 giả định có owner và cách kiểm chứng | Xong | `ASSUMPTIONS.md` |
| Sample tính tay + 16 test case | Xong | `SAMPLE_INPUT_OUTPUT.md` Mục 5, 6, 9 |
| Công cụ QA ngân hàng câu hỏi | ⟨đang làm / xong⟩ | `tools/validate.html` · commit `⟨hash⟩` |
| Engine JavaScript | Chưa bắt đầu | — |
| Giao diện | Chưa bắt đầu | — |
| Observation người dùng thật | **Chưa có** | `SOURCE_USE_MAP.md` Source 7 |

---

## Part E · Individual work output and next steps

**Nguyên tắc:** một dòng chỉ hợp lệ khi có đủ ba vế — sản phẩm cụ thể, file/commit truy được, và có người khác đang dùng nó. Chức danh không phải đóng góp.

| Người | Sản phẩm cụ thể | File | Ai đang dùng sản phẩm đó | Việc tiếp theo |
|---|---|---|---|---|
| **Quỳnh** | `SOLUTION_STRUCTURE.md` — ba công thức, bảng tổng kết O4, Mục 14 claim boundary; `ASSUMPTIONS.md` 24 mục; `SOURCE_USE_MAP.md`; README | `docs/` | Minh code theo Mục 5; Trang sinh đề theo Mục 4; Khôi hiển thị theo Mục 14 | Chốt open item B10 (cách xếp hạng Boss) trước Week 6 |
| **Hồng** | 110 câu hỏi kèm `distractor_reason` từng phương án sai, gắn nhãn `cluster`/`module`/`sub_standard`/`difficulty` | `data/ethics_bank_110.json`| Engine của Minh đọc trực tiếp; `validate.html` của Trang kiểm tra; `difficulty` là trọng số của O4 | Ghi ngày hoàn tất từng batch; rà lại phân bổ độ khó 4/4/3 mỗi module |
| **Trang** | Logic sinh Arena (lọc theo cụm, chia đều module, chống lặp câu); `validate.html` | `tools/validate.html`| Minh gọi khi chuyển Arena; Hồng dùng để QA bank trước khi merge | Bổ sung assert: cụm W1 tiêu thụ đúng 22 câu; `Σ difficulty` Arena 1 = 30 |
| **Minh** | Đặc tả ba bộ đếm và cách tính `accuracy_by_arena`, `baseline_accuracy`, `performance_by_arena` | `docs/SAMPLE_INPUT_OUTPUT.md` Mục 3, 6| Khôi lấy số để dựng bảng O4; Trang lấy `W1`/`W2` để sinh đề | Dựng khung engine; chạy 16 test case và điền cột Actual |
| **Khôi** | ⟨sản phẩm cụ thể — ví dụ: wireframe màn tổng kết O4, hoặc bảng rà chéo tên field giữa 4 file⟩ | Chưa có | Cả nhóm | Đưa ba câu chú thích ở Mục 14 lên màn hình, không để trong tooltip |

### Việc chung, hai tuần tới

| # | Việc | Người | Hạn |
|---|---|---|---|
| 1 | Dựng khung engine, chạy 16 test case ở `SAMPLE_INPUT_OUTPUT.md` Mục 9 | Trang, Minh | ⟨…⟩ |
| 2 | Check và fix bug ở khung engine | Khôi | ⟨…⟩ |
| 3 | Bắt đầu design UI | Khôi | ⟨…⟩ |
---

## Năm câu tự kiểm

| # | Câu hỏi | Trả lời ở đâu |
|---|---|---|
| 1 | Giải thích dự án trong một câu được không? | Part A, đoạn in đậm |
| 2 | Chỉ được input → logic → output không? | Part B, bảng ba công thức |
| 3 | Nói được assumption và limitation không? | Part B4 · `ASSUMPTIONS.md` · Part D2 |
| 4 | Chứng minh được tiến độ thật, không phải kế hoạch? | Part D1, D3 |
| 5 | Mỗi thành viên giải thích được một output đang được dùng không? | Part E, cột "Ai đang dùng sản phẩm đó" |
