import { configureStore,applyMiddleware } from "@reduxjs/toolkit"
import toastReducer from "./Slices/ToastSlice"
import UserReducer from "./Slices/UserSlice/UserSlice"
import { thunk } from "redux-thunk"
import PostReducer from './Slices/PostSlice'
import CallReducer from "./Slices/CallSlice"


export default configureStore({
    reducer:{
        toast:toastReducer,
        users:UserReducer,
        post: PostReducer,
        call:CallReducer
    },
    middleware : ()=>[thunk]
})