# CFA Quest — Solution Structure

> Học phần: **NHA408E**  
> Nhóm: **7**  
> Chủ đề: **Ethics** — 9 module, 5 cụm chẩn đoán, hầm ngục 5 Arena

---

## 0. Sản phẩm trong một đoạn

CFA Quest là một hầm ngục gồm 5 Arena. **Arena 1 là bài chẩn đoán gốc**; các Arena sau được sinh từ dữ liệu sai của chính người học. Hệ thống đo tỷ lệ đúng theo từng cụm nội dung, tìm cụm yếu nhất, rồi lọc ngân hàng câu hỏi để kiểm tra lại phần kiến thức đó.

Thiết kế mới giữ nguyên logic chẩn đoán, nhưng làm độ khó tăng dần theo hành trình bằng ba cơ chế: **ngưỡng đỗ tăng theo round, tỷ lệ câu khó tăng theo round, và giới hạn thời gian ở 3 round cuối**. Sau Arena 4, Boss không tự mở: người chơi cần **15 Credit**. Nếu thiếu Credit, người chơi có thể làm **World Quest** để ôn lại 3 cụm yếu nhất và kiếm thêm Credit.

Người học không tự chọn mình luyện gì. **Dữ liệu sai của họ chọn hộ.**

---

## 1. User → Input → Process → Output → User Action

### User

Thí sinh đang tự ôn CFA Level I môn Ethics, đã học xong lý thuyết nhưng chưa biết mình yếu cụ thể ở Standard nào.

### Input

- Lựa chọn đáp án của người học cho từng câu, với 3 phương án như định dạng câu hỏi CFA Level I.
- Thời gian trả lời từng câu, đo từ lúc câu hiện lên đến lúc người học bấm **Xác nhận**.
  - Thời gian vẫn được dùng trong tie-break khi các cụm bằng nhau.
  - Ở **Arena 3, Arena 4 và Boss**, thời gian còn được dùng để tính phạt Credit khi trả lời quá giới hạn.
- Trạng thái dùng vật phẩm của từng câu, gồm có/không và loại vật phẩm, để quyết định câu đó có vào mẫu chẩn đoán hay không.
- Ngân hàng câu hỏi tĩnh dạng JSON. Mỗi câu có nhãn cụm, module, sub-standard, độ khó, đáp án đúng, lý do gây nhiễu, gợi ý và lời giải.

Không đăng nhập, không gọi API bên ngoài, không dùng dữ liệu thời gian thực.

### Process

```text
Chấm câu trả lời
        ↓
Cập nhật dữ liệu chẩn đoán theo cụm
        ↓
Xếp hạng cụm yếu
        ↓
Lọc Question Bank theo cụm + độ khó của round
        ↓
Sinh Arena kế tiếp
        ↓
Chấm đỗ/trượt theo ngưỡng riêng của round
        ↓
Cộng Credit thưởng − Credit phạt quá giờ
        ↓
Sau Arena 4: kiểm tra 15 Credit
        ↓
Đủ → mở Boss
Thiếu → World Quest → kiếm Credit → kiểm tra lại
```

### Output

> **Bảng chẩn đoán 5 cụm / 9 module + đề luyện được sinh tự động từ bảng đó**

### User Action

Người học nhìn thấy cụm và Standard nào có tỷ lệ đúng thấp trong phiên chơi, làm tiếp Arena được sinh theo lỗ hổng đó, rồi đối chiếu mốc chẩn đoán với kết quả ở Boss để biết phần nào đã cải thiện và phần nào cần ôn tiếp.

```text
USER
        ↓
Answers + Time + Item State + Tagged Question Bank
        ↓
Diagnose by Cluster
        ↓
Weakness Profile (5 cụm / 9 module)
        ↓
Auto-Generated Targeted Arena
        ↓
Progressive Difficulty + Credit Economy
        ↓
Boss Gate / World Quest
        ↓
Compare Baseline (Arena 1 + Crossroads) vs Boss
```

---

## 2. Nội dung game — 9 module, 2 tầng nhãn

### Vì sao phải có tầng cụm

Ethics có 9 module được nhóm thành 5 cụm chính để hệ thống có đủ dữ liệu cho việc chẩn đoán và sinh đề.

### Bảng nhóm kiến thức

| Cụm | Tên cụm | Module bên trong |
|---|---|---|
| C1 | Khung đạo đức nền | GIPS · Code of Ethics |
| C2 | Standards I–II | I. Professionalism · II. Integrity of Capital Markets |
| C3 | Standard III | III. Duties to Clients |
| C4 | Standards IV–V | IV. Duties to Employers · V. Investment Analysis, Recommendations & Actions |
| C5 | Standards VI–VII | VI. Conflicts of Interest · VII. Responsibilities as CFA Member/Candidate |

Standard III đứng riêng một cụm vì đây là Standard nặng nhất.

### Ba quy tắc bảo đảm phủ hết 9 module

1. **Arena 1:** 3 câu của mỗi cụm phải rải qua tất cả module trong cụm. Cụm 2 module → 2 + 1 câu, câu dư luân phiên giữa hai lần chơi. Cụm C3 có 1 module → cả 3 câu.
2. **Trap:** 10 câu của một cụm chia đều cho các module trong cụm, không dồn hết vào một module.
3. **Ngân hàng:** cả 9 module đều phải có đủ câu để phục vụ generator và các fallback khi thiếu câu đúng mức khó.

