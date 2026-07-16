import { classifyQuestion } from './router.js';
import { answerPoliticas } from './agents/politicas.js';
import { answerAnalytics } from './agents/analytics.js';
import { answerCompliance } from './agents/compliance.js';
import { answerSintetizador } from './agents/sintetizador.js';
import type { ConversationMessage } from './router.js';

export type OrchestratorResponse = {
  resposta: string;
  agente_responsavel: string;
};

export const orchestrateQuestion = async (
  question: string,
  conversationHistory: ConversationMessage[] = [],
): Promise<OrchestratorResponse> => {
  const category = await classifyQuestion(question, conversationHistory);

  switch (category) {
    case 'politicas':
      return answerPoliticas(question, conversationHistory);
    case 'analytics':
      return answerAnalytics(question, conversationHistory);
    case 'compliance':
      return answerCompliance(question, conversationHistory);
    case 'resumo':
      return answerSintetizador(conversationHistory);
    default:
      return answerPoliticas(question, conversationHistory);
  }
};
