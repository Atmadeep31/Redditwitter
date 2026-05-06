import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { likeRateLimit } from "@/lib/ratelimit";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const postId = id;
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Check for rate limit
    const {success,limit,reset,remaining} = await likeRateLimit.limit(userId);
    if(!success){
        return NextResponse.json({
            error: "Too many likes..try again later",
            limit,
            reset,
            remaining
        },{
            status:429
        })
    }
    const user = await prisma.user.findUnique({
        where: {
            clerkId: userId
        }
    })
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })
    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const exisingLike = await prisma.like.findUnique(
        {
            where: {
                userId_postId: {
                    userId: user.id,
                    postId: post.id
                }
            }
        }
    )
    if (exisingLike) {
        await prisma.like.delete({
            where: {
                userId_postId: {
                    userId: exisingLike.userId,
                    postId: exisingLike.postId
                }

            }
        })
        return NextResponse.json({ liked: false }, { status: 200 })
    }
    else {
        const like = await prisma.like.create({
            data: {
                userId: user.id,
                postId: post.id
            }
        })
        await inngest.send({
            name: "notification/like",
            data:{
                actorId: user.id,
                recipientId: post.authorId,
                postId: post.id
            }
        })
    }
    return NextResponse.json({ liked: true }, { status: 200 })
}