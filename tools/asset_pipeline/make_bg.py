"""Anh nen: doi ten, nen WebP <= 400 KB; sua tuong san Boss; lay san Arena 1 da don (a1_clean.py)."""
import sys, os, json
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import NEW, OLD, find
OUT = os.environ.get('CFA_OUT', 'out/') + 'bg/'
os.makedirs(OUT, exist_ok=True)


def boss_floor():
    """Bot 30 px dai toi tren cung + 2 hang gach (y 300-370) => san bat dau o y=395 (=139 logic).
    Cot giua (x 532-2219, co be da): chen 1 hang o san sach (y 895-995) ngay duoi chan tuong, be da giu nguyen.
    Hai cot ben (duoc + vung sang): dich len 100 px roi lap lai hang o y 896-996 de lap cho trong."""
    o = np.asarray(Image.open(find(NEW + 'Boss_floor.png')).convert('RGB'))
    H, W, _ = o.shape
    c, band, brick, S1, S2, Yins = 300, 30, 70, 532, 2219, 896
    n = np.empty_like(o)
    n[0:c - band] = o[band:c]
    mid = slice(S1, S2)
    n[c - band:395, mid] = o[c + brick:495, mid]
    n[395:495, mid] = o[895:995, mid]
    n[495:, mid] = o[495:, mid]
    for side in (slice(0, S1), slice(S2, W)):
        n[c - band:Yins, side] = o[c + brick:Yins + 100, side]
        n[Yins:Yins + 100, side] = o[Yins:Yins + 100, side]
        n[Yins + 100:, side] = o[Yins + 100:, side]
    return Image.fromarray(n)


jobs = {
    'bg_map': NEW + 'Overworld..png',
    'bg_menu': OLD + 'Environment_-_Main_Menu.webp',
    'cc_arena1': NEW + 'Arena_1_transition_scene.png',
    'cc_arena2': OLD + 'Environment_-_Arena_2.png',
    'cc_arena3': OLD + 'Environment_-_Arena_3.png',
    'cc_arena4': OLD + 'Environment_-_Arena_4.png',
    'cc_world_quest': OLD + 'World_Quest_Arena.png',
    'cc_boss': OLD + 'Environment_-_Arena_5.png',
    'cc_shop': OLD + 'Environment_-_Merchant.png',
    'cc_report': NEW + 'Castle_hall.png',
    'bg_shop': OLD + 'Environment_-_Merchant_Inside.png',
    'sd_arena1': 'a1_clean.png',
    'sd_arena2': NEW + 'Arena_2_floor.png',
    'sd_arena3': NEW + 'Arena_3_floor_crystal_cave_room.png',
    'sd_arena4': NEW + 'Arena_4_floor_town_square.png',
    'sd_world_quest': NEW + 'World_Questfloor_observatory_court.png',
    'sd_boss': None,
}
meta = {}
for k, src in jobs.items():
    im = boss_floor() if k == 'sd_boss' else Image.open(find(src)).convert('RGB')
    q = 82
    while True:
        p = OUT + k + '.webp'
        im.save(p, 'WEBP', quality=q, method=6)
        kb = os.path.getsize(p) / 1024
        if kb <= 400 or q <= 60:
            break
        q -= 6
    meta[k] = dict(file='bg/' + k + '.webp', w=im.width, h=im.height, kb=round(kb), q=q)
    print(k, im.size, round(kb), 'KB, q', q)
json.dump(meta, open('meta_bg.json', 'w'), indent=1)
