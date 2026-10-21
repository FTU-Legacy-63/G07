"""Cat phan tu giao dien, do le 9-slice, xuat PNG trong suot."""
import sys, json, os
sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__)))
from extract import *
from build import resize, save_png, OUT

os.makedirs(OUT + 'ui', exist_ok=True)


def get_parts(name, n=None, merge=12, min_area=1500, a=None, pick=None):
    if a is None:
        a = load_rgb(NEW + name)
    k = clean_specks(key_magenta(a))
    bx = components(k, merge=merge, min_area=min_area)
    if pick is not None:
        bx = [bx[i] for i in pick]
    out = []
    for b in bx:
        sub = crop(k, b).copy()
        # chi giu pixel thuoc cum chinh trong bbox
        out.append((sub, b))
    return out


def nine_slice(rgba, tol=12, margin=2, seed=None):
    """Do le 9-slice: vung trong = flood fill tu tam (sai khac cuc bo <= tol), sau do quet tung canh."""
    import cv2
    a = np.ascontiguousarray(rgba[..., :3])
    al = rgba[..., 3]
    H, W = al.shape
    mask = np.zeros((H + 2, W + 2), np.uint8)
    img = a.copy()
    sx, sy = seed if seed else (W // 2, H // 2)
    cv2.floodFill(img, mask, (sx, sy), (0, 0, 0), (tol,) * 3, (tol,) * 3, 4 | cv2.FLOODFILL_MASK_ONLY | (1 << 8))
    inside = mask[1:-1, 1:-1] > 0
    inside = ndi.binary_closing(inside, iterations=3)
    midr, midc = H // 2, W // 2
    rowm = inside[midr]
    colm = inside[:, midc]
    xs = np.where(rowm)[0]; ys = np.where(colm)[0]
    if len(xs) == 0 or len(ys) == 0:
        return None
    Lb, Rb = xs.min(), W - 1 - xs.max()
    Tb, Bb = ys.min(), H - 1 - ys.max()
    def clean_row(y):
        return inside[y, Lb:W - Rb].mean() >= 0.97
    def clean_col(x):
        return inside[Tb:H - Bb, x].mean() >= 0.97
    top = Tb
    while top < H // 2 and not all(clean_row(y) for y in range(top, top + 3)):
        top += 1
    bot = Bb
    while bot < H // 2 and not all(clean_row(H - 1 - y) for y in range(bot, bot + 3)):
        bot += 1
    left = Lb
    while left < W // 2 and not all(clean_col(x) for x in range(left, left + 3)):
        left += 1
    right = Rb
    while right < W // 2 and not all(clean_col(W - 1 - x) for x in range(right, right + 3)):
        right += 1
    return [int(top + margin), int(right + margin), int(bot + margin), int(left + margin)]


def export(rgba, name, width=None, height=None, slice9=False, tol=12, seed=None):
    img = to_img(rgba)
    s = (width / img.width) if width else (height / img.height if height else 1.0)
    im2 = resize(img, s) if s != 1.0 else img
    path = save_png(im2, 'ui/' + name + '.webp')
    meta = dict(file='ui/' + name + '.webp', w=im2.width, h=im2.height)
    if slice9:
        sl = nine_slice(np.asarray(im2), tol=tol, seed=seed)
        meta['slice'] = sl  # [top, right, bottom, left] theo px cua anh xuat
    return meta
