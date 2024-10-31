import React from 'react'
import PostCards from '@/components/Profile/PostCards';


const PostsDisplay = ({posts , handleSetPostid}) => {
  return (
    <div className={posts.length===0 ? "h-[50rem] mt-10 w-[60rem] mx-auto":"mt-10 w-[60rem] mx-auto" }>
    <h1 className="text-3xl">Posts</h1>
    <div className="post-container flex w-full mt-7 flex-wrap">

        {!posts || posts.length === 0 ? (
            <p className="text-foreground/70">No Posts available</p>
        ) : (
            posts?.map((post, index) => <PostCards key={index} post={post}  handleSetPostid={handleSetPostid}/>)
        )}
    </div>
</div>
  )
}

export default PostsDisplay