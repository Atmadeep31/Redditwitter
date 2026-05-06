import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton,SignUpButton,SignOutButton } from "@clerk/nextjs";
import { nanoid } from "nanoid";
import { PostDetails } from "@/lib/types"
import PostList from "@/components/post/PostList";
import { Bell, MessageCircle } from "lucide-react";
import NotificationBell from "@/components/Notification/NotificationList";
import { redis } from "@/lib/redis";
import searchBox from "@/components/search/searchbox";
import SearchBox from "@/components/search/searchbox";


export default async function Home() {

  const {userId} = await auth();
  if(!userId) return (
    <div>
      <h1>Welcome to Reditwiter</h1>
      <p>Sign in to get started</p>
      <SignInButton mode="modal">
        <Button>Sign in with Google</Button>
      </SignInButton>
      <SignUpButton mode = "modal">
        <Button>Sign up with google</Button>
      </SignUpButton>
    </div>
  )// Create sign in page
  // check if an user with this clerk userId exists, if yes..do nothing, if no, redirect to ('/create-profile')
  let user = await prisma.user.findUnique({
    where:{
      clerkId: userId 
    }
  })
  
  if(!user){
    const clerkUser = await currentUser();
    user = await prisma.user.create({
      data:{
        clerkId : userId,
        username: `${clerkUser?.firstName}_${nanoid(4)}`.toLowerCase(),
        email: clerkUser?.emailAddresses[0].emailAddress??""
      }
    })
  }
  // user specific cache

  const CACHE_KEY =  `posts:top:${user!.id}`;
  let posts:PostDetails[];

  const cached = await redis.get<PostDetails[]>(CACHE_KEY);
  if(cached){
    console.log("cache hits");
     posts = cached;
  }else {
    posts = await prisma.post.findMany({
      include:{
        author: true,
        tags: {include : {tag:true}},
        _count:{
          select:{
            likes:true,
            comments:true
          }
        },
        likes: {
          where:{userId:user.id} // only the like of the current user
        },
        comments: true
      },
      orderBy: {
        likes: {
          _count: 'desc'
        }
      },
      take:20
    })
    await redis.set(CACHE_KEY,JSON.stringify(posts),{ex:180})
  }
  
  return (
    <div className="flex flex-col gap-2 ">
      Welcome to reditwiter..{user.username}!!
      
      <div>
        
        <ul> 
          <li>
            <Link href={`/Account`}>Your Account</Link>
          </li>
          <li>
            <Button><Link href={`/Post`}>Create Post</Link></Button>
          </li>
          <li>
            <NotificationBell userId={user.id}/>
          </li>
        </ul>
      </div>
      <div className="flex justify-center">
        <PostList
      posts={posts}
      />
      </div>
      
    </div>
  )
}
