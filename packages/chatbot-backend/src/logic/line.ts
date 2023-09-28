import { Message, TextMessage } from '@line/bot-sdk'

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let c = 0; c < hex.length; c += 2) bytes[c / 2] = parseInt(hex.substring(c, c + 2), 16)

  return bytes.buffer
}

export async function validateSignature(payload: string, signature: string, secret: string) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
  const verified = await crypto.subtle.verify('HMAC', key, hexToBytes(signature), encoder.encode(payload))

  return verified
}

export async function replyMessage(text: string, replyToken: string, accessToken: string) {
  const response: TextMessage = {
    type: 'text',
    text,
  }
  await fetch('https://api.line.me/v2/bot/message/reply', {
    body: JSON.stringify({
      replyToken,
      messages: [response],
    }),
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
}

export type LinePushMessage = { to: string; messages: Message | Message[] }

export async function sendMessage(text: string, to: string, accessToken: string) {
  const response: TextMessage = {
    type: 'text',
    text,
  }
  const message: LinePushMessage = {
    to,
    messages: [response],
  }
  await fetch('https://api.line.me/v2/bot/message/push', {
    body: JSON.stringify(message),
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
}
