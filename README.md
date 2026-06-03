# Next_Gen_AI'sPractice_enaharu

React + Vite の初期画面へリセット済みの、モック制作向けテンプレートです。現在の実装は 1 画面構成で、ローカル起動と GitHub Pages 配備の両方を前提に最小構成へ整理しています。

## 現在の状態

- 旧アプリ固有実装を削除し、React + Vite の初期画面へ初期化済み
- 画面数は 1 画面
- CI はビルドと lint を実行
- CD は GitHub Pages へ配備できる構成
- 作業報告テンプレートは [docs/one-day-report.md](docs/one-day-report.md)

## ローカル環境構築

前提:

- Node.js 20 以上
- npm 10 以上

セットアップ:

```bash
npm install
```

開発サーバー起動:

```bash
npm run dev
```

ブラウザ確認先:

- http://localhost:5173/

品質確認:

```bash
npm run lint
npm run build
```

本番ビルドのローカル確認:

```bash
npm run preview
```

## インストールされる主要構成

- React 19
- Vite 7
- TypeScript 5
- ESLint 9
- GitHub Actions による CI/CD

補足:

- 今回の初期状態では HashRouter は不要です
- GitHub Pages 配備時は [.github/workflows/cd.yml](.github/workflows/cd.yml) がリポジトリ名に応じてベースパスを解決します

## GitHub リポジトリ作成と紐付けコマンド

ローカル完結でテンプレート化する場合は、この節の実行は不要です。後から GitHub に公開する場合だけ使ってください。

### GitHub CLI を使う場合

```bash
git init
git branch -M main
gh repo create next-gen-ais-practice-name --public --source . --remote origin --push
```

既存 remote を差し替える場合:

```bash
git remote remove origin
gh repo create next-gen-ais-practice-name --public --source . --remote origin --push
```

### GitHub CLI を使わない場合

GitHub 上で空リポジトリを作成後、以下を実行します。

```bash
git init
git branch -M main
git remote add origin https://github.com/<your-account>/next-gen-ais-practice-name.git
git add .
git commit -m "chore: initialize Next_Gen_AI'sPractice<name> template"
git push -u origin main
```

## CI/CD

CI:

- [ .github/workflows/ci.yml ](.github/workflows/ci.yml)
- push と pull_request を契機に npm ci, npm run lint, npm run build を実行

CD:

- [ .github/workflows/cd.yml ](.github/workflows/cd.yml)
- main への push で GitHub Pages へ配備

GitHub Pages の制作物 URL:

- https://enaharu.github.io/next-gen-ais-practice-enaharu/

/* README から制作物へ飛ぶリンクとして使う場合は、リポジトリ作成後にこの URL を確定値へ置き換えてください。→完了 */

## 提出物

- リポジトリ URL
- 1 人日をどう使ったかの報告 md

報告用テンプレート:

- [docs/one-day-report.md](docs/one-day-report.md)

## ディレクトリ構成

```text
.
├─ .github/
│  ├─ ISSUE_TEMPLATE/
│  └─ workflows/
├─ docs/
├─ public/
└─ src/
```

## 準備完了の判定

以下を満たせば準備完了です。

1. `npm run dev` で React の初期画面が表示される
2. `npm run build` が成功する
3. GitHub に接続する場合は Actions が成功する
4. README から公開 URL に遷移できる

