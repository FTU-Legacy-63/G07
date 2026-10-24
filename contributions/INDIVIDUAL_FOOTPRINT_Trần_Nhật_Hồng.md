# INDIVIDUAL FOOTPRINT

**TRẦN NHẬT HỒNG | CFA Quest — Ethics**

- **Họ và tên:** Trần Nhật Hồng
- **Nhóm:** Nhóm 7
- **Dự án:** CFA Quest — Ethics
- **Học phần:** NHA408E — Technology Applications in Banking and Finance
- **Vai trò chính:** Biên soạn nội dung CFA Ethics, rà soát question bank, xây dựng kịch bản demo và tổng hợp giới hạn sản phẩm.

## 1. Vai trò trong dự án

Trong dự án CFA Quest — Ethics, em phụ trách phần nội dung học thuật và các tài liệu giúp game vận hành, được kiểm tra và được giải thích rõ ràng khi demo. Công việc của em tập trung vào ba mảng có sản phẩm và minh chứng cụ thể:

- **Biên soạn và chỉnh sửa bộ câu hỏi CFA Level I Ethics:** xây dựng các bộ câu hỏi trắc nghiệm theo Code of Ethics, Standards of Professional Conduct và GIPS; tổ chức câu hỏi theo 5 cụm nội dung, độ khó và đáp án giải thích để phục vụ cơ chế sinh đề thích ứng của game.
- **Rà soát nội dung question bank:** đối chiếu câu hỏi, đáp án, lời giải và lý do gây nhiễu để phát hiện lỗi có thể dẫn đến chấm điểm hoặc chẩn đoán sai.
- **Xây dựng kịch bản demo và hệ thống hóa limitations:** chuẩn bị các lượt chơi mẫu có kết quả kỳ vọng, đồng thời ghi nhận các giới hạn kỹ thuật và giới hạn diễn giải kết quả của sản phẩm.

## 2. Dấu ấn cá nhân trong sản phẩm

Dấu ấn lớn nhất của em là kết nối kiến thức CFA Ethics với dữ liệu đầu vào và các tình huống kiểm chứng của game. CFA Quest không chỉ cần một bộ câu hỏi để người chơi chọn A/B/C. Mỗi câu còn phải mang thông tin đúng về nội dung và độ khó để hệ thống xác định cụm yếu, tạo đề luyện ở Arena tiếp theo và giải thích vì sao người chơi cần học lại phần đó.

Ở phần câu hỏi, em tham gia xây dựng, chỉnh sửa nhiều bộ bản thảo khác nhau, từ bộ câu hỏi luyện tập theo 7 Standards, bộ 45 câu Ethics–Code–GIPS đến các bộ câu bổ sung khó và bộ 50 câu đã revised. Các file thể hiện quá trình chuyển dần từ câu hỏi dùng để ôn tập sang dữ liệu có cấu trúc cho game. Phiên bản ngân hàng tích hợp hiện có 220 câu, chia đều 44 câu cho mỗi cluster C1–C5, gồm 3 mức độ khó.

Ở phần demo, em xây dựng 4 kịch bản có thể đối chiếu bằng số liệu, thay vì chỉ mô tả rằng game sẽ hoạt động đúng. Những kịch bản này kiểm tra cả trường hợp vượt ải, trượt ngay tại ngưỡng, hòa điểm phải xét tie-break và dùng Bùa làm thay đổi dữ liệu chẩn đoán dù số câu đúng không đổi. Điều này giúp người trình bày giải thích được *vì sao* game chọn W1/W2 và đưa ba cụm yếu nhất vào Boss.

Ở phần limitations, em tập hợp 23 giới hạn kèm tác động cụ thể đến sản phẩm. Dấu ấn của phần này là đặt ranh giới rõ giữa một game luyện tập có adaptive practice và một công cụ đo lường năng lực CFA đã được kiểm định; nhóm không nên suy diễn score của game thành dự báo kết quả kỳ thi thật.

## 3. Những việc đã thực sự làm

### 3.1. Xây dựng và chuẩn hóa nội dung Ethics

