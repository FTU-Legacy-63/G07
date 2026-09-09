# CFA Quest — Solution Structure

> Học phần: **NHA408E**
> Nhóm: **7**
> Chủ đề: **Ethics** — 9 module, 5 cụm chẩn đoán, hầm ngục 5 Arena

---

## 0. Sản phẩm trong một đoạn

CFA Quest là một hầm ngục gồm 5 đấu trường (Arena). **Chỉ Arena 1 là đề cố định** — đó là bài chẩn đoán. Bốn Arena còn lại được sinh ra từ chính dữ liệu sai của người học: hệ thống đo tỷ lệ đúng theo từng cụm nội dung, tìm cụm yếu nhất, rồi lọc ngân hàng câu hỏi để kiểm tra lại phần kiến thức đó cho người học.

Người học không tự chọn mình luyện gì. **Dữ liệu sai của họ chọn hộ.**

---

## 1. User → Input → Process → Output → User Action

### User

Thí sinh đang tự ôn CFA Level I môn Ethics, đã học xong lý thuyết nhưng chưa biết mình yếu cụ thể ở Standard nào.

### Input

- Lựa chọn đáp án của người học cho từng câu (3 phương án, đúng định dạng đề CFA thật).
- Thời gian trả lời từng câu — đo bằng khoảng cách giữa lúc câu hiện lên và lúc bấm
  Xác nhận. Chỉ dùng làm tiêu chí phân định khi hai cụm bằng nhau; không chấm điểm,
  không giới hạn thời gian.
- Trạng thái dùng vật phẩm của từng câu (có/không, và loại nào) — quyết định câu đó
  có vào mẫu chẩn đoán hay không.
- Ngân hàng câu hỏi tĩnh dạng JSON, mỗi câu gắn nhãn sẵn: cụm, module, sub-standard,
  độ khó, đáp án đúng, lý do gây nhiễu của từng phương án sai, gợi ý, lời giải.

Không đăng nhập, không gọi API bên ngoài, không dữ liệu thời gian thực.

### Process

Chấm bài → cộng dồn tỷ lệ đúng theo từng cụm → xác định cụm yếu nhất → lọc ngân hàng câu hỏi theo cụm đó → sinh Arena kế tiếp → chấm đỗ/trượt → tính lại điểm yếu.

### Output

> **Bảng chẩn đoán 5 cụm / 9 module + đề luyện được sinh tự động từ bảng đó**

### User Action

Người học nhìn thấy Standard nào của mình đang yếu, làm tiếp Arena được sinh riêng cho lỗ hổng đó, rồi đối chiếu tỷ lệ đúng ở mốc chuẩn đoán (Arena 1 + crossroad) với Arena 5 để biết lỗ hổng đã đóng chưa.

```text
USER
        ↓
Answers + Tagged Question Bank
        ↓
Diagnose by Cluster
        ↓
Weakness Profile (5 cụm / 9 module)
        ↓
Auto-Generated Targeted Arena
        ↓
Compare Baseline (Arena 1 + crossroad) vs Boss
```

---

## 2. Nội dung game — 9 module, 2 tầng nhãn

### Vì sao phải có tầng cụm

Ethics có 9 module được nhóm thành 5 nhóm chính

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

1. **Arena 1:** 3 câu của mỗi cụm phải rải qua **tất cả** module trong cụm. Cụm 2 module → 2 + 1 câu, câu dư luân phiên giữa hai lần chơi. Cụm C3 (1 module) → cả 3 câu.
2. **Trap:** 10 câu của một cụm chia đều cho các module trong cụm (5/5 hoặc 4/3/3), không dồn hết vào một module.
3. **Ngân hàng:** cả 9 module đều phải đạt tối thiểu số câu ghi ở mục 9. Không module nào được để trống.

### Định dạng câu hỏi — 3 phương án, đúng chuẩn CFA L1

```text
{
  "id": "ETH-C2-S1-007",
  "topic": "ETHICS",
  "cluster": "C2",             // truc CHAN DOAN va SINH DE
  "module": "S1",           // truc NOI DUNG va BAO CAO chi tiet
  "difficulty": 2,
  "stem": "...",
  "options": ["...", "...", "..."],
  "answer": 1,
  "distractor_reason": ["...", "...", "..."],   // loi tu duy dan toi tung phuong an sai
  "hint": "...",
  "explanation": "..."
}
```

Độ khó 1–3 không phải trục chẩn đoán; nó chỉ dùng để cân bằng Arena 1 và phân định khi hai cụm có tỷ lệ đúng bằng nhau.

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

Chấm điểm không phải core process. Điểm số chỉ tồn tại để quyết định đỗ/trượt và cấp Credit.

Giá trị nằm ở chuỗi:

```text
Wrong Answers → Weakness Profile → Targeted Practice → Measured Improvement
```

Bộ đề trắc nghiệm thường trả lời *"tôi được bao nhiêu điểm"*. Sản phẩm này trả lời *"lần sau tôi nên luyện gì"* — và tự sinh luôn đề đó.

---

## 4. Cấu trúc hầm ngục — 5 Arena

| Arena | Tên | Số câu | Nguồn câu hỏi | Vai trò |
|---|---|---|---|---|
| 1 | The Gate | 15 | 3 câu × 5 cụm, rải hết 9 module, đủ 3 mức khó (1 câu mỗi mức) | **Chẩn đoán.** Dữ liệu gốc của cả hầm ngục |
| 2 | Trap I | 10 | Cụm yếu nhất (W1), chia đều cho các module trong cụm | Bẫy 1 — bịt lỗ hổng lớn nhất |
| 3 | The Crossroads | 10 | 2 câu × 5 cụm | Kiểm tra duy trì + bổ sung dữ liệu chẩn đoán |
| 4 | Trap II | 10 | Cụm yếu thứ hai (W2), tính lại sau Arena 3 | Bẫy 2 — bịt lỗ hổng thứ hai |
| 5 | Boss | 15 | 3 cụm yếu nhất, phân bổ **7 / 5 / 3** câu theo thứ tự yếu dần | Kiểm tra tổng hợp, quyết định vượt chủ đề |

