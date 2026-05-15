export const PLANS = {
  free:  { sites:1,  pageviews:10_000,   days:90,  price:0   },
  indie: { sites:3,  pageviews:100_000,  days:365, price:199 },
  pro:   { sites:20, pageviews:1_000_000,days:730, price:599 },
} as const
export type Plan = keyof typeof PLANS
export async function isOverLimit(siteId:string,plan:string,supabase:any):Promise<boolean>{
  const limit = PLANS[plan as Plan]?.pageviews ?? PLANS.free.pageviews
  const ym = new Date().toISOString().slice(0,7)
  const {data}=await supabase.from('monthly_counts').select('pageviews').eq('site_id',siteId).eq('year_month',ym).maybeSingle()
  return (data?.pageviews??0)>=limit
}
