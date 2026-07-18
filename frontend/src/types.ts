export interface Conversation {
  id: string;
  title: string;
  atualizado_em: string;
}

export interface Message {
  id: string;
  author: 'user' | 'assistant';
  conteudo: string;
  criado_em: string;
  agente_responsavel: string;
}

export interface ConversationSummary {
  resumo: string;
  recomendacoes: string[];
  agente_responsavel: string;
}

export interface ChatResponse {
  conversation_id: string;
  resposta: string;
  agente_responsavel: string;
}
