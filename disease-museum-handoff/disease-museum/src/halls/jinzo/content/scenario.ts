// 腎・泌尿器ER（共通ゲーム scenario）。症例は架空。TODO(review) 高K血症の治療順序と薬の量
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "hyperk", title: "高カリウム血症", patient: "70歳 男性。慢性腎臓病。透析を勧められていた。",
      steps: [
        { vitals: "K 7.2  HR 48  心電図：テント状T波、QRS幅の拡大", situation: "脱力で来院。まず何をする？", answer: 0,
          options: ["グルコン酸カルシウムを静注して心筋を守る", "カリウムを含む輸液をする", "経過観察", "まず腎生検"],
          explanation: "心電図変化がある高K血症は、まずカルシウムで心筋の膜を安定させる（Kは下がらない）。" },
        { vitals: "K 7.1  HR 60", situation: "心電図は少し落ち着いた。次にKを細胞の中へ移したい。", answer: 0,
          options: ["グルコース・インスリン療法（β₂刺激薬の吸入も）", "カルシウムをもう一度", "スピロノラクトン", "ACE阻害薬を増やす"],
          explanation: "インスリンでKを細胞内へ。低血糖を防ぐためブドウ糖と一緒に。" },
        { vitals: "K 6.4", situation: "一時的に下がった。体からKを出すには？", answer: 0,
          options: ["陽イオン交換樹脂やループ利尿薬、効かなければ血液透析", "グルコース・インスリンをくり返すだけ", "カリウムの多い果物を勧める", "何もしない"],
          explanation: "細胞内へ移すのは一時しのぎ。体外へ出す（樹脂、利尿薬、透析）までが治療。" },
      ] },
    { ...M, id: "obstructive", title: "閉塞性腎盂腎炎", patient: "60歳 女性。尿管結石の既往。",
      steps: [
        { vitals: "T 39.5  BP 86/50  HR 120", situation: "右の腰の痛みと高熱。CTで右尿管に結石と水腎症。", answer: 0,
          options: ["血液培養をとり抗菌薬を始め、緊急で尿路を減圧（尿管ステントか腎瘻）", "抗菌薬だけで様子を見る", "体外衝撃波で結石を砕く", "鎮痛薬だけで帰宅"],
          explanation: "閉塞のある尿路感染は抗菌薬だけでは治らず、敗血症性ショックになる。まずドレナージ。結石の治療は落ち着いてから。" },
        { vitals: "T 38.0  BP 108/64", situation: "腎瘻を入れて解熱してきた。結石は？", answer: 0,
          options: ["感染が治ってから、結石の治療（砕石など）を計画する", "すぐに砕石する", "結石は放置でよい", "腎摘出"],
          explanation: "感染が落ち着いてから二期的に治療する。" },
      ] },
    { ...M, id: "retention", title: "急性尿閉", patient: "80歳 男性。前立腺肥大。",
      steps: [
        { vitals: "BP 160/90  下腹部が膨らんで痛い", situation: "かぜ薬を飲んだあと、朝から尿が出ない。", answer: 0,
          options: ["尿道カテーテルで導尿する", "利尿薬を静注する", "水分をたくさん飲ませる", "鎮痛薬だけ"],
          explanation: "抗コリン作用のある薬（総合感冒薬の抗ヒスタミン薬など）が尿閉の引き金に。まず導尿。" },
        { vitals: "導尿 900 mL", situation: "楽になった。今後は？", answer: 0,
          options: ["原因薬を避け、α₁遮断薬などで前立腺肥大を治療する", "毎日導尿だけ続ける", "前立腺癌として放射線治療", "利尿薬を続ける"],
          explanation: "抗コリン薬や抗ヒスタミン薬を避ける。α₁遮断薬、必要なら手術（TURP）。" },
      ] },
  ],
};
