import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { UpdateUserSchema } from "@/lib/validators/user";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req:NextRequest){
    try {
        const {userId} = await auth();
        if(!userId){
            return NextResponse.json({error:"Unauthorized"},{status:401});
        }
        const body = await req.json();
        const validated = UpdateUserSchema.safeParse(body);
        if(!validated.success){
            return NextResponse.json({error:validated.error},{status:401})
        }
        const {username,bio} = validated.data;
        const existingUserName = await prisma.user.findUnique({
            where: 
            {username,
            NOT: { clerkId: userId } // exclude current user
            }
        })
        if(existingUserName){
            return NextResponse.json({error:"Username already exists"},{status:409})
        }
        const user = await prisma.user.update({
            where:{
                clerkId:userId
            },
            data:{  
                username,
                bio
            }
        })
        // invalidate the cache
        await redis.del(`user:${userId}`);
        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
