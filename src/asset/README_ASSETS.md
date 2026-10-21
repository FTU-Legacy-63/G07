# Asset giao diện CFA Quest — bản 21/10/2026

Thư mục này chứa toàn bộ ảnh đã xử lý từ bộ vẽ của Khôi (folder `21-10` và `UI update` ngày 16/10), sẵn để code lớp giao diện dùng thẳng.

## 1. Có gì trong thư mục

| Thư mục / file | Nội dung | Số file |
|---|---|---:|
| `bg/` | Ảnh nền WebP: bản đồ thế giới, màn đầu, 8 cảnh chuyển, nền trong lều Shop, 6 sàn đấu | 17 |
| `sprites/` | Sprite sheet WebP nền trong suốt, các khung xếp ngang, khung đều cỡ | 21 |
| `ui/` | Phần tử giao diện WebP nền trong suốt: hộp thoại, cuộn câu hỏi, ô phương án, nút, icon, logo… | 62 |
| `assets.js` | Danh mục `window.CFA_ASSETS`: tên file, cỡ khung, số khung, fps, điểm neo, lề 9-slice, vùng bấm trên bản đồ, vùng đi được của từng sàn | 1 |

Tổng dung lượng: khoảng 6,1 MB (ảnh gốc 51 file của folder 21-10 nặng 183 MB).

## 2. Quy ước khi code

- **Khung logic 960×540** theo SOLUTION_STRUCTURE §15.8. Ảnh nền 2752×1536 vẽ phủ toàn khung.
- **Sprite xuất ở tỉ lệ 2,5 px ảnh cho 1 px logic.** Vẽ lên canvas với cỡ = cỡ khung ÷ 2,5. Ví dụ nhân vật đứng cao 136 px ảnh → 54 px logic.
- **Điểm neo `anchor: [ax, ay]` là điểm chân** (giữa, dưới) trong mỗi khung. Toạ độ nhân vật, quái, Boss trong code là toạ độ chân.
- Sprite **quay sang phải**. Đi sang trái thì lật ngang khi vẽ.
- Tên file sprite: `spr_<tên>_<số khung>x<rộng khung>x<cao khung>.webp`. Ảnh WebP giữ kênh trong suốt không mất chi tiết, nhẹ hơn PNG khoảng 6 lần.
- Phần tử UI có `slice: [trên, phải, dưới, trái]` (px của ảnh) dùng cho CSS `border-image-slice`; các ô co giãn theo nội dung câu hỏi dài.
- Vùng đi được: mọi sàn dùng `walkDefault = [30, 140, 930, 520]` như §15.8. `walkMeasured` của từng sàn là số đo từ ảnh, chỉ để tham khảo.

## 3. Mã trong file tổng hợp asset → file đầu ra

| Mã (sheet 4) | Asset | File |
|---|---|---|
| MAP-01 | Bản đồ thế giới (đã có tháp Arena 2) | `bg/bg_map.webp` |
| MAP-02 | Vùng bấm trên bản đồ | `assets.js` → `map.zones` (toạ độ %) |
| MAP-03 | Node trạng thái | `ui/ui_node_locked / current / passed / boss_locked / alert.webp` |
| MAP-04 | Thẻ thông tin vùng | `ui/ui_zone_card.webp` |
| CC-03 | Màn đầu (cổng đá) + cổng xoay 7 khung | `bg/bg_menu.webp`, `sprites/spr_menu_portal_*` (vị trí đặt: `assets.js` → `menu.portal`) |
| CC-04…CC-11 | Cảnh chuyển Arena 1–4, World Quest, Boss, Shop, Bảng tổng kết | `bg/cc_arena1…4`, `cc_world_quest`, `cc_boss`, `cc_shop`, `cc_report` |
| UI-11 | Nền trong lều Shop | `bg/bg_shop.webp` |
| SD-01…SD-06 | 6 sàn đấu | `bg/sd_arena1…4`, `sd_world_quest`, `sd_boss` |
| NV-01, AN-01…05 | Nhân vật: đứng, đi 8 khung, chém 7 khung, trúng đòn 4 khung, vui 4, buồn 4 | `sprites/spr_player_*` |
| NV-04, AN-07…09 | Quái: đứng, xuất hiện 5 khung, biến mất 6 khung | `sprites/spr_mob_*` |
| BS-01, AN-11…14 | Boss: đứng 2 khung, báo hiệu 4 (trước mỗi đợt bắn), trúng chém 3 (lúc nhát chém trúng), vung trượng 4 (hất người chơi ra vòng R), bị hạ 8 | `sprites/spr_boss_*` (thứ tự chạy: `assets.js` → `bossSequence`) |
| NV-06, AN-15 | Lái buôn: đứng 4 khung, vẫy chào 4 khung | `sprites/spr_merchant_*` |
| TR-01 | Đồng xu xoay 8 khung + icon Credit | `sprites/spr_coin_spin_*`, `spr_coin_icon_*` |
| BS-04 | Khung thanh máu Boss (15 nấc do code vẽ, màu trong `colors.bossbarFill`) | `ui/ui_bossbar_frame.webp` |
| BS-05 | Tim đầy / mất | `ui/ui_heart_full.webp`, `ui_heart_empty.webp` |
| BS-06 | Cờ lượt trắng còn / đã dùng | `ui/ui_flag_white.webp`, `ui_flag_grey.webp` |
| UI-04, BS-07, BS-08, DM-04 | Hộp thoại thường / cảnh báo / nguy hiểm | `ui/ui_dialog_normal / warning / danger.webp` |
| TR-05 | Cuộn giấy câu hỏi | `ui/ui_question_scroll.webp` |
| TR-06 | Ô phương án 5 trạng thái | `ui/ui_option_normal / hover / selected / correct / wrong.webp` |
| TR-07 | Ô vật phẩm: bị cấm / dùng được / đã dùng | `ui/ui_itemslot_locked / ready / used.webp` |
| TR-08 | Bùa Loại Trừ (96 px, 192 px, bản xám) | `ui/ui_item_charm*.webp` |
| TR-09 | Đồng hồ cát thường / quá giờ | `ui/ui_hourglass_normal.webp`, `ui_hourglass_overtime.webp` |
| UI-01 | Logo lớn và nhỏ | `ui/ui_logo_large.webp`, `ui_logo_small.webp` |
| UI-03 | Nút vàng / nâu / đỏ × thường / nhấn / vô hiệu | `ui/ui_button_<màu>_<trạng thái>.webp`, nút vuông `ui_button_square.webp` |
| UI-05 | Banner vàng / đỏ | `ui/ui_banner_gold.webp`, `ui_banner_red.webp` |
| UI-06 | Ô kết quả Đỗ / Trượt / Quest | `ui/ui_result_pass / fail / quest.webp` |
| UI-12 | Thẻ vật phẩm Shop, bong bóng thoại + đuôi | `ui/ui_item_card.webp`, `ui_speech_bubble.webp`, `ui_speech_tail.webp` |
| UI-17 | Icon: ổ khoá, tick, X, chấm than, cảnh báo, xích | `ui/ui_icon_*.webp` |
| TU-01 | Phím W, A, S, D nhả / nhấn | `ui/ui_key_<phím>_up / down.webp` |

