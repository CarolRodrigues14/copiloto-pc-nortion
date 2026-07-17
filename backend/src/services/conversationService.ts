import { supabase } from '../lib/supabaseClient'
import { Conversation, ConversationDetail, Message } from '../types'

const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001'

export async function listConversations(): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', MOCK_USER_ID)
    .order('atualizado_em', { ascending: false })

  if (error) {
    throw error
  }

  return (data as Conversation[]) ?? []
}

export async function getConversationById(conversationId: string): Promise<ConversationDetail | null> {
  const { data: conversationData, error: conversationError } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single()

  if (conversationError) {
    if (conversationError.code === 'PGRST116') {
      return null
    }
    throw conversationError
  }

  const { data: messagesData, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('criado_em', { ascending: true })

  if (messagesError) {
    throw messagesError
  }

  return {
    ...conversationData,
    messages: (messagesData as Message[]) ?? [],
  }
}

async function ensureMockUserExists(): Promise<void> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('id', MOCK_USER_ID)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw error
  }

  if (!data) {
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: MOCK_USER_ID,
        nome: 'Usuário Mock',
        papel: 'P&C',
      },
    ])

    if (insertError) {
      throw insertError
    }
  }
}

export async function createConversation(title: string): Promise<string> {
  await ensureMockUserExists()

  const { data, error } = await supabase
    .from('conversations')
    .insert([
      {
        user_id: MOCK_USER_ID,
        titulo: title,
      },
    ])
    .select('id')
    .single()

  if (error) {
    throw error
  }

  return (data as { id: string }).id
}

export async function createMessage(
  conversationId: string,
  autor: 'usuario' | 'agente',
  conteudo: string,
  agenteResponsavel: string | null = null,
): Promise<void> {
  const { error } = await supabase.from('messages').insert([
    {
      conversation_id: conversationId,
      autor,
      conteudo,
      agente_responsavel: agenteResponsavel,
    },
  ])

  if (error) {
    throw error
  }
}

export async function updateConversationUpdatedAt(conversationId: string): Promise<void> {
  const { error } = await supabase
    .from('conversations')
    .update({ atualizado_em: new Date().toISOString() })
    .eq('id', conversationId)

  if (error) {
    throw error
  }
}

export async function saveConversationSummary(
  conversationId: string,
  resumo: string,
  recomendacoes: string[] = [],
): Promise<void> {
  const { error } = await supabase.from('conversation_summaries').insert([
    {
      conversation_id: conversationId,
      resumo,
      recomendacoes,
    },
  ])

  if (error) {
    throw error
  }
}
