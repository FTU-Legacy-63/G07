# CFA Quest — Solution Structure

> Học phần: **NHA408E**
> Nhóm: **[điền]**
> Sản phẩm: game luyện thi CFA Level I theo cơ chế chẩn đoán — hầm ngục 5 Arena

---

## 0. Sản phẩm trong một đoạn

CFA Quest là một hầm ngục gồm 5 đấu trường (Arena) cho mỗi chủ đề CFA Level I. **Chỉ Arena 1 là đề cố định** — đó là bài chẩn đoán. Bốn Arena còn lại được sinh ra từ chính dữ liệu sai của người học: hệ thống đo tỷ lệ đúng theo từng nhóm nội dung, tìm nhóm yếu nhất, rồi lọc ngân hàng câu hỏi để ném lại đúng nhóm đó vào mặt người học.

Người học không tự chọn mình luyện gì. **Dữ liệu sai của họ chọn hộ.**

---

## 1. User → Input → Process → Output → User Action

### User

Thí sinh đang tự ôn CFA Level I, đã học xong lý thuyết một chủ đề nhưng chưa biết mình yếu cụ thể ở nhóm nội dung nào bên trong chủ đề đó.

### Input

- Lựa chọn đáp án của người học cho từng câu (3 phương án, tương tự định dạng đề CFA thật).
- Ngân hàng câu hỏi tĩnh dạng JSON, mỗi câu đã gắn nhãn sẵn: chủ đề, **nhóm nội dung**, đáp án đúng, lý do đúng sai của từng phương án.

Không đăng nhập, không gọi API bên ngoài, không dữ liệu thời gian thực.

### Process

Chấm bài → cộng dồn tỷ lệ đúng theo từng nhóm nội dung → xác định nhóm yếu nhất → lọc ngân hàng câu hỏi theo nhóm đó → sinh Arena kế tiếp → chấm đỗ/trượt → tính lại điểm yếu.

### Output

> **Bảng chẩn đoán theo nhóm nội dung + đề luyện được sinh tự động từ bảng đó**

### User Action

Người học nhìn thấy nhóm nội dung nào của mình đang yếu, làm tiếp Arena được sinh riêng cho lỗ hổng đó, rồi đối chiếu tỷ lệ đúng ở Arena 1 với Arena 5 để biết lỗ hổng đã được khắc phục chưa.

Luồng tổng quát:

```text
USER
        ↓
Answers + Tagged Question Bank
        ↓
Diagnose by Content Group
        ↓
Weakness Profile
        ↓
Auto-Generated Targeted Arena
        ↓
Compare Arena 1 vs Arena 5
```

---

## 2. Nội dung game

### Chủ đề chia thành nhóm nội dung

Mỗi chủ đề được chia thành các **nhóm nội dung (content group)** — đây là trục chẩn đoán duy nhất của sản phẩm. Mỗi câu hỏi thuộc đúng một nhóm.

Ví dụ với chủ đề **Ethics**:

| Mã | Nhóm nội dung |
|---|---|
| E1 | GIPS |
| E2 | Code of Ethics |
| E3 | Standards I |
| E4 | Standards II |
| E5 | Standards III |
| E6 | Standards IV |
| E7 | Standards V|
| E8 | Standards VI|
| E9 | Standards VII|
Mỗi câu còn gắn thêm **độ khó 1–3**. Độ khó không phải trục chẩn đoán; nó chỉ dùng để cân bằng Arena 1 và để phân định khi hai nhóm có tỷ lệ đúng bằng nhau.

### Định dạng câu hỏi

3 phương án, đúng chuẩn đề CFA Level I.

```text
{
  "id": "ETH-E1-D2-007",
  "topic": "ETHICS",
  "group": "E1",              // truc chan doan
  "difficulty": 2,
  "stem": "...",
  "options": ["...", "...", "..."],
  "answer": 1,
  "distractor_reason": ["...", "...", "..."],   // loi tu duy dan toi tung phuong an sai
  "hint": "...",
  "explanation": "..."
}
```

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

Giá trị của sản phẩm nằm ở chuỗi:

```text
Wrong Answers
    ↓
Weakness Profile
    ↓
Targeted Practice
    ↓
Measured Improvement
```

