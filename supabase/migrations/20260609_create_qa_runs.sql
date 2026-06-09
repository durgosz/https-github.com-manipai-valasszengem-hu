create table if not exists public.qa_runs (
  id               uuid        primary key default gen_random_uuid(),
  created_at       timestamptz default now(),
  status           text        not null,
  typecheck_status text,
  build_status     text,
  stdout           text,
  stderr           text,
  duration_ms      integer
);

alter table public.qa_runs enable row level security;
-- Csak service role fér hozzá (admin API service role kulcsot használ, ami megkerüli az RLS-t)
