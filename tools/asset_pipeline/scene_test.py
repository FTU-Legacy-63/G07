"""Ghep thu canh choi o kich thuoc that (khung logic 960x540, ve x2 = 1920x1080)."""
import json
from PIL import Image, ImageDraw
S=json.load(open('meta_sprites.json')); U=json.load(open('meta_ui.json'))
Z=2.0; SC=2.5   # 1 px logic = 2 px anh xem; sprite xuat 2.5 px/1 px logic
def frame(name,i=0):
    m=S[name]; sh=Image.open('out/'+m['file']).convert('RGBA')
    f=sh.crop((i*m['fw'],0,(i+1)*m['fw'],m['fh']))
    k=Z/SC; f=f.resize((round(m['fw']*k),round(m['fh']*k)),Image.LANCZOS)
    return f,(m['anchor'][0]*k,m['anchor'][1]*k)
def put(c,name,x,y,i=0,flip=False):
    f,(ax,ay)=frame(name,i)
    if flip: f=f.transpose(Image.FLIP_LEFT_RIGHT); ax=f.width-ax
    c.alpha_composite(f,(round(x*Z-ax),round(y*Z-ay)))
def ui(c,key,x,y,h):
    im=Image.open('out/'+U[key]['file']).convert('RGBA'); w=round(im.width*h/im.height)
    c.alpha_composite(im.resize((w,h),Image.LANCZOS),(round(x),round(y)))
def scene(floor, out, boss=False, walk=(30,140,930,520), feet=(480,212)):
    c=Image.open('out/bg/'+floor+'.webp').convert('RGBA').resize((1920,1080),Image.LANCZOS)
    d=ImageDraw.Draw(c)
    x0,y0,x1,y1=walk; d.rectangle([x0*Z,y0*Z,x1*Z,y1*Z],outline=(0,255,255,255),width=2)
    if boss:
        put(c,'boss_idle',feet[0],feet[1])
        d.ellipse([(480-70)*Z,(160-70)*Z,(480+70)*Z,(160+70)*Z],outline=(255,80,80,255),width=2)
        d.ellipse([(480-340)*Z,(160-340)*Z,(480+340)*Z,(160+340)*Z],outline=(255,255,255,120),width=1)
        put(c,'player_walk',300,420,0)
        ui(c,'heart_full',20,16,52); ui(c,'heart_full',78,16,52)
        im=Image.open('out/'+U['bossbar_frame']['file']).convert('RGBA'); c.alpha_composite(im.resize((720,124)),(600,8))
    else:
        put(c,'player_walk',480,330,0)
        for (x,y,f) in [(260,240,0),(700,250,0),(620,450,0),(200,470,0)]:
            put(c,'mob_idle',x,y,f)
        for i,(x,y) in enumerate([(540,350),(560,320),(520,300)]): put(c,'coin_spin',x,y,i)
    c.convert('RGB').save(out,quality=88)
if __name__=='__main__':
    scene('sd_boss','out_preview/07_ghep_thu_boss.jpg',boss=True)
    scene('sd_arena1','out_preview/08_ghep_thu_arena1.jpg')
