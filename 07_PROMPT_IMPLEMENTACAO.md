# Prompt para Implementar no Codex/IA

Use este prompt para construir o sistema.

```text
Crie um sistema web chamado RJLF Consultoria - Gestão Empresarial usando Next.js, Supabase e Vercel.

Objetivo:
Criar uma ferramenta segura para o consultor convidar gestores por e-mail e coletar respostas dos módulos Dados da Empresa, PVE e RCF. O sistema do gestor não deve exibir diagnóstico, recomendações, organograma ou resultado consultivo. Esses itens serão tratados depois em ferramenta separada do consultor.

Identidade visual:
- Nome: RJLF Consultoria
- Verde principal: #17342D
- Verde ação: #183A31
- Fundo: #F5F7F2
- Card: #FFFFFF
- Borda: #D8DED4
- Texto: #1D2925
- Texto secundário: #66736E
- Layout limpo, profissional, com topo verde escuro, cards brancos, bordas finas e botões verde escuro.

Stack:
- Next.js
- Supabase Auth
- Supabase Postgres
- Row Level Security
- Vercel

Perfis:
1. Consultor/Admin
   - Login com senha
   - Criar empresas
   - Cadastrar gestores
   - Escolher se envia PVE, RCF ou PVE + RCF
   - Enviar convite por e-mail
   - Reenviar convite
   - Acompanhar status
   - Ver respostas
   - Exportar JSON
   - Bloquear/desbloquear edição

2. Gestor/Cliente
   - Recebe convite
   - Cria senha
   - Faz login
   - Acessa apenas a própria empresa
   - Responde apenas módulos liberados
   - Salva rascunho
   - Envia respostas ao consultor

Rotas:
- /login
- /setup-senha
- /consultor
- /consultor/empresas
- /consultor/empresas/nova
- /consultor/empresas/[id]
- /consultor/empresas/[id]/convites
- /consultor/empresas/[id]/respostas
- /gestor
- /gestor/empresa/[id]
- /gestor/empresa/[id]/pve
- /gestor/empresa/[id]/rcf

Banco:
Use as tabelas:
- profiles
- companies
- company_members
- pve_responses
- rcf_functions
- audit_logs

Segurança:
- Implementar RLS no Supabase.
- Gestor só pode acessar empresas onde está em company_members.
- Gestor só pode editar PVE se can_answer_pve = true e pve_status estiver liberado ou em_preenchimento.
- Gestor só pode editar RCF se can_answer_rcf = true e rcf_status estiver liberado ou em_preenchimento.
- Consultor só pode ver empresas que criou.
- Service role apenas em rotas server-side.

Módulo PVE:
Campos:
- visão
- missão
- grande ambição
- valores em lista dinâmica: nome, significado, comportamentos esperados, comportamentos que contradizem
- comportamentos admirados
- comportamentos intoleráveis
- perfil profissional desejado
- perfil profissional indesejado
- cultura no dia a dia
- rituais para manter cultura viva

Módulo RCF:
Permitir múltiplas funções.
Campos por função:
- nome da função
- missão
- resultado principal
- responsabilidades-chave
- atividades do dia a dia
- metas de resultado
- metas de rotina
- indicadores
- comportamentos esperados
- comportamentos inaceitáveis
- autonomia pode decidir
- autonomia precisa validar
- autonomia não pode decidir
- interfaces internas
- entregas em 30 dias
- entregas em 60 dias
- entregas em 90 dias

Exportação:
Criar botão no painel do consultor para exportar JSON no contrato definido:
- company
- respondents
- modules
- pve
- rcf_functions

Não implementar nesta fase:
- organograma funcional
- diagnóstico automático
- recomendações
- plano de ação
- relatório final consultivo
```