Đây là điểm phân biệt với một bộ đề trắc nghiệm thường: bộ đề trả lời *"tôi được bao nhiêu điểm"*, sản phẩm này trả lời *"lần sau tôi nên luyện gì"* — và tự sinh luôn đề đó.

---

## 4. Cấu trúc hầm ngục — 5 Arena

| Arena | Tên | Số câu | Nguồn câu hỏi | Vai trò |
|---|---|---|---|---|
| 1 | The Gate | 45 | Chia đều cho các nhóm; mỗi nhóm đủ 3 mức khó | **Chẩn đoán.** Dữ liệu gốc của cả hầm ngục |
| 2 | Trap I | 20 | Nhóm yếu nhất (W1) | Bẫy 1 — bịt lỗ hổng lớn nhất |
| 3 | The Crossroads | 20 | Trộn đều mọi nhóm; câu dư dồn cho nhóm đang yếu nhất | Kiểm tra duy trì + bổ sung dữ liệu chẩn đoán |
| 4 | Trap II | 20 | Nhóm yếu thứ hai (W2), tính lại sau Arena 3 | Bẫy 2 — bịt lỗ hổng thứ hai |
| 5 | Boss | 30 | 3 nhóm yếu nhất, phân bổ số lượng câu sao cho topic yếu nhất có số lượng câu nhiều nhất | Kiểm tra tổng hợp, quyết định vượt chủ đề |

Tổng: **140 câu** cho một lượt chơi (không trượt lần nào).

---

## 5. Cơ chế lõi — Chẩn đoán và Bẫy

### Công thức

```text
Accuracy(nhóm) = số câu đúng thuộc nhóm ÷ số câu đã làm thuộc nhóm
```

Tính **cộng dồn** trên toàn bộ câu người học đã làm trong chủ đề, tính lại sau mỗi Arena. Nhóm có Accuracy thấp nhất là nhóm yếu nhất.

Phân định khi bằng nhau, theo thứ tự: (1) độ khó trung bình của các câu làm sai cao hơn → (2) thời gian trả lời trung bình dài hơn → (3) thứ tự mã nhóm.

### Hai quy tắc bắt buộc

- **Trap II phải nhắm nhóm khác Trap I.** Nếu không, người học yếu nặng một nhóm sẽ bị ném 20 câu liên tiếp cùng nhóm ở hai Arena kề nhau, ngân hàng câu hỏi của nhóm đó phải lớn gấp đôi, còn lỗ hổng thứ hai bị bỏ trống. Nếu W1 vẫn yếu, nó sẽ tự quay lại ở Boss.
- **Boss không loại trừ nhóm nào.** Nếu hai Trap có tác dụng thật, W1 và W2 sẽ tự rơi khỏi vị trí yếu nhất — và đó chính là bằng chứng cơ chế hoạt động.

### Ví dụ chạy thật (chủ đề Ethics)

```text
Arena 1 (15 câu, 5 câu/nhóm)
  GIPS       2/5  = 40.0%   ← yếu nhất
  Standards  3/5  = 60.0%
  Code       4/5  = 80.0%
        ↓  W1 = GIPS
Arena 2 — Trap I: 10 câu GIPS, đúng 8
  GIPS      10/15 = 66.7%
        ↓
Arena 3 (10 câu: GIPS 4, Standards 3, Code 3)
  GIPS      13/19 = 68.4%
  Standards  4/8  = 50.0%   ← yếu nhất, và khác W1
  Code       7/8  = 87.5%
        ↓  W2 = Standards
Arena 4 — Trap II: 10 câu Standards, đúng 7
  Standards 11/18 = 61.1%
        ↓  xếp hạng lại
Arena 5 — Boss (15 câu)
  Standards  7 câu   (61.1% — yếu nhất)
  GIPS       5 câu   (68.4%)
  Code       3 câu   (87.5%)
```

GIPS bắt đầu ở 40% và kết thúc ở 68.4% — mức cải thiện này là output mà sản phẩm phải chứng minh được.

---

## 6. MVP Flow

MVP phải kiểm chứng đúng một điều: **dữ liệu sai của người học có sinh ra được đề luyện đúng chỗ yếu hay không.**