Tổng: **60 câu** cho một lượt chơi (không trượt lần nào). Do khuôn khổ môn học nên nhóm để số lượng câu hỏi ít trong mỗi arena.

> **Vì sao Boss phân bổ 7/5/3 chứ không chia đều:** giữ được ý "càng yếu càng bị hỏi nhiều", và chạy được cho cả chủ đề 3 cụm lẫn 5 cụm mà không phải viết hai nhánh code.

---

## 5. Cơ chế lõi — Chẩn đoán và Bẫy

### 5.0 Bảng logic — đọc trước phần công thức
Mục 5 có ba công thức và một bảng tổng kết. Bảng dưới đây là bản rút gọn của cả mục: mỗi dòng là một chuỗi hoàn chỉnh từ dữ liệu vào tới điều sản phẩm được phép kết luận.

| Input / state | Ý nghĩa | Logic / quy tắc | Output | Claim boundary — điều KHÔNG được kết luận |
|---|---|---|---|---|
| `selected_option` + `answer` | Người học chọn đúng hay sai một câu | So khớp chỉ số | Đúng/sai từng câu | Một câu không nói lên gì về cụm; mọi kết luận đều ở tầng cụm trở lên |
| `item_used = true` | Câu này được trả lời sau khi vật phẩm đã bỏ bớt phương án hoặc gợi ý Standard | Loại khỏi cả tử và mẫu của (1); giữ trong (2); tử loại–mẫu giữ ở (3) | Ba bộ đếm tách biệt | Đúng nhờ vật phẩm **không** là bằng chứng nắm kiến thức. Không được gộp vào tỷ lệ chẩn đoán dù dưới bất kỳ nhãn nào |
| `diagnostic_correct[c]` ÷ `diagnostic_attempted[c]` | Tỷ lệ đúng cộng dồn của cụm c, gồm cả câu ở Trap | Công thức (1); xếp hạng tăng dần; tie-break độ khó → thời gian → mã cụm | `accuracy_cumulative[c]` → **O1**, `W1`, `W2`, `boss_clusters` | Đây là **cụm có tỷ lệ đúng thấp nhất trong phiên chơi này**, không phải chẩn đoán năng lực Ethics. Mẫu 3–5 câu/cụm ở đầu hành trình |
| `arena_score_correct` ÷ `arena_question_count` | Tỷ lệ đúng của Arena hiện tại, tính cả câu dùng vật phẩm | Công thức (2); ngưỡng ≥ 70% | Đỗ/trượt, Credit → **O3** | Điểm Arena là điều kiện tiến màn của game, không phải điểm đánh giá học tập. 70% là mức nhóm tự đặt |
| `accuracy_by_arena[c][arena]` | Tỷ lệ đúng của cụm c **riêng trong một Arena**, không cộng dồn | Lưu cặp số; Arena không hỏi cụm thì không tạo key | Cột của bảng **O4** | Ô `--` nghĩa là *không được hỏi*, không phải *sai hết*. Không được vẽ thành đường xu hướng liên tục |
| `baseline_accuracy[c]` = (Arena 1 + Crossroads) | Mốc chẩn đoán của cụm c, 5 câu, không gồm Trap | Cộng tử với tử, mẫu với mẫu | Cột gốc của **O4** | 5 câu/cụm — mỗi câu đáng 20 điểm phần trăm. Không so được giữa hai người chơi |
| `delta[c]` = Boss − baseline | Xu hướng tăng/giảm của cụm c | Bốn điều kiện chạy theo thứ tự: (1) không hỏi ở Boss → (2) Boss ≥70% và Δ ≥ 0 → (3) Boss <70% và Δ > 0 → (4) còn lại | `improvement_label[c]` → **O4** | Δ dương **không** chứng minh Trap là nguyên nhân. Người học còn đọc lời giải, còn chơi lại, và độ khó hai đầu khác nhau |
| `difficulty` (1/2/3) của mọi câu đã hỏi | Trọng số điểm | Công thức (3): tử loại câu dùng vật phẩm, mẫu giữ | `performance_score` → **O4** | So được giữa hai người chơi **trong sản phẩm này**. Không phải thang năng lực chuẩn hoá, không dự báo kết quả thi CFA. Nhãn độ khó do nhóm tự gắn, chưa calibrate |

Chi tiết từng công thức ở các mục con bên dưới. Bản đầy đủ của cột thứ năm ở **Mục 14**.

### Công thức

```text
(1) accuracy_cumulative(cụm) = diagnostic_correct[cụm] ÷ diagnostic_attempted[cụm]
```
Công thức (1) dùng để xác định phần kiến thức mà người chơi còn yếu

Trong đó cả tử số và mẫu số CHỈ tính những câu người học trả lời mà KHÔNG dùng vật phẩm. 

Tính cộng dồn trên toàn hành trình, tính lại sau mỗi Arena. Cụm có Accuracy thấp nhất là cụm yếu nhất.

Phân định khi bằng nhau: (1) độ khó trung bình của câu làm sai cao hơn → (2) thời gian trả lời trung bình dài hơn → (3) thứ tự mã cụm.

