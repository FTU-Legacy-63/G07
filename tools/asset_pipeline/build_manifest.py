"""Gop meta_*.json thanh src/assets/assets.js (window.CFA_ASSETS)."""
import json, os

B = json.load(open('meta_bg.json'))
S = json.load(open('meta_sprites.json'))
U = json.load(open('meta_ui.json'))
OUT = 'out/'

# Toc do va doan hoat canh (theo sheet 6, chinh cho khop so khung thuc te)
ANIM = {
    'player_walk':     dict(fps=10, loop=True),
    'player_stand':    dict(fps=1, loop=True, note='1 khung; code nhun 1-2 px de tao dang tho'),
    'player_attack':   dict(fps=14, loop=False, clips={'slash': [0, 1, 2, 3], 'thrust': [4], 'low': [5], 'recover': [6]},
                            note='slash 4 khung o 14 fps ~ 0,29 s, khop vet chem 0,3 s (muc 15.8)'),
    'player_hurt':     dict(fps=12, loop=False, clips={'hit': [0, 1], 'down': [2], 'getup': [3]},
                            note='khung 0 la bong trang loe sang luc trung dan'),
    'player_win':      dict(fps=8, loop=False, hold_last=True),
    'player_sad':      dict(fps=8, loop=False, hold_last=True),
    'mob_idle':        dict(fps=1, loop=True, note='1 khung; code cho lo lung len xuong 3-4 px, moi con lech nhip'),
    'mob_spawn':       dict(fps=12, loop=False, note='khung 0-3 co vong rune duoi chan; neo = chan quai o khung cuoi'),
    'mob_vanish':      dict(fps=14, loop=False),
    'boss_idle':       dict(fps=3, loop=True),
    'boss_telegraph':  dict(fps=4, loop=False, note='bao hieu truoc moi dot ban: 4 khung o 4 fps = 1,0 s, bang thoi gian bao hieu (muc 15.8)'),
    'boss_attack':     dict(fps=16, loop=False, note='vung truong hat nguoi choi ra vong R: 4 khung o 16 fps = 0,25 s, bang thoi gian day (muc 15.8)'),
    'boss_hit':        dict(fps=12, loop=False, hold_last=True, note='luc nhat chem trung Boss, ngay truoc khi cau hoi hien; giu khung cuoi khi dung hinh'),
    'boss_defeat':     dict(fps=10, loop=False, hold_last=False),
    'merchant_idle':   dict(fps=6, loop=True),
    'merchant_greet':  dict(fps=10, loop=False),
    'coin_spin':       dict(fps=12, loop=True),
    'coin_icon':       dict(fps=1, loop=True),
    'menu_portal':     dict(fps=8, loop=True),
}
sprites = {}
for k, m in S.items():
    d = dict(m)
    d.update(ANIM.get(k, {}))
    sprites[k] = d

bg = {k: dict(file=v['file'], w=v['w'], h=v['h']) for k, v in B.items()}

# Vung di duoc: dung so cua SOLUTION_STRUCTURE muc 15.8 cho moi san (walkDefault).
# walkMeasured la so do tu tung anh (khung logic 960x540), chi de tham khao khi can chinh tay.
WALK_DEFAULT = [30, 140, 930, 520]
floors = {
    'arena1':      dict(image='sd_arena1', walkMeasured=[27, 167, 933, 509],
                        note='Da don cot, ban, gia sach, cot do giua san. Gia sach sat tuong tren giu nguyen (day gia o y=167).'),
    'arena2':      dict(image='sd_arena2', walkMeasured=[32, 121, 928, 514]),
    'arena3':      dict(image='sd_arena3', walkMeasured=[38, 128, 922, 508]),
    'arena4':      dict(image='sd_arena4', walkMeasured=[34, 130, 926, 514],
                        note='Dong rom, xe day, thung go, co do o 4 goc: nhan vat di de len, khong co va cham.'),
    'world_quest': dict(image='sd_world_quest', walkMeasured=[29, 113, 931, 514]),
    'boss':        dict(image='sd_boss', walkMeasured=[42, 139, 918, 514], bossFeet=[480, 212],
                        note='Tuong tren da cat bot 2 hang gach: san bat dau o y=139. Be da giu nguyen vi tri; '
                             've Boss voi diem neo (chan) tai bossFeet de dung tren be; tam va cham van la (480,160).'),
}

