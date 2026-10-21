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
  { id: "seishin", no: 13, title: "精神ホール", catch: "x", stamps: 8 },
  { id: "shoni", no: 12, title: "小児ホール", catch: "x", stamps: 8 },
  { id: "sanfujinka", no: 11, title: "産科・婦人科ホール", catch: "x", stamps: 8 },
  { id: "kansen", no: 10, title: "感染症ホール", catch: "x", stamps: 8 },
  { id: "meneki", no: 9, title: "免疫・膠原病ホール", catch: "x", stamps: 8 },
  { id: "shinkei", no: 8, title: "神経ホール", catch: "x", stamps: 8 },
  { id: "ketsueki", no: 7, title: "血液ホール", catch: "x", stamps: 8 },
  { id: "naibunpi", no: 6, title: "内分泌・代謝ホール", catch: "x", stamps: 8 },
  { id: "jinzo", no: 5, title: "腎・泌尿器ホール", catch: "尿を見て、ネフロンをたどって、塩と水をあやつる。", stamps: 8 },
  { id: "kokyuki", no: 4, title: "呼吸器ホール", catch: "聴いて、測って、読み解いて、息を取り戻す。", stamps: 8 },
  { id: "junkanki", no: 1, title: "循環器ホール", catch: "波を読んで、音を聴いて、止まった心臓を動かす。", stamps: 8 },
  { id: "shokakan", no: 2, title: "消化管ホール", catch: "のぞいて、見つけて、切って、ときどき早押し。", stamps: 8 },
  { id: "kantansui", no: 3, title: "肝胆膵ホール", catch: "診断して、治療して、ときどきガチャを回す。", stamps: 8 },
];

// 準備中のホール。オーナーの了承を得て作り始めたら HALLS に移す
export const PLANNED: { title: string }[] = [];
