const SALT = process.env.HASH_SALT || 'dev-salt-change-in-prod'
async function sha256(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('')
}
export const makeVisitorHash = (ip:string,ua:string,siteId:string) =>
  sha256(`${ip}|${ua}|${siteId}|${SALT}|${new Date().toISOString().slice(0,10)}`)
export const makeSessionHash = (ip:string,ua:string,siteId:string) =>
  sha256(`${ip}|${ua}|${siteId}|${SALT}|${new Date().toISOString().slice(0,13)}`)
