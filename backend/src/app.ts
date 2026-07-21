import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { healthRouter } from './routes/health'
import { conversationsRouter } from './routes/conversations'
import { chatRouter } from './routes/chat'
import { OrchestratorTimeoutError, OrchestratorRequestError } from './lib/orchestratorClient'
import { config } from './config'

const app = express()

const corsOptions = {
  origin: config.frontendUrl,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.options('/chat', cors(corsOptions))
app.use(express.json())

app.use('/health', healthRouter)
app.use('/conversations', conversationsRouter)
app.use('/chat', chatRouter)

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  if (err instanceof OrchestratorTimeoutError) {
    return res.status(504).json({ error: err.message })
  }
  if (err instanceof OrchestratorRequestError) {
    return res.status(502).json({ error: err.message })
  }
  res.status(500).json({ error: 'Internal server error' })
})

export { app }