- Biên soạn/chỉnh sửa các bộ câu hỏi Word với tình huống về hành vi nghề nghiệp, trách nhiệm với khách hàng, xung đột lợi ích, tính khách quan trong nghiên cứu và GIPS.
- Phát triển phương án nhiễu gần với đáp án đúng để người chơi phải phân biệt nguyên tắc Ethics thay vì nhận diện một phương án sai quá rõ.
- Phân loại nội dung theo C1: Code of Ethics & GIPS; C2: Standards I–II; C3: Standard III; C4: Standards IV–V; C5: Standards VI–VII, đồng thời tổ chức câu hỏi theo mức dễ, trung bình, khó.
- Chuẩn bị/hoàn thiện bản dữ liệu JSON có các trường như `id`, `cluster`, `module`, `sub_standard`, `difficulty`, `stem`, `options`, `answer`, `distractor_reason`, `hint` và `explanation`, phục vụ việc sinh đề và cung cấp feedback.

### 3.2. Rà soát chất lượng nội dung câu hỏi

- Kiểm tra 30 câu (6 câu/cluster) từ bank 170 câu, ghi kết quả trong file `content-review-30 (1)(1).md`; không phát hiện content bug trong mẫu.
- Kiểm tra độ khớp giữa `stem` và `sub_standard`, đáp án đúng với lời giải, hai lý do loại phương án nhiễu, số phương án, độ dài và cấu trúc câu hỏi.

### 3.3. Xây dựng kịch bản demo có đầu vào cố định

- Soạn `demo-input (3).md` với 4 kịch bản: (1) Chuẩn — hoàn thành 5 Arena/Boss; (2) Lật pass/fail — đổi đúng một đáp án để Arena 1 từ 11/15 thành 10/15; (3) Hòa điểm — dùng thời gian 30 giây/45 giây để xác định W1; (4) Dùng Bùa — giữ kết quả pass nhưng loại câu có Bùa khỏi chẩn đoán, sau đó phải làm World Quest để đủ Credit mở Boss.
- Gắn từng bước với `question_id` thực trong bank, phương án cần chọn (`selected_option`), độ khó, `timeMs`, trạng thái dùng Bùa và kết quả mong đợi.
- Tính trước các đầu ra để đối chiếu với engine: kịch bản chuẩn có `performance_score` hiển thị **84% (107/128)**; kịch bản dùng Bùa là **81% (104/128)**. Các con số này là kết quả kỳ vọng từ luật hiện hành, không phải bằng chứng đã chạy thành công menu demo tự động.
- Lập checklist kiểm chứng 4 kịch bản: Đỗ/Trượt, W1/W2, Boss, Credit, O4 và `performance_score`. Các đầu ra được tính trước theo luật game để đối chiếu với engine khi tích hợp; tài liệu không phải bằng chứng chế độ demo tự động đã chạy thành công.

### 3.4. Ghi nhận giới hạn và cách diễn giải sản phẩm

- Soạn `limitations (1)(1).md`, tổng hợp 23 limitations và viết Impact cho từng giới hạn của sản phẩm.
- Chỉ ra các rủi ro chính: lặp câu khi replay/World Quest; pool 220 câu hữu hạn, đặc biệt câu khó; số câu đo trên mỗi cluster nhỏ; difficulty chưa được psychometric calibration; timer và tie-break dễ chịu ảnh hưởng của điều kiện trình duyệt; pass/fail khác tập dữ liệu dùng cho diagnostic khi có Bùa; chênh lệch giữa mốc O4 70% và Boss pass 90%.
- Giải thích rằng O4 so sánh hiệu suất trong một lượt chơi, không chứng minh hiệu quả học tập mang tính nhân quả, và kết quả game không dự báo điểm thi CFA thực tế.

## 4. File, tính năng, dữ liệu, logic, giao diện, tài liệu hoặc phần demo đã đóng góp

