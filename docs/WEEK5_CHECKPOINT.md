# WEEK 5 CHECKPOINT — CFA QUEST · ETHICS

**Học phần:** NHA408E · **Nhóm:** 7
**Nguồn đối chiếu của file này:** `SOLUTION_STRUCTURE.md` (Mục 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13) và `ethics_bank_110.json`.

Week 5 không định nghĩa lại problem, user task, input, logic hay output — những phần đó đã chốt ở Weeks 1–4. File này chỉ trả lời câu hỏi trung tâm của Week 5:

> Người dùng tương tác với logic đã có bằng cách nào, và nhìn thấy kết quả ra sao để hiểu và hành động?

Mọi nội dung dưới đây dẫn ngược được về một mục cụ thể trong `SOLUTION_STRUCTURE.md`. Chỗ nào tài liệu gốc chưa quy định, file ghi rõ là **chưa chốt** chứ không suy đoán.

---

## 1. User goal

Nguồn: Mục 1 (User, User Action) và Mục 12.

> Thí sinh đang tự ôn CFA Level I môn Ethics, đã học xong lý thuyết nhưng chưa biết mình yếu cụ thể ở Standard nào. Người học muốn biết mình yếu cụm nào, được luyện đúng cụm đó, và cuối lượt chơi đối chiếu được tỷ lệ đúng ở mốc chẩn đoán với tỷ lệ đúng ở Boss để biết lỗ hổng đã đóng chưa.

Ràng buộc đi kèm goal, ghi ở Mục 0: **người học không tự chọn mình luyện gì — dữ liệu sai của họ chọn hộ.** Vì vậy giao diện không được có bước "chọn nội dung muốn luyện": thêm bước đó là trả quyền chọn về cho người học và phá đúng lý do tồn tại của sản phẩm.

Bốn câu kiểm tra theo Mục 5 đề bài:

| Câu hỏi | Trả lời theo tài liệu gốc |
|---|---|
| User biết bắt đầu ở đâu không? | Có một điểm vào duy nhất: vào chủ đề Ethics → Arena 1 (Mục 7, Đường chính) |
| Mỗi bước có phục vụ goal không? | Cả 5 Arena đều phục vụ vì đều sinh dữ liệu cho bảng tổng kết. Shop là bước duy nhất nằm ngoài logic path chính (Mục 7, Đường phụ) |
| Có bước nào không cần thiết không? | Xem Mục 7 file này |
| Output có dẫn tới next action rõ không? | Chưa — xem Mục 6.3 |

---

## 2. Main feature và supporting features

Chi tiết đầy đủ: **`docs/feature-scope.md`**. Phần dưới chỉ tóm tắt để đọc liền mạch.

**Main feature — sinh Arena từ dữ liệu sai của người học.** Mục 3 tài liệu gốc gọi tên core process này là *Diagnostic-Driven Practice Generation*: `Diagnose → Rank Weakness → Filter Question Bank → Generate Targeted Arena → Re-Diagnose → Verify`.

Phép thử của đề bài — *bỏ feature này thì core user task còn hoàn thành được không?* — Mục 3 đã trả lời sẵn: bộ đề trắc nghiệm thường trả lời "tôi được bao nhiêu điểm", sản phẩm này trả lời "lần sau tôi nên luyện gì" và tự sinh luôn đề đó.

**Supporting features:** bảng chẩn đoán 2 tầng (5 cụm + 9 module), công bố cụm bị nhắm trước Arena kế tiếp, lời giải câu sai kèm lý do gây nhiễu, bảng tổng kết sau Boss, `performance_score` toàn lượt, đỗ/trượt và Credit, lưu tiến trình trên trình duyệt.

**Optional features:** Shop, vật phẩm thứ hai, bảng chi tiết tầng 9 module, việc tính lại điểm yếu sau mỗi Arena.

Một điểm phải nói rõ khi bảo vệ: `performance_score` là supporting chứ không phải core. Mục 5 ghi thẳng — nó không quyết định W1, W2, không quyết định cụm nào vào Boss, không quyết định đỗ/trượt, không cấp Credit.

---

## 3. Core và Optional

