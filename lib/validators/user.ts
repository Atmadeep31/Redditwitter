import z from "zod";

export const UpdateUserSchema = z.object ({
    username : z
    .string()
    .min(3,"USername must have at least 3 characters")
    .max(20,"USername must have at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"Username can only contain letters, numbers and underscores"),
    bio : z.string().max(160,"Bio must have at least 160 characters").optional()
})

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>