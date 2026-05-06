import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {NotificationDetails } from "@/lib/types"
import { getUserbyClerk } from "@/lib/getUser";

export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const user = await getUserbyClerk(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  
  if (user.id !== id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const CACHE_Key = `notifications:${id}`;
  const cached = await redis.get<NotificationDetails[]>(CACHE_Key)
  if(cached){
    console.log("cache hits");
    return NextResponse.json({notifications:cached},{status:200})
  }
  const notifications = await prisma.notification.findMany({
        where:{
            recipientId:id,
            read: false
        },
        include:{
            actor: true,
            post:true
        },
        orderBy: { createdAt: 'desc' }
    })

    await redis.set(CACHE_Key,JSON.stringify(notifications),{ex:300})
    return NextResponse.json({notifications:notifications},{status:200})
}

export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  
  if (user.id !== id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    await prisma.notification.updateMany({
        where:{
            recipientId:id
        },
        data:{
            read: true
        }
    })
    return NextResponse.json({message:"All Notificatoons read"},{status:200})
}