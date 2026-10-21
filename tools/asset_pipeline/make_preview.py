"""Anh xem truoc cho nhom: sprite, giao dien, truoc/sau cua 2 san da sua."""
import json, os
from PIL import Image, ImageDraw, ImageFont
os.makedirs('out_preview', exist_ok=True)
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18)
Fs = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14)
S = json.load(open('meta_sprites.json')); U = json.load(open('meta_ui.json'))


def checker(w, h, a=(58, 64, 74), b=(48, 54, 64), n=16):
    im = Image.new('RGBA', (w, h), a + (255,)); d = ImageDraw.Draw(im)
    for y in range(0, h, n):
        for x in range(0, w, n):
            if (x // n + y // n) % 2:
                d.rectangle([x, y, x + n - 1, y + n - 1], fill=b + (255,))
    return im


# 1. Sprite
rows = [(k, Image.open('out/' + m['file']).convert('RGBA'), m) for k, m in S.items()]
W = 1900
lay, y, x, rowh = [], 10, 10, 0
for k, im, m in rows:
    s = min(1.0, (W - 20) / im.width)
    if s < 1:
        im = im.resize((int(im.width * s), int(im.height * s)), Image.BOX)
    lw = int(Fs.getlength(f"{k}  ({m['frames']} khung {m['fw']}x{m['fh']})")) + 10
    w = max(im.width, lw)
    if x + w > W - 10:
        x = 10; y += rowh + 34; rowh = 0
    lay.append((k, im, m, x, y)); x += w + 24; rowh = max(rowh, im.height)
H = y + rowh + 44
c = checker(W, H); d = ImageDraw.Draw(c)
for k, im, m, x, y in lay:
    d.text((x, y), f"{k}  ({m['frames']} khung {m['fw']}x{m['fh']})", fill=(255, 220, 90), font=Fs)
    c.alpha_composite(im, (x, y + 20))
c.convert('RGB').save('out_preview/01_sprites.png')

# 2. Giao dien tren nen toi va nen sang
keys = list(U.keys())
for name, bgc in [('02_ui_nen_toi', ((40, 44, 52), (34, 38, 46))), ('03_ui_nen_sang', ((236, 230, 214), (226, 220, 204)))]:
    lay, y, x, rowh = [], 10, 10, 0
    for k in keys:
        im = Image.open('out/' + U[k]['file']).convert('RGBA')
        if im.width > 600:
            im = im.resize((im.width // 2, im.height // 2), Image.BOX)
        w = max(im.width, int(Fs.getlength(k)) + 8)
        if x + w > W - 10:
            x = 10; y += rowh + 30; rowh = 0
        lay.append((k, im, x, y)); x += w + 20; rowh = max(rowh, im.height)
    H = y + rowh + 40
    c = checker(W, H, *bgc); d = ImageDraw.Draw(c)
    col = (255, 220, 90) if 'toi' in name else (120, 40, 20)
    for k, im, x, y in lay:
        d.text((x, y), k, fill=col, font=Fs); c.alpha_composite(im, (x, y + 18))
    c.convert('RGB').save(f'out_preview/{name}.png')


# 3, 4. Truoc / sau
def before_after(a_path, b_path, out, title):
    a = Image.open(a_path).convert('RGB').resize((1200, 670), Image.LANCZOS)
    b = Image.open(b_path).convert('RGB').resize((1200, 670), Image.LANCZOS)
    c = Image.new('RGB', (2420, 720), (20, 22, 28)); d = ImageDraw.Draw(c)
    c.paste(a, (0, 50)); c.paste(b, (1220, 50))
    d.text((10, 14), title + ' - TRUOC (anh goc)', fill=(255, 255, 255), font=F)
    d.text((1230, 14), title + ' - SAU', fill=(255, 220, 90), font=F)
    c.save(out)


before_after('/home/claude/assets2110/Boss_floor.png', 'out/bg/sd_boss.webp', 'out_preview/04_san_boss_truoc_sau.png', 'San Boss')
if os.path.exists('out/bg/sd_arena1.webp'):
    before_after('src_old/Environment_-_Arena_1.png', 'out/bg/sd_arena1.webp', 'out_preview/05_san_arena1_truoc_sau.png', 'San Arena 1')
print(sorted(os.listdir('out_preview')))

# 6. Ban do: vung bam + vi tri node (doc tu assets.js)
import re as _re
txt = open('out/assets.js', encoding='utf-8').read()
man = json.loads(txt[txt.index('{'):txt.rindex('}') + 1])
im = Image.open('out/' + man['bg']['bg_map']['file']).convert('RGBA').resize((1600, 893), Image.LANCZOS)
ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
nd = Image.open('out/' + man['ui']['node_current']['file']).convert('RGBA').resize((40, 40), Image.LANCZOS)
for k, z in man['map']['zones'].items():
    x, y, w, h = [v / 100 for v in z['rect']]
    d.rectangle([x * 1600, y * 893, (x + w) * 1600, (y + h) * 893], outline=(255, 230, 80, 255), width=3, fill=(255, 230, 80, 40))
    d.text((x * 1600 + 6, y * 893 + 4), k, fill=(255, 255, 255, 255), font=F, stroke_width=3, stroke_fill=(0, 0, 0, 255))
im.alpha_composite(ov)
for k, z in man['map']['zones'].items():
    im.alpha_composite(nd, (int(z['node'][0] / 100 * 1600 - 20), int(z['node'][1] / 100 * 893 - 36)))
im.convert('RGB').save('out_preview/06_ban_do_vung_bam.png')
