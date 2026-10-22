# Individual Footprint — Nguyễn Minh Khôi

**Họ và tên:** Nguyễn Minh Khôi  
**Nhóm:** Nhóm 7  
**Dự án:** CFA Quest - Ethics  
**Học phần:** NHA408E - Technology Applications in Banking and Finance  
**Vai trò chính:** Lên ý tưởng toàn bộ dự án. Thiết kế giao diện và hình ảnh: tạo bộ pixel-art, lập danh mục asset, thiết kế cách tutorial dạy luật, kiểm thử đường lỗi.

## 1. Vai trò trong dự án

Em phụ trách lên ý tưởng dự án và phần người chơi nhìn thấy của CFA Quest: giao diện, hình ảnh và cách game dạy luật.

Công việc chia hai giai đoạn. Ở Week 5, em được giao giao diện các màn (làm bài, kết quả sau mỗi màn chơi, bảng tiến trình, bảng tổng kết sau lượt chơi), kiểm thử đường lỗi và đối chiếu chéo các file tài liệu. Từ Week 7, em chuyển sang ba việc không cần sửa code: tạo hình pixel-art, thiết kế cách tutorial xuất hiện, và lập danh mục asset.

## 2. Dấu ấn cá nhân trong sản phẩm

### (1) Xây dựng và quản lý hệ thống mỹ thuật giao diện thống nhất cho toàn bộ trò chơi

Em chịu trách nhiệm định hướng và quản lý tính nhất quán về mặt thị giác trên toàn bộ hệ thống UI và các thành phần đồ họa của game, bao gồm bản đồ, cảnh chuyển tiếp, sàn đấu, nhân vật, quái vật, Boss, vật phẩm, biểu tượng và các khung giao diện. Thay vì xử lý từng hình ảnh như một tài nguyên độc lập, em thiết lập hệ thống quy chuẩn mỹ thuật pixel-art xuyên suốt, xác định các đặc trưng về phong cách, bảng màu, hình khối, đường viền và khả năng nhận diện của từng nhóm tài nguyên.

### (2) Thiết kế hệ thống hướng dẫn theo tiến trình tiếp nhận cơ chế của người chơi

Em thiết kế cấu trúc hướng dẫn người chơi theo nguyên tắc cung cấp thông tin đúng thời điểm cần thiết (*contextual, just-in-time onboarding*), thay vì giới thiệu toàn bộ cơ chế ngay từ đầu trò chơi. Với các hệ thống gameplay có nhiều điều kiện và tương tác như ngưỡng đỗ theo từng round, Credit, Bùa, đồng hồ đếm ngược, hình phạt quá giờ, cổng Boss và World Quest, em xây dựng lộ trình hướng dẫn gồm 13 thời điểm kích hoạt và 22 thẻ hướng dẫn. Trong đó, ba thẻ đầu tiên giới thiệu các thông tin nền tảng; các thẻ còn lại được bố trí ngay trước thời điểm người chơi tiếp xúc hoặc cần vận dụng cơ chế tương ứng. Mỗi thẻ tập trung truyền tải một quy tắc cụ thể, chỉ xuất hiện một lần nhằm hạn chế sự gián đoạn và trùng lặp thông tin. Đồng thời, em thiết kế bảng Luật chơi như một nguồn tham chiếu lâu dài, cho phép người chơi chủ động tra cứu khi cần. Cách tiếp cận này biến hệ thống tutorial từ một phần giới thiệu thông tin tĩnh thành một cấu trúc hướng dẫn gắn với tiến trình gameplay, giúp kiểm soát tải nhận thức và hỗ trợ người chơi tiếp thu cơ chế theo từng giai đoạn.

## 3. Những việc đã thực sự làm

### 3.1. Giao diện và kiểm thử (Week 5)

- Làm giao diện năm màn: làm bài, kết quả sau mỗi Arena, bảng tiến trình, Shop, bảng tổng kết sau Boss.

- Kiểm thử đường lỗi E1–E7 của user flow.

- Đối chiếu chéo các file tài liệu để phát hiện chỗ các file nói khác nhau.

### 3.2. Bộ hình pixel-art

