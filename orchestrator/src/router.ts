import 'dotenv/config';
import Groq from 'groq-sdk';

export type RouterCategory = 'politicas' | 'analytics' | 'compliance' | 'resumo';

export type ConversationMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const VALID_CATEGORIES = ['politicas', 'analytics', 'compliance', 'resumo'] as const;
const DEFAULT_CATEGORY: RouterCategory = 'politicas';

const SYSTEM_PROMPT = `Você é o roteador do Copiloto de P&C da Nortion Capital. Dada a pergunta do usuário e o histórico da conversa, classifique-a em uma das categorias exatas: politicas, analytics, compliance, resumo. Responda apenas com uma destas quatro palavras exatas, sem nenhum texto adicional.

Exemplos:
- Pergunta: Quantos dias de férias eu tenho direito? → politicas
- Pergunta: Como funciona a licença-maternidade? → politicas
- Pergunta: Como é calculada a métrica de turnover? → analytics
- Pergunta: Qual o ROI de um treinamento? → analytics
- Pergunta: Quem pode acessar dados sensíveis de desempenho? → compliance
- Pergunta: Como funciona a LGPD aqui na empresa? → compliance
- Pergunta: Pode resumir o que conversamos até agora? → resumo
- Pergunta: Me dá um resumo dessa conversa → resumo`;

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY environment variable.');
}

const groqClient = new Groq({ apiKey: GROQ_API_KEY });

const normalizeText = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');

const normalizeCategory = (value: string): RouterCategory => {
  const normalized = normalizeText(value);

  for (const category of VALID_CATEGORIES) {
    if (normalized === category) {
      return category;
    }
  }

  // Heuristic attempt if model returns extra text around the category.
  if (normalized.includes('resumo')) {
    return 'resumo';
  }
  if (normalized.includes('compliance') || normalized.includes('lgpd') || normalized.includes('seguranca') || normalized.includes('privacidade')) {
    return 'compliance';
  }
  if (normalized.includes('analytics') || normalized.includes('metr') || normalized.includes('indicador') || normalized.includes('dashboard') || normalized.includes('analise')) {
    return 'analytics';
  }

  return DEFAULT_CATEGORY;
};

const extractMessageContent = (content: unknown): string => {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }
        if (item && typeof item === 'object' && 'text' in item && typeof item.text === 'string') {
          return item.text;
        }
        return '';
      })
      .join('');
  }

  return '';
};

const formatConversationHistory = (history: ConversationMessage[]): string =>
  history
    .map((message) => `${message.role}: ${message.content.trim()}`)
    .filter(Boolean)
    .join('\n');

export const classifyQuestion = async (
  question: string,
  conversationHistory: ConversationMessage[] = [],
): Promise<RouterCategory> => {
  const finalQuestion = question?.trim();
  if (!finalQuestion) {
    return DEFAULT_CATEGORY;
  }

  const historyText = formatConversationHistory(conversationHistory);

  const messages = [
    {
      role: 'system',
      content: SYSTEM_PROMPT,
    },
    {
      role: 'user',
      content: `Pergunta: ${finalQuestion}${historyText ? `\n\nHistórico:\n${historyText}` : ''}`,
    },
  ];

  const completion = await groqClient.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages,
    temperature: 0.1,
  });

  const modelOutput = extractMessageContent(completion.choices?.[0]?.message?.content);
  return normalizeCategory(modelOutput);
};
