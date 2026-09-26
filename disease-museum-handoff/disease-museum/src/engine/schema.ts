// ホールのデータ型。docs/DATA_SCHEMA.md と食い違わないようにする。
// 実行時には読み込まない（zod はバンドルに入れない）。検証は scripts/validate.ts が行う。
import { z } from "zod";

/* ================= 共通 ================= */

export const Review = z.enum(["draft", "reviewed"]);

export const Meta = z.object({
  review: Review,
  sources: z.array(z.string()),
  note: z.string().optional(),
});

export const ReviewItem = z.object({
  id: z.string().min(1),
  src: z.string(),
  q: z.string(),
  opts: z.array(z.string()).min(2).max(4),
  ans: z.string(),
}).refine((r) => r.opts.includes(r.ans), { message: "ans は opts のどれか" });

// デザイントークン名（"liver" など）か #hex
export const TOKENS = ["tomato", "sun", "mint", "cobalt", "pink", "bile", "liver", "ink"] as const;
export const Color = z.string().refine((c) => (TOKENS as readonly string[]).includes(c) || /^#[0-9a-fA-F]{3,8}$/.test(c), {
  message: "デザイントークン名か #hex",
});

/* ================= 型ごとのデータ ================= */
// 検証で見つけた食い違いを報告する小道具
type Issue = { addIssue(i: { code: "custom"; message: string; path?: (string | number)[] }): void };
const bad = (ctx: Issue, message: string, path: (string | number)[] = []) => ctx.addIssue({ code: "custom", message, path });
const QA = z.object({ q: z.string(), opts: z.array(z.string()).min(2).max(4), ans: z.string() })
  .refine((r) => r.opts.includes(r.ans), { message: "ans は opts のどれか" });

const Probs = z.array(z.number().nonnegative());

export const DiagnosisLabData = z.object({
  budget: z.number().int().positive(),
  stampAt: z.number().int().positive(),              // 通算この人数を正解でスタンプ
  tests: z.array(z.object({ id: z.string(), name: z.string(), cost: z.number().int().positive() })),
  diagnoses: z.array(z.object({ name: z.string(), short: z.string() })),
  cases: z.array(Meta.extend({
    who: z.string(),
    vignette: z.string(),
    faceColor: z.string().optional(),
    answer: z.number().int().nonnegative(),
    results: z.record(z.string(), z.object({ text: z.string(), abnormal: z.boolean() })),
    explanation: z.string(),
    flow: z.object({
      prior: Probs,
      priorWhy: z.string(),
      steps: z.array(z.object({ test: z.string(), finding: z.string(), why: z.string(), probs: Probs })),
      note: z.string(),
    }),
  })).min(1),
}).superRefine((d, ctx) => {
  const ids = d.tests.map((t) => t.id), n = d.diagnoses.length;
  d.cases.forEach((c, i) => {
    const p = ["cases", i];
    if (c.answer >= n) bad(ctx, "answer が diagnoses の範囲外", [...p, "answer"]);
    for (const id of ids) if (!c.results[id]) bad(ctx, `検査 ${id} の結果がない`, [...p, "results"]);
    for (const id of Object.keys(c.results)) if (!ids.includes(id)) bad(ctx, `存在しない検査 ${id}`, [...p, "results"]);
    if (c.flow.prior.length !== n) bad(ctx, "prior の長さが diagnoses と違う", [...p, "flow", "prior"]);
    c.flow.steps.forEach((s, j) => {
      if (!ids.includes(s.test)) bad(ctx, `存在しない検査 ${s.test}`, [...p, "flow", "steps", j]);
      if (s.probs.length !== n) bad(ctx, "probs の長さが diagnoses と違う", [...p, "flow", "steps", j]);
    });
  });
});

export const PathoSimData = z.object({
  slider: z.object({
    label: z.string(), unit: z.string(), min: z.number(), max: z.number(), step: z.number(), initial: z.number(),
    gauge: z.array(z.string()).optional(),           // スライダーの下の目盛りの字
    bonus: z.object({ at: z.number(), coins: z.number().int().positive() }).optional(), // 初めてここまで上げたらコイン
  }),
  svg: z.string(),
  // 値が at 以上のうち一番大きい at の text を出す。show の id は at 以上で表示、未満で非表示
  thresholds: z.array(z.object({ at: z.number(), show: z.array(z.string()).optional(), text: z.string() })).min(1),
  missions: z.array(Meta.extend({
    text: z.string(), answer: z.number().int(), alt: z.array(z.number().int()).optional(),
    altNote: z.string().optional(),                  // alt で正解したときの一言
    explanation: z.string(),
  })).min(1),
  tools: z.array(z.string()),
}).superRefine((d, ctx) => {
  d.missions.forEach((m, i) => {
    for (const a of [m.answer, ...(m.alt ?? [])]) if (a < 0 || a >= d.tools.length) bad(ctx, "tools の範囲外", ["missions", i]);
  });
  const ats = d.thresholds.map((t) => t.at);
  if (ats.some((a, i) => i && a <= ats[i - 1])) bad(ctx, "thresholds は at の小さい順に", ["thresholds"]);
});

