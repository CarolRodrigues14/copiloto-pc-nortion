# Regras de Validação e Qualidade de Dados — Nortion Capital

## Objetivo
Garantir que os dados de P&C usados em dashboards, relatórios e análises sejam confiáveis, consistentes
e rastreáveis — "dado confiável" é um valor central da Nortion Capital.

## Checklist de Qualidade (aplicado a toda nova base consolidada)

### 1. Checagem de duplicidade
- Verificar se há registros duplicados de colaboradores (mesmo CPF ou e-mail corporativo em mais de uma linha)
- Regra: em caso de duplicidade, manter o registro mais recente e sinalizar a inconsistência para revisão manual

### 2. Consistência de campos
- Campos obrigatórios (nome, cargo, data de admissão, gestor direto) não podem estar vazios
- Datas devem seguir formato padrão (AAAA-MM-DD) e estar dentro de intervalos plausíveis (ex: data de admissão não pode ser futura)
- Campos categóricos (ex: "status": ativo/inativo/afastado) devem usar apenas valores do dicionário padronizado — não aceitar variações livres

### 3. Validação lógica
- Colaboradores marcados como "ativos" não podem ter data de desligamento preenchida
- Performance individual não pode ultrapassar a escala definida (1 a 5)
- Horas trabalhadas não podem exceder limites plausíveis (ex: mais de 16h/dia é sinalizado para revisão)

### 4. Rastreabilidade
- Toda atualização de base deve registrar: origem do dado, data da atualização, responsável pela extração
- Mudanças manuais em dados (correções pontuais) devem ser documentadas com justificativa

## Frequência de Validação
- Validação automática: a cada atualização de base (rotina de extração)
- Validação manual (auditoria): mensal, pelo time de P&C

## Escalonamento de Inconsistências
- Inconsistências leves (ex: campo vazio não crítico): corrigidas na próxima rotina de atualização
- Inconsistências críticas (ex: duplicidade em dado sensível, valor fora de escala): reportadas imediatamente
  ao responsável pela base e à liderança de P&C