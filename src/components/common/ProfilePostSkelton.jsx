import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePostSkeleton = () => {
    return (
        <div className="max-w-md mx-3 bg-white flex rounded-xl shadow-md overflow-hidden md:max-w-2xl cursor-pointer mb-4" onClick={()=>handleSetPostid(post.id)}>
        <div className="md:flex ">
      
    <div className="md:shrink-0">
     <Skeleton className={"w-52 h-72"} />
    </div>

     
        </div>
      </div>
    );
};

export default ProfilePostSkeleton;
