import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { OpenAI } from 'openai'

export const uiRoute = new Hono()

uiRoute.get('/', (c) => {
  return c.html(
    <html>
      <head>
        <link
          href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
          rel='stylesheet'
          integrity='sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM'
          crossorigin='anonymous'
        />
      </head>
      <body>
        <nav class='navbar navbar-dark bg-dark'>
          <div class='container-fluid'>
            <a class='navbar-brand' href='#'>
              Chat
            </a>
          </div>
        </nav>

        <div class='container' style='margin-top: 10px;'>
          <form action='/ui/chat' method='post' id='chat-form'>
            <div class='mb-3'>
              <label for='exampleFormControlTextarea1' class='form-label'>
                チャットメッセージ入力
              </label>
              <textarea class='form-control' name='chat_message' rows='3'></textarea>
            </div>

            <div class='mb-3'>
              <button type='submit' class='btn btn-primary' id='submit-button'>
                送信
              </button>
            </div>
          </form>
        </div>

        <div class='modal fade' id='waitModal' tabindex='-1' aria-labelledby='waitModalLabel' aria-hidden='true' data-bs-backdrop="static">
          <div class='modal-dialog'>
            <div class='modal-content'>
              <div class='modal-header'>
                <h1 class='modal-title fs-5' id='waitModalLabel'>
                  実行中
                </h1>
              </div>
              <div class='modal-body'>しばらくお待ちください</div>
            </div>
          </div>
        </div>

        <footer class='footer mt-auto py-3 bg-body-tertiary'>
          <div class='container'>
            <span class='text-body-secondary'>Chat bot sample</span>
          </div>
        </footer>

        <script
          src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
          integrity='sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz'
          crossorigin='anonymous'
        ></script>
        <script src='/static/common.js'></script>
      </body>
    </html>
  )
})

const chatMessageSchema = z.object({
  chat_message: z.string(),
})
const envVariables = z.object({
  OPEN_AI_KEY: z.string().min(1),
})

uiRoute.post('/chat', zValidator('form', chatMessageSchema), async (c) => {
  const env = envVariables.parse(c.env)
  const { chat_message } = c.req.valid('form')

  let answer = ''
  if (chat_message.length > 5) {
    const openai = new OpenAI({
      apiKey: env.OPEN_AI_KEY,
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

  return c.html(
    <html>
      <head>
        <link
          href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
          rel='stylesheet'
          integrity='sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM'
          crossorigin='anonymous'
        />
      </head>
      <body>
        <nav class='navbar navbar-dark bg-dark'>
          <div class='container-fluid'>
            <a class='navbar-brand' href='#'>
              Chat
            </a>
          </div>
        </nav>

        <div class='container' style='margin-top: 10px;'>
          <form action='/ui/chat' method='post' id='chat-form'>
            <div class='mb-3'>
              <label class='form-label'>チャットメッセージ入力</label>
              <textarea class='form-control' name='chat_message' rows='3'>
                {chat_message}
              </textarea>
            </div>

            <div class='mb-3'>
              <button type='submit' class='btn btn-primary' id='submit-button'>
                送信
              </button>
            </div>
          </form>

          <div class='mb-3'>
            <label class='form-label'>回答</label>
            <pre style='white-space: pre-wrap; border: 1px solid gray; padding: 5px;'>{answer}</pre>
          </div>
        </div>

        <div class='modal fade' id='waitModal' tabindex='-1' aria-labelledby='waitModalLabel' aria-hidden='true' data-bs-backdrop="static">
          <div class='modal-dialog'>
            <div class='modal-content'>
              <div class='modal-header'>
                <h1 class='modal-title fs-5' id='waitModalLabel'>
                  実行中
                </h1>
              </div>
              <div class='modal-body'>しばらくお待ちください</div>
            </div>
          </div>
        </div>

        <footer class='footer mt-auto py-3 bg-body-tertiary'>
          <div class='container'>
            <span class='text-body-secondary'>Chat bot sample</span>
          </div>
        </footer>

        <script
          src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
          integrity='sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz'
          crossorigin='anonymous'
        ></script>
        <script src='/static/common.js'></script>
      </body>
    </html>
  )
})
