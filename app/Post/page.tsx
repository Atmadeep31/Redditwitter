import CreatePost from "@/components/post/PostCreateForm";
import { getUserbyClerk } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import { useUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function CreatePostPage ()  {
    // use clerkId to get user.id and pass as prop in PostCreateForm
    const {userId} = await auth();
    if(!userId) redirect('/')
    const user = await getUserbyClerk(userId);
    if(!user) redirect('/')
    return (
        <div>
            Create your Posts
           <CreatePost
           id={user?.id}
           />
        </div>
    );
}

