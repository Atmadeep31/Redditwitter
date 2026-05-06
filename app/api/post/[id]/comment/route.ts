import { getUserbyClerk } from "@/lib/getUser";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { commentRateLimit } from "@/lib/ratelimit";
import { CommentSchema } from "@/lib/validators/comment";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    const {id} = await params;
    const postId = id;
    const {userId} = await auth();
    if(!userId){
        return NextResponse.json({error:"Unauthorized"},{status:401});
    }
    // Check for rate limit
    const {success,limit,reset,remaining} = await commentRateLimit.limit(userId);
    if(!success){
        return NextResponse.json({
            error: "Too many comments..try again later",
            limit,
            reset,
            remaining
        },{
            status:429
        })
    }
    //check for user
    const user = await getUserbyClerk(userId);
    if(!user){
        return NextResponse.json({error:"User not found",},{status:404})
    }
    const post = await prisma.post.findUnique({
        where:{
            id:postId
        }
    })
    if(!post) return NextResponse.json({error:"Post not found",},{status:404})
    const body = await req.json();
    const validated = CommentSchema.safeParse(body);
    if(!validated.success){
        return NextResponse.json({error:validated.error},{status:400})
    }
    const {content} = validated.data;
    const comment = await prisma.comment.create({
        data:{
            userId: user.id,
            postId: postId,
            content:content
        },
        include:{
            user:true
        }
    })

    
    await inngest.send({
        name: "notification/comment",
        data:{
            actorId: user.id,
            recipientId: post.authorId,
            postId: post.id
        }
    })
    
    return NextResponse.json(comment,{status:200})
}