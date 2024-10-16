import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getCookie } from '@/utils';
import { HeartIcon } from 'lucide-react';
import { Button } from '../ui/button';

const PostViewModal = ({ postid, open, onClose }) => {
  const [post, setPost] = useState({});
  const access = getCookie('accessToken');

  const fetchPost = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/post/${postid}`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      if (response.ok) {
        const res = await response.json();
        setPost(res);
      } else {
        console.log('Error fetching post');
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPost();
    }
  }, [postid, open]);

  const handleLike = async ()=>{
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/like/${postid}`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
  
        if (response.ok) {
         
        } else {
          console.log('Error fetching post');
        }
      } catch (error) {
        console.error('Failed to like the post:', error);
      }
  }

  const toggleLike = async() => {

  handleLike();
    setPost((prevPost) => ({
      ...prevPost,
      user_liked: !prevPost.user_liked,
      like_count: prevPost.user_liked ? prevPost.like_count - 1 : prevPost.like_count + 1,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader>
        <DialogClose />
      </DialogHeader>

      <DialogTitle className="text-center text-2xl font-bold mt-4">
       Post
      </DialogTitle>

      <DialogContent className="flex space-x-6 max-w-3xl mt-4 h-[500px]">
        <div className="w-1/2 flex h-full ">
          <img
            src={post.image || 'https://via.placeholder.com/400'}
            alt="Post"
            className="w-full h-auto object-contain rounded-md"
          />
        </div>

        <div className="w-1/2 flex flex-col justify-between">
          <DialogDescription>
            <div className="flex items-center mb-4">
              <img
                src={post.profile?.profile_picture || 'https://via.placeholder.com/40'}
                alt={post.profile?.full_name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-bold">{post.profile?.full_name || 'Unknown User'}</p>
                <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
              </div>
            </div>
            <p className="mb-4">{post.content || 'No content available'}</p>
          </DialogDescription>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-4">
              <Button variant 
                className={`text-3xl ${post.user_liked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors focus:outline-none`}
                onClick={toggleLike}
              >
                {post.user_liked ? (
                    <HeartIcon className="w-5 h-5 text-red-500 " fill='red' />
                  ) : (<HeartIcon className="w-5 h-5 text-white" />
                ) }
              </Button>
              <span className="text-lg">{post.like_count} likes</span>
            </div>
            <div className="text-lg">
              {post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostViewModal;
