import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { hasUpstash } from "./config";

let limiter: Ratelimit | null = null;

export async function checkRateLimit(identifier: string) {
  if (!hasUpstash) {
    return { success: true };
  }

  limiter ??= new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    }),
    limiter: Ratelimit.slidingWindow(120, "1 m"),
    analytics: true,
  });

  return limiter.limit(identifier);
}
