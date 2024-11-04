import React from 'react';
import PostCards from '@/components/Profile/PostCards';
import ProfilePostSkelton from '../common/ProfilePostSkelton';

const PostsDisplay = ({ posts, handleSetPostid, loading }) => {
    return (
        <div className={posts.length === 0 ? "h-[50rem] mt-10 w-[60rem] mx-auto" : "mt-10 w-[60rem] mx-auto"}>
            <h1 className="text-3xl">Posts</h1>
            <div className="post-container flex w-full mt-7 flex-wrap">
                {loading ? (
                    <div className="post-container flex w-full mt-7 flex-wrap">
                       <ProfilePostSkelton />
                       <ProfilePostSkelton />
                       <ProfilePostSkelton />
                       <ProfilePostSkelton />
                       <ProfilePostSkelton />
                       <ProfilePostSkelton />
                       <ProfilePostSkelton />
                       <ProfilePostSkelton />
                       
                    </div>
                ) : !posts || posts.length === 0 ? (
                    <p className="text-foreground/70">No Posts available</p>
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
