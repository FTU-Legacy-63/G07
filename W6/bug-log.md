# Bug log — CFA Quest Ethics (Nhóm 7)

Nơi ghi mọi lỗi của sản phẩm: code demo, ngân hàng câu hỏi, tài liệu. Mỗi lỗi một dòng, không gộp hai lỗi khác nhau vào cùng một dòng.

## 1. Cách ghi

**Mức độ**

| Mức | Khi nào dùng |
|---|---|
| Critical | Chặn luồng chơi chính, hoặc làm sai kết quả chẩn đoán (W1, W2, cụm vào Boss, bảng tổng kết O4) |
| Major | Lệch SOLUTION_STRUCTURE nhưng luồng vẫn chạy và không làm sai kết quả chẩn đoán |
| Minor | Thông báo, hiển thị, hoặc điểm không nhất quán giữa các file |

**Trạng thái**

| Trạng thái | Nghĩa |
|---|---|
| Mới | Vừa ghi, chưa có người sửa |
| Đang sửa | Đã có người nhận sửa |
| Đã sửa – chờ xác nhận | Người sửa đã commit, ghi kèm mã commit |
| Đã xác nhận | Người xác nhận đã chạy lại trên bản hiện tại, kết quả khớp Expected. Ghi kèm ngày |
| Ghi thành limitation | Không sửa trong phạm vi môn học, đã ghi vào `limitations.md` |

**Quy tắc**

1. Người sửa không tự đóng bug. Người xác nhận phải là người khác, chạy lại trên giao diện.
2. Expected lấy từ SOLUTION_STRUCTURE, ghi rõ mục. Không lấy Expected từ code.
3. Trước checkpoint, không còn lỗi Critical nào ở trạng thái Mới hoặc Đang sửa.

---

## 2. Bug log 

**Nguồn phát hiện:** file đối chiếu `docs/Doi_chieu_demo_voi_Solution_Structure.xlsx`. Cột "Test liên quan" ghi số dòng trong file đó (ĐC-01 là dòng nội dung đầu tiên, ĐC-25 là dòng cuối). Một dòng đối chiếu có thể chứa nhiều lỗi và ngược lại, nên 25 dòng đối chiếu tách thành 23 bug.

**Bản bị lỗi:** v10, commit `8de3b36` (14/09/2026). File `src/app.js` trong commit này chính là `cfa_dungeon_ui_v10_skipfix_updated.js`. Số dòng ở cột Vị trí tính theo file này. File viết dồn nhiều hàm trên một dòng, nên tìm theo tên hàm (Ctrl+F).

**Cách mở lại v10 để tái hiện:** tải `src/index.html`, `src/app.js`, `src/style.css`, `src/ethics_bank_110.json` tại commit `8de3b36`. Đổi tên `app.js` thành `cfa_dungeon_ui_v10_skipfix_updated.js` và `style.css` thành `cfa_dungeon_ui_v10_skipfix_updated.css`, vì `index.html` gọi hai file theo tên cũ. Mở `index.html`.

**Bản sửa:** v11, commit `1c3ba4b` (15/09/2026). v11 là bản viết lại toàn bộ logic theo SOLUTION_STRUCTURE, không phải sửa từng lỗi trên v10, nên các bug dùng chung một mã commit.

