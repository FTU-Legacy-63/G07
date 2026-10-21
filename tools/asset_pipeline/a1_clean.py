"""Don vat can giua san Arena 1 bang cach va tung manh nho tu ria lo vao trong
(manh nguon lay tu phan san sach cua chinh anh, chon theo do khop voi phan da biet)."""
import numpy as np, cv2, time
from PIL import Image
from scipy import ndimage as ndi

import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import OLD, find
SRC = find(OLD + 'Environment_-_Arena_1.png')
img = np.asarray(Image.open(SRC).convert('RGB')).astype(np.float32)
H, W, _ = img.shape
X0, X1, Y0, Y1 = 75, 2682, 476, 1448       # long san (khong gom tuong)
YT = 446                                   # mep tren mo rong cho 2 cai ban

a = img.astype(int)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
s = r + g + b
stone = (b >= r - 8) & (b >= g - 12) & (s > 90)
moss = (g > r) & (g > b + 8)
obj = ~(stone | moss)
roi = np.zeros((H, W), bool); roi[Y0:Y1, X0:X1] = True
obj &= roi
obj = ndi.binary_opening(obj, iterations=2)
lab, n = ndi.label(obj); sizes = ndi.sum(obj, lab, range(1, n + 1))
obj = np.isin(lab, np.where(sizes > 400)[0] + 1)
obj = ndi.binary_closing(obj, iterations=6)
obj = ndi.binary_fill_holes(obj)
obj[470:580, 2590:2682] = True            # quyen sach xanh goc phai tren
# them: cot do mau xam sang, va vien toi sat vat the
sat = a.max(-1) - a.min(-1)
light = (s > 440) & (sat < 40) & roi
light = ndi.binary_opening(light, iterations=2)
lab2, n2 = ndi.label(light); sz2 = ndi.sum(light, lab2, range(1, n2 + 1))
obj |= np.isin(lab2, np.where(sz2 > 300)[0] + 1)
dark = (s < 170) & roi
obj |= dark & ndi.binary_dilation(obj, iterations=6)
hole = ndi.binary_dilation(obj, iterations=14) & roi
# mep tren cua 2 cai ban nho len tren Y0
for (xa, xb) in [(596, 832), (1912, 2168)]:
    hole[YT:Y0 + 2, xa:xb] = True
area = np.zeros((H, W), bool); area[YT:Y1, X0:X1] = True
hole &= area

# vung nguon: san sach (chi lay tu Y0 tro xuong)
clean = roi & ~ndi.binary_dilation(hole, iterations=3)
P = 41; R = P // 2
bad_int = cv2.integral((~clean).astype(np.uint8))
SY0, SY1, SX0, SX1 = Y0, Y1, X0, X1
search = img[SY0:SY1, SX0:SX1].copy()
rh, rw = (SY1 - SY0) - P + 1, (SX1 - SX0) - P + 1
yy, xx = np.mgrid[0:rh, 0:rw]
gy, gx = yy + SY0, xx + SX0
bad = bad_int[gy + P, gx + P] - bad_int[gy, gx + P] - bad_int[gy + P, gx] + bad_int[gy, gx]
valid = bad == 0
print('valid sources', valid.sum())

