// 抗菌薬スペクトラム（ホール専用 spectrum）。国試向けの単純化。TODO(review) すべての薬の「ふつう効く菌」の線引き（地域の耐性率で変わる）
import type { SpectrumData } from "../exhibits/spectrum.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const spectrumContent: SpectrumData = {
  stampAt: 4,
  bugs: [
    { id: "mrsa", label: "MRSA" },
    { id: "mssa", label: "MSSA", sub: "メチシリン感受性の黄色ブドウ球菌" },
    { id: "strep", label: "連鎖球菌", sub: "肺炎球菌を含む" },
    { id: "entero", label: "腸球菌", sub: "E. faecalis" },
    { id: "ecoli", label: "大腸菌", sub: "感受性株" },
    { id: "pseudo", label: "緑膿菌" },
    { id: "anaer", label: "腹部の嫌気性菌", sub: "Bacteroides fragilis" },
    { id: "atyp", label: "非定型", sub: "マイコプラズマ・クラミジア・レジオネラ" },
  ],
  drugs: [
    { ...M, id: "pcg", name: "ペニシリンG", klass: "ペニシリン系", covers: ["strep", "entero"], note: "連鎖球菌、梅毒、髄膜炎菌など。ブドウ球菌の多くはペニシリナーゼで分解する。" },
    { ...M, id: "abpc", name: "アンピシリン", klass: "ペニシリン系", covers: ["strep", "entero", "ecoli"], note: "腸球菌とリステリアに効く。大腸菌は耐性が増えている。" },
    { ...M, id: "sam", name: "アンピシリン・スルバクタム", klass: "βラクタマーゼ阻害薬配合", covers: ["mssa", "strep", "entero", "ecoli", "anaer"], note: "誤嚥性肺炎や動物咬傷に。緑膿菌には効かない。" },
    { ...M, id: "tzp", name: "ピペラシリン・タゾバクタム", klass: "βラクタマーゼ阻害薬配合", covers: ["mssa", "strep", "entero", "ecoli", "pseudo", "anaer"], note: "緑膿菌と嫌気性菌まで広くカバー。院内感染の初期治療に。" },
    { ...M, id: "cez", name: "セファゾリン", klass: "セフェム系 第1世代", covers: ["mssa", "strep", "ecoli"], note: "MSSAの第一選択。手術の予防投与にも。" },
    { ...M, id: "ctrx", name: "セフトリアキソン", klass: "セフェム系 第3世代", covers: ["strep", "ecoli"], note: "肺炎球菌、腸内細菌、淋菌、髄膜炎に。腸球菌にはセフェム系は効かない。" },
    { ...M, id: "cfpm", name: "セフェピム", klass: "セフェム系 第4世代", covers: ["mssa", "strep", "ecoli", "pseudo"], note: "緑膿菌にも効く。発熱性好中球減少症に。嫌気性菌には弱い。" },
    { ...M, id: "mepm", name: "メロペネム", klass: "カルバペネム系", covers: ["mssa", "strep", "ecoli", "pseudo", "anaer"], note: "ESBL産生菌にも効く切り札。MRSA・非定型には効かない。乱用は耐性菌を生む。" },
    { ...M, id: "vcm", name: "バンコマイシン", klass: "グリコペプチド系", covers: ["mrsa", "mssa", "strep", "entero"], note: "グラム陽性菌だけ。MRSAの第一選択。トラフ値（またはAUC）を測る。" },
    { ...M, id: "mnz", name: "メトロニダゾール", klass: "ニトロイミダゾール系", covers: ["anaer"], note: "嫌気性菌、C. difficile、アメーバ、トリコモナス。" },
    { ...M, id: "azm", name: "アジスロマイシン", klass: "マクロライド系", covers: ["atyp"], note: "非定型肺炎に。日本の肺炎球菌はマクロライド耐性が多い。" },
    { ...M, id: "lvfx", name: "レボフロキサシン", klass: "ニューキノロン系", covers: ["strep", "ecoli", "pseudo", "atyp"], note: "呼吸器キノロン。結核を隠すので、結核を否定してから。" },
    { ...M, id: "st", name: "ST合剤", klass: "スルファメトキサゾール・トリメトプリム", covers: ["mrsa", "mssa", "ecoli"], note: "ニューモシスチス肺炎の治療と予防にも。高K血症に注意。" },
  ],
};
