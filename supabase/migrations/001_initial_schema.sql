create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'transaction_type'
  ) then
    create type public.transaction_type as enum ('income', 'expense');
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'category_type'
  ) then
    create type public.category_type as enum ('income', 'expense', 'both');
  end if;
end
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null unique,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  name text not null,
  icon text not null,
  color text not null,
  type public.category_type not null,
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  constraint categories_owner_or_default_chk check (
    (is_default = true and user_id is null)
    or (is_default = false and user_id is not null)
  )
);

create unique index if not exists categories_default_name_type_uidx
  on public.categories (name, type)
  where is_default = true;

create unique index if not exists categories_user_name_type_uidx
  on public.categories (user_id, name, type)
  where user_id is not null;

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete restrict,
  title text not null,
  amount numeric(12,2) not null check (amount > 0),
  type public.transaction_type not null,
  transaction_date date not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint transactions_title_not_blank_chk check (char_length(trim(title)) > 0)
);

create index if not exists transactions_user_id_idx
  on public.transactions (user_id);

create index if not exists transactions_category_id_idx
  on public.transactions (category_id);

create index if not exists transactions_user_date_idx
  on public.transactions (user_id, transaction_date desc);

create index if not exists transactions_user_type_idx
  on public.transactions (user_id, type);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_transactions_updated_at on public.transactions;

create trigger set_transactions_updated_at
before update on public.transactions
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do update
    set name = excluded.name,
        email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into public.categories (name, icon, color, type, is_default)
select seed.name, seed.icon, seed.color, seed.type, true
from (
  values
    ('Salario', 'cash', '#34D399', 'income'::public.category_type),
    ('Freelance', 'laptop', '#8B80F9', 'income'::public.category_type),
    ('Investimentos', 'trending-up', '#60A5FA', 'income'::public.category_type),
    ('Alimentacao', 'fast-food', '#F59E0B', 'expense'::public.category_type),
    ('Transporte', 'car', '#38BDF8', 'expense'::public.category_type),
    ('Moradia', 'home', '#FB7185', 'expense'::public.category_type),
    ('Saude', 'medkit', '#22C55E', 'expense'::public.category_type),
    ('Outros', 'ellipsis-horizontal', '#A78BFA', 'both'::public.category_type)
) as seed(name, icon, color, type)
where not exists (
  select 1
  from public.categories existing
  where existing.is_default = true
    and existing.name = seed.name
    and existing.type = seed.type
);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Categories are viewable by owner or default" on public.categories;
create policy "Categories are viewable by owner or default"
on public.categories
for select
using (is_default = true or auth.uid() = user_id);

drop policy if exists "Categories are insertable by owner" on public.categories;
create policy "Categories are insertable by owner"
on public.categories
for insert
with check (auth.uid() = user_id and is_default = false);

drop policy if exists "Categories are updatable by owner" on public.categories;
create policy "Categories are updatable by owner"
on public.categories
for update
using (auth.uid() = user_id and is_default = false)
with check (auth.uid() = user_id and is_default = false);

drop policy if exists "Categories are deletable by owner" on public.categories;
create policy "Categories are deletable by owner"
on public.categories
for delete
using (auth.uid() = user_id and is_default = false);

drop policy if exists "Transactions are viewable by owner" on public.transactions;
create policy "Transactions are viewable by owner"
on public.transactions
for select
using (auth.uid() = user_id);

drop policy if exists "Transactions are insertable by owner" on public.transactions;
create policy "Transactions are insertable by owner"
on public.transactions
for insert
with check (auth.uid() = user_id);

drop policy if exists "Transactions are updatable by owner" on public.transactions;
create policy "Transactions are updatable by owner"
on public.transactions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Transactions are deletable by owner" on public.transactions;
create policy "Transactions are deletable by owner"
on public.transactions
for delete
using (auth.uid() = user_id);