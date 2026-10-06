# Requisitos Funcionais

## 1. Login e perfis

### Consultor/Admin

O consultor deve conseguir:

- Fazer login com e-mail e senha
- Criar uma empresa cliente
- Cadastrar um ou mais gestores para a empresa
- Escolher quais modulos serao liberados:
  - PVE apenas
  - RCF apenas
  - PVE + RCF
- Enviar convite por e-mail
- Reenviar convite
- Ver status de preenchimento
- Abrir respostas recebidas
- Exportar respostas em JSON
- Bloquear/desbloquear edicao

### Gestor/Cliente

O gestor deve conseguir:

- Receber convite por e-mail
- Criar senha no primeiro acesso
- Fazer login
- Visualizar apenas a empresa dele
- Responder apenas os modulos liberados pelo consultor
- Salvar rascunho
- Enviar respostas ao consultor
- Visualizar status de envio

## 2. Modulo Dados da Empresa

Campos:

- Nome da empresa
- Segmento
- Cidade/UF
- Porte
- Nome do gestor respondente
- E-mail do gestor
- Principal desafio de gestao
- Contexto livre

## 3. Modulo PVE

Campos:

- Visao
- Missao
- Grande ambicao
- Valores
  - Nome do valor
  - O que significa na pratica
  - Comportamentos esperados
  - Comportamentos que contradizem esse valor
- Comportamentos admirados
- Comportamentos intoleraveis
- Perfil profissional desejado
- Perfil profissional que nao combina
- Como a cultura aparece no dia a dia
- Como a cultura sera mantida viva

## 4. Modulo RCF

O gestor pode cadastrar varias funcoes.

Campos por funcao:

- Nome da funcao
- Missao da funcao
- Resultado principal esperado
- Responsabilidades-chave
- Atividades do dia a dia
- Metas de resultado
- Metas de rotina
- Indicadores
- Comportamentos esperados
- Comportamentos inaceitaveis
- Pode decidir sozinha
- Precisa validar com a lideranca
- Nao pode decidir
- Interfaces internas
- Entregas em 30 dias
- Entregas em 60 dias
- Entregas em 90 dias

## 5. Status

Status da empresa:

- `rascunho`
- `convite_enviado`
- `em_preenchimento`
- `enviado_ao_consultor`
- `em_analise`
- `finalizado`

Status por modulo:

- `nao_liberado`
- `liberado`
- `em_preenchimento`
- `enviado`
- `bloqueado`

## 6. O que nao entra na versao do gestor

- Organograma funcional
- Diagnostico inteligente
- Recomendacoes consultivas
- Plano de acao
- Relatorio final
- Pontuacao automatica

Esses itens pertencem a ferramenta do consultor.

