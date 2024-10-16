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
import PostDetails from './PostModal/PostDetails';
import Comments from './PostModal/Comments';

const PostViewModal = ({ postid, open, onClose }) => {
  const [post, setPost] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1);
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

  const handleMouseEnter = () => {
    setZoomLevel(1.5); 
  };

  const handleMouseLeave = () => {
    setZoomLevel(1);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    const newZoomLevel = Math.max(1, zoomLevel + (e.deltaY < 0 ? zoomFactor : -zoomFactor));
    setZoomLevel(newZoomLevel);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader>
        <DialogClose />
      </DialogHeader>

      <DialogContent className="flex flex-col space-x-6 max-w-3xl mt-4 h-[550px]">
        <DialogTitle className="text-start font-bold">Post</DialogTitle>
        <div className="flex space-x-6 max-w-3xl h-[500px]">
          <div className="w-1/2 flex h-full" onWheel={handleWheel}>
            <img
              src={post.image || 'https://via.placeholder.com/400'}
              alt="Post"
              className="w-full h-auto object-contain rounded-md transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </div>

          {/* <PostDetails post={post} setPost={setPost} /> */}
          <Comments />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostViewModal;
