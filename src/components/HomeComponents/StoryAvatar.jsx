import React from 'react';

const StoryAvatar = ({ imgSrc, alt }) => {
  return (
    <div className="flex  items-center mb-10 pb-2 justify-center hover:scale-105  cursor-pointer">
      <div className="p-1 border-2 bg-red-800 border-red-400 rounded-full">
        <img 
          src={imgSrc} 
          alt={alt} 
          className="w-14 h-14 object-cover rounded-full" 
        />
      </div>
    </div>
  );
};

export default StoryAvatar;
