// トリアージ（共通ゲーム triage）。傷病者は架空。TODO(review) START法の基準
import type { TriageData } from "../../../engine/games/triage.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const p = (id: string, desc: string, walks: boolean, breathes: boolean, rr: number, radial: boolean, crt: number, obeys: boolean) => ({ ...M, id, desc, walks, breathes, rr, radial, crt, obeys });

export const triageContent: TriageData = {
  roundSize: 6, passScore: 5, stampAt: 2,
  patients: [
    p("a", "足をひきずりながら、自分で歩いて集合場所へ来た。腕から出血。", true, true, 20, true, 1, true),
    p("b", "倒れて動かない。あごを上げて気道を確保しても息をしていない。", false, false, 0, false, 4, false),
    p("c", "座り込んで立てない。呼吸数 36回/分、苦しそう。", false, true, 36, true, 2, true),
    p("d", "足が折れて歩けない。呼吸数 22回/分、手首の脈は触れ、爪を押すとすぐ赤みが戻る。質問に答えられる。", false, true, 22, true, 1, true),
    p("e", "歩けない。呼吸数 24回/分。手首の脈が触れない。", false, true, 24, false, 3, true),
    p("f", "歩けない。呼吸数 18回/分、脈は触れる。呼びかけに目は開くが、手を握ってと言っても握れない。", false, true, 18, true, 1, false),
    p("g", "腰が痛いが、言われて自分で歩いて移動できた。", true, true, 16, true, 1, true),
    p("h", "歩けない。呼吸数 20回/分、手首の脈は触れるが、爪を押して赤みが戻るまで4秒。", false, true, 20, true, 4, true),
    p("i", "気道を確保したら、息をし始めた。呼吸数 12回/分。手首の脈は触れる。指示には従えない。", false, true, 12, true, 2, false),
    p("j", "腹部を打って歩けない。呼吸数 26回/分、手首の脈は触れ、毛細血管再充満は2秒。名前を言える。", false, true, 26, true, 2, true),
  ],
};
