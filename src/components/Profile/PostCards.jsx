import React from 'react';

const PostCard = ({ post, handleSetPostid }) => {
  return (
    <div
      className="max-w-md bg-white h-36 sm:h-72 flex rounded sm:rounded-xl shadow-md overflow-hidden sm:max-w-2xl cursor-pointer mb-4"
      onClick={() => handleSetPostid(post.id)}
    >
      <div className="md:flex w-full h-full">
        {post?.image && (
          <div className="md:shrink-0 w-32 sm:w-48 h-full">
            <img
              className="h-full w-full object-cover"
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
