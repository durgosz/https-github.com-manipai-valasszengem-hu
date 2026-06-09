alter table public.qa_runs
  add column if not exists lint_status text,
  add column if not exists summary     text;
