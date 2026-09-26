# データ型

エンジンが読むホールのデータの形。実装時はzodスキーマとして `src/engine/schema.ts` に置き、ここと食い違わないようにする。下は意図を伝えるためのTypeScript表記。

## 共通

```ts
type Review = "draft" | "reviewed";

interface Meta {
  review: Review;          // 新規作成時は必ず "draft"
  sources: string[];       // 例: ["TG18", "急性膵炎重症度判定基準(厚労省2008)"]
  note?: string;           // レビュー時のメモ
}

interface ReviewItem {     // 収蔵庫に送る形
  id: string;              // 同じ問題は同じid
  src: string;             // 展示名
  q: string;
  opts: string[];          // 2〜4個
  ans: string;             // opts のどれか
}
```

## ホール

```ts
interface Hall {
  id: string;              // "kantansui"（halls/<id>/ と src/halls/<id>/ のフォルダ名と同じ）
  no: number;              // 館内番号（肝胆膵=3）
  title: string;           // "肝胆膵ホール"
  headingParts?: string[]; // 入口の大見出しで跳ねる文字。既定は title から「ホール」を除いた1文字ずつ
  version?: string;        // "ver.2"
  catch: string;           // 入口の一文
  ticketNote: string;      // 入館券の下の小さな一文
  footerNote?: string;     // フッターの注記
  map: MapSpec;            // 館内図（臓器キャラのSVGとリンク先）
  wings: Wing[];
  gacha: GachaSpec;
  stampOrder: string[];    // スタンプを並べる順（exhibit.id）
}

interface Wing {
  id: string;              // "w-liver"
  label: string;           // "肝ウィング"
  color: string;           // デザイントークン名（"liver"）か #hex
  labelText?: "dark" | "light"; // ラベルの文字色。既定は dark
  headline: string;        // "黄色くなる、つまる、ふえる"
  side?: string;           // 見出し右の一言。既定は「展示 n点」
  exhibits: Exhibit[];     // 0個でもよい（ガチャだけのウィング）
}

interface MapSpec {
  viewBox: string;         // "0 0 600 420"
  ariaLabel: string;
  hint: string;            // 図の下の一文
  organs: {                // 描く順＝重なり順
    go: string;            // 移動先の wing.id
    label: string;         // aria-label（"肝ウィングへ"）
    svg: string;           // 臓器キャラのSVG断片。目は class="eye" でまばたきする
  }[];
}

interface ExhibitBase {
  id: string;              // "lab"。スタンプのキーにもなる
  no: number;              // 展示番号
  title: string;
  how: string;             // 遊び方の一文
  stampLabel: string;      // スタンプに刻む短い名前
  cheatSheet?: { title: string; html: string } & Meta;  // カンペ
}

type Exhibit =
  | (ExhibitBase & { type: "DiagnosisLab"; data: DiagnosisLabData })
  | (ExhibitBase & { type: "PathoSim"; data: PathoSimData })
  | (ExhibitBase & { type: "DecodePuzzle"; data: DecodePuzzleData })
  | (ExhibitBase & { type: "AlgorithmBoard"; data: AlgorithmBoardData })
  | (ExhibitBase & { type: "EmergencySim"; data: EmergencySimData })
  | (ExhibitBase & { type: "ScoreAttack"; data: ScoreAttackData })
  | (ExhibitBase & { type: "VersusQuiz"; data: VersusQuizData })
  | (ExhibitBase & { type: "MemoryMatch"; data: MemoryMatchData })
  | (ExhibitBase & { type: "BodyHotspot"; data: BodyHotspotData })
  | (ExhibitBase & { type: "Custom"; kind: string; data: unknown });  // ホール専用のゲーム。data は src/halls/<hall>/exhibits/<kind>.schema.ts で検証
```

## 型ごとのデータ

報酬のコイン数など SPEC.md に書いてある型共通の数値は、型のモジュールに定数で持つ（ホールごとには変えない）。ホールごとに変わりうる数値（スタンプ条件など）はデータに持つ。

### DiagnosisLab

```ts
interface DiagnosisLabData {
  budget: number;                                   // 7
  stampAt: number;                                  // 通算この人数を正解でスタンプ（4）
  tests: { id: string; name: string; cost: number }[];
  diagnoses: { name: string; short: string }[];     // short は確率バーの見出し
  cases: (Meta & {
    who: string;                                    // "56歳 女性"
    vignette: string;
    faceColor?: string;
    answer: number;                                 // diagnoses の添字
    results: Record<string, { text: string; abnormal: boolean }>;  // tests.id ごと（全検査ぶん必須）
    explanation: string;
    flow: {
      prior: number[];                              // diagnoses と同じ長さ。合計は自動で100に正規化
      priorWhy: string;
      steps: { test: string; finding: string; why: string; probs: number[] }[];
      note: string;
    };
  })[];
}
```

