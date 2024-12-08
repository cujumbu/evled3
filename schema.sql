-- Drop existing table and start fresh
drop table if exists public.timers;

-- Create the timers table if it doesn't exist
create table if not exists public.timers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  end_date timestamp with time zone not null,
  style text not null,
  color text not null,
  created_at timestamp with time zone default now() not null,
  views integer default 0 not null,
  max_views integer,
  active boolean default true not null
);

-- Add language column if it doesn't exist
do $$
begin
  if not exists (
    select from information_schema.columns
    where table_name = 'timers' and column_name = 'language'
  ) then
    alter table public.timers add column language text not null default 'en';
  end if;
end $$;

-- Enable RLS
alter table public.timers enable row level security;

-- Add constraints
alter table public.timers
  add constraint valid_style check (style in ('modern', 'minimal', 'classic', 'neon', 'gradient', 'elegant')),
  add constraint valid_language check (language in (
    'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko',
    'nl', 'pl', 'cs', 'sv', 'da', 'fi', 'no', 'hu', 'el', 'ro',
    'bg', 'hr', 'sk', 'sl'
  ));

-- Set up RLS policies
do $$
begin
  -- Drop existing policies
  begin
    drop policy if exists "Users can view their own timers" on public.timers;
    drop policy if exists "Anon can view active timers" on public.timers;
    drop policy if exists "Users can create timers" on public.timers;
    drop policy if exists "Users can update their own timers" on public.timers;
    drop policy if exists "Users can delete their own timers" on public.timers;
  exception when duplicate_object then
    null;
  end;

  -- Policy for authenticated users to view their timers
  begin
    create policy "Users can view their own timers" 
      on public.timers 
      for select 
      using (auth.uid() = user_id);
  exception when duplicate_object then
    null;
  end;

  -- Policy for anonymous users to view active timers
  begin
    create policy "Anon can view active timers" 
      on public.timers 
      for select 
      using (active = true);
  exception when duplicate_object then
    null;
  end;

  -- Policy for authenticated users to create timers
  begin
    create policy "Users can create timers" 
      on public.timers 
      for insert 
      with check (auth.uid() = user_id);
  exception when duplicate_object then
    null;
  end;

  -- Policy for authenticated users to update their timers
  begin
    create policy "Users can update their own timers" 
      on public.timers 
      for update 
      using (auth.uid() = user_id);
  exception when duplicate_object then
    null;
  end;

  -- Policy for authenticated users to delete their timers
  begin
    create policy "Users can delete their own timers" 
      on public.timers 
      for delete 
      using (auth.uid() = user_id);
  exception when duplicate_object then
    null;
  end;
end$$;

-- Create indexes if they don't exist
create index if not exists idx_timers_user_id on public.timers(user_id);
create index if not exists idx_timers_created_at on public.timers(created_at desc);

-- Update table comment
comment on table public.timers is 'Stores countdown timer configurations for email campaigns';