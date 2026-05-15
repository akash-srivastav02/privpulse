-- Summary stats function
create or replace function get_summary(p_site_id uuid, p_interval text)
returns json language plpgsql security definer as $$
declare
  v_visitors bigint; v_pageviews bigint; v_bounce numeric; v_dur numeric;
  v_prev_v bigint; v_prev_p bigint;
  v_start timestamptz := now() - p_interval::interval;
  v_prev_start timestamptz := now() - (p_interval::interval * 2);
begin
  select count(distinct visitor_hash), count(*)
  into v_visitors, v_pageviews from pageviews
  where site_id = p_site_id and timestamp >= v_start;

  select round(100.0 * sum(case when cnt=1 then 1 else 0 end) / nullif(count(*),0), 1)
  into v_bounce from (
    select session_hash, count(*) as cnt from pageviews
    where site_id = p_site_id and timestamp >= v_start
    group by session_hash
  ) s;

  select count(distinct visitor_hash), count(*) into v_prev_v, v_prev_p
  from pageviews where site_id = p_site_id
    and timestamp >= v_prev_start and timestamp < v_start;

  return json_build_object(
    'visitors', v_visitors, 'pageviews', v_pageviews,
    'bounceRate', coalesce(v_bounce, 0),
    'prevVisitors', v_prev_v, 'prevPageviews', v_prev_p,
    'visitorsChange', case when v_prev_v > 0 then round(100.0*(v_visitors-v_prev_v)/v_prev_v,1) else null end,
    'pageviewsChange', case when v_prev_p > 0 then round(100.0*(v_pageviews-v_prev_p)/v_prev_p,1) else null end
  );
end; $$;

-- Time series function
create or replace function get_time_series(p_site_id uuid, p_interval text)
returns json language plpgsql security definer as $$
declare v_trunc text := case when p_interval = '365 days' then 'week' else 'day' end;
begin
  return (select json_agg(row_to_json(t) order by t.period) from (
    select date_trunc(v_trunc, timestamp)::date::text as period,
           count(distinct visitor_hash) as visitors,
           count(*) as pageviews
    from pageviews
    where site_id = p_site_id and timestamp >= now() - p_interval::interval
    group by date_trunc(v_trunc, timestamp)
  ) t);
end; $$;

grant execute on function get_summary(uuid,text) to service_role, authenticated;
grant execute on function get_time_series(uuid,text) to service_role, authenticated;
