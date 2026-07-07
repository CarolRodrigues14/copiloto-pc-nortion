# Agentes Especializados e MCP Server

## Agente Orquestrador (roteador)
**Prompt de sistema (rascunho):**
> Você é o roteador do Copiloto de P&C da Nortion Capital. Dada a pergunta do usuário e o histórico da
> conversa, classifique-a em uma das categorias: `politicas`, `analytics`, `compliance`, `resumo`.
> Responda apenas com a categoria.

## Agente 1 — Políticas & Onboarding
- Escopo: férias, benefícios, processo de onboarding
- Tools MCP: `buscar_documento(categoria='politicas'|'onboarding')`, `consultar_feriados(uf, ano)`
- Caso de uso exemplo: "Quantos dias úteis de férias eu tenho entre março e abril considerando feriados?"

## Agente 2 — People Analytics
- Escopo: métricas, indicadores, dashboards
- Tools MCP: `consultar_metrica(nome)`, `buscar_documento(categoria='metricas')`
- Caso de uso exemplo: "Como é calculada a métrica de curva de aprendizagem?"

## Agente 3 — Compliance & LGPD
- Escopo: segurança da informação, LGPD, governança de acesso
- Tools MCP: `buscar_documento(categoria='compliance')`
- Caso de uso exemplo: "Quem pode acessar dados sensíveis de desempenho individual?"

## Agente Sintetizador
- Roda ao final da sessão (ou quando o usuário pede "resumir")
- Lê todo o histórico de `messages` da conversa
- Gera: resumo objetivo (3-5 linhas) + lista de recomendações acionáveis
- Grava em `conversation_summaries`

**Prompt de sistema (rascunho):**
> Você é o agente sintetizador do Copiloto de P&C. Leia a conversa completa e produza um resumo
> objetivo dos temas discutidos e uma lista de recomendações práticas para o time de P&C tomar ação.

## MCP Server — Tools a implementar

### `buscar_documento(query: string, categoria?: string)`
- Busca semântica (embeddings) em `knowledge_documents`
- Retorna os top-3 trechos mais relevantes

### `consultar_metrica(nome_metrica: string)`
- Busca exata/fuzzy no dicionário de métricas
- Retorna definição, fórmula e fonte de dados

### `consultar_feriados(uf: string, ano: number)`
- Chama a API externa **BrasilAPI**: `https://brasilapi.com.br/api/feriados/v1/{ano}`
- Filtra feriados nacionais (BrasilAPI não segmenta por UF — documentar essa limitação no README)

## Transparência/Governança (para a parte teórica do trabalho)
- Cada resposta do orquestrador registra qual agente respondeu → permite auditoria
- Documentos sensíveis (compliance) devem ter aviso de "não substitui orientação jurídica formal"
- README deve declarar: dados fictícios, nenhuma informação real de funcionários é usada