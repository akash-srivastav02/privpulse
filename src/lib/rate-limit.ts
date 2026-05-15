import { Redis } from '@upstash/redis'
let redis:Redis|null=null
function getRedis(){
  if(!process.env.UPSTASH_REDIS_REST_URL) return null
  if(!redis) redis=new Redis({url:process.env.UPSTASH_REDIS_REST_URL!,token:process.env.UPSTASH_REDIS_REST_TOKEN!})
  return redis
}
export async function isRateLimited(ip:string):Promise<boolean>{
  const r=getRedis(); if(!r) return false
  const k=`rl:${ip}`,n=await r.incr(k)
  if(n===1) await r.expire(k,60)
  return n>60
}
