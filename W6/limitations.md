# Limitations — CFA Quest v11

Tài liệu này cập nhật theo `cfa_quest_v11.js`, `cfa_quest_v11_bank.js` và bank 170 câu hiện tại. Mỗi limitation đều kèm impact để dùng trực tiếp trong README/midterm/final report.

## 1. Replay vẫn có thể làm lặp câu

Engine ưu tiên câu chưa xuất hiện trong lượt chơi bằng `usedIds`, nhưng khi pool câu mới không đủ, hệ thống chủ động lấy lại câu cũ và xáo thứ tự đáp án.

**Impact:** điểm ở lần sau có thể tăng một phần vì người chơi nhớ câu/nhớ logic đáp án, không chỉ vì hiểu Ethics tốt hơn. Vì vậy improvement trong cùng session có nguy cơ bị contamination bởi repeated exposure.

## 2. Bank mới lớn hơn nhưng vẫn hữu hạn

Bank hiện tại có **170 câu = 34 câu mỗi cluster**. Một clean run dùng 60 câu; riêng cluster bị Trap và Boss nhắm có thể tiêu thụ hơn 20 câu trong một lượt.

**Impact:** 34 câu/cluster đủ để giảm đáng kể repeat trong một clean run, nhưng nhiều lần fail/replay vẫn có thể làm cạn pool câu mới và kích hoạt reuse. Không nên mô tả bank là “không lặp”.

## 3. Replay không cập nhật diagnostic/performance theo cùng cách với pass/fail

`diagnosticRecords()` chỉ lấy **attempt === 1** và bỏ câu dùng item. `performance_by_arena` cũng chỉ dùng attempt đầu. Trong khi pass/fail và Credit của replay vẫn tính theo attempt hiện tại.

**Impact:** một người có thể trượt lần đầu, học từ feedback, rồi đỗ ở lần replay nhưng bảng diagnostic/performance vẫn giữ dữ liệu lần đầu. Điều này làm cho “kết quả đỗ Arena” và “bảng chẩn đoán” phản ánh hai tập dữ liệu khác nhau, cần giải thích rõ cho người dùng.

## 4. Mẫu đo theo cluster còn nhỏ

Baseline O4 của một cluster chỉ dùng Arena 1 + Crossroads, tức tối đa **5 câu/cluster** trước Boss. Boss chỉ hỏi 7/5/3 câu cho ba cluster yếu nhất.

**Impact:** chỉ một câu đúng/sai có thể làm tỷ lệ thay đổi lớn. Nhãn O4 nên được hiểu là tín hiệu trong lượt chơi, không phải ước lượng ổn định về năng lực Ethics.

## 5. Ngưỡng 70% là rule của project

`passPercent` được hard-code là **70%** cho mọi Arena.

**Impact:** 70% chỉ là ngưỡng gameplay của CFA Quest, không phải CFA Institute pass mark và cũng chưa được validate như mastery threshold. “Đỗ Arena” không đồng nghĩa “đã master” phần Ethics đó.

## 6. Nhãn O4 chỉ so sánh trong session, không chứng minh learning causality

Kết luận dùng baseline = Arena 1 + Crossroads và so với Boss. Logic hiện tại có ba nhãn chính: `Đã cải thiện`, `Đã cải thiện nhưng chưa đủ`, `Cần cải thiện tiếp`.

**Impact:** hệ thống chỉ cho thấy performance về sau khác performance ban đầu. Nó không chứng minh Trap **gây ra** sự cải thiện; thay đổi có thể đến từ độ khó item, may mắn, feedback, familiarity hoặc nhớ câu.

## 7. O4 không phải công cụ dự đoán CFA exam

Cụm C1–C5, cách rút câu, trọng số difficulty, threshold 70%, Credit và Boss split 7/5/3 đều là thiết kế của project.

**Impact:** score và nhãn của game không nên được trình bày như dự báo điểm CFA Level I, xác suất pass CFA, hay đánh giá professional competence.

## 8. Chưa có real-user validation đủ mạnh

Current v11 cho thấy logic phần mềm và demo flow, nhưng chưa có bằng chứng từ mẫu người học đủ lớn để kiểm định diagnostic validity hoặc learning effectiveness.

**Impact:** các claim như “game xác định đúng điểm yếu”, “Trap cải thiện kết quả học”, hay “gamification tăng engagement” vẫn cần user testing và dữ liệu thực nghiệm.

## 9. `item_type` có trong bank nhưng bị bỏ khỏi runtime model

Bank có `item_type` (`concept`/`vignette`), nhưng `normalizeQuestion()` của v11 không copy trường này vào object runtime. Draw rules cũng không cân bằng theo `item_type`.

**Impact:** app hiện không thể audit hoặc đảm bảo tỷ lệ concept/vignette của một Arena sau khi bank được nạp. Nếu hai loại câu có độ khó khác nhau, diagnostic có thể bị ảnh hưởng bởi mix câu ngẫu nhiên mà engine không theo dõi.

