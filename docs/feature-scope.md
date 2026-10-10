# FEATURE SCOPE — CFA QUEST · ETHICS

**Học phần:** NHA408E · **Nhóm:** 7  
**Nguồn:** `SOLUTION_STRUCTURE.md` bản Week 7 — core process, diagnostic logic, progression, difficulty, timer, Boss Gate, World Quest và phạm vi sản phẩm.

File này là nguồn duy nhất cho **phạm vi tính năng**. Các checkpoint cũ chỉ phản ánh trạng thái ở thời điểm trước đó; nếu có xung đột về scope thì dùng file này và `SOLUTION_STRUCTURE.md` bản Week 7.

---

## 1. Main feature

**Sinh Arena từ dữ liệu sai của người học.**

Core process vẫn là **Diagnostic-Driven Practice Generation**:

```text
Diagnose
   ↓
Rank Weakness
   ↓
Filter Question Bank
   ↓
Generate Targeted Arena
   ↓
Re-Diagnose
   ↓
Verify
```

Trên sản phẩm, flow chính là:

```text
Arena 1
   ↓
xác định W1
   ↓
Arena 2 — Trap I
   ↓
Arena 3 — Crossroads
   ↓
xác định W2 khác W1
   ↓
Arena 4 — Trap II
   ↓
xác định 3 cụm yếu nhất
   ↓
kiểm tra Credit
   ├── đủ 15 → mở Boss
   └── thiếu → World Quest → kiếm thêm Credit → kiểm tra lại
   ↓
Boss
   ↓
Bảng tổng kết
```

Cấu trúc 5 Arena chính vẫn giữ nguyên:

| Round | Số câu | Cụm được hỏi |
|---|---:|---|
| Arena 1 | 15 | 5 cụm, mỗi cụm 3 câu |
| Arena 2 | 10 | W1 |
| Arena 3 | 10 | 5 cụm, mỗi cụm 2 câu |
| Arena 4 | 10 | W2, bắt buộc khác W1 |
| Boss | 15 | 3 cụm yếu nhất, chia 7/5/3 |

### Phép thử của đề bài

> Nếu bỏ feature sinh đề theo dữ liệu chẩn đoán, core user task còn hoàn thành được không?

Không.

Một bộ đề trắc nghiệm thông thường trả lời:

```text
"Tôi được bao nhiêu điểm?"
```

CFA Quest phải trả lời thêm:

```text
"Tôi đang yếu ở đâu?"
"Round tiếp theo tôi phải luyện phần nào?"
```

Và hệ thống phải tự sinh round kế tiếp từ kết quả đó.

**Chấm điểm không phải core process.** Điểm chỉ phục vụ progression: đỗ/trượt, Credit, timer penalty và quyền mở Boss.

---

## 2. Core gameplay rules của Week 7

Week 7 không thay core diagnostic logic, nhưng làm độ khó tăng dần theo round.

### 2.1 Progressive pass threshold

Không còn dùng một ngưỡng 70% cho mọi round.

| Round | Ngưỡng đỗ | Số câu đúng tối thiểu |
|---|---:|---:|
| Arena 1 | 70% | 11/15 |
| Arena 2 | 75% | 8/10 |
| Arena 3 | 75% | 8/10 |
| Arena 4 | 85% | 9/10 |
| Boss | 90% | 14/15 |

Arena 2 và Arena 3 cùng ngưỡng 75%.

Arena 3 vẫn khó hơn Arena 2 vì:

- tỷ lệ câu khó cao hơn;
- có giới hạn thời gian 100 giây/câu.

> Ngưỡng 90% của Boss chỉ dùng để xét **đỗ/trượt Boss**.  
> Bảng tổng kết sau Boss vẫn dùng mốc **70%** cho nhãn cải thiện theo cụm như logic cũ.

### 2.2 Difficulty distribution theo round

Arena sau phải có tỷ lệ câu khó cao hơn.

| Round | Dễ / Vừa / Khó | Số câu Dễ / Vừa / Khó |
|---|---|---|
| Arena 1 | mỗi cụm 1/1/1 | tổng 5/5/5 |
| Arena 2 | 40/40/20% | 4/4/2 |
| Arena 3 | 20/50/30% | 2/5/3 |
| Arena 4 | 20/40/40% | 2/4/4 |
| Boss | 10/30/60% | 2/4/9 |

Boss chia 15 câu theo ba cụm yếu nhất:

| Cụm trong Boss | Tổng câu | Dễ | Vừa | Khó |
|---|---:|---:|---:|---:|
| Cụm yếu nhất | 7 | 1 | 2 | 4 |
| Cụm yếu thứ hai | 5 | 1 | 1 | 3 |
| Cụm yếu thứ ba | 3 | 0 | 1 | 2 |

Arena 3 vẫn phải giữ đúng **2 câu/cụm**. Engine chỉ phân bổ difficulty sao cho cả round đủ `2 dễ / 5 vừa / 3 khó`.

Nếu bank thiếu câu mới ở đúng mức difficulty:

1. dùng lại câu đã gặp ở cùng mức difficulty;
2. nếu vẫn thiếu thì hạ xuống mức vừa;
3. ghi trường hợp fallback vào `bankLog`.

