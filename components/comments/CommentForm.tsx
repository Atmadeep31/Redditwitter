"use client"
import { CommentWithUser } from '@/lib/types'
import { CommentSchema,CommentInput } from '@/lib/validators/comment'
import { zodResolver } from '@hookform/resolvers/zod'
import {Dispatch,SetStateAction, useState} from 'react'
import { useForm } from 'react-hook-form'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'


interface props{
    postId: string
    setComments: Dispatch<SetStateAction<CommentWithUser[]>>
}

const CommentForm = ({postId,setComments}:props) => {
    const [input,setInput] = useState("")
    const {
        register,
        handleSubmit,
        formState:{errors,isSubmitting},
        reset
    } = useForm<CommentInput>({
        resolver: zodResolver(CommentSchema)
    })

    const formSubmit = async (data:CommentInput) => {
        try {
           // api call and use the result 
           setInput("")
           const res = await fetch(`/api/post/${postId}/comment`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
           })
           // check for rate limit
           if (res.status === 429) {
            const data = await res.json()
            // Show user friendly message
            console.error("Rate limited:", data.error)
            return
          }
           if (!res.ok) {
            console.error("Failed to create comment")
            return
          }
           const newComment = await res.json()
           setComments(prev => [...prev,newComment])
           reset() 
        } catch (error) {
            console.error(error);
            
        }
        
    }

    return (
        <form onSubmit={handleSubmit(formSubmit)}>
            <div className='flex flex-row gap-1.5 max-w-xl'>
                <Label>Comment</Label>
                <Textarea 
                {...register("content")} 
                placeholder='Write your comment'
                
                />
                {errors.content && <p>{errors.content.message}</p>}
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Comment"}
            </Button>
            </div>
        </form>
    );
}

export default CommentForm;


