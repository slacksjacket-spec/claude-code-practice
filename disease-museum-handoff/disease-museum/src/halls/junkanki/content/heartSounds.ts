// 心音オーケストラ。音と心音図は合成した模式。TODO(review) 聴取部位・放散・所見の説明
import type { HeartSoundsData } from "../exhibits/heartSounds.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const heartSoundsContent: HeartSoundsData = {
  areaLabels: { "2RSB": "第2肋間胸骨右縁", "2LSB": "第2肋間胸骨左縁", "3LSB": "第3肋間胸骨左縁", "4LSB": "第4肋間胸骨左縁", apex: "心尖部" },
  stampAt: 4,
  cases: [
    { ...M, id: "normal", profile: "normal", name: "正常心音", area: "apex", story: "健診の20歳。症状なし。",
      explanation: "I音（房室弁が閉じる音）とII音（半月弁が閉じる音）だけ。I音は心尖部、II音は心基部でよく聴こえる。" },
    { ...M, id: "as", profile: "as", name: "大動脈弁狭窄症", area: "2RSB", story: "78歳。階段で胸が苦しく、ふらっとした。",
      explanation: "収縮期の駆出性雑音（ひし形、漸増漸減）。第2肋間胸骨右縁で最もよく聴こえ、頸部へ放散。II音は弱くなる。狭心痛・失神・心不全が出たら弁置換を考える。" },
    { ...M, id: "mr", profile: "mr", name: "僧帽弁閉鎖不全症", area: "apex", story: "65歳。息切れ。",
      explanation: "I音からII音まで続く全収縮期雑音（逆流性、高調）。心尖部で最もよく聴こえ、腋窩へ放散。" },
    { ...M, id: "ar", profile: "ar", name: "大動脈弁閉鎖不全症", area: "3LSB", story: "55歳。脈圧が大きく、脈がはねるよう。",
      explanation: "II音の直後から始まる拡張期の漸減性雑音（高調、吹くような音）。第3肋間胸骨左縁（Erb領域）で前かがみの呼気止めで聴く。" },
    { ...M, id: "ms", profile: "ms", name: "僧帽弁狭窄症", area: "apex", story: "50歳。心房細動がある。リウマチ熱の既往。",
      explanation: "I音が強く、II音のあとに僧帽弁開放音、続いて拡張期の低い雑音（ランブル）。心尖部で左側臥位、ベル型で聴く。" },
    { ...M, id: "asd", profile: "asd", name: "心房中隔欠損症", area: "2LSB", story: "30歳。健診で心雑音を指摘。",
      explanation: "II音が呼吸に関係なく分かれる（固定性分裂）。肺動脈を流れる血液が増えるため、第2肋間胸骨左縁で駆出性雑音。" },
    { ...M, id: "s3", profile: "s3", name: "III音（心不全）", area: "apex", story: "70歳。むくみと夜の息苦しさ。",
      explanation: "II音のあと少し遅れて低い音（III音）。拡張早期に左室へ血液が急に流れ込む音で、成人では心不全を示す。" },
    { ...M, id: "vsd", profile: "vsd", name: "心室中隔欠損症", area: "4LSB", story: "3歳。健診で大きな心雑音。",
      explanation: "全収縮期雑音で、第3〜4肋間胸骨左縁で最もよく聴こえる。欠損が小さいほど雑音は大きいことが多い。" },
  ],
};
