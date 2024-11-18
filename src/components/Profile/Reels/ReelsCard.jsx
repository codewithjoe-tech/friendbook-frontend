import React from 'react';

const ReelsCard = ({ reel, handleSetReelid }) => {
  return (
    <div
      className="max-w-md bg-white h-36 sm:h-72 flex rounded sm:rounded-xl shadow-md overflow-hidden sm:max-w-2xl cursor-pointer mb-4"
      onClick={() => handleSetReelid(reel.id)}
    >
      <div className="md:flex w-full h-full">
        {reel?.video && (
          <div className="md:shrink-0 w-32 sm:w-48 h-full">
            <video
              className="h-full w-full object-cover"
              src={reel.video}
              preload="none"
              poster={reel.thumbnail}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelsCard;
