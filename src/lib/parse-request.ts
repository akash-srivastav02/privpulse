export interface Parsed {
  country:string|null; countryName:string|null; city:string|null
  deviceType:'mobile'|'desktop'|'tablet'; browser:string|null; os:string|null
  referrerHost:string|null; ip:string
}
const COUNTRIES:Record<string,string> = {
  IN:'India',US:'United States',GB:'United Kingdom',SG:'Singapore',
  AU:'Australia',CA:'Canada',DE:'Germany',FR:'France',AE:'UAE',MY:'Malaysia'
}
export function getIp(req:Request):string {
  return req.headers.get('CF-Connecting-IP')||req.headers.get('x-forwarded-for')?.split(',')[0].trim()||'127.0.0.1'
}
export function parseRequest(req:Request):Parsed {
  const ua = req.headers.get('user-agent')||''
  const country = req.headers.get('CF-IPCountry')||req.headers.get('x-vercel-ip-country')||null
  const ref = req.headers.get('referer')
  let referrerHost:string|null=null
  if(ref){try{referrerHost=new URL(ref).hostname.replace(/^www\./,'')}catch{}}
  const u=ua.toLowerCase()
  const deviceType = /ipad|tablet/.test(u)?'tablet':/mobile|android|iphone/.test(u)?'mobile':'desktop'
  const browser = /Edg\//.test(ua)?'Edge':/OPR|Opera/.test(ua)?'Opera':/Chrome\//.test(ua)?'Chrome':/Firefox/.test(ua)?'Firefox':/Safari/.test(ua)?'Safari':null
  const os = /Windows/.test(ua)?'Windows':/Android/.test(ua)?'Android':/iPhone|iPad/.test(ua)?'iOS':/Mac/.test(ua)?'macOS':/Linux/.test(ua)?'Linux':null
  return {country,countryName:country?COUNTRIES[country]??country:null,city:req.headers.get('CF-IPCity')||null,deviceType,browser,os,referrerHost,ip:getIp(req)}
}
