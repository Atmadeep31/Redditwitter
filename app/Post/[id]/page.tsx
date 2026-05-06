
import PostDetails from "@/components/post/postDetails";
import { prisma } from "@/lib/prisma";

const  PostPage = async ({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params
    const post = await prisma.post.findUnique({
        where:{
            id:id
        },
        include:{
            author: true,
            tags: {include : {tag:true}},
            _count:{
              select:{
                likes:true,
                comments:true
              }
            },
            likes:true,
            comments: {
                include:{
                    user:true
                }
            }
          }
    })
    if(!post) return (
        <div>
            No post available
        </div>
    )
    // Send the user.id as well from here
    return (
        <div>
            <p>{post?.title}</p>
            <p></p>
            <PostDetails 
                post={post}
                initialComments={post.comments}
                postId={post.id}
            />
        </div>
    );
}

export default PostPage;