| Sản phẩm / file | Nội dung và vai trò |
|---|---|
| Bộ bản thảo câu hỏi CFA Ethics (`.docx`) | Bản thảo câu hỏi, tình huống, đáp án và các vòng bổ sung/chỉnh sửa nội dung CFA Ethics. Một số tên có hậu tố (1)/(2) là bản sao, không tính thành hai bộ câu hỏi độc lập. |
| Bộ 50 câu revised (JSON) | Bộ dữ liệu 50 câu revised theo cấu trúc câu hỏi dành cho game; 50/50 ID xuất hiện trong bank 220 câu. |
| `ethics_bank_220(1).json` | Bộ ngân hàng tích hợp 220 câu, mỗi cluster 44 câu; là dữ liệu đầu vào của cơ chế chọn câu và phân tích kết quả. |
| `content-review-30 (1)(1).md` | Rà soát 30 câu (6 câu/cluster) trong bank 170 câu; không phát hiện content bug rõ ràng trong mẫu. |
| `demo-input (3).md` | Bốn kịch bản có question ID, đầu vào cố định, expected outputs và Credit ledger; checklist đối chiếu với engine. |
| `limitations (1)(1).md` | 23 giới hạn kèm Impact và ranh giới diễn giải kết quả game. |

## 5. Bằng chứng đóng góp

### 5.1. Bản thảo nội dung CFA Ethics

- `CFA_Ethics_100_MCQs (1).docx`
- `CFA_Ethics_100_MCQs (2).docx`
- `CFA_Level_I_Ethics_100_Practice_Cases_Answers_Below_Each_Question (1).docx`
- `CFA_Ethics_Code_GIPS_All_45_Difficult_Distractors (1).docx`
- `CFA_Ethics_Code_GIPS_45_3_Options_With_Clusters_Difficulty (1).docx`
- `CFA_Ethics_Code_GIPS_45_3_Options_With_Clusters_Difficulty (2).docx`
- `CFA_Ethics_15_Bo_Sung_Kho_Suy_Luan.docx`

### 5.2. Ethics Bank 220 câu và các bộ 50 câu

- `ethics_bank_220(1).json`
- `CFA_Ethics_50_Cau_Bo_Sung_Kho_Suy_Luan(1).docx`
- `CFA_Ethics_50_Cau_Revised(1).docx`
- `CFA_Ethics_50_Cau_Revised_Question_Bank(1).json`

### 5.3. Rà soát chất lượng câu hỏi

Biên bản rà soát 30 câu trong bank 170 câu; không phát hiện content bug trong mẫu.

- `content-review-30 (1)(1).md`

### 5.4. Kịch bản game và demo

Bốn kịch bản có question ID, lựa chọn cố định, thời gian, Credit và expected outputs.

- `demo-input (3).md`

### 5.5. Tài liệu limitations

Danh sách 23 giới hạn, tác động (Impact) và ranh giới diễn giải kết quả của CFA Quest.

- `limitations (1)(1).md`

## 6. Phần đóng góp đó kết nối thế nào với sản phẩm cuối cùng

Phần biên soạn câu hỏi cung cấp đầu vào học thuật cho CFA Quest. Game chỉ có thể xác định cluster yếu và tạo lượt luyện tập nhắm mục tiêu khi mỗi câu hỏi được gắn đúng cluster/module và có đáp án đáng tin cậy. Nếu answer key sai hoặc explanation mâu thuẫn, người chơi có thể bị chấm nhầm và kết quả chẩn đoán sẽ lệch theo; vì vậy công việc rà nội dung có ảnh hưởng trực tiếp đến chất lượng output.

Phần demo-input là cầu nối từ logic thiết kế sang kiểm chứng và thuyết trình sản phẩm. Thay vì bốc ngẫu nhiên các câu hỏi rồi hy vọng kết quả phù hợp, người demo có một chuỗi input và kết quả kỳ vọng đủ chi tiết để kiểm tra ngưỡng pass/fail, tie-break, Credit, World Quest và tác động của Bùa tới O4. Tài liệu này chưa thay thế được việc tích hợp demo mode vào code; nó giúp xác định rõ tiêu chí nghiệm thu khi tính năng được xây dựng.

