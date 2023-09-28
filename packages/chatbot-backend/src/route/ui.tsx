import { Hono } from 'hono'
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

export const uiRoute = new Hono()

uiRoute.get('/', (c) => {
  return c.html(
    <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous" />
      </head>
      <body>

        <nav class="navbar navbar-dark bg-dark">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">Chat</a>
          </div>
        </nav>

        <div class="container" style="margin-top: 10px;">
          <form action="/ui/chat" method="post">
            <div class="mb-3">
              <label for="exampleFormControlTextarea1" class="form-label">チャットメッセージ入力</label>
              <textarea class="form-control" name="chat_message" rows="3"></textarea>
            </div>

            <div class="mb-3">
              <button type="submit" class="btn btn-primary">送信</button>
            </div>

          </form>
        </div>

        <footer class="footer mt-auto py-3 bg-body-tertiary">
          <div class="container">
            <span class="text-body-secondary">Chat bot sample</span>
          </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
      </body>
    </html>)
})

const chatMessageSchema = z.object({
  chat_message: z.string().min(5),
});


uiRoute.post('/chat', zValidator("form", chatMessageSchema), (c) => {
  const { chat_message } = c.req.valid('form')


  return c.html(
    <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous" />
      </head>
      <body>

        <nav class="navbar navbar-dark bg-dark">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">Chat</a>
          </div>
        </nav>

        <div class="container" style="margin-top: 10px;">
          <form action="/ui/chat" method="post">
            <div class="mb-3">
              <label for="exampleFormControlTextarea1" class="form-label">チャットメッセージ入力</label>
              <textarea class="form-control" name="chat_message" rows="3">{chat_message}</textarea>
            </div>

            <div class="mb-3">
              <button type="submit" class="btn btn-primary">送信</button>
            </div>

          </form>
        </div>

        <footer class="footer mt-auto py-3 bg-body-tertiary">
          <div class="container">
            <span class="text-body-secondary">Chat bot sample</span>
          </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
      </body>
    </html>)
})

