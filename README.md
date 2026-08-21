# CFA Quest — Checkpoint Tuần 1

> **Học phần:** NHA408E  
> **Ý tưởng:** Một trò chơi luyện tập CFA Level 1 theo phong cách RPG Dungeon, trong đó người chơi vượt qua các Area, Level và Boss bằng cách trả lời câu hỏi CFA. Mục tiêu chính là làm cho quá trình luyện tập câu hỏi multiple choice trở nên thú vị hơn và giảm cảm giác nhàm chán khi phải luyện tập lặp đi lặp lại.





## Thành viên nhóm

| Thành viên | Vai trò |
|---|---|
| **Quỳnh** | Project Lead + Game Structure Developer |
| **Hồng** | CFA Question Bank + Quiz Engine Developer |
| **Trang** | Special Mechanics Developer |
| **Minh** | Player Points + Shop + Inventory Developer |
| **Khôi** | Frontend/UI + Result Analytics + QA Lead |

---

# 1. Các Problem Candidates (đề xuất vấn đề)

## Đề xuất 1 — Sự nhàm chán khi luyện tập CFA lặp đi lặp lại

Người đang ôn CFA Level 1 phải luyện tập một lượng lớn câu hỏi multiple choice thuộc nhiều môn khác nhau. Khi hoạt động luyện tập chủ yếu lặp lại theo chu trình **đọc câu hỏi → chọn đáp án → kiểm tra kết quả → làm câu tiếp theo**, quá trình ôn luyện có thể trở nên đơn điệu và nhàm chán.

Đây là vấn đề được VER2 xác định trực tiếp khi mô tả người dùng mục tiêu là những người cần luyện multiple choice nhưng cảm thấy quá trình luyện tập căng thẳng và nhàm chán.

### Đề xuất 2 — Quá trình luyện tập CFA có thể tạo cảm giác căng thẳng

Ngoài sự nhàm chán, việc phải liên tục làm một số lượng lớn câu hỏi để đạt mức điểm yêu cầu có thể khiến quá trình luyện thi trở nên căng thẳng.

VER2 vì vậy không chỉ hướng tới tạo thêm sự thú vị mà còn muốn biến quá trình luyện tập thành một trải nghiệm có thử thách và tiến trình rõ ràng hơn.

### Đề xuất 3 — Hoạt động luyện câu hỏi thông thường thiếu sự đa dạng về trải nghiệm

Một bộ câu hỏi thông thường chủ yếu tập trung vào việc trả lời và tính điểm. Người học có ít thay đổi về hình thức tương tác trong suốt quá trình luyện tập.

VER2 đề xuất bổ sung các yếu tố như:

- Area và Level;
- Boss;
- hệ thống điểm;
- Trap;
- Gamble;
- Side Quest;
- Shop và Item;

để cùng một hoạt động luyện CFA có nhiều trạng thái và thử thách khác nhau.


## Hướng vấn đề được lựa chọn

Nhóm lựa chọn:

> **Đề xuất 1 — Sự nhàm chán khi luyện tập CFA Level 1 lặp đi lặp lại.**

Đây là vấn đề phù hợp nhất với mục tiêu ban đầu của VER2.

Các yếu tố như Area, Level, Boss, Trap, Gamble, Side Quest và Shop không phải mục tiêu cuối cùng của sản phẩm mà là **các cơ chế được sử dụng để giải quyết vấn đề nhàm chán**.

### Logic của nhóm

**Người học vẫn cần luyện CFA questions**  
↓  
**Không thay thế hoạt động luyện tập**  
↓  
**Thay đổi trải nghiệm xung quanh hoạt động luyện tập**  
↓  
**Biến practice thành một game có progression và challenge**  
↓  
**Giảm cảm giác lặp lại và nhàm chán**

---

# 2. Target User (Người dùng mục tiêu được lựa chọn)

Đối tượng người dùng chính là:

> **Người đang ôn thi CFA Level 1 và cần luyện tập câu hỏi multiple choice.**

Người dùng này:

- cần luyện tập kiến thức của nhiều môn CFA;
- cần làm nhiều câu hỏi để kiểm tra khả năng của bản thân;
- có thể phải lặp lại hoạt động luyện tập nhiều lần;
- có nhu cầu biết mình đang mạnh hoặc yếu ở topic nào;
- cảm thấy cách luyện câu hỏi thông thường có thể trở nên căng thẳng và nhàm chán.

VER2 chia nội dung CFA thành 5 Area chính và một Side Quest Area để người dùng luyện tập trên nhiều nhóm kiến thức khác nhau.

### Phạm vi người dùng ở Tuần 1

Ở giai đoạn hiện tại, nhóm **chưa mở rộng người dùng sang sinh viên tài chính nói chung hoặc người học kiến thức mới**.

Sản phẩm được xác định là:

> **Game luyện tập cho người đang ôn CFA Level 1.**



# 3. User Task / Decision (Nhiệm vụ hoặc quyết định của người dùng)

