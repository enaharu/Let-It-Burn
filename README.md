# Let It Burn

モヤモヤした気持ちを紙に書き、炎にくべることで気持ちを切り替えるためのWebアプリです。

入力した言葉が燃えて灰になるまでをアニメーションで表現し、利用を重ねるとEXPや実績が増えていきます。

## デモ

[Let It Burnを試す](https://enaharu.github.io/Let-It-Burn/)

## 主な機能

- 200文字までの気持ちや考えを書き出せる入力フォーム
- 紙が落下し、焦げ、燃え尽きるまでのアニメーション
- 利用回数に応じて成長するレベル・EXPシステム
- 条件を満たすと解除される実績と通知
- PCとスマートフォンに対応したレスポンシブ表示
- 進行状況のブラウザ保存

## 使い方

1. 今の気持ちや手放したいことを入力します。
2. ボタンを押して、書いた紙を炎にくべます。
3. 紙が燃え尽きるまで眺めたら、次の気持ちを書き出せます。

## ローカルで動かす

### 必要な環境

- Node.js 20以上
- npm

### セットアップ

```bash
git clone https://github.com/enaharu/Let-It-Burn.git
cd Let-It-Burn
npm ci
npm run dev
```

開発サーバーの起動後、ターミナルに表示されたURLをブラウザで開いてください。通常は `http://localhost:5173/` です。

## npmスクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | TypeScriptの型チェックと本番ビルドを実行 |
| `npm run lint` | ESLintによる静的解析を実行 |
| `npm run preview` | 本番ビルドをローカルで確認 |

## 使用技術

- React
- TypeScript
- Vite
- Framer Motion
- HTML Canvas
- GitHub Actions / GitHub Pages

## ディレクトリ構成

```text
.
├─ .github/workflows/   # CI/CD
├─ public/              # 動画・アイコンなどの静的ファイル
└─ src/
   ├─ components/       # 画面を構成するUIコンポーネント
   ├─ hooks/            # EXP・実績などの状態管理
   ├─ types/            # TypeScriptの型定義
   ├─ App.tsx           # 画面遷移と全体構成
   └─ main.tsx          # エントリーポイント
```

## データの扱い

入力した文章はサーバーへ送信せず、ブラウザ上でのみ扱います。文章そのものは保存されません。

レベル、EXP、燃焼回数、解除済みの実績は、ブラウザの `localStorage` に保存されます。別のブラウザや端末には引き継がれません。

## CI/CD

- `main` ブランチへのpushとPull Requestで、lintとビルドを自動実行します。
- `main` ブランチへのpush後、GitHub Pagesへ自動デプロイします。
