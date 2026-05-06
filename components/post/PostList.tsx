"use client"
import { PostDetails } from "@/lib/types"
import PostCard from "./PostCard"

interface props {
    posts : PostDetails[]
}

export default function PostList({posts}:props){
    return (
        <div className=" flex flex-col gap-2.5 max-w-xl">
            {
                posts.map((post=>(
                    <PostCard key={post.id} post={post}/>
                )))
            }
        </div>
    )
}