## Nhiệm vụ cốt lõi

Người dùng cần:

> **Luyện tập câu hỏi CFA Level 1 và cố gắng vượt qua các Level/Area bằng cách đạt mức độ chính xác yêu cầu.**

Game không thay đổi nhiệm vụ học tập cơ bản. Người chơi vẫn phải đọc và trả lời câu hỏi CFA.

Điểm thay đổi là nhiệm vụ đó được đưa vào một hành trình game.

## Luồng nhiệm vụ chính

**Chọn Area**  
→ **Chọn Level**  
→ **Trả lời CFA Questions**  
→ **Tính Pts và MPS**  
→ **Pass / Fail**  
→ **Tích lũy điểm**  
→ **Tiếp tục Level**  
→ **Boss**  
→ **Unlock Area tiếp theo**  
→ **Final Boss**

Mỗi Area gồm 10 Level thường và 1 Boss. Level 1 bắt đầu với 5 câu và mỗi Level tiếp theo tăng thêm 2 câu. Sau khi hoàn thành 5 Area, người chơi mở Final Boss là mock test 180 câu.

---

## Các quyết định bổ sung của người chơi

Ngoài việc trả lời câu hỏi, người chơi còn phải đưa ra một số quyết định trong quá trình chơi:

### Gamble

Khi gặp Boss:

> Có cược một phần accumulated points để đổi lấy khả năng nhận thêm Smart Pts hay không?

Các mức cược:

**10% / 25% / 50% / 75% / 100%**

### Side Quest

Sau khi hoàn thành Area:

> Có thực hiện thêm Side Quest để kiếm thêm điểm hay tiếp tục hành trình chính?

### Shop

Người chơi quyết định:

> Có sử dụng accumulated points để mua Item hay giữ điểm?

### Item

Người chơi quyết định thời điểm sử dụng các Item như:

- Skip Key;
- Leverage Token;
- Savings Account;
- Trap Insurance.

Như vậy, game bổ sung **decision-making** vào một hoạt động vốn chủ yếu chỉ có trả lời câu hỏi.

---

# 4. Draft Problem Statement (Bản nháp phát biểu vấn đề)

> **Người đang ôn CFA Level 1 cần luyện tập một lượng lớn câu hỏi multiple choice, nhưng việc thực hiện liên tục các bộ câu hỏi theo cùng một hình thức có thể khiến quá trình luyện tập trở nên căng thẳng, lặp lại và nhàm chán, từ đó làm giảm sự hứng thú trong quá trình ôn luyện.**

### Lưu ý

Problem statement ở giai đoạn này **không đề cập RPG, Area, Boss, Shop hay bất kỳ giải pháp công nghệ cụ thể nào**.

Các cơ chế đó thuộc phần **solution**, không thuộc phần **problem**.

---

# 5. Initial Source / Observation  
## Nguồn giả định ban đầu & kế hoạch quan sát

Vấn đề hiện tại xuất phát trực tiếp từ giả định được đặt ra trong VER2:

> Người đang ôn CFA Level 1 cần luyện multiple-choice nhưng cảm thấy quá trình ôn luyện căng thẳng và nhàm chán.

Ở Checkpoint Tuần 1, nhóm xem đây là một **giả định cần được kiểm chứng**, thay vì mặc định rằng mọi người học CFA đều cảm thấy như vậy.

---

## Kế hoạch kiểm chứng

Nhóm có thể thực hiện một buổi quan sát hoặc thử nghiệm quy mô nhỏ với người thuộc nhóm người dùng mục tiêu.

### Phần 1 — Conventional practice

Người tham gia làm một bộ câu hỏi CFA theo hình thức thông thường.

Ghi nhận:

- mức độ hứng thú;
- cảm giác lặp lại;
- mức độ muốn tiếp tục;
- số câu hoàn thành;
- cảm nhận sau khi kết thúc.

### Phần 2 — Gamified practice

Người tham gia làm lượng câu hỏi tương đương nhưng đặt trong prototype của CFA Quest.

Ghi nhận lại các yếu tố tương tự.

### Các câu hỏi cần quan sát

- Người dùng có cảm thấy việc luyện câu hỏi thông thường nhàm chán hay không?
- Người dùng có muốn tiếp tục luyện sau khi hoàn thành một Level không?
- Area/Level/Boss có tạo cảm giác tiến triển không?
- Trap hoặc Side Quest có làm trải nghiệm đa dạng hơn không?
- Gamble và Shop có khiến người dùng chú ý đến game nhiều hơn việc luyện CFA không?
- Người dùng thích hình thức nào hơn khi lượng câu hỏi CFA tương đương?

### Điểm quan trọng

Mục đích của thử nghiệm **không phải chứng minh người chơi làm đúng nhiều câu hơn ngay lập tức**.

Điều nhóm cần kiểm chứng trước tiên là:

> **Gamification có thực sự làm trải nghiệm luyện tập bớt nhàm chán hơn không?**

---

