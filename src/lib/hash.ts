import { createHash } from "crypto";

const salt = process.env.VISITOR_HASH_SALT ?? process.env.HASH_SALT ?? "dev-salt-change-before-production";

export function makeVisitorHash(siteId: string, ip: string, userAgent: string) {
  const day = new Date().toISOString().slice(0, 10);
  return sha256(`${siteId}|${ip}|${userAgent}|${day}|${salt}`);
}

export function makeSessionHash(siteId: string, ip: string, userAgent: string) {
  const hour = new Date().toISOString().slice(0, 13);
  return sha256(`${siteId}|${ip}|${userAgent}|${hour}|${salt}`);
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
