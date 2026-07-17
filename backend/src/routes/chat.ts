import { Router, Request, Response, NextFunction } from 'express'
import { isValidUuid } from './conversations'
import {
  createConversation,
  createMessage,
  getConversationById,
  updateConversationUpdatedAt,
} from '../services/conversationService'
import { orchestrateQuestion } from '../lib/orchestratorClient'

const router = Router()

type ChatRequestBody = {
  conversation_id?: string
  mensagem: string
}

router.post('/', async (req: Request<{}, {}, ChatRequestBody>, res: Response, next: NextFunction) => {
  try {
    const { conversation_id: conversationIdFromBody, mensagem } = req.body
    if (typeof mensagem !== 'string' || mensagem.trim().length === 0) {
      return res.status(400).json({ error: 'mensagem is required' })
    }

    let conversationId = conversationIdFromBody
    if (conversationId) {
      if (!isValidUuid(conversationId)) {
        return res.status(400).json({ error: 'Invalid conversation id' })
      }
      const conversation = await getConversationById(conversationId)
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' })
      }
    } else {
      conversationId = await createConversation(mensagem.slice(0, 100))
    }

    await createMessage(conversationId, 'usuario', mensagem)

    const conversationDetail = await getConversationById(conversationId)
    const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> =
      conversationDetail?.messages.map((message) => ({
        role: message.autor === 'usuario' ? 'user' : 'assistant',
        content: message.conteudo,
      })) ?? []

    const { resposta, agente_responsavel } = await orchestrateQuestion(mensagem, conversationHistory)

    await createMessage(conversationId, 'agente', resposta, agente_responsavel)
    await updateConversationUpdatedAt(conversationId)

    res.json({ conversation_id: conversationId, resposta, agente_responsavel })
  } catch (err) {
    next(err)
  }
})

export { router as chatRouter }