### Định dạng câu hỏi

```json
{
  "id": "ETH-C2-S1-007",
  "topic": "ETHICS",
  "cluster": "C2",
  "module": "S1",
  "sub_standard": "...",
  "difficulty": 2,
  "stem": "...",
  "options": ["...", "...", "..."],
  "answer": 1,
  "distractor_reason": ["...", "...", "..."],
  "hint": "...",
  "explanation": "..."
}
```

`difficulty` có ba mức 1/2/3. Đây **không phải trục chẩn đoán**. Nó được dùng cho:

- cân bằng Arena 1;
- sinh đề theo tỷ lệ dễ/vừa/khó của từng round;
- performance score;
- tie-break khi các cụm có tỷ lệ đúng bằng nhau.

---

## 3. Core Process Type

Core process là **Diagnostic-Driven Practice Generation**.

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

Chấm điểm, timer, Credit và Boss gate là cơ chế progression của game. Chúng không thay thế core process chẩn đoán.

Giá trị lõi vẫn nằm ở chuỗi:

```text
Wrong Answers → Weakness Profile → Targeted Practice → Measured Improvement
```

Bộ đề trắc nghiệm thông thường trả lời *"tôi được bao nhiêu điểm"*. CFA Quest trả lời *"trong phiên này tôi đang sai nhiều ở đâu và Arena tiếp theo sẽ kiểm tra lại phần nào"*.

---

## 4. Cấu trúc hầm ngục — 5 Arena

### 4.1 Bảng tổng quan

| Arena | Tên | Số câu | Nguồn câu hỏi | Ngưỡng đỗ | Số câu đúng tối thiểu | Dễ/Vừa/Khó | Đồng hồ |
|---|---|---:|---|---:|---:|---:|---|
| 1 | The Gate | 15 | 3 câu × 5 cụm | 70% | 11/15 | Mỗi cụm 1/1/1 | Không |
| 2 | Trap I | 10 | 10 câu từ cụm yếu nhất W1 | 75% | 8/10 | 4/4/2 | Không |
| 3 | The Crossroads | 10 | 2 câu × 5 cụm | 75% | 8/10 | 2/5/3 | 100 giây/câu |
| 4 | Trap II | 10 | 10 câu từ W2, khác W1 | 85% | 9/10 | 2/4/4 | 80 giây/câu |
| 5 | Boss | 15 | 3 cụm yếu nhất, chia 7/5/3 | 90% | 14/15 | 2/4/9 | 60 giây/câu |

Arena 2 và Arena 3 cùng ngưỡng 75%. Với 10 câu, cả 75% và 80% đều yêu cầu tối thiểu 8 câu đúng, nên Arena 3 khó hơn Arena 2 bằng **tỷ lệ câu khó cao hơn và có đồng hồ**, không phải bằng cách tăng ngưỡng lên 80%.

Một đường chính không trượt và không cần World Quest vẫn có **60 câu**. Mỗi lần chơi World Quest cộng thêm **15 câu** nhưng không được tính vào dữ liệu chẩn đoán hay bảng tổng kết sau Boss.

### 4.2 Tỷ lệ độ khó theo round

| Round | Tỷ lệ dễ/vừa/khó | Số câu dễ/vừa/khó | Câu lấy từ cụm nào |
|---|---:|---:|---|
| Arena 1 | Theo cấu trúc cố định | 5/5/5 | Mỗi cụm 3 câu: 1 dễ, 1 vừa, 1 khó |
| Arena 2 | 40/40/20% | 4/4/2 | 10 câu từ W1 |
| Arena 3 | 20/50/30% | 2/5/3 | Mỗi cụm 2 câu |
| Arena 4 | 20/40/40% | 2/4/4 | 10 câu từ W2 |
| Boss | 10/30/60% | 2/4/9 | 3 cụm yếu nhất, chia 7/5/3 |

Arena 1 giữ nguyên cách rút cũ vì đây là round chẩn đoán. Mỗi cụm nhận đúng 1 câu dễ, 1 câu vừa, 1 câu khó, nên tổng điểm độ khó của Arena 1 luôn bằng 30.

Ở Arena 3, mỗi cụm vẫn nhận đúng 2 câu. Generator ghép độ khó sao cho toàn round đủ **2 dễ, 5 vừa, 3 khó**; cụm nào nhận câu khó được xác định trong quá trình rút đề.

### 4.3 Phân bổ độ khó trong Boss

Boss có 15 câu. Tỷ lệ 10/30/60% tương ứng xấp xỉ 1,5/4,5/9 câu, nên dùng phân bổ **2/4/9** để giữ đúng 9 câu khó.

| Cụm trong Boss | Số câu | Dễ | Vừa | Khó |
|---|---:|---:|---:|---:|
| Cụm yếu nhất | 7 | 1 | 2 | 4 |
| Cụm yếu thứ hai | 5 | 1 | 1 | 3 |
| Cụm yếu thứ ba | 3 | 0 | 1 | 2 |
| **Cộng** | **15** | **2** | **4** | **9** |

> Boss vẫn giữ logic **càng yếu càng bị hỏi nhiều**: 7/5/3.

### 4.4 Fallback khi thiếu câu đúng độ khó