---

## 3. Supporting features

Các feature dưới đây không thay thế core diagnostic process, nhưng cần để người học hiểu và đi hết flow Week 7.

| Supporting feature | Vai trò |
|---|---|
| Bảng chẩn đoán 2 tầng: 5 cụm + 9 module | Tầng cụm trả lời "yếu mảng nào"; tầng module chỉ ra Standard cần ôn |
| Công bố cụm bị nhắm trước Arena kế tiếp | Cho thấy đề sau được tạo từ bài làm của người học |
| Lời giải từng câu sai + lý do gây nhiễu | Biến lỗi sai thành nội dung học |
| Bảng tổng kết sau Boss | So sánh kết quả các cụm trước/sau hành trình |
| `performance_score` toàn lượt | Phân biệt hiệu suất theo độ khó; không tham gia diagnostic |
| Credit | Tạo progression, dùng mua Bùa và mở Boss |
| Timer + overtime penalty | Tạo áp lực ở Arena 3, Arena 4 và Boss |
| Boss Gate 15 Credit | Buộc người chơi đạt đủ tài nguyên trước khi vào Boss |
| World Quest | Cho người thiếu Credit một đường luyện tập để kiếm thêm Credit |
| Lưu tiến trình trên trình duyệt | Không có tài khoản/backend nên cần local storage để giữ state |

### Một điểm phải nói rõ khi bảo vệ

`performance_score` là **supporting**, không phải core.

Nó không:

- quyết định W1;
- quyết định W2;
- quyết định ba cụm vào Boss;
- quyết định pass/fail;
- cấp Credit;
- quyết định có mở được Boss hay không.

Nó nằm ngoài chuỗi:

```text
Diagnose → Rank Weakness → Filter → Generate
```

World Quest cũng **không được đưa vào dữ liệu chẩn đoán**. Quest chỉ phục vụ luyện tập và kiếm Credit.

---

## 4. Progression features bắt buộc trong Week 7

### 4.1 Timer

Timer là **in scope**, không còn là Out of Scope.

| Round | Timer |
|---|---:|
| Arena 1 | Không |
| Arena 2 | Không |
| Arena 3 | 100 giây/câu |
| Arena 4 | 80 giây/câu |
| Boss | 60 giây/câu |
| World Quest | Không |

Khi hết giới hạn:

- câu không tự submit;
- timer chuyển sang đếm overtime;
- người chơi vẫn được trả lời;
- penalty được tính theo từng block 10 giây quá giờ.

```text
penalty = ceil(max(0, t - L) / 10)
```

Trong đó:

- `t` = số giây đã dùng;
- `L` = giới hạn của round.

Trượt round vẫn bị phạt.

Ví Credit không được âm.

### 4.2 Boss Gate

Đỗ Arena 4 chưa đủ để vào Boss.

Điều kiện:

```text
Đỗ Arena 4
+
Có ít nhất 15 Credit
+
Trả 15 Credit
=
Boss mở
```

- 15 Credit là phí mở Boss.
- Người đủ Credit có thể bỏ qua World Quest.
- Người thiếu Credit phải kiếm thêm qua World Quest.
- Không mở Boss thì chưa có bảng tổng kết cuối.

### 4.3 World Quest

World Quest mở sau khi đỗ Arena 4.

Một lượt Quest:

- 15 câu;
- lấy từ 3 cụm yếu nhất;
- mỗi cụm 5 câu;
- độ khó ngẫu nhiên;
- không timer;
- không pass/fail;
- không dùng Bùa;
- chơi bao nhiêu lần cũng được.

Reward:

| Kết quả | Credit |
|---|---:|
| Dưới 9/15 | 0 |
| 9–11/15 | +2 |
| 12–13/15 | +3 |
| 14–15/15 | +4 |

Quest ưu tiên câu đã gặp ở Arena 1–4 thuộc ba cụm yếu nhất. Không đủ mới dùng câu chưa gặp.

Câu đã ra ở Quest phải được loại khỏi pool của Boss.

Kết quả Quest:

- lưu riêng;
- không cộng vào diagnostic;
- không làm thay đổi W1/W2;
- không làm thay đổi 3 cụm Boss;
- không ảnh hưởng bảng tổng kết sau Boss.

### 4.4 Retry và quit Boss

**Trượt Boss:**

- Boss vẫn mở;
- không trả thêm 15 Credit;
- retry bằng bộ đề mới.

**Thoát giữa Boss:**

- lượt Boss bị huỷ;
- 15 Credit đã trả không hoàn;
- Boss khoá lại;
- muốn vào lại phải kiếm và trả 15 Credit mới.

---

## 5. Optional features

| Optional feature | Vì sao xếp optional |
|---|---|
| Shop | Người chơi vẫn có thể hoàn thành hành trình mà không mua vật phẩm |
| Bùa Loại Trừ | Hỗ trợ người chơi nhưng không phải điều kiện bắt buộc để hoàn thành core flow |
| Vật phẩm thứ hai — Cuộn Giấy Gợi Ý | Chưa thuộc thiết kế Week 7 hiện tại |
| Bảng chi tiết tầng 9 module | Có thể cắt trong fallback mà vẫn giữ diagnostic ở tầng cụm |
| Tính lại điểm yếu sau **mỗi** Arena | Có thể giảm tần suất trong fallback nếu cần ổn định bản final |

