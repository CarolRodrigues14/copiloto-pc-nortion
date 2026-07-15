export interface User {
  id: string
  nome: string
  papel: string
}

export interface Conversation {
  id: string
  user_id: string
  titulo: string
  criado_em: string
  atualizado_em: string
}

export interface Message {
  id: string
  conversation_id: string
  autor: 'usuario' | 'agente'
  agente_responsavel?: string | null
  conteudo: string
  criado_em: string
}

export interface ConversationDetail extends Conversation {
  messages: Message[]
}
