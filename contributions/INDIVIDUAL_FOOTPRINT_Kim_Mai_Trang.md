# Individual Footprint — Kim Mai Trang

**Họ và tên:** Kim Mai Trang

**Nhóm:** Nhóm 7

**Dự án:** CFA Quest - Ethics

**Học phần:** NHA408E - Technology Applications in Banking and Finance

## Vai trò trong dự án

Trong dự án **CFA Quest - Ethics**, em phụ trách chính phần **logic sinh đề và kiểm thử cơ chế adaptive practice** của game. Công việc trọng tâm của em là bảo đảm dữ liệu chẩn đoán sau mỗi Arena thực sự được chuyển thành đúng bộ câu hỏi ở Arena tiếp theo, thay vì chỉ dừng ở việc hiển thị điểm số.

Cụ thể, em tham gia xây dựng quy tắc sinh 5 Arena, logic chọn W1/W2, ràng buộc W2 khác W1, cơ chế chống lặp câu, fallback khi pool câu phù hợp bị thiếu, và QA cấu trúc question bank.

Ở giai đoạn Week 7, em tiếp tục tham gia rà và test phần generation khi game được tăng độ khó theo round: Arena 2 dùng 4 easy / 4 medium / 2 hard, Arena 3 dùng 2/5/3, Arena 4 dùng 2/4/4, còn Boss dùng 2/4/9.

Ngoài phần logic sinh đề, em còn tham gia **final documentation consistency**: rà lại các file luật và tài liệu nộp cuối để bảo đảm generation logic, difficulty quota, fallback, reused, Boss retry và test cases không bị lệch giữa code và documentation.

## Dấu ấn cá nhân trong sản phẩm

Dấu ấn rõ nhất của em là phần **Arena Generation Engine** - cơ chế biến kết quả chẩn đoán của người học thành bài luyện tiếp theo.

Nếu chỉ có phần chấm điểm, CFA Quest sẽ giống một quiz thông thường. Phần em phụ trách giúp game trả lời được câu hỏi quan trọng hơn: sau khi biết người học yếu ở đâu, hệ thống phải chọn đúng cluster, đúng mức difficulty và đúng số lượng câu để tạo Arena tiếp theo.

Arena 1 được dùng làm mốc chẩn đoán ban đầu. Trap I nhắm vào W1. Crossroads lấy lại dữ liệu từ cả 5 cluster. Trap II phải nhắm W2 khác W1. Boss lấy ba cluster yếu nhất và phân bổ theo 7/5/3. Đây là phần logic giúp sản phẩm giữ được core process:

```text
Diagnose
→ Rank Weakness
→ Filter Question Bank
→ Generate Targeted Arena
→ Re-Diagnose
→ Verify
```

Dấu ấn thứ hai của em là **giữ tính toàn vẹn của question pool**. Khi người chơi replay hoặc pool câu mới ở đúng mức difficulty bị thiếu, hệ thống không được rút câu tùy tiện. Em tham gia xây dựng rule ưu tiên câu mới, reuse câu cùng difficulty khi cần, fallback về medium và ghi bankLog để có thể kiểm tra lại.

Dấu ấn thứ ba là **testing generation logic bằng các case cụ thể thay vì chỉ nhìn game chạy được**. Các test T-G kiểm tra cấu trúc Arena, W1/W2, difficulty distribution, Boss split, fallback và tie-break đều được viết theo expected result rõ ràng.

## Những việc đã thực sự làm

- Xây dựng và rà soát logic sinh 5 Arena: Arena 1, Trap I, Crossroads, Trap II và Boss.

- Thiết kế rule Trap I lấy W1 và Trap II bắt buộc lấy W2 khác W1.

- Tham gia logic xếp hạng cluster yếu và tie-break khi các cluster có cùng accuracy.

- Xây dựng cơ chế chống lặp câu trong cùng một run.

- Xử lý fallback khi không còn đủ câu mới ở đúng difficulty: reuse câu cùng mức khó, sau đó fallback xuống medium nếu cần.

- Tham gia kiểm tra cấu trúc question bank: ID, số phương án, mapping cluster/module và các ràng buộc dữ liệu.

- Kiểm thử difficulty quota mới của Week 7 cho Arena 2, Arena 3, Arena 4 và Boss.

- Kiểm thử Boss generation theo hai lớp ràng buộc: cluster split 7/5/3 và difficulty split 2/4/9.

- Viết và rà nhóm test generation T-G, đồng thời tham gia verify các test score/pass boundary T-S.

- Tham gia rule loại câu World Quest khỏi Boss và bảo đảm Quest không làm thay đổi diagnostic counters.

