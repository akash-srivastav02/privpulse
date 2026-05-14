create table if not exists sites (
  id text primary key,
  name text not null,
  domain text not null,
  owner_email text not null,
  owner_name text not null,
  plan text not null default 'free',
  public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key,
  site_id text not null references sites(id) on delete cascade,
  type text not null check (type in ('pageview', 'custom')),
  event_name text,
  path text not null,
  title text,
  referrer text,
  referrer_host text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  country text not null default 'Unknown',
  country_name text not null default 'Unknown',
  city text,
  device text not null default 'Desktop',
  browser text,
  os text,
  visitor_hash text not null,
  session_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists plan_limits (
  plan text primary key,
  max_sites int not null,
  max_pageviews int not null,
  data_retention_days int not null
);

insert into plan_limits (plan, max_sites, max_pageviews, data_retention_days) values
  ('free', 1, 10000, 90),
  ('indie', 3, 100000, 365),
  ('agency', 20, 1000000, 730)
on conflict (plan) do nothing;

create table if not exists monthly_counts (
  site_id text not null references sites(id) on delete cascade,
  year_month text not null,
  pageviews int not null default 0,
  primary key (site_id, year_month)
);

create index if not exists events_site_created_idx on events (site_id, created_at desc);
create index if not exists events_site_type_idx on events (site_id, type);
create index if not exists events_visitor_idx on events (site_id, visitor_hash);
create index if not exists events_session_idx on events (site_id, session_hash);
create index if not exists events_path_idx on events (site_id, path);
create index if not exists events_referrer_idx on events (site_id, referrer_host);
create index if not exists events_campaign_idx on events (site_id, utm_source, utm_campaign);

create or replace function increment_monthly_count()
returns trigger language plpgsql as $$
begin
  if new.type = 'pageview' then
    insert into monthly_counts(site_id, year_month, pageviews)
    values (new.site_id, to_char(new.created_at, 'YYYY-MM'), 1)
    on conflict (site_id, year_month)
    do update set pageviews = monthly_counts.pageviews + 1;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_monthly_count on events;
create trigger trg_monthly_count
after insert on events
for each row execute function increment_monthly_count();

create or replace view daily_visitors as
select
  site_id,
  date_trunc('day', created_at) as day,
  count(distinct visitor_hash) as visitors,
  count(*) filter (where type = 'pageview') as pageviews,
  count(*) filter (where type = 'custom') as custom_events
from events
group by site_id, day;

alter table sites enable row level security;
alter table events enable row level security;
alter table monthly_counts enable row level security;

-- The MVP uses the server-side Supabase service role key from Next.js API routes.
-- Add Supabase Auth policies when account login is connected.