```text
(2) arena_score_correct = Σ số câu đúng trong toàn bộ arena / Σ số câu trong toàn bộ arena
```
Công thức (2) dùng để tính số điểm pass của arena

Trong công thức này, tính cả những câu mà người chơi sử dụng vật phẩm vào cả tử và mẫu của công thức

```text
(3) performance_score = Σ điểm độ khó của các câu ĐÚNG và KHÔNG dùng vật phẩm ÷ Σ điểm độ khó của TOÀN BỘ câu đã được hỏi
```

Công thức (3) dùng để phân biệt hai người chơi có cùng `arena_score_correct` nhưng làm đúng ở mức khó khác nhau. Tính một lần cho cả lượt chơi 5 arena, hiển thị ở màn tổng kết sau Boss vì độ khó sẽ khác nhau giữa các màn và giữa các người chơi với nhau nên khi gộp lại sự chênh lệch độ khó được triệt tiêu. Con số cuối cùng có thể được so giữa những người chơi khác nhau

Điểm độ khó lấy thẳng từ field `difficulty` của ngân hàng câu hỏi:

```js
const DIFFICULTY_POINTS = { 1: 1, 2: 2, 3: 3 };
```

Kết quả là một tỷ lệ phần trăm, không phải tổng điểm thô. Tổng điểm thô không so được giữa hai người chơi: từ Trap I trở đi câu được bốc ngẫu nhiên nên trần điểm của mỗi người một khác, người bốc trúng nhiều câu dễ sẽ có trần thấp hơn và trông như làm kém hơn.

### Ba công thức khác nhau ở chỗ nào

Ba công thức của tài liệu này đếm cùng một tập câu trả lời nhưng xử lý câu dùng vật phẩm theo ba cách khác nhau. Đây là chỗ dễ nhầm nhất khi code:

| Công thức | Tử số | Mẫu số | Dùng để |
|---|---|---|---|
| (1) `accuracy_cumulative` | Loại câu dùng vật phẩm | Loại câu dùng vật phẩm | Xếp hạng cụm yếu |
| (2) `arena_score_correct` | Tính cả | Tính cả | Đỗ/trượt, Credit |
| (3) `performance_score` | Loại câu dùng vật phẩm | **Tính cả** | Phân biệt người chơi cùng điểm |

Mẫu số của (3) khác (1) là cố ý. Ở (1), câu dùng vật phẩm bị loại hẳn vì nó không cho biết người học có nắm cụm đó không. Ở (3), câu đó ở lại mẫu số vì chỉ số này đo phần người chơi **tự** làm được trên toàn bộ những gì đã gặp — vật phẩm giúp qua màn, không mua được performance score.

**Note**: `performance_score` không tham gia vào chuỗi `Diagnose → Rank Weakness → Filter → Generate` ở Mục 3. Nó không quyết định `W1` và `W2`, không quyết định cụm nào vào Boss, không quyết định đỗ/trượt, không cấp Credit.

### Arena 1 là mốc so sánh trực quan nhất

Mục 4 quy định Arena 1 lấy đủ 3 mức khó cho mỗi cụm, tức 1 câu mỗi mức × 5 cụm. Mục 8 quy định Arena 1 không dùng vật phẩm.

Hai điều này cộng lại cho một hệ quả có ích: **trần điểm Arena 1 luôn bằng 30 với mọi người chơi**, và mẫu số không bao giờ có câu dùng vật phẩm. `performance_score` ở Arena 1 vì vậy so ngang giữa các người chơi được trực tiếp, không cần chuẩn hóa gì thêm.

Ví dụ, hai người chơi cùng đạt 12/15:

| Trường hợp | Điểm đạt | `arena_score_correct` | `performance_score` |
|---|---|---|---|
| 3 câu sai đều là mức 1 | 27/30 | 80% | 90% |
| 3 câu sai đều là mức 2 | 24/30 | 80% | 80% |
| 3 câu sai đều là mức 3 | 21/30 | 80% | 70% |

Cùng một điểm Arena, performance score trải trên 20 điểm phần trăm.

Từ Trap I trở đi câu được bốc ngẫu nhiên nên độ khó trung bình mỗi Arena một khác. Điểm màn này thấp hơn màn kia không có nghĩa người chơi đi xuống.

Con số chính là `performance_score` của **toàn lượt**: cộng gộp cả 60 câu thành một tử số và một mẫu số. Đây là con số dùng để so giữa những người chơi khác nhau.

### Đọc theo lượt nào khi người chơi trượt và chơi lại

`performance_score` ghi theo **lượt làm đầu tiên**, cùng phía với mốc chẩn đoán, không cùng phía với điểm số và Credit.

Lý do giống hệt lý do đã nêu cho mốc chẩn đoán: lượt đầu là lần duy nhất người học chưa đọc lời giải của bộ câu đó. Nếu ghi theo lượt đỗ, người trượt hai lần rồi làm lại bộ câu đã biết đáp án sẽ có performance score cao hơn người qua ngay lần đầu — ngược đúng với việc chỉ số này sinh ra để làm.

Nếu trong lượt chơi có ít nhất một lần trượt, bảng tổng kết thêm một dòng chú thích cho biết performance score đọc theo lượt đầu.

### Hai quy tắc bắt buộc

- **Trap II phải nhắm cụm khác Trap I.** Nếu không, người học yếu nặng một cụm sẽ bị ném 20 câu liên tiếp cùng cụm ở hai Arena kề nhau, ngân hàng của cụm đó phải lớn gấp đôi, còn lỗ hổng thứ hai bị bỏ trống. Nếu W1 vẫn yếu, nó sẽ tự quay lại ở Boss.
- **Boss không loại trừ cụm nào.** Nếu hai Trap có tác dụng thật, W1 và W2 sẽ tự rơi khỏi vị trí yếu nhất — đó chính là bằng chứng cơ chế hoạt động.

