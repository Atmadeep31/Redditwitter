import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export const dummyFunction = inngest.createFunction(
  { id: "dummy", triggers: [{ event: "dummy/event" }] },
  async ({ event }) => {
    return { success: true }
  }
)

export const likeNotification = inngest.createFunction(
    {
        id: "like-notification",
        retries:3,
        triggers : [{event: "notification/like"}]
    },
    async({event}:{event:any}) =>{
        const {actorId, recipientId, postId} = event.data
        if(actorId == recipientId) return;

        await prisma.notification.create({
            data: {
              type: "LIKE",
              actorId,
              recipientId,
              postId
            }
          })
          await redis.del(`notifications:${recipientId}`)
    }
)

export const commentNotification = inngest.createFunction(
    {
        id: "comment-notification",
        retries:3,
        triggers : [{event: "notification/comment"}]
    },
    async({event}:{event:any}) => {
        const {actorId, recipientId, postId} = event.data;
        if(actorId == recipientId) return;
        await prisma.notification.create({
            data: {
              type: "COMMENT",
              actorId,
              recipientId,
              postId
            }
          })
          await redis.del(`notifications:${recipientId}`)
    }
    
)

export const creteBGPost = inngest.createFunction(
    {
        id: "post-create",
        retries:3,
        triggers: [{event: "post/create"}]
    },
    async({event}:{event:any})=>{
        console.log("Inngest received:", event.data)
        const {title,content,authorId,tags} = event.data;
        await prisma.post.create({
            data:{
                title,
                content,
                authorId, 
                tags: {
                    create: tags.map((tagName: string) => ({
                        tag: {
                            connectOrCreate: {
                                where: { name: tagName },
                                create: { name: tagName }
                            }
                        }
                    }))
                }
            }
           })
           
    }
)