"""Tach tung khung tu cac sheet cua Khoi. Moi khung: (rgba_crop, bbox_trong_anh_goc)."""
import sys
sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__)))
from lib import *

# Luoi o cho cac sheet co ke duong vien
GRIDS = {
    'Char_walk.png': ([8, 694, 1380, 2066, 2744], [0, 763, 1533]),
    'Sad.png': ([10, 698, 1380, 2063, 2741], [302, 1198]),
    'buttons.png': ([69, 860, 974, 1778, 1892, 2683], [63, 441, 589, 934, 1036, 1520]),
}
# buttons: cot/hang xen ke la vach doi -> chi lay o chan (0,2,4)


def cells_of(name):
    xs, ys = GRIDS[name]
    if name == 'buttons.png':
        xs = [(xs[0], xs[1]), (xs[2], xs[3]), (xs[4], xs[5])]
        ys = [(ys[0], ys[1]), (ys[2], ys[3]), (ys[4], ys[5])]
    else:
        xs = list(zip(xs[:-1], xs[1:]))
        ys = list(zip(ys[:-1], ys[1:]))
    return [(x0, y0, x1, y1) for (y0, y1) in ys for (x0, x1) in xs]


def frames_grid(name, inset=14, merge=20):
    a = load_rgb(NEW + name)
    out = []
    for (x0, y0, x1, y1) in cells_of(name):
        sub = a[y0 + inset:y1 - inset, x0 + inset:x1 - inset]
        k = clean_specks(key_magenta(sub))
        bx = components(k, merge=merge, min_area=800)
        if not bx:
            continue
        # gop moi cum trong o thanh 1 khung
        bx0 = (min(b[0] for b in bx), min(b[1] for b in bx), max(b[2] for b in bx), max(b[3] for b in bx))
        out.append((crop(k, bx0), (x0 + inset + bx0[0], y0 + inset + bx0[1], x0 + inset + bx0[2], y0 + inset + bx0[3])))
    return out


def frames_auto(name, n, rows=1, merge=12, min_area=1500, src=None, keyfn=None):
    """Lay n khung, chia theo hang roi gom theo cot (cac khe trong lon nhat)."""
    a = load_rgb(src or (NEW + name))
    k = clean_specks((keyfn or key_magenta)(a))
    bx = components(k, merge=merge, min_area=min_area)
    # gom thanh hang
    if rows > 1:
        cy = np.array([(b[1] + b[3]) / 2 for b in bx])
        order = np.argsort(cy)
        gaps = np.diff(cy[order])
        cut = sorted(np.argsort(gaps)[-(rows - 1):])
        groups, start = [], 0
        for c in cut:
            groups.append([bx[i] for i in order[start:c + 1]]); start = c + 1
        groups.append([bx[i] for i in order[start:]])
    else:
        groups = [bx]
    per_row = n // rows if isinstance(n, int) else None
    frames = []
    for gi, g in enumerate(groups):
        cnt = n[gi] if isinstance(n, (list, tuple)) else per_row
        g = sorted(g, key=lambda b: (b[0] + b[2]) / 2)
        if len(g) < cnt:
            # cac khung dinh nhau -> tach theo khe cot trong anh alpha
            g = split_touching(k, g, cnt)
        cx = np.array([(b[0] + b[2]) / 2 for b in g])
        gaps = np.diff(cx)
        cut = sorted(np.argsort(gaps)[-(cnt - 1):]) if cnt > 1 else []
        start = 0
        parts = []
        for c in cut:
            parts.append(g[start:c + 1]); start = c + 1
        parts.append(g[start:])
        for p in parts:
            b = (min(q[0] for q in p), min(q[1] for q in p), max(q[2] for q in p), max(q[3] for q in p))
            sub = crop(k, b).copy()
            # chi giu pixel cua cac cum thuoc khung nay (bo phan khung ben canh lan vao)
            mask = np.zeros(sub.shape[:2], bool)
            for q in p:
                mask[q[1] - b[1]:q[3] - b[1], q[0] - b[0]:q[2] - b[0]] = True
            sub[~mask] = 0
            frames.append((sub, b))
    return frames