Khi một cụm hết câu **chưa gặp** ở đúng mức độ khó cần rút:

1. Lấy câu **cùng mức độ khó** mà người chơi đã gặp trước đó.
2. Nếu không còn cả câu đã gặp ở mức đó, hạ xuống **mức vừa**.
3. Mỗi lần fallback phải ghi vào `bankLog` để nhóm biết cụm/mức khó nào cần bổ sung câu.

World Quest có luật rút riêng ở Mục 8 và không dùng chung ưu tiên "câu chưa gặp" của Arena.

---

## 5. Cơ chế lõi — Chẩn đoán, đỗ/trượt và bảng tổng kết

### 5.0 Bảng logic

| Input / state | Ý nghĩa | Logic / quy tắc | Output | Claim boundary |
|---|---|---|---|---|
| `selected_option` + `answer` | Đúng/sai từng câu | So khớp đáp án | Kết quả câu | Một câu không đủ để kết luận năng lực ở một cụm |
| `item_used = true` | Câu được trả lời sau khi dùng Bùa | Tính vào `arena_score_correct`; loại khỏi dữ liệu chẩn đoán và tử số performance score | Hai bộ đếm tách biệt | Đúng nhờ Bùa không được dùng làm bằng chứng người học nắm kiến thức |
| `diagnostic_correct[c] / diagnostic_attempted[c]` | Tỷ lệ đúng cộng dồn của cụm | Xếp hạng tăng dần + tie-break hiện có | `accuracy_cumulative[c]`, W1, W2, `boss_clusters` | Chỉ mô tả tỷ lệ đúng trong phiên hiện tại |
| `arena_score_correct / arena_question_count` | Điểm round, tính cả câu dùng Bùa | So với ngưỡng riêng 70/75/75/85/90 | Đỗ/trượt + bậc Credit | Ngưỡng là luật game do nhóm đặt, không phải chuẩn CFA Institute |
| `timeMs` | Thời gian trả lời câu | Arena 3/4/Boss tính overtime và penalty | Credit penalty | Timer là luật game, không phải đo năng lực chuẩn hoá |
| `accuracy_by_arena[c][arena]` | Tỷ lệ đúng theo từng cụm trong từng Arena | Lưu cặp `correct/attempted`; loại câu dùng Bùa | Bảng O4 | `--` nghĩa là không được hỏi |
| `baseline_accuracy[c]` | Mốc chẩn đoán | Arena 1 + Crossroads | Baseline O4 | Chỉ có 5 câu/cụm trước khi xét Bùa |
| `delta[c]` | Boss − baseline | Dùng rule nhãn 70% như bản cũ | Nhãn cải thiện | Không chứng minh Trap là nguyên nhân |
| `difficulty` | Nhãn 1/2/3 | Sinh đề + performance score | `performance_score` | Difficulty do nhóm gắn, chưa calibrate |
| Kết quả World Quest | Kết quả luyện phụ | Lưu riêng | Credit Quest | Không vào chẩn đoán, performance score hay O4 |

### 5.1 Công thức chẩn đoán

```text
(1) accuracy_cumulative(cụm)
    = diagnostic_correct[cụm] ÷ diagnostic_attempted[cụm]
```

Cả tử và mẫu chỉ tính câu trả lời **không dùng vật phẩm**. Công thức được cập nhật theo hành trình chính và dùng để xác định W1, W2 và ba cụm vào Boss.

World Quest **không cập nhật** công thức này.

Khi các cụm bằng nhau, dùng chuỗi tie-break hiện có của game. Thay đổi Week 7 không thay logic tie-break.

### 5.2 Công thức điểm Arena

```text
(2) arena_score_correct
    = số câu đúng trong round ÷ tổng số câu của round
```

Công thức (2) tính cả câu trả lời đúng sau khi dùng Bùa.

Ngưỡng đỗ:

| Round | Ngưỡng | Tối thiểu |
|---|---:|---:|
| Arena 1 | 70% | 11/15 |
| Arena 2 | 75% | 8/10 |
| Arena 3 | 75% | 8/10 |
| Arena 4 | 85% | 9/10 |
| Boss | 90% | 14/15 |

### 5.3 Performance score

```text
(3) performance_score
    = Σ điểm độ khó của câu ĐÚNG và KHÔNG dùng vật phẩm
      ÷ Σ điểm độ khó của TOÀN BỘ câu thuộc hành trình chính đã được hỏi
```

```js
const DIFFICULTY_POINTS = { 1: 1, 2: 2, 3: 3 };
```

`performance_score` không quyết định W1/W2, không quyết định cụm vào Boss, không quyết định đỗ/trượt và không cấp Credit.

World Quest không được đưa vào `performance_score`, vì Quest là vòng luyện lặp để kiếm Credit và có thể ưu tiên câu đã gặp.

### 5.4 Ba bộ đếm phải tách biệt

| Bộ đếm | Câu dùng Bùa | World Quest | Dùng để |
|---|---|---|---|
| `diagnostic_correct / attempted` | Loại cả tử và mẫu | Không tính | Xếp hạng cụm yếu |
| `arena_score_correct` | Tính cả | Quest chấm riêng | Đỗ/trượt Arena và bậc thưởng |
| `performance_score` | Loại khỏi tử, giữ ở mẫu của hành trình chính | Không tính | Chỉ số tổng hợp sau Boss |

