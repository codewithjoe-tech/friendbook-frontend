import { createAsyncThunk } from "@reduxjs/toolkit";
import { setProfile, updateUserImage } from "../Slices/UserSlice/UserSlice";
import { getCookie } from "@/utils";




export const profileThunk = createAsyncThunk(
    'profile/me',
    async (_, { dispatch, getState, rejectWithValue }) => {
        const access = getCookie('accessToken')
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/me`, {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            });
            const res = await response.json();
            console.log(res)
          
            if (!response.ok){
                
               
                throw new Error(res.message);
            }else{
                const {profile_picture,bio,gender,isPrivate,show_status,id,followers_count,following_count,posts}=res.profile
                // console.log("Working")
                // console.log(bio)
              
                if (profile_picture){

                    dispatch(updateUserImage(`${import.meta.env.VITE_API_URL}${profile_picture}` ));
                }else{
                    dispatch(updateUserImage('/user.webp'));
                }
                dispatch(setProfile({bio,gender,isPrivate,show_status,id,followers_count,following_count,posts}))
                
            }
        }catch (err) {

            rejectWithValue({message: err.message})
        }
    }
)


export const followUserThunk = createAsyncThunk(
    'profile/followUser',
    async (id, { rejectWithValue }) => {
        const accessToken = getCookie('accessToken');

        if (!accessToken) {
            return rejectWithValue("No access token found");
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/follow/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to follow user');
            }

            return { message: data.message }; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);