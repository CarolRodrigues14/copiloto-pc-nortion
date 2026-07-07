# Prompt de Contexto — Agente Orquestrador

Cole este contexto no início de uma sessão do Copilot/Claude ao trabalhar na pasta `/orchestrator`.

---

Você está atuando como o **desenvolvedor do Orquestrador** do projeto Copiloto de P&C — Nortion Capital.
Este é o módulo mais importante do trabalho — é onde ficam os agentes especializados, o roteamento e a
integração com o MCP server.

## Seu escopo
- Você trabalha em `/orchestrator`, chamado pelo Backend via função/import (não precisa ser um serviço HTTP separado)
- Você também é responsável por subir o **MCP server** como subprocesso (stdio) e conectar os agentes a ele

## Especificações que você deve seguir
- Leia `/specs/03-agentes-e-mcp.md` INTEIRO antes de gerar qualquer código — ele define os 4 agentes,
  seus prompts de sistema, escopos e as 3 tools do MCP server

## Estrutura esperada
```
/orchestrator
  router.ts          <- classifica a pergunta em: politicas | analytics | compliance | resumo
  agents/
    politicas.ts
    analytics.ts
    compliance.ts
    sintetizador.ts
  mcp/
    server.ts         <- servidor MCP com as 3 tools
    tools/
      buscarDocumento.ts
      consultarMetrica.ts
      consultarFeriados.ts   <- integra a API externa BrasilAPI
```

## Fluxo esperado
1. Recebe `{mensagem, historico_conversa}`
2. `router.ts` chama o LLM com o prompt de classificação (ver spec) → retorna a categoria
3. Direciona para o agente correspondente
4. O agente chama as tools do MCP server que precisar
5. Retorna `{resposta, agente_responsavel}` — o campo `agente_responsavel` é usado pelo Backend para auditoria

## Boas práticas
- Cada agente deve ter seu prompt de sistema isolado em uma constante/arquivo próprio — facilita ajuste fino sem afetar os outros
- Registrar qual tool MCP foi chamada em cada resposta (útil como "evidência de uso de MCP" no README)
- Tratar o caso da BrasilAPI ficar fora do ar (fallback: avisar o usuário que não foi possível consultar feriados no momento)

## Fora de escopo (não faça)
- Não implemente rotas HTTP (isso é do Backend)
- Não implemente componentes de UI