### 5.5 Hai quy tắc bắt buộc

- **Trap II phải nhắm cụm khác Trap I.** Nếu W1 vẫn yếu sau Trap I, W1 có thể quay lại trong ba cụm Boss.
- **Boss không loại trừ cụm chỉ vì cụm đó từng là W1/W2.** Sau Arena 4, hệ thống xếp hạng lại toàn bộ 5 cụm và lấy ba cụm yếu nhất.

### 5.6 Ví dụ đường chính

```text
Arena 1 — 11/15 = 73,3% → PASS
        ↓ xác định W1
Arena 2 — 8/10 = 80% → PASS
        ↓
Arena 3 — 8/10 = 80% → PASS
        ↓ xác định W2 khác W1
Arena 4 — 9/10 = 90% → PASS
        ↓
Xếp hạng lại → xác định 3 cụm Boss
        ↓
Kiểm tra ví Credit
        ↓
Đủ 15 → trả 15 → Boss
Thiếu → World Quest → cộng Credit → kiểm tra lại
        ↓
Boss — cần 14/15 để PASS
```

### 5.7 Output chính sau mỗi Arena

- **Arena 1:** weakness profile 1 + arena score + Credit.
- **Trap I:** arena score + Credit.
- **Crossroads:** weakness profile 2 + arena score + Credit + overtime penalty nếu có.
- **Trap II:** arena score + Credit + overtime penalty; nếu đỗ thì mở bước kiểm tra Boss gate.
- **World Quest:** lưu kết quả riêng + Credit Quest, không thay đổi chẩn đoán.
- **Boss:** bảng tổng kết hành trình chính + performance score + reward/penalty Boss.

### 5.8 Bảng tổng kết sau Boss — logic nhãn giữ nguyên

Ngưỡng **90% của Boss chỉ quyết định đỗ/trượt Boss**. Nó **không** thay ngưỡng 70% dùng để gắn nhãn cải thiện cho từng cụm trong bảng tổng kết.

| # | Điều kiện | Kết luận |
|---|---|---|
| 1 | Cụm không được hỏi ở Boss | Không kiểm tra lại ở Boss |
| 2 | Tỷ lệ đúng của cụm ở Boss ≥ 70% và `delta ≥ 0` | **Đã cải thiện** |
| 3 | Tỷ lệ đúng của cụm ở Boss < 70% và `delta > 0` | **Đã cải thiện nhưng chưa đủ** |
| 4 | Các trường hợp còn lại | **Cần cải thiện tiếp** |

Trong đó:

```text
baseline_accuracy[cụm]
  = (arena1.correct + crossroads.correct)
    ÷ (arena1.attempted + crossroads.attempted)

delta[cụm]
  = boss_accuracy[cụm] - baseline_accuracy[cụm]
```

Câu dùng Bùa vẫn bị loại khỏi dữ liệu chẩn đoán. Vì Boss nay cho dùng tối đa 1 Bùa Loại Trừ, số câu `attempted` dùng cho O4 của cụm nhận câu đó có thể nhỏ hơn slot 7/5/3 ban đầu.

### 5.9 Cấu trúc dữ liệu cho O4

```js
accuracy_by_arena = {
  "C1": {
    "arena1":     { correct: 2, attempted: 3 },
    "crossroads": { correct: 1, attempted: 2 },
    "boss":       { correct: 4, attempted: 7 }
  }
};
```

Quy tắc lưu:

1. Lưu cặp số `correct/attempted`, không chỉ lưu phần trăm.
2. Dùng dữ liệu chẩn đoán: câu dùng vật phẩm bị loại khỏi cả tử và mẫu.
3. Arena không hỏi cụm đó thì không tạo key giả với `attempted: 0`.
4. World Quest lưu riêng và không xuất hiện trong `accuracy_by_arena`.

### 5.10 Next action

Chỉ sinh next action cho cụm có kết luận **Cần cải thiện tiếp** hoặc **Đã cải thiện nhưng chưa đủ**.

1. Lọc các câu làm sai thuộc cụm đó trong hành trình chính.
2. Không dùng câu có vật phẩm làm căn cứ.
3. Gom theo `module`, xếp theo số câu sai giảm dần.
4. Liệt kê `sub_standard` của các câu sai, không lặp.

Ví dụ:

```text
C1 · Cần cải thiện tiếp · Boss 4/7
   Sai nhiều nhất: GIPS (3 câu sai) · Code of Ethics (1 câu sai)
   Sub-standard cần ôn: [liệt kê từ các câu đã sai]
```

World Quest không làm thay đổi next action vì Quest không tham gia dữ liệu chẩn đoán.

### 5.11 Giới hạn của thiết kế mới

Các con số của thiết kế mới là quyết định game design của nhóm, chưa được kiểm chứng bằng dữ liệu người chơi thật.

