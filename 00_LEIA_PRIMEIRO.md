# RJLF Consultoria - Ferramenta PVE e RCF

Este pacote descreve tudo que e necessario para implementar a primeira versao segura da ferramenta da RJLF Consultoria usando Vercel e Supabase.

## Objetivo da versao 1

Criar um sistema seguro para o consultor convidar gestores por e-mail e coletar respostas dos modulos:

1. Dados da empresa
2. PVE - Ponto de Vista Educativo
3. RCF - Responsabilidade Chave da Funcao

O organograma funcional, diagnostico, recomendacoes e relatorio final ficam fora da area do gestor. Eles entram na ferramenta do consultor em uma fase separada.

## Principio do produto

O gestor responde.  
O consultor interpreta.

Por isso, a ferramenta do gestor deve coletar respostas com clareza, mas nao deve entregar diagnostico automatico ao cliente.

## Arquitetura recomendada

| Camada | Ferramenta | Funcao |
|---|---|---|
| Frontend | Vercel + Next.js | Publicar o sistema |
| Banco | Supabase Postgres | Salvar empresas, convites, respostas PVE e RCF |
| Login | Supabase Auth | Login do consultor e do gestor |
| Seguranca | Supabase RLS | Cada gestor ve somente sua empresa |
| Convite | Supabase Auth invite ou Resend | Enviar e-mail de convite |
| Exportacao | JSON | Levar respostas para ferramenta do consultor |

## Escopo de acesso

| Perfil | Acesso |
|---|---|
| Consultor/Admin | Cadastra empresas, convida gestores, escolhe PVE/RCF, acompanha status e exporta respostas |
| Gestor/Cliente | Acessa apenas empresas em que foi convidado e responde somente os modulos liberados |

## Paleta RJLF Consultoria

Baseada na imagem enviada:

| Uso | Cor |
|---|---|
| Verde principal | `#17342D` |
| Verde acao | `#183A31` |
| Fundo da pagina | `#F5F7F2` |
| Card | `#FFFFFF` |
| Borda | `#D8DED4` |
| Texto principal | `#1D2925` |
| Texto secundario | `#66736E` |
| Alerta/erro | `#8A2F2B` |

## Ordem de implementacao

1. Criar projeto Supabase
2. Executar SQL de tabelas e politicas
3. Criar projeto Next.js na Vercel
4. Configurar variaveis de ambiente
5. Implementar login
6. Implementar painel do consultor
7. Implementar convite por e-mail
8. Implementar area do gestor
9. Implementar exportacao JSON
10. Testar regras de seguranca com dois gestores diferentes

