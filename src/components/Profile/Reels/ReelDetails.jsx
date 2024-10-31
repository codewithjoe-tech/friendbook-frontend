import ReportModal from '@/components/common/ReportModal'
import { Button } from '@/components/ui/button'
import { DialogDescription } from '@/components/ui/dialog'
import { showToast } from '@/redux/Slices/ToastSlice'
import { getCookie, timeAgo } from '@/utils'
import { TrashIcon } from 'lucide-react'
import { TriangleAlert } from 'lucide-react'
import { HeartIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

const ReelDetails = ({ reel, setReel, changeCurrentTab, onClose, reelDelete }) => {
  
  const access = getCookie('accessToken');
  const dispatch = useDispatch()
  const [reportReason, setReportReason] = useState('')
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportId, setReportId] = useState(null)

  const { user } = useSelector((state) => state.users)

  const submitReport = async () => {
    if (!reportReason.trim()) return;
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/report/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({
        content_type: "reels",
        object_id: reel.id,
        reason: reportReason
      }),
    });
    const res = await response.json();
    console.log(res)
    if (response.status == 201) {
      dispatch(showToast({
        message: 'Report submitted successfully',
        type: 's',
      }));
    } else {
      dispatch(showToast({
        message: 'Failed to submit report',
        type: 'e',
      }));
      setReportReason("");
    }
    handleReportModal();
    setReportReason("");
  }

  const handleReportModal = () => {
    setReportModalOpen((prev) => !prev);
    if (reportModalOpen) {
      setReportId(reel.id);
    }
  }

  const deleteReel = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/reel/delete/${reel.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (response.ok) {
      onClose();
      dispatch(showToast({
        message: 'Reel deleted successfully',
        type: 's',
      }));
      reelDelete(reel.id);
    } else {
      console.log('Error deleting reel');
    }
  }

  const handleReportValueChange = (e) => {
    setReportReason(e.target.value);
  }

  const handleLike = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/reel/like/${reel.id}`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      if (!response.ok) {
        console.log('Error liking reel');
      }
    } catch (error) {
      console.error('Failed to like the reel:', error);
    }
  }

  const toggleLike = () => {
    handleLike();
    setReel((prevReel) => ({
      ...prevReel,
      user_liked: !prevReel.user_liked,
      like_count: prevReel.user_liked ? prevReel.like_count - 1 : prevReel.like_count + 1,
    }));
  };

  return (
    <div className="w-1/2 flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-4">
          <img
            src={reel.profile?.profile_picture || 'https://via.placeholder.com/40'}
            alt={reel.profile?.full_name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-bold">{reel.profile?.full_name || 'Unknown User'}</p>
            <p className="text-sm text-gray-500">{timeAgo(reel.created_at)}</p>
          </div>
        </div>
        <p className="mb-4">{reel.content || 'No content available'}</p>
      </div>

      <div className="flex gap-3 items-center mt-4">
        <div className="flex items-center space-x-4">
          <p 
            className={`text-3xl ${reel.user_liked ? 'text-red-500' : ' text-gray-400'} m-0 p-0 cursor-pointer hover:text-red-500 flex items-center transition-colors focus:ring-0`}
            onClick={toggleLike}
          >
            {reel.user_liked ? (
              <HeartIcon className="w-5 h-5 text-red-500" fill='red' />
            ) : (
              <HeartIcon className="w-5 h-5 text-white" />
            )}
            <span className="text-lg text-foreground"> &nbsp; &nbsp;{reel.like_count} likes</span>
          </p>
        </div>

        {user?.username !== reel?.profile?.username &&
          <div className="text-sm cursor-pointer text-red-500 flex gap-2 items-center" onClick={handleReportModal}>
            <TriangleAlert />
          </div>
        }

        {user?.username === reel?.profile?.username &&
          <div className="text-lg cursor-pointer text-red-500" onClick={deleteReel}>
            <TrashIcon />
          </div>
        }

        <div className="text-lg cursor-pointer text-blue-500" onClick={changeCurrentTab}>
          {reel.comment_count} {reel.comment_count === 1 ? 'comment' : 'comments'}
        </div>
      </div>

      <ReportModal onClose={handleReportModal} open={reportModalOpen} handleReportValueChange={handleReportValueChange} submitReport={submitReport} reportReason={reportReason} />
    </div>
  )
}

export default ReelDetails;
