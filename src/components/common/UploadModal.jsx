import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { showToast } from "@/redux/Slices/ToastSlice";
import { setPost } from "@/redux/Slices/UserSlice/UserSlice";
import { getCookie } from "@/utils";
import { X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SmallSpinner from "./SmallSpinner";
import { useNavigate } from "react-router-dom";

const UploadModal = ({ isOpen, onClose }) => {
    const [hideLikes, setHideLikes] = useState(false);
    const [turnOffComments, setTurnOffComments] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [isVideo, setIsVideo] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [error, setError] = useState(null);
    const { profileId, user } = useSelector((state) => state.users);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const isVideoFile = file.type.startsWith("video/");
            if (isVideoFile) {
                const videoElement = document.createElement("video");
                videoElement.src = URL.createObjectURL(file);
                videoElement.onloadedmetadata = () => {
                    if (videoElement.duration > 20) {
                        setError("Video cannot exceed 20 seconds");
                        return;
                    }
                    setIsVideo(true);
                    setSelectedFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () => setFilePreview(reader.result);
                    reader.readAsDataURL(file);
                    setError(null);
                };
            } else {
                setIsVideo(false);
                setSelectedFile(file);
                const reader = new FileReader();
                reader.onloadend = () => setFilePreview(reader.result);
                reader.readAsDataURL(file);
                setError(null);
            }
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        setIsVideo(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("content", postContent);
        formData.append("hide_likes", hideLikes);
        formData.append("hide_comments", turnOffComments);
        formData.append("profile", profileId);
        if (selectedFile) formData.append(isVideo ? "video" : "image", selectedFile);
        const access = getCookie("accessToken");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/profile/upload/${isVideo ? "reel" : "post"}/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                    body: formData,
                }
            );
            const res = await response.json();
            if (response.status === 201) {
                dispatch(setPost(res));
                dispatch(showToast({ message: `${isVideo ? "Reel" : "Post"} uploaded successfully`, type: "s" }));
                onClose();
                navigate(`/profile/${user.username}`);
            } else {
                setError(`Failed to upload post: ${res.detail || "Unknown error"}`);
            }
        } catch (error) {
            setError("An error occurred while uploading the post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl bg-muted/80 backdrop-blur-lg p-0 max-h-svh overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex  justify-between items-center p-3 bg-muted/80 sticky top-0 backdrop-filter ">
                        Permission Photo
                        <button onClick={onClose} className="text-lg">
                            <X />
                        </button>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col sm:flex-row ">
                        <div className="w-full sm:w-1/2 p-4">
                            {filePreview ? (
                                <div className="relative">
                                    {isVideo ? (
                                        <video
                                            src={filePreview}
                                            controls
                                            className="rounded-lg w-full h-[400px] object-cover"
                                            style={{ aspectRatio: "9/16" }}
                                        ></video>
                                    ) : (
                                        <img src={filePreview} alt="Upload Preview" className="rounded-lg w-full" />
                                    )}
                                    <button
                                        className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                                        onClick={handleRemoveFile}
                                    >
                                        <X />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-full border border-dashed border-foreground rounded-lg cursor-pointer">
                                    <span className="text-foreground">Click to upload image or video</span>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                </label>
                            )}
                        </div>

                        <div className="sm:w-1/2 p-4 space-y-4">
                            <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder="What is going on.."
                                className="w-full p-2 border bg-muted focus:outline-none rounded-md"
                                rows={8}
                            ></textarea>

                            <div className="space-y-3">
                                <div className="font-semibold text-sm">Advanced settings</div>

                                <div className="flex justify-between items-center">
                                    <label className="text-sm text-foreground">Hide like and view counts on this post</label>
                                    <Switch checked={hideLikes} onCheckedChange={setHideLikes} />
                                </div>

                                <p className="text-xs text-foreground/70">
                                    Only you will see the total number of likes and views on this post.
                                    You can change this later.
                                </p>

                                <div className="flex justify-between items-center">
                                    <label className="text-sm text-foreground">Turn off commenting</label>
                                    <Switch checked={turnOffComments} onCheckedChange={setTurnOffComments} />
                                </div>

                                <p className="text-xs text-foreground/70">
                                    You can change this later by going to the menu at the top of your post.
                                </p>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 text-red-600 bg-red-100 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="p-4 border-t border text-right">
                        <button
                            type="submit"
                            disabled={loading || !selectedFile}
                            className="px-4 py-2 text-blue-600 rounded-md hover:bg-background transition"
                        >
                            {loading ? (
                                <>
                                    <SmallSpinner size="sm" />
                                </>
                            ) : "Share"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UploadModal;