Chi tiết đầy đủ: **`docs/feature-scope.md`**, mục 4 và 5.

Ranh giới này không do Week 5 nghĩ ra. Mục 10 tài liệu gốc đã chia sẵn Target Scope và Fallback Scope, và câu quyết định nằm ở cuối phần Fallback:

> Fallback không được biến thành một bộ đề trắc nghiệm có chấm điểm. Nếu cơ chế Trap bị cắt, sản phẩm mất toàn bộ lý do tồn tại.

Phép thử: cái gì còn lại trong Fallback Scope là **core**; cái gì bị rút đi mà sản phẩm vẫn sống là **optional**.

Core: chuỗi 5 Arena · chấm bài và cộng dồn theo cụm · xếp hạng cụm yếu và chọn W1, W2 · lọc ngân hàng và sinh đề · cổng đỗ/trượt 70% · bảng tổng kết sau Boss · lời giải câu sai.

**Quyết định Week 5:** đóng băng toàn bộ optional cho tới khi core chạy trọn vẹn, theo đúng khuyến nghị Mục 4 đề bài. Week 5 và Week 6 không thêm feature mới.

---

## 4. User flow

Chi tiết đầy đủ — 14 bước happy path, 4 nhánh alternative, 7 tình huống error, kèm cột Evidence dẫn về từng mục tài liệu gốc: **`docs/user-flow.md`**.

Tóm tắt để đối chiếu nhanh tại buổi checkpoint:

| | Nội dung |
|---|---|
| Điểm bắt đầu | Vào chủ đề Ethics — một điểm vào duy nhất, không có menu chọn nội dung luyện |
| Điểm kết thúc | Bảng tổng kết sau Boss |
| Một lượt chơi sạch | 60 câu — 15 + 10 + 10 + 10 + 15 |
| Happy path | Arena 1 → công bố W1 → Trap I → Crossroads → công bố W2 → Trap II → Boss → bảng tổng kết |
| Alternative path | Trượt một Arena · không mua vật phẩm nào · đúng toàn bộ Arena 1 · dùng vật phẩm thứ hai trong cùng Arena |
| Error path | 7 tình huống theo Mục 7 tài liệu gốc, chia hai nhóm: chặn thao tác (E1–E3) và hệ thống tự xử lý có báo cho người học (E4–E5) |

Ba điểm của flow hay bị hỏi nhất:

- **Trap II bắt buộc nhắm cụm khác Trap I.** Nếu không, người yếu nặng một cụm bị 20 câu liên tiếp cùng cụm ở hai Arena kề nhau, ngân hàng cụm đó phải lớn gấp đôi, còn lỗ hổng thứ hai bị bỏ trống.
- **Boss không loại trừ cụm nào.** Nếu hai Trap có tác dụng thật, W1 và W2 tự rơi khỏi vị trí yếu nhất — đó là bằng chứng cơ chế hoạt động.
- **Khi có trượt và chơi lại:** mốc chẩn đoán và `performance_score` đọc theo lượt làm đầu tiên; điểm số và Credit đọc theo lượt đỗ. Bảng tổng kết phải có dòng chú thích.

---

## 5. Input design

### 5.1 Bốn input theo Mục 1, tách theo người nhập

| Input | Ai nhập | Xuất hiện trên giao diện thế nào |
|---|---|---|
| Lựa chọn đáp án từng câu (3 phương án) | Người học | 3 nút phương án + nút Xác nhận |
| Thời gian trả lời từng câu | Hệ thống đo ngầm, từ lúc câu hiện lên đến lúc bấm Xác nhận | **Không hiển thị**, không đếm ngược, không trừ điểm |
| Trạng thái dùng vật phẩm của từng câu | Người học | Nút dùng vật phẩm trong màn câu hỏi |
| Ngân hàng câu hỏi JSON gắn nhãn 2 tầng | Nạp sẵn | Không phải input của người học |

Không đăng nhập, không gọi API bên ngoài, không dữ liệu thời gian thực (Mục 1).

### 5.2 Bảy tiêu chí trình bày input theo Mục 8 đề bài

Chỉ áp cho hai input người học thật sự nhập:

