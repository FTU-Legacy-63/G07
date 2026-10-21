"""Dung sprite sheet ngang tu cac khung da tach."""
import sys, json
sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__)))
from lib import *

import os
OUT = os.environ.get('CFA_OUT', 'out/')


def centroid_x(f, mode='dark'):
    a = f.astype(int)
    if mode == 'dark':
        m = (a[..., 3] > 200) & (a[..., :3].sum(-1) < 150)
        if m.sum() < 50:
            m = a[..., 3] > 100
    else:
        m = a[..., 3] > 100
    ys, xs = np.where(m)
    return xs.mean()


def build_anim(frames, scale, base_y=None, cmode='dark', pad=4, cx_fixed=None, min_w=0, min_h=0):
    """frames: list (rgba, bbox nguon). scale: float hoac list.
    base_y: duong day trong anh nguon (mac dinh: day thap nhat cua tung hang, tinh theo frame).
    Tra ve (sheet PIL, meta)."""
    n = len(frames)
    scales = scale if isinstance(scale, (list, tuple)) else [scale] * n
    if base_y is None:
        base = [max(b[3] for _, b in frames)] * n
    elif isinstance(base_y, (list, tuple)):
        base = base_y
    else:
        base = [base_y] * n
    imgs, tops, bots, cxs = [], [], [], []
    for i, (f, b) in enumerate(frames):
        s = scales[i]
        im = resize(to_img(f), s)
        imgs.append(im)
        tops.append((b[1] - base[i]) * s)
        bots.append((b[3] - base[i]) * s)
        if cx_fixed is not None:
            cxs.append((cx_fixed[i] - b[0]) * s)
        else:
            cxs.append(centroid_x(f, cmode) * s)
    half = max(max(cxs[i], imgs[i].width - cxs[i]) for i in range(n))
    fw = int(np.ceil(2 * half + 2 * pad)); fw += fw % 2
    fw = max(fw, min_w)
    top = min(tops); bot = max(bots)
    fh = int(np.ceil(bot - top + 2 * pad)); fh += fh % 2
    fh = max(fh, min_h)
    ay = int(round(pad - top + (fh - (bot - top + 2 * pad)) ))  # neo (chan) tinh tu tren
    ax = fw // 2
    sheet = Image.new('RGBA', (fw * n, fh), (0, 0, 0, 0))
    for i, im in enumerate(imgs):
        x = int(round(i * fw + ax - cxs[i]))
        y = int(round(ay + tops[i]))
        sheet.alpha_composite(im, (x, y))
    meta = dict(frames=n, fw=fw, fh=fh, anchor=[ax, ay])
    return sheet, meta


def save_png(img, name):
    """Luu WebP (mau nen q90, kenh alpha khong mat): nhe hon PNG khoang 6 lan. Ten .png duoc doi sang .webp."""
    if name.endswith('.png'):
        name = name[:-4] + '.webp'
    path = OUT + name
    img.save(path, 'WEBP', quality=90, alpha_quality=100, method=6)
    return path