- Ở giai đoạn final, rà soát sự nhất quán giữa SOLUTION_STRUCTURE.md, INPUT_DICTIONARY.md, user-flow.md, feature-scope.md, ASSUMPTIONS.md, W6/testing.md và W6/demo-input.md.

- Rà lại các revision sau feedback như difficulty quota, fallback/reuse, tie-break 3 bước và logic Boss retry để tài liệu không lệch code.

## File, tính năng, dữ liệu, logic, giao diện, tài liệu hoặc phần demo đã đóng góp

### Code và logic

- src/cfa_quest_engine.js

  - Arena generation.

  - Chọn W1/W2.

  - Boss generation.

  - Difficulty allocation.

  - Question reuse/fallback logic.

- tools/validate_question_bank.html

  - Công cụ QA offline để kiểm tra cấu trúc question bank trước khi tích hợp vào game.

### Testing

- W6/testing.md

  - Nhóm test T-G cho Arena generation.

  - Difficulty quota.

  - Boss split.

  - Fallback.

  - Tie-break.

  - Verification các pass boundary liên quan.

### Documentation và final consistency review

- docs/SOLUTION_STRUCTURE.md

- docs/INPUT_DICTIONARY.md

- docs/user-flow.md

- docs/feature-scope.md

- docs/ASSUMPTIONS.md

- docs/SOURCE_USE_MAP.md

- W6/demo-input.md

- W6/limitations.md

- README.md

- docs/revision_summary.md

Trong giai đoạn final, em tập trung vào việc rà các rule liên quan trực tiếp tới generation và question pool để bảo đảm các file này dùng cùng một định nghĩa.

## Bằng chứng đóng góp

Các bằng chứng có thể dùng để kiểm tra phần việc của em gồm:

1. **Ownership table trong docs/WEEK5_CHECKPOINT.md**

    - Thể hiện phần generation 5 Arena, W1/W2, chống lặp và question-bank validation được giao cho Trang.

2. **W6/testing.md**

    - Các test T-G cho generation logic, difficulty quota, Boss split, fallback và tie-break.

    - Các case này thể hiện rõ input, expected result và rule cần kiểm tra.

3. **docs/ASSUMPTIONS.md**

    - Các assumption liên quan tới W2 khác W1, tie-break, bank capacity, fallback và World Quest question exclusion.

4. **tools/validate_question_bank.html**

    - Bằng chứng trực tiếp cho phần QA dữ liệu trước khi đưa bank vào engine.

5. **Các revision tài liệu cuối kỳ**

    - Các file được rà lại để khôi phục và đồng bộ các rule như reused, Boss O4 lấy lượt đỗ, boss_insufficient, tie-break 3 bước và question-pool behavior.

## Phần đóng góp đó kết nối thế nào với sản phẩm cuối cùng

Phần generation là cầu nối giữa **diagnostic** và **practice**.

Bảng chẩn đoán chỉ có giá trị khi output của nó thực sự làm thay đổi câu hỏi tiếp theo. Logic em phụ trách lấy cluster yếu từ diagnostic engine, lọc question bank, áp difficulty quota và sinh đúng Arena tiếp theo. Vì vậy phần này quyết định trực tiếp tính adaptive của CFA Quest.

Nếu generation sai, sản phẩm có thể hiển thị đúng W1 nhưng lại hỏi sai cluster, rút sai difficulty hoặc lặp quá nhiều câu. Khi đó main feature của game sẽ mất ý nghĩa.

Question-bank validation và fallback cũng kết nối trực tiếp với độ ổn định của sản phẩm. Bank có thể đúng về số lượng tổng nhưng vẫn fail nếu thiếu hard questions trong một cluster hoặc chứa mapping sai. Việc kiểm tra bank trước và ghi bankLog khi phải fallback giúp nhóm phát hiện khi nào kết quả generation không còn đúng với intended design.

Cuối cùng, testing của em giúp chứng minh generator không chỉ “có vẻ chạy đúng” mà thỏa từng rule cụ thể đã được nhóm chốt.

## Điều cá nhân học được

Qua phần việc này, em học được rằng adaptive learning không chỉ là tính điểm rồi chọn phần có điểm thấp nhất. Sau bước chẩn đoán còn rất nhiều vấn đề kỹ thuật cần xử lý: cluster nào được ưu tiên, difficulty phải phân bổ như thế nào, câu nào đã gặp, khi nào được reuse và làm sao tránh việc replay khiến kết quả bị sai lệch.

Em cũng học được tầm quan trọng của **deterministic logic và testing**. Một rule như “Arena 4 phải khó hơn Arena 3” nghe rất đơn giản ở mức ý tưởng, nhưng khi chuyển thành code phải biểu diễn được bằng quota cụ thể và phải có test để chứng minh generator thực sự tạo đúng 2 easy / 4 medium / 4 hard.

