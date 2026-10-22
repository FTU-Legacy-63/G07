# Group Footprint

## Tên sản phẩm

**CFA QUEST — ETHICS**

## Mã nhóm

**G07 — FTU Legacy 63** (Nhóm 7, học phần NHA408E)

## Link repo

https://github.com/FTU-Legacy-63/G07

## Link demo

* **Bản chạy chính thức (GitHub Pages):** https://ftu-legacy-63.github.io/G07/src/cfa_quest_v11.html — đề được bốc ngẫu nhiên, ai cũng chơi được.
* **Chế độ demo có kịch bản:** cùng link, thêm đuôi `?demo=1` — header hiện ô chọn 1 trong 4 kịch bản và nút **Chạy kịch bản** để tái hiện kết quả đã tính trước.
* **Bản dự phòng và cách chạy offline:** xem [`W6/deployment.md`](https://github.com/FTU-Legacy-63/G07/blob/main/W6/deployment.md). Tải repo, mở `src/cfa_quest_v11.html`; màn hình đầu hiện dòng "Ngân hàng hợp lệ: 220 câu, 5 cụm, 9 module." là chạy đúng.
* **Thiết bị:** máy tính có bàn phím (di chuyển bằng W, A, S, D). Trên thiết bị chỉ có màn hình cảm ứng, game hiện thông báo mở trên máy tính và không cho vào màn chơi.

---

## 1. Vấn đề nhóm muốn giải quyết

Nhóm muốn giải quyết một vấn đề trong quá trình tự ôn **Ethics của CFA Level I**: sau khi làm bài trắc nghiệm, người học thường biết mình đúng hoặc sai bao nhiêu câu, nhưng khó xác định chính xác lỗi sai đang tập trung ở nhóm Standards nào. Điểm tổng của một bài luyện tập cho biết kết quả chung, nhưng chưa đủ để chỉ ra phần kiến thức nên ưu tiên ôn lại.

Ethics bao gồm nhiều quy tắc và tình huống nghề nghiệp có nội dung gần nhau. Một người học có thể hiểu các khái niệm cơ bản nhưng vẫn thường xuyên nhầm lẫn khi áp dụng các Standards vào tình huống cụ thể. Nếu chỉ tiếp tục làm những bộ đề cố định hoặc tự chọn chủ đề luyện tập theo cảm giác, người học có thể dành nhiều thời gian cho phần đã tương đối chắc, trong khi phần đang sai nhiều chưa được luyện lại đúng mức.

Vì vậy, nhóm phát triển **CFA Quest** như một web game luyện tập dựa trên chẩn đoán. Thay vì chỉ chấm điểm sau mỗi vòng, hệ thống ghi nhận câu trả lời theo từng cụm kiến thức, xác định cụm có tỷ lệ đúng thấp và **tự sinh Arena tiếp theo từ chính dữ liệu bài làm của người học**. Quá trình luyện tập được tổ chức thành một hành trình hầm ngục với độ khó tăng dần, giúp người học có mục tiêu cụ thể qua từng vòng.

Vấn đề nhóm muốn giải quyết không đơn thuần là biến một bộ trắc nghiệm thành game. Giá trị cốt lõi của sản phẩm nằm ở việc nối được **lỗi sai → chẩn đoán điểm yếu → đề luyện đúng trọng tâm → kiểm tra lại kết quả**. Game hỗ trợ việc tự học và ôn tập, không thay thế tài liệu học chính thức hay đánh giá năng lực theo chuẩn của CFA Institute.

---

## 2. Người dùng mục tiêu

Người dùng chính của CFA Quest là **thí sinh đang tự ôn CFA Level I, đã học xong phần lý thuyết Ethics và chuyển sang giai đoạn luyện câu hỏi trắc nghiệm (MCQ)**. Đây là nhóm có nhu cầu không chỉ làm thêm câu hỏi, mà còn cần biết sau mỗi lượt luyện mình nên quay lại Standard nào.

Nhóm người dùng này cần một sản phẩm giúp họ:

* nhìn thấy tỷ lệ trả lời đúng theo những cụm kiến thức cụ thể, thay vì chỉ nhìn một điểm số tổng;
* xác định nhóm Standards có nhiều lỗi sai trong phiên luyện tập;
* được luyện lại các cụm yếu mà không phải tự tìm, lọc và ghép đề thủ công;
* hiểu vì sao mình trả lời sai thông qua lời giải và phân tích phương án gây nhiễu;
* kiểm tra lại kết quả ở cuối hành trình để xác định phần nào có tín hiệu cải thiện và phần nào vẫn cần ôn tiếp.

Người dùng có thể sử dụng CFA Quest khi tự luyện Ethics sau giờ học hoặc trước kỳ thi, đặc biệt sau giai đoạn đã có kiến thức nền nhưng chưa xác định rõ nội dung cần ưu tiên. Trong phạm vi sản phẩm hiện tại, game tập trung vào **Ethics**, chưa phải công cụ ôn tập toàn bộ các môn của CFA Level I.

---

## 3. Sản phẩm hiện làm được gì

CFA Quest là một web game dạng hầm ngục, trong đó người chơi lần lượt vượt qua **5 Arena chính**. Game sử dụng ngân hàng **220 câu hỏi Ethics** do nhóm tự biên soạn, được gắn nhãn theo **5 cụm chẩn đoán, 9 module và 3 mức độ khó**. Một hành trình chính không phải chơi lại và không cần World Quest gồm tổng cộng **60 câu** (15 + 10 + 10 + 10 + 15).

### (1) Tổ chức nội dung Ethics thành 5 cụm chẩn đoán

Thay vì xem toàn bộ Ethics là một chủ đề duy nhất, hệ thống chia nội dung thành hai tầng: **cụm** để chẩn đoán và sinh đề, **module/Standard** để người học nhận biết nội dung cần ôn. Cấu trúc gồm:

| Cụm | Nội dung | Các module/Standards liên quan |
|---|---|---|
| C1 | Khung đạo đức nền | GIPS; Code of Ethics |
| C2 | Standards I–II | Professionalism; Integrity of Capital Markets |
| C3 | Standard III | Duties to Clients |
| C4 | Standards IV–V | Duties to Employers; Investment Analysis, Recommendations and Actions |
| C5 | Standards VI–VII | Conflicts of Interest; Responsibilities as a CFA Member or Candidate |

Ngân hàng hiện tại có **44 câu cho mỗi cụm**, với các trường dữ liệu phục vụ việc chọn câu, chấm đáp án và giải thích lỗi sai.

### (2) Vận hành hành trình 5 Arena theo kết quả của người chơi

| Vòng | Vai trò | Số câu | Ngưỡng đỗ | Cấu trúc đề |
|---|---|---:|---:|---|
| **Arena 1 — The Gate** | Chẩn đoán ban đầu | 15 | 70% — 11/15 | Mỗi cụm 3 câu, gồm 1 dễ, 1 vừa, 1 khó |
| **Arena 2 — Trap I** | Luyện cụm yếu nhất W1 | 10 | 75% — 8/10 | 4 dễ, 4 vừa, 2 khó |
| **Arena 3 — The Crossroads** | Kiểm tra lại cả 5 cụm | 10 | 75% — 8/10 | 2 câu/cụm; 2 dễ, 5 vừa, 3 khó |
| **Arena 4 — Trap II** | Luyện cụm yếu thứ hai W2, khác W1 | 10 | 85% — 9/10 | 2 dễ, 4 vừa, 4 khó |
| **Arena 5 — Boss** | Kiểm tra 3 cụm yếu nhất | 15 | 90% — 14/15 | Chia theo cụm 7/5/3; 2 dễ, 4 vừa, 9 khó |

Sau Arena 1, game tìm cụm yếu nhất (**W1**) để sinh Trap I. Sau The Crossroads, game xác định cụm yếu tiếp theo (**W2**, bắt buộc khác W1) để sinh Trap II. Trước Boss, hệ thống xếp hạng lại cả 5 cụm và chọn **3 cụm yếu nhất**; W1 hoặc W2 vẫn có thể nằm trong ba cụm này nếu kết quả chưa tốt.

### (3) Tăng thử thách bằng độ khó, giới hạn thời gian và Credit

Game không giữ một ngưỡng đỗ cố định cho mọi vòng. Các Arena sau có tỷ trọng câu khó lớn hơn; riêng Arena 3, Arena 4 và Boss có giới hạn thời gian tương ứng **100, 80 và 60 giây/câu**. Hết thời gian không tự động nộp đáp án, nhưng người chơi bị trừ Credit theo mức quá giờ.

Người chơi bắt đầu với **3 Credit**, được thưởng Credit khi vượt vòng và có thể dùng Credit trong **Shop** để mua **Bùa Loại Trừ**. Mỗi Bùa có giá 3 Credit, giúp loại một phương án sai. Bùa chỉ được sử dụng theo giới hạn của từng vòng và không được dùng trong Arena 1 hoặc World Quest.

### (4) Có Boss Gate và World Quest làm vòng luyện bổ trợ

Sau khi vượt Arena 4, người chơi cần **15 Credit** để mở Boss. Người đủ Credit có thể vào Boss trực tiếp. Người chưa đủ Credit có thể làm **World Quest**, một vòng luyện phụ gồm 15 câu lấy từ 3 cụm yếu nhất, để nhận thêm Credit.

World Quest không có timer, không yêu cầu ngưỡng đỗ và có thể được làm lại. Kết quả Quest được theo dõi riêng, **không cộng vào dữ liệu chẩn đoán và không dùng để kết luận cải thiện ở Boss**. Cách tách này giúp vòng kiếm tài nguyên không làm thay đổi hồ sơ điểm yếu đã dùng để sinh đề chính.

### (5) Lớp game hành động: đánh quái để mở câu hỏi, né đạn ở Boss

Bản đang chạy đã có lớp game hành động trên nền canvas. Lớp này chỉ quyết định **khi nào câu hỏi hiện ra**; engine vẫn quyết định câu nào xuất hiện, đáp án, chấm điểm, Credit và chẩn đoán.

* **Arena 1–4 và World Quest:** người chơi điều khiển nhân vật bằng W, A, S, D. Số quái của một màn bằng số câu của màn đó, trên màn có tối đa 4 con cùng lúc. Quái đuổi theo nhân vật; vào tầm thì nhân vật tự chém và một câu hỏi hiện ra. Quái chạm vào nhân vật không gây thua hay trừ điểm. Hết quái thì Credit rơi ra thành đồng xu.
* **Boss:** Boss đứng cố định ở phía trên màn hình và bắn đạn theo các tia xoay vòng. Người chơi phải né đạn để lại gần chém Boss; mỗi lần chém trúng mở một câu. Mỗi lượt Boss có **2 tim**. Thanh máu Boss có 15 nấc, giảm một nấc mỗi lần chém trúng dù trả lời đúng hay sai, nên thanh máu chỉ cho biết còn bao nhiêu câu, không lộ kết quả đỗ/trượt.
* Khi câu hỏi hiện, nhân vật, quái và đạn **đứng hình**; đồng hồ của câu vẫn chạy. Thời gian trả lời chỉ tính từ lúc câu hiện ra đến lúc bấm Xác nhận, không tính thời gian di chuyển giữa hai câu.

### (6) Màn hình, hướng dẫn và kết quả

Bản web có màn hình bắt đầu, bản đồ tiến trình, màn chơi, màn kết quả sau mỗi Arena, Shop, Boss Gate, World Quest và bảng tổng kết sau Boss. Luật chơi được giới thiệu dần bằng thẻ hướng dẫn, khung chỉ dẫn trên màn hình và thông báo ngắn, kèm bảng Luật chơi mở lại được. Người học có thể theo dõi cụm được nhắm ở từng Arena, kết quả đúng/sai, Credit và bảng tổng kết. Các câu hỏi có lời giải, gợi ý và phân tích phương án gây nhiễu để hỗ trợ việc ôn lại.

Sản phẩm viết bằng **HTML, CSS và JavaScript**, dùng question bank tĩnh, lưu tiến trình trên trình duyệt; không yêu cầu đăng nhập hay gọi API bên ngoài. Từ ngày 21/10/2026, phần luật game nằm riêng trong `cfa_quest_engine.js`, không đụng tới giao diện, nên có thể chạy kiểm thử tự động bằng Node. Bên cạnh bản game, repository có tài liệu input, solution, user flow, limitations, testing, bug log, deployment và 4 kịch bản demo.

---

## 4. Input

Sản phẩm tiếp nhận ba nhóm đầu vào chính.

### (1) Input từ người chơi

* **Đáp án được chọn** cho từng câu trắc nghiệm, với 3 phương án trả lời; mỗi câu chọn xong phải bấm Xác nhận và không quay lại câu trước.
* **Thời gian trả lời (`timeMs`)**, tính từ lúc câu hiện ra đến khi người chơi xác nhận đáp án.
* **Trạng thái sử dụng vật phẩm:** câu nào có dùng Bùa Loại Trừ.
* **Các hành động trong hành trình:** bắt đầu, làm lại Arena sau khi trượt, vào World Quest, mua Bùa, trả Credit mở Boss và thoát vòng.
* **Điều khiển nhân vật:** di chuyển bằng W, A, S, D, chém quái, né đạn và mất tim ở Boss.

Các input này phục vụ những mục đích khác nhau. Đáp án quyết định đúng/sai; thời gian hỗ trợ quy tắc xếp hạng khi các cụm đồng điểm và tính phạt quá giờ; trạng thái Bùa giúp loại các câu có trợ giúp khỏi mẫu chẩn đoán. Thao tác điều khiển nhân vật **không phải dữ liệu chẩn đoán**; việc mất hết tim ở Boss chỉ ảnh hưởng tới lượt Boss đó (xem Mục 5, phần 6). Game không cần thu thập thông tin cá nhân, hồ sơ CFA hay lịch sử thi thật của người chơi.

### (2) Dữ liệu và nội dung có sẵn trong game

* **Question Bank 220 câu**, phân bổ 44 câu cho mỗi cụm C1–C5, mỗi câu 13 trường.
* Nhãn câu hỏi: `id`, `topic`, `cluster`, `module`, `sub_standard`, `difficulty`, `item_type` (dạng câu `concept` / `vignette`, không ảnh hưởng logic).
* Nội dung câu hỏi: `stem`, `options`, `answer`, `distractor_reason`, `hint`, `explanation`.
* Cấu hình của 5 Arena: số lượng câu, nhóm kiến thức cần chọn, tỷ lệ dễ/vừa/khó và ngưỡng đỗ.
* Luật Credit, giá Bùa, giới hạn sử dụng Bùa, thời gian, mức phạt quá giờ, Boss Gate, lượt trắng và thưởng World Quest.
* Quy tắc chẩn đoán, xếp hạng cụm yếu, sinh đề và tổng kết cuối hành trình.
* Tham số lớp game (tốc độ, số quái, số tim, bán kính đẩy...) ghi tập trung ở SOLUTION_STRUCTURE Mục 15.8.

Đây là **ngân hàng câu hỏi tĩnh do nhóm tự biên soạn và gắn nhãn**; tình huống là giả định, không trích nguyên văn tài liệu của CFA Institute. Game không tự tạo câu hỏi bằng AI trong lúc chơi và không lấy câu hỏi mới từ một dịch vụ trực tuyến.

### (3) Trạng thái hệ thống trong một lượt chơi

* Arena hiện tại và trạng thái đỗ/trượt của từng Arena.
* Danh sách câu đã xuất hiện để ưu tiên câu chưa gặp và ghi nhận trường hợp phải dùng lại câu.
* Số câu đúng, số câu hợp lệ và tỷ lệ đúng theo từng cụm/module.
* Cụm yếu nhất W1, cụm yếu thứ hai W2 và danh sách 3 cụm đưa vào Boss.
* Số dư Credit, số Bùa đã mua/đã dùng, phần thưởng và tiền phạt.
* Thời gian trả lời, lịch sử lượt làm, trạng thái mở khóa Boss, số lượt trắng còn lại và kết quả World Quest.
* Các dữ liệu dùng riêng cho chẩn đoán, đỗ/trượt Arena và điểm tổng hợp.

---

## 5. Logic hoặc quy tắc xử lý

CFA Quest được xây dựng quanh quá trình **Diagnostic-Driven Practice Generation**. Hệ thống không chỉ chấm bài rồi đưa ra điểm số, mà còn sử dụng chính kết quả trả lời để quyết định nội dung của vòng luyện tiếp theo.

```text
Người chơi đánh quái / chém Boss → câu hỏi hiện ra
            ↓
Chấm đúng/sai và ghi nhận thời gian, vật phẩm
            ↓
Cập nhật chẩn đoán theo 5 cụm Ethics
            ↓
Xếp hạng các cụm theo mức độ yếu
            ↓
Lọc ngân hàng theo cụm + độ khó yêu cầu
            ↓
Sinh Arena tiếp theo đúng trọng tâm
            ↓
Chấm đỗ/trượt, thưởng/phạt Credit
            ↓
Kiểm tra Boss Gate / World Quest
            ↓
Boss → so sánh với mốc chẩn đoán trước đó
```

Có thể hiểu logic sản phẩm qua sáu phần chính.

### (1) Từ đáp án đến bảng chẩn đoán và cụm yếu

Arena 1 hỏi **3 câu từ mỗi cụm** để có một bức tranh ban đầu về kết quả trả lời. Hệ thống tính tỷ lệ đúng của các câu được phép sử dụng cho chẩn đoán:

```text
Diagnostic Accuracy của cụm
= Số câu đúng hợp lệ thuộc cụm / Tổng số câu hợp lệ thuộc cụm
```

Câu sử dụng Bùa được loại khỏi **cả tử số và mẫu số** của phép đo chẩn đoán. Khi người chơi làm lại một Arena, kết quả đỗ/trượt ở lượt sau vẫn được tính theo lượt hiện tại, nhưng dữ liệu chẩn đoán của Arena 1–4 dựa trên **lượt làm đầu tiên**, tránh để việc nhớ câu ở các lần làm lại liên tục thay đổi hồ sơ điểm yếu.

Cụm có tỷ lệ đúng thấp nhất được ưu tiên là cụm yếu nhất. Nếu có nhiều cụm cùng tỷ lệ, hệ thống sử dụng lần lượt: **độ khó trung bình của những câu làm sai cao hơn**, **thời gian trả lời trung bình dài hơn**, rồi **thứ tự mã C1–C5**. Màn kết quả ghi rõ bước nào đã quyết định W1, W2 và cụm yếu nhất vào Boss. Đây là quy tắc kỹ thuật của game, không phải kết luận năng lực được chuẩn hóa.

Sau Arena 1, hệ thống chọn **W1**. Sau Arena 3, hệ thống xếp hạng lại nhưng **loại W1 khỏi danh sách chọn W2**, để Trap II tập trung vào một cụm khác. Sau Arena 4, hệ thống xếp lại toàn bộ 5 cụm và chọn 3 cụm thấp nhất cho Boss, không tự động loại W1 hay W2.

### (2) Từ cụm yếu đến Arena được sinh tự động

Generator lấy danh sách các câu có `cluster` phù hợp với mục tiêu Arena, sau đó chọn tiếp theo `difficulty` để đạt cơ cấu độ khó đã đặt. Arena 1 và Arena 3 luôn có độ phủ đủ 5 cụm; Trap I/II tập trung sâu vào một cụm; Boss chia 15 câu theo ba cụm yếu nhất với tỷ lệ **7/5/3**.

Hệ thống ưu tiên câu người chơi **chưa gặp**. Nếu không đủ câu mới ở đúng mức độ khó, engine có thể dùng lại câu đã gặp ở cùng mức (xáo lại thứ tự phương án); nếu vẫn không đủ thì dùng câu mức vừa và ghi nhận việc thay thế trong `bankLog`. Vì vậy, game **ưu tiên hạn chế lặp**, chứ không cam kết mọi lượt làm đều hoàn toàn không lặp câu.

Đây là điểm khác biệt lớn với một quiz thông thường: **hai người có kết quả chẩn đoán khác nhau có thể nhận được các Arena nhắm vào các cụm kiến thức khác nhau**, dù cùng chơi một game và tuân theo cùng một bộ luật.

### (3) Từ kết quả mỗi Arena đến tiến trình và Credit

Game sử dụng tỷ lệ đúng của từng Arena để xác định đỗ/trượt:

```text
Arena Score = Số câu trả lời đúng / Tổng số câu của Arena
```

Khác với điểm chẩn đoán, **Arena Score tính cả câu trả lời đúng có sử dụng Bùa**, vì mục đích của chỉ số này là quyết định vượt vòng. Ngưỡng đỗ được đặt lần lượt là **70% / 75% / 75% / 85% / 90%** cho 5 Arena.

Khi vượt Arena, người chơi được thưởng Credit theo bậc kết quả:

* Đỗ và đạt từ 70% đến dưới 80%: **+2 Credit**.
* Đỗ và đạt từ 80% đến dưới 90%: **+3 Credit**.
* Đỗ và đạt từ 90% trở lên: **+4 Credit**.
* Lần đầu vượt Boss: **+5 Credit bổ sung**.

Credit được cộng vào trạng thái game trước khi hiệu ứng đồng xu chạy, nên đóng tab khi xu đang rơi không làm mất Credit.

Người chơi có thể mua **Bùa Loại Trừ với 3 Credit** để bỏ một đáp án sai. Arena 2, Arena 3, Arena 4 và Boss được dùng tối đa **một Bùa mỗi vòng**; Arena 1 và World Quest không được dùng Bùa.

Ở Arena 3, Arena 4 và Boss, thời gian quá giới hạn làm phát sinh phạt Credit:

```text
Số Credit bị phạt của một câu
= ceil(max(0, Thời gian thực tế − Giới hạn thời gian) / 10 giây)
```

Hết giờ không tự khóa câu hỏi; người chơi vẫn có thể trả lời và chịu phạt tương ứng. Trượt vòng vẫn bị phạt; thoát giữa Arena 3 hoặc Arena 4 vẫn trừ phần phạt đã phát sinh. Số dư Credit không được giảm xuống dưới 0.

Sau Arena 4, người chơi phải có và **chi 15 Credit** để mở Boss. Trượt Boss thì Boss vẫn mở; chủ động thoát giữa Boss thì mất 15 Credit đã trả và Boss khóa lại. Nếu chưa đủ Credit, người chơi có thể vào World Quest. Quest gồm 15 câu, **5 câu cho mỗi cụm trong 3 cụm yếu nhất**, ưu tiên câu đã gặp; thưởng **0 / +2 / +3 / +4 Credit** theo các mốc dưới 9, 9–11, 12–13 và 14–15 câu đúng. Quest không đóng góp vào chẩn đoán, không thay đổi W1/W2, không thay đổi nhóm Boss và không cộng vào kết quả so sánh cuối game.

### (4) Tách riêng ba hệ thống đo để tránh đánh đồng kết quả

Nhóm thiết kế ba chỉ số có vai trò khác nhau:

| Chỉ số | Dữ liệu sử dụng | Mục đích |
|---|---|---|
| **Diagnostic Accuracy** | Câu hợp lệ của lượt đầu Arena 1–4, loại cả tử và mẫu đối với câu dùng Bùa; loại Quest | Xác định cụm yếu và sinh đề |
| **Arena Score** | Số câu đúng của lượt chơi hiện tại, kể cả câu dùng Bùa | Đỗ/trượt, thưởng Credit và mở tiến trình |
| **Performance Score** | Điểm độ khó của câu đúng **không dùng Bùa** trên tổng điểm độ khó câu hỏi của các lượt được tính | Cho người chơi thấy hiệu suất tổng hợp theo độ khó |

Công thức Performance Score:

```text
Performance Score
= Tổng điểm độ khó của câu trả lời đúng không dùng Bùa
  / Tổng điểm độ khó của tất cả câu hỏi trong lượt được tính

Điểm độ khó: Dễ = 1, Vừa = 2, Khó = 3
```

Performance Score lấy lượt đầu của Arena 1–4. Với Boss, chỉ số này lấy lượt Boss có số thứ tự nhỏ nhất trong các lượt đã trả lời đủ 15 câu (đỗ hoặc trượt); lượt trắng và lượt thoát không được tính. World Quest không nằm trong chỉ số này. Quan trọng nhất, **Performance Score không dùng để xác định W1, W2, nhóm Boss hay điều kiện đỗ/trượt**.

### (5) Từ kết quả Boss đến nhận xét cải thiện theo cụm

Sau Boss, hệ thống so sánh tỷ lệ đúng của từng cụm với mốc trước khi vào các vòng luyện chuyên sâu. Baseline được tạo bằng kết quả hợp lệ từ **Arena 1 và The Crossroads**:

```text
Baseline Accuracy của cụm
= (Số câu đúng hợp lệ ở Arena 1 + Crossroads)
  / (Số câu hợp lệ ở Arena 1 + Crossroads)

Boss Accuracy của cụm
= Số câu đúng hợp lệ trong lượt Boss đã đỗ
  / Số câu hợp lệ trong lượt Boss đã đỗ

Delta = Boss Accuracy − Baseline Accuracy
```

Ở phần so sánh Boss, **câu dùng Bùa và câu đã gặp trước đó bị loại khỏi mẫu**, nhằm giảm ảnh hưởng của trợ giúp và việc nhớ lại câu hỏi. Hệ thống có các trạng thái kết quả phù hợp từng trường hợp:

* **Đã cải thiện:** Boss Accuracy của cụm đạt ít nhất 70% và Delta không âm.
* **Đã cải thiện nhưng chưa đủ:** Boss Accuracy dưới 70% nhưng Delta dương.
* **Cần cải thiện tiếp:** các trường hợp được kiểm tra còn lại không thỏa hai điều kiện trên.
* **Không kiểm tra lại ở Boss:** cụm không được chọn vào ba cụm Boss.
* **Chưa đủ câu mới ở Boss để kết luận:** cụm được chọn nhưng mọi câu Boss của cụm đều là câu đã gặp hoặc câu dùng Bùa.

**Mốc 70% dùng cho nhãn cải thiện khác với yêu cầu 90% để vượt Boss.** Các tỷ lệ và nhãn này phản ánh kết quả **trong phiên chơi**, không khẳng định người học đã đạt chuẩn năng lực CFA hay chứng minh chính các Trap là nguyên nhân tạo ra mức cải thiện.

### (6) Lớp hành động và lượt trắng không chạm vào dữ liệu chẩn đoán

Di chuyển, chém quái và né đạn **không được ghi thành dữ liệu học tập**. Ở Arena 1–4 và World Quest, người chơi đứng yên vẫn đánh hết màn được vì quái tự tiến lại gần, nên lớp hành động không làm thay đổi cơ hội trả lời câu hỏi.

Ở Boss, mỗi lần trả 15 Credit mở Boss, người chơi có **2 lượt trắng**:

| Tình huống | Kết quả lượt | Boss còn mở? | Dữ liệu của lượt |
|---|---|---|---|
| Mất hết 2 tim khi còn lượt trắng | Lượt trắng, giảm 1 lượt trắng | Có | Không vào chẩn đoán, bảng tổng kết hay Performance Score; Bùa đã dùng không hoàn, phạt quá giờ vẫn trừ |
| Trả lời đủ 15 câu nhưng trượt | Trượt | Có | Là lượt Boss hoàn thành |
| Trả lời đủ 15 câu và đỗ | Đỗ | Kết thúc | Dùng cho cột Boss ở bảng tổng kết |
| Mất hết tim khi đã hết lượt trắng | Tính là thoát Boss | Không, khóa lại | Không tính; mất 15 Credit mở Boss, Bùa được hoàn |

Câu đã xuất hiện trong lượt trắng vẫn được coi là **đã gặp**, nên nếu lặp lại ở lượt Boss sau sẽ bị loại khỏi cột Boss của bảng tổng kết. Ví dụ chuỗi `lượt trắng → trượt 12/15 → đỗ 14/15`: Performance Score dùng lượt 12/15, còn cột Boss của bảng tổng kết dùng lượt 14/15.

---

## 6. User flow

Luồng sử dụng chính của CFA Quest:

```text
1. Người chơi mở CFA Quest trên máy tính, đi qua phần hướng dẫn
   (thẻ hướng dẫn, chỉ dẫn trên màn hình) hoặc mở bảng Luật chơi.
2. Người chơi bắt đầu hành trình Ethics với số dư 3 Credit
   và chọn Arena trên bản đồ tiến trình.
3. Arena 1 — The Gate: di chuyển bằng W, A, S, D, đánh 15 quái;
   mỗi quái bị chém mở một câu, 15 câu trải đều trên 5 cụm.
4. Hệ thống chấm kết quả, hiển thị chẩn đoán và xác định W1.
5. Arena 2 — Trap I: 10 câu thuộc W1.
6. Arena 3 — The Crossroads: 10 câu phủ cả 5 cụm,
   giới hạn 100 giây/câu.
7. Hệ thống cập nhật xếp hạng và xác định W2 khác W1.
8. Arena 4 — Trap II: 10 câu thuộc W2, giới hạn 80 giây/câu.
9. Hệ thống xác định 3 cụm yếu nhất sau Arena 4.
10. Người chơi kiểm tra số Credit; nếu muốn, vào Shop mua Bùa.
11. Nếu Credit < 15: làm World Quest 15 câu để nhận thêm Credit,
    sau đó trở lại bước kiểm tra ví.
12. Nếu Credit >= 15: trả 15 Credit để mở Boss (nhận 2 lượt trắng).
13. Boss: né đạn, chém Boss để mở từng câu; 15 câu từ 3 cụm yếu nhất,
    giới hạn 60 giây/câu, 2 tim mỗi lượt.
    - Mất hết tim: dùng 1 lượt trắng, Boss vẫn mở.
    - Trượt: Boss vẫn mở, có thể làm lại.
    - Mất hết tim khi hết lượt trắng hoặc chủ động thoát:
      mất 15 Credit, Boss khóa lại.
14. Người chơi xem bảng tổng kết, Performance Score,
    đối chiếu Baseline với Boss và xác định phần cần ôn tiếp.
```

Trong các vòng, người chơi có thể trượt và làm lại theo điều kiện của game. Kết quả của lượt làm lại ảnh hưởng đến trạng thái vượt vòng và Credit, nhưng không thay thế dữ liệu chẩn đoán của lượt đầu. Đây là một quy tắc quan trọng để giữ tính nhất quán của quá trình đánh giá.

---

## 7. Output

Sản phẩm tạo ra bốn nhóm output chính.

### (1) Bảng chẩn đoán điểm yếu

* Tỷ lệ trả lời đúng theo **5 cụm** kiến thức Ethics.
* Phân rã nội dung xuống **9 module/Standards** để người học xác định nội dung cần ôn.
* Cụm yếu nhất **W1**, cụm yếu tiếp theo **W2** và thứ tự xếp hạng các cụm.
* Giải thích cụm nào được chọn cho Trap I, Trap II và ba cụm nào được đưa vào Boss, kể cả bước phân định khi các cụm bằng tỷ lệ đúng.

Output này trả lời câu hỏi: **“Trong lượt luyện tập hiện tại, tôi đang sai nhiều ở phần nào?”**

### (2) Đề luyện được cá nhân hóa theo kết quả

* Arena 2 được sinh từ cụm W1.
* Arena 4 được sinh từ cụm W2, khác W1.
* Boss lấy nội dung từ ba cụm yếu nhất sau Arena 4 theo tỷ lệ 7/5/3.
* Mỗi Arena tuân theo số lượng câu và cơ cấu độ khó được quy định.

Output này trả lời câu hỏi: **“Tôi sẽ được luyện lại phần nào tiếp theo, và vì sao?”**

### (3) Trạng thái và kết quả trong quá trình chơi

* Số câu đúng/tổng câu và trạng thái vượt hoặc trượt từng Arena.
* Credit hiện có; Credit được thưởng, chi cho Bùa hoặc Boss, và bị trừ do quá giờ.
* Timer ở các vòng có giới hạn thời gian.
* Số quái còn lại ở Arena; thanh máu Boss, số tim và số lượt trắng còn lại ở Boss.
* Trạng thái Shop, Bùa, Boss Gate và World Quest.
* Lời giải và phân tích phương án sai để người học xem lại kiến thức.
* Lịch sử các lượt làm, gồm cả lượt trắng và lượt thoát, để giải thích kết quả cuối hành trình.

### (4) Bảng tổng kết sau Boss

* Kết quả của hành trình 5 Arena và **Performance Score**.
* Baseline Accuracy và Boss Accuracy đối với các cụm đã được kiểm tra lại ở Boss.
* Mức chênh lệch trước/sau (**Delta**) và nhãn kết quả tương ứng.
* Phân biệt các cụm có tín hiệu cải thiện, các cụm vẫn cần ôn thêm và các cụm chưa có đủ bằng chứng để kết luận; ghi chú số câu đã gặp bị loại khỏi cột Boss.

Output cuối cùng nhằm hỗ trợ hành động học tập tiếp theo: **người chơi biết nên quay lại cụm/Standard nào**, thay vì chỉ kết thúc với một con số tổng. Bảng này ghi nhận biến động tỷ lệ đúng trong game, không đo lường trực tiếp sự tiến bộ dài hạn hoặc hiệu quả nhân quả của phương pháp luyện tập.

---

## 8. Các lựa chọn thiết kế quan trọng

### (1) Tập trung vào Ethics thay vì toàn bộ chương trình CFA Level I

Nhóm chọn xây dựng một quy trình luyện tập tương đối hoàn chỉnh trong phạm vi Ethics, thay vì dàn trải trên nhiều môn. Ethics đủ đa dạng về quy tắc và tình huống để tạo các lỗi sai có ý nghĩa chẩn đoán, đồng thời cho phép nhóm kiểm soát chất lượng của Question Bank, nhãn kiến thức, generator và các trường hợp kiểm thử.

Lựa chọn này giúp sản phẩm có một mục tiêu rõ: **phát hiện cụm yếu và đưa người học quay lại đúng nội dung cần luyện**. Việc mở rộng sang các môn khác chỉ phù hợp khi logic nền tảng đã ổn định.

### (2) Dùng hai tầng 5 cụm và 9 module

Nếu chẩn đoán trực tiếp trên quá nhiều module nhỏ, số câu của một lần chơi có thể không đủ để hình thành kết quả rõ ràng. Nếu chỉ báo cáo tổng điểm Ethics, người học lại không biết cần học lại phần nào. Vì vậy, nhóm chọn **5 cụm để sinh đề và 9 module để giải thích chi tiết nội dung**.

Standard III được tách thành một cụm riêng; các Standards khác được nhóm theo cấu trúc 2 module/cụm. Cách này cân bằng khả năng vận hành generator và tính hữu ích của kết quả cho người học, dù chẩn đoán vẫn chỉ mang tính tham khảo ở cấp phiên chơi.

### (3) Đặt việc sinh đề theo dữ liệu sai làm tính năng lõi

Nhóm không thiết kế game như một chuỗi bộ đề cố định. Arena 1 tạo dữ liệu, Trap I nhắm W1, Crossroads kiểm tra lại độ phủ, Trap II bắt buộc nhắm W2 khác W1, và Boss kiểm tra ba cụm yếu nhất tại thời điểm sau Arena 4. Nhờ đó, cấu trúc chung giữ nguyên nhưng nội dung người chơi nhận được thay đổi theo bài làm.

Việc **W2 phải khác W1** cũng tránh trường hợp cả hai Trap liên tiếp luôn chỉ tập trung vào cùng một cụm và bỏ qua các nhóm kiến thức yếu khác.

### (4) Tăng độ khó qua nhiều cơ chế, không chỉ tăng điểm đỗ

Sau góp ý của giảng viên rằng độ khó giữa các vòng còn phẳng, nhóm kết hợp ngưỡng đỗ cao dần, tỷ trọng câu khó lớn hơn và đồng hồ ở ba vòng cuối. Ví dụ, Arena 2 và Arena 3 cùng yêu cầu ít nhất **8/10 câu đúng**, nhưng The Crossroads khó hơn nhờ tỷ lệ câu khó cao hơn và giới hạn thời gian. Boss yêu cầu 14/15 câu đúng với 9 câu khó để tạo thử thách cuối hành trình.

Các con số là **lựa chọn thiết kế của nhóm**, không phải chuẩn đỗ hoặc chuẩn đánh giá năng lực do CFA Institute đặt ra. Chúng cần được kiểm tra bằng phản hồi người chơi trước khi khẳng định cân bằng.

### (5) Tách mục tiêu học tập khỏi cơ chế tài nguyên và vật phẩm

Credit, Shop, Bùa, timer và Boss Gate tạo cảm giác tiến trình và lựa chọn chiến thuật, nhưng nhóm không để những yếu tố này trực tiếp quyết định cụm kiến thức yếu. Câu trả lời nhờ Bùa vẫn có thể giúp người chơi vượt Arena, nhưng không được coi là bằng chứng chẩn đoán. World Quest giúp kiếm Credit nhưng không làm thay đổi hồ sơ yếu hoặc kết luận sau Boss.

Đây là lựa chọn quan trọng để **phần game phục vụ việc luyện tập mà không làm sai lệch dữ liệu học tập**.

### (6) Sử dụng ngân hàng câu hỏi tĩnh và logic có thể kiểm thử

Nhóm lựa chọn bank JSON có nhãn rõ ràng thay vì tự tạo câu hỏi theo thời gian thực. Mỗi câu có ID, cụm, module, mức khó, đáp án và lời giải. Điều này giúp nhóm biết vì sao generator chọn một câu cụ thể, kiểm thử được các tình huống W1/W2, đồng thời tái hiện kịch bản bằng dữ liệu đầu vào xác định (Seed 7 trong `W6/demo-input.md`).

Đánh đổi là ngân hàng câu hỏi hữu hạn: những lượt chơi lại nhiều lần vẫn có nguy cơ gặp câu đã thấy. Nhóm xử lý bằng quy tắc ưu tiên câu mới và fallback, thay vì cam kết không lặp tuyệt đối.

### (7) Khóa core logic trước, rồi mới xây lớp hành động lên trên

Nhóm gắn tag **`v1.0-core`** cho bản quiz đã chạy ổn định, sau đó ngày 21/10/2026 tách toàn bộ luật game sang `cfa_quest_engine.js` (không đụng giao diện) rồi mới xây lớp hành động trên nền đó. Engine giữ nguyên thứ tự bốc đề, nên Seed 7 vẫn ra đúng bộ đề đã ghi trong tài liệu demo. Nếu lớp hành động gặp lỗi nghiêm trọng trước ngày đánh giá, nhóm quay về release `v1.0-core`.

Trong lớp hành động, nhóm chủ động chặn các đường mà thao tác tay có thể làm sai dữ liệu: quái không mang câu cố định, hình dạng quái không cho biết độ khó, thời gian di chuyển không tính vào `timeMs`, thanh máu Boss không lộ đúng/sai, và lượt Boss thua vì mất hết tim không được tính vào chẩn đoán.

### (8) Chế độ demo dùng chung code với bản chính thức

Thay vì làm một bản trình diễn riêng, nhóm thêm chế độ `?demo=1` vào chính link GitHub Pages. Khi chọn kịch bản, câu hỏi và đáp án mỗi màn cố định theo kịch bản; nút **Chạy kịch bản** tự hoàn tất màn và báo nếu kết quả engine khác kết quả mong đợi. Lượt demo không ghi đè tiến trình chơi thường. Bốn kịch bản dùng để chứng minh: (1) toàn bộ luồng Seed 7, (2) đổi đúng một câu làm một màn lật từ đỗ sang trượt, (3) phân định khi hai cụm bằng tỷ lệ đúng, (4) bật/tắt Bùa để thấy Arena Score và Diagnostic Accuracy chạy độc lập.

---

## 9. Điểm nhóm thấy làm tốt

### (1) Xác định được một tính năng lõi khác biệt với quiz thông thường

Điểm nổi bật nhất của CFA Quest là khả năng sử dụng kết quả trả lời theo cụm để quyết định nội dung của Arena tiếp theo. Nếu bỏ quá trình **Diagnose → Rank Weakness → Generate Targeted Arena**, sản phẩm sẽ chỉ còn là một bộ câu hỏi Ethics được trình bày bằng giao diện trò chơi. Nhóm đã xây dựng được logic trung tâm tương đối rõ từ bài toán người dùng đến cơ chế kỹ thuật.

### (2) Xây dựng được ngân hàng câu hỏi có cấu trúc phục vụ generator

Ngân hàng **220 câu** được chia đều cho 5 cụm và gắn nhãn chi tiết theo module, sub-standard và difficulty. Các trường `explanation`, `hint` và `distractor_reason` giúp câu hỏi không chỉ phục vụ chấm đúng/sai mà còn hỗ trợ phản hồi học tập. Toàn bộ câu hỏi do nhóm tự biên soạn; công cụ `tools/validate_question_bank.html` kiểm tra cấu trúc bank trước khi đưa vào game.

### (3) Tách bạch được chẩn đoán, kết quả vượt vòng và hiệu suất tổng hợp

Nhóm không sử dụng một điểm số duy nhất cho tất cả mục tiêu. **Diagnostic Accuracy** hỗ trợ xác định cụm yếu; **Arena Score** phục vụ tiến trình game; còn **Performance Score** giúp quan sát hiệu suất có tính đến độ khó câu hỏi. Việc loại câu dùng Bùa, World Quest và lượt trắng khỏi các phép đo không phù hợp giúp hạn chế những kết luận sai từ cơ chế chơi.

### (4) Tạo được một vòng trải nghiệm hoàn chỉnh, có lớp game thật

Sản phẩm có tuyến chơi rõ từ mở game, hướng dẫn, chẩn đoán ban đầu, hai vòng Trap, Crossroads, Credit/Shop, Boss Gate, World Quest, trận Boss né đạn đến bảng tổng kết. Hình ảnh nhân vật, quái, Boss, sàn đấu và giao diện do thành viên nhóm thiết kế, được xử lý thành bộ asset nhẹ (khoảng 6,1 MB) để game tải nhanh. Độ khó và tài nguyên được đưa vào có vai trò cụ thể thay vì chỉ để trang trí.

### (5) Có kiểm thử tự động, kịch bản demo và tài liệu truy vết được

Bên cạnh source code, nhóm có các tài liệu `SOLUTION_STRUCTURE`, `INPUT_DICTIONARY`, `feature-scope`, `user-flow`, `limitations`, `testing`, `bug-log`, `deployment` và `demo-input`. Thư mục `test/` có **20 test tự động** (chạy bằng `node --test`, hiện pass 20/20), kiểm tra từng con số của Seed 7, cả 4 kịch bản demo, luật phạt quá giờ, thoát giữa vòng, Bùa, thưởng World Quest và luật lượt trắng. 23 lỗi ghi nhận ở bản v10 đều đã sửa và được xác nhận lại trên bản v11. Các tình huống mô phỏng **không thay thế cho thử nghiệm với người dùng thật**.

---

## 10. Hạn chế hiện tại

### (1) Kết quả chẩn đoán dựa trên mẫu câu hỏi còn nhỏ

Baseline cho mỗi cụm chủ yếu được lấy từ **3 câu ở Arena 1 và 2 câu ở Crossroads**, tức tối đa 5 câu/cụm trước Boss. Boss chỉ kiểm tra lại 3 cụm yếu nhất với 7/5/3 câu. Vì thế, chỉ cần thay đổi một câu đúng/sai cũng có thể làm tỷ lệ biến động đáng kể. Kết quả phù hợp để gợi ý nội dung ôn trong phiên, nhưng chưa đủ để khẳng định trình độ Ethics một cách ổn định.

### (2) Ngân hàng 220 câu vẫn có giới hạn khi chơi lại nhiều lần

220 câu là nền tảng đủ rõ cho bản demo, nhưng ngân hàng câu khó của từng cụm không vô hạn. Nếu người chơi làm lại Trap hoặc Boss nhiều lần, generator có thể phải chọn câu đã gặp hoặc đổi xuống câu mức vừa. Khi đó, kết quả có thể bị tác động bởi việc nhớ câu hỏi, và cơ cấu độ khó thực tế có thể khác với thiết kế ban đầu.

### (3) Chưa có kiểm chứng rộng rãi với người chơi thật

Các ngưỡng đỗ, mốc thời gian, mức phạt, giá mở Boss, phần thưởng Quest và tham số lớp game (tốc độ quái, tốc độ đạn, số tim) hiện là **các giả định thiết kế**, chưa được hiệu chỉnh từ dữ liệu playtest thực tế. Đặc biệt, Boss yêu cầu 14/15 câu đúng, trong đó 9 câu khó, có thể là một rào cản quá lớn với một số người đang ôn Ethics. Nhóm chưa có đủ dữ liệu để kết luận các mốc này đã tối ưu cho động lực học tập hoặc tỷ lệ hoàn thành.

### (4) World Quest và việc làm lại có thể khiến người chơi nhớ đáp án của câu hỏi

World Quest ưu tiên những câu người chơi từng gặp ở các Arena trước để tránh tiêu hao quá nhanh câu mới dành cho Boss. Cách làm này hữu ích cho vòng ôn và kiếm Credit, nhưng cũng khiến điểm Quest có thể cao lên nhờ nhớ đáp án. Vì thế, nhóm chủ động **không sử dụng Quest làm bằng chứng cho việc cải thiện kiến thức**.

### (5) Timer và trạng thái sử dụng Bùa chưa phản ánh đầy đủ năng lực

Thời gian đo bằng trình duyệt có thể chịu ảnh hưởng bởi chuyển tab, máy chậm hoặc các gián đoạn khác. Bùa cũng làm thay đổi điều kiện trả lời một câu. Vì vậy, câu dùng Bùa được tách khỏi chẩn đoán và thời gian quá giờ chỉ nên hiểu là **vi phạm giới hạn của luật game**, không phải bằng chứng trực tiếp rằng người học phản xạ chậm hoặc yếu kiến thức.

### (6) So sánh Baseline và Boss chưa chứng minh nguyên nhân của sự cải thiện

Nếu Boss Accuracy cao hơn Baseline, game chỉ có thể ghi nhận rằng **tỷ lệ đúng ở mẫu câu được kiểm tra tại Boss cao hơn mẫu ban đầu**. Sự thay đổi có thể chịu ảnh hưởng của việc luyện tập, độ khó, số lượng câu, sự lặp lại hoặc các yếu tố khác. Không nên khẳng định Trap đã làm người học tiến bộ nếu chưa có phương pháp đánh giá riêng.

### (7) Kỹ năng né đạn có thể cản tiến trình dù không ảnh hưởng chẩn đoán

Lượt Boss thua vì mất hết tim không được tính vào chẩn đoán, nên kỹ năng điều khiển không làm sai hồ sơ điểm yếu. Tuy vậy, nó vẫn ảnh hưởng tới **tiến trình**: mất hết tim lần thứ ba trong một lần mở khóa bị tính là thoát Boss, người chơi mất 15 Credit và phải kiếm lại. Một người nắm chắc Ethics nhưng không quen điều khiển bàn phím có thể bị chậm lại vì lý do không liên quan tới kiến thức. Các tham số độ khó của đạn chưa được hiệu chỉnh bằng dữ liệu người chơi.

### (8) Chỉ hỗ trợ máy tính có bàn phím

Lớp hành động cần W, A, S, D nên bản cuối không hỗ trợ điện thoại và màn hình cảm ứng; trên các thiết bị này game hiện thông báo và không cho vào màn chơi. Đây là thu hẹp phạm vi có chủ đích so với bản quiz trước đó, vốn chạy được trên điện thoại.

---

## 11. Điều nhóm học được

### (1) Giá trị của sản phẩm phải bắt đầu từ vấn đề học tập cụ thể

Nhóm nhận ra rằng thêm yếu tố game vào một bộ trắc nghiệm chưa đủ để tạo giá trị khác biệt. Câu hỏi quan trọng hơn là **sau khi làm sai, người học nhận được sự hỗ trợ gì mà cách luyện thông thường chưa cung cấp tốt?** Với CFA Quest, câu trả lời là hồ sơ điểm yếu theo cụm và vòng luyện tiếp theo được sinh từ hồ sơ đó.

Việc xác định đúng core process giúp nhóm có tiêu chí lựa chọn tính năng. Những cơ chế như Shop, Credit, timer hay lớp hành động có thể tăng tính tương tác, nhưng vẫn phải phục vụ hoặc ít nhất không làm sai lệch logic học tập.

### (2) Muốn cá nhân hóa đề luyện thì dữ liệu đầu vào phải được thiết kế kỹ

Quá trình sinh Arena không thể hoạt động đúng nếu ngân hàng chỉ có câu hỏi và đáp án. Nhóm phải gắn nhãn câu theo cụm, module, sub-standard và độ khó, đồng thời quản lý danh sách câu đã gặp. Chất lượng dữ liệu đầu vào ảnh hưởng trực tiếp đến việc chẩn đoán có ý nghĩa và đề được tạo có đúng mục tiêu hay không.

Nhóm cũng học được rằng mọi quy tắc chọn câu đều cần có trường hợp dự phòng. Khi không đủ câu mới ở một mức khó, hệ thống phải biết fallback như thế nào và ghi nhận sự thay đổi thay vì để generator hoạt động không ổn định.

### (3) Kết quả học tập và phần thưởng game không nên bị đánh đồng

Trong quá trình xây dựng sản phẩm, nhóm phải phân biệt ba câu hỏi: người chơi **đang sai nhiều ở đâu**, **có vượt được Arena không**, và **hiệu suất tổng hợp ra sao**. Một câu trả lời đúng nhờ Bùa có thể hợp lệ để vượt vòng nhưng không nên được dùng như bằng chứng người học đã tự nắm kiến thức đó.

Tương tự, làm World Quest nhiều lần có thể giúp kiếm Credit, và né đạn giỏi giúp qua Boss nhanh hơn, nhưng cả hai không chứng minh kết quả học tập tăng lên. Bài học quan trọng là cần thiết kế phép đo phù hợp với đúng mục đích của từng dữ liệu.

### (4) Tách engine khỏi giao diện thì mới thay được hình thức chơi an toàn

Khi chuyển từ giao diện quiz sang lớp hành động, phần khó nhất không phải vẽ quái hay đạn mà là giữ cho luật game không bị đổi theo. Việc gắn tag `v1.0-core` trước, tách engine thành file riêng, rồi dùng test Seed 7 để kiểm tra rằng bộ đề vẫn ra y hệt giúp nhóm thay đổi lớn ở giao diện mà vẫn chứng minh được logic chẩn đoán không bị ảnh hưởng.

Nhóm cũng học được rằng mỗi luật mới của lớp game (tim, lượt trắng, thoát Boss) đều kéo theo câu hỏi về dữ liệu: lượt đó có được tính không, Credit và Bùa xử lý ra sao. Những câu hỏi này phải được chốt bằng văn bản và test trước khi code.

### (5) Làm việc nhóm cần một nguồn tài liệu thống nhất và quy trình kiểm thử

CFA Quest gồm các phần liên kết chặt: câu hỏi Ethics, kịch bản game, logic chẩn đoán, giao diện, hình ảnh, luật Credit và báo cáo kết quả. Một thay đổi về ngưỡng đỗ hoặc trạng thái Bùa có thể ảnh hưởng đồng thời đến source code, file mô tả, kết quả demo và test case.

Vì thế, nhóm học được rằng phân công riêng từng phần là chưa đủ; còn cần quản lý phiên bản, xác định tài liệu nào là bản mới nhất (nhóm dùng `SOLUTION_STRUCTURE.md` làm nguồn chuẩn) và kiểm tra tác động khi ghép thay đổi. Tài liệu limitation cũng giúp nhóm phân biệt **điều sản phẩm thực sự đo được** với **điều mới là kỳ vọng hoặc giả định thiết kế**.

---

## 12. Gợi ý cho khóa sau

### (1) Kiểm chứng vấn đề và cho đúng người dùng mục tiêu chơi thử sớm

Nên mời những người đang ôn CFA Level I Ethics trải nghiệm sản phẩm, không chỉ hỏi họ game có đẹp hoặc thú vị hay không. Điều quan trọng hơn là sau khi hoàn thành Arena 1, họ có hiểu bảng chẩn đoán không; sau Trap, họ có nhận ra mình đang được luyện đúng cụm yếu không; và sau Boss, họ có biết nên học lại nội dung nào không.

Nếu có đủ dữ liệu, có thể theo dõi tỷ lệ vượt từng Arena, số lượt World Quest, số lượt trắng ở Boss, thời gian hoàn thành, tần suất dùng Bùa và khả năng hiểu bảng kết quả để điều chỉnh gameplay.

### (2) Ưu tiên chất lượng ngân hàng câu hỏi và nhãn kiến thức

Một game luyện Ethics phụ thuộc nhiều vào chất lượng câu hỏi. Khóa sau nên tiếp tục rà soát độ chính xác của `answer`, `explanation`, `distractor_reason`, mức khó và nhãn `cluster/module/sub_standard`, đồng thời bổ sung câu mới cho những cụm hoặc mức khó dễ bị cạn khi replay.

Trước khi mở rộng số lượng câu, cần kiểm tra xem các tình huống có thực sự đánh giá đúng nguyên tắc Ethics dự định hay không, tránh tạo sự khó khăn chỉ vì cách diễn đạt rối hoặc đáp án gây hiểu nhầm.

### (3) Hiệu chỉnh ngưỡng đỗ, thời gian và Credit bằng dữ liệu thực tế

Các mức 70/75/75/85/90%, timer 100/80/60 giây, chi phí Boss 15 Credit và thưởng Quest nên được coi là điểm xuất phát để thử nghiệm. Cần đo xem người chơi mất bao nhiêu lượt để qua Boss, có phải làm World Quest quá nhiều hay không, và việc phạt quá giờ có gây cản trở học tập hay không.

Nếu Boss quá khó hoặc vòng kiếm Credit trở nên lặp lại, nên thay đổi cân bằng gameplay trước khi thêm nhiều hiệu ứng giải trí mới.

### (4) Phát triển đo lường kết quả một cách thận trọng hơn

Có thể bổ sung số câu hợp lệ bên cạnh mỗi tỷ lệ đúng, phân biệt câu mới và câu lặp, thể hiện rõ giới hạn mẫu và tổ chức bài kiểm tra lại bằng những câu chưa gặp. Khi trình bày kết quả, nên giữ các cách diễn đạt như **“có tín hiệu cải thiện trong lượt chơi”** thay vì khẳng định người học đã tiến bộ về năng lực hoặc một cơ chế cụ thể đã tạo ra thay đổi đó.

Nên đánh giá xem việc nhóm 9 module thành 5 cụm còn phù hợp khi ngân hàng và số lượng người dùng mở rộng; nếu cần, tăng độ chi tiết khi đã có đủ số câu để chẩn đoán đáng tin cậy hơn.

### (5) Giữ lớp hành động ở vai trò trải nghiệm, và tinh chỉnh nó bằng playtest

Nếu tiếp tục phát triển lớp hành động, nên giữ nguyên nguyên tắc hiện tại: kết quả học thuật chỉ phụ thuộc vào câu trả lời hợp lệ, không đánh đồng khả năng điều khiển nhân vật với hiểu biết Ethics. Các việc nên làm tiếp: chỉnh tốc độ đạn và số tim theo dữ liệu chơi thử để Boss khó vì câu hỏi chứ không khó vì thao tác; cân nhắc chế độ hỗ trợ (ví dụ thêm tim) cho người không quen chơi game; và nếu muốn quay lại điện thoại thì cần thiết kế điều khiển cảm ứng riêng. Mỗi luật mới phải có test riêng cho các trường hợp thoát giữa vòng, làm lại Boss, mất lượt và tác động đến Credit.

### (6) Dùng GitHub, bộ test và release làm nền tảng bàn giao

Khi phát triển với nhiều thành viên, nên cập nhật mã nguồn thường xuyên, ghi rõ thay đổi có ảnh hưởng đến luật game và thống nhất phiên bản của `SOLUTION_STRUCTURE`, `INPUT_DICTIONARY`, `feature-scope` và các file demo. Bộ test cần bao phủ các trường hợp dễ gây sai: hai cụm cùng tỷ lệ đúng, W2 trùng W1, thiếu câu mới theo difficulty, dùng Bùa, replay, phạt quá giờ, không đủ Credit, lượt trắng và cách lấy dữ liệu cho bảng tổng kết Boss.

Nên gắn tag cho mỗi bản ổn định trước khi làm thay đổi lớn, giống cách nhóm dùng `v1.0-core` làm điểm quay lui. Sản phẩm có giá trị hơn khi không chỉ chạy được mà còn **giải thích được vì sao mỗi Arena được sinh ra và mỗi kết luận được đưa ra**.

---

## Bản đồ evidence trong repository

Rà soát ngày 22/10/2026, commit `bd3937d` trên nhánh `main`.

| Cần tìm | Ở đâu |
|---|---|
| Link sản phẩm, bản dự phòng, cách chạy offline | [GitHub Pages](https://ftu-legacy-63.github.io/G07/src/cfa_quest_v11.html) · [`W6/deployment.md`](https://github.com/FTU-Legacy-63/G07/blob/main/W6/deployment.md) |
| README tổng quan | [`README.md`](https://github.com/FTU-Legacy-63/G07/blob/main/README.md) |
| Source code | [Engine](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_engine.js) · [Giao diện và lớp hành động](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_v11.js) · [HTML](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_v11.html) · [Kịch bản demo](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_scenarios.js) · [Asset](https://github.com/FTU-Legacy-63/G07/blob/main/src/asset/README_ASSETS.md) |
| Logic, công thức, luật lớp game | [`docs/SOLUTION_STRUCTURE.md`](https://github.com/FTU-Legacy-63/G07/blob/main/docs/SOLUTION_STRUCTURE.md) (Mục 5 công thức, Mục 15 lớp hành động) · [`docs/feature-scope.md`](https://github.com/FTU-Legacy-63/G07/blob/main/docs/feature-scope.md) · [`docs/user-flow.md`](https://github.com/FTU-Legacy-63/G07/blob/main/docs/user-flow.md) |
| Input, dữ liệu, nguồn, giả định | [`data/ethics_bank_220.json`](https://github.com/FTU-Legacy-63/G07/blob/main/data/ethics_bank_220.json) · [`docs/INPUT_DICTIONARY.md`](https://github.com/FTU-Legacy-63/G07/blob/main/docs/INPUT_DICTIONARY.md) · [`docs/SOURCE_USE_MAP.md`](https://github.com/FTU-Legacy-63/G07/blob/main/docs/SOURCE_USE_MAP.md) · [`docs/ASSUMPTIONS.md`](https://github.com/FTU-Legacy-63/G07/blob/main/docs/ASSUMPTIONS.md) · [`tools/validate_question_bank.html`](https://github.com/FTU-Legacy-63/G07/blob/main/tools/validate_question_bank.html) |
| Kiểm thử | [`test/`](https://github.com/FTU-Legacy-63/G07/tree/main/test) (20 test, chạy `node --test`) · [`W6/testing.md`](https://github.com/FTU-Legacy-63/G07/blob/main/W6/testing.md) · [`W6/demo-input.md`](https://github.com/FTU-Legacy-63/G07/blob/main/W6/demo-input.md) |
| Trạng thái lỗi | [`W6/bug-log.md`](https://github.com/FTU-Legacy-63/G07/blob/main/W6/bug-log.md) |
| Hạn chế | [`W6/limitations.md`](https://github.com/FTU-Legacy-63/G07/blob/main/W6/limitations.md) |
| Lịch sử thay đổi | [`docs/revision_summary.md`](https://github.com/FTU-Legacy-63/G07/blob/main/docs/revision_summary.md) · bảng Revision trong README · [`MIDTERM_VERIFICATION.md`](https://github.com/FTU-Legacy-63/G07/blob/main/MIDTERM_VERIFICATION.md) |
| Đóng góp thành viên | [`contribution/`](https://github.com/FTU-Legacy-63/G07/tree/main/contribution) (contribution map và Individual Footprint của từng thành viên) |
| Phiên bản | Tag [`v1.0-core`](https://github.com/FTU-Legacy-63/G07/releases/tag/v1.0-core) — bản core trước khi thêm lớp hành động, dùng làm điểm quay lui. Bản nộp cuối được gắn tag riêng tại [Releases](https://github.com/FTU-Legacy-63/G07/releases). |
