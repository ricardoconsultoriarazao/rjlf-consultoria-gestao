# Checklist de Deploy

## Supabase

- [ ] Criar projeto Supabase
- [ ] Executar `02_SUPABASE_SCHEMA_RLS.sql`
- [ ] Ativar e configurar Auth por e-mail
- [ ] Configurar URL do site em Authentication > URL Configuration
- [ ] Configurar SMTP ou usar Resend
- [ ] Criar usuario consultor inicial
- [ ] Inserir profile do consultor com role `consultor`
- [ ] Testar RLS com dois usuarios gestores

## Vercel

- [ ] Criar projeto na Vercel
- [ ] Conectar repositorio GitHub
- [ ] Configurar variaveis de ambiente
- [ ] Configurar dominio
- [ ] Fazer primeiro deploy
- [ ] Testar login
- [ ] Testar convite
- [ ] Testar preenchimento PVE
- [ ] Testar preenchimento RCF
- [ ] Testar exportacao JSON

## Testes de seguranca

- [ ] Gestor A nao ve empresa do Gestor B
- [ ] Gestor sem PVE liberado nao acessa PVE
- [ ] Gestor sem RCF liberado nao acessa RCF
- [ ] Gestor nao acessa painel consultor
- [ ] Usuario sem login nao acessa paginas internas
- [ ] Service role nao aparece no navegador