- Tạo bộ hình cho nhân vật, quái, Boss, nền các vùng, cảnh chuyển, icon Bùa Loại Trừ, đồng hồ cát, banner, bản đồ overworld, khung Dialog và Question Scroll,...

- Dọn các cảnh thành nền thuần, không có HUD, nhân vật hay chữ, để code đặt nhân vật và giao diện lên trên. Xuất WebP để giữ dung lượng thấp.

### 3.3. Tutorial

- Lập bảng thời điểm, nội dung dạy và cách hiện (thẻ, banner, coach mark, toast).

- Cập nhật theo góp ý sau khi đối chiếu với code. Các chỗ đã sửa: phạt quá giờ làm tròn lên (quá 1–10 giây trừ 1 Credit, 11–20 giây trừ 2 Credit, đúng giây thứ 100 không bị phạt); tiền phạt trừ khi làm xong round chứ không trừ ngay; bảng chẩn đoán luôn tính theo lần làm đầu tiên; Bùa loại 1 trong 3 phương án; thoát giữa Arena 3, Arena 4, Boss và Quest mỗi nơi có hậu quả khác nhau.

- Tách các thẻ nặng thành nhiều thẻ nhỏ, dùng tên đầy đủ “cụm yếu nhất (W1)”, lưu cờ tutorial_seen bằng key riêng để Reset không làm hiện lại toàn bộ hướng dẫn.

## 4. File, tính năng, dữ liệu, logic, giao diện, tài liệu hoặc phần demo đã đóng góp

