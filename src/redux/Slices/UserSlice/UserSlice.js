import { createSlice } from "@reduxjs/toolkit";
import { deleteCookie, getCookie, setCookie } from "@/utils";


const initialState = {
  isLoggedIn: true,
  user: null,
  accessToken : null,
  refreshToken: null,
  userImage : "/user.webp",
  userBio : null,
  privateAcc : false,
  showStatus : true,
  gender:null,
  profileId:null,
  followersCount:0,
  followingCount:0,
  posts:null
};


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      login: (state, action) => {
  
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        setCookie("accessToken", state.accessToken, { expires: 7 });
        setCookie("refreshToken", state.refreshToken, { expires:30});
        
      },
      logout: (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
      },
      updateUserImage: (state, action) => {
        state.userImage = action.payload ;
      },
      setProfile : (state, action) => {
        state.userBio = action.payload.bio || state.userBio;
        state.privateAcc = action.payload.isPrivate;
        state.showStatus = action.payload.show_status;
        state.gender = action.payload.gender;
        state.profileId = action.payload.id;
        state.followersCount = action.payload.followers_count;
        state.followingCount= action.payload.following_count
        state.posts = action.payload.posts
        // console.log(state,userBio,state.privateAcc,state.showStatus,state.gender)
      },

      setPost:(state,action)=>{
        state.posts = [action.payload,...state.posts]
      }
    },
   
})


export default userSlice.reducer
export const {login,logout,updateUserImage,setProfile,setPost} = userSlice.actions