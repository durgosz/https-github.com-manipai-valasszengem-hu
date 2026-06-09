create table if not exists public.tasks (
  id             uuid        primary key default gen_random_uuid(),
  created_at     timestamptz default now(),

  title          text        not null,
  description    text,

  assigned_agent text,
  status         text        default 'TODO',
  priority       text        default 'MEDIUM',

  due_date       timestamptz
);

alter table public.tasks enable row level security;
-- Csak service role fér hozzá (admin API service role kulcsot használ)
