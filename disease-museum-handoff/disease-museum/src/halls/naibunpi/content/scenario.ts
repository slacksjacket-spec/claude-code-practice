// 内分泌ER（共通ゲーム scenario）。症例は架空。TODO(review) DKAの輸液・インスリン・Kの量と順序、副腎クリーゼのヒドロコルチゾール量
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "dka", title: "糖尿病ケトアシドーシス", patient: "19歳 女性。1型糖尿病。胃腸炎で食べられず、インスリンを打たなかった。",
      steps: [
        { vitals: "BP 92/58  HR 124  RR 30  血糖 520  pH 7.08  K 5.4", situation: "腹痛と嘔吐、深く速い呼吸。まず何をする？", answer: 0,
          options: ["生理食塩水で大量に輸液", "すぐに重炭酸ナトリウムを静注", "インスリンを皮下注して帰宅", "Kを急速に静注"],
          explanation: "まずは脱水の補正。重炭酸は原則使わない。" },
        { vitals: "BP 108/64  K 5.0", situation: "輸液で循環は持ち直した。次は？", answer: 0,
          options: ["速効型インスリンを持続静注（Kを見ながら）", "SU薬を内服", "インスリンは不要", "グルカゴンを注射"],
          explanation: "ケトン体を止めるにはインスリン。Kが低いうち（3.3未満が目安）はK補充を先に。" },
        { vitals: "血糖 280  K 3.6", situation: "血糖とKが下がってきた。", answer: 0,
          options: ["輸液にKを加え、血糖が下がったらブドウ糖入りの輸液に変えてインスリンを続ける", "インスリンを止める", "Kは補わない", "生理食塩水だけ続ける"],
          explanation: "インスリンでKは細胞内へ入り低K血症になる。アシドーシスが治るまでインスリンは止めない。" },
      ] },
    { ...M, id: "crisis", title: "副腎クリーゼ", patient: "55歳 男性。リウマチでステロイドを長く内服。手術の日から飲めていない。",
      steps: [
        { vitals: "BP 72/40  HR 118  T 38.2  Na 126  K 5.6  血糖 58", situation: "意識がもうろう。", answer: 0,
          options: ["採血のあと、すぐにヒドロコルチゾールを静注し生理食塩水とブドウ糖を輸液", "ACTH負荷試験の結果を待つ", "昇圧薬だけで様子を見る", "甲状腺ホルモンを静注"],
          explanation: "疑ったら検査結果を待たずにヒドロコルチゾール。ショック、低Na、高K、低血糖。" },
        { vitals: "BP 110/68", situation: "持ち直した。今後の再発予防は？", answer: 0,
          options: ["熱や手術のときはステロイドを増やす（シックデイ）", "ステロイドを急にやめる", "毎日昇圧薬を飲む", "ステロイドは飲み忘れてもよい"],
          explanation: "体のストレスでコルチゾールの必要量が増える。手術前はステロイドカバー。" },
      ] },
    { ...M, id: "hypogly", title: "低血糖", patient: "80歳 女性。糖尿病でSU薬を内服。食事がとれていなかった。",
      steps: [
        { vitals: "GCS E2V2M5  血糖 32", situation: "家族が「様子がおかしい」と連れてきた。口から飲めない。", answer: 0,
          options: ["50%ブドウ糖を静注", "インスリンを追加", "頭部CTの結果を待つ", "オレンジジュースを口に流し込む"],
          explanation: "意識障害を見たらまず血糖。飲めなければブドウ糖を静注（アルコール依存症などではビタミンB₁も）。" },
        { vitals: "血糖 140  意識清明", situation: "意識が戻った。帰宅でいい？", answer: 0,
          options: ["SU薬の低血糖は長引くので、入院して血糖を見続ける", "すぐに帰宅", "SU薬を増やす", "インスリンを始めて帰宅"],
          explanation: "SU薬（特に高齢者・腎機能低下）の低血糖は遷延・再発する。" },
      ] },
  ],
};
