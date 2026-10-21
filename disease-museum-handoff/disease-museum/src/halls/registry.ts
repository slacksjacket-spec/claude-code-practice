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
  { id: "koshu", no: 20, title: "公衆衛生ホール", catch: "表とカットオフで、集団の健康を考える。", stamps: 8 },
  { id: "masui", no: 19, title: "麻酔・輸液ホール", catch: "水と塩を計算し、気道を守り、波形で見張る。", stamps: 8 },
  { id: "kyukyu", no: 18, title: "救急・中毒ホール", catch: "見抜いて、色を付けて、命をつなぐ順番を守る。", stamps: 8 },
  { id: "undoki", no: 17, title: "運動器ホール", catch: "しびれの地図で神経を追い、骨の影を読む。", stamps: 8 },
  { id: "jibi", no: 16, title: "耳鼻咽喉ホール", catch: "聞こえを見える形にして、めまいの正体を探る。", stamps: 8 },
  { id: "ganka", no: 15, title: "眼ホール", catch: "のぞいて、照らして、瞳と眼底に聞く。", stamps: 8 },
  { id: "hifu", no: 14, title: "皮膚ホール", catch: "形と色と深さを読んで、皮膚の向こうを見る。", stamps: 8 },
  { id: "seishin", no: 13, title: "精神ホール", catch: "言葉に耳をすまし、体の病気を見逃さない。", stamps: 8 },
  { id: "shoni", no: 12, title: "小児ホール", catch: "曲線と熱型と月齢で、子どもを診る。", stamps: 8 },
  { id: "sanfujinka", no: 11, title: "産科・婦人科ホール", catch: "波形を読み、2つの命を同時に見守る。", stamps: 8 },
  { id: "kansen", no: 10, title: "感染症ホール", catch: "菌を見て、薬を選んで、広げない。", stamps: 8 },
  { id: "meneki", no: 9, title: "免疫・膠原病ホール", catch: "光る核を読み、関節と血管の暴走を止める。", stamps: 8 },
  { id: "shinkei", no: 8, title: "神経ホール", catch: "症状から場所を当てる、局在診断の探偵。", stamps: 8 },
  { id: "ketsueki", no: 7, title: "血液ホール", catch: "血球の形と数字から、一滴の血を読む。", stamps: 8 },
  { id: "naibunpi", no: 6, title: "内分泌・代謝ホール", catch: "上がる？下がる？フィードバックから原因を当てる。", stamps: 8 },
  { id: "jinzo", no: 5, title: "腎・泌尿器ホール", catch: "尿を見て、ネフロンをたどって、塩と水をあやつる。", stamps: 8 },
  { id: "kokyuki", no: 4, title: "呼吸器ホール", catch: "聴いて、測って、読み解いて、息を取り戻す。", stamps: 8 },
  { id: "junkanki", no: 1, title: "循環器ホール", catch: "波を読んで、音を聴いて、止まった心臓を動かす。", stamps: 8 },
  { id: "shokakan", no: 2, title: "消化管ホール", catch: "のぞいて、見つけて、切って、ときどき早押し。", stamps: 8 },
  { id: "kantansui", no: 3, title: "肝胆膵ホール", catch: "診断して、治療して、ときどきガチャを回す。", stamps: 8 },
];

// 準備中のホール。オーナーの了承を得て作り始めたら HALLS に移す
export const PLANNED: { title: string }[] = [];
