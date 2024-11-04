import React from 'react'
import { useEffect } from 'react';

const ReelsCard = ({reel , handleSetReelid}) => {
    useEffect(() => {
    }, [])
    
    return (
        <div
          className="max-w-md mx-3 bg-white flex rounded-xl shadow-md overflow-hidden md:max-w-2xl cursor-pointer mb-4"
          onClick={() => handleSetReelid(reel.id)}
        >
          <div className="md:flex">
            {reel?.video && (
              <div className="md:shrink-0">
                <video
                  className="h-48 w-full object-cover md:w-48 md:h-60"
                  src={reel.video}
               preload = "none"
                  alt="Reel"
                  poster={reel.thumbnail}
                />
              </div>
            )}
          </div>
        </div>
      );
    };


export default ReelsCard