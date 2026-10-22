/* CFA Quest — Ethics · 4 kịch bản demo (SOLUTION_STRUCTURE Mục 15.6).
   FILE SINH TỰ ĐỘNG bởi tools/build_scenarios.js từ W6/demo-input.md — không sửa tay.
   Mỗi câu: { id: mã câu, choice: 0/1/2 (A/B/C), timeMs, item: 'eliminate' | null }. */
(typeof window !== 'undefined' ? window : globalThis).CFA_SCENARIOS = [
 {
  "id": "k1",
  "name": "Kịch bản 1 — Chuẩn",
  "proves": "Toàn bộ luồng 5 màn ra đúng kết quả đã tính trước",
  "startCredits": 3,
  "stopAfter": "report",
  "expected": {
   "arena1": {
    "correct": 11,
    "total": 15,
    "passed": true,
    "credits": 5,
    "w1": "C2",
    "points": [
     22,
     30
    ]
   },
   "trap1": {
    "correct": 8,
    "total": 10,
    "passed": true,
    "credits": 8,
    "points": [
     12,
     18
    ]
   },
   "crossroads": {
    "correct": 8,
    "total": 10,
    "passed": true,
    "credits": 11,
    "w2": "C1",
    "points": [
     18,
     21
    ]
   },
   "trap2": {
    "correct": 9,
    "total": 10,
    "passed": true,
    "credits": 15,
    "bossPlan": "C2:7,C1:5,C3:3",
    "points": [
     21,
     22
    ]
   },
   "boss": {
    "correct": 14,
    "total": 15,
    "passed": true,
    "credits": 9,
    "points": [
     34,
     37
    ]
   },
   "report": {
    "performance": 84,
    "o4": {
     "C1": "Đã cải thiện",
     "C2": "Đã cải thiện",
     "C3": "Cần cải thiện tiếp",
     "C4": "Không kiểm tra lại ở Boss",
     "C5": "Không kiểm tra lại ở Boss"
    }
   }
  },
  "rounds": {
   "arena1": [
    {
     "id": "ETH-C1-GIPS-001",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-001",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-009",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-003",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-001",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-002",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-002",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-005",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C4-S4-005",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C4-S5-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C4-S4-003",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C5-S6-002",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C5-S7-001",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C5-S6-004",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    }
   ],
   "trap1": [
    {
     "id": "ETH-C2-S1-006",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-003",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-011",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-002",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-006",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-005",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-007",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-004",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-004",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    }
   ],
   "crossroads": [
    {
     "id": "ETH-C4-S4-001",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C5-S6-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-005",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-010",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-027",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-009",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C4-S5-004",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-002",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C5-S7-002",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-020",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    }
   ],
   "trap2": [
    {
     "id": "ETH-C1-GIPS-011",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-003",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-009",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-014",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-004",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-003",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-002",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-007",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-010",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-004",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    }
   ],
   "boss": [
    {
     "id": "ETH-C2-S1-010",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-013",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-008",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-010",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-014",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-011",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-017",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-006",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-008",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-017",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-011",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-018",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-004",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-009",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-021",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    }
   ]
  }
 },
 {
  "id": "k2",
  "name": "Kịch bản 2 — Lật pass/fail",
  "proves": "Đổi đúng một câu trả lời (Arena 1 câu 15) làm màn đổi từ đỗ sang trượt",
  "startCredits": 3,
  "stopAfter": "arena1",
  "expected": {
   "arena1": {
    "correct": 10,
    "total": 15,
    "passed": false,
    "credits": 3,
    "points": [
     19,
     30
    ]
   }
  },
  "rounds": {
   "arena1": [
    {
     "id": "ETH-C1-GIPS-001",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-001",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-009",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-003",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-001",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-002",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-002",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-005",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C4-S4-005",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C4-S5-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C4-S4-003",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C5-S6-002",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C5-S7-001",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C5-S6-004",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    }
   ]
  }
 },
 {
  "id": "k3",
  "name": "Kịch bản 3 — Hòa điểm",
  "proves": "Hòa tỷ lệ đúng và độ khó câu sai, phân định W1 bằng thời gian trả lời trung bình",
  "startCredits": 3,
  "stopAfter": "arena1",
  "expected": {
   "arena1": {
    "correct": 11,
    "total": 15,
    "passed": true,
    "credits": 5,
    "w1": "C2",
    "w1Step": "thời gian",
    "points": [
     22,
     30
    ]
   }
  },
  "rounds": {
   "arena1": [
    {
     "id": "ETH-C1-GIPS-001",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-009",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-003",
     "choice": 1,
     "timeMs": 45000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-001",
     "choice": 1,
     "timeMs": 45000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-002",
     "choice": 1,
     "timeMs": 45000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-002",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-005",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C4-S4-005",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C4-S5-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C4-S4-003",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C5-S6-002",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C5-S7-001",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C5-S6-004",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    }
   ]
  }
 },
 {
  "id": "k4",
  "name": "Kịch bản 4 — Bật/tắt Bùa",
  "proves": "arena_score_correct và accuracy_cumulative chạy độc lập khi dùng Bùa",
  "startCredits": 3,
  "stopAfter": "report",
  "buy": {
   "before": "crossroads",
   "item": "eliminate",
   "n": 1
  },
  "expected": {
   "arena1": {
    "correct": 11,
    "total": 15,
    "passed": true,
    "credits": 5,
    "w1": "C2",
    "points": [
     22,
     30
    ]
   },
   "trap1": {
    "correct": 8,
    "total": 10,
    "passed": true,
    "credits": 8,
    "points": [
     12,
     18
    ]
   },
   "crossroads": {
    "correct": 8,
    "total": 10,
    "passed": true,
    "credits": 8,
    "w2": "C1",
    "points": [
     15,
     21
    ]
   },
   "trap2": {
    "correct": 9,
    "total": 10,
    "passed": true,
    "credits": 12,
    "bossPlan": "C1:7,C2:5,C3:3",
    "points": [
     21,
     22
    ]
   },
   "quest": {
    "correct": 12,
    "total": 15,
    "credit": 3,
    "credits": 15
   },
   "boss": {
    "correct": 14,
    "total": 15,
    "passed": true,
    "credits": 9,
    "points": [
     34,
     37
    ]
   },
   "report": {
    "performance": 81,
    "o4": {
     "C1": "Đã cải thiện",
     "C2": "Đã cải thiện",
     "C3": "Cần cải thiện tiếp",
     "C4": "Không kiểm tra lại ở Boss",
     "C5": "Không kiểm tra lại ở Boss"
    }
   }
  },
  "rounds": {
   "arena1": [
    {
     "id": "ETH-C1-GIPS-001",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-001",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-009",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-003",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-001",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-002",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-002",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-005",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C4-S4-005",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C4-S5-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C4-S4-003",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C5-S6-002",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C5-S7-001",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C5-S6-004",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    }
   ],
   "trap1": [
    {
     "id": "ETH-C2-S1-006",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-003",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-011",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-002",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-006",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-005",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-007",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-004",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-004",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    }
   ],
   "crossroads": [
    {
     "id": "ETH-C4-S4-001",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C5-S6-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-005",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-010",
     "choice": 2,
     "timeMs": 30000,
     "item": "eliminate"
    },
    {
     "id": "ETH-C3-S3-027",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-009",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C4-S5-004",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-002",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C5-S7-002",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-020",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    }
   ],
   "trap2": [
    {
     "id": "ETH-C1-GIPS-011",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-003",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-009",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-014",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-004",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-003",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-002",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-007",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-010",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-004",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    }
   ],
   "quest": [
    {
     "id": "ETH-C1-GIPS-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-009",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-010",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-011",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-003",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-002",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-006",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-005",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-001",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-002",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-005",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-027",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-020",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    }
   ],
   "boss": [
    {
     "id": "ETH-C1-GIPS-006",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-008",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-017",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-011",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-018",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-GIPS-005",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C1-CODE-014",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-010",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-013",
     "choice": 1,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-010",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S1-014",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C2-S2-011",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-004",
     "choice": 2,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-009",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    },
    {
     "id": "ETH-C3-S3-021",
     "choice": 0,
     "timeMs": 30000,
     "item": null
    }
   ]
  }
 }
];
if (typeof module !== 'undefined' && module.exports) module.exports = globalThis.CFA_SCENARIOS;
