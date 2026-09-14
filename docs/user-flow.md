# USER FLOW — CFA QUEST · ETHICS

**Học phần:** NHA408E · **Nhóm:** 7
**Nguồn:** `SOLUTION_STRUCTURE.md` Mục 4 (số câu từng Arena), Mục 5 (cơ chế chẩn đoán), Mục 7 (đường chính, đường phụ, đường lỗi), Mục 8 (ngưỡng đỗ, Credit, luật vật phẩm).

File này là nguồn duy nhất cho user flow. `WEEK5_CHECKPOINT.md` trỏ sang đây, không chép lại.

---

## 1. Điểm vào và điểm ra

- **Điểm bắt đầu:** vào chủ đề Ethics. Một điểm vào duy nhất, không có menu chọn nội dung muốn luyện.
- **Điểm kết thúc:** bảng tổng kết sau Boss.
- **Một lượt chơi sạch, không trượt lần nào:** 60 câu — 15 + 10 + 10 + 10 + 15.

Lý do không có menu chọn nội dung, ghi ở Mục 0 tài liệu gốc: người học không tự chọn mình luyện gì, dữ liệu sai của họ chọn hộ. Thêm bước chọn là phá đúng cơ chế lõi của sản phẩm.

---

## 2. Happy path

Kịch bản: người học đi hết 5 Arena, không trượt lần nào.

| Step | User action | System response | Evidence |
|---|---|---|---|
| 1 | Vào chủ đề Ethics | Mở Arena 1 — 15 câu cố định, 3 câu × 5 cụm, rải hết 9 module, đủ 3 mức khó | Mục 4 |
| 2 | Trả lời 15 câu, không hiện đúng/sai ngay | Ghi đáp án, thời gian trả lời, trạng thái dùng vật phẩm của từng câu | Mục 1, Mục 7 |
| 3 | Hết Arena 1 | Hiện % tổng · đỗ/trượt (≥ 70%, tức ≥ 11/15) · Credit được cấp · bảng chẩn đoán 5 cụm và 9 module · lời giải các câu sai | Mục 7, Mục 8 |
| 4 | Đọc bảng chẩn đoán | Hệ thống công bố W1 — cụm sẽ bị nhắm ở Arena sau | Mục 5, Mục 7 |
| 5 | *(tuỳ chọn)* Vào Shop | Trừ Credit, vật phẩm vào kho | Mục 8 |
| 6 | Vào Arena 2 — Trap I | 10 câu của cụm W1, chia đều cho các module trong cụm (5/5 hoặc 4/3/3) | Mục 4, Mục 2 |
| 7 | Hết Trap I | Hiện `arena_score_correct` của chặng; tỷ lệ đúng cộng dồn của W1 thay đổi trên bảng | Mục 5 |
| 8 | Vào Arena 3 — Crossroads | 10 câu, 2 câu × 5 cụm | Mục 4 |
| 9 | Hết Crossroads | Tính lại xếp hạng, công bố W2 — bắt buộc khác W1 | Mục 5 |
| 10 | Vào Arena 4 — Trap II | 10 câu của cụm W2 | Mục 4 |
| 11 | Hết Trap II | Xếp hạng lại cả 5 cụm bằng `accuracy_cumulative` | Mục 5 |
| 12 | Vào Arena 5 — Boss | 15 câu từ 3 cụm yếu nhất, chia 7/5/3 theo thứ tự yếu dần; Boss không loại trừ cụm nào | Mục 4, Mục 5 |
| 13 | Vượt Boss (≥ 70%) | Thưởng +5 Credit cho lần vượt đầu tiên; mở bảng tổng kết | Mục 8 |
| 14 | Đọc bảng tổng kết | Từng cụm × từng Arena, cột kết luận theo 4 điều kiện, kèm `performance_score` toàn lượt hiển thị một lần duy nhất tại đây | Mục 5 |

Hai quy tắc bắt buộc của Mục 5 mà flow này phải giữ:

- **Trap II phải nhắm cụm khác Trap I.** Nếu không, người yếu nặng một cụm bị 20 câu liên tiếp cùng cụm ở hai Arena kề nhau, ngân hàng cụm đó phải lớn gấp đôi, còn lỗ hổng thứ hai bị bỏ trống.
- **Boss không loại trừ cụm nào.** Nếu hai Trap có tác dụng thật, W1 và W2 sẽ tự rơi khỏi vị trí yếu nhất — đó chính là bằng chứng cơ chế hoạt động.

---

## 3. Alternative path

Nguồn: Mục 7, Đường phụ. Đúng bốn nhánh tài liệu đã quy định.