### Ví dụ chạy thật

```text
Arena 1 (15 câu · 3 câu/cụm) - đúng 11/15 = 73.3% → PASS
  C1 Khung nền        2/3  = 66.7%
  C2 Standards I–II   1/3  = 33.3%   ← yếu nhất
  C3 Standard III     2/3  = 66.7%
  C4 Standards IV–V   3/3  = 100.0%
  C5 Standards VI–VII 3/3  = 100.0%
        ↓  W1 = C2
Arena 2 — Trap I: 10 câu C2 (5 câu Std I + 5 câu Std II), đúng 7
  C2   8/13 = 61.5%
        ↓
Arena 3 (10 câu · 2 câu/cụm) — đúng 7/10 = 70.0% → PASS
  C1   3/5  = 60.0%
  C2  10/15 = 66.7%
  C3   2/5  = 40.0%   ← yếu nhất, và khác W1
  C4   5/5  = 100.0%
  C5   5/5  = 100.0%
        ↓  W2 = C3
Arena 4 — Trap II: 10 câu C3 (Duties to Clients), đúng 9
  C3  11/15 = 73.3%
        ↓  xếp hạng lại
Arena 5 — Boss (15 câu)
  C1   7 câu   (60.0% — yếu nhất)
  C2   5 câu   (66.7%)
  C3   3 câu   (73.3%)
```

Diễn giải: C2 vào cửa với 33,3% và ra khỏi hầm ngục ở 66,7%. C3 khởi đầu ổn (66,7%) nhưng tụt xuống 40% khi bị hỏi thêm ở Arena 3 — Trap II bắt đúng chỗ đó và kéo lên 73,3%. **Đây chính là output mà sản phẩm phải chứng minh được.**

### Output chính sau mỗi arena
- Arena 1: weakness profile 1 + arena score correct (%)
- Trap I: arena score correct (%)
- Crossroads: weakness profile 2 + arena score correct (%)
- Trap II: arena score correct (%)
- Boss: Bảng kết quả tổng kết cả 5 màn chơi + performance score toàn lượt (nêu chi tiết ở phần dưới)

### Bảng tổng kết xuất hiện sau màn đánh Boss

Ví dụ minh hoạ (Bảng A)

Performance score toàn lượt: 72% (Tỷ lệ đúng có trọng số theo mức khó. Không tính câu dùng vật phẩm vào tử số.)
| Cụm | Arena 1 | Trap I | Crossroads | Trap II | Boss | Kết luận |
|---|---|---|---|---|---|---|
| C2 | 1/3 | 7/10 | 2/2 | -- | 4/5 | Đã cải thiện |
| C3 | 2/3 | -- | 0/2 | 9/10 | 3/3 | Đã cải thiện |
| C1 | 2/3 | -- | 1/2 | -- | 4/7 | Cần cải thiện tiếp |
| C4 | 3/3 | -- | 2/2 | -- | -- | Không kiểm tra lại ở Boss |
| C5 | 3/3 | -- | 2/2 | -- | -- | Không kiểm tra lại ở Boss |

#### Bảng tổng kết nói lên điều gì
**Nhãn *Đã cải thiện* nghĩa là:** trong phiên chơi này, tỷ lệ đúng của cụm đó ở Boss cao hơn hoặc bằng mốc chẩn đoán, và đạt ít nhất 70% số câu Boss của riêng cụm đó.

**Nhãn đó không nghĩa là:** người học đã nắm được Standard tương ứng; Trap là nguyên nhân của mức tăng; kết quả này lặp lại được ở phiên sau; hay người học sẽ làm tốt phần này trong đề thi thật.

**Ba giới hạn phải ghi kèm bảng:**

1. **Mẫu nhỏ.** Mốc chẩn đoán có 5 câu mỗi cụm (3 ở Arena 1 + 2 ở Crossroads). Boss có 3, 5 hoặc 7 câu. Ở slot 3 câu, một câu đáng 33 điểm phần trăm.
2. **Ngưỡng 70% chặt không đều.** Slot 7 câu cần 5/7 (71,4%); slot 5 câu cần 4/5 (80%); **slot 3 câu cần 3/3 (100%)**. Cụm yếu thứ ba bị chấm khắt khe nhất trong khi được hỏi ít nhất. Không so ngang nhãn giữa hai slot khác cỡ.
3. **Cụm không vào Boss không có kết luận.** Ô `--` ở cột Boss nghĩa là cụm đó không nằm trong ba cụm yếu nhất sau Arena 4 — không phải người học làm sai, và cũng không phải người học đã giỏi phần đó.

#### Cách xác định những phần kiến thức đã được cải thiện vs chưa được cải thiện
Để xác định được phần kiến thức mà người học đã cải thiện và cần cải thiện tiếp, nhóm đặt ra các điều kiện chạy theo thứ tự sau:

| # | Điều kiện | Kết luận |
|---|---|---|
| 1 | Cụm không được hỏi ở Boss | Không kiểm tra lại ở Boss |
| 2 | Boss ≥ 70% và mức thay đổi ≥ 0 | **Đã cải thiện** |
| 3 | Boss < 70% và mức thay đổi > 0 | **Đã cải thiện nhưng chưa đủ** |
| 4 | Các trường hợp còn lại | **Cần cải thiện tiếp** |

Trong đó:

```text
mốc chẩn đoán[cụm] = (arena1.correct + crossroads.correct)
                     ÷ (arena1.attempted + crossroads.attempted)

mức thay đổi[cụm]  = tỷ lệ đúng ở boss - mốc chẩn đoán
```
- Mức thay đổi cho thấy xu hướng tăng/giảm của tỷ lệ đúng mà người chơi đạt được sau các vòng chơi. Không hiện ra bảng vì người đọc có thể tự hình dung qua data table những engine phải chạy để phân loại.
- Mốc chuẩn đoán không tính câu hỏi ở trap vì Trap chỉ nhắm 2 trong 5 cụm. Nếu tính, hai cụm bị nhắm được cộng thêm 10 câu mà ba cụm kia không có, các dòng trong cùng một bảng bị đem so bằng lượng dữ liệu khác nhau.

**Note**: Biết được xu hướng thì chưa đủ, có nghĩa là tăng thì chưa chắc đã nắm được hoàn toàn kiến thức của cụm đó và giảm thì không có nghĩa là người học yếu kiến thức phần đó nên nhóm đặt thêm constraint tỉ lệ đúng ở boss ≥ 70% mới được coi là kiến thức đó đã được cải thiện.
70% ở Boss ở đây là tỷ lệ đúng phần câu Boss của riêng cụm đó, không phải điểm đỗ/trượt của Arena 5.

Trong bảng A không sử dụng biến `accuracy_cumulative[cụm]`, nhóm chọn làm 1 biến mới tên `accuracy_by_arena[cụm][arena]` để thống kê số lượng câu mà người chơi làm đúng trong mỗi cụm kiến thức ở mỗi arena

Hệ thống lưu **hai chuỗi số chạy song song**, tính từ cùng một tập câu trả lời:
| Biến | Nội dung | Dùng để |
|---|---|---|
| `accuracy_cumulative[cụm]` | Cộng dồn toàn hành trình, gồm cả Trap | Xếp hạng W1, W2, chọn 3 cụm vào Boss |
| `accuracy_by_arena[cụm][arena]` | Tỷ lệ đúng riêng từng Arena | Bảng tổng kết sau Boss |

#### Cấu trúc dữ liệu

**Với accuracy_by_arena**
Ví dụ (sử dụng số liệu từ bảng A)
```js
accuracy_by_arena = {
  "C1": {
    "arena1":     { correct: 2, attempted: 3 },
    "crossroads": { correct: 1, attempted: 2 },
    "boss":       { correct: 4, attempted: 7 }
  },
  "C2": {
    "arena1":     { correct: 1, attempted: 3 },
    "trap1":      { correct: 7, attempted: 10 },
    "crossroads": { correct: 2, attempted: 2 },
    "boss":       { correct: 4, attempted: 5 }
  },
  "C3": {
    "arena1":     { correct: 2, attempted: 3 },
    "crossroads": { correct: 0, attempted: 2 },
    "trap2":      { correct: 9, attempted: 10 },
    "boss":       { correct: 3, attempted: 3 }
  },
  "C4": {
    "arena1":     { correct: 3, attempted: 3 },
    "crossroads": { correct: 2, attempted: 2 }
  },
  "C5": {
    "arena1":     { correct: 3, attempted: 3 },
    "crossroads": { correct: 2, attempted: 2 }
  }
}
```

Ba quy tắc lưu:

1. Lưu **cặp số**, không lưu phần trăm. Mốc chẩn đoán phải cộng được `(1+2)/(3+2)`; hai phần trăm thì không cộng được. Bảng hiển thị cũng cần mẫu số.
2. Đếm theo `diagnostic_correct` và `diagnostic_attempted`. Câu dùng vật phẩm bị loại khỏi cả tử số lẫn mẫu số, thống nhất với mục 8.
3. Arena nào không hỏi cụm đó thì không đặt `attempted: 0`, vì sẽ sinh phép chia cho 0 và điểm 0% giả trên bảng.

Khi người học trượt một Arena và chơi lại: mốc chẩn đoán ghi theo **lượt làm đầu tiên**, phần điểm số và Credit ghi theo **lượt đỗ**. Lượt đầu là lần duy nhất người học chưa đọc lời giải của bộ câu đó. Nếu hai con số khác nhau, bảng tổng kết có một dòng chú thích.

**Với performance score**
Dùng 1 object riêng không liên quan đến accuracy_by_arena
Ví dụ (sử dụng số liệu từ bảng A)
```js
performance_by_arena = {
  "arena1":     { points_earned: 21, points_offered: 30 },
  "trap1":      { points_earned: 12, points_offered: 19 },
  "crossroads": { points_earned: 13, points_offered: 19 },
  "trap2":      { points_earned: 17, points_offered: 19 },
  "boss":       { points_earned: 20, points_offered: 28 }
}

performance_score = 83 / 115 = 72%
```
Quy tắc lưu:

1. `points_earned` cộng điểm độ khó của câu **đúng và không dùng vật phẩm**.
2. `points_offered` cộng điểm độ khó của **mọi câu đã hỏi**, kể cả câu dùng vật phẩm và câu trả lời sai.
3. Không chia theo cụm. Điểm trọng số không bao giờ hiển thị theo cụm, nên chia ra rồi cộng lại ngay là thừa. Bảng tổng kết ở phần trên dùng số câu thô của `accuracy_by_arena`, không dùng điểm.
4. `points_offered` của Arena 1 luôn bằng 30. Nếu engine tính ra số khác, lỗi nằm ở khâu sinh đề Arena 1, không nằm ở khâu tính điểm — dùng làm điểm kiểm tra tự động.