const Pattern = z.array(z.union([z.literal(0), z.literal(1)]));
export const DecodePuzzleData = z.object({
  modeLabels: z.tuple([z.string(), z.string()]).optional(), // ["解読モード", "ランプを点けろ"]
  question: z.string().optional(),                           // 既定「この人は？」
  markers: z.array(z.string()),
  states: z.array(Meta.extend({
    name: z.string(),
    pattern: Pattern,
    labelOverride: z.record(z.string(), z.string()).optional(), // markers の添字 → この状態でだけ使う表示名
    explanation: z.string(),
  })),
  reverse: Meta.extend({
    markers: z.array(z.string()),
    targets: z.array(z.object({ name: z.string(), pattern: Pattern })),
    lesson: z.string(),
  }).optional(),
  roundSize: z.number().int().positive(),
  passScore: z.number().int().positive(),
}).superRefine((d, ctx) => {
  d.states.forEach((s, i) => { if (s.pattern.length !== d.markers.length) bad(ctx, "pattern の長さが markers と違う", ["states", i]); });
  d.reverse?.targets.forEach((t, i) => { if (t.pattern.length !== d.reverse!.markers.length) bad(ctx, "pattern の長さが markers と違う", ["reverse", "targets", i]); });
  if (d.roundSize > d.states.length) bad(ctx, "roundSize が states より多い", ["roundSize"]);
  if (d.passScore > d.roundSize) bad(ctx, "passScore が roundSize より多い", ["passScore"]);
  const names = d.states.map((s) => s.name);
  if (new Set(names).size !== names.length) bad(ctx, "states の name が重複", ["states"]);
});

export const AlgorithmBoardData = z.object({
  stampAt: z.number().int().positive(),              // 通算この人数ゴールでスタンプ
  nodes: z.array(z.object({
    id: z.string(),
    label: z.string(),
    question: z.string(),
    options: z.array(z.object({ value: z.string(), label: z.string() })).min(2),
  })),
  goalLabel: z.string(),
  treatments: z.array(z.string()),
  patients: z.array(Meta.extend({
    card: z.record(z.string(), z.string()),
    path: z.array(z.string()),
    answers: z.record(z.string(), z.string()),
    treatments: z.array(z.number().int()).min(1),
    explanation: z.string(),
  })).min(1),
}).superRefine((d, ctx) => {
  const ids = d.nodes.map((n) => n.id);
  if (ids.includes("goal")) bad(ctx, "goal は予約語（ゴールはエンジンが足す）", ["nodes"]);
  d.patients.forEach((p, i) => {
    const at = ["patients", i];
    if (p.path.at(-1) !== "goal") bad(ctx, "path の最後は goal", [...at, "path"]);
    for (const n of p.path.slice(0, -1)) {
      const node = d.nodes.find((x) => x.id === n);
      if (!node) { bad(ctx, `存在しないノード ${n}`, [...at, "path"]); continue; }
      if (!node.options.some((o) => o.value === p.answers[n])) bad(ctx, `ノード ${n} の答え ${p.answers[n]} が選択肢にない`, [...at, "answers"]);
    }
    for (const t of p.treatments) if (t < 0 || t >= d.treatments.length) bad(ctx, "treatments の範囲外", [...at, "treatments"]);
  });
});

const Vitals = z.object({ BP: z.string(), HR: z.number(), SpO2: z.number(), T: z.number(), 意識: z.string() });
export const EmergencySimData = z.object({
  condition: z.string(),                             // "急性胆管炎"（収蔵庫の問題文に使う）
  gradeQuestion: z.string(),                         // "重症度は？（TG18）"
  stampAt: z.number().int().positive(),              // 通算この人数成功でスタンプ
  gradeLabels: z.array(z.string()),
  orders: z.array(z.object({ name: z.string(), kind: z.enum(["core", "severe", "wrong"]) })),
  timingLabel: z.string(),
  timings: z.array(z.string()),
  patients: z.array(Meta.extend({
    who: z.string(), complaint: z.string(), labs: z.string(),
    vitals: Vitals,
    vitalsAfter: Vitals,
    grade: z.number().int().nonnegative(),
    requiredOrders: z.array(z.string()),
    timing: z.number().int().nonnegative(),
    explanation: z.string(),
  })).min(1),
  penaltyMinutes: z.number().int().positive(),
  // モニターの警告：この範囲の外の値だけ赤く点滅させる（演出用のイメージ値）。意識は「清明」以外で警告
  normalRanges: z.object({
    SBP: z.tuple([z.number(), z.number()]),
    HR: z.tuple([z.number(), z.number()]),
    SpO2: z.tuple([z.number(), z.number()]),
    T: z.tuple([z.number(), z.number()]),
  }),
}).superRefine((d, ctx) => {
  const names = d.orders.map((o) => o.name);
  d.patients.forEach((p, i) => {
    if (p.grade >= d.gradeLabels.length) bad(ctx, "grade が gradeLabels の範囲外", ["patients", i]);
    if (p.timing >= d.timings.length) bad(ctx, "timing が timings の範囲外", ["patients", i]);
    for (const o of p.requiredOrders) if (!names.includes(o)) bad(ctx, `orders にない指示 ${o}`, ["patients", i]);
  });
});

