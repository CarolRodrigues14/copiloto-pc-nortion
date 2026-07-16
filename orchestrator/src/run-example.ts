import { classifyQuestion } from './router.js';
import { orchestrateQuestion } from './orchestrator.js';
import type { ConversationMessage } from './router.js';

const sampleHistory: ConversationMessage[] = [
  { role: 'user', content: 'Oi, preciso de ajuda com políticas de RH.' },
  { role: 'assistant', content: 'Claro, posso ajudar com férias, benefícios e onboarding.' },
  { role: 'user', content: 'E também quero entender como usamos nossas métricas.' },
];

const questions = [
  {
    text: 'Quantos dias de férias eu tenho direito?',
    history: [] as ConversationMessage[],
  },
  {
    text: 'Como é calculada a métrica de turnover?',
    history: [] as ConversationMessage[],
  },
  {
    text: 'Quem pode acessar dados sensíveis de desempenho?',
    history: [] as ConversationMessage[],
  },
  {
    text: 'Quantos feriados temos em 2026?',
    history: [] as ConversationMessage[],
  },
  {
    text: 'Pode resumir o que conversamos?',
    history: sampleHistory,
  },
];

const run = async () => {
  console.log('=== Run Example: Copiloto P&C ===\n');

  for (const item of questions) {
    console.log('Pergunta:');
    console.log(item.text);

    const category = await classifyQuestion(item.text, item.history);
    const response = await orchestrateQuestion(item.text, item.history);

    console.log('\nCategoria classificada pelo router:');
    console.log(category);
    console.log('\nAgente responsável:');
    console.log(response.agente_responsavel);
    console.log('\nResposta completa:');
    console.log(response.resposta);
    console.log('\n' + '-'.repeat(80) + '\n');
  }
};

run().catch((error) => {
  console.error('Erro ao executar o exemplo:', error);
  process.exit(1);
});