- Ngưỡng đỗ, giới hạn giờ, mức phạt, giá mở Boss và bậc thưởng Quest dựa trên mô phỏng, chưa có dữ liệu người chơi thật.
- Arena 2 và Arena 3 cùng ngưỡng 75%; độ khó tăng giữa hai round đến từ tỷ lệ câu khó và timer.
- Mỗi cụm chỉ có số lượng câu khó hữu hạn. Người chơi replay Trap nhiều lần có thể làm cạn pool câu khó; generator phải dùng fallback ở Mục 4.4.
- World Quest ưu tiên câu đã gặp nên có thể dễ dần khi người chơi nhớ đáp án. Vì vậy Quest không được dùng cho chẩn đoán.
- Timer dựa trên đồng hồ của trình duyệt. Chuyển tab hoặc máy chậm có thể làm `timeMs` khác với thời gian người chơi thực sự suy nghĩ.
- Boss có ngưỡng 90% và 9 câu khó; mức này có thể quá khó với người mới học và chưa có clear-rate thực tế.

---

## 6. MVP Flow

MVP phải kiểm chứng đúng một điều: **dữ liệu sai của người học có sinh ra được đề luyện đúng chỗ yếu hay không.**

```text
Chọn chủ đề Ethics
        ↓
Arena 1 — Chẩn đoán 15 câu
        ↓
Bảng tỷ lệ đúng 5 cụm + 9 module
        ↓
Hệ thống công bố W1
        ↓
Sinh Trap I từ W1 theo difficulty mix
        ↓
Người học làm Trap I
        ↓
Tỷ lệ đúng cụm thay đổi
```

Main output của MVP:

> **Weakness Profile + Targeted Arena sinh từ Profile đó**

| Thành phần MVP | Nội dung |
|---|---|
| Target user | Thí sinh tự ôn CFA L1 môn Ethics |
| Core task | Đi hết 5 Arena và biết cụm/Standard nào cần ôn tiếp |
| Input thiết yếu | Đáp án + thời gian + trạng thái Bùa + Question Bank gắn nhãn |
| Logic path chính | Chấm → chẩn đoán → xếp hạng → lọc bank → sinh Arena → đỗ/trượt |
| Progression | Difficulty tăng dần + timer + Credit + Boss gate |
| Output | Bảng chẩn đoán + targeted Arena + bảng tổng kết sau Boss |
| Support loop | World Quest sau Arena 4 nếu thiếu Credit |

---

## 7. User Flow

### 7.1 Đường chính

```text
Vào chủ đề Ethics
    ↓
Arena 1 · 15 câu · pass 70%
    ↓
Kết quả + chẩn đoán W1 + Credit
    ↓
Arena 2 · 10 câu W1 · pass 75%
    ↓
Arena 3 · 10 câu · pass 75% · 100 giây/câu
    ↓
Xác định W2 khác W1
    ↓
Arena 4 · 10 câu W2 · pass 85% · 80 giây/câu
    ↓
Xác định 3 cụm yếu nhất cho Boss/Quest
    ↓
Ví ≥ 15 Credit?
   ↙          ↘
 Không         Có
  ↓             ↓
World Quest   Trả 15 Credit
15 câu           ↓
  ↓            Boss
Cộng Credit   15 câu · pass 90% · 60 giây/câu
  ↓             ↓
Xét lại ví    Bảng tổng kết sau Boss
```

### 7.2 World Quest loop

- World Quest chỉ mở **sau khi đỗ Arena 4**.
- Quest dùng đúng **3 cụm yếu nhất** đã xác định cho kế hoạch Boss.
- Chơi Quest bao nhiêu lần cũng được.
- Sau mỗi Quest, cộng Credit theo kết quả rồi quay lại kiểm tra điều kiện 15 Credit.
- Người đã đủ 15 Credit có thể bỏ qua Quest.

### 7.3 Đường phụ

- **Trượt Arena 1–4:** hiện kết quả/lời giải, không nhận thưởng Credit của round, Arena kế tiếp vẫn khoá, cho chơi lại với đề mới.
- **Trượt Boss:** Boss vẫn mở; người chơi rút đề Boss mới và chơi lại, **không trả thêm 15 Credit**.
- **Thoát giữa Arena 3 hoặc Arena 4:** lượt bị huỷ, Bùa được hoàn theo luật cũ; penalty của các câu đã xác nhận trước khi thoát vẫn bị trừ.
- **Thoát giữa Boss:** lượt Boss bị huỷ, 15 Credit đã trả không hoàn, Boss khoá lại; muốn vào lại phải có 15 Credit mới.
- **Không mua Bùa:** hành trình vẫn hoàn chỉnh nếu người chơi đủ Credit.
- **Đúng toàn bộ Arena 1:** dùng tie-break hiện có để xác định W1.

### 7.4 Đường lỗi

| Tình huống | Xử lý |
|---|---|
| Xác nhận khi chưa chọn đáp án | Chặn chuyển câu |
| Mua Bùa khi không đủ Credit | Vô hiệu hoá nút và báo Credit còn thiếu |
| Dùng Bùa thứ hai trong cùng round | Chặn — tối đa 1 Bùa/round |
| Dùng Bùa ở Arena 1 | Chặn |
| World Quest dùng Bùa | Chặn |
| Ngân hàng thiếu câu đúng mức khó | Fallback theo Mục 4.4 và ghi `bankLog` |
| Hết thời gian câu ở Arena 3/4/Boss | Không auto-submit; chuyển sang đếm overtime |
| Ví sau penalty < 0 | Chặn tại 0 |
| Mất dữ liệu trình duyệt | Khởi tạo tiến trình mới |

---

## 8. Đỗ/trượt, Credit, Timer, Boss Gate, Bùa và World Quest

### 8.1 Ngưỡng đỗ theo round

