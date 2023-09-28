# OpenAI APIでチャットに返信するチャットボットのサービス

## 利用するサービスに登録

- **基本的に全て無料枠で試す事ができると思います**

1. CloudFlare にサインアップし CloudFlare Workers を使えるようにする
   - アカウントを作成しメールの送達確認まで実施
1. LINE にビジネスアカウントを作成し、LINEの公式アカウントを作成できるようにする
   - Messaging API を作成し、チャネルシークレットとチャネルアクセストークンを控えておく
1. OpenAI にサインアップして、OpenAIのAPIを呼び出すためのトークンを発行する

## ローカルでの動作確認

- LINEのチャットbotの機能はデプロイしないと動作確認ができないため、UIでOpenAIを呼び出すところまでを動作確認します

1. このリポジトリをクローンする
1. `packages/chatbot-backend` で `yarn install` を実行
1. `.dev.sample.vars` をコピーし、 `.dev.vars` を作成
   - Basic 認証用の `USER_NAME`, `PASSWORD` を任意の値でセット
   - `OPEN_AI_KEY` に OpenAIのAPI用のトークンをセット
   - `LINE_ACCESS_TOKEN`, `LINE_CHANNEL_SECRET` もセット
1. `yarn dev` で起動
1. [http://localhost:8787/ui](http://localhost:8787/ui) にアクセスすると動作確認ができます

## デプロイ

1. 以下のコマンドで一度デプロイします
   - `yarn deploy`
   - デプロイすると、URLがわかるので控えておきます
1. 以下のコマンドで、 `.dev.vars` に登録した値と同様の値をデプロイするサービス用にセットします
   - `yarn wrangler secret put USER_NAME`
   - `yarn wrangler secret put PASSWORD`
   - `yarn wrangler secret put OPEN_AI_KEY`
   - `yarn wrangler secret put LINE_ACCESS_TOKEN`
   - `yarn wrangler secret put LINE_CHANNEL_SECRET`
1. LINE にビジネスアカウント にログインし、 Webhookを有効にします
   - WebHookの送信先URLは `{CloudFlare WorkersをデプロイしたURL}/line_bot`　になります
   - `Webhookの利用` をONにします
   - `応答メッセージ` を編集し、応答機能の「応答メッセージ」をOFFにします

## チャットボット経由でOpenAIに問い合わせ

- LINEの公式アカウントとお友達になります
- LINEでメッセージを送ると、OpenAIのAPIに繋いで、その結果をボットが返信します