例（1症例ぶん、試作から抜粋）：

```ts
{
  review: "draft", sources: [],
  who: "56歳 女性",
  vignette: "脂っこい食事のあと右季肋部痛。その後、発熱と黄疸。",
  answer: 4,
  results: {
    bil: { text: "T-Bil 4.8（直接 3.6）直接優位", abnormal: true },
    us:  { text: "総胆管拡張、内部に音響陰影を伴う高エコー", abnormal: true },
    // …7検査すべて
  },
  explanation: "直接優位＋胆道系酵素↑＋胆管拡張＝閉塞性黄疸。…",
  flow: {
    prior: [2, 2, 3, 15, 55, 23],
    priorWhy: "食後の右季肋部痛→発熱・黄疸。胆石と胆管炎を疑う。",
    steps: [
      { test: "bil", finding: "直接優位", why: "間接型の病態を否定。", probs: [0, 5, 0, 17, 55, 23] },
      // …
    ],
    note: "CA19-9は胆管炎でも上がるので、ここで追加すると膵癌と迷わされる。"
  }
}
```

### PathoSim

```ts
interface PathoSimData {
  slider: {
    label: string; unit: string; min: number; max: number; step: number; initial: number;
    gauge?: string[];                   // スライダーの下の目盛りの字
    bonus?: { at: number; coins: number };  // 初めてここまで上げたらコイン（門脈は 14 で 10）
  };
  svg: string;                          // 図。可変部分に id を付ける
  thresholds: {                         // at の小さい順
    at: number;                         // 値が at 以上のうち一番大きい at の text を出す
    show?: string[];                    // at 以上で表示（opacity 1）、未満で非表示にする要素の id
    text: string;                       // 説明文（html 可）
  }[];
  missions: (Meta & {
    text: string; answer: number; alt?: number[];   // alt も正解
    altNote?: string;                   // alt で正解したときの一言（「内服ならβ遮断薬」）
    explanation: string;
  })[];
  tools: string[];                      // 治療の選択肢
}
```

図の変化（脾臓の拡大、うっすら現れる側副路、血流アニメの速度など）は、型の共通処理でまかなえない分を `src/halls/<hall>/hooks.ts` にホール固有の関数として書く（`exhibit.id → (図の要素, 値) => void`）。

### DecodePuzzle

```ts
interface DecodePuzzleData {
  modeLabels?: [string, string];                     // ["解読モード", "ランプを点けろ"]
  question?: string;                                 // 既定「この人は？」
  markers: string[];                                 // 解読モードのランプ名
  states: (Meta & { name: string; pattern: (0 | 1)[]; labelOverride?: Record<number, string>; explanation: string })[];
  reverse?: Meta & {                                 // 逆モード
    markers: string[];
    targets: { name: string; pattern: (0 | 1)[] }[];
    lesson: string;
  };
  roundSize: number;                                 // 6
  passScore: number;                                 // 5
}
```

### AlgorithmBoard

```ts
interface AlgorithmBoardData {
  stampAt: number;                                   // 通算この人数ゴールでスタンプ（4）
  nodes: { id: string; label: string; question: string; options: { value: string; label: string }[] }[];
  goalLabel: string;                                 // "治療"（ゴールのマスはエンジンが最後に足す。"goal" は予約語）
  treatments: string[];
  // 患者ごとに、各ノードの正しい値と通る順番を持つ
  patients: (Meta & {
    card: Record<string, string>;                    // 患者カードに出す項目
    path: string[];                                  // 通るノードの id（最後は "goal"）
    answers: Record<string, string>;                 // node.id → 正しい value（path の全ノードぶん）
    treatments: number[];                            // 正解の treatments 添字（複数可）
    explanation: string;
  })[];
}
```

試作では通る順番を関数で計算していたが、データに `path` を明示する形に変えた（レビューしやすくするため）。

### EmergencySim

```ts
interface EmergencySimData {
  condition: string;                                 // "急性胆管炎"（収蔵庫の問題文に使う）
  gradeQuestion: string;                             // "重症度は？（TG18）"
  stampAt: number;                                   // 通算この人数成功でスタンプ（3）
  gradeLabels: string[];                             // ["軽症 Grade I", …]。最後が最重症（モニターが赤）
  orders: { name: string; kind: "core" | "severe" | "wrong" }[];
  timingLabel: string;                               // "胆道ドレナージのタイミング"
  timings: string[];
  patients: (Meta & {
    who: string; complaint: string; labs: string;
    vitals: { BP: string; HR: number; SpO2: number; T: number; 意識: string };
    vitalsAfter: EmergencySimData["patients"][number]["vitals"];
    grade: number;                                   // gradeLabels の添字
    requiredOrders: string[];                        // orders の name
    timing: number;                                  // timings の添字
    explanation: string;
  })[];
  penaltyMinutes: number;                            // 30
  normalRanges: { SBP: [number, number]; HR: [number, number]; SpO2: [number, number]; T: [number, number] };  // この外の値だけモニターで点滅（演出用のイメージ値）
}
```

