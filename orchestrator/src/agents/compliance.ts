import Groq from 'groq-sdk';
import { callTool } from '../mcp/mcpClient.js';
import type { ConversationMessage } from '../router.js';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY environment variable.');
}

const groqClient = new Groq({ apiKey: GROQ_API_KEY });

const SYSTEM_PROMPT = `Você é o agente de Compliance & LGPD do Copiloto de P&C da Nortion Capital.
Responda perguntas sobre segurança da informação, LGPD e governança de dados.
Use os documentos de compliance como base e adicione um aviso de que a resposta não substitui orientação jurídica formal.`;

const extractMessageContent = (content: unknown): string => {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && 'text' in item && typeof item.text === 'string') {
          return item.text;
        }
        return '';
      })
      .join('');
  }

  return '';
};

const formatConversationHistory = (history: ConversationMessage[]) =>
  history
    .map((message) => `${message.role}: ${message.content.trim()}`)
    .filter(Boolean)
    .join('\n');

const renderSearchResults = (results: any) => {
  if (!results?.results?.length) {
    return 'Nenhum documento de compliance foi encontrado.';
  }

  return results.results
    .map((item: any, index: number) =>
      `Documento ${index + 1}: ${item.titulo}\nCategoria: ${item.categoria}\nTrecho: ${item.conteudo}`,
    )
    .join('\n\n');
};

export const answerCompliance = async (
  question: string,
  conversationHistory: ConversationMessage[] = [],
): Promise<{ resposta: string; agente_responsavel: string }> => {
  const documentResults = await callTool('buscar_documento', {
    termo_busca: question,
    categoria_filtro: 'compliance',
    match_count: 3,
  });

  const systemMessage = SYSTEM_PROMPT;
  const userMessage = `Pergunta: ${question}\n\n` +
    `Contexto histórico:\n${formatConversationHistory(conversationHistory)}\n\n` +
    `Resultados de compliance:\n${renderSearchResults(documentResults)}\n\n` +
    `Aviso: Esta resposta não substitui orientação jurídica formal.`;

  const completion = await groqClient.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.2,
  });

  const resposta = extractMessageContent(completion.choices?.[0]?.message?.content);

  return {
    resposta: resposta || 'Desculpe, não consegui gerar uma resposta sobre compliance no momento.',
    agente_responsavel: 'compliance',
  };
};
