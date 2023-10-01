import { Hono } from 'hono'
import { WebhookEvent } from '@line/bot-sdk'
import { z } from 'zod'
import { replyMessage, sendMessage, validateSignature } from '../logic/line'
import { chat } from '../logic/openai'

export const lineBotRoute = new Hono()

const envVariables = z.object({
  OPEN_AI_KEY: z.string().min(1),
  LINE_ACCESS_TOKEN: z.string().min(1),
  LINE_CHANNEL_SECRET: z.string().min(1),
})

async function callOpenAIAndReply(message: string, apiKey: string, replyToken: string, lineAccessToken: string, userId: string) {
  // await replyMessage('質問の回答を考えています...', replyToken, lineAccessToken)
  const answer = await chat(message, apiKey)
  console.log(answer)
  const sended = await replyMessage(answer, replyToken, lineAccessToken)
  if (!sended) {
    // 返信は有効期限がありOpenAIでの結果が返信の有効期間中に帰ってこないことがある
    // その場合は通常のメッセージとして送る
    await sendMessage(answer, userId, lineAccessToken)
  }
  return answer
}

lineBotRoute.post('/', async (c) => {
  const start = new Date().getTime()
  try {
    const { LINE_ACCESS_TOKEN, LINE_CHANNEL_SECRET, OPEN_AI_KEY } = envVariables.parse(c.env)
    const bodyText = await c.req.text()
    console.log(`bodyText: ${bodyText}`)

    // Cloudflare Workers では @line/bot-sdk の実体にアクセスするとエラーになる。
    // このため型は利用するが実体の @line/bot-sdk#validateSignature は利用しないようにする。
    if (!validateSignature(bodyText, LINE_CHANNEL_SECRET, c.req.raw.headers.get('x-line-signature') ?? '')) {
      c.status(400)
      return c.json({
        error: 'Bad Request',
      })
    }
    console.log(`finish validateSignature. ${new Date().getTime() - start}[ms]`)
    /*
    console.log({
      Path: c.req.path,
      Method: c.req.method,
      Body: bodyText,
      Headers: c.req.header(),
    })
    */

    // Hono では上で c.req.text() でBodyの中身を取得した後に、 c.req.json() を呼び出すと空になってしまう
    // const json = await c.req.json()
    const json = JSON.parse(bodyText)
    const events: WebhookEvent[] = json.events

    if (events.length > 0) {
      const event = events[0]
      if (event.type === 'message') {
        const receivedMessage = event.message
        if (receivedMessage.type === 'text' && event.source.userId) {
          /*
          @line/bot-sdk ではなく自前でLINEのRestAPIを呼び出すように実装する
  
          const client = new Client({
            channelAccessToken: LINE_ACCESS_TOKEN,
            channelSecret: LINE_CHANNEL_SECRET,
          })
          client.replyMessage(event.replyToken, {
            type: 'text',
            text: receivedMessage.text,
          },)
          */

          // executionCtx で囲まないとクライアント(LINEのWebHookの接続が切れるのか、 このリクエストの処理が Canceled になって終了してしまう)
          c.executionCtx.waitUntil(callOpenAIAndReply(receivedMessage.text, OPEN_AI_KEY, event.replyToken, LINE_ACCESS_TOKEN, event.source.userId))
        } else {
          await replyMessage('メッセージを入力してください（スタンプだけとか画像だけだと回答できません）', event.replyToken, LINE_ACCESS_TOKEN)
        }
      }
    }

    return c.json({
      result: 'OK',
    })
  } catch (e) {
    console.error(e)

    c.status(500)
    return c.json({
      error: 'Error',
    })
  } finally {
    console.log(`finish webhook. ${new Date().getTime() - start}[ms]`)
  }
})
