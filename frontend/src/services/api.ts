import { Conversation, Message, ChatResponse, ConversationSummary } from '../types';

const apiUrl = import.meta.env.VITE_API_URL as string;

if (!apiUrl) {
  throw new Error('VITE_API_URL is not defined');
}

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export async function fetchConversations(): Promise<Conversation[]> {
  const response = await fetch(`${apiUrl}/conversations`);
  if (!response.ok) {
    throw new Error('Failed to load conversations');
  }

  const payload = await response.json();
  return payload.data ?? [];
}

export async function fetchConversationHistory(conversationId: string): Promise<Message[]> {
  const response = await fetch(`${apiUrl}/conversations/${conversationId}`);
  if (!response.ok) {
    throw new Error('Failed to load conversation history');
  }

  const payload = await response.json();
  return payload.data?.messages ?? [];
}

export async function sendChatMessage(payload: { conversation_id?: string; mensagem: string }): Promise<ChatResponse> {
  const response = await fetch(`${apiUrl}/chat`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return await response.json();
}

export async function fetchConversationSummary(conversationId: string): Promise<ConversationSummary> {
  const response = await fetch(`${apiUrl}/conversations/${conversationId}/summary`);
  if (!response.ok) {
    throw new Error('Failed to load summary');
  }

  const payload = await response.json();
  return payload.data;
}