### ScoreAttack

```ts
interface ScoreAttackData {
  modeLabels?: [string, string];                     // 画像種目があるときのタブ名
  scoreName: string;                                 // "予後因子"
  instructions: string;                              // "陽性の予後因子をタップ → 重症度を判定"
  timeLimitSec: number;                              // 45
  stampAt: number;                                   // 種目ごとにこの回数正解でスタンプ（2）
  items: {                                           // 1項目＝1タイル。値は毎回生成
    name: string;
    positive: { gen: GenSpec; display: string };     // 陽性になる値の作り方
    negative: { gen: GenSpec; display: string };
    compound?: "SIRS";                               // SIRS：gen は満たす項目の数、display は {t} {hr} {rr} {wbc}
  }[];
  positiveRate: number;                              // 各項目が陽性になる確率（0.34）
  severeAt: number;                                  // 3点以上で重症
  explanation: string;
  missQuestion: { q: string; opts: string[]; ans: string };  // まちがえたとき収蔵庫に送る問題
  imageMode?: Meta & {                               // 画像スコア種目
    kind: "PancCT";                                  // 図の描き方（エンジンが持つ）
    prompt: string;
    extent: { label: string; options: [string, string, string] };  // 0〜2点
    poor: { label: string; options: [string, string, string] };    // 0〜2点
    explanation: string;                             // html 可
    missQuestion: { q: string; opts: string[]; ans: string };
  };
}
type GenSpec = { min: number; max: number; digits: number };
// display は "{v} mg/dL" のようなテンプレート
```

### VersusQuiz

```ts
interface VersusQuizData {
  matches: (Meta & {
    id: string; title: string;
    a: { name: string; color: string; traits: string[] };   // color はトークン名か #hex
    b: { name: string; color: string; traits: string[] };
    clues: { text: string; side: "a" | "b" }[];      // 6個
  })[];
  passScore: number;                                 // 5
}
```

### MemoryMatch

```ts
interface MemoryMatchData { pairs: (Meta & { marker: string; disease: string })[]; bonusMoves: number }
```

### BodyHotspot（型の実装は、使うホールができたときに作る）

```ts
interface BodyHotspotData { svg: string; spots: (Meta & { id: string; x: number; y: number; name: string; text: string })[] }
```

## Gacha

```ts
interface GachaSpec {
  wing?: string;             // このウィングの中に置く（肝胆膵は "w-gb"）。なければウィングの後ろに単独で置く
  title: string;             // "胆石ガチャ"
  machineLabel: string;      // マシンの胴の字 "胆石"
  intro: string;             // 回す前の景品欄の一文
  domeColors?: string[];     // ドームの玉5つの色。既定は景品の色
  cost: number;              // 30
  dupRefund: number;         // 10
  pityAfterDups: number;     // 4
  items: (Meta & { id: string; name: string; rarity: 1 | 2 | 3 | 4; weight: number; color: string; text: string })[];
}
```

遊び方の説明文（「1回30コイン…9種そろえると図鑑コンプリート」）は数値から自動で作る。

## 検証（`npm run check`）

型に加えて次を確かめる：展示・ウィング・景品の id の重複、`stampOrder` と展示の過不足、館内図とガチャの行き先の wing が存在すること、型ごとの添字や id の参照（answer が選択肢の範囲内か、path のノードが存在し答えが選択肢にあるか、pattern の長さが markers と同じか、など）、`src/halls/registry.ts`（館の入口の一覧）と data.ts が一致すること。ガチャはコンプリートまでの回数をシミュレーションして表示する。

## ホール専用のゲーム

`src/halls/<hall>/exhibits/<kind>.schema.ts` に zod で書く（`Meta` は `src/engine/schema.ts` から使う）。ブラウザ側のモジュールは schema から**型だけ**を import する。定数が要るときは `<kind>.consts.ts` に分ける（schema から値を import すると zod がバンドルに入る。`npm run build:single` が検出して失敗する）。

## 保存（localStorage）

- 館全体 `diseaseMuseum.museum.v3`：`{ coins, xp }`（ランクは XP から決まる）
- ホールごと `diseaseMuseum.hall.<id>.v3`：`{ stamps, gacha, dry, free, review, prog }`
- 試作の `diseaseMuseum.hall03.v2` は引き継がない。
