create table if not exists public.leads (
  id         uuid        primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  name       text,
  email      text,
  phone      text,

  source     text,
  status     text default 'NEW',

  notes      text
);

alter table public.leads enable row level security;
-- Csak service role fér hozzá (admin API service role kulcsot használ)
