import React from 'react'

import { Skeleton } from "@/components/ui/skeleton"
const PostCardSkelton = () => {
  return (
   <div  className="w-full max-w-sm sm:max-w-lg mx-auto border rounded-lg h-auto shadow-sm mt-5 px-4">
     <div className="flex flex-col space-y-3 px-5 py-4">
      <Skeleton className="h-[400px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
   </div>
  )
}

export default PostCardSkelton