| Tiêu chí | Chọn đáp án | Dùng vật phẩm |
|---|---|---|
| Label rõ | Ghi rõ cụm và module của câu đang làm | Ghi đúng tên: Bùa Loại Trừ / Cuộn Giấy Gợi Ý |
| Đơn vị | Không áp dụng | Giá ghi bằng Credit: 3 và 4 |
| Ví dụ / mô tả hiệu ứng | Không áp dụng | Bùa Loại Trừ loại **1** phương án sai (3 → 2 phương án). Cuộn Giấy Gợi Ý hiện Standard đang bị áp dụng, không tiết lộ đáp án |
| Bắt buộc / tuỳ chọn | Bắt buộc — không chọn thì không chuyển câu (E1) | Tuỳ chọn hoàn toàn |
| Khoảng hợp lệ | Đúng 1 trong 3 phương án | Tối đa 1 vật phẩm/câu và 1 vật phẩm/Arena; cấm ở Arena 1 và Boss |
| Thông báo lỗi | "Chưa chọn phương án" | "Mỗi Arena sử dụng tối đa 1 vật phẩm" · "Arena 1 không dùng vật phẩm" · "Boss không dùng vật phẩm" · "Còn thiếu X Credit" |
| Mặc định | Không chọn sẵn phương án nào | Không dùng |

Ba luật dùng vật phẩm ở Mục 8 phải hiện ngay tại chỗ, không giấu trong phần hướng dẫn: Arena 1 không dùng, Boss không dùng, mỗi Arena tối đa 1 vật phẩm.

### 5.3 Cảnh báo bắt buộc tại nút vật phẩm

Mục 8 quy định câu có dùng vật phẩm vẫn tính vào `arena_score_correct` nhưng bị loại khỏi `diagnostic_correct` và `diagnostic_attempted`. Đây là quy tắc khó hiểu nhất của sản phẩm và người học không có cách nào tự đoán ra.

Ngay tại nút dùng vật phẩm phải có một dòng: **"Câu này vẫn tính điểm đỗ/trượt, nhưng không tính vào chẩn đoán cụm."**

---

## 6. Output design

### 6.1 Output chính sau mỗi Arena

Nguồn: Mục 5, phần "Output chính sau mỗi arena". Không thêm, không bớt.

| Arena | Output |
|---|---|
| Arena 1 | Weakness profile 1 + `arena_score_correct` (%) |
| Trap I | `arena_score_correct` (%) |
| Crossroads | Weakness profile 2 + `arena_score_correct` (%) |
| Trap II | `arena_score_correct` (%) |
| Boss | Bảng tổng kết cả 5 màn + `performance_score` toàn lượt |

`performance_score` chỉ hiện **một lần**, tại bảng tổng kết sau Boss. Lý do ở Mục 5: từ Trap I trở đi câu được bốc ngẫu nhiên nên độ khó trung bình mỗi Arena một khác; điểm màn này thấp hơn màn kia không có nghĩa người chơi đi xuống. Hiện theo từng Arena là mời người đọc so hai con số không so được với nhau.

### 6.2 Bảng tổng kết sau Boss

Cấu trúc theo Mục 5: mỗi dòng một cụm, mỗi cột một Arena, ô ghi **cặp số** dạng `đúng/hỏi`, cột cuối là kết luận.

Ba quy tắc hiển thị lấy thẳng từ Mục 5:

1. Ô ghi cặp số, không ghi phần trăm — vì mốc chẩn đoán phải cộng được `(1+2)/(3+2)`, mà hai phần trăm thì không cộng được.
2. Arena không hỏi cụm đó thì ghi `--`, không ghi `0/0`, không ghi `0%`.
3. Phải có chú thích: `--` nghĩa là Trap không nhắm vào và Boss không hỏi cụm đó, **không phải** người chơi trả lời sai hết.

Cột kết luận chạy theo 4 điều kiện, đúng thứ tự:

| # | Điều kiện | Kết luận hiển thị |
|---|---|---|
| 1 | Cụm không được hỏi ở Boss | Không kiểm tra lại ở Boss |
| 2 | Boss ≥ 70% và mức thay đổi ≥ 0 | Đã cải thiện |
| 3 | Boss < 70% và mức thay đổi > 0 | Đã cải thiện nhưng chưa đủ |
| 4 | Các trường hợp còn lại | Cần cải thiện tiếp |

