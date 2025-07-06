import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getCookie, timeAgo } from '@/utils';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ReelViewModal from '../Profile/Reels/ReelViewModal';
import PostViewModal from '../Profile/PostViewModal';
import { CheckIcon, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { NotiClose, NotiOpen } from '@/redux/Slices/NotificationSlice';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const [notificationsData, setNotificationsData] = useState([]);
  const access = getCookie('accessToken');
  const location = useLocation();
  const [reelsModalOpen, setReelsModalOpen] = useState(false);
  const [reelId, setReelId] = useState(null);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [postId, setPostId] = useState(null);
  const [commentId, setCommentId] = useState(null);
  const [replyStatus, setReplyStatus] = useState(false);
  const [sectionTab, setSectionTab] = useState(null);
  const { NotificationModalOpen } = useSelector(state => state.notification);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const onClose = () => {
    if (NotificationModalOpen) {
      dispatch(NotiOpen()); 
    }
  };

  useEffect(() => {
    dispatch(NotiClose())
  }, [location]); 

  const fetchNotifications = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/get-notification`, {
      headers: { 'Authorization': 'Bearer ' + access },
    });
    const data = await response.json();
    if (response.ok) {
      setNotificationsData(data);
    }
  };

  useEffect(() => {
    if (NotificationModalOpen) {
      fetchNotifications();
    }
  }, [NotificationModalOpen]);

  const toggleModalWithId = (id, contentType, commentId, reply) => {
    if (contentType.startsWith('reel')) {
      setReelId(id);
    } else {
      setPostId(id);
    }
    if (commentId) {
      setCommentId(commentId);
      setSectionTab('comment');
      if (reply) {
        setReplyStatus(true);
      }
    }
  };

  const closeReelsModal = () => {
    setReelsModalOpen(false);
    setPostModalOpen(false);
    setReelId(null);
    setPostId(null);
    setSectionTab(null);
    setCommentId(null);
    setReplyStatus(false);
  };

  useEffect(() => {
    if (postId) {
      setPostModalOpen(true);
    }
  }, [postId]);

  useEffect(() => {
    if (reelId) {
      setReelsModalOpen(true);
    }
  }, [reelId]);

  const acceptReq = async (id, nid) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/follow-accept/${id}/${nid}`, {
      headers: { 'Authorization': 'Bearer ' + access },
    });
    if (response.ok) {
      setNotificationsData(
        notificationsData.map((notification) =>
          notification.object_id === id
            ? {
                ...notification,
                content: 'Follow request accepted',
                content_object: { ...notification.content_object, accepted: true },
              }
            : notification
        )
      );
    }
  };

  const rejectReq = async (id, nid) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/follow-accept/${id}/${nid}`, {
      headers: { 'Authorization': 'Bearer ' + access },
    });
    if (response.ok) {
      setNotificationsData(
        notificationsData.map((notification) =>
          notification.object_id === id
            ? {
                ...notification,
                content: 'Follow request rejected',
                content_object: { ...notification.content_object, accepted: true },
              }
            : notification
        )
      );
    }
  };

  return (
    <Sheet open={NotificationModalOpen} onOpenChange={onClose}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Notification</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-5 mt-8 h-[55rem] overflow-auto scrollbar-none mb-2">
          {notificationsData.length > 0 ? (
            notificationsData.map((item) =>
              ['reels', 'reellike', 'post', 'like', 'comment', 'reelcomment', 'follow'].includes(item.content_type) ? (
                <div
                  key={item.id}
                  className="flex w-full justify-between items-center px-2 py-3 rounded-sm hover:bg-muted/50 cursor-pointer"
                >
                  <Link to={`/profile/${item?.content_object?.username}`}>
                    <div className="flex gap-3 items-center">
                      <Avatar>
                        <AvatarImage
                          className="object-cover"
                          src={item?.content_object?.profile_picture}
                          alt={item.sender_username || 'User Avatar'}
                        />
                        <AvatarFallback>{item?.content_object?.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <p>
                        {item.content_type === 'reels' || item.content_type === 'post' ? (
                          <span className="font-semibold">Post </span>
                        ) : item.content_type === 'like' || item.content_type === 'reellike' ? (
                          <span className="font-semibold">Like </span>
                        ) : item.content_type === 'follow' ? (
                          <span className="font-semibold">
                            {item?.content_object?.accepted ? 'Follower' : 'Request'}{' '}
                          </span>
                        ) : (
                          <span className="font-semibold">Comment </span>
                        )}
                        : {item?.content}{' '}
                        {item.created_at && (
                          <span className="text-sm text-muted-foreground/80">
                            &nbsp; - &nbsp;{timeAgo(item?.created_at)}{' '}
                          </span>
                        )}
                      </p>
                    </div>
                  </Link>
                  {item?.content_type !== 'follow' && (
                    <img
                      onClick={() =>
                        toggleModalWithId(
                          item?.content_type?.startsWith('reel')
                            ? item?.content_object?.ReelId
                            : item?.content_object?.postId,
                          item?.content_type,
                          item?.content_object?.id,
                          item?.content_object?.reply
                        )
                      }
                      src={import.meta.env.VITE_API_URL + 
                        item?.content_type?.startsWith('reel')
                          ? item?.content_object?.thumbnail
                          : item?.content_object?.image
                      }
                      className="h-10 w-10 object-cover"
                      alt=""
                    />
                  )}
                  {item?.content_type === 'follow' && !item?.content_object?.accepted && (
                    <div className="flex gap-1">
                      <Button
                        onClick={() => acceptReq(item?.content_object?.id, item?.id)}
                        size="sm"
                        className="text-white 600 px-3 bg-blue-600 hover:bg-blue-700 py-2 rounded-sm"
                      >
                        <CheckIcon />
                      </Button>
                      <Button
                        onClick={() => rejectReq(item?.content_object?.id, item?.id)}
                        size="sm"
                        className="text-white 600 px-3 py-2 rounded-sm ml-3"
                      >
                        <X />
                      </Button>
                    </div>
                  )}
                </div>
              ) : null
            )
          ) : (
            <p className="text-center text-muted-foreground/60">No Notification found</p>
          )}
        </div>
      </SheetContent>
      <ReelViewModal
        open={reelsModalOpen}
        reelId={reelId}
        onClose={closeReelsModal}
        commentId={commentId}
        replyStatus={replyStatus}
        selectedTab={sectionTab}
      />
      <PostViewModal
        open={postModalOpen}
        postid={postId}
        onClose={closeReelsModal}
        commentId={commentId}
        replyStatus={replyStatus}
        selectedTab={sectionTab}
      />
    </Sheet>
  );
};

export default Notification;
