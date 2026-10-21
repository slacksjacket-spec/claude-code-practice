// 神経ER（共通ゲーム scenario）。症例は架空。TODO(review) 血栓溶解療法の適応時間と血圧、てんかん重積の薬、SAHの対応
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "stroke", title: "急性期脳梗塞", patient: "72歳 男性。1時間前に急に話せなくなり、右手が動かなくなった。",
      steps: [
        { vitals: "BP 172/96  血糖 120  NIHSS 14", situation: "救急車で到着。まずは？", answer: 0,
          options: ["頭部CT（またはMRI）で出血を除外する", "すぐにアスピリンを飲ませる", "降圧薬で血圧を120まで下げる", "髄液検査"],
          explanation: "出血か梗塞かで治療が真逆。まず画像。低血糖の除外も。" },
        { vitals: "CT：出血なし  発症から1時間30分", situation: "出血はない。次は？", answer: 0,
          options: ["禁忌がなければアルテプラーゼ静注（発症4.5時間以内）", "経過観察", "ヘパリンを大量に", "まず降圧して24時間待つ"],
          explanation: "発症4.5時間以内なら血栓溶解療法。血圧は185/110未満にしてから。" },
        { vitals: "CTA：左中大脳動脈の起始部が閉塞", situation: "太い血管が詰まっている。", answer: 0,
          options: ["血管内治療（機械的血栓回収）を追加する", "このまま様子を見る", "開頭手術", "抗血小板薬2剤だけ"],
          explanation: "主幹動脈閉塞では血栓回収が有効。" },
      ] },
    { ...M, id: "se", title: "てんかん重積", patient: "30歳 男性。てんかんで治療中。薬を飲み忘れていた。",
      steps: [
        { vitals: "SpO₂ 90%  血糖 110", situation: "全身のけいれんが5分以上続いている。", answer: 0,
          options: ["気道を確保して酸素、ジアゼパム（またはミダゾラム）を静注", "舌を噛まないように口に物を入れる", "けいれんが止まるまで押さえつける", "脳波の結果を待つ"],
          explanation: "5分続けば重積として治療。まずベンゾジアゼピン。" },
        { vitals: "けいれん持続 20分", situation: "ベンゾジアゼピンでも止まらない。", answer: 0,
          options: ["ホスフェニトインやレベチラセタムなどを静注、だめなら全身麻酔", "もう少し待つ", "抗精神病薬", "ビタミンKの注射"],
          explanation: "第二段階の薬。それでも止まらなければ挿管して全身麻酔。" },
      ] },
    { ...M, id: "sah", title: "くも膜下出血", patient: "50歳 女性。トイレでいきんだ瞬間、これまでで最悪の頭痛。",
      steps: [
        { vitals: "BP 190/100  意識清明  項部硬直あり", situation: "まずは？", answer: 0,
          options: ["鎮痛・鎮静・降圧して再出血を防ぎ、頭部CT", "腰椎穿刺を最初に", "痛み止めで帰宅", "MRIは後日予約"],
          explanation: "再出血は致命的。安静、鎮痛、降圧。CTで出血を確認（見えなければ腰椎穿刺）。" },
        { vitals: "CT：脳底槽に高吸収", situation: "くも膜下出血。CTAで前交通動脈に動脈瘤。", answer: 0,
          options: ["早めに動脈瘤の治療（クリッピングかコイル塞栓）", "1か月待ってから治療", "抗凝固薬を始める", "治療は不要"],
          explanation: "再出血を防ぐため早期に処置。4〜14日後の脳血管攣縮に注意。" },
      ] },
  ],
};
