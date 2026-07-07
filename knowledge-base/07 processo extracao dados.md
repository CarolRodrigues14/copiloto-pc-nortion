# Processo de Extração e Atualização de Dados — Nortion Capital

## Fontes de Dados de P&C
- **Sistema de RH:** dados cadastrais, admissões, desligamentos, licenças
- **Sistema de ponto:** horas trabalhadas, faltas, atrasos
- **Ferramenta de gestão de projetos:** entregas concluídas, prazos, alocação de horas
- **Planilhas de avaliação de desempenho:** ciclos semestrais de performance

## Rotina de Extração (SQL/Planilhas)

### Extração do Sistema de RH
- Frequência: diária (dados cadastrais mudam pouco, mas admissões/desligamentos precisam refletir rápido)
- Método: consulta SQL direta ao banco replicado do sistema de RH (somente leitura)
- Campos extraídos: id_colaborador, nome, cargo, data_admissao, data_desligamento, gestor_direto, status

### Extração do Sistema de Ponto
- Frequência: diária
- Método: exportação automática via API do sistema de ponto, consolidada em planilha intermediária
- Campos extraídos: id_colaborador, data, horas_trabalhadas, tipo_ocorrencia (falta/atraso/normal)

### Extração da Ferramenta de Projetos
- Frequência: semanal
- Método: exportação manual (CSV) pelo responsável de cada time, seguindo template padronizado
- Campos extraídos: id_colaborador, id_projeto, tarefas_concluidas, horas_alocadas, periodo

## Consolidação
1. Cada fonte é extraída separadamente e passa pelo checklist de validação (ver documento de Qualidade de Dados)
2. Os dados são unificados por `id_colaborador` em uma base consolidada
3. A base consolidada alimenta os dashboards (Power BI/Metabase) e a base de conhecimento do Copiloto

## Ferramentas de Apoio
- Consultas SQL para extração direta de bancos relacionais
- Planilhas (Google Sheets/Excel) para consolidação manual quando a fonte não permite automação total
- Scripts leves (Python/Pandas) ou automações no-code (Make/n8n) para rotinas recorrentes de tratamento

## Responsável
Analista de Dados Jr. de P&C, com apoio da Especialista de Performance para validação de regras de negócio.