out = img.copy()
unknown = hole.copy()
known_conf = (~unknown).astype(np.float32)
t0 = time.time(); it = 0
use_count = np.zeros((rh, rw), np.float32)
while unknown.any():
    it += 1
    uy, ux = np.where(unknown)
    by0, by1 = max(0, uy.min() - P), min(H, uy.max() + P + 1)
    bx0, bx1 = max(0, ux.min() - P), min(W, ux.max() + P + 1)
    un = unknown[by0:by1, bx0:bx1]
    front = un & ndi.binary_dilation(~un & area[by0:by1, bx0:bx1], iterations=1)
    fy, fx = np.where(front)
    if len(fy) == 0:
        fy, fx = np.where(un)
    conf = cv2.boxFilter(known_conf[by0:by1, bx0:bx1], -1, (P, P), normalize=True)
    k = np.argmax(conf[fy, fx])
    cy, cx = fy[k] + by0, fx[k] + bx0
    # dat cua so trong vung area
    wy0 = int(np.clip(cy - R, YT, Y1 - P)); wx0 = int(np.clip(cx - R, X0, X1 - P))
    T = out[wy0:wy0 + P, wx0:wx0 + P]
    Mk = (~unknown[wy0:wy0 + P, wx0:wx0 + P]).astype(np.float32)
    if Mk.sum() < 10:
        Mk[:] = 1
    res = cv2.matchTemplate(search, T, cv2.TM_SQDIFF, mask=np.dstack([Mk] * 3))
    res = res / Mk.sum() + use_count * 40.0
    res[~valid] = np.inf
    j = np.unravel_index(np.argmin(res), res.shape)
    sy, sx = j[0] + SY0, j[1] + SX0
    S = img[sy:sy + P, sx:sx + P]
    U = unknown[wy0:wy0 + P, wx0:wx0 + P]
    out[wy0:wy0 + P, wx0:wx0 + P][U] = S[U]
    unknown[wy0:wy0 + P, wx0:wx0 + P][U] = False
    known_conf[wy0:wy0 + P, wx0:wx0 + P][U] = 1
    use_count[max(0, j[0] - R):j[0] + R, max(0, j[1] - R):j[1] + R] += 1
    if it % 100 == 0:
        print(it, int(unknown.sum()), round(time.time() - t0, 1), flush=True)
print('iters', it, 'time', round(time.time() - t0, 1))
# Lan 2: lam lai dai 5 px hai ben mep lo de xoa duong noi
seam = ndi.binary_dilation(hole, iterations=5) & ~ndi.binary_erosion(hole, iterations=5) & area
unknown = seam.copy(); known_conf = (~unknown).astype(np.float32)
while unknown.any():
    it += 1
    uy, ux = np.where(unknown)
    by0, by1 = max(0, uy.min() - P), min(H, uy.max() + P + 1)
    bx0, bx1 = max(0, ux.min() - P), min(W, ux.max() + P + 1)
    un = unknown[by0:by1, bx0:bx1]
    front = un & ndi.binary_dilation(~un & area[by0:by1, bx0:bx1], iterations=1)
    fy, fx = np.where(front)
    if len(fy) == 0:
        fy, fx = np.where(un)
    conf = cv2.boxFilter(known_conf[by0:by1, bx0:bx1], -1, (P, P), normalize=True)
    k = np.argmax(conf[fy, fx]); cy, cx = fy[k] + by0, fx[k] + bx0
    wy0 = int(np.clip(cy - R, YT, Y1 - P)); wx0 = int(np.clip(cx - R, X0, X1 - P))
    T = out[wy0:wy0 + P, wx0:wx0 + P]
    Mk = (~unknown[wy0:wy0 + P, wx0:wx0 + P]).astype(np.float32)
    res = cv2.matchTemplate(search, T, cv2.TM_SQDIFF, mask=np.dstack([Mk] * 3))
    res = res / max(Mk.sum(), 1); res[~valid] = np.inf
    j = np.unravel_index(np.argmin(res), res.shape)
    S = img[j[0] + SY0:j[0] + SY0 + P, j[1] + SX0:j[1] + SX0 + P]
    U = unknown[wy0:wy0 + P, wx0:wx0 + P]
    out[wy0:wy0 + P, wx0:wx0 + P][U] = S[U]
    unknown[wy0:wy0 + P, wx0:wx0 + P][U] = False
    known_conf[wy0:wy0 + P, wx0:wx0 + P][U] = 1
print('seam pass done', it, round(time.time() - t0, 1))
# Lan 3: xoa cac dom toi con sot (bong cot, vien den) bang mau san gan nhat
fin = np.clip(out, 0, 255).astype(int)
inner = np.zeros((H, W), bool); inner[482:1440, 82:2674] = True
spk = ndi.binary_dilation((fin.sum(-1) < 100) & inner, iterations=3) & inner
idx = ndi.distance_transform_edt(spk, return_distances=False, return_indices=True)
fin[spk] = fin[idx[0], idx[1]][spk]
Image.fromarray(fin.astype(np.uint8)).save('a1_clean.png')
np.save('a1_holes.npy', hole)
