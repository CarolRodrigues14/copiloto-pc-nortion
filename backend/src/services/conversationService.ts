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
