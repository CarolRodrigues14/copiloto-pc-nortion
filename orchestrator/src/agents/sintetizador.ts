import Groq from 'groq-sdk';
import type { ConversationMessage } from '../router.js';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY environment variable.');
}

const groqClient = new Groq({ apiKey: GROQ_API_KEY });

const SYSTEM_PROMPT = `Você é o agente sintetizador do Copiloto de P&C da Nortion Capital.
Leia a conversa completa e produza um resumo objetivo dos temas discutidos e uma lista de recomendações práticas para o time de P&C.`;

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

export const answerSintetizador = async (
  conversationHistory: ConversationMessage[] = [],
): Promise<{ resposta: string; agente_responsavel: string }> => {
  const userMessage = `Conversa completa:\n${formatConversationHistory(conversationHistory)}\n\n` +
    'Por favor, forneça um resumo objetivo em 3-5 linhas e uma lista de recomendações acionáveis.';

  const completion = await groqClient.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.2,
  });

  const resposta = extractMessageContent(completion.choices?.[0]?.message?.content);

  return {
    resposta: resposta || 'Desculpe, não consegui gerar o resumo da conversa no momento.',
    agente_responsavel: 'sintetizador',
  };
};
