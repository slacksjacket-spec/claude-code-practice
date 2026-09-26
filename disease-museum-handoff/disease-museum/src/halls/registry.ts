// 館の入口に並べるホールの一覧。入口ページがホールのデータを全部読み込まなくて済むように、要点だけここに置く。
// data.ts と食い違うと npm run check が失敗する。
export interface HallEntry {
  id: string;
  no: number;
  title: string;
  catch: string;
  stamps: number;      // スタンプの数（stampOrder の長さ）
}

export const HALLS: HallEntry[] = [
  { id: "kantansui", no: 3, title: "肝胆膵ホール", catch: "診断して、治療して、ときどきガチャを回す。", stamps: 8 },
];

// ROADMAP Phase 2 の予定。オーナーの了承を得て作り始めたら HALLS に移す
export const PLANNED: { title: string }[] = [
  { title: "食道・胃ホール" },
  { title: "腸ホール" },
  { title: "急性腹症ホール" },
];
