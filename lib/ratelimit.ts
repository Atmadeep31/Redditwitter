import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "./redis"


export const postRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5,"1h"),
    analytics: true
})

export const likeRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100,"1h"),
    analytics:true
})

export const commentRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30,"1h"),
    analytics:true
})