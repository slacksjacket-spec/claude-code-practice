// 順番に並べよ（共通ゲーム order）。TODO(review)
import type { OrderData } from "../../../engine/games/order.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const orderContent: OrderData = {
  stampAt: 3,
  cases: [
    { ...M, id: "healing", prompt: "骨折が治る順に並べよう。", ends: ["先", "後"], items: ["血腫と炎症", "軟らかい仮骨（軟骨）", "硬い仮骨（線維骨）", "リモデリング（層板骨）"],
      explanation: "固定がゆるい・血流が悪い・喫煙などで遅れ、偽関節になる。" },
    { ...M, id: "hip", prompt: "子どもの股関節の病気を、ふつう起こる年齢の順に並べよう。", ends: ["幼い", "年長"], items: ["発育性股関節形成不全（乳児）", "Perthes病（4〜8歳）", "大腿骨頭すべり症（10〜15歳）"],
      explanation: "乳児健診で開排制限、幼児の跛行はPerthes、肥満の思春期男子の膝痛はすべり症も考える。" },
    { ...M, id: "rotator", prompt: "肩関節周囲炎（五十肩）の経過の順は？", ends: ["先", "後"], items: ["痛みが強い時期（炎症期）", "固まって動かない時期（拘縮期）", "少しずつ動くようになる時期（回復期）"],
      explanation: "腱板断裂や石灰沈着性腱板炎との区別が大事。" },
  ],
};
