import { Router, Request, Response, NextFunction } from 'express'
import {
  listConversations,
  getConversationById,
  saveConversationSummary,
} from '../services/conversationService'
import { summarizeConversation } from '../lib/orchestratorClient'

const router = Router()

export const isValidUuid = (value: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversations = await listConversations()
    res.json({ data: conversations })
  } catch (err) {
    next(err)
  }
})

router.get('/:id/summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversationId = req.params.id
    if (!isValidUuid(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation id' })
    }

    const conversation = await getConversationById(conversationId)
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> =
      conversation.messages.map((message) => ({
        role: message.autor === 'usuario' ? 'user' : 'assistant',
        content: message.conteudo,
      }))

    const { resumo, recomendacoes, agente_responsavel } = await summarizeConversation(conversationHistory)
    await saveConversationSummary(conversationId, resumo, recomendacoes)

    res.json({ data: { resumo, recomendacoes, agente_responsavel } })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversationId = req.params.id
    if (!isValidUuid(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation id' })
    }

    const conversation = await getConversationById(conversationId)
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }
    res.json({ data: conversation })
  } catch (err) {
    next(err)
  }
})

export { router as conversationsRouter }
