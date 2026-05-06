"use client"

import { CommentWithUser,PostDetails } from "@/lib/types";
import { useState } from "react";
import CommentForm from "../comments/CommentForm";
import CommentList from "../comments/CommentList";

interface props {
    post: PostDetails,
    initialComments : CommentWithUser[]
    postId : string
}
const PostDetails = ({initialComments,postId,post}:props) => {
    const [comments,setComments] = useState(initialComments)

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex flex-col gap-1 max-w-xl border-4">
            <p>{post.author.username}</p>
            <div>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <div className="flex flex-row gap-2">
                    <p>likes:{post._count.likes}</p>
                    <p>comments: {post._count.comments}</p>
                </div>
                <div className="flex flex-row gap-2" >
                    {
                        post.tags.map(t => (
                            <span key={t.tagId}>#{t.tag.name}</span>
                        ))
                    }
                </div>
            </div>
            </div>
           <CommentForm 
           postId={postId}
           setComments={setComments}
           /> 
           <CommentList
           comments={comments}
           /> 
        </div>
    );
}

export default PostDetails;
