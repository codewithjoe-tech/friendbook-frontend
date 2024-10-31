import React from 'react'
import ReelsCard from './ReelsCard'

const ReelsDisplay = ({reels , handleSetPostid}) => {
  console.log(reels)
  return (
    <div className={reels.length===0 ? "h-[50rem] mt-10 w-[60rem] mx-auto":"mt-10 w-[60rem] mx-auto" }>
    <h1 className="text-3xl">Posts</h1>
    <div className="post-container flex w-full mt-7 flex-wrap">

        {!reels || reels.length === 0 ? (
            <p className="text-foreground/70">No Posts available</p>
        ) : (
          reels?.map((reel, index) => <ReelsCard key={index} reel={reel}  handleSetPostid={handleSetPostid}/>)
        )}
    </div>
</div>
  )
}

export default ReelsDisplay