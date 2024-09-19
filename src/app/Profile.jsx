import PostCards from '@/components/Profile/PostCards';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { userImage,user,userBio ,followersCount,followingCount,posts} = useSelector((state) => state.users);

    return (
        <>
            <div className="flex flex-col items-center w-full justify-center gap-20  p-5 ">
                <div className="flex mt-10 items-center justify-center w-[60rem]">
                   
                    <div className="profilePicture border-[4px] mr-4 border-pink-500 rounded-full p-1">
                        <img
                            src={userImage}
                            className="rounded-full object-cover w-36 h-36"
                            alt="Profile"
                        />
                    </div>
                    
                  
                    <div className="ml-8 text-white">
                      
                        <div className="flex flex-col justify-center">
                            <h2 className="text-3xl font-bold mr-2">{user?.full_name}</h2>
                            <span className="text-gray-400">@{user?.username}</span>
                        </div>
                        
                     
                        <p className="mt-2 w-[45rem] text-gray-300">
                            {/* I love beauty and emotion. 📸 I’m passionate about photography and learning. 📚 I explore genres and styles. 🌈 I think photography is storytelling. 📖 I hope you like and feel my photos. 😊 */}

                           {userBio || ""} 
                        </p>

                     
                        <div className="flex items-center mt-4">
                          
                            <div className="flex space-x-8">
                                <div className="text-center">
                                    <span className="font-bold text-xl">162</span>
                                    <p className="text-gray-400">Posts</p>
                                </div>
                                <div className="text-center">
                                    <span className="font-bold text-xl">{followingCount}</span>
                                    <p className="text-gray-400">Following</p>
                                </div>
                                <div className="text-center">
                                    <span className="font-bold text-xl">{followersCount}</span>
                                    <p className="text-gray-400">Followers</p>
                                </div>
                            </div>

                          
                            <div className="ml-auto space-x-4">
                                <Link to="/settings" className="bg-pink-50 font-semibold text-pink-800 px-4 py-2 rounded-lg">Edit Profile</Link>
                                <button className="bg-pink-700  text-white px-4 py-2 rounded-lg">Message</button>
                                {/* <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">...</button> */}
                            </div>
                        </div>
                    </div>
            
                </div>
                <div className="h-[30rem] mt-10 w-[60rem] mx-auto">
                    <h1 className="text-3xl">Posts</h1>
                <div className="post-container flex w-full mt-7">
                    
                {!posts || posts.length === 0 ? (
                        <p className="text-foreground/70">No Posts available</p>
                    ) : (
                        posts?.map((post) => <PostCards  post={post} />)
                    )}
                </div>
                </div>

            </div>

            
        </>
    );
};

export default Profile;
