import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getCookie, timeAgo } from '@/utils';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null); 
  const [replyParent, setReplyParent] = useState(null);  
  const [visibleReplies, setVisibleReplies] = useState({});
  const [page, setPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [replyPages, setReplyPages] = useState({});
  const [hasMoreReplies, setHasMoreReplies] = useState({});
  const [commentUrl, setCommentUrl] = useState(`${import.meta.env.VITE_API_URL}/api/profile/comments/${postId}`)

  const access = getCookie('accessToken');

  const fetchComments = async () => {
    try {
      const response = await fetch(commentUrl, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setComments((prev) => [...prev, ...data.results]);
        setHasMoreComments(comments.length<data.count);
        if(data.next){
          setCommentUrl(data.next);
        }
      } else {
        console.log('Error fetching comments');
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const fetchReplies = async (commentId, pageNumber = 1) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/comments/reply/${commentId}?page=${pageNumber}`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? { ...comment, replies: [...(comment.replies || []), ...data.results] }
              : comment
          )
        );
        setHasMoreReplies((prev) => ({ ...prev, [commentId]: !!data.next }));
      } else {
        console.log('Error fetching replies');
      }
    } catch (error) {
      console.error('Failed to fetch replies:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleReply = (comment, isReplyToReply = false) => {
    setReplyTo(comment);
    if (isReplyToReply) {
      setReplyParent(comment);  
    } else {
      setReplyParent(null);  
    }
    setNewComment(`@${comment.user} `);
  };

  const cancelReply = () => {
    setReplyTo(null);
    setReplyParent(null);
    setNewComment('');
  };


  const handleAddComment = async () => {
    if (!newComment.trim()) return;


    if (replyTo) {
      if (replyParent) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === replyParent.id
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), optimisticComment],
                }
              : comment
          )
        );
      } else {
       
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === replyTo.id
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), optimisticComment],
                }
              : comment
          )
        );
      }
    } else {
    
      setComments((prevComments) => [optimisticComment, ...prevComments]);
    }

    setNewComment('');
    setReplyTo(null);
    setReplyParent(null);

    try {
      let endpoint = `${import.meta.env.VITE_API_URL}/api/profile/comments/${postId}`;
      let bodyContent = { content: newComment };

      if (replyTo) {
        if (replyParent) {
          endpoint = `${import.meta.env.VITE_API_URL}/api/profile/comments/reply-to-reply/${replyParent.id}`;
          bodyContent = { content: newComment, reply_parent: replyParent.id };
        } else {
          endpoint = `${import.meta.env.VITE_API_URL}/api/profile/comments/reply/${replyTo.id}`;
          bodyContent = { content: newComment };
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(bodyContent),
      });

      const newCommentData = await response.json();

      if (response.status === 201) {
       
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === optimisticComment.id ? newCommentData : comment
          )
        );
      } else {
        console.log('Error submitting comment');
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };


  const toggleReplies = (commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));

    if (!visibleReplies[commentId]) {
      fetchReplies(commentId);
    }
  };


  const loadMoreComments = () => {

    fetchComments();
  };

  const loadMoreReplies = (commentId) => {
    const nextPage = (replyPages[commentId] || 1) + 1;
    setReplyPages((prev) => ({ ...prev, [commentId]: nextPage }));
    fetchReplies(commentId, nextPage);
  };

  return (
    <div className="w-1/2 flex flex-col h-full">
      <ScrollArea className="flex-1 overflow-y-auto p-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500">No comments available.</p>
        ) : (
          comments.map((comment,index) => (
            <div key={`comment_${index}`} className="mb-4 border-b pb-2">
              <div className="flex items-start gap-3">
                <Avatar className="mt-3" size="sm">
                  <AvatarImage 
                    src={comment.profile_pic || 'https://via.placeholder.com/150'} 
                    alt={comment.user || 'User Avatar'} 
                  />
                  <AvatarFallback>{comment.user ? comment.user[0] : "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 py-3">
                  <div className="flex gap-3 items-center">
                    <p className="font-bold">{comment.user ? comment.user : 'Unknown User'}:</p>
                    <p>{comment.content || 'No content'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{timeAgo(comment.created_at)}</span>
                    {/* {comment.has_replies ? "True" : "False"} */}
                    {comment.has_replies ? (
                      <p
                        className="text-blue-500 text-xs cursor-pointer"
                        onClick={() => toggleReplies(comment.id)}
                      >
                        {visibleReplies[comment.id] ? 'Hide replies' : 'Show replies'}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">No replies</p>
                    )}
                    <p
                      onClick={() => handleReply(comment)}
                      className="text-blue-500 text-xs cursor-pointer"
                    >
                      Reply
                    </p>
                  </div>

                
                  {visibleReplies[comment.id] && comment.replies && (
                    <div className="ml-10 mt-2">
                      {comment.replies.map((reply,index) => (
                        <div key={`reply_${index}_${reply.id}`} className="mb-2">
                          <div className="flex items-start gap-2">
                            <Avatar className="mt-1" size="xs">
                              <AvatarImage 
                                src={reply.profile_pic || 'https://via.placeholder.com/150'} 
                                alt={reply.user || 'User Avatar'} 
                              />
                              <AvatarFallback>{reply.user ? reply.user[0] : "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex gap-2">
                                <p className="font-bold text-xs">{reply.user}:</p>
                                <p className="text-xs">{reply.content}</p>
                              </div>
                              <div className="flex gap-2 items-center">
                                <span className="text-xs text-gray-500">{timeAgo(reply.created_at)}</span>
                                <p
                                  onClick={() => handleReply(reply, true)}
                                  className="text-blue-500 text-xs cursor-pointer"
                                >
                                  Reply
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {hasMoreReplies[comment.id] && (
                        <Button
                          size="sm"
                          className="text-xs"
                          onClick={() => loadMoreReplies(comment.id)}
                        >
                          Load more replies
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {hasMoreComments && (
          <Button size="sm" className="w-full" onClick={loadMoreComments}>
            Load more comments
          </Button>
        )}
      </ScrollArea>

      {/* Comment input */}
      <div className="border-t border-gray-200 p-4 flex items-center gap-3">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={replyTo ? `Replying to @${replyTo.user}` : 'Add a comment...'}
          className="flex-1"
        />
        {replyTo && (
          <Button variant="ghost" onClick={cancelReply}>
            Cancel
          </Button>
        )}
        <Button onClick={handleAddComment}>Post</Button>
      </div>
    </div>
  );
};

export default Comments;

