import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    postModalOpen : false,
}


const postSlice = createSlice({
    name:"create post",
    initialState,
    reducers : {
        setModalOpen : (state)=>{
            state.postModalOpen = !state.postModalOpen;
        }
    }
})


export default postSlice.reducer
export const {setModalOpen}  = postSlice.actions