Trong đó `mức thay đổi = tỷ lệ đúng ở Boss − mốc chẩn đoán`, và mốc chẩn đoán chỉ gộp Arena 1 với Crossroads, không gộp Trap — vì Trap chỉ nhắm 2 trong 5 cụm, tính vào thì hai cụm bị nhắm được cộng thêm 10 câu mà ba cụm kia không có. Mức thay đổi không hiện thành cột riêng; người đọc tự thấy qua các cặp số trên cùng một dòng.

Ngưỡng 70% ở điều kiện 2 và 3 là tỷ lệ đúng phần câu Boss **của riêng cụm đó**, không phải điểm đỗ/trượt của Arena 5. Bảng phải ghi rõ chỗ này, vì trên cùng một màn hình đang có hai con số 70% mang hai nghĩa khác nhau.

### 6.3 Bảy tiêu chí output theo Mục 9 đề bài

| Tiêu chí | Đáp ứng bằng gì | Trạng thái |
|---|---|---|
| Main result nổi bật | `arena_score_correct` (%) và kết luận đỗ/trượt | Đã quy định — Mục 5, Mục 8 |
| Đơn vị rõ | % cho các chỉ số; cặp số `đúng/hỏi` trên bảng tổng kết; Credit cho phần thưởng | Đã quy định |
| Diễn giải | Cột kết luận 4 mức | Đã quy định |
| So sánh / bối cảnh | Mốc chẩn đoán đặt cạnh kết quả Boss trên cùng một dòng | Đã quy định |
| Giải thích | Lời giải từng câu sai + lý do gây nhiễu từng phương án | Đã quy định |
| Limitation | kết quả phản ánh cụm có tỷ lệ đúng thấp nhất trong lượt chơi 60 câu này, không phải kết luận về năng lực Ethics tổng thể | Đã quy định |
| Next action | Module và sub-standard của các câu đã sai, in kèm dòng của cụm cần cải thiện | Đã quy định |

---

## 7. Rà bước không cần thiết (Mục 7 đề bài)

| Câu hỏi rà soát | Đối chiếu tài liệu |
|---|---|
| Có bắt user nhập lại dữ liệu không? | Không. Bốn input ở Mục 1 mỗi thứ nhập một lần |
| Có trang nào chỉ để trang trí không? | Chưa xác định — phải rà trên bản build |
| Có nút nào không tạo ra action không? | Chưa xác định — phải rà trên bản build |
| Có output lặp lại không? | Một nguy cơ đã lường trước: `performance_score` nếu hiện cả theo Arena lẫn theo lượt. Mục 5 chốt chỉ hiện một lần sau Boss |
| Có login không cần thiết không? | Không. Mục 10 xếp hệ thống tài khoản vào Out of Scope |
| Có bước kỹ thuật nhưng không có giá trị với user không? | Đo thời gian trả lời là bước kỹ thuật, nhưng đã thiết kế thành bước ngầm: không đếm ngược, không trừ điểm, người học không phải làm gì thêm |

Hai ô "chưa xác định" phải rà trực tiếp trên bản build và điền trước buổi checkpoint.

---

## 8. Explainability

Week 4 trả lời: vì sao logic tạo ra kết quả này. Week 5 hỏi: người dùng nhìn màn hình có hiểu kết quả đó không.

| Thành phần | Nội dung phải nói |
|---|---|
| Lời giải từng câu sai | Vì sao đáp án đúng là đúng |
| Lý do gây nhiễu | Lỗi tư duy nào dẫn tới từng phương án sai — field `distractor_reason` đã có sẵn cho cả 3 phương án |
| Câu công bố cụm bị nhắm | Vì sao Arena sau hỏi cụm này: vì cụm này có tỷ lệ đúng thấp nhất tính đến thời điểm hiện tại |
| Ghi chú công thức ở bảng tổng kết | `performance_score` là tỷ lệ đúng có trọng số theo mức khó, không tính câu dùng vật phẩm vào tử số |
| Chú thích ký hiệu `--` | Không bị hỏi, không phải sai hết |
| Chú thích khi có trượt | Mốc chẩn đoán đọc theo lượt làm đầu tiên; điểm và Credit đọc theo lượt đỗ |
| Cảnh báo tại nút vật phẩm | Câu dùng vật phẩm không vào mẫu chẩn đoán |

