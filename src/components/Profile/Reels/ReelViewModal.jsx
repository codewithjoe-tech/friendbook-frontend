import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getCookie } from '@/utils';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Comments from '../PostModal/Comments';
import ReelDetails from './ReelDetails';
import ReelComments from './ReelComments';

const ReelViewModal = ({ reelId, open, onClose, selectedTab, commentId, replyStatus, reelDelete }) => {
  const [reel, setReel] = useState({});
  const tabs = useRef(['d', 'c']);
  const [currentTab, setCurrentTab] = useState(0);
  const access = getCookie('accessToken');

  useEffect(() => {
    if (selectedTab === 'comment') {
      setCurrentTab(1);
    } else {
      setCurrentTab(0);
    }
  }, [selectedTab]);

  const changeCurrentTab = () => {
    setCurrentTab((prev) => (prev === 1 ? 0 : 0));
  };

  const fetchReel = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/reel/${reelId}`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const res = await response.json();
      console.log(res)
      if (response.ok) {
        setReel(res);
      } else {
        console.log('Error fetching reel');
      }
    } catch (error) {
      console.error('Failed to fetch reel:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchReel();
    }
  }, [reelId, open]);
  const videoRef = useRef(null);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader>
        <DialogClose />
      </DialogHeader>
    <DialogDescription />
      <DialogContent className="flex flex-col space-x-6 max-w-3xl mt-4 h-[600px] select-none">
        <div className="flex gap-3 items-center">
          <Button onClick={changeCurrentTab}><ArrowLeft/></Button>
          <DialogTitle className="text-start font-bold">Reel</DialogTitle>
        </div>
        <div className="flex space-x-6 max-w-3xl h-[500px]">
          <div className="w-1/2 flex h-full">
            <video
            onClick={togglePlayPause}
            ref={videoRef}
              src={reel.video || 'https://via.placeholder.com/400.mp4'}
              alt="Reel"
             
              className="w-full h-auto object-contain rounded-md"
            />
          </div>
          { !reel.ai_reported ? (
            <>
              {
                tabs.current[currentTab] === 'd' ? (
                  <ReelDetails
                    reel={reel}
                    setReel={setReel}
                    changeCurrentTab={() => setCurrentTab((prev) => (prev === 0 ? 1 : 0))}
                    onClose={onClose}
                    reelDelete={reelDelete}
                  />
                ) : (
                  <ReelComments
                    reelId={reelId}
                    onClose={onClose}
                    replyStatus={replyStatus}
                    selectedComment={commentId}
                  />
                )
              }
            </>
          ) : (
            <p className="text-muted-foreground/40">Action unavailable due to reported reel</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReelViewModal;
