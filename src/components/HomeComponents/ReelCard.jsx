import { Heart, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ReportModal from "../common/ReportModal";
import { TriangleAlert } from "lucide-react";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/Slices/ToastSlice";
import { getCookie, timeAgo } from "@/utils";
import ReelViewModal from "../Profile/Reels/ReelViewModal";

export default function ReelCard({ reel, setReels }) {
    const [open, setOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportId, setReportId] = useState(reel.id);
    const dispatch = useDispatch();
    const access = getCookie('accessToken');
    const videoRef = useRef(null);

    const onClose = () => {
        setOpen(!open);
    };

    const submitReport = async () => {
        if (!reportReason.trim()) return;
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/report/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access}`,
            },
            body: JSON.stringify({
                content_type: "reel",
                object_id: reel.id,
                reason: reportReason
            }),
        });
        const res = await response.json();
        if (response.status === 201) {
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
    };

    const handleReportModal = () => {
        setReportModalOpen((prev) => !prev);
        if (reportModalOpen) {
            setReportId(reel.id);
        }
    };

    const handleReportValueChange = (e) => {
        setReportReason(e.target.value);
    };

    const handleLike = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/reel/like/${reel.id}`, {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            });
        } catch (error) {
            console.error('Failed to like the reel:', error);
        }
    };

    const toggleLike = async () => {
        handleLike();
        setReels((prevReels) =>
            prevReels.map((r) =>
                r.id === reel.id
                    ? {
                          ...r,
                          user_liked: !r.user_liked,
                          like_count: r.user_liked ? r.like_count - 1 : r.like_count + 1,
                      }
                    : r
            )
        );
    };

    const handleVideoClick = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    videoRef.current.play();
                } else {
                    videoRef.current.pause();
                }
            });
        }, { threshold: 0.5 });

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    return (
        <Card className="max-w-md mx-auto border rounded-lg shadow-sm mt-5">
            <Link to={`/profile/${reel?.profile?.username}`}>
                <CardHeader className="flex px-4 pt-4 pb-2">
                    <div className="flex items-center gap-1">
                        <Avatar className="mr-3">
                            <AvatarImage src={reel?.profile?.profile_picture} alt="Profile Picture" />
                            <AvatarFallback>{reel?.profile?.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="mt-2">
                            <p>{reel?.profile?.full_name}</p>
                            <small>{timeAgo(reel?.created_at)} ago</small>
                        </div>
                    </div>
                </CardHeader>
            </Link>
            <CardContent className="px-4 py-2">
                <video ref={videoRef} className="w-full rounded-lg h-[600px] object-contain aspect-[9/16]" autoPlay loop onClick={handleVideoClick}>
                    <source src={reel?.video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </CardContent>
            <div className="flex px-4 items-center space-x-4 my-2 w-full">
                <div className="flex gap-2 items-center">
                    <p onClick={toggleLike} className="flex items-center text-red-500 cursor-pointer">
                        {reel?.user_liked ? <Heart fill="red" className="text-red-500" /> : <Heart />}
                    </p>
                    <p>{reel?.like_count}</p>
                </div>
                <div className="flex gap-2 items-center">
                    <p className="flex items-center cursor-pointer" onClick={onClose}>
                        <MessageCircle className="h-6 w-6" />
                    </p>
                    <p>{reel?.comment_count}</p>
                </div>
                <div className="flex gap-2 items-center">
                    <p className="flex items-center cursor-pointer" onClick={handleReportModal}>
                        <TriangleAlert className="h-6 w-6 text-red-500" />
                    </p>
                </div>
            </div>
            <ReelViewModal open={open} onClose={onClose} reelId={reel.id} />
            <ReportModal onClose={handleReportModal} open={reportModalOpen} handleReportValueChange={handleReportValueChange} submitReport={submitReport} reportReason={reportReason} />
        </Card>
    );
}
