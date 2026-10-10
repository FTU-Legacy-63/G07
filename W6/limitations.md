# Limitations — CFA Quest Week 7

Tài liệu này cập nhật theo thiết kế Week 7 trong `SOLUTION_STRUCTURE.md`, `INPUT_DICTIONARY.md`, `user-flow.md`, `feature-scope.md` và ngân hàng 170 câu hiện tại.

Mỗi limitation đều kèm **Impact** để dùng trực tiếp trong README/final report.

---

## 1. Replay vẫn có thể làm lặp câu

Engine ưu tiên câu chưa xuất hiện trong lượt chơi. Khi pool câu phù hợp không đủ, hệ thống có thể phải dùng lại câu đã gặp.

**Impact:** điểm ở lần replay có thể tăng một phần vì người chơi nhớ câu hoặc nhớ logic đáp án, không chỉ vì hiểu Ethics tốt hơn. Improvement trong cùng session vì vậy có nguy cơ bị ảnh hưởng bởi repeated exposure.

---

## 2. Bank 170 câu vẫn hữu hạn, đặc biệt ở nhóm câu khó

Bank hiện tại có:

```text
170 câu = 34 câu / cluster
```

Thiết kế Week 7 còn yêu cầu tỷ lệ câu khó tăng dần:

```text
Arena 2 = 2 câu khó
Arena 3 = 3 câu khó
Arena 4 = 4 câu khó
Boss    = 9 câu khó
```

Mỗi cluster chỉ có khoảng **9–10 câu khó**. Nếu người chơi trượt Arena 4 nhiều lần, cluster W2 có thể hết câu khó mới trước khi tới Boss.

Khi đó generator phải fallback:

1. dùng lại câu đã gặp ở cùng difficulty;
2. nếu vẫn thiếu thì hạ xuống mức vừa;
3. ghi trường hợp này vào `bankLog`.

**Impact:** round sau có thể không còn đúng hoàn toàn với intended difficulty mix và repeated exposure có thể ảnh hưởng kết quả. Không nên mô tả bank là “không lặp”.

---

## 3. Replay không cập nhật diagnostic/performance theo cùng cách với pass/fail

Diagnostic và performance dùng dữ liệu theo rule riêng, trong khi pass/fail và Credit của replay xét attempt hiện tại.

**Impact:** người chơi có thể trượt lần đầu, học từ feedback rồi đỗ ở replay, nhưng bảng diagnostic/performance vẫn phản ánh tập dữ liệu khác với kết quả pass hiện tại. Cần giải thích rõ khi đọc kết quả cuối.

---

## 4. Mẫu đo theo cluster còn nhỏ

Baseline O4 của một cluster chỉ dùng:

```text
Arena 1 + Crossroads
```

tức tối đa **5 câu/cluster** trước Boss.

Boss chỉ hỏi ba cluster yếu nhất theo:

```text
7 / 5 / 3 câu
```

**Impact:** chỉ một câu đúng/sai có thể làm tỷ lệ thay đổi mạnh. Nhãn O4 chỉ nên được hiểu là tín hiệu trong lượt chơi, không phải ước lượng ổn định về năng lực Ethics.

---

## 5. Các con số Week 7 là design choice của project, chưa được validate bằng người chơi thật

Các giá trị sau đều do nhóm tự đặt và mô phỏng bằng tay:

```text
Pass threshold: 70% / 75% / 75% / 85% / 90%
Timer:          100s / 80s / 60s
Penalty:        mỗi 10 giây quá giờ
Boss Gate:      15 Credit
Quest reward:   0 / +2 / +3 / +4
```

Các con số này không phải chuẩn CFA Institute.

**Impact:** chúng có thể quá dễ, quá khó hoặc làm game economy mất cân bằng. “Đỗ Arena” không đồng nghĩa với mastery và các threshold hiện chưa được chứng minh là learning threshold tối ưu.

---

## 6. Arena 2 và Arena 3 cùng ngưỡng 75%

Arena 2 và Arena 3 đều cần:

```text
8/10 để đỗ
```

Vì vậy độ khó tăng giữa hai round **không đến từ pass threshold**.

Arena 3 khó hơn Arena 2 nhờ:

- tỷ lệ câu khó cao hơn;
- có timer 100 giây/câu.

**Impact:** nếu difficulty labels hoặc timer không tạo ra khác biệt đủ lớn, người chơi có thể vẫn cảm thấy hai round gần như ngang nhau dù thiết kế intended difficulty đã tăng.

---

## 7. Boss 90% với 9 câu khó có thể quá khó

Boss có:

```text
15 câu
14/15 để đỗ
2 Easy / 4 Medium / 9 Hard
60 giây/câu
```

