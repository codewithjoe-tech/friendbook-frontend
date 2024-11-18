import { Heart, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";
import { useState } from "react";
import PostViewModal from "../Profile/PostViewModal";
import ReportModal from "../common/ReportModal";
import { TriangleAlert } from "lucide-react";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/Slices/ToastSlice";
import { getCookie, timeAgo } from "@/utils";

export default function PostCard({ post, setPosts }) {
  const [open, setOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportId, setReportId] = useState(post.id);
  const dispatch = useDispatch();
  const access = getCookie("accessToken");

  const onClose = () => {
    setOpen(!open);
  };

  const submitReport = async () => {
    if (!reportReason.trim()) return;
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/report/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({
        content_type: "post",
        object_id: post.id,
        reason: reportReason,
      }),
    });
    const res = await response.json();
    if (response.status === 201) {
      dispatch(
        showToast({
          message: "Report submitted successfully",
          type: "s",
        })
      );
    } else {
      dispatch(
        showToast({
          message: "Failed to submit report",
          type: "e",
        })
      );
    }
    handleReportModal();
    setReportReason("");
  };

  const handleReportModal = () => {
    setReportModalOpen((prev) => !prev);
    if (reportModalOpen) {
      setReportId(post.id);
    }
  };

  const handleReportValueChange = (e) => {
    setReportReason(e.target.value);
  };

  const handleLike = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/like/${post.id}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to like the post:", error);
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
<Card className="w-full max-w-sm sm:max-w-lg mx-auto border rounded-lg h-auto shadow-sm mt-5 px-4">
<Link to={`/profile/${post?.profile?.username}`}>
        <CardHeader className="flex px-4 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="mr-3">
              <AvatarImage
                src={post?.profile?.profile_picture}
                alt="Profile Picture"
              />
              <AvatarFallback>
                {post?.profile?.full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-base sm:text-lg">
                {post?.profile?.full_name}
              </p>
              <small className="text-gray-500">{timeAgo(post?.created_at)} ago</small>
            </div>
          </div>
        </CardHeader>
      </Link>
      <CardContent className="px-4 py-2">
        <p className="text-sm sm:text-base text-muted-foreground/70 mb-2">
          {post?.content}
        </p>
        <img
          src={post?.image}
          onDoubleClick={toggleLike}
          alt="Post content"
          className="w-full rounded-lg object-cover sm:object-contain h-64 sm:h-96"
        />
      </CardContent>
      <div className="flex px-4 items-center space-x-4 my-2 w-full">
        <div className="flex gap-2 items-center">
          <p
            onClick={toggleLike}
            className="flex items-center text-red-500 cursor-pointer"
          >
            {post?.user_liked ? (
              <Heart fill="red" className="text-red-500" />
            ) : (
              <Heart />
            )}
          </p>
          <p>{post?.like_count}</p>
        </div>
        <div className="flex gap-2 items-center cursor-pointer">
          <p className="flex items-center" onClick={onClose}>
            <MessageCircle className="h-6 w-6" />
          </p>
          <p>{post?.comment_count}</p>
        </div>
        <div className="flex gap-2 items-center">
          <p
            className="flex items-center cursor-pointer"
            onClick={handleReportModal}
          >
            <TriangleAlert className="h-6 w-6 text-red-500" />
          </p>
        </div>
      </div>
      <PostViewModal
        open={open}
        onClose={onClose}
        postid={post.id}
        selectedTab={"comment"}
      />
      <ReportModal
        onClose={handleReportModal}
        open={reportModalOpen}
        handleReportValueChange={handleReportValueChange}
        submitReport={submitReport}
        reportReason={reportReason}
      />
    </Card>
  );
}
