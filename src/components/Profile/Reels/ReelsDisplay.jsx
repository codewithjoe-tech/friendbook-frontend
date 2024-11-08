import React from 'react';
import ReelsCard from './ReelsCard';

import ProfilePostSkeleton from '@/components/common/ProfilePostSkelton';

const ReelsDisplay = ({ reels, handleSetReelid, loading }) => {
  return (
    <div className={reels.length <5 ? "h-[40rem] mt-10 w-[60rem] mx-auto" : "mt-10 w-[60rem] mx-auto"}>
      <h1 className="text-3xl">Posts</h1>
      <div className="post-container flex w-full mt-7 flex-wrap">
        {loading ? (
          <div className="post-container flex w-full mt-7 flex-wrap">
            <ProfilePostSkeleton />
            <ProfilePostSkeleton />
            <ProfilePostSkeleton />
            <ProfilePostSkeleton />
            <ProfilePostSkeleton />
            <ProfilePostSkeleton />
            <ProfilePostSkeleton />
            <ProfilePostSkeleton />
          </div>
        ) : !reels || reels.length === 0 ? (
          <p className="text-foreground/70">No Posts available</p>
        ) : (
          reels.map((reel, index) => (
            <ReelsCard key={index} reel={reel} handleSetReelid={handleSetReelid} />
          ))
        )}
      </div>
    </div>
  );
};

export default ReelsDisplay;