Ba chỉ số dễ bị hiểu nhầm nhất và cách phân biệt trên màn hình — nguồn Mục 5:

| Chỉ số | Câu dùng vật phẩm được xử lý thế nào | Dùng để | Hiện ở đâu |
|---|---|---|---|
| `accuracy_cumulative` | Loại khỏi cả tử và mẫu | Xếp hạng cụm yếu, chọn W1 và W2 | Bảng chẩn đoán sau mỗi Arena |
| `arena_score_correct` | Tính cả vào tử và mẫu | Đỗ/trượt và Credit | Ngay khi kết thúc Arena |
| `performance_score` | Loại khỏi tử, **giữ ở mẫu** | Phân biệt hai người cùng điểm | Một lần duy nhất, sau Boss |

Ba chỉ số này đều là phần trăm nhưng mang ba nghĩa khác nhau, nên không được đặt cạnh nhau trong cùng một khối mà không có nhãn phân biệt. Mục 5 đã cảnh báo đây là chỗ dễ nhầm nhất khi code — cũng là chỗ dễ nhầm nhất khi đọc.

---

## 9. Working interface draft

Đề bài yêu cầu một flow review được; mockup tĩnh không thay được progress build.

Sáu màn hình tối thiểu suy ra từ Đường chính ở Mục 7:

| # | Màn hình | Nội dung tối thiểu |
|---|---|---|
| 1 | Vào chủ đề Ethics | Một điểm vào duy nhất; nêu luật: 5 Arena, ngưỡng 70%, 3 Credit khởi đầu |
| 2 | Màn câu hỏi | Stem, 3 phương án, nút Xác nhận, nhãn cụm và module, nút vật phẩm |
| 3 | Kết quả Arena | % tổng, đỗ/trượt, Credit được cấp, lời giải các câu sai |
| 4 | Bảng chẩn đoán + công bố cụm bị nhắm | 5 cụm, 9 module, cụm yếu nhất |
| 5 | Shop | 2 vật phẩm, giá bằng Credit, số dư hiện có |
| 6 | Bảng tổng kết sau Boss | Bảng cụm × Arena + cột kết luận + `performance_score` + các dòng chú thích |

Ưu tiên Week 5: màn 2, 3, 4 phải chạy thật và nối được với logic chấm, vì đây là ba màn người học nhìn thấy cơ chế chẩn đoán hoạt động. Màn 5 là optional, để sau. Màn 6 chưa cần đầy đủ nhưng phải dựng được khung cột.

Trạng thái build thực tế của từng màn: nhóm điền trước buổi checkpoint.

---
## 10. Ownership và integration evidence

> **Về lịch sử commit:** Toàn bộ file được nhóm trưởng upload thay cả nhóm, nên tên người commit không phải là tác giả nội dung. Tác giả từng phần ghi ở bảng dưới.
>
> **Khai báo công cụ hỗ trợ:** code demo trong `src/` và macro VBA `W4/` được viết với sự hỗ trợ của Claude (AI). Mỗi khối code trong `cfa_quest_v11.js` có ghi chú Mục tương ứng trong `SOLUTION_STRUCTURE.md` để truy ngược từ code về đặc tả.

