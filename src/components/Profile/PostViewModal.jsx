import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getCookie } from '@/utils';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import Comments from './PostModal/Comments';
import { useRef } from 'react';
import PostDetails from './PostModal/PostDetails';

const PostViewModal = ({ postid, open, onClose }) => {
  const [post, setPost] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const tabs = useRef(['d','c'])
  const [currentTab, setCurrentTab] = useState(0);
  const [isZoomEnabled, setIsZoomEnabled] = useState(false);
  const access = getCookie('accessToken');

  const changeCurrentTab = ()=>{
    setCurrentTab((prev) => (prev === 1? 0 : 0));
  }
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

  const handleDoubleTap = (e) => {
    e.preventDefault();
   
    setIsZoomEnabled((prev) => !prev);
    setZoomLevel((prevZoom) => (prevZoom === 1 ? 1.5 : 1));
  };

  const handleWheel = (e) => {
    if (isZoomEnabled) {
      e.preventDefault();
      const zoomFactor = 0.1;
      const newZoomLevel = Math.max(1, zoomLevel + (e.deltaY < 0 ? zoomFactor : -zoomFactor));
      setZoomLevel(newZoomLevel);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader>
        <DialogClose />
      </DialogHeader>

      <DialogContent className="flex flex-col space-x-6 max-w-3xl mt-4 h-[600px]">
        <div className='flex gap-3 items-center '>
          <Button onClick={changeCurrentTab}><ArrowLeft/></Button>
          <DialogTitle className="text-start font-bold">Post</DialogTitle>
        </div>
        <div className="flex space-x-6 max-w-3xl h-[500px]">
          <div 
            className="w-1/2 flex h-full" 
            onDoubleClick={handleDoubleTap} 
            onWheel={handleWheel} 
          >
            <img
              src={post.image || 'https://via.placeholder.com/400'}
              alt="Post"
              className="w-full h-auto object-contain rounded-md transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>

          {
            tabs.current[currentTab] === 'd' ?(
             <PostDetails post={post} setPost={setPost} changeCurrentTab={()=>{setCurrentTab((prev) => (prev === 0? 1 : 0));}}/>
            ):(
              <Comments postId={postid} /> 

            )
          }

         
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostViewModal;
