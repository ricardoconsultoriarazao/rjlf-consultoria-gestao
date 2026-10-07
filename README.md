# RJLF Consultoria - Ferramenta PVE e RCF

Aplicacao Next.js pronta para Vercel + Supabase.

## Modulos

- Dados da Empresa
- PVE
- RCF por funcao
- Organograma funcional do gestor quando liberado pelo consultor
- Exportacao JSON para uso posterior na ferramenta do consultor
- Ferramenta do consultor em `/consultor`
- Login com senha para o consultor em `/consultor-login`
- Envio de convite por e-mail via Supabase Auth
- Importacao do JSON do gestor
- Organograma funcional
- Diagnostico, recomendacoes e proximos passos em ambiente separado

Diagnostico, recomendacoes e proximos passos ficam fora da area do gestor.

## Variaveis de ambiente

Configure na Vercel em `Settings > Environment Variables`:

| Nome | Onde localizar |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Project Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Project Settings > API > anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Project Settings > API > service_role |
| `NEXT_PUBLIC_APP_URL` | URL do site na Vercel |
| `CONSULTANT_PASSWORD` | Senha que voce usara para entrar como consultor |
| `CONSULTANT_SESSION_TOKEN` | Texto longo e secreto para proteger a sessao do consultor |

Exemplo de `CONSULTANT_SESSION_TOKEN`: use uma frase aleatoria longa, sem espacos, como `rjlf-consultor-2026-token-seguro`.

## Rodar localmente

```bash
npm install
npm run dev
```

## Banco de dados

Execute o arquivo `supabase/schema.sql` no Supabase em:

`SQL Editor > New query > Run`

## Publicar na Vercel

1. Suba estes arquivos para o GitHub.
2. Na Vercel, importe o repositorio.
3. Em `Framework Preset`, selecione `Next.js`.
4. Adicione as variaveis de ambiente.
5. Clique em `Deploy`.