`performance_by_arena` chia theo Arena chứ không lưu thẳng một cặp số tổng, vì hai lý do: kiểm tra được quy tắc 4, và nếu sau này nhóm muốn báo cáo riêng con số Arena 1 (trần điểm cố định 30, không có vật phẩm, so ngang giữa người chơi được trực tiếp) thì dữ liệu đã có sẵn, không phải sửa engine.
---

## 6. MVP Flow

MVP phải kiểm chứng đúng một điều: **dữ liệu sai của người học có sinh ra được đề luyện đúng chỗ yếu hay không.**

```text
Chọn chủ đề Ethics
        ↓
Arena 1 — Chẩn đoán 15 câu
        ↓
Bảng tỷ lệ đúng: 5 cụm (tổng quan) + 9 module (chi tiết)
        ↓
Hệ thống công bố cụm yếu nhất
        ↓
Sinh Trap I từ cụm đó
        ↓
Người học làm Trap I
        ↓
Tỷ lệ đúng cụm đó thay đổi trên biểu đồ
```

Main output của MVP:

> **Weakness Profile + Targeted Arena sinh từ Profile đó**

| Thành phần MVP | Nội dung |
|---|---|
| Target user | Thí sinh tự ôn CFA L1 môn Ethics |
| Core task | Đi hết 5 Arena và biết Standard nào đã cải thiện |
| Input thiết yếu | Đáp án người chọn + thời gian trả lời + trạng thái dùng vật phẩm + ngân hàng câu hỏi JSON gắn nhãn 2 tầng |
| Logic path chính | Chấm → cộng dồn theo cụm → xếp hạng yếu → lọc bank → sinh Arena → đỗ/trượt |
| Output có ý nghĩa | Bảng chẩn đoán 5 cụm / 9 module + biểu đồ tiến bộ + giải thích từng câu sai |
| User flow hoàn chỉnh | Mục 7 |

---

## 7. User Flow

### Đường chính

```text
Vào chủ đề Ethics
    ↓
Arena 1 · 15 câu · không hiện đúng/sai ngay
    ↓
Kết quả: % tổng · đỗ/trượt · Credit · bảng chẩn đoán · giải thích câu sai
    ↓
Hệ thống công bố cụm bị nhắm ở Arena sau
    ↓
[tuỳ chọn] Vào Shop mua vật phẩm
    ↓
Arena 2 → 3 → 4  (lặp lại vòng trên)
    ↓
Arena 5 — Boss
    ↓
Bảng tổng kết: đối chiếu Baseline (Arena + crossroad) 1 với Arena 5 theo từng cụm và từng module
```

### Đường phụ

- **Trượt một Arena:** vẫn hiện kết quả và lời giải, không cấp Credit, khoá Arena kế tiếp, cho chơi lại với bộ câu rút mới. Không giới hạn số lần.
- **Không mua vật phẩm nào:** hành trình vẫn hoàn chỉnh — kiểm chứng rằng Shop nằm ngoài logic path chính.
- **Đúng toàn bộ Arena 1:** không tồn tại cụm yếu nhất, chuyển sang phân định theo thời gian trả lời.
- **Sử dụng vật phẩm thứ 2 trong cùng 1 arena** chặn và hiện bảng "Mỗi arena sử dụng tối đa 1 vật phẩm".

### Đường lỗi

| Tình huống | Xử lý |
|---|---|
| Xác nhận khi chưa chọn phương án | Chặn chuyển câu |
| Mua vật phẩm khi không đủ Credit | Vô hiệu hoá nút, báo còn thiếu bao nhiêu |
| Dùng vật phẩm thứ hai trên cùng một câu | Chặn — mỗi câu tối đa 1 vật phẩm |
| Ngân hàng hết câu cho một cụm | Lấy bù câu cũ, xáo lại thứ tự phương án, báo cho người học |
| Một module trong cụm không đủ câu để chia đều | Bù bằng module khác cùng cụm, ghi log để nhóm bổ sung ngân hàng |
| Thoát giữa Arena | Huỷ lượt, không lưu dở dang |
| Mất dữ liệu trình duyệt | Khởi tạo tiến trình rỗng, báo bắt đầu lại |

---

## 8. Đỗ/trượt, Credit, Shop

**Ngưỡng đỗ: ≥ 70% số câu của Arena** (Arena 10 câu cần ≥ 7; Arena 15 câu cần ≥ 11).

| Kết quả | Credit |
|---|---|
| < 70% | 0 — trượt, chơi lại |
| 70–79% | 2 |
| 80–89% | 3 |
| ≥ 90% | 4 |
| Vượt Boss lần đầu | +5 |

Số dư khởi đầu: **3 Credit** — vì vật phẩm rẻ nhất giá 3, nếu bắt đầu từ 0 thì người học không dùng được vật phẩm nào trước Arena 2 và sẽ không hiểu Shop để làm gì.

| Vật phẩm | Giá | Hiệu ứng |
|---|---|---|
| Bùa Loại Trừ | 3 Credit | Loại **1 phương án sai** của câu hiện tại (3 → 2 phương án) |
| Cuộn Giấy Gợi Ý | 4 Credit | Hiện một dòng gợi ý: Standard nào đang bị áp dụng. Không tiết lộ đáp án |

> Vì đề chỉ có **3 phương án** đúng chuẩn CFA, vật phẩm không thể loại 2 phương án — làm vậy sẽ chỉ còn lại đáp án đúng, biến vật phẩm thành nút cho điểm miễn phí.

**Quy tắc quan trọng:** câu có dùng vật phẩm vẫn tính vào `arena_score_correct`(quyết định đỗ/trượt và Credit), nhưng bị loại khỏi `diagnostic_correct` và `diagnostic_attempted` (quyết định cụm yếu). Trả lời đúng nhờ loại bớt phương án không chứng minh người học nắm được cụm đó; đưa vào mẫu sẽ đẩy Accuracy của cụm lên cao giả tạo, cụm đó thoát khỏi vị trí yếu nhất, và Trap bắn sang cụm khác.

