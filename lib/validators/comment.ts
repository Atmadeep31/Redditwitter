import z from "zod";

export const CommentSchema = z.object({
    content:z
    .string()
    .min(1,"Comment can not be empty")
    .max(300, "Comment can not have more than 300 characters")

})

export type CommentInput = z.infer<typeof CommentSchema>