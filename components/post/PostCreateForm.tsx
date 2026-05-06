"use client"

import { PostSchema, PostInput } from "@/lib/validators/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

import { X } from "lucide-react";




interface Props {
    id: string
}

export default function CreatePost({ id }: Props) {
    const router = useRouter();
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("");
    const {
        register,
        handleSubmit,
        setValue, //to handle tags array
        formState: { errors, isSubmitting }
    } = useForm<PostInput>({
        resolver: zodResolver(PostSchema),
        defaultValues: {
            tags: []
        }
    })
    const addTag = () => {
        const trimmed = tagInput.trim().toLowerCase();

        if (!trimmed || tags.length >= 3 || tags.includes(trimmed)) return;
        const newTag = [...tags, trimmed];
        setTags(newTag);
        setValue("tags", newTag, { shouldValidate: true })
        // ↑ tells react-hook-form the tags field changed, trigger Zod
        setTagInput("");
    }

    const removeTag = (tagToRemove: string) => {
        const newTag = tags.filter(t => t != tagToRemove)
        setTags(newTag);
        setValue("tags", newTag, { shouldValidate: true })
    }


    const formSubmit = async (data: PostInput) => {
        
        try {
            
            const res = await fetch('/api/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            // check for rate limit
            if (res.status === 429) {
                const data = await res.json()
                // Show user friendly message
                console.error("Rate limited:", data.error)
                return;
              }
            if (!res.ok) {
                const error = await res.json();
                console.error(error);
                return;
            }
            router.push('/')
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="flex flex-col gap-1.5 max-w-xl">
            <form onSubmit={handleSubmit(formSubmit)}>
                <div className=" flex flex-row gap-1.5">
                    <Label>Title</Label>
                    <Input
                        {...register("title")}
                        placeholder="Enter Title"
                    />
                    {errors.title && <p>{errors.title.message}</p>}
                </div>
                <div className=" flex flex-row gap-1.5">
                    <Label>Content</Label>
                    <Textarea
                        {...register("content")}
                        placeholder="What's on your mind ??"
                    />
                    {errors.content && <p>{errors.content.message}</p>}
                </div>
                <div className="flex flex-col">
                    <div className=" flex flex-row gap-1.5" >
                        <Label>Tags</Label>
                        <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="add topic tags"
                            disabled={tags.length >= 3}
                        />
                        <Button
                            type="button"
                            onClick={addTag}
                            disabled={tags.length >= 3}
                        >
                            Add
                        </Button>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                        {tags.map(tag => (
                            <Badge key={tag} className="text-lg ">
                                #{tag}
                                <Button
                                    type="button"
                                    onClick={() => removeTag(tag)}>
                                    <X size={12} />
                                </Button>
                            </Badge>
                        ))}
                    </div>
                    {errors.tags && <p>{errors.tags.message}</p>}

                </div>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Posting..." : "Create Post"}
                </Button>
            </form>
        </div>
    )
}