### Luật dùng vật phẩm

| # | Luật | Lý do |
|---|---|---|
| 1 | **Boss không dùng vật phẩm** | Boss là chặng đo quyết định của bảng tổng kết ở mục 5 |
| 2 | **Mỗi Arena tối đa 1 vật phẩm** | Chặn việc dồn nhiều vật phẩm vào cùng một cụm, làm rỗng mẫu chẩn đoán của cụm đó |
| 3 | **Arena 1 không dùng vật phẩm** | Đây là bài chẩn đoán gốc của cả hầm ngục. Toàn bộ dữ liệu về sau bắt nguồn từ 15 câu này |
---

## 9. Ngân hàng câu hỏi

### Cách tính

Trường hợp tốn nhiều nhất rơi vào cụm được chọn làm W1:

```text
3 (Arena 1) + 10 (Trap) + 2 (Arena 3) + 7 (Boss) = 22 câu / cụm
22 × 5 cụm = 110 câu  → đủ cho một lượt chơi sạch, không lặp câu
```

### Phân bổ Target — 110 câu

| Cụm | Module | Câu/module | Tổng cụm |
|---|---|---|---|
| C1 | GIPS · Code of Ethics | 11 · 11 | 22 |
| C2 | Standard I · Standard II | 11 · 11 | 22 |
| C3 | Standard III | 22 | 22 |
| C4 | Standard IV · Standard V | 11 · 11 | 22 |
| C5 | Standard VI · Standard VII | 11 · 11 | 22 |
| | **9 module** | | **110 câu** |

Phân bổ độ khó trong mỗi module 11 câu: **4 câu mức 1 · 4 câu mức 2 · 3 câu mức 3**. Module 22 câu (Standard III) thì nhân đôi.

### Ba mức phạm vi

| Mức | Số câu | Đánh giá |
|---|---|---|
| Lý tưởng | 150 (30/cụm) | Chơi lại một lần không lặp câu. Quá nặng cho 4 tuần |
| **Target** | **110 (22/cụm)** | Một lượt chơi sạch không lặp câu. Chơi lại thì chấp nhận lặp, có xáo thứ tự phương án |
| Fallback | 75 (15/cụm ≈ 7–8 câu/module) | Chấp nhận lặp câu ngay ở cụm W1. Vẫn phủ đủ 9 module |

> **Đây là rủi ro tiến độ lớn nhất của dự án.** 110 câu tự biên soạn kèm lời giải và lý do gây nhiễu cho **từng** phương án sai là khối lượng lớn hơn phần lập trình. Cần chốt sản lượng thực tế theo tuần của người phụ trách nội dung **trước khi** khoá phạm vi MVP — chốt tính năng trước rồi mới lo nội dung là cách hỏng tiến độ điển hình.

---

## 10. Target / Fallback / Out of Scope

### Target Scope

Chủ đề Ethics, 5 cụm / 9 module, ngân hàng 110 câu, đủ 5 Arena. Điểm yếu tính lại sau mỗi Arena. Shop 2 vật phẩm. Bảng chẩn đoán 2 tầng + bảng kết quả + giải thích từng câu sai. Lưu tiến trình trên trình duyệt.

### Fallback Scope

Vẫn giữ nguyên core flow — **chẩn đoán → sinh đề theo lỗ hổng** — nhưng rút gọn:

- ngân hàng còn 75 câu, chấp nhận lặp câu;
- điểm yếu chỉ tính **một lần** sau Arena 1 rồi khoá cứng cho cả hầm ngục;
- báo cáo chỉ ở tầng cụm, bỏ bảng chi tiết 9 module;
- Shop còn 1 vật phẩm;
- bảng kết quả.

Fallback không được biến thành một bộ đề trắc nghiệm có chấm điểm. Nếu cơ chế Trap bị cắt, sản phẩm mất toàn bộ lý do tồn tại.

### Out of Scope

- các chủ đề khác ngoài Ethics;
- hệ thống tài khoản, đăng nhập, đồng bộ thiết bị;
- bảng xếp hạng, chế độ nhiều người chơi;
- trợ lý hỏi đáp, sinh câu hỏi bằng AI;
- giới hạn thời gian mỗi câu (thời gian vẫn được đo để phân định cụm yếu, nhưng không đếm ngược và không trừ điểm);
- cảnh báo lệ thuộc vật phẩm.

---

## 11. Initial Route Hypothesis

**Code-Based Web Application, HTML/CSS/JavaScript thuần, dữ liệu tĩnh, không backend.**

Luồng tương tác hữu hạn, dữ liệu câu hỏi chuẩn bị trước, toàn bộ logic chẩn đoán chỉ là phép cộng và sắp xếp trên mảng — không cần máy chủ. Tiến trình lưu trên trình duyệt.

Fallback kỹ thuật: prototype tương tác kèm tài liệu đặc tả logic rõ ràng. Dù đi route nào, người dùng vẫn phải hoàn thành cùng một core task và nhận cùng một main output.

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
Target Scope
```

Áp dụng cho CFA Quest:

```text
Biết mình yếu Standard nào và luyện đúng Standard đó
        ↓
Weakness Profile + Targeted Arena
        ↓
Diagnostic-Driven Practice Generation
        ↓
Arena 1 chẩn đoán sinh ra Trap I
        ↓
