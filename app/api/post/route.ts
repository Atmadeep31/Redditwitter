import { getUserbyClerk } from "@/lib/getUser";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { postRateLimit } from "@/lib/ratelimit";
import { PostSchema } from "@/lib/validators/posts";
import { auth } from "@clerk/nextjs/server";
import { NextRequest,NextResponse } from "next/server";

export async function POST(req:NextRequest){
    console.log("API ROUTE HIT") 
    try {
        const {userId} = await auth();
        if(!userId){
            return NextResponse.json({error:"Unauthorized"},{status:401});
        }

        // Check for rate limit
        const {success,limit,reset,remaining} = await postRateLimit.limit(userId);
        if(!success){
            return NextResponse.json({
                error: "Too many posts..try again later",
                limit,
                reset,
                remaining
            },{
                status:429
            })
        }
        // check for user
        const user = await getUserbyClerk(userId);
        if(!user){
            return NextResponse.json({error:"User not found",},{status:404})
        }
        const body = await req.json();
        const validated = PostSchema.safeParse(body);
        if(!validated.success){
            return NextResponse.json({error:validated.error},{status:400})
        }
        const {title,content,tags} = validated.data
        await inngest.send({
            name: "post/create",
            data:{
               title,
               content,
               authorId : user.id,
               tags
            }
           })
       
       return NextResponse.json({message:"post creation on the way"},{status:201})

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
        
    }
}