Phần limitations giúp nhóm trình bày sản phẩm một cách có trách nhiệm: CFA Quest có thể hỗ trợ luyện tập và nhận diện các cụm trả lời yếu trong một session, nhưng chưa phải công cụ đánh giá năng lực được chuẩn hóa.

## 7. Điều cá nhân học được

- **Nội dung giáo dục muốn đưa vào phần mềm phải trở thành dữ liệu có cấu trúc.** Em hiểu rằng viết một câu hỏi hay chưa đủ: hệ thống cần ID ổn định, cluster, module, mức khó, đáp án và explanation nhất quán để có thể rút đề, chấm điểm và giải thích kết quả.
- **Đáp án đúng quan trọng, nhưng phương án nhiễu cũng phải có lý do.** Khi viết Ethics, hai đáp án sai thường dựa trên sự nhầm lẫn rất gần với Standard đúng. Việc chuẩn bị distractor_reason giúp em hiểu kiến thức sâu hơn và nghĩ về sai lầm mà người học dễ mắc.
- **Một sản phẩm có giới hạn không có nghĩa là sản phẩm vô giá trị.** Việc viết limitations dạy em cách xác định sản phẩm có thể kết luận gì, không thể kết luận gì và loại user testing nào cần thiết trước khi đưa ra các khẳng định mạnh hơn.
- **Tài liệu kỹ thuật phải có thể kiểm tra lại.** Các bảng question_id, selected_option, timeMs, expected W1/W2 và sổ Credit làm cho kịch bản demo minh bạch hơn nhiều so với việc chỉ viết một đoạn mô tả trải nghiệm chơi.

## 8. Khó khăn đã gặp và cách xử lý

Khó khăn thứ nhất là chuyển kiến thức CFA Ethics thành bộ MCQ có chất lượng đồng đều. Nhiều Standard có tình huống rất gần nhau, khiến việc viết ba lựa chọn vừa hợp lý vừa chỉ có một đáp án tốt nhất không đơn giản. Em xử lý bằng cách phân loại rõ sub-standard, tăng tỷ trọng câu tình huống/suy luận ở các bộ bổ sung, và bổ sung lý do tại sao từng phương án sai. Qua nhiều bản thảo, nội dung được điều chỉnh để phù hợp hơn với cấu trúc game.

Khó khăn thứ hai là lỗi nội dung có thể không bị bộ kiểm tra kỹ thuật phát hiện. Validator có thể kiểm tra một câu có đủ trường và ba phương án hay không, nhưng không biết đáp án đánh dấu có mâu thuẫn với explanation.

Khó khăn thứ ba là tạo demo có thể tái hiện và giải thích được. Hệ thống rút câu và xếp cụm yếu từ nhiều biến, nên chỉ đặt trước tỷ lệ đúng không đảm bảo W1, W2 hay O4 ra đúng.

Khó khăn thứ tư là đánh giá kết quả game mà không khẳng định quá mức. Số câu mỗi cụm còn nhỏ, câu có thể lặp, difficulty do nhóm tự gắn và chưa có user testing đủ lớn. Em tổng hợp từng giới hạn cùng tác động cụ thể để nhóm vẫn làm rõ được giá trị luyện tập của sản phẩm nhưng không mô tả điểm của game như một thước đo CFA chuẩn hóa.

## 9. Lời nhắn cho sinh viên khóa sau

Nếu tiếp tục phát triển một game học tập như CFA Quest, em nghĩ các bạn nên xây dựng question bank, logic chấm và kịch bản kiểm thử song song ngay từ đầu. Đừng chỉ quan tâm game có bao nhiêu câu hỏi; hãy kiểm tra câu đó đo nội dung nào, vì sao đáp án đúng và việc chấm câu đó ảnh hưởng thế nào đến kết luận cuối. Khi demo, hãy chuẩn bị sẵn những trường hợp biên như trượt sát ngưỡng, hòa điểm và sử dụng vật phẩm. Cuối cùng, nên nói rõ đâu là sản phẩm đã chạy được, đâu mới là đặc tả hoặc phần còn triển khai, vì khả năng giải thích trung thực về sản phẩm cũng là một phần quan trọng của đóng góp cá nhân.
