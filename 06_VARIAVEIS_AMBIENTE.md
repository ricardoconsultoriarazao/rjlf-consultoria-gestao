# Variaveis de Ambiente

Use estas variaveis no projeto Vercel.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=https://seudominio.com.br
RJLF_CONSULTANT_EMAIL=
RESEND_API_KEY=
EMAIL_FROM=RJLF Consultoria <contato@seudominio.com.br>
```

## Observacoes

- `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` podem ir para o navegador.
- `SUPABASE_SERVICE_ROLE_KEY` nunca deve ir para o navegador.
- Convites por e-mail devem ser enviados por rota server-side/API route.
- Se usar o e-mail nativo do Supabase Auth, configurar SMTP no Supabase.
- Se usar Resend, enviar convites por API route da Vercel.

## Dominios

Sugestoes:

- `app.rjlfconsultoria.com.br`
- `gestao.rjlfconsultoria.com.br`
- `diagnostico.rjlfconsultoria.com.br`

