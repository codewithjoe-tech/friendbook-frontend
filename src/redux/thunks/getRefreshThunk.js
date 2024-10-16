import { getCookie } from "@/utils";
import { login, logout } from "../Slices/UserSlice/UserSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";





export const refreshThunk = createAsyncThunk(
    'auth/refresh',
    async (_, { dispatch,getState,rejectWithValue }) => {
        
        const refreshToken = getCookie('refreshToken');
        if (!refreshToken){

            dispatch(logout())
            return rejectWithValue("No refresh token found")
        }
        
        try {
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                   
                },
                body: JSON.stringify({
                   refresh:refreshToken
                }),
            })
           
            if (!response.ok){
                throw new Error("Refresh token invalid or expired")

            }
            
            const data = await response.json()
            if (data.access && data.refresh && data.user){
                dispatch(login({
                    user: data.user,
                    access: data.access,
                    refresh: data.refresh,
                }))
               
            
                return data;
            }else{
                dispatch(logout());
                return rejectWithValue("Invalid response")
            }
            
        } catch (error) {
          
            dispatch(logout());
            return rejectWithValue(error.message)
        }


    }

)

