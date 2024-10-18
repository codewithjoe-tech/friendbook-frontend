import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getCookie, timeAgo } from '@/utils';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from 'lucide-react';
import { EllipsisVerticalIcon } from 'lucide-react';
import { Trash2Icon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';




const Comments = ({ postId,onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null); 
  const [replyParent, setReplyParent] = useState(null);  
  const [visibleReplies, setVisibleReplies] = useState({});
  const {user} = useSelector((state)=>state.users)
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [replyPages, setReplyPages] = useState({});
  const [hasMoreReplies, setHasMoreReplies] = useState({});
  const [commentUrl, setCommentUrl] = useState(`${import.meta.env.VITE_API_URL}/api/profile/comments/${postId}?page=1`)


  const navigate = useNavigate()


  const access = getCookie('accessToken');
const fetchComments = async () => {
  try {
    const response = await fetch(commentUrl, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      if (commentUrl.endsWith('1')) {
        setComments(data.results);
        setHasMoreComments(data.results.length < data.count);
      } else {
        setComments((prev) => [...prev, ...data.results]);
        setHasMoreComments(prev => (prev.length + data.results.length) < data.count);
      }

      if (data.next) {
        setCommentUrl(data.next);
      }
    } else {
      console.log('Error fetching comments');
    }
  } catch (error) {
    console.error('Failed to fetch comments:', error);
  }
};

const handleDeleteComment = async(commentId , replyOfComment=false , parentComment=null) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (response.ok) {
      if(replyOfComment){
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === parentComment
             ? {...comment, replies: comment.replies.filter((reply) => reply.id!== commentId) }
              : comment
          )
        );
      } else {
        setComments(prevComments => prevComments.filter((comment) => comment.id!== commentId));
      }
    } else {
      console.log('Error deleting comment');
    }
  } catch (error) {
    console.error('Failed to delete comment:', error);
  }
}


  const fetchReplies = async (commentId, pageNumber = 1) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/comments/reply/${commentId}?page=${pageNumber}`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const data = await response.json();
      console.log(data)
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
    if (comments.length ===0) {

      fetchComments();
    }
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/comments/reply-to-reply/${replyParent?.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify({ content: newComment }),
        });
        const res = await response.json();
        console.log(res)
  
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === replyParent?.parent 
              ? {
                  ...comment,
                  replies: [res, ...(comment.replies || [])],
                }
              : comment
          )
        );
      } else {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/comments/reply/${replyTo?.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify({ content: newComment }),
        });
        const res = await response.json();
        console.log(res)
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === replyTo?.id 
              ? {
                  ...comment,
                  has_replies: true,
                  replies: [res, ...(comment.replies || [])],
                }
              : comment
          )
        );
      }
    } else {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      const res = await response.json();
      setComments((prevComments) => [res, ...prevComments]);
    }
  
    setNewComment('');
    setReplyTo(null);
    setReplyParent(null);
  };
  
  const toggleReplies = (commentId) => {

    const comment = comments.filter(comment => comment.id === commentId)[0]
    
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));

    if (!visibleReplies[commentId] && comment?.replies.length === 0) {
      fetchReplies(commentId);
    }
  };

function highlightMentions(content) {
    const mentionPattern = /(@\w+)/g;
    const parts = content.split(mentionPattern);

    return parts.map((part, index) => {
        if (mentionPattern.test(part)) {
            // If the part matches the mention pattern, render it as a clickable element
            return (
                <span
                    key={index}
                    onClick={() => {
                        const username = part.slice(1); // Remove '@' from mention
                        navigate(`/profile/${username}`);
                        onClose();
                    }}
                    className="text-blue-500 hover:cursor-pointer hover:text-blue-600"
                >
                    {part}
                </span>
            );
        }
        // If it's not a mention, render the part as normal text
        return <span key={index}>{part}</span>;
    });
}

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
                <Avatar className="mt-3 w-8 h-8 object-cover cursor-pointer" onClick = { ()=>{navigate(`/profile/${comment.user}`);onClose()}} size="sm">
                  <AvatarImage 
                    src={comment.profile_pic || 'https://via.placeholder.com/150'} 
                    alt={comment.user || 'User Avatar'} 
                  />
                  <AvatarFallback>{comment.user ? comment.user[0] : "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 py-3">
                  <div className="flex gap-3 items-center">
                    <p  onClick = { ()=>{navigate(`/profile/${comment.user}`);onClose()}}  className="font-bold cursor-pointer">{comment.user ? comment.user : 'Unknown User'}:</p>
                    
                    
                    <p
  className="text-sm"
  
>{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{timeAgo(comment.created_at)}</span>
                   
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
                    <DropdownMenu className='text-xs' >
  <DropdownMenuTrigger asChild >
    <EllipsisVerticalIcon className='h-3 cursor-pointer mt-1' />
  </DropdownMenuTrigger>
  <DropdownMenuContent className="bg-muted hover:bg-muted/90 active:bg-muted/90 ">
   
   
    <DropdownMenuItem onClick={()=>{handleDeleteComment(comment.id)}} className="text-red-500 text-xs cursor-pointer hover:text-red-600 " >
      <Trash2Icon className='h-3 ' />
      Delete</DropdownMenuItem>
    
  
  </DropdownMenuContent>
</DropdownMenu>
                  </div>

                
                  {visibleReplies[comment.id] && comment.replies && (
                    <div className=" mt-3">
                      {comment.replies.map((reply,index) => (
                        <div key={`reply_${index}_${reply.id}`} className="mb-2">
                          <div className="flex items-start gap-2 mt-4">
                            <Avatar className=" w-8 h-8 cursor-pointer" onClick = { ()=>{navigate(`/profile/${reply.user}`);onClose()}}  size="xs">
                              <AvatarImage 
                                src={reply.profile_pic || 'https://via.placeholder.com/150'} 
                                alt={reply.user || 'User Avatar'} 
                              />
                              <AvatarFallback>{reply.user ? reply.user[0] : "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex gap-2">
                                <p className="font-bold text-xs cursor-pointer" onClick = { ()=>{navigate(`/profile/${reply.user}`);onClose()}} >{reply.user}:</p>
                                
                                <p className="text-xs">
  {highlightMentions(reply.content)}
</p>

                              </div>
                              <div className="flex gap-2 items-center">
                                <span className="text-xs text-gray-500">{timeAgo(reply.created_at)}</span>
                                <p
                                  onClick={() => handleReply(reply, true)}
                                  className="text-blue-500 text-xs cursor-pointer"
                                >
                                  Reply
                                </p>

                                <DropdownMenu className='text-xs' >
  <DropdownMenuTrigger asChild >
    <EllipsisVerticalIcon className='h-3 cursor-pointer mt-1' />
  </DropdownMenuTrigger>
  <DropdownMenuContent className="bg-muted hover:bg-muted/90 active:bg-muted/90 ">
   
   
   { user.username === reply.username ? (<DropdownMenuItem onClick={()=>{handleDeleteComment(reply.id,true,reply.parent)}} className="text-red-500 text-xs cursor-pointer hover:text-red-600 " >
      <Trash2Icon className='h-3 ' />
      Delete</DropdownMenuItem>):(
        <DropdownMenuItem  className="text-red-500 text-xs cursor-pointer hover:text-red-600 " >
        <TriangleAlert className='h-3 ' />
        Report</DropdownMenuItem>
      )
    }
  
  </DropdownMenuContent>
</DropdownMenu>



                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {hasMoreReplies[comment.id] && (
                        <p
                          
                          className="text-xs text-blue-500 cursor-pointer"
                          onClick={() => loadMoreReplies(comment.id)}
                        >
                          Load more replies
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {hasMoreComments && (
          <p  className="w-full text-sm text-blue-500 cursor-pointer" onClick={loadMoreComments}>
            Load more comments
          </p>
        )}
      </ScrollArea>

      <div className="border-t border-gray-200 p-4 flex items-center gap-3">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={replyTo ? `Replying to @${replyTo.user}` : 'Add a comment...'}
          className="flex-1"
        />
        {replyTo && (
          <p className='text-blue-500 cursor-pointer' onClick={cancelReply}>
            Cancel
          </p>
        )}
        <Button onClick={handleAddComment}>Post</Button>
      </div>
    </div>
  );
};

export default Comments;

