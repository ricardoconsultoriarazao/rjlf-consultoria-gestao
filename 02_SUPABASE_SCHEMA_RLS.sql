-- RJLF Consultoria - Supabase schema
-- Execute este arquivo no SQL Editor do Supabase.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'consultor', 'gestor');
create type public.company_status as enum (
  'rascunho',
  'convite_enviado',
  'em_preenchimento',
  'enviado_ao_consultor',
  'em_analise',
  'finalizado'
);
create type public.module_status as enum (
  'nao_liberado',
  'liberado',
  'em_preenchimento',
  'enviado',
  'bloqueado'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  role public.user_role not null default 'gestor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  consultant_id uuid not null references public.profiles(id),
  name text not null,
  segment text,
  city text,
  state text,
  size text,
  main_challenge text,
  context_notes text,
  status public.company_status not null default 'rascunho',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.company_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  member_role public.user_role not null default 'gestor',
  can_answer_pve boolean not null default false,
  can_answer_rcf boolean not null default false,
  pve_status public.module_status not null default 'nao_liberado',
  rcf_status public.module_status not null default 'nao_liberado',
  invited_by uuid references public.profiles(id),
  invited_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  unique(company_id, user_id)
);

create table public.pve_responses (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.companies(id) on delete cascade,
  vision text,
  mission text,
  ambition text,
  values_json jsonb not null default '[]'::jsonb,
  admired_behaviors text,
  intolerable_behaviors text,
  desired_profile text,
  undesired_profile text,
  culture_daily text,
  culture_rituals text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rcf_functions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  position_order int not null default 0,
  function_name text not null,
  mission text,
  main_result text,
  key_responsibilities text,
  daily_activities text,
  result_goals text,
  routine_goals text,
  indicators text,
  expected_behaviors text,
  unacceptable_behaviors text,
  autonomy_can text,
  autonomy_validate text,
  autonomy_cannot text,
  internal_interfaces text,
  delivery_30 text,
  delivery_60 text,
  delivery_90 text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  company_id uuid references public.companies(id) on delete cascade,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.company_members enable row level security;
alter table public.pve_responses enable row level security;
alter table public.rcf_functions enable row level security;
alter table public.audit_logs enable row level security;

-- Helper functions
create or replace function public.is_admin_or_consultor()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'consultor')
  );
$$;

create or replace function public.can_access_company(company_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.companies c
    where c.id = company_uuid
      and c.consultant_id = auth.uid()
  )
  or exists (
    select 1
    from public.company_members cm
    where cm.company_id = company_uuid
      and cm.user_id = auth.uid()
  );
$$;

create or replace function public.can_edit_pve(company_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select public.is_admin_or_consultor()
  or exists (
    select 1
    from public.company_members cm
    where cm.company_id = company_uuid
      and cm.user_id = auth.uid()
      and cm.can_answer_pve = true
      and cm.pve_status in ('liberado', 'em_preenchimento')
  );
$$;

create or replace function public.can_edit_rcf(company_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select public.is_admin_or_consultor()
  or exists (
    select 1
    from public.company_members cm
    where cm.company_id = company_uuid
      and cm.user_id = auth.uid()
      and cm.can_answer_rcf = true
      and cm.rcf_status in ('liberado', 'em_preenchimento')
  );
$$;

-- Profiles
create policy "profiles_select_own_or_consultor"
on public.profiles for select
using (id = auth.uid() or public.is_admin_or_consultor());

create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

-- Companies
create policy "companies_select_access"
on public.companies for select
using (public.can_access_company(id));

create policy "companies_insert_consultor"
on public.companies for insert
with check (public.is_admin_or_consultor() and consultant_id = auth.uid());

create policy "companies_update_consultor_owner"
on public.companies for update
using (consultant_id = auth.uid() or public.is_admin_or_consultor())
with check (consultant_id = auth.uid() or public.is_admin_or_consultor());

-- Members
create policy "members_select_company_access"
on public.company_members for select
using (public.can_access_company(company_id));

create policy "members_insert_consultor"
on public.company_members for insert
with check (
  exists (
    select 1 from public.companies c
    where c.id = company_id and c.consultant_id = auth.uid()
  )
  or public.is_admin_or_consultor()
);

create policy "members_update_consultor"
on public.company_members for update
using (
  exists (
    select 1 from public.companies c
    where c.id = company_id and c.consultant_id = auth.uid()
  )
  or public.is_admin_or_consultor()
)
with check (
  exists (
    select 1 from public.companies c
    where c.id = company_id and c.consultant_id = auth.uid()
  )
  or public.is_admin_or_consultor()
);

-- PVE
create policy "pve_select_company_access"
on public.pve_responses for select
using (public.can_access_company(company_id));

create policy "pve_insert_allowed"
on public.pve_responses for insert
with check (public.can_edit_pve(company_id));

create policy "pve_update_allowed"
on public.pve_responses for update
using (public.can_edit_pve(company_id))
with check (public.can_edit_pve(company_id));

-- RCF
create policy "rcf_select_company_access"
on public.rcf_functions for select
using (public.can_access_company(company_id));

create policy "rcf_insert_allowed"
on public.rcf_functions for insert
with check (public.can_edit_rcf(company_id));

create policy "rcf_update_allowed"
on public.rcf_functions for update
using (public.can_edit_rcf(company_id))
with check (public.can_edit_rcf(company_id));

create policy "rcf_delete_consultor_or_allowed"
on public.rcf_functions for delete
using (public.can_edit_rcf(company_id));

-- Audit
create policy "audit_select_consultor"
on public.audit_logs for select
using (public.is_admin_or_consultor());

create policy "audit_insert_authenticated"
on public.audit_logs for insert
with check (auth.uid() is not null);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_companies_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

create trigger set_pve_updated_at
before update on public.pve_responses
for each row execute function public.set_updated_at();

create trigger set_rcf_updated_at
before update on public.rcf_functions
for each row execute function public.set_updated_at();

