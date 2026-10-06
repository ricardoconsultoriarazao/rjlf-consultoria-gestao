# RJLF Consultoria - Ferramenta PVE e RCF

Aplicacao Next.js pronta para Vercel + Supabase.

## Modulos

- Dados da Empresa
- PVE
- RCF por funcao
- Exportacao JSON para uso posterior na ferramenta do consultor

Organograma, diagnostico e recomendacoes ficam fora desta versao do gestor.

## Variaveis de ambiente

Configure na Vercel em `Settings > Environment Variables`:

| Nome | Onde localizar |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Project Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Project Settings > API > anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Project Settings > API > service_role |
| `NEXT_PUBLIC_APP_URL` | URL do site na Vercel |

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
