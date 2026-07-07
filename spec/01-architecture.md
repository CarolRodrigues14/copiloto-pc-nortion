# Arquitetura

## Visão geral do fluxo
```
Usuário (frontend)
   │
   ▼
Backend API  ──persiste──►  Banco (conversas, sessões)
   │
   ▼
Orquestrador
   │
   ├──► Agente Políticas & Onboarding ──► MCP: buscar_documento()
   ├──► Agente People Analytics       ──► MCP: consultar_metrica()
   ├──► Agente Compliance & LGPD      ──► MCP: buscar_documento()
   │         (todos acima podem chamar)──► MCP: consultar_feriados() [API externa BrasilAPI]
   │
   ▼
Agente Sintetizador (roda ao fim da sessão ou sob demanda)
   │
   ▼
Resumo + Recomendações ──persiste──► Banco
```

## Camadas

### 1. Frontend (React)
- Tela de chat (input + histórico de mensagens da sessão atual)
- Sidebar com lista de conversas anteriores (histórico)
- Painel lateral/modal de "Resumo da conversa" com recomendações
- Prototipar primeiro no Stitch: tela de chat, sidebar de histórico, modal de resumo

### 2. Backend (Node.js + TypeScript)
Responsabilidades:
- Expor REST API para o frontend (`/chat`, `/conversations`, `/conversations/:id/summary`)
- Autenticação simples (usuário fixo/mock representando alguém do time de P&C)
- Persistir mensagens e metadados de sessão no banco
- Chamar o Orquestrador a cada nova mensagem do usuário

### 3. Orquestrador
- Recebe: pergunta do usuário + histórico da sessão
- Decide, via prompt de roteamento (classificação por LLM), qual agente deve responder:
  - Perguntas sobre férias, benefícios, onboarding → **Agente Políticas**
  - Perguntas sobre indicadores, dashboards, produtividade → **Agente Analytics**
  - Perguntas sobre segurança, acesso a dados, LGPD → **Agente Compliance**
  - Pedido explícito de resumo/recomendação → **Agente Sintetizador**
- Registra qual agente respondeu (para transparência/governança no README)

### 4. Agentes especializados
Cada agente é um prompt de sistema + escopo de documentos + (quando aplicável) acesso a tools MCP.
Detalhado em `03-agentes-e-mcp.md`.

### 5. MCP Server
Servidor MCP próprio, rodando localmente, expõe:
- `buscar_documento(query, categoria)` → busca semântica na base de conhecimento
- `consultar_metrica(nome_metrica)` → retorna definição do dicionário de métricas
- `consultar_feriados(uf, ano)` → chama a BrasilAPI (feriados nacionais/estaduais)

### 6. Banco de dados
Ver `02-data-model.md`.

## Decisões técnicas a validar com Copilot durante implementação
- Framework backend: Express (mais simples) vs Fastify (mais moderno) — recomendo Express pela curva de aprendizado
- Embeddings: pgvector no Supabase (reaproveita ferramenta que você já conhece) vs solução local simples
- Modelo de LLM: Claude via Anthropic API (mencionar no README como parte do "desenvolvimento assistido por IA")