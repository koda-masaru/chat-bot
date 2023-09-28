import { OpenAI } from 'openai'

export async function chat(chat_message: string, apiKey: string) {
  const start = new Date().getTime()
  console.log(`start call OpenAI.`)
  let answer = ''
  if (chat_message.length > 5) {
    console.log(`Request to OpenAI API. ${chat_message}`)
    const openai = new OpenAI({
      apiKey,
    })
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      messages: [{ role: 'user', content: chat_message }],
    })
    answer = response.choices[0].message?.content ?? ''
  } else {
    answer = '質問は5文字以上で入力してください'
  }
  console.log(`Result from OpenAI API. ${answer}`)
  console.log(`finish call OpenAI. ${new Date().getTime() - start}[ms]`)
  return answer
}
