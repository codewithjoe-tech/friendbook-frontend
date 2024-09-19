import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { showToast } from '@/redux/Slices/ToastSlice';
import { setProfile, updateUserImage } from '@/redux/Slices/UserSlice/UserSlice';
import { getCookie } from '@/utils';
import { PlusCircleIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const Settings = () => {
    const { userImage, user, userBio, gender } = useSelector((state) => state.users);
    const [form, setForm] = useState({
        bio: userBio|| "" ,
        gender: gender 
    });

    useEffect(() => {
        setForm({
            bio: userBio || '',
            gender: gender || ''
        });
    }, [userBio, gender]);
    

    const maxBioLength = 200;
    const dispatch = useDispatch();

    const profilePicUpdate = async (profilePic) => {
        const access = getCookie('accessToken');
        const formData = new FormData();
        formData.append('profile_picture', profilePic);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/update/me`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${access}`,
                },
                body: formData,
            });
            const res = await response.json();
            if (!response.ok) {
                throw new Error(res.message);
            } else {
                dispatch(updateUserImage(`${res.profile_picture}`));
            }
        } catch (error) {
            dispatch(showToast({ message: error.message, type: "e" }));
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleSelectChange = (value) => {
        setForm(prevForm => ({ ...prevForm, gender: value }));
    };

    const handleProfileImageChange = async (e) => {
        const file = e.target.files[0];
        await profilePicUpdate(file);
    };

    const handleSubmit = async () => {
        const access = getCookie('accessToken');
        const formData = new FormData();
        formData.append('bio', form.bio);
        formData.append('gender', form.gender);
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/update/me`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${access}`,
                },
                body: formData,
            });
            const res = await response.json();
            if (!response.ok) {
                throw new Error(res.message);
            } else {
                dispatch(showToast({ message: 'Profile updated successfully', type: "s" }));
                dispatch(setProfile({
                    bio: res.bio,
                    gender: res.gender,
                    isPrivate: res.isPrivate,
                    show_status: res.show_status
                }));
            }
        } catch (error) {
            dispatch(showToast({ message: error.message, type: "e" }));
        }
    };
    

    return (
        <>
            <div className="w-[40rem] mx-auto flex flex-col mt-10">
                <h1 className="text-white text-4xl my-5">Settings</h1>
                <div className="flex flex-col items-center">
                    <div className="mt-6 rounded-lg p-6 w-[40rem] bg-muted/40">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <img
                                    src={userImage}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full border-[4px] object-cover border-pink-500"
                                />
                                <div className="absolute p-1 bottom-0 -right-2 flex items-center justify-center rounded-full bg-gray-700">
                                    <label className="rounded-full cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleProfileImageChange}
                                        />
                                        <PlusCircleIcon />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-white text-2xl font-bold">{user?.full_name}</h2>
                                <p className="text-gray-400">@{user?.username}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 rounded-lg p-6 w-[40rem] bg-muted/40">
                    <div className="p-6 rounded-lg space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-1">Bio</label>
                            <Textarea
                                placeholder="Enter your Bio"
                                value={form.bio}
                                onChange={handleChange}
                                className="w-full bg-muted"
                                name="bio"
                            />
                            <p className="text-gray-400 text-sm text-right">{form.bio.length}/{maxBioLength}</p>
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-1">Gender</label>
                            <Select onValueChange={handleSelectChange} value={form.gender} className="w-full">
                                <SelectTrigger className="w-full bg-muted">
                                    <SelectValue placeholder="Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-between mt-4">
                            <Button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2" onClick={handleSubmit}>Save</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;