| Thành viên | Loại đóng góp | Sản phẩm cụ thể | Bằng chứng trong repo | Được dùng ở đâu |
|---|---|---|---|---|
| **Quỳnh** | code + logic | • User flow: happy path 14 bước, alternative path, error path 7 tình huống<br>• Feature scope: main / supporting / optional feature, ranh giới Core–Optional, out of scope<br>• Ba công thức tính điểm: `accuracy_cumulative`, `arena_score_correct`, `performance_score` (quy đổi độ khó 1/2/3 điểm)<br>• Biến trạng thái; luật phân định khi hai cụm bằng tỷ lệ đúng; quy tắc loại câu dùng vật phẩm khỏi mẫu chẩn đoán<br>• Bảng tổng kết sau Boss với 4 điều kiện kết luận<br>• File Excel minh hoạ một lượt chơi <br>• Macro VBA<br>• Tài liệu: `SOLUTION_STRUCTURE`, `INPUT_DICTIONARY`, `ASSUMPTIONS`, `SOURCE_USE_MAP`, `SAMPLE_INPUT_OUTPUT`, `MIDTERM_REVIEW`, `README`<br>• Rà soát, hoàn thiện bản cuối ngân hàng câu hỏi; tích hợp các phần thành demo | `docs/user-flow.md`<br>`docs/feature-scope.md`<br>`SOLUTION_STRUCTURE.md` Mục 5, 7<br>`INPUT_DICTIONARY.md` Mục 3–4<br>`W4/CFA_Quest_user_flow.xlsm`<br>`W4/VBA_CFA_Quest.bas`<br>`cfa_quest_v11.js` khối 6 (Tính toán), khối 13 (Bảng tổng kết) | Công thức ở khối 6 xác định W1, W2 và 3 cụm vào Boss; file Excel dùng để kiểm chứng công thức bằng tay trước khi code và làm demo "what-if" khi bảo vệ; user flow là khung cho các màn hình |
| **Hồng** | nội dung | • 110 câu hỏi, 22 câu × 5 cụm, phủ đủ 9 module<br>• Mỗi câu 13 trường: đề, 3 phương án, đáp án, lời giải (`explanation`), lý do gây nhiễu cho từng phương án sai (`distractor_reason`), gợi ý (`hint`)<br>• Gắn nhãn `cluster`, `module`, `sub_standard`, `difficulty` cho từng câu | `data/ethics_bank_110.json`<br>`data/questions.js`<br>`src/cfa_quest_v11_bank.js` (bản nhúng) | Engine lọc câu theo `cluster` / `module` khi sinh đề; `difficulty` là trọng số của `performance_score`; `explanation` hiện ở màn kết quả; `sub_standard` là nội dung của Cuộn Giấy Gợi Ý |
| **Trang** | logic + code | • Quy tắc sinh 5 Arena: Arena 1 lấy 3 câu × 5 cụm, rải hết 9 module, đủ 3 mức khó; Trap lấy 10 câu của cụm yếu, chia đều module; Crossroads 2 câu × 5 cụm; Boss 7/5/3<br>• Ràng buộc Trap II nhắm cụm khác Trap I (W2 ≠ W1)<br>• Chống lặp câu trong một lượt; lấy bù câu cũ khi cụm hết câu<br>• Kiểm tra ràng buộc ngân hàng: id trùng, đủ 3 phương án, `cluster` khớp `module`, đáp án đúng không phải phương án dài nhất, lý do gây nhiễu không tái sử dụng | `SOLUTION_STRUCTURE.md` Mục 2 (ba quy tắc phủ module), Mục 4<br>`cfa_quest_v11.js` khối 5 (`buildArena1`, `drawCluster`, `buildArena`)<br>`rankClusters(..., [S.w1])` khi chọn W2<br>`tools/validate_question_bank.html` | `buildArena` chạy mỗi lần chuyển Arena; công cụ kiểm tra dùng để QA ngân hàng câu hỏi trước khi nhúng vào demo |
| **Minh** | logic + code | • Cơ chế Credit: khởi đầu 3; đỗ được 2 / 3 / 4 Credit theo mức 70 / 80 / 90%; +5 khi vượt Boss lần đầu<br>• Hai vật phẩm: Bùa Loại Trừ (3 Credit, loại 1 phương án sai), Cuộn Giấy Gợi Ý (4 Credit, hiện Standard đang áp dụng)<br>• Luật dùng: Arena 1 và Boss không dùng; mỗi Arena tối đa 1; mỗi câu tối đa 1 | `SOLUTION_STRUCTURE.md` Mục 8<br>`cfa_quest_v11.js` khối 1 (`creditTiers`, `ITEMS`), `creditFor()`, khối 10 (`useItem`, `renderItemBox`), khối 12 (Shop) | Credit cộng sau mỗi Arena; ô vật phẩm chỉ mở ở Trap I, Crossroads, Trap II |
| **Khôi** | UI + QA | • Giao diện: màn làm bài, màn kết quả sau mỗi Arena, bảng tiến trình, Shop, bảng tổng kết sau Boss<br>• Kiểm thử đường lỗi E1–E7<br>• Đối chiếu chéo các file | `src/cfa_quest_v11.html`<br>`src/cfa_dungeon_ui_v10_skipfix_updated.css`<br>`cfa_quest_v11.js` khối 7–9, 11 | Người chơi thao tác trên các màn này; kết quả đối chiếu dùng để sửa chỗ lệch giữa tài liệu và code |

