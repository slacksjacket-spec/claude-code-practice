'use strict';
// 公開用の症例データ（data-cases.js）を、非公開の CATO表（data-cato.js）と暗記用ノート（data-notes.js）から作る。
// 公開するのはシミュレーションに必要な分だけ：疾患ごとの所見（表のセル）と、症候ごとの Red Flag の疾患名。
// 表の「要確認」の印や、ノートの「→」・First・プレゼンの型・BLS は含めない。
// 使い方: node osce-sim/tools/build-cases.js （data-cato.js と data-notes.js を osce-sim/ に置いてから）
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
global.window = global;
require(path.join(dir, 'data-cato.js'));
require(path.join(dir, 'data-notes.js'));

const out = window.OSCE_CATO.map(S => {
  const N = window.OSCE_NOTES.symptoms[S.name] || { redFlags: [], alias: {} };
  // ノートでの名前を表の疾患名にそろえる（表にないものは null）
  const resolve = n => {
    const a = (N.alias && N.alias[n]) || n;
    return S.diseases.indexOf(a) >= 0 ? a : null;
  };
  const cases = {};
  S.diseases.forEach(d => {
    const pick = rows => rows.map(([, cells], i) => (cells[d] ? [i, cells[d]] : null)).filter(Boolean);
    cases[d] = { q: pick(S.interview), e: pick(S.exam) };
  });
  return {
    id: S.id, name: S.name,
    qrows: S.interview.map(r => r[0]), erows: S.exam.map(r => r[0]),
    rf: N.redFlags.map(n => [n, resolve(n)]),
    cases
  };
});

// 1症候ずつ、1疾患1行で書く（差分が読めるように）
const j = v => JSON.stringify(v);
const body = out.map(s => '  {\n' +
  '    id: ' + j(s.id) + ', name: ' + j(s.name) + ',\n' +
  '    qrows: ' + j(s.qrows) + ',\n' +
  '    erows: ' + j(s.erows) + ',\n' +
  '    rf: ' + j(s.rf) + ',\n' +
  '    cases: {\n' + Object.keys(s.cases).map(d => '      ' + j(d) + ': ' + j(s.cases[d])).join(',\n') + '\n    }\n' +
  '  }').join(',\n');
const text = "'use strict';\n" +
  '// OSCEステーションの症例データ（公開用）。tools/build-cases.js で非公開の元データから作る。手で編集しない。\n' +
  '// 症候ごとに、表の行名（qrows: 医療面接、erows: 身体診察）、Red Flag の疾患名 [ノートでの名前, 表の疾患名]、\n' +
  '// 疾患ごとの所見 [行の番号, 内容] を持つ。もとは CATO 学生配付資料（医療系大学間共用試験実施評価機構 2024）。\n' +
  'window.OSCE_CASES = [\n' + body + '\n];\n';
fs.writeFileSync(path.join(dir, 'data-cases.js'), text);
console.log('data-cases.js', out.length, 'symptoms', out.reduce((n, s) => n + Object.keys(s.cases).length, 0), 'cases', text.length, 'chars');