```text
Chọn chủ đề
        ↓
Arena 1 — Chẩn đoán
        ↓
Bảng tỷ lệ đúng theo nhóm nội dung
        ↓
Hệ thống công bố nhóm yếu nhất
        ↓
Sinh Trap I từ nhóm đó
        ↓
Người học làm Trap I
        ↓
Tỷ lệ đúng nhóm đó thay đổi trên biểu đồ
```

Main output của MVP:

> **Weakness Profile + Targeted Arena sinh từ Profile đó**

Sáu thành phần bắt buộc của MVP:

| Thành phần | Nội dung |
|---|---|
| Target user | Thí sinh tự ôn CFA L1, một chủ đề duy nhất |
| Core task | Đi hết 5 Arena và biết nhóm nội dung nào đã cải thiện |
| Input thiết yếu | Đáp án người chọn + ngân hàng câu hỏi JSON đã gắn nhãn |
| Logic path chính | Chấm → cộng dồn theo nhóm → xếp hạng yếu → lọc bank → sinh Arena → đỗ/trượt |
| Output có ý nghĩa | Bảng chẩn đoán theo nhóm + biểu đồ tiến bộ + giải thích từng câu sai |
| User flow hoàn chỉnh | Mục 7 |

---

## 7. User Flow

### Đường chính

```text
Vào chủ đề
    ↓
Arena 1 · 15 câu · không hiện đúng/sai ngay
    ↓
Kết quả: % tổng · đỗ/trượt · Credit · bảng chẩn đoán · giải thích câu sai
    ↓
Hệ thống công bố nhóm bị nhắm ở Arena sau
    ↓
[tuỳ chọn] Vào Shop mua vật phẩm
    ↓
Arena 2 → 3 → 4  (lặp lại vòng trên)
    ↓
Arena 5 — Boss
    ↓
Bảng tổng kết: đối chiếu Arena 1 với Arena 5 theo từng nhóm
```

### Đường phụ

- **Trượt một Arena:** vẫn hiện kết quả và lời giải, không cấp Credit, khoá Arena kế tiếp, cho chơi lại với bộ câu rút mới. Không giới hạn số lần.
- **Không mua vật phẩm nào:** hành trình vẫn hoàn chỉnh — đây là kiểm chứng rằng Shop nằm ngoài logic path chính.
- **Đúng toàn bộ Arena 1:** không tồn tại nhóm yếu nhất, chuyển sang phân định theo thời gian trả lời, kèm thông báo giải thích cách chọn.

### Đường lỗi

| Tình huống | Xử lý |
|---|---|
| Xác nhận khi chưa chọn phương án | Chặn chuyển câu |
| Mua vật phẩm khi không đủ Credit | Vô hiệu hoá nút, báo còn thiếu bao nhiêu |
| Dùng vật phẩm thứ hai trên cùng một câu | Chặn — mỗi câu tối đa 1 vật phẩm |
| Ngân hàng hết câu cho một nhóm | Lấy bù câu cũ, xáo lại thứ tự phương án, báo cho người học |
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
| Cuộn Giấy Gợi Ý | 4 Credit | Hiện một dòng gợi ý: chuẩn mực/khái niệm cần áp dụng. Không tiết lộ đáp án |

> Vì đề chỉ có **3 phương án** đúng chuẩn CFA, vật phẩm không thể loại 2 phương án — làm vậy sẽ chỉ còn lại đáp án đúng, biến vật phẩm thành nút cho điểm miễn phí.

**Quy tắc quan trọng:** câu có dùng vật phẩm **vẫn tính** vào % đỗ/trượt của Arena, nhưng **bị loại** khỏi phép tính Accuracy theo nhóm. Lý do: trả lời đúng nhờ loại bớt phương án không chứng minh người học nắm được nhóm đó; đưa vào mẫu sẽ che mất lỗ hổng thật và khiến Trap bắn sai chỗ.

---

## 9. Ngân hàng câu hỏi cần chuẩn bị

Trường hợp tốn nhiều nhất rơi vào nhóm được chọn làm W1: `5 (Arena 1) + 10 (Trap I) + 4 (Arena 3) + 7 (Boss) = 26 câu`.