# Ban do the gioi: vung bam va diem dat node, don vi % anh bg_map
mapdata = dict(image='bg_map', zones={
    'arena1':      dict(rect=[17, 66, 21, 32], node=[36, 87], transition='cc_arena1'),
    'arena2':      dict(rect=[34, 17, 11, 27], node=[40.5, 41], transition='cc_arena2'),
    'arena3':      dict(rect=[40, 44, 21, 28], node=[56, 65], transition='cc_arena3'),
    'arena4':      dict(rect=[46, 19, 16, 21], node=[53, 36], transition='cc_arena4'),
    'world_quest': dict(rect=[63, 19, 16, 25], node=[76, 38], transition='cc_world_quest'),
    'boss':        dict(rect=[79, 3, 21, 32], node=[90, 33], transition='cc_boss'),
    'report':      dict(rect=[14, 0, 19, 58], node=[29, 52], transition='cc_report'),
    'shop':        dict(rect=[70, 62, 14, 30], node=[76, 72], transition='cc_shop', inside='bg_shop'),
})

# Thu tu hoat canh cua Boss (khop muc 15.3, 15.8)
bossSequence = [
    'boss_idle: dung yen, phat dan trong dot ban 3,0 s va luc nghi 1,2 s',
    'boss_telegraph: bao hieu 1,0 s truoc moi dot ban',
    'boss_hit: nhat chem trung Boss -> cau hoi hien, moi thu dung hinh',
    'boss_attack: tra loi xong -> Boss vung truong, day nguoi choi ra vong R trong 0,25 s',
    'sau khi day: quay lai boss_telegraph cua dot ban ke tiep',
    'boss_defeat: khi Boss het 15 nac mau va nguoi choi dat nguong',
]

menu = dict(image='bg_menu', portal=dict(sprite='menu_portal', x=34.69, y=8.40, w=30.90, h=73.11,
            note='dat 7 khung cong xoay de len cong da trong bg_menu; don vi % anh bg_menu'))

ui = U

manifest = dict(
    version='2026-10-21',
    logic=dict(w=960, h=540),
    spriteScale=2.5,
    note=('Sprite xuat o 2,5 px anh cho 1 px logic: ve len canvas voi kich thuoc = kich thuoc khung / 2,5. '
          'Neo [ax, ay] la diem chan (giua, duoi) trong moi khung. Sprite quay sang phai; di sang trai thi lat ngang. '
          'UI dung cho DOM/CSS: slice = [tren, phai, duoi, trai] tinh theo px cua anh, dung cho border-image-slice.'),
    bg=bg, bossSequence=bossSequence, walkDefault=WALK_DEFAULT, floors=floors, map=mapdata, menu=menu, sprites=sprites, ui=ui,
    colors=dict(bossbarFill=U['bossbar_frame'].get('fill', '#d22a39'), bossbarLost='#5a4a44',
                gold='#F2B632', outline='#3A220C', bullet='#ff3355', bulletCore='#ffffff'),
)
os.makedirs(OUT, exist_ok=True)
with open(OUT + 'assets.js', 'w', encoding='utf-8') as f:
    f.write('/* CFA Quest - Ethics - danh muc asset. File sinh tu dong boi tools/asset_pipeline/build_manifest.py.\n'
            '   Sua tay thi sua trong script roi chay lai, khong sua truc tiep file nay. */\n')
    f.write('window.CFA_ASSETS = ')
    json.dump(manifest, f, ensure_ascii=False, indent=1)
    f.write(';\n')
print('ok', len(bg), len(sprites), len(ui))
