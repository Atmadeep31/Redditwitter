"use client"

import { CommentWithUser } from "@/lib/types";

interface props{
    comments: CommentWithUser[]
}
const CommentList = ({comments}:props) => {
    console.log(`react snippet works!`);

    return (
        <div className="flex flex-col gap-1.5">
           {
            comments.map((comment)=>(
                <div key={comment.id} className="flex flex-row gap-2">
                    <p>{comment.user.username}</p>
                    <p className="border-2">{comment.content}</p>
                </div>
            ))
           }
        </div>
    );
}


export default CommentList;