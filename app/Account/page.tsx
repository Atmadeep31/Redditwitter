import UpdateProfilePage from "@/components/UpdateProfileForm";
import { Button } from "@/components/ui/button";
import { getUserbyClerk } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function AccountPage() {
    const { userId } = await auth();
    if (!userId) redirect('/');
    const user = await getUserbyClerk(userId);
    if (!user) redirect('/')

    return (
        <div>
            <h1>Your Account</h1>
            <UpdateProfilePage
                user={user}
            />
            <footer>
                <SignOutButton>
                    <Button>
                        Log Out
                    </Button>
                </SignOutButton>
            </footer>
        </div>
    )

}
