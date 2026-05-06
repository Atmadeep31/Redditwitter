import { prisma } from "./prisma";
import { redis } from "./redis";
import { User } from "@prisma/client"

export async function getUserbyClerk(clerkId:string): Promise<User | null>{
    const CACHE_KEY = `user:${clerkId}`
    const cached = await redis.get<User>(CACHE_KEY);
    if(cached){
        console.log("cache hit");
        return cached;
    } 
    // Cache miss
    const user = await prisma.user.findUnique({
        where: { clerkId }
      })
    if(user){
        await redis.set(CACHE_KEY,JSON.stringify(user), {ex:3600})
    }
    return user;
}