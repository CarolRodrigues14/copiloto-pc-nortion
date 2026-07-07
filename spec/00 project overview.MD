# Copiloto P&C — Nortion Capital

## Contexto
Projeto acadêmico (UniFECAF — IA Generativa Aplicada ao Desenvolvimento), aplicado como estudo de caso
sobre a empresa fictícia **Nortion Capital**, inspirada na vaga real de Analista de Dados Jr. em Pessoas & Cultura.

## Problema
O time de P&C da Nortion Capital tem informação espalhada entre políticas de RH, dicionários de métricas,
processos de onboarding, regras de segurança/LGPD e manuais de dashboard. Isso gera retrabalho e lentidão
para responder dúvidas recorrentes (férias, indicadores, acesso a dados, governança).

## Objetivo
Construir um **Copiloto Corporativo Inteligente** que:
- Responde perguntas em linguagem natural sobre políticas, métricas e processos internos
- Usa arquitetura multi-agente com orquestrador
- Consulta uma base de conhecimento (RAG) via MCP
- Integra uma API externa real (feriados nacionais)
- Mantém histórico de conversas por sessão
- Gera resumos e recomendações acionáveis para o time de P&C

## Stack
- **Frontend:** React (protótipo de UI feito no Stitch antes da implementação)
- **Backend:** Node.js + TypeScript (API REST)
- **Orquestrador:** módulo de roteamento entre agentes especializados
- **Banco de dados:** Postgres/Supabase (conversas, documentos, embeddings)
- **MCP Server:** exposição da base de conhecimento e da API externa como tools
- **Dev tool:** VS Code + GitHub Copilot, desenvolvimento guiado por specs (esta pasta)

## Estrutura de pastas sugerida
```
/specs           <- este diretório (fonte da verdade para o Copilot)
/backend
/frontend
/mcp-server
/knowledge-base   <- documentos fictícios da Nortion Capital
```

