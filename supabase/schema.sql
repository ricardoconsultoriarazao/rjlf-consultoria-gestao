create extension if not exists "pgcrypto";

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'draft',
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.form_submissions enable row level security;

create policy "usuarios autenticados inserem respostas"
on public.form_submissions
for insert
to authenticated
with check (auth.uid() = user_id or user_id is null);

create policy "usuarios autenticados leem proprias respostas"
on public.form_submissions
for select
to authenticated
using (auth.uid() = user_id or user_id is null);

create policy "usuarios autenticados atualizam proprias respostas"
on public.form_submissions
for update
to authenticated
using (auth.uid() = user_id or user_id is null)
with check (auth.uid() = user_id or user_id is null);
