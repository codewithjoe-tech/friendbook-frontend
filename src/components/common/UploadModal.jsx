import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { showToast } from "@/redux/Slices/ToastSlice";
import { setPost } from "@/redux/Slices/UserSlice/UserSlice";
import { getCookie } from "@/utils";
import { X } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const UploadModal = ({ isOpen, onClose }) => {
    const [hideLikes, setHideLikes] = useState(false);
    const [turnOffComments, setTurnOffComments] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [postContent, setPostContent] = useState("");
    const profileId = useSelector((state)=>state.users.profileId)
    const dispatch = useDispatch()

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('content', postContent);
        formData.append('hide_likes', hideLikes);
        formData.append('hide_comments', turnOffComments);
        formData.append('profile', profileId); 
        
        if (selectedImage) {
            formData.append('image', selectedImage);
        }
    
        const access = getCookie('accessToken');
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/upload/post/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access}`,
                },
                body: formData,
            });
    
            const res = await response.json();
            console.log(res)
            if (response.status === 201) { 
                console.log(res);
                dispatch(setPost(res))
                
                
                dispatch(showToast({ message: "Post uploaded successfully", type: "s" }));
                onClose()
            } else {
                const errorRes = await response.json();
                console.error(errorRes);
                
                
                dispatch(showToast({ message: `Failed to upload post: ${errorRes.detail || "Unknown error"}`, type: "e" }));
            }
        } catch (error) {
            console.error('Error:', error);
            
            
            dispatch(showToast({ message: "An error occurred while uploading the post", type: "e" }));
        }
    };
    

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl bg-muted/80 backdrop-blur-lg p-0">
                <DialogHeader>
                    <DialogTitle className="flex justify-between items-center p-3 bg-muted/80 sticky top-0 backdrop-filter">
                        Permission Photo
                        <button onClick={onClose} className="text-lg">
                            <X />
                        </button>
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit}>
                    <div className="flex">
                        <div className="w-1/2 p-4">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Upload Preview"
                                        className="rounded-lg w-full"
                                    />
                                    <button
                                        className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                                        onClick={handleRemoveImage}
                                    >
                                        <X />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-full border border-dashed border-foreground rounded-lg cursor-pointer">
                                    <span className="text-foreground">Click to upload image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            )}
                        </div>

                        <div className="w-1/2 p-4 space-y-4">
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

                    <div className="p-4 border-t border text-right">
                        <button
                            type="submit"
                            className="px-4 py-2 text-blue-600 rounded-md hover:bg-background transition"
                        >
                            Share
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UploadModal;
