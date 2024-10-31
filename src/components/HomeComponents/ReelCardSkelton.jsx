import React from 'react'

import { Skeleton } from "@/components/ui/skeleton"
const ReelCardSkelton = () => {
  return (
   <div className="max-w-md mx-auto border rounded-lg h-[500px] shadow-sm mt-6">
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

export default ReelCardSkelton