Một bài học khác là dữ liệu và code phải được thiết kế cùng nhau. Generator tốt nhưng question bank không đủ câu phù hợp thì vẫn thất bại. Vì vậy em phải quan tâm cả bank capacity, label difficulty và fallback logic thay vì chỉ nhìn vào hàm sinh đề.

Ở giai đoạn cuối, em còn hiểu rõ hơn rằng documentation không chỉ là phần viết sau khi code xong. Khi rule đổi từ v11 sang Week 7, chỉ một tài liệu còn giữ logic cũ cũng có thể làm nhóm demo hoặc bảo vệ sai. Việc rà lại consistency giữa code, testing và documentation vì vậy cũng là một phần quan trọng của quá trình hoàn thiện sản phẩm.

## Khó khăn đã gặp và cách xử lý

### 1. Khó khăn khi vừa phải thích ứng với diagnostic logic, vừa bảo đảm question pool đủ dùng

Một cluster có thể bị nhắm nhiều lần qua Trap, replay hoặc Boss. Nếu chỉ ưu tiên câu chưa gặp mà không tính tới difficulty thì rất dễ thiếu câu hard ở round sau.

**Cách xử lý:**

- theo dõi used_question_ids;

- ưu tiên câu mới ở đúng difficulty;

- nếu thiếu thì reuse câu cùng difficulty;

- nếu vẫn thiếu thì fallback về medium;

- ghi trường hợp fallback vào bankLog.

Cách này giúp engine luôn sinh được đề nhưng vẫn để lại dấu vết khi bank không đủ lý tưởng.

### 2. Khó khăn khi nhiều cluster có cùng Accuracy

Chỉ nhìn tỷ lệ đúng không phải lúc nào cũng xác định được cluster yếu nhất, đặc biệt ở Arena 1 khi mỗi cluster chỉ có ít câu.

**Cách xử lý:**

Nhóm dùng chuỗi tie-break thống nhất:

1. độ khó trung bình của các câu sai cao hơn;

2. thời gian trả lời trung bình dài hơn;

3. mã cluster C1 → C5.

Việc chuyển rule này thành test giúp tránh tình trạng mỗi phần code hiểu tie-break theo một cách khác nhau.

### 3. Khó khăn khi thay đổi difficulty của Week 7 nhưng vẫn phải giữ core diagnostic logic

Feedback yêu cầu round sau khó hơn round trước, nhưng nếu sửa generation không cẩn thận thì có thể làm thay đổi cấu trúc W1/W2 hoặc Boss.

**Cách xử lý:**

Em tách hai vấn đề:

- cluster allocation vẫn giữ logic diagnostic cũ;

- difficulty được thêm như một constraint riêng trong từng round.

Nhờ vậy Arena vẫn nhắm đúng điểm yếu nhưng độ khó tăng dần.

### 4. Khó khăn khi code và tài liệu bị lệch sau nhiều revision

Ở giai đoạn cuối, một số file còn giữ rule cũ trong khi code đã chạy theo rule mới như reused, Boss O4 lấy lượt đỗ hoặc tie-break 3 bước.

**Cách xử lý:**

Em rà lại theo từng rule thay vì đọc từng file độc lập:

```text
Rule
→ code đang làm gì
→ SOLUTION_STRUCTURE nói gì
→ INPUT_DICTIONARY lưu field gì
→ testing kiểm gì
→ demo kỳ vọng gì
```

Cách kiểm tra này giúp phát hiện contradiction nhanh hơn và làm bộ tài liệu final thống nhất hơn.

## Lời nhắn cho sinh viên khóa sau

Nếu tiếp tục phát triển một sản phẩm adaptive learning, đừng bắt đầu bằng việc làm UI hoặc thêm thật nhiều feature. Hãy chốt trước ba thứ:

1. **Output chẩn đoán là gì.**

2. **Output đó làm thay đổi câu hỏi tiếp theo như thế nào.**

3. **Có test nào chứng minh generation đang thực hiện đúng rule hay không.**

Question bank cũng cần được coi như một phần của hệ thống chứ không phải một file dữ liệu phụ. Hãy kiểm tra distribution theo cluster và difficulty từ sớm, vì đến lúc thêm replay hoặc adaptive generation thì một bank tưởng như rất lớn vẫn có thể thiếu đúng loại câu cần thiết.

Cuối cùng, khi một rule thay đổi, đừng chỉ sửa code. Hãy tìm tất cả nơi rule đó xuất hiện trong documentation, testing, demo và assumptions. Một sản phẩm cuối kỳ tốt không chỉ cần chạy đúng mà còn cần **code, dữ liệu, test và tài liệu kể cùng một câu chuyện**.
