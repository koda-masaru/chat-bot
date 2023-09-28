import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import { logger } from 'hono/logger'
import { z } from 'zod'
import { uiRoute } from './route/ui'
import { serveStatic } from 'hono/cloudflare-workers'

const envVariables = z.object({
  USER_NAME: z.string().min(1),
  PASSWORD: z.string().min(1),
})

const app = new Hono()

app.use('*', logger())

app.use('*', async (c, next) => {
  const env = envVariables.parse(c.env)
  await basicAuth({
    username: env.USER_NAME,
    password: env.PASSWORD,
  })(c, next)
})

app.get('/', (c) => c.text('It Works!'))

app.route('/ui', uiRoute)
app.get('/static/*', serveStatic({ root: './' }))

export default app
