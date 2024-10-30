import { Heart, MessageCircle } from "lucide-react";
import { Card, CardContent,  CardHeader,  } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";
import { useState } from "react";
import PostViewModal from "../Profile/PostViewModal";
import ReportModal from "../common/ReportModal";
import { TriangleAlert } from "lucide-react";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/Slices/ToastSlice";
import { getCookie } from "@/utils";

export default function PostCard({ post, setPosts }) {
    const [open, setOpen] = useState(false)
    const [reportReason, setReportReason] = useState('')
    const [reportModalOpen, setReportModalOpen] = useState(false)
    const [reportId, setReportId] = useState(post.id)
    const dispatch = useDispatch()
    const access= getCookie('accessToken')
    const onClose = () => {
        setOpen(!open);
    }

    const submitReport = async()=>{

        if (!reportReason.trim()) return;
        const response  = await fetch(`${import.meta.env.VITE_API_URL}/api/report/`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify({
            content_type:"post",
            object_id : post.id,
            reason: reportReason
          }),
        })
        const res = await response.json()
        console.log(res)
        if(response.status==201) {
          dispatch(showToast({
            message: 'Report submitted successfully',
            type:'s',
          }))
          console.log("status is workintg")
          
        }else{
          dispatch(showToast({
            message: 'Failed to submit report',
            type:'e',
          }))
          setReportReason("")
        }
        handleReportModal()
        setReportReason("")
    
      }
      const handleReportModal = ()=>{
        setReportModalOpen((prev) =>!prev);
        if (reportModalOpen) {
          setReportId(post.id);
        }
      }

      const handleReportValueChange = (e) => {
        console.log(reportId)
        console.log(reportReason)
        setReportReason(e.target.value)
      }
    
    
  const handleLike = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/like/${post.id}`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
    } catch (error) {
      console.error('Failed to like the post:', error);
    }
  };

  const toggleLike = async () => {
    handleLike();
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === post.id
          ? {
              ...p,
              user_liked: !p.user_liked,
              like_count: p.user_liked ? p.like_count - 1 : p.like_count + 1,
            }
          : p
      )
    );
  };

  return (
    <Card className="max-w-md mx-auto border rounded-lg h-[550px] shadow-sm mt-5">
      <Link to={`/profile/${post?.profile?.username}`}>
        <CardHeader className="flex px-4 pt-4 pb-2">
          <div className="flex items-center gap-1">
            <Avatar className="mr-3">
              <AvatarImage src={post?.profile?.profile_picture} alt="Profile Picture" />
              <AvatarFallback>{post?.profile?.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mt-2">
              <p>{post?.profile?.full_name}</p>
              <small>2 hours ago</small>
            </div>
          </div>
        </CardHeader>
      </Link>
      <CardContent className="px-4 py-2">
        <p className="text-muted-foreground/70">{post?.content}</p>
        <img src={post?.image} alt="Post content" className="w-full rounded-lg object-contain h-96" />
      </CardContent>
      <div className="flex px-4 items-center space-x-4 my-2 w-full">
        <div className="flex gap-2 items-center">
          <p onClick={toggleLike} className="flex items-center text-red-500 cursor-pointer">
            {post?.user_liked ? <Heart fill="red" className="text-red-500" /> : <Heart />}
          </p>
          <p>{post?.like_count}</p>
        </div>
        <div className="flex gap-2 items-center">
          <p className="flex items-center cursor-pointer" onClick={onClose}>
            <MessageCircle className="h-6 w-6" />
          </p>
          <p>{post?.comment_count}</p>
        </div>

        <div className="flex gap-2 items-center">
          <p className="flex items-center cursor-pointer "onClick={handleReportModal}>
            <TriangleAlert className="h-6 w-6 text-red-500"  />
          </p>
          
        </div>
      </div>
      <PostViewModal open={open} onClose={onClose} postid={post.id} selectedTab={'comment'} />
    <ReportModal onClose={handleReportModal} open={reportModalOpen} handleReportValueChange={handleReportValueChange} submitReport={submitReport} reportReason={reportReason}/>

    </Card>
  );
}
