
import { showToast } from '@/redux/Slices/ToastSlice';
import { followUserThunk } from '@/redux/thunks/getProfileThunk';
import { getCookie } from '@/utils';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import PostCards from '@/components/Profile/PostCards';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { setPost } from '@/redux/Slices/UserSlice/UserSlice';
import PostViewModal from '@/components/Profile/PostViewModal';
import FollowersFollowingModal from '@/components/Profile/FollowersFollowingModal';

const OtherProfile = () => {
    const access = getCookie("accessToken");
    const [userData, setUserData] = useState({
        user: null,
        userImage: null,
        userBio: null,
        is_following: null,
        followersCount: null,
        followingCount: null,
        posts_count: 0

    });

    const [posts, setPosts] = useState([])
    const dispatch = useDispatch()
    const [OpenPostView, setOpenPostView] = useState(false)
    const [PostId, setPostId] = useState('')
    const [followPanelOpen, setFollowPanelOpen] = useState(false)
    const [url, setUrl] = useState('')


    const followPanelOnChange = () =>{
        setFollowPanelOpen(!followPanelOpen)
    }
    const handleOpenClose = ()=>{
        setOpenPostView(!OpenPostView)
    }

    const handleSetPostid = (id)=>{
        handleOpenClose()
        setPostId(id)

    }
    const { id } = useParams();
    const { profileId, user } = useSelector((state) => state.users)
    const followUser = async () => {
        try {

            const data = await dispatch(followUserThunk(id)).unwrap();

            setUserData({ ...userData, is_following: !userData.is_following, followersCount: userData?.is_following ? userData.followersCount - 1 : userData.followersCount + 1 })


            dispatch(showToast({ message: data.message, type: "s" }))

        } catch (error) {
            dispatch(showToast({ message: error.message, type: "e" }))
        }
    }
  
    useEffect(() => {


        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/get/${id}`, {
                    headers: {
                        Authorization: `Bearer ${access}`
                    }
                });

                const data = await response.json();
                console.log(data)

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                setUserData({
                    user: data.user,
                    userImage: data.profile_picture ? `${data.profile_picture}` : null,
                    userBio: data.bio,
                    is_following: data.is_following,
                    followersCount: data.followers_count,
                    followingCount: data.following_count,
                    posts_count: data.posts_count

                });
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();


    }, [id]);

  



    const fetchPosts = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/posts/${id}`, {
            headers: {
                Authorization: `Bearer ${access}`
            }
        });
        const res = await response.json()
        if (response.ok){
            setPosts(res)
        }
    }



    useEffect(() => {
      fetchPosts()
    }, [id])
    

    const handleFollowing = ()=>{
        setUrl(`${import.meta.env.VITE_API_URL}/api/profile/following/${id}`)
        followPanelOnChange()
    }
    const handleFollowers = ()=>{
        setUrl(`${import.meta.env.VITE_API_URL}/api/profile/followers/${id}`)
        followPanelOnChange()
    }


    return (
        <div className="flex flex-col items-center w-full justify-center p-5">
            <div className="flex mt-10 items-center justify-center w-[60rem]">
                <div className="profilePicture border-[4px] mr-4 border-pink-500 rounded-full p-1">
                    <img
                        src={userData.userImage || '/user.webp'}
                        className="rounded-full object-cover w-36 h-36"
                        alt="Profile"
                    />
                </div>

                <div className="ml-8 ">
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-bold mr-2">{userData?.user?.full_name}</h2>
                        <span className="text-gray-400">@{userData?.user?.username}</span>
                    </div>

                    <p className="mt-2 w-[45rem] text-gray-300">
                        {userData?.userBio || ""}
                    </p>

                    <div className="flex items-center mt-4">
                        <div className="flex space-x-8">
                            <div className="text-center">
                                <span className="font-bold text-xl">{userData?.posts_count || 0}</span>
                                <p className="text-gray-400">Posts</p>
                            </div>
                            <div onClick={handleFollowing} className="text-center cursor-pointer">
                                <span className="font-bold text-xl">{userData.followingCount || 0}</span>
                                <p className="text-gray-400">Following</p>
                            </div>
                            <div className="text-center cursor-pointer " onClick={handleFollowers}>
                                <span className="font-bold text-xl">{userData.followersCount || 0}</span>
                                <p className="text-gray-400">Followers</p>
                            </div>
                        </div>

                        <div className="ml-auto space-x-4">


                            {
                                (id!=user?.username) ?
                                (
                                    <>
                                        <Button onClick={followUser} className="bg-pink-50 font-semibold text-pink-800 px-4 py-2 rounded-lg">
                                            {userData?.is_following ? "UnFollow" : 'Follow'}
                                        </Button>
                                        <Button className="bg-pink-700 text-white px-4 py-2 rounded-lg">Message</Button>
                                    </>
                                ):(
                                    <Link to="/settings" className="bg-pink-50 font-semibold text-pink-800 px-4 py-2 rounded-lg" >Edit Profile</Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={posts.length===0 ? "h-[50rem] mt-10 w-[60rem] mx-auto":"mt-10 w-[60rem] mx-auto" }>
                <h1 className="text-3xl">Posts</h1>
                <div className="post-container flex w-full mt-7 flex-wrap">

                    {!posts || posts.length === 0 ? (
                        <p className="text-foreground/70">No Posts available</p>
                    ) : (
                        posts?.map((post, index) => <PostCards key={index} post={post}  handleSetPostid={handleSetPostid}/>)
                    )}
                </div>
            </div>
            <PostViewModal open={OpenPostView} onClose={handleOpenClose} postid={PostId}  />
            <FollowersFollowingModal open={followPanelOpen} onClose={followPanelOnChange} url={url}  />
        </div>
    );
};

export default OtherProfile;
