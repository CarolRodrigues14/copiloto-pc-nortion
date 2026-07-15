import express, { Request, Response, NextFunction } from 'express'
import { healthRouter } from './routes/health'
import { conversationsRouter } from './routes/conversations'

const app = express()
app.use(express.json())

app.use('/health', healthRouter)
app.use('/conversations', conversationsRouter)

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

export { app }