const GenSpec = z.object({ min: z.number(), max: z.number(), digits: z.number().int().nonnegative() });
export const ScoreAttackData = z.object({
  modeLabels: z.tuple([z.string(), z.string()]).optional(), // 画像種目があるときのタブ名
  scoreName: z.string(),                             // "予後因子"
  instructions: z.string(),                          // HUD の一文
  timeLimitSec: z.number().positive(),
  stampAt: z.number().int().positive(),              // 種目ごとにこの回数正解でスタンプ
  items: z.array(z.object({                          // 1項目＝1タイル。値は毎回生成
    name: z.string(),
    positive: z.object({ gen: GenSpec, display: z.string() }),
    negative: z.object({ gen: GenSpec, display: z.string() }),
    // SIRS：gen は満たす項目の数。display は {t} {hr} {rr} {wbc} を埋める
    compound: z.literal("SIRS").optional(),
  })).min(1),
  positiveRate: z.number().min(0).max(1),
  severeAt: z.number().int().positive(),
  explanation: z.string(),
  missQuestion: QA,                                  // まちがえたとき収蔵庫に送る問題
  imageMode: Meta.extend({
    kind: z.literal("PancCT"),
    prompt: z.string(),
    extent: z.object({ label: z.string(), options: z.array(z.string()).length(3) }),
    poor: z.object({ label: z.string(), options: z.array(z.string()).length(3) }),
    explanation: z.string(),
    missQuestion: QA,
  }).optional(),
});

const Fighter = z.object({ name: z.string(), color: Color, traits: z.array(z.string()) });
export const VersusQuizData = z.object({
  matches: z.array(Meta.extend({
    id: z.string(),
    title: z.string(),
    a: Fighter,
    b: Fighter,
    clues: z.array(z.object({ text: z.string(), side: z.enum(["a", "b"]) })),
  })).min(1),
  passScore: z.number().int().positive(),
}).superRefine((d, ctx) => {
  d.matches.forEach((m, i) => { if (m.clues.length < d.passScore) bad(ctx, "clues が passScore より少ない", ["matches", i]); });
});

export const MemoryMatchData = z.object({
  pairs: z.array(Meta.extend({ marker: z.string(), disease: z.string() })).min(2),
  bonusMoves: z.number().int().positive(),
});

export const BodyHotspotData = z.object({
  svg: z.string(),
  spots: z.array(Meta.extend({ id: z.string(), x: z.number(), y: z.number(), name: z.string(), text: z.string() })),
});

/* ================= 展示 ================= */

export const EXHIBIT_TYPES = [
  "DiagnosisLab", "PathoSim", "DecodePuzzle", "AlgorithmBoard", "EmergencySim",
  "ScoreAttack", "VersusQuiz", "MemoryMatch", "BodyHotspot",
] as const;

export const CheatSheet = Meta.extend({ title: z.string(), html: z.string() });

const ExhibitBase = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  no: z.number().int().positive(),
  title: z.string(),
  how: z.string(),
  stampLabel: z.string(),
  cheatSheet: CheatSheet.optional(),
});

