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
  { id: "junkanki", no: 1, title: "循環器ホール", catch: "波を読んで、音を聴いて、止まった心臓を動かす。", stamps: 8 },
  { id: "shokakan", no: 2, title: "消化管ホール", catch: "のぞいて、見つけて、切って、ときどき早押し。", stamps: 8 },
  { id: "kantansui", no: 3, title: "肝胆膵ホール", catch: "診断して、治療して、ときどきガチャを回す。", stamps: 8 },
];

// 準備中のホール。オーナーの了承を得て作り始めたら HALLS に移す
export const PLANNED: { title: string }[] = [];