def split_touching(k, g, cnt):
    """Tach cac cum dinh nhau theo cot co it pixel nhat."""
    al = k[..., 3] > 40
    out = []
    for b in g:
        x0, y0, x1, y1 = b
        prof = al[y0:y1, x0:x1].sum(0)
        out.append(b)
    while len(out) < cnt:
        # tach cum rong nhat
        i = max(range(len(out)), key=lambda j: out[j][2] - out[j][0])
        x0, y0, x1, y1 = out[i]
        prof = al[y0:y1, x0:x1].sum(0).astype(float)
        w = x1 - x0
        need = round((w) / (max(1, (cnt - len(out) + 1))))
        # tim cot it pixel nhat quanh vi tri chia deu
        lo, hi = int(w * 0.2), int(w * 0.8)
        # uu tien khe gan diem chia deu cua cum nay
        k_parts = 2
        target = w // k_parts
        win = prof[max(lo, target - w // 4):min(hi, target + w // 4)]
        cut = max(lo, target - w // 4) + int(np.argmin(win))
        a_ = (x0, y0, x0 + cut, y1)
        b_ = (x0 + cut, y0, x1, y1)
        out[i:i + 1] = [tight(al, a_), tight(al, b_)]
    return sorted(out, key=lambda b: b[0])


def tight(al, b):
    x0, y0, x1, y1 = b
    sub = al[y0:y1, x0:x1]
    ys, xs = np.where(sub)
    return (x0 + xs.min(), y0 + ys.min(), x0 + xs.max() + 1, y0 + ys.max() + 1)


def frames_bins(name, xedges, yedges=None, merge=12, min_area=300, src=None, keyfn=None, a=None):
    """Gan moi cum vao o theo tam (x,y) roi gop. xedges/yedges: bien o trong anh nguon."""
    if a is None:
        a = load_rgb(src or (NEW + name))
    k = clean_specks((keyfn or key_magenta)(a))
    bx = components(k, merge=merge, min_area=min_area)
    yedges = yedges or [0, a.shape[0]]
    out = []
    for yi in range(len(yedges) - 1):
        for xi in range(len(xedges) - 1):
            p = [b for b in bx if xedges[xi] <= (b[0] + b[2]) / 2 < xedges[xi + 1]
                 and yedges[yi] <= (b[1] + b[3]) / 2 < yedges[yi + 1]]
            if not p:
                continue
            b = (min(q[0] for q in p), min(q[1] for q in p), max(q[2] for q in p), max(q[3] for q in p))
            sub = crop(k, b).copy()
            mask = np.zeros(sub.shape[:2], bool)
            for q in p:
                mask[q[1] - b[1]:q[3] - b[1], q[0] - b[0]:q[2] - b[0]] = True
            sub[~mask] = 0
            out.append((sub, b))
    return out


def remove_ground_line(a, ythr=0.85):
    """Xoa vach ke ngang (duong dat) mau toi chay het chieu ngang, giu phan duoi chan."""
    a = a.copy()
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mag = (np.minimum(r, b) - g) > 150
    nonmag_frac = (~mag).mean(1)
    rows = np.where(nonmag_frac > ythr)[0]
    if len(rows) == 0:
        return a
    y0, y1 = rows.min(), rows.max()
    above = mag[max(0, y0 - 3)]
    below = mag[min(a.shape[0] - 1, y1 + 3)]
    cols = above & below
    a[y0:y1 + 1, cols] = [255, 0, 255]
    return a


def frames_slabs(name, cuts, merge=20, min_area=300, pre=None, keep='all'):
    """Cat anh thanh cac dai doc theo cuts, moi dai la 1 khung."""
    a = load_rgb(NEW + name)
    if pre:
        a = pre(a)
    W = a.shape[1]
    edges = [0] + list(cuts) + [W]
    out = []
    for i in range(len(edges) - 1):
        x0, x1 = edges[i], edges[i + 1]
        sub = a[:, x0:x1]
        k = clean_specks(key_magenta(sub))
        bx = components(k, merge=merge, min_area=min_area)
        if not bx:
            continue
        if keep == 'largest':
            bx = [max(bx, key=lambda q: (q[2] - q[0]) * (q[3] - q[1]))]
        b = (min(q[0] for q in bx), min(q[1] for q in bx), max(q[2] for q in bx), max(q[3] for q in bx))
        fr = crop(k, b)
        out.append((fr, (b[0] + x0, b[1], b[2] + x0, b[3])))
    return out


def frames_bodies(name, n, merge=3, pre=None, min_area=200):
    """n than lon nhat la n khung; cac manh nho gan vao than gan nhat (theo khoang cach bbox)."""
    a = load_rgb(NEW + name)
    if pre:
        a = pre(a)
    k = clean_specks(key_magenta(a))
    m = k[..., 3] > 40
    mm = ndi.binary_dilation(m, iterations=merge) if merge else m
    lab, cnt = ndi.label(mm)
    objs = ndi.find_objects(lab)
    sizes = ndi.sum(m, lab, range(1, cnt + 1))
    order = np.argsort(sizes)[::-1]
    bodies = sorted(order[:n], key=lambda i: objs[i][1].start)
    def bb(i):
        sl = objs[i]; return (sl[1].start, sl[0].start, sl[1].stop, sl[0].stop)
    def dist(p, q):
        dx = max(0, max(p[0], q[0]) - min(p[2], q[2]))
        dy = max(0, max(p[1], q[1]) - min(p[3], q[3]))
        return (dx * dx + dy * dy) ** .5
    groups = {i: [i] for i in bodies}
    for i in order[n:]:
        if sizes[i] < min_area:
            continue
        j = min(bodies, key=lambda t: dist(bb(i), bb(t)))
        groups[j].append(i)
    out = []
    for i in bodies:
        ids = groups[i]
        boxes = [bb(t) for t in ids]
        b = (min(q[0] for q in boxes), min(q[1] for q in boxes), max(q[2] for q in boxes), max(q[3] for q in boxes))
        sub = crop(k, b).copy()
        sel = np.isin(lab[b[1]:b[3], b[0]:b[2]], [t + 1 for t in ids])
        sub[~sel] = 0
        # bo bien rong
        al = sub[..., 3] > 40
        ys, xs = np.where(al)
        b2 = (b[0] + xs.min(), b[1] + ys.min(), b[0] + xs.max() + 1, b[1] + ys.max() + 1)
        out.append((sub[ys.min():ys.max() + 1, xs.min():xs.max() + 1], b2))
    return out