export const Exhibit = z.discriminatedUnion("type", [
  ExhibitBase.extend({ type: z.literal("DiagnosisLab"), data: DiagnosisLabData }),
  ExhibitBase.extend({ type: z.literal("PathoSim"), data: PathoSimData }),
  ExhibitBase.extend({ type: z.literal("DecodePuzzle"), data: DecodePuzzleData }),
  ExhibitBase.extend({ type: z.literal("AlgorithmBoard"), data: AlgorithmBoardData }),
  ExhibitBase.extend({ type: z.literal("EmergencySim"), data: EmergencySimData }),
  ExhibitBase.extend({ type: z.literal("ScoreAttack"), data: ScoreAttackData }),
  ExhibitBase.extend({ type: z.literal("VersusQuiz"), data: VersusQuizData }),
  ExhibitBase.extend({ type: z.literal("MemoryMatch"), data: MemoryMatchData }),
  ExhibitBase.extend({ type: z.literal("BodyHotspot"), data: BodyHotspotData }),
  // ホール専用のゲーム。src/halls/<hall>/exhibits/<kind>.ts（描画）と <kind>.schema.ts（データの形）に置く。
  // 別のホールでも使うようになったら、共通の型に格上げする。
  ExhibitBase.extend({ type: z.literal("Custom"), kind: z.string().regex(/^[a-z][a-zA-Z0-9]*$/), data: z.unknown() }),
]);

/* ================= ホール ================= */

export const Wing = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  label: z.string(),
  color: Color,
  labelText: z.enum(["dark", "light"]).optional(), // ラベル文字色。既定は dark
  headline: z.string(),
  side: z.string().optional(),                     // 見出し右の一言。既定は「展示 n点」
  exhibits: z.array(Exhibit),
});

export const MapSpec = z.object({
  viewBox: z.string(),
  ariaLabel: z.string(),
  hint: z.string(),
  organs: z.array(z.object({
    go: z.string(),       // 移動先の wing.id
    label: z.string(),    // aria-label
    svg: z.string(),      // 臓器キャラの SVG 断片（目は class="eye" でまばたき）
  })).min(1),
});

export const GachaSpec = z.object({
  wing: z.string().optional(),     // このウィングの中に置く。なければウィングの後ろに単独で置く
  title: z.string(),               // "胆石ガチャ"
  machineLabel: z.string(),        // マシンの胴に書く字
  intro: z.string(),               // 回す前の景品欄の文
  domeColors: z.array(z.string()).length(5).optional(), // ドームの玉の色。既定は景品の色
  cost: z.number().int().nonnegative(),
  dupRefund: z.number().int().nonnegative(),
  pityAfterDups: z.number().int().positive(),
  items: z.array(Meta.extend({
    id: z.string(),
    name: z.string(),
    rarity: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    weight: z.number().positive(),
    color: z.string(),
    text: z.string(),
  })).min(1),
});

export const Hall = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  no: z.number().int().positive(),
  title: z.string(),
  headingParts: z.array(z.string()).optional(), // 入口の大見出しで跳ねる文字。既定は title から「ホール」を除いた1文字ずつ
  version: z.string().optional(),
  catch: z.string(),
  ticketNote: z.string(),                       // 入館券の下の小さな一文
  footerNote: z.string().optional(),
  map: MapSpec,
  wings: z.array(Wing).min(1),
  gacha: GachaSpec,
  stampOrder: z.array(z.string()).min(1),
}).superRefine((h, ctx) => {
  const exIds = h.wings.flatMap((w) => w.exhibits.map((e) => e.id));
  const wingIds = h.wings.map((w) => w.id);
  const dup = (a: string[]) => a.filter((x, i) => a.indexOf(x) !== i);
  for (const d of dup(exIds)) ctx.addIssue({ code: "custom", message: `展示 id が重複: ${d}` });
  for (const d of dup(wingIds)) ctx.addIssue({ code: "custom", message: `ウィング id が重複: ${d}` });
  for (const id of h.stampOrder) if (!exIds.includes(id)) ctx.addIssue({ code: "custom", message: `stampOrder に存在しない展示: ${id}` });
  for (const id of exIds) if (!h.stampOrder.includes(id)) ctx.addIssue({ code: "custom", message: `stampOrder に入っていない展示: ${id}` });
  for (const o of h.map.organs) if (!wingIds.includes(o.go)) ctx.addIssue({ code: "custom", message: `館内図の移動先が存在しない: ${o.go}` });
  if (h.gacha.wing && !wingIds.includes(h.gacha.wing)) ctx.addIssue({ code: "custom", message: `ガチャの置き場所が存在しない: ${h.gacha.wing}` });
  const itemIds = h.gacha.items.map((i) => i.id);
  for (const d of dup(itemIds)) ctx.addIssue({ code: "custom", message: `ガチャ景品 id が重複: ${d}` });
});

export type Meta = z.infer<typeof Meta>;
export type ReviewItem = z.infer<typeof ReviewItem>;
export type Exhibit = z.infer<typeof Exhibit>;
export type ExhibitType = Exhibit["type"];
export type ExhibitOf<T extends ExhibitType> = Extract<Exhibit, { type: T }>;
export type Wing = z.infer<typeof Wing>;
export type MapSpec = z.infer<typeof MapSpec>;
export type GachaSpec = z.infer<typeof GachaSpec>;
export type Hall = z.infer<typeof Hall>;
