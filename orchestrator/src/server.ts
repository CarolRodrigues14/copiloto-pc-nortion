import express from 'express'
import type { Request, Response } from 'express'
import dotenv from 'dotenv'
import { orchestrateQuestion } from './orchestrator.js'
import { summarizeConversation } from './agents/sintetizador.js'

dotenv.config()

const app = express()
app.use(express.json())

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' })
})

type ConversationMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

app.post('/orchestrate', async (req: Request, res: Response) => {
  const { pergunta, historico } = req.body as {
    pergunta?: string
    historico?: ConversationMessage[]
  }

  if (typeof pergunta !== 'string' || pergunta.trim().length === 0) {
    return res.status(400).json({ error: 'pergunta is required' })
  }

  if (!Array.isArray(historico) || historico.some((item) => typeof item !== 'object')) {
    return res.status(400).json({ error: 'historico must be an array of messages' })
  }

  try {
    const result = await orchestrateQuestion(pergunta, historico)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Orchestrator /orchestrate error:', error)
    return res.status(500).json({ error: 'Internal orchestrator error' })
  }
})

app.post('/summary', async (req: Request, res: Response) => {
  const { historico } = req.body as { historico?: ConversationMessage[] }

  if (!Array.isArray(historico) || historico.some((item) => typeof item !== 'object')) {
    return res.status(400).json({ error: 'historico must be an array of messages' })
  }

  try {
    const result = await summarizeConversation(historico)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Orchestrator /summary error:', error)
    return res.status(500).json({ error: 'Internal orchestrator error' })
  }
})

const port = process.env.PORT ? Number(process.env.PORT) : 3002
app.listen(port, () => {
  console.log(`Orchestrator listening on port ${port}`)
})
