/* CFA Quest - Ethics - danh muc asset. File sinh tu dong boi tools/asset_pipeline/build_manifest.py.
   Sua tay thi sua trong script roi chay lai, khong sua truc tiep file nay. */
window.CFA_ASSETS = {
 "version": "2026-10-21",
 "logic": {
  "w": 960,
  "h": 540
 },
 "spriteScale": 2.5,
 "note": "Sprite xuat o 2,5 px anh cho 1 px logic: ve len canvas voi kich thuoc = kich thuoc khung / 2,5. Neo [ax, ay] la diem chan (giua, duoi) trong moi khung. Sprite quay sang phai; di sang trai thi lat ngang. UI dung cho DOM/CSS: slice = [tren, phai, duoi, trai] tinh theo px cua anh, dung cho border-image-slice.",
 "bg": {
  "bg_map": {
   "file": "bg/bg_map.webp",
   "w": 2752,
   "h": 1536
  },
  "bg_menu": {
   "file": "bg/bg_menu.webp",
   "w": 1280,
   "h": 714
  },
  "cc_arena1": {
   "file": "bg/cc_arena1.webp",
   "w": 2752,
   "h": 1536
  },
  "cc_arena2": {
   "file": "bg/cc_arena2.webp",
   "w": 2752,
   "h": 1536
  },
  "cc_arena3": {
   "file": "bg/cc_arena3.webp",
   "w": 2752,
   "h": 1536
  },
  "cc_arena4": {
   "file": "bg/cc_arena4.webp",
   "w": 2752,
   "h": 1536
  },
  "cc_world_quest": {
   "file": "bg/cc_world_quest.webp",
   "w": 2752,
   "h": 1536
  },
  "cc_boss": {
   "file": "bg/cc_boss.webp",
   "w": 2752,
   "h": 1536
  },
  "cc_shop": {
   "file": "bg/cc_shop.webp",
   "w": 2752,
   "h": 1536
  },
  "cc_report": {
   "file": "bg/cc_report.webp",
   "w": 2752,
   "h": 1536
  },
  "bg_shop": {
   "file": "bg/bg_shop.webp",
   "w": 2752,
   "h": 1536
  },
  "sd_arena1": {
   "file": "bg/sd_arena1.webp",
   "w": 2752,
   "h": 1536
  },
  "sd_arena2": {
   "file": "bg/sd_arena2.webp",
   "w": 2752,
   "h": 1536
  },
  "sd_arena3": {
   "file": "bg/sd_arena3.webp",
   "w": 2752,
   "h": 1536
  },
  "sd_arena4": {
   "file": "bg/sd_arena4.webp",
   "w": 2752,
   "h": 1536
  },
  "sd_world_quest": {
   "file": "bg/sd_world_quest.webp",
   "w": 2752,
   "h": 1536
  },
  "sd_boss": {
   "file": "bg/sd_boss.webp",
   "w": 2752,
   "h": 1536
  }
 },
 "bossSequence": [
  "boss_idle: dung yen, phat dan trong dot ban 3,0 s va luc nghi 1,2 s",
  "boss_telegraph: bao hieu 1,0 s truoc moi dot ban",
  "boss_hit: nhat chem trung Boss -> cau hoi hien, moi thu dung hinh",
  "boss_attack: tra loi xong -> Boss vung truong, day nguoi choi ra vong R trong 0,25 s",
  "sau khi day: quay lai boss_telegraph cua dot ban ke tiep",
  "boss_defeat: khi Boss het 15 nac mau va nguoi choi dat nguong"
 ],
 "walkDefault": [
  30,
  140,
  930,
  520
 ],
 "floors": {
  "arena1": {
   "image": "sd_arena1",
   "walkMeasured": [
    27,
    167,
    933,
    509
   ],
   "note": "Da don cot, ban, gia sach, cot do giua san. Gia sach sat tuong tren giu nguyen (day gia o y=167)."
  },
  "arena2": {
   "image": "sd_arena2",
   "walkMeasured": [
    32,
    121,
    928,
    514
   ]
  },
  "arena3": {
   "image": "sd_arena3",
   "walkMeasured": [
    38,
    128,
    922,
    508
   ]
  },
  "arena4": {
   "image": "sd_arena4",
   "walkMeasured": [
    34,
    130,
    926,
    514
   ],
   "note": "Dong rom, xe day, thung go, co do o 4 goc: nhan vat di de len, khong co va cham."
  },
  "world_quest": {
   "image": "sd_world_quest",
   "walkMeasured": [
    29,
    113,
    931,
    514
   ]
  },
  "boss": {
   "image": "sd_boss",
   "walkMeasured": [
    42,
    139,
    918,
    514
   ],
   "bossFeet": [
    480,
    212
   ],
   "note": "Tuong tren da cat bot 2 hang gach: san bat dau o y=139. Be da giu nguyen vi tri; ve Boss voi diem neo (chan) tai bossFeet de dung tren be; tam va cham van la (480,160)."
  }
 },
 "map": {
  "image": "bg_map",
  "zones": {
   "arena1": {
    "rect": [
     17,
     66,
     21,
     32
    ],
    "node": [
     36,
     87
    ],
    "transition": "cc_arena1"
   },
   "arena2": {
    "rect": [
     34,
     17,
     11,
     27
    ],
    "node": [
     40.5,
     41
    ],
    "transition": "cc_arena2"
   },
   "arena3": {
    "rect": [
     40,
     44,
     21,
     28
    ],
    "node": [
     56,
     65
    ],
    "transition": "cc_arena3"
   },
   "arena4": {
    "rect": [
     46,
     19,
     16,
     21
    ],
    "node": [
     53,
     36
    ],
    "transition": "cc_arena4"
   },
   "world_quest": {
    "rect": [
     63,
     19,
     16,
     25
    ],
    "node": [
     76,
     38
    ],
    "transition": "cc_world_quest"
   },
   "boss": {
    "rect": [
     79,
     3,
     21,
     32
    ],
    "node": [
     90,
     33
    ],
    "transition": "cc_boss"
   },
   "report": {
    "rect": [
     14,
     0,
     19,
     58
    ],
    "node": [
     29,
     52
    ],
    "transition": "cc_report"
   },
   "shop": {
    "rect": [
     70,
     62,
     14,
     30
    ],
    "node": [
     76,
     72
    ],
    "transition": "cc_shop",
    "inside": "bg_shop"
   }
  }
 },
 "menu": {
  "image": "bg_menu",
  "portal": {
   "sprite": "menu_portal",
   "x": 34.69,
   "y": 8.4,
   "w": 30.9,
   "h": 73.11,
   "note": "dat 7 khung cong xoay de len cong da trong bg_menu; don vi % anh bg_menu"
  }
 },
 "sprites": {
  "player_walk": {
   "frames": 8,
   "fw": 144,
   "fh": 146,
   "anchor": [
    72,
    142
   ],
   "file": "sprites/spr_player_walk_8x144x146.webp",
   "fps": 10,
   "loop": true
  },
  "player_attack": {
   "frames": 7,
   "fw": 268,
   "fh": 166,
   "anchor": [
    134,
    162
   ],
   "file": "sprites/spr_player_attack_7x268x166.webp",
   "fps": 14,
   "loop": false,
   "clips": {
    "slash": [
     0,
     1,
     2,
     3
    ],
    "thrust": [
     4
    ],
    "low": [
     5
    ],
    "recover": [
     6
    ]
   },
   "note": "slash 4 khung o 14 fps ~ 0,29 s, khop vet chem 0,3 s (muc 15.8)"
  },
  "player_hurt": {
   "frames": 4,
   "fw": 178,
   "fh": 148,
   "anchor": [
    89,
    144
   ],
   "file": "sprites/spr_player_hurt_4x178x148.webp",
   "fps": 12,
   "loop": false,
   "clips": {
    "hit": [
     0,
     1
    ],
    "down": [
     2
    ],
    "getup": [
     3
    ]
   },
   "note": "khung 0 la bong trang loe sang luc trung dan"
  },
  "player_win": {
   "frames": 4,
   "fw": 130,
   "fh": 202,
   "anchor": [
    65,
    198
   ],
   "file": "sprites/spr_player_win_4x130x202.webp",
   "fps": 8,
   "loop": false,
   "hold_last": true
  },
  "player_sad": {
   "frames": 4,
   "fw": 126,
   "fh": 144,
   "anchor": [
    63,
    140
   ],
   "file": "sprites/spr_player_sad_4x126x144.webp",
   "fps": 8,
   "loop": false,
   "hold_last": true
  },
  "player_stand": {
   "frames": 1,
   "fw": 164,
   "fh": 136,
   "anchor": [
    82,
    132
   ],
   "file": "sprites/spr_player_stand_1x164x136.webp",
   "fps": 1,
   "loop": true,
   "note": "1 khung; code nhun 1-2 px de tao dang tho"
  },
  "boss_idle": {
   "frames": 2,
   "fw": 454,
   "fh": 406,
   "anchor": [
    227,
    402
   ],
   "file": "sprites/spr_boss_idle_2x454x406.webp",
   "fps": 3,
   "loop": true
  },
  "boss_telegraph": {
   "frames": 4,
   "fw": 374,
   "fh": 412,
   "anchor": [
    187,
    408
   ],
   "file": "sprites/spr_boss_telegraph_4x374x412.webp",
   "fps": 4,
   "loop": false,
   "note": "bao hieu truoc moi dot ban: 4 khung o 4 fps = 1,0 s, bang thoi gian bao hieu (muc 15.8)"
  },
  "boss_attack": {
   "frames": 4,
   "fw": 484,
   "fh": 528,
   "anchor": [
    242,
    524
   ],
   "file": "sprites/spr_boss_attack_4x484x528.webp",
   "fps": 16,
   "loop": false,
   "note": "vung truong hat nguoi choi ra vong R: 4 khung o 16 fps = 0,25 s, bang thoi gian day (muc 15.8)"
  },
  "boss_hit": {
   "frames": 3,
   "fw": 438,
   "fh": 530,
   "anchor": [
    219,
    513
   ],
   "file": "sprites/spr_boss_hit_3x438x530.webp",
   "fps": 12,
   "loop": false,
   "hold_last": true,
   "note": "luc nhat chem trung Boss, ngay truoc khi cau hoi hien; giu khung cuoi khi dung hinh"
  },
  "boss_defeat": {
   "frames": 8,
   "fw": 374,
   "fh": 532,
   "anchor": [
    187,
    528
   ],
   "file": "sprites/spr_boss_defeat_8x374x532.webp",
   "fps": 10,
   "loop": false,
   "hold_last": false
  },
  "merchant_idle": {
   "frames": 4,
   "fw": 250,
   "fh": 264,
   "anchor": [
    125,
    260
   ],
   "file": "sprites/spr_merchant_idle_4x250x264.webp",
   "fps": 6,
   "loop": true
  },
  "merchant_greet": {
   "frames": 4,
   "fw": 248,
   "fh": 270,
   "anchor": [
    124,
    266
   ],
   "file": "sprites/spr_merchant_greet_4x248x270.webp",
   "fps": 10,
   "loop": false
  },
  "mob_vanish": {
   "frames": 6,
   "fw": 124,
   "fh": 122,
   "anchor": [
    62,
    118
   ],
   "file": "sprites/spr_mob_vanish_6x124x122.webp",
   "fps": 14,
   "loop": false
  },
  "mob_spawn": {
   "frames": 5,
   "fw": 118,
   "fh": 192,
   "anchor": [
    59,
    152
   ],
   "file": "sprites/spr_mob_spawn_5x118x192.webp",
   "fps": 12,
   "loop": false,
   "note": "khung 0-3 co vong rune duoi chan; neo = chan quai o khung cuoi"
  },
  "mob_idle": {
   "frames": 1,
   "fw": 124,
   "fh": 120,
   "anchor": [
    62,
    116
   ],
   "file": "sprites/spr_mob_idle_1x124x120.webp",
   "fps": 1,
   "loop": true,
   "note": "1 khung; code cho lo lung len xuong 3-4 px, moi con lech nhip"
  },
  "coin_spin": {
   "frames": 8,
   "fw": 52,
   "fh": 50,
   "anchor": [
    26,
    49
   ],
   "file": "sprites/spr_coin_spin_8x52x50.webp",
   "fps": 12,
   "loop": true
  },
  "coin_icon": {
   "frames": 1,
   "fw": 52,
   "fh": 50,
   "anchor": [
    26,
    49
   ],
   "file": "sprites/spr_coin_icon_1x52x50.webp",
   "fps": 1,
   "loop": true
  },
  "menu_portal": {
   "frames": 7,
   "fw": 350,
   "fh": 462,
   "anchor": [
    175,
    462
   ],
   "file": "sprites/spr_menu_portal_7x350x462.webp",
   "fps": 8,
   "loop": true
  }
 },
 "ui": {
  "dialog_normal": {
   "file": "ui/ui_dialog_normal.webp",
   "w": 960,
   "h": 398,
   "slice": [
    72,
    83,
    73,
    83
   ]
  },
  "dialog_warning": {
   "file": "ui/ui_dialog_warning.webp",
   "w": 960,
   "h": 397,
   "slice": [
    71,
    83,
    72,
    82
   ]
  },
  "dialog_danger": {
   "file": "ui/ui_dialog_danger.webp",
   "w": 960,
   "h": 397,
   "slice": [
    71,
    83,
    72,
    82
   ]
  },
  "speech_bubble": {
   "file": "ui/ui_speech_bubble.webp",
   "w": 720,
   "h": 260,
   "slice": [
    52,
    90,
    76,
    93
   ]
  },
  "speech_tail": {
   "file": "ui/ui_speech_tail.webp",
   "w": 92,
   "h": 81
  },
  "question_scroll": {
   "file": "ui/ui_question_scroll.webp",
   "w": 1600,
   "h": 831,
   "slice": [
    235,
    520,
    235,
    285
   ]
  },
  "option_normal": {
   "file": "ui/ui_option_normal.webp",
   "w": 1200,
   "h": 391,
   "slice": [
    135,
    160,
    135,
    215
   ]
  },
  "option_hover": {
   "file": "ui/ui_option_hover.webp",
   "w": 1200,
   "h": 382,
   "slice": [
    135,
    160,
    135,
    215
   ]
  },
  "option_selected": {
   "file": "ui/ui_option_selected.webp",
   "w": 1200,
   "h": 380,
   "slice": [
    135,
    160,
    135,
    215
   ]
  },
  "option_correct": {
   "file": "ui/ui_option_correct.webp",
   "w": 1200,
   "h": 380,
   "slice": [
    135,
    160,
    135,
    215
   ]
  },
  "option_wrong": {
   "file": "ui/ui_option_wrong.webp",
   "w": 1200,
   "h": 373,
   "slice": [
    135,
    160,
    135,
    215
   ]
  },
  "result_pass": {
   "file": "ui/ui_result_pass.webp",
   "w": 1200,
   "h": 222,
   "slice": [
    100,
    70,
    100,
    190
   ]
  },
  "result_fail": {
   "file": "ui/ui_result_fail.webp",
   "w": 1200,
   "h": 222,
   "slice": [
    100,
    70,
    100,
    190
   ]
  },
  "result_quest": {
   "file": "ui/ui_result_quest.webp",
   "w": 1200,
   "h": 222,
   "slice": [
    100,
    70,
    100,
    190
   ]
  },
  "itemslot_locked": {
   "file": "ui/ui_itemslot_locked.webp",
   "w": 128,
   "h": 143
  },
  "itemslot_ready": {
   "file": "ui/ui_itemslot_ready.webp",
   "w": 128,
   "h": 140
  },
  "itemslot_used": {
   "file": "ui/ui_itemslot_used.webp",
   "w": 128,
   "h": 139
  },
  "item_card": {
   "file": "ui/ui_item_card.webp",
   "w": 560,
   "h": 364,
   "slice": [
    41,
    55,
    106,
    56
   ]
  },
  "zone_card": {
   "file": "ui/ui_zone_card.webp",
   "w": 560,
   "h": 564,
   "slice": [
    125,
    82,
    97,
    52
   ]
  },
  "bossbar_frame": {
   "file": "ui/ui_bossbar_frame.webp",
   "w": 960,
   "h": 164,
   "slice": [
    45,
    50,
    43,
    50
   ],
   "fill": "#d22a39"
  },
  "button_square": {
   "file": "ui/ui_button_square.webp",
   "w": 128,
   "h": 122,
   "slice": [
    22,
    24,
    24,
    24
   ]
  },
  "banner_gold": {
   "file": "ui/ui_banner_gold.webp",
   "w": 800,
   "h": 300,
   "slice": [
    73,
    175,
    78,
    175
   ]
  },
  "banner_red": {
   "file": "ui/ui_banner_red.webp",
   "w": 800,
   "h": 301,
   "slice": [
    78,
    181,
    85,
    200
   ]
  },
  "button_gold_normal": {
   "file": "ui/ui_button_gold_normal.webp",
   "w": 400,
   "h": 204,
   "slice": [
    46,
    46,
    50,
    46
   ]
  },
  "button_tan_normal": {
   "file": "ui/ui_button_tan_normal.webp",
   "w": 400,
   "h": 201,
   "slice": [
    46,
    46,
    50,
    46
   ]
  },
  "button_red_normal": {
   "file": "ui/ui_button_red_normal.webp",
   "w": 400,
   "h": 204,
   "slice": [
    46,
    46,
    50,
    46
   ]
  },
  "button_gold_pressed": {
   "file": "ui/ui_button_gold_pressed.webp",
   "w": 400,
   "h": 187,
   "slice": [
    46,
    46,
    50,
    46
   ]
  },
  "button_tan_pressed": {
   "file": "ui/ui_button_tan_pressed.webp",
   "w": 400,
   "h": 185,
   "slice": [
    46,
    46,
    50,
    46
   ]
  },
  "button_red_pressed": {
   "file": "ui/ui_button_red_pressed.webp",
   "w": 400,
   "h": 187,
   "slice": [
    46,
    46,
    50,
    46
   ]
  },
  "button_gold_disabled": {
   "file": "ui/ui_button_gold_disabled.webp",
   "w": 400,
   "h": 197,
   "slice": [
    46,
    46,
    50,
    46
   ]
  },
  "button_tan_disabled": {
   "file": "ui/ui_button_tan_disabled.webp",
   "w": 400,
   "h": 200,
   "slice": [
    46,
    46,
    50,
    46
   ]
  },
  "button_red_disabled": {
   "file": "ui/ui_button_red_disabled.webp",
   "w": 400,
   "h": 197,
   "slice": [
    46,
    46,
    50,
    46
   ]
  },
  "heart_full": {
   "file": "ui/ui_heart_full.webp",
   "w": 67,
   "h": 64
  },
  "heart_empty": {
   "file": "ui/ui_heart_empty.webp",
   "w": 67,
   "h": 64
  },
  "flag_white": {
   "file": "ui/ui_flag_white.webp",
   "w": 52,
   "h": 64
  },
  "flag_grey": {
   "file": "ui/ui_flag_grey.webp",
   "w": 52,
   "h": 64
  },
  "icon_lock": {
   "file": "ui/ui_icon_lock.webp",
   "w": 51,
   "h": 64
  },
  "icon_tick": {
   "file": "ui/ui_icon_tick.webp",
   "w": 81,
   "h": 64
  },
  "icon_cross": {
   "file": "ui/ui_icon_cross.webp",
   "w": 66,
   "h": 64
  },
  "icon_info": {
   "file": "ui/ui_icon_info.webp",
   "w": 60,
   "h": 64
  },
  "icon_warning": {
   "file": "ui/ui_icon_warning.webp",
   "w": 68,
   "h": 64
  },
  "icon_chain": {
   "file": "ui/ui_icon_chain.webp",
   "w": 62,
   "h": 64
  },
  "node_locked": {
   "file": "ui/ui_node_locked.webp",
   "w": 127,
   "h": 128
  },
  "node_current": {
   "file": "ui/ui_node_current.webp",
   "w": 96,
   "h": 128
  },
  "node_passed": {
   "file": "ui/ui_node_passed.webp",
   "w": 107,
   "h": 128
  },
  "node_boss_locked": {
   "file": "ui/ui_node_boss_locked.webp",
   "w": 145,
   "h": 128
  },
  "node_alert": {
   "file": "ui/ui_node_alert.webp",
   "w": 108,
   "h": 128
  },
  "key_w_up": {
   "file": "ui/ui_key_w_up.webp",
   "w": 63,
   "h": 64
  },
  "key_a_up": {
   "file": "ui/ui_key_a_up.webp",
   "w": 63,
   "h": 64
  },
  "key_s_up": {
   "file": "ui/ui_key_s_up.webp",
   "w": 63,
   "h": 64
  },
  "key_d_up": {
   "file": "ui/ui_key_d_up.webp",
   "w": 62,
   "h": 64
  },
  "key_w_down": {
   "file": "ui/ui_key_w_down.webp",
   "w": 63,
   "h": 58
  },
  "key_a_down": {
   "file": "ui/ui_key_a_down.webp",
   "w": 63,
   "h": 58
  },
  "key_s_down": {
   "file": "ui/ui_key_s_down.webp",
   "w": 63,
   "h": 58
  },
  "key_d_down": {
   "file": "ui/ui_key_d_down.webp",
   "w": 62,
   "h": 58
  },
  "hourglass_normal": {
   "file": "ui/ui_hourglass_normal.webp",
   "w": 82,
   "h": 128
  },
  "hourglass_overtime": {
   "file": "ui/ui_hourglass_overtime.webp",
   "w": 82,
   "h": 128
  },
  "logo_large": {
   "file": "ui/ui_logo_large.webp",
   "w": 1200,
   "h": 441
  },
  "logo_small": {
   "file": "ui/ui_logo_small.webp",
   "w": 360,
   "h": 132
  },
  "item_charm": {
   "file": "ui/ui_item_charm.webp",
   "w": 71,
   "h": 96
  },
  "item_charm_large": {
   "file": "ui/ui_item_charm_large.webp",
   "w": 143,
   "h": 192
  },
  "item_charm_grey": {
   "file": "ui/ui_item_charm_grey.webp",
   "w": 71,
   "h": 96
  }
 },
 "colors": {
  "bossbarFill": "#d22a39",
  "bossbarLost": "#5a4a44",
  "gold": "#F2B632",
  "outline": "#3A220C",
  "bullet": "#ff3355",
  "bulletCore": "#ffffff"
 }
};
