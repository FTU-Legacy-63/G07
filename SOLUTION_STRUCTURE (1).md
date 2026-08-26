# CFA Quest — Solution Structure

> Học phần: **NHA408E**
> Nhóm: **7**
> Chủ đề: **Ethics** — 9 module, 5 cụm chẩn đoán, hầm ngục 5 Arena

---

## 0. Sản phẩm trong một đoạn

CFA Quest là một hầm ngục gồm 5 đấu trường (Arena). **Chỉ Arena 1 là đề cố định** — đó là bài chẩn đoán. Bốn Arena còn lại được sinh ra từ chính dữ liệu sai của người học: hệ thống đo tỷ lệ đúng theo từng cụm nội dung, tìm cụm yếu nhất, rồi lọc ngân hàng câu hỏi để ném lại đúng phần đó vào mặt người học.

Người học không tự chọn mình luyện gì. **Dữ liệu sai của họ chọn hộ.**

---

## 1. User → Input → Process → Output → User Action

### User

Thí sinh đang tự ôn CFA Level I môn Ethics, đã học xong lý thuyết nhưng chưa biết mình yếu cụ thể ở Standard nào.

### Input

- Lựa chọn đáp án của người học cho từng câu (3 phương án, đúng định dạng đề CFA thật).
- Ngân hàng câu hỏi tĩnh dạng JSON, mỗi câu gắn nhãn sẵn: **cụm**, **module**, độ khó, đáp án đúng, lý do gây nhiễu của từng phương án sai, gợi ý, lời giải.

Không đăng nhập, không gọi API bên ngoài, không dữ liệu thời gian thực.

### Process

Chấm bài → cộng dồn tỷ lệ đúng theo từng cụm → xác định cụm yếu nhất → lọc ngân hàng câu hỏi theo cụm đó → sinh Arena kế tiếp → chấm đỗ/trượt → tính lại điểm yếu.

### Output

> **Bảng chẩn đoán 5 cụm / 9 module + đề luyện được sinh tự động từ bảng đó**

### User Action

Người học nhìn thấy Standard nào của mình đang yếu, làm tiếp Arena được sinh riêng cho lỗ hổng đó, rồi đối chiếu tỷ lệ đúng ở Arena 1 với Arena 5 để biết lỗ hổng đã đóng chưa.

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
Compare Arena 1 vs Arena 5
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
  "module": "STD_I",           // truc NOI DUNG va BAO CAO chi tiet
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
| 1 | The Gate | 15 | 3 câu × 5 cụm, rải hết 9 module, đủ 3 mức khó | **Chẩn đoán.** Dữ liệu gốc của cả hầm ngục |
| 2 | Trap I | 10 | Cụm yếu nhất (W1), chia đều cho các module trong cụm | Bẫy 1 — bịt lỗ hổng lớn nhất |
| 3 | The Crossroads | 10 | 2 câu × 5 cụm | Kiểm tra duy trì + bổ sung dữ liệu chẩn đoán |
| 4 | Trap II | 10 | Cụm yếu thứ hai (W2), tính lại sau Arena 3 | Bẫy 2 — bịt lỗ hổng thứ hai |
| 5 | Boss | 15 | 3 cụm yếu nhất, phân bổ **7 / 5 / 3** câu theo thứ tự yếu dần | Kiểm tra tổng hợp, quyết định vượt chủ đề |

Tổng: **60 câu** cho một lượt chơi sạch (không trượt lần nào).

> **Vì sao Boss phân bổ 7/5/3 chứ không chia đều:** giữ được ý "càng yếu càng bị hỏi nhiều", và chạy được cho cả chủ đề 3 cụm lẫn 5 cụm mà không phải viết hai nhánh code.

---

## 5. Cơ chế lõi — Chẩn đoán và Bẫy

### Công thức

```text
Accuracy(cụm) = số câu đúng thuộc cụm ÷ số câu đã làm thuộc cụm
```

Tính **cộng dồn** trên toàn bộ câu người học đã làm, tính lại sau mỗi Arena. Cụm có Accuracy thấp nhất là cụm yếu nhất.

Phân định khi bằng nhau: (1) độ khó trung bình của câu làm sai cao hơn → (2) thời gian trả lời trung bình dài hơn → (3) thứ tự mã cụm.

### Hai quy tắc bắt buộc

- **Trap II phải nhắm cụm khác Trap I.** Nếu không, người học yếu nặng một cụm sẽ bị ném 20 câu liên tiếp cùng cụm ở hai Arena kề nhau, ngân hàng của cụm đó phải lớn gấp đôi, còn lỗ hổng thứ hai bị bỏ trống. Nếu W1 vẫn yếu, nó sẽ tự quay lại ở Boss.
- **Boss không loại trừ cụm nào.** Nếu hai Trap có tác dụng thật, W1 và W2 sẽ tự rơi khỏi vị trí yếu nhất — đó chính là bằng chứng cơ chế hoạt động.

### Ví dụ chạy thật