---

## 11. Revision evidence

Week 5 không sửa logic giữa kỳ. Ba điểm còn để ngỏ đã ghi sẵn ở Mục 13 của `SOLUTION_STRUCTURE` và vẫn đang mở:

| # | Điểm chưa chốt | Ảnh hưởng |
|---|---|---|
| 1 | Bảng ánh xạ 9 module → 5 cụm là đề xuất của nhóm, chưa đối chiếu với trọng số đề thi thật | Đổi cách gom cụm thì toàn bộ số liệu ngân hàng ở Mục 9 phải tính lại |
| 2 | Sản lượng biên soạn câu hỏi thực tế theo tuần | Quyết định giữ hay bỏ mốc 110 câu |
| 3 | Mức ≥ 90% được 4 Credit và thưởng +5 khi vượt Boss là phần nhóm tự đề xuất | Bỏ đi thì tổng Credit giảm khoảng một phần ba |

Hai việc mới phát sinh ở Week 5, đều thuộc phần trình bày chứ không phải phần logic: bổ sung dòng limitation và bổ sung next action cho bảng tổng kết (Mục 6.3).

---

## 12. Cấu trúc repo cuối Week 5

Repo chỉ cộng thêm, không bỏ file nào của Weeks 1–4 và bài giữa kỳ. Bốn mục đánh dấu **mới** là phần bổ sung của Week 5.

```text
README.md
data/
  ethics_bank_110.json        ngân hàng 110 câu, nguồn dữ liệu duy nhất
  questions.js                bản nhúng của file trên, để chạy không cần server
docs/
  SOLUTION_STRUCTURE.md       tài liệu lõi: core flow, ba công thức, O4, claim boundary
  INPUT_DICTIONARY.md         nghĩa từng field, ba bộ đếm, quy tắc đặt tên biến
  ASSUMPTIONS.md              giả định, rủi ro, câu không được biến thành claim
  SOURCE_USE_MAP.md           nguồn nào cấp gì, traceability từng field
  SAMPLE_INPUT_OUTPUT.md      sample tính tay, 16 test case, validation
  MIDTERM_REVIEW.md           tổng hợp Part A–E cho giữa kỳ
  WEEK5_CHECKPOINT.md         mới — file này
  user-flow.md                mới — happy / alternative / error path
  feature-scope.md            mới — main, supporting, core, optional
src/                          mới — working interface draft
  index.html
  style.css
  app.js
tools/
  validate.html               công cụ QA offline cho ngân hàng câu hỏi
```

Ba quy ước đi kèm:

1. **`src/index.html` là file để mở.** Đặt tên `index.html` để người chấm mở thẳng, không phải hỏi mở file nào.
2. **Ngân hàng câu hỏi chỉ nằm ở `data/`.** Không nhân bản `questions.js` sang `src/`. Hai bản ở hai chỗ là nguồn lệch dữ liệu chắc chắn sẽ xảy ra.
3. **Mỗi nội dung chỉ có một file là nguồn.** File checkpoint này trỏ sang `user-flow.md` và `feature-scope.md` chứ không chép lại, để không tạo ra mâu thuẫn giữa các file khi sửa.

---

## 13. Đối chiếu danh sách lỗi thường gặp (Mục 14 đề bài)

