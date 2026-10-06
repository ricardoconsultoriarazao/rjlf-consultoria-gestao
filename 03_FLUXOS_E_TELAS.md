# Fluxos e Telas

## Rotas recomendadas

| Rota | Perfil | Objetivo |
|---|---|---|
| `/login` | Todos | Entrar com e-mail e senha |
| `/setup-senha` | Gestor convidado | Criar senha apos convite |
| `/consultor` | Consultor | Dashboard geral |
| `/consultor/empresas` | Consultor | Lista de empresas |
| `/consultor/empresas/nova` | Consultor | Criar empresa |
| `/consultor/empresas/[id]` | Consultor | Ver empresa, gestores, modulos e status |
| `/consultor/empresas/[id]/convites` | Consultor | Convidar/reenviar convite |
| `/consultor/empresas/[id]/respostas` | Consultor | Visualizar respostas brutas |
| `/consultor/empresas/[id]/exportar` | Consultor | Exportar JSON |
| `/gestor` | Gestor | Lista das empresas do gestor |
| `/gestor/empresa/[id]` | Gestor | Area de preenchimento |
| `/gestor/empresa/[id]/pve` | Gestor | Formulario PVE |
| `/gestor/empresa/[id]/rcf` | Gestor | Formulario RCF |

## Fluxo do consultor

1. Faz login
2. Clica em "Nova empresa"
3. Preenche dados iniciais da empresa
4. Cadastra gestor
5. Escolhe modulos:
   - PVE
   - RCF
   - PVE + RCF
6. Envia convite
7. Acompanha status
8. Abre respostas
9. Exporta JSON para ferramenta do consultor

## Fluxo do gestor

1. Recebe e-mail convite
2. Clica no link
3. Cria senha
4. Entra na area segura
5. Visualiza apenas os modulos liberados
6. Salva rascunho durante preenchimento
7. Envia para consultor
8. Modulo fica bloqueado ou marcado como enviado

## Tela: Dashboard do consultor

Cards:

- Empresas ativas
- Convites pendentes
- Respostas em preenchimento
- Respostas enviadas para analise

Tabela:

- Empresa
- Gestor
- Modulos liberados
- Status PVE
- Status RCF
- Ultima atualizacao
- Acoes

## Tela: Cadastro de empresa

Campos:

- Nome da empresa
- Segmento
- Cidade
- UF
- Porte
- Principal desafio
- Observacoes internas

## Tela: Convite

Campos:

- Nome do gestor
- E-mail do gestor
- Empresa
- Modulos liberados
  - PVE
  - RCF
- Mensagem opcional

Botoes:

- Enviar PVE
- Enviar RCF
- Enviar PVE + RCF
- Reenviar convite

## Tela: Gestor - Home

Mostrar:

- Nome da empresa
- Modulos disponiveis
- Status de cada modulo
- Botao continuar preenchimento

Nao mostrar:

- Diagnostico
- Recomendacoes
- Organograma
- Comparacoes
- Nota ou score

## Tela: PVE

Formato:

- Etapas curtas
- Exemplos abaixo dos campos
- Salvamento automatico
- Botao salvar rascunho
- Botao enviar PVE ao consultor

## Tela: RCF

Formato:

- Lista de funcoes cadastradas
- Botao adicionar funcao
- Duplicar funcao
- Remover funcao
- Campos longos com textarea
- Botao salvar rascunho
- Botao enviar RCF ao consultor

## Exportacao JSON

O consultor deve conseguir exportar:

- Empresa
- Gestores
- PVE
- Lista de RCFs
- Status dos modulos
- Datas de criacao e envio