## 4. Những chỗ đã sửa so với ảnh gốc

- Tách nền magenta của mọi sprite và phần tử UI, làm sạch viền hồng, cắt từng khung, căn chân cùng một đường đáy.
- Cân tỉ lệ giữa các hoạt cảnh vẽ ở cỡ khác nhau (ví dụ sheet chém vẽ nhỏ hơn sheet đi khoảng 14%), để nhân vật không to nhỏ khi đổi hoạt cảnh. Boss, quái, lái buôn làm tương tự.
- **Sàn Arena 1:** dọn cột, bàn, giá sách, cột đổ, cuộn giấy ở giữa sàn; chỗ trống được vá bằng chính nền gạch và rêu của ảnh. Giá sách và cột sát tường trên giữ nguyên; chân giá sách xuống tới y = 167, nên với vùng đi được chung (mép trên 140) nhân vật đi được tới trước chân giá sách. Muốn chặn hẳn thì dùng `walkMeasured` của sàn này.
- **Sàn Boss:** bớt 2 hàng gạch ở tường trên, sàn bắt đầu ở y = 139 (khớp mép trên vùng đi được 140). Bệ đá, 4 đuốc và vùng sáng quanh đuốc giữ nguyên. Vẽ Boss với điểm chân tại `floors.boss.bossFeet = [480, 212]` thì Boss đứng trên bệ; tâm va chạm vẫn là (480, 160).
- Banner: file gốc "Banner fail" là bản vàng, "New banner" là bản đỏ (tên gốc bị đặt nhầm), đã đổi tên theo màu.

## 5. Phần làm bằng code, không cần ảnh

- Nhân vật đứng thở, quái lơ lửng: dùng 1 khung, code cho nhún 1–4 px.
- Đồng hồ cát "sắp hết giờ": ảnh thường + viền sáng cam bằng CSS.
- Đạn laser, vệt chém, vạch báo hiệu trước đợt bắn, hiệu ứng xích rơi khi mở Boss.
- Màn "Vui lòng mở trên máy tính": nền `bg_menu` làm tối + chữ.
- Nền động (mây, sương, lá…): nhóm quyết định không làm để game nhẹ.

## 6. File gốc không dùng

- `Char2` (nhân vật cầm khiên, khác thiết kế gốc); `Flag flying` và `smoke` (nhóm quyết định không dùng).
- `Health_bar_1`: thanh thứ ba dính cỏ ở dưới; chỉ lấy màu đỏ của thanh đầy. Khung dùng `Health_bar_empty`.
- Các ô nền tối trong `Time_variation` (không tách nền được); 2 mẩu thừa ở mép trái `Item_slots`.
- Ảnh cũ ngày 16/10: Boss 1/2/4/5, Trap boss, Item 1, Card 1/2, Overworld cũ, New overworld, Element - Dialog box và Question Scroll bản cũ, Banner cũ.

## 7. Chạy lại khi có ảnh mới

Script nằm ở `tools/asset_pipeline/` (Python 3, cần `numpy`, `scipy`, `pillow`, `opencv-python`).

1. Chép folder `21-10` vào `tools/asset_pipeline/input/21-10/`.
2. Chép các ảnh cũ sau vào `tools/asset_pipeline/input/old/`: `Environment - Arena 1.png`, `Environment - Arena 2.png`, `Environment - Arena 3.png`, `Environment - Arena 4.png`, `Environment - Arena 5.png`, `Environment - Merchant.png`, `Environment - Merchant Inside.png`, `World Quest Arena.png`, `Environment - Main Menu.webp`, `Item 2.webp`.
3. Trong `tools/asset_pipeline/` chạy lần lượt:

```
python3 make_sprites.py
python3 make_ui.py
python3 a1_clean.py        # dọn sàn Arena 1, khoảng 10 phút
python3 make_bg.py
python3 build_manifest.py
```

Kết quả ra thư mục `out/`; chép `out/bg`, `out/sprites`, `out/ui`, `out/assets.js` vào `src/assets/`. Khi Khôi sửa một ảnh, chỉ cần thay file trong `input/` rồi chạy lại.