| Lỗi thường gặp | Nhóm tránh bằng cách nào |
|---|---|
| Thêm nhiều feature sau giữa kỳ | Đóng băng optional — `feature-scope.md` |
| Giao diện đẹp nhưng logic chưa nối | Ưu tiên Week 5 đặt vào màn 2, 3, 4 — ba màn bắt buộc nối logic |
| User nhập dữ liệu không rõ đơn vị | Giá vật phẩm ghi bằng Credit, kết quả ghi bằng %, bảng tổng kết ghi bằng cặp số |
| Output chỉ có con số | Cột kết luận 4 mức + lời giải + lý do gây nhiễu |
| Không có error path | 7 tình huống trong `user-flow.md` |
| Alternative path quá phức tạp | Đúng 4 nhánh theo tài liệu gốc |
| User flow bắt đầu từ menu thay vì goal | Một điểm vào duy nhất, không có menu chọn nội dung luyện |
| Mockup không được tích hợp | Không dùng mockup tĩnh thay cho build |
| Feature không có owner | Bảng ở Mục 10 |
| Sửa UI nhưng không kiểm tra ý nghĩa của số liệu | Ba chỉ số ở Mục 8 phải giữ đúng cách xử lý câu dùng vật phẩm dù giao diện đổi thế nào |

---

## 14. Chuẩn bị Checkpoint 5

Mười thứ cần mở sẵn khi trình bày:

1. Bản build hiện tại
2. Core user flow — `docs/user-flow.md`
3. Main feature — `docs/feature-scope.md`
4. Input — Mục 5
5. Output — Mục 6
6. Explanation — Mục 8
7. Xử lý lỗi — `docs/user-flow.md`
8. Revision từ giữa kỳ — Mục 11
9. Owner — Mục 10
10. Ưu tiên build tiếp theo — Mục 9

Sáu câu tự kiểm tra của đề bài:

| Câu hỏi | Trả lời |
|---|---|
| User có hoàn thành core task không? | Core task là đi hết 5 Arena và biết Standard nào đã cải thiện (Mục 6). Hoàn thành hay chưa phụ thuộc màn 6 — bảng tổng kết — đã dựng xong chưa |
| Bước nào đang gây nhầm? | Ba chỉ số cùng là phần trăm nhưng xử lý câu dùng vật phẩm theo ba cách khác nhau; và hai con số 70% mang hai nghĩa khác nhau trên bảng tổng kết |
| Output có giải thích được không? | Được, nhưng còn thiếu limitation và next action |
| Feature nào nên bỏ? | Không bỏ, chỉ hoãn: Shop, vật phẩm thứ hai, bảng chi tiết 9 module |
| Flow nào phải nối ở Week 6? | Từ bảng chẩn đoán sang khâu sinh đề Arena kế tiếp, và toàn bộ bảng tổng kết sau Boss |
| Limitation nào cần ghi? | Kết luận chỉ trong phạm vi lượt chơi 60 câu; Trap chỉ nhắm 2 trong 5 cụm nên ba cụm còn lại có ít dữ liệu hơn; ngân hàng 110 câu chỉ đủ một lượt chơi sạch, chơi lại sẽ lặp câu |

---

## 15. Checklist cuối Week 5

| # | Mục | Trạng thái |
|---|---|---|
| 1 | Main feature rõ | Xong — `feature-scope.md` |
| 2 | Supporting feature hợp lý | Xong — `feature-scope.md` |
| 3 | Optional feature được kiểm soát | Xong, đã đóng băng — `feature-scope.md` |
| 4 | User goal rõ | Xong, giữ nguyên từ Weeks 1–2 — Mục 1 |
| 5 | Happy path hoàn chỉnh | Xong, 14 bước — `user-flow.md` |
| 6 | Alternative path thực tế | Xong, 4 nhánh — `user-flow.md` |
| 7 | Error path | Xong, 7 tình huống — `user-flow.md` |
| 8 | Input dễ hiểu | Xong phần thiết kế — Mục 5 |
| 9 | Output rõ và giải thích được | Còn thiếu limitation và next action — Mục 6.3 |
| 10 | Working interface draft tồn tại | Nhóm điền trạng thái từng màn — Mục 9 |
| 11 | Logic đã nối một phần với giao diện | Nhóm điền — Mục 9 |
| 12 | Ownership và integration evidence | Xong khung, chờ đối chiếu log commit — Mục 10 |
| 13 | Feedback và revision được cập nhật | Xong — Mục 11 |
