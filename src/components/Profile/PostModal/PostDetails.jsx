import { Button } from '@/components/ui/button'
import { DialogDescription } from '@/components/ui/dialog'
import { getCookie, timeAgo } from '@/utils'
import { HeartIcon } from 'lucide-react'
import React from 'react'

const PostDetails = ({post ,setPost,changeCurrentTab}) => {

  const access = getCookie('accessToken');
    const handleLike = async ()=>{
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/like/${post.id}`, {
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
    <div className="w-1/2 flex flex-col justify-between">
    <div >
      <div className="flex items-center mb-4">
        <img
          src={post.profile?.profile_picture || 'https://via.placeholder.com/40'}
          alt={post.profile?.full_name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-bold">{post.profile?.full_name || 'Unknown User'}</p>
          <p className="text-sm text-gray-500">{timeAgo(post.created_at)}</p>
        </div>
      </div>
      <p className="mb-4">{post.content || 'No content available'}</p>
    </div>

    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center space-x-4">
        <Button variant 
          className={`text-3xl ${post.user_liked ? 'text-red-500' : 'text-gray-400'} m-0 p-0 hover:text-red-500 transition-colors focus:ring-0`}
          onClick={toggleLike}
        >
          {post.user_liked ? (
              <HeartIcon className="w-5 h-5 text-red-500 " fill='red' />
            ) : (<HeartIcon className="w-5 h-5 text-white" />
          ) }
        <span className="text-lg text-foreground"> &nbsp; &nbsp;{post.like_count} likes</span>
        </Button>
      </div>
      <div className="text-lg cursor-pointer text-blue-500" onClick={changeCurrentTab}>
        {post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}
      </div>
    </div>
  </div>
  )
}

export default PostDetails