### Luật Bùa trong scope hiện tại

- Arena 1: không dùng Bùa.
- Arena 2–4: tối đa 1 Bùa/round.
- Boss: **được dùng tối đa 1 Bùa Loại Trừ**.
- World Quest: không dùng Bùa.
- Bùa Loại Trừ giá 3 Credit.

Câu đúng nhờ Bùa:

- được tính vào `arena_score_correct`;
- được dùng để xét pass/fail;
- không được tính vào dữ liệu chẩn đoán.

---

## 6. Ranh giới Core / Optional

### Core — phải chạy trước bản final

| Core feature | Vì sao bắt buộc |
|---|---|
| Chuỗi 5 Arena theo đúng thứ tự | Khung chính của sản phẩm |
| Chấm bài và cộng dồn chẩn đoán theo cụm | Nền tảng để xác định điểm yếu |
| Xếp hạng cụm yếu, chọn W1 và W2 | Điều khiển Arena 2 và Arena 4 |
| Chọn 3 cụm yếu nhất cho Boss | Điều khiển Boss và World Quest |
| Lọc bank và sinh đề theo cluster | Main feature |
| Sinh đề theo difficulty quota | Bảo đảm round sau khó hơn round trước |
| Progressive pass threshold 70/75/75/85/90 | Bảo đảm progression tăng độ khó |
| Timer ở Arena 3, Arena 4, Boss | Một phần cơ chế tăng độ khó Week 7 |
| Overtime penalty | Gắn timer với progression Credit |
| Credit progression | Dùng cho Bùa và Boss Gate |
| Boss Gate 15 Credit | Một phần đường đi chính trước Boss |
| World Quest | Đường bắt buộc cho người thiếu Credit |
| Boss retry/quit state | Cần để Boss Gate không bị bypass |
| Bảng tổng kết sau Boss | Điểm kết thúc của flow |
| Lời giải câu sai | Feedback học tập tối thiểu |

### Optional — có thể cắt mà core diagnostic vẫn tồn tại

| Optional feature | Ghi chú |
|---|---|
| Mua Bùa / Shop | Người chơi có thể không mua |
| Vật phẩm thứ hai | Chưa thuộc bản Week 7 |
| Báo cáo chi tiết 9 module | Có thể chỉ giữ 5 cụm |
| Các hiệu ứng UI phụ | Không được làm ảnh hưởng logic sinh đề |
| Các cơ chế hỗ trợ ngoài World Quest | Không thuộc thiết kế hiện tại |

> **World Quest không xếp optional trong Week 7.**  
> Với Boss Gate 15 Credit, người chơi thiếu Credit phải có một đường hợp lệ để kiếm thêm Credit. Nếu bỏ Quest mà vẫn giữ Boss Gate, một số người chơi có thể bị chặn progression.

---

## 7. Quyết định phạm vi theo tuần

### Week 5–6

Week 5 và Week 6 giữ scope cũ

### Week 7

Week 7 thay đổi scope sau feedback:

1. Round sau phải khó hơn round trước.
2. Người chơi phải đạt một mức progression nhất định mới được vào Boss.
3. Game phải có cách giúp người chơi vượt phần khó.

Các feature mới được đưa vào scope, Core diagnostic logic không thay đổi.

---

## 8. Out of Scope

Các nội dung sau vẫn **không làm** trong bản hiện tại:

- Các chủ đề khác ngoài Ethics
- Hệ thống tài khoản, đăng nhập, đồng bộ nhiều thiết bị
- Bảng xếp hạng
- Chế độ nhiều người chơi
- Trợ lý hỏi đáp
- Sinh câu hỏi bằng AI
- Cảnh báo lệ thuộc vật phẩm
- Hệ thống adaptive difficulty dựa trên dữ liệu người chơi thật
- Tự hiệu chỉnh ngưỡng pass, timer, penalty, Boss price hoặc Quest reward bằng thống kê người chơi

> **Giới hạn thời gian mỗi câu không còn nằm trong Out of Scope.**  
> Week 7 đã đưa timer 100/80/60 giây và overtime penalty vào feature chính thức.


---

## 9. Ownership theo feature

Phân công owner cụ thể giữ theo file quản lý công việc của nhóm.

Khi chia việc, các feature có phụ thuộc logic nên được gom theo cụm:

```text
Diagnostic + generation
    ├── W1/W2
    ├── boss_clusters
    ├── difficulty quota
    └── bank fallback / bankLog

Progression
    ├── pass threshold
    ├── Credit
    ├── timer / penalty
    ├── Boss Gate
    └── Boss retry / quit

World Quest
    ├── quest generation
    ├── quest reward
    ├── replay
    └── quest questions excluded from Boss
```

Không tách các phần phụ thuộc state cho nhiều người sửa riêng nếu chưa thống nhất field trong `INPUT_DICTIONARY.md`.