| # | Kịch bản | Hệ thống xử lý |
|---|---|---|
| A1 | Trượt một Arena (< 70%) | Vẫn hiện kết quả và lời giải. Không cấp Credit. Khoá Arena kế tiếp. Cho chơi lại với bộ câu rút mới, không giới hạn số lần |
| A2 | Không mua vật phẩm nào suốt lượt | Hành trình vẫn hoàn chỉnh — đây là phép kiểm chứng Shop nằm ngoài logic path chính |
| A3 | Đúng toàn bộ Arena 1 | Không tồn tại cụm yếu nhất theo tỷ lệ đúng, chuyển sang phân định bằng thời gian trả lời |
| A4 | Dùng vật phẩm thứ hai trong cùng một Arena | Chặn, hiện bảng "Mỗi Arena sử dụng tối đa 1 vật phẩm" |

### Hai hệ quả của A1 mà giao diện phải thể hiện

Nguồn: Mục 5, phần "Đọc theo lượt nào khi người chơi trượt và chơi lại".

1. Mốc chẩn đoán và `performance_score` ghi theo **lượt làm đầu tiên**; điểm số và Credit ghi theo **lượt đỗ**. Lượt đầu là lần duy nhất người học chưa đọc lời giải của bộ câu đó. Ghi theo lượt đỗ thì người trượt hai lần rồi làm lại bộ câu đã biết đáp án sẽ có chỉ số cao hơn người qua ngay lần đầu.
2. Nếu trong lượt chơi có ít nhất một lần trượt, bảng tổng kết phải có thêm một dòng chú thích nói rõ điều này.

### Phân định khi hai cụm bằng tỷ lệ đúng

Nguồn: Mục 5, công thức (1). Chạy theo đúng thứ tự, không được dùng ngẫu nhiên:

1. Độ khó trung bình của câu làm sai cao hơn
2. Thời gian trả lời trung bình dài hơn
3. Thứ tự mã cụm

Ở Arena 1 mỗi cụm chỉ có 3 câu, nên 5 cụm chỉ có 4 giá trị điểm khả dĩ (0–3). Bằng nhau là chuyện thường xuyên, không phải trường hợp hiếm — chuỗi phân định này phải luôn chạy.

---

## 4. Error path

Nguồn: Mục 7, Đường lỗi. Bảy tình huống, giữ nguyên.

| # | Tình huống | Xử lý |
|---|---|---|
| E1 | Xác nhận khi chưa chọn phương án | Chặn chuyển câu |
| E2 | Mua vật phẩm khi không đủ Credit | Vô hiệu hoá nút, báo còn thiếu bao nhiêu Credit |
| E3 | Dùng vật phẩm thứ hai trên cùng một câu | Chặn — mỗi câu tối đa 1 vật phẩm |
| E4 | Ngân hàng hết câu cho một cụm | Lấy bù câu cũ, xáo lại thứ tự phương án, báo cho người học |
| E5 | Một module trong cụm không đủ câu để chia đều | Bù bằng module khác cùng cụm, ghi log để nhóm bổ sung ngân hàng |
| E6 | Thoát giữa Arena | Huỷ lượt, không lưu dở dang |
| E7 | Mất dữ liệu trình duyệt | Khởi tạo tiến trình rỗng, báo bắt đầu lại |

Cách xử lý chia làm hai nhóm:

- **E1, E2, E3 — chặn thao tác.** Phải nói rõ **vì sao** bị chặn, không chỉ làm mờ nút. Người học cần biết luật, không cần đoán luật.
- **E4, E5 — hệ thống tự xử lý.** Vẫn phải báo cho người học, vì việc lấy bù câu ảnh hưởng đến cách đọc kết quả chẩn đoán của cụm đó.

---

## 5. Ba luật dùng vật phẩm chi phối toàn bộ flow

Nguồn: Mục 8, "Luật dùng vật phẩm".

| # | Luật | Lý do |
|---|---|---|
| 1 | Arena 1 không dùng vật phẩm | Đây là bài chẩn đoán gốc, toàn bộ dữ liệu về sau bắt nguồn từ 15 câu này |
| 2 | Boss không dùng vật phẩm | Boss là chặng đo quyết định của bảng tổng kết |
| 3 | Mỗi Arena tối đa 1 vật phẩm | Chặn việc dồn nhiều vật phẩm vào cùng một cụm, làm rỗng mẫu chẩn đoán của cụm đó |

Ba luật này thay cho một ngưỡng tối thiểu số câu sạch: chúng bảo đảm mọi mốc chẩn đoán đều còn đủ dữ liệu không dùng vật phẩm, và dễ giải thích hơn một ngưỡng.
