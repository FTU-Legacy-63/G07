"""Thu vien xu ly asset CFA Quest: tach nen magenta, tim khung, cat, chuan hoa."""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

import os
# Thu muc anh goc. Mac dinh: input/21-10/ (folder Khoi gui 21/10) va input/old/ (anh UI update 16/10).
NEW = os.environ.get('CFA_NEW', 'input/21-10/')
OLD = os.environ.get('CFA_OLD', 'input/old/')


def find(path):
    """Chap nhan ten file co dau cach hoac dau gach duoi (vd 'Big Boss Idle.png' = 'Big_Boss_Idle.png')."""
    if os.path.exists(path):
        return path
    d, f = os.path.split(path)
    for cand in (f.replace('_', ' '), f.replace(' ', '_')):
        if os.path.exists(os.path.join(d, cand)):
            return os.path.join(d, cand)
    raise FileNotFoundError(path)


def load_rgb(path):
    return np.asarray(Image.open(find(path)).convert('RGB')).astype(np.int16)


def key_magenta(a, hi=150, lo=60):
    """a: HxWx3 int. Tra ve RGBA uint8.
    m = min(R,B) - G: nen magenta ~240, mau vat the < 60.
    Vung chuyen tiep cho alpha mot phan va keo R,B ve gan G de bo vien hong."""
    r, g, b = a[..., 0].astype(float), a[..., 1].astype(float), a[..., 2].astype(float)
    m = np.minimum(r, b) - g
    alpha = np.clip((hi - m) / (hi - lo), 0, 1)
    out = np.stack([r, g, b], -1)
    part = alpha < 1
    # despill: phan mau hong du thua tren vien
    spill = np.clip(np.minimum(r, b) - g, 0, None) * (1 - alpha)
    out[..., 0] = np.where(part, np.clip(r - spill, 0, 255), r)
    out[..., 2] = np.where(part, np.clip(b - spill, 0, 255), b)
    # vien den bi am mau magenta (AI tron mau vien voi nen): dua ve gan den trung tinh
    r2, g2, b2 = out[..., 0].copy(), out[..., 1].copy(), out[..., 2].copy()
    mm = np.minimum(r2, b2) - g2
    tint = (alpha > 0) & (mm > 12) & (np.abs(r2 - b2) < 0.35 * mm) & (np.maximum(r2, b2) < 140)
    newv = g2 + 0.15 * mm
    out[..., 0] = np.where(tint, newv + (r2 - np.minimum(r2, b2)), r2)
    out[..., 2] = np.where(tint, newv + (b2 - np.minimum(r2, b2)), b2)
    # defringe: pixel trong suot mot phan lay mau cua pixel dac gan nhat -> het vien hong
    solid = alpha >= 0.9
    if solid.any() and (~solid).any():
        idx = ndi.distance_transform_edt(~solid, return_distances=False, return_indices=True)
        near = out[idx[0], idx[1]]
        semi = (alpha > 0) & ~solid
        out[semi] = near[semi]
    rgba = np.dstack([out, alpha * 255]).round().astype(np.uint8)
    rgba[alpha == 0, :3] = 0
    return rgba


def clean_specks(rgba, min_area=60):
    """Xoa cac dom nho le (nhieu) sau khi tach nen."""
    m = rgba[..., 3] > 40
    lab, n = ndi.label(m)
    if n == 0:
        return rgba
    sizes = ndi.sum(m, lab, range(1, n + 1))
    kill = np.isin(lab, np.where(sizes < min_area)[0] + 1)
    out = rgba.copy()
    out[kill] = 0
    return out


def components(rgba, merge=25, min_area=400):
    """Tim cac cum vat the (khung hinh). merge: gian no de gop manh roi gan nhau.
    Tra ve list bbox (x0,y0,x1,y1) sap xep theo hang roi cot."""
    m = rgba[..., 3] > 40
    if merge:
        mm = ndi.binary_dilation(m, iterations=merge)
    else:
        mm = m
    lab, n = ndi.label(mm)
    boxes = []
    for i, sl in enumerate(ndi.find_objects(lab)):
        if sl is None:
            continue
        sub = m[sl] & (lab[sl] == i + 1)
        if sub.sum() < min_area:
            continue
        ys, xs = np.where(sub)
        boxes.append((sl[1].start + xs.min(), sl[0].start + ys.min(),
                      sl[1].start + xs.max() + 1, sl[0].start + ys.max() + 1))
    # sap theo hang (dung tam y, gop hang neu chong nhau) roi theo x
    boxes.sort(key=lambda b: (b[1] + b[3]) / 2)
    rows, cur = [], []
    for b in boxes:
        if cur and (b[1] > max(c[3] for c in cur) - 0.3 * (b[3] - b[1])):
            rows.append(cur); cur = []
        cur.append(b)
    if cur:
        rows.append(cur)
    out = []
    for r in rows:
        out += sorted(r, key=lambda b: b[0])
    return out


def crop(rgba, box, pad=0):
    x0, y0, x1, y1 = box
    H, W = rgba.shape[:2]
    return rgba[max(0, y0 - pad):min(H, y1 + pad), max(0, x0 - pad):min(W, x1 + pad)]


def to_img(rgba):
    return Image.fromarray(rgba, 'RGBA')


def resize(img, scale):
    w, h = img.size
    nw, nh = max(1, round(w * scale)), max(1, round(h * scale))
    # thu nho bang LANCZOS tren alpha da nhan san de vien khong bi den/hong
    a = np.asarray(img).astype(float) / 255
    pm = a.copy(); pm[..., :3] *= pm[..., 3:4]
    pim = Image.fromarray((pm * 255).round().astype(np.uint8), 'RGBA')
    # thu nho bang BOX (trung binh dien tich): khong co vong nhieu nhu LANCZOS nen vien khong bi hong
    pim = pim.resize((nw, nh), Image.BOX if scale < 1 else Image.LANCZOS)
    b = np.asarray(pim).astype(float) / 255
    al = b[..., 3:4]
    rgb = np.where(al > 0, b[..., :3] / np.maximum(al, 1e-6), 0)
    outa = np.concatenate([np.clip(rgb, 0, 1), al], -1)
    return Image.fromarray((outa * 255).round().astype(np.uint8), 'RGBA')


def strip(frames, fw, fh, anchor='bottom', baseline_pad=4, cx=None):
    """Xep cac khung (PIL RGBA da thu nho) vao 1 dai ngang, moi o fw x fh.
    anchor bottom: chan dat cach day baseline_pad px, can giua ngang theo cx (ham lay tam)."""
    sheet = Image.new('RGBA', (fw * len(frames), fh), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        w, h = f.size
        if cx is None:
            ox = (fw - w) // 2
        else:
            ox = round(fw / 2 - cx[i])
        if anchor == 'bottom':
            oy = fh - baseline_pad - h
        else:
            oy = (fh - h) // 2
        sheet.alpha_composite(f, (i * fw + ox, oy))
    return sheet
