"""Tao toan bo sprite sheet tu anh goc cua Khoi (folder 21-10).
Chay: python3 make_sprites.py  (doc anh trong NEW, ghi vao out/sprites va meta_sprites.json)"""
import sys, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract import *
from build import *

meta = {}
os.makedirs(OUT + 'sprites', exist_ok=True)


def out(name, sheet, m):
    fn = f"spr_{name}_{m['frames']}x{m['fw']}x{m['fh']}.webp"
    save_png(sheet, 'sprites/' + fn)
    m['file'] = 'sprites/' + fn
    meta[name] = m
    print(name, m)


def rowbase(frames):
    ys = [(b[1] + b[3]) / 2 for _, b in frames]
    return [max(bb[3] for (ff, bb), y in zip(frames, ys) if abs(y - ys[i]) < 300) for i in range(len(frames))]


def area(f):
    return (f[..., 3] > 128).sum()


# ---- Nhan vat chinh: cung ti le giua cac hoat canh (do bang dien tich pixel toi: toc, ao, quan)
S = 136 / 732                      # chieu cao dang di (732 px goc) -> 136 px
REL = {'walk': 1.0, 'attack': 1.16, 'defeat': 1.0, 'win': 0.82, 'sad': 0.85, 'char': 0.463}
P = {
    'walk': frames_grid('Char_walk.png'),
    'sad': frames_grid('Sad.png'),
    'attack': frames_auto('Attack.png', [4, 3], rows=2),
    'defeat': frames_auto('Defeat.png', 4),
    'win': frames_auto('Win.png', 4),
    'char': frames_auto('Char.png', 1),
}
for name, k in [('player_walk', 'walk'), ('player_attack', 'attack'), ('player_hurt', 'defeat'),
                ('player_win', 'win'), ('player_sad', 'sad'), ('player_stand', 'char')]:
    sh, m = build_anim(P[k], S * REL[k], base_y=rowbase(P[k]), cmode='dark')
    out(name, sh, m)

# ---- Boss: ti le moi sheet chuan theo khung dung yen cua sheet do
B = {
    'idle': frames_bodies('Big_Boss_Idle.png', 2, merge=1),
    'attack': frames_bodies('Big_Boss_1.png', 4, merge=1, pre=remove_ground_line),
    'telegraph': frames_bodies('Big_Boss_telegraph.png', 4, merge=1),
    'damage': frames_bodies('Big_Boss_damage.png', 3, merge=1),
    'defeat': frames_slabs('Big_boss_defeat.png', [348, 717, 1054, 1420, 1735, 2065, 2350]),
}
ref = area(B['idle'][0][0])
rs = {k: (ref / area(B[k][i][0])) ** .5 for k, i in [('attack', 3), ('telegraph', 0), ('damage', 0), ('defeat', 0)]}
s = 0.308
bot = lambda fr: [b[3] for _, b in fr]
out('boss_idle', *build_anim(B['idle'], s, base_y=bot(B['idle'])))
out('boss_telegraph', *build_anim(B['telegraph'], s * rs['telegraph'], base_y=bot(B['telegraph'])))
out('boss_attack', *build_anim(B['attack'], s * rs['attack'], base_y=[1246] * 4))
out('boss_hit', *build_anim(B['damage'], s * rs['damage'], base_y=[1258] * 3))
fb = bot(B['defeat'])
out('boss_defeat', *build_anim(B['defeat'], s * rs['defeat'], base_y=fb[:4] + [fb[3]] * 4))

# ---- Lai buon
Mi = frames_bodies('Merchant_Idle.png', 4, merge=1)
Mg = frames_bodies('Merchant_greet.png', 4, merge=1)
sm = 256 / 707
out('merchant_idle', *build_anim(Mi, sm, base_y=bot(Mi)))
out('merchant_greet', *build_anim(Mg, sm * (area(Mi[0][0]) / area(Mg[0][0])) ** .5, base_y=bot(Mg)))

# ---- Quai (Spirit): hinh o sheet xuat hien to hon ~1,2 lan -> nhan 0,833
van = frames_bins('Spirit.png', [0, 495, 990, 1420, 1880, 2320, 2688], merge=10)
spn = frames_auto('spirit_2.png', 5, merge=20, min_area=800)
sv = 112 / 464
out('mob_vanish', *build_anim(van, sv, base_y=[van[0][1][3]] * 6, cmode='alpha'))
out('mob_spawn', *build_anim(spn, sv * 0.833, base_y=[spn[4][1][3]] * 5, cmode='alpha'))
out('mob_idle', *build_anim(van[:1], sv, base_y=[van[0][1][3]], cmode='alpha'))

# ---- Dong xu: 9 hinh -> vong xoay 8 khung (mat can can -> canh -> mat ngoi sao -> canh)
c = frames_auto('Coin.png', [5, 4], rows=2, merge=6)
fr = [c[i] for i in [0, 1, 2, 7, 5, 6, 8, 1]]
cs = 48 / 723
out('coin_spin', *build_anim(fr, cs, base_y=[b[3] for _, b in fr], cx_fixed=[(b[0] + b[2]) / 2 for _, b in fr], pad=1))
out('coin_icon', *build_anim([c[0]], cs, base_y=[c[0][1][3]], cx_fixed=[(c[0][1][0] + c[0][1][2]) / 2], pad=1))

# ---- Cong xoay man dau (dat len bg_menu tai x=444,y=60, phong 1,13 lan tren anh 1280x714)
so = frames_auto('start_screen_overlay.png', 7, merge=4)
out('menu_portal', *build_anim(so, 1.0, base_y=[b[3] for _, b in so], cx_fixed=[(b[0] + b[2]) / 2 for _, b in so], pad=0))

json.dump(meta, open('meta_sprites.json', 'w'), indent=1)
