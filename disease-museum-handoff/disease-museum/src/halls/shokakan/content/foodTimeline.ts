// 食中毒の犯人さがし。
// TODO(review) 潜伏期の幅は代表的な値を記憶から書いた（厚生労働省・国立感染症研究所の資料で照合が必要）。症例はすべて架空
import type { FoodTimelineData } from "../exhibits/foodTimeline.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const foodTimelineContent: FoodTimelineData = {
  stampAt: 4,
  organisms: [
    { ...M, id: "staph", name: "黄色ブドウ球菌", windowH: [1, 6], note: "毒素型。激しい嘔吐が主で熱は出にくい。毒素は加熱しても壊れない。手でにぎるおにぎり・弁当。" },
    { ...M, id: "cereus", name: "セレウス菌（嘔吐型）", windowH: [0.5, 6], note: "毒素型。チャーハン・焼きそばなど、米や麺の作り置き。" },
    { ...M, id: "perfringens", name: "ウェルシュ菌", windowH: [6, 18], note: "カレー・シチューなどを大量に作って常温で置いたもの。芽胞が加熱に耐える。下痢が主で軽い。" },
    { ...M, id: "vibrio", name: "腸炎ビブリオ", windowH: [8, 24], note: "好塩性で夏に多い。生の魚介類。強い腹痛と下痢。" },
    { ...M, id: "salmonella", name: "サルモネラ", windowH: [6, 72], note: "鶏卵・食肉。高い熱と下痢。" },
    { ...M, id: "noro", name: "ノロウイルス", windowH: [24, 48], note: "冬に多い。カキなど二枚貝。嘔吐と下痢、人から人へもうつる。" },
    { ...M, id: "campylo", name: "カンピロバクター", windowH: [48, 168], note: "鶏肉の生食・加熱不足。潜伏期が長い。あとでGuillain-Barré症候群を起こすことがある。" },
    { ...M, id: "ehec", name: "腸管出血性大腸菌（O157など）", windowH: [72, 192], note: "牛肉の加熱不足、生野菜。腹痛と血便、熱は高くない。溶血性尿毒症症候群に注意。" },
  ],
  cases: [
    { ...M, id: "c1", story: "会社の同僚3人が、昼食のあと急に激しく吐きはじめた。熱はない。", onset: "月曜 15:00",
      meals: [{ label: "手作りおにぎり", hoursBefore: 3 }, { label: "朝のトースト", hoursBefore: 8 }, { label: "前夜の焼き鳥", hoursBefore: 20 }, { label: "2日前の刺身", hoursBefore: 45 }],
      culprit: 0, organism: "staph", options: ["staph", "noro", "vibrio", "campylo"],
      explanation: "食べて数時間で嘔吐、熱なし、手でにぎったおにぎり。黄色ブドウ球菌の毒素による食中毒。" },
    { ...M, id: "c2", story: "38℃台の発熱と下痢が続き、便に少し血が混じる。", onset: "日曜 8:00",
      meals: [{ label: "前夜のカレー", hoursBefore: 12 }, { label: "2日前の寿司", hoursBefore: 36 }, { label: "鶏レバーの刺身", hoursBefore: 96 }, { label: "6日前の焼き魚定食", hoursBefore: 144 }],
      culprit: 2, organism: "campylo", options: ["campylo", "salmonella", "ehec", "perfringens"],
      explanation: "数日前の鶏の生食。潜伏期が2〜7日と長いのがカンピロバクター。" },
    { ...M, id: "c3", story: "8月。夜になって急に強い腹痛と水のような下痢。", onset: "土曜 22:00",
      meals: [{ label: "夕食のラーメン", hoursBefore: 2 }, { label: "昼の海鮮丼", hoursBefore: 10 }, { label: "前日の唐揚げ", hoursBefore: 28 }],
      culprit: 1, organism: "vibrio", options: ["vibrio", "staph", "noro", "campylo"],
      explanation: "夏、生の魚介を食べて半日ほどで強い腹痛と下痢。腸炎ビブリオ。" },
    { ...M, id: "c4", story: "1月。家族4人が次々に吐いて下痢をした。", onset: "火曜 6:00",
      meals: [{ label: "当日朝のパン", hoursBefore: 1 }, { label: "前夜の鍋", hoursBefore: 11 }, { label: "生ガキ", hoursBefore: 36 }, { label: "5日前の焼肉", hoursBefore: 110 }],
      culprit: 2, organism: "noro", options: ["noro", "vibrio", "campylo", "staph"],
      explanation: "冬、生ガキから1〜2日で嘔吐と下痢、家族にも広がる。ノロウイルス。" },
    { ...M, id: "c5", story: "激しい腹痛と水様の下痢が、やがて真っ赤な血便に。熱は37℃台。", onset: "木曜 10:00",
      meals: [{ label: "前日の刺身", hoursBefore: 20 }, { label: "3日前のサラダ（加熱済みの野菜）", hoursBefore: 70 }, { label: "BBQの生焼けハンバーグ", hoursBefore: 120 }],
      culprit: 2, organism: "ehec", options: ["ehec", "campylo", "salmonella", "vibrio"],
      explanation: "牛ひき肉の加熱不足から数日、血便と腹痛で熱は高くない。腸管出血性大腸菌。数日後の溶血性尿毒症症候群（貧血・血小板減少・腎不全）に注意。" },
    { ...M, id: "c6", story: "学校行事のあと、夜に生徒が何人も下痢。吐き気は軽い。", onset: "金曜 22:00",
      meals: [{ label: "昼の大鍋カレー（前日に作り置き）", hoursBefore: 10 }, { label: "朝のおにぎり", hoursBefore: 14 }, { label: "前日のサンドイッチ", hoursBefore: 30 }],
      culprit: 0, organism: "perfringens", options: ["perfringens", "staph", "cereus", "noro"],
      explanation: "大量に作って置いておいたカレー。芽胞が加熱に耐えて冷める間に増える。ウェルシュ菌。" },
    { ...M, id: "c7", story: "朝から39℃の熱と、何度も下痢。", onset: "水曜 7:00",
      meals: [{ label: "前夜の焼き魚", hoursBefore: 12 }, { label: "手作りティラミス（生卵）", hoursBefore: 20 }, { label: "3日前の焼きそば", hoursBefore: 70 }],
      culprit: 1, organism: "salmonella", options: ["salmonella", "campylo", "vibrio", "staph"],
      explanation: "生卵を使ったお菓子から約1日で高熱と下痢。サルモネラ。" },
  ],
};
