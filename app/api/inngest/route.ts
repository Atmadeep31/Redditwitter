import { commentNotification, creteBGPost, dummyFunction, likeNotification } from "@/inngest/function";
import { inngest } from "@/lib/inngest";
import { serve } from "inngest/next";

// The api point for inngest server to access it
export const {GET,POST,PUT} = serve({
    client: inngest,
    functions: [likeNotification,commentNotification,creteBGPost]
})