## 10. Difficulty là nhãn tác giả, chưa được psychometric calibration

Engine dùng difficulty 1/2/3 và cho điểm trọng số 1/2/3 trong `performance_score`.

**Impact:** weighted score phản ánh **intended difficulty** do nhóm gán, không phải item difficulty được ước lượng từ response data. Không nên diễn giải chênh lệch performance score như thước đo psychometric chính xác.

## 11. Cụm C1–C5 nén nhiều standard/module

C1, C2, C4 và C5 mỗi cụm chứa hai module; chỉ C3 có một module.

**Impact:** cùng một cluster score có thể che giấu hai kiểu điểm yếu khác nhau ở module/sub-standard bên trong. Cluster-level targeting phù hợp với MVP, nhưng không thay thế chẩn đoán chi tiết ở sub-standard level.

## 12. Tie-break có thể thay đổi W1/W2/Boss dù accuracy bằng nhau

Khi tỷ lệ đúng bằng nhau, engine lần lượt xét: độ khó trung bình của câu sai, thời gian trả lời trung bình, rồi thứ tự mã cluster.

**Impact:** với sample nhỏ, một cluster có thể bị nhắm do tie-break thay vì do khác biệt accuracy rõ ràng. Đặc biệt `timeMs` có thể bị ảnh hưởng bởi việc người chơi bị gián đoạn chứ không phải vì câu khó hơn.

## 13. Seed 7 chưa đủ để tái tạo toàn bộ demo nếu không cố định `runNo`

`CFAQ.setSeed(7)` chỉ thay RNG. Arena 1 lại lấy câu cố định theo bank và dùng parity của `runNo` để chọn module “nặng”.

**Impact:** hai máy cùng chạy Seed 7 nhưng có `runNo` khác nhau có thể nhận Arena 1 khác nhau, kéo theo W1/W2 và toàn bộ đường demo khác. Demo reproducible phải reset run counter hoặc ghi rõ run number.

## 14. Arena 1 phụ thuộc thứ tự vật lý của bank

Trong `buildArena1()`, câu phù hợp đầu tiên trong bank được lấy trực tiếp thay vì shuffle.

**Impact:** nếu bank được reorder hoặc chèn câu mới lên trước, Arena 1 có thể thay đổi dù seed không đổi. Điều này làm test/demo dựa trên ID dễ vỡ khi bank được cập nhật.

## 15. Feedback trong cùng session có thể làm tăng điểm Boss

v11 hiện để `showFeedbackImmediately = false`, nhưng sau mỗi Arena người chơi vẫn xem explanation của các câu sai trước khi đi tiếp.

**Impact:** Boss performance có thể phản ánh short-term recall từ feedback trong cùng session. Hệ thống chưa tách được “học bền vững” khỏi “nhớ vừa đọc explanation”. Delayed post-test sẽ cần thiết nếu muốn claim learning.

## 16. Vật phẩm làm các thước đo dùng mẫu khác nhau

Câu dùng Bùa Loại Trừ vẫn tính vào pass/fail, nhưng bị loại khỏi diagnostic numerator/denominator và không được cộng điểm earned trong performance score dù vẫn nằm trong denominator.

**Impact:** một Arena có thể đỗ nhờ câu dùng item nhưng diagnostic/performance lại không phản ánh câu đó theo cùng cách. Đây là chủ ý gameplay nhưng cần giải thích để tránh người dùng nghĩ mọi score đều dùng cùng một mẫu.

## 17. Content validator hiện chỉ kiểm tra cấu trúc cơ bản

`validateBank()` kiểm tra ID, cluster/module, 3 options, answer index, difficulty và stem; nó không tự phát hiện mâu thuẫn semantic giữa answer, explanation và distractor reason.

**Impact:** bank có thể “valid” về kỹ thuật nhưng vẫn chứa content bug. Human QA vẫn bắt buộc.

## 18. Không phải cluster nào cũng được kiểm tra lại ở Boss

Boss chỉ lấy ba cluster yếu nhất. Hai cluster còn lại nhận nhãn `Không kiểm tra lại ở Boss`.

**Impact:** hệ thống không thể đưa kết luận improvement cho mọi cluster trong một run. “Không kiểm tra lại” phải được giữ như missing evidence, không được diễn giải thành không cải thiện hoặc đã ổn.

## Interpretation boundary

Cách claim an toàn nhất cho v11 là:

> **CFA Quest là một game luyện CFA Level I Ethics có cơ chế chẩn đoán và adaptive practice trong phạm vi một lượt chơi. Các score và nhãn O4 mô tả performance theo rule của project trong session đó; chúng không chứng minh mastery, causal learning hoặc kết quả CFA exam.**