| Mã bug | Người báo | Mô tả | Vị trí (v10) | Bước tái hiện (trên v10) | Expected | Actual (v10) | Mức độ | Người sửa | Trạng thái | Người xác nhận |
|---|---|---|---|---|---|---|---|---|---|---|
| BUG-V10-01 | Quỳnh | Dùng vật phẩm làm người chơi kẹt ở câu hiện tại | `app.js` 164 `answer()`, 172 `useItem()` | Mua "Gợi ý" → vào Trap I → dùng "Gợi ý" → chọn đáp án | Câu dùng vật phẩm vẫn trả lời được và tính vào `arena_score_correct` (Mục 8) | `answer()` thấy nút bị vô hiệu hoá nên thoát, không ghi đáp án, không hiện "Câu tiếp". "Bỏ qua" cũng kẹt. "Retry" chỉ hiện thông báo | Critical | Quỳnh | Đã sửa | Minh |
| BUG-V10-02 | Quỳnh | Câu dùng vật phẩm không được đánh dấu và vẫn tính vào tỷ lệ chẩn đoán | `app.js` 164 `answer()`, 170 `rankClusters()`, 172 `useItem()` | Dùng "Gợi ý" ở một câu rồi trả lời → xem `S.history` và thứ hạng cụm | Mỗi câu lưu trạng thái dùng vật phẩm. Câu dùng vật phẩm bị loại khỏi cả tử và mẫu của `accuracy_cumulative` (Mục 1, Mục 5 công thức 1, Mục 8) | Bản ghi `history` không có trường vật phẩm, không có độ khó. `rankClusters()` đếm mọi câu `answered = true`, kể cả câu dùng "Gợi ý" | Critical | Quỳnh | Đã sửa | Minh |
| BUG-V10-03 | Quỳnh | W2 chỉ tính trên Crossroads, không cộng dồn | `app.js` 166 `finishStage()`, 169 `rankCrossroads()` | Chơi đến hết Crossroads → so W2 với tỷ lệ cộng dồn tính tay | W2 là cụm yếu nhất theo tỷ lệ cộng dồn Arena 1 + Trap I + Crossroads, khác W1 (Mục 4, Mục 5) | W2 xếp hạng trên 2 câu Crossroads của mỗi cụm, bỏ dữ liệu Arena 1 và Trap I | Critical | Quỳnh | Đã sửa | Trang |
| BUG-V10-04 | ĐC-01, ĐC-09, ĐC-10 | Quỳnh | Phân định khi hoà chỉ theo mã cụm, vì không lưu độ khó và thời gian | `app.js` 162 `renderQuestion()`, 164 `answer()`, 166 `finishStage()`, 168–170 ba hàm xếp hạng | Làm đúng cả 15 câu Arena 1 → xem W1 | Hoà thì xét lần lượt: độ khó TB câu sai cao hơn → thời gian trả lời TB dài hơn → mã cụm. Đúng hết Arena 1 thì phân định theo thời gian (Mục 1, Mục 5, Mục 7 đường phụ) | Không đo thời gian, không lưu độ khó. Ba hàm xếp hạng chỉ so tỷ lệ đúng. Đúng hết Arena 1 thì W1 luôn là C1 | Critical | Quỳnh | Đã sửa | Trang |
| BUG-V10-05 | Quỳnh | Arena sau bốc lại câu đã hỏi ở Arena trước | `app.js` 128 `pickWhere()`, 157–160 | Chơi hết một lượt → so mã câu giữa các Arena | Một lượt chơi không lặp câu khi ngân hàng còn câu mới (Mục 7 đường lỗi, Mục 9) | `pickWhere()` luôn lấy câu đầu tiên theo thứ tự ngân hàng. ETH-C1-GIPS-001 và 002 xuất hiện ở Arena 1, Crossroads, Boss (và Trap I nếu W1 = C1) | Critical | Quỳnh | Đã sửa | Trang |
| BUG-V10-06 | Quỳnh | Bảng tổng kết sau Boss không theo Bảng A | `app.js` 176 `report()` | Chơi hết Boss → mở bảng tổng kết | Bảng cụm × Arena dạng đúng/đã hỏi, ô "--" cho Arena không hỏi cụm, mốc chẩn đoán = Arena 1 + Crossroads, kết luận theo 4 điều kiện chạy tuần tự (Mục 5) | Chỉ có tỷ lệ theo Arena (không chia cụm) và thẻ cụm với tỷ lệ cộng dồn. Kết luận chỉ có "Cần ôn tập" / "Đạt ngưỡng chẩn đoán" theo 70% | Critical | Quỳnh | Đã sửa | Khôi |
| BUG-V10-07 | Quỳnh | Không kiểm tra ngưỡng đỗ, không có chơi lại | `app.js` 166 `finishStage()`, 167 `advance()` | Làm sai 5/10 câu Trap I | Mọi Arena cần ≥ 70%. Trượt: hiện kết quả, không cấp Credit, khoá Arena kế tiếp, cho chơi lại với bộ câu rút mới (Mục 7, Mục 8) | Arena 1, Crossroads, Trap II không kiểm tra ngưỡng. Trap I dưới 70% vẫn sang Crossroads. Không có nút chơi lại | Major | Quỳnh | Đã sửa | Minh |
| BUG-V10-08 | Quỳnh | Không cộng Credit sau Arena | `app.js` 5 `CONFIG`, 166 `finishStage()` | Làm đúng 15/15 Arena 1 → xem Credit | < 70%: 0; 70–79%: 2; 80–89%: 3; ≥ 90%: 4; vượt Boss lần đầu +5 Credit (Mục 8) | Credit vẫn là 3. `S.credits` chỉ giảm khi mua. Thưởng Boss +5 cộng vào `S.score` | Major | Quỳnh | Đã sửa | Minh |
| BUG-V10-09 | Quỳnh | Không tách lượt đầu và lượt đỗ khi chơi lại | `app.js` 166 `finishStage()` | Xem `S.stageResults` sau khi làm một Arena hai lần | Mốc chẩn đoán và `performance_score` ghi theo lượt đầu; điểm và Credit ghi theo lượt đỗ; có chú thích nếu từng trượt (Mục 5) | `stageResults` ghi đè theo tên Arena, không lưu số lượt | Major | Quỳnh | Đã sửa | Minh |
| BUG-V10-10 | Quỳnh | Shop có vật phẩm khác spec, có vật phẩm loại 2 phương án | `app.js` 5 `CONFIG.itemCost`, 14–18 `ITEM_DEFS`, 172 `useItem()`, 174 `renderShop()` | Mở Vật phẩm | Vật phẩm chỉ loại tối đa 1 phương án sai, vì đề có 3 phương án (Mục 8) | 3 vật phẩm "Gợi ý" (loại 2 phương án sai), "Bỏ qua", "Retry", cùng giá 3 | Major | Quỳnh | Đã sửa | Minh |
| BUG-V10-11 | Quỳnh | Crossroads bị khoá vật phẩm | `app.js` 158 `crossroads()` | Có vật phẩm → vào Crossroads | Chỉ Arena 1 và Boss cấm vật phẩm (Mục 8 luật dùng vật phẩm) | `allowItems = false` ở Crossroads | Major | Quỳnh | Đã sửa | Khôi |
| BUG-V10-12 | Quỳnh | Không giới hạn số vật phẩm mỗi Arena và mỗi câu | `app.js` 21 `fresh()`, 172 `useItem()` | Mua 2 vật phẩm → dùng cả hai trong Trap I | Mỗi Arena tối đa 1 vật phẩm, mỗi câu tối đa 1; vượt thì chặn và báo (Mục 7, Mục 8) | Không có kiểm tra. Biến `usedItems` khai báo nhưng không dùng | Major | Quỳnh | Đã sửa | Khôi |
| BUG-V10-13 | Quỳnh | `performance_score` không có trọng số độ khó | `app.js` 176 `report()` | Chơi hết lượt → so performance score với tính tay | Σ điểm độ khó câu đúng không dùng vật phẩm ÷ Σ điểm độ khó mọi câu đã hỏi; lưu `performance_by_arena`; Arena 1 luôn có points_offered = 30 (Mục 5 công thức 3) | Hiện số câu đúng ÷ số câu đã trả lời. Không trọng số, không loại câu dùng vật phẩm ở tử số, câu "Bỏ qua" bị loại khỏi mẫu | Major | Quỳnh | Đã sửa | Minh |
| BUG-V10-14 | Quỳnh | Arena 1 không rải câu qua đủ module của cụm | `app.js` 138–156 `arena1()` | Bắt đầu Arena 1 → xem module của 3 câu mỗi cụm | 3 câu mỗi cụm rải hết module (cụm 2 module chia 2 + 1, câu dư luân phiên giữa hai lần chơi), đủ 3 mức khó (Mục 2, Mục 4) | Chỉ lấy câu đầu tiên theo mức khó. C2 lấy cả 3 câu S1, C4 cả 3 câu S4, C5 cả 3 câu S6. Không luân phiên | Major | Quỳnh | Đã sửa | Trang |
| BUG-V10-15 | Quỳnh | Trap không chia đều câu cho các module | `app.js` 128 `pickWhere()`, 157 `trap1()`, 159 `trap2()` | Vào Trap I → đếm câu theo module | 10 câu chia đều cho các module trong cụm, ví dụ 5/5 (Mục 2 quy tắc 2, Mục 4) | Lấy 10 câu đầu của cụm: C1 8 GIPS / 2 CODE; C2 10 S1 / 0 S2; C4 8 S4 / 2 S5; C5 10 S6 / 0 S7 | Major | Quỳnh | Đã sửa | Trang |
| BUG-V10-16 | Quỳnh | Boss chia 5/5/5 thay vì 7/5/3 | `app.js` 160 `boss()` | Vào Boss → đếm câu theo cụm | 15 câu cho 3 cụm yếu nhất, 7/5/3 theo thứ tự yếu dần (Mục 4) | Mỗi cụm 5 câu | Major | Quỳnh | Đã sửa | Trang |
| BUG-V10-17 | Quỳnh | Arena 1 hiện đúng/sai ngay sau từng câu | `app.js` 164 `answer()` | Trả lời một câu Arena 1 | Arena 1 không hiện đúng/sai ngay (Mục 7 đường chính) | Tô đúng/sai và hiện lời giải ngay ở mọi Arena, kể cả Arena 1 | Major | Quỳnh | Đã sửa | Khôi |
| BUG-V10-18 | Quỳnh | Không có màn kết quả sau Arena; Shop chỉ vào được từ dashboard | `app.js` 166 `finishStage()`, 167 `advance()` | Làm xong Arena 1 | Sau mỗi Arena hiện % tổng, đỗ/trượt, Credit, bảng chẩn đoán, giải thích câu sai, cụm bị nhắm ở Arena sau, rồi tuỳ chọn vào Shop (Mục 7 đường chính) | `advance()` mở luôn Arena kế tiếp. Trap I và Boss chỉ có thông báo ngắn. Thực tế chỉ mua được vật phẩm trước Arena 1 | Major | Quỳnh | Đã sửa | Hồng |
| BUG-V10-19 | Quỳnh | Thoát giữa Arena vẫn lưu câu đã làm, khi làm lại bị đếm trùng | `app.js` 164 `answer()`, 170 `rankClusters()`, 179 khởi động | Làm 3 câu Trap I → tải lại trang → làm lại Trap I → xem số câu đã hỏi của cụm | Thoát giữa Arena thì huỷ lượt, không lưu dở dang (Mục 7 đường lỗi) | `history` giữ các câu làm dở, câu mới cộng thêm, `rankClusters()` đếm trùng | Major | Quỳnh | Đã sửa | Khôi |
| BUG-V10-20 | Quỳnh | Không có bảng 9 module và biểu đồ tiến bộ | `app.js` 45 `norm()`, 176 `report()` | Xem dashboard và bảng tổng kết | Bảng chẩn đoán 2 tầng 5 cụm / 9 module; biểu đồ tỷ lệ đúng của cụm thay đổi sau Trap (Mục 1, Mục 6, Mục 10) | Không có bảng module ở màn nào (có đọc module nhưng không dùng). Không có biểu đồ | Major | Quỳnh | Đã sửa | Hồng |
| BUG-V10-21 | Quỳnh | Không xử lý khi ngân hàng hết câu hoặc module thiếu câu | `app.js` 161 `openQuiz()` | Nạp một ngân hàng có một cụm dưới 10 câu → vào Trap của cụm đó | Hết câu mới: lấy bù câu cũ, xáo thứ tự phương án, báo người học. Module thiếu: bù module khác cùng cụm, ghi log (Mục 7 đường lỗi) | Chỉ báo "BANK không đủ câu" rồi dừng. Không xáo phương án | Major | Quỳnh | Đã sửa | Hồng |
| BUG-V10-22 | Quỳnh | Không có bước Xác nhận, bấm phương án là nộp luôn | `app.js` 162 `renderQuestion()`, 164 `answer()` | Bấm vào một phương án | Chọn phương án rồi bấm Xác nhận; chặn chuyển câu khi chưa chọn (Mục 1, Mục 7 đường lỗi) | Bấm phương án là nộp ngay. Phần chặn chuyển câu thì khớp | Minor | Quỳnh | Đã sửa | Khôi |
| BUG-V10-23 | Quỳnh | Không báo còn thiếu bao nhiêu Credit | `app.js` 174 `renderShop()` | Tiêu hết Credit → mở Vật phẩm | Vô hiệu hoá nút Mua và báo còn thiếu bao nhiêu (Mục 7 đường lỗi) | Nút Mua bị vô hiệu hoá nhưng không có thông báo | Minor | Quỳnh | Đã sửa | Khôi |

---
