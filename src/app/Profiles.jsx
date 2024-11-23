import { showToast } from '@/redux/Slices/ToastSlice';
import { followUserThunk } from '@/redux/thunks/getProfileThunk';
import { getCookie } from '@/utils';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PostViewModal from '@/components/Profile/PostViewModal';
import ReelViewModal from '@/components/Profile/Reels/ReelViewModal';
import FollowersFollowingModal from '@/components/Profile/FollowersFollowingModal';
import PostsDisplay from '@/components/Profile/PostsDisplay';
import ReelsDisplay from '@/components/Profile/Reels/ReelsDisplay';

const OtherProfile = () => {
    const access = getCookie("accessToken");
    const [userData, setUserData] = useState({
        user: null,
        userImage: null,
        userBio: null,
        is_following: null,
        followersCount: null,
        followingCount: null,
        posts_count: 0,
        isPrivate : null
    });

    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [reels, setReels] = useState([]);
    const [selectedTab, setSelectedTab] = useState('posts');
    const dispatch = useDispatch();
    const [OpenPostView, setOpenPostView] = useState(false);
    const [OpenReelView, setOpenReelView] = useState(false);
    const [PostId, setPostId] = useState('');
    const [ReelId, setReelId] = useState('');
    const [followPanelOpen, setFollowPanelOpen] = useState(false);
    const [url, setUrl] = useState('');
    const { posts: newPost, reels: newReel } = useSelector((state) => state.users);
    const [postLoading, setPostLoading] = useState(false)

    const followPanelOnChange = () => setFollowPanelOpen(!followPanelOpen);
    const handleOpenClose = () => setOpenPostView(!OpenPostView);
    const handleReelOpenClose = () => setOpenReelView(!OpenReelView);

    const handleSetPostid = (id) => {
        handleOpenClose();
        setPostId(id);
    };

    const handleSetReelid = (id) => {
        handleReelOpenClose();
        setReelId(id);
    };

    useEffect(() => {
        if (newPost) setPosts([newPost, ...posts]);
    }, [newPost]);

    useEffect(() => {
        if (newReel) setReels([newReel, ...reels]);
    }, [newReel]);

    const { id } = useParams();
    const { profileId, user } = useSelector((state) => state.users);

    const goToChat = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/chat-room/${id}`, {
            headers: { Authorization: `Bearer ${access}` }
        });
        const data = await response.json();
        if (response.ok) navigate(`/messages/${data.name}`);
    };

    const followUser = async () => {
        try {
            const data = await dispatch(followUserThunk(id)).unwrap();
            setUserData({
                ...userData,
                is_following: data.follow_status,
                followersCount: userData.is_following === 'n' ? userData.followersCount + 1 : userData.followersCount - 1
            });
            dispatch(showToast({ message: data.message, type: "s" }));
        } catch (error) {
            dispatch(showToast({ message: error.message, type: "e" }));
        }
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/get/${id}`, {
                    headers: { Authorization: `Bearer ${access}` }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                setUserData({
                    user: data.user,
                    userImage: data.profile_picture ? `${data.profile_picture}` : null,
                    userBio: data.bio,
                    is_following: data.is_following,
                    followersCount: data.followers_count,
                    followingCount: data.following_count,
                    posts_count: data.posts_count,
                    isPrivate : data.isPrivate
                });
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchUserDetails();
        
        
    }, [id]);

    const deletePost = (id) => setPosts(posts.filter((post) => post.id !== id));
    const deleteReel = (id) => setReels(reels.filter((reel) => reel.id !== id));

    const fetchPosts = async () => {
        if (userData.is_following !== 'f' && id !== user?.username && userData.isPrivate) return
        setPostLoading(true);

        if (!id || !access) {
            console.error("Missing required parameters");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/posts/${id}`, {
                headers: { Authorization: `Bearer ${access}` }
            });

            if (!response.ok) {
                console.error("Failed to fetch posts:", response.status, await response.text());
                return;
            }

            const res = await response.json();

            if (Array.isArray(res)) setPosts(res);
            else console.error("Unexpected response format:", res);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setPostLoading(false);
        }
    };

  
    

    const fetchReels = async () => {
        if (userData.is_following !== 'f' && id !== user.username) return
        setPostLoading(true)
        if (!id || !access) {
            console.error("Missing required parameters");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/reels/${id}`, {
                headers: { Authorization: `Bearer ${access}` }
            });

            if (!response.ok) {
                console.error("Failed to fetch reels:", response.status, await response.text());
                return;
            }

            const res = await response.json();

            if (Array.isArray(res)) setReels(res);
            else console.error("Unexpected response format:", res);
        } catch (error) {
            console.error("Error fetching reels:", error);
        } finally {
            setPostLoading(false)
        }
    };


    useEffect(() => {
        if (selectedTab === 'posts') fetchPosts();
        else fetchReels();
    }, [id, selectedTab , user , userData]);

    const handleFollowing = () => {
        setUrl(`${import.meta.env.VITE_API_URL}/api/profile/following/${id}`);
        followPanelOnChange();
    };

    const handleFollowers = () => {
        setUrl(`${import.meta.env.VITE_API_URL}/api/profile/followers/${id}`);
        followPanelOnChange();
    };

    return (
        <div className="flex flex-col  items-center w-full justify-center p-5 mt-10">
        <div className="flex flex-col lg:flex-row items-center  lg:justify-center w-full ">
           
            <div className="profilePicture border-[4px] w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36   mb-4 lg:mb-0 border-pink-500 rounded-full p-1">
                <img
                    src={userData.userImage || '/user.webp'}
                    className="rounded-full object-cover w-full h-full"
                    alt="Profile"
                />
            </div>
            
            <div className="flex flex-col lg:ml-8 w-full lg:w-auto items-center lg:items-start text-center lg:text-left">
                <div className="flex flex-col items-start justify-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mr-2">{userData?.user?.full_name || "No User Found"}</h2>
                    <span className="text-gray-400">@{userData?.user?.username || "No user"}</span>
                </div>
                <p className="mt-2 w-full lg:w-[45rem] text-gray-300">{userData?.userBio || ""}</p>
    
                {/* Stats Section */}
                <div className="flex items-center mt-4 w-full justify-center gap-3 lg:justify-start space-x-6">
                    <div className="text-center">
                        <span className="font-bold text-xl">{userData?.posts_count || 0}</span>
                        <p className="text-gray-400">Posts</p>
                    </div>
                    <div onClick={handleFollowing} className="text-center cursor-pointer">
                        <span className="font-bold text-xl">{userData.followingCount || 0}</span>
                        <p className="text-gray-400">Following</p>
                    </div>
                    <div className="text-center cursor-pointer" onClick={handleFollowers}>
                        <span className="font-bold text-xl">{userData.followersCount || 0}</span>
                        <p className="text-gray-400">Followers</p>
                    </div>
                </div>
    
                {/* Follow Button Section */}
                <div className="mt-6 lg:mt-0 w-full flex justify-center lg:justify-end space-x-4">
                    {id !== user?.username ? (
                        <>
                            {userData.user && (
                                <>
                                    <Button
                                        onClick={followUser}
                                        className="bg-pink-50 font-semibold text-pink-800 px-4 py-2 rounded-lg hover:bg-pink-100"
                                    >
                                        {userData?.is_following === 'f'
                                            ? "Unfollow"
                                            : userData?.is_following === 'r'
                                            ? "Requested"
                                            : "Follow"}
                                    </Button>
                                    {userData.is_following === 'f' && (
                                        <Button
                                            onClick={goToChat}
                                            className="bg-pink-700 text-white px-4 py-2 rounded-lg"
                                        >
                                            Message
                                        </Button>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <Link
                            to="/settings"
                            className="bg-pink-50 font-semibold text-pink-800 px-4 py-2 rounded-lg"
                        >
                            Edit Profile
                        </Link>
                    )}
                </div>
            </div>
        </div>
    
        {(userData.is_following === 'f' || id === user?.username || !userData.isPrivate) ? (
            <>
                <div className="flex justify-center mt-5 space-x-4  ">
                    <button
                        onClick={() => setSelectedTab("posts")}
                        className={`px-4 py-2 ${selectedTab === "posts" ? "text-pink-700 font-semibold" : "text-gray-500"}`}
                    >
                        Posts
                    </button>
                    <button
                        onClick={() => setSelectedTab("reels")}
                        className={`px-4 py-2 ${selectedTab === "reels" ? "text-pink-700 font-semibold" : "text-gray-500"}`}
                    >
                        Reels
                    </button>
                </div>
                {selectedTab === "posts" ? (
                    <PostsDisplay posts={posts} handleSetPostid={handleSetPostid} loading={postLoading} />
                ) : (
                    <ReelsDisplay reels={reels} handleSetReelid={handleSetReelid} loading={postLoading} />
                )}
                <PostViewModal open={OpenPostView} onClose={handleOpenClose} postid={PostId} postDelete={deletePost} />
                <ReelViewModal open={OpenReelView} onClose={handleReelOpenClose} reelId={ReelId} reelDelete={deleteReel} />
                <FollowersFollowingModal open={followPanelOpen} onClose={followPanelOnChange} url={url} />
            </>
        ) : (
            <div className="mt-10 h-[42rem] flex items-center justify-center">
                <p className="text-gray-500">Private Account</p>
            </div>
        )}
    </div>
    
    );
};

export default OtherProfile;
