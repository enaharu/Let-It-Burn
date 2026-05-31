# 1人日作業報告

## プロジェクト

- 案件名: Next_Gen_AI'sPractice<name>
- リポジトリ URL: <GitHub 作成後に記載>
- 公開 URL: https://<your-account>.github.io/next-gen-ais-practice-name/

## 目的

- 顧客向けモック制作の開始点となるテンプレートを 1 人日で整備する
- React + Vite の初期画面へ戻し、次のモック制作に着手しやすい状態を作る
- README、CI/CD、提出用ドキュメントを整備する

## 1人日の使い方

1. 既存実装の調査
   - 旧アプリ固有実装、Router、テーマ処理、不要コンポーネントを確認
2. 初期化
   - React + Vite の初期画面へ戻し、不要な画面・状態管理を削除
3. リポジトリ整理
   - README 書き換え
   - プロジェクト名更新
   - 旧 AI 前提のテンプレートを GitHub Copilot 前提へ変更
4. CI/CD 整備
   - CI で lint と build を自動検証
   - CD で GitHub Pages 配備を可能にする
5. 検証
   - npm run lint
   - npm run build
   - npm run dev で初期画面確認

## AI 活用メモ

- GitHub Copilot に対して、既存実装のリセット範囲を限定して指示
- README と GitHub Actions をテンプレート用途に合わせて整備
- 不要依存と不要ディレクトリを削除し、最小構成へ整理

## 成果物

- React 初期画面が表示されるフロントエンド
- GitHub Actions の CI/CD 設定
- README
- 1 人日作業報告

## 制約への対応

- 画面数: 1 画面
- バックエンド: なし
- 認証: なし
- 目的: モック制作の初期テンプレート化

## 次にやること

- 実案件のお題に合わせて最大 3 画面までのモックへ拡張する
- GitHub リポジトリ作成後、README の公開 URL を確定値へ差し替える
