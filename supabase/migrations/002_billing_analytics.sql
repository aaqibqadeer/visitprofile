-- Subscriptions table
create table if not exists subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid references auth.users(id) on delete cascade unique not null,
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  plan                    text not null default 'free',
  period                  text not null default 'monthly',
  status                  text not null default 'active',
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  updated_at              timestamptz default now()
);

alter table subscriptions enable row level security;
create policy "User reads own subscription" on subscriptions
  for select using (auth.uid() = user_id);

-- Profile views table (no PII — no IP stored)
create table if not exists profile_views (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null references profiles(slug) on delete cascade,
  viewed_at     timestamptz not null default now(),
  referrer      text,
  device_type   text,
  country_code  text,
  session_id    text
);

create index if not exists profile_views_slug_idx on profile_views(slug);
create index if not exists profile_views_viewed_at_idx on profile_views(viewed_at);

alter table profile_views enable row level security;
create policy "No public select on profile_views" on profile_views
  for select using (false);

-- Profile link clicks table
create table if not exists profile_link_clicks (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null references profiles(slug) on delete cascade,
  clicked_at  timestamptz not null default now(),
  link_label  text not null,
  link_kind   text not null,
  session_id  text
);

create index if not exists profile_link_clicks_slug_idx on profile_link_clicks(slug);

alter table profile_link_clicks enable row level security;
create policy "No public select on profile_link_clicks" on profile_link_clicks
  for select using (false);
