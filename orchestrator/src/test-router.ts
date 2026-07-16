import { classifyQuestion } from './router.js';

const questions = [
  { text: 'Quantos dias de férias eu tenho direito?', expected: 'politicas' },
  { text: 'Como funciona a licença-maternidade?', expected: 'politicas' },
  { text: 'Como é calculada a métrica de turnover?', expected: 'analytics' },
  { text: 'Qual o ROI de um treinamento?', expected: 'analytics' },
  { text: 'Quem pode acessar dados sensíveis de desempenho?', expected: 'compliance' },
  { text: 'Como funciona a LGPD aqui na empresa?', expected: 'compliance' },
  { text: 'Pode resumir o que conversamos até agora?', expected: 'resumo' },
  { text: 'Me dá um resumo dessa conversa', expected: 'resumo' },
];

const run = async () => {
  for (const item of questions) {
    const category = await classifyQuestion(item.text, []);
    console.log(`Pergunta: ${item.text}`);
    console.log(`Retorno: ${category}`);
    console.log(`Esperado: ${item.expected}`);
    console.log('---');
  }
};

run().catch((error) => {
  console.error('Erro ao executar o teste:', error);
  process.exit(1);
});