| Round | Số câu | Ngưỡng đỗ | Tối thiểu |
|---|---:|---:|---:|
| Arena 1 | 15 | 70% | 11/15 |
| Arena 2 | 10 | 75% | 8/10 |
| Arena 3 | 10 | 75% | 8/10 |
| Arena 4 | 10 | 85% | 9/10 |
| Boss | 15 | 90% | 14/15 |

### 8.2 Bậc thưởng Credit

Bậc thưởng giữ như bản cũ:

| Kết quả round | Credit thưởng |
|---|---:|
| Dưới ngưỡng đỗ của round | 0 |
| Đỗ và đạt từ 70% | +2 |
| Đỗ và đạt từ 80% | +3 |
| Đỗ và đạt từ 90% | +4 |
| Vượt Boss lần đầu | +5 bổ sung |

Trượt round không được Credit thưởng. Vì Arena 4 cần 9/10, người đỗ Arena 4 luôn đạt bậc +4.

Số dư khởi đầu: **3 Credit**.

### 8.3 Bùa Loại Trừ

| Vật phẩm | Giá | Hiệu ứng |
|---|---:|---|
| Bùa Loại Trừ | 3 Credit | Loại 1 phương án sai của câu hiện tại |

Luật:

1. Arena 1 không được dùng Bùa.
2. Arena 2, Arena 3, Arena 4 và Boss: tối đa **1 Bùa/round**.
3. World Quest không được dùng Bùa.
4. Câu đúng nhờ Bùa vẫn tính vào `arena_score_correct` để xét đỗ/trượt.
5. Câu dùng Bùa không vào dữ liệu chẩn đoán và không làm bằng chứng cho nhãn cải thiện.

### 8.4 Đồng hồ và phạt quá giờ

Giới hạn:

| Round | Giới hạn |
|---|---:|
| Arena 1 | Không |
| Arena 2 | Không |
| Arena 3 | 100 giây/câu |
| Arena 4 | 80 giây/câu |
| Boss | 60 giây/câu |

Với `t` là số giây đã dùng và `L` là giới hạn:

```text
penalty = ceil(max(0, t - L) / 10)
```

Quy tắc:

1. Đo thời gian từ lúc câu xuất hiện đến lúc bấm **Xác nhận**.
2. Trả lời đúng bằng giới hạn không bị phạt.
3. Hết giờ không tự nộp; timer chuyển sang đếm overtime.
4. Phạt tính riêng từng câu và cộng lại sau round.
5. Arena 3/Arena 4: penalty trừ vào ví sau khi chấm, kể cả khi trượt. Ví không xuống dưới 0.
6. Boss: penalty trừ vào phần thưởng sau Boss; ví vẫn không âm.
7. Thoát Arena 3/4 không xoá penalty đã phát sinh ở các câu đã xác nhận.

Ví dụ:

| Round | Thời gian | Quá giờ | Phạt |
|---|---:|---:|---:|
| Arena 3, L=100 | 100s | 0s | 0 |
| Arena 3, L=100 | 104s | 4s | -1 |
| Arena 3, L=100 | 110s | 10s | -1 |
| Arena 4, L=80 | 95s | 15s | -2 |
| Boss, L=60 | 91s | 31s | -4 |

### 8.5 Khoá Boss bằng Credit

Đỗ Arena 4 chưa đủ để vào Boss. Người chơi phải có và trả **15 Credit**.

- Trả 15 Credit một lần để mở Boss.
- Người đủ 15 Credit có thể bỏ qua World Quest.
- Trượt Boss không khoá lại Boss và không phải trả thêm.
- Thoát giữa Boss làm mất 15 Credit đã trả và Boss khoá lại.
- Không đánh Boss thì chưa có bảng tổng kết sau Boss.

Giá 15 được chọn từ mô phỏng: người đỗ 4 Arena đầu ở mức vừa đủ, không mua Bùa và không bị phạt có thể đạt đúng số Credit cần thiết để mở Boss.

### 8.6 World Quest

World Quest là vòng luyện phụ để kiếm Credit. Nó **không cho điểm chẩn đoán** và **không ảnh hưởng bảng tổng kết sau Boss**.

**Điều kiện mở:** sau khi đỗ Arena 4.

**Đề Quest:**

- 15 câu;
- 3 cụm yếu nhất, mỗi cụm 5 câu;
- độ khó ngẫu nhiên;
- không timer;
- không có ngưỡng đỗ;
- không dùng Bùa.

**Nguồn câu:**

1. Ưu tiên câu thuộc 3 cụm đó mà người chơi **đã gặp ở Arena 1–4**.
2. Nếu chưa đủ mới lấy câu chưa gặp.
3. Câu đã ra ở World Quest thì **Boss không hỏi lại** trong lần mở Boss đó.

Lý do: Quest là vòng cày có thể lặp. Nếu luôn lấy câu mới, Quest có thể nhanh chóng lấy hết pool câu khó mà Boss cần.

**Credit Quest:**

| Kết quả Quest | Credit |
|---|---:|
| Dưới 9/15 | 0 |
| 9–11/15 | +2 |
| 12–13/15 | +3 |
| 14–15/15 | +4 |

Kết quả Quest lưu riêng. Không cộng vào `diagnostic_correct`, `diagnostic_attempted`, `accuracy_by_arena` hoặc `performance_score`.

