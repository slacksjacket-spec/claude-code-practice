# Claude Code 練習

Claude Codeを使ったプログラミング学習用のリポジトリです。合唱・音楽理論への興味をきっかけに、コードの聞き取り練習アプリや音声解析ツールを作りながら勉強しています。

## 中身

- **[chord-quiz](chord-quiz/index.html)** — コード当てゲーム。ランダムに鳴らされた和音の種類(メジャー/マイナー/7th/テンション系など)を選択肢から当てる練習アプリ。
  - `index.html` — クイズ本体
  - `practice.html` — ルートとコードの種類を自由に選んで鳴らせる再生ツール
  - `chords.js` — コードライブラリ(和音の音程定義)
  - `audio.js` — Web Audio APIによるピアノ風の音声合成
- **[chord-visualizer](chord-visualizer/index.html)** — マイク入力の音量・周波数スペクトラム・音程(セント単位のズレ)をリアルタイム表示するビジュアライザー。
- **[medical-english](medical-english/index.html)** — 医学英語を接頭辞・語根・接尾辞に分解して体系的に覚えるドリル。英文論文(NEJMなど)の抄読会を想定した構成。
  - `index.html` — 語源辞典 / 分解トレーニング / 意味クイズ / 組み立て / 論文語彙 / 学習状況の6タブ
  - `morphemes.js` — 語源データ。3つの層で構成:
    - ①臨床用語の語源(接頭辞・語根・接尾辞 246件)＋分解済みの医学用語 162語
    - ②薬剤ステム 44件(`-pril`=ACE阻害薬、`-mab`=モノクローナル抗体 など、語尾で薬効分類が読める)
    - ③論文語彙 73件(hazard ratio、intention-to-treat など、語源分解では意味が出てこない層)
  - ギリシャ語・ラテン語の複数形(metastasis→metastases など)の一覧つき
  - 成績はlocalStorageに保存され、間違えた項目が優先的に出題されます
- **[claude-code-guide.html](claude-code-guide.html)** — Claude Codeの使い方をまとめた個人用ガイド(Windows版)。
- **[hello.txt](hello.txt)** — はじめの自己紹介メモ。

## 使い方

ビルド不要の静的HTML/JSアプリです。各HTMLファイルをブラウザで直接開くだけで動作します(音声を使う機能はブラウザのマイク・オーディオ許可が必要です)。
