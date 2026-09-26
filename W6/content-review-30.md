# Content review — 30 câu mới nhất trong CFA Quest v11

## Phạm vi rà soát

Đã rà **30 câu mới nhất**, lấy **6 câu cuối của mỗi cluster** trong `cfa_quest_v11_bank.js` (bank hiện tại có 170 câu, 34 câu/cluster).

| Cluster | 6 ID đã đọc |
|---|---|
| C1 | `ETH-C1-CODE-012`, `ETH-C1-CODE-013`, `ETH-C1-CODE-014`, `ETH-C1-CODE-015`, `ETH-C1-CODE-016`, `ETH-C1-CODE-017` |
| C2 | `ETH-C2-S2-012`, `ETH-C2-S2-013`, `ETH-C2-S2-014`, `ETH-C2-S2-015`, `ETH-C2-S2-016`, `ETH-C2-S2-017` |
| C3 | `ETH-C3-S3-029`, `ETH-C3-S3-030`, `ETH-C3-S3-031`, `ETH-C3-S3-032`, `ETH-C3-S3-033`, `ETH-C3-S3-034` |
| C4 | `ETH-C4-S5-012`, `ETH-C4-S5-013`, `ETH-C4-S5-014`, `ETH-C4-S5-015`, `ETH-C4-S5-016`, `ETH-C4-S5-017` |
| C5 | `ETH-C5-S7-012`, `ETH-C5-S7-013`, `ETH-C5-S7-014`, `ETH-C5-S7-015`, `ETH-C5-S7-016`, `ETH-C5-S7-017` |

## Những gì đã kiểm tra ở từng câu

- stem có khớp với `sub_standard` không;
- đáp án đánh dấu trong `answer` có phù hợp với stem không;
- `explanation` có tự mâu thuẫn với đáp án hoặc dữ kiện không;
- hai `distractor_reason` có giải thích đúng vì sao phương án sai dễ bị chọn không;
- câu có đúng 3 phương án;
- ô distractor của đáp án đúng để trống;
- độ dài stem phù hợp với loại `concept` / `vignette`;
- chênh lệch độ dài giữa ba phương án nằm trong constraint của bank;
- đáp án đúng không phải phương án dài nhất.

## Kết quả rà 30 câu

**Không phát hiện content bug rõ ràng trong 30 câu mới nhất này.** Cả 30 câu đều có answer key nhất quán với explanation; distractor reasons không mâu thuẫn với đáp án; các kiểm tra hình thức nêu trên đều đạt.

### C1
- `ETH-C1-CODE-012` — OK
- `ETH-C1-CODE-013` — OK
- `ETH-C1-CODE-014` — OK
- `ETH-C1-CODE-015` — OK
- `ETH-C1-CODE-016` — OK
- `ETH-C1-CODE-017` — OK

### C2
- `ETH-C2-S2-012` — OK
- `ETH-C2-S2-013` — OK
- `ETH-C2-S2-014` — OK
- `ETH-C2-S2-015` — OK
- `ETH-C2-S2-016` — OK
- `ETH-C2-S2-017` — OK

### C3
- `ETH-C3-S3-029` — OK
- `ETH-C3-S3-030` — OK
- `ETH-C3-S3-031` — OK
- `ETH-C3-S3-032` — OK
- `ETH-C3-S3-033` — OK
- `ETH-C3-S3-034` — OK

### C4
- `ETH-C4-S5-012` — OK
- `ETH-C4-S5-013` — OK
- `ETH-C4-S5-014` — OK
- `ETH-C4-S5-015` — OK
- `ETH-C4-S5-016` — OK
- `ETH-C4-S5-017` — OK

### C5
- `ETH-C5-S7-012` — OK
- `ETH-C5-S7-013` — OK
- `ETH-C5-S7-014` — OK
- `ETH-C5-S7-015` — OK
- `ETH-C5-S7-016` — OK
- `ETH-C5-S7-017` — OK

## Bug log của sample 30 câu

**Không có bug nội dung cần ghi nhận trong sample 30 câu mới nhất.**


