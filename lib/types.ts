// We can define and extract all needed types from here

import { number } from "zod"
import { prisma } from "./prisma"

export type PostDetails = Awaited <ReturnType <typeof prisma.post.findMany<{
    include:{
        author:true
        tags:{include: {tag:true}}
        _count:{select:{likes:true,comments:true}}
        likes: true
        comments:true
    }
}>>>[number]

export type CommentWithUser = Awaited< ReturnType<typeof prisma.comment.findMany<{
    include:{
        user : true
    }
}>>>[number]

export type NotificationDetails = Awaited< ReturnType<typeof prisma.notification.findMany<
{include:{
    actor : true
    post: true
}}
>>>[number]