'use strict';
// OSCEシミュレーターのエンジン（DOMに依存しない）。
// 症例の生成、質問への返答、診察所見、バイタル、採点、模範プレゼン、クイズをまとめる。
// CATO表の「列＝疾患」を1症例とし、その列のセルが患者の答え・所見になる。
(function (root) {
  const CATO = root.OSCE_CATO;
  const NOTES = root.OSCE_NOTES;
  const SIM = root.OSCE_SIM;
  const SAY = root.OSCE_SAY;
  // CATO表と暗記用ノートのデータ（リポジトリには含めていない）がなければ何もしない
  if (!CATO || !NOTES) return;

  // ---- 乱数（シードが同じなら同じ症例になる）----
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  const randInt = (r, a, b) => a + Math.floor(r() * (b - a + 1));
  function shuffle(r, arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const uniq = arr => arr.filter((x, i) => arr.indexOf(x) === i);

  const SYM = {};
  CATO.forEach(s => { SYM[s.name] = s; });
  const canonD = d => SIM.canon[d] || d;
  const NEG = new Set(SAY.negCells);
  const INTRO_Q = ['greet', 'identify', 'consent', 'comfort'];
  const MANNER_E = ['hygiene', 'econsent', 'eclose'];
  const HPI_ORDER = ['onset', 'mechanism', 'prior_inf', 'prodrome', 'trigger', 'meal', 'position', 'quality', 'severity',
    'location', 'radiation', 'course', 'duration', 'diurnal'];
  const HPI_SHORT = {
    onset: '発症様式', mechanism: '受傷機転', prior_inf: '先行感染', prodrome: '前兆', trigger: '増悪・寛解因子',
    meal: '食事との関係', position: '体位による変化', quality: '性状', severity: '程度', location: '部位',
    radiation: '放散・移動', course: '経過', duration: '持続時間', diurnal: '日内変動'
  };
  const LIFE_LABEL = {
    occupation: '職業・生活', living: '同居・家庭', contacts: '接触歴', exposure: '曝露歴', travel: '渡航歴',
    food: '発症前の食事', diet: '食習慣', stress: 'ストレス', sleep: '睡眠'
  };
  // 頭から足への順（プレゼンの陽性所見の並び）
  const EXAM_ORDER = ['general', 'consciousness', 'vitals', 'bpboth', 'ortho', 'skin', 'head', 'eyes', 'pupils', 'eom', 'nystagmus',
    'fundus', 'nose', 'oral', 'breath', 'hearing', 'lymph', 'thyroid', 'neckv', 'meningeal', 'chest', 'lung', 'heart', 'breast',
    'abdomen', 'back', 'spine', 'rectal', 'legs', 'pulses', 'joints', 'trauma', 'cranial', 'motor', 'reflex', 'sensory',
    'cerebellar', 'gait', 'involuntary', 'speech', 'slr', 'cognitive'];

  // 診断名のヒントになるカッコ書き（「呼吸音減弱（肺癌）」の「（肺癌）」など）。患者に見せる所見やカルテからは外す
  const DIAG = /癌|肺炎|麻疹|風疹|心不全|肺水腫|右室|緊張性|肺性心|Basedow|Crohn|CO2|オピオイド|離脱|尿毒症|高Ca|高血糖|高Na|低Na|副腎|クリーゼ|頭部外傷|脳虚血|重症|出血|Reynolds|劇症|梗塞|^AR$|DVT|総胆管|貧血|溢水|絞扼|下壁|Cushing|自律神経|膀胱|尿閉|猩紅熱|薬剤|DKA|高浸透圧|消化管|リンパ腫|B症状|胆嚢炎|腎盂腎炎|骨病変|静脈瘤|肝炎|茎捻転|嵌頓|小脳|心臓喘息|りんご病|マイコプラズマ|旅行者|A型|B型|ロタ|転移|周期性|悪性腫瘍|脊柱管|虚血|抗精神病薬|脳幹|リンパ節|僧帽弁|aura|ドパミン|HPV|高齢者|成人|1型|合併|日数|末期|気道熱傷|脱水|閉塞|腹水|Courvoisier|総蛋白|C型/;
  function clean(text) {
    if (!text) return text;
    const t = text.replace(/（([^（）]*)）/g, (m, inner) => DIAG.test(inner) ? '' : m);
    return SAY.chart[t] || SAY.chart[text] || t;
  }
  // 重症例や合併症でだけ見られる所見は、毎回は出さない
  const COND = /合併|重症|劇症|Reynolds|クリーゼ|粘液水腫性昏睡|CO2ナルコーシス|高Ca血症|広範な梗塞|出血性ショック|脳虚血|（尿毒症）|（高血糖）|（高Na）|（低Na）|（高浸透圧）|意識消失発作|^肝性脳症$/;

  function symptomList() {
    return CATO.map(s => ({ id: s.id, name: s.name, diseases: s.diseases.slice() }));
  }

  // ---- CATO表のセル → 質問・診察への振り分け ----
  // 返り値は [質問ID, セリフ, カルテ表記]
  function routeInterview(row, cell) {
    const r = SAY.route[row + '|' + cell];
    if (r) return r.map(x => [x[0], x[1], x[2] || clean(cell)]);
    const qid = SIM.rowQ[row];
    if (!qid) return [];
    return [[qid, SAY.say[qid + '|' + cell] || ('はい、' + cell + 'があります。'), clean(cell)]];
  }
  // 返り値は [診察ID, 所見]
  function routeExam(row, cell) {
    let s = null;
    if (SIM.neuroRows.indexOf(row) >= 0 && SIM.splitE[cell]) s = SIM.splitE[cell];
    else if (SIM.splitE[row + '|' + cell]) s = SIM.splitE[row + '|' + cell];
    if (s) return s.map(x => [x[0], clean(x[1])]);
    const eid = SIM.rowE[row];
    return eid ? [[eid, clean(cell)]] : [];
  }

  // ---- 患者 ----
  function makePersona(sym, dis, r) {
    const meta = SIM.diseases[dis] || [30, 75, '', ''];
    const sm = SIM.symptoms[sym] || {};
    const ageYears = meta[0] + r() * (meta[1] - meta[0]);
    const sex = meta[2] || (sym === '月経異常' ? 'F' : (r() < 0.5 ? 'M' : 'F'));
    const months = ageYears < 1 ? Math.max(2, Math.round(ageYears * 12)) : null;
    const age = Math.floor(ageYears);
    const kid = ageYears < 13;
    const last = pick(r, SIM.names.last);
    const first = kid ? pick(r, sex === 'M' ? SIM.names.boy : SIM.names.girl) : pick(r, SIM.names[sex + (age >= 50 ? 'old' : '')]);
    const now = new Date();
    const days = months ? months * 30.4 + randInt(r, 0, 20) : age * 365.25 + randInt(r, 10, 350);
    const birth = new Date(now.getTime() - days * 86400000);
    const birthStr = birth.getFullYear() + '年' + (birth.getMonth() + 1) + '月' + birth.getDate() + '日';
    let informant = 'self', relation = '';
    if (kid) { informant = 'parent'; relation = '母親'; }
    else if (sm.who === 'family') { informant = 'family'; relation = familyRelation(age, sex); }
    let occ;
    if (kid) occ = age < 3 ? ['日中は家で過ごしています。', '未就園'] : age < 6 ? ['保育園に通っています。', '保育園児'] : ['小学校に通っています。', '小学生'];
    else if (age < 16) occ = ['中学生です。', '中学生'];
    else if (age < 19) occ = ['高校生です。', '高校生'];
    else if (age < 23) occ = ['大学生です。', '大学生'];
    else if (age < 65) occ = pick(r, [['会社員で、事務の仕事をしています。', '会社員（事務職）'], ['小売店で販売の仕事をしています。', '販売職'],
      ['公務員です。', '公務員'], ['介護職員をしています。', '介護職'], ['システムエンジニアです。', 'システムエンジニア'], ['教員をしています。', '教員'],
      sex === 'F' ? ['パートで、スーパーのレジをしています。', 'パート（レジ）'] : ['営業職です。', '営業職']]);
    else occ = ['仕事は引退していて、年金生活です。', '無職（年金生活）'];
    let liv;
    if (kid) liv = ['両親と、きょうだいと暮らしています。', '両親・きょうだいと同居'];
    else if (age < 19) liv = ['両親と暮らしています。', '両親と同居'];
    else if (age < 30) liv = pick(r, [['一人暮らしです。', '独居'], ['両親と同居しています。', '両親と同居']]);
    else if (age < 65) liv = sex === 'M' ? ['妻と子ども2人と暮らしています。', '妻・子と同居'] : ['夫と子ども2人と暮らしています。', '夫・子と同居'];
    else liv = sex === 'M' ? ['妻と二人暮らしです。', '妻と二人暮らし'] : ['夫と二人暮らしです。', '夫と二人暮らし'];
    const ageLabel = months ? '生後' + months + 'か月' : age + '歳';
    const sexLabel = kid ? (sex === 'M' ? '男児' : '女児') : (sex === 'M' ? '男性' : '女性');
    return { name: last + ' ' + first, last, first, sex, age, months, kid, informant, relation, birthStr, ageLabel, sexLabel,
      occupation: occ[0], occShort: occ[1], living: liv[0], livShort: liv[1] };
  }
  function familyRelation(age, sex) {
    return age >= 70 ? '娘' : age < 30 ? '母親' : (sex === 'M' ? '妻' : '夫');
  }
  function qAllowed(qid, p) {
    const f = SIM.Q[qid] && SIM.Q[qid].f;
    if (!f) return true;
    if (f === 'kid') return p.kid;
    if (f === 'adult') return p.age >= 15;
    if (f === 'F') return p.sex === 'F' && p.age >= 10;
    return true;
  }

  function addItem(map, id, item) { (map[id] = map[id] || []).push(item); }

  // 疾患ごとの「この質問・診察で見つかるセル」（その症候の表だけ）
  function cellsByDisease(S, p) {
    const dq = {}, de = {};
    for (const d of S.diseases) {
      dq[d] = {}; de[d] = {};
      for (const [row, cells] of S.interview) {
        const cell = cells[d];
        if (!cell) continue;
        for (const [qid, , chart] of routeInterview(row, cell)) {
          if (!qAllowed(qid, p)) continue;
          (dq[d][qid] = dq[d][qid] || []).push(chart);
        }
      }
      for (const [row, cells] of S.exam) {
        const cell = cells[d];
        if (!cell) continue;
        for (const [eid, text] of routeExam(row, cell)) (de[d][eid] = de[d][eid] || []).push(text);
      }
    }
    return { dq, de };
  }

  function resolveNoteName(sym, n) {
    const S = SYM[sym];
    const N = NOTES.symptoms[sym];
    const a = (N && N.alias && N.alias[n]) || n;
    return S && S.diseases.indexOf(a) >= 0 ? a : null;
  }

  // ---- 症例をつくる ----
  function buildCase(sym, dis, seed) {
    const S = SYM[sym];
    if (!S || S.diseases.indexOf(dis) < 0) throw new Error('unknown case: ' + sym + ' / ' + dis);
    if (seed === undefined || seed === null) seed = Math.floor(Math.random() * 2147483647);
    const r = mulberry32(seed);
    const p = makePersona(sym, dis, r);
    const sm = SIM.symptoms[sym] || {};
    const meta = SIM.diseases[dis] || [];
    const tempo = meta[3] || sm.tempo || 'days';
    const c = { sym, dis, seed, p, sm, tempo, q: {}, e: {}, keyQ: [], keyE: [], dropped: [] };
    const onsetPick = pick(r, sm.event ? SIM.eventOnset : SIM.onsetByTempo[tempo]);
    c.onsetSay = onsetPick[0];
    c.onsetMed = onsetPick[1];
    c.openOv = SIM.openByCase[sym + '|' + dis] || null;
    // 重症例・合併症の所見は半分の確率でだけ出す
    const keep = cell => {
      if (!COND.test(cell)) return true;
      const on = r() < 0.5;
      if (!on && c.dropped.indexOf(cell) < 0) c.dropped.push(cell);
      return on;
    };

    // その症候の表（主要な所見）
    for (const [row, cells] of S.interview) {
      const cell = cells[dis];
      if (!cell || !keep(cell)) continue;
      for (const [qid, say, chart] of routeInterview(row, cell)) {
        if (!qAllowed(qid, p)) continue;
        addItem(c.q, qid, { cell, chart, row, say, src: 'primary', neg: NEG.has(cell) });
        if (c.keyQ.indexOf(qid) < 0) c.keyQ.push(qid);
      }
    }
    for (const [row, cells] of S.exam) {
      const cell = cells[dis];
      if (!cell || !keep(cell)) continue;
      for (const [eid, text] of routeExam(row, cell)) {
        addItem(c.e, eid, { cell, row, text, src: 'primary', neg: NEG.has(cell) || NEG.has(text) });
        if (c.keyE.indexOf(eid) < 0) c.keyE.push(eid);
      }
    }
    // 原因の候補が複数あるときは1つに絞る（ほかの表からも補わない）
    const blocked = [];
    const one = SIM.oneOf[dis];
    if (one) {
      const have = one.filter(q => c.q[q]);
      const chosen = pick(r, have);
      have.filter(q => q !== chosen).forEach(q => { delete c.q[q]; c.keyQ.splice(c.keyQ.indexOf(q), 1); blocked.push(q); });
    }
    // 主訴そのもの
    for (const qid of Object.keys(sm.pos || {})) {
      if (!c.q[qid] && qAllowed(qid, p)) addItem(c.q, qid, { cell: SIM.Q[qid].l, chart: SIM.Q[qid].l, row: null, say: sm.pos[qid], src: 'cc', neg: false });
    }
    for (const eid of Object.keys(sm.epos || {})) {
      if (!c.e[eid]) addItem(c.e, eid, { cell: sm.epos[eid], row: null, text: sm.epos[eid], src: 'cc', neg: false });
    }
    if ((canonD(dis) === '妊娠' || dis === '異所性妊娠') && qAllowed('preg', p) && !c.q.preg) {
      addItem(c.q, 'preg', { cell: '妊娠の可能性あり', chart: '妊娠の可能性あり', row: null, say: '生理が遅れているので、可能性はあるかもしれません。', src: 'cross', neg: false });
    }
    // 同じ病気がほかの症候の表にもあれば、そこからも補う（1つの質問・診察につき1つまで）
    if (SIM.noMergeD.indexOf(dis) < 0) {
      const cd = canonD(dis);
      for (const T of CATO) {
        if (T === S) continue;
        for (const d of T.diseases) {
          if (canonD(d) !== cd || SIM.noMergeD.indexOf(d) >= 0) continue;
          for (const [row, cells] of T.interview) {
            const cell = cells[d];
            if (!cell || COND.test(cell)) continue;
            for (const [qid, say, chart] of routeInterview(row, cell)) {
              if (!qAllowed(qid, p) || SIM.noMergeQ.indexOf(qid) >= 0 || c.q[qid] || blocked.indexOf(qid) >= 0) continue;
              addItem(c.q, qid, { cell, chart, row, say, src: 'cross', neg: NEG.has(cell) });
            }
          }
          for (const [row, cells] of T.exam) {
            const cell = cells[d];
            if (!cell || COND.test(cell)) continue;
            for (const [eid, text] of routeExam(row, cell)) {
              if (SIM.noMergeE.indexOf(eid) >= 0 || c.e[eid]) continue;
              addItem(c.e, eid, { cell, row, text, src: 'cross', neg: NEG.has(cell) || NEG.has(text) });
            }
          }
        }
      }
    }
    // 健診で指摘された既往は「健康診断」の質問でも答える
    (c.q.pmh || []).forEach(it => {
      if (/健診|指摘|陽性|異常|高値|PSA|便潜血|蛋白尿|血尿/.test(it.cell) && !(c.q.checkup || []).some(x => x.cell === it.cell)) {
        addItem(c.q, 'checkup', Object.assign({}, it));
      }
    });

    // 意識障害のある患者は自分では答えられないので、付き添いの家族が一緒に答える
    if (p.informant === 'self' && [].concat(c.q.consciousness || [], c.e.consciousness || [])
      .some(i => !i.neg && !/^意識清明/.test(i.text || i.cell))) {
      p.informant = 'both';
      p.relation = familyRelation(p.age, p.sex);
    }

    // 鑑別と Red Flag
    const cbd = cellsByDisease(S, p);
    c.dq = cbd.dq;
    c.de = cbd.de;
    const N = NOTES.symptoms[sym] || { redFlags: [] };
    c.rf = N.redFlags.map(n => ({ name: n, cato: resolveNoteName(sym, n) }));
    c.isRF = c.rf.some(x => x.cato === dis);
    c.rfQ = {};
    c.rfE = {};
    c.rf.forEach(x => {
      if (!x.cato || x.cato === dis) return;
      Object.keys(c.dq[x.cato] || {}).forEach(qid => { (c.rfQ[qid] = c.rfQ[qid] || []).push(x.cato); });
      Object.keys(c.de[x.cato] || {}).forEach(eid => { (c.rfE[eid] = c.rfE[eid] || []).push(x.cato); });
    });
    c.vitals = makeVitals(c, r);
    // 根拠2つで取りうる最大点（陽性所見が1つしかない疾患でも満点にできるように）
    const evVals = Object.keys(c.q).map(q => evidenceValue(c, 'q:' + q)).concat(Object.keys(c.e).map(e => evidenceValue(c, 'e:' + e)))
      .sort((a, b) => b - a);
    c.evMax = (evVals[0] || 0) + (evVals[1] || 0);
    return c;
  }

  // ---- バイタル ----
  function makeVitals(c, r) {
    const p = c.p;
    const v = { sbp: randInt(r, 112, 130), dbp: randInt(r, 66, 80), hr: randInt(r, 64, 82), rr: randInt(r, 12, 16),
      bt: +(36.3 + r() * 0.5).toFixed(1), spo2: randInt(r, 97, 99), irregular: false, notes: [] };
    if (p.kid) {
      if (p.months || p.age < 2) { v.hr = randInt(r, 116, 136); v.rr = randInt(r, 28, 38); v.sbp = randInt(r, 86, 98); v.dbp = randInt(r, 48, 58); }
      else { v.hr = randInt(r, 88, 110); v.rr = randInt(r, 20, 26); v.sbp = randInt(r, 94, 108); v.dbp = randInt(r, 56, 66); }
    } else if (p.age >= 70) v.sbp = randInt(r, 124, 140);
    const kidAdd = p.kid ? 30 : 0;
    // 問診で熱があると答える患者は、体温にも反映する
    const fever = (c.q.fever || []).filter(i => !i.neg && !/前駆|発疹前|感冒様/.test(i.cell)).map(i => i.cell).join('・');
    if (c.sym === '発熱' || /発熱|高熱|弛張熱|高体温/.test(fever)) { v.bt = +(38.3 + r() * 0.8).toFixed(1); v.hr += 14; }
    else if (/微熱/.test(fever)) v.bt = +(37.3 + r() * 0.5).toFixed(1);
    if (/高熱|弛張熱/.test(fever)) v.bt = +(39.3 + r() * 0.6).toFixed(1);
    if (c.sym === 'ショック') { v.sbp = randInt(r, 74, 86); v.dbp = randInt(r, 40, 52); v.hr = randInt(r, 116, 132); v.rr = randInt(r, 22, 28); }
    if (c.sym === '脱水') { v.hr = Math.max(v.hr, randInt(r, 100, 112) + kidAdd); v.sbp = Math.min(v.sbp, randInt(r, 96, 106)); }
    if (c.sym === '呼吸困難') v.rr = Math.max(v.rr, 20);
    const T = (c.e.vitals || []).map(i => i.cell + '・' + i.text).join('・');
    const has = k => T.indexOf(k) >= 0;
    if (has('40℃以上')) v.bt = +(40.3 + r() * 0.6).toFixed(1);
    else if (has('高体温')) v.bt = +(39.8 + r() * 0.7).toFixed(1);
    else if (has('高熱')) v.bt = +(39.4 + r() * 0.6).toFixed(1);
    else if (has('発熱')) v.bt = Math.max(v.bt, +(38.3 + r() * 0.8).toFixed(1));
    else if (has('微熱')) v.bt = Math.max(v.bt, +(37.3 + r() * 0.5).toFixed(1));
    if (has('低体温')) v.bt = +(34.9 + r() * 0.6).toFixed(1);
    const bothRates = has('徐脈・頻脈') || has('頻脈/徐脈');
    if (bothRates) { v.irregular = true; v.hr = r() < 0.5 ? randInt(r, 38, 46) : randInt(r, 140, 156); }
    else if (has('比較的徐脈')) { v.bt = Math.max(v.bt, 39.2); v.hr = randInt(r, 80, 88); }
    else if (has('低血圧なのに徐脈') || has('Cushing') || (has('徐脈') && !has('頻脈'))) v.hr = randInt(r, 42, 50) + (p.kid ? 20 : 0);
    else if (has('頻脈') || has('脱水')) v.hr = Math.max(v.hr, randInt(r, 110, 126) + kidAdd);
    if (has('低血圧')) { v.sbp = randInt(r, 74, 86); v.dbp = randInt(r, 40, 52); }
    if (has('著明な高血圧')) { v.sbp = randInt(r, 212, 230); v.dbp = randInt(r, 118, 132); }
    else if (has('Cushing')) { v.sbp = randInt(r, 186, 200); v.dbp = randInt(r, 94, 106); }
    else if (has('高血圧') || has('血圧上昇')) { v.sbp = randInt(r, 172, 192); v.dbp = randInt(r, 94, 108); }
    if (has('脈圧増大')) { v.sbp = randInt(r, 146, 158); v.dbp = randInt(r, 46, 56); }
    if (has('頻呼吸')) v.rr = randInt(r, 26, 32) + (p.kid ? 10 : 0);
    if (has('SpO2低下')) v.spo2 = randInt(r, 85, 91);
    if (has('SpO2正常')) v.spo2 = randInt(r, 98, 99);
    if (has('Kussmaul')) { v.rr = randInt(r, 28, 32); v.notes.push('深く大きな呼吸'); }
    if (has('呼吸抑制')) { v.rr = randInt(r, 5, 7); v.spo2 = randInt(r, 87, 91); }
    if (has('脈不整') || has('不整脈') || has('リズム不整')) {
      v.irregular = true;
      if (!bothRates && !has('徐脈')) v.hr = Math.max(v.hr, randInt(r, 102, 126));
    }
    if (has('血圧変動')) v.notes.push('測定ごとに血圧が大きく変動');
    // 両上肢の血圧
    const bp = (c.e.bpboth || []).map(i => i.text).join('・');
    v.bpR = [v.sbp, v.dbp];
    if (bp.indexOf('脈なし') >= 0) { v.bpL = null; v.bpPos = true; }
    else if (bp.indexOf('左右差') >= 0) { v.bpL = [v.sbp - randInt(r, 32, 46), v.dbp - randInt(r, 14, 22)]; v.bpPos = true; }
    else { v.bpL = [v.sbp - randInt(r, 0, 6), v.dbp - randInt(r, 0, 4)]; v.bpPos = false; }
    // 起立試験
    const neuro = c.dis === 'Parkinson病' || c.dis === 'Lewy小体型認知症';
    if ((c.e.ortho || []).length) {
      v.ortho = { pos: true, sup: [v.sbp, v.dbp, v.hr], std: [v.sbp - randInt(r, 28, 40), v.dbp - randInt(r, 12, 18), v.hr + (neuro ? randInt(r, 0, 6) : randInt(r, 14, 22))] };
    } else {
      v.ortho = { pos: false, sup: [v.sbp, v.dbp, v.hr], std: [v.sbp - randInt(r, 0, 8), v.dbp + randInt(r, 0, 4), v.hr + randInt(r, 4, 10)] };
    }
    return v;
  }
  // 低血圧とみなす収縮期血圧（小児は 70＋2×年齢）
  const sbpLow = p => p.kid ? 70 + 2 * p.age : 90;
  // 基準から外れた項目（表示で強調する）
  function vitalsFlags(c, v) {
    const p = c.p;
    const infant = p.months || p.age < 2;
    const hrHi = p.kid ? (infant ? 160 : 130) : 100;
    const hrLo = p.kid ? (infant ? 90 : 70) : 60;
    const rrHi = p.kid ? (infant ? 45 : 30) : 20;
    return {
      bp: v.sbp < sbpLow(p) || v.sbp >= 160, hr: v.hr > hrHi || v.hr < hrLo || v.irregular,
      rr: v.rr > rrHi || v.rr < 10, bt: v.bt >= 37.5 || v.bt < 35.5, spo2: v.spo2 < 95
    };
  }
  function vitalsAbnormal(c, v) {
    const f = vitalsFlags(c, v);
    return f.bp || f.hr || f.rr || f.bt || f.spo2;
  }
  function formatVitals(v) {
    let s = '血圧 ' + v.sbp + '/' + v.dbp + ' mmHg　脈拍 ' + v.hr + '/分（' + (v.irregular ? '不整' : '整') + '）　呼吸数 ' + v.rr +
      '/分　体温 ' + v.bt.toFixed(1) + '℃　SpO2 ' + v.spo2 + '%（室内気）';
    if (v.notes.length) s += '　※' + v.notes.join('、');
    return s;
  }

  // ---- 面接 ----
  function newState(c, opts) {
    opts = opts || {};
    return { asked: [], revealed: {}, examined: [], t: 0, limit: opts.limit || 0, firstContent: null, hints: 0 };
  }
  function itemsOf(c, qid) { return c.q[qid] || []; }
  function identifyText(c) {
    const p = c.p;
    if (p.informant === 'parent') return 'この子は' + p.name + 'です。' + p.birthStr + '生まれです。';
    if (p.informant === 'family' || p.informant === 'both') {
      const who = { '妻': '夫', '夫': '妻', '娘': p.sex === 'M' ? '父' : '母', '母親': p.sex === 'M' ? '息子' : '娘' }[p.relation];
      return '（本人に代わって）' + who + 'の' + p.name + 'です。' + p.birthStr + '生まれです。';
    }
    return p.name + 'です。' + p.birthStr + '生まれです。';
  }
  function defaultAnswer(c, qid) {
    const p = c.p;
    const Q = SIM.Q[qid];
    const neg = c.sm.neg && c.sm.neg[qid];
    switch (qid) {
      case 'onset': return c.onsetSay;
      case 'alcohol': return p.age < 20 ? 'お酒は飲みません。' : Q.n;
      case 'occupation': return p.occupation;
      case 'living': return p.living;
      case 'checkup': return c.sm.checkup || (p.kid ? '乳幼児健診では、特に何も言われていません。' : p.age >= 65 ? '市の健診を受けていて、特に何も言われていません。' : '毎年、職場の健診を受けていて、特に何も言われていません。');
      case 'menses':
        if (p.age < 12) return 'まだ生理は来ていません。';
        if (p.age >= 52) return '50歳ごろに閉経しています。';
        return '最終月経は2週間ほど前で、周期は順調です。量も普通です。';
      case 'preg':
        if (p.age < 12 || p.age >= 52) return 'ありません。';
        return 'ないと思います。';
      case 'obhx':
        return p.age < 30 ? '妊娠したことはありません。' : '子どもが2人います。どちらも普通分娩でした。';
      case 'ice': return c.sm.ice || '何か悪い病気じゃないかと心配です。';
      default: return neg || Q.n || Q.a || '特にありません。';
    }
  }
  function answerFor(c, qid) {
    const items = itemsOf(c, qid);
    if (items.length) return uniq(items.map(i => i.say)).join('');
    return defaultAnswer(c, qid);
  }
  // 自分から話してくれる情報（開放型質問・言い残しの確認で使う）
  function volunteer(c, st, groups, n, maxRos) {
    const cands = [];
    Object.keys(c.q).forEach(qid => {
      if (st.revealed[qid] || qid === 'checkup') return;
      const Q = SIM.Q[qid];
      if (!Q || groups.indexOf(Q.g) < 0) return;
      const its = c.q[qid].filter(i => i.src !== 'cc' && !i.neg);
      if (!its.length) return;
      const rank = (Q.g === 'hpi' ? 0 : 10) + (its[0].src === 'primary' ? 0 : 3) + (c.keyQ.indexOf(qid) >= 0 ? 0 : 1);
      cands.push({ qid, g: Q.g, rank, say: uniq(its.map(i => i.say)).join('') });
    });
    cands.sort((a, b) => a.rank - b.rank);
    const out = [];
    let ros = 0;
    for (const x of cands) {
      if (out.length >= n) break;
      if (x.g === 'ros' && maxRos !== undefined && ros >= maxRos) continue;
      if (x.g === 'ros') ros++;
      out.push(x);
    }
    return out;
  }
  function ask(c, st, qid) {
    const Q = SIM.Q[qid];
    st.t += Q.t || 15;
    st.asked.push(qid);
    if (!st.firstContent && INTRO_Q.indexOf(qid) < 0) st.firstContent = qid;
    const newly = [];
    const reveal = id => { if (!st.revealed[id]) { st.revealed[id] = true; newly.push(id); } };
    let a;
    switch (qid) {
      case 'greet': case 'consent': case 'comfort': case 'empathy': case 'summary': case 'expect':
        a = Q.a; reveal(qid); break;
      case 'identify': a = identifyText(c); reveal(qid); break;
      case 'open':
        a = c.openOv ? c.openOv.say : (c.sm.say || '') + (c.q.onset ? answerFor(c, 'onset') : c.onsetSay);
        reveal('open'); reveal('onset');
        if (c.openOv) c.openOv.reveal.forEach(reveal);
        Object.keys(c.sm.pos || {}).forEach(id => { if (c.q[id] && c.q[id][0].src === 'cc') reveal(id); });
        break;
      case 'more': {
        const vol = volunteer(c, st, ['hpi', 'ros'], 2, 1);
        a = vol.length ? vol.map(x => x.say).join('') : 'それ以外は、特にありません。';
        reveal('more'); vol.forEach(x => reveal(x.qid));
        break;
      }
      case 'associated': {
        if (c.q.associated) { a = answerFor(c, 'associated'); reveal('associated'); break; }
        const vol = volunteer(c, st, ['ros'], 1);
        a = vol.length ? vol[0].say : Q.n;
        reveal('associated'); vol.forEach(x => reveal(x.qid));
        break;
      }
      case 'anything': {
        const vol = volunteer(c, st, ['hpi', 'ros', 'bg'], 1);
        a = vol.length ? 'そういえば…' + vol[0].say : 'いいえ、大丈夫です。';
        reveal('anything'); vol.forEach(x => reveal(x.qid));
        break;
      }
      default:
        a = answerFor(c, qid); reveal(qid);
    }
    return { q: Q.q, a, newly };
  }

  // ---- 診察 ----
  // 意識障害やショックがあって、見た目にも具合が悪いか
  function looksSick(c) {
    const v = c.vitals;
    const cons = (c.e.consciousness || []).concat(c.q.consciousness || []).some(i => !i.neg && !/^意識清明/.test(i.text || i.cell));
    return cons || v.sbp < sbpLow(c.p) || v.spo2 < 90;
  }
  function examText(c, eid) {
    const E = SIM.E[eid];
    const v = c.vitals;
    if (eid === 'vitals') return { text: formatVitals(v), pos: vitalsAbnormal(c, v) };
    if (eid === 'bpboth') {
      const R = '右上肢 ' + v.bpR[0] + '/' + v.bpR[1] + ' mmHg';
      const L = v.bpL ? '左上肢 ' + v.bpL[0] + '/' + v.bpL[1] + ' mmHg' : '左上肢 測定困難（橈骨動脈の拍動が弱い）';
      const diff = v.bpL ? v.bpR[0] - v.bpL[0] : null;
      return { text: R + '、' + L + (diff !== null ? '（左右差 ' + diff + ' mmHg）' : ''), pos: v.bpPos };
    }
    if (eid === 'ortho') {
      const o = v.ortho;
      return { text: '臥位 ' + o.sup[0] + '/' + o.sup[1] + ' mmHg・脈拍 ' + o.sup[2] + ' → 立位3分 ' + o.std[0] + '/' + o.std[1] +
        ' mmHg・脈拍 ' + o.std[2] + '（収縮期 ' + (o.sup[0] - o.std[0]) + ' mmHg 低下）', pos: o.pos };
    }
    const items = c.e[eid] || [];
    if (items.length) return { text: uniq(items.map(i => i.text)).join('、'), pos: items.some(i => !i.neg) };
    if (eid === 'general' && looksSick(c)) return { text: 'ぐったりして顔色不良', pos: true };
    return { text: E.n, pos: false };
  }
  function examine(c, st, eid) {
    const E = SIM.E[eid];
    st.t += E.t || 20;
    st.examined.push(eid);
    if (eid === 'hygiene') return { say: E.say, a: null, text: null };
    if (eid === 'econsent' || eid === 'eclose') return { say: E.say, a: E.a, text: null };
    const r = examText(c, eid);
    return { say: null, a: null, text: r.text, pos: r.pos, sens: !!E.sens };
  }

  // ---- カルテ ----
  // 表に記載のない質問への答え（data-sim.js の n）を、カルテでどう書くか。ここにないものは「なし」
  const DEFAULT_CHART = { mechanism: 'はっきりしない', quality: 'はっきりしない', severity: '中等度（5/10）', location: 'はっきり限局しない',
    course: '徐々に増悪', duration: '持続的' };
  function chartEntries(c, st) {
    const out = [];
    const seen = {};
    st.asked.concat(Object.keys(st.revealed)).forEach(qid => {
      if (seen['q:' + qid] || !SIM.Q[qid]) return;
      seen['q:' + qid] = true;
      const Q = SIM.Q[qid];
      if (['intro', 'close'].indexOf(Q.g) >= 0 && qid !== 'ice') return;
      if (['open', 'more', 'associated', 'expect', 'anything'].indexOf(qid) >= 0 && !c.q[qid]) return;
      const items = itemsOf(c, qid);
      let text, pos;
      if (items.length) { text = uniq(items.map(i => i.chart)).join('・'); pos = items.some(i => !i.neg); }
      else if (qid === 'onset') { text = c.onsetMed; pos = false; }
      else if (qid === 'alcohol') { text = c.p.age < 20 ? 'なし' : '機会飲酒程度'; pos = false; }
      else if (c.sm.negChart && c.sm.negChart[qid]) { text = c.sm.negChart[qid]; pos = false; }
      else if (DEFAULT_CHART[qid]) { text = DEFAULT_CHART[qid]; pos = false; }
      else if (Q.n) { text = 'なし'; pos = false; }
      else { text = defaultAnswer(c, qid).replace(/。$/, ''); pos = false; }
      out.push({ ref: 'q:' + qid, kind: 'q', id: qid, group: Q.g, tag: Q.tag || '', label: Q.l, text, pos, src: items[0] ? items[0].src : null });
    });
    st.examined.forEach(eid => {
      if (seen['e:' + eid] || MANNER_E.indexOf(eid) >= 0) return;
      seen['e:' + eid] = true;
      const E = SIM.E[eid];
      const r = examText(c, eid);
      const items = c.e[eid] || [];
      out.push({ ref: 'e:' + eid, kind: 'e', id: eid, group: 'exam', label: E.l, text: r.text, pos: r.pos, src: items[0] ? items[0].src : (eid === 'vitals' ? 'primary' : null) });
    });
    return out;
  }

  // ---- 採点 ----
  // 2つの所見が同じ種類のもの（「発熱」と「二峰性発熱」など）か
  const related = (a, b) => a === b || a.indexOf(b) >= 0 || b.indexOf(a) >= 0;
  // その所見が疾患 d の表のセルにあたり、しかもこの患者には（同じ種類の所見も）なかったか
  function reasonValid(c, d, ref) {
    if (!ref || !d) return false;
    const kind = ref.slice(0, 1), id = ref.slice(2);
    if (kind === 'q') {
      const dc = (c.dq[d] || {})[id];
      if (!dc) return false;
      const mine = itemsOf(c, id).filter(i => !i.neg).map(i => i.chart);
      return dc.some(x => !mine.some(m => related(m, x)));
    }
    const dc = (c.de[d] || {})[id];
    if (!dc) return false;
    if (id === 'bpboth') return !c.vitals.bpPos;
    if (id === 'ortho') return !c.vitals.ortho.pos;
    const mine = (c.e[id] || []).filter(i => !i.neg).map(i => i.text);
    if (id === 'vitals') return dc.some(x => mine.indexOf(x) < 0);
    return dc.some(x => !mine.some(m => related(m, x)));
  }
  function evidenceValue(c, ref) {
    const kind = ref.slice(0, 1), id = ref.slice(2);
    const items = kind === 'q' ? itemsOf(c, id) : (c.e[id] || []);
    if (!items.length) return 0;
    if (items.some(i => i.src === 'primary' && !i.neg)) return 5;
    if (items.some(i => i.src === 'cross' && !i.neg)) return 3;
    if (items.some(i => i.src === 'primary')) return 3;
    return 0;
  }
  function bgChecklist(c) {
    const p = c.p;
    const list = ['pmh', 'meds', 'allergy', 'family', 'occupation'];
    if (p.age >= 15) list.push('alcohol', 'smoking');
    if (p.sex === 'F' && p.age >= 12 && p.age < 55) list.push('menses', 'preg');
    if (p.kid) list.push('vaccine');
    return list;
  }
  function score(c, st, rep) {
    rep = rep || {};
    const asked = st.asked;
    const has = q => asked.indexOf(q) >= 0;
    const firstContent = asked.findIndex(q => INTRO_Q.indexOf(q) < 0);
    const introPts = ['greet', 'identify', 'consent'].reduce((s, q) => {
      const i = asked.indexOf(q);
      if (i < 0) return s;
      return s + (firstContent < 0 || i < firstContent ? 2 : 1);
    }, 0);
    const openPts = st.firstContent === 'open' || st.firstContent === 'more' ? 2 : 0;
    const keyQ = c.keyQ;
    const keyQhit = keyQ.filter(q => st.revealed[q]);
    const keyQPts = keyQ.length ? 12 * keyQhit.length / keyQ.length : 12;
    const rfQ = Object.keys(c.rfQ);
    const rfQhit = rfQ.filter(q => st.revealed[q]);
    const rfQden = Math.min(rfQ.length, 5);
    const rfQPts = rfQden ? 6 * Math.min(1, rfQhit.length / rfQden) : 6;
    const bg = bgChecklist(c);
    const bgHit = bg.filter(q => st.revealed[q]);
    const bgPts = 6 * bgHit.length / bg.length;
    const closePts = (has('ice') ? 1 : 0) + (has('anything') ? 1 : 0) + (has('summary') ? 0.5 : 0) + (has('empathy') ? 0.5 : 0);

    const ex = st.examined;
    const firstTouch = ex.findIndex(e => MANNER_E.indexOf(e) < 0);
    const before = e => { const i = ex.indexOf(e); return i < 0 ? 0 : (firstTouch < 0 || i < firstTouch ? 2 : 1); };
    const hyPts = before('hygiene');
    const ecPts = before('econsent');
    const closeE = ex.indexOf('eclose') >= 0 ? 1 : 0;
    const vitalsPts = ex.indexOf('vitals') >= 0 ? 5 : 0;
    const keyE = c.keyE;
    const keyEhit = keyE.filter(e => ex.indexOf(e) >= 0);
    const keyEPts = keyE.length ? 14 * keyEhit.length / keyE.length : 14;
    const rfE = Object.keys(c.rfE);
    const rfEhit = rfE.filter(e => ex.indexOf(e) >= 0);
    const rfEden = Math.min(rfE.length, 4);
    const rfEPts = rfEden ? 6 * Math.min(1, rfEhit.length / rfEden) : 6;

    const dxOk = rep.dx === c.dis;
    const dxPts = dxOk ? 15 : 0;
    let evPts = 0;
    const evDetail = (rep.ev || []).slice(0, 2).map(ref => { const v = dxOk ? evidenceValue(c, ref) : 0; evPts += v; return { ref, pts: v }; });
    evPts = c.evMax ? Math.min(10, evPts * 10 / c.evMax) : (dxOk ? 10 : 0);
    let ddPts = 0;
    const ddDetail = (rep.dd || []).slice(0, 2).map(x => {
      const ok = !!x && !!x.d && x.d !== rep.dx && !related(x.d, c.dis) && reasonValid(c, x.d, x.ref);
      if (ok) ddPts += 2.5;
      return { d: x && x.d, ref: x && x.ref, ok };
    });
    let rfPts = 0, rfNote = '';
    const rfNames = c.rf.map(x => x.cato).filter(Boolean);
    if (c.isRF && dxOk) { rfPts = 5; rfNote = '見逃してはいけない疾患を、正しく診断できました。'; }
    else if (rep.rf && rep.rf.d && rfNames.indexOf(rep.rf.d) >= 0 && rep.rf.d !== rep.dx) {
      if (!related(rep.rf.d, c.dis) && reasonValid(c, rep.rf.d, rep.rf.ref)) { rfPts = 5; rfNote = '根拠をもって除外できています。'; }
      else if (related(rep.rf.d, c.dis)) { rfPts = 0; rfNote = rep.rf.d === c.dis ? 'その疾患こそが正解でした。' : 'その疾患は正解と同じ系統なので、除外できません。'; }
      else { rfPts = 2; rfNote = '疾患名は挙がっていますが、除外の根拠になっていません。'; }
    } else rfNote = 'Red Flag に挙がる疾患に触れていません。';

    const parts = [
      { key: 'interview', label: '医療面接', max: 35, items: [
        { label: '導入（あいさつ・本人確認・同意）', got: introPts, max: 6 },
        { label: '開放型質問から始める', got: openPts, max: 2 },
        { label: '決め手になる質問', got: keyQPts, max: 12, hit: keyQhit.length, of: keyQ.length },
        { label: 'Red Flag を除外する質問', got: rfQPts, max: 6, hit: Math.min(rfQhit.length, rfQden), of: rfQden },
        { label: '背景（既往・薬・アレルギー・家族・生活）', got: bgPts, max: 6, hit: bgHit.length, of: bg.length },
        { label: '締め（解釈モデル・言い残し・要約・共感）', got: closePts, max: 3 }
      ] },
      { key: 'exam', label: '身体診察', max: 30, items: [
        { label: '手指消毒・診察の説明と同意・終了の声かけ', got: hyPts + ecPts + closeE, max: 5 },
        { label: 'バイタルサイン', got: vitalsPts, max: 5 },
        { label: '決め手になる診察', got: keyEPts, max: 14, hit: keyEhit.length, of: keyE.length },
        { label: 'Red Flag を除外する診察', got: rfEPts, max: 6, hit: Math.min(rfEhit.length, rfEden), of: rfEden }
      ] },
      { key: 'reasoning', label: '臨床推論・報告', max: 35, items: [
        { label: '最も考えられる疾患', got: dxPts, max: 15 },
        { label: '根拠（2つ）', got: evPts, max: 10 },
        { label: '鑑別と、考えにくい根拠', got: ddPts, max: 5 },
        { label: 'Red Flag への言及', got: rfPts, max: 5 }
      ] }
    ];
    parts.forEach(pt => { pt.got = pt.items.reduce((s, it) => s + it.got, 0); });
    const total = Math.round(parts.reduce((s, pt) => s + pt.got, 0));
    const rank = total >= 90 ? 'S' : total >= 80 ? 'A' : total >= 70 ? 'B' : total >= 60 ? 'C' : 'D';
    return { total, rank, parts, dxOk, evDetail, ddDetail, rfNote,
      missedQ: keyQ.filter(q => !st.revealed[q]), missedE: keyE.filter(e => ex.indexOf(e) < 0) };
  }

  // ---- 模範プレゼン ----
  const shortLabel = l => l.replace(/（[^（）]*）/g, '');
  // 「腫大」のように短すぎる所見は項目名を添え、「〜と答える」は「〜こと」にして文に入るようにする
  const GENERIC = ['腫大', '減少', '増加', '低下', '亢進', '片側', '両側', '圧痕性', '非圧痕性', '急性', '慢性', '緩徐', '突然', '反復', '発作性'];
  function findingText(c, ref, cell) {
    const kind = ref.slice(0, 1), id = ref.slice(2);
    let t = cell;
    if (kind === 'q' && id === 'location') t = cell + 'の' + c.sm.cc.replace(/（.*）/, '');
    else if (GENERIC.indexOf(cell) >= 0) {
      const l = shortLabel(kind === 'q' ? SIM.Q[id].l : SIM.E[id].l);
      t = cell.indexOf(l) >= 0 ? cell : l + '（' + cell + '）';
    }
    return /[るうくすつむぬぶぐ]$/.test(t) ? t + 'こと' : t;
  }
  function similarDiseases(c) {
    const key = d => Object.keys(c.dq[d] || {}).map(x => 'q' + x).concat(Object.keys(c.de[d] || {}).map(x => 'e' + x));
    const mine = key(c.dis);
    const rfSet = c.rf.map(x => x.cato);
    return SYM[c.sym].diseases.filter(d => d !== c.dis).map(d => {
      const theirs = key(d);
      const shared = theirs.filter(x => mine.indexOf(x) >= 0).length;
      const score = shared / Math.max(1, uniq(theirs.concat(mine)).length) + (rfSet.indexOf(d) >= 0 ? 0.3 : 0);
      return { d, score };
    }).sort((a, b) => b.score - a.score);
  }
  // 疾患 d を下げる根拠になる「この患者にはなかった所見」
  function againstReasons(c, d) {
    const out = [];
    const qs = Object.keys(c.dq[d] || {}), es = Object.keys(c.de[d] || {});
    es.filter(id => ['vitals', 'consciousness', 'general'].indexOf(id) < 0).forEach(id => {
      if (reasonValid(c, d, 'e:' + id)) out.push({ ref: 'e:' + id, text: findingText(c, 'e:' + id, c.de[d][id][0]) });
    });
    qs.forEach(id => { if (reasonValid(c, d, 'q:' + id)) out.push({ ref: 'q:' + id, text: findingText(c, 'q:' + id, c.dq[d][id][0]) }); });
    es.filter(id => ['vitals', 'consciousness', 'general'].indexOf(id) >= 0).forEach(id => {
      if (reasonValid(c, d, 'e:' + id)) out.push({ ref: 'e:' + id, text: findingText(c, 'e:' + id, c.de[d][id][0]) });
    });
    return out;
  }
  function presentation(c) {
    const p = c.p, sm = c.sm, v = c.vitals;
    const sec = [];
    const ccWord = sm.cc.replace(/（.*）/, '');
    const intro = p.informant === 'parent' ? p.ageLabel + 'の' + p.sexLabel + '。' + p.relation + 'に連れられて、' + sm.cc + 'を主訴に受診されました。'
      : p.ageLabel + 'の' + p.sexLabel + '。' + sm.cc + 'を主訴に受診されました。';
    sec.push({ time: '10秒', title: '冒頭', lines: [intro] });

    const chartsOf = q => uniq(itemsOf(c, q).map(i => i.chart));
    const hpiLines = [];
    const onsetItems = itemsOf(c, 'onset');
    if (c.openOv && c.openOv.hpi) hpiLines.push(c.openOv.hpi);
    else if (sm.event) hpiLines.push((onsetItems.length ? '発症様式は' + chartsOf('onset').join('・') + '。' : '') + sm.event.replace('{t}', c.onsetMed));
    else hpiLines.push((onsetItems.length ? '発症様式は' + chartsOf('onset').join('・') + 'で、' : c.onsetMed + '、') + ccWord + 'が出現しました。');
    const seenHpi = [];
    const hp = HPI_ORDER.filter(q => q !== 'onset' && itemsOf(c, q).some(i => i.src === 'primary')).map(q => {
      const t = chartsOf(q).filter(x => seenHpi.indexOf(x) < 0);
      t.forEach(x => seenHpi.push(x));
      if (!t.length) return null;
      const joined = t.join('・');
      return joined.indexOf(HPI_SHORT[q]) >= 0 ? joined : HPI_SHORT[q] + 'は' + joined;
    }).filter(Boolean);
    if (hp.length) hpiLines.push(hp.join('、') + 'です。');
    const rosPos = uniq([].concat(...Object.keys(c.q).filter(q => SIM.Q[q].g === 'ros')
      .map(q => itemsOf(c, q).filter(i => !i.neg && i.src !== 'cc').map(i => i.chart))));
    if (rosPos.length) hpiLines.push('随伴症状として、' + rosPos.join('、') + 'を認めます。');
    const negList = uniq([].concat(...Object.keys(c.q).filter(q => SIM.Q[q].g === 'ros').map(q => itemsOf(c, q).filter(i => i.neg).map(i => i.chart))));
    c.rf.forEach(x => {
      if (!x.cato || x.cato === c.dis) return;
      Object.keys(c.dq[x.cato] || {}).forEach(qid => {
        if (SIM.Q[qid].g !== 'ros' || itemsOf(c, qid).some(i => !i.neg)) return;
        c.dq[x.cato][qid].forEach(cell => { if (negList.length < 6 && !negList.some(n => related(n, cell))) negList.push(cell); });
      });
    });
    if (negList.length) hpiLines.push('一方、' + negList.join('、') + 'は認めません。');
    sec.push({ time: '60秒', title: '現病歴', lines: hpiLines });

    const bgv = q => { const t = chartsOf(q); return t.length ? t.join('・') : null; };
    const bgLines = [];
    bgLines.push('既往歴は' + (bgv('pmh') || '特記事項なし') + '。内服薬は' + (bgv('meds') || 'なし') + '。アレルギーは' + (bgv('allergy') || 'なし') + '。家族歴は' + (bgv('family') || '特記事項なし') + '。');
    if (p.age >= 15) bgLines.push('飲酒は' + (bgv('alcohol') || (p.age < 20 ? 'なし' : '機会飲酒程度')) + '、喫煙は' + (bgv('smoking') || 'なし') + '。');
    const life = ['occupation', 'living', 'contacts', 'exposure', 'travel', 'food', 'diet', 'stress'].map(q => {
      const t = bgv(q);
      if (q === 'occupation') return LIFE_LABEL[q] + '：' + (t || p.occShort);
      if (q === 'living') return LIFE_LABEL[q] + '：' + (t || p.livShort);
      if (q === 'travel' && t) return t.indexOf('渡航') >= 0 ? t : '海外渡航歴あり（' + t + '）';
      return t ? LIFE_LABEL[q] + '：' + t : null;
    }).filter(Boolean);
    bgLines.push('生活歴は、' + life.join('、') + '。');
    if (p.sex === 'F' && p.age >= 12 && p.age < 55) bgLines.push('月経は' + (bgv('menses') || '順調') + '、妊娠の可能性は' + (bgv('preg') ? 'あり' : 'なし') + 'とのことです。');
    bgLines.push('解釈モデルとして、「' + (sm.ice || '').replace(/。$/, '') + '」とのことです。');
    sec.push({ time: '30秒', title: '既往〜生活歴', lines: bgLines });

    const exLines = [];
    // 全身状態は良好か不良かだけを述べ、全身の所見（るい痩・刺し口など）は陽性所見の先頭に回す
    const gen = uniq((c.e.general || []).filter(i => !i.neg).map(i => i.text));
    const cons = uniq((c.e.consciousness || []).map(i => i.text));
    const genState = gen.indexOf('比較的元気') >= 0 ? '比較的良好' : looksSick(c) || gen.some(t => /重篤|ぐったり|苦悶|会話困難/.test(t)) ? '不良' : '良好';
    exLines.push('全身状態は' + genState + '。' + (cons.length ? '意識レベルの評価では、' + cons.join('・') + '。' : '意識は清明です。'));
    exLines.push('バイタルサインは、血圧 ' + v.sbp + '/' + v.dbp + ' mmHg、脈拍 ' + v.hr + '/分・' + (v.irregular ? '不整' : '整') + '、呼吸数 ' + v.rr + '/分、体温 ' + v.bt.toFixed(1) + '℃、SpO2 ' + v.spo2 + '%（室内気）です。');
    const exPos = gen.filter(t => t !== '比較的元気');
    if (v.ortho.pos) exPos.push('起立時の血圧低下');
    if (v.bpPos) exPos.push('両上肢の血圧左右差');
    EXAM_ORDER.forEach(e => {
      if (['general', 'consciousness', 'vitals', 'bpboth', 'ortho'].indexOf(e) >= 0) return;
      uniq((c.e[e] || []).filter(i => !i.neg).map(i => i.text)).forEach(t => { if (exPos.indexOf(t) < 0) exPos.push(t); });
    });
    if (exPos.length) exLines.push('陽性所見として、' + exPos.join('、') + 'を認めます。');
    const negE = [];
    c.rf.forEach(x => {
      if (!x.cato || x.cato === c.dis) return;
      Object.keys(c.de[x.cato] || {}).forEach(eid => {
        if (['vitals', 'general', 'consciousness'].indexOf(eid) >= 0 || (c.e[eid] || []).some(i => !i.neg)) return;
        if (eid === 'bpboth' && v.bpPos) return;
        if (eid === 'ortho' && v.ortho.pos) return;
        c.de[x.cato][eid].forEach(t => {
          const ft = findingText(c, 'e:' + eid, t);
          if (negE.length < 5 && !negE.some(n => related(n, ft))) negE.push(ft);
        });
      });
    });
    if (negE.length) exLines.push('一方、' + negE.join('、') + 'は認めません。');
    sec.push({ time: '40秒', title: '身体所見', lines: exLines });

    const asLines = [];
    // 根拠は、暗記用ノートで「→ この疾患」の左に出てくる所見を優先する
    const N = NOTES.symptoms[c.sym];
    const cues = [];
    if (N) N.interview.concat(N.exam.map(x => [null, x[0], x[1]])).forEach(x => {
      if (x[2].some(n => (N.alias[n] || n) === c.dis)) x[1].split(/[・＋、]/).forEach(t => cues.push(t.replace(/（.*?）/g, '')));
    });
    const inNotes = t => cues.some(k => k.length >= 2 && (t.indexOf(k) >= 0 || k.indexOf(t) >= 0));
    const evs = [];
    EXAM_ORDER.forEach(e => (c.e[e] || []).forEach(i => {
      if (i.src === 'primary' && !i.neg && ['vitals', 'consciousness', 'general'].indexOf(e) < 0) evs.push({ t: findingText(c, 'e:' + e, i.text), raw: i.text });
    }));
    Object.keys(c.q).forEach(q => itemsOf(c, q).forEach(i => { if (i.src === 'primary' && !i.neg) evs.push({ t: findingText(c, 'q:' + q, i.chart), raw: i.chart }); }));
    ['vitals', 'consciousness', 'general'].forEach(e => (c.e[e] || []).forEach(i => { if (i.src === 'primary' && !i.neg) evs.push({ t: findingText(c, 'e:' + e, i.text), raw: i.cell }); }));
    if (!evs.length) Object.keys(c.q).forEach(q => itemsOf(c, q).forEach(i => { if (i.src === 'primary') evs.push({ t: findingText(c, 'q:' + q, i.chart), raw: i.chart }); }));
    const evSorted = evs.filter(x => inNotes(x.raw)).concat(evs.filter(x => !inNotes(x.raw)));
    const ev = uniq(evSorted.map(x => x.t)).slice(0, 2);
    asLines.push('以上から、最も考えられるのは' + c.dis + 'です。' + (ev.length ? '根拠は' + ev.join('と') + 'です。' : ''));
    const rfFirst = c.rf.find(x => x.cato && !related(x.cato, c.dis) && againstReasons(c, x.cato).length);
    const dds = similarDiseases(c).filter(x => !related(x.d, c.dis) && (!rfFirst || x.d !== rfFirst.cato))
      .map(x => ({ d: x.d, why: againstReasons(c, x.d)[0] })).filter(x => x.why).slice(0, 2);
    dds.forEach(x => asLines.push('鑑別として' + x.d + 'を挙げますが、' + x.why.text + 'がないため考えにくいです。'));
    if (c.isRF) asLines.push(c.dis + 'は見逃してはいけない疾患で、緊急性が高いと考えます。');
    let rfWhy = null;
    if (rfFirst) {
      rfWhy = againstReasons(c, rfFirst.cato)[0];
      asLines.push('見逃してはいけない' + rfFirst.cato + 'は、' + rfWhy.text + 'がないため可能性は低いと考えます。');
    }
    sec.push({ time: '70秒', title: 'アセスメント', lines: asLines });
    return { sections: sec, ddx: dds, rf: rfFirst ? { d: rfFirst.cato, why: rfWhy } : null };
  }

  // ---- 質問・診察の一覧（患者に合わせて出し分け）----
  function questionList(c) {
    return Object.keys(SIM.Q).filter(qid => qAllowed(qid, c.p)).map(qid => Object.assign({ id: qid }, SIM.Q[qid]));
  }
  function examList() {
    return Object.keys(SIM.E).map(eid => Object.assign({ id: eid }, SIM.E[eid]));
  }

  // ---- クイズ ----
  function noteNames(sym) {
    const N = NOTES.symptoms[sym];
    const set = [];
    const add = n => { if (set.indexOf(n) < 0) set.push(n); };
    N.interview.forEach(x => x[2].forEach(add));
    N.exam.forEach(x => x[1].forEach(add));
    N.redFlags.forEach(add);
    return set;
  }
  function quizCue(r, sym) {
    const syms = sym ? [sym] : Object.keys(NOTES.symptoms);
    for (let tries = 0; tries < 50; tries++) {
      const s = pick(r, syms);
      const N = NOTES.symptoms[s];
      const lines = N.interview.map(x => ({ kind: '問診', label: x[0], cue: x[1], dx: x[2] })).concat(N.exam.map(x => ({ kind: '診察', label: '', cue: x[0], dx: x[1] })));
      if (!lines.length) continue;
      const L = pick(r, lines);
      const pool = noteNames(s).filter(n => L.dx.indexOf(n) < 0);
      if (pool.length < 3) continue;
      const answer = pick(r, L.dx);
      const options = shuffle(r, [answer].concat(shuffle(r, pool).slice(0, 3)));
      return { type: 'cue', sym: s, kind: L.kind, label: L.label, cue: L.cue, answer, all: L.dx, options };
    }
    return null;
  }
  function quizRF(r, sym) {
    const syms = (sym ? [sym] : Object.keys(NOTES.symptoms)).filter(s => NOTES.symptoms[s].redFlags.length);
    if (!syms.length) return null;
    const s = pick(r, syms);
    const N = NOTES.symptoms[s];
    const pool = noteNames(s).filter(n => N.redFlags.indexOf(n) < 0);
    const options = shuffle(r, N.redFlags.concat(shuffle(r, pool).slice(0, Math.max(3, 8 - N.redFlags.length))));
    return { type: 'rf', sym: s, answer: N.redFlags.slice(), options };
  }
  function quizFirst(r, sym) {
    const syms = (sym ? [sym] : Object.keys(NOTES.symptoms)).filter(s => NOTES.symptoms[s].first.some(f => f.br.length >= 2));
    if (!syms.length) return null;
    const s = pick(r, syms);
    const N = NOTES.symptoms[s];
    const f = pick(r, N.first.filter(x => x.br.length >= 2));
    const b = pick(r, f.br);
    const wrong = f.br.filter(x => x !== b).map(x => x[1]);
    const others = [];
    Object.keys(NOTES.symptoms).forEach(k => NOTES.symptoms[k].first.forEach(ff => ff.br.forEach(bb => {
      if (bb[1] !== b[1] && wrong.indexOf(bb[1]) < 0 && others.indexOf(bb[1]) < 0) others.push(bb[1]);
    })));
    const options = shuffle(r, [b[1]].concat(wrong.slice(0, 3)).concat(shuffle(r, others).slice(0, Math.max(0, 3 - wrong.length))));
    return { type: 'first', sym: s, ask: f.ask, cond: b[0], answer: b[1], options, all: f.br };
  }

  root.OSCE_ENGINE = {
    mulberry32, shuffle, symptomList, buildCase, newState, ask, examine, examText, chartEntries, score, presentation,
    questionList, examList, reasonValid, routeInterview, routeExam, resolveNoteName, formatVitals, vitalsFlags, vitalsAbnormal,
    quizCue, quizRF, quizFirst, bgChecklist, clean, findingText, HPI_ORDER, EXAM_ORDER
  };
})(typeof window !== 'undefined' ? window : globalThis);
