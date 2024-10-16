import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    toast : false,
    message:"",
    type:""
}


const toastSlice = createSlice({
    name:"toast",
    initialState,
    reducers : {
        showToast : (state,action) => {
            state.toast = true;
           
            state.message = action.payload.message;
            state.type = action.payload.type;
            console.log("working")
         
        },
        hideToast : (state) => {
            state.toast = false;
        }
    }
})


export default toastSlice.reducer
export const {showToast,hideToast}  = toastSlice.actions