```text
Arena 1 (15 câu · 3 câu/cụm)
  C1 Khung nền        2/3  = 66.7%
  C2 Standards I–II   1/3  = 33.3%   ← yếu nhất
  C3 Standard III     2/3  = 66.7%
  C4 Standards IV–V   3/3  = 100.0%
  C5 Standards VI–VII 2/3  = 66.7%
        ↓  W1 = C2
Arena 2 — Trap I: 10 câu C2 (5 câu Std I + 5 câu Std II), đúng 7
  C2   8/13 = 61.5%
        ↓
Arena 3 (10 câu · 2 câu/cụm) — đúng 7/10 = 70.0% → PASS
  C1   3/5  = 60.0%
  C2  10/15 = 66.7%
  C3   2/5  = 40.0%   ← yếu nhất, và khác W1
  C4   5/5  = 100.0%
  C5   4/5  = 80.0%
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
| Input thiết yếu | Đáp án người chọn + ngân hàng câu hỏi JSON gắn nhãn 2 tầng |
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
Bảng tổng kết: đối chiếu Arena 1 với Arena 5 theo từng cụm và từng module
```

### Đường phụ

- **Trượt một Arena:** vẫn hiện kết quả và lời giải, không cấp Credit, khoá Arena kế tiếp, cho chơi lại với bộ câu rút mới. Không giới hạn số lần.
- **Không mua vật phẩm nào:** hành trình vẫn hoàn chỉnh — kiểm chứng rằng Shop nằm ngoài logic path chính.
- **Đúng toàn bộ Arena 1:** không tồn tại cụm yếu nhất, chuyển sang phân định theo thời gian trả lời, kèm thông báo giải thích cách chọn.

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

**Quy tắc quan trọng:** câu có dùng vật phẩm **vẫn tính** vào % đỗ/trượt của Arena, nhưng **bị loại** khỏi phép tính Accuracy theo cụm. Trả lời đúng nhờ loại bớt phương án không chứng minh người học nắm được cụm đó; đưa vào mẫu sẽ che mất lỗ hổng thật và khiến Trap bắn sai chỗ.

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

Chủ đề Ethics, 5 cụm / 9 module, ngân hàng 110 câu, đủ 5 Arena. Điểm yếu tính lại sau mỗi Arena. Shop 2 vật phẩm. Bảng chẩn đoán 2 tầng + biểu đồ tiến bộ + giải thích từng câu sai. Lưu tiến trình trên trình duyệt.

### Fallback Scope

Vẫn giữ nguyên core flow — **chẩn đoán → sinh đề theo lỗ hổng** — nhưng rút gọn:

- ngân hàng còn 75 câu, chấp nhận lặp câu;
- điểm yếu chỉ tính **một lần** sau Arena 1 rồi khoá cứng cho cả hầm ngục;
- báo cáo chỉ ở tầng cụm, bỏ bảng chi tiết 9 module;
- Shop còn 1 vật phẩm;
- biểu đồ thay bằng bảng số liệu.

Fallback không được biến thành một bộ đề trắc nghiệm có chấm điểm. Nếu cơ chế Trap bị cắt, sản phẩm mất toàn bộ lý do tồn tại.

### Out of Scope

- các chủ đề khác ngoài Ethics;
- hệ thống tài khoản, đăng nhập, đồng bộ thiết bị;
- bảng xếp hạng, chế độ nhiều người chơi;
- trợ lý hỏi đáp, sinh câu hỏi bằng AI;
- giới hạn thời gian mỗi câu;
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
Đủ 5 Arena, tính lại điểm yếu sau mỗi Arena, Shop và biểu đồ tiến bộ
```

---

## 13. Điểm cần chốt

| # | Vấn đề | Ảnh hưởng |
|---|---|---|
| 1 | **Bảng ánh xạ 9 module → 5 cụm ở mục 2** là đề xuất của nhóm, chưa đối chiếu với trọng số đề thi thật | Nếu đổi cách gom cụm, toàn bộ số liệu ngân hàng ở mục 9 phải tính lại. Nên chốt trước khi soạn câu hỏi |
| 2 | Sản lượng biên soạn câu hỏi thực tế theo tuần | Quyết định chọn mốc 110 câu hay 75 câu. Là điều kiện tiên quyết để khoá phạm vi |
| 3 | Mức ≥90% được 4 Credit và thưởng +5 khi vượt Boss | Phần nhóm tự đề xuất, chưa có trong yêu cầu gốc. Bỏ đi thì tổng Credit giảm ~1/3 |

---

## Câu hỏi mà MVP phải trả lời

> Sau khi đi hết một hầm ngục, tỷ lệ đúng ở những cụm **bị Trap nhắm** có tăng rõ rệt hơn so với những cụm **không bị nhắm** hay không?

Nếu có, cơ chế chẩn đoán tạo ra giá trị thật. Nếu không, sản phẩm chỉ là một bộ đề trắc nghiệm được đóng gói đẹp — và nhóm phải sửa cơ chế, không phải thêm tính năng.
