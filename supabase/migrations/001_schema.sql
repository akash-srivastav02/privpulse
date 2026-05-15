-- PrivPulse Complete Schema
create extension if not exists "uuid-ossp";

-- Sites
create table if not exists sites (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  name         text not null,
  domain       text not null,
  site_key     text unique not null default 'pp_' || replace(gen_random_uuid()::text, '-', ''),
  plan         text not null default 'free',
  public_stats boolean not null default false,
  created_at   timestamptz not null default now()
);
create index idx_sites_key    on sites(site_key);
create index idx_sites_user   on sites(user_id);

-- Pageviews
create table if not exists pageviews (
  id            bigserial primary key,
  site_id       uuid references sites(id) on delete cascade not null,
  url           text not null,
  pathname      text not null,
  referrer      text,
  referrer_host text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  visitor_hash  text not null,
  session_hash  text not null,
  country       text,
  country_name  text,
  city          text,
  device_type   text,
  browser       text,
  os            text,
  duration_sec  int,
  timestamp     timestamptz not null default now()
);
create index idx_pv_site_time on pageviews(site_id, timestamp desc);
create index idx_pv_visitor   on pageviews(site_id, visitor_hash);
create index idx_pv_session   on pageviews(site_id, session_hash);

-- Custom events
create table if not exists events (
  id           bigserial primary key,
  site_id      uuid references sites(id) on delete cascade not null,
  name         text not null,
  url          text not null,
  pathname     text not null,
  visitor_hash text not null,
  props        jsonb,
  timestamp    timestamptz not null default now()
);
create index idx_events_site on events(site_id, timestamp desc);

-- Monthly counts (for quota enforcement)
create table if not exists monthly_counts (
  site_id    uuid references sites(id) on delete cascade not null,
  year_month text not null,
  pageviews  int not null default 0,
  primary key (site_id, year_month)
);

-- Auto-increment monthly counter
create or replace function increment_monthly_count()
returns trigger language plpgsql as $$
begin
  insert into monthly_counts(site_id, year_month, pageviews)
  values (NEW.site_id, to_char(NEW.timestamp, 'YYYY-MM'), 1)
  on conflict (site_id, year_month)
  do update set pageviews = monthly_counts.pageviews + 1;
  return NEW;
end;
$$;
create trigger trg_monthly_count
after insert on pageviews
for each row execute function increment_monthly_count();

-- RLS
alter table sites          enable row level security;
alter table pageviews      enable row level security;
alter table events         enable row level security;
alter table monthly_counts enable row level security;

create policy "own_sites"   on sites          for all using (auth.uid() = user_id);
create policy "own_pv"      on pageviews      for all using (site_id in (select id from sites where user_id = auth.uid()));
create policy "own_events"  on events         for all using (site_id in (select id from sites where user_id = auth.uid()));
create policy "own_counts"  on monthly_counts for all using (site_id in (select id from sites where user_id = auth.uid()));

-- Public stats policy (for shared dashboards)
create policy "public_sites_read" on sites
  for select using (public_stats = true);
