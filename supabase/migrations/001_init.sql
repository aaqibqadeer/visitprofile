-- VisitProfile — initial schema

-- Signup request queue (public form submissions awaiting admin approval)
create table if not exists signup_requests (
  id            uuid primary key default gen_random_uuid(),
  status        text not null default 'pending', -- pending | approved | rejected
  name_first    text not null,
  name_last     text not null,
  email         text not null,
  phone         text not null,
  company       text,
  role_title    text,
  tagline       text,
  location      text,
  photo_src     text,
  photo_alt     text,
  notes         text,          -- admin internal notes
  temp_password text,          -- set by admin on approval, shown once
  approved_by   uuid references auth.users(id),
  approved_at   timestamptz,
  created_at    timestamptz default now()
);

alter table signup_requests enable row level security;
-- Anyone can submit a request; only service role reads/modifies
create policy "Public can insert" on signup_requests
  for insert with check (true);
create policy "Nobody selects via RLS" on signup_requests
  for select using (false);
create policy "Nobody updates via RLS" on signup_requests
  for update using (false);

-- Main profiles table
create table if not exists profiles (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  user_id          uuid references auth.users(id) on delete cascade,
  status           text not null default 'approved', -- approved | archived

  theme            text not null default 'paper',
  readability      text not null default 'none',

  -- Flexible badge fields: { content: {type:'text'|'image', value|src, alt?}, size?: 'xs'|'sm'|'m'|'large'|'xlarge' }
  monogram         jsonb,
  availability     jsonb,

  name_first       text not null,
  name_last        text not null,
  role_title       text not null default '',
  company          text not null default '',
  tagline          text not null default '',
  location         text not null default '',
  timezone         text not null default '',

  photo_src        text not null default '',
  photo_alt        text not null default '',

  contact_phone    text,
  contact_email    text,
  contact_whatsapp text,

  -- Complex nested structures stored as JSONB for flexibility
  featured         jsonb,
  contacts         jsonb not null default '[]',
  shortcuts        jsonb not null default '[]',
  meta             jsonb,

  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table profiles enable row level security;
-- Public can read approved profiles (for the digital business card pages)
create policy "Public read approved" on profiles
  for select using (status = 'approved');
-- Authenticated user can update their own profile
create policy "User update own" on profiles
  for update using (auth.uid() = user_id);
-- Service role (admin API routes) bypasses RLS automatically

-- Auto-update updated_at on any row change
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- Storage bucket (run once; or create via Supabase dashboard)
-- insert into storage.buckets (id, name, public) values ('profile-images', 'profile-images', true)
-- on conflict do nothing;
