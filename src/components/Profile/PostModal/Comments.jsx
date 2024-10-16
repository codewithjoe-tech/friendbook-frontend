import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getCookie, timeAgo } from '@/utils';
import { Input } from '@/components/ui/input';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const access = getCookie('accessToken');

  const fetchComments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/comments/${postId}`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.log('Error fetching comments');
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return; 

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments((prevComments) => [newCommentData, ...prevComments]);
        setNewComment(''); 
      } else {
        console.log('Error adding comment');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="w-1/2 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4" >
        {comments.length === 0 ? (
          <p className="text-center text-gray-500">No comments available.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="mb-4 border-b pb-2">
              <div className="flex items-center mb-2">
                <img
                  src={comment.user.profile_picture || 'https://via.placeholder.com/40'}
                  alt={comment.user.full_name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <p className="font-bold">{comment.user.full_name || 'Unknown User'}</p>
                <span className="text-sm text-gray-500 ml-2">{timeAgo(comment.created_at)}</span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center p-4 border-t">
        <Input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border rounded-lg p-2 mr-2"
        />
        <Button onClick={handleAddComment} className="bg-blue-700">Comment</Button>
      </div>
    </div>
  );
};

export default Comments;
