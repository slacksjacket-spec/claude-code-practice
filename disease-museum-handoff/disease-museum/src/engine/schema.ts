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

const Probs = z.array(z.number().nonnegative());

export const DiagnosisLabData = z.object({
  budget: z.number().int().positive(),
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
  })),
});

export const PathoSimData = z.object({
  slider: z.object({ label: z.string(), unit: z.string(), min: z.number(), max: z.number(), step: z.number(), initial: z.number() }),
  svg: z.string(),
  thresholds: z.array(z.object({ at: z.number(), show: z.array(z.string()).optional(), text: z.string() })),
  missions: z.array(Meta.extend({ text: z.string(), answer: z.number().int(), alt: z.array(z.number().int()).optional(), explanation: z.string() })),
  tools: z.array(z.string()),
});

const Pattern = z.array(z.union([z.literal(0), z.literal(1)]));
export const DecodePuzzleData = z.object({
  markers: z.array(z.string()),
  states: z.array(Meta.extend({
    name: z.string(),
    pattern: Pattern,
    labelOverride: z.record(z.string(), z.string()).optional(),
    explanation: z.string(),
  })),
  reverse: z.object({
    markers: z.array(z.string()),
    targets: z.array(z.object({ name: z.string(), pattern: Pattern })),
    lesson: z.string(),
  }).optional(),
  roundSize: z.number().int().positive(),
  passScore: z.number().int().positive(),
});

export const AlgorithmBoardData = z.object({
  nodes: z.array(z.object({
    id: z.string(),
    label: z.string(),
    question: z.string(),
    options: z.array(z.object({ value: z.string(), label: z.string() })),
  })),
  goalLabel: z.string(),
  treatments: z.array(z.string()),
  patients: z.array(Meta.extend({
    card: z.record(z.string(), z.string()),
    path: z.array(z.string()),
    answers: z.record(z.string(), z.string()),
    treatments: z.array(z.number().int()).min(1),
    explanation: z.string(),
  })),
});

const Vitals = z.object({ BP: z.string(), HR: z.number(), SpO2: z.number(), T: z.number(), 意識: z.string() });
export const EmergencySimData = z.object({
  gradeLabels: z.array(z.string()),
  orders: z.array(z.object({ name: z.string(), kind: z.enum(["core", "severe", "wrong"]) })),
  timingLabel: z.string(),
  timings: z.array(z.string()),
  patients: z.array(Meta.extend({
    who: z.string(),
    complaint: z.string(),
    labs: z.string(),
    vitals: Vitals,
    vitalsAfter: Vitals,
    grade: z.number().int().nonnegative(),
    requiredOrders: z.array(z.string()),
    timing: z.number().int().nonnegative(),
    explanation: z.string(),
  })),
  penaltyMinutes: z.number().int().positive(),
});

const GenSpec = z.object({ min: z.number(), max: z.number(), digits: z.number().int().nonnegative() });
export const ScoreAttackData = z.object({
  timeLimitSec: z.number().positive(),
  items: z.array(z.object({
    name: z.string(),
    positive: z.object({ gen: GenSpec, display: z.string() }),
    negative: z.object({ gen: GenSpec, display: z.string() }),
    compound: z.literal("SIRS").optional(),
  })),
  positiveRate: z.number().min(0).max(1),
  severeAt: z.number().int().positive(),
  imageMode: z.object({ kind: z.literal("PancCT") }).optional(),
  explanation: z.string(),
});

const Fighter = z.object({ name: z.string(), color: Color, traits: z.array(z.string()) });
export const VersusQuizData = z.object({
  matches: z.array(Meta.extend({
    id: z.string(),
    title: z.string(),
    a: Fighter,
    b: Fighter,
    clues: z.array(z.object({ text: z.string(), side: z.enum(["a", "b"]) })),
  })),
  passScore: z.number().int().positive(),
});

export const MemoryMatchData = z.object({
  pairs: z.array(Meta.extend({ marker: z.string(), disease: z.string() })),
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
  // Phase 0 の仮置き。展示の型を移植したら消す（Phase 1）。
  ExhibitBase.extend({ type: z.literal("Placeholder"), plannedType: z.enum(EXHIBIT_TYPES) }),
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
export type Wing = z.infer<typeof Wing>;
export type MapSpec = z.infer<typeof MapSpec>;
export type GachaSpec = z.infer<typeof GachaSpec>;
export type Hall = z.infer<typeof Hall>;
