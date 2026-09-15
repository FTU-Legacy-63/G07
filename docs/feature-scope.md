# FEATURE SCOPE — CFA QUEST · ETHICS

**Học phần:** NHA408E · **Nhóm:** 7
**Nguồn:** `SOLUTION_STRUCTURE.md` Mục 3 (core process), Mục 5 (ba chỉ số), Mục 7 (đường phụ), Mục 8 (Credit, Shop), Mục 10 (Target Scope, Fallback Scope, Out of Scope).

File này là nguồn duy nhất cho phạm vi tính năng. `WEEK5_CHECKPOINT.md` trỏ sang đây, không chép lại.

---

## 1. Main feature

**Sinh Arena từ dữ liệu sai của người học.** Mục 3 gọi tên core process này là *Diagnostic-Driven Practice Generation*:

```text
Diagnose → Rank Weakness → Filter Question Bank → Generate Targeted Arena → Re-Diagnose → Verify
```

Trên sản phẩm: Arena 1 (15 câu cố định) → xác định W1 → Trap I 10 câu của W1 → Crossroads 10 câu (2 câu/cụm) → xác định W2 → Trap II 10 câu của W2 → Boss 15 câu từ 3 cụm yếu nhất chia 7/5/3 → bảng tổng kết.

### Phép thử của đề bài

> Nếu bỏ feature này, core user task còn hoàn thành được không?

Mục 3 đã trả lời sẵn: bộ đề trắc nghiệm thường trả lời *"tôi được bao nhiêu điểm"*; sản phẩm này trả lời *"lần sau tôi nên luyện gì"* và tự sinh luôn đề đó. Bỏ cơ chế sinh đề thì không còn gì phân biệt sản phẩm với một bộ đề có chấm điểm.

Mục 3 cũng chốt một điều dễ bị hiểu ngược: **chấm điểm không phải core process.** Điểm số chỉ tồn tại để quyết định đỗ/trượt và cấp Credit.

---

## 2. Supporting features

Không tạo ra giá trị mới, nhưng thiếu thì main feature khó dùng hoặc khó tin.

| Supporting feature | Làm main feature dễ dùng hoặc dễ hiểu ở chỗ nào | Nguồn |
|---|---|---|
| Bảng chẩn đoán 2 tầng: 5 cụm + 9 module | Tầng cụm trả lời "yếu mảng nào", tầng module trả lời "yếu Standard nào" — người học cần tầng module mới biết mở sách ở đâu | Mục 2, Mục 6 |
| Công bố cụm bị nhắm trước Arena kế tiếp | Cho người học thấy đề sau sinh ra từ bài làm của chính họ, không phải đề soạn sẵn | Mục 7 |
| Lời giải từng câu sai + lý do gây nhiễu từng phương án | Biến câu sai thành nội dung học được. Ngân hàng đã có sẵn field `explanation` và `distractor_reason` cho cả 3 phương án | Mục 1, Mục 2 |
| Bảng tổng kết sau Boss | Chỗ duy nhất đối chiếu được mốc chẩn đoán với Boss theo từng cụm | Mục 5 |
| `performance_score` toàn lượt | Phân biệt hai người cùng `arena_score_correct` nhưng làm đúng ở mức khó khác nhau | Mục 5 |
| Đỗ/trượt và Credit | Tạo nhịp cho hầm ngục và cấp tiền cho Shop | Mục 8 |
| Lưu tiến trình trên trình duyệt | Không tài khoản, không backend, nên đây là cách duy nhất giữ lượt chơi | Mục 10, Mục 11 |

### Một điểm phải nói rõ khi bảo vệ

`performance_score` là supporting, **không phải** core. Mục 5 ghi thẳng: nó không quyết định W1, không quyết định W2, không quyết định cụm nào vào Boss, không quyết định đỗ/trượt, không cấp Credit. Nó nằm ngoài chuỗi `Diagnose → Rank Weakness → Filter → Generate`.

---

## 3. Optional features

| Optional feature | Vì sao xếp optional |
|---|---|
| Shop | Mục 7 đã kiểm chứng sẵn: không mua vật phẩm nào thì hành trình vẫn hoàn chỉnh |
| Vật phẩm thứ hai — Cuộn Giấy Gợi Ý | Fallback Scope ở Mục 10 rút Shop còn 1 vật phẩm |
| Bảng chi tiết tầng 9 module | Fallback Scope bỏ bảng này, chỉ báo cáo ở tầng cụm |
| Tính lại điểm yếu sau **mỗi** Arena | Fallback Scope chỉ tính một lần sau Arena 1 rồi khoá cứng cả hầm ngục |

---

## 4. Ranh giới Core / Optional

Ranh giới này không do Week 5 nghĩ ra. Mục 10 đã chia sẵn Target Scope và Fallback Scope, và câu quyết định nằm ở cuối phần Fallback:

> Fallback không được biến thành một bộ đề trắc nghiệm có chấm điểm. Nếu cơ chế Trap bị cắt, sản phẩm mất toàn bộ lý do tồn tại.

**Phép thử:** cái gì còn lại trong Fallback Scope là core. Cái gì bị rút đi mà sản phẩm vẫn sống là optional.

| Core — phải chạy trước bản final | Optional — thêm sau, không được làm core flow mất ổn định |
|---|---|
| Chuỗi 5 Arena theo đúng thứ tự | Shop và vật phẩm |
| Chấm bài, cộng dồn tỷ lệ đúng theo cụm | Vật phẩm thứ hai |
| Xếp hạng cụm yếu, chọn W1 và W2 (W2 bắt buộc khác W1) | Bảng chi tiết tầng 9 module |
| Lọc ngân hàng theo cụm, sinh đề Arena kế tiếp | Tính lại điểm yếu sau mỗi Arena |
| Cổng đỗ/trượt 70% | |
| Bảng tổng kết sau Boss | |
| Lời giải câu sai | |

---

## 5. Quyết định phạm vi cho Week 5 và Week 6

 Week 5 và Week 6 không thêm feature mới, không thêm màn hình mới, không mở rộng Shop.

---

## 6. Out of Scope

Nguồn: Mục 10. Ghi lại ở đây để phân biệt với optional — optional là "để sau", out of scope là "không làm".

- Các chủ đề khác ngoài Ethics
- Hệ thống tài khoản, đăng nhập, đồng bộ thiết bị
- Bảng xếp hạng, chế độ nhiều người chơi
- Trợ lý hỏi đáp, sinh câu hỏi bằng AI
- Giới hạn thời gian mỗi câu — thời gian vẫn được đo để phân định cụm yếu, nhưng không đếm ngược và không trừ điểm
- Cảnh báo lệ thuộc vật phẩm

---

## 7. Ownership theo feature

Xem phân công chi tiết tại [WEEK5_CHECKPOINT Mục 10](WEEK5_CHECKPOINT.md#10-ownership-v%C3%A0-integration-evidence).

