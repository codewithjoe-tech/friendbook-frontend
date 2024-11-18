import React from 'react';
import ReelsCard from './ReelsCard';
import ProfilePostSkeleton from '@/components/common/ProfilePostSkelton';

const ReelsDisplay = ({ reels, handleSetReelid, loading }) => {
  return (
    <div className={reels.length < 5 ? "h-[40rem] mt-10 max-w-[90%] mx-auto" : "mt-10 max-w-[90%] mx-auto"}>
      <h1 className="text-3xl">Reels</h1>
      <div className="reels-container grid grid-cols-3 sm:grid-cols-3 gap-3 md:grid-cols-4 mt-7">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <ProfilePostSkeleton key={index} />
          ))
        ) : !reels || reels.length === 0 ? (
          <p className="text-foreground/70">No Reels available</p>
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
