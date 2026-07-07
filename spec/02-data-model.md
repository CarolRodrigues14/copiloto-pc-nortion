# Modelo de Dados

## Tabelas principais

### `users`
| campo | tipo | descrição |
|---|---|---|
| id | uuid | pk |
| nome | text | ex: "Ana - Especialista de Performance" |
| papel | text | ex: "P&C" |

### `conversations`
| campo | tipo | descrição |
|---|---|---|
| id | uuid | pk |
| user_id | uuid | fk → users |
| titulo | text | gerado automaticamente a partir da 1ª pergunta |
| criado_em | timestamp | |
| atualizado_em | timestamp | |

### `messages`
| campo | tipo | descrição |
|---|---|---|
| id | uuid | pk |
| conversation_id | uuid | fk → conversations |
| autor | text | 'usuario' \| 'agente' |
| agente_responsavel | text | nullable — qual agente respondeu (auditoria/governança) |
| conteudo | text | |
| criado_em | timestamp | |

### `conversation_summaries`
| campo | tipo | descrição |
|---|---|---|
| id | uuid | pk |
| conversation_id | uuid | fk → conversations |
| resumo | text | |
| recomendacoes | text[] | lista de recomendações geradas |
| criado_em | timestamp | |

### `knowledge_documents`
| campo | tipo | descrição |
|---|---|---|
| id | uuid | pk |
| categoria | text | 'politicas' \| 'metricas' \| 'compliance' \| 'onboarding' |
| titulo | text | |
| conteudo | text | |
| embedding | vector | pgvector — para busca semântica |

## Base de conhecimento fictícia (knowledge_documents) — conteúdo a criar
1. Política de férias e benefícios — Nortion Capital
2. Dicionário de métricas de P&C (produtividade, performance, curva de aprendizagem, ROI de treinamento)
3. Processo de onboarding
4. Política de segurança da informação e LGPD
5. Manual de acesso a dashboards (Power BI/Metabase)
6. Regras de validação e qualidade de dados
7. Processo de extração/atualização de dados (SQL/planilhas)
8. Governança de dados — níveis de acesso

> Nota: gerar esses documentos como markdown/texto fictício e realista, coerente com a descrição
> real da vaga de Analista de Dados Jr. da Nortion (SQL, Power BI, LGPD, People Analytics).