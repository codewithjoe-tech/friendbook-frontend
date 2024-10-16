import { configureStore,applyMiddleware } from "@reduxjs/toolkit"
import toastReducer from "./Slices/ToastSlice"
import UserReducer from "./Slices/UserSlice/UserSlice"
import { thunk } from "redux-thunk"
import PostReducer from './Slices/PostSlice'


export default configureStore({
    reducer:{
        toast:toastReducer,
        users:UserReducer,
        post: PostReducer
    },
    middleware : ()=>[thunk]
})