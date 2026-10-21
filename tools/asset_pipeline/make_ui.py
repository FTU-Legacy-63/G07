"""Tao toan bo phan tu giao dien (PNG trong suot + le 9-slice) va ghi meta_ui.json."""
import sys, json, os, cv2
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ui import *

U = {}


def one(name):
    p = get_parts(name)
    return max(p, key=lambda t: (t[1][2] - t[1][0]) * (t[1][3] - t[1][1]))[0]


def series(fname, names, prefix, height=None, width=None, **kw):
    for nm, (f, b) in zip(names, get_parts(fname, **kw)):
        U[prefix + nm] = export(f, 'ui_' + prefix + nm, height=height, width=width)


# Hop thoai: thuong / canh bao / nguy hiem
U['dialog_normal'] = export(one('New_Dialog_box.webp'), 'ui_dialog_normal', width=960, slice9=True)
U['dialog_warning'] = export(one('New_diaglog_box_2.png'), 'ui_dialog_warning', width=960, slice9=True)
U['dialog_danger'] = export(one('new_dialog_box_3.png'), 'ui_dialog_danger', width=960, slice9=True)
# Bong bong thoai lai buon + duoi tach rieng
p = sorted(get_parts('Dialog.png'), key=lambda t: -(t[1][2] - t[1][0]))
U['speech_bubble'] = export(p[0][0], 'ui_speech_bubble', width=720, slice9=True)
U['speech_tail'] = export(p[1][0], 'ui_speech_tail', width=round((p[1][1][2] - p[1][1][0]) * 720 / (p[0][1][2] - p[0][1][0])))
# Cuon giay cau hoi, o phuong an, ket qua
U['question_scroll'] = export(one('Question_Scroll.png'), 'ui_question_scroll', width=1600)
for nm, (f, b) in zip(['normal', 'hover', 'selected', 'correct', 'wrong'], get_parts('Option_bars_2.png')):
    U['option_' + nm] = export(f, 'ui_option_' + nm, width=1200)
for nm, (f, b) in zip(['pass', 'fail', 'quest'], get_parts('Result_box_scores.png')):
    U['result_' + nm] = export(f, 'ui_result_' + nm, width=1200)
# O vat pham (bo 2 manh thua o mep trai anh goc)
p = [t for t in get_parts('Item_slots.png') if t[1][0] > 300]
for nm, (f, b) in zip(['locked', 'ready', 'used'], p):
    U['itemslot_' + nm] = export(f, 'ui_itemslot_' + nm, width=128)
