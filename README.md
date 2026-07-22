# Claude Code 練習

Claude Codeを使ったプログラミング学習用のリポジトリです。合唱・音楽理論への興味をきっかけに、コードの聞き取り練習アプリや音声解析ツールを作りながら勉強しています。

## 中身

- **[chord-quiz](chord-quiz/index.html)** — コード当てゲーム。ランダムに鳴らされた和音の種類(メジャー/マイナー/7th/テンション系など)を選択肢から当てる練習アプリ。
  - `index.html` — クイズ本体
  - `practice.html` — ルートとコードの種類を自由に選んで鳴らせる再生ツール
  - `chords.js` — コードライブラリ(和音の音程定義)
  - `audio.js` — Web Audio APIによるピアノ風の音声合成
- **[chord-visualizer](chord-visualizer/index.html)** — マイク入力の音量・周波数スペクトラム・音程(セント単位のズレ)をリアルタイム表示するビジュアライザー。
- **[claude-code-guide.html](claude-code-guide.html)** — Claude Codeの使い方をまとめた個人用ガイド(Windows版)。
- **[hello.txt](hello.txt)** — はじめの自己紹介メモ。

## 使い方

ビルド不要の静的HTML/JSアプリです。各HTMLファイルをブラウザで直接開くだけで動作します(音声を使う機能はブラウザのマイク・オーディオ許可が必要です)。
