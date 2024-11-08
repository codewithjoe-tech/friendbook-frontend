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
        }
    }
})


export default NotificationSlice.reducer
export const {NotiOpen}  = NotificationSlice.actions