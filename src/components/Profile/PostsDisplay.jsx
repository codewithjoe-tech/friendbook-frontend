import React from 'react';
import PostCards from '@/components/Profile/PostCards';
import ProfilePostSkelton from '../common/ProfilePostSkelton';

const PostsDisplay = ({ posts, handleSetPostid, loading }) => {
    return (
        <div className={posts.length < 5 ? "h-[40rem] mt-10 max-w-[90%] mx-auto" : "mt-10 max-w-[90%] mx-auto"}>
            <h1 className="text-3xl">Posts</h1>
            <div className="post-container grid grid-cols-3 sm:grid-cols-3 gap-3  md:grid-cols-4 mt-7">
                {loading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <ProfilePostSkelton key={index} />
                    ))
                ) : !posts || posts.length === 0 ? (
                    <p className="text-foreground/70 ">No Posts available</p>
                ) : (
                    posts.map((post, index) => (
                        <PostCards key={index} post={post} handleSetPostid={handleSetPostid} />
                    ))
                )}
            </div>
        </div>
    );
};

export default PostsDisplay;
