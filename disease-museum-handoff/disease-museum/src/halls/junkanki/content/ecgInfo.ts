// 調律と12誘導所見の名前・読むポイント・解説（心電図道場と12誘導読影で共通）。
// TODO(review) すべて未レビュー。心電図検定の出題範囲・用語と照合する
import type { RhythmId, PatternId } from "../ecg/ids";

const M = { review: "draft" as const, sources: [] as string[] };
type Info<T> = { review: "draft"; sources: string[]; id: T; name: string; clue: string; explanation: string };

export const RHYTHMS: Info<RhythmId>[] = [
  { ...M, id: "sinus", name: "正常洞調律", clue: "P波のあとに毎回幅の狭いQRS。RR間隔は一定で、心拍数は60〜100/分。", explanation: "II誘導でP波が上向き、PR間隔一定、1対1で伝導。まずこの形を基準にする。" },
  { ...M, id: "sinusTachy", name: "洞性頻脈", clue: "P波とQRSが1対1のまま、心拍数が100/分を超える。", explanation: "発熱、脱水、貧血、疼痛、甲状腺機能亢進などに反応した頻脈。原因を治療する。" },
  { ...M, id: "sinusBrady", name: "洞性徐脈", clue: "P波とQRSが1対1のまま、心拍数が50/分未満。", explanation: "運動選手や睡眠中にもみられる。症状があれば洞不全症候群などを考える。" },
  { ...M, id: "af", name: "心房細動", clue: "P波がなく、RR間隔がまったく不規則（絶対性不整脈）。基線が細かく揺れる（f波）。", explanation: "最も多い持続性不整脈。心房内に血栓ができやすく、脳塞栓の予防（抗凝固）を考える。" },
  { ...M, id: "pvc", name: "心室期外収縮", clue: "先行するP波のない、早く出る幅の広いQRS。T波はQRSと逆向き。あとに代償性の休止。", explanation: "単発なら多くは治療不要。多発・連発・R on T は注意。" },
  { ...M, id: "pac", name: "心房期外収縮", clue: "予定より早く、形の違うP波（P'）に続く幅の狭いQRS。休止は代償性ではない。", explanation: "洞結節がリセットされるので、前後の間隔の和は2拍分より短い。" },
  { ...M, id: "vf", name: "心室細動", clue: "QRSもT波も区別できない、不規則でばらばらな波だけ。", explanation: "心停止。ただちにCPRと電気ショック（除細動）。" },
  { ...M, id: "asystole", name: "心静止", clue: "ほぼ平らな線。QRSが出ない。", explanation: "心停止。電気ショックの適応はなく、CPRとアドレナリン。誘導の外れや感度も確かめる。" },
  { ...M, id: "afl", name: "心房粗動", clue: "P波のかわりに規則正しいノコギリの歯のような波（F波、約300/分）。QRSは2:1や4:1で規則的。", explanation: "右房を旋回するリエントリー。カテーテルアブレーションの成功率が高い。心拍数150/分の規則的な頻拍を見たら2:1の粗動を疑う。" },
  { ...M, id: "psvt", name: "発作性上室頻拍", clue: "幅の狭いQRSが規則正しく150〜200/分。P波ははっきりしない。", explanation: "房室結節リエントリーなど。迷走神経刺激やアデノシン（ATP）で止まる。" },
  { ...M, id: "vt", name: "心室頻拍", clue: "幅の広いQRSが規則的に速く続く（150〜200/分）。", explanation: "脈がなければ心停止として除細動。脈があっても不安定なら同期下カルディオバージョン。" },
  { ...M, id: "av1", name: "1度房室ブロック", clue: "PR間隔が0.20秒（大きいマス1つ）より長いが一定。脱落はない。", explanation: "多くは経過観察。薬剤（β遮断薬など）の影響も確認する。" },
  { ...M, id: "wenckebach", name: "2度房室ブロック（Wenckebach型）", clue: "PR間隔がだんだん延びて、QRSが1つ抜ける。これをくり返す。", explanation: "房室結節での伝導遅延。多くは良性で、症状がなければ経過観察。" },
  { ...M, id: "mobitz2", name: "2度房室ブロック（MobitzII型）", clue: "PR間隔は一定のまま、突然QRSが抜ける。", explanation: "His束より下の障害が多く、完全房室ブロックに進みやすい。ペースメーカーの適応。" },
  { ...M, id: "av3", name: "3度（完全）房室ブロック", clue: "P波とQRSがそれぞれ一定のリズムでばらばらに出る（房室解離）。QRSは遅く幅広い。", explanation: "心房の興奮が心室にまったく伝わらない。失神（Adams-Stokes発作）の原因。ペースメーカーの適応。" },
  { ...M, id: "sinusArrest", name: "洞停止", clue: "規則的な洞調律の途中で、P波もQRSも出ない長い休止。休止はPP間隔の整数倍ではない。", explanation: "洞不全症候群の一型。長い休止でめまい・失神があればペースメーカー。" },
  { ...M, id: "paced", name: "ペースメーカー調律（心室ペーシング）", clue: "QRSの直前に鋭い細いスパイク。QRSは幅広い。", explanation: "心室をペーシングすると、左脚ブロックに似た幅広いQRSになる。" },
  { ...M, id: "wpw", name: "WPW症候群", clue: "PR間隔が短く（0.12秒未満）、QRSの立ち上がりがなだらか（デルタ波）でQRSが少し広い。", explanation: "副伝導路（Kent束）による早期興奮。房室回帰性頻拍や、心房細動のときの偽性心室頻拍に注意。" },
  { ...M, id: "av2to1", name: "2:1房室ブロック", clue: "P波2つにQRSが1つ。伝導するP波のPR間隔は一定。", explanation: "Wenckebach型かMobitzII型かは、この記録だけでは決められない。QRS幅や長い記録で判断する。" },
  { ...M, id: "junctional", name: "房室接合部調律", clue: "幅の狭いQRSが40〜60/分で規則的。P波は見えないか、QRSのあとに陰性で出る。", explanation: "洞結節が働かないときの補充調律。" },
  { ...M, id: "aivr", name: "促進心室固有調律", clue: "幅の広いQRSが60〜100/分で規則的に続く。心室頻拍ほど速くない。", explanation: "再灌流療法のあとによくみられ、多くは一過性で治療不要。" },
  { ...M, id: "bigeminy", name: "心室期外収縮の2段脈", clue: "正常なQRSと、早く出る幅の広いQRSが交互にくり返す。", explanation: "脈拍を触れると半分に感じることがある。原因（電解質、虚血、薬剤）を調べる。" },
  { ...M, id: "tdp", name: "Torsade de pointes（トルサード・ド・ポアンツ）", clue: "幅の広いQRSの高さが、ねじれるように大きくなったり小さくなったりをくり返す多形性心室頻拍。", explanation: "QT延長が背景。マグネシウムの静注、原因薬剤の中止。脈がなければ除細動。" },
  { ...M, id: "afCavb", name: "心房細動＋完全房室ブロック", clue: "f波があるのに、RR間隔が規則正しく遅い。", explanation: "心房細動なのにRRが整なら、房室伝導が途絶えて補充調律になっている。ジギタリス中毒も考える。" },
  { ...M, id: "aberrant", name: "変行伝導を伴う心房期外収縮", clue: "早く出る形の違うP波のあとに、幅の広い（右脚ブロック型の）QRS。", explanation: "心室期外収縮と間違えやすい。先行するP'波を探すのが決め手。" },
  { ...M, id: "bradyTachy", name: "徐脈頻脈症候群", clue: "速く不規則な心房細動が止まったあと、長い休止があり、遅い洞調律になる。", explanation: "洞不全症候群の一型（Rubenstein III型）。頻脈を抑える薬で休止が悪化するので、ペースメーカーを入れてから薬物治療。" },
];

