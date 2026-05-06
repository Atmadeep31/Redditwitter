"use client"
import { PostDetails } from "@/lib/types"
import { useState } from "react"
import { Button } from "../ui/button"
import Link from "next/link"
import { MessageCircle } from "lucide-react"

interface props {
    post: PostDetails
}

export default function PostCard({ post }: props) {
    const [isLiked, setIsLiked] = useState(post.likes.length > 0)
    const [likeCount, setLikeCount] = useState(post._count.likes);
    const toggleLike = async () => {
        setIsLiked((prev) => !prev)
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
        try {
            const res = await fetch(`/api/post/${post.id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            // check for rate limit
            if (res.status === 429) {
                const data = await res.json()
                // Show user friendly message
                console.error("Rate limited:", data.error)
                return
              }
            if (!res.ok) {
                setIsLiked((prev) => !prev)
                setLikeCount(prev => isLiked ? prev + 1 : prev - 1)
            }
        } catch (error) {
            setIsLiked((prev) => !prev)
            setLikeCount(prev => isLiked ? prev + 1 : prev - 1)
        }
    }
    return (
        <div className="flex flex-col gap-1 max-w-xl border-4">
            <p>{post.author.username}</p>
            <div>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <div className="flex flex-row gap-2">
                    
                </div>
                <div className="flex flex-row gap-2" >
                    {
                        post.tags.map(t => (
                            <span key={t.tagId}>#{t.tag.name}</span>
                        ))
                    }
                </div>
                <Button
                    onClick={toggleLike}
                    variant={'ghost'}
                >
                    {!isLiked ? ` 🤍` : `❤️`}
                    {likeCount}
                </Button>
                
                <Link href={`Post/${post.id}`}>
                <Button
                    variant={'outline'}
                >
                    <MessageCircle/>
                    <p>{post._count.comments}</p>
                </Button>
                </Link>
                
            </div>
        </div>
    )
}