| Phương án | Số câu | Đánh giá |
|---|---|---|
| Target | ~20 câu × 9 nhóm ≈ **180 câu** | Đủ cho một lượt chơi không lặp câu |
| Fallback | ~10 câu × 9 nhóm ≈ **90 câu** | Chấp nhận lặp câu ở nhóm W1, có xáo thứ tự phương án |

> Đây là rủi ro tiến độ lớn nhất của dự án. 270 câu tự biên soạn kèm lời giải và lý do gây nhiễu cho từng phương án là khối lượng lớn hơn phần lập trình. Cần chốt sản lượng thực tế theo tuần của người phụ trách nội dung **trước khi** khoá phạm vi MVP.

---

## 10. Target / Fallback / Out of Scope

### Target Scope

Một chủ đề, đủ 5 Arena, ngân hàng ~270 câu. Điểm yếu tính lại sau mỗi Arena. Shop 2 vật phẩm. Bảng chẩn đoán + biểu đồ tiến bộ + giải thích từng câu sai. Lưu tiến trình trên trình duyệt.

### Fallback Scope

Vẫn giữ nguyên core flow — **chẩn đoán → sinh đề theo lỗ hổng** — nhưng rút gọn:

- ngân hàng còn ~50 câu, chấp nhận lặp câu;
- điểm yếu chỉ tính **một lần** sau Arena 1 rồi khoá cứng cho cả hầm ngục;
- Shop còn 1 vật phẩm;
- biểu đồ thay bằng bảng số liệu.

Fallback không được biến thành một bộ đề trắc nghiệm có chấm điểm. Nếu cơ chế Trap bị cắt, sản phẩm mất toàn bộ lý do tồn tại.

### Out of Scope

- nhiều chủ đề cùng lúc;
- hệ thống tài khoản, đăng nhập, đồng bộ thiết bị;
- bảng xếp hạng, chế độ nhiều người chơi;
- trợ lý hỏi đáp, sinh câu hỏi bằng AI;
- giới hạn thời gian mỗi câu;
- cảnh báo lệ thuộc vật phẩm.

---

## 11. Initial Route Hypothesis

**Code-Based Web Application, HTML/CSS/JavaScript thuần, dữ liệu tĩnh, không backend.**

Sản phẩm có luồng tương tác hữu hạn, dữ liệu câu hỏi chuẩn bị trước, toàn bộ logic chẩn đoán chỉ là phép cộng và sắp xếp trên mảng — không cần máy chủ. Tiến trình lưu trên trình duyệt.

Fallback kỹ thuật: prototype tương tác kèm tài liệu đặc tả logic rõ ràng. Dù đi route nào, người dùng vẫn phải hoàn thành cùng một core task và nhận cùng một main output.

**Bản quyền:** câu hỏi do nhóm tự biên soạn; tình huống trong đề Ethics là tình huống giả định, không trích nguyên văn tài liệu CFA Institute.

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
Biết mình yếu nhóm nội dung nào và luyện đúng nhóm đó
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
| 1 | Chủ đề dùng cho MVP demo: Ethics (9 nhóm) hay chủ đề khác | Thiết kế chạy được cả hai nhờ quy tắc Boss; nhưng ngân hàng câu hỏi phải soạn cho đúng một chủ đề |
| 2 | Sản lượng biên soạn câu hỏi thực tế theo tuần | Quyết định chọn mốc 80 câu hay 50 câu. Là điều kiện tiên quyết để khoá phạm vi |
| 3 | Mức ≥90% được 4 Credit và thưởng +5 khi vượt Boss | Phần nhóm tự đề xuất, chưa có trong yêu cầu gốc. Bỏ đi thì tổng Credit giảm ~1/3 |

---

## Câu hỏi mà MVP phải trả lời

> Sau khi đi hết một hầm ngục, tỷ lệ đúng ở những nhóm nội dung **bị Trap nhắm** có tăng rõ rệt hơn so với những nhóm **không bị nhắm** hay không?

Nếu có, cơ chế chẩn đoán tạo ra giá trị thật. Nếu không, sản phẩm chỉ là một bộ đề trắc nghiệm được đóng gói đẹp — và nhóm phải sửa cơ chế, không phải thêm tính năng.