Nhóm chưa có dữ liệu thực tế về tỷ lệ người chơi vượt Boss.

**Impact:** Boss có thể trở thành bottleneck quá mạnh đối với người mới học. Clear-rate cần được đo bằng playtest trước khi khẳng định difficulty này hợp lý.

---

## 8. World Quest lặp câu cũ nên có thể dễ dần

World Quest ưu tiên câu người chơi **đã gặp ở Arena 1–4** thuộc ba cluster yếu nhất.

Mục đích là tránh tiêu thụ quá nhanh pool câu mới/câu khó dành cho Boss.

**Impact:** sau vài lượt Quest, người chơi có thể nhớ đáp án và kiếm Credit dễ hơn nhờ familiarity.

Nhóm chấp nhận limitation này vì:

- Quest chỉ dùng để ôn và kiếm Credit;
- Quest không cộng vào diagnostic;
- Quest không làm thay đổi W1/W2;
- Quest không làm thay đổi `boss_clusters`;
- Quest không đi vào O4.

---

## 9. Browser timer có thể không phản ánh đúng thời gian suy nghĩ

Thời gian được đo bằng đồng hồ của trình duyệt.

Các tình huống như:

- chuyển tab;
- browser bị lag;
- máy chậm;
- hệ thống tạm ngừng xử lý;

có thể làm `timeMs` khác với thời gian người chơi thực sự suy nghĩ.

**Impact:** overtime penalty có thể bị ảnh hưởng bởi môi trường chạy chứ không chỉ bởi khả năng trả lời của người chơi. Timer không nên được diễn giải như một thước đo năng lực chuẩn hóa.

---

## 10. Nhãn O4 chỉ so sánh trong session, không chứng minh learning causality

Kết luận O4 dùng baseline Arena 1 + Crossroads rồi so với Boss.

Logic có ba nhãn chính:

- `Đã cải thiện`
- `Đã cải thiện nhưng chưa đủ`
- `Cần cải thiện tiếp`

**Impact:** hệ thống chỉ cho thấy performance về sau khác performance ban đầu. Nó không chứng minh Trap hoặc gameplay **gây ra** sự cải thiện. Thay đổi có thể đến từ feedback, familiarity, may mắn, difficulty mix hoặc nhớ câu.

---

## 11. Mốc 70% của O4 khác với Boss pass 90%

Boss cần 90% để vượt, nhưng nhãn cải thiện từng cluster trong O4 vẫn dùng mốc 70%.

Với Boss split 7/5/3, cùng một mốc 70% tạo boundary thực tế khác nhau:

| Slot Boss | Tối thiểu để đạt ≥70% |
|---|---:|
| 7 câu | 5/7 = 71.4% |
| 5 câu | 4/5 = 80% |
| 3 câu | 3/3 = 100% |

**Impact:** cluster ở slot 3 câu bị đánh giá chặt hơn về mặt discrete score. Không nên xem ba slot là hoàn toàn tương đương về độ tin cậy.

---

## 12. O4 không phải công cụ dự đoán CFA exam

Các thành phần sau đều là thiết kế của project:

- C1–C5;
- difficulty mix;
- threshold;
- Credit;
- Boss Gate;
- World Quest;
- Boss split 7/5/3;
- `performance_score`.

**Impact:** score và nhãn của game không nên được trình bày như dự báo điểm CFA Level I, xác suất pass CFA hoặc đánh giá professional competence.

---

## 13. Chưa có real-user validation đủ mạnh

Prototype hiện chứng minh logic phần mềm và demo flow, nhưng chưa có mẫu người học đủ lớn để kiểm định:

- diagnostic validity;
- difficulty progression;
- timer;
- Boss clear-rate;
- World Quest economy;
- learning effectiveness.

**Impact:** các claim như “game xác định đúng điểm yếu”, “Trap cải thiện kết quả học” hoặc “difficulty hiện tại phù hợp” vẫn cần user testing và dữ liệu thực nghiệm.

---

## 14. `item_type` có trong bank nhưng không phải trục sinh đề

Bank có `item_type` như `concept` / `vignette`, nhưng thiết kế hiện tại không dùng field này để cân bằng từng Arena.

**Impact:** app không đảm bảo tỷ lệ concept/vignette giống nhau giữa các round. Nếu hai loại câu có độ khó khác nhau, mix ngẫu nhiên có thể tác động kết quả.

---

## 15. Difficulty là nhãn tác giả, chưa được psychometric calibration

Difficulty 1/2/3 hiện được dùng cho:

- difficulty quota theo round;
- tie-break;
- `performance_score`;
- fallback khi sinh đề.

