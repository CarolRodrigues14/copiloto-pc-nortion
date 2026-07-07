# Governança de Dados — Nortion Capital

## Objetivo
Estabelecer regras claras de propriedade, acesso e responsabilidade sobre os dados de P&C, garantindo
consistência, segurança e conformidade com a Política de Segurança da Informação e LGPD.

## Papéis e Responsabilidades

| Papel | Responsabilidade |
|---|---|
| Especialista de Performance | Define regras de negócio, valida indicadores, aprova mudanças em métricas |
| Analista de Dados Jr. (P&C) | Executa extração, tratamento, validação e manutenção de dashboards |
| Gestor de área | Consome dados agregados da própria equipe, solicita acessos pontuais |
| DPO (Encarregado de Dados) | Garante conformidade com a LGPD, avalia solicitações de acesso a dados sensíveis |
| TI | Provisiona acessos técnicos, mantém infraestrutura segura |

## Regras de Governança

1. **Toda métrica oficial deve ter dono definido** — nenhuma métrica entra em dashboard sem estar documentada
   no Dicionário de Métricas com fórmula e fonte de dados claras.
2. **Mudanças de fórmula exigem aprovação** — qualquer alteração na forma de calcular uma métrica passa pela
   Especialista de Performance antes de entrar em produção.
3. **Acesso segue o princípio do menor privilégio** — colaboradores só recebem o nível de acesso estritamente
   necessário para sua função (ver tabela de níveis na Política de Segurança e LGPD).
4. **Auditoria periódica** — revisão trimestral de quem tem acesso a quê, removendo acessos não mais necessários
   (ex: colaboradores que mudaram de função).
5. **Transparência com o titular dos dados** — qualquer colaborador pode solicitar explicação sobre como uma
   métrica sua foi calculada.

## Governança Aplicada a Ferramentas de IA
- O Copiloto de P&C deve registrar qual agente/fonte respondeu cada pergunta, permitindo auditoria posterior.
- Respostas sobre dados sensíveis só devem ser fornecidas a usuários com nível de acesso compatível.
- Qualquer limitação identificada na ferramenta de IA (ex: resposta incorreta, fonte desatualizada) deve ser
  reportada ao time de P&C para correção da base de conhecimento.

## Revisão deste documento
Este documento é revisado semestralmente pelo time de P&C, junto ao DPO.