### 8.7 Ví dụ Credit

#### Người chơi mạnh

| Bước | Kết quả | Thay đổi | Ví sau |
|---|---|---:|---:|
| Bắt đầu |  |  | 3 |
| Arena 1 | 14/15 | +4 | 7 |
| Arena 2 | 9/10 | +4 | 11 |
| Arena 3 | 9/10, không quá giờ | +4 | 15 |
| Arena 4 | 9/10, 1 câu quá 3 giây | +4 −1 | 18 |
| Mở Boss | đủ Credit | −15 | 3 |
| Boss | 14/15, đỗ lần đầu | +4 +5 | 12 |

#### Người chơi yếu hơn

| Bước | Kết quả | Thay đổi | Ví sau |
|---|---|---:|---:|
| Bắt đầu |  |  | 3 |
| Arena 1 lần 1 | 10/15, trượt | 0 | 3 |
| Arena 1 lần 2 | 11/15, đỗ | +2 | 5 |
| Arena 2 | 8/10, đỗ | +3 | 8 |
| Arena 3 | mua 1 Bùa; 8/10; overtime | −3 +3 −1 −2 | 5 |
| Arena 4 lần 1 | 8/10, trượt; overtime | −1 | 4 |
| Arena 4 lần 2 | 9/10, đỗ | +4 | 8 |
| World Quest 1 | 10/15 | +2 | 10 |
| World Quest 2 | 12/15 | +3 | 13 |
| World Quest 3 | 13/15 | +3 | 16 |
| Mở Boss |  | −15 | 1 |
| Boss lần 1 | 12/15, trượt; phạt 2 | −2, ví không âm | 0 |
| Boss lần 2 | 14/15, đỗ lần đầu; phạt 1 | +4 +5 −1 | 8 |

---

## 9. Ngân hàng câu hỏi

Question Bank phải hỗ trợ đồng thời hai yêu cầu:

1. Bao phủ đủ 5 cụm / 9 module cho chẩn đoán.
2. Có đủ câu theo từng `difficulty` để generator đạt được mix ở Mục 4.

Bank hiện tại của repo dùng schema JSON có các field `cluster`, `module`, `sub_standard` và `difficulty` 1–3. Generator không được giả định rằng mọi cụm luôn có đủ câu mới ở mọi mức khó; khi thiếu phải dùng fallback và ghi `bankLog`.

### Rủi ro bank sau thiết kế mới

- Boss cần tới **9 câu khó** trên tổng 15 câu.
- Trap II có 4 câu khó và có thể bị replay nhiều lần.
- World Quest có thể lặp nhiều lần nhưng ưu tiên câu đã gặp để không tiêu hao toàn bộ pool câu mới.
- Nếu người chơi trượt Trap nhiều lần, một cụm có thể hết câu khó mới trước Boss.

Vì vậy **không được đảm bảo “một lượt luôn không lặp câu”** bằng một con số bank cố định. Luật thực tế là ưu tiên câu phù hợp chưa gặp; nếu thiếu thì fallback theo Mục 4.4.

---

## 10. Target / Fallback / Out of Scope

### Target Scope

- Chủ đề Ethics, 5 cụm / 9 module.
- 5 Arena chính.
- Difficulty mix tăng dần theo Mục 4.
- Pass threshold 70/75/75/85/90.
- Timer và penalty ở Arena 3, Arena 4, Boss.
- Credit economy và Boss gate 15 Credit.
- Bùa Loại Trừ, tối đa 1 Bùa ở Arena 2–4 và Boss.
- World Quest sau Arena 4.
- Bảng chẩn đoán 2 tầng + bảng tổng kết sau Boss + next action.
- Lưu tiến trình trên trình duyệt.

### Fallback Scope

Nếu phải giảm phạm vi triển khai, vẫn phải giữ core flow:

> **chẩn đoán → xếp hạng cụm yếu → sinh đề theo lỗ hổng → kiểm tra lại**

Có thể giảm số câu trong bank hoặc giảm phần trình bày UI, nhưng không được cắt cơ chế Trap đến mức sản phẩm trở thành quiz có chấm điểm thông thường.

### Out of Scope

- các chủ đề ngoài Ethics;
- hệ thống tài khoản, đăng nhập, đồng bộ thiết bị;
- leaderboard và multiplayer;
- trợ lý hỏi đáp;
- sinh câu hỏi bằng AI;
- xác nhận rằng các threshold/timer/penalty là chuẩn CFA Institute;
- chứng minh causal effect rằng Trap làm người học tiến bộ.

**Giới hạn thời gian mỗi câu không còn là Out of Scope.** Timer là feature chính ở Arena 3, Arena 4 và Boss.

---

## 11. Initial Route Hypothesis

**Code-Based Web Application, HTML/CSS/JavaScript thuần, dữ liệu tĩnh, không backend.**

Luồng tương tác hữu hạn, dữ liệu câu hỏi chuẩn bị trước. Chẩn đoán, difficulty generator, timer, Credit, World Quest và Boss gate đều có thể xử lý phía client. Tiến trình lưu trong browser storage.

**Bản quyền:** câu hỏi do nhóm tự biên soạn; tình huống đạo đức là tình huống giả định, không trích nguyên văn tài liệu CFA Institute hay GIPS Standards.

---

## 12. Conceptual Solution Chain

