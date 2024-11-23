import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    NotificationModalOpen : false,
}


const NotificationSlice = createSlice({
    name:"Notification",
    initialState,
    reducers : {
        NotiOpen : (state)=>{
            state.NotificationModalOpen = !state.NotificationModalOpen;
        },
        NotiClose : (state)=>{
            state.NotificationModalOpen = false
        }
    }
})


export default NotificationSlice.reducer
export const {NotiOpen,NotiClose}  = NotificationSlice.actions