export const PATTERNS: Info<PatternId>[] = [
  { ...M, id: "normal", name: "正常心電図", clue: "洞調律、電気軸は正常、QRS・ST・T に異常なし。", explanation: "基準の形。胸部誘導でR波がV1からV5へ高くなっていく（R波の増高）。" },
  { ...M, id: "afNormal", name: "心房細動（12誘導）", clue: "どの誘導にもP波がなく、RR間隔が不規則。", explanation: "12誘導でも、P波の有無とRRの規則性で判断する。" },
  { ...M, id: "antMI", name: "急性前壁中隔梗塞", clue: "V1〜V4でST上昇。下壁誘導に軽いST低下。", explanation: "左前下行枝の閉塞。緊急の再灌流療法（PCI）。" },
  { ...M, id: "extAntMI", name: "急性広範前壁梗塞", clue: "V1〜V6とI・aVLでST上昇。下壁誘導に鏡像のST低下。", explanation: "左前下行枝の近位部の閉塞。広い範囲の心筋が危険にさらされている。" },
  { ...M, id: "infMI", name: "急性下壁梗塞", clue: "II・III・aVFでST上昇、I・aVLに鏡像のST低下。", explanation: "多くは右冠動脈の閉塞。右室梗塞（V4RのST上昇）と房室ブロックの合併に注意。" },
  { ...M, id: "latMI", name: "急性側壁梗塞", clue: "I・aVL・V5・V6でST上昇。下壁誘導に鏡像のST低下。", explanation: "左回旋枝や対角枝の閉塞。" },
  { ...M, id: "postMI", name: "急性後壁梗塞", clue: "V1〜V3でST低下と高いR波（前壁の鏡像）。ST上昇は通常誘導には出ない。", explanation: "背中側の誘導（V7〜V9）でST上昇を確かめる。左回旋枝や右冠動脈の閉塞。" },
  { ...M, id: "pericarditis", name: "急性心膜炎", clue: "冠動脈の支配に関係なく、広い誘導で下に凸のST上昇。aVRではST低下。鏡像変化がない。", explanation: "PR部分の低下もヒント。心筋梗塞と区別する。" },
  { ...M, id: "rbbb", name: "完全右脚ブロック", clue: "QRS幅0.12秒以上。V1でrsR'型（M字）、I・V6で幅の広いS波。", explanation: "健常者にもみられる。新たに出た場合は肺塞栓などの右心負荷も考える。" },
  { ...M, id: "lbbb", name: "完全左脚ブロック", clue: "QRS幅0.12秒以上。V1で深いQS（rS）、V6で幅の広い上向きのR（q波なし）。STとTはQRSと逆向き。", explanation: "器質的心疾患を伴うことが多い。新たな左脚ブロックは急性心筋梗塞の可能性も。" },
  { ...M, id: "lvh", name: "左室肥大", clue: "V1のS波＋V5のR波が3.5mV以上。V5・V6でST低下と陰性T（ストレイン型）。", explanation: "高血圧、大動脈弁狭窄、肥大型心筋症など。" },
  { ...M, id: "rvh", name: "右室肥大", clue: "右軸偏位、V1で高いR波、V1〜V2で陰性T、V5・V6で深いS波。", explanation: "肺高血圧、肺動脈弁狭窄、先天性心疾患など。" },
  { ...M, id: "wpw", name: "WPW症候群（12誘導）", clue: "短いPR、デルタ波、幅の広いQRS。", explanation: "副伝導路の場所はデルタ波の向きから推定できる。" },
  { ...M, id: "hyperK", name: "高カリウム血症", clue: "高く先のとがった左右対称のT波（テント状T）。P波は小さい。", explanation: "さらに進むとP波の消失、QRS幅の拡大、サインカーブ様、心停止。カルシウム製剤で心筋を守る。" },
  { ...M, id: "hypoK", name: "低カリウム血症", clue: "T波が平低化し、U波がはっきりする。STは下降。", explanation: "QT（QU）が長く見え、不整脈の原因になる。" },
  { ...M, id: "longQT", name: "QT延長", clue: "T波の終わりが遠く、QT間隔がRR間隔の半分を超える（補正QTの延長）。", explanation: "先天性、薬剤性（抗不整脈薬、抗菌薬、向精神薬など）、低K・低Mg。Torsade de pointesの原因。" },
  { ...M, id: "brugada", name: "Brugada症候群（coved型）", clue: "V1・V2で、Jから下がっていく弓状（coved型）のST上昇と陰性T。", explanation: "若年〜中年男性の夜間の突然死の原因。失神歴があればICDを考える。" },
  { ...M, id: "hypothermia", name: "低体温", clue: "QRSの終わりにこぶ（J波、Osborn波）。徐脈、QT延長。", explanation: "復温しながら、心室細動に注意して丁寧に扱う。" },
  { ...M, id: "pe", name: "急性肺血栓塞栓症", clue: "洞性頻脈、IでS波、IIIでQ波と陰性T（SIQIIITIII）、V1〜V3の陰性T。", explanation: "SIQIIITIIIは有名だが出現率は高くない。頻脈と右心負荷の所見を組み合わせて考える。" },
];