Nhưng difficulty do nhóm tự gắn, chưa được ước lượng từ response data thật.

**Impact:** `2/5/3`, `2/4/4`, `2/4/9` phản ánh **intended difficulty**, không phải psychometric difficulty đã được validate.

---

## 16. Cụm C1–C5 nén nhiều Standard/module

C1, C2, C4 và C5 mỗi cụm chứa hai module; chỉ C3 có một module.

**Impact:** cùng một cluster score có thể che giấu hai kiểu weakness khác nhau ở module/sub-standard bên trong. Cluster-level targeting phù hợp với MVP nhưng không thay thế chẩn đoán chi tiết ở sub-standard level.

---

## 17. Tie-break có thể thay đổi W1/W2/Boss dù Accuracy bằng nhau

Khi Accuracy bằng nhau, hệ thống dùng các tiêu chí phụ như:

- difficulty của câu sai;
- thời gian trả lời;
- mã cluster.

**Impact:** với sample nhỏ, một cluster có thể bị nhắm do tie-break thay vì do Accuracy khác biệt rõ ràng. Riêng `timeMs` còn có thể bị ảnh hưởng bởi gián đoạn bên ngoài.

---

## 18. Seed 7 chưa đủ để tái tạo demo nếu không cố định `runNo`

Seed chỉ cố định RNG.

Arena 1 còn phụ thuộc `runNo` và thứ tự bank.

**Impact:** hai máy cùng dùng Seed 7 nhưng có `runNo` khác nhau có thể bắt đầu bằng Arena 1 khác nhau, kéo theo W1/W2/Boss khác.

Demo reproducible phải ghi rõ:

```text
seed = 7
runNo = 1
```

và reset run counter trước khi chạy.

---

## 19. Arena 1 phụ thuộc thứ tự vật lý của bank

Arena 1 lấy câu theo cấu trúc bank thay vì hoàn toàn random theo seed.

**Impact:** nếu bank bị reorder hoặc chèn câu mới lên trước, Question ID của Arena 1 có thể thay đổi dù seed không đổi. Demo/test hard-code ID vì vậy dễ vỡ khi bank được cập nhật.

---

## 20. Feedback trong cùng session có thể làm tăng điểm Boss

Sau mỗi Arena, người chơi có thể xem explanation của các câu sai trước khi tới Boss.

**Impact:** Boss performance có thể phản ánh short-term recall từ feedback trong cùng session. Hệ thống chưa tách được “learning bền vững” khỏi “nhớ vừa đọc explanation”.

---

## 21. Vật phẩm làm các thước đo dùng mẫu khác nhau

Câu dùng Bùa Loại Trừ:

- vẫn tính vào `arena_score_correct`;
- có thể giúp người chơi pass;
- bị loại khỏi diagnostic;
- không đóng góp theo cùng cách vào `performance_score`.

Boss Week 7 cũng được dùng tối đa 1 Bùa.

**Impact:** pass/fail, diagnostic và performance không dùng chính xác cùng một tập dữ liệu. Đây là chủ ý gameplay nhưng phải giải thích để người đọc không hiểu các score là cùng một metric.

---

## 22. Content validator chỉ kiểm tra cấu trúc, không kiểm tra semantic đầy đủ

Validator có thể kiểm tra các field như:

- ID;
- cluster/module;
- số options;
- answer index;
- difficulty;
- stem.

Nó không tự biết answer/explanation/distractor có mâu thuẫn về nội dung Ethics hay không.

**Impact:** question bank có thể “valid” về kỹ thuật nhưng vẫn chứa content bug. Human QA vẫn bắt buộc.

---

## 23. Không phải cluster nào cũng được kiểm tra lại ở Boss

Boss chỉ lấy ba cluster yếu nhất.

Hai cluster còn lại không có dữ liệu Boss để so sánh trực tiếp.

**Impact:** hệ thống không thể đưa kết luận improvement cho mọi cluster trong một run. “Không kiểm tra lại ở Boss” phải được xem là missing evidence, không phải “không cải thiện” hay “đã ổn”.

---

# Interpretation boundary

Cách claim an toàn cho Week 7:

> **CFA Quest là một game luyện CFA Level I Ethics có cơ chế chẩn đoán và adaptive practice trong phạm vi một lượt chơi. Progressive thresholds, difficulty mix, timer, penalty, Boss Gate và World Quest là các rule thiết kế của project, hiện chưa được kiểm chứng bằng dữ liệu người chơi đủ lớn. Các score và nhãn O4 mô tả performance theo rule của project trong session đó; chúng không chứng minh mastery, causal learning hoặc kết quả CFA exam.**