```text
User Task
    ↓
Main Output
    ↓
Core Process
    ↓
MVP Flow
    ↓
Progression / Support Loop
    ↓
Target Scope
```

Áp dụng cho CFA Quest:

```text
Biết phần nào có tỷ lệ đúng thấp trong phiên và luyện đúng phần đó
        ↓
Weakness Profile + Targeted Arena
        ↓
Diagnostic-Driven Practice Generation
        ↓
Arena 1 chẩn đoán → Trap I → Crossroads → Trap II
        ↓
Difficulty tăng dần + timer + Credit
        ↓
Boss Gate 15 Credit ↔ World Quest nếu thiếu
        ↓
Boss → bảng tổng kết
```

---

## 13. Điểm cần chốt / cần đo sau khi có người chơi thật

| # | Vấn đề | Vì sao cần đo |
|---|---|---|
| 1 | Threshold 70/75/75/85/90 | Hiện là design choice, chưa có dữ liệu clear-rate |
| 2 | Timer 100/80/60 giây | Chưa biết có tạo áp lực hợp lý hay chỉ gây khó chịu |
| 3 | Penalty 1 Credit mỗi 10 giây overtime | Chưa được calibrate với hành vi người chơi |
| 4 | Giá mở Boss 15 Credit | Hiện dựa trên mô phỏng Credit, chưa có economy data thật |
| 5 | Boss 90% + 9 câu khó | Có nguy cơ quá khó với người mới học |
| 6 | Reward của World Quest | Cần đo số lượt Quest trung bình trước khi đủ Credit |
| 7 | Pool câu khó | Cần theo dõi `bankLog` để biết cluster/difficulty nào bị cạn |

---

## Câu hỏi mà MVP phải trả lời

> Với một cụm đã bị Trap nhắm, tỷ lệ đúng ở Boss có cao hơn mốc chẩn đoán không?

Nếu có, sản phẩm quan sát được một xu hướng cải thiện trong phiên chơi. Điều đó **không tự chứng minh** Trap là nguyên nhân của mức tăng.

---

## 14. Claim boundary

| Output | Được phép nói | Không được nói |
|---|---|---|
| **O1 — Bảng chẩn đoán** | “Trong phiên này, C2 có tỷ lệ đúng thấp nhất.” | “Bạn yếu Standards I–II.” hoặc “Hệ thống đo được năng lực Ethics.” |
| **O2 — Arena kế tiếp** | “Arena tiếp theo lấy câu từ cụm có tỷ lệ đúng thấp nhất và theo difficulty mix của round.” | “Đây là đề luyện tối ưu cho bạn.” |
| **O3 — Kết quả Arena** | “Bạn đạt 8/10 ở Arena 2 và vượt ngưỡng 75%.” | “75% là chuẩn đỗ của CFA Institute.” |
| **O3 — Timer/Credit** | “Câu này vượt giới hạn 15 giây nên bị trừ 2 Credit theo luật game.” | “Bạn phản xạ chậm” hoặc suy luận năng lực từ overtime. |
| **O3 — Boss Gate** | “Bạn cần 15 Credit để mở Boss theo luật game.” | “15 Credit phản ánh trình độ học tập.” |
| **World Quest** | “Quest giúp ôn lại 3 cụm yếu nhất và kiếm Credit.” | “Điểm Quest chứng minh kiến thức đã cải thiện.” |
| **O4 — Bảng tổng kết** | “Tỷ lệ đúng của C2 ở Boss cao hơn baseline của C2.” | “Trap đã làm bạn tiến bộ.” hoặc “Bạn đã nắm vững Standard.” |

### Các điểm dễ gây misunderstanding

1. **Pass threshold của round khác ngưỡng nhãn O4.** Boss cần 90% để đỗ, nhưng nhãn cải thiện từng cụm vẫn dùng mốc 70%.
2. **Difficulty / 5 cụm / threshold / timer / penalty đều do nhóm thiết kế.** Không được trình bày như chuẩn CFA Institute.
3. **World Quest không phải dữ liệu chẩn đoán.** Quest có thể lặp câu đã gặp và chỉ là support loop để ôn + kiếm Credit.
4. **Timer không đo trực tiếp năng lực.** Browser timing có thể chịu ảnh hưởng của chuyển tab, máy chậm và hành vi ngoài màn hình.
5. **Bùa giúp progression nhưng không mua được dữ liệu chẩn đoán.** Câu dùng Bùa bị loại khỏi dữ liệu xác định điểm yếu và O4.
6. **Delta dương không chứng minh causal effect.** Người học còn đọc lời giải, replay và gặp câu khác độ khó.

### Boundary của mẫu

| Chỉ số | Mẫu cơ bản | Ghi chú |
|---|---|---|
| Chẩn đoán sau Arena 1 | 3 câu/cụm | Arena 1 không có Bùa |
| Baseline O4 | 5 câu/cụm | 3 Arena 1 + 2 Crossroads, trừ câu dùng Bùa ở Crossroads nếu có |
| Boss — cụm yếu nhất | tối đa 7 câu | Có thể ít hơn nếu một câu dùng Bùa bị loại khỏi O4 |
| Boss — cụm yếu thứ hai | tối đa 5 câu | Tương tự |
| Boss — cụm yếu thứ ba | tối đa 3 câu | Mẫu rất nhỏ |

---
