import z from "zod";

export const PostSchema = z.object({
    title: z
    .string()
    .min(3, "title must have at least 3 characters"),
    content: z
    .string()
    .min(10,"Post Content must have at least 10 cahracters")
    .max(300,"post content can't have more than 300 characters"),
    tags: z
    .array(
        z.string()
        .min(1,"Tag cannot be empty")
        .max(20,"Tag must be at least 20 characters")
        .regex(/^[a-zA-Z0-9]+$/, "Tag can only contain letters and numbers")
    )
    .min(1,"At least one tag needed")
    .max(3,"You can add at most 3 tags")
})

export type PostInput = z.infer<typeof PostSchema>