"use client"

import { UpdateUserSchema, UpdateUserInput } from "@/lib/validators/user";
import { useUser } from "@clerk/nextjs"
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client"
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface Props {
    user: User
}

export default function UpdateProfilePage({ user }: Props) {

    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<UpdateUserInput>({
        resolver: zodResolver(UpdateUserSchema),
        defaultValues: {
            username: user.username,
            bio: user.bio ?? ""
        }
    })


    const formSubmit = async (data: UpdateUserInput) => {
        try {
            const res = await fetch('/api/user/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            if (!res.ok) {
                const error = await res.json();
                console.error(error);
                return
            }
            router.refresh() ///**** */
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <form onSubmit={handleSubmit(formSubmit)}>
            <div className="flex flex-col gap-1.5 max-w-xl" >
                <div className=" flex flex-row gap-1.5">
                    <Label>UserName</Label>
                    <Input {...register("username")} placeholder="Pick an username" />
                    {errors.username && <p>{errors.username.message}</p>}
                </div>
                <div className=" flex flex-row gap-1.5 ">
                    <label>Bio</label>
                    <Textarea {...register("bio")} placeholder="tell us about yourself (optional)" />
                    {errors.bio && <p>{errors.bio.message}</p>}
                </div>
            </div>


            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Update"}
            </Button>
        </form>
    )
}

