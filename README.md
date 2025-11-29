# AI Chat App (Day 001)

Google Gemini 2.5 Flash をストリーミングで呼び出すミニマルなチャットアプリです。フロントエンドは React + Vite、バックエンドは Hono（Bun）で構成し、Shadcn UI 風のコンポーネントでシンプルな体験を提供します。

## デモ
![チャットアプリの動作例](./assets/チャットアプリ_デモ動画.gif)

## 主な特徴
- Gemini 2.5 Flash へのチャット API をストリーミングで呼び出し、受信した文字列を逐次描画
- Markdown + シンタックスハイライト対応のメッセージ表示 (`react-markdown` / `react-syntax-highlighter`)
- Enter 送信・Shift+Enter 改行、ステータスバッジ表示、履歴リセットボタン
- 自動スクロール付きのチャット履歴、ローディングインジケーター付きのストリーミング表示
- CORS をローカル開発向けに許可済み（デフォルトで http://localhost:5173 からアクセス可能）

## ディレクトリ構成
- `frontend/` : React + Vite 製 UI。Tailwind CSS v4, Shadcn 由来の UI パーツを使用。
- `backend/`  : Bun + Hono で構築した Gemini プロキシ API。`/chat/stream` でストリーム配信。
- `assets/`   : デモ GIF などのアセット。

## 動作環境
- Node.js 18+（フロントエンド開発用）
- Bun 1.3+（バックエンド実行用）
- Google API キー（環境変数 `GOOGLE_API_KEY` に設定）

## セットアップ手順
### 1) バックエンド (Hono + Bun)
```bash
cd backend
bun install
export GOOGLE_API_KEY="あなたのキー"
bun run index.ts   # ポート 3000 で起動
```

### 2) フロントエンド (React + Vite)
```bash
cd frontend
npm install
npm run dev  # デフォルトで http://localhost:5173
```

ブラウザで `http://localhost:5173` を開き、チャットを開始してください。

## 使い方
- 画面下部のテキストエリアに質問を入力し、Enter で送信（Shift+Enter で改行）。
- 生成中は「ストリーミング中」ラベルとステータスバッジが表示され、レスポンスが到着した順に描画されます。
- 会話をクリアしたい場合はヘッダーの「履歴リセット」をクリックします。

## 設定メモ
- API エンドポイントは `backend/index.ts` の `APP_URL` と `frontend/src/hooks/useChat.ts` の `API_URL` で指定しています。ポートを変更する場合は両方を揃えてください。
- `GOOGLE_API_KEY` が未設定の場合、バックエンド起動時に認証エラーとなります。

## ビルド・その他コマンド
- フロントエンドビルド: `npm run build`
- フロントエンド lint: `npm run lint`
- バックエンド依存関係インストール: `bun install`

## ライセンス
このリポジトリは学習用サンプルです。必要に応じて各自のポリシーに従ってご利用ください。
