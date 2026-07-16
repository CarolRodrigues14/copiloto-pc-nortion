import Groq from 'groq-sdk';
import { callTool } from '../mcp/mcpClient.js';
import type { ConversationMessage } from '../router.js';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY environment variable.');
}

const groqClient = new Groq({ apiKey: GROQ_API_KEY });

const SYSTEM_PROMPT = `Você é o agente People Analytics do Copiloto de P&C da Nortion Capital.
Responda perguntas sobre métricas, indicadores e dashboards.
Utilize os resultados da ferramenta de métrica e dos documentos de métricas quando disponíveis.`;

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
    return 'Nenhum documento de métricas foi encontrado.';
  }

  return results.results
    .map((item: any, index: number) =>
      `Documento ${index + 1}: ${item.titulo}\nCategoria: ${item.categoria}\nTrecho: ${item.conteudo}`,
    )
    .join('\n\n');
};

const renderMetricResults = (results: any) => {
  if (!results?.results?.length) {
    return 'Nenhuma métrica correspondente foi encontrada.';
  }

  return results.results
    .map((item: any, index: number) =>
      `Métrica ${index + 1}: ${item.titulo}\nCategoria: ${item.categoria}\nTrecho: ${item.conteudo}`,
    )
    .join('\n\n');
};

export const answerAnalytics = async (
  question: string,
  conversationHistory: ConversationMessage[] = [],
): Promise<{ resposta: string; agente_responsavel: string }> => {
  const metricResults = await callTool('consultar_metrica', {
    nome_metrica: question,
    match_count: 3,
  });

  const documentResults = await callTool('buscar_documento', {
    termo_busca: question,
    categoria_filtro: 'metricas',
    match_count: 3,
  });

  const systemMessage = SYSTEM_PROMPT;
  const userMessage = `Pergunta: ${question}\n\n` +
    `Contexto histórico:\n${formatConversationHistory(conversationHistory)}\n\n` +
    `Resultados de métrica:\n${renderMetricResults(metricResults)}\n\n` +
    `Resultados de documentos:\n${renderSearchResults(documentResults)}`;

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
    resposta: resposta || 'Desculpe, não consegui gerar uma resposta sobre métricas no momento.',
    agente_responsavel: 'analytics',
  };
};