Đủ 5 Arena, tính lại điểm yếu sau mỗi Arena, Shop và bảng kết quả
```

---

## 13. Điểm cần chốt

| # | Vấn đề | Ảnh hưởng |
|---|---|---|
| 1 | **Bảng ánh xạ 9 module → 5 cụm ở mục 2** là đề xuất của nhóm, chưa đối chiếu với trọng số đề thi thật | Nếu đổi cách gom cụm, toàn bộ số liệu ngân hàng ở mục 9 phải tính lại. Nên chốt trước khi soạn câu hỏi |
| 2 | Sản lượng biên soạn câu hỏi thực tế theo tuần | Quyết định chọn mốc 110 câu. Là điều kiện tiên quyết để khoá phạm vi |
| 3 | Mức ≥90% được 4 Credit và thưởng +5 khi vượt Boss | Phần nhóm tự đề xuất, chưa có trong yêu cầu gốc. Bỏ đi thì tổng Credit giảm ~1/3 |

---

## Câu hỏi mà MVP phải trả lời

> Với một cụm đã bị Trap nhắm, tỷ lệ đúng ở Boss có cao hơn ở mốc chẩn đoán không?

Nếu có, cơ chế chẩn đoán tạo ra giá trị thật. Nếu không, sản phẩm chỉ là một bộ đề trắc nghiệm được đóng gói đẹp — và nhóm phải sửa cơ chế, không phải thêm tính năng.

## 14. Claim boundary

Sản phẩm sinh ra bốn output. Mục này ghi, với từng output, câu nhóm **được phép** nói và câu nhóm **không được** nói. Mọi nhãn trên giao diện, mọi câu trong bài thuyết trình và mọi dòng trong báo cáo đều phải nằm trong cột giữa.

| Output | Được phép nói | Không được nói |
|---|---|---|
| **O1** — Bảng chẩn đoán 5 cụm / 9 module | "Trong phiên này, cụm có tỷ lệ đúng thấp nhất là C2." · "Ở tầng module, bạn sai cả hai câu thuộc Standard II." | "Bạn yếu Standards I–II." · "Sản phẩm chẩn đoán được năng lực Ethics của bạn." · "Bảng này phản ánh đúng trọng số đề thi." |
| **O2** — Arena kế tiếp | "Mười câu tiếp theo được lọc từ cụm có tỷ lệ đúng thấp nhất, chia đều cho các module trong cụm." | "Đây là đề luyện tối ưu cho bạn." · "Hệ thống chọn đúng phần bạn cần học nhất." |
| **O3** — Kết quả Arena | "Bạn đúng 10/15, dưới ngưỡng 70% nên chưa mở được Arena kế tiếp." · "Câu số 4 sai vì lý do sau." | "Bạn trượt phần Ethics." · "70% là chuẩn đỗ của CFA Institute." · "Điểm này dự báo kết quả thi." |
| **O4** — Bảng tổng kết sau Boss | "Tỷ lệ đúng cụm C2 ở Boss là 4/5, cao hơn mốc chẩn đoán 3/5." · "`performance_score` toàn lượt của bạn là 70,4%, so được với người chơi khác trong sản phẩm này." | "Bạn đã cải thiện Standards I–II." · "Trap đã giúp bạn tiến bộ." · "Bạn mạnh hơn người chơi kia." · "Bạn đã sẵn sàng thi phần Ethics." |

### Bốn điểm dễ gây misunderstanding

1. **"Sản phẩm chẩn đoán năng lực Ethics."** Sản phẩm xác định cụm có tỷ lệ đúng thấp nhất trong một phiên 60 câu. Đó là hai việc khác nhau.
2. **"Trap đã được chứng minh cải thiện learning."** Sản phẩm chưa có nhóm đối chứng, chưa có người dùng thật, và không tách được tác dụng của Trap khỏi tác dụng của việc đọc lời giải.
3. **"Difficulty / 5 cụm / ngưỡng 70% theo chuẩn CFA Institute."** Cả ba đều do nhóm tự đặt. Ghi ở `ASSUMPTIONS.md` B1, B4, B8, C2.
4. **"Kết quả này dự báo điểm thi thật."** Ngân hàng câu hỏi là tình huống giả định do nhóm biên soạn, không phải câu thi.

### Boundary của `performance_score`

`performance_score` là chỉ số duy nhất nhóm tuyên bố **so sánh được giữa hai người chơi**. Vì vậy nó cần ranh giới riêng:

- **So được:** giữa hai người chơi cùng đi hết 5 Arena của sản phẩm này. Cơ sở: cùng số câu, cùng ngân hàng, cùng bảng quy đổi độ khó, và cùng quy tắc loại câu dùng vật phẩm khỏi tử số.
- **Không so được:** với điểm thi thử ở nơi khác, với điểm CFA mock, hay giữa hai phiên chơi khác chủ đề.
- **Điều kiện để phát biểu vẫn đứng:** nhãn `difficulty` phải giữ nguyên trong suốt thời gian so sánh. Nếu Hồng chỉnh lại nhãn khó của một câu, mọi `performance_score` tính trước đó không còn so được với con số tính sau đó.

### Boundary của mẫu

| Chỉ số | Cỡ mẫu mỗi cụm | Một câu đáng bao nhiêu |
|---|---|---|
| Bảng chẩn đoán sau Arena 1 | 3 câu | 33,3 điểm phần trăm |
| Mốc chẩn đoán (O4) | 5 câu | 20,0 điểm phần trăm |
| Boss — slot 7 câu | 7 câu | 14,3 điểm phần trăm |
| Boss — slot 5 câu | 5 câu | 20,0 điểm phần trăm |
| Boss — slot 3 câu | 3 câu | 33,3 điểm phần trăm |
