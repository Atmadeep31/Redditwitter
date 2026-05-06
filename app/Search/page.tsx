import PostList from "@/components/post/PostList";
import { getUserbyClerk } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


export default async function SearchPage(
    {searchParams}
    :
    {searchParams: Promise<{query:string }>}
){
    const resolvedParams = await searchParams;
    const query = resolvedParams.query;

    const {userId} = await auth();
    if(!userId) return(
        <div>
            No userId found
        </div>
    );
    const user = await getUserbyClerk(userId);
    if(!user) return (
        <div>
            No user found
        </div>
    )
    const posts  = await prisma.post.findMany({
        where:{
            tags:{
                some:{
                    tag:{
                        name: query
                    }
                }
            }
        },
        include:{
          author: true,
          tags: {
            include : {tag:true}},
          _count:{
            select:{
              likes:true,
              comments:true
            }
          },
          likes: {
            where:{userId:user.id} // only the like of the current user
          },
          comments: true
        },
        orderBy: {
          likes: {
            _count: 'desc'
          }
        },
        take:20
      })
      if(posts.length === 0) return(
        <div>
            No posts found
        </div>
      )
    return(
        <div>
            <PostList posts={posts}/>
        </div>
    )

}