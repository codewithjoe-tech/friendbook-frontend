import React from 'react';

const PostCard = ({ post ,handleSetPostid }) => {
  // console.log(psot)
  return (
    <div className="max-w-md mx-3 bg-white h-72 flex rounded-xl shadow-md overflow-hidden md:max-w-2xl cursor-pointer mb-4" onClick={()=>handleSetPostid(post.id)}>
      <div className="md:flex ">
      {post?.image && (
  <div className="md:shrink-0">
    <img
      className="h-60 w-full object-cover md:w-48 md:h-full"
      src={post.image}
      alt="Post"
    />
  </div>
)}
   
      </div>
    </div>
  );
};

export default PostCard;