# 6. Vì sao đây là vấn đề tài chính hoặc ngân hàng?

Sản phẩm liên quan trực tiếp tới lĩnh vực tài chính vì nội dung luyện tập được xây dựng dựa trên chương trình **CFA Level 1**.

VER2 chia 10 môn CFA thành các Area:

| Area | CFA Topics |
|---|---|
| **Area 1** | FSA + Corporate Finance |
| **Area 2** | Equity + Fixed Income |
| **Area 3** | Derivatives + Alternative Investments |
| **Area 4** | Economics + Ethics |
| **Area 5** | Quantitative Methods + Portfolio Management |
| **Area 6** | Side Quest |



Người chơi không thực hiện các mini-game không liên quan đến tài chính để tiến bộ.

**Core activity vẫn là trả lời câu hỏi CFA.**

Gamification chỉ được đặt xung quanh hoạt động luyện tập đó nhằm thay đổi trải nghiệm người dùng.

Vì vậy:

> **Financial content = nội dung cốt lõi.**  
> **Game mechanics = phương thức tạo engagement.**

---

# 7. Đóng góp của từng thành viên

## Phân công tổng thể

| Thành viên | Vai trò | Sản phẩm cuối cùng | Sản phẩm Tuần 1 |
|---|---|---|---|
| **Quỳnh** | Project Lead + Game Structure Developer | Xây dựng cấu trúc tổng thể của game gồm Area → Level → Boss → Unlock; quản lý Player Progress; tích hợp module của cả nhóm; xây dựng pseudocode tổng hệ thống. | **Game flow chart**, thống nhất tên biến chung, quan hệ Area → Level → Boss → Unlock, cấu trúc folder/code và sơ đồ trạng thái người chơi. |
| **Hồng** | CFA Question Bank + Quiz Engine Developer | Xây dựng Question Bank, Quiz Engine, scoring/MPS, answer explanation và dữ liệu phục vụ analytics. | Thiết kế **question data schema** thống nhất gồm `question`, `options`, `correctAnswer`, `explanation`, `subject`, `topic`, `area`, `difficulty`. |
| **Trang** | Special Mechanics Developer | Xây dựng Trap, Gamble và Side Quest; xử lý logic kích hoạt, Pass/Fail, penalty, reward và replay. | Xây dựng logic **Trap 20% ở Normal Level** và cơ chế kích hoạt/chuyển sang Trap khi điều kiện xảy ra. |
| **Minh** | Player Points + Shop + Inventory Developer | Xây dựng Point Manager, Shop, Inventory và toàn bộ Item: Skip Key, Leverage Token, Savings Account, Trap Insurance. | Xác định **Player Economy Data Model** gồm `accumulatedPts`, `smartPts`, `inventory`, `itemOwned`, `itemUsed`. |
| **Khôi** | Frontend/UI + Result Analytics + QA Lead | Xây dựng giao diện toàn game, Result Analytics, QA checklist và demo flow từ đầu đến cuối. | Vẽ **wireframe toàn bộ màn hình**, xác định UI flow và thống nhất giao diện trước khi bắt đầu code frontend. |

---



# 8. Open Questions (Câu hỏi còn bỏ ngỏ)

1. **Người đang ôn CFA Level 1 có thực sự cảm thấy việc luyện multiple-choice lặp đi lặp lại nhàm chán hay không?**

2. **Mức độ nhàm chán có đủ lớn để người dùng muốn chuyển sang một hình thức gamified practice không?**

3. **Area, Level và Boss có thực sự tạo cảm giác progression hay chỉ thay đổi cách trình bày của một bộ câu hỏi?**







# Hướng đi hiện tại của Tuần 1

- **Người dùng mục tiêu:** Người đang ôn CFA Level 1 và cần luyện tập multiple-choice questions.

- **Vấn đề chính:** Quá trình luyện tập câu hỏi CFA lặp đi lặp lại có thể trở nên căng thẳng và nhàm chán.

- **Nhiệm vụ người dùng:** Trả lời câu hỏi CFA để vượt qua Level, Area và Boss.

- **Giải pháp đang xem xét:** Giữ nguyên CFA questions nhưng bổ sung RPG progression và các mechanics như Points, Trap, Gamble, Side Quest và Shop.

- **Giả định quan trọng cần kiểm chứng:** Gamification làm việc luyện cùng một loại câu hỏi trở nên thú vị hơn so với cách làm question bank/mock test thông thường.

- **Quyết định hiện tại:** Tiếp tục phát triển theo hướng CFA Quest VER2, đồng thời kiểm chứng giả định về sự nhàm chán trước khi kết luận rằng các mechanics đã thực sự giải quyết được vấn đề.

- **Phạm vi prototype dự kiến:** 2 Area cơ bản + Side Quest; kiểm thử Pass/Fail, Trap, Gamble, Side Quest, Shop, Boss và Item theo phạm vi test đã xác định trong VER2.

---

**Cập nhật lần cuối: Checkpoint Tuần 1.**