U['item_card'] = export(one('Item_card.png'), 'ui_item_card', width=560, slice9=True)
U['zone_card'] = export(one('Map_zone_info_card.png'), 'ui_zone_card', width=560, slice9=True)
U['bossbar_frame'] = export(one('Health_bar_empty.png'), 'ui_bossbar_frame', width=960, slice9=True)
hb = get_parts('Health_bar_1.png')[0][0]
U['bossbar_frame']['fill'] = '#%02x%02x%02x' % tuple(int(v) for v in hb[hb.shape[0] // 2, hb.shape[1] // 2, :3])
U['button_square'] = export(one('button.png'), 'ui_button_square', width=128, slice9=True)
U['banner_gold'] = export(one('Banner_fail.png'), 'ui_banner_gold', width=800, slice9=True)   # file goc dat ten nham
U['banner_red'] = export(one('New_banner.png'), 'ui_banner_red', width=800, slice9=True)

# Nut 3 mau x 3 trang thai: o luoi (bo vach ke), giu hinh lien khoi lon nhat
a = load_rgb(NEW + 'buttons.png')
xr = [(30, 898), (936, 1816), (1854, 2722)]; yr = [(24, 492), (528, 990), (1010, 1512)]
for si, st in enumerate(['normal', 'pressed', 'disabled']):
    for ci, col in enumerate(['gold', 'tan', 'red']):
        (x0, x1), (y0, y1) = xr[ci], yr[si]
        k = clean_specks(key_magenta(a[y0:y1, x0:x1]))
        m = k[..., 3] > 40
        lab, n = ndi.label(m)
        j = int(np.argmax(ndi.sum(m, lab, range(1, n + 1)))) + 1
        k[lab != j] = 0
        ys, xs = np.where(lab == j)
        U[f'button_{col}_{st}'] = export(k[ys.min():ys.max() + 1, xs.min():xs.max() + 1], f'ui_button_{col}_{st}', width=400)

# Icon nho
series('health.png', ['full', 'empty'], 'heart_', height=64)
series('flags.png', ['white', 'grey'], 'flag_', height=64)
series('icons.png', ['lock', 'tick', 'cross', 'info', 'warning', 'chain'], 'icon_', height=64)
series('Node_markers.png', ['locked', 'current', 'passed', 'boss_locked', 'alert'], 'node_', height=128)
wn = ['w', 'a', 's', 'd']
for i, (f, b) in enumerate(get_parts('wasd.png')):
    st = 'up' if i < 4 else 'down'
    U[f'key_{wn[i % 4]}_{st}'] = export(f, f'ui_key_{wn[i % 4]}_{st}', height=64 if st == 'up' else 58)
# Dong ho cat: lay 2 hinh tren nen magenta sach (thuong, qua gio); "sap het gio" lam bang CSS
p = [t for t in get_parts('Time_variation.png', merge=6) if t[1][1] < 900 and (t[1][2] - t[1][0]) < 700]
p.sort(key=lambda t: t[1][0])
U['hourglass_normal'] = export(p[0][0], 'ui_hourglass_normal', height=128)
U['hourglass_overtime'] = export(p[1][0], 'ui_hourglass_overtime', height=128)
lg = get_parts('Large_logo.png')[0][0]
U['logo_large'] = export(lg, 'ui_logo_large', width=1200)
U['logo_small'] = export(lg, 'ui_logo_small', width=360)

# Bua Loai Tru (anh cu, nen den): xoa nen den noi voi 4 goc
img = np.asarray(Image.open(find(OLD + 'Item_2.webp')).convert('RGB')).copy()
H, W = img.shape[:2]; mask = np.zeros((H + 2, W + 2), np.uint8)
for pt in [(0, 0), (W - 1, 0), (0, H - 1), (W - 1, H - 1)]:
    cv2.floodFill(img, mask, pt, (0, 0, 0), (18,) * 3, (18,) * 3, 4 | cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE | (1 << 8))
bg = mask[1:-1, 1:-1] > 0
rgba = np.dstack([img, np.where(bg, 0, 255).astype(np.uint8)])
ys, xs = np.where(~bg)
rgba = rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
U['item_charm'] = export(rgba, 'ui_item_charm', height=96)
U['item_charm_large'] = export(rgba, 'ui_item_charm_large', height=192)
im = Image.open(OUT + U['item_charm']['file']).convert('RGBA'); aa = np.asarray(im).astype(float)
g = (aa[..., :3] @ [0.3, 0.59, 0.11])[..., None]
grey = np.concatenate([np.repeat(g * 0.8 + 30, 3, -1), aa[..., 3:4]], -1).clip(0, 255).astype(np.uint8)
Image.fromarray(grey, 'RGBA').save(OUT + 'ui/ui_item_charm_grey.webp', 'WEBP', quality=90, alpha_quality=100, method=6)
U['item_charm_grey'] = dict(file='ui/ui_item_charm_grey.webp', w=im.width, h=im.height)

# Le 9-slice chinh tay (do tu dong chua chuan voi nen co dai sang/toi)
U['question_scroll']['slice'] = [235, 520, 235, 285]
for k in ['option_normal', 'option_hover', 'option_selected', 'option_correct', 'option_wrong']:
    U[k]['slice'] = [135, 160, 135, 215]
for k in ['result_pass', 'result_fail', 'result_quest']:
    U[k]['slice'] = [100, 70, 100, 190]
for k in U:
    if k.startswith('button_') and k != 'button_square':
        U[k]['slice'] = [46, 46, 50, 46]
json.dump(U, open('meta_ui.json', 'w'), indent=1)
print(len(U), 'phan tu giao dien')