| **Nhóm đầu ra** | **Phần cụ thể**                                                                         | **Bằng chứng đóng góp**                                                                      |
|-----------------|-----------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| Ý tưởng và flow | Vấn đề giải quyết, người dùng mục tiêu và các thay đổi đến project qua các lần feedback | [PROJECT PROPOSAL.md](https://github.com/FTU-Legacy-63/G07/blob/main/PROJECT%20PROPOSAL.md) |
| Giao diện       | Năm màn: làm bài, kết quả, bảng tiến trình, Shop, tổng kết; kiểm thử đường lỗi E1–E7    | [src/cfa_quest_v11.html](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_v11.html); [src/cfa_quest_v11.css](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_v11.css) phần 1 (trước 22/10/2026 là file riêng `cfa_dungeon_ui_v10_skipfix_updated.css`); [docs/WEEK5_CHECKPOINT.md](https://github.com/FTU-Legacy-63/G07/blob/main/docs/WEEK5_CHECKPOINT.md) Mục 10 |
| Hình pixel-art  | Nhân vật, quái, Boss, nền, cảnh chuyển, Shop, Bùa, banner, khung,...                    | [UI update (Drive)](https://drive.google.com/drive/folders/1a9FnoTLN6rTovcgR-P06SKy5d1i3c7ix); bản đã xử lý dùng trong game: [src/asset/](https://github.com/FTU-Legacy-63/G07/tree/main/src/asset) |
| Tutorial        | 13 thời điểm, 22 thẻ, bảng Luật chơi, cờ tutorial_seen                                  | [src/cfa_quest_v11.js](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_v11.js) phần 2 (Hướng dẫn); trước 22/10/2026 là file riêng `cfa_quest_tutorial.js` |

## 5. Phần đóng góp đó kết nối thế nào với sản phẩm cuối cùng

**(1) Hình ảnh đổi cách người chơi đi qua 60 câu.** Bảng tiến trình 7 thẻ trở thành bản đồ, cảnh chuyển và sàn đấu. Người chơi đánh quái, né đạn và nhặt xu giữa các câu hỏi, nên một lượt chơi dài không còn là một bài trắc nghiệm liên tục.

**(2) Tutorial giúp người chơi hiểu những luật mới của Week 7.** Cổng Boss 15 Credit, phạt quá giờ và World Quest dễ trông như những rào cản vô cớ nếu không được giải thích đúng lúc. Thẻ trước Arena 3 giải thích đồng hồ, thẻ sau Arena 4 giải thích cổng Boss, thẻ Quest nói rõ Quest không đổi bảng chẩn đoán. Thẻ ở màn tổng kết giúp người học đọc nhãn cải thiện mà không hiểu nhầm thành kết luận về năng lực.

## 6. Điều cá nhân học được

**(1) Tính nhất quán thị giác cần được thiết lập từ đầu.** Khi quản lý hơn 60 hạng mục hình ảnh, em nhận ra rằng từng asset đẹp riêng lẻ chưa đủ để tạo nên một game hoàn chỉnh. Em học được cách xây dựng quy chuẩn pixel-art, sử dụng hình tham chiếu và thống nhất bảng màu, đường viền, hình khối cho toàn bộ hệ thống UI.

**(2) Thiết kế hình ảnh phải gắn với chức năng.** Kích thước điểm ảnh, độ tương phản và đường viền đều ảnh hưởng đến khả năng nhận diện trong game. Em học cách đánh giá asset ở kích thước sử dụng thực tế, đồng thời ưu tiên khả năng đọc thông tin và tính nhất quán với gameplay thay vì chỉ tập trung vào thẩm mỹ.

**(3) Tutorial phải chính xác và đúng thời điểm.** Em học được cách chia nhỏ các cơ chế phức tạp thành từng thẻ hướng dẫn, bố trí theo tiến trình chơi và đối chiếu nội dung với code hoặc đặc tả. Điều này giúp hạn chế thông tin sai lệch và tránh khiến người chơi phải tiếp nhận quá nhiều luật ngay từ đầu.

## 7. Khó khăn đã gặp và cách xử lý

**(1) Duy trì phong cách thống nhất trên hơn 60 hạng mục.** Các nhóm tài nguyên có chức năng và đặc điểm khác nhau, dễ dẫn đến sự thiếu đồng bộ. Em xử lý bằng cách xây dựng ba mẫu tham chiếu cốt lõi cho nhân vật, môi trường và icon/UI, sau đó áp dụng thống nhất các quy chuẩn thị giác trong quá trình phát triển asset.

**(2) Đáp ứng yêu cầu kỹ thuật của asset pixel-art.** Con trỏ 16×16, khung 9-slice và sprite sheet nhiều khung đòi hỏi độ chính xác về kích thước và cấu trúc điểm ảnh. Em xử lý bằng cách chuẩn hóa kích thước, thu nhỏ theo bội số nguyên và chỉnh sửa thủ công các chi tiết cần độ chính xác cao.

**(3) Bảo đảm tutorial khớp với cơ chế thực tế.** Một số nội dung ban đầu chưa phản ánh chính xác cách tính phạt quá giờ và thời điểm trừ Credit. Em tiếp thu góp ý, đối chiếu từng quy tắc với code, chia nhỏ các thẻ hướng dẫn và đánh dấu những nội dung chưa thể xác minh do đặc tả chưa cập nhật.

**(4) Hoàn thành khối lượng lớn trong thời gian giới hạn.** Danh mục có 123 dòng khiến việc ưu tiên nguồn lực trở nên quan trọng. Em phân chia công việc theo mức độ ưu tiên P1, P2, P3; đồng thời chuẩn bị phương án dự phòng sử dụng một sàn đấu gốc với các biến thể màu sắc theo vùng khi không đủ thời gian phát triển từng sàn riêng biệt.

## 8. Lời nhắn cho sinh viên khóa sau

Hãy xây dựng quy chuẩn asset trước khi bắt đầu thiết kế, bao gồm kích thước, trạng thái, bảng màu, kiểu nền và các ràng buộc gameplay. Một hình ảnh đẹp nhưng không đáp ứng yêu cầu sử dụng vẫn cần được điều chỉnh.

Hãy hoàn thiện một số hình tham chiếu trước khi phát triển toàn bộ hệ thống, sau đó kiểm tra tài nguyên ở kích thước thực tế trong game, chẳng hạn 64×64 điểm ảnh. Đừng chỉ đánh giá hình ảnh ở kích thước phóng lớn.

Cuối cùng, hãy xem UI là một phần của hệ thống gameplay, không chỉ là yếu tố trang trí. Mỗi quyết định về màu sắc, bố cục, hiệu ứng và hướng dẫn cần phục vụ mục đích cụ thể, bảo đảm tính nhất quán giữa thiết kế, cơ chế vận hành và trải nghiệm người chơi.
